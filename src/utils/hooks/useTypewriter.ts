import { useEffect, useState } from "react";

type Options = {
  /** Delay between typed characters. */
  typeMs?: number;
  /** Delay between deleted characters — deleting reads better when it is faster. */
  deleteMs?: number;
  /** How long a finished word sits on screen before it is erased. */
  holdMs?: number;
};

/**
 * Types each word out, holds it, erases it, then moves to the next — looping
 * forever. Returns the text as it currently stands.
 */
export function useTypewriter(
  words: readonly string[],
  { typeMs = 68, deleteMs = 34, holdMs = 1700 }: Options = {},
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((v) => v + 1);
      return;
    }

    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? deleteMs : typeMs,
    );
    return () => clearTimeout(t);
  }, [words, index, text, deleting, typeMs, deleteMs, holdMs]);

  return text;
}
