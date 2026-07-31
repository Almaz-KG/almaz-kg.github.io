import { Section, SectionHeading } from "@/components/ui";
import { STACK_GROUPS } from "@/data/content";
import { StackGroup } from "./StackGroup";

export function Stack() {
  return (
    <Section id="stack">
      <SectionHeading
        index="04"
        kicker="Toolbox"
        title={
          <>
            The <span className="text-gradient">stack</span> I reach for.
          </>
        }
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
        {STACK_GROUPS.map((g, i) => (
          <StackGroup key={g.title} title={g.title} items={g.items} delay={i * 60} />
        ))}
      </div>
    </Section>
  );
}
