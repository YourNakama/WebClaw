import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { Octokit } from "@octokit/rest";
import type { VaultConfig } from "./types.js";

const CONFIG_PATH = join(homedir(), ".webclaw", "config.json");

/**
 * Try to load config. Returns null if not configured yet
 * (instead of throwing, so the server can still start and expose webclaw_setup).
 */
export function tryLoadConfig(): VaultConfig | null {
  // Environment variables take precedence
  const envToken = process.env.WEBCLAW_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const envOwner = process.env.WEBCLAW_OWNER;
  const envRepo = process.env.WEBCLAW_REPO;
  const envBranch = process.env.WEBCLAW_BRANCH;

  if (envToken && envOwner && envRepo) {
    return {
      token: envToken,
      owner: envOwner,
      repo: envRepo,
      branch: envBranch || "main",
    };
  }

  // Fall back to config file
  if (!existsSync(CONFIG_PATH)) {
    return null;
  }

  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<VaultConfig>;

    if (!parsed.token || !parsed.owner || !parsed.repo) {
      return null;
    }

    return {
      token: parsed.token,
      owner: parsed.owner,
      repo: parsed.repo,
      branch: parsed.branch || "main",
    };
  } catch {
    return null;
  }
}

/**
 * Save config to ~/.webclaw/config.json (chmod 600).
 */
export function saveConfig(config: VaultConfig): void {
  const dir = dirname(CONFIG_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), {
    encoding: "utf-8",
    mode: 0o600,
  });
}

export function getConfigPath(): string {
  return CONFIG_PATH;
}

export function createOctokit(token: string): Octokit {
  return new Octokit({ auth: token });
}
