export interface Module {
  id: string;
  title: string;
  file: string;
  month?: number;
}

export interface Track {
  id: string;
  title: string;
  icon: string;
  status: "active" | "planned";
  description: string;
  color: string;
  modules: Module[];
  certs?: Cert[];
}

export interface Cert {
  id: string;
  name: string;
  month: number;
  cost: string;
  passScore: string;
  questions: number;
}

export const TRACKS: Track[] = [
  {
    id: "salesforce",
    title: "Salesforce",
    icon: "☁️",
    status: "active",
    description: "Full Technical Architect path — 16 certs in 12 months",
    color: "blue",
    modules: [
      { id: "roadmap", title: "12-Month Master Roadmap", file: "salesforce-learning/00-master-roadmap.md", month: 0 },
      { id: "foundation", title: "Foundation Certs (AI Associate, Admin, App Builder)", file: "salesforce-learning/01-foundation/foundation-certifications.md", month: 1 },
      { id: "developer", title: "Developer Certs (PDI, PDII, JS Dev I)", file: "salesforce-learning/02-developer/developer-certifications.md", month: 4 },
      { id: "data-ai", title: "Data Cloud & Agentforce", file: "salesforce-learning/03-data-ai/data-cloud-agentforce-certifications.md", month: 5 },
      { id: "architect", title: "Architect Certs & CTA", file: "salesforce-learning/05-architect/architect-certifications.md", month: 9 },
      { id: "labs", title: "Hands-On Labs & Resources", file: "salesforce-learning/labs/hands-on-labs-and-resources.md", month: 0 },
    ],
    certs: [
      { id: "ai-associate", name: "AI Associate", month: 1, cost: "$75", passScore: "65%", questions: 40 },
      { id: "admin", name: "Administrator", month: 2, cost: "$200", passScore: "65%", questions: 60 },
      { id: "app-builder", name: "Platform App Builder", month: 3, cost: "$200", passScore: "63%", questions: 60 },
      { id: "pdi", name: "Platform Developer I", month: 4, cost: "$200", passScore: "65%", questions: 60 },
      { id: "jsi", name: "JavaScript Developer I", month: 5, cost: "$200", passScore: "65%", questions: 60 },
      { id: "data-cloud", name: "Data Cloud Consultant", month: 6, cost: "$200", passScore: "67%", questions: 60 },
      { id: "agentforce", name: "Agentforce Specialist", month: 7, cost: "$200", passScore: "65%", questions: 60 },
      { id: "pdii", name: "Platform Developer II", month: 8, cost: "$400", passScore: "65%", questions: 60 },
      { id: "adv-admin", name: "Advanced Administrator", month: 8, cost: "$200", passScore: "65%", questions: 60 },
      { id: "data-arch", name: "Data Architect", month: 9, cost: "$400", passScore: "62%", questions: 60 },
      { id: "sharing-arch", name: "Sharing & Visibility Architect", month: 9, cost: "$400", passScore: "63%", questions: 60 },
      { id: "integration-arch", name: "Integration Architect", month: 10, cost: "$400", passScore: "63%", questions: 60 },
      { id: "devops-arch", name: "Dev Lifecycle & Deployment Architect", month: 10, cost: "$400", passScore: "63%", questions: 60 },
      { id: "iam", name: "Identity & Access Management Designer", month: 11, cost: "$400", passScore: "63%", questions: 60 },
      { id: "mobile", name: "Mobile Solutions Designer", month: 11, cost: "$400", passScore: "63%", questions: 60 },
      { id: "cta", name: "Certified Technical Architect (CTA)", month: 12, cost: "~$4,000", passScore: "Board Review", questions: 60 },
    ],
  },
  {
    id: "anthropic",
    title: "Anthropic / Claude",
    icon: "🤖",
    status: "planned",
    description: "Claude API, prompt engineering, MCP, agent building",
    color: "orange",
    modules: [],
  },
  {
    id: "nvidia",
    title: "NVIDIA AI",
    icon: "🖥️",
    status: "planned",
    description: "NVIDIA AI certifications, NIM microservices, AI Enterprise",
    color: "green",
    modules: [],
  },
  {
    id: "aws",
    title: "AWS",
    icon: "☁️",
    status: "planned",
    description: "Solutions Architect, ML Specialty, Bedrock, SageMaker",
    color: "yellow",
    modules: [],
  },
  {
    id: "databricks",
    title: "Databricks",
    icon: "⚡",
    status: "planned",
    description: "Data Engineer, ML Professional, Unity Catalog",
    color: "red",
    modules: [],
  },
];

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function getModule(trackId: string, moduleId: string): Module | undefined {
  const track = getTrack(trackId);
  return track?.modules.find((m) => m.id === moduleId);
}
