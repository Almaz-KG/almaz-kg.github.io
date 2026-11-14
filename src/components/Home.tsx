import { Dot } from "@/components/doc/Dot";
import { TitleBlock } from "@/components/doc/TitleBlock";
import { Contact } from "@/components/home/Contact";
import { Notes } from "@/components/home/Notes";
import { Projects } from "@/components/home/Projects";
import { Record } from "@/components/home/Record";
import { Stack } from "@/components/home/Stack";
import { ABSTRACT, CV_HREF, ROLE_LINE, SITE, SOCIALS } from "@/data/content";
import { useHead } from "@/utils/head";
import { linkProps } from "@/utils/links";

/** The home page: a title block, an abstract, and the numbered sections. */
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
    <div className="page">
      <div className="column">
        <TitleBlock title={SITE.name} subtitle={ROLE_LINE} abstract={ABSTRACT}>
          {/* The author line of a paper: where to reach the person. */}
          <p className="mt-5 text-[1rem] sm:text-[1.0625rem]">
            {[
              ...SOCIALS.map((social) => ({
                label: social.label === "Email" ? social.handle : social.label,
                href: social.href,
              })),
              { label: "CV (PDF)", href: CV_HREF },
            ].map((link, i) => (
              <span key={link.href}>
                {i > 0 && <Dot />}
                <a {...linkProps(link.href)}>{link.label}</a>
              </span>
            ))}
          </p>
        </TitleBlock>

        <Record />
        <Stack />
        <Notes />
        <Projects />
        <Contact />
      </div>
    </div>
  );
}
