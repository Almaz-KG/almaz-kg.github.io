---
title: "How this blog works"
description: "A directory of markdown files, one Vite plugin, and no CMS. This is both the explanation and the reference for everything the markdown here can do."
date: 2026-08-04
tags: [meta, vite, markdown]
cover: /assets/images/posts/how-this-blog-works-cover.svg
coverAlt: "A markdown file, a build step, and a page"
coverFit: cover
tone: violet
draft: true
---

I wanted a blog, not a content platform.

The distinction matters, because the second one arrives with a database, an admin panel, a migration path and an upgrade you will eventually be scared to run.
What I actually needed was somewhere to put text, and a way to make that text look like it was written on purpose.

So: a directory of markdown files, one Vite plugin, and no CMS.

![The path a post takes from a file on disk to the page you are reading](/assets/images/posts/content-pipeline.svg "content/posts/*.md is compiled during the build, not in your browser")

## The whole system

Writing a post means creating a file.
That is the entire authoring workflow, and it is the only part I care about staying simple, because it is the part I will touch every time.

```bash
$ vim content/posts/a-new-note.md
$ npm run dev
# open http://localhost:5173/blog/a-new-note
```

Everything else happens during `npm run build`.
A plugin walks `content/posts/`, validates the front matter, renders the markdown, and hands Vite three things: one module per post, one metadata-only index, and a feed.

:::tip
Nothing in this pipeline runs in your browser.
The markdown parser and the syntax highlighter are `devDependencies` - they execute in Node during the build and never ship.
What arrives over the network is HTML that was finished hours before you asked for it.
:::

### Why not just parse markdown at runtime

Because then every reader downloads a markdown parser to read text that was identical for all of them.

A markdown parser plus a syntax highlighter is comfortably over 100 kB of JavaScript, and it produces the same output on every machine that runs it.
That is the definition of work that belongs in a build.
Moving it there costs one plugin file and saves every visitor the download, the parse and the execution.

## Front matter

Every post opens with a block of metadata between `---` fences.
The build validates it and fails loudly rather than rendering something half-configured, which is the behaviour I want from a thing that runs unattended in CI.

```yaml title="content/posts/a-new-note.md"
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
```

The fields, in full:

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Heading, card, `<title>`, feed entry |
| `description` | yes | Card copy, meta description, link preview |
| `date` | yes | `YYYY-MM-DD`. Sorts the index, dates the feed. In the future, schedules the post |
| `tags` | no | Filter chips on the index, categories in the feed |
| `cover` | no | Absolute path into `static/`. Falls back to a tinted plate |
| `coverAlt` | no | Alt text, and the caption under the cover |
| `coverFit` | no | `cover` fills the frame, `contain` pads a logo inside it |
| `tone` | no | `lime`, `aqua`, `violet` or `citrus`. Derived from the slug if omitted |
| `draft` | no | `true` holds the post back regardless of its date |

The slug comes from the filename, so `a-new-note.md` is served at `/blog/a-new-note`.
There is no separate slug field, because two sources of truth for a URL is one more than anybody needs.

### Not finished, and not yet

Two of those fields decide whether a post exists at all, and they answer different questions.
`draft: true` means the writing is not good enough yet.
A `date` in the future means the writing is fine and the timing is not.

Both produce the same outcome, which is worth being precise about: the post is **absent** from the build, not hidden in it.
No index entry, no page, no feed or sitemap entry, and no text in any shipped chunk - an unpublished post compiles to an empty module.
Hiding it in the page would mean shipping it, and shipping it would mean somebody could read it early by guessing a filename.

The dev server follows the same rule, so what you see locally is what a deploy would serve.
Flipping `previewUnpublished` in the plugin's options makes it render the unpublished ones too, badged, for when you want to read a draft back while writing it.

:::warn
A scheduled post needs a build to go live.
Nothing on a static site re-renders itself on the morning the date arrives, and nothing pushes to the repository that day either.
The deploy workflow runs nightly for exactly this reason - without that, a scheduled post simply waits for the next commit.
:::

:::warn
Changing a filename changes a published URL and breaks every link to it.
If a post has been out in the world, rename it only if you mean it.
:::

## What the markdown can do

Standard GitHub-flavoured markdown, plus three things worth knowing about.

### Code with a filename

A fence takes an optional `title`, which becomes the label above the block.
Highlighting is done by shiki at build time, so the colours are already in the HTML.

````markdown
```rust title="src/main.rs"
fn main() {
    println!("hello");
}
```
````

Which renders as:

```rust title="src/main.rs"
use std::collections::HashMap;

/// Counts how often each word appears, which is the "hello world" of
/// every language that has an entry in a map.
fn word_counts(text: &str) -> HashMap<&str, usize> {
    let mut counts = HashMap::new();

    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }

    counts
}
```

### Callouts

Three kinds, written as a fenced block.
The body is ordinary markdown, so lists and code work inside them.

```markdown
:::note
Context the reader can skip without losing the thread.
:::

:::tip
Something that will save them time.
:::

:::warn
Something that will cost them time if they miss it.
:::
```

They come out as the coloured inserts used throughout this post.

### Images become figures

An image alone in a paragraph is pulled out of the text column and given a caption from its markdown title.
An image inside a sentence stays inline and stays small.

```markdown
![Alt text, for screen readers](/assets/images/posts/diagram.svg "The caption, shown under the figure")
```

Alt text and caption are separate on purpose.
The alt text says what the image is for somebody who cannot see it.
The caption says something to everybody, and it is fine for it to add information the image does not contain.

## Layout, briefly

The text sits in a 68-character column, which is a boring number arrived at by reading a lot of things that were comfortable and a lot that were not.

Figures, code blocks and tables are allowed to break out past it, because a wide diagram squeezed into a text column helps nobody.
This is one CSS grid rather than a pile of negative margins:

```css title="src/prose.css"
.prose {
  display: grid;
  grid-template-columns:
    [full-start] minmax(0, 1fr)
    [wide-start] minmax(0, var(--breakout))
    [content-start] min(var(--measure), 100%) [content-end]
    minmax(0, var(--breakout)) [wide-end]
    minmax(0, 1fr) [full-end];
}

.prose > * { grid-column: content; }
.prose > figure { grid-column: wide; }
```

Everything lands in the text column by default, and the exceptions name themselves.

## What it emits

Three files nobody asks for until they are missing:

1. `rss.xml`, because the feed is the only subscription mechanism that has never once tried to re-engage me.
2. `sitemap.xml`, dated from each post's front matter.
3. `404.html`, a copy of the app. GitHub Pages has no rewrite rules, so this is what makes a hard reload of `/blog/how-this-blog-works` resolve to something other than a stock error page.

## What is deliberately missing

No comments, no reactions, no reading-progress gamification, no newsletter modal.

The one thing I would still call a gap is that pages are rendered in the browser rather than pre-rendered at build time.
Every crawler that runs JavaScript sees the real title and description; the ones that do not, see the defaults.
Fixing that means rendering each route to static HTML during the build, and it is the next thing I will do to this if the blog turns out to be a habit rather than a weekend.

:::note
That is the honest state of it.
A prototype that works, with one known limitation written down instead of quietly hoped over.
:::
