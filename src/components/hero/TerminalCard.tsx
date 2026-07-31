/** Decorative terminal window showing a multi-agent staging pipeline. */
export function TerminalCard() {
  return (
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
            <span className="text-lime">✔ 128 models</span>
          </code>
        </pre>
      </div>
    </div>
  );
}
