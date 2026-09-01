# Lecture 09: Merge Fields, Grounding Sources, and Template Deployment

## Learning Objectives
- Write merge field expressions for standard fields, custom fields, related objects, and formula-derived values
- Configure grounding sources within a Prompt Template, including Data Cloud objects and Salesforce records
- Use the Prompt Builder test panel effectively, including testing with multiple records and interpreting results
- Promote Prompt Templates from sandbox to production using change sets or Salesforce DX
- Identify common merge field errors and how to resolve them

## Slides

### Slide 1: Merge Fields — Syntax and Scope
**Visual:**
```
  MERGE FIELD SYNTAX REFERENCE

  Base format:   {!ObjectName.FieldName}
                   ↑                ↑
                 Note the !      Exact API name
                 required

  ┌──────────────────────────────────────────────────────────────┐
  │  Type              │ Example                  │ Resolves to  │
  ├──────────────────────────────────────────────────────────────┤
  │ Standard field     │ {!Account.Name}           │ "Acme Inc"  │
  │ Standard field     │ {!Case.Status}            │ "Open"      │
  │ Custom field       │ {!Account.Loyalty_Tier__c}│ "Gold"      │
  │ Related obj (1 up) │ {!Case.Account.Name}      │ "Acme Inc"  │
  │ Related obj (2 up) │ {!Opp.Account.BillingCity}│ "San Jose"  │
  └──────────────────────────────────────────────────────────────┘

  COMMON MISTAKES:
  ✗ Missing !:    {Account.Name}       → will not resolve
  ✗ Wrong case:   {!account.name}      → may fail on some objects
  ✗ Null traverse:{!Case.Account.Name} → empty if Case.Account is null
  ✗ Wrong suffix: {!Account.Tier}      → use {!Account.Loyalty_Tier__c}
```
**Content:**
- **Merge field syntax:** `{!ObjectName.FieldName}` — note the exclamation point is required
- **Standard fields:** `{!Account.Name}`, `{!Case.Status}`, `{!Contact.Email}`
- **Custom fields:** Use the API name including `__c` suffix: `{!Account.Loyalty_Tier__c}`
- **Related object traversal:** Navigate up to 5 levels deep: `{!Case.Account.Name}`, `{!Opportunity.Account.BillingCity}`
- **Cross-object limitations:** Not all relationships can be traversed; junction objects and complex lookups may require pre-processing in a Flow that feeds the template
- **Null handling:** If a merge field resolves to null (related record doesn't exist, field is empty), the template receives an empty string — build instructions to handle this: "If no data is available for a field, note that information is not available rather than fabricating"
- **Formula fields:** Standard formula fields on objects are accessible via their API name
**Speaker Notes:** Merge fields in Prompt Builder work very similarly to merge fields in Salesforce email templates or Flows — the same `{!Object.Field}` syntax with the same traversal rules. The most common debugging task in Prompt Builder testing is tracing why a merge field shows empty in the output. Always check: Is the field populated on the test record? Does the relationship exist? Is the API name correct (custom fields need `__c`)? Is the field accessible to the running user (FLS)? Work through these four checks in order when merge fields do not resolve.

### Slide 2: Advanced Merge Field Patterns
**Visual:**
```
  PATTERN 1: Related Lists (child record sets)
  ─────────────────────────────────────────────
  ✗ Does NOT work:   {!Account.Contacts[].Name}
  ✓ Workaround:
    Flow step → query Contacts for Account
             → format as text string:
               "Contacts: Alice Smith (VP), Bob Jones (Fin)"
             → store in field or pass as template input
             → use as merge field in template body

  PATTERN 2: Conditional Instructions
  ─────────────────────────────────────────────
  Template body can include LLM-interpreted conditions:
  "If {!Lead.Industry} is 'Financial Services', include
   a note about compliance requirements."
  The LLM interprets this — no special syntax needed

  PATTERN 3: Date Formatting
  ─────────────────────────────────────────────
  Date fields → ISO format string by default
  Add instruction: "When displaying dates, use
  Month Day, Year format (e.g., December 15, 2024)"

  PATTERN 4: Multiple SObjects (Flex templates)
  ─────────────────────────────────────────────
  A Flex template can accept multiple input SObject types,
  enabling cross-object context in one template
```
**Content:**
- **Related lists / child records:** Prompt Builder merge fields access fields on a single record and its parent lookups — they do not natively iterate over child records (e.g., list of Contacts on an Account)
  - Workaround: pre-process the list in a Flow, concatenate into a text string, store in a Text field or pass as a template parameter
- **Conditional logic in templates:** Use natural language instructions: "If {!Lead.Industry} is Financial Services, include a note about compliance requirements"
  - The LLM interprets conditional instructions — no special syntax needed
- **Date formatting:** Date fields are passed as ISO format strings; include formatting instructions: "When displaying dates, use Month Day, Year format (e.g., December 15, 2024)"
- **Long text fields:** Rich text fields and long text areas are truncated to a character limit before being sent; verify character limits do not cut off critical information
- **Multiple SObjects:** A Flex template can accept multiple input SObject types, allowing cross-object context in one template
**Speaker Notes:** The related list limitation is the most common advanced merge field issue. Developers who expect merge fields to work like SOQL JOIN queries are surprised to discover that you cannot do `{!Account.Contacts[].Name}`. The platform-standard solution is a Flow step: query the related records, build a formatted string (e.g., "Contacts: Alice Smith (VP Sales), Bob Jones (Finance Director)"), and pass that string to the template as a text input or store it in a temporary field. This is a design pattern worth memorizing for the exam.

### Slide 3: Grounding Within Prompt Templates
**Visual:**
```
  Prompt Builder — Grounding Section (expanded)

  ┌──────────────────────────────────────────────────────────────┐
  │  GROUNDING  (purple section)                                 │
  │                                                              │
  │  Grounding Source:  [ Einstein Knowledge ▼ ]                 │
  │  Search Query:      [ {!Case.Subject}     ]  ◀── merge field │
  │                      (dynamic per case — each case pulls     │
  │                       articles relevant to ITS subject)      │
  │  Top N Articles:    [ 3 ]                                    │
  │  Article Types:     [ ✓ FAQ ] [ ✓ Policy ] [ How-To ]       │
  └──────────────────────────────────────────────────────────────┘

  Template execution flow:
  ① Search query resolved: {!Case.Subject} → "Cannot log in"
  ② Knowledge search runs: finds 3 relevant articles
  ③ Retrieved articles injected into prompt context
  ④ LLM generates response from Instructions + article content
  ⑤ Output returned — grounded, not hallucinated

  Template-level grounding: always applied when template runs
  Agent-level grounding: applied when Atlas invokes the action
```
**Content:**
- Prompt Templates can include **grounding** that retrieves relevant content before the LLM generates the response
- **Grounding sources available in templates:** Einstein Knowledge, Data Cloud, Salesforce Records (related object data)
- **Search Query:** The grounding search is driven by a query — this can be a static phrase or a merge field value (e.g., the Case Subject as the search query)
- **Injection point:** Retrieved content is added to the prompt context before the LLM generates — effectively the same RAG pattern as in Agentforce Knowledge Actions
- **When to use grounding in a template (vs. in an agent action):**
  - In templates: when the content generation always needs the same type of grounding (e.g., every case summary should reference Knowledge articles)
  - In agent actions: when grounding is context-dependent and varies by conversation
- Grounded templates produce more accurate, verifiable content than ungrounded templates
**Speaker Notes:** Grounding within templates is a powerful combination — you can build a case summary template that automatically pulls the relevant Knowledge articles for that case and incorporates their guidance into the summary, without the agent needing to explicitly invoke a Knowledge Action first. For the exam, understand that grounding can happen either at the Agent Action level (Knowledge Search Action in a Topic) or within the Prompt Template itself. Both use the same RAG pattern. The choice is about where the grounding logic lives: agent-level grounding is dynamic and context-driven; template-level grounding is always applied whenever the template runs.

### Slide 4: Using Salesforce Records as Template Context
**Visual:**
```
  Template: Case Resolution Summary
  Primary Object: Case

  ┌────────────────────────────────────────────────────────────────┐
  │  RELATED OBJECTS CONFIGURATION                                 │
  ├────────────────────────────────────────────────────────────────┤
  │  Primary:  Case                                                │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │  + Account (parent lookup via Case.AccountId)           │  │
  │  │    Fields available: {!Account.Name}, {!Account.Industry}│  │
  │  │                                                         │  │
  │  │  + Contact (lookup via Case.ContactId)                  │  │
  │  │    Fields available: {!Contact.Name}, {!Contact.Phone}  │  │
  │  │                                                         │  │
  │  │  + Most Recent CaseComment (child, filter: Created Date │  │
  │  │    DESC, limit 1)                                        │  │
  │  │    Fields available: {!CaseComment.Body}                │  │
  │  └─────────────────────────────────────────────────────────┘  │
  └────────────────────────────────────────────────────────────────┘

  Each related object = 1 SOQL query at execution time
  Keep related objects reasonable — avoid over-fetching

  For complex needs (all contacts on account, all cases in 90 days)
  → still need Flow pre-processing approach
```
**Content:**
- Prompt Templates support **related object contexts** beyond simple field traversal — you can configure related records to be loaded and their fields made available as merge fields
- Configuration:
  - Primary Object: the main SObject the template is associated with (e.g., Case)
  - Related Objects: parent lookups (e.g., Account), other lookups (e.g., Contact), or child objects with filtering
- This capability handles the related list limitation for controlled cases — for example, "the most recent case comment" can be pulled as a configured related record with a sort/filter
- All related record fields become available as merge fields: `{!Account.Industry}`, `{!Contact.Phone}`, `{!CaseComment.Body}`
- Performance consideration: each related record requires a SOQL query at template execution time — keep the number of related records reasonable
**Speaker Notes:** The related record context configuration is a step up from basic merge fields and worth understanding for both the exam and real implementations. It handles the most common related-record scenario (parent lookups) natively without a pre-processing Flow step. For scenarios with more complex related record needs — like all contacts on an account, or all opportunities in the last 90 days — you still need the Flow pre-processing approach. But for controlled cases like "the Case's associated Account and Contact" or "the most recent note," related object contexts are the cleaner solution.

### Slide 5: Testing Prompt Templates Effectively
**Visual:**
```
  Testing Workflow

  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
  │ STEP 1  │   │ STEP 2  │   │ STEP 3  │   │ STEP 4  │   │ STEP 5  │
  │         │   │         │   │         │   │         │   │         │
  │ Select  │──▶│  Run    │──▶│Evaluate │──▶│  Fix &  │──▶│  Multi- │
  │ typical │   │ Preview │   │ output  │   │ re-run  │   │ record  │
  │ record  │   │         │   │         │   │         │   │ testing │
  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘

  Test Matrix (build 5–10 records)
  ┌──────────────────────────┬────────────────────┬────────────┐
  │ Record Type              │ Expected Output    │ Pass/Fail  │
  ├──────────────────────────┼────────────────────┼────────────┤
  │ Typical Case (complete)  │ Full summary       │ Pass       │
  │ Case with no Contact     │ "Contact N/A"      │ Pass       │
  │ Case with very long desc │ Truncated, clear   │ ⚠ review   │
  │ Case in different lang.  │ Language match?    │ Review     │
  │ New Case (no history)    │ "No prior history" │ Pass       │
  └──────────────────────────┴────────────────────┴────────────┘

  Quality checks: merge fields resolve? tone appropriate?
  length correct? grounding returns right articles?
```
**Content:**
- **Testing process:**
  1. Select a realistic test record — not the simplest possible case, a typical one
  2. Run preview and check merge field resolution (correct values populated?)
  3. Evaluate output quality: tone, accuracy, length, relevance
  4. Test with edge cases: record with missing fields, record with very long content, record in different language
  5. Build a test matrix of 5-10 records representing different scenarios
- **Common quality checks:**
  - Are all merge fields resolving to expected values? (check for empty fields)
  - Is the output tone appropriate for the target audience?
  - Is the output length appropriate? (too long = adjust instructions; too short = add length guidance)
  - Does grounding return relevant content? (check the Source Article section in preview)
  - Does the output change appropriately between different records?
- **Version management:** Save as Draft while testing; only Activate when quality is confirmed
**Speaker Notes:** The test matrix concept — testing with 5-10 representative records systematically — is a best practice that separates enterprise-grade prompt templates from quick prototypes. The most common production quality issue is a template that works great for the typical case but fails for edge cases: records with missing fields, records with unusually long content, records for customers in a different region. Test the breadth of your data, not just the clean center. For the exam, testing in Prompt Builder is likely to appear in scenario questions about deployment readiness — "what should a developer do before activating a Prompt Template for production?" Answer: test with multiple representative records using the Prompt Builder preview panel.

### Slide 6: Deploying Templates — Sandbox to Production
**Visual:**
```
  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
  │  Developer      │     │   UAT Sandbox   │     │   Production    │
  │  Sandbox        │     │                 │     │                 │
  │                 │     │                 │     │                 │
  │  Build template │────▶│ Test with real  │────▶│  Activate in    │
  │  Test iteratively│    │ users / data    │     │  production     │
  │  Draft status   │     │ Get sign-off    │     │                 │
  └─────────────────┘     └─────────────────┘     └─────────────────┘
       │ Change Set / SF CLI / Metadata API
       │ sfdx: promptTemplates/ directory
       │ sf project deploy start
       │
       ▼  IMPORTANT:
  Templates arrive in target org as INACTIVE
  Must be manually ACTIVATED after deployment

  ┌──────────────────────────────────────────────────────────────┐
  │  Post-deployment checklist:                                  │
  │  1. Template shows as Inactive in target org                 │
  │  2. Open template in Prompt Builder                          │
  │  3. Run preview with production-representative records       │
  │  4. Verify merge fields resolve (field API names must exist) │
  │  5. Activate template                                        │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- Prompt Templates are **Salesforce metadata** — they can be moved between orgs using the same deployment mechanisms as any other metadata
- **Change Sets:** Include Prompt Template in the outbound change set; templates are included in the "Prompt Templates" metadata type
- **Salesforce DX / SF CLI:** Templates are stored in the project as `promptTemplates/` directory; deploy with `sf project deploy start`
- **Direct Metadata API:** Can be used for scripted deployments or CI/CD pipelines
- **Post-deployment steps:**
  - Templates arrive in the target org in **Draft/Inactive** state — they must be manually Activated
  - Verify merge fields resolve correctly in the target org (field API names, related objects must exist)
  - Re-run testing in the target org with production-representative data
- **LLM model configuration:** If the sandbox uses a different AI model configuration than production, test outputs may differ
**Speaker Notes:** The "templates arrive Inactive" behavior is a frequent exam topic. Just as Flows arrive as Inactive when deployed, Prompt Templates arrive Inactive and must be manually activated in the target org. This is by design — it requires a human review step in the target environment rather than having AI-generated content go live automatically. Always include the activation step and post-deployment testing in your deployment checklist. For the exam, if a question asks "after deploying a Prompt Template to production, what must an admin do before it can be used?" — the answer is Activate the template.

### Slide 7: Common Merge Field Errors and Fixes
**Visual:**
```
  ┌────────────────────────────────────────────────────────────────────┐
  │  ERROR                    │ CAUSE               │ FIX              │
  ├────────────────────────────────────────────────────────────────────┤
  │  Empty output for field   │ Field not populated │ Check record     │
  │  {!Account.Industry}→""   │ or wrong API name   │ data; verify API │
  │                           │                     │ name in Schema   │
  ├────────────────────────────────────────────────────────────────────┤
  │  "Unknown field" error    │ Typo in API name    │ Use Prompt       │
  │                           │ or field doesn't    │ Builder's merge  │
  │                           │ exist on object     │ field picker     │
  ├────────────────────────────────────────────────────────────────────┤
  │  Related record null      │ Lookup field is     │ Add null-handling│
  │  {!Case.Account.Name}→""  │ blank on record     │ instruction in   │
  │                           │                     │ template body    │
  ├────────────────────────────────────────────────────────────────────┤
  │  Same output for all      │ Merge fields in     │ Move record-     │
  │  records                  │ System Prompt       │ specific fields  │
  │                           │ (static section)    │ to Template Body │
  ├────────────────────────────────────────────────────────────────────┤
  │  Truncated long field     │ Long Text Area      │ Add char limit   │
  │  content                  │ content too large   │ instruction or   │
  │                           │                     │ pre-truncate     │
  ├────────────────────────────────────────────────────────────────────┤
  │  Access denied error      │ FLS blocks field    │ Check field      │
  │                           │ for running user    │ permissions      │
  └────────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Empty merge field** — field not populated on test record, or incorrect API name; verify in record and cross-check with Schema Builder
- **"Unknown field" error** — typo in API name or field does not exist on the object; use the merge field picker in Prompt Builder to avoid typos
- **Related record null** — traversal fails because a relationship field is null; add graceful handling: "If information is not available, note that rather than leaving a blank"
- **Truncation of long fields** — Long Text Area content above ~32,000 characters is truncated; consider pre-summarizing in a Flow step
- **Same output for all records** — dynamic data is in the System Prompt (applied to all invocations) instead of the Template Body; move record-specific fields to the body
- **FLS/OLS blocking fields** — the running user's profile does not have Read access to the field; check FLS settings for the user running the template
**Speaker Notes:** The "same output for all records" error is a subtle one that catches developers who put all their merge fields in the System Prompt thinking it establishes context. The System Prompt is evaluated once for all invocations with the same template — it does not refresh per record. Record-specific merge fields must be in the Template Body. If you find yourself asking "why does every Case get the same summary?" — check where your merge fields are placed.

### Slide 8: Prompt Template Quality Checklist
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │              PRE-DEPLOYMENT QUALITY CHECKLIST                    │
  ├──────────────────────────────────────────────────────────────────┤
  │  System Prompt                                                   │
  │  □  1. Clearly defines AI's role and task objective             │
  │  □  2. Specifies tone/style and target audience                 │
  │  □  3. Includes output length guidance                          │
  ├──────────────────────────────────────────────────────────────────┤
  │  Template Body & Merge Fields                                    │
  │  □  4. All required merge fields present with correct API names  │
  │  □  5. Merge fields verified to resolve with correct values     │
  │  □  6. Null/empty field handling instructions included          │
  │  □  7. Record-specific fields in Template Body (not Sys Prompt) │
  ├──────────────────────────────────────────────────────────────────┤
  │  Grounding                                                       │
  │  □  8. Grounding source configured (if needed)                  │
  │  □  9. Grounding returns relevant content in preview            │
  ├──────────────────────────────────────────────────────────────────┤
  │  Testing                                                         │
  │  □ 10. At least 5 representative test records previewed         │
  │  □ 11. Edge cases tested (empty fields, long content)           │
  │  □ 12. Output reviewed and meets quality standards              │
  ├──────────────────────────────────────────────────────────────────┤
  │  Deployment                                                      │
  │  □ 13. Template signed off by stakeholders                      │
  │  □ 14. Activated only after quality standards met               │
  └──────────────────────────────────────────────────────────────────┘
```
**Content:**
- Pre-deployment checklist for Prompt Templates:
  1. System prompt is specific about the AI's role and task objective
  2. All required merge fields are present and use correct API names
  3. Merge fields verified to resolve with correct values in preview
  4. Null/empty field handling instructions included
  5. Output length (concise/detailed) explicitly specified
  6. Tone and audience explicitly specified in system prompt
  7. Grounding source configured and returning relevant content in preview
  8. At least 5 representative test records previewed
  9. Edge case records tested (empty fields, long content, unusual data)
  10. Template signed off and activated only when quality standards are met
**Speaker Notes:** This checklist is your practical guide to professional Prompt Template deployment. Each item represents a real failure mode that occurs in production when skipped. Item 4 (null handling) is perhaps the most commonly skipped — developers test with clean records and are surprised when production records have missing related data. Item 10 (signed off and activated) represents the governance step — in enterprise contexts, you should have a review process before activating templates that will be used by customer-facing agents. For the exam, if you see a question about deployment best practices for Prompt Templates, drawing on this checklist will guide you to correct answers.

## Recording Script
In this lecture we go deeper on Prompt Builder — specifically merge fields, grounding within templates, testing systematically, and moving templates from sandbox to production.

Merge fields are the mechanism that makes templates dynamic. The syntax is `{!ObjectName.FieldName}` — including the exclamation point. Standard fields, custom fields with `__c`, and related object traversal all work the same way. The most common issue: related lists do not work natively. If you need a list of child records — all Contacts on an Account, all Cases in the last 30 days — you need to pre-process them in a Flow into a text string, then pass that string to your template as an input.

Grounding within templates works the same way as grounding in agent Topics — retrieve relevant content, inject it into the context, generate based on that content. The difference is scoping: template-level grounding is always applied when the template runs. The search query can itself be a merge field — you can use the Case Subject as the search query for a Knowledge search, so each case pulls the articles most relevant to that specific case. That is a very clean pattern.

Testing cannot be skipped. Use the preview panel with real records. Build a test matrix — 5 to 10 records representing different scenarios and edge cases. Test with records that have missing related data, very long text fields, unusual content. A template that works for your best-case record may fail for typical production records.

Deployment uses standard Salesforce metadata tools — change sets, Salesforce DX, Metadata API. One critical behavior: templates always arrive in the target org as Inactive. They must be manually activated. This is the exam trap: "after deploying a template to production, what must be done before it works?" — Activate it.

## Exam Tips
- Merge field syntax: `{!ObjectName.FieldName}` — the `!` is required; use exact API names including `__c` for custom fields
- Related lists (child record sets) are not directly accessible via merge fields — pre-process in a Flow into a text string, then pass to the template
- Template-level grounding applies every time the template runs; agent-level Knowledge Search Actions apply only when Atlas invokes them — different scoping
- After deploying a Prompt Template from sandbox to production, it arrives as Inactive — must be manually Activated before it can be used
- "Same output for all records" issue: dynamic merge fields placed in the System Prompt instead of the Template Body — system prompt is static across all invocations

## Lecture Summary
Merge fields in Prompt Templates use the syntax `{!ObjectName.FieldName}` and support standard fields, custom fields (`__c`), and related object traversal up to 5 levels deep. Related lists (child records) require Flow pre-processing into a text string. Grounding can be configured within a Prompt Template to retrieve Knowledge articles or Data Cloud records before generation; the search query can be a merge field expression for dynamic, per-record retrieval. Testing requires the Prompt Builder preview panel with multiple representative records including edge cases with missing or unusual data. Common errors include empty merge fields (null data or wrong API name), same output for all records (merge fields in System Prompt instead of Body), and FLS blocking field access. Deployment uses standard Salesforce metadata tools (change sets, SF CLI); templates arrive in target orgs as Inactive and must be manually Activated.

## Mini Quiz

**Q1:** A developer builds a Case Summary Prompt Template with a merge field `{!Case.Contacts.Email}` intending to display all contact email addresses associated with the case. After testing, the merge field appears empty. What is the most likely cause and correct fix?
A) Email fields are blocked from Prompt Templates by the Einstein Trust Layer — use a masked version
B) Prompt Templates do not support child record list traversal via merge fields — pre-process the Contacts list in a Flow into a formatted text string and pass it to the template as a text input
C) The merge field syntax is wrong — it should be `{!Case.Contact.Email}` (singular)
D) Case records do not have a Contacts relationship — use `{!Case.ContactId.Email}` instead
**Answer:** B — Prompt Builder merge fields access a single record and its parent lookups, not child record lists. `{!Case.Contacts.Email}` attempts to iterate over a related list, which is not natively supported. The correct approach is to build a Flow that queries the related Contacts, formats their emails into a comma-separated string, and passes that string to the template as an input parameter. Option C is partially relevant (Case does have a ContactId lookup), but even `{!Case.Contact.Email}` only accesses the single linked Contact, not all contacts.

**Q2:** A Prompt Template is deployed from a sandbox to production using a change set. An administrator checks the production org but cannot use the template — when they open it, the status shows "Inactive." What action must the administrator take?
A) Re-deploy the change set — only active templates can be deployed
B) Activate the template in the production org from Prompt Builder
C) Contact Salesforce Support — inactive template deployment is a known deployment bug
D) Create a new template in production manually — change sets cannot deploy Prompt Templates
**Answer:** B — Prompt Templates always arrive in the target org in an Inactive state after deployment, by design. This requires a deliberate activation step in the target environment after verifying the template works correctly with production data. Change sets can deploy Prompt Templates successfully. Re-deploying will not change the status behavior.

**Q3:** A developer has built a Record Summary template for Case records. During testing, they notice the output is identical for every case they test with — it does not reflect the specific case data. What is the most likely cause?
A) Record Summary templates generate the same output by design — they are not dynamic
B) The merge fields referencing the Case data are placed in the System Prompt section rather than the Template Body section
C) The preview tool uses cached data and all test cases are showing the first record's data
D) The template must be Activated before merge fields will resolve dynamically
**Answer:** B — The System Prompt is a static section that is the same for every invocation of the template. Merge fields placed in the System Prompt are evaluated once at template load and produce the same value for all records. Record-specific, dynamic merge fields must be placed in the Template Body, which is evaluated per-invocation with the specific record's data. The template preview does not cache data, and template activation does not affect merge field behavior.
