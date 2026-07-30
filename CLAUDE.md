# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal site / portfolio for Almaz Murzabekov (almaz.murzabekov.net), a single-page React app.
It is a full rewrite: commit `8fc3129 chore: nuke the project` removed the previous Astro site, and the current `src/`, `index.html`, and configs are the replacement.

## Commands

```bash
npm run dev        # vite dev server
npm run build      # production build -> dist/index.html
npm run preview    # serve the built output
npx tsc --noEmit   # typecheck (the build does NOT typecheck)
```

There is no lint or test setup, and `.github/workflows/` is empty (no CI).
`npx tsc --noEmit` is the only correctness gate, so run it after edits.

## Build model

`vite-plugin-singlefile` inlines all JS and CSS, so `npm run build` emits **one self-contained `dist/index.html`** (~300 kB) with no separate asset files.
Consequences worth remembering:

- Do not add code that fetches sibling files at runtime or relies on hashed asset URLs.
- `publicDir` is `static/`, not `public/`. Files there are copied verbatim into `dist/` and are **not** inlined, so the deployable output is `dist/index.html` **plus** `dist/assets/`. Reference them by absolute path (`/assets/images/...`), never through a bundler import.
- Google Fonts (Space Grotesk, JetBrains Mono, Instrument Serif) are loaded via `<link>` in `index.html`, which is the one external dependency at runtime.

`@/*` is aliased to `src/*` in both `vite.config.ts` and `tsconfig.json`, though existing code mostly uses relative imports.

## Architecture

`src/main.tsx` mounts `App`, which composes the entire page as an ordered stack of section components:

```
Backdrop + CursorGlow + ScrollProgress + Nav   (fixed/absolute chrome)
Hero, About, Focus, Stack, Writing, Blog, Projects, Shelf, Contact, Footer
```

Three conventions hold across the codebase:

**Content lives in `src/data/content.ts`.**
`SITE`, `SOCIALS`, `STATS`, `FOCUS`, `STACK_GROUPS`, `POSTS`, `PROJECTS`, `BOOKS`, `TIMELINE` are plain exported arrays consumed by the section components.
Copy edits (adding a post, a project, a book) belong here, not in JSX.

**`src/components/ui.tsx` holds the shared primitives.**
`Section` (max-width + padding + anchor id), `SectionHeading` (numbered kicker + title + intro), `Reveal` (IntersectionObserver-driven scroll-in animation), `Pill`, and `TiltCard` (mouse-tracking 3D tilt with a radial glow driven by `--mx`/`--my` CSS vars).
New sections should reuse these rather than re-implementing spacing or reveal logic.

**Section numbering is manual.**
Each section passes a hardcoded `index` string to `SectionHeading`: About `01`, Focus `02`, Stack `03`, Writing `04`, Projects `05`, Shelf `06`, Blog `07`.
Inserting or reordering a section means renumbering the neighbours by hand.

`Sections.tsx` and `Sections2.tsx` are an arbitrary split (About/Focus/Stack vs Writing/Projects/Shelf/Contact/Footer), not a semantic boundary.

`Blog.tsx` is the only stateful section: it swaps between a post list and an inline post reader via local `useState`, with no router and no URL change.
Post bodies are `\n\n`-separated plain-text strings in `POSTS[].content`, rendered as paragraphs; there is no Markdown pipeline.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite`, configured entirely in `src/index.css` with `@theme` (no `tailwind.config.js`).
The design tokens defined there are the palette: `ink`/`ink-2`/`ink-3` (near-black backgrounds), `bone` (text), and the accents `lime` `#b6ff2e`, `aqua`, `violet`, `citrus`.
Use these token names (`text-lime`, `bg-ink`) rather than raw hex.

Custom utilities in `index.css`: `.glass` (the standard card/nav surface), `.grain` (fixed SVG noise overlay on the root), `.text-gradient`, `.reveal`/`.is-in`, and the `animate-float-slow` / `animate-marquee` / `animate-blink` / `animate-spin-slow` keyframe helpers.

A `prefers-reduced-motion` block at the bottom of `index.css` neutralises animations and forces `.reveal` visible.
Any new animation must degrade correctly under it, which means driving motion through CSS animations/transitions rather than JS timers where possible.

Compose class names with `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge) whenever classes are conditional.

## Legacy assets

`static/` is the Vite `publicDir`, so it is a real build input — everything in it lands in `dist/`.
It holds two kinds of things.

Live assets referenced from `src/data/content.ts` by absolute path:
`assets/images/books/covers/*.jpg` (Shelf) and `assets/images/projects/*.webp` (Projects — one homepage screenshot and one logo mark per project).

Leftovers from the old Astro site (post covers, social icons, headshots, `projects/db-academy-io.png`) that nothing references yet.
Treat those as an archive to pull from; they still get copied into `dist/`, so prune rather than accumulate.

Project screenshots are captured with headless Chrome and cropped to 16:9 so the card preview crops cleanly:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --hide-scrollbars --force-dark-mode --enable-features=WebContentsForceDark \
  --screenshot=shot.png --window-size=1440,900 --virtual-time-budget=6000 https://example.com
ffmpeg -i shot.png -vf "crop=1440:820:0:0,scale=1280:-1" -quality 82 out.webp
```

`--force-dark-mode` matters: a light-themed screenshot fights the dark card it sits in.
