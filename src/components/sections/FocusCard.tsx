import { Pill, TiltCard } from "@/components/ui";
import { TONE_GLOW, TONE_TEXT, type Tone } from "@/utils/tones";
import type { FOCUS } from "@/data/content";

type FocusCardProps = {
  item: (typeof FOCUS)[number];
  tone: Tone;
};

/** One of the four "what I do" cards. */
export function FocusCard({ item, tone }: FocusCardProps) {
  return (
    <TiltCard glow={TONE_GLOW[tone]} className="h-full p-7 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className={`font-mono text-xs ${TONE_TEXT[tone]}`}>{item.n}</span>
        <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] transition-transform duration-500 group-hover:rotate-90" />
      </div>

      <h3 className="mt-6 text-2xl font-semibold tracking-tight">{item.title}</h3>
      <p className="mt-3 leading-relaxed text-white/55">{item.body}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {item.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    </TiltCard>
  );
}
