import type { CSSProperties } from "react";
import { Reveal, Section, SectionHeading } from "@/components/ui";
import { POSTS, formatDate } from "@/data/posts";
import { sectionIndex } from "@/data/sections";
import { TONE_GLOW } from "@/utils/tones";
import { cn } from "@/utils/cn";

/**
 * The newest notes, linking through to the blog. Hidden when empty.
 *
 * Two rows rather than one: this section stands where `Focus` and `Projects`
 * used to, so it carries the middle of the page on its own now.
 */
export function Writing() {
  const latest = POSTS.slice(0, 6);
  if (latest.length === 0) return null;

  return (
    <Section id="writing">
      <SectionHeading
        index={sectionIndex("writing")}
        kicker="Writing"
        title={
          <>
            Notes I keep <span className="text-gradient">in public</span>.
          </>
        }
        intro="Working notes on data platforms, distributed systems and Rust - written mostly so I stop solving the same problem twice."
      />

      {/* Columns follow the post count, so an early blog with two notes does not
          sit next to an empty third column, and a single one spans the measure
          rather than sitting in a narrow column with dead space beside it. */}
      <div
        className={cn(
          "mt-14 grid gap-4",
          latest.length === 1
            ? "md:grid-cols-1"
            : latest.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3",
        )}
      >
        {latest.map((post, i) => (
          <Reveal key={post.slug} delay={i * 80} className="h-full">
            <a
              href={`/blog/${post.slug}`}
              style={{ "--glow": TONE_GLOW[post.tone] } as CSSProperties}
              className="group glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/16"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(420px circle at 30% 0%, var(--glow), transparent 70%)",
                }}
              />

              <div className="relative flex h-full flex-col">
                <p className="font-mono text-[11px] tracking-wide text-white/35">
                  {formatDate(post.date)} · {post.readingTime} min
                </p>

                <h3 className="mt-3 text-lg leading-snug font-semibold text-balance transition-colors group-hover:text-lime">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/50">{post.description}</p>

                <span className="mt-auto pt-6 font-mono text-[11px] tracking-[0.18em] text-white/30 uppercase transition-colors group-hover:text-lime">
                  read →
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={240} className="mt-10">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase transition-colors hover:border-lime/40 hover:text-lime"
        >
          All notes
          <span aria-hidden="true">→</span>
        </a>
      </Reveal>
    </Section>
  );
}
