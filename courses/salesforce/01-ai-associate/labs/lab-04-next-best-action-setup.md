# Lab 4: Set Up Next Best Action on the Account Page

**Objective:** Create a Next Best Action (NBA) recommendation that surfaces a contextual suggestion — "Schedule Executive Business Review" — on the Account record page for strategic accounts.

**Time Required:** 40 minutes

**Prerequisites:**
- Completed Lab 1 (Developer Edition org with Einstein enabled)
- At least 1 Account record in your org (all Developer Edition orgs have sample accounts)

---

## Overview

Next Best Action (NBA) is a Salesforce feature that surfaces **intelligent recommendations** to users at the right moment — directly on a record page. Unlike Einstein Prediction Builder (which scores a likelihood) or Prompt Builder (which generates text), NBA proactively tells a user *what to do next*.

An NBA setup involves three layers:

1. **Recommendation Records** — The individual suggestions (e.g., "Schedule an EBR," "Offer Upgrade", "Escalate to Tier 2")
2. **Strategy** — A flow-based logic engine (Strategy Builder) that decides WHICH recommendations to show and WHEN, based on conditions
3. **Lightning Component** — The visual component placed on a record page that displays the strategy's output to the user

Think of it like this:
- The **Recommendation** is the menu item
- The **Strategy** is the chef who decides what to serve to each customer
- The **Component** is the plate placed in front of the user

---

## Part 1: Create Recommendation Records

### Step 1: Navigate to Next Best Action Setup

Click the **gear icon** > **Setup**.

In Quick Find, type `Next Best Action` and click the result.

📸 **What you should see:** The Next Best Action setup page with two tabs at the top: **"Strategies"** and **"Recommendations."** Both are empty in a new org.

Click the **"Recommendations"** tab.

---

### Step 2: Create Your First Recommendation

Click the **"New"** button in the top-right corner.

📸 **What you should see:** A dialog or new record form with fields for the recommendation.

Fill in the form:

| Field | Value |
|-------|-------|
| `Name` | `Schedule Executive Business Review` |
| `Description` | `Proactively schedule an EBR with strategic accounts that have been customers for over 12 months to strengthen the relationship and identify expansion opportunities.` |
| `Acceptance Label` | `Schedule EBR` |
| `Rejection Label` | `Not Now` |
| `Action` | Leave blank for now (we'll revisit this) |

> **What is Acceptance/Rejection Label?** These are the button labels displayed to the user. When the user clicks "Schedule EBR," the recommendation is marked as accepted. If they click "Not Now," it's rejected. Accepted actions can trigger flows, tasks, emails, etc.

Click **"Save"**.

📸 **What you should see:** The recommendation record is created and appears in the Recommendations list with the name "Schedule Executive Business Review."

---

### Step 3: Create a Second Recommendation

Click **"New"** again to create a second recommendation. This will make your strategy more interesting.

| Field | Value |
|-------|-------|
| `Name` | `Offer Product Upgrade` |
| `Description` | `Suggest a product upgrade to accounts using the basic tier for more than 6 months with high activity.` |
| `Acceptance Label` | `Send Upgrade Info` |
| `Rejection Label` | `Not Interested` |

Click **"Save"**.

📸 **What you should see:** You now have two recommendations in the list: "Schedule Executive Business Review" and "Offer Product Upgrade."

---

## Part 2: Build a Strategy Using Strategy Builder

The Strategy determines the rules for WHEN and to WHOM each recommendation is shown. Strategies are built using a visual flow editor called **Strategy Builder**.

### Step 4: Navigate to the Strategies Tab

Click the **"Strategies"** tab (next to "Recommendations").

📸 **What you should see:** The Strategies list view, currently empty, with a **"New"** button.

---

### Step 5: Create a New Strategy

Click **"New"**.

📸 **What you should see:** A dialog asking for:
- `Strategy Name`
- `API Name`
- `Context Record Type` (the Salesforce object this strategy runs on)

Fill in:

| Field | Value |
|-------|-------|
| `Strategy Name` | `Account Engagement Strategy` |
| `API Name` | `Account_Engagement_Strategy` (auto-filled) |
| `Context Record Type` | **Account** |

Click **"Save"**.

📸 **What you should see:** Strategy Builder opens — a visual canvas with a toolbar. The canvas is mostly empty with a starting node. On the left side is a toolbar with element types you can add (similar to Flow Builder).

---

### Step 6: Understand the Strategy Builder Canvas

Before adding elements, let's orient ourselves:

- **Canvas (center):** Where you visually build your logic by connecting nodes
- **Left toolbar:** Contains element types: `Load`, `Filter`, `Sort`, `Limit`, `Branch`, and `Enhance`
- **Right panel:** Properties for whichever element is selected
- **Entry node (top):** The starting point — your strategy always starts here

The most common Strategy flow is:
`Load (recommendations)` → `Filter (conditions)` → `Sort (priority)` → `Limit (max items to show)` → `Output`

---

### Step 7: Add a Load Element

From the left toolbar, drag the **"Load"** element onto the canvas and connect it to the starting node (or click it and place it).

📸 **What you should see:** A "Load" element appears on the canvas. Click on it to see its properties in the right panel.

In the right panel:
- **Element Label:** Type `Load All Recommendations`
- **Source:** Select **"Recommendations"**
- **Filter By:** Leave as "All Recommendations" or select all recommendations to include both of yours

This element tells the strategy: "Start by pulling in all the Recommendations records we created."

---

### Step 8: Add a Filter Element

From the left toolbar, drag a **"Filter"** element onto the canvas and connect it below the Load element (drag from the Load element's output arrow to the Filter element).

📸 **What you should see:** The Filter element is connected to the Load element. Click on it to open properties.

In the right panel:
- **Element Label:** Type `Filter for Strategic Accounts`
- **Conditions:** Add a condition

For the condition, we'll show the "Schedule EBR" recommendation only for accounts that are customers (Type = "Customer - Direct" or "Customer - Channel"). Configure:

- **Field:** `{!contextRecordId.Type}` or select `Account.Type`
- **Operator:** `equals`
- **Value:** `Customer - Direct`

Click **"Add Condition"** to add a second OR condition:
- **Field:** `Account.Type`
- **Operator:** `equals`
- **Value:** `Customer - Channel`

Set the logic to **"OR"** (either condition qualifies).

> **Note:** The exact field reference syntax may vary depending on your Salesforce version. Use the field picker if available rather than typing manually.

---

### Step 9: Add a Sort Element

Drag a **"Sort"** element onto the canvas and connect it below the Filter.

In the right panel:
- **Element Label:** `Sort by Priority`
- **Sort By:** `Recommendation.Name` (or leave as default if using recommendation rank)
- **Direction:** Ascending

This ensures if multiple recommendations match, they appear in a consistent order.

---

### Step 10: Add a Limit Element

Drag a **"Limit"** element onto the canvas and connect it below the Sort.

In the right panel:
- **Element Label:** `Show Max 2 Recommendations`
- **Maximum Count:** `2`

This prevents overwhelming the user — we'll show at most 2 recommendations at a time.

---

### Step 11: Review Your Strategy Flow

Your strategy canvas should now show this connected flow:

```
[Start] → [Load All Recommendations] → [Filter for Strategic Accounts] → [Sort by Priority] → [Show Max 2] → [Output]
```

📸 **What you should see:** Four connected elements on the canvas, each connected by arrows flowing top-to-bottom. The final element should connect to an output (sometimes shown automatically).

---

### Step 12: Save the Strategy

Click the **"Save"** button in the top-right corner of Strategy Builder.

📸 **What you should see:** A confirmation: "Strategy saved successfully." The strategy is now available to be placed on a Lightning page.

---

### Step 13: Activate the Strategy

After saving, look for an **"Activate"** button. Click it to activate the strategy.

📸 **What you should see:** The strategy status changes to "Active." Only active strategies can surface recommendations on record pages.

---

## Part 3: Add the NBA Component to the Account Page

Now that the strategy is built, you need to place the **Next Best Action** Lightning component on the Account record page.

### Step 14: Navigate to an Account Record

Click the **App Launcher** > search for **"Accounts"** > click **"Accounts"**.

Click on any Account in the list to open it.

📸 **What you should see:** An Account record page with the account's name, details, related lists, and activity timeline.

---

### Step 15: Open Lightning App Builder

With the Account record open, click the **gear icon** in the top-right corner.

Select **"Edit Page"**.

📸 **What you should see:** Lightning App Builder opens with the Account record page displayed visually. The left panel shows available components. The right panel shows page/component properties.

---

### Step 16: Find the Next Best Action Component

In the component search box in the left panel, type `Next Best Action`.

📸 **What you should see:** A component named **"Next Best Action"** appears in the search results. It has a small icon and a brief description.

---

### Step 17: Add the Component to the Page

Drag the **"Next Best Action"** component from the left panel and drop it into the page layout. A good location is the **right column, near the top** — this makes it visible without scrolling.

📸 **What you should see:** The Next Best Action component placeholder appears on the page layout. In the right panel, you'll see its configuration properties.

---

### Step 18: Configure the Component Properties

With the Next Best Action component selected, configure the right panel properties:

| Property | Value |
|----------|-------|
| `Strategy` | Click the dropdown and select **"Account Engagement Strategy"** (the strategy you created) |
| `Max Recommendations to Display` | `2` |
| `Header Label` | `Recommended Actions` |

📸 **What you should see:** The component preview on the canvas may show placeholder recommendation cards, or the component may show a generic "Next Best Action" preview.

---

### Step 19: Save and Activate the Page

Click **"Save"** in the top-right corner of Lightning App Builder.

A dialog may appear asking about page activation. Select **"Assign as Org Default"** and click **"Save"**.

Click the **"Back"** button (left arrow) to return to the Account record.

---

## Part 4: Test Your Next Best Action Setup

### Step 20: Find a Customer Account

The strategy you built filters for accounts where `Type = "Customer - Direct"` or `"Customer - Channel"`. To test it, you need an account with one of these types.

From the Account list, look for accounts with Type = "Customer - Direct." If no accounts have this type, let's update one.

Click on any Account in the list to open it.

Click **"Edit"** (the pencil icon next to the account name, or the "Edit" button in the action bar).

Change the **"Type"** field to **"Customer - Direct"**.

Click **"Save"**.

📸 **What you should see:** The account record now shows Type = "Customer - Direct."

---

### Step 21: See the NBA Component in Action

With the Account record open (the one you just set to "Customer - Direct"), scroll to where you placed the Next Best Action component.

📸 **What you should see:** The "Recommended Actions" component appears with one or two recommendation cards. Each card shows:
- The recommendation name (e.g., "Schedule Executive Business Review")
- The description
- Two buttons: "Schedule EBR" and "Not Now"

If you see the component but no recommendations, wait 30 seconds and refresh the page. It may take a moment for the strategy to execute.

---

### Step 22: Interact with a Recommendation

Click the **"Schedule EBR"** acceptance button on the recommendation.

📸 **What you should see:** The recommendation is accepted. It may disappear from the component (indicating it was acted on) or show a confirmation message. The specific behavior depends on whether you configured an acceptance action — since we left it blank in Step 2, the recommendation simply closes.

---

### Step 23: Test with a Non-Customer Account

Navigate to a different Account record that does NOT have Type = "Customer - Direct" or "Customer - Channel" (e.g., Type = "Prospect").

📸 **What you should see:** The Next Best Action component is visible but shows no recommendations (because the Filter condition in your strategy did not match). This confirms your filter logic is working correctly.

---

## Optional Extension: Add an Action to the Recommendation

If you want to see a recommendation trigger an actual action (like creating a task), follow these steps:

### Step 24: Create a Simple Flow for EBR Task Creation

Go to Setup > Quick Find: type `Flows` and click **"Flows"**.

Click **"New Flow"** > **"Screen Flow"**.

In the simplest version, create a flow with one "Create Records" element that creates a Task:

- Subject: `Schedule Executive Business Review`
- Priority: `High`
- Status: `Not Started`
- Related To: `{!contextRecordId}` (the Account)

Save and activate the flow as `EBR_Task_Creation`.

### Step 25: Link the Flow to the Recommendation

Go back to Setup > Next Best Action > Recommendations.

Click on **"Schedule Executive Business Review"** to edit it.

In the **"Action"** field, select **"Flow"** and search for your `EBR_Task_Creation` flow.

Save the recommendation.

Now when a user clicks "Schedule EBR," the flow runs automatically and creates a task on the Account. This is the real power of NBA — it doesn't just suggest, it acts.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Strategy Builder won't open | Try a different browser (Chrome preferred). Disable browser extensions that might block JavaScript. |
| Next Best Action component not found in Lightning App Builder | Ensure you are editing an Account record page, not an app page. The component is only available on record pages. |
| Component shows on page but no recommendations appear | 1) Confirm your account Type matches the filter condition. 2) Confirm the Strategy is Active. 3) Confirm Recommendations are Active. 4) Hard refresh the page (Cmd+Shift+R). |
| "No active strategies" dropdown in component properties | The strategy must be Activated before it appears here. Return to Setup > Next Best Action > Strategies and activate your strategy. |
| Clicking "Accept" does nothing | If no Action flow is configured on the recommendation, this is expected. The recommendation is marked accepted internally but no visible action fires. Follow the Optional Extension steps to add a flow action. |
| Filter conditions reference invalid fields | Use the field picker in Strategy Builder rather than typing fields manually. The exact syntax for contextual record fields varies by release. |

---

## Reflection Questions

1. In this lab, the Next Best Action **Strategy** filtered recommendations based on the Account Type. Think of a more sophisticated real-world NBA strategy for a B2B software company. What conditions would you use to show the recommendation "Offer Annual Contract Discount" — and why?

2. You built the NBA flow using three components: Recommendations, Strategy, and Lightning Component. Map each component to an analogy in a real-world business process. For example: "The Recommendation is like _____ because _____."

3. The AI Associate exam distinguishes between **deterministic AI** (rule-based, predictable) and **probabilistic AI** (statistical, learns from data). Which type of AI does Next Best Action Strategy Builder use? Which type does Einstein Prediction Builder use? What are the tradeoffs between them in a business context?

---

## Summary

In this lab you:
- Created two Recommendation records with acceptance and rejection labels
- Built an Account Engagement Strategy with Load, Filter, Sort, and Limit elements
- Activated the strategy
- Added the Next Best Action Lightning component to the Account record page
- Tested recommendations on a qualifying Account (Type = Customer)
- Verified that non-qualifying accounts show no recommendations

You now have a working end-to-end NBA implementation — one of the most discussion-heavy topics on the AI Associate exam.

**Congratulations!** You have completed all four hands-on labs. You now have direct, practical experience with:
- Prompt Builder (generative AI)
- Einstein Prediction Builder (predictive AI / ML)
- Next Best Action (intelligent recommendations)

These hands-on skills, combined with your study of the AI Associate exam topics, will significantly boost your confidence on exam day.
