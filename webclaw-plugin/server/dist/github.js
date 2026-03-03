// === File Tree Operations ===
export async function getRepoTree(octokit, owner, repo, branch) {
    try {
        const { data } = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: branch,
            recursive: "1",
        });
        return data.tree;
    }
    catch (err) {
        if (err instanceof Error &&
            "status" in err &&
            err.status === 409) {
            return [];
        }
        throw err;
    }
}
export async function getDirectoryContents(octokit, owner, repo, path) {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (!Array.isArray(data))
        return [];
    return data;
}
// === File CRUD ===
export async function getFileContent(octokit, owner, repo, path) {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (Array.isArray(data) || data.type !== "file") {
        throw new Error(`${path} is not a file`);
    }
    const content = Buffer.from(data.content || "", "base64").toString("utf-8");
    return { content, sha: data.sha };
}
export async function createOrUpdateFile(octokit, owner, repo, path, content, message, sha) {
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
export async function deleteFile(octokit, owner, repo, path, message, sha) {
    await octokit.repos.deleteFile({ owner, repo, path, message, sha });
}
export async function getFileSha(octokit, owner, repo, path) {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (Array.isArray(data) || data.type !== "file") {
        throw new Error(`${path} is not a file`);
    }
    return data.sha;
}
// === File History ===
export async function getFileHistory(octokit, owner, repo, path, perPage = 30) {
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
//# sourceMappingURL=github.js.map