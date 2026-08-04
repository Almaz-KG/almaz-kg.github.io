import type { ReactNode } from "react";
import { useScrolledPast } from "@/utils/hooks/useScrolledPast";
import { cn } from "@/utils/cn";

/**
 * The fixed bar both navigations are built on: invisible over the top of the
 * page, and a solid blurred strip once there is content behind it.
 */
export function TopBar({ children }: { children: ReactNode }) {
  const scrolled = useScrolledPast(80);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        // Opaque enough that the bar's own text stays legible over a dark
        // figure scrolling underneath it.
        scrolled && "border-b border-hair bg-page/92 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        {children}
      </div>
    </header>
  );
}
