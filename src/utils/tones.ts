/**
 * The four accent colours of the site, and the class / colour lookups built on
 * them. Tailwind only sees class names it can find as literals, so every
 * variant lives here in full rather than being assembled at runtime.
 */

export type Tone = "lime" | "aqua" | "violet" | "citrus";

/** Cycle order used where a tone is assigned by position rather than by data. */
export const TONES: readonly Tone[] = ["lime", "aqua", "violet", "citrus"];

/** Surface gradient + border, e.g. the plate behind a book cover. */
export const TONE_GRADIENT: Record<Tone, string> = {
  lime: "from-lime/25 to-lime/5 border-lime/25",
  aqua: "from-aqua/25 to-aqua/5 border-aqua/25",
  violet: "from-violet/30 to-violet/5 border-violet/25",
  citrus: "from-citrus/25 to-citrus/5 border-citrus/25",
};

/** Drop shadow raised on hover of the parent `.group`. */
export const TONE_HOVER_SHADOW: Record<Tone, string> = {
  lime: "group-hover:shadow-[0_18px_40px_-18px_rgba(182,255,46,0.55)]",
  aqua: "group-hover:shadow-[0_18px_40px_-18px_rgba(47,240,208,0.55)]",
  violet: "group-hover:shadow-[0_18px_40px_-18px_rgba(139,123,255,0.55)]",
  citrus: "group-hover:shadow-[0_18px_40px_-18px_rgba(255,122,69,0.55)]",
};

/** Raw colour for the cursor-tracking glow in `TiltCard`. */
export const TONE_GLOW: Record<Tone, string> = {
  lime: "rgba(182,255,46,0.16)",
  aqua: "rgba(47,240,208,0.16)",
  violet: "rgba(139,123,255,0.18)",
  citrus: "rgba(255,122,69,0.16)",
};

export const TONE_TEXT: Record<Tone, string> = {
  lime: "text-lime",
  aqua: "text-aqua",
  violet: "text-violet",
  citrus: "text-citrus",
};
