/**
 * The XKE stage engine, ported to run once at build time.
 *
 * The session decks are written for a projector: a fixed 1280x720 stage, one
 * slide and one click at a time, built in the browser by `stage.js`. A post
 * cannot work like that - it has to arrive as finished HTML that a crawler can
 * read and that shows every slide at once - so this file keeps the deck's
 * markup and drops its runtime. Each slide kind renders to the same structure
 * the stage builds, with every class prefixed `d-` so nothing collides with
 * Tailwind or the prose styles, and `src/deck.css` scales it to whatever width
 * the column gives it.
 *
 * Step-by-step reveals do not exist on a page that is read rather than
 * presented, so every fragment is rendered already shown.
 */

/** A comparison panel on a `cols` slide. `tone` names a colour token. */
export type Panel = { k: string; tone: Tone; lines: string[]; tag: string };

export type Tone = "a" | "b" | "c" | "d";

/**
 * One slide, as data. Loose on purpose: it mirrors the deck's own object
 * literals so a slide can be carried over without being restructured, and each
 * kind reads only the fields it knows.
 */
export type Slide = {
  /** Stable handle the post refers to with `::slide <id>`. */
  id: string;
  k: string;
  eyebrow?: string;
  h?: string;
  lede?: string;
  text?: string;
  sm?: boolean;
  items?: string[];
  no?: string;
  n?: string;
  sub?: string;
  reveal?: string;
  tail?: string;
  tailSm?: boolean;
  note?: string;
  cue?: string;
  href?: string;
  facts?: string[];
  code?: [string, string][];
  svg?: () => string;
  stats?: [string, string][];
  left?: Panel;
  right?: Panel;
  /** Absolute path into `static/` for a figure set behind the slide. */
  bg?: string;
};

export type Kind = (slide: Slide) => string;

/** A deck: its slides in presentation order, plus kinds only it has. */
export type Deck = { title: string; slides: Slide[]; kinds?: Record<string, Kind> };

/* ---------------- SVG helpers, shared by every deck's figures ---------------- */

export function L(x: number, y: number, lines: string[], lh: number, cls = ""): string {
  return lines
    .map((t, i) => `<text class="${cls}" x="${x}" y="${y + i * lh}">${t}</text>`)
    .join("");
}

export function esc(text: string): string {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------- markup helpers ---------------- */

function statsHTML(items: [string, string][]): string {
  return (
    `<div class="d-stats" style="--n:${items.length}">` +
    items
      .map(
        ([n, c]) => `<div><div class="d-stat__n">${n}</div><div class="d-stat__c">${c}</div></div>`,
      )
      .join("") +
    `</div>`
  );
}

function itemsHTML(items: string[] | undefined): string {
  if (!items) return "";
  return `<ul class="d-items">${items.map((i) => `<li><span>${i}</span></li>`).join("")}</ul>`;
}

function cue(s: Slide): string {
  return s.href
    ? `<a class="d-cue d-cue--link" href="${s.href}" target="_blank" rel="noopener noreferrer">↗ ${s.cue}</a>`
    : `<span class="d-cue">↗ ${s.cue}</span>`;
}

/**
 * Headings: the post already owns the page's `h1`, so a title slide's heading
 * is a styled paragraph. A section slide is a real `h2`, because it is where a
 * chapter of the talk starts, and a slide's own title is an `h3` under it.
 */
const KINDS: Record<string, Kind> = {
  title: (s) => `
    <div class="d-eyebrow">${s.eyebrow}</div>
    <p class="d-h1" style="margin-top:calc(26 * var(--u))">${s.h}</p>
    <div class="d-lede" style="margin-top:calc(34 * var(--u))">${s.lede}</div>`,

  section: (s) => `
    <div class="d-actno">${s.no ?? ""}</div>
    ${s.n ? `<div class="d-eyebrow">${s.n}</div>` : ""}
    <h2 class="d-h2" style="margin-top:calc(14 * var(--u))">${s.h}</h2>`,

  punch: (s) => `
    ${s.eyebrow ? `<div class="d-eyebrow">${s.eyebrow}</div>` : ""}
    <div class="d-punch"${s.eyebrow ? ` style="margin-top:calc(26 * var(--u))"` : ""}>${s.text}</div>
    ${s.reveal ? `<div class="d-reveal d-mono">${s.reveal}</div>` : ""}
    ${s.sub ? `<div class="d-sub">${s.sub}</div>` : ""}`,

  statement: (s) => `
    <div class="d-statement${s.sm ? " d-statement--sm" : ""}">${s.text}</div>
    ${itemsHTML(s.items)}`,

  ask: (s) => `
    <div class="d-eyebrow d-eyebrow--c">Question</div>
    <div class="d-ask" style="margin-top:calc(34 * var(--u))">${s.text}</div>
    ${s.tail ? `<div class="${s.tailSm ? "d-tail" : "d-ask"}" style="margin-top:calc(40 * var(--u))">${s.tail}</div>` : ""}
    ${s.sub ? `<div class="d-note" style="margin-top:calc(36 * var(--u))">${s.sub}</div>` : ""}`,

  demo: (s) => `
    <div class="d-eyebrow d-eyebrow--a">${s.eyebrow}</div>
    <div class="d-statement d-statement--sm" style="margin-top:calc(30 * var(--u))">${s.text}</div>
    <div>${cue(s)}</div>
    ${s.note ? `<div class="d-note" style="margin-top:calc(34 * var(--u))">${s.note}</div>` : ""}`,

  demoCode: (s) => `
    <div class="d-eyebrow d-eyebrow--a">${s.eyebrow}</div>
    <div class="d-split">
      <div>
        <h3 class="d-h3">${s.h}</h3>
        <div class="d-note" style="margin-top:calc(22 * var(--u))">${s.lede}</div>
        <div class="d-facts">${(s.facts ?? []).map((f) => `<span>${f}</span>`).join("")}</div>
      </div>
      <pre class="d-code">${(s.code ?? [])
        .map(([c, t]) => `<span class="${c}">${esc(t) || " "}</span>`)
        .join("\n")}</pre>
    </div>`,

  visual: (s) => `
    ${s.h ? `<h3 class="d-h3">${s.h}</h3>` : ""}
    <div class="d-vis">${s.svg?.() ?? ""}</div>
    ${s.stats ? statsHTML(s.stats) : ""}
    ${s.tail ? `<div class="d-tail${s.tailSm ? " d-tail--sm" : ""}">${s.tail}</div>` : ""}
    ${s.note ? `<div class="d-note" style="margin-top:calc(34 * var(--u))">${s.note}</div>` : ""}`,

  cols: (s) => `
    <h3 class="d-h3">${s.h}</h3>
    <div class="d-cols">
      ${[s.left, s.right]
        .filter((p): p is Panel => p !== undefined)
        .map(
          (p) => `
        <div class="d-panel">
          <div class="d-panel__k" style="color:var(--${p.tone})">${p.k}</div>
          ${p.lines.map((l, j) => `<p class="d-panel__p${j ? " d-panel__p--dim" : ""}">${l || "&nbsp;"}</p>`).join("")}
          <div class="d-panel__tag" style="color:var(--${p.tone})">${p.tag}</div>
        </div>`,
        )
        .join("")}
    </div>`,

  end: (s) => `
    <p class="d-h1">${s.h}</p>
    ${s.lede ? `<div class="d-lede" style="margin-top:calc(34 * var(--u))">${s.lede}</div>` : ""}`,
};

/** Kinds that sit at the top of the stage rather than centred in it. */
const TOP = new Set(["visual", "cols", "stats", "table", "fig", "timing"]);

/**
 * One slide as a self-contained, theme-aware block of static HTML. Its text is
 * left as text, not hidden behind an image role, because it is the content a
 * reader with a screen reader and a crawler both need.
 */
export function renderSlide(deck: Deck, slide: Slide): string {
  const view = deck.kinds?.[slide.k] ?? KINDS[slide.k];
  if (!view) throw new Error(`${deck.title}: slide "${slide.id}" has unknown kind "${slide.k}".`);

  const bg = slide.bg
    ? `<div class="d-bgimg" aria-hidden="true"><i style="background-image:url('${slide.bg}')"></i></div>`
    : "";

  return (
    `<div class="d-stage">` +
    `<div class="d-slide${TOP.has(slide.k) ? " d-slide--top" : ""}">${bg}${view(slide)}</div>` +
    `</div>`
  );
}
