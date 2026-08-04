const MEASUREMENT_ID = "G-DDNMG31JN9";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/**
 * Queues a gtag call. Works before gtag.js has loaded, because everything
 * pushed onto `dataLayer` is replayed once it does.
 *
 * gtag.js reads the raw `arguments` object, so keep the official shape.
 */
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // `_args` is a plain array; gtag.js wants the `arguments` object itself.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/**
 * Loads gtag.js and configures the property.
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

  gtag("js", new Date());
  // The router changes the URL without a document load, so the automatic view
  // would only ever report the entry page. `trackPageView` sends them instead.
  gtag("config", MEASUREMENT_ID, { send_page_view: false });
}

/** Records a view of the current route. */
export function trackPageView(path: string, title: string): void {
  if (!import.meta.env.PROD) return;

  gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}
