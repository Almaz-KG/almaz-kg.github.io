import { Reveal } from "@/components/ui";
import { SOCIALS } from "@/data/content";

/** Four-up grid of handles at the foot of the contact card. */
export function SocialGrid() {
  return (
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
  );
}
