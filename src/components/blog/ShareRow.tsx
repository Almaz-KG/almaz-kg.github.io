import { useState } from "react";
import { SITE } from "@/data/content";
import type { PostMeta } from "@/data/posts";
import { cn } from "@/utils/cn";

/** Share targets and a copy-link button, for the end of a post. */
export function ShareRow({ post }: { post: PostMeta }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE.blog}/blog/${post.slug}`;

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
      // the share links above still work, so there is nothing to recover from.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[11px] tracking-[0.2em] text-faint uppercase">
        Share
      </span>

      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className={ACTION}
        >
          {target.label}
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        className={cn(ACTION, copied && "border-lime/50 text-lime")}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

const ACTION =
  "rounded-full border border-hair bg-copy/[0.04] px-3.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-lime/45 hover:text-copy";

function enc(value: string): string {
  return encodeURIComponent(value);
}
