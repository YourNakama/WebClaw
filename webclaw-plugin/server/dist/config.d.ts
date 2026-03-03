import { Octokit } from "@octokit/rest";
import type { VaultConfig } from "./types.js";
/**
 * Try to load config. Returns null if not configured yet
 * (instead of throwing, so the server can still start and expose webclaw_setup).
 */
export declare function tryLoadConfig(): VaultConfig | null;
/**
 * Save config to ~/.webclaw/config.json (chmod 600).
 */
export declare function saveConfig(config: VaultConfig): void;
export declare function getConfigPath(): string;
export declare function createOctokit(token: string): Octokit;
//# sourceMappingURL=config.d.ts.map