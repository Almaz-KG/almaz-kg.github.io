import { Suspense, lazy } from "react";
import { Home } from "@/components/Home";
import { Colophon } from "@/components/layout/Colophon";
import { RunningHead } from "@/components/layout/RunningHead";
import { usePath } from "@/utils/router";

const BlogRoute = lazy(() =>
  import("@/components/blog/BlogRoute").then((m) => ({ default: m.BlogRoute })),
);

export default function App() {
  const path = usePath();

  return (
    // A column as tall as the screen, so on a short page - the 404, an empty
    // filter - the colophon sits at the foot of it rather than mid-screen.
    <div className="flex min-h-svh flex-col">
      <RunningHead />

      <main className="flex-1">
        {path === "/" ? (
          <Home />
        ) : (
          // Holds the viewport open while the blog chunk arrives, so the
          // colophon does not flash into the middle of the screen.
          <Suspense fallback={<div className="min-h-screen" />}>
            <BlogRoute path={path} />
          </Suspense>
        )}
      </main>

      <Colophon />
    </div>
  );
}
