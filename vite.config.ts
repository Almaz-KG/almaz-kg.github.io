import { execFileSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { blog } from "./plugins/blog";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE = "https://almaz.murzabekov.net";

/**
 * The commit this build was made from, printed in the colophon as the
 * document's revision. Read at config time, so the client bundle and the
 * pre-render agree on it. A checkout without git history still builds.
 */
function revision(): { sha: string; date: string } {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%h%n%cs"], { cwd: __dirname });
    const [sha, date] = out.toString().trim().split("\n");
    return { sha, date };
  } catch {
    return { sha: "unknown", date: "" };
  }
}

// https://vite.dev/config/
export default defineConfig({
  // `static/` is served at the site root in dev and copied verbatim into dist/
  // on build. Files here are referenced by absolute path, e.g. the post
  // images at /assets/images/posts/ and the webfonts at /assets/fonts/.
  publicDir: "static",
  define: {
    __SITE_REVISION__: JSON.stringify(revision()),
  },
  plugins: [
    react(),
    tailwindcss(),
    // Compiles content/posts/*.md and emits rss.xml and sitemap.xml. See
    // plugins/blog.ts; the per-route HTML comes from scripts/prerender.ts.
    blog({
      dir: "content/posts",
      site: SITE,
      title: "Almaz Murzabekov - Notes",
      description:
        "Notes on data platforms, distributed systems, Rust and the parts of infrastructure that only make sense once you have been burned by them.",
      author: "almaz@murzabekov.net (Almaz Murzabekov)",
      // `npm run dev` renders drafts and scheduled posts with a badge, so they
      // can be read back while being written. Set this to false to make the dev
      // server show exactly what a build would. Builds never ship them either way.
      previewUnpublished: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
