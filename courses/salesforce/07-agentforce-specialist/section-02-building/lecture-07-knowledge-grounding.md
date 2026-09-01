# Lecture 07: Knowledge Grounding

## Learning Objectives
- Explain how Retrieval-Augmented Generation (RAG) works in the Agentforce context
- Distinguish between the four grounding sources available: Einstein Knowledge, Data Cloud vector search, File Search, and external grounding
- Configure Einstein Knowledge as a grounding source for a Service Agent Topic
- Explain how grounding reduces hallucination risk compared to ungrounded LLM responses
- Describe how Atlas synthesizes retrieved content into a natural language response

## Slides

### Slide 1: The Hallucination Problem and Why Grounding Matters
**Visual:**
```
  UNGROUNDED AGENT  ✗                GROUNDED AGENT  ✓
  ─────────────────────────          ─────────────────────────────────────
  Customer: "How long is the         Customer: "How long is the
  return window for electronics?"    return window for electronics?"
         │                                  │
         ▼                                  ▼
  Atlas asks LLM from                Atlas invokes Knowledge Search
  training data (no source)          Action → retrieves article:
         │                           "Electronics Return Policy:
         ▼                            30 days from purchase"
  Agent: "Our return policy                 │
  allows returns within                     ▼
  45 days" ✗                         Agent: "According to our return
                                     policy, electronics can be
  ⚠ WRONG — actual policy            returned within 30 days
     is 30 days                      of purchase." ✓
  ⚠ Stated with confidence           ✓ Sourced from verified article
  ⚠ Agent "didn't know               ✓ Accurate and auditable
     what it didn't know"
```
**Content:**
- **Hallucination** — when an LLM generates plausible but incorrect information from its parametric (trained) knowledge
- LLMs do not always know what they do not know — they may confidently state wrong policy details, incorrect prices, or non-existent features
- **Grounding** solves this by providing the LLM with verified, current information at inference time — the agent answers from the source material, not from training data
- Without grounding, agents are unreliable for any fact-specific domain (policies, pricing, procedures, product specifications)
- **Retrieval-Augmented Generation (RAG)** is the technical pattern: retrieve relevant content, augment the LLM prompt with it, generate a response based on that content
**Speaker Notes:** Hallucination is the number one enterprise concern about deploying AI agents. The solution is grounding — and grounding is what separates a production-ready Agentforce deployment from a demo. Every agent that answers factual questions about company policies, products, or procedures should be grounded. For the exam, the concept of RAG is tested not as a term you need to memorize, but as a behavior you need to recognize: "the agent searches Knowledge before answering" is RAG. "The agent generates an answer from its training" is ungrounded and unreliable.

### Slide 2: Retrieval-Augmented Generation in Agentforce
**Visual:**
```
  User Query
       │
       ▼
┌──────────────────┐
│  Einstein Search  │──▶ Search Index / Knowledge Base
│  (Semantic Search)│◀── Top-K relevant chunks / articles
└──────────────────┘
       │ Retrieved context
       ▼
┌──────────────────────────────────────────────────────────────┐
│                        LLM PROMPT                            │
│  System:  [Agent Instructions]                               │
│  Context: [Retrieved knowledge chunks — verified source]     │
│  User:    [Original query: "What is the return policy?"]     │
└──────────────────────┬───────────────────────────────────────┘
                       │  (through Einstein Trust Layer)
                       ▼
                 AI-grounded response
                 "Our policy allows electronics returns
                  within 30 days of purchase."

  Retrieve ──▶ Augment (inject into prompt) ──▶ Generate
  (from source)   (as verified context)          (from source, not training)
```
**Content:**
- RAG is a three-component pattern in Agentforce:
  1. **Retrieve** — the Knowledge Search (or other grounding) Action performs semantic search over the knowledge source
  2. **Augment** — the retrieved content is added to the Atlas reasoning context (effectively into the prompt)
  3. **Generate** — Atlas generates a response based on the retrieved content rather than from parametric knowledge
- **Semantic search** — the search is meaning-based, not keyword-based; "can I send back a product?" matches "Return Policy" articles even without the word "return"
- The retrieved content is **not returned verbatim** — Atlas synthesizes it into a natural, conversational response appropriate for the customer's message
- **Citation behavior** — Atlas can be instructed to note that information comes from a specific article (good for compliance/auditability)
**Speaker Notes:** The synthesis step is important for user experience. A raw Knowledge article might be formatted as a policy document with headings and legal language. Atlas reads it and responds in a conversational, natural way that addresses the specific customer question — not just dumping the full article. This means article quality still matters — a well-structured Knowledge article with clear, factual content produces better synthesized responses than a disorganized or ambiguous one.

### Slide 3: Einstein Knowledge as Grounding Source
**Visual:**
```
  Setup → Knowledge → Published Articles Library
         │
         ▼
  Agentforce Builder → Topic → Add Action → Knowledge Search
  ┌────────────────────────────────────────────────────────┐
  │  Knowledge Search Action Configuration                 │
  ├────────────────────────────────────────────────────────┤
  │  Grounding Source:      [ Einstein Knowledge ▼ ]       │
  │  Search Scope:          [ All Published Articles ▼ ]   │
  │  Article Types:         [ FAQ ✓ ] [ Policy ✓ ] [ HowTo]│
  │  Minimum Relevance:     [ 0.6 ] ◀── tune this         │
  │    Too high (>0.8) → no results → "I don't know"       │
  │    Too low (<0.3) → wrong articles → wrong answers     │
  │  Max Articles Returned: [ 3   ] ◀── tune this         │
  │    More articles = more tokens consumed                │
  └────────────────────────────────────────────────────────┘
         │
         ▼
  Semantic search over articles
         │
         ▼
  Top-N articles returned → Atlas synthesizes answer

  Requirements: Knowledge enabled, ≥1 Published (Active) article
```
**Content:**
- **Einstein Knowledge** is the primary grounding source for Service Agent deployments — it uses Salesforce Knowledge, the platform's native knowledge management system
- Requirements:
  - Knowledge feature must be enabled in the org
  - At least one **Active** (Published) Knowledge article must exist
  - Articles must be in the correct language to match the agent's language
- Configuration in the Knowledge Search Action:
  - **Minimum Relevance Score** — articles below this threshold are not returned (higher = stricter matching, fewer results)
  - **Maximum Articles Returned** — how many articles to include in the context (1–5 is typical; more articles = more tokens)
  - **Article Types** — which Salesforce Knowledge article types to search (e.g., FAQ, How-To, Policy)
- **Article quality matters** — well-structured articles with clear headers, factual content, and concise language produce better agent responses
**Speaker Notes:** For the exam, Einstein Knowledge is the most tested grounding source because it is the most commonly used. Know the requirements (Knowledge enabled, published articles), the key configuration options (relevance score, max articles), and the importance of article quality. A common exam trap: the question says an agent is returning incorrect information even though Knowledge articles exist — the likely cause is articles in Draft status (not published), a minimum relevance score that is too high (returning no articles), or articles that are structured poorly and confusing the synthesis step.

### Slide 4: Data Cloud Grounding — Vector Search
**Visual:**
```
  Salesforce CRM data          External systems
  (Accounts, Cases,            (Commerce, Marketing,
   Opportunities)               Service, custom)
         │                            │
         └──────────────┬─────────────┘
                        ▼
               ┌─────────────────┐
               │   DATA CLOUD    │
               │  Unified Customer│
               │     Profile      │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Vector Database│
               │ (semantic        │
               │  embeddings)     │
               └────────┬────────┘
                        │
                        ▼
           Agentforce Data Cloud Search Action
                        │
                        ▼
  Personalized records returned to Atlas
  (this customer's tier, purchase history, eligibility)

  vs. Einstein Knowledge: general content for ALL customers
      Data Cloud: personalized data for THIS customer
```
**Content:**
- **Data Cloud grounding** enables agents to answer questions using **personalized, real-time customer data** — not just generic knowledge articles
- Data Cloud maintains a **unified customer profile** — combining data from CRM, commerce, marketing, service, and external systems
- Data Cloud **vector search** converts records into semantic embeddings, enabling meaning-based search across Data Cloud data
- Use cases for Data Cloud grounding:
  - "What did I purchase last month?" → search unified purchase history
  - "Am I eligible for this promotion?" → search customer segment and offer eligibility
  - "What service plans do I have?" → search account and entitlement records
- Requires **Data Cloud license** and **Data Cloud for Agentforce** configuration
- More powerful than Einstein Knowledge for personalized responses; higher setup complexity
**Speaker Notes:** Data Cloud grounding is less commonly deployed than Einstein Knowledge grounding today, but it is increasingly tested on the exam as Salesforce positions Data Cloud as the AI data platform. The conceptual distinction is: Einstein Knowledge is for general, static content that applies to everyone (policy articles, FAQ); Data Cloud grounding is for personalized, dynamic data specific to this customer (their purchases, their account, their eligibility). If an exam question describes a scenario where the agent needs to answer questions specific to the individual customer's data, Data Cloud grounding is the answer. If it is about answering general questions the same way for everyone, Einstein Knowledge is the answer.

### Slide 5: File Search and External Grounding
**Visual:**
```
  FILE SEARCH                          EXTERNAL GROUNDING
  ──────────────────────               ──────────────────────────
  Salesforce Files / Content           External knowledge system
  (PDFs, Word docs, text files)        (Confluence, SharePoint,
          │                             custom knowledge base)
          ▼                                     │
  Indexed for semantic search          API connector / Named
  Documents chunked into               Credentials integration
  retrievable sections                         │
          │                                     ▼
          ▼                             External content retrieved
  Relevant document sections                   │
  returned to Atlas                            │
                                               ▼
  Use when: knowledge lives in        All content passes through
  documents, not structured           Einstein Trust Layer before
  Knowledge articles                  reaching Atlas

  ┌──────────────────────────────────────────────────────────┐
  │  CHOOSING A GROUNDING SOURCE                             │
  ├────────────────────┬─────────────────────────────────────┤
  │ Structured/FAQ     │ Einstein Knowledge (low complexity) │
  │ Personalized data  │ Data Cloud (high complexity)        │
  │ Document-heavy     │ File Search (medium complexity)     │
  │ Non-SF systems     │ External Grounding (high complexity)│
  └────────────────────┴─────────────────────────────────────┘
```
**Content:**
- **File Search** — enables agents to search unstructured documents stored in Salesforce Files or Content (PDFs, Word docs, text files)
  - Use when: your knowledge lives in documents rather than structured Knowledge articles
  - Documents are chunked and indexed for semantic search; full document is not sent to LLM — relevant chunks are retrieved
  - Lower maintenance than Knowledge articles but less structured — may produce less precise responses
- **External Grounding** — connects to knowledge sources outside Salesforce (Confluence, SharePoint, custom knowledge bases)
  - Requires configuration via External Services or Named Credentials
  - Content from external sources still passes through the Einstein Trust Layer
  - Most complex to set up; highest flexibility for diverse knowledge ecosystems
- **Choosing between grounding sources:**
  - Structured, frequently updated content → Einstein Knowledge
  - Personalized, real-time customer data → Data Cloud
  - Document-heavy content → File Search
  - Non-Salesforce knowledge systems → External Grounding
**Speaker Notes:** For the exam, you primarily need to know that multiple grounding source types exist and which scenario each is appropriate for. The selection framework on this slide — structured content (Knowledge), personalized data (Data Cloud), documents (File Search), external systems (External Grounding) — will answer most exam questions about choosing grounding sources. The detailed configuration of File Search and External Grounding is less tested than Knowledge and Data Cloud.

### Slide 6: Grounding Source Configuration in Agentforce Builder
**Visual:**
```
  Agentforce Builder — Knowledge Search Action Config

  ┌──────────────────────────────────────────────────────────────┐
  │  Grounding Source:  [ Einstein Knowledge ▼ ]                 │
  │  Search Scope:      [ Acme Corp Knowledge Base ▼ ]           │
  │  Article Types:     [ ✓ FAQ ] [ ✓ Policy ] [ How-To ]       │
  │  Min. Relevance:    [  0.6  ]     Max Articles: [  3  ]      │
  │                                                              │
  │  ┌──────────────────────────────────────────────────────┐   │
  │  │  TEST SEARCH PANEL                                   │   │
  │  │  Query: "electronics return policy"                  │   │
  │  │  ─────────────────────────────────────────────────   │   │
  │  │  ✓ Article: "Electronics Return Policy"  (0.87)     │   │
  │  │  ✓ Article: "General Return Guidelines"  (0.73)     │   │
  │  │  ✗ Article: "Shipping & Handling Policy" (0.41)     │   │
  │  │     (below threshold — not returned)                │   │
  │  └──────────────────────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────────────┘

  Always test your grounding configuration before activating:
  run your top 10 common customer questions and verify right
  articles are returned for each
```
**Content:**
- Add a Knowledge Search Action to a Topic from Agentforce Builder
- **Grounding Source** dropdown: Einstein Knowledge, Data Cloud, File Search, External
- **Minimum Relevance Score** — threshold for article inclusion (0.0–1.0); typical starting point: 0.5–0.6
  - Too high (>0.8): returns few or no results, agent says "I don't know"
  - Too low (<0.3): returns irrelevant articles, agent synthesizes incorrect answers
- **Maximum Articles Returned** — 3 is a common starting point; each additional article adds tokens to the context
- **Test your grounding** using the Builder's test panel before activating — search for your top 10 common customer questions and verify the right articles are returned
- An agent Topic can have **one grounding action + other actions** — grounding does not replace other actions, it works alongside them
**Speaker Notes:** The minimum relevance score is a tuning parameter that you will likely need to adjust after initial deployment. Start at 0.5-0.6, run your test queries, and observe: are the right articles being returned? If the agent says it cannot find information on topics you know are in your knowledge base, the score may be too high. If it is returning articles about completely different topics, the score may be too low. This is an empirical setting — test with real customer queries rather than trying to derive the right number theoretically.

### Slide 7: Article Quality Best Practices for Grounding
**Visual:**
```
  POOR ARTICLE FOR GROUNDING  ✗       WELL-STRUCTURED ARTICLE  ✓
  ──────────────────────────────       ──────────────────────────────────
  Title: "Policy Document Q3-2024"    Title: "Electronics Return Policy"
  ─────────────────────────────────   ──────────────────────────────────
  Section 4.3 subsection B...         Summary: Electronics purchased from
  "In accordance with the terms       Acme may be returned within 30 days.
  and conditions set forth by
  the consumer protection act,        Key facts:
  products which fall under the       • 30-day return window
  category of electronic devices      • Original packaging required
  including but not limited to..."    • Receipt or order number required
                                      • Damaged items: contact support
  ✗ Title not customer-facing
  ✗ Dense legalese paragraphs         FAQ:
  ✗ Multiple topics mixed in          Q: Can I return opened electronics?
  ✗ No clear structure                A: Yes, within 30 days with receipt.
  ✗ Passive voice, hedging language
                                      ✓ Title matches customer vocabulary
                                      ✓ Clear factual summary
                                      ✓ One topic per article
                                      ✓ Bullet points with key facts
                                      ✓ FAQ section
```
**Content:**
- **Article title** should match customer-facing vocabulary — "Electronics Return Policy" not "Policy Doc Section 4.3.B"
- **One article, one topic** — do not combine multiple policies in one article; semantic search retrieves the whole article, not just the relevant section
- **Factual, concise language** — state facts clearly; avoid hedging language ("this may or may not apply...") that confuses the synthesized response
- **Regular review and updates** — outdated Knowledge articles are a significant grounding risk; establish a review cadence
- **Active status is required** — only Published articles are searched; Draft articles are invisible to the agent
- **Summary field** — if your article type has a Summary field, fill it in — semantic search may weight this field more heavily than body text
**Speaker Notes:** Article quality is often overlooked in Agentforce planning because it seems like a content management concern rather than an AI concern. But article quality directly determines grounding quality, which determines agent response quality. The most common production issue with grounded agents is outdated or poorly structured Knowledge articles producing incorrect synthesized responses. Establishing an article review process as part of the Agentforce deployment plan is a professional recommendation worth making to every client. For the exam, if a question presents an agent returning outdated information even though grounding is configured, the answer is likely that the Knowledge articles have not been updated.

### Slide 8: Grounding Architecture — Summary
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │                    EINSTEIN TRUST LAYER                          │
  │  ┌────────────────────────────────────────────────────────────┐  │
  │  │            AGENTFORCE AGENT (Atlas Reasoning Engine)       │  │
  │  │                                                            │  │
  │  │    ◀──────────────────────────────────────────────────     │  │
  │  │    │                                                        │  │
  │  └────┼────────────────────────────────────────────────────┘  │  │
  │       │                                                         │  │
  │  ┌────┴─────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────┐│  │
  │  │ Einstein     │ │  Data Cloud  │ │ File Search  │ │Extern.││  │
  │  │ Knowledge    │ │ Vector Search│ │ (documents)  │ │Grndng.││  │
  │  │              │ │              │ │              │ │       ││  │
  │  │ Static FAQ,  │ │ Personalized │ │ PDFs, Word   │ │Non-SF ││  │
  │  │ policies,    │ │ real-time    │ │ docs, text   │ │systems││  │
  │  │ how-to guides│ │ customer data│ │ files        │ │       ││  │
  │  │              │ │              │ │              │ │       ││  │
  │  │ Low setup    │ │ High setup   │ │ Medium setup │ │ High  ││  │
  │  └──────────────┘ └──────────────┘ └──────────────┘ └───────┘│  │
  └──────────────────────────────────────────────────────────────────┘

  Always use ≥1 grounding source for agents answering factual questions
  Sources can be combined: Knowledge (policies) + Data Cloud (personal data)
```
**Content:**
| Source | Best For | Setup Complexity |
|--------|----------|-----------------|
| Einstein Knowledge | Static policies, FAQ, how-to articles | Low |
| Data Cloud | Personalized customer data, real-time records | High |
| File Search | Document-heavy knowledge, PDFs, procedures | Medium |
| External Grounding | Non-Salesforce knowledge systems | High |

- **Always use at least one grounding source** for agents that answer factual questions — ungrounded agents hallucinate
- **Grounding sources can be combined** — an agent can have both Knowledge (for policies) and Data Cloud (for personalized account data) grounding in different Actions
- **Grounding does not eliminate hallucination** entirely but dramatically reduces it — the LLM still synthesizes language, but from verified source material
- **Monitor grounding effectiveness** post-deployment — track when the agent says "I don't know" (no grounding match) vs. when it gives wrong information (poor grounding quality)
**Speaker Notes:** The monitoring point on this slide is the practical maturity step beyond initial deployment. Once you have deployed an agent, you want to track two failure modes: "I don't know" responses (often indicating a gap in your Knowledge base or too-high relevance threshold) and wrong-answer responses (often indicating outdated or poorly structured articles). Both have different remediation paths. We will cover monitoring in Lecture 13, but start thinking about grounding health as an ongoing operational concern, not a one-time configuration.

## Recording Script
In this lecture we tackle the most important reliability concern for any Agentforce deployment: grounding. When an agent answers questions from its training data alone — what AI engineers call its parametric knowledge — it will hallucinate. It will state incorrect policy details, wrong prices, and non-existent features with complete confidence. Grounding is the solution.

Grounding works through a pattern called Retrieval-Augmented Generation, or RAG. When a customer asks a question, the agent does not just ask the LLM for an answer. It first retrieves relevant content from a verified source — a Knowledge article, a customer record, a document — and then generates a response based on that content. The LLM is answering from your verified source material, not from its training data. That is the difference between reliable and unreliable.

Salesforce provides four grounding source types. Einstein Knowledge is the most common — it uses your existing Salesforce Knowledge articles with semantic search. Data Cloud grounding uses the unified customer profile for personalized answers — if a customer asks about their specific account, Data Cloud grounding can retrieve their exact data. File Search works with documents like PDFs and Word files stored in Salesforce Content. External Grounding connects to knowledge systems outside Salesforce.

The configuration basics for Knowledge Search actions: minimum relevance score (0.5-0.6 is a good starting point, not too strict), maximum articles returned (3 is common), and article types to include. Always test with your actual common customer questions before going live — verify that the right articles come back for each query.

Article quality matters enormously. Outdated articles produce outdated answers. Poorly structured articles produce confused synthesized responses. One topic per article. Clear, factual language. Title that matches how customers phrase the question. Keep articles current.

Grounding does not eliminate hallucination completely, but it dramatically reduces it. Use grounding for every agent that answers factual questions.

## Exam Tips
- RAG = Retrieve (semantic search over knowledge source) + Augment (add retrieved content to context) + Generate (LLM responds from that content, not from training data) — this is how grounding works in Agentforce
- Einstein Knowledge grounding requires: Knowledge enabled, at least one Published (Active) article, Knowledge Search Action configured in the Topic
- Data Cloud grounding is for personalized, real-time customer data; Einstein Knowledge is for general static content that applies to all customers
- Minimum Relevance Score: too high → agent finds no articles and says "I don't know"; too low → agent retrieves irrelevant articles and may synthesize incorrect answers
- Grounding reduces hallucination; it does not eliminate it — the LLM still synthesizes language from retrieved content, so article quality directly affects response accuracy

## Lecture Summary
Grounding prevents hallucination by providing the LLM with verified, current information at inference time — the agent answers from source material rather than training data. Agentforce implements grounding through Retrieval-Augmented Generation (RAG): retrieve relevant content via semantic search, augment the prompt context with that content, generate a response based on the retrieved material. Four grounding sources are available: Einstein Knowledge (static policies and FAQ, lowest setup complexity), Data Cloud (personalized real-time customer data, highest setup complexity), File Search (documents and PDFs), and External Grounding (non-Salesforce knowledge systems). Key Knowledge Search configuration options are minimum relevance score (0.5–0.6 recommended starting point) and maximum articles returned. Article quality directly affects grounding effectiveness: use single-topic articles, factual language, customer-vocabulary titles, and maintain published status. Every agent answering factual questions should use at least one grounding source.

## Mini Quiz

**Q1:** A Service Agent is answering customer questions about the company's return policy. Despite having multiple return policy articles published in Salesforce Knowledge, the agent consistently responds "I don't have information about that topic." What is the most likely cause?
A) Knowledge grounding is not supported for the Service Agent template
B) The Minimum Relevance Score is configured too high, so no articles meet the threshold and are returned
C) The Knowledge articles are not indexed because they were created more than 90 days ago
D) The agent needs a Prompt Template Action instead of a Knowledge Search Action for policy questions
**Answer:** B — When the Minimum Relevance Score is set too high, no articles meet the threshold and the Knowledge Search Action returns empty results. Atlas observes no matching content and responds that it cannot find information. The fix is to lower the Minimum Relevance Score (try 0.5–0.6) and retest. Knowledge articles do not expire based on age — the Published status is all that matters. Knowledge Search Actions are the correct action type for this use case.

**Q2:** A customer asks the Agentforce agent: "Am I eligible for the loyalty double-points promotion running this month?" The answer depends on the customer's current tier, purchase history, and the specific promotion rules — all of which are stored in different systems unified in Data Cloud. Which grounding source should the developer configure?
A) Einstein Knowledge — create an article explaining the promotion eligibility rules
B) Data Cloud grounding — to access the customer's unified profile including tier, purchase history, and promotion eligibility
C) File Search — upload the promotion terms and conditions PDF
D) External Grounding — the promotion engine is external to Salesforce
**Answer:** B — This scenario requires personalized, real-time data specific to this customer — their tier level, purchase history, and eligibility. This is exactly what Data Cloud grounding provides: semantic search over unified customer profile data. An Einstein Knowledge article about general promotion rules would not be personalized to this customer's specific eligibility. File Search would give general rules but not personalized eligibility. Data Cloud grounding accesses the right data.

**Q3:** Which of the following best describes how Retrieval-Augmented Generation (RAG) improves an Agentforce agent's response accuracy compared to an ungrounded agent?
A) RAG trains the LLM on company-specific data so it learns accurate answers permanently
B) RAG adds verified source content to the LLM's context at inference time, so the model generates responses based on retrieved material rather than potentially incorrect training data
C) RAG replaces the LLM with a rule-based retrieval engine that returns verbatim article content
D) RAG increases the LLM model size, giving it more capacity to store accurate information
**Answer:** B — RAG works at inference time (when the agent is actually responding to a query), not at training time. It retrieves relevant content from a knowledge source and includes it in the LLM's context window so the model can generate an answer based on that specific, verified content. The model still synthesizes the language — it does not return verbatim article content. This approach works without retraining the model, which is why it can use always-current Knowledge articles rather than stale training data.
