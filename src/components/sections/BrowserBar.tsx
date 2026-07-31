const TRAFFIC_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"];

type BrowserBarProps = {
  href: string;
  /** Used for the link label — the bar itself only shows the host. */
  title: string;
};

/** Fake browser chrome: traffic lights plus the project's host in the address bar. */
export function BrowserBar({ href, title }: BrowserBarProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${title}`}
      className="block"
    >
      <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="flex shrink-0 gap-1.5">
          {TRAFFIC_LIGHTS.map((c) => (
            <span
              key={c}
              style={{ background: c }}
              className="h-2.5 w-2.5 rounded-full opacity-60"
            />
          ))}
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-black/25 px-3 py-1 text-center font-mono text-[10.5px] text-white/40">
          {new URL(href).host}
        </span>
      </div>
    </a>
  );
}
