/**
 * Markdown -> HTML, run once per post at build time.
 *
 * Everything here happens in Node during `vite build`, so neither `marked` nor
 * `shiki` reaches the browser: a post ships as a pre-rendered HTML string with
 * syntax colours already baked in, and the reader downloads no parser at all.
 */

import { Marked, type Token, type Tokens, type TokenizerAndRendererExtension } from "marked";
import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";
import { slugify } from "./frontmatter";
import { smartQuotes, smartQuotesHtml } from "./typography";

/** Loaded up front because shiki needs its grammars before the first render. */
const LANGUAGES = [
  "bash",
  "css",
  "diff",
  "docker",
  "go",
  "html",
  "ini",
  "java",
  "javascript",
  "json",
  "jsx",
  "makefile",
  "markdown",
  "python",
  "rust",
  "scala",
  "sql",
  "toml",
  "tsx",
  "typescript",
  "xml",
  "yaml",
] as const;

/** Written the short way in fences; mapped to the grammar shiki knows. */
const LANGUAGE_ALIASES: Record<string, string> = {
  dockerfile: "docker",
  js: "javascript",
  kt: "java",
  md: "markdown",
  py: "python",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
};

/**
 * Listings are set the way a paper sets them: in ink, with strings a step
 * lighter and comments and punctuation receding, and no colour of their own.
 *
 * The theme writes `var(--shiki-token-*)` on every token instead of a colour,
 * and src/prose.css maps those variables onto the site's colour roles, so a
 * listing follows the light and dark themes with no second copy of the code
 * and nothing re-highlighted.
 */
const THEME_NAME = "ink";
const THEME = createCssVariablesTheme({ name: THEME_NAME, fontStyle: false });

const CALLOUT_KINDS = ["note", "tip", "warn"] as const;
type CalloutKind = (typeof CALLOUT_KINDS)[number];

/** A `##`/`###` heading, collected while rendering to build the sidebar contents. */
export type TocEntry = { id: string; text: string; depth: 2 | 3 };

type CalloutToken = Tokens.Generic & { kind: CalloutKind; tokens: Token[] };
type CodeToken = Tokens.Code & { highlighted?: string; title?: string };

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [THEME],
    langs: [...LANGUAGES],
  });
  return highlighterPromise;
}

/** Frees the shiki WASM instance; called when the dev server shuts down. */
export async function disposeHighlighter(): Promise<void> {
  if (!highlighterPromise) return;
  const highlighter = await highlighterPromise;
  highlighter.dispose();
  highlighterPromise = null;
}

export async function renderMarkdown(
  body: string,
  file: string,
): Promise<{ html: string; toc: TocEntry[] }> {
  const highlighter = await getHighlighter();
  const toc: TocEntry[] = [];
  const seenIds = new Map<string, number>();

  const marked = new Marked({
    gfm: true,
    async: true,

    extensions: [calloutExtension()],

    // Shiki is async and renderers are not, so highlighting happens here and the
    // renderer below only has to hand the finished markup back.
    async walkTokens(token) {
      if (token.type !== "code") return;

      const code = token as CodeToken;
      const [rawLang = "", ...rest] = (code.lang ?? "").split(/\s+/);
      const alias = rawLang.toLowerCase();
      const lang = LANGUAGE_ALIASES[alias] ?? alias;

      const title = /title="([^"]*)"/.exec(rest.join(" "))?.[1];
      if (title) code.title = title;

      const known = (LANGUAGES as readonly string[]).includes(lang);
      if (alias && !known) {
        console.warn(`[blog] ${file}: unknown code fence language "${alias}", rendering as text.`);
      }

      code.highlighted = highlighter.codeToHtml(code.text, {
        lang: known ? lang : "text",
        theme: THEME_NAME,
      });
    },

    renderer: {
      heading(token: Tokens.Heading) {
        const text = this.parser.parseInline(token.tokens);
        const id = uniqueId(slugify(token.text), seenIds);

        // The id comes from the text as typed, so a link to a section does not
        // change with its quotes; the contents shows the text as set.
        if (token.depth === 2 || token.depth === 3) {
          toc.push({ id, text: smartQuotes(token.text), depth: token.depth });
        }

        // The anchor comes first and is empty: src/prose.css draws the
        // section number into it, so the number is the heading's own link, the
        // way a numbered section in a spec is. It is hidden from screen readers
        // because the heading itself is already the landmark, and a feed
        // reader without the stylesheet shows nothing where it is.
        return (
          `<h${token.depth} id="${id}">` +
          `<a class="heading-anchor" href="#${id}" aria-hidden="true" tabindex="-1"></a>` +
          `${text}</h${token.depth}>\n`
        );
      },

      code(token: Tokens.Code) {
        const { highlighted, title } = token as CodeToken;
        const head = title ? `<div class="code-title">${escapeHtml(title)}</div>` : "";

        return `<div class="code-block">${head}${highlighted ?? ""}</div>\n`;
      },

      // A paragraph holding nothing but one image is a figure, not a sentence
      // with a picture in it, so it gets pulled out of the text column and the
      // markdown title becomes the caption.
      paragraph(token: Tokens.Paragraph) {
        const [only] = token.tokens;
        if (token.tokens.length === 1 && only?.type === "image") {
          const image = only as Tokens.Image;
          const caption = image.title ? `<figcaption>${escapeHtml(image.title)}</figcaption>` : "";

          return (
            `<figure>` +
            `<img src="${escapeHtml(image.href)}" alt="${escapeHtml(image.text)}" ` +
            `loading="lazy" decoding="async" />${caption}` +
            `</figure>\n`
          );
        }

        return `<p>${this.parser.parseInline(token.tokens)}</p>\n`;
      },

      link(token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        // Same-site links stay plain anchors: the router intercepts them and
        // navigates without a reload.
        const external = /^[a-z]+:/i.test(token.href) && !token.href.startsWith("mailto:");
        const target = external ? ` target="_blank" rel="noopener noreferrer"` : "";

        return `<a href="${escapeHtml(token.href)}"${title}${target}>${text}</a>`;
      },

      image(token: Tokens.Image) {
        // Inline images (inside a sentence or a list) stay inline.
        return (
          `<img src="${escapeHtml(token.href)}" alt="${escapeHtml(token.text)}" ` +
          `loading="lazy" decoding="async" />`
        );
      },
    },
  });

  const html = await marked.parse(body);

  return { html: smartQuotesHtml(wrapTables(html)), toc };
}

/**
 * Block extension for the callouts the posts lean on (Note, Tip, Careful):
 *
 * ```
 * :::note
 * Body, parsed as markdown.
 * :::
 * ```
 */
function calloutExtension(): TokenizerAndRendererExtension {
  const open = new RegExp(`^:::(${CALLOUT_KINDS.join("|")})[ \\t]*\\r?\\n`);

  return {
    name: "callout",
    level: "block",

    start(src: string) {
      return src.match(/^:::/m)?.index;
    },

    tokenizer(src: string): CalloutToken | undefined {
      const head = open.exec(src);
      if (!head) return;

      const rest = src.slice(head[0].length);
      const close = /^:::[ \t]*$/m.exec(rest);
      if (!close) return;

      const inner = rest.slice(0, close.index);
      const raw = src.slice(0, head[0].length + close.index + close[0].length);

      return {
        type: "callout",
        raw,
        kind: head[1] as CalloutKind,
        tokens: this.lexer.blockTokens(inner.trim()),
      };
    },

    renderer(token: Tokens.Generic) {
      const callout = token as CalloutToken;
      return `<aside class="callout callout-${callout.kind}">${this.parser.parse(callout.tokens)}</aside>\n`;
    },
  };
}

/**
 * Tables are the one block that can be arbitrarily wide, so each one gets a
 * scroll container rather than letting it push the page sideways. Done on the
 * output string because overriding the renderer would mean re-implementing
 * marked's whole cell walk to change one wrapper.
 */
function wrapTables(html: string): string {
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

/** Two headings with the same words still need distinct anchors. */
function uniqueId(base: string, seen: Map<string, number>): string {
  const id = base || "section";
  const count = seen.get(id) ?? 0;
  seen.set(id, count + 1);
  return count === 0 ? id : `${id}-${count + 1}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
