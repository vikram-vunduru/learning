# Lab 01 — Admin Org Setup

## What You Need to Be Able to Do

This lab covers the foundational org setup tasks. If you can do all of these from memory, you understand Section 1 (Org Setup) at the exam level.

### Create a Developer Edition Org
- [ ] Go to developer.salesforce.com and create a new Developer Edition org
- [ ] Understand this is NOT a sandbox — it has no Production parent
- [ ] Log in to your new DE org using the username you registered with

### Configure Company Information
- [ ] Navigate to Setup → Company Settings → Company Information
- [ ] Find and note the Org ID (globally unique identifier)
- [ ] Change the Default Locale to a different country's locale and observe date format changes
- [ ] Change the Default Language and observe label changes
- [ ] Reset to your preferred locale/language
- [ ] Note the storage used, licenses available, and edition

### Set Up My Domain
- [ ] Navigate to Setup → Company Settings → My Domain
- [ ] Register a My Domain subdomain (e.g., `yourname-dev`)
- [ ] Wait for domain provisioning (may take a few minutes in DE org)
- [ ] Test by logging in via the new My Domain URL
- [ ] Deploy to users (makes it the default URL for the org)
- [ ] Confirm that your login URL now shows `yourname-dev.my.salesforce.com`

### Configure Session Settings
- [ ] Navigate to Setup → Security → Session Settings
- [ ] Review session timeout and security settings
- [ ] Note which options affect login security

### Create a Lightning App
- [ ] Navigate to Setup → App Manager
- [ ] Click "New Lightning App"
- [ ] Configure: App Name, Logo, Color (branding)
- [ ] Add Navigation Items: Accounts, Contacts, Leads, Opportunities
- [ ] Add a Utility Item: Tasks (so it appears in the bottom utility bar)
- [ ] Assign the app to your System Administrator profile
- [ ] Save and find the new app in the App Launcher
- [ ] Verify navigation items and utility bar appear correctly

### Customize the Navigation Bar
- [ ] From your new Lightning App, use the navigation bar personalization
- [ ] Add/remove navigation items from the user perspective
- [ ] Note that admins set defaults; users can personalize further

### Verify Setup Navigation
- [ ] Identify where to find each section in Setup (use Quick Find as shortcut)
- [ ] From Setup, navigate to: Users, Object Manager, Security Center, Profiles, Roles
- [ ] Use the Quick Find bar (top of Setup sidebar) to find settings quickly

## Key Validation Points

After completing this lab, verify you can answer:
- What is the Org ID and where is it found?
- What is My Domain and why is it required?
- What is the difference between a Developer Edition org and a Developer Sandbox?
- Where do you create Lightning Apps and what can they contain?
- What is the App Manager and what does it show?
