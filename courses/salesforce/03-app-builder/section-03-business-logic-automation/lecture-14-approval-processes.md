# L14: Approval Processes

## 🎯 Learning Objectives
- Identify all components of an Approval Process and the sequence in which actions fire (submission, approval, rejection, recall, final)
- Configure approver types including specific users, user fields, role hierarchy, queues, and delegated approvers
- Explain multi-step approval behavior (sequential vs parallel), email approval, Chatter integration, and record locking

## 📊 SLIDES

### Slide 1: What Is an Approval Process?
**Visual:** Linear pipeline diagram: [Record] → [Submit for Approval] → [Step 1 Approver] → [Step 2 Approver] → [Final Approved/Rejected] with action icons beneath each stage
**Content:**
- An Approval Process is a formal workflow that routes a record through one or more human approvers before it reaches a final state
- Use when a business decision requires explicit sign-off from a person — not just automated logic
- Each step can fire actions: field updates, email alerts, tasks, or outbound messages
- Tracks every decision in the **Approval History** related list on the record
- Common examples: discount approvals, expense reports, contract sign-offs, job requisitions

**Speaker Notes:** Approval Processes are the right tool whenever you need a human in the loop — specifically when "did a manager actually approve this?" must be answerable with a traceable audit trail. Unlike flows that run automatically, approval processes pause and wait for a person to click Approve or Reject. The Approval History related list captures every submission, approval, and rejection with timestamps and user names, providing a permanent audit trail that regulators and auditors love.

---

### Slide 2: Approval Process Components — The Building Blocks
**Visual:** Flowchart with labeled boxes in sequence: Entry Criteria → Initial Submission Actions → [Step 1] → [Step 2] → Final Approval Actions / Final Rejection Actions; with side branches for Recall Actions and per-step Approval/Rejection Actions
**Content:**
- **Entry Criteria:** Filter conditions that determine which records are eligible to be submitted (e.g., Amount > $10,000)
- **Initial Submission Actions:** Fire immediately when a user submits the record (field update, email, task, outbound message)
- **Approval Steps:** One or more sequential or parallel steps, each with its own approver and actions
- **Approval Actions (per step):** Fire when that specific step is approved
- **Rejection Actions (per step):** Fire when that specific step is rejected
- **Recall Actions:** Fire when a submitted record is recalled (withdrawn) by the submitter
- **Final Approval Actions:** Fire after ALL steps are approved
- **Final Rejection Actions:** Fire after any step results in a final rejection

**Speaker Notes:** The distinction between per-step actions and final actions is critical. Per-step Approval Actions fire when each individual step is approved — they may fire multiple times on a multi-step process. Final Approval Actions only fire once, after the very last step is approved. Similarly, Rejection Actions at the step level fire whenever that specific step is rejected, while Final Rejection Actions fire only when the record is decisively rejected and won't continue. This layered structure lets you send different emails at different stages — for example, notifying the rep when step 1 approves, then notifying the legal team only when the entire process completes.

---

### Slide 3: Approver Types
**Visual:** Table with two columns — "Approver Type" and "Example / When to Use" — listing all five types with a small icon for each
**Content:**
- **Specific User:** Always routes to one named user (e.g., always goes to the CFO)
- **User Field on Record (Related User):** Routes to the user stored in a User lookup field on the record (e.g., "Account Owner," "Assigned Manager")
- **Role or Territory Hierarchy (Manager):** Routes up the role hierarchy from the submitter or record owner — the user's manager in the role tree
- **Queue:** Routes to a shared queue; any member of the queue can approve
- **Related User Field (via relationship):** Routes to a user field on a related record (e.g., the Account's Owner when approving an Opportunity)

**Speaker Notes:** The "User Field on Record" option is the most flexible because it dynamically routes based on who is stored in a field — so the same approval process works across all records regardless of who owns them. The Role Hierarchy option is the most common for manager-approval scenarios because it automatically routes to whoever is above the submitter in the org chart, without hardcoding names. Queues are powerful for team-based approvals where any member of a group, such as the Legal team, can respond.

---

### Slide 4: Delegated Approvers & Email Approval
**Visual:** Left half shows a user icon with a "delegate" arrow pointing to another user icon, labeled "Delegated Approver." Right half shows an email preview with "Approve" and "Reject" links highlighted, labeled "Email Approval — No Login Required"
**Content:**
- **Delegated Approver:** An approver can designate another user to act on their behalf while they're unavailable (e.g., out of office); configured in the approver's user record
- The delegated approver sees pending approvals in their own approval queue
- **Email Approval:** Approval notification emails include embedded Approve and Reject links
- Approver clicks the link and submits a response — Salesforce processes it without requiring the approver to log into the org
- Email approval requires the approver to have a Salesforce license but they do not need to open a browser
- Both features reduce bottlenecks when approvers are traveling or out of office

**Speaker Notes:** Delegated approvers are configured on the User record under "Delegated Approver" — it is an org-level setting per user, not per approval process. This means if someone delegates their authority, it applies to all approval processes they participate in. Email approval is extremely practical — executives who receive dozens of emails per day appreciate being able to type a one-word response rather than logging into Salesforce. Note that email approval responses are captured in the Approval History just like any other approval action, maintaining the audit trail.

---

### Slide 5: Multi-Step Approvals — Sequential vs Parallel
**Visual:** Two diagrams side by side. Left: "Sequential" shows Step 1 box → Step 2 box → Step 3 box in a straight line. Right: "Parallel" shows Step 1 with three approver icons all connected simultaneously, with a "Unanimous" or "First Response" label
**Content:**
- **Sequential:** Step 1 must be fully approved before Step 2 is notified; reflects a chain-of-command structure (e.g., Manager → Director → VP)
- **Parallel:** All approvers in a step are notified simultaneously; useful when multiple stakeholders must weigh in concurrently (e.g., Legal AND Finance must both approve)
- **Approval step order:** Steps are numbered; the process follows the order unless a step's rejection triggers a final rejection, stopping the chain
- Within a parallel step, you can require either **unanimous** (all must approve) or **first response** (first approver's decision is final)
- An approval process can mix sequential AND parallel steps — e.g., parallel in Step 1, then sequential escalation in Step 2

**Speaker Notes:** The sequential vs parallel distinction is frequently tested. Sequential is the default mental model — approve at one level before escalating to the next. Parallel within a single step is powerful for compliance scenarios where multiple departments must sign off simultaneously rather than waiting in a queue. The unanimous vs first-response setting within a parallel step is a fine detail worth knowing: unanimous requires everyone to approve; first response means whoever acts first determines the outcome for that step, which speeds up processing but reduces collective oversight.

---

### Slide 6: Record Locking & Approval History
**Visual:** Left side shows a record with a "lock" icon overlay and a tooltip "Record locked — cannot be edited during approval." Right side shows an Approval History related list table with columns: Date, Status, Assigned To, Actual Approver, Comments
**Content:**
- **Lock Record on Submission:** An Approval Process setting that prevents the record from being edited while it is pending approval
- Only the current approver and system administrators can edit a locked record
- Protects data integrity — prevents the submitter from changing the record after submission
- **Approval History Related List:** Auto-added related list that shows the full history of every submission, approval, rejection, and recall
- Fields shown: Date/Time, Status (Pending/Approved/Rejected/Recalled), Assigned To (who was notified), Actual Approver (who acted), Comments
- Provides permanent, immutable audit trail even after the process completes

**Speaker Notes:** Record locking is one of the most important features of Approval Processes from a data governance standpoint. When a manager is reviewing a contract for $500,000, the last thing you want is for the rep to quietly modify the discount while it's in review. Enabling "Lock the record for editing" on submission prevents exactly that. The Approval History related list is what makes Approval Processes superior to a simple flow + email for sign-off scenarios — it gives you a traceable, permanent record of exactly who was asked, who responded, when, and what they said in their comments.

---

### Slide 7: Chatter Approval & When Approvals Beat Flows
**Visual:** Screenshot mockup of a Chatter post on a record showing approval request with "Approve" and "Reject" buttons embedded in the post, plus a comparison table: "Use Approval Process When..." vs "Use Flow Instead When..."
**Content:**
- **Chatter Approval:** When Chatter is enabled, approvers receive a Chatter post on the record and can click Approve/Reject directly in the Chatter feed
- No email or external link needed — works entirely within Salesforce
- Chatter comments serve as a natural discussion thread for the approval conversation
- **Use Approval Processes when:**
  - A human must make a formal yes/no decision
  - You need a permanent, auditable decision trail
  - Approvers need delegation capability
  - Record must be locked during review
  - Email or Chatter-based response (no login) is required

**Speaker Notes:** Chatter-based approvals are a quality-of-life feature that reduces context switching for approvers — they're already in Salesforce reading the Chatter feed, and they can approve without navigating to a separate approval queue. The Approval History still records the action exactly the same way regardless of whether the approver clicked the link in an email, responded via Chatter, or used the standard approval interface. For the exam, the key differentiator for Approval Processes versus Flows is the human decision requirement plus the formal audit trail and delegation features.

---

### Slide 8: Approval Process Limits & Exam-Critical Details
**Visual:** Bullet list styled as a "fast facts" reference card with a Salesforce-style icon, highlighting limit numbers and key rules
**Content:**
- **Steps per process:** No published hard limit — but practical best practice is to keep it manageable; complex multi-step needs are common
- **Actions per step:** Up to 40 actions per action type per step
- **Processes per object:** Multiple approval processes can exist on an object; only one can be active at a time per record (a record can only be in one pending approval process)
- **Submitter:** Can be configured to allow only the record owner, any user, or users matching criteria
- **Recall:** Submitter (or admin) can recall (withdraw) a pending approval; Recall Actions fire when this happens
- **Governor Limits:** Approval processes respect DML and other governor limits in the actions they execute
- **No "auto-launch" from Flow directly:** You cannot trigger an approval process submission from inside a Flow natively (requires Apex or a custom button)

**Speaker Notes:** Two gotchas the exam loves: first, a record can only have one active approval process running at a time — you cannot submit it to two different approval processes simultaneously. Second, there is no native way to programmatically submit a record for approval from within a Flow without writing Apex — the submit action requires either a button click, a custom Apex call, or the Approval Process's own process. Also note the Recall Actions category: many admins forget that "recalled" is a valid terminal state that has its own set of actions, distinct from rejection.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 14 — Approval Processes. This is the tool you reach for when automation alone isn't enough — when a human being needs to make a formal decision before a record moves forward.

Let's set the stage. Imagine your sales team can offer discounts up to 10% on their own authority, but anything above that needs manager sign-off. You don't just want to send an email — you want a system that formally routes the record to the manager, locks it so the rep can't change the numbers while it's in review, tracks whether the manager approved or rejected, and fires different follow-up actions depending on the outcome. That's exactly what an Approval Process delivers.

Every Approval Process is built from the same set of building blocks. First, Entry Criteria defines which records are even eligible to be submitted — for example, only opportunities with a discount greater than 10%. Then, Initial Submission Actions fire the moment someone hits the Submit button: maybe you immediately change the Opportunity Stage to "Pending Approval" and send an email to the submitter confirming receipt.

Then come the Approval Steps — the heart of the process. Each step has its own approver configuration and its own per-step Approval and Rejection Actions. Steps can be sequential, where each approver must act before the next is notified, or parallel, where multiple approvers are contacted simultaneously. In parallel steps, you choose whether unanimous agreement is required or whether the first person to respond decides.

For each step, you configure who the approver is. The most common choices are: a specific named user (always goes to the same person), a user field on the record like the Account Owner, the submitter's manager via the role hierarchy, or a queue where any team member can respond.

Two special approver features are worth highlighting. Delegated Approvers let users hand off their approval authority temporarily — perfect for vacations. And Email Approval lets approvers click Approve or Reject directly in their email inbox without ever logging into Salesforce. Both features keep the process moving when key approvers are unavailable.

At the end of the process, Final Approval Actions and Final Rejection Actions fire once — after all steps are complete. These are separate from the per-step actions. There are also Recall Actions that fire when a submitter withdraws a pending submission.

Record locking is a critical feature: enable it on submission to prevent the submitter from editing the record while it's under review. The Approval History related list automatically tracks every decision with timestamps, user names, and comments — this is your audit trail.

For the exam, the key question is: when do you use an Approval Process instead of a Flow? The answer: whenever a human must make a formal decision that needs to be recorded, delegated, and potentially responded to without logging in. If it's purely automated logic with no human decision required, a Flow is the better tool.

---

## 🔔 EXAM TIPS
- **Sequential vs Parallel:** Sequential steps wait for the current approver before notifying the next; parallel steps notify multiple approvers simultaneously (within the same step).
- **Unanimous vs First Response:** Within a parallel step, "unanimous" requires all to approve; "first response" means the first action taken applies to everyone.
- **Initial Submission Actions vs Final Actions:** Initial fires at submission; Final fires only after ALL steps complete (approve) or the process is definitively rejected.
- **Recall Actions:** Often overlooked — these fire when the submitter or admin withdraws the pending request. They are distinct from Rejection Actions.
- **Delegated Approver:** Set on the User record, not per approval process — applies to all approval processes that user participates in.
- **Record Locking:** Only the current approver and System Administrator can edit a locked record during approval.
- **Email Approval:** Approver does NOT need to log in to Salesforce — they click a link in the email. The approver still needs a valid Salesforce license.
- **Cannot submit from Flow natively:** Triggering an approval process submission from a Flow requires Apex — there is no native Flow action for this.
- **One active process per record:** A record cannot be in two pending approval processes simultaneously.
- **Chatter Approval:** Enables Approve/Reject buttons directly in the record's Chatter feed — still logged in Approval History.

## ✅ LECTURE SUMMARY
- Approval Processes route records through formal human approvers with a full audit trail in the Approval History related list
- Components: Entry Criteria, Initial Submission Actions, Approval Steps (with per-step Approval/Rejection Actions), Recall Actions, Final Approval Actions, Final Rejection Actions
- Approver types: Specific User, User Field on Record, Role Hierarchy (Manager), Queue, Related User Field
- Steps can be sequential (one at a time) or parallel (simultaneous); parallel steps support unanimous or first-response voting
- Delegated Approvers allow authority handoff; Email Approval allows response without logging in
- Lock Record on Submission protects data integrity during review; only approvers and admins can edit
- Chatter integration enables approve/reject directly from the record's feed
- Use Approval Processes for: human decisions, formal audit trails, delegation needs, record locking during review

## ❓ MINI QUIZ

**Q1:** A record is submitted for approval and the approval process has "Lock the record for editing" enabled. Which users can edit the record while it is in a Pending Approval state?
- A) Record owner and submitter  B) The current approver and System Administrators  C) All users with Edit permission on the object  D) Only System Administrators

**Answer:** B — When record locking is enabled, only the current approver assigned to that step and System Administrators can edit the record. The submitter, record owner, and other users with edit permission cannot modify it while it is pending.

---

**Q2:** An approval process has two steps. Step 1 must be approved before Step 2 is notified. What type of approval process is this?
- A) Parallel  B) Unanimous  C) Sequential  D) Delegated

**Answer:** C — Sequential approval requires each step to be completed before the next step's approver is notified. This is the standard chain-of-command model.

---

**Q3:** An approver needs to respond to a pending approval while traveling with no laptop access. They only have access to their email on a mobile device. Which Approval Process feature allows them to approve without logging into Salesforce?
- A) Chatter Approval  B) Delegated Approver  C) Email Approval  D) Quick Action Approval

**Answer:** C — Email Approval sends a notification email with embedded Approve and Reject links. The approver can click the link and submit their response directly from their email client without logging into Salesforce.
