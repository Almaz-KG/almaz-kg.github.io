import { useHead } from "@/utils/head";
import { usePath } from "@/utils/router";
import { BlogNav } from "./BlogNav";

/** Rendered for an unknown path, including one GitHub Pages served as 404.html. */
export function NotFound() {
  const path = usePath();

  useHead({
    title: "Not found - Almaz Murzabekov",
    description: "This page does not exist.",
    path,
  });

  return (
    <>
      <BlogNav current="post" />

      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-5 py-32 sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.28em] text-lime uppercase">404</p>

        <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-balance text-copy sm:text-5xl">
          Nothing lives at this address.
        </h1>

        <p className="mt-5 leading-relaxed text-muted">
          The page you asked for is not here - it may have been renamed, or it may never have
          existed. <code className="font-mono text-sm text-faint">{path}</code>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/blog"
            className="rounded-full border border-lime/40 bg-lime/10 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-lime uppercase transition-colors hover:bg-lime/20"
          >
            All notes
          </a>
          <a
            href="/"
            className="rounded-full border border-hair bg-sheet px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-copy"
          >
            Home
          </a>
        </div>
      </div>
    </>
  );
}
