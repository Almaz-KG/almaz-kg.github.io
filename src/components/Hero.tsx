import { useEffect, useState } from "react";
import avatar from "../assets/almaz-avatar.webp";
import { ROLES, SOCIALS } from "../data/content";

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const full = ROLES[i % ROLES.length];
    const done = !del && text === full;
    const empty = del && text === "";

    if (done) {
      const t = setTimeout(() => setDel(true), 1700);
      return () => clearTimeout(t);
    }
    if (empty) {
      setDel(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(
      () => setText(del ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
      del ? 34 : 68,
    );
    return () => clearTimeout(t);
  }, [text, del, i]);

  return (
    <span className="font-mono text-lime">
      {text}
      <span className="animate-blink ml-0.5 inline-block w-[2px] translate-y-[2px] bg-lime align-middle text-transparent">
        |
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <div id="top" className="relative mx-auto w-full max-w-6xl px-5 pt-32 pb-10 sm:px-8 sm:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="group relative shrink-0">
              <span className="absolute -inset-2 rounded-full bg-[conic-gradient(from_140deg,rgba(182,255,46,0.35),rgba(47,240,208,0.25),rgba(139,123,255,0.35),rgba(182,255,46,0.35))] opacity-70 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative rounded-full bg-gradient-to-br from-lime/70 via-aqua/40 to-violet/70 p-[1.5px]">
                <div className="overflow-hidden rounded-full bg-gradient-to-br from-lime/20 via-ink-3 to-violet/20">
                  <img
                    src={avatar}
                    alt="Almaz Murzabekov"
                    width={320}
                    height={320}
                    decoding="async"
                    className="h-14 w-14 scale-[1.04] object-cover transition-transform duration-500 group-hover:scale-110 sm:h-16 sm:w-16"
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/[0.07] px-3 py-1.5 font-mono text-[11px] tracking-wider text-lime/90 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
              </span>
              Available for challenging data problems
            </div>
          </div>

          <h1 className="mt-7 text-[clamp(2.9rem,9vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.04em]">
            <span className="block">Almaz</span>
            <span className="text-gradient block">Murzabekov</span>
          </h1>

          <p className="mt-6 text-lg text-white/60 sm:text-xl">
            <Typewriter />
            <span className="mx-2 text-white/20">/</span>
            <span>10+ years wrangling big data</span>
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            I design and run the unglamorous machinery behind analytics and AI — cloud data
            platforms, streaming pipelines, agents that handle the boring half of ingestion, and the
            CI that keeps them all honest. Occasionally I write about it. Occasionally in{" "}
            <span className="font-mono text-citrus">Rust</span>.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group relative overflow-hidden rounded-full bg-lime px-6 py-3 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-aqua to-lime transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Let&apos;s talk data →</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group font-mono text-[12px] text-white/40 transition-colors hover:text-lime"
              >
                <span className="text-white/25 group-hover:text-lime/60">↗ </span>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Terminal card */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[conic-gradient(from_140deg,rgba(182,255,46,0.16),rgba(47,240,208,0.12),rgba(139,123,255,0.16),rgba(182,255,46,0.16))] blur-2xl" />
          <div className="glass relative overflow-hidden rounded-3xl">
            <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-citrus/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-lime/80" />
              <span className="ml-3 font-mono text-[11px] text-white/35">
                staging_agent.py — running
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-white/70">
              <code>
                <span className="text-violet">from</span> google.adk.agents{" "}
                <span className="text-violet">import</span> SequentialAgent{"\n\n"}
                <span className="text-white/30"># profile → model → dry-run → land</span>
                {"\n"}
                staging = SequentialAgent({"\n"}
                {"  "}name=<span className="text-aqua">&quot;dbt_staging&quot;</span>,{"\n"}
                {"  "}sub_agents=[{"\n"}
                {"    "}profiler, <span className="text-white/30"># sniff schema + types</span>
                {"\n"}
                {"    "}modeler, <span className="text-white/30"># emit staging SQL</span>
                {"\n"}
                {"    "}checker, <span className="text-white/30"># dbt build --empty</span>
                {"\n"}
                {"  "}])
                {"\n\n"}
                staging.run(source=<span className="text-aqua">&quot;raw.sensor_feed&quot;</span>,
                {"\n"}
                {"  "}autoland=<span className="text-citrus">True</span>)
                {"\n\n"}
                <span className="text-lime">✔ 128 models · 0 manual edits · shipped</span>
              </code>
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
