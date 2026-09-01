import type { Resource } from "./resources";

export const DATA_CLOUD_RESOURCES: Record<string, Resource[]> = {
  "dc-overview": [
    { type: "trailhead", title: "Data Cloud Consultant Exam Guide", url: "https://trailhead.salesforce.com/credentials/datacloudconsultant", description: "Official exam guide — topic weights, prerequisites, registration", level: "Beginner" },
    { type: "trailhead", title: "Salesforce Data Cloud Basics — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=data+cloud", description: "Start here — official Trailhead intro to Data Cloud concepts", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Data Cloud Developer Guide", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_dev_guide.htm&type=5", description: "Primary technical reference for all Data Cloud APIs and configuration", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Data Cloud Overview — Official", url: "https://www.youtube.com/@Salesforce", description: "Search 'Salesforce Data Cloud' on the official channel for latest architecture demos", duration: "30 min" },
    { type: "udemy", title: "Salesforce Data Cloud Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+data+cloud+consultant&sort=highest-rated", description: "Find Data Cloud Consultant prep courses on Udemy", level: "Intermediate" },
  ],
  "dc-l01": [
    { type: "docs", title: "Data Cloud Architecture Guide", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_dev_guide.htm&type=5", description: "Official architecture documentation — DLO, DMO, Unified Individual", level: "Intermediate" },
    { type: "trailhead", title: "Salesforce Data Cloud Basics", url: "https://trailhead.salesforce.com/search?keywords=data+cloud", description: "Foundational module covering the Data Cloud platform architecture", duration: "~1.5 hr", level: "Beginner" },
    { type: "blog", title: "What Is Salesforce Data Cloud? — Product Page", url: "https://www.salesforce.com/products/data-cloud/overview/", description: "Official product page with architecture overview and use cases", level: "Beginner" },
  ],
  "dc-l02": [
    { type: "docs", title: "Data Streams — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_data_streams.htm&type=5", description: "Data Streams reference — connector types, refresh options", level: "Intermediate" },
    { type: "docs", title: "Ingestion API Reference", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_dev_guide.htm&type=5", description: "Ingestion API authentication, payload format, and batch vs streaming modes", level: "Advanced" },
    { type: "youtube", title: "Data Cloud Ingestion — Salesforce Developers", url: "https://www.youtube.com/@Salesforce", description: "Search 'Data Cloud data ingestion' for connector setup walkthroughs", duration: "25 min" },
  ],
  "dc-l03": [
    { type: "docs", title: "Data Model Objects — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_data_model_objects.htm&type=5", description: "DLO vs DMO, standard DMOs list, mapping rules", level: "Intermediate" },
    { type: "docs", title: "Data Cloud Standard Data Model", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_dev_guide.htm&type=5", description: "Standard DMO schema reference — Individual, Contact Point, Engagement", level: "Advanced" },
  ],
  "dc-l04": [
    { type: "docs", title: "Identity Resolution — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_identity_resolution.htm&type=5", description: "Identity Resolution setup guide — match rules, reconciliation rules", level: "Advanced" },
    { type: "youtube", title: "Identity Resolution Deep Dive — Salesforce", url: "https://www.youtube.com/@Salesforce", description: "Search 'Data Cloud identity resolution' for official explainer videos", duration: "30 min" },
    { type: "blog", title: "Salesforce Data Cloud — Unified Customer Profile", url: "https://www.salesforce.com/products/data-cloud/overview/", description: "How the Unified Customer Profile is built from Identity Resolution", level: "Intermediate" },
  ],
  "dc-l05": [
    { type: "docs", title: "Segments — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_segments.htm&type=5", description: "Segment creation, criteria types, direct vs indirect relationships", level: "Intermediate" },
    { type: "youtube", title: "Data Cloud Segmentation — Salesforce Developers", url: "https://www.youtube.com/@Salesforce", description: "Search 'Data Cloud segmentation' for segment builder walkthroughs", duration: "20 min" },
  ],
  "dc-l06": [
    { type: "docs", title: "Calculated Insights — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_calculated_insights.htm&type=5", description: "CI SQL syntax, __dlm suffix, dimensions vs measures, refresh", level: "Advanced" },
    { type: "youtube", title: "Calculated Insights Tutorial — Salesforce", url: "https://www.youtube.com/@Salesforce", description: "Search 'Data Cloud calculated insights SQL' for hands-on demos", duration: "25 min" },
  ],
  "dc-l07": [
    { type: "docs", title: "Activation Targets — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_activation_targets.htm&type=5", description: "Activation Target setup for CRM, Marketing Cloud, and ad platforms", level: "Intermediate" },
    { type: "youtube", title: "Data Cloud Activation — Salesforce", url: "https://www.youtube.com/@Salesforce", description: "Search 'Data Cloud activation target' for MC and CRM activation demos", duration: "20 min" },
  ],
  "dc-l08": [
    { type: "docs", title: "Consent Management — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_consent_api.htm&type=5", description: "Consent API, privacy fields (DoNotProcess, HasOptedOutOfSharing), consent categories", level: "Advanced" },
    { type: "blog", title: "GDPR & Salesforce Data Cloud", url: "https://www.salesforce.com/artificial-intelligence/", description: "Salesforce's privacy and data responsibility framework", level: "Intermediate" },
  ],
  "dc-l09": [
    { type: "docs", title: "Data Spaces — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_data_spaces.htm&type=5", description: "Data Space configuration, permission sets (Admin/Data Aware Specialist/Marketing Specialist)", level: "Intermediate" },
  ],
  "dc-l10": [
    { type: "docs", title: "Data Cloud Admin — Monitoring Jobs", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_monitor_jobs.htm&type=5", description: "Ingestion job statuses, error handling, Data Quality Rules", level: "Intermediate" },
  ],
  "dc-l11": [
    { type: "docs", title: "CRM Analytics + Data Cloud", url: "https://help.salesforce.com/s/articleView?id=sf.bi_integrate_data_cloud.htm&type=5", description: "Connecting Data Cloud DMOs and Calculated Insights to CRM Analytics", level: "Intermediate" },
  ],
  "dc-l12": [
    { type: "docs", title: "Agentforce Grounding with Data Cloud", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "How Agentforce uses Data Cloud vector search for RAG grounding", level: "Advanced" },
    { type: "docs", title: "Einstein Vector Search — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Vector database in Data Cloud for semantic AI search", level: "Advanced" },
  ],
  "dc-l13": [
    { type: "trailhead", title: "Data Cloud Consultant Exam Guide", url: "https://trailhead.salesforce.com/credentials/datacloudconsultant", description: "Review official exam objectives to map use case scenarios to topic areas", level: "Beginner" },
    { type: "udemy", title: "Data Cloud Practice Tests — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+data+cloud+consultant&sort=highest-rated", description: "Scenario-based practice questions for use case topics", level: "Intermediate" },
  ],
  "dc-lab01": [
    { type: "docs", title: "Create a Salesforce CRM Connector", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_connect_an_org.htm&type=5", description: "Step-by-step guide for setting up a Salesforce CRM Data Stream", level: "Intermediate" },
  ],
  "dc-lab02": [
    { type: "docs", title: "Set Up Identity Resolution", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_identity_resolution.htm&type=5", description: "Identity Resolution ruleset configuration reference", level: "Advanced" },
  ],
  "dc-lab03": [
    { type: "docs", title: "Create a Segment", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_create_a_segment.htm&type=5", description: "Segment builder walkthrough with calculated insight criteria", level: "Intermediate" },
    { type: "docs", title: "Set Up Activation Targets", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_activation_targets.htm&type=5", description: "CRM activation target setup guide for Lab 03", level: "Intermediate" },
  ],
  "dc-exam": [
    { type: "trailhead", title: "Data Cloud Consultant Exam Guide", url: "https://trailhead.salesforce.com/credentials/datacloudconsultant", description: "Official exam guide — topic weights and registration", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Data Cloud Consultant — Trail Mix", url: "https://trailhead.salesforce.com/credentials/datacloudconsultant", description: "Official Salesforce recommended study path", duration: "~10 hr", level: "Intermediate" },
    { type: "udemy", title: "Data Cloud Consultant Practice Tests — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+data+cloud+consultant&sort=highest-rated", description: "Find practice exam courses on Udemy", level: "Intermediate" },
  ],
  "dc-cheatsheet": [
    { type: "trailhead", title: "Data Cloud Consultant Exam Guide", url: "https://trailhead.salesforce.com/credentials/datacloudconsultant", description: "Official exam objectives — source of truth for cheat sheet", level: "Beginner" },
    { type: "docs", title: "Data Cloud Developer Guide", url: "https://help.salesforce.com/s/articleView?id=sf.c360_a_dev_guide.htm&type=5", description: "Quick reference for any technical term in the cheat sheet", level: "Intermediate" },
  ],
};
