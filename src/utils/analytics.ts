const MEASUREMENT_ID = "G-DDNMG31JN9";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/**
 * Loads gtag.js and sends the initial page_view.
 *
 * Bundled (not served from `static/`) so the single-file build keeps working
 * without fetching a sibling script, and skipped outside production so local
 * dev sessions stay out of the property.
 */
export function initAnalytics() {
  if (!import.meta.env.PROD) return;

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(tag);

  window.dataLayer = window.dataLayer || [];
  // gtag.js reads the raw `arguments` object, so keep the official shape.
  function gtag(..._args: unknown[]) {
    window.dataLayer.push(arguments);
  }

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);
}
