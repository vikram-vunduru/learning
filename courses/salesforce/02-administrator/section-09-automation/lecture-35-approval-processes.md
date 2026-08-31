# L35: Approval Processes

## 🎯 Learning Objectives
- Configure a complete approval process including entry criteria, approver selection, and email templates
- Distinguish between initial submission actions, approval actions, rejection actions, and recall actions
- Use the Approval History related list to track approval status
- Set up delegated approvers and explain their role
- Configure multi-step and parallel approval processes
- Determine when to use approval processes versus flows

## 📊 SLIDES

### Slide 1: What Is an Approval Process?
**Visual:** Diagram showing: User submits record → Approval Process routes to Approver → Approver approves/rejects → Record is updated and submitter is notified
**Content:**
- An **approval process** automates the review and approval of records
- Defines: who can submit, entry criteria, who approves, and what happens on approval/rejection
- **Use cases:** Discount approval on Opportunities, expense approvals, contract review, time-off requests
- Approval processes can have **multiple steps** (sequential approval chains)
- Can require **one approver** per step or **multiple approvers** (unanimous or first-response)
- Approvers receive email notifications and can approve/reject via:
  - Email (one-click approve/reject)
  - Salesforce UI (Approval History list or Home page)
  - Salesforce mobile app
**Speaker Notes:** Approval processes are distinct from Flow-based automation. They're specifically designed for human-in-the-loop approval workflows where a person must review and make a decision. Flow automation is for automated actions without human decisions. Whenever the business requirement includes a person reviewing and approving/rejecting something, an approval process is the right tool.

### Slide 2: Approval Process Setup — Entry Criteria & Submitters
**Visual:** Setup wizard screenshot showing Step 1: Process Name and Description, Step 2: Entry Criteria (field conditions), Step 3: Approver Field/User
**Content:**
- **Entry Criteria:** Conditions that a record must meet before it can be submitted for approval
  - Example: Opportunity Discount > 10%
  - If criteria not met, the Submit for Approval button is still visible but the submission fails with an error
  - OR entry criteria can be "No criteria — all records can be submitted"
- **Submitter Designation:** Who can submit a record for approval
  - Record owner, members of a role/role and subordinates, public group, specific users
  - Admin can submit on behalf of any user
- **Prevent submitters from recalling:** Option to lock records after submission
**Speaker Notes:** Entry criteria acts as a gate — the record must qualify before it can enter the approval process. If you only want to require approval for big discounts, the entry criteria ensures small discounts bypass the process entirely. The submitter designation is important: typically the record owner submits, but you can configure any combination. Remember that an admin can always submit any record for approval regardless of submitter settings.

### Slide 3: Approval Steps — Approver Configuration
**Visual:** Multi-step diagram: Step 1: Manager, Step 2: VP Sales (only if approved by manager), Final Approval: automatic final approval actions
**Content:**
- Each approval process has one or more **approval steps**
- Each step defines:
  - **Filter criteria** (this step only applies to records meeting these conditions — optional)
  - **Approver selection:**
    - Automatically assigned approver: manager, record owner's manager, or specific user/queue
    - Let submitter choose approver
    - Related user: a user lookup field on the record
  - **Routing type:** Route to one approver or to a queue
  - **Unanimous vs. First Response:** For multiple approvers in a queue
    - Unanimous: all must approve
    - First response: first person to respond decides
**Speaker Notes:** The approver can be the record owner's manager (pulled from the user's Manager field), a specific user, a queue, or dynamically chosen by the submitter. The "manager" setting is powerful — it automatically routes based on the user hierarchy without needing hardcoded names. For each step, you can also configure whether it requires unanimous approval from all members of a queue, or if just one person approving is enough.

### Slide 4: The Four Action Sets
**Visual:** Four color-coded boxes: Blue = Initial Submission Actions (fires when submitted), Green = Approval Actions (fires when approved), Red = Rejection Actions (fires when rejected), Yellow = Recall Actions (fires when recalled)
**Content:**
- **Initial Submission Actions:** Fire when the record is submitted for approval
  - Common: Lock the record (prevent editing during review), send email to approver
  - Default: record is locked automatically
- **Approval Actions:** Fire when the approver approves the record
  - Common: Update Status field to "Approved," send congratulations email to submitter
  - Field updates take effect immediately
- **Rejection Actions:** Fire when the approver rejects the record
  - Common: Update Status field to "Rejected," send rejection notification email
  - Can return record to submitter or go to previous step (in multi-step processes)
- **Recall Actions:** Fire when the submitter (or admin) recalls the record from the approval queue
  - Common: Unlock the record, restore previous values
**Speaker Notes:** The four action sets give you full control over the record's state at each stage of the approval lifecycle. Actions can include field updates, email alerts, task creation, and outbound messages — the same action types as workflow rules. A common pattern: on initial submission, lock the record and send an email to the approver. On approval, update the Discount field to approved value and unlock the record. On rejection, notify the submitter and unlock the record so they can modify and resubmit.

### Slide 5: Approval History Related List
**Visual:** Record detail page with "Approval History" related list showing: Submitted by (user), Date, Status, Approver, Comments column — with Approve and Reject buttons visible for pending items
**Content:**
- The **Approval History related list** appears on every record that has been submitted for approval
- Shows:
  - Who submitted the record and when
  - Current approval status (Pending / Approved / Rejected / Recalled)
  - Each step's status, assigned approver, actual approver, comments
  - Actions: Approve, Reject, Recall (for pending items)
- **Approver Comments:** Approvers can add comments when approving or rejecting — visible in the related list
- **Admin override:** System administrators can always approve or reject from the Approval History list
- Must add the Approval History related list to the page layout for users to see it
**Speaker Notes:** The Approval History related list is the primary way users and managers track approval status. It provides a complete audit trail. Approvers can see their pending requests in two places: the Approval History on the specific record, and the "Items to Approve" section on the Salesforce Home page. Make sure your page layouts include the Approval History related list for objects that use approval processes.

### Slide 6: Delegated Approvers
**Visual:** Hierarchy diagram: Primary Approver (Sarah, VP Sales) is away on vacation → Delegated Approver (Tom, VP Operations) receives and acts on approvals
**Content:**
- **Delegated Approver:** A backup approver who can approve on behalf of the primary approver
- Each user can set their own delegated approver in their personal settings (My Settings)
- When configured, approvals assigned to the primary approver are also sent to the delegated approver
- Either the primary approver OR the delegated approver can take action
- **Common use case:** Vacation coverage — user sets their manager's assistant or peer as delegated approver
- Approval process can be configured to allow/disallow delegated approvers per process
- Delegated approver receives the same email notifications as the primary approver
**Speaker Notes:** Delegated approvers solve the vacation coverage problem. Without delegation, approvals pile up when an approver is out of office. With delegation, the backup approver receives the same notifications and can act. Important: delegated approvers are set by the USER in their personal settings, not by the admin (though admins can set them too via the user record). The approval process configuration controls whether delegation is allowed for that specific process.

### Slide 7: Multi-Step and Parallel Approvals
**Visual:** Two diagrams side by side: (1) Sequential: Step 1 (Manager) → if approved → Step 2 (VP) → if approved → Final Approval. (2) Parallel: Record goes simultaneously to Approver A and Approver B, both must respond
**Content:**
- **Multi-Step Sequential Approval:**
  - Record moves through steps in order: Step 1 must be approved before Step 2 activates
  - Each step can have its own approver and criteria
  - Rejection at any step can end the process or go back to a previous step
  - Example: Manager approves discounts 10-20%; VP approves discounts over 20%
- **Parallel Approval (within one step):**
  - Assign to a queue where all members must approve (unanimous) or just one member (first response)
  - All approvers receive the request simultaneously
- **Jump to step:** On rejection, configure whether to return to submitter or go back to a specific previous step
**Speaker Notes:** Multi-step approvals model real-world escalation hierarchies. The ability to set different criteria per step is powerful: Step 1 might only apply to discounts between 10-20% (and auto-approve higher steps), while Step 2 applies to discounts over 20%. Parallel approvals within a single step are great for legal + finance scenarios where both departments need to sign off simultaneously.

### Slide 8: Approvals vs. Flows — When to Use Which
**Visual:** Decision tree: "Does a human need to make a decision?" Yes → Approval Process. No → Flow. "Multi-step human chain?" Yes → Multi-step Approval. "Automated conditional logic?" → Record-Triggered Flow.
**Content:**
- **Use Approval Process when:**
  - A human must review and make an approve/reject decision
  - There's a clear chain of approvers with possible escalation
  - You need full audit trail of who approved/rejected and when
  - Email-based approval (approve by clicking a link in email) is required
- **Use Flow when:**
  - Automation should happen without human review
  - Conditions are evaluated automatically and actions taken immediately
  - Complex data processing or integration is needed
- **Use Both together:**
  - A Flow can automatically SUBMIT a record for approval when conditions are met
  - An Approval Process handles the human review; a Flow handles post-approval automation
**Speaker Notes:** The key differentiator is human decision-making. If a person needs to review the record and explicitly approve or reject it, that's an approval process. If automation should evaluate conditions and take actions automatically without human intervention, that's a flow. Often, the two are used together: a Flow detects when a record needs approval (discount over threshold), submits it automatically, and then the Approval Process handles the human review. After approval, another Flow can handle post-approval steps like updating downstream systems.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 35 — Approval Processes. Approvals are one of the most business-critical automation features in Salesforce, and they appear frequently on the Admin exam. Let's master them.

An approval process is Salesforce's tool for human-in-the-loop review workflows. When records need to be reviewed by a person before they're finalized — a discount that needs manager sign-off, an expense report needing finance approval, a contract needing legal review — that's an approval process.

Setting up an approval process involves five key configurations. First, entry criteria: what conditions must the record meet to be eligible for submission? Second, submitters: who can submit the record for approval — typically the record owner. Third, approval steps: the chain of approvers, which can be sequential, each requiring approval before the next activates. Fourth, the four action sets — more on those in a moment. Fifth, email templates for notifications.

The four action sets are critical. Initial Submission Actions fire when the record is submitted — typically you lock the record to prevent editing and send an email to the approver. Approval Actions fire when an approver approves — typically update a status field to "Approved" and notify the submitter. Rejection Actions fire when rejected — update status to "Rejected" and notify the submitter with the reason. Recall Actions fire when the submitter recalls the approval from the queue — typically unlock the record.

Each approval step defines who the approver is. You can route to the record owner's manager (pulled dynamically from the user hierarchy), a specific user, a queue, or let the submitter choose. For queue routing, you decide: unanimous (all members must approve) or first response (first person to act decides).

The Approval History related list on each record shows the complete audit trail: who submitted, when, who approved or rejected, and any comments. Always add this related list to your page layouts for objects using approval processes.

Users can set a delegated approver in their personal settings to handle approvals when they're unavailable. This prevents approvals from stacking up during vacations.

Remember: use approvals when a human decision is required. Use Flow when automation should happen without human intervention. Often, a Flow submits the record, an Approval Process handles the human review, and another Flow handles post-approval processing.

## 🔔 EXAM TIPS
- **Four Action Sets:** Initial Submission (fires on submit), Approval (fires on approve), Rejection (fires on reject), Recall (fires on recall). Know which fires when.
- **Record Lock:** By default, records are locked from editing when submitted for approval. This is an initial submission action.
- **Approver Options:** Manager of submitter, specific user, queue, or let submitter choose. "Manager" uses the user's Manager field.
- **Delegated Approver:** Set by the user in personal settings as backup for when they're unavailable.
- **Approval History:** Related list showing full audit trail — must add to page layout. Admin can always approve/reject from this list.
- **Multi-step:** Steps are sequential by default. Rejection can return to submitter or previous step.
- **Approval vs. Flow:** Approval = human decision required. Flow = automated decision without human review.

## ✅ LECTURE SUMMARY
- Approval processes route records to human approvers for review before final decisions
- Entry criteria gates which records can be submitted; submitter settings control who can submit
- Approval steps define the approver chain (manager, specific user, queue, or submitter's choice)
- Four action sets: Initial Submission, Approval, Rejection, Recall — each fires at specific stage
- Approval History related list provides full audit trail; must be added to page layout
- Delegated approvers are backup approvers set by users in their personal settings
- Multi-step approvals support sequential chains; parallel approvals support simultaneous review
- Use approvals for human decisions; use Flow for automated logic without human review

## ❓ MINI QUIZ

**Q1:** A record is submitted for approval. Which action set fires IMMEDIATELY when the submission is made?
- A) Approval Actions
- B) Rejection Actions
- C) Initial Submission Actions
- D) Recall Actions

**Answer:** C — Initial Submission Actions fire immediately when the record is submitted for approval, before any approver has taken action. These typically include locking the record from editing and sending an email notification to the designated approver.

**Q2:** An approval process has two sequential steps: Step 1 routes to the submitter's direct manager, and Step 2 routes to the VP of Sales. The record is approved in Step 1 but rejected in Step 2. What options can be configured for the rejection behavior?
- A) The record can only be returned to the original submitter
- B) The record is automatically approved if any step is approved
- C) The record can be returned to the submitter or sent back to a previous approval step
- D) The record is permanently locked after rejection

**Answer:** C — When a record is rejected at any step, the approval process can be configured to return the record to the submitter for correction and resubmission, OR to return it to a specific previous step (like Step 1 for re-approval). The record is unlocked by the Rejection Actions, allowing the submitter to make changes.

**Q3:** A Salesforce Administrator wants to show users the complete history of all approval requests, approvals, and rejections for an Opportunity record. What must the admin do?
- A) Run a report filtered on Approval History object
- B) Enable "Approval Audit" in Setup
- C) Add the Approval History related list to the Opportunity page layout
- D) Purchase a separate Salesforce Shield license

**Answer:** C — The Approval History related list must be added to the object's page layout for users to see the complete approval audit trail directly on the record page. This related list shows all submission, approval, rejection, and recall events with dates, approvers, and comments.
