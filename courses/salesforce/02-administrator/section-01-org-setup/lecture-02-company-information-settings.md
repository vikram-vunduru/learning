# L02: Company Information & Settings

## 🎯 Learning Objectives
- Identify and configure key fields on the Company Information page
- Distinguish between Salesforce editions and their feature differences
- Explain storage limits, license types, and My Domain setup

## 📊 SLIDES

### Slide 1: Company Information — The Org Dashboard
**Visual:**
```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  Setup > Company Information                                            │
  ├───────────────────────────────────┬─────────────────────────────────────┤
  │ Organization Name                 │  Acme Corporation       ◀── Browser tab title
  │ Salesforce.com Organization ID    │  00D3h000007RMXy        ◀── Required for Support
  │ Default Locale                    │  English (United States) ◀── Date/number format
  │ Default Language                  │  English                ◀── UI label language
  │ Default Time Zone                 │  (GMT-08:00) Pacific    ◀── Timestamp baseline
  │ Currency Locale                   │  USD - U.S. Dollar      ◀── Org base currency
  ├───────────────────────────────────┼─────────────────────────────────────┤
  │ Used Data Space                   │  1.2 GB / 10 GB         ◀── Record storage
  │ Used File Space                   │  0.4 GB / 10 GB         ◀── Attachment storage
  └───────────────────────────────────┴─────────────────────────────────────┘
```
**Content:**
- Path: **Setup > Company Information**
- **Organization Name:** Displayed in the browser tab and some notification emails
- **Org ID:** Unique 15-character identifier for your org (support cases require this)
- **Default Locale:** Controls date, time, and number formatting for new users
- **Default Language:** The language Salesforce UI displays for users who haven't set their own
**Speaker Notes:** Company Information is the single most important overview page in Setup. Salesforce Support will always ask for your Org ID when you open a case. The Default Locale setting affects how dates and numbers are formatted — for example, whether a date reads MM/DD/YYYY or DD/MM/YYYY. Users can override these defaults on their own profile if needed.

### Slide 2: Locale, Language, and Time Zone
**Visual:**
```
                    ┌──────────────────────────────────────┐
                    │         GLOBAL ORG SETTINGS          │
                    └──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
  ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
  │      LANGUAGE       │   │       LOCALE        │   │     TIME ZONE       │
  ├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
  │ Controls UI text:   │   │ Controls formatting:│   │ Controls when       │
  │  • Button labels    │   │  • Date format      │   │  records are        │
  │  • Field names      │   │  • Number format    │   │  time-stamped and   │
  │  • Help text        │   │  • Name ordering    │   │  jobs are run       │
  │  • Error messages   │   │  • Currency symbol  │   │                     │
  └─────────────────────┘   └─────────────────────┘   └─────────────────────┘
        └──────────────────────────────┴──────────────────────────────┘
                  Users can override all three in their personal settings
```
**Content:**
- **Default Language:** Controls UI labels, button text, and help text org-wide
- **Default Locale:** Controls date format, number format, and name order
- **Default Time Zone:** Used for date/time fields and scheduled jobs when user TZ is not set
- Individual users can override all three in their personal settings
- Supported languages include English, Spanish, French, German, Japanese, and 25+ more
**Speaker Notes:** These three settings are easy to confuse on the exam. Language is about the words you see in the UI. Locale is about the format of data like dates and currency. Time zone affects when automated jobs run and how timestamps are displayed. Always set these to match your primary user base; remote users can set their own overrides.

### Slide 3: Currency Settings
**Visual:**
```
  ┌───────────────────────────────────┐             ┌───────────────────────────────────────┐
  │        SINGLE CURRENCY            │             │        MULTIPLE CURRENCIES             │
  ├───────────────────────────────────┤             ├───────────────────────────────────────┤
  │  $ USD only                       │             │  Corporate Currency: $ USD             │
  │                                   │   enable    │           │                           │
  │  All amounts in one               │  ─────────▶ │           ▼                           │
  │  currency org-wide                │             │  Active Currencies:                   │
  │                                   │             │   $ USD │ € EUR │ £ GBP │ ¥ JPY       │
  │  Default state                    │             │                                       │
  │                                   │             │  + Advanced Currency Management       │
  └───────────────────────────────────┘             │    (dated exchange rates on Opp.)     │
                                                    └───────────────────────────────────────┘
                              ⚠  Cannot be disabled once enabled
```
**Content:**
- **Single Currency:** Enabled by default; all amounts use one currency
- **Multiple Currencies:** Must be enabled (Setup > Company Information > Enable Multiple Currencies); cannot be disabled once enabled
- **Corporate Currency:** Your org's base currency; conversion rates are set against it
- **Advanced Currency Management (ACM):** Adds dated exchange rates for Opportunities
**Speaker Notes:** Enabling multiple currencies is another irreversible action — similar to Custom Fiscal Year. Once you turn it on, you cannot turn it off. Advanced Currency Management layers on top of multiple currencies to give you historically accurate exchange rates on opportunity amount fields. The exam tests whether candidates understand that standard currency fields use the current conversion rate, while ACM fields use the rate from the opportunity close date.

### Slide 4: Salesforce Editions
**Visual:**
```
  ┌──────────────────────┬───────────┬──────────────┬────────────┬───────────┬───────────┐
  │  FEATURE             │ ESSENTIAL │ PROFESSIONAL │ ENTERPRISE │ UNLIMITED │ DEVELOPER │
  ├──────────────────────┼───────────┼──────────────┼────────────┼───────────┼───────────┤
  │  API Access          │     ✗     │      ✗       │     ✓      │     ✓     │     ✓     │
  │  Custom Profiles     │     ✗     │      ✗       │     ✓      │     ✓     │     ✓     │
  │  Workflow Rules      │     ✗     │      ✓       │     ✓      │     ✓     │     ✓     │
  │  Process Builder     │     ✗     │      ✓       │     ✓      │     ✓     │     ✓     │
  │  Sandbox             │     ✗     │      ✗       │     ✓      │ Unlimited │    ✓ *    │
  │  Custom Roles        │     ✗     │      ✓       │     ✓      │     ✓     │     ✓     │
  │  Developer Console   │     ✗     │      ✗       │     ✓      │     ✓     │     ✓     │
  └──────────────────────┴───────────┴──────────────┴────────────┴───────────┴───────────┘
    * Developer Edition ≠ a Sandbox of Production — it is a standalone free org
```
**Content:**
- **Essentials:** Basic CRM for small teams; limited customization; no sandbox
- **Professional:** Full CRM features; no API access by default; no sandbox
- **Enterprise:** Full customization + API; sandboxes included; most common enterprise edition
- **Unlimited:** Everything in Enterprise + unlimited sandboxes + 24/7 premier support
- **Developer Edition:** Free; Enterprise-level features; for development and learning only
**Speaker Notes:** Enterprise edition is the most commonly deployed edition in medium-to-large companies because it includes API access, custom profiles, and sandboxes. Professional edition is a common trap on the exam — it lacks API access by default, which matters when you're integrating with third-party tools. Developer Edition includes Enterprise-level features for free, which is why it is used for certification prep.

### Slide 5: Storage Limits
**Visual:**
```
  DATA STORAGE                               FILE STORAGE
  ┌──────────────────────────────────┐       ┌──────────────────────────────────┐
  │  Stores: Accounts, Contacts,     │       │  Stores: Attachments, Files,     │
  │          Opportunities, custom   │       │          Documents, Content      │
  │          object records          │       │                                  │
  │                                  │       │                                  │
  │  Used:  ████████░░  8 GB / 10 GB │       │  Used:  ████░░░░░░  4 GB / 10 GB │
  │         80% consumed             │       │         40% consumed             │
  │                                  │       │                                  │
  │  ⚠  Near limit — action needed!  │       │  ✓  Within safe range            │
  └──────────────────────────────────┘       └──────────────────────────────────┘
       Both tracked at: Setup > Company Information (Used Data / File Space)
       Exceeding limits → users cannot save new records
```
**Content:**
- **Data Storage:** Stores records (Accounts, Contacts, Opportunities, custom objects, etc.)
- **File Storage:** Stores attachments, files, documents, and content
- Storage amounts vary by edition and number of licenses (e.g., Enterprise gets 10 GB data + 10 GB file base)
- Exceeding storage limits prevents creating new records
- Path to check: **Setup > Company Information** (Used Data Space / Used File Space)
**Speaker Notes:** Storage issues can sneak up on an admin if they are not monitoring usage. The Company Information page shows both data and file storage consumption at a glance. If you hit the limit, users will start getting errors when trying to save records. Options include purchasing more storage, archiving old records, or cleaning up attachment files.

### Slide 6: User Licenses
**Visual:**
```
  ┌─────────────────────────────┬────────────────────────────────────────────────────┐
  │  LICENSE TYPE               │  USE CASE                                          │
  ├─────────────────────────────┼────────────────────────────────────────────────────┤
  │  Salesforce                 │  Full CRM access; all standard + custom objects    │
  │  Salesforce Platform        │  Custom apps only; limited to Accounts & Contacts  │
  │  Chatter Free               │  Collaboration/feed only; no CRM data              │
  │  Chatter Only               │  Feed + limited Salesforce data view               │
  │  Community Login            │  External users (customers); per-login billing     │
  │  Partner Community          │  External partners; CRM-lite access                │
  └─────────────────────────────┴────────────────────────────────────────────────────┘
    License type is set on the User record and determines the user's access ceiling
```
**Content:**
- **Salesforce license:** Full CRM access; includes standard and custom objects
- **Salesforce Platform license:** Access to custom apps + limited standard objects (Accounts, Contacts only)
- **Chatter Free / Chatter Only:** Collaboration-only access; no CRM data
- **Community (Experience Cloud) licenses:** For external users (customers, partners)
- License type determines what the user can access — it's set on the user record
**Speaker Notes:** A common exam scenario is: "A user only needs access to your custom app but not Accounts or Opportunities — what license should you assign?" The answer is Salesforce Platform. Chatter licenses are for users who only need to collaborate in feeds without seeing CRM records. Always match the license to the minimum access the user needs.

### Slide 7: My Domain
**Visual:**
```
  BEFORE MY DOMAIN                      AFTER MY DOMAIN (deployed)
  ┌────────────────────────────────┐     ┌──────────────────────────────────────────┐
  │  https://login.salesforce.com  │ ──▶ │  https://mycompany.my.salesforce.com     │
  └────────────────────────────────┘     └──────────────────────────────────────────┘
                                         Required for:  ✓ Lightning Components
                                                        ✓ Single Sign-On (SSO)
                                                        ✓ OAuth Flows

  SETUP STEPS:
  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │  1. Choose       │──▶│  2. Register     │──▶│  3. Test Login   │──▶│  4. Deploy       │
  │  Domain Name     │   │  (a few minutes) │   │  URL             │   │  to Users        │
  └──────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
  ⚠  After deployment: old login.salesforce.com URL no longer routes to your org
```
**Content:**
- **My Domain:** A custom subdomain for your Salesforce org (e.g., `acme.my.salesforce.com`)
- Required for: Lightning components, single sign-on (SSO), OAuth flows
- Path: **Setup > My Domain**
- Steps: Choose name → Register → Test → Deploy to users
- Once deployed, the old login URL stops working for your org
**Speaker Notes:** My Domain is no longer optional — it is required for Lightning Experience and any modern Salesforce integration. The setup process has four clear steps: you choose your subdomain name, Salesforce registers it (takes a few minutes), you test it, and then you deploy it to all users. Once deployed, users who try to use the generic login.salesforce.com URL will be redirected. The exam may ask about My Domain as a prerequisite for SSO or Lightning components.

### Slide 8: Key Company Information Exam Facts
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │           ★  COMPANY INFORMATION — EXAM CHEAT SHEET  ★                 │
  ├──────────────────────────────────────────────────────────────────────────┤
  │  ▶  Multiple Currencies      →  CANNOT be disabled once enabled         │
  │  ▶  Enterprise edition       →  Includes sandboxes & API access         │
  │  ▶  Professional edition     →  NO API access, NO sandboxes             │
  │  ▶  My Domain                →  Required for Lightning components & SSO │
  │  ▶  Default Locale           →  Controls date/number format             │
  │  ▶  Default Language         →  Controls UI text labels                 │
  │  ▶  Org ID location          →  Setup > Company Information             │
  │  ▶  Storage types            →  Data Storage ≠ File Storage             │
  └──────────────────────────────────────────────────────────────────────────┘
```
**Content:**
- Multiple Currencies, once enabled, **cannot be disabled**
- Enterprise edition includes sandboxes; Professional does **not**
- My Domain is required for Lightning components and SSO
- Default Locale ≠ Default Language — they control different things
- Org ID is required when contacting Salesforce Support
- File Storage and Data Storage are tracked separately
**Speaker Notes:** Let's lock in the key exam takeaways from this lecture. The irreversibility theme appears again with Multiple Currencies — the exam tests this consistently. Know the edition feature differences, especially around API access and sandboxes. And remember that My Domain is a prerequisite, not just a nicety.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 2 — Company Information and Settings. In the previous lecture we got familiar with the Setup menu overall. Now we're going deeper into the Company Information page and the org-level settings that affect every user and every record in your Salesforce environment.

Start by navigating to Setup and typing "Company Information" in the Quick Find box. This page is your org's dashboard. You'll immediately see fields like Organization Name, Org ID, Default Locale, Default Language, and Default Time Zone. Your Org ID is the 15-character identifier you'll need whenever you contact Salesforce Support — memorize where to find it.

Let's talk about the three settings that candidates frequently mix up: Language, Locale, and Time Zone. Language controls what text appears in the Salesforce UI — button labels, field names, help text. Locale controls how data is formatted — date patterns, number separators, name ordering. Time Zone determines how timestamps are recorded and when scheduled automations run. Users can override all three in their personal settings, but these org-level defaults are what applies to anyone who hasn't customized their own.

Currency is another important area. By default, your org is single-currency. If your company operates in multiple countries, you can enable Multiple Currencies from the Company Information page. Fair warning — and this is an exam favorite — once you enable Multiple Currencies, you cannot disable it. You can also add Advanced Currency Management on top of that, which stores dated exchange rates specifically for Opportunity amounts.

Now let's look at Salesforce editions, because the edition your company purchased determines what features are available. Enterprise edition is the gold standard for most large organizations: it includes API access, custom profiles, custom roles, Process Builder, Flow, and sandbox environments. Professional edition removes API access by default and doesn't include sandboxes — that's a meaningful limitation. Unlimited edition adds 24/7 support and more sandbox capacity. Developer Edition is free and mimics Enterprise features — perfect for this certification course.

Storage is something every admin eventually has to deal with. Salesforce separates Data Storage — which holds records — from File Storage — which holds attachments and uploaded files. Both are tracked on the Company Information page. If you approach the limit, you'll need to either purchase additional storage or clean up old data.

Finally, let's cover My Domain. My Domain gives your org a custom URL like yourcompany.my.salesforce.com. It's required if you want to use Lightning components or configure Single Sign-On. The setup is a four-step process: choose a domain name, register it, test it, then deploy it to users. After deployment, the old generic login URL stops routing to your org.

That covers the essential Company Information settings. In the next lecture, we'll explore Lightning Experience — the modern Salesforce interface and how to customize it for your users.

## 🔔 EXAM TIPS
- **Multiple Currencies is irreversible:** Just like Custom Fiscal Year, enabling Multiple Currencies cannot be undone. The exam tests this on a near-regular basis.
- **Edition feature gaps:** Professional edition lacks API access by default and has no sandboxes. Enterprise is the minimum edition for full customization and integration.
- **Locale vs. Language:** These control different things. Locale = data formatting. Language = UI text. Both can be overridden by individual users.

## ✅ LECTURE SUMMARY
- Company Information (Setup > Company Information) shows org ID, edition, storage usage, and license counts
- Default Locale controls date/number formatting; Default Language controls UI text; both are user-overridable
- Multiple Currencies, once enabled, cannot be disabled; Advanced Currency Management adds dated exchange rates
- Enterprise edition is the most common full-featured edition; Professional lacks API access and sandboxes
- My Domain creates a custom subdomain and is required for Lightning components and SSO

## ❓ MINI QUIZ

**Q1:** A company wants to track opportunities in multiple currencies. An administrator enables Multiple Currencies. Later, the CFO asks to revert to single currency. What should the administrator tell the CFO?
- A) It can be disabled in Setup > Company Information
- B) Salesforce Support can disable it with a service request
- C) Multiple Currencies cannot be disabled once enabled
- D) It will automatically revert after 30 days if no currencies are added
**Answer:** C — Multiple Currencies is irreversible. Once enabled, it cannot be turned off, regardless of how many currencies have been added.

**Q2:** A user reports that dates are showing in DD/MM/YYYY format but the company standard is MM/DD/YYYY. Which setting should the administrator check first?
- A) Default Language on Company Information
- B) Default Locale on Company Information
- C) The user's time zone setting
- D) Field-level security on date fields
**Answer:** B — Default Locale controls date and number formatting. The admin should confirm the org's Default Locale is set correctly, and also check the individual user's personal locale setting.

**Q3:** Which Salesforce feature requires My Domain to be configured before it can be used?
- A) Custom Objects
- B) Workflow Rules
- C) Lightning Components
- D) Standard Report Types
**Answer:** C — My Domain is a prerequisite for using Lightning Components, Single Sign-On (SSO), and OAuth-based authentication flows.
