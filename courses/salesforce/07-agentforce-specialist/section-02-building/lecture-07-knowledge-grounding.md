# Knowledge and Grounding

## Exam Domain
Building Agentforce Agents — ~25% of exam weight

## Core Concepts

### Why Grounding Matters
An ungrounded Agentforce agent generates responses based only on the LLM's training data. The LLM doesn't know your return policy, your product specs, or your current pricing. Without grounding, the agent will:
- Hallucinate plausible-sounding but incorrect answers
- Give generic responses when customers need specific ones
- Cite outdated or irrelevant information

Grounding connects the agent to your actual data at inference time.

### The RAG Pattern
**RAG = Retrieve, Augment, Generate**

1. **Retrieve:** Agent sends a search query to a knowledge source (Knowledge base, Data Cloud, etc.) and gets back relevant content
2. **Augment:** Retrieved content is added to the prompt that goes to the LLM ("Here is relevant information: [retrieved content]. Now answer the user's question.")
3. **Generate:** LLM generates a response grounded in the retrieved content, not fabricated from training data

This is why grounding reduces hallucination: the LLM is answering based on retrieved facts, not generating from scratch.

### Four Grounding Sources
| Source | Best For | Notes |
|--------|---------|-------|
| **Einstein Knowledge** | Product docs, policies, FAQs, how-to articles | Most commonly used; add Knowledge Search Action to Topic |
| **Data Cloud** | Personalized customer data, 360° profile, segment data | Requires Data Cloud license; vector search |
| **File Search** | Uploaded files (PDFs, Word docs) | Good for reference documents not yet in Knowledge |
| **External Sources** | Third-party content APIs, website content | Requires custom integration via Apex |

### Einstein Knowledge Grounding Configuration
Add a **Knowledge Search Action** to a Topic. This is not automatic — you explicitly choose to add it.

Key configuration settings:
- **Relevance Score Threshold:** 0.5–0.6 recommended (lower = more articles returned, lower relevance; higher = fewer but more precise)
- **Max Articles Returned:** Typically 3–5; more articles increase context window pressure
- **Filter by Data Category:** Limit search to specific article categories (e.g., only "Returns Policy" category, not all Knowledge)

**Knowledge article quality checklist:**
- Title is a question or clear topic statement customers would search
- Article body is factual, specific, and current
- Articles are organized by data category for targeted grounding
- No duplicate content across articles (confuses retrieval ranking)
- No contradictory information between articles on same topic

### Data Cloud Grounding
Data Cloud enables **personalized grounding** — the agent can ground responses in data specific to that customer (their order history, their loyalty tier, their recent interactions, their preferences).

How it works:
1. Customer initiates conversation
2. Agent identifies customer (via authenticated session or verifies identity)
3. Data Cloud retrieves that customer's profile and relevant data
4. Profile data is added to prompt context ("This customer is a Gold tier member with 3 open orders...")
5. LLM generates a personalized response

Without Data Cloud: agent can only access data via Flow/Apex Actions. Data Cloud provides a richer, pre-assembled customer context.

### Choosing the Right Grounding Source
| If you need to... | Use |
|-------------------|-----|
| Answer questions about product features, policies, FAQs | Einstein Knowledge |
| Personalize responses with customer history/profile | Data Cloud |
| Make content from uploaded PDFs/documents searchable | File Search |
| Pull from an external content API | External (Apex custom) |
| Ground on Salesforce object data (specific record fields) | Flow/Apex Action (not grounding, but data retrieval) |

## PTA / SA Relevance

### Grounding Assessment in Discovery
During discovery, assess the customer's knowledge infrastructure:
1. **Is Einstein Knowledge already configured?** If yes, assess article quality and coverage. If poor quality, build in KB cleanup time.
2. **Is Data Cloud licensed?** Data Cloud grounding is a premium capability — verify it's in scope before designing architecture that depends on it.
3. **Are there policy/product documents in non-Salesforce systems?** File Search or external grounding may be needed.
4. **What percentage of inbound questions are factual queries?** High factual volume (>40%) = grounding is critical path, not optional.

A common discovery finding: customers have Einstein Knowledge enabled but with poor article quality (thin content, outdated, no data categories). Knowledge cleanup is a prerequisite for grounding to work well.

### Knowledge Base Maturity Assessment
| KB Maturity Level | Characteristics | Implication for Agentforce |
|-------------------|----------------|--------------------------|
| **Level 0 — None** | No Knowledge base; information is in email threads, wikis, agent heads | Build KB from scratch; 4–8 weeks; agent launch gated |
| **Level 1 — Basic** | Articles exist but thin, unorganized, inconsistent | Audit and restructure; 2–4 weeks KB work before grounding reliable |
| **Level 2 — Good** | Well-organized, current articles with data categories | Minimal work; configure grounding, set thresholds, test |
| **Level 3 — Excellent** | AI-optimized articles, regular review process, high coverage | Best grounding results; production-ready |

Most enterprise customers are at Level 1. Planning for KB work is often the difference between a successful Agentforce deployment and an agent that hallucinates confidently.

### Grounding + Data Cloud Enterprise Pattern
For large consumer businesses (retail, financial services, telco):
```
Customer identified in session
    ↓
Data Cloud retrieves customer 360° profile
    (purchase history, open cases, loyalty tier, churn risk score)
    ↓
Profile + conversation → Atlas reasoning context
    ↓
Agent can personalize: "I see you're a Gold member. Your recent order #44521 is expected to arrive Thursday."
Without Data Cloud: agent can only access data via explicit Flows (less seamless)
```

The Data Cloud grounding pattern is the "wow demo" for enterprise Agentforce — personalization without the agent having to call multiple Flows to assemble context.

### Relevance Threshold Tuning
The relevance score threshold is calibrated by testing:
- **Too low (< 0.4):** Returns too many marginally relevant articles; context window pressure; model may be confused by irrelevant content
- **Too high (> 0.7):** Returns nothing (threshold not met) even when relevant articles exist; agent falls back to LLM training data (hallucination risk)
- **Sweet spot (0.5–0.6):** Returns the most semantically relevant articles; usually 2–3 articles per search

Test by asking 20–30 typical customer questions and reviewing which articles are retrieved. Adjust threshold until precision and recall are both acceptable.

## Architecture

### RAG Pipeline in Detail
```
User Question: "What is your return policy for electronics?"
    │
    ▼
Atlas: Route to → Product Returns Topic → Knowledge Search Action
    │
    ▼
Knowledge Search Action
    │
    ▼ Search Query: "return policy electronics" (Atlas generates)
    │
    ▼ Einstein Knowledge Search (semantic vector search)
    │
    │  Article 1: "Electronics Return Policy" — score: 0.82 ✓
    │  Article 2: "General Return Guidelines" — score: 0.67 ✓
    │  Article 3: "Clothing Return Policy" — score: 0.31 ✗ (below threshold)
    │
    ▼ Retrieved articles (2 articles above threshold)
    │
    ▼ Augmentation: Assembled Prompt
    ┌────────────────────────────────────────────────────────────┐
    │ Instructions: [agent persona and rules]                    │
    │ Retrieved Knowledge:                                       │
    │   Article 1 content: "Electronics may be returned..."     │
    │   Article 2 content: "All returns must be initiated..."   │
    │ User Question: "What is your return policy for electronics?"|
    │ Generate a response based on the above information.       │
    └────────────────────────────────────────────────────────────┘
    │
    ▼ LLM generates grounded response (based on retrieved facts)
    │
    ▼ Trust Layer filtering
    │
    ▼ Agent response to user (cites policy accurately)
```

**Limitations:**
- Knowledge Search is a discrete Action call — each search adds one round trip latency
- Max articles returned is configurable but bounded — very broad questions may not retrieve all relevant articles
- Semantic search works best on article content; very short, thin articles return poor results
- Data categories filter search scope — if article is in wrong category, it may not be retrieved
- Einstein Knowledge requires standard Knowledge object (Articles) — custom objects aren't directly searchable

### Data Cloud Grounding Pipeline
```
Authenticated Session
    │
    ▼ Customer Identity (e.g., Contact ID from session)
    │
    ▼ Data Cloud Vector Search
    │   Query: customer profile + conversation context
    │   Result: unified customer record with relevant attributes
    │
    ▼ Context Assembly
    │  ┌─────────────────────────────────────────────────────┐
    │  │ Customer: Sarah Johnson, Gold Member (5 years)      │
    │  │ Recent Orders: #44521 (in transit), #44300 (closed) │
    │  │ Open Cases: 1 billing dispute (Case #8831)          │
    │  │ Churn Risk Score: 0.12 (low)                        │
    │  └─────────────────────────────────────────────────────┘
    │
    ▼ Atlas uses this context for personalized reasoning
    │
    ▼ Response: "Hi Sarah! I see your order #44521 is on its way..."
```

**Limitations:**
- Data Cloud license required separately — not included in base Agentforce license
- Data Cloud grounding requires data model design work — profiles need to be properly unified
- Vector search in Data Cloud has indexing latency — data changes take time to be searchable
- PII in Data Cloud profile data passes through Trust Layer data masking before going to LLM

### Grounding Source Comparison
```
                  Einstein     Data        File        External
                  Knowledge    Cloud       Search      Sources
                  ──────────────────────────────────────────────
Content type:     Articles     CRM/DC      Files       API content
                               profiles    (PDF, etc.)

Best for:         FAQs,        Customer    Reference   Third-party
                  policies,    360°        docs        content
                  how-tos      profiles

Personalized:     No           Yes         No          Depends

License needed:   Knowledge    Data Cloud  Included    Apex custom
                  enabled      license     (limits)    code

Setup effort:     Low          Medium-High Low         High
```

## Key Facts to Memorize
- RAG pattern: **Retrieve → Augment → Generate**
- Four grounding sources: Einstein Knowledge, Data Cloud, File Search, External
- Knowledge Search Action: add to Topic; NOT automatic
- Relevance threshold: 0.5–0.6 recommended range
- Max articles typically 3–5 (configurable)
- Data Cloud grounding = personalized responses; requires Data Cloud license
- Grounding reduces hallucination by giving LLM retrieved facts to base response on
- Knowledge article quality directly determines grounding quality

## Customer Advisory Tips
- **KB quality is non-negotiable:** Budget time to audit and clean up Knowledge articles before turning on grounding. A grounded agent built on poor knowledge is worse than no grounding — it hallucinates with false confidence.
- **Start with Einstein Knowledge grounding:** It's the fastest to set up and addresses the most common gap (factual questions). Add Data Cloud grounding in phase 2 once the base agent is proven.
- **Create a "golden test set" for grounding:** Define 50 questions that the agent must answer correctly. Test grounding quality against this set before go-live. A grounded agent should get 90%+ of these right.
- **Category-based filtering:** Use Knowledge data categories to scope grounding to relevant articles per Topic. An Order Management Topic should only search the "Order and Shipping" category, not all Knowledge.

## Exam Traps
- Thinking grounding is automatic — you must explicitly add a Knowledge Search Action to each Topic that needs it
- Thinking Data Cloud grounding is included in the base Agentforce license — it requires a Data Cloud license
- Setting relevance threshold too high (0.8+) and wondering why no articles are returned
- Thinking File Search is the same as Knowledge Search — they are separate grounding methods
- Confusing "grounding" with "action" — grounding provides context to the LLM; Actions perform operations

## Practice Questions
**Q:** An Agentforce Service Agent is answering product policy questions but giving incorrect information. The knowledge base has accurate articles. What is most likely wrong?
**A:** A Knowledge Search Action hasn't been added to the relevant Topic (or the relevance threshold is set too high). Without a Knowledge Search Action, Atlas is not retrieving articles — it's generating from LLM training data.

**Q:** A customer wants agent responses personalized to each user's purchase history, loyalty status, and open cases. What grounding source enables this?
**A:** Data Cloud grounding — it enables retrieval of customer 360° profile data including purchase history, loyalty tier, and CRM data to personalize agent responses in real time.

**Q:** What does RAG stand for and what does each letter represent in Agentforce context?
**A:** Retrieve (search knowledge source for relevant content), Augment (add retrieved content to the LLM prompt), Generate (LLM generates a response grounded in the retrieved facts rather than from training data).

**Q:** A developer sets the Knowledge Search relevance threshold to 0.9. During testing, the agent almost never retrieves articles. What should be done?
**A:** Lower the threshold to 0.5–0.6. A 0.9 threshold is too strict and prevents articles from being returned even when they are relevant. The 0.5–0.6 range is the recommended setting for most implementations.
