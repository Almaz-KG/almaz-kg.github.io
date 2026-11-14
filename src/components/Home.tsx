import { Notes } from "@/components/home/Notes";
import { Projects } from "@/components/home/Projects";
import { Stack } from "@/components/home/Stack";
import { ABSTRACT, SITE, SOCIALS } from "@/data/content";
import { useHead } from "@/utils/head";

/**
 * The home page: an abstract and the numbered sections. Its title is the name
 * in the running head, so nothing is set above the abstract.
 */
export function Home() {
  useHead({
    title: `${SITE.name} - ${SITE.role}`,
    description: SITE.description,
    path: "/",
    // Tells search engines that this page *is* the person, and which profiles
    // elsewhere are the same one. A search for the name is the query this site
    // most needs to answer.
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url: `${SITE.url}/`,
      jobTitle: SITE.role,
      description: SITE.description,
      email: `mailto:${SITE.email}`,
      sameAs: SOCIALS.map((social) => social.href).filter((href) => href.startsWith("https://")),
    },
  });

  return (
    <div className="page">
      <div className="column">
        <p className="pt-12 sm:pt-16">{ABSTRACT}</p>

        <Stack />
        <Notes />
        <Projects />
      </div>
    </div>
  );
}
