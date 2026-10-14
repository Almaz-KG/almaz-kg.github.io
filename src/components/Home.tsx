import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Projects } from "@/components/sections/Projects";
import { Writing } from "@/components/sections/Writing";
import { SITE, SOCIALS } from "@/data/content";
import { useHead } from "@/utils/head";

/** The one-page portfolio: the ordered stack of sections at `/`. */
export function Home() {
  useHead({
    title: `${SITE.name} - ${SITE.role}`,
    description: SITE.tagline,
    path: "/",
    // Tells search engines that this page *is* the person, and which profiles
    // elsewhere are the same one. A search for the name is the query this site
    // most needs to answer.
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url: `${SITE.blog}/`,
      jobTitle: SITE.role,
      description: SITE.tagline,
      email: `mailto:${SITE.email}`,
      sameAs: SOCIALS.map((social) => social.href).filter((href) => href.startsWith("https://")),
    },
  });

  return (
    <>
      <Hero />
      <About />
      {/* `Focus` is parked, not deleted - see PARKED_SECTIONS in data/sections.ts. */}
      <Writing />
      <Projects />
      <Contact />
    </>
  );
}
