import { SOCIALS } from "@/data/content";

/** Inline row of social links under the hero copy. */
export function HeroSocials() {
  return (
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="group font-mono text-[12px] text-white/40 transition-colors hover:text-lime"
        >
          <span className="text-white/25 group-hover:text-lime/60">↗ </span>
          {s.label}
        </a>
      ))}
    </div>
  );
}
