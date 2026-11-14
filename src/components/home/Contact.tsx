import { DocSection } from "@/components/doc/DocSection";
import { CONTACT_LINE, SITE } from "@/data/content";

/** The close of the page: an address, not a form. */
export function Contact() {
  return (
    <DocSection id="contact" title="Contact">
      <p>
        {CONTACT_LINE} Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </DocSection>
  );
}
