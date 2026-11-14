import { DocSection } from "@/components/doc/DocSection";
import { PROJECTS } from "@/data/content";
import { linkProps } from "@/utils/links";

/** What is being built outside work, and where its notes live. */
export function Projects() {
  return (
    <DocSection id="projects" title="Projects">
      <ul>
        {PROJECTS.map((project) => (
          <li key={project.title} className="py-1">
            <p>
              <span className="font-semibold">{project.title}.</span>{" "}
              <span className="text-muted">{project.body}</span>{" "}
              <a {...linkProps(project.href)}>{project.cta}</a>
            </p>
            <p className="mt-0.5 text-faint">
              {project.kind}, {project.when.toLowerCase()}.
            </p>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}
