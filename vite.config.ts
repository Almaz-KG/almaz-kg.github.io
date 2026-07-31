import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // `static/` is served at the site root in dev and copied verbatim into dist/
  // on build. Files here are referenced by absolute path, e.g. the book covers
  // at /assets/images/books/covers/*.jpg and the webfonts at /assets/fonts/.
  publicDir: "static",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
