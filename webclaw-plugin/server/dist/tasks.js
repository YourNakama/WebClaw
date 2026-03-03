/**
 * Extracts task items (checkboxes) from markdown content.
 * Skips lines inside fenced code blocks.
 */
export function extractTasks(content, filePath, tags) {
    const lines = content.split("\n");
    const tasks = [];
    let inCodeBlock = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^```/.test(line.trimStart())) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock)
            continue;
        const match = line.match(/^(\s*)-\s+\[([ xX])\]\s+(.*)/);
        if (match) {
            const completed = match[2] !== " ";
            const text = match[3].trim();
            tasks.push({ filePath, line: i + 1, text, completed, tags });
        }
    }
    return tasks;
}
/**
 * Toggles a checkbox at a specific line in content.
 */
export function toggleTaskInContent(content, lineNumber) {
    const lines = content.split("\n");
    const idx = lineNumber - 1;
    if (idx < 0 || idx >= lines.length)
        return content;
    const line = lines[idx];
    if (/- \[ \]/.test(line)) {
        lines[idx] = line.replace("- [ ]", "- [x]");
    }
    else if (/- \[[xX]\]/.test(line)) {
        lines[idx] = line.replace(/- \[[xX]\]/, "- [ ]");
    }
    return lines.join("\n");
}
