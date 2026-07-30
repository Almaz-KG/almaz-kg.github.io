# almaz.murzabekov.net

Source for [almaz.murzabekov.net](https://almaz.murzabekov.net), a personal site and portfolio built as a single-page React app.

The whole site is one long scrolling page composed of independent sections (intro, focus areas, stack, writing, projects, reading shelf, contact).
There is no CMS and no backend: all copy lives in a single typed module, and the production build is one self-contained HTML file.

## Stack

- [React 19](https://react.dev) + TypeScript
- [Vite 7](https://vite.dev) for dev server and build
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`, configured entirely in CSS with `@theme` (no `tailwind.config.js`)
- [`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile) to inline JS and CSS into the emitted HTML

## Getting started

Requires Node 24 (or any recent LTS).

```bash
npm ci
npm run dev        # vite dev server
```

## Commands

```bash
npm run dev        # start the dev server
npm run build      # production build -> dist/
npm run preview    # serve the built output
npm run typecheck  # tsc --noEmit
```

`vite build` does not typecheck, so `npm run typecheck` is the correctness gate and runs in CI on every push and pull request.

## Build output

`vite-plugin-singlefile` inlines every bundled asset, so the build emits a single `dist/index.html` of roughly 320 kB with no sibling JS or CSS files.

`static/` is the Vite `publicDir`, not `public/`.
Its contents are copied verbatim into `dist/` and are deliberately *not* inlined, so the deployable output is `dist/index.html` plus the files copied from `static/` (images, PDF, favicon, `CNAME`).
Anything in `static/` is referenced by absolute path such as `/assets/images/...` rather than through a bundler import.

The only runtime network dependency is Google Fonts, loaded via `<link>` in `index.html`.

## Project layout

```
index.html            # entry document, font links and meta tags
src/
  main.tsx            # mounts <App>
  App.tsx             # composes the ordered stack of sections
  components/         # section components and shared UI primitives
  data/content.ts     # all site copy as typed, exported arrays
  index.css           # Tailwind @theme tokens, custom utilities, keyframes
static/               # publicDir, copied verbatim into dist/
```

Content edits (a new post, project or book) belong in `src/data/content.ts`, not in JSX.
Shared primitives in `src/components/ui.tsx` cover section spacing, headings, scroll-in reveals and card effects, so new sections reuse them rather than reimplementing layout.

Motion is driven by CSS animations and transitions wherever possible so that a `prefers-reduced-motion` block can neutralise it cleanly.

## Deployment

Pushes to `main` are built and published to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The workflow typechecks, builds, uploads `dist/` as a Pages artifact and deploys it with the official Pages actions using OIDC, so no long-lived deploy tokens are stored in the repository.
Pull requests run the same build and typecheck but never deploy.

## License

Code is available for reference.
Site content, copy and images are not licensed for reuse.
