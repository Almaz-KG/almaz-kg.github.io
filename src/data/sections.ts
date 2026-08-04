/**
 * The order of the landing page, declared once.
 *
 * The numbered kickers ("01 About", "02 What I do") used to be string literals
 * inside each section, which made the order two facts that had to agree: the
 * JSX in `Home.tsx` and six hand-written numbers. Renumbering after inserting a
 * section is exactly the edit that forgets one of them, and it did.
 *
 * `Home.tsx` renders the sections in this order and each of them asks for its
 * own number, so inserting or moving one is a single edit here.
 */
export const SECTION_ORDER = ["about", "focus", "projects", "writing", "shelf", "contact"] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

/** The two-digit kicker for a section, e.g. `"03"`. */
export function sectionIndex(id: SectionId): string {
  return String(SECTION_ORDER.indexOf(id) + 1).padStart(2, "0");
}
