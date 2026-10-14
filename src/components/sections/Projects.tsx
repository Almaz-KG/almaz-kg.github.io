import { Reveal, Section, SectionHeading } from "@/components/ui";
import { PROJECTS } from "@/data/content";
import { sectionIndex } from "@/data/sections";
import { TONE_GLOW } from "@/utils/tones";
import { cn } from "@/utils/cn";
import { ProjectCard } from "./ProjectCard";

/** Cards alternate between these two glows. */
const GLOWS = [TONE_GLOW.lime, TONE_GLOW.violet];

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        index={sectionIndex("projects")}
        kicker="Projects"
        title={
          <>
            What I&apos;m <span className="text-gradient">building</span> now.
          </>
        }
      />

      {/* A lone project spans the measure rather than sitting in half of it.
          `grid-cols-1` is `minmax(0, 1fr)`: the implicit track would grow to the
          browser bar's unbroken address and push the card off a phone screen. */}
      <div className={cn("mt-14 grid grid-cols-1 gap-5", PROJECTS.length > 1 && "lg:grid-cols-2")}>
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <ProjectCard project={p} glow={GLOWS[i % GLOWS.length]} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
