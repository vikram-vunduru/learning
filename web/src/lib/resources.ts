import { ADMIN_RESOURCES } from "./resources-admin";
import { APP_BUILDER_RESOURCES } from "./resources-app-builder";
import { PDI_RESOURCES } from "./resources-pdi";
import { JSI_RESOURCES } from "./resources-jsi";

export type ResourceType = "docs" | "trailhead" | "youtube" | "blog" | "udemy" | "video";

export interface Resource {
  type: ResourceType;
  title: string;
  url: string;
  description?: string;
  duration?: string;   // e.g. "12 min", "3 hr"
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface InstructorResources {
  moduleId: string;
  resources: Resource[];
}

// Icon + label per resource type
export const RESOURCE_META: Record<ResourceType, { icon: string; label: string; color: string }> = {
  docs:      { icon: "📘", label: "Salesforce Docs",    color: "#0176d3" },
  trailhead: { icon: "🏔️", label: "Trailhead",          color: "#00a1e0" },
  youtube:   { icon: "▶️", label: "YouTube",            color: "#ff0000" },
  video:     { icon: "🎬", label: "Video",              color: "#ff4444" },
  blog:      { icon: "📝", label: "Blog / Article",     color: "#3ba755" },
  udemy:     { icon: "🎓", label: "Udemy Course",       color: "#a435f0" },
};

const RESOURCES: Record<string, Resource[]> = {

  // ── L1: What is AI ──────────────────────────────────────────────────────
  "ai-assoc-l01": [
    { type: "trailhead", title: "Get Started with Artificial Intelligence", url: "https://trailhead.salesforce.com/content/learn/modules/artificial-intelligence-fundamentals", description: "Core AI concepts module on Trailhead — perfect prep for exam Section 4 (AI Fundamentals, 17%)", duration: "~45 min", level: "Beginner" },
    { type: "trailhead", title: "AI Ethics and Bias — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/responsible-ai-practices-for-salesforce", description: "Introduces Trusted AI Principles. Required reading before teaching L15–L18.", duration: "~30 min", level: "Beginner" },
    { type: "docs", title: "Salesforce Einstein AI — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Official Einstein Generative AI developer documentation hub — authoritative source for all AI features", level: "Beginner" },
    { type: "docs", title: "Salesforce AI Hub — salesforce.com/artificial-intelligence", url: "https://www.salesforce.com/artificial-intelligence/", description: "Salesforce main AI landing page — overview of all Einstein features, products, and resources", level: "Beginner" },
    { type: "youtube", title: "But What Is a Neural Network? — 3Blue1Brown", url: "https://www.youtube.com/watch?v=aircAruvnKk", description: "The best visual explanation of AI/ML ever made. Watch before teaching L1–L3.", duration: "19 min", level: "Beginner" },
    { type: "youtube", title: "Salesforce Einstein AI Overview — Official Channel", url: "https://www.youtube.com/@Salesforce", description: "Salesforce official YouTube — search 'Einstein AI overview' for the latest short-form explainers", duration: "5–15 min" },
    { type: "blog", title: "What Is Artificial Intelligence? — Salesforce Resources", url: "https://www.salesforce.com/resources/articles/artificial-intelligence/what-is-artificial-intelligence/", description: "Salesforce's plain-English definition of AI with CRM use cases — use examples here in your recording", level: "Beginner" },
    { type: "blog", title: "AI Terminology — Salesforce Artificial Intelligence Hub", url: "https://www.salesforce.com/artificial-intelligence/", description: "The main Salesforce AI hub — scroll to the resources section for definitions of every exam term", level: "Beginner" },
    { type: "udemy", title: "Salesforce Certified AI Associate — Exam Prep (Search Udemy)", url: "https://www.udemy.com/courses/search/?q=salesforce+ai+associate+certification&sort=highest-rated", description: "Search for top-rated Salesforce AI Associate courses on Udemy — study competitor content to differentiate yours", level: "Beginner" },
  ],

  // ── L2: Types of Machine Learning ───────────────────────────────────────
  "ai-assoc-l02": [
    { type: "trailhead", title: "Artificial Intelligence Fundamentals — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/artificial-intelligence-fundamentals", description: "Covers supervised, unsupervised, and reinforcement learning with Salesforce context", duration: "~45 min", level: "Beginner" },
    { type: "youtube", title: "Machine Learning for Everybody — freeCodeCamp", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", description: "Full beginner ML course. Chapters 1–3 map directly to this lecture.", duration: "3.7 hr", level: "Beginner" },
    { type: "youtube", title: "But What Is a Neural Network? — 3Blue1Brown", url: "https://www.youtube.com/watch?v=aircAruvnKk", description: "Best visual intuition for how ML models learn from labelled data", duration: "19 min" },
    { type: "docs", title: "Einstein Prediction Builder — Developer Docs", url: "https://developer.salesforce.com/docs/einstein/genai/guide/prediction-builder-overview.html", description: "Supervised learning in action inside Salesforce — real exam context", level: "Beginner" },
    { type: "blog", title: "Supervised vs Unsupervised Learning — Salesforce Blog", url: "https://www.salesforce.com/blog/supervised-vs-unsupervised-machine-learning/", description: "Clear, exam-ready comparison with CRM use cases. Read aloud during recording.", level: "Beginner" },
  ],

  // ── L3: Neural Networks ──────────────────────────────────────────────────
  "ai-assoc-l03": [
    { type: "youtube", title: "Neural Networks — 3Blue1Brown (Series, Part 1–4)", url: "https://www.youtube.com/watch?v=aircAruvnKk", description: "Chapters 1–4. The animation for backpropagation is exactly what your students need to see.", duration: "1 hr", level: "Beginner" },
    { type: "youtube", title: "Deep Learning Crash Course — Lex Fridman (MIT)", url: "https://www.youtube.com/watch?v=0VH1Lim8gL8", description: "MIT lecture. Use timestamps 0:00–25:00 for neuron analogy and layer intuition.", duration: "25 min clip", level: "Intermediate" },
    { type: "trailhead", title: "AI Fundamentals — Deep Learning Module", url: "https://trailhead.salesforce.com/content/learn/modules/artificial-intelligence-fundamentals", description: "Trailhead's simplified take on deep learning for Salesforce professionals", duration: "~30 min" },
    { type: "blog", title: "Deep Learning vs Machine Learning — Salesforce Blog", url: "https://www.salesforce.com/blog/deep-learning-vs-machine-learning/", description: "Salesforce blog covering the exact comparison the exam tests", level: "Beginner" },
  ],

  // ── L4: Predictive vs Generative AI ─────────────────────────────────────
  "ai-assoc-l04": [
    { type: "trailhead", title: "Generative AI Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/generative-ai-basics", description: "Mandatory Trailhead module — covers predictive vs generative distinction. Exam loves this.", duration: "~45 min", level: "Beginner" },
    { type: "docs", title: "Einstein Generative AI — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Official Salesforce developer docs on generative AI products — direct exam source material", level: "Beginner" },
    { type: "youtube", title: "Generative AI in 5 Minutes — Salesforce", url: "https://www.youtube.com/@Salesforce", description: "Search 'Salesforce generative AI explained' — official short-form explainer", duration: "5–10 min" },
    { type: "blog", title: "Generative AI vs Predictive AI — Salesforce Blog", url: "https://www.salesforce.com/blog/generative-ai-vs-predictive-ai/", description: "The exam loves this comparison. Use the table from this blog in your slide.", level: "Beginner" },
    { type: "blog", title: "What Is Generative AI? — Salesforce", url: "https://www.salesforce.com/artificial-intelligence/generative-ai/what-is-generative-ai/", description: "Salesforce's official definition page — use this as the authoritative source", level: "Beginner" },
  ],

  // ── L5: LLMs Explained ──────────────────────────────────────────────────
  "ai-assoc-l05": [
    { type: "youtube", title: "Intro to Large Language Models — Andrej Karpathy", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", description: "The definitive LLM explainer by one of AI's top researchers. Watch fully before teaching this lecture.", duration: "1 hr", level: "Beginner" },
    { type: "youtube", title: "How ChatGPT Works — Visually Explained", url: "https://www.youtube.com/watch?v=SHLoD_M2Y3U", description: "Visual breakdown of transformer architecture — use screenshots in slides", duration: "12 min", level: "Beginner" },
    { type: "trailhead", title: "Large Language Models on Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/generative-ai-basics", description: "Trailhead's LLM coverage — includes tokens, context window, model types", duration: "~30 min" },
    { type: "docs", title: "Model Builder — Bring Your Own LLM to Salesforce", url: "https://developer.salesforce.com/docs/einstein/genai/guide/model-builder-overview.html", description: "Where customers connect third-party LLMs (GPT-4o, Claude, etc.) to Salesforce", level: "Intermediate" },
    { type: "blog", title: "What Are Large Language Models? — Salesforce", url: "https://www.salesforce.com/artificial-intelligence/generative-ai/large-language-model/", description: "Official Salesforce LLM explainer — exact terminology the exam uses", level: "Beginner" },
    { type: "blog", title: "What Is a Token in AI? — Salesforce Blog", url: "https://www.salesforce.com/blog/what-is-a-token-in-ai/", description: "Tokens explained for Salesforce context — critical for Prompt Builder cost understanding", level: "Beginner" },
  ],

  // ── L6: Prompt Engineering ──────────────────────────────────────────────
  "ai-assoc-l06": [
    { type: "trailhead", title: "Prompt Engineering Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/projects/quick-start-prompt-builder", description: "Official Trailhead Prompt Builder module — covers all 4 template types. Do this lab before teaching.", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Prompt Builder — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/prompt-builder-overview.html", description: "Official step-by-step Prompt Builder docs — use as reference during Lab 2", level: "Intermediate" },
    { type: "youtube", title: "Prompt Engineering Full Course — Andrew Ng (DeepLearning.AI)", url: "https://www.youtube.com/watch?v=H4YK_7MAckk", description: "The best prompt engineering course online. Module 1–3 directly maps to exam content.", duration: "1.5 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Prompt Builder Walkthrough", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'Prompt Builder demo' on the Salesforce Developers channel for the official walkthrough", duration: "20 min" },
    { type: "blog", title: "Prompt Engineering Tips — Salesforce Developer Blog", url: "https://developer.salesforce.com/blogs/", description: "Salesforce-specific prompt engineering best practices", level: "Intermediate" },
    { type: "blog", title: "What Is Prompt Engineering? — Salesforce", url: "https://www.salesforce.com/artificial-intelligence/generative-ai/what-is-prompt-engineering/", description: "Official Salesforce definition — use as exam reference", level: "Beginner" },
  ],

  // ── L7: Hallucinations & Bias ────────────────────────────────────────────
  "ai-assoc-l07": [
    { type: "blog", title: "What Is AI Hallucination? — Salesforce Blog", url: "https://www.salesforce.com/blog/what-is-ai-hallucination/", description: "Salesforce's official explanation of hallucinations — real exam terminology here", level: "Beginner" },
    { type: "blog", title: "AI Bias: What It Is and How to Prevent It — Salesforce", url: "https://www.salesforce.com/blog/ai-bias/", description: "Covers training data bias and feedback loop bias — maps to L16 exam content too", level: "Beginner" },
    { type: "trailhead", title: "Responsible AI Practices — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/responsible-ai-practices-for-salesforce", description: "Covers bias, hallucinations, and mitigation strategies in the Salesforce context", duration: "~45 min" },
    { type: "youtube", title: "AI Hallucinations Explained — Two Minute Papers", url: "https://www.youtube.com/c/K%C3%A1rolyZsolnai-Feh%C3%A9r", description: "Short, memorable explanation of why LLMs hallucinate — great intro hook for students", duration: "5–8 min" },
    { type: "docs", title: "Einstein Trust Layer — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/trust-layer.html", description: "How the Trust Layer prevents harmful/biased outputs — connects hallucinations to Trust Layer", level: "Intermediate" },
  ],

  // ── L8: Einstein Trust Layer ─────────────────────────────────────────────
  "ai-assoc-l08": [
    { type: "docs", title: "Einstein Trust Layer — Official Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/trust-layer.html", description: "PRIMARY EXAM SOURCE — read every word of this page before teaching. Data flow, components, ZDR.", level: "Intermediate" },
    { type: "trailhead", title: "Get to Know the Einstein Trust Layer — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/sf-generative-ai-responsible-use", description: "Official Trailhead module on Trust Layer. The badge question bank is close to real exam questions.", duration: "~1 hr", level: "Beginner" },
    { type: "youtube", title: "Einstein Trust Layer Deep Dive — Salesforce Developers", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'Einstein Trust Layer explained' for the official Salesforce Developers breakdown", duration: "25–35 min" },
    { type: "youtube", title: "Salesforce AI Security — TrailheaDX Session", url: "https://www.youtube.com/@Salesforce", description: "Search 'TrailheaDX Trust Layer' for the full conference session — executive-level explainer", duration: "40 min" },
    { type: "blog", title: "Einstein Trust Layer: What It Is and Why It Matters", url: "https://www.salesforce.com/blog/einstein-trust-layer/", description: "Salesforce blog with the official business case for Trust Layer — use for the opening hook in your recording", level: "Beginner" },
    { type: "blog", title: "Zero Data Retention Policy Explained", url: "https://www.salesforce.com/blog/zero-data-retention-policy-ai/", description: "Deep dive on ZDR — the most-tested Trust Layer component on the exam", level: "Intermediate" },
  ],

  // ── L9: RAG & Grounding ──────────────────────────────────────────────────
  "ai-assoc-l09": [
    { type: "blog", title: "What Is Retrieval-Augmented Generation (RAG)? — Salesforce", url: "https://www.salesforce.com/blog/retrieval-augmented-generation/", description: "Salesforce's RAG explainer — use the 4-step diagram description in your slides", level: "Beginner" },
    { type: "docs", title: "Agentforce Grounding — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/agentforce-grounding.html", description: "How Agentforce uses Data Cloud for RAG — connects L9 to L11 and L21 directly", level: "Intermediate" },
    { type: "youtube", title: "RAG Explained — IBM Technology", url: "https://www.youtube.com/watch?v=T-D1OfcDW1M", description: "Best visual RAG explainer on YouTube — simple whiteboard animation, use as inspiration", duration: "10 min", level: "Beginner" },
    { type: "trailhead", title: "Generative AI Basics — Grounding Section", url: "https://trailhead.salesforce.com/content/learn/modules/generative-ai-basics", description: "Trailhead covers grounding in its Generative AI Basics module", duration: "~15 min section" },
    { type: "blog", title: "What Is Vector Search? — Salesforce Blog", url: "https://www.salesforce.com/blog/vector-search-ai/", description: "Explains vector embeddings + semantic search — critical for understanding how RAG retrieves context", level: "Intermediate" },
  ],

  // ── L10: Einstein Platform ───────────────────────────────────────────────
  "ai-assoc-l10": [
    { type: "docs", title: "Einstein Generative AI — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Master developer reference for the Einstein AI platform — all three AI types (Predictive, Generative, Agentic)", level: "Beginner" },
    { type: "docs", title: "Salesforce AI Hub — Products & Features", url: "https://www.salesforce.com/artificial-intelligence/", description: "Official overview of Einstein features across every Salesforce cloud — great for lesson planning", level: "Beginner" },
    { type: "trailhead", title: "Get Started with Einstein Features", url: "https://trailhead.salesforce.com/credentials/aiassociate", description: "Hands-on intro to Einstein across Sales, Service, and Marketing clouds", duration: "~1 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Einstein AI — Full Platform Tour", url: "https://www.youtube.com/@Salesforce", description: "Search 'Einstein AI platform overview' on the official Salesforce channel for the latest keynote demo", duration: "20–30 min" },
    { type: "blog", title: "Salesforce Einstein 1 Platform — Product Page", url: "https://www.salesforce.com/products/platform/overview/", description: "How Einstein AI is embedded across all Salesforce clouds — the big picture context", level: "Beginner" },
  ],

  // ── L11: Einstein Copilot & Agentforce ──────────────────────────────────
  "ai-assoc-l11": [
    { type: "docs", title: "Agentforce — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/agentforce-overview.html", description: "PRIMARY SOURCE — Topics, Actions, and Atlas Reasoning Engine. Read before teaching.", level: "Intermediate" },
    { type: "trailhead", title: "Agentforce for Everyone — Trailhead", url: "https://developer.salesforce.com/docs/einstein/genai/guide/agentforce-overview.html", description: "Official Agentforce module — explains pre-built agents (Sales SDR, Service Agent, etc.)", duration: "~1 hr", level: "Beginner" },
    { type: "trailhead", title: "Build Your First Agentforce Agent", url: "https://developer.salesforce.com/docs/einstein/genai/guide/agentforce-overview.html", description: "Hands-on project — do this yourself before teaching Lab 4", duration: "~1 hr", level: "Beginner" },
    { type: "youtube", title: "Agentforce Demo — Salesforce Dreamforce Keynote", url: "https://www.youtube.com/@Salesforce", description: "Search 'Agentforce Dreamforce demo' — Marc Benioff's keynote demo is the best 5-min Agentforce explanation", duration: "5–10 min" },
    { type: "blog", title: "What Is Agentforce? — salesforce.com/agentforce", url: "https://www.salesforce.com/agentforce/", description: "Official Agentforce landing page with architecture, use cases, and customer stories", level: "Beginner" },
    { type: "udemy", title: "Agentforce & Einstein AI — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+agentforce+einstein+ai&sort=highest-rated", description: "Find top-rated Agentforce courses on Udemy — great for seeing what competitor instructors cover", level: "Intermediate" },
  ],

  // ── L12: Prompt Builder ──────────────────────────────────────────────────
  "ai-assoc-l12": [
    { type: "docs", title: "Prompt Builder Overview — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/prompt-builder-overview.html", description: "Step-by-step official docs — use as your Lab 2 reference guide while recording", level: "Intermediate" },
    { type: "docs", title: "Prompt Template Types — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/prompt-builder-template-types.html", description: "Official docs on all 4 template types — Field Generation, Flex, Record Summary, Sales Email", level: "Intermediate" },
    { type: "trailhead", title: "Build with Prompt Builder — Trailhead", url: "https://trailhead.salesforce.com/content/learn/projects/quick-start-prompt-builder", description: "Hands-on module — complete this before recording Lab 2. Exam weight: HIGH (23% of exam)", duration: "~1.5 hr", level: "Intermediate" },
    { type: "youtube", title: "Prompt Builder Step-by-Step — Salesforce Developers", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'Prompt Builder tutorial' on the Salesforce Developers channel", duration: "30–40 min" },
    { type: "udemy", title: "Salesforce Prompt Builder & GenAI — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+prompt+builder+generative+ai&sort=highest-rated", description: "Find Prompt Builder courses on Udemy — compare how others teach the 4 template types", level: "Intermediate" },
    { type: "blog", title: "Salesforce Developer Blog — Prompt Builder", url: "https://developer.salesforce.com/blogs/", description: "Search 'Prompt Builder' on the Salesforce Developer Blog for deep-dive articles and best practices", level: "Advanced" },
  ],

  // ── L13: Einstein Prediction Builder ────────────────────────────────────
  "ai-assoc-l13": [
    { type: "docs", title: "Einstein Prediction Builder — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Full documentation — covers creating predictions, reading AUC scores, and troubleshooting", level: "Intermediate" },
    { type: "trailhead", title: "Predict Business Outcomes with Einstein", url: "https://trailhead.salesforce.com/content/learn/modules/einstein_prediction_builder", description: "Hands-on module with sample prediction use cases — do this before recording Lab 3", duration: "~1.5 hr", level: "Intermediate" },
    { type: "youtube", title: "Einstein Prediction Builder Demo — Salesforce Developers", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'Einstein Prediction Builder demo' for step-by-step walkthrough", duration: "25 min" },
    { type: "blog", title: "Einstein Lead Scoring — Salesforce Products", url: "https://www.salesforce.com/sales/ai/einstein-lead-scoring/", description: "Explains built-in Einstein Lead Scoring — exam distinguishes this from custom Prediction Builder", level: "Intermediate" },
  ],

  // ── L14: Next Best Action ────────────────────────────────────────────────
  "ai-assoc-l14": [
    { type: "docs", title: "Next Best Action — Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.nba_api_dev_guide.meta/nba_api_dev_guide/nba_api_intro.htm", description: "Complete NBA API documentation — Recommendations, Strategies, Strategies Builder", level: "Intermediate" },
    { type: "trailhead", title: "Recommend Actions with Next Best Action", url: "https://developer.salesforce.com/docs/atlas.en-us.nba_api_dev_guide.meta/nba_api_dev_guide/nba_api_intro.htm", description: "Hands-on Trailhead module — do before recording Lab 4", duration: "~1.5 hr", level: "Intermediate" },
    { type: "youtube", title: "Next Best Action Tutorial — Salesforce Developers", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'Next Best Action Salesforce' for the latest walkthrough", duration: "30 min" },
    { type: "docs", title: "Next Best Action Product Page — Salesforce", url: "https://www.salesforce.com/artificial-intelligence/", description: "Business overview of NBA with sales/service use cases — great for exam context", level: "Beginner" },
  ],

  // ── L15: Responsible AI Principles ──────────────────────────────────────
  "ai-assoc-l15": [
    { type: "docs", title: "Salesforce AI Acceptable Use Policy & Principles", url: "https://www.salesforce.com/company/responsible-ai-policy/", description: "PRIMARY EXAM SOURCE — the official 5 principles. Memorize: Responsible, Accountable, Transparent, Empowering, Inclusive", level: "Beginner" },
    { type: "trailhead", title: "Responsible Creation of Artificial Intelligence — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/responsible-creation-of-artificial-intelligence", description: "Trusted AI Principles module — exam questions on ethics come directly from here", duration: "~1 hr", level: "Beginner" },
    { type: "trailhead", title: "Ethical Use of AI in Business — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/ethical-use-of-artificial-intelligence-in-business", description: "Covers real-world ethical scenarios — closer to exam question style than theory", duration: "~45 min", level: "Beginner" },
    { type: "youtube", title: "Salesforce Trusted AI — Trailhead DX Session", url: "https://www.youtube.com/@Salesforce", description: "Search 'Salesforce Trusted AI principles' — watch TrailheaDX sessions for expert explanations", duration: "30–45 min" },
    { type: "udemy", title: "AI Ethics & Responsible AI — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=ai+ethics+responsible+ai&sort=highest-rated", description: "General AI ethics courses on Udemy — helpful context for teaching L15–L18 with confidence", level: "Beginner" },
  ],

  // ── L16: Bias in AI ──────────────────────────────────────────────────────
  "ai-assoc-l16": [
    { type: "trailhead", title: "Responsible AI Practices — Bias Section", url: "https://trailhead.salesforce.com/content/learn/modules/responsible-ai-practices-for-salesforce", description: "Trailhead module with hands-on bias identification exercises — directly mapped to exam questions", duration: "~30 min section" },
    { type: "blog", title: "Gender Shades Project — MIT Media Lab", url: "https://www.media.mit.edu/projects/gender-shades/overview/", description: "The Buolamwini/Gebru study on facial recognition bias. Referenced in lecture. Read the full paper summary.", level: "Intermediate" },
    { type: "youtube", title: "Coded Bias Documentary Trailer — Netflix", url: "https://www.youtube.com/watch?v=jZl55PsfZJQ", description: "5-min trailer about AI facial recognition bias — great hook to open your L16 recording with", duration: "5 min", level: "Beginner" },
    { type: "youtube", title: "AI Bias and Fairness — Google PAIR", url: "https://www.youtube.com/watch?v=59bMh59JQDo", description: "Google's People + AI Research explainer — covers algorithmic fairness concepts", duration: "15 min", level: "Beginner" },
  ],

  // ── L17: Transparency & Explainability ──────────────────────────────────
  "ai-assoc-l17": [
    { type: "docs", title: "Einstein Explainability — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "How Einstein explains prediction factors — directly connects to this lecture", level: "Intermediate" },
    { type: "trailhead", title: "Responsible Creation of AI — Transparency Module", url: "https://trailhead.salesforce.com/content/learn/modules/responsible-creation-of-artificial-intelligence", description: "Transparency and Accountability principle coverage on Trailhead", duration: "~20 min section" },
    { type: "youtube", title: "Explainable AI (XAI) Explained — IBM Technology", url: "https://www.youtube.com/watch?v=R3AvDvGJlWY", description: "IBM's clear explainer on XAI and the 'black box vs glass box' framing — use this analogy in your recording", duration: "9 min", level: "Beginner" },
    { type: "blog", title: "Salesforce AI Transparency — PAIR Principles", url: "https://www.salesforce.com/artificial-intelligence/", description: "Salesforce AI hub — search 'transparency' for current position and product examples", level: "Intermediate" },
  ],

  // ── L18: Human Oversight ─────────────────────────────────────────────────
  "ai-assoc-l18": [
    { type: "docs", title: "Agentforce Escalation — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/agentforce-overview.html", description: "How to design an agent that escalates to a human agent — practical exam scenario material", level: "Intermediate" },
    { type: "trailhead", title: "Responsible AI — Accountability Section", url: "https://trailhead.salesforce.com/content/learn/modules/responsible-ai-practices-for-salesforce", description: "Accountability principle and human oversight coverage", duration: "~20 min section" },
    { type: "docs", title: "Salesforce AI Acceptable Use Policy", url: "https://www.salesforce.com/company/ai-use-policy/", description: "Official policy on what AI can and cannot do in Salesforce products — exam may reference this", level: "Intermediate" },
    { type: "youtube", title: "Human-in-the-Loop AI Systems — Explainer", url: "https://www.youtube.com/results?search_query=human+in+the+loop+AI+explainer", description: "Search 'human in the loop AI' on YouTube for short visual explainers — good for slide inspiration", duration: "8–12 min" },
  ],

  // ── L19: Data Quality ────────────────────────────────────────────────────
  "ai-assoc-l19": [
    { type: "trailhead", title: "Data Quality Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/data-quality", description: "All 6 data quality dimensions covered with Salesforce examples — foundation for this lecture", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Salesforce Data Quality — Product Overview", url: "https://www.salesforce.com/data/data-quality/", description: "Salesforce's data quality product page — use the business case stats in your lecture opening", level: "Beginner" },
    { type: "youtube", title: "Data Quality for AI — Salesforce Developers Channel", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'data quality Salesforce AI' on the Salesforce Developers channel", duration: "20–30 min" },
    { type: "udemy", title: "Salesforce Data Management — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+data+management+quality&sort=highest-rated", description: "Find data management courses on Udemy for additional instructor prep material", level: "Beginner" },
  ],

  // ── L20: Training Data ───────────────────────────────────────────────────
  "ai-assoc-l20": [
    { type: "trailhead", title: "Machine Learning for Salesforce Admins", url: "https://trailhead.salesforce.com/content/learn/modules/artificial-intelligence-fundamentals", description: "Training data concepts within Salesforce context", duration: "~30 min section" },
    { type: "youtube", title: "How Machine Learning Works — Google ML Crash Course", url: "https://www.youtube.com/watch?v=nKW8Ndu7Mjw", description: "Google's explainer on training/validation/test splits — the best 10-minute visual summary", duration: "10 min", level: "Beginner" },
    { type: "youtube", title: "Machine Learning Crash Course — Google Developers", url: "https://www.youtube.com/playlist?list=PLOU2XLYxmsIIuiBfYad6rFYQU_jL2ryal", description: "Google's free ML crash course playlist — training data, overfitting, and model evaluation", duration: "~3 hr total", level: "Beginner" },
    { type: "udemy", title: "Machine Learning A-Z — Udemy (Kirill Eremenko)", url: "https://www.udemy.com/courses/search/?q=machine+learning+a-z&sort=highest-rated", description: "One of Udemy's highest-rated ML courses — reference for understanding training data depth", level: "Intermediate" },
  ],

  // ── L21: Data Cloud Foundation ───────────────────────────────────────────
  "ai-assoc-l21": [
    { type: "docs", title: "Salesforce Data Cloud — Developer Guide", url: "https://developer.salesforce.com/docs/data/data-cloud/guide/index.html", description: "Official Data Cloud developer docs — Unified Customer Profile, Identity Resolution, Data Streams", level: "Intermediate" },
    { type: "trailhead", title: "Salesforce Data Cloud Basics", url: "https://trailhead.salesforce.com/content/learn/modules/salesforce-data-cloud-basics", description: "Mandatory for this lecture — covers Unified Profile and how Data Cloud feeds AI", duration: "~1.5 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Data Cloud Deep Dive — Official Channel", url: "https://www.youtube.com/@Salesforce", description: "Search 'Salesforce Data Cloud overview' for the latest architecture and demo videos", duration: "30–45 min" },
    { type: "blog", title: "What Is Salesforce Data Cloud? — Product Page", url: "https://www.salesforce.com/products/data-cloud/overview/", description: "Salesforce Data Cloud product overview page — plain-language with unified profile and AI grounding", level: "Beginner" },
    { type: "udemy", title: "Salesforce Data Cloud — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+data+cloud&sort=highest-rated", description: "Find Data Cloud courses on Udemy — great for seeing how others explain the unified profile concept", level: "Intermediate" },
  ],

  // ── L22: Structured vs Unstructured Data ─────────────────────────────────
  "ai-assoc-l22": [
    { type: "trailhead", title: "Data Management Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/data-management", description: "Foundational data concepts including structured vs unstructured types", duration: "~45 min" },
    { type: "docs", title: "Einstein Vector Search — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/vector-search.html", description: "Salesforce's native vector database for storing unstructured data embeddings", level: "Advanced" },
    { type: "youtube", title: "Structured vs Unstructured Data Explained — IBM Technology", url: "https://www.youtube.com/watch?v=ypgbkSBgzKU", description: "IBM's clear 5-min explainer — use this before you record your own version", duration: "5 min", level: "Beginner" },
    { type: "youtube", title: "Vector Embeddings Explained — Computerphile", url: "https://www.youtube.com/results?search_query=vector+embeddings+explained+computerphile", description: "How text becomes numbers for AI — critical for explaining why LLMs can process unstructured data", duration: "12–18 min", level: "Intermediate" },
  ],

  // ── Labs ─────────────────────────────────────────────────────────────────
  "ai-assoc-lab01": [
    { type: "docs", title: "Salesforce Developer Edition — Sign Up", url: "https://developer.salesforce.com/signup", description: "Official Developer Org signup page — walk students through this at the start of Lab 1", level: "Beginner" },
    { type: "trailhead", title: "Salesforce Platform Basics — Setup Navigation", url: "https://trailhead.salesforce.com/content/learn/modules/lex_migration_introduction/lex_migration_introduction_basics", description: "Learn Salesforce Setup navigation before starting labs", duration: "~30 min" },
    { type: "docs", title: "Salesforce Setup Overview — Developer Docs", url: "https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm", description: "Salesforce DX intro — for understanding org setup structure", level: "Beginner" },
  ],
  "ai-assoc-lab02": [
    { type: "docs", title: "Create Prompt Templates — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/prompt-builder-create-template.html", description: "Step-by-step template creation guide — open alongside your lab screen recording", level: "Intermediate" },
    { type: "trailhead", title: "Quick Start: Prompt Builder", url: "https://trailhead.salesforce.com/content/learn/projects/quick-start-prompt-builder", description: "Quick-start project — do this first to validate your lab steps work", duration: "~30 min" },
  ],
  "ai-assoc-lab03": [
    { type: "docs", title: "Einstein Prediction Builder — Developer Guide", url: "https://developer.salesforce.com/docs/einstein/genai/guide/index.html", description: "Official step-by-step prediction creation guide — reference during recording", level: "Intermediate" },
    { type: "trailhead", title: "Quick Start: Einstein Prediction Builder", url: "https://trailhead.salesforce.com/content/learn/modules/einstein_prediction_builder", description: "Guided hands-on project — follow along to validate your lab steps before recording", duration: "~45 min" },
  ],
  "ai-assoc-lab04": [
    { type: "trailhead", title: "Quick Start: Next Best Action", url: "https://developer.salesforce.com/docs/atlas.en-us.nba_api_dev_guide.meta/nba_api_dev_guide/nba_api_intro.htm", description: "Official quick-start project for NBA setup — reference while recording Lab 4", duration: "~45 min" },
    { type: "docs", title: "NBA Strategy Builder — Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.nba_api_dev_guide.meta/nba_api_dev_guide/nba_api_intro.htm", description: "NBA strategy API guide — for advanced configuration discussion during recording", level: "Advanced" },
  ],

  // ── Exam Prep ─────────────────────────────────────────────────────────────
  "ai-assoc-exam": [
    { type: "trailhead", title: "AI Associate Exam Guide — Official Trailhead", url: "https://trailhead.salesforce.com/credentials/aiassociate", description: "PRIMARY EXAM RESOURCE — official exam objectives, topic weights, and registration link. Share with students.", level: "Beginner" },
    { type: "trailhead", title: "Prepare for AI Associate — Official Trail Mix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-ai-associate-credential", description: "Official Salesforce recommended study path — all required modules in one trail mix", duration: "~8 hr total", level: "Beginner" },
    { type: "udemy", title: "Salesforce AI Associate Practice Tests — Search Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+AI+associate+practice+test&sort=highest-rated", description: "Find practice exam courses on Udemy — Sarvesh Srivastava and other Salesforce instructors publish practice question banks", level: "Beginner" },
    { type: "udemy", title: "Salesforce Certified AI Associate — Full Prep Courses", url: "https://www.udemy.com/courses/search/?q=salesforce+certified+AI+associate+certification&sort=highest-rated", description: "Full-length competitor courses on Udemy — study these to see what gaps your course should fill", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben YouTube — AI Associate Exam Tips", url: "https://www.youtube.com/@salesforceben", description: "Salesforce Ben's YouTube channel — dedicated AI Associate playlist with free exam tips and walkthroughs", duration: "Various" },
    { type: "blog", title: "Salesforce AI Associate Study Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Most popular third-party study guide — topic-by-topic breakdown aligned to exam objectives", level: "Beginner" },
  ],
  "ai-assoc-cheatsheet": [
    { type: "trailhead", title: "AI Associate Exam Guide — Official Trailhead", url: "https://trailhead.salesforce.com/credentials/aiassociate", description: "Bookmark this — official exam objectives are the source of truth for your cheat sheet", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Your Salesforce AI Associate Credential", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-ai-associate-credential", description: "Official trailmix — complete all modules to earn the badge and be exam-ready", duration: "~8 hr" },
    { type: "udemy", title: "AI Associate Practice Tests — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+AI+associate+practice+test&sort=highest-rated", description: "Practice question banks on Udemy — drill weak areas identified by the cheat sheet", level: "Beginner" },
    { type: "blog", title: "Salesforce AI Associate Cheat Sheet — Focus on Force", url: "https://focusonforce.com/salesforce-certifications/", description: "Focus on Force's structured study guide — compare their cheat sheet against yours", level: "Beginner" },
  ],
};

const ALL_RESOURCES: Record<string, Resource[]> = {
  ...RESOURCES,
  ...ADMIN_RESOURCES,
  ...APP_BUILDER_RESOURCES,
  ...PDI_RESOURCES,
  ...JSI_RESOURCES,
};

export function getResources(moduleId: string): Resource[] {
  return ALL_RESOURCES[moduleId] ?? [];
}
