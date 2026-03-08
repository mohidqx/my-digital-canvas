import type { Project, Skill } from "./schemas";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "NeuralDash — AI Analytics Platform",
    description:
      "A real-time analytics dashboard powered by machine learning models. Processes 10M+ events/day with sub-100ms query latency. Features anomaly detection and predictive insights.",
    techStack: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis"],
    githubUrl: "https://github.com",
    liveDemoUrl: "https://example.com",
    imageUrl: "",
    featured: true,
    order: 0,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Nexus — Distributed Task Queue",
    description:
      "High-throughput task queue system built for microservices. Supports priority queues, dead-letter queues, and retry logic. Handles 500K+ tasks/minute with zero message loss.",
    techStack: ["Node.js", "RabbitMQ", "Docker", "Kubernetes", "Go"],
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    imageUrl: "",
    featured: true,
    order: 1,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    title: "Cipher — E2E Encrypted Chat",
    description:
      "End-to-end encrypted messaging app using the Signal Protocol. Zero-knowledge architecture ensures even servers can't read messages. WebRTC for peer-to-peer video calls.",
    techStack: ["React Native", "WebRTC", "Signal Protocol", "Firebase", "Rust"],
    githubUrl: "https://github.com",
    liveDemoUrl: "https://example.com",
    imageUrl: "",
    featured: false,
    order: 2,
    createdAt: "2024-03-01",
  },
  {
    id: "4",
    title: "Forge — Design System Builder",
    description:
      "Visual design system creation tool with code export. Generate Tailwind configs, CSS variables, and React component libraries from a visual editor. Used by 2K+ designers.",
    techStack: ["React", "Vite", "Tailwind CSS", "Radix UI", "TypeScript"],
    githubUrl: "https://github.com",
    liveDemoUrl: "https://example.com",
    imageUrl: "",
    featured: true,
    order: 3,
    createdAt: "2024-04-01",
  },
  {
    id: "5",
    title: "Orbit — Developer Portfolio Engine",
    description:
      "Open-source portfolio generator for developers. Pulls from GitHub API, auto-generates project pages, and deploys to edge networks. Zero-config setup.",
    techStack: ["Next.js", "GraphQL", "GitHub API", "Vercel Edge", "MDX"],
    githubUrl: "https://github.com",
    liveDemoUrl: "https://example.com",
    imageUrl: "",
    featured: false,
    order: 4,
    createdAt: "2024-05-01",
  },
  {
    id: "6",
    title: "Prism — Color Intelligence API",
    description:
      "AI-powered color palette generation API. Analyzes images to extract color schemes, generates accessible palettes, and provides contrast ratio checking for WCAG compliance.",
    techStack: ["Python", "TensorFlow", "FastAPI", "AWS Lambda", "Redis"],
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    imageUrl: "",
    featured: false,
    order: 5,
    createdAt: "2024-06-01",
  },
];

export const mockSkills: Skill[] = [
  // Frontend
  { id: "s1", name: "React / Next.js", level: 95, category: "frontend" },
  { id: "s2", name: "TypeScript", level: 92, category: "frontend" },
  { id: "s3", name: "Tailwind CSS", level: 90, category: "frontend" },
  { id: "s4", name: "Framer Motion", level: 82, category: "frontend" },
  { id: "s5", name: "GraphQL", level: 80, category: "frontend" },
  // Backend
  { id: "s6", name: "Node.js", level: 90, category: "backend" },
  { id: "s7", name: "Python / FastAPI", level: 85, category: "backend" },
  { id: "s8", name: "PostgreSQL", level: 83, category: "backend" },
  { id: "s9", name: "Redis", level: 75, category: "backend" },
  { id: "s10", name: "Go", level: 65, category: "backend" },
  // DevOps
  { id: "s11", name: "Docker / K8s", level: 82, category: "devops" },
  { id: "s12", name: "AWS / GCP", level: 78, category: "devops" },
  { id: "s13", name: "CI/CD Pipelines", level: 85, category: "devops" },
  { id: "s14", name: "Terraform", level: 70, category: "devops" },
];

export const mockProfile = {
  name: "Alex Meridian",
  tagline: "Full-Stack Engineer & Systems Architect",
  bio: "I build fast, scalable, and beautiful software. Obsessed with developer experience, distributed systems, and crafting interfaces that feel inevitable.",
  location: "San Francisco, CA",
  email: "alex@meridian.dev",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  resumeUrl: "#",
  avatarUrl: "",
};

export const mockStats = [
  { label: "Projects Shipped", value: "40+", icon: "Layers" },
  { label: "GitHub Stars", value: "2.4K", icon: "Star" },
  { label: "Years Experience", value: "6+", icon: "Calendar" },
  { label: "Open Source Contributions", value: "180+", icon: "GitMerge" },
];
