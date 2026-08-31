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
