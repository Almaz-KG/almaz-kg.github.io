/*
 * Every fact about the site that appears in more than one place - the name,
 * the role, the address, the notes' title and description - is declared here
 * once. The pages import it, and so does vite.config.ts for the feed and the
 * sitemap, so a change is one edit and the copies cannot drift apart.
 */

/**
 * The first two sentences of the home page's abstract, which are also the
 * page's description for search results and link previews.
 */
const LEAD =
  "I build data platforms that do not fit on one machine. More than ten years on high-load and big-data systems, pipelines at petabyte scale.";

export const SITE = {
  name: "Almaz Murzabekov",
  /** The line under the name, and the job title in `<title>` and structured data. */
  role: "Senior data and infrastructure engineer",
  /** The home page's description in search results and link previews. */
  description: LEAD,
  email: "almaz@murzabekov.net",
  /** The site's origin, with no trailing slash. */
  url: "https://almaz.murzabekov.net",
  /** This site's own source, linked from the colophon. */
  source: "https://github.com/Almaz-KG/almaz.murzabekov.net",
};

/** The opening paragraph of the home page, set as the document's abstract. */
export const ABSTRACT = `${LEAD} These days that is GCP: Airflow and dbt for the pipelines, Terraform for the ground they stand on, and multi-agent systems on Vertex AI that take the tedious half of ingestion off my hands. With AI everywhere, the bottleneck moved back to the data, which is where I have always worked. I write down the parts that took longer to understand than they should have.`;

/** The notes index, and the feed that carries the same notes. */
export const NOTES = {
  title: "Notes",
  /** The line under the title on the index. */
  subtitle: "Working notes on data platforms, distributed systems, AI and Rust.",
  /** For search results, link previews and the feed. */
  description:
    "Notes on data platforms, distributed systems, Rust and the parts of infrastructure that only make sense once you have been burned by them.",
};

/** Where else to find the author: shown as logos in the running head. */
export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Almaz-KG/", handle: "@Almaz-KG" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/almazmurzabekov/",
    handle: "almazmurzabekov",
  },
  { label: "Telegram", href: "https://t.me/AlmazKG", handle: "@AlmazKG" },
  { label: "Email", href: `mailto:${SITE.email}`, handle: SITE.email },
] as const;

export type SocialLabel = (typeof SOCIALS)[number]["label"];

export const CV_HREF = "/cv.pdf";

export type StackGroup = {
  title: string;
  /** In the order the work runs through them. */
  rows: { layer: string; tools: string[] }[];
};

/**
 * What the work is built with: two stacks side by side, the data platforms
 * that are the day job and the language models work.
 */
export const STACK: StackGroup[] = [
  {
    title: "Data platforms",
    rows: [
      {
        layer: "Warehouse and lakehouse",
        tools: ["BigQuery", "Databricks", "Spark", "Delta Lake"],
      },
      { layer: "Pipelines", tools: ["Airflow", "dbt", "Kafka", "Structured Streaming"] },
      {
        layer: "Infrastructure",
        tools: ["Terraform", "Cloud Run", "GitHub Actions", "Workload Identity"],
      },
      { layer: "Agents", tools: ["Google ADK", "Vertex AI Agent Engine"] },
    ],
  },
  {
    title: "Language models",
    rows: [
      { layer: "Training", tools: ["PyTorch", "FSDP2", "torch.compile", "FlashAttention"] },
      { layer: "Measurement", tools: ["lm-evaluation-harness", "trainmeter"] },
      { layer: "Inference engines", tools: ["vLLM", "SGLang", "llama.cpp", "Ollama"] },
    ],
  },
];

/** The languages under both stacks. */
export const LANGUAGES = ["Python", "SQL", "Rust"];

/** Names the project's logo, which lives with the component (src/components/home). */
export type ProjectId =
  | "almz"
  | "trainmeter"
  | "pytorch-exercises"
  | "pytorch-distributed-exercises"
  | "nookat"
  | "db-academy";

export type Project = {
  id: ProjectId;
  name: string;
  /** One sentence for its tile: what it is, with a number where there is one. */
  description: string;
  /** Its repository, or its organisation, on GitHub. */
  repo: string;
  /**
   * Whether a visitor can open `repo`. A private repository is not linked, since
   * for everyone but its owner the link would be a 404, and its tile is marked
   * as work in progress.
   */
  isPublic: boolean;
};

/**
 * Side projects, in the order the page shows them: two to a row on a wide
 * screen, so neighbours here are neighbours there. The order is chosen, not
 * chronological: the language models and the tool that measures
 * their training first, the two sets of PyTorch drills side by side, then the
 * older projects.
 */
export const PROJECTS: Project[] = [
  {
    id: "almz",
    name: "almz",
    description:
      "A family of language models trained from zero, up to 1.04B parameters on 20B tokens.",
    repo: "https://github.com/Almaz-KG/almz",
    isPublic: false,
  },
  {
    id: "trainmeter",
    name: "trainmeter",
    description:
      "Where the FLOPs of a training run go and how well the GPUs are used, with the training code unchanged.",
    repo: "https://github.com/Almaz-KG/trainmeter",
    isPublic: false,
  },
  {
    id: "pytorch-exercises",
    name: "PyTorch exercises for LLM developers",
    description:
      "Twenty drills on PyTorch for LLM work, from broadcasting to a transformer block, AdamW and a KV cache.",
    repo: "https://github.com/Almaz-KG/pytorch-exercises-for-llm-developers",
    isPublic: false,
  },
  {
    id: "pytorch-distributed-exercises",
    name: "PyTorch distributed exercises for LLM developers",
    description:
      "Thirty drills on distributed PyTorch, from collectives to FSDP, pipeline parallelism and disaggregated serving.",
    repo: "https://github.com/Almaz-KG/pytorch-distributed-exercises-for-llm-developers",
    isPublic: false,
  },
  {
    id: "nookat",
    name: "nookat",
    description:
      "A lightweight desktop app for managing containers, built with Rust, Tauri and React.",
    repo: "https://github.com/nookat-io/nookat",
    isPublic: true,
  },
  {
    id: "db-academy",
    name: "db-academy.io",
    description:
      "Closed now: A learning path for engineers to build their own database from scratch in Rust, from SQL parser to MVCC.",
    repo: "https://github.com/db-academy-io",
    isPublic: true,
  },
];
