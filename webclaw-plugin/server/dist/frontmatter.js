const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
/**
 * Parses YAML frontmatter from markdown content.
 * Lightweight regex-based parser for common cases.
 */
export function parseFrontmatter(content) {
    const match = content.match(FRONTMATTER_RE);
    if (!match)
        return undefined;
    const block = match[1];
    const result = {};
    let currentKey = null;
    let currentList = null;
    for (const raw of block.split("\n")) {
        const line = raw.trimEnd();
        // List item: "- value"
        if (/^\s+-\s+/.test(line) && currentKey && currentList) {
            const val = line.replace(/^\s+-\s+/, "").trim();
            if (val)
                currentList.push(val);
            continue;
        }
        // Flush previous list
        if (currentKey && currentList) {
            result[currentKey] = currentList;
            currentKey = null;
            currentList = null;
        }
        // Key: value
        const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
        if (!kvMatch)
            continue;
        const key = kvMatch[1];
        let value = kvMatch[2].trim();
        // Inline array: [a, b, c]
        if (value.startsWith("[") && value.endsWith("]")) {
            const items = value
                .slice(1, -1)
                .split(",")
                .map((s) => s.trim().replace(/^["']|["']$/g, ""))
                .filter(Boolean);
            result[key] = items;
            continue;
        }
        // Empty value — next lines might be list items
        if (!value) {
            currentKey = key;
            currentList = [];
            continue;
        }
        // Strip quotes
        value = value.replace(/^["']|["']$/g, "");
        result[key] = value;
    }
    // Flush trailing list
    if (currentKey && currentList) {
        result[currentKey] = currentList;
    }
    return Object.keys(result).length > 0 ? result : undefined;
}
/**
 * Extract just the tags array from content.
 */
export function extractTags(content) {
    const fm = parseFrontmatter(content);
    if (!fm?.tags)
        return [];
    return Array.isArray(fm.tags) ? fm.tags : [];
}
