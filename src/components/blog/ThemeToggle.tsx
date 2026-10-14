import { useTheme } from "@/utils/theme";

/**
 * Flips the reading surface between light and dark. Blog pages only.
 *
 * Both icons are always rendered and CSS picks one from `data-theme`, which the
 * inline script in `index.html` sets before the first paint. Choosing in React
 * instead would show the pre-rendered page's guess until hydration.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      title={`Switch to ${next} theme`}
      aria-label={`Switch to ${next} theme`}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-hair text-faint transition-colors hover:border-lime/50 hover:text-lime"
    >
      <SunIcon className="in-data-[theme=light]:hidden" />
      <MoonIcon className="hidden in-data-[theme=light]:block" />
    </button>
  );
}

function SunIcon({ className }: { className: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon({ className }: { className: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
  );
}
