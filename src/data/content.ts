export const ROLES = [
  "Data & Infra Engineer",
  "Lakehouse Builder",
  "Rustacean",
  "Pipeline Plumber",
  "Agent Wrangler",
  "AI Data Enabler",
  "MLOps Engineer",
  "Database Developer",
  "Founder",
];

export const SITE = {
  name: "Almaz Murzabekov",
  role: "Senior Data & Infra Engineer",
  email: "almaz@murzabekov.net",
  blog: "https://almaz.murzabekov.net",
  tagline:
    "Senior Data & Infra Engineer with 10+ years building high-load, big-data platforms — lately agentic ones.",
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Almaz-KG/", handle: "@Almaz-KG" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/almazmurzabekov/",
    handle: "almazmurzabekov",
  },
  { label: "Telegram", href: "https://t.me/AlmazKG", handle: "@AlmazKG" },
  { label: "Email", href: "mailto:almaz@murzabekov.net", handle: "almaz@murzabekov.net" },
];

export const STATS = [
  { value: "10+", label: "years in data" },
  { value: "PB", label: "scale pipelines" },
  { value: "MSc", label: "Big Data Systems" },
  { value: "Certs", label: "GCP Certifications" },
];

export const FOCUS = [
  {
    n: "01",
    title: "Data Platforms",
    body: "Cloud-native platforms on GCP and lakehouse architectures on Databricks - BigQuery, Spark, Structured Streaming and Delta. Batch and streaming that survives production.",
    tags: ["GCP", "BigQuery", "Spark", "Delta Lake", "Lakehouse"],
  },
  {
    n: "02",
    title: "Pipelines & Orchestration",
    body: "Airflow DAGs, dbt models with dry-run validation, Kafka topics and keyless CI/CD that ships transformations safely from laptop to prod.",
    tags: ["Airflow", "dbt", "Kafka", "GitHub Actions", "Workload Identity"],
  },
  {
    n: "03",
    title: "System Engineering & Performance",
    body: "System engineering and performance challenges - reliability, latency, throughput and scaling for demanding batch and streaming workloads.",
    tags: ["Reliability", "Scaling", "Performance", "Batch", "Streaming"],
  },
  {
    n: "04",
    title: "Agentic Systems & AI Enablement",
    body: "Multi-agent ETL on Vertex AI Agent Engine, Rust for the hot paths, Python for everything else, and clean context layers so ML and LLM workloads get fresh, correct data.",
    tags: ["Google ADK", "Vertex AI", "Rust", "Python", "Cloud Run", "Terraform"],
  },
] as const;

export type Project = {
  title: string;
  year: string;
  kind: string;
  body: string;
  /**
   * Where the card leads. A site path such as `/blog?tag=...` stays in this tab
   * and is routed client-side; a full URL opens a new one.
   */
  href: string;
  /** Label of the main link, e.g. "Read the notes". */
  cta: string;
  stack?: string[];
  repo?: string;
  /** Square logo mark, transparent background. */
  logo?: string;
};

/**
 * A project whose notes live on the blog links to the index filtered by its
 * tag, so filing a post under it is adding that tag to the post's front matter.
 */
export const PROJECTS: Project[] = [
  {
    title: "Building My Own LLM",
    year: "2026 ->",
    kind: "Build log",
    body: "Building a language model from scratch, one component at a time. The notes from the way live on the blog.",
    href: "/blog?tag=building-own-llm",
    cta: "Read the notes",
  },
];

export const TIMELINE = [
  {
    period: "2019 — 2021",
    title: "MSc, Big Data Systems",
    org: "Higher School of Economics, Moscow",
  },
  {
    period: "2011 — 2015",
    title: "BSc, Applied Informatics",
    org: "Saratov State Technical University",
  },
];
