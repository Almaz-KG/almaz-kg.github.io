import { Suspense, lazy, useEffect } from "react";
import { Home } from "@/components/Home";
import { Backdrop } from "@/components/layout/Backdrop";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { usePath } from "@/utils/router";
import { setSurface } from "@/utils/theme";
import { cn } from "@/utils/cn";

const BlogRoute = lazy(() =>
  import("@/components/blog/BlogRoute").then((m) => ({ default: m.BlogRoute })),
);

export default function App() {
  const path = usePath();
  const isHome = path === "/";

  // Drives the themed surface tokens in index.css. The inline script in
  // index.html sets this for the first paint; this keeps it right afterwards.
  useEffect(() => setSurface(isHome ? "home" : "reading"), [isHome]);

  return (
    // No `overflow-x` here. It computes to `overflow: hidden auto`, making this
    // a scroll container that never scrolls, and `position: sticky` inside one
    // of those never sticks. `body { overflow-x: hidden }` already clips the
    // landing page's blobs, and it propagates to the viewport instead.
    <div className={cn("relative min-h-screen", isHome && "grain")}>
      {/* The drifting blobs, the grid and the grain are the landing page's
          personality. A post is meant to be read, so it gets a flat surface and
          none of them. */}
      {isHome && <Backdrop />}
      <ScrollProgress />

      <main className="relative z-20">
        {isHome ? (
          <Home />
        ) : (
          // Holds the viewport open while the blog chunk arrives, so the footer
          // does not flash into the middle of the screen.
          <Suspense fallback={<div className="min-h-screen" />}>
            <BlogRoute path={path} />
          </Suspense>
        )}

        <Footer />
      </main>
    </div>
  );
}
