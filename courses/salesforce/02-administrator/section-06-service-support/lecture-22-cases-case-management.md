# L22: Cases & Case Management

## 🎯 Learning Objectives
- Describe the Case object fields, status lifecycle, and case origin channels
- Configure Web-to-Case and Email-to-Case (on-demand vs. standard)
- Set up Case Auto-Response Rules and Case Escalation Rules

## 📊 SLIDES

### Slide 1: The Case Object
**Visual:** Case record showing fields: Case Number (auto), Subject, Status, Priority, Case Origin, Account Name, Contact Name, Description, Assigned To
**Content:**
- Case represents a customer issue, complaint, question, or service request
- Case Number is auto-generated and cannot be changed
- Key fields: Subject, Status, Priority, Case Origin, Account Name, Contact Name, Description, Type
- Status lifecycle: New → Working → Escalated → Closed (customizable)
- Priority: Low, Medium, High, Critical
- Case Origin: Web, Phone, Email, Chat, Social (tracks channel the case came from)
**Speaker Notes:** The Case object is the foundation of Salesforce Service Cloud. Admins configure the Status and Priority picklists to match their organization's support process. Case Number is a system-generated auto-number field — it's unique, sequential, and cannot be edited.

### Slide 2: Case Origin Channels
**Visual:** Icons for Web, Email, Phone, Chat, and Social media with arrows pointing into a single Case record
**Content:**
- **Web:** Customer submits via Web-to-Case form on your website
- **Email:** Customer sends an email to a support address (Email-to-Case)
- **Phone:** Agent manually creates the case while on a call
- **Chat:** Case created via Live Agent / Messaging channel
- **Social:** Case created from social media monitoring (Social Studio integration)
- Case Origin is a picklist — admins can add custom values for their channels
**Speaker Notes:** Case Origin is purely informational — it tells your support team HOW the customer reached out. This field can be used in reports to analyze channel volume and in assignment rules to route cases based on how they arrived.

### Slide 3: Web-to-Case
**Visual:** Diagram: Customer fills web form → Salesforce endpoint → Case record created with Status = New
**Content:**
- Web-to-Case generates an HTML form that creates cases directly from website submissions
- Setup path: Setup → Web-to-Case
- Limit: 5,000 cases per day (default)
- Configure a default case origin, case owner, and auto-response rule
- Cases created via Web-to-Case have Case Origin = "Web"
- reCAPTCHA integration available to reduce spam submissions
**Speaker Notes:** Web-to-Case is similar to Web-to-Lead but for the support side. The 5,000 per day limit is significantly higher than Web-to-Lead's 500. Remember to configure an auto-response rule so customers get an immediate acknowledgment that their case was received.

### Slide 4: Email-to-Case
**Visual:** Split diagram showing On-Demand Email-to-Case (Salesforce servers) vs Standard Email-to-Case (behind firewall)
**Content:**
- **On-Demand Email-to-Case:** Salesforce hosts the email service; no software installation needed; email sent to a Salesforce-hosted address
- **Standard Email-to-Case:** Agent installed behind your firewall; email stays on-premise before syncing to Salesforce; more secure for sensitive data
- Setup path: Setup → Email-to-Case → Enable Email-to-Case
- Each routing address maps to a case queue and sets default priority/origin/status
- Email threads are linked to the Case via the Email Message object
- File attachments in emails become Case attachments
**Speaker Notes:** The key distinction between On-Demand and Standard Email-to-Case is where the email processing happens. On-Demand is simpler to set up and sufficient for most orgs. Standard requires an agent installation but keeps email data within your firewall — used when compliance or security requires it.

### Slide 5: Case Teams
**Visual:** Case record showing Case Team related list with Member Name, Role, and Case Access columns
**Content:**
- Case Teams allow multiple agents to collaborate on a single case
- Each member has a Role (e.g., Case Manager, Technical Specialist, Tier 2 Support)
- Members can be granted Case Access: Read Only or Read/Write
- Predefined Case Teams can be created and applied with one click
- Case Teams are similar in concept to Opportunity Teams
- Admins configure Case Team Roles at: Setup → Case Team Roles
**Speaker Notes:** Case Teams are useful for complex support issues requiring multiple people. A major incident might need a front-line agent, a technical engineer, and a customer success manager all working together on the same Case record. Each person gets appropriate access through their team role.

### Slide 6: Case Auto-Response Rules
**Visual:** Flowchart showing inbound case → Auto-Response Rule evaluates criteria → Matching email template sent to contact
**Content:**
- Auto-Response Rules automatically send email replies when a Case is created
- Useful for Web-to-Case and Email-to-Case to acknowledge receipt
- Setup path: Setup → Auto-Response Rules → Case Auto-Response Rules
- Structure: One active rule → multiple rule entries → criteria → email template
- If no rule entry matches, no auto-response is sent (no default fallback)
- Works with HTML email templates and merge fields
**Speaker Notes:** Auto-Response Rules are a courtesy mechanism — they let customers know their case was received and assigned. The rule structure mirrors Assignment Rules: one active rule with multiple entries evaluated top-to-bottom. Entries use criteria to match cases and specify which email template to send.

### Slide 7: Case Escalation Rules
**Visual:** Timeline showing Case created at T=0; 4 hours elapse; escalation fires; case reassigned and email sent
**Content:**
- Escalation Rules automatically escalate cases that have not been resolved within a time threshold
- Setup path: Setup → Escalation Rules
- Rule entries define: criteria for which cases are covered, time trigger, and escalation action
- Escalation actions: reassign to a user/queue, send email notification
- **Age Over:** How many hours since the case was created or since it was last modified
- Escalation clocks can pause when case status is in certain statuses (e.g., "Waiting on Customer")
**Speaker Notes:** Escalation Rules enforce your SLA commitments. The time threshold (Age Over) tells Salesforce when to escalate. Admins can configure the clock to pause when cases are in statuses like "Pending Customer Response," so your SLA timer doesn't count time waiting on the customer.

### Slide 8: Case Related Lists & Activity
**Visual:** Case record showing related lists: Case Comments, Emails, Attachments, Case Team, Case History, Related Cases
**Content:**
- **Case Comments:** Internal notes and customer-facing comments on the case
- **Emails:** Email messages sent/received related to the case (from Email-to-Case or manual emails)
- **Attachments/Files:** Documents related to the case
- **Case History:** Audit trail of field changes
- **Related Cases:** Parent-child relationship for grouping related issues
- **Contact Roles / Case Team:** People involved in the case
**Speaker Notes:** Understanding the Case related lists helps you configure appropriate page layouts. Case Comments can be marked Public (visible to customers via portal) or Internal (agents only). Related Cases are useful for grouping a product defect's individual customer cases under one parent master case.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 22 — Cases and Case Management. Cases are the core of Salesforce Service Cloud, and this topic is well-represented on the Administrator exam. Let's work through it systematically.

A Case represents a customer support interaction — a question, a complaint, a request, or a bug report. Every case has a Subject, a Status, a Priority, and a Case Origin. The Case Number is auto-generated by Salesforce — it's a sequential number you can reference in communications, but it can never be edited.

Case Origin tells you how the customer reached out: Web, Email, Phone, Chat, or Social. This is a picklist you can customize. It's used in reports and can be used in assignment rules to route cases appropriately.

Let's talk about how cases get in. Web-to-Case works just like Web-to-Lead — you generate an HTML form in Setup, publish it on your website, and when a customer submits it, Salesforce creates a case automatically. The limit is 5,000 cases per day, much higher than Web-to-Lead.

Email-to-Case is the mechanism for turning support emails into cases. There are two variants. On-Demand Email-to-Case routes email through Salesforce's servers — easiest to set up, no software needed. Standard Email-to-Case processes email behind your firewall using an installed agent — required when you have strict data security requirements. Both let you configure routing addresses, where each address maps to a queue, sets default priority, and assigns a case origin.

Once a case exists, who handles it? Case Teams let multiple agents collaborate. Like Opportunity Teams, each team member gets a role and a level of access. You can create predefined Case Teams that agents apply with a single click.

Auto-Response Rules send an acknowledgment email to the customer when a case is created. This is especially important for Web-to-Case and Email-to-Case so customers aren't left wondering if their submission went through. The rule structure is the same as Assignment Rules — one active rule, multiple entries evaluated top-to-bottom, each with criteria and an email template.

Escalation Rules enforce your SLAs. If a case isn't resolved or updated within a specified number of hours, the escalation rule fires. It can reassign the case to a different user or queue and send notification emails. You can configure the escalation clock to pause when cases are in certain statuses — like "Waiting on Customer" — so your SLA timer only counts time when your team is actually responsible for the next action.

On the Case record itself, the related lists you need to know are Case Comments for notes, Emails for email thread history, Attachments for files, and Case History for the audit trail. Case Comments can be marked Public — which means customers can see them through a self-service portal — or Internal, which is agent-only.

Case management in Salesforce is a well-designed system, and understanding these components gives you the foundation to support any service organization. Next, we'll go deeper into Queues and Assignment Rules.

## 🔔 EXAM TIPS
- **Web-to-Case limit is 5,000/day:** Much higher than Web-to-Lead's 500/day limit.
- **On-Demand vs Standard Email-to-Case:** On-Demand uses Salesforce servers; Standard uses an on-premise agent — choose Standard for data security requirements.
- **Auto-Response Rules have no default fallback:** If no rule entry matches the case criteria, no email is sent.
- **Escalation Rule clock can pause:** Configure "Business Hours" and pause statuses so SLA timers don't count customer-wait time.
- **Case Comments can be Public or Internal:** Public comments are visible in customer portals; Internal are agent-only.
- **Activated Cases follow the same sharing model as Accounts:** If you can see the Account, you can typically see related Cases.

## ✅ LECTURE SUMMARY
- Case object tracks customer issues with fields: Case Number (auto), Subject, Status, Priority, Case Origin
- Case Origin values: Web, Email, Phone, Chat, Social — customizable picklist
- Web-to-Case generates an HTML form; limit 5,000 cases/day; configure auto-response rule
- Email-to-Case: On-Demand (Salesforce servers) vs Standard (on-premise agent for compliance)
- Case Teams allow multi-agent collaboration with roles and access levels
- Auto-Response Rules send acknowledgment emails on case creation; no automatic fallback if no rule matches
- Escalation Rules fire time-based escalation actions (reassign, notify) when cases aren't resolved within a threshold; clock can pause on certain statuses

## ❓ MINI QUIZ

**Q1:** A company's compliance team requires that all support emails remain on the company's internal mail servers and never route through Salesforce servers. Which Email-to-Case option should the administrator configure?
- A) On-Demand Email-to-Case
- B) Standard Email-to-Case
- C) Email-to-Case is not possible with this requirement
- D) Web-to-Case as an alternative to Email-to-Case
**Answer:** B — Standard Email-to-Case uses an agent installed behind the company's firewall. Emails are processed on-premise before case data is synced to Salesforce, keeping raw email content on internal servers and satisfying compliance requirements.

**Q2:** A support manager reports that customers are not receiving any acknowledgment when they submit cases via the web form. Web-to-Case is enabled and working. What is the most likely issue?
- A) The Web-to-Case daily limit has been reached
- B) No Case Auto-Response Rule has been configured, or no rule entries match the submitted cases
- C) The Contact on the case does not have a valid email address field
- D) Auto-response emails require a paid add-on license
**Answer:** B — Auto-Response Rules must be configured separately. Enabling Web-to-Case does not automatically send acknowledgment emails. The admin must create an Auto-Response Rule with at least one entry that matches incoming cases and specifies an email template.

**Q3:** An administrator needs to automatically reassign any case that has been open for more than 8 hours without resolution. Which feature should be configured?
- A) Case Assignment Rules with a time-based criteria
- B) Workflow Rule with a time-based workflow action
- C) Case Escalation Rules
- D) Case Auto-Response Rules
**Answer:** C — Case Escalation Rules are specifically designed for time-based case escalation. They monitor case age and fire configured actions (such as reassigning to a queue and sending an email notification) when the age threshold is exceeded.
