import { Reveal } from "@/components/ui";

type StackGroupProps = {
  title: string;
  items: string[];
  /** Stagger for the reveal, in ms. */
  delay?: number;
};

/** One labelled column of the toolbox grid. */
export function StackGroup({ title, items, delay = 0 }: StackGroupProps) {
  return (
    <Reveal delay={delay} className="bg-ink-2/80 p-7 backdrop-blur-sm">
      <h3 className="font-mono text-[11px] tracking-[0.24em] text-lime uppercase">{title}</h3>

      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="group flex items-center gap-3 text-[15px] text-white/60 transition-colors hover:text-white"
          >
            <span className="h-1 w-1 rounded-full bg-white/25 transition-all group-hover:w-4 group-hover:bg-lime" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
