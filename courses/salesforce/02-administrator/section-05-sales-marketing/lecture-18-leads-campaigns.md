# L18: Leads & Campaigns

## 🎯 Learning Objectives
- Describe the Lead object fields and the lead conversion process
- Configure lead assignment rules and web-to-lead
- Explain Campaign object features including campaign hierarchy, members, and ROI tracking

## 📊 SLIDES

### Slide 1: What Is a Lead?
**Visual:** Diagram showing a Lead record with arrows pointing to Account, Contact, and Opportunity after conversion
**Content:**
- A Lead represents an unqualified prospect — someone not yet confirmed as a real opportunity
- Standard fields: First Name, Last Name, Company, Status, Lead Source, Email, Phone, Rating
- Lead Status picklist tracks progression: Open, Working, Qualified, Unqualified, Converted
**Speaker Notes:** Leads are the top of the sales funnel. They exist in Salesforce as unverified prospects until a salesperson qualifies them. Once qualified, the lead is converted into three records: an Account, a Contact, and optionally an Opportunity.

### Slide 2: Lead Conversion Process
**Visual:** Step-by-step flowchart: Lead → Convert button → Map fields → Creates Account + Contact + Opportunity
**Content:**
- Clicking "Convert" on a Lead triggers the conversion wizard
- Salesforce maps lead fields to Account, Contact, and Opportunity fields
- Field mapping is configured at: Setup → Lead Settings → Map Lead Fields
- After conversion, the original Lead record is marked "Converted" and becomes read-only
- Custom lead fields must be manually mapped to target object fields
**Speaker Notes:** Lead conversion is a key admin topic. Remember that converted leads are not deleted — they remain in the system with a "Converted" status. Admins control which fields carry over by configuring field mapping in Setup.

### Slide 3: Lead Assignment Rules
**Visual:** Screenshot mockup of Setup → Lead Assignment Rules page with criteria rows
**Content:**
- Lead Assignment Rules automatically route new leads to users or queues
- Only one rule can be active at a time
- Each rule contains multiple rule entries evaluated top-to-bottom
- Criteria can include lead source, state/province, industry, rating, and more
- "Assign using active assignment rule" checkbox must be checked on the lead
**Speaker Notes:** Assignment rules fire when a lead is created manually, via Web-to-Lead, or via import if the checkbox is selected. If no rule entry matches, the lead goes to the default lead owner set in Lead Settings.

### Slide 4: Web-to-Lead
**Visual:** Diagram showing web form → Salesforce Web-to-Lead endpoint → Lead record
**Content:**
- Web-to-Lead captures prospects directly from your website into Salesforce
- Setup path: Setup → Web-to-Lead → Generate HTML
- Limit: 500 leads per day (default); contact Salesforce to raise the limit
- Supports auto-response rules to send confirmation emails to prospects
- Spam protection available via reCAPTCHA integration
**Speaker Notes:** The generated HTML form contains a hidden org ID and posts directly to Salesforce servers. Admins should configure a default lead creator and auto-response rule so prospects receive immediate confirmation after submitting the form.

### Slide 5: Lead Queues
**Visual:** Table comparing User ownership vs Queue ownership of lead records
**Content:**
- Queues are shared holding areas for leads, cases, and custom objects
- Queue members (users, roles, public groups) can claim records from the queue
- Leads in a queue are visible to all queue members
- Queue email notifies the group when a new record enters
- Assignment rules can route leads directly to queues
**Speaker Notes:** Queues are especially useful for round-robin or team-based lead distribution. Any queue member can take ownership of a queued lead, making it a collaborative triage mechanism for sales teams.

### Slide 6: The Campaign Object
**Visual:** Campaign record showing fields: Campaign Name, Type, Status, Start/End Date, Budgeted Cost, Actual Cost, Expected Revenue
**Content:**
- Campaigns track marketing initiatives: email blasts, webinars, trade shows, ads
- Key fields: Type, Status, Start Date, End Date, Budgeted Cost, Actual Cost, Expected Revenue, Leads in Campaign, Contacts in Campaign, Opportunities in Campaign
- Campaign Status picklist: Planned, In Progress, Completed, Aborted
- Campaign Type picklist: Email, Webinar, Conference, Direct Mail, etc.
**Speaker Notes:** The Campaign object is the marketing team's primary tool in Salesforce. Admins control the Status and Type picklist values. Understanding what each field tracks — especially cost vs. revenue — is essential for the Admin exam.

### Slide 7: Campaign Hierarchy & Campaign Members
**Visual:** Tree diagram showing Parent Campaign with three child campaigns beneath it
**Content:**
- Campaign Hierarchy: up to five levels deep using the Parent Campaign field
- Hierarchy roll-up fields aggregate values (leads, contacts, opportunities) to the parent
- Campaign Members: Leads and Contacts added to a campaign
- Member Status field tracks response: Sent, Opened, Responded, Registered, Attended
- Add members via: Related list, Data Import Wizard, or Reports
**Speaker Notes:** Campaign hierarchy lets marketers see aggregate performance across a family of campaigns. For example, a "Q3 2025" parent campaign can have child campaigns for Email, Webinar, and Trade Show, with totals rolling up automatically.

### Slide 8: Campaign ROI & Campaign Influence
**Visual:** ROI formula displayed: ROI% = ((Actual Revenue − Actual Cost) / Actual Cost) × 100
**Content:**
- Campaign ROI is automatically calculated on the Campaign record
- Campaign Influence links Opportunities to Campaigns that influenced them
- Primary Campaign Source field on Opportunity gets credit for closed revenue
- Customizable Campaign Influence (Einstein Attribution) allows multi-touch models
- Reports: "Campaigns with Influenced Opportunities" and "Campaign ROI Analysis"
**Speaker Notes:** The Admin exam tests whether you know that ROI is calculated automatically and that Campaign Influence tracks which campaigns touched an opportunity during the sales cycle. The Primary Campaign Source field is the standard single-touch attribution field on the Opportunity.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 18 — Leads and Campaigns. These two objects are the engine of Salesforce's marketing and top-of-funnel sales process, and they show up consistently on the Salesforce Administrator exam.

Let's start with Leads. A Lead in Salesforce is an unqualified prospect. Think of it as someone who filled out a form on your website, scanned a badge at a trade show, or called in asking about your product — but you haven't yet verified whether they're a real buyer. The Lead object stores basic information: first and last name, company, email, phone, lead source, and status.

The Lead Status field is critical. Out of the box, Salesforce gives you values like Open, Working, Qualified, Unqualified, and Converted. Once a salesperson decides a lead is worth pursuing, they click the Convert button. This triggers the conversion wizard, which creates three new records: an Account for the company, a Contact for the person, and optionally an Opportunity for the potential deal. The original lead record isn't deleted — it stays in the system marked "Converted" and becomes read-only.

Field mapping is something admins control. Go to Setup, search for Lead Settings, then click Map Lead Fields. Here you tell Salesforce which lead fields should populate which Account, Contact, and Opportunity fields upon conversion. Custom fields must be explicitly mapped, or their data is lost during conversion.

Now let's talk about getting leads into Salesforce automatically. Web-to-Lead lets you publish an HTML form on your website. When someone submits it, Salesforce creates a lead record automatically. You set this up at Setup → Web-to-Lead → Generate HTML. There's a default limit of 500 leads per day, and you can configure an auto-response rule to send a confirmation email to the prospect right away.

Lead Assignment Rules determine who gets the lead. You create a rule with multiple entries — each entry has criteria and a target user or queue. Salesforce evaluates them top to bottom, and the first matching entry wins. Only one assignment rule can be active at a time.

Now let's shift to Campaigns. A Campaign represents a marketing activity — an email blast, a webinar, a conference booth, a paid ad. The Campaign object tracks your investment and results side by side. You record the budgeted cost, the actual cost, and the expected revenue. Salesforce automatically calculates ROI for you.

Campaign Members are the Leads and Contacts you target with the campaign. Each member has a Member Status — something like Sent, Opened, Responded, or Attended — that you customize per campaign.

Campaign Hierarchy lets you nest campaigns up to five levels. A parent campaign can roll up member counts, responses, and revenue from all its children, giving marketing managers a single view of a multi-channel initiative.

Finally, Campaign Influence connects campaigns to the Opportunities they helped create. The Primary Campaign Source field on the Opportunity is the standard attribution point, but Salesforce also supports customizable multi-touch influence models through Einstein Attribution.

That covers the essential Lead and Campaign concepts for the Admin exam. Next, we'll move on to Accounts and Contacts.

## 🔔 EXAM TIPS
- **Lead conversion creates three records:** Conversion always creates an Account and Contact; the Opportunity is optional (a checkbox in the conversion wizard).
- **Converted leads are not deleted:** They remain with a "Converted" status and cannot be edited.
- **Only one assignment rule is active:** Both Lead and Case assignment rules follow this pattern — one active rule with multiple entries evaluated top-to-bottom.
- **Web-to-Lead daily limit:** Default is 500 leads/day. Exceeding this causes leads to be queued and processed the next day.
- **Campaign Hierarchy rolls up to 5 levels:** Fields like Total Leads, Total Contacts, and Won Opportunities aggregate upward.
- **Campaign Influence vs Primary Campaign Source:** Primary Campaign Source is single-touch; Campaign Influence tracks all campaigns that touched an opportunity.

## ✅ LECTURE SUMMARY
- Leads are unqualified prospects; conversion creates Account + Contact + optional Opportunity and marks the lead Converted
- Admins configure lead field mapping at Setup → Lead Settings → Map Lead Fields
- Web-to-Lead generates an HTML form with a 500/day default limit
- Lead Assignment Rules route leads to users/queues; only one rule is active at a time, evaluated top-to-bottom
- Campaigns track marketing initiatives with cost, revenue, and auto-calculated ROI
- Campaign Members (Leads and Contacts) have a customizable Member Status
- Campaign Hierarchy supports up to 5 levels with roll-up fields
- Campaign Influence links opportunities to the campaigns that influenced them

## ❓ MINI QUIZ

**Q1:** A sales rep converts a Lead. Which records are automatically created as a result?
- A) Account and Contact only
- B) Account, Contact, and Opportunity (always)
- C) Account, Contact, and optionally an Opportunity
- D) Contact and Opportunity only
**Answer:** C — The conversion wizard creates an Account and Contact by default. Creating an Opportunity is optional — the rep can uncheck that option in the wizard if no opportunity is warranted yet.

**Q2:** An administrator wants all leads with Lead Source = "Web" and State = "California" to be assigned to a specific sales queue. What is the correct tool to configure?
- A) Lead Auto-Response Rules
- B) Lead Assignment Rules
- C) Lead Queues membership settings
- D) Workflow Field Update
**Answer:** B — Lead Assignment Rules let administrators define criteria-based routing of leads to users or queues. Only one rule can be active; it contains entries evaluated in order.

**Q3:** A marketing manager notices that a campaign's ROI field shows no value even though opportunities have been closed. What is the most likely cause?
- A) Campaign Influence has not been enabled in Setup
- B) The Primary Campaign Source field on the Opportunity is blank
- C) The campaign Status is still set to Planned
- D) The campaign has no campaign members
**Answer:** B — Campaign ROI on the Campaign record is calculated from Opportunities where that campaign is set as the Primary Campaign Source. If that field is blank on the opportunities, Salesforce cannot attribute revenue to the campaign.
