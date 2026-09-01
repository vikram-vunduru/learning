# Lecture 12: Prompt Builder in Salesforce
**Section:** Section 3 — AI in Salesforce  
**Duration:** 20 minutes  
**Exam Weight:** ~10% of exam (Prompt Builder is tested on template types and Trust Layer integration)

---

## Learning Objectives
1. Explain what Prompt Builder is and where it lives in Salesforce Setup
2. Identify and describe the four template types: Field Generation, Flex, Record Summary, Sales Email
3. Walk through the process of building a prompt template step-by-step
4. Explain merge fields and how live CRM data is pulled into prompts
5. Describe how the Trust Layer applies to Prompt Builder (masking before LLM call)
6. Demonstrate knowledge of Prompt Builder through scenario-based exam questions

---

## SLIDES

### Slide 1: Title Slide
**Visual:** Salesforce Setup screen with "Prompt Builder" highlighted in the Quick Find search. A prompt template open in the editor showing merge fields highlighted in blue within the prompt text.
**Content:**
- Prompt Builder: Custom generative AI for your Salesforce org
- Build AI-powered content templates using your own CRM data
- No ML background required — this is admin territory

**Speaker Notes:** "Every organization has repetitive content creation tasks. Writing the same types of emails every day. Summarizing the same type of records. Drafting similar follow-up messages over and over. Prompt Builder lets you encode your best-practice prompts into reusable templates that pull real CRM data — so every rep gets the same quality output, consistently. Let's build one together."

---

### Slide 2: What Is Prompt Builder?
**Visual:**
```
   PROMPT BUILDER — DATA FLOW

   ┌────────────────────────────────────────────────────────────┐
   │  1. ADMIN CREATES template in Prompt Builder               │
   │     (Role + Context + Instructions + Format)               │
   │              │                                             │
   │              ▼                                             │
   │  2. MERGE FIELDS pull live CRM data at runtime             │
   │     {!$Record.Account.Name} → "Acme Corp"                  │
   │     {!$Record.Amount} → "$45,000"                          │
   │              │                                             │
   │              ▼                                             │
   │  3. EINSTEIN TRUST LAYER processes prompt                  │
   │     ● PII masking                                          │
   │     ● Grounding with Data Cloud context                    │
   │              │                                             │
   │              ▼                                             │
   │  4. LLM GENERATES content (under ZDR agreement)            │
   │              │                                             │
   │              ▼                                             │
   │  5. RESPONSE returned through Trust Layer                  │
   │     ● Toxicity check ● Audit logged                        │
   │              │                                             │
   │              ▼                                             │
   │  6. OUTPUT displayed to user / stored in field             │
   └────────────────────────────────────────────────────────────┘
```
**Content:**
**Prompt Builder** is a tool in Salesforce Setup that lets admins and developers:
- Create reusable prompt templates that combine instructions with live CRM data
- Connect those templates to Salesforce UI elements (buttons, flows, record pages)
- Leverage LLMs (like OpenAI GPT or Anthropic Claude via Salesforce's partnerships) to generate content

**Where it lives:** Setup → Prompt Builder (in Einstein and AI category)

**Who uses it:**
- Admins: Configure and deploy templates
- Users: See AI-generated content (button click or automatic)
- Developers: Can reference templates in Apex/Flow

**Speaker Notes:** "Before Prompt Builder, if you wanted AI-generated content in Salesforce, you needed a developer to call an external API, handle authentication, build the UI to show the response, manage errors — a whole engineering project. Prompt Builder democratizes that. An admin can build a template in Setup with no code, connect it to a record page, and suddenly every sales rep gets AI-drafted emails at the click of a button. That's a significant shift in who can build AI capabilities in Salesforce."

---

### Slide 3: The Four Template Types
**Visual:**
```
   PROMPT BUILDER — FOUR TEMPLATE TYPES

   ┌────────────────────────────┬────────────────────────────┐
   │      FIELD GENERATION      │       FLEX TEMPLATE        │
   │                            │                            │
   │ Populates a specific       │ Flexible placement —       │
   │ Salesforce FIELD with AI   │ used anywhere configured   │
   │ generated content          │ (sidebar, panel, etc.)     │
   │                            │                            │
   │ Ex: Account Summary field  │ Ex: Einstein Copilot       │
   │ auto-populated from CRM    │ context suggestions        │
   │ data via AI                │                            │
   ├────────────────────────────┼────────────────────────────┤
   │      RECORD SUMMARY        │       SALES EMAIL          │
   │                            │                            │
   │ Summarizes a full RECORD   │ Generates personalized     │
   │ using related data as      │ SALES OUTREACH emails in   │
   │ AI context                 │ Sales Engagement           │
   │                            │                            │
   │ Ex: Case summary from      │ Ex: Follow-up email after  │
   │ case + related emails      │ a discovery call           │
   └────────────────────────────┴────────────────────────────┘
```
**Content:**
**1. Field Generation**
- Auto-fills a specific record field using AI
- Example: Auto-generate a product description field from product name + category + key features

**2. Flex**
- General-purpose template not tied to a specific field or object
- Used in flows, Apex, or custom UI components
- Most flexible — you define context and output

**3. Record Summary**
- Generates a text summary of a complete record
- Example: "Summarize this Opportunity including recent activities, open tasks, and deal stage"

**4. Sales Email**
- Generates a personalized sales or follow-up email
- Pulls from contact, account, and opportunity context
- Appears as the "Draft with Einstein" email feature in Sales Cloud

**Speaker Notes:** "Memorize these four. The exam will give you a scenario and ask which template type to use. The keys to remembering them: Field Generation = populating ONE specific field. Flex = anything goes, used in code or flows. Record Summary = here's everything about this record in plain language. Sales Email = write me a personalized email based on this CRM data. The most common exam trap: confusing Flex and Record Summary. Record Summary is specifically for summarizing a complete record. Flex is for everything else that doesn't fit the other three categories."

---

### Slide 4: Template Type — Field Generation Deep Dive
**Visual:** A product record mockup. Left: empty "Product Description" field. Right: After clicking "Generate with Einstein," the field is populated with a 3-sentence product description. Arrow showing the before-and-after.
**Content:**
**Field Generation Template:**
- Tied to a specific field on a specific object
- Appears as a "Generate" button next to that field in the record UI
- Output is written directly into the field (user can edit before saving)

**Perfect for:**
- Generating product descriptions from product attributes
- Auto-drafting case resolutions from case notes
- Creating contact bio summaries from profile data
- Filling in "Description" fields that reps consistently leave blank

**How to build:**
1. Choose object and target field
2. Write the prompt with merge fields
3. Configure where the button appears in Lightning App Builder
4. Users click "Generate" → field populates → user reviews → saves

**Speaker Notes:** "Field Generation solves a very specific, very common pain point. How many of your Salesforce records have empty description fields? Empty 'summary' fields? Fields where someone SHOULD have typed something meaningful but didn't because it takes time? Field Generation turns that button into one click. The AI reads the context of the record and writes what should go in the field. The user can edit it or just accept it. Data completeness goes up, rep time goes down. On the exam, the key phrase for Field Generation is 'auto-populate a specific field' — that's your cue."

---

### Slide 5: Template Type — Record Summary Deep Dive
**Visual:** A Salesforce Case record with a complex history — 15 activities, 8 emails, 3 previous case owners. Next to it, an Einstein-generated summary panel: "This case was opened on January 5th by a customer experiencing API timeout errors. Three resolutions were attempted without success. The current critical issue is authentication token expiration after system upgrade."
**Content:**
**Record Summary Template:**
- Generates a narrative summary of an entire record and its related data
- Does NOT write to a field — displays in a panel or component
- Can pull data from related records (activities, emails, child records)

**Perfect for:**
- Case summaries for service agents picking up mid-conversation
- Account summaries for reps preparing for a customer call
- Opportunity summaries for managers reviewing pipeline
- Contact summaries combining CRM activity + profile data

**Merge field power:** Can pull from the record itself AND related lists (Activities, Cases, Opportunities linked to an Account)

**Speaker Notes:** "Record Summary is probably the most immediately impressive Prompt Builder template type to demonstrate to an executive. You open a complex account with 5 years of history — hundreds of activities, dozens of opportunities, multiple cases — and you click one button. Three sentences appear: who this customer is, what we've been working on recently, and what's pending. That's a three-second prep for a 30-minute customer call. The difference from Field Generation: Record Summary does not write to a field. It generates a read-only display component. The user reads it, doesn't edit it directly, and uses it to inform their next action."

---

### Slide 6: Template Type — Sales Email Deep Dive
**Visual:** The Einstein email composer in Salesforce showing the "Draft with Einstein" button. Click → a personalized email draft appears, referencing the account name, recent opportunity, and a specific product interest noted in the last activity.
**Content:**
**Sales Email Template:**
- Specifically for drafting sales and follow-up emails
- Integrates with the Salesforce email composer (Send Email action)
- Appears as "Draft with Einstein" or "Suggest" button in email activities

**Context it can pull:**
- Account: Company name, industry, recent news (if connected)
- Opportunity: Deal stage, value, last activity
- Contact: Name, title, last interaction
- Products: Product names, renewal dates
- Custom instructions you embed in the template

**Perfect for:** Follow-up emails, renewal outreach, meeting confirmation emails, proposal follow-ups

**Exam note:** Sales Email templates are the template type MOST visible to end users — they see it as an in-app feature, not a setup configuration

**Speaker Notes:** "Sales Email templates are what most reps interact with when they see 'Draft with Einstein' in the email activity panel. From the rep's perspective: they're about to write a follow-up email. They click 'Draft with Einstein.' The system reads the account, the opportunity, the contact, and their recent conversation history, and drafts a personalized email. They can edit it. They can regenerate it. But the foundation is already there. What they don't see is the Prompt Builder template that an admin configured in Setup — the merge fields, the instructions, the tone guidance. The admin builds the engine; the rep just hits the gas."

---

### Slide 7: Template Type — Flex Deep Dive
**Visual:** A code/flow builder mockup showing a Flex template being called from a Salesforce Flow using the "Get Prompt Response" flow action.
**Content:**
**Flex Template:**
- The "everything else" template type
- Not tied to a specific field, object, or UI element
- Called programmatically from: Salesforce Flows, Apex code, API calls

**Use cases:**
- Generate a legal document header from contract record data
- Create a custom report narrative in a flow
- Call from a Process Builder or Scheduled Flow for batch AI processing
- Build a custom AI-powered component that doesn't fit the other three patterns

**Who uses it:** Admins with Flow knowledge, developers with Apex/API knowledge

**Key distinction:** All other templates have pre-defined UI integration; Flex templates require you to wire up the UI yourself

**Speaker Notes:** "Flex is for power users. If Field Generation, Record Summary, and Sales Email are the pre-packaged meals, Flex is the restaurant kitchen where you can cook anything. The power is that there are no constraints. The requirement is that you need to know how to integrate it — via Flow, Apex, or API. If an exam question says 'the admin needs to create an AI feature that runs as part of a scheduled overnight batch process to generate quarterly business review summaries,' that's a Flex template called from a Scheduled Flow. It doesn't fit the other three pre-packaged patterns."

---

### Slide 8: Merge Fields — Pulling Live CRM Data
**Visual:** Split screen — left shows the prompt template in the Prompt Builder editor with merge fields highlighted in curly braces: "Write a follow-up email for {!$Record.Name} at {!$Record.Account.Name}. Their last meeting was on {!$Record.LastActivityDate}." Right shows the rendered prompt with actual data filled in.
**Content:**
**What are merge fields?**
- Placeholders in your prompt template that get replaced with real CRM data at runtime
- Use the same syntax as Salesforce merge fields: {!ObjectName.FieldName}

**Examples:**
- {!$Record.Name} → "Sarah Johnson"
- {!$Record.Account.Name} → "Acme Corp"
- {!$Record.Amount} → "$45,000"
- {!$Record.StageName} → "Proposal/Price Quote"
- {!$Record.Account.Industry} → "Manufacturing"

**Can also reference:** Related records, custom fields, formula fields

**The merge happens BEFORE the prompt is sent to the LLM** — the LLM sees the fully resolved text

**Speaker Notes:** "Merge fields are what make Prompt Builder's output PERSONAL. Without merge fields, your prompt is a generic template that gives the same output for every record. With merge fields, the LLM sees: 'Write a follow-up email for Sarah Johnson at Acme Corp, who last met with us on February 15th and whose $45,000 opportunity is in the Proposal stage in the Manufacturing industry.' That context produces a genuinely personalized output that references the customer by name, knows their industry, knows their deal stage. The result feels handcrafted, not AI-generated. Important for the exam: the merge fields are resolved — real data is substituted — BEFORE the prompt goes to the LLM. Not after."

---

### Slide 9: The Trust Layer — How Data Is Protected
**Visual:**
```
   PROMPT BUILDER + TRUST LAYER — SECURITY FLOW

   Admin Template                Einstein Trust Layer              LLM
   ┌─────────────┐               ┌─────────────────────────┐      ┌─────┐
   │ You are a   │               │                         │      │     │
   │ sales expert│──────────────▶│ 1. DATA MASKING         │─────▶│ LLM │
   │             │               │    SSN, email → tokens  │      │     │
   │ Account:    │               │                         │      │     │
   │ {!Account   │               │ 2. GROUNDING            │◀─────│     │
   │  .Name}     │               │    Adds Data Cloud ctx  │      └─────┘
   │             │               │                         │
   │ Write email │               │ 3. TOXICITY CHECK       │
   └─────────────┘               │    Filters LLM output   │
                                  │                         │
   User sees clean,               │ 4. AUDIT TRAIL          │
   safe, grounded                 │    Logs interaction     │
   AI output ◀────────────────── └─────────────────────────┘
```
**Content:**
**The Trust Layer's role in Prompt Builder:**
1. **Masking:** Personal identifiable information (PII) is replaced with tokens before the LLM sees it
   - "Sarah Johnson at Acme Corp" → "Person A at Company B" in the LLM's view
2. **Grounding:** The Trust Layer ensures the LLM only uses YOUR data, not external data
3. **No data training:** Your org's data is NOT used to train the underlying LLM
4. **Audit logging:** Every AI generation is logged for compliance review

**Why this matters:**
- Many enterprises couldn't use AI if their customer data went directly to OpenAI servers
- The Trust Layer makes enterprise AI adoption possible by maintaining data sovereignty
- GDPR and other regulations require knowing where customer data goes

**Speaker Notes:** "This is where I see admin eyes light up, because they've been told by IT and Legal: 'We can't use AI tools because our customer data can't leave our systems.' The Trust Layer is Salesforce's answer to that concern. When you use Prompt Builder, your customer's real name, their account details, their contract values — that data gets masked at the boundary before it goes to the LLM provider. The LLM sees anonymized tokens. It generates a response based on those tokens. Salesforce's Trust Layer then re-substitutes the real data into the response for the user to see. The actual PII never reaches the LLM server. For the exam: Prompt Builder uses the Trust Layer. The Trust Layer masks PII before sending to the LLM. Salesforce does NOT use your data to train its LLMs."

---

### Slide 10: Step-by-Step Demo — Building a Case Summary Template
**Visual:** Sequential screenshots of the Prompt Builder interface showing each step: (1) Setup screen with Prompt Builder selected, (2) New template creation screen with type selection, (3) Template editor with prompt text and merge field insertion, (4) Preview screen showing resolved output, (5) Activation screen.
**Content:**
**Demo: Case Summary for Service Agents**

**Goal:** When a service agent opens any Case, they can click a button to get a 3-sentence summary of the case history.

**Steps:**
1. Setup → Quick Find: "Prompt Builder" → Open
2. Click "New Prompt Template"
3. Select template type: **Record Summary**
4. Object: **Case**
5. Enter template name: "Case Summary for Agents"
6. Write the prompt (see next slide for script)
7. Insert merge fields using the field picker
8. Click "Preview" to test with a live record
9. Activate the template
10. Add to the Case record page via Lightning App Builder

**Speaker Notes:** "Follow along with me here if you have a Salesforce sandbox available. If not, watch the process — you'll need to know it for the exam. The key decisions are: choosing the right template type (Record Summary, because we want a summary display, not to write to a field), choosing the right object (Case), and writing an effective prompt. Let's look at what that prompt looks like."

---

### Slide 11: Demo — Writing the Prompt Template
**Visual:** The Prompt Builder template editor showing the full prompt text with merge fields highlighted.
**Content:**
**Sample Case Summary Prompt:**

```
You are a helpful assistant summarizing a Salesforce support case for a service agent.

Case Information:
- Case Number: {!$Record.CaseNumber}
- Subject: {!$Record.Subject}
- Status: {!$Record.Status}
- Priority: {!$Record.Priority}
- Date Opened: {!$Record.CreatedDate}
- Case Description: {!$Record.Description}
- Account: {!$Record.Account.Name}

Write a 2-3 sentence summary that covers:
1. What the customer's issue is
2. What has been tried so far (if anything in the description)
3. What the urgency/priority level is

Write in a professional, concise tone suitable for a service agent picking up this case.
```

**Speaker Notes:** "This is a well-structured prompt. Notice the pattern: you tell the AI who it is and what it's doing. You provide structured context using merge fields. You give clear output instructions — 2-3 sentences, three specific points to cover. You specify the tone. The more specific your instructions, the more consistent the output. A vague prompt like 'summarize this case' will give inconsistent results. A structured prompt like this gives reliable, professional output every time."

---

### Slide 12: Exam Summary — Prompt Builder Quick Reference
**Visual:**
```
   PROMPT BUILDER — EXAM REFERENCE

   ┌──────────────────────────┬────────────────────────────────────┐
   │  CONCEPT                 │  KEY POINT                         │
   ├──────────────────────────┼────────────────────────────────────┤
   │ What is it               │ Low-code tool to build AI prompts  │
   │                          │ for Salesforce features            │
   ├──────────────────────────┼────────────────────────────────────┤
   │ Template Types           │ Field Generation, Flex, Record     │
   │                          │ Summary, Sales Email               │
   ├──────────────────────────┼────────────────────────────────────┤
   │ Merge Fields             │ {!$Record.FieldName} pulls live    │
   │                          │ CRM data into prompt at runtime    │
   ├──────────────────────────┼────────────────────────────────────┤
   │ Trust Layer              │ Always active — masking, ZDR,      │
   │                          │ grounding, toxicity, audit         │
   ├──────────────────────────┼────────────────────────────────────┤
   │ Who creates templates    │ Admins (no code required)          │
   ├──────────────────────────┼────────────────────────────────────┤
   │ Where used               │ Any Salesforce cloud/product       │
   └──────────────────────────┴────────────────────────────────────┘
```
**Content:**

| Template Type | Use Case | Output Location | Exam Trigger Words |
|---|---|---|---|
| Field Generation | Auto-fill a specific field | Writes to the record field | "populate," "fill in," "field" |
| Record Summary | Summarize a complete record | Display panel (read-only) | "summarize," "overview," "at a glance" |
| Sales Email | Draft personalized emails | Email composer | "email," "outreach," "follow-up" |
| Flex | Custom/programmatic use | Anywhere via Flow/Apex | "automated," "batch," "custom component" |

**Trust Layer reminder:** Always between your data and the LLM
**Merge fields:** Resolve BEFORE prompt is sent to LLM

**Speaker Notes:** "This table is your exam cheat sheet for Prompt Builder questions. Read the scenario, find the trigger word, match to the template type. The Trust Layer and merge fields are additional detail questions — know that masking happens BEFORE the LLM call, and merge fields use {!Record.FieldName} syntax."

---

## RECORDING SCRIPT

[Opening — 0:00-2:00]

"I want to start with a story about a sales rep I'll call Marcus. Marcus works at a software company. He has 80 open opportunities. Every Monday, his manager asks him to send follow-up emails to every opportunity that's been sitting without activity for more than two weeks. Marcus dreads this task. He opens each opportunity, reads the history, thinks about what to say, types an email, personalizes it, sends it. Multiply that by 15 stale opportunities — that's easily 2-3 hours every Monday morning.

With Prompt Builder and Sales Email templates? Marcus clicks a button on each opportunity. A personalized email draft appears — it already knows the account name, the deal stage, the last activity, what product they're considering. Marcus reads it, tweaks one line, sends it. Fifteen follow-ups in 20 minutes instead of 3 hours.

That's Prompt Builder in the real world. It's not magic — it's a well-designed template that pulls real data from your CRM and sends it to an LLM with smart instructions. The result feels like individually crafted outreach. Let's learn how to build it."

[Template types explanation — 2:00-8:00]

"Prompt Builder has four template types, and knowing which one to use is the main thing the exam tests. Let me explain each one with a distinct real-world analogy.

Field Generation is like autocomplete on steroids. You know how your phone suggests the next word when you're texting? Field Generation does that for Salesforce fields, but much smarter. You've got a Product record, and the 'Product Description' field is empty. You click 'Generate.' The AI looks at the product name, the category, the key features — all from other fields on that same record — and writes a professional product description. It writes INTO the field. The user reviews it, edits if needed, saves. That's Field Generation: output goes directly into a specific field.

Record Summary is your smart briefing document. Before a big customer meeting, you open the account record and click 'Summarize.' Einstein reads the account details, the last 10 activities, the open opportunities, the recent cases — all of it — and generates a paragraph: 'Acme Corp is a tier-1 account in Manufacturing with $500K ARR. Their renewal is in 90 days. The last QBR revealed concerns about API performance that are currently being addressed in Case 00045231.' You didn't write that — the AI synthesized it from your CRM data in 3 seconds. Output is a display panel, not a field.

Sales Email is exactly what it sounds like — it generates email drafts. This is what users see when they click 'Draft with Einstein' in the email activity panel. The template you configure in Setup pulls the contact's name, the account, the deal stage, whatever context you configure, and generates a personalized first draft. The user edits and sends.

Flex is the escape hatch — it's for use cases that don't fit the other three. You call it from a Salesforce Flow or Apex code. You're building a custom dashboard component? A nightly batch process? Something automated that runs without a human clicking a button? That's Flex territory."

[Merge fields — 8:00-12:00]

"Let me spend a moment on merge fields because they're fundamental to understanding how Prompt Builder works.

A merge field is a placeholder in your prompt template that gets replaced with actual data before the prompt runs. The syntax looks like: {!$Record.Name} or {!$Record.Account.Industry}. When a user triggers the template, Salesforce reads the current record they're looking at, extracts the values for every merge field you've used, and substitutes them into the prompt text.

So your template might say: 'Write a follow-up email for {!$Record.Name}, a {!$Record.Title} at {!$Record.Account.Name}. They are considering {!$Record.Opportunity__c} worth {!$Record.Amount}. Their last interaction with us was {!$Record.LastActivityDate}.'

When Sarah Johnson, VP of Operations at Acme Corp, opens her contact record and triggers that template, the LLM actually sees: 'Write a follow-up email for Sarah Johnson, a VP of Operations at Acme Corp. They are considering the Enterprise License Renewal worth $85,000. Their last interaction with us was February 15, 2025.'

That's a completely personalized, contextually rich prompt. The LLM doesn't need to know anything about Sarah or Acme — you've given it all the context via merge fields. And here's the critical point for the exam: this data substitution happens BEFORE the prompt reaches the LLM. The merge fields are resolved first. Then the complete, data-populated prompt goes through the Trust Layer. Then it reaches the LLM. This sequence matters for understanding both how Prompt Builder works and how the Trust Layer protects your data."

[Trust Layer in Prompt Builder — 12:00-15:30]

"The Trust Layer is Salesforce's privacy and security architecture that sits between your CRM data and any external LLM. In the context of Prompt Builder, here's what it does and why it's revolutionary for enterprise AI adoption.

After merge fields are resolved — so now your prompt has real customer names, account values, personal data in it — the Trust Layer intercepts that prompt. It scans for personally identifiable information: names, email addresses, phone numbers, company-specific identifiers. It replaces them with anonymized tokens. Sarah Johnson becomes Person_A. Acme Corp becomes Company_B. The contract value might be rounded or tokenized.

This anonymized prompt goes to the LLM. The LLM generates a response using the anonymized tokens. The Trust Layer receives the response, substitutes the real values back in, and shows the user a personalized, real response.

From the user's perspective: nothing changed. They see 'Dear Sarah Johnson, I wanted to follow up on your Enterprise License Renewal at Acme Corp.' From the LLM's perspective: it never processed Sarah Johnson's real identity.

Why does this matter enormously? Because enterprise companies — banks, healthcare providers, insurance companies, government agencies — have strict regulations about where customer data can go. GDPR in Europe. HIPAA in healthcare. Many of these organizations flat-out cannot send customer PII to a third-party API server. The Trust Layer makes Prompt Builder usable for these organizations because the real PII never leaves Salesforce's infrastructure.

For the exam, know three things about the Trust Layer and Prompt Builder: one, masking/anonymization happens before the LLM call. Two, Salesforce does NOT use your org's data to retrain its LLMs. Three, all AI generations are audit-logged for compliance."

[Demo walkthrough — 15:30-19:00]

"Let me walk you through building that Case Summary template I showed you in the slides. Even if you don't have a sandbox in front of you right now, follow the steps — this process appears on the exam.

You start in Salesforce Setup. Search 'Prompt Builder' in Quick Find. Open it. Click New Prompt Template. First decision: template type. You want to summarize a Case record for a service agent to read — that's Record Summary. Select it.

Next: choose your object. You're working with Cases, so select Case.

Give it a name: 'Case Summary for Service Agents.' Add a description so other admins know what it does.

Now you're in the template editor. This is where you write your prompt. You're writing instructions for the LLM, plus merge fields for the CRM data. A good pattern: start with a system instruction ('You are a helpful assistant...'), then provide structured data using merge fields, then give specific output instructions.

Click the field picker to browse available merge fields. You can pull from the Case object directly — CaseNumber, Subject, Status, Priority, Description — and from related objects like Account.Name. Drag and drop them into your prompt, or type the merge field syntax manually.

Once your prompt is written, click Preview. This is powerful — you search for an actual Case in your org and see the fully resolved, AI-generated output using that real record's data. You can test it, iterate on the prompt, and refine.

When you're happy with the output, click Activate. Then go to Lightning App Builder for the Case page, find the 'Einstein Record Summary' component, drag it onto the page, set it to use your template, and save.

Now every service agent who opens a Case sees your Einstein summary component. They click 'Generate Summary' and get a professional, data-populated case brief in seconds.

Total setup time for this: maybe 30 minutes for an experienced admin. No coding required."

[Closing — 19:00-20:00]

"Prompt Builder is one of the most practical tools in the Salesforce AI toolkit because it gives any admin the ability to build AI-powered content generation without writing a line of code. The four template types cover the most common content generation use cases. Merge fields make every output personalized to the specific record. The Trust Layer ensures enterprise data stays protected.

For the exam: know the four types, know when to use each, know that the Trust Layer masks data before the LLM call, and know that merge fields are resolved before the prompt goes to the LLM.

Next lecture we're getting into Prediction Builder — the no-code tool for building your own predictive AI models. Let's go."

---

## EXAM TIPS
- Four template types to memorize: Field Generation (writes to a field), Record Summary (displays summary), Sales Email (email drafts), Flex (custom/programmatic).
- Flex template is used in Flows and Apex — it's the most flexible but requires technical integration.
- Merge fields use {!$Record.FieldName} syntax and are resolved BEFORE the prompt goes to the LLM.
- The Trust Layer masks PII BEFORE the prompt reaches the LLM — the LLM never sees real customer data.
- Salesforce does NOT use your org's data to retrain its LLMs (a common misconception the exam tests).
- Prompt Builder is in Salesforce Setup — it's an admin-configured tool, not something end users build.
- Record Summary creates a READ-ONLY display component. Field Generation writes to a specific field. Know the difference.

---

## LECTURE SUMMARY
- Prompt Builder lets admins create reusable generative AI templates that pull live CRM data via merge fields
- Four template types: Field Generation, Record Summary, Sales Email, Flex — each for different use cases
- Merge fields ({!$Record.FieldName} syntax) are resolved into real CRM data before the prompt goes to the LLM
- The Trust Layer intercepts resolved prompts, masks PII, sends anonymized text to the LLM, then re-inserts real data
- Prompt Builder templates are configured in Salesforce Setup (Setup → Prompt Builder)
- The preview feature allows testing with live records before activating a template

---

## MINI QUIZ

**Question 1:**
A Salesforce admin wants to build a feature that automatically generates a one-paragraph product description into the "Description__c" field on Product records. Reps should be able to click a button on the record to trigger the generation. Which Prompt Builder template type should the admin use?

A) Record Summary  
B) Sales Email  
C) Field Generation  
D) Flex

**Answer: C — Field Generation**

*Explanation:* Field Generation is specifically designed to generate content that is written directly into a specific field on a record. The scenario describes: (1) generating content for a specific field (Description__c), (2) triggered by a button click, (3) output goes into the record field. That is the exact definition of Field Generation. Record Summary generates a display panel summary, not content for a specific field. Sales Email generates email drafts. Flex is for programmatic/custom use cases. "Auto-populate a specific field" = Field Generation.

---

**Question 2:**
In Salesforce Prompt Builder, when does the Trust Layer apply its data masking to the prompt?

A) Before merge fields are resolved, to prevent PII from entering the template  
B) After merge fields are resolved and before the prompt is sent to the LLM  
C) After the LLM generates its response, before displaying to the user  
D) Only when the admin enables masking in the template settings

**Answer: B — After merge fields are resolved and before the prompt is sent to the LLM**

*Explanation:* The process sequence is: (1) merge fields resolve — real data is substituted into the template, (2) Trust Layer masks PII in the now-data-populated prompt, (3) anonymized prompt is sent to the LLM, (4) LLM responds with anonymized output, (5) Trust Layer re-inserts real data, (6) final output displays to user. The masking happens at step 2 — after resolution but before the LLM receives the data. Option A is wrong because merge fields must resolve first for the Trust Layer to know what PII exists. Option C is wrong because the masking protects what the LLM receives, not what the user sees. Option D is wrong — masking is always applied, not optional.

---

**Question 3:**
A company wants to use Prompt Builder to generate weekly account review summaries as part of an automated overnight batch process. No user will click a button — the process should run automatically for all strategic accounts at 2 AM every Sunday. Which template type is MOST appropriate?

A) Record Summary  
B) Sales Email  
C) Field Generation  
D) Flex

**Answer: D — Flex**

*Explanation:* The Flex template type is designed for programmatic, non-standard use cases — including automated batch processes. This scenario requires the prompt to be triggered by a Scheduled Flow (not a user clicking a button), running across multiple records automatically. The Flex template can be called from a Salesforce Flow action, making it the correct choice for automated, scheduled execution. Record Summary generates summaries but is designed for user-triggered display components. Field Generation writes to a specific field but is button-triggered. Sales Email is for email drafting. Automation without user interaction = Flex template called from a Flow.
