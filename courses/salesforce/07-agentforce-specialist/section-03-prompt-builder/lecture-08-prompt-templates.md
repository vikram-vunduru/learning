# Lecture 08: Prompt Builder Overview and Template Types

## Learning Objectives
- Explain the purpose of Prompt Builder and how it differs from writing prompts directly in Agent Instructions
- Identify all four Prompt Template types and their intended use cases: Field Generation, Flex, Record Summary, and Sales Email
- Describe the anatomy of a Prompt Template: system prompt, template body, and grounding section
- Determine which template type to use for a given business requirement
- Explain how Prompt Templates are tested and previewed before deployment

## Slides

### Slide 1: What is Prompt Builder?
**Visual:**
```
  Setup → Einstein → Prompt Builder

  ┌──────────────────────────────────────────────────────────────────┐
  │                        PROMPT BUILDER UI                         │
  ├────────────────┬───────────────────────────┬─────────────────────┤
  │ TEMPLATE       │  TEMPLATE EDITOR          │  PREVIEW PANEL      │
  │ GALLERY        │                           │                     │
  │                │  ┌─────────────────────┐  │  Record: [Acme Inc] │
  │ ⚡ Field Gen.  │  │  System Prompt      │  │  ─────────────────  │
  │                │  │  [role/context]     │  │  Generated Output:  │
  │ ✦ Flex         │  ├─────────────────────┤  │                     │
  │                │  │  Template Body      │  │  "Acme Inc is a     │
  │ 📋 Record Sum  │  │  {!Account.Name}    │  │   mid-market tech   │
  │                │  │  {!Account.Industry}│  │   company with 3    │
  │ ✉ Sales Email  │  │  ...               │  │   open opptys..."   │
  │                │  ├─────────────────────┤  │                     │
  │ [+ New Templ.] │  │  Grounding          │  │  [Run Preview]      │
  │                │  │  (optional)         │  │  [Compare Versions] │
  └────────────────┴───────────────────────────┴─────────────────────┘

  Prompt Builder = visual editor for reusable, versioned AI prompt templates
  Governed by Einstein Trust Layer — all LLM calls use same trust infrastructure
```
**Content:**
- **Prompt Builder** is a Salesforce tool for creating, managing, and testing reusable AI prompt templates
- Accessible via Setup → Einstein → Prompt Builder (or via the App Launcher)
- Templates are **parameterized** — they contain merge fields that pull in Salesforce record data, making each AI-generated output contextually relevant to the specific record or situation
- Templates are **reusable** — a single template can be invoked from a Flow, an Agentforce Action, an LWC component, or an Apex class
- Templates are **governed** by the Einstein Trust Layer — all LLM calls from Prompt Builder go through the same trust infrastructure as Agentforce
- Purpose: move AI prompt engineering from ad-hoc to managed, versioned, reusable assets that non-developers can maintain
**Speaker Notes:** The key insight about Prompt Builder is the "managed asset" framing. Without Prompt Builder, AI prompts might be hardcoded in Apex classes or embedded in Flow Text elements — invisible to business users, hard to update, and impossible to test in isolation. Prompt Builder gives prompts a first-class home in the Salesforce platform: they are versioned, testable, configurable by admins, and reusable across multiple contexts. For the exam, understand Prompt Builder's role as the platform layer for managing prompt templates, distinct from the ad-hoc prompting that happens inside Agent Instructions.

### Slide 2: Prompt Template Anatomy
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │  SECTION 1 — SYSTEM PROMPT  (gray background)                    │
  │  "Sets the AI's role and context — applies to every invocation"  │
  │                                                                  │
  │  "You are a professional sales email writer with expertise in    │
  │   Acme Corp's product line. Write concise, compelling emails     │
  │   that focus on customer value."                                 │
  ├──────────────────────────────────────────────────────────────────┤
  │  SECTION 2 — TEMPLATE BODY  (white background)                   │
  │  "Main prompt with merge fields — evaluated per record"          │
  │                                                                  │
  │  "Write a follow-up email to {!Contact.Name} at                  │
  │   {!Account.Name}. Their most recent opportunity:                │
  │   {!Opportunity.Name} worth {!Opportunity.Amount}.               │
  │   Reference the meeting we had about their challenges."          │
  │                                                                  │
  │  Merge fields are resolved at runtime with actual field values   │
  ├──────────────────────────────────────────────────────────────────┤
  │  SECTION 3 — GROUNDING  (purple background, optional)            │
  │  "Retrieve relevant content before generating"                   │
  │                                                                  │
  │  Grounding Source: [ Einstein Knowledge ▼ ]                      │
  │  Search Query: {!Case.Subject}  ◀── dynamic query per record     │
  └──────────────────────────────────────────────────────────────────┘
```
**Content:**
- **System Prompt** — sets the AI's role and behavior for this template; analogous to the system message in a direct LLM API call; applies globally to every invocation of this template
  - Example: "You are an expert case handler for Acme Corp's Technical Support team. Your summaries should be clear, accurate, and actionable."
- **Template Body** — the main prompt content with merge fields in the format `{!ObjectName.FieldName}`
  - Merge fields are evaluated at runtime — the actual field value is substituted before the prompt is sent to the LLM
  - Multiple objects can be merged; related records can be traversed (e.g., `{!Case.Account.Name}`)
- **Grounding Section** (optional) — specifies a knowledge source to retrieve context for this prompt; adds retrieved content to the prompt context
**Speaker Notes:** The three-section anatomy mirrors how professional prompt engineers structure their prompts. The system prompt establishes context and role — this is high-leverage because the LLM's behavior is significantly shaped by its assigned role. The body is the actual task instruction with dynamic data. Grounding adds verified source material. For the exam, understanding which section does what is important: adding a behavioral rule to a template → System Prompt. Making the output reference a specific record's data → merge fields in Template Body. Making the output reference a Knowledge article → Grounding section.

### Slide 3: Template Type 1 — Field Generation
**Visual:**
```
  Account Record Page
  ┌────────────────────────────────────────────────────────────────┐
  │  Account: Acme Inc                                [Edit]       │
  ├────────────────────────────────────────────────────────────────┤
  │  Industry:    Technology                                       │
  │  Annual Rev:  $5M                                              │
  │  Open Opptys: 3                                                │
  │                                                                │
  │  AI Executive Summary:                  [Generate] ◀── button │
  │  ┌──────────────────────────────────────────────────────────┐  │
  │  │ (After clicking Generate...)                             │  │
  │  │ "Acme Inc is a mid-market technology company with        │  │
  │  │  $5M annual revenue and 3 active opportunities. Key      │  │
  │  │  contact is Jane Smith (VP Sales). Most recent           │  │
  │  │  interaction was a demo call on Nov 15..."               │  │
  │  └──────────────────────────────────────────────────────────┘  │
  │    ✓ Saved to AI_Executive_Summary__c field                     │
  └────────────────────────────────────────────────────────────────┘

  The generated value IS SAVED to the Salesforce record field
```
**Content:**
- **Field Generation** templates populate a single Salesforce field with AI-generated content
- The generated value is written directly into the Salesforce record — it is saved data, not a transient display
- Access: triggered by a button on a record page (LWC component) or via a Flow or Apex call
- Common use cases:
  - Auto-generating an Account Executive Summary from opportunity and contact data
  - Generating a lead qualification score rationale from activity data
  - Writing an auto-populated case title or description from email subject and body
  - Creating personalized product recommendations based on customer attributes
- **When to use:** you want AI-generated content stored persistently on a record; the output is a field value, not a transient experience
- **Template association:** linked to a specific SObject type; merge fields pull from that object and its related records
**Speaker Notes:** Field Generation is the most "admin-friendly" template type because it integrates with record pages via a simple Generate button. A Salesforce Admin can configure this entirely without developer involvement if they know how to set up an LWC component with the standard Prompt Builder trigger pattern. For the exam, the key identifier for Field Generation is "populate a field on a record with AI-generated content" or "save AI-generated text to a Salesforce record."

### Slide 4: Template Type 2 — Flex Template
**Visual:**
```
  SAME FLEX TEMPLATE — THREE INVOCATION CONTEXTS

  ┌──────────────────────────────────────────────────────────────┐
  │                    Flex Template                             │
  │  "Generate a case escalation summary for {!caseContext}"     │
  └──────────────┬──────────────────┬───────────────────────────┘
                 │                  │                  │
                 ▼                  ▼                  ▼
          From a Flow         From Apex          As Agentforce
          (automation step)   (programmatic)     Action (agent)
                 │                  │                  │
                 ▼                  ▼                  ▼
          Generated text     Generated text     Atlas receives
          used in next       returned as        generated text,
          Flow element       String variable    includes in reply

  "Same template, multiple contexts"
  No UI dependency — invokable from any Salesforce context

  Use for Agentforce Actions: Flex is the ONLY type that can
  be wired to an agent Topic as a Prompt Template Action
```
**Content:**
- **Flex templates** are the most versatile template type — they can be invoked from any Salesforce context: Flow, Apex, Agentforce Action, or API
- "Flex" refers to their flexible invocation model — there is no specific record page or UI pattern required
- Common use cases:
  - AI content generation within a Flow (e.g., generate a case escalation summary during an automation)
  - Producing AI output in Apex for further processing or saving to multiple fields
  - Serving as an Agentforce Action that generates content in response to a customer request
  - Any use case where the generated content needs to be consumed programmatically
- **When to use:** you need AI generation in a non-UI context, or you want the same template accessible from multiple different execution contexts
- Most general-purpose; highest developer flexibility; preferred for Agentforce Action integration
**Speaker Notes:** Flex templates are the go-to type for Agentforce Action integration because they do not have a UI dependency. When you connect a Prompt Template to an Agentforce Action (which we will cover in Lecture 10), you will typically use a Flex template. The other template types (Field Generation, Record Summary, Sales Email) are more purpose-built for specific UI contexts. For the exam, "which template type can be used as an Agentforce Action?" — Flex.

### Slide 5: Template Type 3 — Record Summary
**Visual:**
```
  Case Record Page
  ┌─────────────────────────────────────────────────────────────────┐
  │  Case #12345: "Cannot access account portal"         [Edit]     │
  ├─────────────────────────────────────────────────────────────────┤
  │                                                                 │
  │  [Generate Summary] ◀── user clicks to refresh                 │
  │                                                                 │
  │  ┌─────────────────────────────────────────────────────────┐   │
  │  │  AI SUMMARY (displayed in UI, NOT saved to record)      │   │
  │  │  ─────────────────────────────────────────────────────  │   │
  │  │  Customer John Smith at Acme Inc has been unable to     │   │
  │  │  access the customer portal for 3 days. Previous agent  │   │
  │  │  reset password twice without resolution. Account is    │   │
  │  │  on Enterprise plan with SLA priority...                │   │
  │  └─────────────────────────────────────────────────────────┘   │
  │                                                                 │
  │  ✗ NOT saved to any field — refreshes on demand                │
  │  ✓ Always fresh when generated                                  │
  │  ✓ Human reads it, then acts                                    │
  └─────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Record Summary** templates generate a contextual AI summary of a Salesforce record and display it within the record page UI
- The summary is **transient** — it is displayed on-screen but not saved back to the record (unlike Field Generation)
- Rendered via a standard Prompt Builder summary component embedded on the record page layout
- Common use cases:
  - Case summary for a service rep who needs to quickly understand case history before a call
  - Opportunity briefing for a sales rep before a meeting (account, contacts, open activities, recent interactions)
  - Account summary for a new rep taking over a territory
  - Lead summary showing all activity and engagement data at a glance
- **When to use:** you want AI summarization displayed in the UI for human consumption — not stored, not automated, but shown to the user as a reading aid
**Speaker Notes:** Record Summary is the most "human-in-the-loop" template type — it generates on demand when a user needs a quick briefing, not as part of an automated process. The transient nature (not saved) is both a feature and a limitation: it means the summary is always fresh and current, but it also means it cannot be referenced by an Agentforce agent or automation. For the exam, the key identifier is "display an AI summary on a record page for a user to read" — if the output is displayed for a human, not used by a system, think Record Summary.

### Slide 6: Template Type 4 — Sales Email
**Visual:**
```
  CRM Email Compose Window
  ┌────────────────────────────────────────────────────────────────┐
  │  To:      jane.smith@acme.com                                  │
  │  Subject: Follow-up: Demo discussion                           │
  │  ─────────────────────────────────────────────────────────     │
  │  [AI-Assist] ◀── click to generate draft                      │
  │  ─────────────────────────────────────────────────────────     │
  │  Hi Jane,                                                      │
  │                                                                │
  │  Thank you for taking the time to meet with us yesterday to    │
  │  discuss Acme's expansion plans. Based on our conversation     │
  │  about your Q1 goals, I wanted to share...                     │
  │                                                                │
  │  [AI draft appears here for rep to review and edit]            │
  │                                                                │
  │  Best regards, [Sales Rep]                                     │
  │  ─────────────────────────────────────────────────────────     │
  │  [Edit draft] [Send] [Discard]                                 │
  └────────────────────────────────────────────────────────────────┘
  ✓ Rep reviews and approves BEFORE sending (not autonomous)
  Distinct from SDR Agent: Sales Email = draft for human; SDR = sends autonomously
```
**Content:**
- **Sales Email** templates generate personalized sales email drafts within the Salesforce email compose experience
- Integrated with the Send Email action in Lightning Experience — the AI draft is placed directly in the compose window for the rep to review and send
- Common use cases:
  - Post-meeting follow-up email personalized with meeting topics discussed
  - Re-engagement email for a stale opportunity
  - New lead outreach email based on lead source and interests
  - Renewal reminder email using contract and subscription data
- **When to use:** you want AI-assisted email drafts within the standard Salesforce email experience; the output is a draft for human review and sending, not autonomous email delivery
- Note: Sales Email templates are distinct from the SDR Agent's autonomous email capability — Sales Email generates a draft for human review; the SDR Agent can send autonomously
**Speaker Notes:** The distinction between Sales Email templates (draft for human review) and the SDR Agent's email Actions (autonomous sending) is an important exam trap to avoid. Sales Email is always human-in-the-loop — the AI generates, the rep approves and sends. The SDR Agent can send emails autonomously as part of the lead qualification workflow. If an exam question asks "which feature generates an email draft for a sales rep to review in the Salesforce email composer" — Sales Email template. "Which feature autonomously sends outreach emails to inbound leads" — SDR Agent.

### Slide 7: Testing Templates in Prompt Builder
**Visual:**
```
  Prompt Builder — Preview / Test Panel

  ┌────────────────────────────────────────────────────────────────┐
  │  Select Test Record:  [ Account: Acme Inc ▼ ] [Run Preview]   │
  │  ────────────────────────────────────────────────────────      │
  │  Merge Fields Resolved:                                        │
  │  {!Account.Name}    → "Acme Inc"                ✓             │
  │  {!Account.Industry}→ "Technology"              ✓             │
  │  {!Account.AnnualRev}→ "$5,000,000"             ✓             │
  │  {!Account.Owner.Name}→ "Sarah Jones"           ✓             │
  │  {!Account.Foo__c}  → [EMPTY — field not set]   ⚠ check this  │
  │  ────────────────────────────────────────────────────────      │
  │  Generated Output:                                             │
  │  "Acme Inc is a technology company generating $5M in          │
  │   annual revenue, owned by Sarah Jones. Three active           │
  │   opportunities are in pipeline..."                           │
  │  ────────────────────────────────────────────────────────      │
  │  [Test with another record]  [Compare versions]               │
  └────────────────────────────────────────────────────────────────┘

  Test with 5+ varied records including edge cases:
  · Records with missing fields
  · Records with very long content
  · Records with unusual characters or data
  Preview uses real LLM calls — consumes AI credits
```
**Content:**
- Every template type has a built-in **Preview/Test panel** in Prompt Builder
- Testing process:
  1. Select a **real Salesforce record** of the template's target object type (e.g., select a specific Account for an Account summary template)
  2. Click **Run Preview** — the merge fields are resolved with actual record data and the full prompt is sent to the LLM
  3. Review the generated output — does it meet quality expectations? Is the tone correct? Are the merge fields resolving correctly?
  4. Adjust the template (system prompt, body, merge fields) and re-run
- **Test with multiple records** — edge cases matter; test with records that have missing fields, unusual characters, very long content
- **Template versioning** — save the template as a Draft while iterating; only Activate when it meets quality standards
- The preview sends a real LLM call — it consumes AI credits and should be used judiciously
**Speaker Notes:** Testing in Prompt Builder before deploying to production is non-negotiable. The most common template quality issues are: merge fields that resolve to empty strings (field not populated on the record), system prompts that are too generic (producing poor-quality output), and templates that work for typical records but fail for edge cases. Use records that represent your real distribution — don't only test with the best-case, most-complete records. For the exam, know that the preview uses real record data (not mocked data), sends a real LLM call, and is the primary testing mechanism before template activation.

### Slide 8: Choosing the Right Template Type
**Visual:**
```
  What do you need the template to do?
              │
    ┌─────────┴──────────────────────────────┐
    │                                        │
    ▼                                        ▼
  Save AI content               Display summary to user
  to a record field?            without saving?
    │                                        │
   Yes                                      Yes
    │                                        │
    ▼                                        ▼
  FIELD GENERATION              RECORD SUMMARY
  (stored in field,             (transient on-screen,
   triggered by button)          not saved to record)

  Generate email draft          Invoke from Flow/
  in compose window?            Apex/Agentforce?
    │                                        │
   Yes                                      Yes
    │                                        │
    ▼                                        ▼
  SALES EMAIL                   FLEX TEMPLATE
  (draft for rep review,        (any context, no UI
   not autonomous)               dependency, use for
                                  Agentforce Actions)

  ┌──────────────────┬──────────────┬──────────┬──────────────┐
  │ Template Type    │ Output Dest  │  Saved?  │ Primary User │
  ├──────────────────┼──────────────┼──────────┼──────────────┤
  │ Field Generation │ Record field │  Yes     │ Record users │
  │ Flex             │ Any context  │  Depends │ Devs/Agents  │
  │ Record Summary   │ Record UI    │  No      │ Record users │
  │ Sales Email      │ Email compose│  No      │ Sales reps   │
  └──────────────────┴──────────────┴──────────┴──────────────┘
```
**Content:**
| Template Type | Output Destination | Saved? | Primary User |
|---------------|-------------------|--------|-------------|
| Field Generation | Salesforce record field | Yes | Record page users |
| Flex | Any (Flow, Apex, Agent, API) | Depends | Developers, Agents |
| Record Summary | Record page UI panel | No | Record page users |
| Sales Email | Email compose window | No (until sent) | Sales reps |

- When in doubt about Agentforce integration: **Flex template**
- When saving AI content to a record field: **Field Generation**
- When displaying a summary to a user without saving: **Record Summary**
- When generating an email draft for a rep: **Sales Email**
**Speaker Notes:** This table is your exam quick-reference for template type questions. The most common exam mistake is confusing Record Summary (transient display) with Field Generation (stored in the field). The question will describe either "displays a summary on the record page" (Record Summary) or "stores the AI-generated text in the field" (Field Generation) — the storage behavior is the differentiator. For Agentforce integration, the answer is almost always Flex — it is the general-purpose, versatile type designed for programmatic invocation.

## Recording Script
Prompt Builder is Salesforce's tool for creating and managing reusable AI prompt templates. It sits alongside Agentforce but serves a different purpose: rather than building an autonomous agent, you are building parameterized AI content generation templates that can be triggered from a record page, a Flow, an Apex class, or an Agentforce Action.

Every Prompt Template has three sections. The System Prompt sets the AI's role and behavior — "you are a professional case handler writing concise summaries for service reps." The Template Body contains the actual task instruction with merge fields — dynamic placeholders that pull real Salesforce record data. When the template runs, merge fields are replaced with actual field values before the prompt reaches the LLM. The optional Grounding section connects the template to a knowledge source.

Salesforce provides four template types. Field Generation stores the AI output in a Salesforce record field — clicking "Generate" on a record page populates the field with AI-generated content. Record Summary displays an AI-generated briefing on the record page for a user to read — it is transient, not saved. Sales Email generates an email draft directly in the Salesforce email compose window — the rep reviews and sends. Flex templates are the most versatile: they can be invoked from anywhere — Flow, Apex, Agentforce Actions, API — with no UI dependency.

For Agentforce integration, the relevant type is Flex. When you add a Prompt Template Action to an agent Topic, you will typically point it at a Flex template.

Testing in Prompt Builder is critical. Use the built-in preview panel, pick real Salesforce records, run the preview, and review the output. Test with edge-case records — records with missing fields, unusual data. Only activate a template when it consistently produces quality output.

The four types exist because different use cases need different delivery mechanisms. Knowing which type fits which scenario is the key exam skill for this section.

## Exam Tips
- Four template types: Field Generation (saves to field), Flex (invoke from anywhere, best for Agentforce), Record Summary (transient display on record page), Sales Email (email draft in compose window)
- Flex template is the type used for Agentforce Actions — it has no UI dependency and can be invoked programmatically
- Field Generation vs Record Summary: Field Generation saves output to the record field; Record Summary displays transient on-screen — the saved/transient distinction is the exam differentiator
- Template anatomy: System Prompt (role/context, applies globally), Template Body (task instruction with merge fields), Grounding (optional knowledge source)
- Testing: Prompt Builder preview uses real Salesforce record data and real LLM calls — always test with multiple records including edge cases before activating

## Lecture Summary
Prompt Builder is Salesforce's platform for creating, testing, and deploying reusable AI prompt templates. Every template has three sections: System Prompt (role/context, applies to all invocations), Template Body (task instruction with merge fields `{!Object.Field}` for dynamic record data), and optional Grounding (knowledge source for RAG). Four template types address different needs: Field Generation (stores AI output in a record field, triggered by a Generate button), Flex (versatile, invokable from Flow/Apex/Agentforce/API, no UI dependency), Record Summary (transient AI briefing displayed on record page, not saved), and Sales Email (AI email draft in the Salesforce email compose window). Flex is the template type used for Agentforce Action integration. Templates are tested using Prompt Builder's built-in preview panel with real Salesforce records before activation.

## Mini Quiz

**Q1:** A sales operations team wants to add an AI-generated account overview to every Account record — the content should be saved to a custom "AI_Overview__c" field on the Account object and updated on demand via a button on the record page. Which Prompt Template type should they use?
A) Record Summary
B) Flex
C) Field Generation
D) Sales Email
**Answer:** C — Field Generation is the template type that saves AI-generated content to a Salesforce record field. The "save to a custom field" and "triggered by a button on record page" indicators both point to Field Generation. Record Summary displays content transiently without saving. Flex does not natively integrate with the "save to field" pattern through a record page button. Sales Email is for email drafts.

**Q2:** A developer wants to connect a Prompt Template to an Agentforce Topic as an Action — so the agent can invoke the template to generate a personalized response when a customer asks for a product recommendation. Which template type should the developer use?
A) Record Summary
B) Field Generation
C) Sales Email
D) Flex
**Answer:** D — Flex templates are designed for programmatic invocation from any context including Agentforce Actions. They have no UI dependency and can accept input parameters, making them ideal for dynamic content generation invoked by an agent. Record Summary and Field Generation have specific UI integration patterns that do not fit agent Action invocation. Sales Email integrates with the email compose UI.

**Q3:** While testing a Record Summary template in Prompt Builder, a developer selects a Case record to preview but notices that the {!Case.Contact.Email} merge field is showing as empty in the generated output. What is the most likely cause?
A) Record Summary templates do not support related object traversal in merge fields
B) The Contact associated with the Case record does not have an Email field populated, or the Case has no Contact linked
C) Merge fields in Prompt Builder must use the field API name in uppercase
D) The Contact.Email field is restricted by Field-Level Security for the previewing user
**Answer:** B — When a merge field resolves to empty, it means either the related record does not exist (Case has no Contact linked) or the field value is blank on the existing related record. The developer should inspect the Case record being used for testing and verify that a Contact is linked and that the Contact has an Email value. Option D (FLS) is plausible but secondary — check data completeness first. All template types support related object traversal. Merge field API names are case-insensitive in Prompt Builder.
