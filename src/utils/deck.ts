/**
 * The slide viewer on a deck post.
 *
 * The markup is finished HTML from `plugins/deck/` - every slide, its text and
 * the control bar - and CSS already shows it as a viewer once `data-js` is set
 * on `<html>`. All this adds is which slide is the current one: the buttons,
 * the slider, the arrow keys and a swipe move it, and the address keeps it as
 * `#slide-NN` so a slide can be linked to and survives a reload.
 *
 * It only toggles classes and attributes inside markup React set once through
 * `dangerouslySetInnerHTML` and never reconciles again, so the two do not
 * fight over the DOM.
 */

/** How far a horizontal swipe has to travel before it turns the slide. */
const SWIPE_PX = 48;

/** Wires up the viewer under `root`, and returns the way to take it down. */
export function mountDeck(root: HTMLElement): () => void {
  const deck = root.querySelector<HTMLElement>(".deck");
  if (!deck) return () => {};

  const rows = [...deck.querySelectorAll<HTMLElement>(".deck-row")];
  const prev = deck.querySelector<HTMLButtonElement>('[data-deck="prev"]')!;
  const next = deck.querySelector<HTMLButtonElement>('[data-deck="next"]')!;
  const range = deck.querySelector<HTMLInputElement>(".deck-range")!;
  const count = deck.querySelector<HTMLElement>(".deck-count b")!;
  const track = deck.querySelector<HTMLElement>(".deck-track")!;

  const pad = (n: number) => String(n).padStart(2, "0");
  let current = -1;

  function show(index: number, updateUrl: boolean): void {
    const to = Math.max(0, Math.min(rows.length - 1, index));
    if (to === current) return;
    current = to;

    rows.forEach((row, i) => {
      const on = i === to;
      row.classList.toggle("is-active", on);
      // `inert` keeps the links on hidden slides out of the tab order and away
      // from screen readers, which `visibility` alone does for the eye only.
      row.inert = !on;
      row.setAttribute("aria-label", `${i + 1} of ${rows.length}`);
    });

    range.value = String(to + 1);
    range.style.setProperty("--p", `${rows.length > 1 ? (to / (rows.length - 1)) * 100 : 100}%`);
    count.textContent = pad(to + 1);
    prev.disabled = to === 0;
    next.disabled = to === rows.length - 1;

    // Replaced, not pushed: paging through forty slides must not leave forty
    // entries for the back button to walk through.
    if (updateUrl) history.replaceState(history.state, "", `#${rows[to].id}`);
  }

  const step = (by: number) => show(current + by, true);
  const fromHash = () => rows.findIndex((row) => row.id === location.hash.slice(1));

  const onPrev = () => step(-1);
  const onNext = () => step(1);
  const onRange = () => show(Number(range.value) - 1, true);

  // Arrows turn the slide only while the viewer is on screen and the reader is
  // not typing somewhere, and never with a modifier held: those belong to the
  // browser. The slider takes its own arrows, so it is left alone too.
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, [contenteditable]")) return;

    const box = deck.getBoundingClientRect();
    if (box.bottom < 0 || box.top > window.innerHeight) return;

    event.preventDefault();
    step(event.key === "ArrowLeft" ? -1 : 1);
  };

  // A link in the address that names a slide, followed while on this page.
  const onHash = () => {
    const at = fromHash();
    if (at !== -1) show(at, false);
  };

  let startX: number | null = null;
  let startY = 0;
  const onDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    startX = event.clientX;
    startY = event.clientY;
  };
  const onUp = (event: PointerEvent) => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    startX = null;
    // Mostly sideways, or it was the page being scrolled.
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);
  range.addEventListener("input", onRange);
  track.addEventListener("pointerdown", onDown);
  track.addEventListener("pointerup", onUp);
  window.addEventListener("keydown", onKey);
  window.addEventListener("hashchange", onHash);

  show(Math.max(0, fromHash()), false);

  return () => {
    prev.removeEventListener("click", onPrev);
    next.removeEventListener("click", onNext);
    range.removeEventListener("input", onRange);
    track.removeEventListener("pointerdown", onDown);
    track.removeEventListener("pointerup", onUp);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("hashchange", onHash);
  };
}
