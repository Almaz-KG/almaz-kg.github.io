import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type SectionProps = {
  /** Anchor target for the in-page navigation. */
  id: string;
  children: ReactNode;
  className?: string;
};

/** Page-width wrapper shared by every top-level section. */
export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32",
        className,
      )}
    >
      {children}
    </section>
  );
}
