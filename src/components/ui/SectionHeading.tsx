import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  /** Two-digit section number, e.g. "01". */
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
};

/** Numbered kicker, headline and optional intro paragraph, revealed in sequence. */
export function SectionHeading({ index, kicker, title, intro }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <Reveal className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-white/40 uppercase">
        <span className="text-lime">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        <span>{kicker}</span>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>

      {intro && (
        <Reveal delay={140}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
