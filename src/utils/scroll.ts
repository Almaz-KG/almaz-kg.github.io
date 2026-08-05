/**
 * In-page scrolling, animated by the app instead of by the browser.
 *
 * The obvious way to move to a heading is `scroll-behavior: smooth` on `html`
 * and the browser's own fragment handling. It is not dependable: a smooth
 * scroll is an animation, and every layer that can switch animations off -
 * the OS reduced-motion setting, an extension, a browser flag - can turn it
 * into a silent no-op rather than an instant jump. A contents link that lands
 * nowhere is a worse failure than one that jumps, and it fails invisibly.
 *
 * So the animation lives here, in a rAF loop over `behavior: "instant"` steps,
 * which every browser performs the same way. `scroll-margin-top` stays the
 * source of truth for the offset, so the sticky header clearance is still set
 * once in CSS next to the heading it belongs to.
 */

import { prefersReducedMotion } from "./motion";

/** Stops whatever is in flight, so two clicks never animate against each other. */
let cancelRunning: (() => void) | null = null;

/**
 * Runs `fn` the first time the reader moves the page themselves, and returns
 * the way to stop watching. Nothing here may keep scrolling the page after
 * that: a reader who has taken hold of it has changed their mind.
 */
function onInterrupt(fn: () => void): () => void {
  const events = ["wheel", "touchstart", "keydown"];
  const off = () => events.forEach((type) => window.removeEventListener(type, fn));

  events.forEach((type) => window.addEventListener(type, fn, { passive: true }));
  return off;
}

/**
 * Brings the element with `id` to the top of the viewport, clear of the sticky
 * header by its own `scroll-margin-top`. `animate` is off for history restores,
 * which land rather than travel.
 *
 * Returns `false` when nothing has that id - a post body is a lazy chunk, so a
 * deep link can be handled before the heading it points at exists - which lets
 * the caller decide whether to fall back or to try again later.
 */
export function scrollToId(id: string, options: { animate?: boolean } = {}): boolean {
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;

  const clearance = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - clearance;

  run(top, options.animate !== false && !prefersReducedMotion());
  return true;
}

/**
 * `scrollToId`, held in place while the layout underneath it is still settling.
 *
 * A post's figures load lazily and carry no intrinsic size, so the document
 * keeps growing for as long as images keep arriving, and a heading that was in
 * the right place the moment we scrolled to it is no longer there a beat later.
 * Re-asserting the position on every height change - briefly, and only until
 * the reader touches the page - costs less than teaching the build the aspect
 * ratio of every image a post might contain.
 */
export function scrollToIdSettling(id: string, settleFor = 2000): void {
  if (!scrollToId(id, { animate: false })) return;

  const observer = new ResizeObserver(() => scrollToId(id, { animate: false }));
  const stop = () => {
    observer.disconnect();
    clearTimeout(timer);
    releaseInterrupt();
  };

  const timer = window.setTimeout(stop, settleFor);
  const releaseInterrupt = onInterrupt(stop);

  observer.observe(document.documentElement);
}

function run(to: number, animate: boolean): void {
  cancelRunning?.();

  const furthest = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(to, furthest));
  const start = window.scrollY;
  const distance = end - start;

  if (!animate || Math.abs(distance) < 2) {
    window.scrollTo({ top: end, behavior: "instant" });
    return;
  }

  // Sub-linear in the distance: past a screen or two the reader has stopped
  // following the page and is only waiting for an animation to finish.
  const duration = Math.min(700, 240 + Math.abs(distance) * 0.12);
  const startedAt = performance.now();
  let frame = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    releaseInterrupt();
    cancelRunning = null;
  };

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo({ top: start + distance * easeOut(progress), behavior: "instant" });

    if (progress < 1) frame = requestAnimationFrame(step);
    else stop();
  };

  const releaseInterrupt = onInterrupt(stop);

  cancelRunning = stop;
  frame = requestAnimationFrame(step);
}

function easeOut(progress: number): number {
  return 1 - (1 - progress) ** 3;
}
