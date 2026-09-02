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

      // ── Salesforce Administrator ──────────────────────────────────────────
      { id: "admin-overview", title: "Course Overview", file: "courses/salesforce/02-administrator/00-course-overview.md", month: 2, course: "Administrator", type: "study" },

      // Section 01 — Org Setup
      { id: "admin-l01", title: "L1: Salesforce Org Setup", file: "courses/salesforce/02-administrator/section-01-org-setup/lecture-01-salesforce-org-setup.md", month: 2, course: "Administrator", section: "Org Setup", type: "lecture" },
      { id: "admin-l02", title: "L2: Company Information & Settings", file: "courses/salesforce/02-administrator/section-01-org-setup/lecture-02-company-information-settings.md", month: 2, course: "Administrator", section: "Org Setup", type: "lecture" },
      { id: "admin-l03", title: "L3: Lightning Experience", file: "courses/salesforce/02-administrator/section-01-org-setup/lecture-03-lightning-experience.md", month: 2, course: "Administrator", section: "Org Setup", type: "lecture" },
      { id: "admin-l04", title: "L4: AppExchange", file: "courses/salesforce/02-administrator/section-01-org-setup/lecture-04-appexchange.md", month: 2, course: "Administrator", section: "Org Setup", type: "lecture" },

      // Section 02 — User Management
      { id: "admin-l05", title: "L5: User Setup & Management", file: "courses/salesforce/02-administrator/section-02-user-management/lecture-05-user-setup-management.md", month: 2, course: "Administrator", section: "User Management", type: "lecture" },
      { id: "admin-l06", title: "L6: Profiles & Permission Sets", file: "courses/salesforce/02-administrator/section-02-user-management/lecture-06-profiles-permission-sets.md", month: 2, course: "Administrator", section: "User Management", type: "lecture" },
      { id: "admin-l07", title: "L7: Roles & Hierarchy", file: "courses/salesforce/02-administrator/section-02-user-management/lecture-07-roles-hierarchy.md", month: 2, course: "Administrator", section: "User Management", type: "lecture" },
      { id: "admin-l08", title: "L8: Delegated Administration", file: "courses/salesforce/02-administrator/section-02-user-management/lecture-08-delegated-administration.md", month: 2, course: "Administrator", section: "User Management", type: "lecture" },

      // Section 03 — Security & Access
      { id: "admin-l09", title: "L9: Org-Wide Defaults", file: "courses/salesforce/02-administrator/section-03-security-access/lecture-09-org-wide-defaults.md", month: 2, course: "Administrator", section: "Security & Access", type: "lecture" },
      { id: "admin-l10", title: "L10: Sharing Rules", file: "courses/salesforce/02-administrator/section-03-security-access/lecture-10-sharing-rules.md", month: 2, course: "Administrator", section: "Security & Access", type: "lecture" },
      { id: "admin-l11", title: "L11: Manual Sharing & Teams", file: "courses/salesforce/02-administrator/section-03-security-access/lecture-11-manual-sharing-teams.md", month: 2, course: "Administrator", section: "Security & Access", type: "lecture" },
      { id: "admin-l12", title: "L12: Field & Record Level Security", file: "courses/salesforce/02-administrator/section-03-security-access/lecture-12-field-record-level-security.md", month: 2, course: "Administrator", section: "Security & Access", type: "lecture" },

      // Section 04 — Standard & Custom Objects
      { id: "admin-l13", title: "L13: Object Manager & Fields", file: "courses/salesforce/02-administrator/section-04-standard-custom-objects/lecture-13-object-manager-fields.md", month: 2, course: "Administrator", section: "Objects & Fields", type: "lecture" },
      { id: "admin-l14", title: "L14: Custom Fields & Data Types", file: "courses/salesforce/02-administrator/section-04-standard-custom-objects/lecture-14-custom-fields-data-types.md", month: 2, course: "Administrator", section: "Objects & Fields", type: "lecture" },
      { id: "admin-l15", title: "L15: Page Layouts & Record Types", file: "courses/salesforce/02-administrator/section-04-standard-custom-objects/lecture-15-page-layouts-record-types.md", month: 2, course: "Administrator", section: "Objects & Fields", type: "lecture" },
      { id: "admin-l16", title: "L16: Relationships & Junction Objects", file: "courses/salesforce/02-administrator/section-04-standard-custom-objects/lecture-16-relationships-junction-objects.md", month: 2, course: "Administrator", section: "Objects & Fields", type: "lecture" },
      { id: "admin-l17", title: "L17: Formula & Roll-Up Summary Fields", file: "courses/salesforce/02-administrator/section-04-standard-custom-objects/lecture-17-formula-rollup-fields.md", month: 2, course: "Administrator", section: "Objects & Fields", type: "lecture" },

      // Section 05 — Sales & Marketing
      { id: "admin-l18", title: "L18: Leads & Campaigns", file: "courses/salesforce/02-administrator/section-05-sales-marketing/lecture-18-leads-campaigns.md", month: 2, course: "Administrator", section: "Sales & Marketing", type: "lecture" },
      { id: "admin-l19", title: "L19: Accounts & Contacts", file: "courses/salesforce/02-administrator/section-05-sales-marketing/lecture-19-accounts-contacts.md", month: 2, course: "Administrator", section: "Sales & Marketing", type: "lecture" },
      { id: "admin-l20", title: "L20: Opportunities & Products", file: "courses/salesforce/02-administrator/section-05-sales-marketing/lecture-20-opportunities-products.md", month: 2, course: "Administrator", section: "Sales & Marketing", type: "lecture" },
      { id: "admin-l21", title: "L21: Quotes & Contracts", file: "courses/salesforce/02-administrator/section-05-sales-marketing/lecture-21-quotes-contracts.md", month: 2, course: "Administrator", section: "Sales & Marketing", type: "lecture" },

      // Section 06 — Service & Support
      { id: "admin-l22", title: "L22: Cases & Case Management", file: "courses/salesforce/02-administrator/section-06-service-support/lecture-22-cases-case-management.md", month: 2, course: "Administrator", section: "Service & Support", type: "lecture" },
      { id: "admin-l23", title: "L23: Queues & Assignment Rules", file: "courses/salesforce/02-administrator/section-06-service-support/lecture-23-queues-assignment-rules.md", month: 2, course: "Administrator", section: "Service & Support", type: "lecture" },
      { id: "admin-l24", title: "L24: Entitlements & Milestones", file: "courses/salesforce/02-administrator/section-06-service-support/lecture-24-entitlements-milestones.md", month: 2, course: "Administrator", section: "Service & Support", type: "lecture" },
      { id: "admin-l25", title: "L25: Salesforce Knowledge", file: "courses/salesforce/02-administrator/section-06-service-support/lecture-25-knowledge-articles.md", month: 2, course: "Administrator", section: "Service & Support", type: "lecture" },

      // Section 07 — Activity & Chatter
      { id: "admin-l26", title: "L26: Activities, Tasks & Events", file: "courses/salesforce/02-administrator/section-07-activity-chatter/lecture-26-activities-tasks-events.md", month: 2, course: "Administrator", section: "Productivity & Collaboration", type: "lecture" },
      { id: "admin-l27", title: "L27: Chatter & Collaboration", file: "courses/salesforce/02-administrator/section-07-activity-chatter/lecture-27-chatter-collaboration.md", month: 2, course: "Administrator", section: "Productivity & Collaboration", type: "lecture" },

      // Section 08 — Data & Analytics
      { id: "admin-l28", title: "L28: Reports Basics", file: "courses/salesforce/02-administrator/section-08-data-analytics/lecture-28-reports-basics.md", month: 2, course: "Administrator", section: "Data & Analytics", type: "lecture" },
      { id: "admin-l29", title: "L29: Report Types & Formats", file: "courses/salesforce/02-administrator/section-08-data-analytics/lecture-29-report-types-formats.md", month: 2, course: "Administrator", section: "Data & Analytics", type: "lecture" },
      { id: "admin-l30", title: "L30: Dashboards", file: "courses/salesforce/02-administrator/section-08-data-analytics/lecture-30-dashboards.md", month: 2, course: "Administrator", section: "Data & Analytics", type: "lecture" },
      { id: "admin-l31", title: "L31: List Views & Filters", file: "courses/salesforce/02-administrator/section-08-data-analytics/lecture-31-list-views-filters.md", month: 2, course: "Administrator", section: "Data & Analytics", type: "lecture" },

      // Section 09 — Automation
      { id: "admin-l32", title: "L32: Validation Rules", file: "courses/salesforce/02-administrator/section-09-automation/lecture-32-validation-rules.md", month: 2, course: "Administrator", section: "Automation", type: "lecture" },
      { id: "admin-l33", title: "L33: Workflow Rules", file: "courses/salesforce/02-administrator/section-09-automation/lecture-33-workflow-rules.md", month: 2, course: "Administrator", section: "Automation", type: "lecture" },
      { id: "admin-l34", title: "L34: Process Builder & Flows", file: "courses/salesforce/02-administrator/section-09-automation/lecture-34-process-builder-flows.md", month: 2, course: "Administrator", section: "Automation", type: "lecture" },
      { id: "admin-l35", title: "L35: Approval Processes", file: "courses/salesforce/02-administrator/section-09-automation/lecture-35-approval-processes.md", month: 2, course: "Administrator", section: "Automation", type: "lecture" },

      // Section 10 — Data Management
      { id: "admin-l36", title: "L36: Data Import & Export", file: "courses/salesforce/02-administrator/section-10-data-management/lecture-36-data-import-export.md", month: 2, course: "Administrator", section: "Data Management", type: "lecture" },
      { id: "admin-l37", title: "L37: Data Quality & Duplicate Management", file: "courses/salesforce/02-administrator/section-10-data-management/lecture-37-data-quality-duplicate-management.md", month: 2, course: "Administrator", section: "Data Management", type: "lecture" },
      { id: "admin-l38", title: "L38: Sandboxes & Change Sets", file: "courses/salesforce/02-administrator/section-10-data-management/lecture-38-sandboxes-change-sets.md", month: 2, course: "Administrator", section: "Data Management", type: "lecture" },

      // Labs
      { id: "admin-lab01", title: "Lab 1: Admin Org Setup", file: "courses/salesforce/02-administrator/labs/lab-01-admin-org-setup.md", month: 2, course: "Administrator", section: "Hands-On Labs", type: "lab" },
      { id: "admin-lab02", title: "Lab 2: Security Model Setup", file: "courses/salesforce/02-administrator/labs/lab-02-security-model-setup.md", month: 2, course: "Administrator", section: "Hands-On Labs", type: "lab" },
      { id: "admin-lab03", title: "Lab 3: Custom Objects & Automation", file: "courses/salesforce/02-administrator/labs/lab-03-custom-objects-automation.md", month: 2, course: "Administrator", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "admin-exam", title: "60-Question Practice Exam", file: "courses/salesforce/02-administrator/exam-prep/practice-exam-60-questions.md", month: 2, course: "Administrator", section: "Exam Preparation", type: "exam" },
      { id: "admin-cheatsheet", title: "Admin Cheat Sheet", file: "courses/salesforce/02-administrator/exam-prep/admin-cheat-sheet.md", month: 2, course: "Administrator", section: "Exam Preparation", type: "exam" },

      // ── Course 3: Platform App Builder ──────────────────────────────────────
      { id: "app-builder-overview", title: "Course Overview: Platform App Builder", file: "courses/salesforce/03-app-builder/00-course-overview.md", month: 3, course: "App Builder", section: "Course Overview", type: "study" },

      // Section 01 — Platform Fundamentals
      { id: "app-builder-l01", title: "L01: Salesforce Platform Overview", file: "courses/salesforce/03-app-builder/section-01-platform-fundamentals/lecture-01-salesforce-platform-overview.md", month: 3, course: "App Builder", section: "Platform Fundamentals", type: "lecture" },
      { id: "app-builder-l02", title: "L02: Data Modeling Fundamentals", file: "courses/salesforce/03-app-builder/section-01-platform-fundamentals/lecture-02-data-modeling-fundamentals.md", month: 3, course: "App Builder", section: "Platform Fundamentals", type: "lecture" },
      { id: "app-builder-l03", title: "L03: Salesforce Security Model", file: "courses/salesforce/03-app-builder/section-01-platform-fundamentals/lecture-03-salesforce-security-model.md", month: 3, course: "App Builder", section: "Platform Fundamentals", type: "lecture" },
      { id: "app-builder-l04", title: "L04: Environment Strategy", file: "courses/salesforce/03-app-builder/section-01-platform-fundamentals/lecture-04-environment-strategy.md", month: 3, course: "App Builder", section: "Platform Fundamentals", type: "lecture" },

      // Section 02 — Data Modeling
      { id: "app-builder-l05", title: "L05: Custom Objects & Fields", file: "courses/salesforce/03-app-builder/section-02-data-modeling/lecture-05-custom-objects-fields.md", month: 3, course: "App Builder", section: "Data Modeling", type: "lecture" },
      { id: "app-builder-l06", title: "L06: Object Relationships", file: "courses/salesforce/03-app-builder/section-02-data-modeling/lecture-06-object-relationships.md", month: 3, course: "App Builder", section: "Data Modeling", type: "lecture" },
      { id: "app-builder-l07", title: "L07: Schema Builder", file: "courses/salesforce/03-app-builder/section-02-data-modeling/lecture-07-schema-builder.md", month: 3, course: "App Builder", section: "Data Modeling", type: "lecture" },
      { id: "app-builder-l08", title: "L08: Data Management Tools", file: "courses/salesforce/03-app-builder/section-02-data-modeling/lecture-08-data-management-tools.md", month: 3, course: "App Builder", section: "Data Modeling", type: "lecture" },
      { id: "app-builder-l09", title: "L09: Formula & Rollup Fields", file: "courses/salesforce/03-app-builder/section-02-data-modeling/lecture-09-formula-rollup-fields.md", month: 3, course: "App Builder", section: "Data Modeling", type: "lecture" },

      // Section 03 — Business Logic & Automation
      { id: "app-builder-l10", title: "L10: Validation Rules", file: "courses/salesforce/03-app-builder/section-03-business-logic-automation/lecture-10-validation-rules.md", month: 3, course: "App Builder", section: "Business Logic & Automation", type: "lecture" },
      { id: "app-builder-l11", title: "L11: Flow Builder Fundamentals", file: "courses/salesforce/03-app-builder/section-03-business-logic-automation/lecture-11-flow-builder-fundamentals.md", month: 3, course: "App Builder", section: "Business Logic & Automation", type: "lecture" },
      { id: "app-builder-l12", title: "L12: Record-Triggered Flows", file: "courses/salesforce/03-app-builder/section-03-business-logic-automation/lecture-12-record-triggered-flows.md", month: 3, course: "App Builder", section: "Business Logic & Automation", type: "lecture" },
      { id: "app-builder-l13", title: "L13: Screen Flows", file: "courses/salesforce/03-app-builder/section-03-business-logic-automation/lecture-13-screen-flows.md", month: 3, course: "App Builder", section: "Business Logic & Automation", type: "lecture" },
      { id: "app-builder-l14", title: "L14: Approval Processes", file: "courses/salesforce/03-app-builder/section-03-business-logic-automation/lecture-14-approval-processes.md", month: 3, course: "App Builder", section: "Business Logic & Automation", type: "lecture" },
      { id: "app-builder-l15", title: "L15: When to Use Which Tool", file: "courses/salesforce/03-app-builder/section-03-business-logic-automation/lecture-15-when-to-use-which-tool.md", month: 3, course: "App Builder", section: "Business Logic & Automation", type: "lecture" },

      // Section 04 — User Interface
      { id: "app-builder-l16", title: "L16: Lightning App Builder", file: "courses/salesforce/03-app-builder/section-04-user-interface/lecture-16-lightning-app-builder.md", month: 3, course: "App Builder", section: "User Interface", type: "lecture" },
      { id: "app-builder-l17", title: "L17: Lightning Components Overview", file: "courses/salesforce/03-app-builder/section-04-user-interface/lecture-17-lightning-components-overview.md", month: 3, course: "App Builder", section: "User Interface", type: "lecture" },
      { id: "app-builder-l18", title: "L18: Page Layouts & Record Types", file: "courses/salesforce/03-app-builder/section-04-user-interface/lecture-18-page-layouts-record-types.md", month: 3, course: "App Builder", section: "User Interface", type: "lecture" },
      { id: "app-builder-l19", title: "L19: List Views & Search Layouts", file: "courses/salesforce/03-app-builder/section-04-user-interface/lecture-19-list-views-search-layouts.md", month: 3, course: "App Builder", section: "User Interface", type: "lecture" },
      { id: "app-builder-l20", title: "L20: App Manager & Navigation", file: "courses/salesforce/03-app-builder/section-04-user-interface/lecture-20-app-manager-navigation.md", month: 3, course: "App Builder", section: "User Interface", type: "lecture" },

      // Section 05 — App Deployment
      { id: "app-builder-l21", title: "L21: Change Sets & Deployment", file: "courses/salesforce/03-app-builder/section-05-app-deployment/lecture-21-change-sets-deployment.md", month: 3, course: "App Builder", section: "App Deployment", type: "lecture" },
      { id: "app-builder-l22", title: "L22: Packages & AppExchange", file: "courses/salesforce/03-app-builder/section-05-app-deployment/lecture-22-packages-appexchange.md", month: 3, course: "App Builder", section: "App Deployment", type: "lecture" },
      { id: "app-builder-l23", title: "L23: Release Management", file: "courses/salesforce/03-app-builder/section-05-app-deployment/lecture-23-release-management.md", month: 3, course: "App Builder", section: "App Deployment", type: "lecture" },

      // Labs
      { id: "app-builder-lab01", title: "Lab 1: Data Model Design", file: "courses/salesforce/03-app-builder/labs/lab-01-data-model-design.md", month: 3, course: "App Builder", section: "Hands-On Labs", type: "lab" },
      { id: "app-builder-lab02", title: "Lab 2: Flow Builder Automation", file: "courses/salesforce/03-app-builder/labs/lab-02-flow-builder-automation.md", month: 3, course: "App Builder", section: "Hands-On Labs", type: "lab" },
      { id: "app-builder-lab03", title: "Lab 3: Lightning App Build", file: "courses/salesforce/03-app-builder/labs/lab-03-lightning-app-build.md", month: 3, course: "App Builder", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "app-builder-exam", title: "60-Question Practice Exam", file: "courses/salesforce/03-app-builder/exam-prep/practice-exam-60-questions.md", month: 3, course: "App Builder", section: "Exam Preparation", type: "exam" },
      { id: "app-builder-cheatsheet", title: "App Builder Cheat Sheet", file: "courses/salesforce/03-app-builder/exam-prep/app-builder-cheat-sheet.md", month: 3, course: "App Builder", section: "Exam Preparation", type: "exam" },

      // ── Course 4: Platform Developer I ──────────────────────────────────────
      { id: "pdi-overview", title: "Course Overview: Platform Developer I", file: "courses/salesforce/04-platform-developer-i/00-course-overview.md", month: 4, course: "Platform Developer I", section: "Course Overview", type: "study" },

      // Section 01 — Developer Fundamentals
      { id: "pdi-l01", title: "L01: Developer Console & Tools", file: "courses/salesforce/04-platform-developer-i/section-01-developer-fundamentals/lecture-01-developer-console-tools.md", month: 4, course: "Platform Developer I", section: "Developer Fundamentals", type: "lecture" },
      { id: "pdi-l02", title: "L02: Apex Basics", file: "courses/salesforce/04-platform-developer-i/section-01-developer-fundamentals/lecture-02-apex-basics.md", month: 4, course: "Platform Developer I", section: "Developer Fundamentals", type: "lecture" },
      { id: "pdi-l03", title: "L03: Apex Variables, Types & Collections", file: "courses/salesforce/04-platform-developer-i/section-01-developer-fundamentals/lecture-03-apex-variables-types-collections.md", month: 4, course: "Platform Developer I", section: "Developer Fundamentals", type: "lecture" },
      { id: "pdi-l04", title: "L04: Control Flow & Loops", file: "courses/salesforce/04-platform-developer-i/section-01-developer-fundamentals/lecture-04-control-flow-loops.md", month: 4, course: "Platform Developer I", section: "Developer Fundamentals", type: "lecture" },

      // Section 02 — Apex Core
      { id: "pdi-l05", title: "L05: SOQL Fundamentals", file: "courses/salesforce/04-platform-developer-i/section-02-apex-core/lecture-05-soql-fundamentals.md", month: 4, course: "Platform Developer I", section: "Apex Core", type: "lecture" },
      { id: "pdi-l06", title: "L06: SOQL Advanced", file: "courses/salesforce/04-platform-developer-i/section-02-apex-core/lecture-06-soql-advanced.md", month: 4, course: "Platform Developer I", section: "Apex Core", type: "lecture" },
      { id: "pdi-l07", title: "L07: DML Operations", file: "courses/salesforce/04-platform-developer-i/section-02-apex-core/lecture-07-dml-operations.md", month: 4, course: "Platform Developer I", section: "Apex Core", type: "lecture" },
      { id: "pdi-l08", title: "L08: Apex Triggers", file: "courses/salesforce/04-platform-developer-i/section-02-apex-core/lecture-08-apex-triggers.md", month: 4, course: "Platform Developer I", section: "Apex Core", type: "lecture" },
      { id: "pdi-l09", title: "L09: Trigger Best Practices", file: "courses/salesforce/04-platform-developer-i/section-02-apex-core/lecture-09-trigger-best-practices.md", month: 4, course: "Platform Developer I", section: "Apex Core", type: "lecture" },

      // Section 03 — Advanced Apex
      { id: "pdi-l10", title: "L10: Asynchronous Apex", file: "courses/salesforce/04-platform-developer-i/section-03-advanced-apex/lecture-10-asynchronous-apex.md", month: 4, course: "Platform Developer I", section: "Advanced Apex", type: "lecture" },
      { id: "pdi-l11", title: "L11: Apex Governor Limits", file: "courses/salesforce/04-platform-developer-i/section-03-advanced-apex/lecture-11-apex-governor-limits.md", month: 4, course: "Platform Developer I", section: "Advanced Apex", type: "lecture" },
      { id: "pdi-l12", title: "L12: Exception Handling", file: "courses/salesforce/04-platform-developer-i/section-03-advanced-apex/lecture-12-exception-handling.md", month: 4, course: "Platform Developer I", section: "Advanced Apex", type: "lecture" },
      { id: "pdi-l13", title: "L13: Apex Classes & OOP", file: "courses/salesforce/04-platform-developer-i/section-03-advanced-apex/lecture-13-apex-classes-oop.md", month: 4, course: "Platform Developer I", section: "Advanced Apex", type: "lecture" },
      { id: "pdi-l14", title: "L14: Apex Integration & Callouts", file: "courses/salesforce/04-platform-developer-i/section-03-advanced-apex/lecture-14-apex-integration-callouts.md", month: 4, course: "Platform Developer I", section: "Advanced Apex", type: "lecture" },

      // Section 04 — User Interface
      { id: "pdi-l15", title: "L15: Visualforce Basics", file: "courses/salesforce/04-platform-developer-i/section-04-user-interface/lecture-15-visualforce-basics.md", month: 4, course: "Platform Developer I", section: "User Interface", type: "lecture" },
      { id: "pdi-l16", title: "L16: Visualforce Controllers", file: "courses/salesforce/04-platform-developer-i/section-04-user-interface/lecture-16-visualforce-controllers.md", month: 4, course: "Platform Developer I", section: "User Interface", type: "lecture" },
      { id: "pdi-l17", title: "L17: LWC Fundamentals", file: "courses/salesforce/04-platform-developer-i/section-04-user-interface/lecture-17-lwc-fundamentals.md", month: 4, course: "Platform Developer I", section: "User Interface", type: "lecture" },
      { id: "pdi-l18", title: "L18: LWC Data Binding & Events", file: "courses/salesforce/04-platform-developer-i/section-04-user-interface/lecture-18-lwc-data-binding-events.md", month: 4, course: "Platform Developer I", section: "User Interface", type: "lecture" },
      { id: "pdi-l19", title: "L19: LWC Wire Service & Apex", file: "courses/salesforce/04-platform-developer-i/section-04-user-interface/lecture-19-lwc-wire-service-apex.md", month: 4, course: "Platform Developer I", section: "User Interface", type: "lecture" },

      // Section 05 — Testing & Deployment
      { id: "pdi-l20", title: "L20: Apex Unit Testing", file: "courses/salesforce/04-platform-developer-i/section-05-testing-deployment/lecture-20-apex-unit-testing.md", month: 4, course: "Platform Developer I", section: "Testing & Deployment", type: "lecture" },
      { id: "pdi-l21", title: "L21: Test Best Practices", file: "courses/salesforce/04-platform-developer-i/section-05-testing-deployment/lecture-21-test-best-practices.md", month: 4, course: "Platform Developer I", section: "Testing & Deployment", type: "lecture" },
      { id: "pdi-l22", title: "L22: Debugging Tools", file: "courses/salesforce/04-platform-developer-i/section-05-testing-deployment/lecture-22-debugging-tools.md", month: 4, course: "Platform Developer I", section: "Testing & Deployment", type: "lecture" },
      { id: "pdi-l23", title: "L23: Deployment & Change Management", file: "courses/salesforce/04-platform-developer-i/section-05-testing-deployment/lecture-23-deployment-change-management.md", month: 4, course: "Platform Developer I", section: "Testing & Deployment", type: "lecture" },
      { id: "pdi-l24", title: "L24: Security in Apex", file: "courses/salesforce/04-platform-developer-i/section-05-testing-deployment/lecture-24-security-in-apex.md", month: 4, course: "Platform Developer I", section: "Testing & Deployment", type: "lecture" },

      // Labs
      { id: "pdi-lab01", title: "Lab 1: Apex Triggers & Bulk", file: "courses/salesforce/04-platform-developer-i/labs/lab-01-apex-triggers-bulk.md", month: 4, course: "Platform Developer I", section: "Hands-On Labs", type: "lab" },
      { id: "pdi-lab02", title: "Lab 2: Async Apex Batch", file: "courses/salesforce/04-platform-developer-i/labs/lab-02-async-apex-batch.md", month: 4, course: "Platform Developer I", section: "Hands-On Labs", type: "lab" },
      { id: "pdi-lab03", title: "Lab 3: LWC Component Build", file: "courses/salesforce/04-platform-developer-i/labs/lab-03-lwc-component-build.md", month: 4, course: "Platform Developer I", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "pdi-exam", title: "60-Question Practice Exam", file: "courses/salesforce/04-platform-developer-i/exam-prep/practice-exam-60-questions.md", month: 4, course: "Platform Developer I", section: "Exam Preparation", type: "exam" },
      { id: "pdi-cheatsheet", title: "PDI Cheat Sheet", file: "courses/salesforce/04-platform-developer-i/exam-prep/pdi-cheat-sheet.md", month: 4, course: "Platform Developer I", section: "Exam Preparation", type: "exam" },

      // ── Course 5: JavaScript Developer I ────────────────────────────────────
      { id: "jsi-overview", title: "Course Overview: JavaScript Developer I", file: "courses/salesforce/05-javascript-developer-i/00-course-overview.md", month: 5, course: "JavaScript Developer I", section: "Course Overview", type: "study" },

      // Section 1: JS Fundamentals
      { id: "jsi-l01", title: "L01: Variables, Types & Operators", file: "courses/salesforce/05-javascript-developer-i/section-01-js-fundamentals/lecture-01-variables-types-operators.md", month: 5, course: "JavaScript Developer I", section: "JS Fundamentals", type: "lecture" },
      { id: "jsi-l02", title: "L02: Conditionals, Loops & Error Handling", file: "courses/salesforce/05-javascript-developer-i/section-01-js-fundamentals/lecture-02-conditionals-loops-error-handling.md", month: 5, course: "JavaScript Developer I", section: "JS Fundamentals", type: "lecture" },
      { id: "jsi-l03", title: "L03: Functions", file: "courses/salesforce/05-javascript-developer-i/section-01-js-fundamentals/lecture-03-functions.md", month: 5, course: "JavaScript Developer I", section: "JS Fundamentals", type: "lecture" },
      { id: "jsi-l04", title: "L04: Scope, Hoisting & Closures", file: "courses/salesforce/05-javascript-developer-i/section-01-js-fundamentals/lecture-04-scope-hoisting-closures.md", month: 5, course: "JavaScript Developer I", section: "JS Fundamentals", type: "lecture" },

      // Section 2: Classes & Modules
      { id: "jsi-l05", title: "L05: Classes & OOP", file: "courses/salesforce/05-javascript-developer-i/section-02-classes-modules/lecture-05-classes-oop.md", month: 5, course: "JavaScript Developer I", section: "Classes & Modules", type: "lecture" },
      { id: "jsi-l06", title: "L06: Prototypes & Inheritance", file: "courses/salesforce/05-javascript-developer-i/section-02-classes-modules/lecture-06-prototypes-inheritance.md", month: 5, course: "JavaScript Developer I", section: "Classes & Modules", type: "lecture" },
      { id: "jsi-l07", title: "L07: ES Modules", file: "courses/salesforce/05-javascript-developer-i/section-02-classes-modules/lecture-07-modules.md", month: 5, course: "JavaScript Developer I", section: "Classes & Modules", type: "lecture" },
      { id: "jsi-l08", title: "L08: Iterators & Generators", file: "courses/salesforce/05-javascript-developer-i/section-02-classes-modules/lecture-08-iterators-generators.md", month: 5, course: "JavaScript Developer I", section: "Classes & Modules", type: "lecture" },

      // Section 3: Async JavaScript & Browser
      { id: "jsi-l09", title: "L09: Collections — Arrays, Map & Set", file: "courses/salesforce/05-javascript-developer-i/section-03-async-browser/lecture-09-collections-arrays.md", month: 5, course: "JavaScript Developer I", section: "Async JavaScript & Browser", type: "lecture" },
      { id: "jsi-l10", title: "L10: Async JavaScript & Promises", file: "courses/salesforce/05-javascript-developer-i/section-03-async-browser/lecture-10-async-promises.md", month: 5, course: "JavaScript Developer I", section: "Async JavaScript & Browser", type: "lecture" },
      { id: "jsi-l11", title: "L11: Browser, DOM & Events", file: "courses/salesforce/05-javascript-developer-i/section-03-async-browser/lecture-11-browser-dom-events.md", month: 5, course: "JavaScript Developer I", section: "Async JavaScript & Browser", type: "lecture" },
      { id: "jsi-l12", title: "L12: Debugging & Dev Tools", file: "courses/salesforce/05-javascript-developer-i/section-03-async-browser/lecture-12-debugging-dev-tools.md", month: 5, course: "JavaScript Developer I", section: "Async JavaScript & Browser", type: "lecture" },

      // Section 4: Node.js, Testing & TypeScript
      { id: "jsi-l13", title: "L13: Node.js Fundamentals", file: "courses/salesforce/05-javascript-developer-i/section-04-nodejs-testing/lecture-13-nodejs-fundamentals.md", month: 5, course: "JavaScript Developer I", section: "Node.js, Testing & TypeScript", type: "lecture" },
      { id: "jsi-l14", title: "L14: Testing with Jest", file: "courses/salesforce/05-javascript-developer-i/section-04-nodejs-testing/lecture-14-testing-javascript.md", month: 5, course: "JavaScript Developer I", section: "Node.js, Testing & TypeScript", type: "lecture" },
      { id: "jsi-l15", title: "L15: TypeScript Basics", file: "courses/salesforce/05-javascript-developer-i/section-04-nodejs-testing/lecture-15-typescript-basics.md", month: 5, course: "JavaScript Developer I", section: "Node.js, Testing & TypeScript", type: "lecture" },
      { id: "jsi-l16", title: "L16: Design Patterns", file: "courses/salesforce/05-javascript-developer-i/section-04-nodejs-testing/lecture-16-design-patterns.md", month: 5, course: "JavaScript Developer I", section: "Node.js, Testing & TypeScript", type: "lecture" },

      // Section 5: Advanced Topics
      { id: "jsi-l17", title: "L17: Advanced Functions", file: "courses/salesforce/05-javascript-developer-i/section-05-advanced-topics/lecture-17-advanced-functions.md", month: 5, course: "JavaScript Developer I", section: "Advanced Topics", type: "lecture" },
      { id: "jsi-l18", title: "L18: Modern JS Features", file: "courses/salesforce/05-javascript-developer-i/section-05-advanced-topics/lecture-18-modern-js-features.md", month: 5, course: "JavaScript Developer I", section: "Advanced Topics", type: "lecture" },
      { id: "jsi-l19", title: "L19: LWC JavaScript", file: "courses/salesforce/05-javascript-developer-i/section-05-advanced-topics/lecture-19-lwc-javascript.md", month: 5, course: "JavaScript Developer I", section: "Advanced Topics", type: "lecture" },
      { id: "jsi-l20", title: "L20: Performance & Security", file: "courses/salesforce/05-javascript-developer-i/section-05-advanced-topics/lecture-20-performance-security.md", month: 5, course: "JavaScript Developer I", section: "Advanced Topics", type: "lecture" },

      // Labs
      { id: "jsi-lab01", title: "Lab 01: OOP Todo App", file: "courses/salesforce/05-javascript-developer-i/labs/lab-01-oop-todo-app.md", month: 5, course: "JavaScript Developer I", section: "Labs", type: "lab" },
      { id: "jsi-lab02", title: "Lab 02: Async API Fetcher", file: "courses/salesforce/05-javascript-developer-i/labs/lab-02-async-api-fetcher.md", month: 5, course: "JavaScript Developer I", section: "Labs", type: "lab" },
      { id: "jsi-lab03", title: "Lab 03: Node.js REST Server", file: "courses/salesforce/05-javascript-developer-i/labs/lab-03-node-rest-server.md", month: 5, course: "JavaScript Developer I", section: "Labs", type: "lab" },

      // Exam Prep
      { id: "jsi-exam", title: "60-Question Practice Exam", file: "courses/salesforce/05-javascript-developer-i/exam-prep/practice-exam-60-questions.md", month: 5, course: "JavaScript Developer I", section: "Exam Preparation", type: "exam" },
      { id: "jsi-cheatsheet", title: "JSI Cheat Sheet", file: "courses/salesforce/05-javascript-developer-i/exam-prep/jsi-cheat-sheet.md", month: 5, course: "JavaScript Developer I", section: "Exam Preparation", type: "exam" },

      // ── Course 6: Data Cloud Consultant ─────────────────────────────────────
      { id: "dc-overview", title: "Course Overview: Data Cloud Consultant", file: "courses/salesforce/06-data-cloud-consultant/00-course-overview.md", month: 6, course: "Data Cloud Consultant", section: "Course Overview", type: "study" },

      // Section 1: Fundamentals
      { id: "dc-l01", title: "L01: Data Cloud Architecture", file: "courses/salesforce/06-data-cloud-consultant/section-01-fundamentals/lecture-01-data-cloud-architecture.md", month: 6, course: "Data Cloud Consultant", section: "Data Cloud Fundamentals", type: "lecture" },
      { id: "dc-l02", title: "L02: Data Streams & Ingestion", file: "courses/salesforce/06-data-cloud-consultant/section-01-fundamentals/lecture-02-data-streams-ingestion.md", month: 6, course: "Data Cloud Consultant", section: "Data Cloud Fundamentals", type: "lecture" },
      { id: "dc-l03", title: "L03: Data Model Objects", file: "courses/salesforce/06-data-cloud-consultant/section-01-fundamentals/lecture-03-data-model-objects.md", month: 6, course: "Data Cloud Consultant", section: "Data Cloud Fundamentals", type: "lecture" },
      { id: "dc-l04", title: "L04: Identity Resolution", file: "courses/salesforce/06-data-cloud-consultant/section-01-fundamentals/lecture-04-identity-resolution.md", month: 6, course: "Data Cloud Consultant", section: "Data Cloud Fundamentals", type: "lecture" },

      // Section 2: Segmentation
      { id: "dc-l05", title: "L05: Segmentation Basics", file: "courses/salesforce/06-data-cloud-consultant/section-02-segmentation/lecture-05-segmentation-basics.md", month: 6, course: "Data Cloud Consultant", section: "Segmentation & Insights", type: "lecture" },
      { id: "dc-l06", title: "L06: Calculated Insights", file: "courses/salesforce/06-data-cloud-consultant/section-02-segmentation/lecture-06-calculated-insights.md", month: 6, course: "Data Cloud Consultant", section: "Segmentation & Insights", type: "lecture" },
      { id: "dc-l07", title: "L07: Activation Targets", file: "courses/salesforce/06-data-cloud-consultant/section-02-segmentation/lecture-07-activation-targets.md", month: 6, course: "Data Cloud Consultant", section: "Segmentation & Insights", type: "lecture" },

      // Section 3: Governance
      { id: "dc-l08", title: "L08: Consent & Privacy", file: "courses/salesforce/06-data-cloud-consultant/section-03-governance/lecture-08-consent-privacy.md", month: 6, course: "Data Cloud Consultant", section: "Administration & Governance", type: "lecture" },
      { id: "dc-l09", title: "L09: Data Governance", file: "courses/salesforce/06-data-cloud-consultant/section-03-governance/lecture-09-data-governance.md", month: 6, course: "Data Cloud Consultant", section: "Administration & Governance", type: "lecture" },
      { id: "dc-l10", title: "L10: Performance & Monitoring", file: "courses/salesforce/06-data-cloud-consultant/section-03-governance/lecture-10-performance-monitoring.md", month: 6, course: "Data Cloud Consultant", section: "Administration & Governance", type: "lecture" },

      // Section 4: Use Cases
      { id: "dc-l11", title: "L11: Analytics & Tableau", file: "courses/salesforce/06-data-cloud-consultant/section-04-use-cases/lecture-11-analytics-tableau.md", month: 6, course: "Data Cloud Consultant", section: "Use Cases & Business Value", type: "lecture" },
      { id: "dc-l12", title: "L12: AI & Personalization", file: "courses/salesforce/06-data-cloud-consultant/section-04-use-cases/lecture-12-ai-personalization.md", month: 6, course: "Data Cloud Consultant", section: "Use Cases & Business Value", type: "lecture" },
      { id: "dc-l13", title: "L13: Real-World Use Cases", file: "courses/salesforce/06-data-cloud-consultant/section-04-use-cases/lecture-13-real-world-use-cases.md", month: 6, course: "Data Cloud Consultant", section: "Use Cases & Business Value", type: "lecture" },

      // Labs
      { id: "dc-lab01", title: "Lab 01: Data Stream Setup", file: "courses/salesforce/06-data-cloud-consultant/labs/lab-01-data-stream-setup.md", month: 6, course: "Data Cloud Consultant", section: "Labs", type: "lab" },
      { id: "dc-lab02", title: "Lab 02: Identity Resolution", file: "courses/salesforce/06-data-cloud-consultant/labs/lab-02-identity-resolution.md", month: 6, course: "Data Cloud Consultant", section: "Labs", type: "lab" },
      { id: "dc-lab03", title: "Lab 03: Segment & Activation", file: "courses/salesforce/06-data-cloud-consultant/labs/lab-03-segment-activation.md", month: 6, course: "Data Cloud Consultant", section: "Labs", type: "lab" },

      // Exam Prep
      { id: "dc-exam", title: "60-Question Practice Exam", file: "courses/salesforce/06-data-cloud-consultant/exam-prep/practice-exam-60-questions.md", month: 6, course: "Data Cloud Consultant", section: "Exam Preparation", type: "exam" },
      { id: "dc-cheatsheet", title: "Data Cloud Cheat Sheet", file: "courses/salesforce/06-data-cloud-consultant/exam-prep/data-cloud-cheat-sheet.md", month: 6, course: "Data Cloud Consultant", section: "Exam Preparation", type: "exam" },

      // ── Course 7: Agentforce Specialist ─────────────────────────────────
      { id: "agentforce-overview", title: "Course Overview", file: "courses/salesforce/07-agentforce-specialist/00-course-overview.md", month: 7, course: "Agentforce Specialist", section: "Introduction", type: "study" },

      // Section 1: Agentforce Concepts
      { id: "af-l01", title: "Lecture 1: Agentforce Overview", file: "courses/salesforce/07-agentforce-specialist/section-01-concepts/lecture-01-agentforce-overview.md", month: 7, course: "Agentforce Specialist", section: "Agentforce Concepts", type: "lecture" },
      { id: "af-l02", title: "Lecture 2: Atlas Reasoning Engine", file: "courses/salesforce/07-agentforce-specialist/section-01-concepts/lecture-02-atlas-reasoning-engine.md", month: 7, course: "Agentforce Specialist", section: "Agentforce Concepts", type: "lecture" },
      { id: "af-l03", title: "Lecture 3: Agent Types & Prebuilt Agents", file: "courses/salesforce/07-agentforce-specialist/section-01-concepts/lecture-03-agent-types-prebuilt.md", month: 7, course: "Agentforce Specialist", section: "Agentforce Concepts", type: "lecture" },

      // Section 2: Building Agents
      { id: "af-l04", title: "Lecture 4: Topics & Actions", file: "courses/salesforce/07-agentforce-specialist/section-02-building/lecture-04-topics-actions.md", month: 7, course: "Agentforce Specialist", section: "Building Agents", type: "lecture" },
      { id: "af-l05", title: "Lecture 5: Agent Instructions & Scope", file: "courses/salesforce/07-agentforce-specialist/section-02-building/lecture-05-agent-instructions.md", month: 7, course: "Agentforce Specialist", section: "Building Agents", type: "lecture" },
      { id: "af-l06", title: "Lecture 6: Flows & Apex Actions", file: "courses/salesforce/07-agentforce-specialist/section-02-building/lecture-06-flows-apex-actions.md", month: 7, course: "Agentforce Specialist", section: "Building Agents", type: "lecture" },
      { id: "af-l07", title: "Lecture 7: Knowledge & Grounding", file: "courses/salesforce/07-agentforce-specialist/section-02-building/lecture-07-knowledge-grounding.md", month: 7, course: "Agentforce Specialist", section: "Building Agents", type: "lecture" },

      // Section 3: Prompt Builder
      { id: "af-l08", title: "Lecture 8: Prompt Templates", file: "courses/salesforce/07-agentforce-specialist/section-03-prompt-builder/lecture-08-prompt-templates.md", month: 7, course: "Agentforce Specialist", section: "Prompt Builder", type: "lecture" },
      { id: "af-l09", title: "Lecture 9: Advanced Prompt Techniques", file: "courses/salesforce/07-agentforce-specialist/section-03-prompt-builder/lecture-09-advanced-prompts.md", month: 7, course: "Agentforce Specialist", section: "Prompt Builder", type: "lecture" },
      { id: "af-l10", title: "Lecture 10: Prompt Actions in Agents", file: "courses/salesforce/07-agentforce-specialist/section-03-prompt-builder/lecture-10-prompt-actions.md", month: 7, course: "Agentforce Specialist", section: "Prompt Builder", type: "lecture" },

      // Section 4: Testing & Deployment
      { id: "af-l11", title: "Lecture 11: Testing Agents", file: "courses/salesforce/07-agentforce-specialist/section-04-testing-deployment/lecture-11-testing-agents.md", month: 7, course: "Agentforce Specialist", section: "Testing & Deployment", type: "lecture" },
      { id: "af-l12", title: "Lecture 12: Deployment & Channels", file: "courses/salesforce/07-agentforce-specialist/section-04-testing-deployment/lecture-12-deployment-channels.md", month: 7, course: "Agentforce Specialist", section: "Testing & Deployment", type: "lecture" },
      { id: "af-l13", title: "Lecture 13: Monitoring & Governance", file: "courses/salesforce/07-agentforce-specialist/section-04-testing-deployment/lecture-13-monitoring-governance.md", month: 7, course: "Agentforce Specialist", section: "Testing & Deployment", type: "lecture" },
      { id: "af-l14", title: "Lecture 14: Real-World Use Cases", file: "courses/salesforce/07-agentforce-specialist/section-04-testing-deployment/lecture-14-use-cases.md", month: 7, course: "Agentforce Specialist", section: "Testing & Deployment", type: "lecture" },

      // Labs
      { id: "af-lab01", title: "Lab 1: Build a Service Agent", file: "courses/salesforce/07-agentforce-specialist/labs/lab-01-build-service-agent.md", month: 7, course: "Agentforce Specialist", section: "Labs", type: "lab" },
      { id: "af-lab02", title: "Lab 2: Prompt Template Design", file: "courses/salesforce/07-agentforce-specialist/labs/lab-02-prompt-template.md", month: 7, course: "Agentforce Specialist", section: "Labs", type: "lab" },
      { id: "af-lab03", title: "Lab 3: Test & Deploy an Agent", file: "courses/salesforce/07-agentforce-specialist/labs/lab-03-test-and-deploy.md", month: 7, course: "Agentforce Specialist", section: "Labs", type: "lab" },

      // Exam Prep
      { id: "af-exam", title: "60-Question Practice Exam", file: "courses/salesforce/07-agentforce-specialist/exam-prep/practice-exam-60-questions.md", month: 7, course: "Agentforce Specialist", section: "Exam Preparation", type: "exam" },
      { id: "af-cheatsheet", title: "Agentforce Cheat Sheet", file: "courses/salesforce/07-agentforce-specialist/exam-prep/agentforce-cheat-sheet.md", month: 7, course: "Agentforce Specialist", section: "Exam Preparation", type: "exam" },

      // ── Course 8: Agentforce Voice ───────────────────────────────────
      { id: "av-overview", title: "Course Overview", file: "courses/salesforce/08-agentforce-voice/00-course-overview.md", month: 8, course: "Agentforce Voice", section: "Introduction", type: "study" },

      // Section 1: Voice Fundamentals
      { id: "av-l01", title: "Lecture 1: Agentforce Voice Overview", file: "courses/salesforce/08-agentforce-voice/section-01-fundamentals/lecture-01-agentforce-voice-overview.md", month: 8, course: "Agentforce Voice", section: "Voice Fundamentals", type: "lecture" },
      { id: "av-l02", title: "Lecture 2: Telephony Integration", file: "courses/salesforce/08-agentforce-voice/section-01-fundamentals/lecture-02-telephony-integration.md", month: 8, course: "Agentforce Voice", section: "Voice Fundamentals", type: "lecture" },
      { id: "av-l03", title: "Lecture 3: Voice Channel Setup", file: "courses/salesforce/08-agentforce-voice/section-01-fundamentals/lecture-03-voice-channel-setup.md", month: 8, course: "Agentforce Voice", section: "Voice Fundamentals", type: "lecture" },

      // Section 2: Building Voice Agents
      { id: "av-l04", title: "Lecture 4: Voice Agent Configuration", file: "courses/salesforce/08-agentforce-voice/section-02-building-voice-agents/lecture-04-agentforce-voice-agent-config.md", month: 8, course: "Agentforce Voice", section: "Building Voice Agents", type: "lecture" },
      { id: "av-l05", title: "Lecture 5: Voice Topics & Actions", file: "courses/salesforce/08-agentforce-voice/section-02-building-voice-agents/lecture-05-voice-topics-actions.md", month: 8, course: "Agentforce Voice", section: "Building Voice Agents", type: "lecture" },
      { id: "av-l06", title: "Lecture 6: Transcription & NLP", file: "courses/salesforce/08-agentforce-voice/section-02-building-voice-agents/lecture-06-transcription-nlp.md", month: 8, course: "Agentforce Voice", section: "Building Voice Agents", type: "lecture" },

      // Section 3: Advanced Capabilities
      { id: "av-l07", title: "Lecture 7: Voice Flows & IVR Modernization", file: "courses/salesforce/08-agentforce-voice/section-03-advanced-capabilities/lecture-07-voice-flows-ivr.md", month: 8, course: "Agentforce Voice", section: "Advanced Capabilities", type: "lecture" },
      { id: "av-l08", title: "Lecture 8: Agent Assist & Screen Pop", file: "courses/salesforce/08-agentforce-voice/section-03-advanced-capabilities/lecture-08-agent-assist-screen-pop.md", month: 8, course: "Agentforce Voice", section: "Advanced Capabilities", type: "lecture" },
      { id: "av-l09", title: "Lecture 9: Omni-Channel Routing for Voice", file: "courses/salesforce/08-agentforce-voice/section-03-advanced-capabilities/lecture-09-omnichannel-routing.md", month: 8, course: "Agentforce Voice", section: "Advanced Capabilities", type: "lecture" },

      // Section 4: Operations
      { id: "av-l10", title: "Lecture 10: Testing Voice Agents", file: "courses/salesforce/08-agentforce-voice/section-04-operations/lecture-10-testing-voice-agents.md", month: 8, course: "Agentforce Voice", section: "Operations", type: "lecture" },
      { id: "av-l11", title: "Lecture 11: Monitoring & Analytics", file: "courses/salesforce/08-agentforce-voice/section-04-operations/lecture-11-monitoring-analytics.md", month: 8, course: "Agentforce Voice", section: "Operations", type: "lecture" },
      { id: "av-l12", title: "Lecture 12: Advanced Use Cases", file: "courses/salesforce/08-agentforce-voice/section-04-operations/lecture-12-advanced-use-cases.md", month: 8, course: "Agentforce Voice", section: "Operations", type: "lecture" },

      // Labs
      { id: "av-lab01", title: "Lab 1: Amazon Connect Setup", file: "courses/salesforce/08-agentforce-voice/labs/lab-01-amazon-connect-setup.md", month: 8, course: "Agentforce Voice", section: "Labs", type: "lab" },
      { id: "av-lab02", title: "Lab 2: Build a Voice Agent", file: "courses/salesforce/08-agentforce-voice/labs/lab-02-voice-agent-build.md", month: 8, course: "Agentforce Voice", section: "Labs", type: "lab" },

      // Exam Prep
      { id: "av-exam", title: "60-Question Practice Exam", file: "courses/salesforce/08-agentforce-voice/exam-prep/practice-exam-60-questions.md", month: 8, course: "Agentforce Voice", section: "Exam Preparation", type: "exam" },
      { id: "av-cheatsheet", title: "Agentforce Voice Cheat Sheet", file: "courses/salesforce/08-agentforce-voice/exam-prep/agentforce-voice-cheat-sheet.md", month: 8, course: "Agentforce Voice", section: "Exam Preparation", type: "exam" },

      // ── Course 9: Platform Developer II ─────────────────────────────────────
      { id: "pdii-overview", title: "Course Overview", file: "courses/salesforce/09-platform-developer-ii/00-course-overview.md", month: 8, course: "Platform Developer II", section: "Course Overview", type: "study" },

      // Section 01 — Advanced Apex
      { id: "pdii-l01", title: "L1: Advanced Apex Patterns", file: "courses/salesforce/09-platform-developer-ii/section-01-advanced-apex/lecture-01-advanced-apex-patterns.md", month: 8, course: "Platform Developer II", section: "Advanced Apex", type: "lecture" },
      { id: "pdii-l02", title: "L2: Async Apex Deep Dive", file: "courses/salesforce/09-platform-developer-ii/section-01-advanced-apex/lecture-02-async-apex-deep-dive.md", month: 8, course: "Platform Developer II", section: "Advanced Apex", type: "lecture" },
      { id: "pdii-l03", title: "L3: Apex Integration Patterns", file: "courses/salesforce/09-platform-developer-ii/section-01-advanced-apex/lecture-03-apex-integration-patterns.md", month: 8, course: "Platform Developer II", section: "Advanced Apex", type: "lecture" },
      { id: "pdii-l04", title: "L4: Apex Performance Optimization", file: "courses/salesforce/09-platform-developer-ii/section-01-advanced-apex/lecture-04-apex-performance-optimization.md", month: 8, course: "Platform Developer II", section: "Advanced Apex", type: "lecture" },

      // Section 02 — Testing & Security
      { id: "pdii-l05", title: "L5: Advanced Testing Patterns", file: "courses/salesforce/09-platform-developer-ii/section-02-testing-security/lecture-05-advanced-testing-patterns.md", month: 8, course: "Platform Developer II", section: "Testing & Security", type: "lecture" },
      { id: "pdii-l06", title: "L6: Apex Security & SOQL Injection", file: "courses/salesforce/09-platform-developer-ii/section-02-testing-security/lecture-06-apex-security-soql-injection.md", month: 8, course: "Platform Developer II", section: "Testing & Security", type: "lecture" },
      { id: "pdii-l07", title: "L7: Platform Events & CDC", file: "courses/salesforce/09-platform-developer-ii/section-02-testing-security/lecture-07-platform-events-cdc.md", month: 8, course: "Platform Developer II", section: "Testing & Security", type: "lecture" },

      // Section 03 — Declarative Integration
      { id: "pdii-l08", title: "L8: REST & SOAP Integration", file: "courses/salesforce/09-platform-developer-ii/section-03-declarative-integration/lecture-08-rest-soap-integration.md", month: 8, course: "Platform Developer II", section: "Declarative Integration", type: "lecture" },
      { id: "pdii-l09", title: "L9: Callouts & Certificates", file: "courses/salesforce/09-platform-developer-ii/section-03-declarative-integration/lecture-09-callouts-certificates.md", month: 8, course: "Platform Developer II", section: "Declarative Integration", type: "lecture" },
      { id: "pdii-l10", title: "L10: Integration Patterns", file: "courses/salesforce/09-platform-developer-ii/section-03-declarative-integration/lecture-10-integration-patterns.md", month: 8, course: "Platform Developer II", section: "Declarative Integration", type: "lecture" },

      // Section 04 — LWC Advanced
      { id: "pdii-l11", title: "L11: LWC Advanced Patterns", file: "courses/salesforce/09-platform-developer-ii/section-04-lwc-advanced/lecture-11-lwc-advanced-patterns.md", month: 8, course: "Platform Developer II", section: "LWC Advanced", type: "lecture" },
      { id: "pdii-l12", title: "L12: LWC Testing with Jest", file: "courses/salesforce/09-platform-developer-ii/section-04-lwc-advanced/lecture-12-lwc-testing-jest.md", month: 8, course: "Platform Developer II", section: "LWC Advanced", type: "lecture" },
      { id: "pdii-l13", title: "L13: LWC Integration", file: "courses/salesforce/09-platform-developer-ii/section-04-lwc-advanced/lecture-13-lwc-integration.md", month: 8, course: "Platform Developer II", section: "LWC Advanced", type: "lecture" },

      // Section 05 — Architecture
      { id: "pdii-l14", title: "L14: Limit Management Architecture", file: "courses/salesforce/09-platform-developer-ii/section-05-architecture/lecture-14-limit-management-architecture.md", month: 8, course: "Platform Developer II", section: "Architecture", type: "lecture" },
      { id: "pdii-l15", title: "L15: Large Data Volumes", file: "courses/salesforce/09-platform-developer-ii/section-05-architecture/lecture-15-large-data-volumes.md", month: 8, course: "Platform Developer II", section: "Architecture", type: "lecture" },
      { id: "pdii-l16", title: "L16: Deployment Best Practices", file: "courses/salesforce/09-platform-developer-ii/section-05-architecture/lecture-16-deployment-best-practices.md", month: 8, course: "Platform Developer II", section: "Architecture", type: "lecture" },

      // Labs
      { id: "pdii-lab01", title: "Lab 1: Async Apex Patterns", file: "courses/salesforce/09-platform-developer-ii/labs/lab-01-async-apex-patterns.md", month: 8, course: "Platform Developer II", section: "Hands-On Labs", type: "lab" },
      { id: "pdii-lab02", title: "Lab 2: Integration Callouts", file: "courses/salesforce/09-platform-developer-ii/labs/lab-02-integration-callouts.md", month: 8, course: "Platform Developer II", section: "Hands-On Labs", type: "lab" },
      { id: "pdii-lab03", title: "Lab 3: LWC Advanced Build", file: "courses/salesforce/09-platform-developer-ii/labs/lab-03-lwc-advanced-build.md", month: 8, course: "Platform Developer II", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "pdii-exam", title: "60-Question Practice Exam", file: "courses/salesforce/09-platform-developer-ii/exam-prep/practice-exam-60-questions.md", month: 8, course: "Platform Developer II", section: "Exam Preparation", type: "exam" },
      { id: "pdii-cheatsheet", title: "PDII Cheat Sheet", file: "courses/salesforce/09-platform-developer-ii/exam-prep/pdii-cheat-sheet.md", month: 8, course: "Platform Developer II", section: "Exam Preparation", type: "exam" },

      // ── Course 10: Advanced Administrator ────────────────────────────────────
      { id: "adv-admin-overview", title: "Course Overview", file: "courses/salesforce/10-advanced-administrator/00-course-overview.md", month: 8, course: "Advanced Administrator", section: "Course Overview", type: "study" },

      // Section 01 — Security & Access
      { id: "adv-admin-l01", title: "L1: Advanced Sharing Rules", file: "courses/salesforce/10-advanced-administrator/section-01-security-access/lecture-01-advanced-sharing-rules.md", month: 8, course: "Advanced Administrator", section: "Security & Access", type: "lecture" },
      { id: "adv-admin-l02", title: "L2: Territory Management", file: "courses/salesforce/10-advanced-administrator/section-01-security-access/lecture-02-territory-management.md", month: 8, course: "Advanced Administrator", section: "Security & Access", type: "lecture" },
      { id: "adv-admin-l03", title: "L3: Delegated Administration Advanced", file: "courses/salesforce/10-advanced-administrator/section-01-security-access/lecture-03-delegated-administration-advanced.md", month: 8, course: "Advanced Administrator", section: "Security & Access", type: "lecture" },

      // Section 02 — Automation
      { id: "adv-admin-l04", title: "L4: Advanced Flows", file: "courses/salesforce/10-advanced-administrator/section-02-automation/lecture-04-advanced-flows.md", month: 8, course: "Advanced Administrator", section: "Automation", type: "lecture" },
      { id: "adv-admin-l05", title: "L5: Approval Processes Advanced", file: "courses/salesforce/10-advanced-administrator/section-02-automation/lecture-05-approval-processes-advanced.md", month: 8, course: "Advanced Administrator", section: "Automation", type: "lecture" },
      { id: "adv-admin-l06", title: "L6: Flow Testing & Debugging", file: "courses/salesforce/10-advanced-administrator/section-02-automation/lecture-06-flow-testing-debugging.md", month: 8, course: "Advanced Administrator", section: "Automation", type: "lecture" },

      // Section 03 — Sales & Service
      { id: "adv-admin-l07", title: "L7: Advanced Sales Cloud", file: "courses/salesforce/10-advanced-administrator/section-03-sales-service/lecture-07-advanced-sales-cloud.md", month: 8, course: "Advanced Administrator", section: "Sales & Service", type: "lecture" },
      { id: "adv-admin-l08", title: "L8: Advanced Service Cloud", file: "courses/salesforce/10-advanced-administrator/section-03-sales-service/lecture-08-advanced-service-cloud.md", month: 8, course: "Advanced Administrator", section: "Sales & Service", type: "lecture" },
      { id: "adv-admin-l09", title: "L9: Entitlements & Milestones", file: "courses/salesforce/10-advanced-administrator/section-03-sales-service/lecture-09-entitlements-milestones.md", month: 8, course: "Advanced Administrator", section: "Sales & Service", type: "lecture" },
      { id: "adv-admin-l10", title: "L10: Knowledge Advanced", file: "courses/salesforce/10-advanced-administrator/section-03-sales-service/lecture-10-knowledge-advanced.md", month: 8, course: "Advanced Administrator", section: "Sales & Service", type: "lecture" },

      // Section 04 — Data & Analytics
      { id: "adv-admin-l11", title: "L11: Reports & Dashboards Advanced", file: "courses/salesforce/10-advanced-administrator/section-04-data-analytics/lecture-11-reports-dashboards-advanced.md", month: 8, course: "Advanced Administrator", section: "Data & Analytics", type: "lecture" },
      { id: "adv-admin-l12", title: "L12: Data Management Advanced", file: "courses/salesforce/10-advanced-administrator/section-04-data-analytics/lecture-12-data-management-advanced.md", month: 8, course: "Advanced Administrator", section: "Data & Analytics", type: "lecture" },
      { id: "adv-admin-l13", title: "L13: Change Data Capture", file: "courses/salesforce/10-advanced-administrator/section-04-data-analytics/lecture-13-change-data-capture.md", month: 8, course: "Advanced Administrator", section: "Data & Analytics", type: "lecture" },

      // Section 05 — Platform
      { id: "adv-admin-l14", title: "L14: Custom Metadata Types", file: "courses/salesforce/10-advanced-administrator/section-05-platform/lecture-14-custom-metadata-types.md", month: 8, course: "Advanced Administrator", section: "Platform", type: "lecture" },
      { id: "adv-admin-l15", title: "L15: Advanced Formula Fields", file: "courses/salesforce/10-advanced-administrator/section-05-platform/lecture-15-advanced-formula-fields.md", month: 8, course: "Advanced Administrator", section: "Platform", type: "lecture" },
      { id: "adv-admin-l16", title: "L16: Sandboxes & Deployment", file: "courses/salesforce/10-advanced-administrator/section-05-platform/lecture-16-sandboxes-deployment.md", month: 8, course: "Advanced Administrator", section: "Platform", type: "lecture" },

      // Labs
      { id: "adv-admin-lab01", title: "Lab 1: Territory Management", file: "courses/salesforce/10-advanced-administrator/labs/lab-01-territory-management.md", month: 8, course: "Advanced Administrator", section: "Hands-On Labs", type: "lab" },
      { id: "adv-admin-lab02", title: "Lab 2: Advanced Flows", file: "courses/salesforce/10-advanced-administrator/labs/lab-02-advanced-flows.md", month: 8, course: "Advanced Administrator", section: "Hands-On Labs", type: "lab" },
      { id: "adv-admin-lab03", title: "Lab 3: Reports & Dashboards", file: "courses/salesforce/10-advanced-administrator/labs/lab-03-reports-dashboards.md", month: 8, course: "Advanced Administrator", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "adv-admin-cheatsheet", title: "Advanced Admin Cheat Sheet", file: "courses/salesforce/10-advanced-administrator/exam-prep/advanced-admin-cheat-sheet.md", month: 8, course: "Advanced Administrator", section: "Exam Preparation", type: "exam" },
      { id: "adv-admin-exam", title: "Practice Exam (50 Questions)", file: "courses/salesforce/10-advanced-administrator/exam-prep/practice-exam-65-questions.md", month: 8, course: "Advanced Administrator", section: "Exam Preparation", type: "exam" },

      // ── Course 11: Data Architecture Designer ────────────────────────────────
      { id: "data-arch-overview", title: "Course Overview", file: "courses/salesforce/11-data-architecture-designer/00-course-overview.md", month: 9, course: "Data Architecture Designer", section: "Course Overview", type: "study" },

      // Section 01 — Data Modeling
      { id: "data-arch-l01", title: "L1: Data Modeling Fundamentals", file: "courses/salesforce/11-data-architecture-designer/section-01-data-modeling/lecture-01-data-modeling-fundamentals.md", month: 9, course: "Data Architecture Designer", section: "Data Modeling", type: "lecture" },
      { id: "data-arch-l02", title: "L2: Object Relationships Design", file: "courses/salesforce/11-data-architecture-designer/section-01-data-modeling/lecture-02-object-relationships-design.md", month: 9, course: "Data Architecture Designer", section: "Data Modeling", type: "lecture" },
      { id: "data-arch-l03", title: "L3: Schema Design Patterns", file: "courses/salesforce/11-data-architecture-designer/section-01-data-modeling/lecture-03-schema-design-patterns.md", month: 9, course: "Data Architecture Designer", section: "Data Modeling", type: "lecture" },
      { id: "data-arch-l04", title: "L4: Master Data Management", file: "courses/salesforce/11-data-architecture-designer/section-01-data-modeling/lecture-04-master-data-management.md", month: 9, course: "Data Architecture Designer", section: "Data Modeling", type: "lecture" },

      // Section 02 — Large Data Volumes
      { id: "data-arch-l05", title: "L5: LDV Architecture", file: "courses/salesforce/11-data-architecture-designer/section-02-large-data-volumes/lecture-05-ldv-architecture.md", month: 9, course: "Data Architecture Designer", section: "Large Data Volumes", type: "lecture" },
      { id: "data-arch-l06", title: "L6: SOQL Query Optimization", file: "courses/salesforce/11-data-architecture-designer/section-02-large-data-volumes/lecture-06-soql-query-optimization.md", month: 9, course: "Data Architecture Designer", section: "Large Data Volumes", type: "lecture" },
      { id: "data-arch-l07", title: "L7: Skinny Tables & Indexes", file: "courses/salesforce/11-data-architecture-designer/section-02-large-data-volumes/lecture-07-skinny-tables-indexes.md", month: 9, course: "Data Architecture Designer", section: "Large Data Volumes", type: "lecture" },
      { id: "data-arch-l08", title: "L8: Archiving Strategies", file: "courses/salesforce/11-data-architecture-designer/section-02-large-data-volumes/lecture-08-archiving-strategies.md", month: 9, course: "Data Architecture Designer", section: "Large Data Volumes", type: "lecture" },

      // Section 03 — Data Migration
      { id: "data-arch-l09", title: "L9: Data Migration Planning", file: "courses/salesforce/11-data-architecture-designer/section-03-data-migration/lecture-09-data-migration-planning.md", month: 9, course: "Data Architecture Designer", section: "Data Migration", type: "lecture" },
      { id: "data-arch-l10", title: "L10: ETL Tools & Patterns", file: "courses/salesforce/11-data-architecture-designer/section-03-data-migration/lecture-10-etl-tools-patterns.md", month: 9, course: "Data Architecture Designer", section: "Data Migration", type: "lecture" },
      { id: "data-arch-l11", title: "L11: Data Quality & Governance", file: "courses/salesforce/11-data-architecture-designer/section-03-data-migration/lecture-11-data-quality-governance.md", month: 9, course: "Data Architecture Designer", section: "Data Migration", type: "lecture" },

      // Section 04 — Integration Data
      { id: "data-arch-l12", title: "L12: External Objects & Connect", file: "courses/salesforce/11-data-architecture-designer/section-04-integration-data/lecture-12-external-objects-connect.md", month: 9, course: "Data Architecture Designer", section: "Integration & Data", type: "lecture" },
      { id: "data-arch-l13", title: "L13: Platform Events & Streaming", file: "courses/salesforce/11-data-architecture-designer/section-04-integration-data/lecture-13-platform-events-streaming.md", month: 9, course: "Data Architecture Designer", section: "Integration & Data", type: "lecture" },
      { id: "data-arch-l14", title: "L14: Change Data Capture Design", file: "courses/salesforce/11-data-architecture-designer/section-04-integration-data/lecture-14-change-data-capture-design.md", month: 9, course: "Data Architecture Designer", section: "Integration & Data", type: "lecture" },

      // Section 05 — Governance
      { id: "data-arch-l15", title: "L15: Data Governance Framework", file: "courses/salesforce/11-data-architecture-designer/section-05-governance/lecture-15-data-governance-framework.md", month: 9, course: "Data Architecture Designer", section: "Governance", type: "lecture" },
      { id: "data-arch-l16", title: "L16: Security & Data Architecture", file: "courses/salesforce/11-data-architecture-designer/section-05-governance/lecture-16-security-data-architecture.md", month: 9, course: "Data Architecture Designer", section: "Governance", type: "lecture" },
      { id: "data-arch-l17", title: "L17: Compliance & Privacy", file: "courses/salesforce/11-data-architecture-designer/section-05-governance/lecture-17-compliance-privacy.md", month: 9, course: "Data Architecture Designer", section: "Governance", type: "lecture" },

      // Labs
      { id: "data-arch-lab01", title: "Lab 1: Schema Design", file: "courses/salesforce/11-data-architecture-designer/labs/lab-01-schema-design.md", month: 9, course: "Data Architecture Designer", section: "Hands-On Labs", type: "lab" },
      { id: "data-arch-lab02", title: "Lab 2: Query Optimization", file: "courses/salesforce/11-data-architecture-designer/labs/lab-02-query-optimization.md", month: 9, course: "Data Architecture Designer", section: "Hands-On Labs", type: "lab" },
      { id: "data-arch-lab03", title: "Lab 3: Data Migration Plan", file: "courses/salesforce/11-data-architecture-designer/labs/lab-03-data-migration-plan.md", month: 9, course: "Data Architecture Designer", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "data-arch-exam", title: "60-Question Practice Exam", file: "courses/salesforce/11-data-architecture-designer/exam-prep/practice-exam-60-questions.md", month: 9, course: "Data Architecture Designer", section: "Exam Preparation", type: "exam" },
      { id: "data-arch-cheatsheet", title: "Data Architecture Cheat Sheet", file: "courses/salesforce/11-data-architecture-designer/exam-prep/data-arch-cheat-sheet.md", month: 9, course: "Data Architecture Designer", section: "Exam Preparation", type: "exam" },

      // ── Course 12: Sharing & Visibility Designer ──────────────────────────────
      { id: "sv-overview", title: "Course Overview", file: "courses/salesforce/12-sharing-visibility-designer/00-course-overview.md", month: 9, course: "Sharing & Visibility Designer", section: "Course Overview", type: "study" },

      // Section 01 — Record Access Fundamentals
      { id: "sv-l01", title: "L1: Sharing Model Architecture", file: "courses/salesforce/12-sharing-visibility-designer/section-01-record-access-fundamentals/lecture-01-sharing-model-architecture.md", month: 9, course: "Sharing & Visibility Designer", section: "Record Access Fundamentals", type: "lecture" },
      { id: "sv-l02", title: "L2: Org-Wide Defaults Deep Dive", file: "courses/salesforce/12-sharing-visibility-designer/section-01-record-access-fundamentals/lecture-02-org-wide-defaults-deep-dive.md", month: 9, course: "Sharing & Visibility Designer", section: "Record Access Fundamentals", type: "lecture" },
      { id: "sv-l03", title: "L3: Role Hierarchy Design", file: "courses/salesforce/12-sharing-visibility-designer/section-01-record-access-fundamentals/lecture-03-role-hierarchy-design.md", month: 9, course: "Sharing & Visibility Designer", section: "Record Access Fundamentals", type: "lecture" },
      { id: "sv-l04", title: "L4: Profiles & Permission Sets Advanced", file: "courses/salesforce/12-sharing-visibility-designer/section-01-record-access-fundamentals/lecture-04-profiles-permission-sets-advanced.md", month: 9, course: "Sharing & Visibility Designer", section: "Record Access Fundamentals", type: "lecture" },

      // Section 02 — Sharing Mechanisms
      { id: "sv-l05", title: "L5: Sharing Rules Deep Dive", file: "courses/salesforce/12-sharing-visibility-designer/section-02-sharing-mechanisms/lecture-05-sharing-rules-deep-dive.md", month: 9, course: "Sharing & Visibility Designer", section: "Sharing Mechanisms", type: "lecture" },
      { id: "sv-l06", title: "L6: Manual Sharing & Teams", file: "courses/salesforce/12-sharing-visibility-designer/section-02-sharing-mechanisms/lecture-06-manual-sharing-teams.md", month: 9, course: "Sharing & Visibility Designer", section: "Sharing Mechanisms", type: "lecture" },
      { id: "sv-l07", title: "L7: Apex Managed Sharing", file: "courses/salesforce/12-sharing-visibility-designer/section-02-sharing-mechanisms/lecture-07-apex-managed-sharing.md", month: 9, course: "Sharing & Visibility Designer", section: "Sharing Mechanisms", type: "lecture" },
      { id: "sv-l08", title: "L8: Implicit Sharing", file: "courses/salesforce/12-sharing-visibility-designer/section-02-sharing-mechanisms/lecture-08-implicit-sharing.md", month: 9, course: "Sharing & Visibility Designer", section: "Sharing Mechanisms", type: "lecture" },

      // Section 03 — Complex Scenarios
      { id: "sv-l09", title: "L9: Territory Management & Sharing", file: "courses/salesforce/12-sharing-visibility-designer/section-03-complex-scenarios/lecture-09-territory-management-sharing.md", month: 9, course: "Sharing & Visibility Designer", section: "Complex Scenarios", type: "lecture" },
      { id: "sv-l10", title: "L10: Communities & Partner Sharing", file: "courses/salesforce/12-sharing-visibility-designer/section-03-complex-scenarios/lecture-10-communities-partner-sharing.md", month: 9, course: "Sharing & Visibility Designer", section: "Complex Scenarios", type: "lecture" },
      { id: "sv-l11", title: "L11: High Volume Sharing", file: "courses/salesforce/12-sharing-visibility-designer/section-03-complex-scenarios/lecture-11-high-volume-sharing.md", month: 9, course: "Sharing & Visibility Designer", section: "Complex Scenarios", type: "lecture" },
      { id: "sv-l12", title: "L12: Sharing Architecture Patterns", file: "courses/salesforce/12-sharing-visibility-designer/section-03-complex-scenarios/lecture-12-sharing-architecture-patterns.md", month: 9, course: "Sharing & Visibility Designer", section: "Complex Scenarios", type: "lecture" },

      // Section 04 — Field & Object Visibility
      { id: "sv-l13", title: "L13: FLS & CRUD Design", file: "courses/salesforce/12-sharing-visibility-designer/section-04-field-object-visibility/lecture-13-fls-crud-design.md", month: 9, course: "Sharing & Visibility Designer", section: "Field & Object Visibility", type: "lecture" },
      { id: "sv-l14", title: "L14: Record Types & Visibility", file: "courses/salesforce/12-sharing-visibility-designer/section-04-field-object-visibility/lecture-14-record-types-visibility.md", month: 9, course: "Sharing & Visibility Designer", section: "Field & Object Visibility", type: "lecture" },
      { id: "sv-l15", title: "L15: List Views & Search", file: "courses/salesforce/12-sharing-visibility-designer/section-04-field-object-visibility/lecture-15-list-views-search.md", month: 9, course: "Sharing & Visibility Designer", section: "Field & Object Visibility", type: "lecture" },

      // Section 05 — Governance
      { id: "sv-l16", title: "L16: Sharing Performance", file: "courses/salesforce/12-sharing-visibility-designer/section-05-governance/lecture-16-sharing-performance.md", month: 9, course: "Sharing & Visibility Designer", section: "Governance", type: "lecture" },
      { id: "sv-l17", title: "L17: Sharing Audit & Governance", file: "courses/salesforce/12-sharing-visibility-designer/section-05-governance/lecture-17-sharing-audit-governance.md", month: 9, course: "Sharing & Visibility Designer", section: "Governance", type: "lecture" },

      // Labs
      { id: "sv-lab01", title: "Lab 1: Complex Sharing Scenario", file: "courses/salesforce/12-sharing-visibility-designer/labs/lab-01-complex-sharing-scenario.md", month: 9, course: "Sharing & Visibility Designer", section: "Hands-On Labs", type: "lab" },
      { id: "sv-lab02", title: "Lab 2: Apex Sharing", file: "courses/salesforce/12-sharing-visibility-designer/labs/lab-02-apex-sharing.md", month: 9, course: "Sharing & Visibility Designer", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "sv-exam", title: "Practice Exam (50 Questions)", file: "courses/salesforce/12-sharing-visibility-designer/exam-prep/practice-exam-60-questions.md", month: 9, course: "Sharing & Visibility Designer", section: "Exam Preparation", type: "exam" },
      { id: "sv-cheatsheet", title: "Sharing & Visibility Cheat Sheet", file: "courses/salesforce/12-sharing-visibility-designer/exam-prep/sharing-cheat-sheet.md", month: 9, course: "Sharing & Visibility Designer", section: "Exam Preparation", type: "exam" },

      // ── Course 13: Integration Architecture Designer ──────────────────────────
      { id: "int-arch-overview", title: "Course Overview", file: "courses/salesforce/13-integration-architecture-designer/00-course-overview.md", month: 10, course: "Integration Architecture Designer", section: "Course Overview", type: "study" },

      // Section 01 — Integration Fundamentals
      { id: "int-arch-l01", title: "L1: Integration Patterns Overview", file: "courses/salesforce/13-integration-architecture-designer/section-01-integration-fundamentals/lecture-01-integration-patterns-overview.md", month: 10, course: "Integration Architecture Designer", section: "Integration Fundamentals", type: "lecture" },
      { id: "int-arch-l02", title: "L2: API Design: REST & SOAP", file: "courses/salesforce/13-integration-architecture-designer/section-01-integration-fundamentals/lecture-02-api-design-rest-soap.md", month: 10, course: "Integration Architecture Designer", section: "Integration Fundamentals", type: "lecture" },
      { id: "int-arch-l03", title: "L3: Event-Driven Architecture", file: "courses/salesforce/13-integration-architecture-designer/section-01-integration-fundamentals/lecture-03-event-driven-architecture.md", month: 10, course: "Integration Architecture Designer", section: "Integration Fundamentals", type: "lecture" },
      { id: "int-arch-l04", title: "L4: Middleware & ESB Patterns", file: "courses/salesforce/13-integration-architecture-designer/section-01-integration-fundamentals/lecture-04-middleware-esb-patterns.md", month: 10, course: "Integration Architecture Designer", section: "Integration Fundamentals", type: "lecture" },

      // Section 02 — Salesforce Integration
      { id: "int-arch-l05", title: "L5: Salesforce API Types", file: "courses/salesforce/13-integration-architecture-designer/section-02-salesforce-integration/lecture-05-salesforce-api-types.md", month: 10, course: "Integration Architecture Designer", section: "Salesforce Integration", type: "lecture" },
      { id: "int-arch-l06", title: "L6: Platform Events & CDC", file: "courses/salesforce/13-integration-architecture-designer/section-02-salesforce-integration/lecture-06-platform-events-cdc.md", month: 10, course: "Integration Architecture Designer", section: "Salesforce Integration", type: "lecture" },
      { id: "int-arch-l07", title: "L7: Named Credentials & Auth", file: "courses/salesforce/13-integration-architecture-designer/section-02-salesforce-integration/lecture-07-named-credentials-auth.md", month: 10, course: "Integration Architecture Designer", section: "Salesforce Integration", type: "lecture" },
      { id: "int-arch-l08", title: "L8: Composite & Batch APIs", file: "courses/salesforce/13-integration-architecture-designer/section-02-salesforce-integration/lecture-08-composite-batch-apis.md", month: 10, course: "Integration Architecture Designer", section: "Salesforce Integration", type: "lecture" },

      // Section 03 — Enterprise Patterns
      { id: "int-arch-l09", title: "L9: Point-to-Point vs Hub & Spoke", file: "courses/salesforce/13-integration-architecture-designer/section-03-enterprise-patterns/lecture-09-point-to-point-vs-hub-spoke.md", month: 10, course: "Integration Architecture Designer", section: "Enterprise Patterns", type: "lecture" },
      { id: "int-arch-l10", title: "L10: MuleSoft Integration", file: "courses/salesforce/13-integration-architecture-designer/section-03-enterprise-patterns/lecture-10-mulesoft-integration.md", month: 10, course: "Integration Architecture Designer", section: "Enterprise Patterns", type: "lecture" },
      { id: "int-arch-l11", title: "L11: Heroku Integration Patterns", file: "courses/salesforce/13-integration-architecture-designer/section-03-enterprise-patterns/lecture-11-heroku-integration-patterns.md", month: 10, course: "Integration Architecture Designer", section: "Enterprise Patterns", type: "lecture" },
      { id: "int-arch-l12", title: "L12: Data Replication Patterns", file: "courses/salesforce/13-integration-architecture-designer/section-03-enterprise-patterns/lecture-12-data-replication-patterns.md", month: 10, course: "Integration Architecture Designer", section: "Enterprise Patterns", type: "lecture" },

      // Section 04 — Governance
      { id: "int-arch-l13", title: "L13: API Governance & Versioning", file: "courses/salesforce/13-integration-architecture-designer/section-04-governance/lecture-13-api-governance-versioning.md", month: 10, course: "Integration Architecture Designer", section: "Governance", type: "lecture" },
      { id: "int-arch-l14", title: "L14: Error Handling & Retry", file: "courses/salesforce/13-integration-architecture-designer/section-04-governance/lecture-14-error-handling-retry.md", month: 10, course: "Integration Architecture Designer", section: "Governance", type: "lecture" },
      { id: "int-arch-l15", title: "L15: Performance & Scalability", file: "courses/salesforce/13-integration-architecture-designer/section-04-governance/lecture-15-performance-scalability.md", month: 10, course: "Integration Architecture Designer", section: "Governance", type: "lecture" },

      // Labs
      { id: "int-arch-lab01", title: "Lab 1: REST API Integration", file: "courses/salesforce/13-integration-architecture-designer/labs/lab-01-rest-api-integration.md", month: 10, course: "Integration Architecture Designer", section: "Hands-On Labs", type: "lab" },
      { id: "int-arch-lab02", title: "Lab 2: Platform Events Design", file: "courses/salesforce/13-integration-architecture-designer/labs/lab-02-platform-events-design.md", month: 10, course: "Integration Architecture Designer", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "int-arch-cheatsheet", title: "Integration Architecture Cheat Sheet", file: "courses/salesforce/13-integration-architecture-designer/exam-prep/integration-arch-cheat-sheet.md", month: 10, course: "Integration Architecture Designer", section: "Exam Preparation", type: "exam" },
      { id: "int-arch-exam", title: "Practice Exam (50 Questions)", file: "courses/salesforce/13-integration-architecture-designer/exam-prep/practice-exam-60-questions.md", month: 10, course: "Integration Architecture Designer", section: "Exam Preparation", type: "exam" },

      // ── Course 14: Identity & Access Management Designer ──────────────────────
      { id: "iam-overview", title: "Course Overview", file: "courses/salesforce/14-identity-access-management-designer/00-course-overview.md", month: 11, course: "Identity & Access Management Designer", section: "Course Overview", type: "study" },

      // Section 01 — Identity Fundamentals
      { id: "iam-l01", title: "L1: Identity Concepts", file: "courses/salesforce/14-identity-access-management-designer/section-01-identity-fundamentals/lecture-01-identity-concepts.md", month: 11, course: "Identity & Access Management Designer", section: "Identity Fundamentals", type: "lecture" },
      { id: "iam-l02", title: "L2: SAML & SSO Deep Dive", file: "courses/salesforce/14-identity-access-management-designer/section-01-identity-fundamentals/lecture-02-saml-sso-deep-dive.md", month: 11, course: "Identity & Access Management Designer", section: "Identity Fundamentals", type: "lecture" },
      { id: "iam-l03", title: "L3: OAuth & OpenID Connect", file: "courses/salesforce/14-identity-access-management-designer/section-01-identity-fundamentals/lecture-03-oauth-openid-connect.md", month: 11, course: "Identity & Access Management Designer", section: "Identity Fundamentals", type: "lecture" },
      { id: "iam-l04", title: "L4: Authentication Providers", file: "courses/salesforce/14-identity-access-management-designer/section-01-identity-fundamentals/lecture-04-authentication-providers.md", month: 11, course: "Identity & Access Management Designer", section: "Identity Fundamentals", type: "lecture" },

      // Section 02 — Salesforce Identity
      { id: "iam-l05", title: "L5: Connected Apps", file: "courses/salesforce/14-identity-access-management-designer/section-02-salesforce-identity/lecture-05-connected-apps.md", month: 11, course: "Identity & Access Management Designer", section: "Salesforce Identity", type: "lecture" },
      { id: "iam-l06", title: "L6: Salesforce as IdP", file: "courses/salesforce/14-identity-access-management-designer/section-02-salesforce-identity/lecture-06-salesforce-as-idp.md", month: 11, course: "Identity & Access Management Designer", section: "Salesforce Identity", type: "lecture" },
      { id: "iam-l07", title: "L7: Salesforce as SP", file: "courses/salesforce/14-identity-access-management-designer/section-02-salesforce-identity/lecture-07-salesforce-as-sp.md", month: 11, course: "Identity & Access Management Designer", section: "Salesforce Identity", type: "lecture" },
      { id: "iam-l08", title: "L8: My Domain & Custom Domain", file: "courses/salesforce/14-identity-access-management-designer/section-02-salesforce-identity/lecture-08-my-domain-custom-domain.md", month: 11, course: "Identity & Access Management Designer", section: "Salesforce Identity", type: "lecture" },

      // Section 03 — Access Management
      { id: "iam-l09", title: "L9: Permission Sets & Groups", file: "courses/salesforce/14-identity-access-management-designer/section-03-access-management/lecture-09-permission-sets-groups.md", month: 11, course: "Identity & Access Management Designer", section: "Access Management", type: "lecture" },
      { id: "iam-l10", title: "L10: Delegated Admin & Identity", file: "courses/salesforce/14-identity-access-management-designer/section-03-access-management/lecture-10-delegated-admin-identity.md", month: 11, course: "Identity & Access Management Designer", section: "Access Management", type: "lecture" },
      { id: "iam-l11", title: "L11: Session Policies & Trust", file: "courses/salesforce/14-identity-access-management-designer/section-03-access-management/lecture-11-session-policies-trust.md", month: 11, course: "Identity & Access Management Designer", section: "Access Management", type: "lecture" },
      { id: "iam-l12", title: "L12: Identity Governance", file: "courses/salesforce/14-identity-access-management-designer/section-03-access-management/lecture-12-identity-governance.md", month: 11, course: "Identity & Access Management Designer", section: "Access Management", type: "lecture" },

      // Section 04 — Communities & External
      { id: "iam-l13", title: "L13: Experience Cloud Identity", file: "courses/salesforce/14-identity-access-management-designer/section-04-communities-external/lecture-13-experience-cloud-identity.md", month: 11, course: "Identity & Access Management Designer", section: "Communities & External", type: "lecture" },
      { id: "iam-l14", title: "L14: Social SSO", file: "courses/salesforce/14-identity-access-management-designer/section-04-communities-external/lecture-14-social-sso.md", month: 11, course: "Identity & Access Management Designer", section: "Communities & External", type: "lecture" },
      { id: "iam-l15", title: "L15: External Identity Licensing", file: "courses/salesforce/14-identity-access-management-designer/section-04-communities-external/lecture-15-external-identity-licensing.md", month: 11, course: "Identity & Access Management Designer", section: "Communities & External", type: "lecture" },

      // Labs
      { id: "iam-lab01", title: "Lab 1: SSO Configuration", file: "courses/salesforce/14-identity-access-management-designer/labs/lab-01-sso-configuration.md", month: 11, course: "Identity & Access Management Designer", section: "Hands-On Labs", type: "lab" },
      { id: "iam-lab02", title: "Lab 2: Connected App OAuth", file: "courses/salesforce/14-identity-access-management-designer/labs/lab-02-connected-app-oauth.md", month: 11, course: "Identity & Access Management Designer", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "iam-cheatsheet", title: "IAM Cheat Sheet", file: "courses/salesforce/14-identity-access-management-designer/exam-prep/iam-cheat-sheet.md", month: 11, course: "Identity & Access Management Designer", section: "Exam Preparation", type: "exam" },
      { id: "iam-exam", title: "Practice Exam (50 Questions)", file: "courses/salesforce/14-identity-access-management-designer/exam-prep/practice-exam-60-questions.md", month: 11, course: "Identity & Access Management Designer", section: "Exam Preparation", type: "exam" },

      // ── Course 15: Dev Lifecycle & Deployment Designer ────────────────────────
      { id: "devops-overview", title: "Course Overview", file: "courses/salesforce/15-development-lifecycle-designer/00-course-overview.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Course Overview", type: "study" },

      // Section 01 — Application Lifecycle
      { id: "devops-l01", title: "L1: ALM Fundamentals", file: "courses/salesforce/15-development-lifecycle-designer/section-01-application-lifecycle/lecture-01-alm-fundamentals.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Application Lifecycle", type: "lecture" },
      { id: "devops-l02", title: "L2: Salesforce DX Overview", file: "courses/salesforce/15-development-lifecycle-designer/section-01-application-lifecycle/lecture-02-salesforce-dx-overview.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Application Lifecycle", type: "lecture" },
      { id: "devops-l03", title: "L3: Scratch Orgs & Sandboxes", file: "courses/salesforce/15-development-lifecycle-designer/section-01-application-lifecycle/lecture-03-scratch-orgs-sandboxes.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Application Lifecycle", type: "lecture" },
      { id: "devops-l04", title: "L4: Source Control & Git", file: "courses/salesforce/15-development-lifecycle-designer/section-01-application-lifecycle/lecture-04-source-control-git.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Application Lifecycle", type: "lecture" },

      // Section 02 — Deployment
      { id: "devops-l05", title: "L5: Metadata API Deployment", file: "courses/salesforce/15-development-lifecycle-designer/section-02-deployment/lecture-05-metadata-api-deployment.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Deployment", type: "lecture" },
      { id: "devops-l06", title: "L6: Change Sets & Limitations", file: "courses/salesforce/15-development-lifecycle-designer/section-02-deployment/lecture-06-change-sets-limitations.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Deployment", type: "lecture" },
      { id: "devops-l07", title: "L7: Salesforce CLI Deployment", file: "courses/salesforce/15-development-lifecycle-designer/section-02-deployment/lecture-07-salesforce-cli-deployment.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Deployment", type: "lecture" },
      { id: "devops-l08", title: "L8: Package Development Model", file: "courses/salesforce/15-development-lifecycle-designer/section-02-deployment/lecture-08-package-development-model.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Deployment", type: "lecture" },

      // Section 03 — Testing
      { id: "devops-l09", title: "L9: Testing Strategy Design", file: "courses/salesforce/15-development-lifecycle-designer/section-03-testing/lecture-09-testing-strategy-design.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Testing", type: "lecture" },
      { id: "devops-l10", title: "L10: Apex Test Coverage", file: "courses/salesforce/15-development-lifecycle-designer/section-03-testing/lecture-10-apex-test-coverage.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Testing", type: "lecture" },
      { id: "devops-l11", title: "L11: Automated Testing Tools", file: "courses/salesforce/15-development-lifecycle-designer/section-03-testing/lecture-11-automated-testing-tools.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Testing", type: "lecture" },

      // Section 04 — CI/CD
      { id: "devops-l12", title: "L12: CI/CD Pipeline Design", file: "courses/salesforce/15-development-lifecycle-designer/section-04-cicd/lecture-12-cicd-pipeline-design.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "CI/CD", type: "lecture" },
      { id: "devops-l13", title: "L13: GitHub Actions & Salesforce", file: "courses/salesforce/15-development-lifecycle-designer/section-04-cicd/lecture-13-github-actions-salesforce.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "CI/CD", type: "lecture" },
      { id: "devops-l14", title: "L14: Environment Strategy", file: "courses/salesforce/15-development-lifecycle-designer/section-04-cicd/lecture-14-environment-strategy.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "CI/CD", type: "lecture" },
      { id: "devops-l15", title: "L15: Release Management", file: "courses/salesforce/15-development-lifecycle-designer/section-04-cicd/lecture-15-release-management.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "CI/CD", type: "lecture" },

      // Labs
      { id: "devops-lab01", title: "Lab 1: SFDX Project Setup", file: "courses/salesforce/15-development-lifecycle-designer/labs/lab-01-sfdx-project-setup.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Hands-On Labs", type: "lab" },
      { id: "devops-lab02", title: "Lab 2: CI/CD Pipeline", file: "courses/salesforce/15-development-lifecycle-designer/labs/lab-02-cicd-pipeline.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Hands-On Labs", type: "lab" },

      // Exam Prep
      { id: "devops-cheatsheet", title: "DevOps Cheat Sheet", file: "courses/salesforce/15-development-lifecycle-designer/exam-prep/devops-cheat-sheet.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Exam Preparation", type: "exam" },
      { id: "devops-exam", title: "Practice Exam (50 Questions)", file: "courses/salesforce/15-development-lifecycle-designer/exam-prep/practice-exam-60-questions.md", month: 10, course: "Dev Lifecycle & Deployment Designer", section: "Exam Preparation", type: "exam" },

      // ── Course 16: CTA Board Prep ─────────────────────────────────────────────
      { id: "cta-overview", title: "Course Overview & Strategy", file: "courses/salesforce/16-cta-board-prep/00-overview-and-strategy.md", month: 12, course: "CTA Board Prep", section: "Course Overview", type: "study" },

      // Section 01 — Board Format
      { id: "cta-l01", title: "L1: CTA Exam Format", file: "courses/salesforce/16-cta-board-prep/section-01-board-format/lecture-01-cta-exam-format.md", month: 12, course: "CTA Board Prep", section: "Board Format", type: "lecture" },
      { id: "cta-l02", title: "L2: Scenario Analysis Framework", file: "courses/salesforce/16-cta-board-prep/section-01-board-format/lecture-02-scenario-analysis-framework.md", month: 12, course: "CTA Board Prep", section: "Board Format", type: "lecture" },
      { id: "cta-l03", title: "L3: Presentation Skills", file: "courses/salesforce/16-cta-board-prep/section-01-board-format/lecture-03-presentation-skills.md", month: 12, course: "CTA Board Prep", section: "Board Format", type: "lecture" },
      { id: "cta-l04", title: "L4: Requirements Prioritization", file: "courses/salesforce/16-cta-board-prep/section-01-board-format/lecture-04-requirements-prioritization.md", month: 12, course: "CTA Board Prep", section: "Board Format", type: "lecture" },

      // Section 02 — Architecture Domains
      { id: "cta-l05", title: "L5: Data Architecture Review", file: "courses/salesforce/16-cta-board-prep/section-02-architecture-domains/lecture-05-data-architecture-review.md", month: 12, course: "CTA Board Prep", section: "Architecture Domains", type: "lecture" },
      { id: "cta-l06", title: "L6: Security & Sharing Review", file: "courses/salesforce/16-cta-board-prep/section-02-architecture-domains/lecture-06-security-sharing-review.md", month: 12, course: "CTA Board Prep", section: "Architecture Domains", type: "lecture" },
      { id: "cta-l07", title: "L7: Integration Review", file: "courses/salesforce/16-cta-board-prep/section-02-architecture-domains/lecture-07-integration-review.md", month: 12, course: "CTA Board Prep", section: "Architecture Domains", type: "lecture" },
      { id: "cta-l08", title: "L8: Identity & Access Review", file: "courses/salesforce/16-cta-board-prep/section-02-architecture-domains/lecture-08-identity-access-review.md", month: 12, course: "CTA Board Prep", section: "Architecture Domains", type: "lecture" },
      { id: "cta-l09", title: "L9: Application Lifecycle Review", file: "courses/salesforce/16-cta-board-prep/section-02-architecture-domains/lecture-09-application-lifecycle-review.md", month: 12, course: "CTA Board Prep", section: "Architecture Domains", type: "lecture" },

      // Section 03 — Scenario Practice
      { id: "cta-l10", title: "L10: Retail Enterprise Scenario", file: "courses/salesforce/16-cta-board-prep/section-03-scenario-practice/lecture-10-retail-enterprise-scenario.md", month: 12, course: "CTA Board Prep", section: "Scenario Practice", type: "lecture" },
      { id: "cta-l11", title: "L11: Financial Services Scenario", file: "courses/salesforce/16-cta-board-prep/section-03-scenario-practice/lecture-11-financial-services-scenario.md", month: 12, course: "CTA Board Prep", section: "Scenario Practice", type: "lecture" },
      { id: "cta-l12", title: "L12: Healthcare Scenario", file: "courses/salesforce/16-cta-board-prep/section-03-scenario-practice/lecture-12-healthcare-scenario.md", month: 12, course: "CTA Board Prep", section: "Scenario Practice", type: "lecture" },
      { id: "cta-l13", title: "L13: B2B Enterprise Scenario", file: "courses/salesforce/16-cta-board-prep/section-03-scenario-practice/lecture-13-b2b-enterprise-scenario.md", month: 12, course: "CTA Board Prep", section: "Scenario Practice", type: "lecture" },
      { id: "cta-l14", title: "L14: Nonprofit Scenario", file: "courses/salesforce/16-cta-board-prep/section-03-scenario-practice/lecture-14-nonprofit-scenario.md", month: 12, course: "CTA Board Prep", section: "Scenario Practice", type: "lecture" },

      // Section 04 — Presentation
      { id: "cta-l15", title: "L15: Solution Architecture Diagrams", file: "courses/salesforce/16-cta-board-prep/section-04-presentation/lecture-15-solution-architecture-diagrams.md", month: 12, course: "CTA Board Prep", section: "Presentation", type: "lecture" },
      { id: "cta-l16", title: "L16: Handling Constraints & Tradeoffs", file: "courses/salesforce/16-cta-board-prep/section-04-presentation/lecture-16-handling-constraints-tradeoffs.md", month: 12, course: "CTA Board Prep", section: "Presentation", type: "lecture" },
      { id: "cta-l17", title: "L17: Panel Questions Strategy", file: "courses/salesforce/16-cta-board-prep/section-04-presentation/lecture-17-panel-questions-strategy.md", month: 12, course: "CTA Board Prep", section: "Presentation", type: "lecture" },

      // Exam Prep
      { id: "cta-arch-patterns", title: "CTA Architecture Patterns", file: "courses/salesforce/16-cta-board-prep/exam-prep/cta-architecture-patterns.md", month: 12, course: "CTA Board Prep", section: "Exam Preparation", type: "exam" },
      { id: "cta-scenario-checklist", title: "CTA Scenario Checklist", file: "courses/salesforce/16-cta-board-prep/exam-prep/cta-scenario-checklist.md", month: 12, course: "CTA Board Prep", section: "Exam Preparation", type: "exam" },
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
