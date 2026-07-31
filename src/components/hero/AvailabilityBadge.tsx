/** "Available for work" chip with a pinging status dot. */
export function AvailabilityBadge() {
  return (
    <div className="order-last flex w-full items-center gap-2 rounded-full border border-lime/25 bg-lime/[0.07] px-3 py-1.5 font-mono text-[11px] tracking-wider text-lime/90 uppercase sm:order-none sm:w-auto">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
      </span>
      Available for challenging data problems
    </div>
  );
}
