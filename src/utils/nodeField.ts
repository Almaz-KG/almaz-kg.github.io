type Point = { x: number; y: number; vx: number; vy: number; r: number };

/** Squared distance at which two nodes stop being linked. */
const LINK_RANGE_SQ = 19000;
/** One node per this many square pixels, clamped to [MIN, MAX]_NODES. */
const AREA_PER_NODE = 26000;
const MIN_NODES = 26;
const MAX_NODES = 70;

/**
 * Animated node/edge network — a nod to data pipelines & graphs.
 *
 * Drives the canvas directly instead of through React state: it repaints every
 * frame, so a re-render per frame would be pure waste. Returns a stop function
 * that cancels the loop and detaches the resize observer.
 */
export function startNodeField(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let raf = 0;
  let w = 0;
  let h = 0;
  let points: Point[] = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(MAX_NODES, Math.max(MIN_NODES, (w * h) / AREA_PER_NODE)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const drift = () => {
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
  };

  const drawEdges = () => {
    ctx.lineWidth = 0.6;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= LINK_RANGE_SQ) continue;

        ctx.strokeStyle = `rgba(150,220,190,${(1 - d2 / LINK_RANGE_SQ) * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  };

  const drawNodes = () => {
    ctx.fillStyle = "rgba(182,255,46,0.5)";
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    drift();
    drawEdges();
    drawNodes();
    raf = requestAnimationFrame(tick);
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  tick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
  };
}
