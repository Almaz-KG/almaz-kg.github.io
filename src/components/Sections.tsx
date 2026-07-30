import { Reveal, Section, SectionHeading, Pill, TiltCard } from "./ui";
import { FOCUS, STACK_GROUPS, STATS, TIMELINE } from "../data/content";

const GLOW: Record<string, string> = {
  lime: "rgba(182,255,46,0.16)",
  aqua: "rgba(47,240,208,0.16)",
  violet: "rgba(139,123,255,0.18)",
  citrus: "rgba(255,122,69,0.16)",
};

const TEXT: Record<string, string> = {
  lime: "text-lime",
  aqua: "text-aqua",
  violet: "text-violet",
  citrus: "text-citrus",
};

/* ----------------------------------- about ---------------------------------- */

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
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-lime/30"
                >
                  <div className="text-2xl font-semibold tracking-tight text-white">{s.value}</div>
                  <div className="mt-1 font-mono text-[10.5px] tracking-wide text-white/40 uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180} className="space-y-3 pt-4">
            <div className="font-mono text-[10.5px] tracking-[0.28em] text-white/30 uppercase">
              Education
            </div>
            {TIMELINE.map((t) => (
              <div
                key={t.period}
                className="flex flex-col gap-1 border-l-2 border-white/10 pl-4 transition-colors hover:border-aqua sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="font-mono text-[11px] whitespace-nowrap text-white/35">
                  {t.period}
                </span>
                <span>
                  <span className="text-white/85">{t.title}</span>
                  <span className="ml-2 text-sm text-white/40">{t.org}</span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------- focus ---------------------------------- */

const FOCUS_COLORS = ["lime", "aqua", "violet", "citrus"];

export function Focus() {
  return (
    <Section id="focus">
      <SectionHeading
        index="02"
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
        {FOCUS.map((f, i) => {
          const col = FOCUS_COLORS[i % 4];
          return (
            <Reveal key={f.n} delay={i * 70}>
              <TiltCard glow={GLOW[col]} className="h-full p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className={`font-mono text-xs ${TEXT[col]}`}>{f.n}</span>
                  <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] transition-transform duration-500 group-hover:rotate-90" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-white/55">{f.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ----------------------------------- stack ---------------------------------- */

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
          <Reveal key={g.title} delay={i * 60} className="bg-ink-2/80 p-7 backdrop-blur-sm">
            <h3 className="font-mono text-[11px] tracking-[0.24em] text-lime uppercase">
              {g.title}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="group flex items-center gap-3 text-[15px] text-white/60 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-white/25 transition-all group-hover:w-4 group-hover:bg-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
