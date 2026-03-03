import { Octokit } from "@octokit/rest";
import type { VaultConfig } from "./types.js";
/**
 * Try to load config. Returns null if not configured yet
 * (instead of throwing, so the server can still start and expose webclaw_connect).
 */
export declare function tryLoadConfig(): VaultConfig | null;
/**
 * Save config to ~/.webclaw/config.json (chmod 600).
 */
export declare function saveConfig(config: VaultConfig): void;
/**
 * Save just the token (and auth_method) to ~/.webclaw/config.json.
 * Preserves existing owner/repo/branch if present.
 */
export declare function saveToken(token: string, authMethod: VaultConfig["auth_method"]): void;
/**
 * Load just the token from env vars or config file.
 * Used between auth and repo selection — doesn't require owner/repo.
 */
export declare function loadTokenOnly(): string | null;
export declare function getConfigPath(): string;
export declare function createOctokit(token: string): Octokit;
