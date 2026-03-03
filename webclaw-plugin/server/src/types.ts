// === GitHub Types ===

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
  download_url?: string | null;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

// === OAuth Device Flow Types ===

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface OAuthErrorResponse {
  error: string;
  error_description: string;
}

// === GitHub User Repo ===

export interface GitHubUserRepo {
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  updated_at: string;
}

// === Vault Types ===

export interface VaultConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  auth_method?: "oauth_device_flow" | "pat" | "env";
}

export interface VaultFile {
  name: string;
  path: string;
  type: "file" | "dir";
  sha?: string;
  size?: number;
  children?: VaultFile[];
}

export interface VaultFrontmatter {
  title?: string;
  tags?: string[];
  created_at?: string;
  created_by?: string;
  status?: string;
  type?: string;
  [key: string]: unknown;
}

export interface FileContent {
  path: string;
  content: string;
  sha: string;
  frontmatter?: VaultFrontmatter;
}

export interface TaskItem {
  filePath: string;
  line: number;
  text: string;
  completed: boolean;
  tags: string[];
}
