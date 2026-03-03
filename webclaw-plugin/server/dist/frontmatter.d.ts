import type { VaultFrontmatter } from "./types.js";
/**
 * Parses YAML frontmatter from markdown content.
 * Lightweight regex-based parser for common cases.
 */
export declare function parseFrontmatter(content: string): VaultFrontmatter | undefined;
/**
 * Extract just the tags array from content.
 */
export declare function extractTags(content: string): string[];
