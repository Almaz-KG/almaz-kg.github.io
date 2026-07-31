import { Reveal, Section, SectionHeading } from "@/components/ui";
import { PROJECTS } from "@/data/content";
import { TONE_GLOW } from "@/utils/tones";
import { ProjectCard } from "./ProjectCard";

/** Cards alternate between these two glows. */
const GLOWS = [TONE_GLOW.lime, TONE_GLOW.violet];

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        index="03"
        kicker="Projects"
        title={
          <>
            My <span className="text-gradient">personal</span> projects.
          </>
        }
        intro="These are the ones with users, releases and the occasional bug report. Everything else lives further down the page."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <ProjectCard project={p} glow={GLOWS[i % GLOWS.length]} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
