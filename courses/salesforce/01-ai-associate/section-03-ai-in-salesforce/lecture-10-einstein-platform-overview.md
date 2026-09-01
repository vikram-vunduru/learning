# Lecture 10: Einstein Platform Overview
**Section:** Section 3 — AI in Salesforce  
**Duration:** 15 minutes  
**Exam Weight:** ~8% of exam (Einstein features and types appear heavily)

---

## Learning Objectives
1. Explain what the Einstein AI platform is and trace its evolution
2. Describe the Einstein 1 Platform architecture and how AI sits across Salesforce clouds
3. Distinguish between "Einstein" as a brand vs. specific named features
4. Identify the three types of Einstein AI: Predictive, Generative, and Agentic
5. Match specific Salesforce products to their AI type
6. Apply exam-tested knowledge about which Einstein feature does what

---

## SLIDES

### Slide 1: Title Slide
**Visual:** Einstein logo (the Einstein head icon Salesforce uses) against a dark background. The word "Einstein" with a subtle gradient. Subtitle: "Salesforce's AI Platform — From 2016 to Today."
**Content:**
- Einstein AI Platform Overview
- How AI powers every Salesforce cloud
- What the exam really tests about Einstein

**Speaker Notes:** Open by asking students: "Before we start — how many of you have heard the name 'Einstein' thrown around in Salesforce conversations but weren't exactly sure what it meant?" Pause. "That confusion is real and it's actually a trap on the exam. By the end of this lecture, Einstein will be crystal clear."

---

### Slide 2: A Brief History — Einstein's Origin Story
**Visual:**
```
   SALESFORCE EINSTEIN — EVOLUTION TIMELINE

   2016           2019           2021           2023           2024+
    │              │              │              │              │
    ▼              ▼              ▼              ▼              ▼
  [Einstein       [Einstein      [Einstein      [Einstein      [Agentforce  ]
   Platform       Automate]       GPT]           Copilot]       AI Agents   ]
   launched]      Prediction     Generative     Conversational  Autonomous  ]
                  Builder,       AI features    AI assistant    reasoning   ]
                  Lead Score     Launch         (ChatGPT-style) Atlas engine]

   ─────────────────────────────────────────────────────────────────────────▶
   Predictive AI ────────────────────────────────────────▶ Generative & Agentic AI
```
**Content:**
- **2016:** Salesforce introduces "Einstein" at Dreamforce — AI built into the CRM
- **2019:** Einstein Voice and Einstein Analytics expand the brand
- **2021:** Einstein Automate brings AI to workflows
- **2023:** Einstein GPT launched — Salesforce enters generative AI
- **2024:** Einstein Copilot → rebranded/evolved into **Agentforce**
- **2025+:** Einstein 1 Platform — unified AI+Data+CRM

**Speaker Notes:** "Here's the history lesson that will save you on the exam. When Salesforce says 'Einstein,' they're using it as a brand umbrella — kind of like how Apple calls everything 'Apple Intelligence' now. In 2016, Einstein was purely about predictions — will this lead convert? Will this customer churn? But then generative AI exploded, and Salesforce had to expand the Einstein brand to cover chatbots, email drafting, and conversational agents. That's where Einstein Copilot came in. And then in 2024, they rebranded the whole assistant layer as Agentforce. So when you see 'Einstein' on the exam, your first question should be: which Einstein? What TYPE of AI?"

---

### Slide 3: The Einstein 1 Platform Architecture
**Visual:**
```
   EINSTEIN PLATFORM — LAYERED ARCHITECTURE

   ┌─────────────────────────────────────────────────────────────┐
   │                    APPLICATIONS LAYER                       │
   │    Sales Cloud ● Service Cloud ● Marketing Cloud ●         │
   │    Commerce Cloud ● Slack ● Field Service                   │
   ├─────────────────────────────────────────────────────────────┤
   │                   AI FEATURES LAYER                         │
   │   Einstein Copilot ● Agentforce ● Prompt Builder            │
   │   Lead Scoring ● Opp Scoring ● Next Best Action             │
   ├─────────────────────────────────────────────────────────────┤
   │                  TRUST & SAFETY LAYER                       │
   │          Einstein Trust Layer (ZDR, Grounding,              │
   │          Data Masking, Toxicity, Audit Trail)               │
   ├─────────────────────────────────────────────────────────────┤
   │                    DATA LAYER                               │
   │       Salesforce Data Cloud (Unified Customer Profile,      │
   │       Identity Resolution, Calculated Insights)             │
   ├─────────────────────────────────────────────────────────────┤
   │                 FOUNDATION MODEL LAYER                      │
   │     Salesforce xGen ● OpenAI ● Anthropic ● Google ● Cohere │
   └─────────────────────────────────────────────────────────────┘
```
**Content:**
- **Foundation:** Salesforce Data Cloud unifies all customer data
- **AI Layer:** Einstein sits in the middle — trained on your unified data
- **Application Layer:** Each cloud gets AI capabilities powered by Einstein
- The same underlying AI layer serves EVERY cloud
- "One Einstein, many expressions"

**Speaker Notes:** "Think of the Einstein 1 Platform like a power grid for a city. The power plant at the bottom is Data Cloud — it's generating electricity from all your customer data. Einstein is the grid itself — it distributes intelligence to every part of the city. Sales Cloud gets its lights, Service Cloud gets its lights, Marketing Cloud gets its lights. They all pull from the same power source. This is why Salesforce is so aggressive about the Einstein brand — it literally IS the AI layer powering everything. On the exam, when they ask 'where does Einstein get its data?' — the answer is Data Cloud."

---

### Slide 4: Einstein the Brand vs. Einstein Features
**Visual:**
```
   EINSTEIN BRANDING vs. FEATURES — What's the Difference?

   ┌──────────────────────────────┬──────────────────────────────┐
   │      EINSTEIN BRAND          │    UNDERLYING AI FEATURES    │
   ├──────────────────────────────┼──────────────────────────────┤
   │ "Einstein" = Salesforce's    │ Lead Scoring (predictive ML) │
   │ AI brand name across all     │ Opportunity Scoring          │
   │ products                     │ Case Classification          │
   │                              │ Forecasting                  │
   │ Like "Siri" is Apple's AI    │ Prediction Builder (custom)  │
   │ brand for many features      │ Next Best Action             │
   │                              │ Prompt Builder (gen AI)      │
   │ The brand ≠ one feature      │ Einstein Copilot             │
   │ The brand = many features    │ Agentforce (autonomous)      │
   └──────────────────────────────┴──────────────────────────────┘
```
**Content:**
**Einstein (the brand/platform):** The overarching AI capability in Salesforce

**Specific Named Features:**
- Einstein Lead Scoring
- Einstein Opportunity Scoring
- Einstein Case Classification
- Einstein Next Best Action
- Einstein Copilot / Agentforce
- Einstein Prediction Builder
- Einstein Prompt Builder

**Speaker Notes:** "This is the most common source of exam confusion. Students see 'Einstein' and think it's one thing. It's not. It's like asking 'what does Google do?' — Google makes Search, Gmail, Maps, Docs. Same idea. Einstein is the parent brand. Under it, you have dozens of specific features. The exam will say something like: 'A sales manager wants to automatically score leads based on historical conversion data. Which Einstein feature should they use?' The answer isn't just 'Einstein' — it's Einstein Lead Scoring specifically. You need to know the names."

---

### Slide 5: The Three Types of Einstein AI
**Visual:**
```
   EINSTEIN PLATFORM — THREE AI CAPABILITY PILLARS

   ┌──────────────────┬──────────────────┬──────────────────┐
   │  PREDICTIVE AI   │  GENERATIVE AI   │  AGENTIC AI      │
   ├──────────────────┼──────────────────┼──────────────────┤
   │ What will happen?│ Create content   │ Take autonomous  │
   │                  │                  │ actions          │
   ├──────────────────┼──────────────────┼──────────────────┤
   │ Lead Scoring     │ Prompt Builder   │ Agentforce       │
   │ Opp Scoring      │ Sales Emails     │ Service Agent    │
   │ Case Classif.    │ Case Summaries   │ SDR Agent        │
   │ Forecasting      │ Einstein Copilot │ Sales Coach      │
   │ Prediction Bldr  │ Article Gen.     │ Atlas Reasoning  │
   ├──────────────────┼──────────────────┼──────────────────┤
   │ ML / statistical │ LLMs + Prompts   │ LLM + Tools +    │
   │ models           │                  │ Planning loops   │
   └──────────────────┴──────────────────┴──────────────────┘
```
**Content:**
**Predictive AI:** Uses historical data to forecast future outcomes
- Example: "This lead has a 78% chance of converting"

**Generative AI:** Creates new content (text, images, code) from context
- Example: "Draft a follow-up email for this opportunity"

**Agentic AI:** Takes autonomous actions on your behalf across multiple steps
- Example: "Research this prospect, draft the email, and schedule a meeting"

**Speaker Notes:** "These three types are the backbone of everything Einstein does. Let me give you a real-world analogy for each. Predictive AI is like a weather forecast — it looks at patterns in past data to tell you what's likely to happen next. It never creates anything new; it analyzes. Generative AI is like a creative writing assistant — you give it context and it produces new content: emails, summaries, responses. It creates. Agentic AI is the newest and most powerful — it doesn't just predict or create, it ACTS. It can open records, search the web, run workflows, and complete multi-step tasks. Think of it as going from a calculator to a personal assistant to a fully autonomous employee."

---

### Slide 6: Predictive AI — Deep Dive
**Visual:** Screenshot mockup of a Salesforce Lead record showing an "Einstein Score" widget — 78% conversion likelihood with three driving factors listed (title match, recent activity, company size).
**Content:**
**What it does:** Analyzes patterns in your historical CRM data to predict future outcomes

**Einstein Predictive Features:**
- Einstein Lead Scoring — likelihood to convert
- Einstein Opportunity Scoring — likelihood to close
- Einstein Case Classification — auto-assigns case fields
- Einstein Chatter Sentiment — mood/tone of Chatter posts
- Einstein Prediction Builder — custom predictions you build yourself

**How it works:** Model trains on YOUR org's historical data → learns patterns → scores new records

**Speaker Notes:** "Here's something important to understand about predictive AI in Salesforce: it's not using generic AI training data. Einstein Lead Scoring doesn't use Amazon's customer data or some generic dataset. It trains specifically on YOUR Salesforce org's historical lead data. If your org has converted 10,000 leads over the last three years, Einstein Lead Scoring learns the patterns from those 10,000 leads. That's why it gets better over time — the more data you have, the smarter it gets. The exam loves testing this — if asked 'what data does Einstein Lead Scoring use to train?' — your answer is your org's historical conversion data."

---

### Slide 7: Generative AI — Deep Dive
**Visual:** Split screenshot — left side shows a Salesforce case record, right side shows Einstein generating a case summary with a "Draft with Einstein" button highlighted.
**Content:**
**What it does:** Creates new text, summaries, emails, and responses based on CRM context

**Einstein Generative Features:**
- Einstein for Sales — email drafting, call summaries
- Einstein for Service — case summaries, reply recommendations
- Einstein Copilot / Agentforce — conversational assistant
- Prompt Builder — custom generative prompts you configure
- Einstein GPT (original branding, now absorbed into above)

**Powered by:** LLMs (Large Language Models) via Salesforce's Trust Layer
**Key distinction from Predictive:** Generates NEW content vs. scores/classifies existing records

**Speaker Notes:** "Generative AI in Salesforce is where the excitement has been for the last two years. This is the 'ChatGPT moment' for CRM. Imagine you're a service agent and a customer just submitted a complex case about their enterprise software integration failing. Instead of reading through 47 case notes, Einstein can read all of them and generate a two-paragraph summary: 'Customer has been experiencing API timeout errors since upgrading to version 3.2 on January 10th. Three previous agents attempted resolutions X, Y, Z. Issue persists.' That summary — which would have taken an agent three minutes to manually compile — appears in three seconds. That's generative AI in action."

---

### Slide 8: Agentic AI — Deep Dive
**Visual:** Flowchart showing an autonomous agent completing a multi-step task: User prompt → Agent reasons → Agent searches web → Agent queries CRM → Agent drafts email → Agent schedules meeting → User reviews → Done.
**Content:**
**What it does:** Autonomously completes multi-step tasks using reasoning + tools

**Agentforce agents (examples):**
- Sales Development Rep (SDR) Agent — researches prospects, sends outreach
- Service Agent — resolves customer issues end-to-end
- Sales Coach Agent — analyzes deals, gives coaching advice

**Key capabilities:**
- Reasons across multiple steps (Atlas Reasoning Engine)
- Can access CRM records, web, APIs, flows
- Hands off to humans when needed
- Works autonomously 24/7

**Speaker Notes:** "Agentic AI is the biggest leap forward. Predictive AI tells you what will happen. Generative AI creates content for you to review. Agentic AI actually DOES things. And this is genuinely new territory for Salesforce and the industry. Before Agentforce, every AI feature still required a human to take action. Einstein could say 'this lead is 85% likely to convert' but a human still had to write the email and send it. With agentic AI, you can set up an agent that says: when a lead score crosses 80%, research the company on LinkedIn, check our CRM history, draft a personalized outreach email, and send it — all without a human clicking anything. That's a fundamental shift in what software can do."

---

### Slide 9: Which Products Use Which Type — Reference Table
**Visual:**
```
   EINSTEIN PRODUCTS — QUICK REFERENCE MAP

   ┌────────────────────┬──────────────────────┬────────────────────────┐
   │  PRODUCT           │  AI TYPE             │  PRIMARY USE CASE      │
   ├────────────────────┼──────────────────────┼────────────────────────┤
   │ Lead Scoring       │ Predictive           │ Sales prioritization   │
   │ Opp Scoring        │ Predictive           │ Pipeline management    │
   │ Forecasting        │ Predictive           │ Revenue prediction     │
   │ Case Classification│ Predictive           │ Service routing        │
   │ Prediction Builder │ Predictive (custom)  │ Any custom prediction  │
   │ Next Best Action   │ Predictive + Rules   │ Rep recommendations    │
   │ Prompt Builder     │ Generative           │ Content generation     │
   │ Einstein Copilot   │ Generative           │ Conversational AI      │
   │ Agentforce         │ Agentic              │ Autonomous AI agents   │
   └────────────────────┴──────────────────────┴────────────────────────┘
```

**Content:**

| Einstein Feature | AI Type | What It Does |
|---|---|---|
| Lead Scoring | Predictive | Scores leads by conversion likelihood |
| Opportunity Scoring | Predictive | Scores deals by close likelihood |
| Case Classification | Predictive | Auto-fills case fields |
| Prediction Builder | Predictive | Custom predictions on any object |
| Next Best Action | Predictive + Rules | Surfaces recommendations |
| Einstein for Sales (email drafting) | Generative | Drafts emails from CRM context |
| Case Summaries | Generative | Summarizes case history |
| Prompt Builder | Generative | Custom prompts using CRM data |
| Agentforce Service Agent | Agentic | Resolves service cases autonomously |
| Agentforce SDR Agent | Agentic | Prospecting and outreach autonomously |
| Einstein Copilot (the sidebar) | Agentic + Generative | Conversational AI assistant |

**Speaker Notes:** "Print this table. Screenshot it. Stick it on your wall. This table is the foundation of 30% of the exam. The most common trick the exam plays is giving you a scenario and asking which Einstein feature to use. You read the scenario, identify whether the need is prediction, creation, or autonomous action, and match to the right feature. Let me give you a practice scenario right now: 'A service manager wants to automatically assign priority and category fields on new cases based on the content of the case description.' Pause. What type of AI is that? That's classification — which is predictive. And which specific feature? Einstein Case Classification. See how the pattern works?"

---

### Slide 10: Exam Traps — What to Watch For
**Visual:** Red warning-style slide with three "trap" callouts.
**Content:**
**Trap 1:** "Einstein" is not one feature — always identify WHICH Einstein
**Trap 2:** Einstein Prediction Builder is NOT the same as Einstein Lead Scoring
- Lead Scoring is a pre-built, specific feature (for leads only)
- Prediction Builder is a no-code tool to build CUSTOM predictions on ANY object

**Trap 3:** Einstein Copilot and Agentforce are related but distinct
- Copilot = the conversational sidebar assistant
- Agentforce = the broader autonomous agent platform (Copilot is ONE expression of it)

**Trap 4:** Generative AI in Salesforce requires the Trust Layer (data masking/grounding) — it does NOT directly send your CRM data to OpenAI unprotected

**Speaker Notes:** "Let me hammer these four traps because they each appear on the exam regularly. Trap 1: never answer 'Einstein' when asked which feature to use. Always name the specific product. Trap 2: the difference between Lead Scoring and Prediction Builder is huge — Lead Scoring is pre-configured and works only on leads, Prediction Builder is flexible and you configure it yourself for any object. Trap 3: Agentforce is the platform, Einstein Copilot was the original conversational interface — Copilot is now part of Agentforce. And Trap 4 is about the Trust Layer — the exam WILL test whether you understand that Salesforce has a privacy layer protecting your data before it reaches any LLM. We cover the Trust Layer in depth in Section 2, but know that it exists and why it matters."

---

## RECORDING SCRIPT

[Engaging open — 0:00-1:30]

"Hey, welcome back. Before I even start this lecture, I want to tell you something that one of my students said to me after taking — and failing — the AI Associate exam on their first attempt. She said: 'I studied for two weeks, I felt confident, and then I got to the Einstein questions and I froze. Because I'd been treating Einstein as one thing when it's actually like thirty different things.' That observation, right there, is why this lecture exists.

Salesforce has done what every big tech company does when they have a platform play — they branded everything under one umbrella. 'Einstein.' And they use that word for lead scoring AND email drafting AND autonomous bots. If you treat those as the same thing on the exam, you will get questions wrong. So this lecture is about getting Einstein completely straight in your head.

Let's start with the history, because the history actually explains the confusion."

[History section — 1:30-4:00]

"It's 2016. Marc Benioff gets on the Dreamforce stage and announces 'Einstein' — Salesforce's AI. At the time, this means one thing: predictive analytics baked into the CRM. Lead scoring. Opportunity scoring. Things that had previously required data scientists and separate tools now built right into Sales Cloud.

Fast forward to 2023. ChatGPT has changed the world. Every tech company is scrambling to add generative AI to their products. Salesforce announces Einstein GPT — now Einstein covers not just predictions but AI-generated content. Emails, summaries, responses. The brand expands.

Then comes 2024. The concept of AI agents — software that doesn't just predict or generate, but actually TAKES ACTIONS — becomes the new frontier. Salesforce builds Agentforce. They integrate their Einstein Copilot conversational assistant into the Agentforce platform. And now Einstein covers predictions AND generation AND autonomous action.

So when the exam asks you about Einstein, it's testing something from a platform that has grown to cover three fundamentally different types of AI over eight years. That's why the detail matters."

[Three types deep dive — 4:00-8:30]

"Let me make these three AI types stick with an analogy I use with all my students.

Imagine you're trying to decide whether to invest in a company's stock.

Predictive AI is like a financial analyst who has studied a thousand past investments. They look at patterns — revenue growth, market conditions, team quality — and tell you: 'Based on historical data, companies like this have a 73% success rate at this stage.' They're not making anything new. They're recognizing patterns. That's Einstein Lead Scoring, Opportunity Scoring, Case Classification. Pattern recognition on historical data.

Generative AI is like a copywriter who takes that analyst's report and writes you a beautiful investor memo. They didn't do the analysis. But they took your context and created compelling new content from it. That's Einstein for Sales drafting your follow-up email. It takes your CRM data — the contact's name, the account history, the last meeting notes — and generates a personalized email you could never have written that fast yourself.

Agentic AI is like having a full associate who you hand the entire task to. You say: 'We're thinking about investing in this company. Handle it.' And they research the company, read the analyst report, talk to your legal team, draft the term sheet, and schedule the meeting — all while you're doing something else. That's Agentforce. Multi-step, autonomous, with judgment calls along the way.

Now, why does this matter for the exam? Because each type has completely different use cases, limitations, and appropriate scenarios. Predictive AI is appropriate when you have historical data and want to forecast. Generative AI is appropriate when you need to create content at scale. Agentic AI is appropriate when you have a multi-step business process that can be safely automated. The exam gives you scenarios and tests whether you can match the need to the type to the feature."

[Architecture section — 8:30-11:00]

"Let me talk about the platform architecture for a minute, because one exam question type loves to test: where does Einstein get its data?

The Einstein 1 Platform sits on top of Data Cloud. Think of Data Cloud as a giant unified customer profile system. It pulls data from your Sales Cloud, your Service Cloud, your Marketing Cloud, external systems — and creates one master record for each customer. Einstein then uses that unified data to make better predictions and generate more relevant content.

This is actually a big deal competitively for Salesforce. A lot of AI tools sit outside your CRM and don't know your customer history. Einstein is trained on your actual CRM data — your specific customers, your specific conversion patterns, your specific service history. That makes it more accurate than a generic AI for CRM-specific tasks.

The exam cares about this because it often asks questions about data quality and AI accuracy. The answer to 'why might Einstein Lead Scoring give poor predictions?' is almost always: insufficient or low-quality historical data in the org. If your org only has 50 leads ever, Einstein doesn't have enough to learn from. You need volume and data quality for predictive AI to work well."

[Feature differentiation — 11:00-14:00]

"The last thing I want to drill into you before we wrap is the difference between Einstein Prediction Builder and Einstein Lead Scoring. This is probably the most-tested specific distinction in this section.

Einstein Lead Scoring is a pre-built, out-of-the-box AI feature that Salesforce maintains. It works specifically on Leads. You turn it on, it looks at your historical lead data, and it starts scoring your current leads from 1 to 99. You didn't build the model. You didn't choose the features. Salesforce handles it. The tradeoff is: it's easy to set up but you can't customize what factors it uses to predict.

Einstein Prediction Builder is a no-code tool YOU use to build custom predictive AI models. You choose the object — could be Opportunities, Contacts, Cases, a custom object. You choose the outcome you want to predict — 'Will this opportunity close by quarter end?' or 'Will this customer renew their contract?' You configure the fields, train the model on your data, and activate it. It shows up as a custom field on the record.

The scenario question goes like this: 'A manufacturing company wants to predict which service contracts are most likely to be cancelled before renewal. Which Einstein tool should they use?' 

Lead Scoring is for leads. This is about contracts. So the answer is Prediction Builder — because you need a custom prediction on a non-standard use case.

Versus: 'A sales manager wants to prioritize which leads the team should call first based on likelihood to convert.' That's exactly what Lead Scoring was built for. Use Lead Scoring, not Prediction Builder.

Same underlying concept — predictive AI — but very different tools for very different situations."

[Closing — 14:00-15:00]

"Alright, let me bring this home. Einstein is Salesforce's AI brand that covers three types of AI: Predictive, Generative, and Agentic. Each type has specific features named after them. The exam tests your ability to match a business scenario to the right type and the right feature. Your job is to know: what does each feature do, what type of AI is it, and when would a business use it over the alternatives.

In the next lecture, we're going deep on Agentforce — which is the biggest, most exam-heavy topic in this entire section. That's where the really exciting stuff lives. Let's go."

---

## EXAM TIPS
- The exam NEVER asks "what is Einstein?" — it always asks about a SPECIFIC feature. Know the names.
- Predictive AI = historical data + pattern recognition. Generative AI = creates new content. Agentic AI = takes autonomous actions.
- Einstein Lead Scoring (pre-built, leads only) vs. Einstein Prediction Builder (custom, any object) is a guaranteed exam distinction.
- "Where does Einstein get data?" = Data Cloud / your org's historical CRM data — NOT generic internet data.
- The Trust Layer is the privacy layer that sits between Salesforce and any LLM. It masks/anonymizes data before the LLM sees it.
- Agentforce is the PLATFORM. Einstein Copilot is the conversational INTERFACE that runs on it. They are related but not identical.

---

## LECTURE SUMMARY
- Einstein is a brand umbrella covering many specific AI features, not a single product
- The Einstein 1 Platform uses Data Cloud as its data foundation, with AI running across all clouds
- Three types of Einstein AI: Predictive (forecasts from history), Generative (creates content), Agentic (takes actions)
- Key feature distinction: Einstein Lead Scoring (pre-built, leads) vs. Einstein Prediction Builder (custom, any object)
- The Trust Layer protects customer data when generative AI calls external LLMs
- Agentforce is the current evolution of autonomous AI in Salesforce (evolved from Einstein Copilot)

---

## MINI QUIZ

**Question 1:**
A Salesforce admin at a healthcare company wants to predict which patient support cases are likely to be escalated to a specialist. The company uses a custom object called "Support_Case__c" for their cases. Which Einstein feature should they use?

A) Einstein Case Classification  
B) Einstein Lead Scoring  
C) Einstein Prediction Builder  
D) Einstein Opportunity Scoring

**Answer: C — Einstein Prediction Builder**

*Explanation:* Einstein Case Classification works on the standard Case object and predicts field values (category, priority) — not escalation likelihood on a custom object. Einstein Lead Scoring only works on the Lead object. Einstein Prediction Builder is the no-code tool for creating custom predictions on any object, including custom objects like Support_Case__c. This is the correct tool for a custom prediction scenario on a non-standard object.

---

**Question 2:**
Which of the following BEST describes the relationship between Einstein and Data Cloud in the Einstein 1 Platform?

A) Data Cloud replaces Einstein for all AI functions  
B) Einstein trains on and accesses unified customer data stored in Data Cloud  
C) Data Cloud is only used by Marketing Cloud, not Einstein AI  
D) Einstein operates independently of Data Cloud using only real-time record data

**Answer: B — Einstein trains on and accesses unified customer data stored in Data Cloud**

*Explanation:* Data Cloud is the data foundation of the Einstein 1 Platform. It unifies customer data from all Salesforce clouds and external sources. Einstein AI uses this unified data for training predictive models and providing context for generative features. Option A is wrong — Data Cloud stores data, Einstein provides AI. Option C is wrong — Data Cloud is platform-wide. Option D is wrong — Einstein's accuracy depends heavily on historical data stored in Data Cloud.

---

**Question 3:**
A sales operations leader says: "We want Einstein to draft personalized follow-up emails after every sales call, pulling in the account history and recent activities." Which TYPE of Einstein AI is this describing?

A) Predictive AI  
B) Generative AI  
C) Agentic AI  
D) Analytical AI

**Answer: B — Generative AI**

*Explanation:* Drafting email content using CRM context (account history, activities) is a content creation task — the defining characteristic of Generative AI. Predictive AI would score likelihood of outcomes, not write emails. Agentic AI would autonomously SEND those emails as part of a multi-step task (which isn't described here — a human still reviews before sending). "Analytical AI" is not a Salesforce AI category. The key word is "draft" — creating new content from context = Generative AI.
