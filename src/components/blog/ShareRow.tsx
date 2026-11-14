import { useState } from "react";
import { SITE } from "@/data/content";
import type { PostMeta } from "@/data/posts";

/** Where to send the note, as one line of text links and a copy-link action. */
export function ShareRow({ post }: { post: PostMeta }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE.url}/blog/${post.slug}`;

  const targets = [
    { label: "X", href: `https://x.com/intent/post?text=${enc(post.title)}&url=${enc(url)}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(post.title)}` },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access is denied in some browsers unless the page is focused;
      // the share links still work, so there is nothing to recover from.
    }
  }

  return (
    <p className="text-muted">
      Share on{" "}
      {targets.map((target, i) => (
        <span key={target.label}>
          <a href={target.href} target="_blank" rel="noopener noreferrer">
            {target.label}
          </a>
          {i < targets.length - 2 ? ", " : i === targets.length - 2 ? " or " : ""}
        </span>
      ))}
      , or{" "}
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer text-accent underline decoration-accent/45 decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] hover:decoration-current"
      >
        copy the link
      </button>
      .{" "}
      <span aria-live="polite" className="text-faint">
        {copied ? "Copied." : ""}
      </span>
    </p>
  );
}

function enc(value: string): string {
  return encodeURIComponent(value);
}
