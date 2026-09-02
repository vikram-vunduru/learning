# Lab 02 — What You Need to Be Able to Do: Build a Flex Template and Wire It as an Agent Action

## What This Tests
Building a Flex Prompt Template in Prompt Builder, testing it, activating it, and connecting it to an Agentforce agent as a Prompt Template Action. Covers the full Prompt Builder → Agentforce integration path.

## Prerequisites
- [ ] Lab 01 completed (Aria agent exists with Order Inquiry and Product/Policy Topics)
- [ ] At least 3–4 Case records exist in the org for testing
- [ ] Einstein features enabled (Prompt Builder available)

---

## Part 1 — Create Test Cases

### Create Three Test Cases in Salesforce
- [ ] Case 1: Subject "Order arrived damaged", Status "In Progress", recent description
- [ ] Case 2: Subject "Billing charge not recognized", Status "Waiting on Customer"
- [ ] Case 3: Subject "Product not working as described", Status "Escalated"
- [ ] Note the Case Numbers — you'll need them for testing

---

## Part 2 — Build the Flex Prompt Template

### Navigate to Prompt Builder
- [ ] Setup → Prompt Builder → New Prompt Template
- [ ] Template type: **Flex** ← NOT Field Generation, NOT Record Summary
- [ ] Name: `Case Summary for Customer`
- [ ] API Name: `Case_Summary_for_Customer`

### Write the System Prompt
- [ ] In the System Prompt field, enter:
  > "You are a helpful customer service AI. Generate a concise, empathetic 2–3 sentence summary of the following support case suitable to read to a customer. Focus on what the issue is and what is currently happening to resolve it. Be professional and reassuring."

### Write the Template Body
- [ ] In the Template Body, enter:
  ```
  Case Details:
  Subject: {!Case.Subject}
  Description: {!Case.Description}
  Status: {!Case.Status}
  Priority: {!Case.Priority}
  Last Updated: {!Case.LastModifiedDate}

  Additional context from agent conversation:
  {!additionalContext}
  ```
- [ ] Verify: each `{!Case.Field}` merge field is in the correct `{!ObjectName.FieldName}` format
- [ ] Verify: `{!additionalContext}` is your custom input parameter

### Add the Custom Input Parameter
- [ ] Add an input parameter to the template:
  - Name: `additionalContext`
  - Type: Text
  - Required: No (optional context)
- [ ] This parameter can be passed at runtime by the agent from conversation context

---

## Part 3 — Test the Template in Prompt Builder

### Test with Representative Cases
- [ ] Select test record: **Case 1** (damaged order)
- [ ] Click Generate / Preview
- [ ] Review: Is the summary accurate? Empathetic? Under 3 sentences?
- [ ] Verify: No PII is visible in generated output that wasn't in the case
- [ ] Test with **Case 2** (billing) — verify summary is contextually appropriate
- [ ] Test with **Case 3** (product issue) — verify summary handles different status values
- [ ] Test with a **null Description** case — verify template handles gracefully (empty field = blank in output)

### Iterate if Needed
- [ ] If output is too long: tighten System Prompt ("limit to 2 sentences")
- [ ] If output lacks empathy: add empathy instruction to System Prompt
- [ ] If merge field renders literally (e.g., `{Case.Subject}` appears): check for missing `!`
- [ ] After changes: re-test with all records

---

## Part 4 — Activate the Template

- [ ] Once output quality is satisfactory, click **Activate**
- [ ] Template status changes from Draft to Active
- [ ] Know: only Active templates appear in the Agentforce Action picker
- [ ] Know: if you deploy via Change Set, template arrives INACTIVE in destination — must activate there too

---

## Part 5 — Add as Agentforce Prompt Template Action

### Open Aria Agent in Agentforce Studio
- [ ] Setup → Agentforce → Agents → Aria → Edit

### Add New Topic or Use Existing
- [ ] Decision: Does the Case Summary fit in an existing Topic, or does it need a new one?
  - If the agent already has a "Case Management" Topic → add Action there
  - If not → create new Topic "Case Status and Summaries"
- [ ] New Topic description (if creating): "Handles requests for case status updates and summaries. Activate when the customer asks about the status of their support case, what's happening with their issue, or for a summary of their case. Requires a case number."

### Add Prompt Template Action
- [ ] Within the Topic: Add Action → Prompt Template
- [ ] Template picker: select **Case Summary for Customer** (Active Flex templates only appear)
- [ ] If template doesn't appear: it's either not Active, or not Flex type
- [ ] Action Label: `Summarize Case for Customer`
- [ ] Action Description: "Generates an empathetic, concise summary of a support case in natural language. Call when the customer asks for a summary, update, or status of their support case. Requires the case number."
- [ ] Map input parameter: `additionalContext` → Conversation Context (Atlas extracts any relevant details the customer mentioned)

### Save the Action

---

## Part 6 — Test End-to-End in Simulator

### Test the Prompt Template Action via Agent
- [ ] Open Agentforce Simulator for Aria
- [ ] **Test 1:** "Can you give me a summary of what's happening with my case #00001234?"
  - Reasoning Trace: check Template Action was invoked
  - Response: verify it's a natural language summary (not raw field data)
- [ ] **Test 2:** "What's the status of case 1235?"
  - Verify routing to same Action
  - Verify template produces different output for different case
- [ ] **Test 3:** "My case is urgent, I'm frustrated. Give me an update on case 1234."
  - Verify emotional context flows into `additionalContext` if configured
  - Verify response tone is appropriately empathetic
- [ ] **Test 4:** "What's case 9999?" (case that doesn't exist)
  - Verify graceful handling (empty case, error state)

---

## What You Must Be Able to Do for the Exam
- [ ] State which template type is required for Agentforce Actions: **Flex only**
- [ ] Explain why Field Generation, Record Summary, and Sales Email templates can't be agent Actions
- [ ] Write correct merge field syntax: `{!ObjectName.FieldName}` with exclamation point
- [ ] Identify what happens when merge field syntax is wrong (renders as literal text)
- [ ] Explain custom input parameters and how Atlas passes values to them
- [ ] State that templates arrive INACTIVE after Change Set deployment
- [ ] Describe the testing sequence: Prompt Builder → Agentforce Simulator
- [ ] Explain what the multi-action pattern does (Flow gets data → Prompt Template synthesizes)
- [ ] Know that only Active Flex templates appear in the Action picker
