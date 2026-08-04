import { TopBar } from "@/components/layout/TopBar";
import { useScrolledPast } from "@/utils/hooks/useScrolledPast";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "./ThemeToggle";

type BlogNavProps = {
  /** Shown in the middle of the bar once the real title has scrolled away. */
  title?: string;
  /** Marks the current page so its link is not offered as somewhere to go. */
  current: "index" | "post";
};

export function BlogNav({ title, current }: BlogNavProps) {
  const scrolled = useScrolledPast(120);

  return (
    <TopBar>
      <a
        href="/"
        className="group flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-faint uppercase transition-colors hover:text-copy"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
        <span className="hidden sm:inline">Almaz Murzabekov</span>
        <span className="sm:hidden">Home</span>
      </a>

      {title && (
        <p
          className={cn(
            "hidden min-w-0 flex-1 truncate text-center text-sm text-muted transition-opacity duration-300 sm:block",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        >
          {title}
        </p>
      )}

      <div className={cn("flex shrink-0 items-center gap-3", !title && "ml-auto", "sm:gap-4")}>
        {current === "post" && (
          <a
            href="/blog"
            className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase transition-colors hover:text-lime"
          >
            All notes
          </a>
        )}

        <a
          href="/rss.xml"
          title="RSS feed"
          aria-label="RSS feed"
          className="text-faint transition-colors hover:text-lime"
        >
          <RssIcon />
        </a>

        <ThemeToggle />
      </div>
    </TopBar>
  );
}

function RssIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5.5" cy="18.5" r="2.5" />
      <path d="M3 10.5v3a7 7 0 0 1 7 7h3a10 10 0 0 0-10-10Z" />
      <path d="M3 3.5v3a14 14 0 0 1 14 14h3A17 17 0 0 0 3 3.5Z" />
    </svg>
  );
}
