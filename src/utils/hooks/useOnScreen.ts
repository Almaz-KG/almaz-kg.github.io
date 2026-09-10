import { useEffect, useRef, useState } from "react";

/**
 * Reports whether the element is on screen, and keeps reporting — `useInView`
 * latches on the first hit because a reveal only ever plays once, while this is
 * for animations that should stand still while they are scrolled past.
 *
 * Starts `true` so the first paint animates without waiting for the observer's
 * initial callback, which lands a frame later.
 */
export function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, onScreen };
}
