import { Glyph } from "@/components/Glyph";
import { SOCIALS } from "@/data/content";
import { linkProps } from "@/utils/links";
import { cn } from "@/utils/cn";

/**
 * Where else to find the author, as a row of logos. Each is named for screen
 * readers, and its tooltip gives the handle or the address.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul aria-label="Elsewhere" className={cn("flex items-center gap-x-3", className)}>
      {SOCIALS.map((social) => (
        <li key={social.href} className="flex">
          {/* A 36px target around a 15px glyph; the negative margin keeps the
              row as tight as the glyphs themselves. */}
          <a
            {...linkProps(social.href)}
            aria-label={social.label}
            title={`${social.label}: ${social.handle}`}
            className="-m-2 flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-accent"
          >
            <Glyph name={social.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}
