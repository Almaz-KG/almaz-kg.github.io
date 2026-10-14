import type { AnchorHTMLAttributes } from "react";

type LinkProps = Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">;

/** A full URL to another origin, as opposed to a path on this site. */
export function isExternal(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href);
}

/**
 * `href` plus the attributes it needs: another site opens in a new tab, a path
 * on this one stays in the tab so the router can take it without a reload.
 */
export function linkProps(href: string): LinkProps {
  return isExternal(href) ? { href, target: "_blank", rel: "noreferrer" } : { href };
}
