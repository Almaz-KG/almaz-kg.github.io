import { useTypewriter } from "@/utils/hooks/useTypewriter";
import { useOnScreen } from "@/utils/hooks/useOnScreen";
import { ROLES } from "@/data/content";
import { cn } from "@/utils/cn";

/** Cycles through the role list, one character at a time, behind a blinking caret. */
export function Typewriter() {
  const { ref, onScreen } = useOnScreen<HTMLSpanElement>();
  const text = useTypewriter(ROLES, { active: onScreen });

  return (
    // Its own line until the column can hold the whole subtitle on one. Every
    // typed character changes this span's width, and inline in a column too
    // narrow for the longest role that moves the line break back and forth,
    // which shifts the whole page below it, character by character.
    <span ref={ref} className="block text-left font-mono text-lime @min-[36rem]:inline-block">
      {text}
      <span
        className={cn(
          "ml-0.5 inline-block w-[2px] translate-y-[2px] bg-lime align-middle text-transparent",
          onScreen && "animate-blink",
        )}
      >
        |
      </span>
    </span>
  );
}
