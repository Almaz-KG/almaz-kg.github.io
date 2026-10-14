import { POSTS } from "@/data/posts";

/**
 * The order of the landing page, declared once.
 *
 * The numbered kickers ("01 About", "02 Writing") used to be string literals
 * inside each section, which made the order two facts that had to agree: the
 * JSX in `Home.tsx` and six hand-written numbers. Renumbering after inserting a
 * section is exactly the edit that forgets one of them, and it did.
 *
 * `Home.tsx` renders the sections in this order and each of them asks for its
 * own number, so inserting or moving one is a single edit here.
 */
export const SECTION_ORDER = ["about", "writing", "projects", "contact"] as const;

/**
 * Sections that still exist as components but are not on the page.
 *
 * `focus` is parked: it is written as a pitch rather than as a description, and
 * the page is meant to sound quieter than that. It keeps its place in the type
 * so the component goes on compiling untouched, and putting it back is two
 * edits: move its name into `SECTION_ORDER`, render it again in `Home.tsx`.
 */
export const PARKED_SECTIONS = ["focus"] as const;

export type SectionId = (typeof SECTION_ORDER)[number] | (typeof PARKED_SECTIONS)[number];

/**
 * `writing` hides itself while no post is published, and the numbers should not
 * skip over the gap it leaves: "01 About, 03 Projects" reads as a bug.
 */
const RENDERED: readonly SectionId[] = SECTION_ORDER.filter(
  (id) => id !== "writing" || POSTS.length > 0,
);

/**
 * The two-digit kicker for a section, e.g. `"03"`.
 *
 * A parked section has no number, and gets a visible `--` rather than a blank:
 * rendering one without first moving it into `SECTION_ORDER` is a mistake, and
 * it should look like one.
 */
export function sectionIndex(id: SectionId): string {
  const at = RENDERED.indexOf(id);
  return at < 0 ? "--" : String(at + 1).padStart(2, "0");
}
