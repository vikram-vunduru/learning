# Lab 02: Prompt Builder Hands-On — What You Need to Be Able to Do

**Lab Type:** Hands-On Practice
**Estimated Time:** 45-60 minutes

---

## Core Skills to Demonstrate

By end of this lab you should be able to:
- Create a Prompt Builder template from scratch using merge fields
- Choose the correct template type for a given use case
- Test a template against a real record
- Activate and deploy a template to a Lightning page
- Observe what the Trust Layer (Data Masking) does to your prompt

---

## Checklist: Build a Case Summary Prompt Template

### Step 1: Navigate to Prompt Builder
- [ ] Setup → Einstein → Prompt Builder (or search "Prompt Builder" in Setup Quick Find)
- [ ] Click **New Prompt Template**

### Step 2: Configure Template Type and Object
- [ ] Template Type: **Record Summary**
- [ ] Primary Object: **Case**
- [ ] Name: "Case Summary for Escalation"
- [ ] Click Next

### Step 3: Write the Prompt Template
- [ ] Write a prompt using merge fields. Example:
  ```
  You are a professional Salesforce service assistant. 
  Write a 3-bullet executive summary of this support case for escalation to a senior manager.
  
  Case Subject: {!$Record.Subject}
  Priority: {!$Record.Priority}
  Status: {!$Record.Status}
  Account: {!$Record.Account.Name}
  Contact: {!$Record.Contact.Name}
  Description: {!$Record.Description}
  
  Format: 3 bullet points covering (1) the core issue, (2) customer impact, (3) recommended action.
  If any information is missing, note it as unknown — do not fabricate details.
  ```
- [ ] Verify merge fields are using `{!$Record.FieldName}` syntax (not hardcoded values)
- [ ] Save the template

### Step 4: Test the Template
- [ ] Click **Preview** or **Test**
- [ ] Select a Case record to test against (pick one with data in all fields)
- [ ] Observe: the merge fields are resolved to actual values
- [ ] Click **Generate** to see LLM output
- [ ] Review the output — is it accurate? Relevant? Appropriately formatted?

### Step 5: Check What to Look For
- [ ] The output should be grounded in the case data, not generic
- [ ] If Contact.Name was in the prompt, check if masking occurred (you should see the original name in the output — Data Masking masks in transit, restores for the user)
- [ ] Check the Audit Trail: Setup → Einstein → AI Activity → view the logged interaction

### Step 6: Activate the Template
- [ ] Change template status to **Active**
- [ ] Save

### Step 7: Add to Lightning Page (optional but instructive)
- [ ] Navigate to a Case record
- [ ] Click the **gear icon → Edit Page** (Lightning App Builder)
- [ ] Search for **Einstein for Cases** or **Einstein Record Summary** component in the component panel
- [ ] Drag to the page layout
- [ ] Save and Activate the page
- [ ] Refresh the Case record — you should see the "Generate Summary" button

---

## Concepts Reinforced by This Lab

| What You Did | What It Teaches |
|-------------|----------------|
| Chose "Record Summary" template type | The 4 template types and when to use each |
| Used `{!$Record.Contact.Name}` | Merge field syntax and that it resolves before LLM |
| Wrote "do not fabricate details" instruction | How prompt design mitigates hallucinations |
| Checked Audit Trail | How the Audit Trail works and why it matters for compliance |
| Observed masking/unmasking | How Data Masking works in practice |

---

## Exam-Relevant Self-Check Questions

After completing the lab, make sure you can answer:
1. What would happen if you used a Field Generation template type instead of Record Summary for this use case?
2. At what point are the merge fields resolved — when the admin saves the template, or when the user clicks "Generate"?
3. Why is the instruction "do not fabricate details" important in the prompt?
4. Where would you go to see all AI interactions logged in Salesforce?
5. If the Contact.Name merge field resolved to "Jane Doe" — would the LLM ever see "Jane Doe"? (Answer: Not directly — Data Masking would replace it with a token. The user sees the restored name in the output.)
