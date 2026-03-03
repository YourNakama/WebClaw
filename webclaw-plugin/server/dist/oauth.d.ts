import type { Response } from "express";
import type { OAuthServerProvider, AuthorizationParams } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { OAuthClientInformationFull, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
export declare class GitHubOAuthProvider implements OAuthServerProvider {
    private _clientsStore;
    private pendingAuths;
    private issuedCodes;
    private tokenCache;
    private cleanupTimer;
    constructor();
    get clientsStore(): OAuthRegisteredClientsStore;
    authorize(client: OAuthClientInformationFull, params: AuthorizationParams, res: Response): Promise<void>;
    handleGitHubCallback(code: string, state: string, res: Response): Promise<void>;
    challengeForAuthorizationCode(client: OAuthClientInformationFull, authorizationCode: string): Promise<string>;
    exchangeAuthorizationCode(client: OAuthClientInformationFull, authorizationCode: string): Promise<OAuthTokens>;
    exchangeRefreshToken(): Promise<OAuthTokens>;
    verifyAccessToken(token: string): Promise<AuthInfo>;
    private cleanup;
    dispose(): void;
}
