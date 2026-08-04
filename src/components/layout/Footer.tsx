export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-hair pt-8 font-mono text-[11px] text-faint sm:flex-row">
        <span>© {new Date().getFullYear()} Almaz Murzabekov</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
          built with react, vite &amp; with AI companions
        </span>
      </div>
    </footer>
  );
}
