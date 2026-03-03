import { Octokit } from "@octokit/rest";
import type { GitHubFile, GitHubTreeItem, GitHubUserRepo } from "./types.js";
export declare function getRepoTree(octokit: Octokit, owner: string, repo: string, branch: string): Promise<GitHubTreeItem[]>;
export declare function getDirectoryContents(octokit: Octokit, owner: string, repo: string, path: string): Promise<GitHubFile[]>;
export declare function getFileContent(octokit: Octokit, owner: string, repo: string, path: string): Promise<{
    content: string;
    sha: string;
}>;
export declare function createOrUpdateFile(octokit: Octokit, owner: string, repo: string, path: string, content: string, message: string, sha?: string): Promise<string>;
export declare function deleteFile(octokit: Octokit, owner: string, repo: string, path: string, message: string, sha: string): Promise<void>;
export declare function getFileSha(octokit: Octokit, owner: string, repo: string, path: string): Promise<string>;
export declare function listUserRepos(octokit: Octokit, limit?: number, type?: "all" | "owner" | "public" | "private" | "member"): Promise<GitHubUserRepo[]>;
export declare function getFileHistory(octokit: Octokit, owner: string, repo: string, path: string, perPage?: number): Promise<Array<{
    sha: string;
    message: string;
    author: string;
    date: string;
}>>;
