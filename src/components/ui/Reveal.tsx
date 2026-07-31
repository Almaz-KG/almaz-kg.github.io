import type { ElementType, ReactNode } from "react";
import { useInView } from "@/utils/hooks/useInView";
import { cn } from "@/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms, applied when the element reveals. */
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

/** Fades + lifts its children in the first time they scroll into view. */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Comp = Tag as ElementType;

  return (
    <Comp
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", inView && "is-in", className)}
    >
      {children}
    </Comp>
  );
}
