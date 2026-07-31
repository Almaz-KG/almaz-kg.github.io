import { useTypewriter } from "@/utils/hooks/useTypewriter";
import { ROLES } from "@/data/content";

/** Cycles through the role list, one character at a time, behind a blinking caret. */
export function Typewriter() {
  const text = useTypewriter(ROLES);

  return (
    <span className="inline-block text-left font-mono text-lime">
      {text}
      <span className="animate-blink ml-0.5 inline-block w-[2px] translate-y-[2px] bg-lime align-middle text-transparent">
        |
      </span>
    </span>
  );
}
