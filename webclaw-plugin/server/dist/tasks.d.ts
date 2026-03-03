import type { TaskItem } from "./types.js";
/**
 * Extracts task items (checkboxes) from markdown content.
 * Skips lines inside fenced code blocks.
 */
export declare function extractTasks(content: string, filePath: string, tags: string[]): TaskItem[];
/**
 * Toggles a checkbox at a specific line in content.
 */
export declare function toggleTaskInContent(content: string, lineNumber: number): string;
