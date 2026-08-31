# L23: Queues & Assignment Rules

## 🎯 Learning Objectives
- Create and configure Queues including membership and queue email settings
- Build Case Assignment Rules that route cases to users or queues based on criteria
- Explain Lead Assignment Rules and how they differ from Case Assignment Rules

## 📊 SLIDES

### Slide 1: What Are Queues?
**Visual:** Diagram showing multiple cases/leads entering a queue and multiple agents pulling records from the queue
**Content:**
- A Queue is a shared workspace where records wait to be claimed by a team member
- Records in a queue are visible to all queue members — no single owner
- Supported objects: Cases, Leads, Orders, Service Contracts, and Custom Objects (with Master-Detail to User)
- Queues are not available natively for Opportunities or Contacts
- Queue names appear as record owners (e.g., "Owner = Tier 1 Support Queue")
**Speaker Notes:** Queues solve the problem of shared work. Instead of assigning a case to a specific person when it's unclear who's available, you route it to a team queue. Any team member can then "Accept" the case — taking ownership — when they're ready for it. Queues create a pull-based work model.

### Slide 2: Creating & Configuring Queues
**Visual:** Setup → Queues → New Queue form showing Queue Name, Queue Email, Supported Objects, and Members sections
**Content:**
- Setup path: Setup → Queues → New
- Queue Label and Name (API name) are required
- **Queue Email:** An email address that receives notification when a record enters the queue
- **Supported Objects:** Select which objects this queue applies to (e.g., Case, Lead)
- **Queue Members:** Add Users, Roles, Public Groups, or Role and Subordinates
- A queue must have at least one member; members can belong to multiple queues
**Speaker Notes:** The Queue Email is key for team notification. When a new case arrives in the queue, Salesforce emails the queue address. Teams typically set this to a shared distribution list so the whole team is notified. Individual queue members can also opt in to personal notifications via their notification settings.

### Slide 3: Queue Membership
**Visual:** Table showing different membership types: User, Role, Public Group, Role + Subordinates with icons
**Content:**
- **Users:** Specific individuals added directly to the queue
- **Roles:** All users currently assigned to that role
- **Public Groups:** Any users in the public group (including nested groups)
- **Role and Subordinates:** The role plus all roles below it in the hierarchy
- Any queue member can view queued records and take ownership
- Queue members do NOT automatically gain edit access to each other's owned records
**Speaker Notes:** Using Roles or Public Groups instead of individual users makes queue maintenance much easier. When someone joins or leaves a team, you update their Role or Group membership — not every queue they belong to. This is a best practice that admins should follow.

### Slide 4: Accepting Records from a Queue
**Visual:** List view showing queued cases with "Accept" button column; arrow showing record owner changing to the logged-in user
**Content:**
- To accept a record: open the record (or list view) → click "Accept" button
- Accepting changes ownership from the Queue to the individual user
- Alternatively, any queue member can manually change the owner to themselves or another user
- List views can be filtered by queue ownership to show all unassigned records
- "My Cases" and "Cases In My Queues" are standard list views for agents
**Speaker Notes:** The Accept workflow is the standard mechanism for pulling work from a queue. Agents typically check the "Cases In My Queues" list view to see what's waiting. Once accepted, the case moves to "My Cases." This self-service claiming model reduces management overhead but requires agents to actively monitor queues.

### Slide 5: Case Assignment Rules
**Visual:** Assignment rule entries in order with criteria (Case Origin = Email, Priority = High) and assigned queue/user targets
**Content:**
- Case Assignment Rules automatically route new or updated cases to users or queues
- Only ONE rule can be active at a time
- Each rule has multiple rule entries with criteria and an assignment target (user or queue)
- Entries are evaluated top-to-bottom; the FIRST matching entry wins
- The "Assign using active assignment rules" checkbox must be selected on the case
- Cases from Email-to-Case and Web-to-Case can auto-invoke the active rule
**Speaker Notes:** The top-to-bottom evaluation with first-match-wins is critical for the exam. Design your rule entries from most specific to least specific — put narrow criteria at the top and broad catch-all entries at the bottom. If no entry matches, the case goes to the default case owner set in Support Settings.

### Slide 6: Case Assignment Rule Entries
**Visual:** Rule Entry configuration showing: Order number, Criteria fields (Case Origin, Priority, Product), Assign To (User/Queue), Do not reassign owner checkbox
**Content:**
- Each rule entry has: entry number (order), criteria (field/operator/value), and assignment target
- Criteria can use AND/OR logic and can include formula-based conditions
- Assignment targets: specific User, specific Queue
- Email template on entry: sends notification to the assigned user/queue when rule fires
- "Do not reassign owner" option prevents the rule from reassigning already-owned cases
- Multiple criteria rows within one entry all use AND logic by default
**Speaker Notes:** Rule entries are powerful but can become complex. Keep them simple and well-documented. The email template option lets you notify the assigned agent automatically when a case lands on their desk. The "Do not reassign owner" checkbox is useful when you want the rule to apply to new cases but not override manual reassignments.

### Slide 7: Lead Assignment Rules
**Visual:** Side-by-side comparison of Case Assignment Rules and Lead Assignment Rules showing similarities and one key difference
**Content:**
- Lead Assignment Rules work identically to Case Assignment Rules
- One active rule at a time, multiple entries, top-to-bottom evaluation
- Used for inbound leads from Web-to-Lead, manual entry, or import
- "Assign using active assignment rule" checkbox must be checked on the lead
- Lead default owner configured in: Setup → Lead Settings
- Both Lead and Case assignment rules share the same structural model
**Speaker Notes:** The exam may try to trick you into thinking Lead and Case Assignment Rules are different. They aren't — same structure, same evaluation logic, same one-active-rule limitation. The only difference is the object they apply to. Remember: for Web-to-Lead, the active rule automatically fires without needing to check a checkbox.

### Slide 8: Assignment Rule Best Practices
**Visual:** Ordered list of best practices with icons: specificity order, documentation, default owner, testing
**Content:**
- Order entries from most specific → least specific (narrow criteria first)
- Always create a catch-all entry at the bottom (e.g., Route All Others → Default Queue)
- Set a meaningful default case/lead owner in Support Settings / Lead Settings as a final fallback
- Use Public Groups or Queues as targets (not individual users) for maintainability
- Test rules by creating test cases/leads and verifying routing outcomes
- Document rule entry intent in descriptions/comments for future admins
**Speaker Notes:** A common mistake is forgetting a catch-all entry. Without it, cases or leads that don't match any entry go to the default owner defined in the object's settings — which is often the admin account. Always add a "Route All Others" entry at the bottom of every assignment rule.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 23 — Queues and Assignment Rules. These two features work hand-in-hand to automate how work gets distributed to your support and sales teams. Let's get into it.

A Queue is essentially a shared inbox for Salesforce records. Instead of assigning a new case to a specific agent right away, you can route it to a queue where the whole team can see it. Any team member can then "Accept" the case, which transfers ownership to them personally. Queues work for Cases, Leads, and some other objects — but not for Opportunities or Contacts out of the box.

Creating a queue is done in Setup under Queues. You give it a name, optionally a Queue Email address, and then select which objects it supports and who its members are. The Queue Email is important — it's the address that gets notified when new records arrive in the queue. You'd typically set this to a distribution list or team email. For members, you can add individual users, roles, public groups, or a role with all subordinates. Using roles and groups instead of individual users makes maintenance much easier.

Once cases or leads are in a queue, agents go to list views filtered by queue ownership to see what's waiting. The "Cases In My Queues" list view is the standard one. Clicking Accept on a record changes ownership from the queue to the agent.

Now let's talk about Assignment Rules. Assignment Rules automate the routing process so that instead of every case going to a generic queue, Salesforce intelligently directs it to the right queue or person based on the case's content.

Here's the structure: there's one active assignment rule at a time. Inside that rule are multiple entries. Each entry has criteria — like "Case Origin equals Email AND Priority equals High" — and a target, which is a user or queue. When a case is created, Salesforce evaluates the entries in order, top to bottom. The first entry whose criteria match the case wins. That case gets routed to the target specified by that entry.

The evaluation is top-to-bottom, first-match-wins. This means you should order your entries from most specific to least specific. Put your narrow, targeted criteria at the top and a broad catch-all entry at the very bottom so no case falls through the cracks.

For cases coming in via Web-to-Case or Email-to-Case, the assignment rule fires automatically. For manually created cases, the agent must check the "Assign using active assignment rule" checkbox. Same rule applies to leads — although for Web-to-Lead, the rule fires automatically without needing that checkbox.

Lead Assignment Rules are structurally identical to Case Assignment Rules. One active rule, multiple entries, evaluated top to bottom. The same best practices apply. The only difference is the object they govern.

Best practice advice: always add a catch-all entry at the bottom. Use queues or public groups as targets rather than individual users — when staff turns over, you update group membership rather than hunting through every rule. And always test your rules by creating test records and verifying where they land.

That covers Queues and Assignment Rules. Next up, we move into the more advanced service features — Entitlements and Milestones.

## 🔔 EXAM TIPS
- **Only one active assignment rule per object:** Lead AND Case assignment rules each follow this one-active-rule constraint.
- **Top-to-bottom, first-match-wins:** Evaluation stops at the first matching rule entry.
- **Catch-all entry is best practice:** Without it, unmatched records go to the default owner in Settings.
- **Queues work for Cases, Leads, Orders — not Opportunities:** A common distractor.
- **Queue Email ≠ Email-to-Case:** Queue Email notifies team members; it does not create cases from emails.
- **Web-to-Lead auto-invokes assignment rule:** The checkbox is not required for web-generated leads.

## ✅ LECTURE SUMMARY
- Queues are shared workspaces; records are visible to all members and can be accepted by any member
- Queue members can be Users, Roles, Public Groups, or Role and Subordinates
- Queue Email sends notifications to the team when new records arrive
- Case and Lead Assignment Rules each have one active rule with multiple entries evaluated top-to-bottom
- First matching entry wins; unmatched records go to the default owner
- Use queues/groups as assignment targets for maintainability; always add a catch-all entry
- "Assign using active assignment rule" checkbox required for manual case/lead creation; Web-to-Lead fires automatically

## ❓ MINI QUIZ

**Q1:** A support team has three tiers of support, each with its own queue. A new Case Assignment Rule has four entries. A newly created case matches entries 2 and 4. Where will the case be routed?
- A) Entry 4, because it is the most specific
- B) Entry 2, because it is evaluated first and assignment rules use top-to-bottom, first-match-wins logic
- C) Entry 2 and Entry 4, because the case matches both
- D) The administrator must set a priority order for matching entries
**Answer:** B — Case Assignment Rules evaluate entries in order, and the FIRST matching entry determines routing. Because the case matches Entry 2 before Entry 4 is evaluated, it is routed to Entry 2's target and evaluation stops.

**Q2:** An administrator creates a new queue for the "Tier 2 Support" team and adds five users as members. A few weeks later, one member leaves and a new agent joins. What is the most efficient way to manage queue membership going forward?
- A) Delete the queue and recreate it with the updated user list
- B) Edit the queue and manually update the user list each time someone joins or leaves
- C) Create the queue with a Role or Public Group as the member instead of individual users, then update the Role/Group membership as staff changes
- D) Queues do not support role-based membership
**Answer:** C — Using a Role or Public Group as the queue member makes maintenance much easier. When staff changes, you update the role assignment or group membership — the queue automatically reflects the new team without any queue edits.

**Q3:** A lead administrator wants all leads with Annual Revenue greater than $1,000,000 routed to the Enterprise Sales Queue, and all other leads routed to the SMB Sales Queue. The current active rule has only one entry for Enterprise leads. What must the administrator add to ensure SMB leads are routed correctly?
- A) A second active assignment rule for SMB leads
- B) A catch-all rule entry (e.g., "Annual Revenue Less Than 1,000,000") targeting the SMB Sales Queue, placed after the Enterprise entry
- C) A validation rule that enforces routing based on revenue
- D) A workflow rule that updates the Owner field for SMB leads
**Answer:** B — Only one assignment rule can be active at a time. The administrator adds a second rule entry below the Enterprise entry as a catch-all (or with SMB criteria), targeting the SMB Sales Queue. Because evaluation is top-to-bottom, any lead not matching the Enterprise entry will fall through to the SMB entry.
