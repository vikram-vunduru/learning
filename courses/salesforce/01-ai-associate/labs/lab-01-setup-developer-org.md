# Lab 1: Set Up Your Salesforce Developer Org

**Objective:** Create a free Salesforce Developer Edition org, enable Einstein AI features, and verify your environment is ready for all course labs.

**Time Required:** 20 minutes

**Prerequisites:** A valid email address (Gmail, Outlook, or any personal email — do NOT use a corporate email tied to an existing Salesforce org)

---

## Overview

Every lab in this course uses a free Salesforce Developer Edition (DE) org. This is a fully functional Salesforce environment provided by Salesforce at no cost. It includes access to Einstein features, Prompt Builder, Next Best Action, and Einstein Prediction Builder — everything you need to practice for the AI Associate exam.

---

## Part 1: Create Your Developer Edition Org

### Step 1: Go to the Signup Page

Open a web browser and navigate to:

**`https://developer.salesforce.com/signup`**

📸 **What you should see:** A signup form titled "Sign Up for a Developer Edition" with fields for First Name, Last Name, Email, Role, Company, Country, Postal Code, Username, and a checkbox for agreeing to terms.

---

### Step 2: Fill Out the Signup Form

Fill in each field as follows:

| Field | What to Enter |
|-------|--------------|
| `First Name` | Your first name |
| `Last Name` | Your last name |
| `Email` | Your personal email address |
| `Role` | Select **Developer** from the dropdown |
| `Company` | Enter anything — "Personal Learning" works fine |
| `Country` | Select your country |
| `Postal Code` | Your postal/zip code |
| `Username` | **This must be globally unique.** Use a format like: `yourname.aiassociate.2024@example.com` — it does NOT need to be a real email address, just unique globally |

> **Important:** Write down your username. You will use it every time you log in. It looks like an email but is NOT an email address.

Once all fields are filled, check the box to agree to the Master Subscription Agreement, then click the **"Sign me up"** button.

📸 **What you should see:** A green confirmation message: "Check your email. We sent you a confirmation email at [your email]. Click the link in the email to confirm your identity and choose a password."

---

### Step 3: Verify Your Email

Open your email inbox. Look for an email from **Salesforce** with the subject line **"Welcome to Salesforce: Verify your account"**.

> **Tip:** If you don't see it within 5 minutes, check your spam/junk folder.

Click the **"Verify Account"** button inside the email.

📸 **What you should see:** Your browser opens a Salesforce page asking you to create a password. There will be two fields: `New Password` and `Confirm New Password`, plus a security question dropdown.

---

### Step 4: Set Your Password

- Enter a strong password in both password fields (minimum 8 characters, at least 1 number and 1 letter)
- Select a security question from the dropdown and enter your answer
- Click **"Change Password"**

📸 **What you should see:** Your new Developer Edition org loads. You'll see the Salesforce Lightning Experience home page with the App Launcher in the top-left corner (the grid of 9 squares icon), a navigation bar across the top, and a welcome message or home dashboard in the main area.

**Congratulations — you now have a live Salesforce Developer org!**

---

## Part 2: Explore the Setup Menu

Before enabling Einstein, let's get comfortable with the Setup menu — you'll use it constantly throughout this course.

### Step 5: Open Setup

In the top-right corner, click the **gear icon** (it looks like a cog/settings gear).

In the dropdown that appears, click **"Setup"**.

📸 **What you should see:** The Setup page opens. On the left side is a navigation panel with a search bar at the top labeled "Quick Find." Below that are sections including **Administration**, **Platform Tools**, and **Settings**. The main content area on the right shows the "Setup Home" with recent pages and a search bar.

---

### Step 6: Get Familiar with Quick Find

The **Quick Find** box (top of the left sidebar) is the fastest way to navigate Setup. You'll use it in every lab.

Click inside the Quick Find box and type `Einstein`.

📸 **What you should see:** As you type, the left sidebar filters to show only menu items that match "Einstein." You should see entries like **Einstein**, **Einstein Activity Capture**, and others depending on your org. If you see multiple Einstein entries, that confirms Einstein features are available in your org.

---

## Part 3: Enable Einstein Features

### Step 7: Open Einstein Setup

In the Quick Find box, type `Einstein` and click **"Einstein"** under the **Einstein** section (not "Einstein Activity Capture" or other sub-items).

📸 **What you should see:** The **Einstein Setup** page opens. You'll see a page titled "Einstein" with a large banner area and a section labeled **"Einstein Features"** with an on/off toggle. The toggle may already be turned on in newer Developer Edition orgs.

---

### Step 8: Enable Einstein

If the **Einstein Features** toggle is set to **Off**, click the toggle to turn it **On**.

A confirmation dialog may appear asking you to confirm. Click **"Enable"** or **"Turn On"** to confirm.

📸 **What you should see:** The toggle switches to **On** (usually shown in blue). A green success banner may appear at the top of the page saying "Einstein has been enabled." The page may refresh.

> **Note:** In some newly created Developer orgs, Einstein is already enabled. If the toggle is already On, you can skip this step.

---

### Step 9: Enable Einstein Generative AI

In the Quick Find box, type `Einstein Generative AI` and click the result.

📸 **What you should see:** A page titled "Einstein Generative AI" with a toggle labeled **"Turn on Einstein"** or **"Einstein Generative AI."**

Click the toggle to turn it **On** if it is not already enabled.

---

## Part 4: Verify Access to Key AI Features

Now let's confirm you can reach each feature you'll use in the course labs.

### Step 10: Find Prompt Builder

In Quick Find, type `Prompt Builder` and press Enter or click the result.

📸 **What you should see:** The **Prompt Builder** page opens. You'll see a list view titled "Prompt Templates" which will be empty since you haven't created any yet. There should be a **"New"** button in the top-right corner. This confirms Prompt Builder is accessible.

> **If you do NOT see Prompt Builder:** Generative AI may not be fully enabled. Return to Step 9 and make sure the toggle is On. Wait 1-2 minutes for the feature to activate, then refresh the page.

---

### Step 11: Find Einstein Prediction Builder

In Quick Find, type `Prediction Builder` and click the result.

📸 **What you should see:** The **Einstein Prediction Builder** page opens with a list view of predictions (empty for now) and a **"New Prediction"** button. You may also see an introductory screen if this is your first time visiting.

> **If Prediction Builder is not visible:** Some Developer Edition orgs require you to enable it separately. See the Troubleshooting section below.

---

### Step 12: Find Next Best Action

In Quick Find, type `Next Best Action` and click the result.

📸 **What you should see:** The **Next Best Action** setup page opens with two tabs: **Strategies** and **Recommendations**. Both will be empty. This confirms NBA is accessible.

---

### Step 13: Find Einstein Studio (Optional — MGA Orgs)

In Quick Find, type `Einstein Studio` and click the result.

📸 **What you should see:** Einstein Studio opens with options to connect AI models, including Bring Your Own Model (BYOM) features. **Note:** Full Einstein Studio functionality may be limited in Developer Edition orgs — this is expected. You can still navigate the interface for exam familiarity.

---

## Part 5: Configure Your User Profile for Labs

### Step 14: Enable Einstein Features on Your User Profile

In Quick Find, type `Users` and click **"Users"** under the Administration section.

📸 **What you should see:** A list of users in your org. You should see one user — your own — listed here.

Click your username link to open your user record.

---

### Step 15: Check Permission Sets

Scroll down to the **Permission Set Assignments** section of your user record.

📸 **What you should see:** A list of permission sets currently assigned to you. In a Developer Edition org, you typically have "Salesforce" as your license and System Administrator as your profile, which grants broad access.

For this course, System Administrator access is sufficient. No additional permission sets are needed.

---

## Verification Checklist

Before moving to Lab 2, confirm all of the following:

- [ ] You can log in to your Developer Edition org successfully
- [ ] You can navigate to Setup using the gear icon
- [ ] Einstein Features toggle is ON (Setup > Einstein)
- [ ] Einstein Generative AI is ON
- [ ] Prompt Builder appears in Setup Quick Find and shows the "New" button
- [ ] Einstein Prediction Builder appears in Setup Quick Find
- [ ] Next Best Action appears in Setup Quick Find with Strategies and Recommendations tabs

If all boxes are checked, you're ready to proceed to Lab 2.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Didn't receive the verification email | Check spam/junk folder. Wait 10 minutes. Try signing up again with the same email but a slightly different username. |
| "Username already in use" error | Your username must be globally unique across ALL Salesforce orgs worldwide. Add numbers or change the domain portion (e.g., `jane.smith.2024.labs@training.sf`) |
| Einstein toggle is missing from Setup | Your org may need a few hours to provision fully. Log out, wait 30 minutes, and log back in. If still missing, create a new Developer Edition org. |
| Prompt Builder not in Quick Find | Ensure "Einstein Generative AI" is enabled. Some orgs require you to navigate to Setup > Einstein > Einstein Generative AI and turn on the toggle. |
| "Insufficient Privileges" error | You should have System Administrator profile in a Developer Edition org. If you see this, go to Setup > Users > Your User > and confirm Profile = "System Administrator." |
| Einstein Prediction Builder not available | Go to Setup > Einstein > Einstein Prediction Builder and click "Get Started" if prompted. You may need to accept terms of service. |
| Page loads but shows spinning wheel indefinitely | Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows). Clear browser cache if the issue persists. |
| Browser compatibility issues | Use Google Chrome or Mozilla Firefox. Salesforce Lightning Experience works best in Chrome. Avoid Internet Explorer or older browsers. |

---

## Reflection Questions

1. In your own words, what is the difference between a Salesforce Developer Edition org and a production org? Why is it safe to experiment in a Developer Edition?

2. You navigated to Prompt Builder, Prediction Builder, and Next Best Action in Setup. Based on what you saw (even though they were empty), can you describe in one sentence what each feature appears to be designed for?

3. Why do you think Salesforce requires Einstein Generative AI to be separately enabled, rather than having it on by default in all orgs?

---

## Next Steps

Proceed to **Lab 2: Build a Prompt Template with Prompt Builder** where you'll create your first AI-powered prompt template for Case summarization.
