import almz from "@/assets/projects/almz.svg";
import dbAcademy from "@/assets/projects/db-academy.webp";
import nookat from "@/assets/projects/nookat.webp";
import pytorch from "@/assets/projects/pytorch.svg";
import torchtitan from "@/assets/projects/torchtitan.svg";
import trainmeter from "@/assets/projects/trainmeter.svg";
import type { ProjectId } from "@/data/content";

/**
 * Each project's logo. They keep their own colours in both themes, as a
 * project's logo would anywhere else.
 *
 * - nookat and trainmeter: their own, from their repositories.
 * - db-academy.io: its mascot, the bull its site puts in the navigation bar.
 * - The two sets of PyTorch drills: PyTorch's own marks, both in its orange.
 *   The flame for the core drills; for the distributed ones, the mark of
 *   TorchTitan, PyTorch's platform for training across many GPUs.
 * - almz: drawn for this site, as it has none. A brilliant-cut diamond, since
 *   almz reads as "almaz", the Russian for diamond.
 *
 * Raster ones are stored at 4x.
 */
const LOGOS: Record<ProjectId, string> = {
  almz,
  trainmeter,
  "pytorch-exercises": pytorch,
  "pytorch-distributed-exercises": torchtitan,
  nookat,
  "db-academy": dbAcademy,
};

export function ProjectLogo({ id }: { id: ProjectId }) {
  return <img src={LOGOS[id]} alt="" width={40} height={40} loading="lazy" className="h-10 w-10" />;
}
