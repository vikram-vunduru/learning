export interface Module {
  id: string;
  title: string;
  file: string;
  month?: number;
  section?: string;
  course?: string;  // parent course group (e.g. "AI Associate")
  type?: 'study' | 'lecture' | 'lab' | 'exam' | 'youtube';
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

      // ── AI Associate Course ──────────────────────────────────────────────
      { id: "course-ai-associate", title: "Course Overview", file: "courses/salesforce/01-ai-associate/00-course-overview.md", month: 1, course: "AI Associate", type: "study" },

      // Section 1 — AI Fundamentals
      { id: "ai-assoc-l01", title: "L1: What is AI?", file: "courses/salesforce/01-ai-associate/section-01-ai-fundamentals/lecture-01-what-is-ai.md", month: 1, course: "AI Associate", section: "AI Fundamentals", type: "lecture" },
      { id: "ai-assoc-l02", title: "L2: Types of Machine Learning", file: "courses/salesforce/01-ai-associate/section-01-ai-fundamentals/lecture-02-ml-types.md", month: 1, course: "AI Associate", section: "AI Fundamentals", type: "lecture" },
      { id: "ai-assoc-l03", title: "L3: Neural Networks & Deep Learning", file: "courses/salesforce/01-ai-associate/section-01-ai-fundamentals/lecture-03-neural-networks-deep-learning.md", month: 1, course: "AI Associate", section: "AI Fundamentals", type: "lecture" },
      { id: "ai-assoc-l04", title: "L4: Predictive vs Generative AI", file: "courses/salesforce/01-ai-associate/section-01-ai-fundamentals/lecture-04-predictive-vs-generative-ai.md", month: 1, course: "AI Associate", section: "AI Fundamentals", type: "lecture" },

      // Section 2 — Generative AI Technology
      { id: "ai-assoc-l05", title: "L5: LLMs Explained", file: "courses/salesforce/01-ai-associate/section-02-generative-ai/lecture-05-llms-explained.md", month: 1, course: "AI Associate", section: "Generative AI Technology", type: "lecture" },
      { id: "ai-assoc-l06", title: "L6: Prompt Engineering", file: "courses/salesforce/01-ai-associate/section-02-generative-ai/lecture-06-prompt-engineering.md", month: 1, course: "AI Associate", section: "Generative AI Technology", type: "lecture" },
      { id: "ai-assoc-l07", title: "L7: Hallucinations, Bias & Limitations", file: "courses/salesforce/01-ai-associate/section-02-generative-ai/lecture-07-hallucinations-bias-limitations.md", month: 1, course: "AI Associate", section: "Generative AI Technology", type: "lecture" },
      { id: "ai-assoc-l08", title: "L8: Einstein Trust Layer", file: "courses/salesforce/01-ai-associate/section-02-generative-ai/lecture-08-einstein-trust-layer.md", month: 1, course: "AI Associate", section: "Generative AI Technology", type: "lecture" },
      { id: "ai-assoc-l09", title: "L9: RAG & Grounding", file: "courses/salesforce/01-ai-associate/section-02-generative-ai/lecture-09-rag-grounding.md", month: 1, course: "AI Associate", section: "Generative AI Technology", type: "lecture" },

      // Section 3 — AI in Salesforce
      { id: "ai-assoc-l10", title: "L10: Einstein Platform Overview", file: "courses/salesforce/01-ai-associate/section-03-ai-in-salesforce/lecture-10-einstein-platform-overview.md", month: 1, course: "AI Associate", section: "AI in Salesforce", type: "lecture" },
      { id: "ai-assoc-l11", title: "L11: Einstein Copilot & Agentforce", file: "courses/salesforce/01-ai-associate/section-03-ai-in-salesforce/lecture-11-einstein-copilot-agentforce.md", month: 1, course: "AI Associate", section: "AI in Salesforce", type: "lecture" },
      { id: "ai-assoc-l12", title: "L12: Prompt Builder in Salesforce", file: "courses/salesforce/01-ai-associate/section-03-ai-in-salesforce/lecture-12-prompt-builder-salesforce.md", month: 1, course: "AI Associate", section: "AI in Salesforce", type: "lecture" },
      { id: "ai-assoc-l13", title: "L13: Einstein Prediction Builder", file: "courses/salesforce/01-ai-associate/section-03-ai-in-salesforce/lecture-13-einstein-prediction-builder.md", month: 1, course: "AI Associate", section: "AI in Salesforce", type: "lecture" },
      { id: "ai-assoc-l14", title: "L14: Next Best Action & Recommendations", file: "courses/salesforce/01-ai-associate/section-03-ai-in-salesforce/lecture-14-next-best-action-recommendations.md", month: 1, course: "AI Associate", section: "AI in Salesforce", type: "lecture" },

      // Section 4 — Ethical Considerations
      { id: "ai-assoc-l15", title: "L15: Responsible AI Principles", file: "courses/salesforce/01-ai-associate/section-04-ethics/lecture-15-responsible-ai-principles.md", month: 1, course: "AI Associate", section: "Ethical Considerations", type: "lecture" },
      { id: "ai-assoc-l16", title: "L16: Bias in AI", file: "courses/salesforce/01-ai-associate/section-04-ethics/lecture-16-bias-in-ai.md", month: 1, course: "AI Associate", section: "Ethical Considerations", type: "lecture" },
      { id: "ai-assoc-l17", title: "L17: Transparency & Explainability", file: "courses/salesforce/01-ai-associate/section-04-ethics/lecture-17-transparency-explainability.md", month: 1, course: "AI Associate", section: "Ethical Considerations", type: "lecture" },
      { id: "ai-assoc-l18", title: "L18: Human Oversight & Accountability", file: "courses/salesforce/01-ai-associate/section-04-ethics/lecture-18-human-oversight-accountability.md", month: 1, course: "AI Associate", section: "Ethical Considerations", type: "lecture" },

      // Section 5 — Data for AI
      { id: "ai-assoc-l19", title: "L19: Why Data Quality Matters for AI", file: "courses/salesforce/01-ai-associate/section-05-data-for-ai/lecture-19-why-data-quality-matters-for-ai.md", month: 1, course: "AI Associate", section: "Data for AI", type: "lecture" },
      { id: "ai-assoc-l20", title: "L20: Training Data Explained", file: "courses/salesforce/01-ai-associate/section-05-data-for-ai/lecture-20-training-data-explained.md", month: 1, course: "AI Associate", section: "Data for AI", type: "lecture" },
      { id: "ai-assoc-l21", title: "L21: Data Cloud — Foundation for AI", file: "courses/salesforce/01-ai-associate/section-05-data-for-ai/lecture-21-data-cloud-foundation-for-ai.md", month: 1, course: "AI Associate", section: "Data for AI", type: "lecture" },
      { id: "ai-assoc-l22", title: "L22: Structured vs Unstructured Data", file: "courses/salesforce/01-ai-associate/section-05-data-for-ai/lecture-22-structured-vs-unstructured-data.md", month: 1, course: "AI Associate", section: "Data for AI", type: "lecture" },

      // Hands-On Labs
      { id: "ai-assoc-lab01", title: "Lab 1: Set Up Developer Org", file: "courses/salesforce/01-ai-associate/labs/lab-01-setup-developer-org.md", month: 1, course: "AI Associate", section: "Hands-On Labs", type: "lab" },
      { id: "ai-assoc-lab02", title: "Lab 2: Prompt Builder Hands-On", file: "courses/salesforce/01-ai-associate/labs/lab-02-prompt-builder-hands-on.md", month: 1, course: "AI Associate", section: "Hands-On Labs", type: "lab" },
      { id: "ai-assoc-lab03", title: "Lab 3: Einstein Prediction Builder", file: "courses/salesforce/01-ai-associate/labs/lab-03-einstein-prediction-builder.md", month: 1, course: "AI Associate", section: "Hands-On Labs", type: "lab" },
      { id: "ai-assoc-lab04", title: "Lab 4: Next Best Action Setup", file: "courses/salesforce/01-ai-associate/labs/lab-04-next-best-action-setup.md", month: 1, course: "AI Associate", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "ai-assoc-exam", title: "40-Question Practice Exam", file: "courses/salesforce/01-ai-associate/exam-prep/practice-exam-full-40-questions.md", month: 1, course: "AI Associate", section: "Exam Preparation", type: "exam" },
      { id: "ai-assoc-cheatsheet", title: "Cheat Sheet — Top Concepts", file: "courses/salesforce/01-ai-associate/exam-prep/top-concepts-cheat-sheet.md", month: 1, course: "AI Associate", section: "Exam Preparation", type: "exam" },
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
