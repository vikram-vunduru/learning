# Lab 02: Create a Record Summary Prompt Template and Wire it as an Agent Action

## Lab Overview
Build a Flex Prompt Template in Prompt Builder that generates a personalized case summary response for customers, then connect it to the Agentforce agent from Lab 01 as a Prompt Template Action. This lab covers merge fields, template testing, and the integration between Prompt Builder and Agentforce.

**Time Estimate:** 75 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Lab 01 completed (Aria agent exists with at least one active Topic)

---

## Lab Objectives
- Navigate Prompt Builder and understand the three-section template anatomy
- Write a Flex Prompt Template with merge fields referencing Case and Account objects
- Test the template with multiple records using the Prompt Builder preview panel
- Activate the template and add it as a Prompt Template Action to the Aria agent
- Write an effective Action description for the Prompt Template Action
- Verify the Action works correctly in the agent simulator

---

## Part 1: Create Sample Case Data

### Step 1: Create Test Cases

Before building the template, create 3 sample Case records in your org for testing. If your org already has Cases, you can skip this step.

Navigate to the App Launcher → Cases → New:

**Case 1:**
- Subject: `Order delivered to wrong address`
- Status: New
- Priority: High
- Description: `Customer received a package that was meant for a different address. The correct package has not arrived yet. Order number ORD-2024-001.`
- Account: (create or select any Account)
- Contact: (optional)

**Case 2:**
- Subject: `Request for refund on damaged electronics`
- Status: In Progress
- Priority: Medium
- Description: `Customer received a laptop that arrived with a cracked screen. Customer has photos. Purchased within the 15-day electronics return window.`

**Case 3:**
- Subject: `Cannot apply promotional discount code`
- Status: New
- Priority: Low
- Description: `Customer has a promo code SAVE20 from a marketing email but the checkout system rejects it. Customer has tried multiple times.`

---

## Part 2: Build the Flex Prompt Template

### Step 2: Open Prompt Builder

Navigate to: Setup → Einstein → Prompt Builder → New Prompt Template

Select template type: **Flex**

**Template Details:**
- Template Name: `Case Summary for Customer`
- API Name: `Case_Summary_For_Customer`
- Description: `Generates a professional, empathetic case status summary for a customer, based on the case subject, description, status, and account context.`
- Primary Object: Case

### Step 3: Add Related Objects

In the "Related Objects" section, add:
- Account (via Case.AccountId lookup)
- Contact (via Case.ContactId lookup — optional, for greeting personalization)

### Step 4: Write the System Prompt

In the System Prompt section, enter:

```
You are a professional customer service representative for Acme Corp. Your role is to communicate case status and progress to customers clearly, empathetically, and helpfully. Write in a warm, professional tone. Be specific — reference actual case details rather than giving generic responses. Always acknowledge any inconvenience and confirm the next step.
```

### Step 5: Write the Template Body

In the Template Body section, enter:

```
Please write a clear, empathetic case status update for this customer based on the following case information:

Case Details:
- Case Number: {!Case.CaseNumber}
- Subject: {!Case.Subject}
- Current Status: {!Case.Status}
- Priority: {!Case.Priority}
- Description: {!Case.Description}

Account Information:
- Account Name: {!Case.Account.Name}
- Account Type: {!Case.Account.Type}

Instructions for the response:
1. Open with a brief acknowledgment of the issue (1-2 sentences)
2. Summarize the current status of the case in plain language (1-2 sentences)
3. Describe what the next step is or what the customer can expect (1-2 sentences)
4. Close with a supportive statement and contact information

Keep the total response under 150 words. Use a warm, professional tone. Do NOT use generic phrases like "I understand your frustration" — be specific to this case's details.
```

### Step 6: Add Input Parameters

For the Prompt Template to receive data from the Agentforce agent (beyond just the Case record), add a text input parameter:

- Parameter Name: `additionalContext`
- Data Type: Text
- Description: `Any additional context provided by the customer or retrieved by prior agent actions (optional)`

Update the template body to include:
```
Additional Customer Context (if provided): {!additionalContext}
```
(Add this line after the Account Information section)

---

## Part 3: Test the Template

### Step 7: Run Preview Tests

In the Prompt Builder preview panel:

**Test 1 — High Priority Case:**
- Select Case 1 (Order delivered to wrong address)
- additionalContext: `Customer has been waiting 5 days and is expecting the package urgently`
- Run Preview
- Evaluate: Does the response acknowledge the specific issue (wrong address)? Is the tone appropriate for High priority? Does it mention next steps?
- Grade: Pass / Fail / Needs Improvement
- Notes: _______________

**Test 2 — Medium Priority Case:**
- Select Case 2 (Damaged electronics)
- additionalContext: `Customer has photos of the damage`
- Run Preview
- Evaluate: Does the response reference the electronics return policy window? Does it acknowledge the photo evidence?
- Grade: _______________

**Test 3 — Low Priority Case:**
- Select Case 3 (Promo code issue)
- additionalContext: (leave empty to test null handling)
- Run Preview
- Evaluate: Does the template handle the empty additionalContext gracefully? Is the tone appropriate for a low-priority discount issue?
- Grade: _______________

**Test 4 — Edge Case: Missing Account:**
- Create a Case with no Account associated
- Run Preview
- Evaluate: Does the template produce an error, or does it handle the missing Account.Name gracefully?
- Observation: _______________

### Step 8: Fix Any Issues Found in Testing

Common fixes:
- If the response is too generic → make the template body more specific: "Reference the exact case subject in the acknowledgment"
- If null Account.Name causes an error → add null handling instruction: "If account name is not available, omit account-specific references"
- If the response is too long → add explicit length constraint: "Strictly limit your response to 120 words or fewer"
- If the tone is wrong → adjust the System Prompt with more specific tone guidance

---

## Part 4: Activate and Connect to the Agent

### Step 9: Activate the Template

Once all test cases pass, click **Activate** in the Prompt Builder.

Verify the template status shows **Active** before proceeding.

### Step 10: Add a New Topic to the Aria Agent

Navigate to Setup → Agentforce → Agents → Aria → Edit → Topics → Add Topic.

**Topic: Case Status**
- Label: `Case Status`
- Description: `Provides customers with a clear status update on their existing service case. Use when a customer asks about the progress, status, or current state of a case they have open with Acme Corp. Can generate a personalized case summary based on case details.`

### Step 11: Add the Prompt Template Action

Within the Case Status Topic, add an Action:
- Action Type: Prompt Template
- Select Template: `Case Summary for Customer`
- Label: `Generate Case Status Summary`

**Input Mapping:**
- Case record: "Agent extracts Case from context" (or look up by case number via a prior Flow Action if needed)
- additionalContext: "Agent extracts from conversation" — anything the customer mentions about their case

**Action Description:**
```
Generates a professional, personalized case status update for the customer based on their case details. Invoke when a customer asks about the current status or progress of their open case, or asks what is happening with their issue. Requires the Case record to be identified (ask for case number if not provided). Returns a complete, ready-to-use case status summary message.
```

### Step 12: Optionally Add a Case Lookup Flow Action

For full end-to-end functionality, add a Flow Action to the Case Status Topic that looks up the Case record by case number before the Prompt Template Action runs.

Create a simple Autolaunched Flow `Agent_Get_Case_By_Number`:
- Input variable: `caseNumber` (Text, Available for Input, Description: "The case number provided by the customer")
- Get Records: Case WHERE CaseNumber = `{!caseNumber}` LIMIT 1
- Output variables: `caseId` (ID, Available for Output), `caseFound` (Boolean, Available for Output)

Add this Flow Action before the Prompt Template Action in the Topic with the description: "Looks up a case by case number. Invoke first when a customer provides a case number and wants a status update. Returns the case record ID for use by subsequent actions."

---

## Part 5: Test the Complete Workflow

### Step 13: Test in Agent Simulator

Open the Aria agent in Agentforce Builder → Preview panel.

**Test 1 — Full Flow:**
Input: `"Can you tell me what's happening with case 00001234?"`
Expected path: Case Status Topic → (Case Lookup Flow) → Generate Case Status Summary template → returns personalized status
Result: _______________

**Test 2 — Missing Case Number:**
Input: `"What's the status of my case?"`
Expected: Agent asks "Could you please provide your case number?"
Result: _______________

**Test 3 — With Additional Context:**
Input: `"What's happening with case 00001234? I've been waiting a week and need this resolved today."`
Expected: additionalContext captures the urgency; template response acknowledges the wait time
Result: _______________

---

## Lab Deliverables

- [ ] Three test Case records created in the org
- [ ] `Case Summary for Customer` Flex template created with System Prompt, Template Body with merge fields, and `additionalContext` input parameter
- [ ] Template tested with 4 records (3 standard + 1 edge case) with documented results
- [ ] Template Activated
- [ ] "Case Status" Topic added to the Aria agent
- [ ] Prompt Template Action added with Action description and input mapping
- [ ] Optional: Case Lookup Flow Action added and tested
- [ ] 3 end-to-end simulator tests completed

---

## Reflection Questions

1. Why was a Flex template used here instead of a Record Summary template?
2. What would happen if the `additionalContext` input parameter were left unmapped in the Action configuration? How does the template handle an empty string for that parameter?
3. If the organization later wants to use the same `Case Summary for Customer` template in a Flow for automated follow-up emails, can they do so? What changes are needed?
4. What is the advantage of having a separate Case Lookup Flow Action before the Prompt Template Action, rather than trying to look up the case within the template itself?
