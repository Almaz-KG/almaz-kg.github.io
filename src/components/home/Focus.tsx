import { DocSection } from "@/components/doc/DocSection";
import { FOCUS } from "@/data/content";

/**
 * What the work concentrates on. Parked: not rendered by `Home.tsx`; see
 * PARKED_SECTIONS in data/sections.ts for why, and how to bring it back.
 */
export function Focus() {
  return (
    <DocSection id="focus" title="Focus">
      <dl className="space-y-5">
        {FOCUS.map((item) => (
          <div key={item.n}>
            <dt className="font-semibold">{item.title}</dt>
            <dd className="mt-1 text-muted">{item.body}</dd>
          </div>
        ))}
      </dl>
    </DocSection>
  );
}
