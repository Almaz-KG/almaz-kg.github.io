import { useRef, type MouseEvent } from "react";

/**
 * Tilts an element towards the cursor and publishes the pointer position as
 * `--mx` / `--my` so a highlight can follow it. Written straight to `style` —
 * this runs on every mousemove, and React state would re-render the subtree.
 *
 * Spread the returned handlers onto the element and hand it the returned ref.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 5) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * maxDeg}deg) rotateY(${(x - 0.5) * maxDeg}deg) translateY(-3px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  };

  return { ref, onMouseMove, onMouseLeave };
}
