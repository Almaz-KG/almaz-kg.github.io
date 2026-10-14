import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Projects } from "@/components/sections/Projects";
import { Writing } from "@/components/sections/Writing";
import { SITE } from "@/data/content";
import { useHead } from "@/utils/head";

/** The one-page portfolio: the ordered stack of sections at `/`. */
export function Home() {
  useHead({
    title: `${SITE.name} - ${SITE.role}`,
    description: SITE.tagline,
    path: "/",
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
