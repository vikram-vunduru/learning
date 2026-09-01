import type { Resource } from "./resources";

export const AGENTFORCE_RESOURCES: Record<string, Resource[]> = {
  "agentforce-overview": [
    { type: "trailhead", title: "Agentforce Specialist Exam Guide", url: "https://trailhead.salesforce.com/credentials/agentforcespecialist", description: "Official exam guide — topic weights, prerequisites, registration", level: "Beginner" },
    { type: "trailhead", title: "Build Agents with Agentforce — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=agentforce", description: "Official intro module — Agentforce concepts, terminology, and agent anatomy", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Agentforce Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Primary technical reference for building, testing, and deploying agents", level: "Intermediate" },
    { type: "youtube", title: "Agentforce Overview — Official Salesforce", url: "https://www.youtube.com/@Salesforce", description: "Search 'Agentforce overview' on the official channel for demos and architecture walkthroughs", duration: "20 min" },
  ],
  "af-l01": [
    { type: "trailhead", title: "Agentforce Basics — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=agentforce", description: "Foundational Agentforce concepts — what agents are, how they differ from chatbots", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Agentforce Overview — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Architecture overview — Atlas Reasoning Engine, Topics, Actions, Trust Layer", level: "Beginner" },
    { type: "blog", title: "What Is Agentforce? — Salesforce", url: "https://www.salesforce.com/agentforce/", description: "Official Salesforce Agentforce product page with use cases and capabilities", level: "Beginner" },
  ],
  "af-l02": [
    { type: "docs", title: "Atlas Reasoning Engine — Developer Docs", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "How Atlas reasons, plans, and selects actions — ReAct loop explained", level: "Advanced" },
    { type: "youtube", title: "How Agentforce Agents Think — Salesforce Developers", url: "https://www.youtube.com/@Salesforce", description: "Search 'Agentforce reasoning engine' for architectural deep-dive videos", duration: "25 min" },
  ],
  "af-l03": [
    { type: "trailhead", title: "Agentforce Service Agent — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=agentforce+service+agent", description: "Service Agent setup and configuration — the most common exam scenario", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Prebuilt Agent Templates", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Service Agent, SDR Agent, Sales Coach — when to use each", level: "Intermediate" },
  ],
  "af-l04": [
    { type: "docs", title: "Topics and Actions — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "How to create Topics, write effective descriptions, and add Actions within Topics", level: "Intermediate" },
    { type: "trailhead", title: "Create an Agentforce Action — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=agentforce+actions", description: "Hands-on module creating Flow, Apex, and Prompt Template actions", duration: "~1.5 hr", level: "Intermediate" },
    { type: "youtube", title: "Agentforce Topics and Actions Deep Dive", url: "https://www.youtube.com/@Salesforce", description: "Search 'Agentforce topics actions tutorial' for configuration walkthroughs", duration: "30 min" },
  ],
  "af-l05": [
    { type: "docs", title: "Agent Instructions — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_agent_instructions.htm&type=5", description: "How to write effective agent instructions — persona, scope, guardrails", level: "Intermediate" },
  ],
  "af-l06": [
    { type: "trailhead", title: "Invoke a Flow from Agentforce", url: "https://trailhead.salesforce.com/search?keywords=agentforce+actions", description: "Flow Action requirements — Autolaunched, Active, input/output variables", duration: "~1 hr", level: "Intermediate" },
    { type: "docs", title: "Apex @InvocableMethod for Agentforce", url: "https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_classes_annotation_InvocableMethod.htm", description: "InvocableMethod annotation for exposing Apex to Agentforce Actions", level: "Advanced" },
  ],
  "af-l07": [
    { type: "docs", title: "Grounding for Agentforce Agents", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Knowledge Search, Data Cloud vector search, and RAG pattern for agents", level: "Advanced" },
    { type: "trailhead", title: "Einstein Search for Agentforce", url: "https://trailhead.salesforce.com/search?keywords=agentforce+knowledge", description: "Knowledge grounding setup — publishing articles, enabling Einstein Knowledge", duration: "~1 hr", level: "Intermediate" },
  ],
  "af-l08": [
    { type: "trailhead", title: "Build with Prompt Builder — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=prompt+builder", description: "Official Prompt Builder module — template types, merge fields, grounding", duration: "~1.5 hr", level: "Intermediate" },
    { type: "docs", title: "Prompt Builder Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Template anatomy, merge field syntax, API access, deployment", level: "Intermediate" },
  ],
  "af-l09": [
    { type: "docs", title: "Advanced Prompting Techniques", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Chain-of-thought, few-shot examples, and relevance score tuning", level: "Advanced" },
    { type: "blog", title: "Prompt Engineering Best Practices — Salesforce", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Official Salesforce blog on prompt engineering patterns for Prompt Builder", level: "Intermediate" },
  ],
  "af-l10": [
    { type: "docs", title: "Use Prompt Templates as Agentforce Actions", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Flex templates as Agentforce Actions — requirements, inputs, outputs", level: "Intermediate" },
  ],
  "af-l11": [
    { type: "docs", title: "Test Your Agent — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_test_agent.htm&type=5", description: "Agent Builder preview, test cases, routing verification, debugging topics", level: "Intermediate" },
    { type: "trailhead", title: "Test Agentforce Agents — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=agentforce+testing", description: "Hands-on testing module — preview pane, test cases, unit tests", duration: "~1 hr", level: "Intermediate" },
  ],
  "af-l12": [
    { type: "docs", title: "Deploy an Agentforce Agent — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_deploy.htm&type=5", description: "Deployment options — change sets, packages, Salesforce CLI", level: "Intermediate" },
    { type: "docs", title: "Agentforce Channels — Embedded Chat Setup", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_channels.htm&type=5", description: "Embedding agents in Experience Cloud, websites, and Salesforce apps", level: "Intermediate" },
  ],
  "af-l13": [
    { type: "docs", title: "Einstein Trust Layer — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Data masking, zero-retention, toxicity detection, audit logs", level: "Advanced" },
    { type: "docs", title: "Agentforce Conversation Monitoring", url: "https://help.salesforce.com/s/articleView?id=sf.agentforce_monitor.htm&type=5", description: "Conversation analytics, feedback collection, performance metrics", level: "Intermediate" },
  ],
  "af-l14": [
    { type: "trailhead", title: "Agentforce Specialist Exam Guide", url: "https://trailhead.salesforce.com/credentials/agentforcespecialist", description: "Review exam objectives to understand which use cases map to which exam topics", level: "Beginner" },
    { type: "blog", title: "Agentforce Customer Stories", url: "https://www.salesforce.com/agentforce/", description: "Real-world Agentforce implementations — study for scenario-based exam questions", level: "Intermediate" },
  ],
  "af-lab01": [
    { type: "trailhead", title: "Build a Service Agent — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=agentforce+service+agent", description: "Step-by-step Service Agent creation — Identity, Instructions, Topics, Actions", duration: "~1.5 hr", level: "Intermediate" },
  ],
  "af-lab02": [
    { type: "trailhead", title: "Build with Prompt Builder — Trailhead", url: "https://trailhead.salesforce.com/search?keywords=prompt+builder", description: "Flex template creation, merge fields, grounding, and testing in Prompt Builder", duration: "~1.5 hr", level: "Intermediate" },
  ],
  "af-lab03": [
    { type: "docs", title: "Test and Deploy an Agent", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Full end-to-end — preview testing, package deployment, channel activation", level: "Intermediate" },
  ],
  "af-exam": [
    { type: "trailhead", title: "Agentforce Specialist Exam Guide", url: "https://trailhead.salesforce.com/credentials/agentforcespecialist", description: "Official exam guide — topic weights and registration link", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Agentforce Specialist — Trail Mix", url: "https://trailhead.salesforce.com/credentials/agentforcespecialist", description: "Official recommended Trailhead study path for the exam", duration: "~12 hr", level: "Intermediate" },
    { type: "udemy", title: "Agentforce Specialist Practice Tests — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+agentforce+specialist&sort=highest-rated", description: "Find practice exam courses and tests on Udemy", level: "Intermediate" },
  ],
  "af-cheatsheet": [
    { type: "trailhead", title: "Agentforce Specialist Exam Guide", url: "https://trailhead.salesforce.com/credentials/agentforcespecialist", description: "Official exam objectives — source of truth for cheat sheet content", level: "Beginner" },
    { type: "docs", title: "Agentforce Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Quick technical reference for any term in the cheat sheet", level: "Intermediate" },
  ],
};
