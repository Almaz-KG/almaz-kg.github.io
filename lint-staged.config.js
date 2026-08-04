/**
 * Checks only - nothing here rewrites a file. A failing commit tells you what
 * to run (`npm run lint -- --fix`, `npm run format`); it never edits the change
 * you were about to make behind your back.
 *
 * lint-staged stashes unstaged work before running, so every command below sees
 * exactly the tree that is about to become the commit.
 */
export default {
  "*.{ts,tsx,js}": [
    "eslint --max-warnings=0",
    "prettier --check",
    // A function, not a string, so lint-staged runs it once for the project
    // instead of appending staged filenames - `tsc` ignores tsconfig.json the
    // moment files are passed on the command line, which would silently drop
    // `strict` and the path aliases. Runs only when a TS or JS file is staged.
    () => "npm run typecheck",
  ],
  "*.{json,css,html,yml,yaml,md}": ["prettier --check"],
};
