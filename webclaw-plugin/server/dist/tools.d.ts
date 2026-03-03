import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { VaultConfig, SessionState } from "./types.js";
export declare function registerTools(server: McpServer, getState: () => SessionState, setState: (patch: Partial<SessionState>) => void, options: {
    isRemote: boolean;
    loadTokenOnly?: () => string | null;
    saveToken?: (token: string, method: VaultConfig["auth_method"]) => void;
    saveConfig?: (config: VaultConfig) => void;
    getConfigPath?: () => string;
    tryLoadConfig?: () => VaultConfig | null;
}): void;
