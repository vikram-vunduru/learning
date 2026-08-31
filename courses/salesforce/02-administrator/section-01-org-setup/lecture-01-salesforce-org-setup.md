# L01: Salesforce Org Setup

## 🎯 Learning Objectives
- Define what a Salesforce org is and explain the different org types
- Navigate the Setup menu and locate key configuration areas
- Describe the purpose of Company Information, fiscal year settings, and login security settings

## 📊 SLIDES

### Slide 1: What Is a Salesforce Org?
**Visual:** Diagram showing a cloud with the Salesforce logo, with arrows pointing to "Your Company's Data," "Your Configuration," and "Your Users" — emphasizing that an org is a single, isolated instance.
**Content:**
- An "org" is a single instance of Salesforce — your company's dedicated environment
- All data, configuration, users, and customizations live inside the org
- Each org has a unique 15- or 18-character Organization ID
- Multiple orgs can exist for the same company (e.g., Production + Sandboxes)
**Speaker Notes:** Think of an org as your company's private copy of Salesforce. Every setting you change, every record created, every user you add — it all lives in one isolated container. Salesforce runs thousands of orgs on shared infrastructure, but your data is logically separated from everyone else's.

### Slide 2: Types of Salesforce Orgs
**Visual:** Table with four rows — Production, Sandbox, Developer Edition, Scratch Org — each with an icon (factory, sandbox, developer laptop, construction helmet) and a one-line description.
**Content:**
- **Production org:** Your live, business-critical environment — real data, real users
- **Sandbox org:** A copy of Production used for development and testing; refreshed from Production
- **Developer Edition (DE):** A free, standalone org for learning and building — NOT a copy of Production
- **Scratch org:** A temporary, source-driven org used with Salesforce DX; expires in 1–30 days
**Speaker Notes:** The exam tests your ability to distinguish these org types. Sandboxes are copies of Production and are the right place to test changes before deploying them. Developer Edition orgs look similar but are completely separate environments — they are not linked to any Production org. Scratch orgs are short-lived and tied to version control workflows.

### Slide 3: Sandbox Types
**Visual:** Side-by-side comparison cards for Developer, Developer Pro, Partial Copy, and Full sandboxes, each showing storage size and refresh interval.
**Content:**
- **Developer sandbox:** 200 MB data storage, daily refresh, metadata only
- **Developer Pro sandbox:** 1 GB data storage, daily refresh, metadata only
- **Partial Copy sandbox:** 5 GB, 5-day refresh, metadata + sample of data
- **Full sandbox:** Same storage as Production, 29-day refresh, full metadata + data
**Speaker Notes:** Full sandboxes are the most expensive and take the longest to refresh, but they are the only type that gives you a complete mirror of Production data. Partial Copy sandboxes let you import a subset of records using a sandbox template. Developer sandboxes are the most common choice for configuration changes because they refresh quickly and are inexpensive.

### Slide 4: Navigating Setup
**Visual:** Annotated screenshot of the Salesforce Setup menu showing the gear icon, Quick Find box, and key navigation panels (Administration, Platform Tools, Settings).
**Content:**
- Access Setup via the **gear icon** (⚙) in the top-right navigation bar
- Use **Quick Find** to search any Setup page by keyword — fastest way to navigate
- Setup is organized into three sections: **Administration**, **Platform Tools**, **Settings**
- Administration covers users, data, email; Platform Tools covers objects, automation, integrations
**Speaker Notes:** You will spend most of your admin career in Setup. The Quick Find box is your best friend — instead of drilling through menus, just type what you're looking for. On the exam, you'll see questions that ask you to identify the correct Setup path for a task, so getting comfortable with the three main sections is important.

### Slide 5: Company Information Page
**Visual:** Screenshot of Setup > Company Information page with key fields highlighted: Organization Name, Default Locale, Default Language, Default Currency, Fiscal Year, Used Data Space, Used File Space.
**Content:**
- Path: **Setup > Company Information**
- Shows your Salesforce edition, org ID, and license counts
- Displays **storage usage** — data storage vs. file storage
- Contains locale, language, time zone, and currency settings
**Speaker Notes:** The Company Information page is a snapshot of your entire org. If you ever need to quickly find your Org ID, your edition, or how much storage you've used, this is the place. License counts here show you how many licenses of each type you have purchased and how many are in use.

### Slide 6: Fiscal Year Settings
**Visual:** Diagram showing a standard fiscal year (Jan–Dec) vs. a custom fiscal year (e.g., Feb–Jan) with a calendar illustration.
**Content:**
- Path: **Setup > Fiscal Year**
- **Standard fiscal year:** Aligned to a calendar year (Jan–Dec); uses standard quarters
- **Custom fiscal year:** Starts any month; allows non-standard quarter/period definitions
- Warning: Once you enable Custom Fiscal Year, you **cannot revert** to Standard
- Fiscal year affects forecasting, reports, and quota settings
**Speaker Notes:** Most companies use the standard fiscal year, which is simple to configure. Custom fiscal year is powerful but irreversible — this is a key exam fact. Enabling it affects how Salesforce handles forecasts and period-based reports, so it's not a decision to make lightly. The exam has tested the "cannot revert" warning on multiple occasions.

### Slide 7: Login Hours and IP Ranges
**Visual:** Two side-by-side panels: one showing a "Login Hours" grid by day of week and time, the other showing an IP address range input form, both inside a Profile settings page.
**Content:**
- **Login Hours** restrict when users on a profile can access Salesforce (set per profile)
- **Trusted IP Ranges** (on profiles): allow login without email verification from specified IPs
- **Network Access** (Setup > Security > Network Access): org-wide trusted IPs
- If a user tries to log in outside allowed hours, they receive an error
**Speaker Notes:** Login Hours and IP restrictions are both set at the profile level. This means different groups of users can have different login windows and different IP rules. The organization-level Trusted IP Range in Network Access applies to all users org-wide, while profile-level IP ranges are more targeted. Expect the exam to ask you to distinguish between these two levels.

### Slide 8: Key Org Setup Exam Facts
**Visual:** Clean bullet-point reference card styled as a "cheat sheet" with a yellow highlight background.
**Content:**
- Org ID is found at Setup > Company Information
- Developer Edition ≠ Sandbox — DE is a standalone free org, not a copy of Production
- Custom Fiscal Year cannot be reverted to Standard
- Login Hours are set per **profile**, not per user
- Quick Find is the fastest way to navigate Setup
- Full sandbox = same storage as Production, 29-day minimum refresh
**Speaker Notes:** These are the high-frequency exam facts for Org Setup. I recommend writing these on a sticky note while you study. The distinction between Developer Edition and a sandbox trips up a lot of candidates, as does understanding that login hours are configured at the profile level rather than on individual user records.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 1 of the Salesforce Administrator course — Salesforce Org Setup. This lecture covers the foundational concepts you need before we dive into any configuration: what an org actually is, the different types of orgs you'll encounter, and how to find your way around Setup.

Let's start with the basics. A Salesforce org — short for organization — is your company's dedicated, isolated instance of Salesforce. Think of it as a private container that holds all your data, all your configuration settings, and all your users. Even though Salesforce is multi-tenant, meaning many companies share the same underlying infrastructure, your org is logically separated. No one else can see your data, and changes you make only affect your org.

Every company that uses Salesforce has at least one org: their Production org. This is the live environment where real users do real work with real data. But most companies also have additional orgs called sandboxes. A sandbox is a copy of your Production org — it pulls metadata and optionally data from Production — and it's the safe place where you test changes before deploying them to your live environment. Never make significant configuration changes directly in Production without testing first.

Now here's an important distinction the exam loves to test: a Developer Edition org is NOT a sandbox. Developer Edition is a free, standalone org that Salesforce provides for learning, certification prep, and development. It is not connected to any Production org, and it has nothing to do with your company's actual Salesforce environment. Scratch orgs are yet another type — they are temporary, expire in one to thirty days, and are designed for modern DevOps workflows using Salesforce DX.

Next, let's talk about navigating Setup. You access Setup by clicking the gear icon in the top-right corner of any Salesforce page. The most powerful tool inside Setup is the Quick Find box — just start typing what you're looking for and the menu will filter instantly. Setup is organized into three panels: Administration for users, data, and email; Platform Tools for objects, automations, and integrations; and Settings for security and company-level configuration.

One page you'll visit constantly is Setup > Company Information. This page shows your org's name, edition, Org ID, storage usage, and license counts. If a colleague asks "how many licenses do we have left?" — Company Information is your answer.

Don't overlook Fiscal Year and Login Hours. Fiscal Year controls how Salesforce calculates periods for forecasting and reports. If you enable the Custom Fiscal Year option, be aware it cannot be reversed. Login Hours, which restrict the time windows when users can access the system, are configured at the profile level — not on individual user records. That's a detail the exam tests frequently.

Alright — you now have a solid foundation in org setup concepts. In the next lecture, we go deeper into Company Information settings and explore how Salesforce editions differ from one another.

## 🔔 EXAM TIPS
- **Developer Edition vs. Sandbox:** Developer Edition is a free standalone org for learning. A sandbox is a copy of Production. They are not the same — the exam will try to conflate them.
- **Custom Fiscal Year is irreversible:** Once you switch to a custom fiscal year, you cannot go back. This is a favorite exam fact.
- **Login Hours are per Profile:** They are not set on individual user records. If you need different login windows for different teams, you need different profiles.

## ✅ LECTURE SUMMARY
- A Salesforce org is an isolated instance of Salesforce containing all data, configuration, and users
- Org types include Production, Sandbox (Developer, Developer Pro, Partial Copy, Full), Developer Edition, and Scratch Org
- Setup is accessed via the gear icon; use Quick Find for fast navigation across the three sections
- Company Information (Setup > Company Information) shows your edition, Org ID, storage, and license counts
- Custom Fiscal Year is irreversible; Login Hours are configured at the profile level

## ❓ MINI QUIZ

**Q1:** A Salesforce admin wants to test configuration changes in a safe environment before moving them to Production. Which org type should they use?
- A) Developer Edition
- B) Scratch Org
- C) Sandbox
- D) Trial Org
**Answer:** C — Sandboxes are copies of Production designed for safe testing and development before changes are deployed to the live environment.

**Q2:** An administrator needs to restrict users from logging in on weekends. Where should this setting be configured?
- A) Setup > Company Information
- B) The individual user record
- C) Setup > Session Settings
- D) The user's Profile (Login Hours)
**Answer:** D — Login Hours are configured on the Profile. All users assigned to that profile inherit the same login hour restrictions.

**Q3:** Which statement about Custom Fiscal Year is TRUE?
- A) It can be reverted to Standard Fiscal Year at any time
- B) It only affects opportunity close dates
- C) Once enabled, it cannot be reverted to Standard Fiscal Year
- D) It requires a separate Salesforce license
**Answer:** C — Enabling Custom Fiscal Year is irreversible. This is a critical setting that should be planned carefully before activation.
