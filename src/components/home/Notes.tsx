import { DocSection } from "@/components/doc/DocSection";
import { NoteList } from "@/components/doc/NoteList";
import { POSTS } from "@/data/posts";

/** How many notes the home page lists before pointing at the index. */
const SHOWN = 5;

/** The latest notes. Absent while none is published; see data/sections.ts. */
export function Notes() {
  if (POSTS.length === 0) return null;

  return (
    <DocSection id="notes" title="Notes">
      <NoteList posts={POSTS.slice(0, SHOWN)} />

      {POSTS.length > SHOWN && (
        <p className="mt-2">
          <a href="/blog">All {POSTS.length} notes</a>
        </p>
      )}
    </DocSection>
  );
}
