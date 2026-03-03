import { Octokit } from "@octokit/rest";
import type { GitHubFile, GitHubTreeItem, GitHubUserRepo } from "./types.js";

// === File Tree Operations ===

export async function getRepoTree(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string
): Promise<GitHubTreeItem[]> {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "1",
    });
    return data.tree as GitHubTreeItem[];
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "status" in err &&
      (err as { status: number }).status === 409
    ) {
      return [];
    }
    throw err;
  }
}

export async function getDirectoryContents(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<GitHubFile[]> {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  if (!Array.isArray(data)) return [];
  return data as GitHubFile[];
}

// === File CRUD ===

export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<{ content: string; sha: string }> {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`${path} is not a file`);
  }
  const content = Buffer.from(data.content || "", "base64").toString("utf-8");
  return { content, sha: data.sha };
}

export async function createOrUpdateFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<string> {
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    sha,
  });
  return data.content?.sha || "";
}

export async function deleteFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  message: string,
  sha: string
): Promise<void> {
  await octokit.repos.deleteFile({ owner, repo, path, message, sha });
}

export async function getFileSha(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`${path} is not a file`);
  }
  return data.sha;
}

// === User Repos ===

export async function listUserRepos(
  octokit: Octokit,
  limit = 30,
  type: "all" | "owner" | "public" | "private" | "member" = "all"
): Promise<GitHubUserRepo[]> {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    type,
    sort: "updated",
    direction: "desc",
    per_page: Math.min(limit, 100),
  });

  return data.map((r) => ({
    name: r.name,
    full_name: r.full_name,
    owner: r.owner.login,
    private: r.private,
    default_branch: r.default_branch,
    description: r.description,
    updated_at: r.updated_at ?? "",
  }));
}

// === File History ===

export async function getFileHistory(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  perPage = 30
): Promise<Array<{ sha: string; message: string; author: string; date: string }>> {
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    path,
    per_page: perPage,
  });
  return data.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author?.name ?? c.author?.login ?? "unknown",
    date: c.commit.author?.date ?? "",
  }));
}
