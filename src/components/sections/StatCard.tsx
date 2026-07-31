/** Single headline figure from the About stat grid. */
export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-lime/30">
      <div className="text-2xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 font-mono text-[10.5px] tracking-wide text-white/40 uppercase">
        {label}
      </div>
    </div>
  );
}
