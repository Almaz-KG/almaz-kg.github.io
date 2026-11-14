import type { AnchorHTMLAttributes } from "react";

type LinkProps = Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">;

/**
 * `href` plus the attributes it needs: another site opens in a new tab, a path
 * on this one stays in the tab so the router can take it without a reload. A
 * `mailto:` hands off to the mail client and would only leave an empty tab.
 */
export function linkProps(href: string): LinkProps {
  return /^https?:/i.test(href) ? { href, target: "_blank", rel: "noreferrer" } : { href };
}
