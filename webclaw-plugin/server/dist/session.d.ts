import type { SessionState, VaultConfig } from "./types.js";
import { Octokit } from "@octokit/rest";
export declare class SessionStore {
    private sessions;
    get(sessionId: string): SessionState;
    setConfig(sessionId: string, config: VaultConfig): void;
    setOctokit(sessionId: string, octokit: Octokit): void;
    delete(sessionId: string): void;
}
