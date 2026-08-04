import type { Tone } from "@/utils/tones";

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
  stack: string[];
  href: string;
  repo?: string;
  /** Square logo mark, transparent background. */
  logo: string;
  /** Homepage screenshot, cropped to the hero. */
  shot: string;
};

export const PROJECTS: Project[] = [
  {
    title: "db-academy.io",
    year: "2024 →",
    kind: "Education platform",
    body: "A learning platform for data engineers — structured courses on databases, distributed systems and the modern data stack, written the way I wish someone had explained them to me.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Python"],
    href: "https://db-academy.io",
    logo: "/assets/images/projects/db-academy-io-logo.webp",
    shot: "/assets/images/projects/db-academy-io.webp",
  },
  {
    title: "nookat.io",
    year: "2025 →",
    kind: "Desktop app",
    body: "A lightweight container manager for people who like Docker but not the eight terminal tabs it usually takes. Native desktop app built on Tauri, Rust and React.",
    stack: ["Rust", "Tauri", "React", "TypeScript"],
    href: "https://nookat.io",
    repo: "https://github.com/nookat-io/nookat",
    logo: "/assets/images/projects/nookat-io-logo.webp",
    shot: "/assets/images/projects/nookat-io.webp",
  },
];

export type Book = {
  title: string;
  author: string;
  /** Accent colour of the plate behind the cover. */
  tone: Tone;
  href: string;
  cover: string;
};

export const BOOKS: Book[] = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    tone: "lime",
    href: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
    cover: "/assets/images/books/covers/designing-data-intensive-applications.jpg",
  },
  {
    title: "Fundamentals of Data Engineering",
    author: "Reis & Housley",
    tone: "aqua",
    href: "https://www.amazon.com/Fundamentals-Data-Engineering-Robust-Systems/dp/1098108302",
    cover: "/assets/images/books/covers/fundamentals-of-data-engineering.jpg",
  },
  {
    title: "Database Internals",
    author: "Alex Petrov",
    tone: "violet",
    href: "https://www.amazon.com/Database-Internals-Deep-Distributed-Systems/dp/1492040347",
    cover: "/assets/images/books/covers/database-internals.jpg",
  },
  {
    title: "The Staff Engineer's Path",
    author: "Tanya Reilly",
    tone: "citrus",
    href: "https://www.amazon.com/Staff-Engineers-Path-Individual-Contributors/dp/1098118731",
    cover: "/assets/images/books/covers/the-staff-engineers-path.jpg",
  },
  {
    title: "Design It! Programmer to Architect",
    author: "Michael Keeling",
    tone: "lime",
    href: "https://www.amazon.com/Design-Programmer-Architect-Pragmatic-Programmers/dp/1680502093",
    cover: "/assets/images/books/covers/design-it.jpg",
  },
  {
    title: "Systems Performance",
    author: "Brendan Gregg",
    tone: "violet",
    href: "https://www.amazon.com/Systems-Performance-Brendan-Gregg/dp/0136820158",
    cover: "/assets/images/books/covers/systems-performance.jpg",
  },
  {
    title: "Advanced Algorithms and Data Structures",
    author: "Marcello La Rocca",
    tone: "lime",
    href: "https://www.amazon.com/Advanced-Algorithms-Structures-Marcello-Rocca/dp/1617295485",
    cover: "/assets/images/books/covers/advanced-algorithms-and-data-structures.jpg",
  },
  {
    title: "Software Architecture: The Hard Parts",
    author: "Neal Ford",
    tone: "aqua",
    href: "https://www.amazon.com/Software-Architecture-Trade-Off-Distributed-Architectures/dp/1492086894",
    cover: "/assets/images/books/covers/software-architecture-the-hard-parts.jpg",
  },
  {
    title: "Fundamentals of Database Systems",
    author: "Elmasri & Navathe",
    tone: "citrus",
    href: "https://www.amazon.com/Fundamentals-Database-Systems-Ramez-Elmasri/dp/0133970779",
    cover: "/assets/images/books/covers/fundamentals-of-database-systems.jpg",
  },
  {
    title: "Algorithms and Data Structures for Massive Datasets",
    author: "Dzejla Medjedovic",
    tone: "lime",
    href: "https://www.amazon.com/Algorithms-Data-Structures-Massive-Datasets/dp/1617298034",
    cover: "/assets/images/books/covers/algorithms-for-massive-datasets.jpg",
  },
  {
    title: "SQLite Forensics",
    author: "Paul Sanderson",
    tone: "aqua",
    href: "https://www.amazon.com/SQLite-Forensics-Paul-Sanderson/dp/1980293074",
    cover: "/assets/images/books/covers/sqlite-forensics.jpg",
  },
  {
    title: "Operating Systems: Three Easy Pieces",
    author: "Arpaci-Dusseau",
    tone: "citrus",
    href: "https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/198508659X",
    cover: "/assets/images/books/covers/operating-systems-three-easy-pieces.jpg",
  },
  {
    title: "Principles of Distributed Database Systems",
    author: "Özsu & Valduriez",
    tone: "lime",
    href: "https://www.amazon.com/Principles-Distributed-Database-Systems-Tamer/dp/3030262529",
    cover: "/assets/images/books/covers/principles-of-distributed-database-systems.jpg",
  },
  {
    title: "Build a Large Language Model (From Scratch)",
    author: "Sebastian Raschka",
    tone: "violet",
    href: "https://www.amazon.com/Build-Large-Language-Model-Scratch/dp/1633437167",
    cover: "/assets/images/books/covers/build-a-large-language-model.jpg",
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
