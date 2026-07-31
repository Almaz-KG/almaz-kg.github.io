/** Opens the CV in a new tab; the arrow nudges down on hover. */
export function ResumeLink() {
  return (
    <a
      href="/cv.pdf"
      target="_blank"
      rel="noreferrer"
      className="group ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2.5 font-mono text-[11px] tracking-wider text-white/55 uppercase transition-colors hover:border-lime/40 hover:bg-lime/[0.07] hover:text-lime sm:px-3 sm:py-1.5"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
      >
        <path d="M12 3v12" />
        <path d="m7 11 5 5 5-5" />
        <path d="M5 20h14" />
      </svg>
      Resume
    </a>
  );
}
