import { Reveal } from "@/components/ui";
import { TIMELINE } from "@/data/content";

/** Vertical rule of degrees, newest first. */
export function EducationTimeline() {
  return (
    <Reveal delay={180} className="space-y-3 pt-4">
      <div className="font-mono text-[10.5px] tracking-[0.28em] text-white/30 uppercase">
        Education
      </div>

      {TIMELINE.map((t) => (
        <div
          key={t.period}
          className="flex flex-col gap-1 border-l-2 border-white/10 pl-4 transition-colors hover:border-aqua sm:flex-row sm:items-baseline sm:gap-4"
        >
          <span className="font-mono text-[11px] whitespace-nowrap text-white/35">{t.period}</span>
          <span>
            <span className="text-white/85">{t.title}</span>
            <span className="ml-2 text-sm text-white/40">{t.org}</span>
          </span>
        </div>
      ))}
    </Reveal>
  );
}
