import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

/* ---------------------------------- reveal --------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as any;
  return (
    <Comp
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", seen && "is-in", className)}
    >
      {children}
    </Comp>
  );
}

/* --------------------------------- section --------------------------------- */

export function SectionHeading({
  index,
  kicker,
  title,
  intro,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Reveal className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-white/40 uppercase">
        <span className="text-lime">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        <span>{kicker}</span>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={140}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32",
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ---------------------------------- pill ----------------------------------- */

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] tracking-wide text-white/60",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------- tilt card -------------------------------- */

export function TiltCard({
  children,
  className,
  innerClassName,
  glow = "rgba(182,255,46,0.16)",
}: {
  children: ReactNode;
  className?: string;
  /** Applied to the content wrapper. Needed to make children real flex items of the card. */
  innerClassName?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-3px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ["--glow" as any]: glow }}
      className={cn(
        "group relative overflow-hidden rounded-3xl transition-transform duration-300 ease-out will-change-transform",
        "glass",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), var(--glow), transparent 65%)",
        }}
      />
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}
