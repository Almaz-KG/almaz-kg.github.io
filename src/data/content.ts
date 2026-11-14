export const SITE = {
  name: "Almaz Murzabekov",
  /** The job title in `<title>`, link previews and structured data. */
  role: "Senior Data & Infra Engineer",
  email: "almaz@murzabekov.net",
  blog: "https://almaz.murzabekov.net",
  /** This site's own source, linked from the colophon. */
  source: "https://github.com/Almaz-KG/almaz.murzabekov.net",
  tagline:
    "Senior Data & Infra Engineer with 10+ years building high-load, big-data platforms, lately agentic ones.",
};

/** The line under the name in the title block. */
export const ROLE_LINE = "Senior data and infrastructure engineer";

/** The opening paragraph of the home page, set as the document's abstract. */
export const ABSTRACT =
  "I build data platforms that do not fit on one machine. More than ten years on high-load and big-data systems, pipelines at petabyte scale. These days that is GCP: Airflow and dbt for the pipelines, Terraform for the ground they stand on, and multi-agent systems on Vertex AI that take the tedious half of ingestion off my hands. With AI everywhere, the bottleneck moved back to the data, which is where I have always worked. I write down the parts that took longer to understand than they should have.";

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

export const CV_HREF = "/cv.pdf";

/** Experience and education, newest first. `when` is free text: a range or a span. */
export const RECORD: { when: string; what: string; where: string }[] = [
  {
    when: "10+ years",
    what: "Data engineering",
    where: "High-load and big-data platforms, pipelines at petabyte scale",
  },
  { when: "2019-2021", what: "MSc, Big Data Systems", where: "Higher School of Economics, Moscow" },
  {
    when: "2011-2015",
    what: "BSc, Applied Informatics",
    where: "Saratov State Technical University",
  },
];

/** Certifications, listed under the record table. */
export const CERTIFICATIONS = "Google Cloud certifications.";

/** What the work is built with, by layer. */
export const STACK: { layer: string; tools: string }[] = [
  { layer: "Warehouse and lakehouse", tools: "BigQuery, Databricks, Spark, Delta Lake" },
  { layer: "Pipelines", tools: "Airflow, dbt, Kafka, Structured Streaming" },
  { layer: "Infrastructure", tools: "Terraform, Cloud Run, GitHub Actions, Workload Identity" },
  { layer: "Agents", tools: "Google ADK, Vertex AI Agent Engine" },
  { layer: "Languages", tools: "Python, SQL, Rust" },
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
  /** When it started, and whether it is still going, e.g. "2026 onwards". */
  when: string;
  kind: string;
  body: string;
  /**
   * Where the entry leads. A site path such as `/blog?tag=...` stays in this tab
   * and is routed client-side; a full URL opens a new one.
   */
  href: string;
  /** Label of the link, e.g. "Notes". */
  cta: string;
};

/**
 * A project whose notes live on the blog links to the index filtered by its
 * tag, so filing a post under it is adding that tag to the post's front matter.
 */
export const PROJECTS: Project[] = [
  {
    title: "Building my own LLM",
    when: "2026 onwards",
    kind: "Build log",
    body: "A language model from scratch, one component at a time.",
    href: "/blog?tag=building-own-llm",
    cta: "Notes",
  },
];

/** The closing paragraph of the home page, before the address. */
export const CONTACT_LINE =
  "Consulting, collaboration, a podcast, or an argument about whether the medallion architecture is over-hyped: my inbox is open.";
