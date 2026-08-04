/**
 * A deliberately small YAML-subset parser for post front matter.
 *
 * Posts are hand-written by one person, so the format they may use is fixed and
 * narrow: scalars, inline arrays and block arrays. Anything outside that throws
 * at build time with the offending line, which is far more useful than pulling
 * in a full YAML implementation to silently accept structures the blog has no
 * way to render.
 */

export type FrontmatterValue = string | number | boolean | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

const DELIMITER = /^---\r?$|^---$/;

/** Splits a raw `.md` file into its front matter block and its markdown body. */
export function parseFrontmatter(raw: string, file: string): { data: Frontmatter; body: string } {
  // A leading BOM, written as an escape so the character is visible in source.
  const lines = raw.replace(/^\uFEFF/, "").split(/\r?\n/);

  if (!DELIMITER.test(lines[0] ?? "")) {
    throw new Error(`${file}: must start with a \`---\` front matter block.`);
  }

  const end = lines.findIndex((line, i) => i > 0 && DELIMITER.test(line));
  if (end === -1) {
    throw new Error(`${file}: front matter block is never closed with \`---\`.`);
  }

  return {
    data: parseBlock(lines.slice(1, end), file),
    body: lines
      .slice(end + 1)
      .join("\n")
      .trim(),
  };
}

function parseBlock(lines: string[], file: string): Frontmatter {
  const data: Frontmatter = {};
  let listKey: string | null = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    // `  - item` continues the block array opened by the previous key.
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item) {
      if (!listKey) throw new Error(`${file}: list item "${line.trim()}" has no key above it.`);
      (data[listKey] as string[]).push(unquote(item[1]));
      continue;
    }

    const pair = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!pair) throw new Error(`${file}: cannot parse front matter line "${line}".`);

    const [, key, rawValue] = pair;
    const value = rawValue.trim();

    if (value === "") {
      // A bare `key:` opens a block array; an empty value would be ambiguous.
      data[key] = [];
      listKey = key;
      continue;
    }

    data[key] = parseScalar(value);
    listKey = null;
  }

  return data;
}

function parseScalar(value: string): FrontmatterValue {
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    return inner ? inner.split(",").map((part) => unquote(part.trim())) : [];
  }
  if (value === "true") return true;
  if (value === "false") return false;
  return unquote(value);
}

function unquote(value: string): string {
  const quoted = /^(["'])([\s\S]*)\1$/.exec(value);
  return quoted ? quoted[2] : value;
}

/** Reads a required string field, failing the build when it is missing or empty. */
export function requireString(data: Frontmatter, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: front matter is missing a non-empty \`${key}\`.`);
  }
  return value.trim();
}

/** Reads an optional list field, tolerating a single value written without brackets. */
export function optionalList(data: Frontmatter, key: string): string[] {
  const value = data[key];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

/** Turns arbitrary heading text into a stable, URL-safe anchor id. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`[^`]*`/g, (code) => code.replace(/`/g, ""))
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/** Rounded to the nearest minute at an unhurried 200 words per minute, floor 1. */
export function readingTime(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}
