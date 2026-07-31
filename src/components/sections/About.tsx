import { Reveal, Section, SectionHeading } from "@/components/ui";
import { STATS } from "@/data/content";
import { EducationTimeline } from "./EducationTimeline";
import { StatCard } from "./StatCard";

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeading
          index="01"
          kicker="About"
          title={
            <>
              Hi <span className="font-serif italic">👋</span> I make data
              <span className="text-gradient"> behave</span>.
            </>
          }
        />

        <div className="space-y-6">
          <Reveal className="text-lg leading-relaxed text-white/70">
            I&apos;m a Data Engineer with more than <strong className="text-white">10 years</strong>{" "}
            of experience. I&apos;ve always been drawn to high-load and big-data systems, and
            I&apos;ve been lucky enough to chase that curiosity through both work and side projects.
          </Reveal>

          <Reveal delay={80} className="leading-relaxed text-white/50">
            These days that means cloud-native platforms on GCP — Airflow and dbt for the pipelines,
            Terraform for the ground they stand on, and multi-agent systems on Vertex AI that take
            the tedious half of ingestion off my hands. With AI everywhere, the bottleneck moved back
            to where I live: the data. In my free time you&apos;ll find me learning something new —
            usually Rust, systems design, or a book from the shelf below.
          </Reveal>

          <Reveal delay={140}>
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {STATS.map((s) => (
                <StatCard key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </Reveal>

          <EducationTimeline />
        </div>
      </div>
    </Section>
  );
}
