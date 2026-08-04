import { Reveal, Section } from "@/components/ui";
import { SITE } from "@/data/content";
import { sectionIndex } from "@/data/sections";
import { SocialGrid } from "./SocialGrid";

export function Contact() {
  return (
    <Section id="contact" className="pb-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:p-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(182,255,46,0.16),transparent_60%)]" />
        <div className="animate-spin-slow absolute -top-40 -right-40 h-96 w-96 rounded-full border border-dashed border-white/10" />

        <Reveal className="font-mono text-[11px] tracking-[0.28em] text-lime uppercase">
          {sectionIndex("contact")} - Contact
        </Reveal>

        <Reveal delay={70}>
          <h2 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Got a messy data problem? <span className="text-gradient">I like those.</span>
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

        <SocialGrid />
      </div>
    </Section>
  );
}
