import { Reveal, Section, SectionHeading } from "@/components/ui";
import { FOCUS } from "@/data/content";
import { sectionIndex } from "@/data/sections";
import { TONES } from "@/utils/tones";
import { FocusCard } from "./FocusCard";

export function Focus() {
  return (
    <Section id="focus">
      <SectionHeading
        index={sectionIndex("focus")}
        kicker="What I do"
        title={
          <>
            Four things I&apos;m
            <br />
            <span className="text-gradient">genuinely good at.</span>
          </>
        }
        intro="From raw event firehose to a governed table someone actually trusts — and the model that eats it."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {FOCUS.map((item, i) => (
          <Reveal key={item.n} delay={i * 70}>
            <FocusCard item={item} tone={TONES[i % TONES.length]} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
