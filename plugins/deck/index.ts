/**
 * Posts that walk through a talk, one slide at a time.
 *
 * A post names its deck in the front matter (`deck: how-llms-are-trained`) and
 * places slides in its body with a line of its own:
 *
 * ```
 * ::slide funnel
 * ```
 *
 * Everything after that line, up to the next one, is what gets said about the
 * slide, and sits under it. Anything before the first slide is an ordinary
 * introduction in the reading column.
 *
 * The slides are shown in one viewer, one at a time, with the controls under
 * the text. Every slide is still in the HTML: the viewer only decides which one
 * is visible, so the whole talk is there for a crawler and for a reader
 * without scripts, who gets the slides as a plain list.
 *
 * The decks are TypeScript modules under `content/decks/`, imported here
 * statically so they are bundled with the Vite config: editing one restarts
 * the dev server, and nothing about them reaches the browser except the HTML
 * they render to.
 */

import { deck as howLlmsAreTrained } from "../../content/decks/how-llms-are-trained";
import { renderSlide, type Deck } from "./stage";

const DECKS: Record<string, Deck> = {
  "how-llms-are-trained": howLlmsAreTrained,
};

export function hasDeck(id: string): boolean {
  return id in DECKS;
}

/** A `::slide <id>` line, as written in the markdown source. */
const SLIDE_LINE = /^::slide[ \t]+(\S+)[ \t]*$/gm;

/** What a slide line becomes on its way through marked: an HTML comment it passes through untouched. */
const MARKER = /<!--slide:(\S+?)-->\n?/g;

/**
 * Swaps each slide line for a marker, so the whole body is still parsed as one
 * document - heading ids stay unique and the contents stay in order - and the
 * markers can be found again in the HTML that comes out.
 */
export function markSlides(body: string): string {
  return body.replace(SLIDE_LINE, (_, id: string) => `\n<!--slide:${id}-->\n`);
}

/**
 * Cuts the rendered body at its markers and puts each slide above the text
 * that follows it. Fails the build on a slide the deck does not have or one
 * placed twice, and warns about any slide the post leaves out.
 */
export function layoutDeck(html: string, deckId: string, file: string): string {
  const deck = DECKS[deckId];
  if (!deck) throw new Error(`${file}: unknown \`deck\` "${deckId}".`);

  const index = new Map(deck.slides.map((slide, i) => [slide.id, i]));
  const parts = html.split(MARKER);
  const [intro, ...rest] = parts;
  const seen = new Set<string>();
  const rows: string[] = [];

  for (let i = 0; i < rest.length; i += 2) {
    const id = rest[i];
    const text = rest[i + 1]?.trim() ?? "";
    const at = index.get(id);

    if (at === undefined) throw new Error(`${file}: deck "${deckId}" has no slide "${id}".`);
    if (seen.has(id)) throw new Error(`${file}: slide "${id}" is placed twice.`);
    seen.add(id);

    const no = String(at + 1).padStart(2, "0");
    const total = String(deck.slides.length).padStart(2, "0");

    rows.push(
      `<section class="deck-row" id="slide-${no}" role="group" aria-roledescription="slide">` +
        `<figure class="deck-figure">${renderSlide(deck, deck.slides[at])}` +
        `<figcaption class="deck-no"><a href="#slide-${no}">${no}</a> / ${total}</figcaption>` +
        `</figure>` +
        `<div class="deck-text prose">${text}</div>` +
        `</section>`,
    );
  }

  const missing = deck.slides.filter((slide) => !seen.has(slide.id)).map((slide) => slide.id);
  if (missing.length) {
    console.warn(`[blog] ${file}: deck "${deckId}" slides not placed: ${missing.join(", ")}.`);
  }

  const lead = intro.trim() ? `<div class="prose deck-lead">${intro}</div>` : "";
  return (
    `${lead}<div class="deck" role="region" aria-roledescription="carousel" aria-label="Slides">` +
    `<div class="deck-track">${rows.join("")}</div>${controls(rows.length)}</div>`
  );
}

/**
 * The bar under the viewer. It is in the static HTML so the page does not
 * shift when the script arrives, and hidden by CSS until it has: without a
 * script the slides are simply listed one after another, and buttons that do
 * nothing would be worse than no buttons. `src/utils/deck.ts` drives it.
 */
function controls(count: number): string {
  const total = String(count).padStart(2, "0");
  return (
    `<div class="deck-controls">` +
    `<button type="button" class="deck-btn" data-deck="prev" aria-label="Previous slide">` +
    `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg></button>` +
    `<input type="range" class="deck-range" min="1" max="${count}" step="1" value="1" aria-label="Slide">` +
    `<span class="deck-count" aria-live="polite"><b>01</b> / ${total}</span>` +
    `<button type="button" class="deck-btn" data-deck="next" aria-label="Next slide">` +
    `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button>` +
    `</div>`
  );
}
