/**
 * Straight quotes to typographic ones, at build time.
 *
 * Markdown is typed with the keyboard's straight " and ', and a book face sets
 * those as typewriter ticks: in Libertinus the difference between I'm and I’m
 * is plain at reading size, and a description typed with ’ sat next to body
 * text typed with '. marked no longer converts them itself.
 *
 * Whether a quote opens or closes depends on the character before it, and
 * that character is often in another text run: "see **this**" closes after
 * the bold text, `"[a link](...)"` after the link. So the HTML is walked as
 * one stream, the character before each quote carried across inline tags and
 * reset at the start of every block, and code is left exactly as typed.
 *
 * Quotes only. Dashes and ellipses stay as written.
 */

/** Elements whose text is code or markup to be kept verbatim. */
const VERBATIM = new Set(["code", "kbd", "pre", "samp", "script", "style", "textarea"]);

/** Elements that start a new run of prose, so a quote right inside one opens. */
const BLOCKS = new Set([
  "aside",
  "blockquote",
  "caption",
  "dd",
  "div",
  "dt",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "ol",
  "p",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);

/** A quote after one of these opens: a space, an opening bracket, a dash or another opening quote. */
const OPENS_AFTER = /[\s([{–—‘“]/u;

/** The character before the next quote: `""` at the start of a block. */
type State = { prev: string };

/**
 * Converts plain text, such as a title or a description from front matter.
 * Spans in backticks are code and are left alone.
 */
export function smartQuotes(text: string): string {
  const state: State = { prev: "" };

  return text
    .split(/(`[^`]*`)/)
    .map((part, i) => {
      if (i % 2 === 0) return educate(part, state);
      state.prev = "a";
      return part;
    })
    .join("");
}

/** Converts the text of an HTML fragment, leaving tags, attributes and code untouched. */
export function smartQuotesHtml(html: string): string {
  const state: State = { prev: "" };
  let verbatim = 0;

  return html.replace(
    /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)[^>]*>|[^<]+|</g,
    (match: string, slash?: string, name?: string) => {
      if (name === undefined) {
        if (match.startsWith("<!--") || match === "<" || verbatim > 0) return match;
        return educate(decodeQuotes(match), state);
      }

      const tag = name.toLowerCase();
      const closing = slash === "/";

      if (VERBATIM.has(tag)) {
        if (closing) {
          verbatim = Math.max(0, verbatim - 1);
          // Code reads as a word: a quote right after `it`'s closes.
          state.prev = "a";
        } else if (!match.endsWith("/>")) {
          verbatim += 1;
        }
      } else if (BLOCKS.has(tag)) {
        state.prev = "";
      } else if (tag === "br") {
        state.prev = " ";
      } else if (tag === "img") {
        state.prev = "a";
      }

      return match;
    },
  );
}

/**
 * marked writes quotes in text as entities. The converted text has no straight
 * quotes left, so decoding them here needs no re-encoding afterwards.
 */
function decodeQuotes(text: string): string {
  return text.replace(/&quot;|&#34;|&#x22;/gi, '"').replace(/&#39;|&#x27;|&apos;/gi, "'");
}

function educate(text: string, state: State): string {
  let out = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char !== '"' && char !== "'") {
      out += char;
      continue;
    }

    const before = lastChar(out, state.prev);
    const opening = before === "" || OPENS_AFTER.test(before);

    if (char === '"') {
      out += opening ? "“" : "”";
    } else {
      // After a letter it is an apostrophe or a closing quote, both ’. After a
      // space it opens, except before a digit, where it is the apostrophe of
      // an abbreviated year: the ’90s.
      out += opening && !/\d/.test(text[i + 1] ?? "") ? "‘" : "’";
    }
  }

  state.prev = lastChar(out, state.prev);
  return out;
}

/** The character a quote follows, reading an entity such as `&amp;` as one character. */
function lastChar(out: string, prev: string): string {
  if (out === "") return prev;
  const entity = /&(#?\w+);$/.exec(out);
  if (entity) return entity[1] === "nbsp" || entity[1] === "#160" ? " " : "a";
  return out.slice(-1);
}
