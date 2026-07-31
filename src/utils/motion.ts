/** True when the OS asks for reduced motion. Read at call time, not cached. */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
