# Lab 2: Build a Case Summary Prompt Template with Prompt Builder

**Objective:** Create, test, and activate a "Case Summary" prompt template using Salesforce Prompt Builder — a generative AI feature that lets you build reusable AI prompts grounded in your Salesforce data.

**Time Required:** 30 minutes

**Prerequisites:**
- Completed Lab 1 (Developer Edition org created and Einstein Generative AI enabled)
- System Administrator profile in your org

---

## Overview

Prompt Builder is a declarative (no-code) tool that lets Salesforce admins and developers create prompt templates. These templates combine static instructions with dynamic Salesforce data (like field values from a Case record) to generate AI responses — summaries, emails, suggested replies, and more.

In this lab, you will build a prompt template that reads fields from a Case record and generates a concise summary for a support agent. This is a common real-world use case and a topic tested on the AI Associate exam.

---

## Key Concepts Before You Start

- **Prompt Template:** A reusable AI prompt that includes static instructions and dynamic merge fields pulled from Salesforce records.
- **Grounding:** The process of providing context data (like record fields) to the AI model so it generates relevant, accurate responses.
- **Template Type:** Prompt Builder supports multiple types — we'll use **Record Summary**, which is grounded in a single Salesforce record.

---

## Part 1: Create a Case Record to Test With

Before building the prompt, you need a Case record to test against.

### Step 1: Navigate to the Cases App

Click the **App Launcher** (the 9-square grid icon in the top-left corner of the navigation bar).

In the search box that appears, type `Service` and click **"Service Console"** or click **Cases** if it appears directly.

Alternatively: Click the **App Launcher**, then click **"View All"**, and find **"Service"** or **"Service Console"** in the list.

📸 **What you should see:** The Service Console opens. The navigation bar at the top shows tabs including Cases, Accounts, Contacts, and other service-related objects.

---

### Step 2: Open the Cases List View

Click **"Cases"** in the top navigation bar.

📸 **What you should see:** The Cases list view opens. If this is a brand-new org, you'll see an empty list with a message like "No items to display" and a **"New"** button in the top-right corner.

---

### Step 3: Create a New Case

Click the **"New"** button in the top-right corner.

A **"New Case"** dialog or full page form opens. Fill in these fields:

| Field | Value to Enter |
|-------|---------------|
| `Status` | New |
| `Priority` | High |
| `Subject` | `Customer cannot log into their account after password reset` |
| `Description` | `The customer attempted to reset their password using the self-service portal. After receiving the reset email and clicking the link, they set a new password successfully. However, when trying to log in with the new password, they receive an "Invalid username or password" error. The customer confirmed they are using the correct email address. This has been happening for 24 hours and they are unable to access their account to manage their subscription.` |

Click **"Save"**.

📸 **What you should see:** The Case detail page opens showing your newly created case. At the top, you'll see the Case Number (something like "00001007"), the Subject, and all the fields you filled in. Note the **Case Number** — you'll need it in a later step.

---

## Part 2: Build the Prompt Template

### Step 4: Navigate to Prompt Builder

Click the **gear icon** in the top-right corner and select **"Setup"**.

In the Quick Find box, type `Prompt Builder` and click **"Prompt Builder"**.

📸 **What you should see:** The Prompt Builder list view page opens. The page title is "Prompt Templates." The list is empty (or has templates from previous labs). There is a **"New"** button in the top-right corner.

---

### Step 5: Create a New Prompt Template

Click the **"New"** button.

📸 **What you should see:** A "New Prompt Template" dialog box appears with the following fields:
- `Prompt Template Type` (dropdown)
- `Prompt Template Name`
- `API Name` (auto-filled)
- `Description`

---

### Step 6: Configure the Template Settings

Fill in the dialog as follows:

**Prompt Template Type:** Click the dropdown and select **"Record Summary"**

> Record Summary templates are grounded in a single Salesforce record. When you select this type, additional fields will appear.

📸 **What you should see:** After selecting "Record Summary," a new field appears: `Primary Object Type`.

**Primary Object Type:** Click the dropdown and select **"Case"**

**Prompt Template Name:** Type `Case Summary for Support Agent`

**API Name:** This auto-fills to `Case_Summary_for_Support_Agent` — leave it as-is.

**Description:** Type `Generates a concise case summary to help support agents quickly understand the issue without reading the full description.`

Click **"Next"** or **"Create"** (the button label may vary).

📸 **What you should see:** The Prompt Builder workspace opens. It has three main areas:
- **Left panel:** Resource picker showing Case fields you can insert
- **Center panel:** The template editor where you write your prompt
- **Right panel:** Preview panel (may be collapsed)

---

### Step 7: Write Your Prompt Template

You are now in the Prompt Builder workspace. The center panel has a text editor where you'll write your prompt.

Click inside the text editor area and type the following prompt exactly:

```
You are a helpful assistant for a customer support team. Based on the case information below, write a 3-sentence summary that a support agent can read in under 10 seconds to understand the issue.

Case Subject: {!$Record.Subject}

Case Description: {!$Record.Description}

Case Priority: {!$Record.Priority}

Case Status: {!$Record.Status}

Write the summary in plain English. Focus on: (1) what the customer's problem is, (2) how long it has been happening, and (3) the urgency level. Do not include any information not present in the case details above.
```

> **About merge fields:** The `{!$Record.FieldName}` syntax tells Prompt Builder to pull the actual field value from the Case record at runtime. When a user runs this prompt against Case 00001007, `{!$Record.Subject}` will be replaced with "Customer cannot log into their account after password reset."

---

### Step 8: Insert Merge Fields Using the Left Panel

Rather than typing merge fields manually, you can use the left panel to insert them. Let's verify the merge fields are correct.

In the **left panel**, you should see a section called **"Case Fields"** or **"Resource"** with a list of Case fields.

Scroll through the list and find **"Subject"**. Click it. A merge field syntax like `{!$Record.Subject}` should appear in the editor (or it may pop up as an option to insert at cursor position).

> **Tip:** If you already typed the merge fields manually and they appear in the correct format, you don't need to insert them again via the panel. This step just shows you the alternative method.

📸 **What you should see:** The left panel shows a searchable list of field names from the Case object. Clicking a field name inserts the merge field token into your prompt at the cursor position.

---

### Step 9: Review Your Completed Prompt

Your prompt in the center editor should now look like:

```
You are a helpful assistant for a customer support team. Based on the case information below, write a 3-sentence summary that a support agent can read in under 10 seconds to understand the issue.

Case Subject: {!$Record.Subject}

Case Description: {!$Record.Description}

Case Priority: {!$Record.Priority}

Case Status: {!$Record.Status}

Write the summary in plain English. Focus on: (1) what the customer's problem is, (2) how long it has been happening, and (3) the urgency level. Do not include any information not present in the case details above.
```

Double-check that every merge field uses the exact format: `{!$Record.FieldAPIName}` with no spaces inside the curly braces.

---

## Part 3: Test the Prompt Template

### Step 10: Open the Preview Panel

Look for a **"Preview"** button or panel on the right side of the workspace. Click **"Preview"** if it is not already open.

📸 **What you should see:** A preview panel appears on the right side. It has a field to select a record for testing, and a "Generate" or "Run" button.

---

### Step 11: Select a Test Record

In the Preview panel, find the field labeled **"Select Record"** or **"Test Record"**.

Click the search icon or the field itself. In the search box, type the Case Number you created in Step 3 (e.g., `00001007`) or type part of the Subject: `log into`.

📸 **What you should see:** A dropdown appears with matching Case records. You should see your case "Customer cannot log into their account after password reset."

Click on your case to select it.

---

### Step 12: Generate a Preview

Click the **"Generate"** or **"Run Preview"** button.

📸 **What you should see:** After a few seconds (the AI model is processing), a generated response appears in the preview panel. It should be a 3-sentence summary of the case, something like:

> "A customer is unable to log into their account following a successful password reset via the self-service portal, receiving an 'Invalid username or password' error despite using the correct email address. The issue has persisted for 24 hours, completely blocking the customer from accessing their account and managing their subscription. The case is marked High priority and requires immediate investigation into the authentication system."

> **Note:** AI responses are non-deterministic — your response will be similar but not word-for-word identical to the example above. That is expected and normal.

---

### Step 13: Evaluate the Response

Ask yourself:
- Does the summary accurately capture the key facts from the case?
- Is it under 10 seconds to read?
- Does it mention the three required elements: problem, duration, and urgency?

If the response seems off, you can modify your prompt (go back to the editor, make changes, and run Preview again). This iterative process is called **prompt engineering**.

---

## Part 4: Save and Activate the Template

### Step 14: Save the Template

Click the **"Save"** button (usually in the top-right of the workspace toolbar).

📸 **What you should see:** A success notification appears: "Prompt template saved successfully." The template now appears in your Prompt Builder list view.

---

### Step 15: Activate the Template

For a prompt template to be usable on Lightning record pages, it must be **Active**.

Return to the Prompt Builder list view (click "Prompt Builder" in the breadcrumbs or navigate via Quick Find).

Find your template **"Case Summary for Support Agent"** in the list.

Click the dropdown arrow at the end of the row and select **"Activate"**, or click the template name to open it and look for an **"Activate"** button.

📸 **What you should see:** The template's status column changes from "Inactive" to "Active." An active template can now be added to Lightning pages and run by users.

---

## Part 5: Add the Prompt to a Case Record Page (Lightning App Builder)

### Step 16: Navigate to a Case Record

Go to the Service Console > Cases and click on the case you created in Step 3 to open the Case detail record page.

📸 **What you should see:** The Case detail page with all the fields you entered. Look at the URL — it contains the record ID (a long string of letters and numbers).

---

### Step 17: Open Lightning App Builder

With the Case record page open, click the **gear icon** in the top-right corner.

Select **"Edit Page"** from the dropdown.

📸 **What you should see:** Lightning App Builder opens. The Case record page layout appears in a visual editor. On the left side is a component palette. On the right side are layout properties. You can see the current sections/components that make up the page.

---

### Step 18: Find the Copilot Action Component

In the left panel of Lightning App Builder, in the **Components** section, search for `Einstein` or `Copilot` or `Prompt`.

Look for a component called **"Einstein Copilot Action"** or **"Prompt Action"** or similar.

📸 **What you should see:** A component appears in the search results. (The exact name depends on your Salesforce release.) This component is used to surface prompt template outputs on record pages.

> **Note:** In some Developer Edition orgs, the Prompt Action component may not be available on the page if Einstein Copilot isn't fully provisioned. In that case, note where you would place it and move to the reflection questions — you've still completed the core lab objectives.

---

### Step 19: Drag the Component to the Page

Drag the **Einstein Copilot Action** (or equivalent) component from the left panel and drop it into the right column of the Case record page layout.

In the right panel (component properties), configure it to reference your **"Case Summary for Support Agent"** template.

Click **"Save"** in the top-right corner.

Click **"Activate"** if prompted.

📸 **What you should see:** A dialog may appear asking which page to activate for (Org Default, App Default, etc.). Select **"Assign as Org Default"** and click **"Save"**.

---

### Step 20: Test on the Live Record Page

Click **"Back"** (the left arrow) or navigate away from App Builder back to the Case record.

📸 **What you should see:** The Case record page now shows your new component. There may be a button or a card labeled with your prompt template name. Click it to generate the AI summary directly on the record page.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| "Prompt Builder" does not appear in Quick Find | Ensure Einstein Generative AI is enabled. Go to Setup > Einstein > Einstein Generative AI and toggle it On. Wait 2 minutes and try again. |
| "Record Summary" is not an option in Template Type | Your org may not have the full Generative AI feature set. Try selecting "Field Generation" as an alternative type, or ensure your org's Einstein is fully enabled. |
| Merge fields show errors (red underline) | Check the exact API name of the field. Case Subject = `Subject`, Description = `Description`, Priority = `Priority`. API names are case-sensitive. Use the left panel field picker to insert them correctly. |
| Preview generates empty response | The AI model may be temporarily unavailable. Wait 2 minutes and try again. Also check that your test record has values in all the fields referenced in the prompt. |
| Preview shows "Error: Model not available" | Some Developer Edition orgs have limits on generative AI calls. Wait a few minutes and retry. If persistent, recreate your org. |
| Cannot find "Edit Page" option | You may need the **View Setup and Configuration** and **Customize Application** permissions. With System Admin profile, you should have these. Try refreshing the page. |
| Template shows as "Inactive" after saving | You must explicitly click "Activate" to make the template active. Follow Step 15. |

---

## Reflection Questions

1. In this lab, you used merge fields like `{!$Record.Subject}` to "ground" the AI prompt in real Salesforce data. In your own words, explain why grounding is important. What could go wrong if you sent customer questions to an AI model WITHOUT grounding it in your Salesforce data?

2. You wrote a system instruction at the start of your prompt: "You are a helpful assistant for a customer support team." Why is this instruction valuable? How might the AI's response differ if you removed that instruction and just sent the raw case fields?

3. The AI Associate exam covers the concept of **"prompt template types"** in Prompt Builder. This lab used a **Record Summary** template. Can you think of a business use case for the **"Sales Email"** prompt template type? What fields would you include in a grounding prompt for generating a personalized sales outreach email?

---

## Summary

In this lab you:
- Created a Case record with realistic test data
- Built a Record Summary prompt template in Prompt Builder
- Used merge fields to ground the prompt in live Salesforce record data
- Tested and previewed the AI-generated output
- Activated the template and added it to a Lightning record page

This workflow — write prompt, ground with data, test, activate, deploy — is the core Prompt Builder skill tested on the AI Associate exam.

**Next:** Proceed to Lab 3: Einstein Prediction Builder — Lead Conversion Prediction.
