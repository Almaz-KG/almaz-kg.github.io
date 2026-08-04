import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * The blog's tag chip. Same shape as the landing page's `Pill`, but built from
 * the surface tokens so it survives the light theme.
 */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-hair bg-copy/[0.04] px-3 py-1 font-mono text-[11px] tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
