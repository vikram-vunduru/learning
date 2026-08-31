# Lab 1: Admin Org Setup

## 🎯 Lab Objectives
- Obtain and access a Salesforce Developer Edition org
- Configure Company Information settings
- Enable and configure My Domain
- Create a custom app in App Manager
- Configure the app's navigation bar with relevant tabs

## ⏱️ Estimated Time
45–60 minutes

## 🔧 Prerequisites
- A valid email address (for Developer Edition sign-up)
- A web browser (Google Chrome recommended)
- No prior Salesforce setup required — this lab starts from scratch

## 📋 Step-by-Step Instructions

### Part 1: Create a Developer Edition Org

1. Navigate to [developer.salesforce.com/signup](https://developer.salesforce.com/signup) in your browser.
2. Fill in the registration form:
   - First Name, Last Name
   - Email Address (use your real email — you'll receive a verification message)
   - Role: **Administrator**
   - Company: Enter any name (e.g., "CertStudio Labs")
   - Country, Postal Code
   - Username: Must be in email format and globally unique (e.g., `firstname.lastname.certlab@example.com`)
3. Click **Sign Me Up**.
4. Check your email for a verification message from Salesforce. Click **Verify Account**.
5. Set your password and security question, then click **Change Password**.
6. You are now logged in to your Developer Edition org.

> **Note:** Your Developer Edition org is free forever and has most Enterprise Edition features enabled. It is ideal for learning and practice.

### Part 2: Configure Company Information

1. Click the **Setup** gear icon (top right) → **Setup**.
2. In the Quick Find box, type `Company Information` and click **Company Information**.
3. Click **Edit** and update the following fields:
   - **Company Name:** CertStudio Labs
   - **Default Locale:** Your preferred locale (e.g., English (United States))
   - **Default Time Zone:** Your time zone
   - **Default Currency:** USD - U.S. Dollar
   - **Fiscal Year Start Month:** January (or your preferred month)
4. Click **Save**.
5. Observe the **Salesforce.com Organization ID** — this is your org's unique identifier.

> **Checkpoint:** Company Information is now updated. These settings affect date formats, currency symbols, and fiscal year calculations throughout the org.

### Part 3: Set Up My Domain

My Domain creates a custom subdomain URL for your org (e.g., `certstudiolabs.my.salesforce.com`).

1. In Quick Find, type `My Domain` and click **My Domain**.
2. Under "My Domain Name," enter a subdomain name (e.g., `certstudiolabs-dev`).
3. Click **Check Availability** to verify the subdomain is available.
4. If available, click **Register Domain**.
5. Wait 1–5 minutes for the domain to be provisioned. Salesforce will send an email when ready.
6. Once the email arrives, return to My Domain in Setup.
7. Click **Log in** under the "Test your login" section to test the new domain.
8. Under **Deploy to Users**, click **Deploy to Users** → **OK**.

> **Important:** My Domain is required for Lightning Experience, single sign-on (SSO), and Salesforce mobile. Always deploy My Domain before implementing SSO.

> **Checkpoint:** Your org now has a custom subdomain. The URL in your browser should now show your custom domain.

### Part 4: Create a Custom App in App Manager

1. In Quick Find, type `App Manager` and click **App Manager**.
2. Click **New Lightning App** in the top right.
3. In the App Wizard, complete Step 1 (App Details):
   - **App Name:** Sales Hub
   - **Developer Name:** (auto-populated as Sales_Hub)
   - **Description:** "Custom app for sales team productivity"
   - **App Logo:** Upload an image if desired, or skip
4. Click **Next**.
5. Step 2 (App Options):
   - Leave defaults (Navigation Type: Standard Navigation)
   - Enable **Utility Bar:** Skip for now, click **Next**
6. Step 3 (Utility Items): Skip, click **Next**
7. Step 4 (Navigation Items) — Add the following tabs:
   - Accounts
   - Contacts
   - Opportunities
   - Reports
   - Dashboards
   - Tasks
   - Use the arrow buttons to reorder tabs as desired
8. Click **Next**.
9. Step 5 (User Profiles):
   - Add **System Administrator** profile (required to test the app)
   - You can add other profiles later
10. Click **Save & Finish**.

> **Checkpoint:** The Sales Hub app now appears in the App Launcher. Navigate to the App Launcher (grid icon, top left) and click **Sales Hub** to switch to your new app.

### Part 5: Customize the Navigation Bar

1. Switch to the **Sales Hub** app (App Launcher → Sales Hub).
2. In the top navigation bar, click the pencil/edit icon (may appear as "Customize Navigation Bar" when you hover over the nav bar).
3. In the navigation bar editor:
   - Confirm the tabs added in Part 4 appear
   - Add **Cases** to the navigation: click **Add More Items**, search for Cases, add it
   - Reorder items by dragging: move Accounts to the first position
4. Click **Save**.
5. Verify the navigation bar shows: Accounts | Contacts | Opportunities | Cases | Reports | Dashboards | Tasks

> **Bonus:** Try clicking each tab to verify they load correctly. Notice that the navigation in Sales Hub is different from the default Salesforce app.

---

## ✅ Verification Checklist

Before marking this lab complete, verify each item:

- [ ] Successfully signed up for and accessed a Developer Edition org
- [ ] Company Name is set to "CertStudio Labs" (or your chosen name) in Company Information
- [ ] Default Locale, Time Zone, and Currency are configured
- [ ] My Domain is registered, tested, and deployed to users
- [ ] The org URL in your browser reflects the custom My Domain subdomain
- [ ] Sales Hub Lightning app is visible in the App Launcher
- [ ] Sales Hub navigation bar includes: Accounts, Contacts, Opportunities, Cases, Reports, Dashboards, Tasks
- [ ] You can switch between Sales Hub and other apps via the App Launcher

## 💡 Bonus Challenges

1. **App Logo:** Find a free icon image online and upload it as the Sales Hub app logo. Verify it appears in the App Launcher.

2. **Utility Bar:** Edit the Sales Hub app in App Manager and add a Utility Bar item for "History" (Recently Viewed). Save and observe the utility bar at the bottom of the screen.

3. **Second App:** Create a second Lightning app called "Service Hub" with: Cases, Accounts, Contacts, Reports, Dashboards tabs. Assign it to System Administrator.

4. **Navigation Styles:** In App Manager, find the Sales Hub app and click "Edit." Explore the Navigation Style option. What is the difference between Standard Navigation and Console Navigation? Try switching to Console and observe the UI change.

5. **Fiscal Year:** In Company Information, change the Fiscal Year Start Month to April. Navigate to an Opportunity report and notice how the fiscal quarter labels change. Then revert to January.
