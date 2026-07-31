import { useScrollProgress } from "@/utils/hooks/useScrollProgress";

/** Hairline reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed inset-x-0 top-0 z-[55] h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-lime via-aqua to-violet transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
