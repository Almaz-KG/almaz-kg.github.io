import type { CSSProperties, ReactNode } from "react";
import { useTilt } from "@/utils/hooks/useTilt";
import { TONE_GLOW } from "@/utils/tones";
import { cn } from "@/utils/cn";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Applied to the content wrapper. Needed to make children real flex items of the card. */
  innerClassName?: string;
  /** Colour of the glow that follows the cursor. */
  glow?: string;
};

/** Glass card that tilts towards the cursor and lights up under it. */
export function TiltCard({
  children,
  className,
  innerClassName,
  glow = TONE_GLOW.lime,
}: TiltCardProps) {
  const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ "--glow": glow } as CSSProperties}
      className={cn(
        "group glass relative overflow-hidden rounded-3xl transition-transform duration-300 ease-out will-change-transform",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), var(--glow), transparent 65%)",
        }}
      />
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}
