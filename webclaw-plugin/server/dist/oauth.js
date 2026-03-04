import { randomUUID, createHash } from "crypto";
// --- Configuration ---
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Ov23liVAuXEu16DSB7bd";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
// --- Map size limits (DoS protection) ---
const MAX_CLIENTS = 1000;
const MAX_PENDING_AUTHS = 500;
const MAX_ISSUED_CODES = 500;
const MAX_TOKEN_CACHE = 2000;
// --- Helpers ---
function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
// --- In-memory clients store (DCR) ---
class InMemoryClientsStore {
    clients = new Map();
    get size() {
        return this.clients.size;
    }
    async getClient(clientId) {
        return this.clients.get(clientId);
    }
    async registerClient(client) {
        if (this.clients.size >= MAX_CLIENTS) {
            throw new Error("Too many registered clients");
        }
        const full = {
            ...client,
            client_id: `webclaw-${randomUUID()}`,
            client_id_issued_at: Math.floor(Date.now() / 1000),
        };
        this.clients.set(full.client_id, full);
        return full;
    }
}
// --- GitHub OAuth Provider ---
export class GitHubOAuthProvider {
    _clientsStore = new InMemoryClientsStore();
    pendingAuths = new Map();
    issuedCodes = new Map();
    tokenCache = new Map();
    cleanupTimer;
    constructor() {
        if (!GITHUB_CLIENT_SECRET) {
            console.warn("[oauth] WARNING: GITHUB_CLIENT_SECRET is not set. " +
                "OAuth token exchange with GitHub will fail. " +
                "Set it in your environment variables.");
        }
        // Periodic cleanup every 60s
        this.cleanupTimer = setInterval(() => this.cleanup(), 60_000);
        this.cleanupTimer.unref();
    }
    get clientsStore() {
        return this._clientsStore;
    }
    // --- authorize: redirect user to GitHub ---
    async authorize(client, params, res) {
        // Validate redirectUri against registered client URIs
        const registeredUris = (client.redirect_uris || []).map((u) => String(u));
        if (!registeredUris.includes(params.redirectUri)) {
            res.status(400).json({ error: "redirect_uri does not match registered URIs" });
            return;
        }
        if (this.pendingAuths.size >= MAX_PENDING_AUTHS) {
            res.status(503).json({ error: "Server busy, try again later" });
            return;
        }
        const ourState = randomUUID();
        this.pendingAuths.set(ourState, {
            clientId: client.client_id,
            clientRedirectUri: params.redirectUri,
            codeChallenge: params.codeChallenge,
            clientState: params.state,
            createdAt: Date.now(),
        });
        const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
        githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
        githubAuthUrl.searchParams.set("redirect_uri", `${SERVER_URL}/github/callback`);
        githubAuthUrl.searchParams.set("state", ourState);
        githubAuthUrl.searchParams.set("scope", "repo");
        res.redirect(githubAuthUrl.toString());
    }
    // --- GitHub callback handler (custom route, not part of OAuthServerProvider) ---
    async handleGitHubCallback(code, state, res) {
        const pending = this.pendingAuths.get(state);
        if (!pending) {
            res.status(400).json({ error: "Invalid or expired authorization request" });
            return;
        }
        this.pendingAuths.delete(state);
        // Exchange code with GitHub using client_secret
        let tokenRes;
        try {
            tokenRes = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: GITHUB_CLIENT_ID,
                    client_secret: GITHUB_CLIENT_SECRET,
                    code,
                }),
            });
        }
        catch {
            res.status(502).json({ error: "Failed to contact GitHub" });
            return;
        }
        if (!tokenRes.ok) {
            res.status(502).json({ error: "GitHub token exchange failed" });
            return;
        }
        const tokenData = (await tokenRes.json());
        if (tokenData.error) {
            // Sanitize: don't forward raw GitHub error details to client
            console.error(`[oauth] GitHub token error: ${tokenData.error} — ${tokenData.error_description || ""}`);
            res.status(400).json({ error: "Authorization failed" });
            return;
        }
        if (this.issuedCodes.size >= MAX_ISSUED_CODES) {
            res.status(503).json({ error: "Server busy, try again later" });
            return;
        }
        // Issue our own authorization code
        const ourCode = randomUUID();
        this.issuedCodes.set(ourCode, {
            githubToken: tokenData.access_token,
            codeChallenge: pending.codeChallenge,
            clientId: pending.clientId,
            createdAt: Date.now(),
        });
        // Redirect back to the MCP client's callback
        const redirectUrl = new URL(pending.clientRedirectUri);
        redirectUrl.searchParams.set("code", ourCode);
        if (pending.clientState) {
            redirectUrl.searchParams.set("state", pending.clientState);
        }
        res.redirect(redirectUrl.toString());
    }
    // --- PKCE: return the stored code challenge for SDK validation ---
    async challengeForAuthorizationCode(client, authorizationCode) {
        const issued = this.issuedCodes.get(authorizationCode);
        if (!issued) {
            throw new Error("Unknown authorization code");
        }
        // Verify the code was issued to THIS client
        if (issued.clientId !== client.client_id) {
            throw new Error("Authorization code was not issued to this client");
        }
        return issued.codeChallenge;
    }
    // --- Token exchange: return the GitHub token ---
    async exchangeAuthorizationCode(client, authorizationCode) {
        const issued = this.issuedCodes.get(authorizationCode);
        if (!issued) {
            throw new Error("Unknown or expired authorization code");
        }
        // Verify the code was issued to THIS client
        if (issued.clientId !== client.client_id) {
            throw new Error("Authorization code was not issued to this client");
        }
        this.issuedCodes.delete(authorizationCode);
        return {
            access_token: issued.githubToken,
            token_type: "Bearer",
        };
    }
    // --- Refresh token: GitHub tokens don't expire, not supported ---
    async exchangeRefreshToken() {
        throw new Error("Refresh tokens are not supported");
    }
    // --- Verify access token: call GitHub API with 5-min cache ---
    async verifyAccessToken(token) {
        const tokenHash = hashToken(token);
        const cached = this.tokenCache.get(tokenHash);
        if (cached && Date.now() < cached.expiresAt) {
            return cached.authInfo;
        }
        let apiRes;
        try {
            apiRes = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github+json",
                },
            });
        }
        catch {
            throw new Error("Failed to verify token with GitHub");
        }
        if (!apiRes.ok) {
            throw new Error("Invalid GitHub token");
        }
        const user = (await apiRes.json());
        // expiresAt is REQUIRED by the MCP SDK bearerAuth middleware.
        // GitHub tokens don't expire, so we set it to match our cache TTL (5 min).
        // The token will be re-verified with GitHub after cache expiry.
        const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;
        const authInfo = {
            token,
            clientId: "github",
            scopes: ["repo"],
            expiresAt,
            extra: { login: user.login, userId: user.id },
        };
        // Cache keyed by hash (not raw token) for 5 minutes
        if (this.tokenCache.size < MAX_TOKEN_CACHE) {
            this.tokenCache.set(tokenHash, {
                authInfo,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });
        }
        return authInfo;
    }
    // --- Cleanup expired entries ---
    cleanup() {
        const now = Date.now();
        const TEN_MINUTES = 10 * 60 * 1000;
        const FIVE_MINUTES = 5 * 60 * 1000;
        for (const [key, val] of this.pendingAuths) {
            if (now - val.createdAt > TEN_MINUTES)
                this.pendingAuths.delete(key);
        }
        for (const [key, val] of this.issuedCodes) {
            if (now - val.createdAt > FIVE_MINUTES)
                this.issuedCodes.delete(key);
        }
        for (const [key, val] of this.tokenCache) {
            if (now > val.expiresAt)
                this.tokenCache.delete(key);
        }
    }
    dispose() {
        clearInterval(this.cleanupTimer);
    }
}
