/**
 * Self-hosts the site's webfonts and writes `src/fonts.css`.
 *
 * The font files come from their npm packages (Fontsource, devDependencies) and
 * are copied into `static/assets/fonts/`, which Vite serves at the site root,
 * so the browser never makes a request to a third-party origin for type.
 *
 * Every family also gets a metric-matched fallback: a local system font
 * re-cut with `size-adjust` and ascent/descent overrides computed by Capsize,
 * so text laid out before the webfont arrives occupies the same space and the
 * swap does not move the page.
 *
 * Run `npm run fonts` after changing FAMILIES or upgrading a font package, and
 * commit both the CSS and the copied files.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createFontStack } from "@capsizecss/core";
import courierNew from "@capsizecss/metrics/courierNew";
import inconsolata from "@capsizecss/metrics/inconsolata";
import libertinusSerif from "@capsizecss/metrics/libertinusSerif";
import timesNewRoman from "@capsizecss/metrics/timesNewRoman";
import * as prettier from "prettier";

type FontMetrics = typeof libertinusSerif;

type Face = {
  /** File name inside the package's `files/`, with `{subset}` for the subset. */
  file: string;
  style: "normal" | "italic";
  /** A single weight, or a range for a variable font. */
  weight: string;
};

type Family = {
  /** The name the CSS uses. Fontsource calls a variable family "X Variable". */
  family: string;
  pkg: string;
  /** Unicode subsets to ship. Each becomes its own file and @font-face. */
  subsets: string[];
  faces: Face[];
  metrics: FontMetrics;
  fallback: FontMetrics;
};

const FAMILIES: Family[] = [
  {
    family: "Libertinus Serif",
    pkg: "@fontsource/libertinus-serif",
    subsets: ["latin", "latin-ext"],
    faces: [
      { file: "libertinus-serif-{subset}-400-normal.woff2", style: "normal", weight: "400" },
      { file: "libertinus-serif-{subset}-400-italic.woff2", style: "italic", weight: "400" },
      { file: "libertinus-serif-{subset}-600-normal.woff2", style: "normal", weight: "600" },
      { file: "libertinus-serif-{subset}-600-italic.woff2", style: "italic", weight: "600" },
    ],
    metrics: libertinusSerif,
    fallback: timesNewRoman,
  },
  {
    family: "Inconsolata",
    pkg: "@fontsource-variable/inconsolata",
    subsets: ["latin", "latin-ext"],
    faces: [{ file: "inconsolata-{subset}-wght-normal.woff2", style: "normal", weight: "200 900" }],
    metrics: inconsolata,
    fallback: courierNew,
  },
];

const ROOT = path.resolve(import.meta.dirname, "..");
const FONTS_DIR = path.join(ROOT, "static", "assets", "fonts");
const CSS_FILE = path.join(ROOT, "src", "fonts.css");

async function main(): Promise<void> {
  await fs.mkdir(FONTS_DIR, { recursive: true });

  const blocks: string[] = [];

  for (const family of FAMILIES) {
    const pkgDir = path.join(ROOT, "node_modules", family.pkg);
    const ranges = JSON.parse(
      await fs.readFile(path.join(pkgDir, "unicode.json"), "utf8"),
    ) as Record<string, string>;

    blocks.push(banner(family.family));

    for (const face of family.faces) {
      for (const subset of family.subsets) {
        const range = ranges[subset];
        if (!range) throw new Error(`${family.pkg} has no "${subset}" subset.`);

        const file = face.file.replace("{subset}", subset);
        await fs.copyFile(path.join(pkgDir, "files", file), path.join(FONTS_DIR, file));

        blocks.push(fontFace(family.family, face, file, range));
      }
    }

    blocks.push(fallbackFace(family));
  }

  // Formatted with the repository's own Prettier config, so the generated file
  // passes `npm run format:check` and a regeneration diffs only what changed.
  const css = await prettier.format(`${HEADER}\n${blocks.join("\n\n")}\n`, {
    ...(await prettier.resolveConfig(CSS_FILE)),
    filepath: CSS_FILE,
  });
  await fs.writeFile(CSS_FILE, css, "utf8");
  console.log(`fonts: wrote ${path.relative(ROOT, CSS_FILE)}`);
}

function fontFace(family: string, face: Face, file: string, range: string): string {
  return `@font-face {
  font-family: "${family}";
  font-style: ${face.style};
  font-weight: ${face.weight};
  font-display: swap;
  src: url("/assets/fonts/${file}") format("woff2");
  unicode-range: ${range.split(",").join(", ")};
}`;
}

/**
 * "Libertinus Serif Fallback": the system font re-cut to the webfont's metrics.
 * Named explicitly rather than with Capsize's generated name, so the font
 * stacks in index.css can refer to it.
 */
function fallbackFace(family: Family): string {
  const { fontFaces } = createFontStack([family.metrics, family.fallback], {
    fontFaceFormat: "styleObject",
  });

  const descriptors = fontFaces[0]["@font-face"];
  const lines = [
    `font-family: "${family.family} Fallback";`,
    `src: ${descriptors.src};`,
    descriptors.ascentOverride && `ascent-override: ${descriptors.ascentOverride};`,
    descriptors.descentOverride && `descent-override: ${descriptors.descentOverride};`,
    descriptors.lineGapOverride && `line-gap-override: ${descriptors.lineGapOverride};`,
    descriptors.sizeAdjust && `size-adjust: ${descriptors.sizeAdjust};`,
  ].filter(Boolean);

  return `@font-face {\n  ${lines.join("\n  ")}\n}`;
}

function banner(name: string): string {
  return `/* ${"-".repeat(Math.max(4, 72 - name.length))} ${name} */`;
}

const HEADER = `/*
 * Self-hosted webfonts and their metric-matched fallbacks.
 *
 * Generated by scripts/fonts.ts (npm run fonts). Do not edit by hand.
 */
`;

await main();
