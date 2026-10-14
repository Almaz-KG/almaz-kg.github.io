import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { loadPost } from "./data/posts";
import { initAnalytics } from "./utils/analytics";
import { setRenderedPath } from "./utils/router";

initAnalytics();

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// A build ships every route pre-rendered (scripts/prerender.ts), stamped with
// the path it was rendered for. The dev server ships an empty root.
const rendered = root.dataset.path;

if (rendered === undefined) {
  createRoot(root).render(app);
} else {
  setRenderedPath(rendered);

  // A post page has to hydrate with its body already in memory, or the first
  // render is a loading skeleton that does not match the article on screen.
  // The page stays readable while this arrives: it is the pre-rendered HTML.
  const slug = /^\/blog\/([^/]+)$/.exec(rendered)?.[1];
  const ready = slug ? loadPost(slug) : undefined;

  void Promise.resolve(ready).then(
    () => hydrateRoot(root, app),
    // A stale deploy: this HTML names chunks that no longer exist. Starting
    // from scratch still renders the page; usePost reloads if it must.
    () => createRoot(root).render(app),
  );
}
