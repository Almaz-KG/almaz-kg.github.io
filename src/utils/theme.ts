/**
 * Light/dark for the reading surface.
 *
 * The theme lives in one place, `data-theme` on `<html>`, and the CSS in
 * `index.css` does the rest. The inline script in `index.html` sets that
 * attribute before the first paint; everything here only changes it afterwards.
 *
 * Only the blog reads the theme. The landing page is a dark design rather than
 * a themed one, so `data-surface` gates which pages the tokens apply to.
 */

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
export type Surface = "home" | "reading";

const STORAGE_KEY = "theme";

/** The colour the mobile browser chrome is tinted with, per surface and theme. */
const THEME_COLOR: Record<string, string> = {
  home: "#07070c",
  "reading:dark": "#0c0e14",
  "reading:light": "#f2f2f5",
};

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Whether the reader has picked a theme, as opposed to inheriting the system one. */
function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable; the choice then lasts for this page only.
  }

  syncThemeColor();
  emit();
}

/** The current theme, and a way to flip it. Re-renders on every change. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot);
  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}

/** Marks which surface is on screen, which is what gates the themed tokens. */
export function setSurface(surface: Surface): void {
  if (document.documentElement.dataset.surface === surface) return;

  document.documentElement.dataset.surface = surface;
  syncThemeColor();
}

function syncThemeColor(): void {
  const surface = document.documentElement.dataset.surface ?? "home";
  const key = surface === "reading" ? `reading:${getSnapshot()}` : "home";

  const tag = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (tag) tag.content = THEME_COLOR[key];
}

// Follows the system while the reader has not chosen for themselves. Once they
// have, their choice outranks the OS until they change it again.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  if (storedTheme()) return;

  document.documentElement.dataset.theme = event.matches ? "dark" : "light";
  syncThemeColor();
  emit();
});
