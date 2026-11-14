import { DocSection } from "@/components/doc/DocSection";
import { Glyph } from "@/components/Glyph";
import { PROJECTS } from "@/data/content";
import { cn } from "@/utils/cn";
import { linkProps } from "@/utils/links";
import { ProjectLogo } from "./ProjectLogo";

/**
 * Side projects as tiles: the logo, the name, one sentence, and for a public
 * project a data line with where its code is.
 *
 * A public project's whole tile is its link: the name carries the `href` and
 * stretches over the tile, so there is one link per tile for a screen reader
 * and the focus ring goes round the tile. A private one is not a link and
 * carries a WIP mark instead.
 */
export function Projects() {
  return (
    <DocSection id="projects" title="Projects">
      <ul className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <li
            key={project.id}
            className={cn(
              "relative flex flex-col border border-hair p-5",
              project.isPublic &&
                "group transition-colors hover:border-faint has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <ProjectLogo id={project.id} />
              {!project.isPublic && (
                <span className="border border-hair px-1.5 font-mono text-[0.75rem] leading-5 text-faint">
                  WIP
                </span>
              )}
            </div>

            <h3 className="mt-4 leading-snug font-semibold">
              {project.isPublic ? (
                <a
                  {...linkProps(project.repo)}
                  className="link-quiet text-copy group-hover:text-accent after:absolute after:inset-0 focus-visible:outline-none"
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>

            <p className="mt-1.5 text-[1rem] leading-normal text-muted">{project.description}</p>

            {project.isPublic && (
              // At the foot of the tile, so the paths of a row line up whatever
              // the length of the sentences above them. The glyph sits inline
              // on the text's baseline, the way Bootstrap Icons advise.
              <p className="mt-auto pt-4 font-mono text-[0.8125rem] text-faint">
                <Glyph name="GitHub" size={12} className="mr-1.5 inline align-[-0.125em]" />
                {project.repo.replace(/^https:\/\/github\.com\//, "")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </DocSection>
  );
}
