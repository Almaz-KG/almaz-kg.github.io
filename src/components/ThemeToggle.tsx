import { useTheme } from "@/utils/theme";

/**
 * Flips the site between light and dark.
 *
 * The icon is one drawing, a half-filled circle, and CSS turns it to face the
 * other way in the dark theme from `data-theme`, which the inline script in
 * `index.html` sets before the first paint. Choosing in React instead would
 * show the pre-rendered page's guess until hydration.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      title={`Switch to the ${next} theme`}
      aria-label={`Switch to the ${next} theme`}
      className="-m-2 flex h-9 w-9 cursor-pointer items-center justify-center text-muted transition-colors hover:text-accent"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="transition-transform duration-300 in-data-[theme=dark]:rotate-180"
      >
        <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.25a6.75 6.75 0 0 1 0 13.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
