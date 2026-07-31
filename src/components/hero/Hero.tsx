import { AvailabilityBadge } from "./AvailabilityBadge";
import { HeroAvatar } from "./HeroAvatar";
import { HeroSocials } from "./HeroSocials";
import { ResumeLink } from "./ResumeLink";
import { TerminalCard } from "./TerminalCard";
import { Typewriter } from "./Typewriter";

export function Hero() {
  return (
    <div id="top" className="relative mx-auto w-full max-w-6xl px-5 pt-32 pb-10 sm:px-8 sm:pt-40">
      <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-3">
        <HeroAvatar />
        <AvailabilityBadge />
        <ResumeLink />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <h1 className="text-[clamp(2.9rem,9vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.04em]">
            <span className="block">Almaz</span>
            <span className="text-gradient block">Murzabekov</span>
          </h1>

          <p className="mt-6 text-lg text-white/60 sm:text-xl">
            <Typewriter />
            <span className="mx-2 text-white/20">/</span>
            <span>10+ years wrangling big data</span>
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            I design and run the unglamorous machinery behind analytics and AI — cloud data
            platforms, streaming pipelines, agents that handle the boring half of ingestion, and the
            CI that keeps them all honest. Occasionally I write about it. Occasionally in{" "}
            <span className="font-mono text-citrus">Rust</span>.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group relative overflow-hidden rounded-full bg-lime px-6 py-3 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-aqua to-lime transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Let&apos;s talk data →</span>
            </a>
          </div>

          <HeroSocials />
        </div>

        <TerminalCard />
      </div>
    </div>
  );
}
