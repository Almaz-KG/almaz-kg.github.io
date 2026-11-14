import { Fragment } from "react";
import { DocSection } from "@/components/doc/DocSection";
import { LANGUAGES, STACK } from "@/data/content";
import { TOOL_GLYPHS } from "./toolGlyphs";

/**
 * What the work is built with: two stacks side by side on a wide screen, one
 * over the other on a phone, and the languages under both.
 *
 * Three levels: the stack's name in semibold over an ink rule, each layer's
 * name as a small-caps label, and the tools in the text face, since they are
 * what a reader is scanning for.
 */
export function Stack() {
  return (
    <DocSection id="stack" title="Stack">
      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        {STACK.map((group) => (
          <div key={group.title}>
            <h3 className="border-b border-copy pb-1.5 leading-snug font-semibold">
              {group.title}
            </h3>
            <dl className="mt-3 space-y-3">
              {group.rows.map((row) => (
                <div key={row.layer}>
                  <Label>{row.layer}</Label>
                  <Tools tools={row.tools} />
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <dl className="mt-8 border-t border-hair pt-3">
        <Label>Languages</Label>
        <Tools tools={LANGUAGES} />
      </dl>
    </DocSection>
  );
}

function Label({ children }: { children: string }) {
  return <dt className="small-caps text-[0.9375rem] leading-snug text-muted">{children}</dt>;
}

/**
 * A run of tool names. A line breaks only between them, never inside one: in
 * a column this narrow, "Vertex AI Agent" on one line and "Engine" alone on the
 * next reads as two tools.
 */
function Tools({ tools }: { tools: readonly string[] }) {
  return (
    <dd className="leading-normal">
      {tools.map((tool, index) => (
        <Fragment key={tool}>
          {index > 0 && ", "}
          <span className="whitespace-nowrap">
            {TOOL_GLYPHS[tool] && <ToolGlyph path={TOOL_GLYPHS[tool]} />}
            {tool}
          </span>
        </Fragment>
      ))}
    </dd>
  );
}

/** A tool's glyph, in the muted ink, sitting on the text's baseline. */
function ToolGlyph({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="0.875em"
      height="0.875em"
      fill="currentColor"
      aria-hidden="true"
      className="mr-[0.35em] inline align-[-0.1em] text-muted"
    >
      <path d={path} />
    </svg>
  );
}
