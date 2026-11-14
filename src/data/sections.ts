import { POSTS } from "@/data/posts";

/**
 * The order of the home page's numbered sections, declared once.
 *
 * The numbers used to be literals inside each section, which made the order two
 * facts that had to agree: the JSX in `Home.tsx` and the hand-written numbers.
 * Renumbering after inserting a section is exactly the edit that forgets one of
 * them, and it did.
 *
 * `Home.tsx` renders the sections in this order and each of them asks for its
 * own number, so inserting or moving one is a single edit here.
 */
export const SECTION_ORDER = ["record", "stack", "notes", "projects", "contact"] as const;

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
 * `notes` hides itself while no post is published, and the numbers should not
 * skip over the gap it leaves: "1 Record, 2 Stack, 4 Projects" reads as a bug.
 */
const RENDERED: readonly SectionId[] = SECTION_ORDER.filter(
  (id) => id !== "notes" || POSTS.length > 0,
);

/**
 * The section's number, e.g. `"3"`.
 *
 * A parked section has no number, and gets a visible `?` rather than a blank:
 * rendering one without first moving it into `SECTION_ORDER` is a mistake, and
 * it should look like one.
 */
export function sectionNumber(id: SectionId): string {
  const at = RENDERED.indexOf(id);
  return at < 0 ? "?" : String(at + 1);
}
