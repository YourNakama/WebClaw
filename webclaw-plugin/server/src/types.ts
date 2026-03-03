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

// === Vault Types ===

export interface VaultConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
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
