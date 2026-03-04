import { spawn } from "child_process";
// Public OAuth Client ID — safe to embed in source code.
// This is NOT a secret. The Device Flow doesn't use a client_secret.
// Same pattern as GitHub's own CLI (`gh`): the client_id is a public
// identifier that tells GitHub which app is requesting access.
// Security is ensured by the user explicitly authorizing in their browser,
// not by hiding this value. See: https://github.com/cli/oauth/issues/1
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Ov23ctlK0eSRxyelzeNs";
export async function requestDeviceCode() {
    const res = await fetch("https://github.com/login/device/code", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            scope: "repo",
        }),
    });
    if (!res.ok) {
        throw new Error(`GitHub Device Code request failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json());
}
export async function pollForAccessToken(deviceCode, interval, expiresIn, signal) {
    const deadline = Date.now() + expiresIn * 1000;
    let pollInterval = interval;
    while (Date.now() < deadline) {
        if (signal?.aborted) {
            throw new Error("Authentication cancelled");
        }
        await sleep(pollInterval * 1000, signal);
        const res = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                device_code: deviceCode,
                grant_type: "urn:ietf:params:oauth:grant-type:device_code",
            }),
        });
        if (!res.ok) {
            throw new Error(`GitHub token poll failed: ${res.status} ${res.statusText}`);
        }
        const data = (await res.json());
        if (data.access_token) {
            return {
                access_token: data.access_token,
                token_type: data.token_type,
                scope: data.scope,
            };
        }
        switch (data.error) {
            case "authorization_pending":
                continue;
            case "slow_down":
                pollInterval += 5;
                continue;
            case "expired_token":
                throw new Error("Device code expired. Please restart the authentication flow.");
            case "access_denied":
                throw new Error("Access denied. The user cancelled the authorization.");
            default:
                throw new Error(`OAuth error: ${data.error} — ${data.error_description || "unknown"}`);
        }
    }
    throw new Error("Device code expired (timeout). Please restart the authentication flow.");
}
export function openBrowser(url) {
    const platform = process.platform;
    let cmd;
    let args;
    if (platform === "darwin") {
        cmd = "open";
        args = [url];
    }
    else if (platform === "win32") {
        cmd = "cmd";
        args = ["/c", "start", "", url];
    }
    else {
        cmd = "xdg-open";
        args = [url];
    }
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.unref();
}
function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new Error("Authentication cancelled"));
            return;
        }
        const timer = setTimeout(resolve, ms);
        signal?.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new Error("Authentication cancelled"));
        }, { once: true });
    });
}
