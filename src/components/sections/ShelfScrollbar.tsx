type ShelfScrollbarProps = {
  /** How far the track is scrolled, 0 → 1. */
  progress: number;
  /** Visible fraction of the track, 0 → 1, used as the thumb width. */
  thumbSize: number;
  label: string;
};

/** Read-only scroll indicator under the shelf. */
export function ShelfScrollbar({ progress, thumbSize, label }: ShelfScrollbarProps) {
  return (
    <div className="mt-6 flex items-center gap-5">
      <div className="relative h-px flex-1 bg-white/10">
        <div
          className="absolute inset-y-0 rounded-full bg-lime/70 transition-[left] duration-150 ease-out"
          style={{ width: `${thumbSize * 100}%`, left: `${progress * (1 - thumbSize) * 100}%` }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
        {label}
      </span>
    </div>
  );
}
