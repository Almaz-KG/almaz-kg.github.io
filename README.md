# almaz.murzabekov.net

Source for [almaz.murzabekov.net](https://almaz.murzabekov.net), a personal site, portfolio and blog built as a React app.

The landing page is one long scroll composed of independent sections (intro, focus areas, projects, writing, reading shelf, contact).
The blog lives at `/blog`, and every post is a markdown file compiled during the build.

## Stack

- [React 19](https://react.dev) + TypeScript
- [Vite 7](https://vite.dev) for dev server and build
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`, configured entirely in CSS with `@theme` (no `tailwind.config.js`)
- [`marked`](https://marked.js.org) and [`shiki`](https://shiki.style) for markdown and syntax highlighting, both `devDependencies` that run only at build time

## Getting started

Requires Node 24 (or any recent LTS).

```bash
npm ci
npm run dev        # vite dev server
```

## Commands

```bash
npm run dev           # start the dev server
npm run build         # production build -> dist/
npm run preview       # serve the built output
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

`vite build` does not typecheck, so `npm run typecheck` is the correctness gate and runs in CI on every push and pull request.

### Checks before a commit

A husky `pre-commit` hook runs lint-staged, which checks the files you actually staged:

| Check                     | Scope                                                 |
| ------------------------- | ----------------------------------------------------- |
| `eslint --max-warnings=0` | staged `.ts`, `.tsx`, `.js`                           |
| `prettier --check`        | staged code, styles, config and markdown              |
| `npm run typecheck`       | the whole project, whenever a TS or JS file is staged |

Nothing is rewritten for you. A failing commit names the file and the fix is `npm run lint -- --fix` or `npm run format`.

lint-staged stashes unstaged work first, so the checks see exactly the tree that is about to become the commit - not whatever else is open in your editor.

`content/` is left out of Prettier on purpose. Posts are prose, and Prettier reflows markdown in ways that fight how they are written.

The same three checks run in CI, which is what actually holds: `git commit --no-verify` skips the hook, and the workflow does not care.

## Writing a post

Create a markdown file in `content/posts/`.
The filename is the slug, so `content/posts/a-new-note.md` is served at `/blog/a-new-note`.

```markdown
---
title: "How this blog works"
description: "One sentence. It is the card copy, the meta description and the link preview."
date: 2026-08-04
tags: [meta, vite, markdown]
cover: /assets/images/posts/how-this-blog-works-cover.svg
coverAlt: "A markdown file, a build step, and a page"
coverFit: cover
tone: violet
draft: false
---

The body, in GitHub-flavoured markdown.
```

`title`, `description` and `date` are required; the rest are optional.
`cover` is an absolute path into `static/`, `coverFit` is `cover` (fill the frame) or `contain` (pad a logo inside it), and `tone` is one of `lime`, `aqua`, `violet`, `citrus` - derived from the slug when omitted.

Front matter is validated at build time and a bad field fails the build with the filename and the reason, rather than shipping a half-configured post.

### Drafts and scheduling

A post is one of three statuses, and only `published` exists in a production build.
The other two are visible in `npm run dev`, labelled with a badge, so work in progress can be read back without being live.

| Status      | How you get it                                 | In a build |
| ----------- | ---------------------------------------------- | ---------- |
| `published` | `date` is today or earlier, `draft` is not set | shipped    |
| `scheduled` | `date` is in the future                        | absent     |
| `draft`     | `draft: true`                                  | absent     |

The two controls are independent on purpose: `draft` means "not finished", a future `date` means "not yet".
`draft: true` wins over the calendar, so a post you have marked unfinished stays unfinished even once its date arrives.

Unpublished means _absent_, not hidden.
There is no index entry, no page, no feed or sitemap entry, and no text in any shipped chunk - the post compiles to an empty module, so nobody reads it early by guessing a filename.

**The dev server follows the same rule by default**, so what you see locally is what a deploy would serve.
To read a draft back while writing it, flip `previewUnpublished` in the `blog({...})` block of [`vite.config.ts`](vite.config.ts):

```ts
previewUnpublished: true,   // dev renders drafts and scheduled posts, badged
```

Vite restarts on the config change. This only ever affects `npm run dev` - a build never ships an unpublished post regardless of what it is set to.

Dates are compared as plain `YYYY-MM-DD` strings against today in UTC, which sorts correctly and avoids the question of whose midnight counts.
A post dated today is published; one dated tomorrow is not.

:warning: **A scheduled post needs a build to go live.** This is a static site: nothing re-renders itself on the morning the date arrives, and nothing pushes to this repository that day either.
[`deploy.yml`](.github/workflows/deploy.yml) therefore runs on a nightly `schedule` (06:10 UTC) as well as on push, and that rebuild is what actually publishes it.
Deleting the cron does not break anything visible - it just means scheduled posts sit there until the next commit.

Beyond standard GFM, the markdown supports three things:

- **Code fences with a filename**: ` ```ts title="src/main.ts" ` renders a labelled panel.
- **Callouts**: `:::note`, `:::tip` and `:::warn` blocks, closed with `:::`. The body is ordinary markdown.
- **Figures**: an image alone in a paragraph is pulled wider than the text column, and its markdown title becomes the caption.

The post [`how-this-blog-works.md`](content/posts/how-this-blog-works.md) uses all of it and doubles as the reference.

## Light and dark

The blog has a theme toggle in its header. The landing page does not: it is a dark neon design rather than a themed one, and a light version of it would be a different site.

Two attributes on `<html>` drive everything:

- `data-surface` is `reading` on `/blog` and post pages, `home` everywhere else. It decides _whether_ the themed tokens apply.
- `data-theme` is `light` or `dark`. It decides _which_ values they take.

Both are set by an inline script in `index.html` before the first paint, from the URL and from `localStorage`, so a light post never flashes dark on its way in.
Without a stored choice the theme follows `prefers-color-scheme`, and keeps following it until the reader picks one.

The components never name a theme.
They are built from five surface tokens declared in [`src/index.css`](src/index.css) - `page`, `sheet`, `inset`, `hair`, `copy` - plus `muted` and `faint` for secondary text, and the same `bg-sheet` or `text-faint` renders correctly in both.

Secondary text is a token rather than an opacity on purpose: `text-copy/45` is the same number in both themes and does not mean the same thing in either.
45% of near-white on a dark sheet still reads; 45% of near-black on white lands near 2.6:1.
`muted` and `faint` are picked per theme to clear 4.5:1 at the 11px the meta lines are set in, as are the light-theme cuts of the four accent colours.

Code blocks carry both themes at once: shiki writes `--shiki-light` and `--shiki-dark` onto every token at build time, and `prose.css` picks the pair that matches.
Switching the theme is a repaint, not a re-highlight.

:warning: **Images cannot follow the toggle.** An `<img>` cannot see the page's `data-theme`, so a post illustration is whatever it was drawn as.
Give diagrams their own opaque background - a dark figure on a white sheet reads as a deliberate figure card, a transparent one drawn for dark backgrounds disappears.

## Build output

`dist/index.html` plus hashed JS and CSS, the contents of `static/`, and three files written by the blog plugin:

- `rss.xml` - the feed, newest first
- `sitemap.xml` - every route, dated from front matter
- `404.html` - a copy of `index.html`

GitHub Pages has no rewrite rules, so `404.html` is what makes a hard load of `/blog/<slug>` resolve to the app instead of a stock error page.
The router then renders the requested route.

Those files are written by `writeBundle`, which only runs on a build, so the dev server serves `/rss.xml` and `/sitemap.xml` from a middleware instead - rendered per request from the same functions.
Without it those paths would fall through to Vite's SPA fallback, get `index.html`, and be answered by the router's 404 page: a link that works in production, failing locally in a way that looks like a bug in the link.

`static/` is the Vite `publicDir`, not `public/`.
Its contents are copied verbatim into `dist/`, and anything in it is referenced by absolute path such as `/assets/images/...` rather than through a bundler import.

Post bodies are code-split one chunk per post, and the whole `/blog` subtree is lazy: a visitor who only reads the landing page downloads none of it.

## Project layout

```
index.html            # entry document, font links and meta tags
eslint.config.js      # flat config: browser rules, node rules, prettier last
lint-staged.config.js # what the pre-commit hook checks, and over which files
.husky/pre-commit     # the hook itself: one line, runs lint-staged
content/posts/        # blog posts, one markdown file each
plugins/
  blog.ts             # the build step: md -> modules, plus rss/sitemap/404
  render.ts           # markdown -> HTML (marked + shiki), build time only
  frontmatter.ts      # front matter parsing, slugs, reading time
  types.ts            # the PostMeta contract shared with the app
src/
  main.tsx            # mounts <App>
  App.tsx             # routes: home, or the lazily loaded blog subtree
  components/Home.tsx # the ordered stack of landing-page sections
  components/blog/    # index, post page, contents rail, post furniture
  components/layout/  # the blog's top bar, the footer, the backdrop
  utils/theme.ts      # the light/dark toggle and the surface attribute
  data/content.ts     # all landing-page copy as typed, exported arrays
  data/posts.ts       # the post index and the lazy body loaders
  utils/router.ts     # history routing in one file
  index.css           # Tailwind @theme tokens, custom utilities, keyframes
  prose.css           # reading typography for rendered post bodies
static/               # publicDir, copied verbatim into dist/
```

Landing-page content edits (a project or a book) belong in `src/data/content.ts`, not in JSX.
Shared primitives in `src/components/ui/` cover section spacing, headings, scroll-in reveals and card effects, so new sections reuse them rather than reimplementing layout.

Motion is driven by CSS animations and transitions wherever possible so that a `prefers-reduced-motion` block can neutralise it cleanly.

## Deployment

Pushes to `main` are built and published to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The workflow typechecks, builds, uploads `dist/` as a Pages artifact and deploys it with the official Pages actions using OIDC, so no long-lived deploy tokens are stored in the repository.
Pull requests run the same build and typecheck but never deploy.

## License

Code is available for reference.
Site content, copy and images are not licensed for reuse.
