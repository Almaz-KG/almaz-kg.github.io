import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Small monospaced tag, used for tech stack labels. */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] tracking-wide text-white/60",
        className,
      )}
    >
      {children}
    </span>
  );
}
