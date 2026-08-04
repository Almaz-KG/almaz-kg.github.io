import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Focus } from "@/components/sections/Focus";
import { Projects } from "@/components/sections/Projects";
import { Shelf } from "@/components/sections/Shelf";
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
      <Focus />
      <Projects />
      <Writing />
      <Shelf />
      <Contact />
    </>
  );
}
