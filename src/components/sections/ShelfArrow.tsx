import { cn } from "@/utils/cn";

type ShelfArrowProps = {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
};

/** Pages the bookshelf one screenful at a time. */
export function ShelfArrow({ dir, onClick, disabled }: ShelfArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous books" : "Next books"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300",
        disabled
          ? "cursor-not-allowed opacity-25"
          : "hover:border-lime/50 hover:text-lime active:scale-95",
      )}
    >
      <span aria-hidden className="text-lg leading-none">
        {dir === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}
