import { Reveal, Section, SectionHeading, Pill, TiltCard } from "./ui";
import { PROJECTS, SITE, SOCIALS } from "../data/content";

/* --------------------------------- projects --------------------------------- */

const PROJECT_GLOW = ["rgba(182,255,46,0.16)", "rgba(139,123,255,0.18)"];

const TRAFFIC_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"];

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
            <TiltCard
              glow={PROJECT_GLOW[i % 2]}
              className="h-full"
              innerClassName="flex h-full flex-col"
            >
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${p.title}`}
                className="block"
              >
                <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-3">
                  <span className="flex shrink-0 gap-1.5">
                    {TRAFFIC_LIGHTS.map((c) => (
                      <span
                        key={c}
                        style={{ background: c }}
                        className="h-2.5 w-2.5 rounded-full opacity-60"
                      />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded-md bg-black/25 px-3 py-1 text-center font-mono text-[10.5px] text-white/40">
                    {new URL(p.href).host}
                  </span>
                </div>
              </a>

              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="flex items-center gap-4">
                  <img
                    src={p.logo}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-xl bg-white/[0.05] object-contain p-1.5 ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                      {p.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-white/35">
                      <span className="truncate">{p.kind}</span>
                      <span className="text-white/20">/</span>
                      <span className="shrink-0">{p.year}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 flex-1 leading-relaxed text-white/55">{p.body}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-lime transition-transform hover:translate-x-1"
                  >
                    Visit <span>↗</span>
                  </a>
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
                    >
                      Source <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------- contact --------------------------------- */

export function Contact() {
  return (
    <Section id="contact" className="pb-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:p-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(182,255,46,0.16),transparent_60%)]" />
        <div className="animate-spin-slow absolute -top-40 -right-40 h-96 w-96 rounded-full border border-dashed border-white/10" />

        <Reveal className="font-mono text-[11px] tracking-[0.28em] text-lime uppercase">
          05 — Contact
        </Reveal>
        <Reveal delay={70}>
          <h2 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Got a messy data problem?{" "}
            <span className="text-gradient">I like those.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-xl leading-relaxed text-white/55">
            Consulting, collaboration, a podcast, or just an argument about whether the medallion
            architecture is over-hyped — my inbox is open.
          </p>
        </Reveal>

        <Reveal delay={170}>
          <a
            href={`mailto:${SITE.email}`}
            className="group mt-9 inline-flex flex-wrap items-center gap-3 rounded-full bg-bone px-6 py-4 text-ink transition-transform duration-300 hover:scale-[1.02]"
          >
            <span className="font-mono text-sm sm:text-base">{SITE.email}</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group bg-ink-2 p-5 transition-colors hover:bg-ink-3"
              >
                <div className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                  {s.label}
                </div>
                <div className="mt-2 truncate text-sm text-white/75 transition-colors group-hover:text-lime">
                  {s.handle}
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 font-mono text-[11px] text-white/30 sm:flex-row">
        <span>© {new Date().getFullYear()} Almaz Murzabekov</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
          built with react, vite &amp; with AI companions
        </span>
      </div>
    </footer>
  );
}
