import { Pill, TiltCard } from "@/components/ui";
import type { Project } from "@/data/content";
import { BrowserBar } from "./BrowserBar";

type ProjectCardProps = {
  project: Project;
  /** Colour of the cursor glow. */
  glow: string;
};

export function ProjectCard({ project, glow }: ProjectCardProps) {
  return (
    <TiltCard glow={glow} className="h-full" innerClassName="flex h-full flex-col">
      <BrowserBar href={project.href} title={project.title} />

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex items-center gap-4">
          <img
            src={project.logo}
            alt=""
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-xl bg-white/[0.05] object-contain p-1.5 ring-1 ring-white/10"
          />
          <div className="min-w-0">
            <h3 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {project.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-white/35">
              <span className="truncate">{project.kind}</span>
              <span className="text-white/20">/</span>
              <span className="shrink-0">{project.year}</span>
            </div>
          </div>
        </div>

        <p className="mt-5 flex-1 leading-relaxed text-white/55">{project.body}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-lime transition-transform hover:translate-x-1"
          >
            Visit <span aria-hidden>↗</span>
          </a>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
            >
              Source <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}
