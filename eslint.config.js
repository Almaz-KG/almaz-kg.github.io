import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * Flat config. Three layers, in order:
 *
 *   1. what runs in the browser  - src, React rules on
 *   2. what runs in Node         - the Vite plugins and the build config
 *   3. what turns rules off      - eslint-config-prettier, always last
 *
 * Type-aware linting is deliberately not enabled. `tsc --noEmit` already runs
 * on every commit and in CI with `strict`, `noUnusedLocals` and
 * `noUnusedParameters`, so the rules that need a type checker would be paying
 * for a second program build to report what the first one already reports.
 */
export default tseslint.config(
  // Flat config does not read .gitignore, so build output has to be listed here
  // as well.
  { ignores: ["dist/**", "_site/**", "node_modules/**"] },

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    rules: {
      // Same convention tsconfig's `noUnusedParameters` already uses: a leading
      // underscore means "required by the signature, deliberately unread".
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Fast Refresh can only replace a module in place when it exports
      // components and nothing else. Constants are the common exception.
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },

  {
    files: ["plugins/**/*.ts", "vite.config.ts", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },

  // Disables every rule that would argue with Prettier about whitespace. Must
  // stay the last entry.
  prettier,
);
