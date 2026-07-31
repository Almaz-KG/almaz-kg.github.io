import { useEffect, useRef, useState } from "react";

/** Slightly early on the way in, so the reveal finishes before the element is centred. */
const OPTIONS: IntersectionObserverInit = { threshold: 0.12, rootMargin: "0px 0px -8% 0px" };

/**
 * Flips to `true` the first time the element enters the viewport and stays
 * there — reveals are one-way, so the observer disconnects on the first hit.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      io.disconnect();
    }, OPTIONS);

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}
