# Lecture 6: Prompt Engineering
**Section:** Section 02 — Generative AI
**Duration:** 18 minutes
**Exam Weight:** Generative AI ~17% of exam; Prompt Engineering and Prompt Builder are among the most-tested practical topics

---

## Learning Objectives
By the end of this lecture, students will be able to:
1. Define what a prompt is and why prompt quality dramatically affects LLM output quality
2. Identify and apply the five components of a well-structured prompt: Role, Context, Instruction, Format, and Constraints
3. Distinguish between zero-shot, few-shot, and chain-of-thought prompting techniques
4. Read through live demo examples showing how prompt iteration improves results
5. Explain how Salesforce Prompt Builder uses prompt engineering concepts to deliver AI at scale

---

## SLIDES

### Slide 1: The Input Determines the Output
**Visual:** Two side-by-side outputs — a vague prompt producing a generic, unhelpful response vs. a structured prompt producing a precise, useful response
**Content:**
- An LLM is only as good as the instructions you give it
- Garbage in, garbage out — but also: precision in, precision out
- Prompt Engineering = the skill of crafting instructions that get excellent LLM outputs
- This is not optional knowledge — it's how Salesforce's AI features are built
**Speaker Notes:** Here's the uncomfortable truth about AI: most people get mediocre results not because the AI is weak, but because their prompts are weak. Prompt Engineering is the discipline of crafting your instructions to an LLM so precisely that you consistently get excellent, useful, and accurate outputs. It's part writing, part logic, part design. And it's directly baked into how Salesforce Prompt Builder works.

---

### Slide 2: What Is a Prompt?
**Visual:** A user typing into a chat box with an arrow going to an LLM which produces a response
**Content:**
- A **prompt** is the complete text input you send to an LLM
- It includes everything the model sees before generating a response
- Can be a single sentence OR a complex multi-paragraph instruction
- The prompt shapes the tone, format, focus, depth, and accuracy of the output
- In Salesforce, prompts are assembled programmatically from templates + CRM data
**Speaker Notes:** A prompt is simply the input you give to an LLM. It's the text the model reads before generating a response. It could be as simple as "What is Salesforce?" or as elaborate as a 500-word instruction that specifies the model's role, the context it should consider, the task it should complete, the format it should use, and the things it should never do. The more thoughtfully you construct that prompt, the better the output. In Salesforce, prompts don't always come from humans typing — Prompt Builder assembles prompts automatically by combining a template with live data pulled from CRM records.

---

### Slide 3: The Five Anatomy Components of a Great Prompt
**Visual:**
```
   PROMPT ANATOMY — Five Building Blocks

   ┌─────────────────────────────────────────────────────────┐
   │  R  ROLE        "You are a Salesforce sales expert..."  │
   │                  Sets AI persona and expertise level    │
   ├─────────────────────────────────────────────────────────┤
   │  C  CONTEXT     "This account has $2M ARR, 3 open       │
   │                  cases, and a renewal in 30 days..."    │
   │                  Provides background information         │
   ├─────────────────────────────────────────────────────────┤
   │  I  INSTRUCTIONS "Write a 3-sentence outreach email..." │
   │                  The actual task to perform             │
   ├─────────────────────────────────────────────────────────┤
   │  F  FORMAT      "Use bullet points. Max 150 words."     │
   │                  Structure and length requirements      │
   ├─────────────────────────────────────────────────────────┤
   │  C  CONSTRAINTS "Do not mention pricing. Avoid jargon." │
   │                  Boundaries and guardrails              │
   └─────────────────────────────────────────────────────────┘
```
**Content:**
1. **Role** — Tell the model who it is
2. **Context** — Give it relevant background information
3. **Instruction** — Tell it exactly what to do
4. **Format** — Specify how the output should look
5. **Constraints** — Tell it what NOT to do or what limits to observe
**Speaker Notes:** The best prompts aren't random — they follow a structure. I call it the RCIFC framework: Role, Context, Instruction, Format, Constraints. Not every prompt needs all five components, but the more complex the task, the more important each one becomes. Let's walk through each.

---

### Slide 4: Component 1 — Role
**Visual:** Theater stage with an actor stepping into a spotlight labeled "You are a..."
**Content:**
- Tell the LLM what persona to adopt
- "You are an experienced Salesforce Sales Cloud consultant..."
- "You are a friendly customer support agent for Acme Corp..."
- "You are a concise technical writer..."
- The role sets the model's expertise level, tone, and perspective
- Without a role, the model defaults to a generic assistant
**Speaker Notes:** The first component is Role. When you give an LLM a role to play, it dramatically shifts how it responds. "You are an experienced Salesforce consultant with 10 years of Sales Cloud experience" tells the model to respond with domain expertise, use appropriate terminology, and think like a practitioner — not like Wikipedia. "You are a warm, empathetic customer service agent" sets a completely different tone than "You are a technical support engineer." Role is your single most powerful lever for shaping the overall quality and appropriateness of a response.

---

### Slide 5: Component 2 — Context
**Visual:** A document icon feeding information into the model, with arrows showing the model using it
**Content:**
- Provide the background information the model needs to do the task well
- What does the model need to know that it might not assume?
- In Salesforce: account details, case history, product info, customer tier
- Context = what + who + when + where
- The more relevant context you provide, the more tailored the output
**Speaker Notes:** Context is the background information that makes your instruction doable. If you ask someone to "write a follow-up email," they need to know who they're writing to, what the last interaction was about, what product is involved, what the relationship is. The same is true for an LLM. In Salesforce, Prompt Builder pulls context automatically from your CRM records — account name, industry, open opportunities, recent cases — so the LLM has the information it needs to produce something specific and useful, not generic.

---

### Slide 6: Component 3 — Instruction
**Visual:** A clear, bold action statement: "Write," "Summarize," "Classify," "List," "Identify"
**Content:**
- The specific task you want the model to complete
- Be precise: "Write a 3-sentence email" vs. "Write an email" (very different results)
- Use action verbs: summarize, compare, list, identify, draft, classify, explain
- Ambiguous instructions produce ambiguous outputs
- Specificity is the single biggest quality lever in any prompt
**Speaker Notes:** This is the heart of the prompt — the actual instruction. What do you want the model to do? The difference between "Write an email" and "Write a 3-sentence follow-up email to a prospect who attended our demo last week but hasn't responded in 5 days, encouraging them to schedule a 15-minute call" is enormous. The second version has precision. It tells the model the length, the context, the audience, the timing, and the goal. Precision is power in prompt engineering.

---

### Slide 7: Components 4 & 5 — Format and Constraints
**Visual:**
```
   FORMAT vs CONSTRAINTS — Key Distinction

   ┌──────────────────────────────┬──────────────────────────────┐
   │         FORMAT               │        CONSTRAINTS           │
   │   (How to structure output)  │   (What to avoid/limit)      │
   ├──────────────────────────────┼──────────────────────────────┤
   │ "Use 3 bullet points"        │ "Do not mention competitors" │
   │ "Write in JSON format"       │ "Avoid technical jargon"     │
   │ "Max 100 words"              │ "Do not make promises"       │
   │ "Use a table"                │ "Stay on topic of renewals"  │
   │ "Include a subject line"     │ "No pricing information"     │
   ├──────────────────────────────┼──────────────────────────────┤
   │ Shapes HOW the AI responds   │ Defines what AI must NOT do  │
   └──────────────────────────────┴──────────────────────────────┘
```
**Content:**
- **Format:** how should the response be structured?
  - "Respond in 3 bullet points"
  - "Use a professional email format with subject line"
  - "Output as a numbered list, max 5 items"
- **Constraints:** what should the model avoid?
  - "Do not include pricing information"
  - "Never mention competitor products"
  - "Keep the response under 100 words"
  - "Only use information provided — do not make assumptions"
**Speaker Notes:** Format tells the model how to package the output. Do you want a bullet list? A formal email? A one-sentence summary? A JSON object? Specifying format prevents the model from producing a 5-paragraph essay when you wanted 3 bullets. Constraints are guardrails — they tell the model what lines not to cross. In enterprise AI, constraints are especially important: you don't want an LLM mentioning pricing that might be outdated, referencing competitors, or making up facts when it doesn't have enough data. Constraints keep the output safe and on-brand.

---

### Slide 8: Prompting Technique 1 — Zero-Shot
**Visual:**
```
   ZERO-SHOT PROMPTING — No examples provided

   ┌─────────────────────────────────────────────────────────┐
   │  PROMPT:                                                │
   │  "Classify this customer email as Complaint, Request,   │
   │   or Compliment: 'Your service team was incredible       │
   │   and resolved my issue in minutes!'"                   │
   │                                                         │
   │  MODEL RESPONSE:                                        │
   │  "Compliment"                                           │
   └─────────────────────────────────────────────────────────┘

   ● No examples given — model uses general training knowledge
   ● Works well for clear, well-defined tasks
   ● Least token-efficient technique for complex tasks
```
**Content:**
- **Zero-shot:** Give the model a task with NO examples — just the instruction
- Works well for simple, well-understood tasks
- "Summarize this email in one sentence."
- "Classify this case as High, Medium, or Low priority."
- The model relies entirely on its training to understand what you want
- Fast and efficient — but can be inconsistent on complex or nuanced tasks
**Speaker Notes:** Zero-shot prompting is the simplest approach: you tell the model what to do, with no examples of what a good answer looks like. "Classify this customer feedback as Positive, Negative, or Neutral." The model uses its training to understand your intent and produce an output. This works great for clear, simple tasks. But for complex or nuanced tasks — especially ones where "good" is subjective — zero-shot can produce inconsistent results because the model is guessing at your definition of quality.

---

### Slide 9: Prompting Technique 2 — Few-Shot
**Visual:**
```
   FEW-SHOT PROMPTING — Examples provided in prompt

   ┌─────────────────────────────────────────────────────────┐
   │  PROMPT:                                                │
   │  "Classify customer emails. Examples:                   │
   │   Email: 'This is broken!' → Complaint                  │
   │   Email: 'Can you add a user?' → Request                │
   │   Email: 'You're amazing!' → Compliment                 │
   │                                                         │
   │   Now classify: 'The system crashed during demo'"       │
   │                                                         │
   │  MODEL RESPONSE:                                        │
   │  "Complaint"                                            │
   └─────────────────────────────────────────────────────────┘

   ● 2-5 examples steer output format and classification
   ● Higher accuracy on nuanced tasks vs. zero-shot
   ● Uses more tokens but more reliable
```
**Content:**
- **Few-shot:** Provide 2–5 examples of input/output pairs before the actual task
- The examples teach the model your exact standard and format
- Dramatically improves consistency on classification or formatting tasks
- Example: show 3 sample case summaries before asking for a new one
- Tradeoff: examples consume tokens from your context window
**Speaker Notes:** Few-shot prompting is one of the most powerful techniques in prompt engineering. Instead of just telling the model what to do, you show it. You provide 2 to 5 examples of the input you might receive and the exact output you expect. After seeing those examples, the model calibrates its own output to match your standard. If you want case summaries in a specific format — two sentences, past tense, no jargon — you show it three examples of that format before asking it to summarize a new case. The model mimics your pattern. The tradeoff is that examples consume tokens, so on high-volume use cases you need to balance quality with cost.

---

### Slide 10: Prompting Technique 3 — Chain-of-Thought
**Visual:**
```
   CHAIN-OF-THOUGHT PROMPTING — Ask model to reason step by step

   ┌─────────────────────────────────────────────────────────┐
   │  PROMPT:                                                │
   │  "Think step by step: Should we prioritize this lead?  │
   │   - Annual Revenue: $8M                                 │
   │   - Industry: Financial Services                        │
   │   - Engaged with pricing page twice this week           │
   │   - Decision maker identified                           │
   │   - Current tools: legacy on-premise CRM"              │
   │                                                         │
   │  MODEL REASONING:                                       │
   │  "Step 1: Revenue $8M — above SMB threshold → high value│
   │   Step 2: FinServ — strong Salesforce vertical          │
   │   Step 3: Pricing visits — buying signal                │
   │   Step 4: DM identified — no blocker                   │
   │   Step 5: Legacy CRM — high migration motivation        │
   │   Conclusion: HIGH priority — assign to senior AE"      │
   └─────────────────────────────────────────────────────────┘
```
**Content:**
- **Chain-of-Thought (CoT):** prompt the model to reason step-by-step before answering
- Critical for complex reasoning, multi-step analysis, or logical deductions
- "Think step by step before providing your final recommendation"
- Dramatically improves accuracy on tasks involving logic or comparison
- The intermediate reasoning is visible and can be audited
**Speaker Notes:** Chain-of-Thought prompting is fascinating. Research has shown that if you explicitly ask an LLM to reason through a problem step-by-step before giving a final answer, it gets significantly more accurate on complex tasks. It's as if making the model "think aloud" prevents it from jumping to a wrong conclusion. For a Salesforce use case, imagine prompting: "Before recommending which product tier to suggest to this customer, first analyze their company size, then their use case, then their budget constraints, then provide your recommendation." By breaking the reasoning into steps, you get a more accurate and explainable recommendation — and you can audit the reasoning chain to verify it makes sense.

---

### Slide 11: Live Demo — Three Iterations of the Same Prompt
**Visual:** Three prompt text boxes with arrows showing improvement from Iteration 1 to 3
**Content:**
- We'll see the same task — "write a follow-up email" — at three levels of quality
- Iteration 1: bare-bones, zero-shot
- Iteration 2: adds role, context, and constraints
- Iteration 3: adds format, few-shot example, and chain-of-thought
**Speaker Notes:** Now let me show you something that really makes this concrete. Same task, three different levels of prompt quality. We'll see how dramatically the output changes as we apply the techniques we've learned. This is a live demo section — follow along and think about how you'd apply this to your own Salesforce use cases.

---

### Slide 12: Iteration 1 — The Weak Prompt
**Visual:** Prompt text box showing the weak prompt; model response shown below
**Content:**
**Prompt:**
"Write a follow-up email."

**Output:**
"Subject: Follow Up

Hi,

I wanted to follow up with you regarding our previous conversation. Please let me know if you have any questions.

Best regards,
[Your Name]"

**Problem:** Generic. Could be sent to anyone about anything. Zero personalization. Useless.
**Speaker Notes:** This is what most people start with. "Write a follow-up email." And the model gives you... a template so generic it could have been written in 1995. No product mentioned, no company, no action requested, no timeline. The model did exactly what you asked — it wrote a follow-up email. But you didn't give it enough to work with, so it guessed, and guessed generically. This is what I mean when I say the quality of the output is a direct reflection of the quality of the prompt.

---

### Slide 13: Iteration 2 — Better, But Not There Yet
**Visual:** Improved prompt with role + context + instruction
**Content:**
**Prompt:**
"You are a Sales Development Representative at a B2B SaaS company called Acme Corp. You are writing to Marcus Chen, a VP of Operations at a 500-person logistics company called FastFreight. Marcus attended a product demo for our inventory management software last Tuesday but has not responded to your initial thank-you email sent 3 days ago. Write a follow-up email to re-engage him and encourage him to schedule a 30-minute discovery call."

**Output:** [meaningful, personalized email with Marcus's name, reference to the demo, logistics industry context, clear CTA]

**Analysis:** Much better — personalized and contextual — but no formatting instructions, no length constraint, tone may vary
**Speaker Notes:** Now look at what adding Role, Context, and Instruction does. We told the model who it is (Sales Development Rep at Acme Corp), we gave it the context (Marcus Chen, VP of Ops, logistics company, attended demo last Tuesday, hasn't responded in 3 days), and we gave a specific instruction (write an email to re-engage, encourage scheduling a call). The output is dramatically better. It references Marcus by name, mentions the demo, speaks to his role, and has a clear call to action. This is a usable email. But notice: we didn't specify length, we didn't specify tone guardrails, and the format might be inconsistent if you run this prompt 100 times.

---

### Slide 14: Iteration 3 — Production-Quality Prompt
**Visual:** Full structured prompt with all five components visible and labeled
**Content:**
**Prompt:**
"You are a professional Sales Development Representative at Acme Corp, a B2B SaaS company specializing in inventory management for logistics companies.

Context: You are reaching out to Marcus Chen, VP of Operations at FastFreight, a 500-person logistics company. Marcus attended a live product demo last Tuesday. You sent a thank-you email 3 days ago with no response. FastFreight's primary pain point, based on notes from the demo call, is manual inventory reconciliation that wastes 15+ hours per week.

Task: Write a follow-up email to re-engage Marcus and invite him to schedule a 30-minute discovery call to discuss how Acme's platform could solve the reconciliation problem.

Format:
- Subject line: compelling, specific, under 10 words
- Opening: reference the demo and acknowledge he's busy
- Body: 2–3 sentences connecting our solution to the specific pain point (15+ hours of manual reconciliation)
- CTA: one clear request to schedule a 30-minute call, with a specific scheduling link placeholder
- Closing: professional, warm, brief

Constraints:
- Do not mention pricing
- Do not use phrases like 'I hope this email finds you well' or 'touching base'
- Keep the email under 150 words
- Tone: confident but not pushy"

**Speaker Notes:** This is a production-quality prompt. It has every component: Role (Sales Development Rep, Acme Corp, B2B SaaS for logistics), Context (Marcus Chen, FastFreight, demo last Tuesday, specific pain point of 15+ hours manual reconciliation), Instruction (write a follow-up email to re-engage, invite 30-minute call), Format (subject line constraints, opening structure, body focus, CTA requirements, closing style), and Constraints (no pricing, no clichés, under 150 words, specific tone). Run this prompt 100 times and you'll get 100 consistently good, on-brand, personalized emails. That's the goal of Prompt Engineering.

---

### Slide 15: Salesforce Prompt Builder — Prompt Engineering at Scale
**Visual:**
```
   SALESFORCE PROMPT BUILDER — Interface Overview

   ┌─────────────────────────────────────────────────────────┐
   │  PROMPT BUILDER  ─ Setup ─ Einstein ─ Prompt Templates  │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │  Template Name: [Sales Email Generator          ]       │
   │  Template Type: [Sales Email              ▼    ]       │
   │                                                         │
   │  ┌───────────────────────────────────────────────────┐  │
   │  │ PROMPT BODY                                       │  │
   │  │                                                   │  │
   │  │ You are a Salesforce sales expert.                │  │
   │  │ Write an outreach email for:                      │  │
   │  │                                                   │  │
   │  │ Account: {!$Record.Account.Name}                  │  │
   │  │ Opp Value: {!$Record.Amount}                      │  │
   │  │ Stage: {!$Record.StageName}                       │  │
   │  └───────────────────────────────────────────────────┘  │
   │                                                         │
   │  [Preview Response]  [Activate Template]                │
   │                                                         │
   │  ✓ Einstein Trust Layer active — Zero Data Retention    │
   └─────────────────────────────────────────────────────────┘
```
**Content:**
- Prompt Builder lets admins build the Iteration 3-style prompt once — for everyone
- Merge fields pull live CRM data: {!Account.Name}, {!Case.Subject}, {!Contact.Title}
- Template is reusable across hundreds or thousands of records
- Admins control the Role, Context, Format, and Constraints — reps just click
- Supports: Sales Email generation, Case Summary, Field Generation, Flex templates
**Speaker Notes:** Here's the beautiful thing about Prompt Builder: it takes everything you just learned about prompt engineering and makes it repeatable at enterprise scale. Instead of asking every sales rep to craft a perfect prompt from scratch, an admin builds the master template — with Role, Context pulled from merge fields, Instruction, Format, and Constraints baked in. When a rep opens an Opportunity record and clicks "Generate Follow-Up Email," Prompt Builder assembles the full, rich prompt using live data from that specific record — account name, contact title, stage, last activity — and sends it to the LLM. The rep gets a polished, personalized email in seconds. One prompt template, thousands of tailored outputs.

---

### Slide 16: Prompt Builder Template Types — Exam Vocabulary
**Visual:**
```
   PROMPT BUILDER — Four Template Types

   ┌──────────────────────┐   ┌──────────────────────┐
   │  FIELD GENERATION    │   │  FLEX TEMPLATE       │
   │                      │   │                      │
   │ Populates a specific │   │ Flexible — displayed │
   │ Salesforce field     │   │ in any context where │
   │ with AI content      │   │ configured           │
   │                      │   │                      │
   │ Ex: Auto-generate    │   │ Ex: Einstein Copilot │
   │ Account Summary      │   │ sidebar context      │
   │ field on Account obj │   │ panels               │
   └──────────────────────┘   └──────────────────────┘

   ┌──────────────────────┐   ┌──────────────────────┐
   │  RECORD SUMMARY      │   │  SALES EMAIL         │
   │                      │   │                      │
   │ Summarizes a record  │   │ Generates outreach   │
   │ using related data   │   │ and follow-up emails │
   │ as context           │   │ in Sales Engagement  │
   │                      │   │                      │
   │ Ex: Case summary     │   │ Ex: Post-demo        │
   │ from case + emails   │   │ follow-up email      │
   └──────────────────────┘   └──────────────────────┘
```
**Content:**
- **Sales Email:** generates outbound emails for sales reps
- **Field Generation:** populates a Salesforce field using AI (e.g., auto-fill account summary field)
- **Flex:** general-purpose prompt for any use case; invoked via Flow or Apex
- **Record Summary:** summarizes the key data on a record (account, case, opportunity)
- Each type has specific data permissions and invocation contexts
**Speaker Notes:** Prompt Builder has four template types you should know for the exam. Sales Email is specifically for generating outbound emails — it has the right data access and the right output context for email composition. Field Generation is powerful — it uses AI to populate a Salesforce field automatically. Imagine an "Account AI Summary" field that gets auto-populated every morning with a fresh 3-sentence summary of the account's status. Flex is the most flexible type — you invoke it from Salesforce Flow or Apex for any custom use case. Record Summary is purpose-built to give reps a quick briefing on a record when they open it. Know all four for the exam.

---

### Slide 17: Lecture Recap and Exam Prep
**Visual:**
```
   PROMPT ENGINEERING — Exam Reference Table

   ┌──────────────────┬──────────────────────────────────────────┐
   │  TECHNIQUE       │  DESCRIPTION & WHEN TO USE               │
   ├──────────────────┼──────────────────────────────────────────┤
   │ Zero-shot        │ No examples. "Classify this email as..." │
   │                  │ Use for simple, clear tasks               │
   ├──────────────────┼──────────────────────────────────────────┤
   │ Few-shot         │ 2-5 examples in prompt to guide format   │
   │                  │ Use for nuanced tasks needing consistency │
   ├──────────────────┼──────────────────────────────────────────┤
   │ Chain-of-thought │ "Think step by step..." before answering │
   │                  │ Use for multi-step reasoning tasks        │
   ├──────────────────┼──────────────────────────────────────────┤
   │ Role prompting   │ "You are an expert in..." persona setting │
   │                  │ Use to shape tone and expertise level     │
   ├──────────────────┼──────────────────────────────────────────┤
   │ Prompt Builder   │ Salesforce native low-code prompt tool   │
   │                  │ 4 types: Field Gen, Flex, Record, Sales   │
   └──────────────────┴──────────────────────────────────────────┘
```
**Content:**
- Zero-shot: simple, clear tasks → "Classify this case as High/Medium/Low"
- Few-shot: when consistency of format matters → "Generate summaries matching these 3 examples"
- Chain-of-thought: complex reasoning → "Think through step-by-step before recommending"
- Prompt anatomy: Role + Context + Instruction + Format + Constraints
- Prompt Builder: enterprise-scale prompt engineering for Salesforce admins
**Speaker Notes:** You now understand how to craft prompts that actually work, and how Salesforce has turned prompt engineering into a no-code admin tool. This is directly testable on the exam — they'll ask you about prompt techniques, Prompt Builder template types, and what makes a prompt effective. Let's make sure you know exactly what to say.

---

## RECORDING SCRIPT

Welcome to one of my favorite lectures in this entire course. We're going to talk about Prompt Engineering — the art and science of giving an LLM instructions that actually produce excellent results.

Here's the mental model I want you to start with: an LLM is like an extraordinarily capable but completely literal employee. They will do exactly what you tell them. If you're vague, they'll make assumptions. If you're precise, they'll nail it. Prompt Engineering is the discipline of being precise — knowing exactly how to frame your instructions so the LLM produces what you actually need.

And this isn't just theory. Salesforce's entire Prompt Builder product is prompt engineering packaged into a no-code admin tool. Every template in Prompt Builder is a carefully crafted prompt. Understanding prompt engineering means understanding how Prompt Builder actually works.

**What Is a Prompt?**

Let's start at the beginning. A prompt is simply the text you send to an LLM. It's the input. Everything the model sees before generating its response. It can be a single sentence — "What is a context window?" — or it can be a 600-word structured document. The prompt includes everything: instructions, background information, examples, formatting requirements, and constraints. The LLM reads the entire prompt and produces an output. The prompt shapes everything about that output — its tone, length, format, depth, accuracy, and relevance.

**The Five Anatomy Components**

After studying thousands of high-quality prompts, researchers and practitioners have identified a consistent structure that works well. I call it RCIFC: Role, Context, Instruction, Format, Constraints. Let's unpack each one.

**Role** is who you're telling the model to be. This is more powerful than most people realize. When you say "You are an experienced Salesforce Sales Cloud consultant with 10 years of enterprise implementations," you're not just being fancy. You're telling the model to draw on everything it knows about Salesforce, sales processes, enterprise software, CRM best practices — and respond with that level of expertise. Compare that to leaving no role at all, where the model defaults to a generic Q&A assistant. Same question, very different quality of answer.

**Context** is the background information the model needs but might not have. Think about it from the model's perspective: it's about to generate a response, and it knows nothing about your specific situation unless you tell it. Who is the customer? What's their industry? What happened in the last call? What's the key pain point they mentioned? What's the relationship history? The more specific and relevant context you provide, the more tailored and useful the output.

**Instruction** is the actual task. What do you want the model to do? This sounds obvious, but the precision of your instruction is the single biggest lever for output quality. "Write an email" versus "Write a 120-word follow-up email to a logistics VP who attended our inventory software demo last Tuesday and hasn't responded in 3 days, with the goal of scheduling a 30-minute call." The second version is 20 words longer but will produce output that is dramatically more useful. Be specific. Use action verbs: draft, summarize, classify, compare, explain, list, identify.

**Format** is how you want the output structured. Do you want three bullet points? A formal email with subject line and sign-off? A JSON object? A numbered list? A one-sentence executive summary? If you don't specify format, the model picks one — and it might not be what you need. For a Salesforce use case where the output will be displayed in a specific UI component or saved to a specific field, format matters a lot. "Respond with a maximum of two sentences in plain English, no bullets, no headers" is a perfectly valid format instruction.

**Constraints** are your guardrails. What should the model avoid? Don't mention pricing. Don't reference competitors. Never say "I hope this email finds you well." Don't make assumptions beyond the data provided. Keep it under 100 words. These aren't optional niceties — in enterprise AI, constraints are how you keep outputs safe, on-brand, and compliant. A customer-facing LLM without constraints is a liability.

**The Three Prompting Techniques**

EXAM TIP: Know these three techniques by name and be able to distinguish them from a scenario description.

**Zero-shot prompting** means giving the model a task with no examples — just the instruction. "Classify this customer review as Positive, Negative, or Neutral." The model uses its training to infer what you want. Works great for simple, unambiguous tasks. Fast, no extra tokens consumed. But for complex or subjective tasks, the model's interpretation of "good" might not match yours.

**Few-shot prompting** means giving the model 2 to 5 examples of input/output pairs before the actual task. You're showing the model your standard. If you want case summaries in a very specific format — two sentences, no jargon, past tense, action-item at the end — you provide three sample cases with summaries that match that format, then give it a new case. The model looks at your examples, infers the pattern, and produces output that matches your format. This dramatically improves consistency. The tradeoff: examples consume tokens. On a high-volume workflow that runs thousands of times a day, those extra tokens add up.

**Chain-of-thought prompting** is about making the model reason out loud before answering. Research has consistently shown that on complex tasks — logical reasoning, multi-step analysis, recommendations that require comparing multiple factors — asking the model to work through its reasoning step-by-step produces significantly more accurate final answers. You prompt it: "Before providing your final recommendation, first analyze the customer's current tech stack, then assess their stated pain points, then evaluate budget constraints, then provide your recommendation with justification." The intermediate reasoning is valuable in two ways: it improves accuracy, and it's auditable — you can review the chain of thought to verify the logic makes sense.

**The Live Demo — Three Iterations**

Let me walk you through three versions of the same prompt so you can see these concepts in action. The task: write a sales follow-up email. We're going to see this go from terrible to good to production-quality.

**Iteration 1 — The Weak Prompt:**

"Write a follow-up email."

That's it. Four words. What do you think happens? The LLM produces something like: "Subject: Follow Up. Hi, I wanted to follow up with you regarding our previous conversation. Please let me know if you have any questions. Best regards, [Your Name]."

Generic. Lifeless. Could be sent to anyone about anything. The model isn't being lazy — it literally did everything you asked. You gave it four words of instruction with zero context, and it produced the only thing it could: a generic placeholder. This is the baseline most people start at, and it's why they think AI isn't useful for writing.

**Iteration 2 — Better:**

Now we add Role, Context, and a clear Instruction:

"You are a Sales Development Representative at Acme Corp, a B2B SaaS company. You are writing to Marcus Chen, VP of Operations at FastFreight, a 500-person logistics company. Marcus attended a product demo for our inventory management software last Tuesday. You sent a thank-you email 3 days ago with no response. Write a follow-up email to re-engage Marcus and encourage him to schedule a 30-minute discovery call."

Now the output says Marcus's name. It references the demo from last Tuesday. It acknowledges the logistics context. It has a specific call to action — schedule a 30-minute call. This is a usable email. A rep could send this. But here's the problem: there's no format instruction, so the model might produce a 350-word essay sometimes and 80 words other times. There's no constraint against clichés, so it might still say "I hope this email finds you well." If you run this prompt 1,000 times across your sales team, quality will vary.

**Iteration 3 — Production Quality:**

"You are a professional Sales Development Representative at Acme Corp, a B2B SaaS company specializing in inventory management for logistics companies.

Context: You are reaching out to Marcus Chen, VP of Operations at FastFreight, a 500-person logistics company. Marcus attended a live product demo last Tuesday. You sent a thank-you email 3 days ago with no response. Based on demo call notes, FastFreight's primary pain point is manual inventory reconciliation that wastes 15+ hours per week.

Task: Write a follow-up email to re-engage Marcus and invite him to schedule a 30-minute discovery call specifically about solving the reconciliation problem.

Format:
- Subject line: compelling, specific, under 10 words
- Opening: reference the demo, acknowledge he's busy, one sentence
- Body: 2–3 sentences connecting Acme's solution to the 15+ hours of manual reconciliation pain
- CTA: one clear sentence requesting a 30-minute call with a scheduling link placeholder [CALENDLY_LINK]
- Closing: professional and warm, 1 sentence

Constraints:
- Do not mention pricing
- Never use 'I hope this email finds you well,' 'just following up,' or 'touching base'
- Keep total email under 150 words
- Tone: confident and direct, but never pushy"

This prompt will produce a consistently excellent, on-brand, personalized email every single time. Not sometimes. Every time. Because it gives the model everything it needs: who it is, who it's talking to, what the specific pain point is, exactly how to structure the response, and exactly what to avoid. That's the power of the five components working together.

**How Salesforce Prompt Builder Uses All of This**

EXAM TIP: Prompt Builder is the exam's test of whether you understand prompt engineering in a Salesforce context. Know these four things about it.

One: Prompt Builder is where admins build reusable prompt templates. Not reps, not developers (usually) — admins. It's a no-code tool in Einstein 1 Studio.

Two: Templates use merge fields to pull live CRM data into the prompt automatically. {!Account.Name}, {!Case.Subject}, {!Opportunity.StageName} — these pull real data from real records so every generated output is personalized to that specific record.

Three: There are four template types — Sales Email (for outbound sales emails), Field Generation (to auto-populate a Salesforce field with AI-generated content), Flex (general purpose, invoked by Flow or Apex), and Record Summary (brief summaries of a record's key data). Know all four.

Four: The Einstein Trust Layer sits between Prompt Builder and any LLM. Your CRM data is masked before being sent to external models. Outputs are inspected for toxicity and hallucination risk. The prompt and response are not used to train the LLM. Security and compliance are handled by the platform.

Here's the beautiful thing: every well-built Prompt Builder template is a production-quality prompt. The admin is doing the prompt engineering once so that every user benefits from it forever. They set the Role ("You are a Salesforce service agent for Acme Corp"), they configure the Context (merge fields pulling account data, case history, product details), they write the Instruction ("Write a case resolution summary"), they specify the Format ("Two sentences, plain English, include next steps"), and they set the Constraints ("Do not include internal ticket numbers, do not mention SLA breaches"). One template. Thousands of users. Consistently excellent outputs.

**Zero-Shot, Few-Shot, and Chain-of-Thought in Salesforce**

Let me quickly connect the three techniques to Salesforce use cases.

Zero-shot in Salesforce: Most Prompt Builder templates are essentially zero-shot — you give the model a role, context, and instruction, but no examples. This works because the context window is already rich with CRM data, and the task (summarize a case, draft an email) is well-understood by the model.

Few-shot in Salesforce: When you need output in a very specific, unconventional format — say, a structured report with your company's exact headings and terminology — you might include 1-2 examples in the template. This trains the model on your specific standard. It costs more tokens, so use it selectively.

Chain-of-thought in Salesforce: Particularly powerful for Agentforce. When an AI agent needs to make a decision — "Should I escalate this case?" — chain-of-thought prompting makes it reason through the criteria step by step before acting. This makes agent behavior more reliable and auditable, which matters for compliance.

**Locking It In**

A prompt is the complete input text sent to an LLM. Quality of input determines quality of output.

The five components of an excellent prompt: Role (who the model is), Context (background information), Instruction (the specific task), Format (how the output should look), Constraints (what to avoid).

Three prompting techniques: Zero-shot (no examples, relies on training), Few-shot (2-5 examples to set the standard), Chain-of-thought (step-by-step reasoning before final answer).

Prompt Builder in Salesforce: admin-built reusable templates with merge fields, four template types (Sales Email, Field Generation, Flex, Record Summary), protected by the Einstein Trust Layer.

In the next section, we're going to zoom out and look at how all of this AI — Predictive, Generative, LLMs, Prompt Engineering — integrates into the Salesforce platform as a whole. Einstein, Agentforce, the Trust Layer, CRM Analytics — how do they all fit together? Let's find out.

---

## EXAM TIPS
- The exam often tests Prompt Builder template types — know all four: Sales Email, Field Generation, Flex, Record Summary, and what each is used for
- Know the difference between zero-shot (no examples), few-shot (shows examples), and chain-of-thought (step-by-step reasoning) by name and scenario description
- If the exam shows a poorly written prompt and asks how to improve it, apply the RCIFC framework: what's missing — Role, Context, Instruction, Format, or Constraints?
- "Grounding" is related to Context in prompts — it means connecting the LLM to real, current data rather than relying on training knowledge; grounding reduces hallucination
- The Einstein Trust Layer is the security component that makes Prompt Builder enterprise-safe — data masking, no training on your data, toxicity filtering; know its role in prompt workflows
- Prompt Builder is a no-code tool — it is used by admins, not developers (for most use cases); Flex templates can be invoked by Apex for developer use cases
- The exam may ask which prompting technique is "most appropriate" for a given scenario — match the technique to the need: consistency/format = few-shot; complex reasoning = chain-of-thought; simple clear task = zero-shot
- Merge fields in Prompt Builder (e.g., {!Account.Name}) are how live CRM data is injected into prompt templates — this is what makes outputs personalized rather than generic

---

## LECTURE SUMMARY
- A prompt is the complete text input to an LLM; quality of prompt directly determines quality of output
- The five anatomy components of a great prompt: Role (who the model is), Context (background information), Instruction (specific task), Format (output structure), Constraints (guardrails on what to avoid)
- Three core prompting techniques: Zero-shot (instruction only), Few-shot (instruction + examples), Chain-of-thought (step-by-step reasoning before answer)
- Iterating a prompt from bare-bones to production-quality dramatically changes output quality — specificity is the key lever
- Salesforce Prompt Builder lets admins build production-quality prompt templates with live CRM data via merge fields, with four template types: Sales Email, Field Generation, Flex, and Record Summary
- All Prompt Builder executions flow through the Einstein Trust Layer for data security, masking, and toxicity filtering

---

## MINI QUIZ (3 questions with answers)

**Q1:** A Salesforce admin is building a Prompt Builder template to automatically generate a two-sentence summary of a customer account whenever a sales rep opens the account page. The summary should only use data from Salesforce fields — it should not make inferences beyond what is in the record. Which Prompt Builder template type should the admin use, and which prompt component addresses the "no inferences" requirement?

**A:** Template type: **Record Summary**. The "no inferences" requirement is addressed by the **Constraints** component of the prompt — a constraint such as "Only use information explicitly provided in the context below. Do not make assumptions or inferences."

**Explanation:** Record Summary is the purpose-built template type for generating summaries of Salesforce records. The requirement to limit the model's reasoning to provided data is a classic constraint — it prevents hallucination by explicitly telling the model not to go beyond what it's been given.

---

**Q2:** A prompt engineer is building a template to classify incoming support cases as "Billing," "Technical," or "Account Management." Early testing shows the model is consistent about 70% of the time but misclassifies edge cases. Which prompting technique would MOST improve consistency, and why?

**A:** **Few-shot prompting** — providing 3-5 examples of correctly classified cases (one from each category, with at least one edge case) teaches the model the admin's specific classification standard rather than relying on the model's own interpretation.

**Explanation:** Zero-shot classification relies on the model's training to interpret category boundaries. For a custom taxonomy with edge cases, few-shot examples calibrate the model's behavior to match the admin's intent precisely. Chain-of-thought could also help for borderline cases, but the primary issue is consistency — which few-shot directly addresses.

---

**Q3:** Which of the following BEST describes the difference between zero-shot and few-shot prompting?

A) Zero-shot uses no LLM; few-shot uses multiple LLMs  
B) Zero-shot provides only an instruction; few-shot provides the instruction plus examples of desired input/output pairs  
C) Zero-shot is for simple tasks; few-shot is only for image generation  
D) Zero-shot requires chain-of-thought reasoning; few-shot does not

**A:** B

**Explanation:** Zero-shot = instruction only, model relies on training. Few-shot = instruction plus 2-5 examples showing the model exactly what good output looks like. Option A is completely wrong — both techniques use an LLM. Option C is partially true (zero-shot is better for simple tasks) but incorrectly limits few-shot to image generation. Option D reverses the relationship entirely. Option B is the precise, textbook-correct definition.
