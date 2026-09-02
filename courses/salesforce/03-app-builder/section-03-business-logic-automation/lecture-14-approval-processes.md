# L14: Approval Processes

## Exam Domain
Business Logic & Process Automation — 28% of exam weight

---

## Core Concepts

### Approval Process Components
An Approval Process has five key components: (1) **Entry Criteria** — conditions a record must meet to be submitted for approval (if not met, submission fails); (2) **Submission Actions** — what happens when the record is submitted (usually locks the record, updates a status field); (3) **Approval Steps** — sequential or parallel stages, each with an approver and step-specific actions (approve/reject actions); (4) **Recall/Withdrawal Actions** — what happens if the submitter recalls the approval request; (5) **Final Actions** — what happens when the entire process reaches a final outcome (fully approved or rejected).

### Approver Types
Each step can route to: **Assigned Approver** (a specific user or queue), **Related User** (a user field on the record — e.g., the record's "Manager" field), **Apex Approval** (programmatic logic), or the **submitter's manager** (via role hierarchy). For the exam, the most tested options are Assigned Approver and Related User (manager field lookup).

### Sequential vs. Parallel Approvals
**Sequential** steps execute one after another — Step 1 must be approved before Step 2 starts. **Parallel** steps (active simultaneously within one step) allow multiple approvers to all review at the same time. Within a parallel step, you choose: **Unanimous** (all approvers must approve) or **First Response** (first person to approve/reject drives the outcome).

### Record Locking
When a record is submitted for approval, by default it becomes **locked** — users cannot edit it while it's pending approval. Only the assigned approver and System Administrators can unlock it. This prevents the submitter from modifying the record while it's under review. Locking behavior is configured in the Submission Actions.

### Email Approval Actions
Approvers can approve or reject directly from email without logging into Salesforce. The approval email contains Approve/Reject links. This requires the org to have "Email Approval Response" enabled. This is an important usability feature — approvers don't need to log in, reducing friction for occasional approvers.

---

## PTA / SA Relevance

**When Approval Processes vs. Flows:** Approval Processes are the right tool for multi-step human approval workflows with formal approve/reject actions and record locking. For automated conditional logic (no human reviewer), use a Flow. The distinction: if a human must make a yes/no decision, Approval Process. If the system should automatically evaluate and proceed, Flow.

**Approval Process limitations at scale:** Approval Processes don't handle complex routing logic well (e.g., "route to manager A unless deal > $1M, then route to CFO"). For complex routing, the pattern is an Approval Process with Apex-driven step assignment. If a customer needs 10+ steps with dynamic routing, consider whether a CPQ or third-party approval tool (like Conga, Docusign CLM) is a better fit.

**Record locking in practice:** Locking can be a UX frustration. Users often need to correct a typo on a locked record. Build a process for administrators to unlock records (Sys Admin can always edit locked records). Communicate locking behavior to users in training.

**Delegated approvers:** Approval steps can allow the assigned approver to delegate their approval authority to another user. This is critical for out-of-office scenarios — without delegation, approvals stall when an approver is unavailable.

---

## Architecture / How It Works

```
Approval Process Flow:
                                                               
  Record meets Entry Criteria                                  
         │                                                     
         ▼                                                     
  User clicks [Submit for Approval]                           
         │                                                     
         ▼                                                     
  Submission Actions execute                                  
  (e.g., Status = "Pending Approval", record locked)          
         │                                                     
         ▼                                                     
  ┌──────────────────────────────────────────────────┐         
  │  Step 1: Manager Approval                        │         
  │  Approver: {!Manager__c} (Related User field)    │         
  │  ┌─────────────────┐  ┌──────────────────────┐   │         
  │  │ APPROVED ──────►│  │ REJECTED ─────────── │   │         
  │  │ Step Actions     │  │ Step Reject Actions  │   │         
  │  └──────────────┬──┘  └──────────────────────┘   │         
  └─────────────────│────────────────────────────────┘         
                    │                                           
                    ▼                                           
  ┌──────────────────────────────────────────────────┐         
  │  Step 2: Finance Review (Sequential)             │         
  │  Approver: Finance Queue                         │         
  └──────────────────────────────────────────────────┘         
                    │                                           
                    ▼                                           
  Final Approval Actions execute                              
  (e.g., Status = "Approved", record unlocked, email sent)   
```

**Limitations:**
- Approval Processes cannot be triggered automatically — a user or Apex must submit the record
- An object can have multiple Approval Processes but only one can be active per record at a time
- Approval Processes do not support complex branching logic without Apex
- Rejected records are not re-submitted automatically — submitter must fix and re-submit manually

```
Approval Step Configuration:
┌───────────────────────────────────────────────────────────────────┐
│  Per Step Configuration:                                          │
│  • Approver: Assigned User / Related User / Queue / Apex          │
│  • Approval Order: Sequential (one at a time) or Parallel         │
│  • Parallel Vote: Unanimous (all must approve) OR                 │
│                   First Response (first one drives outcome)       │
│  • Step Actions: Approve Actions / Reject Actions                 │
│    (field updates, emails, tasks, chatter posts)                  │
│  • Allow Approver to Delegate: Yes/No                             │
└───────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- An approval step cannot route to a flow or trigger a record-triggered flow directly
- Steps cannot dynamically determine the approver count at runtime (must be pre-configured)
- Recall actions only fire if the submitter explicitly recalls — rejection by approver goes through Reject actions

```
Approval Process Actions Summary:
┌──────────────────────┬────────────────────────────────────────────┐
│ Action Type          │ When Triggered                             │
├──────────────────────┼────────────────────────────────────────────┤
│ Initial Submission   │ User submits record for first time         │
│ Actions              │ → Typically: lock record, set Status field │
├──────────────────────┼────────────────────────────────────────────┤
│ Step Approval Actions│ This step is approved (not all steps)      │
│                      │ → Notify next approver, update fields      │
├──────────────────────┼────────────────────────────────────────────┤
│ Step Rejection       │ This step is rejected                      │
│ Actions              │ → Notify submitter, unlock record          │
├──────────────────────┼────────────────────────────────────────────┤
│ Final Approval       │ ALL steps approved (process complete)      │
│ Actions              │ → Update status, unlock, send notification │
├──────────────────────┼────────────────────────────────────────────┤
│ Final Rejection      │ Any step rejected (if configured to end)   │
│ Actions              │ → Set status to Rejected, unlock record    │
├──────────────────────┼────────────────────────────────────────────┤
│ Recall Actions       │ Submitter withdraws the request            │
│                      │ → Unlock record, reset status              │
└──────────────────────┴────────────────────────────────────────────┘
```

**Limitations:**
- Per-step actions (Approve/Reject) are different from Final Actions — a per-step approval only means that individual step was approved, not the entire process
- Actions available: Field Update, Email Alert, Task, Outbound Message — not a full Flow invocation (you'd need to trigger a Flow via an Outbound Message or Apex)

---

## Key Facts to Memorize
- Five components: Entry Criteria / Initial Submission Actions / Approval Steps / Recall Actions / Final Actions
- Approver types: Assigned Approver / Related User (field on record) / Queue / Apex
- Sequential steps: one after another; Parallel steps: multiple approvers at once
- Parallel vote: Unanimous (all must agree) vs. First Response (fastest vote wins)
- Record locking: default on submission, prevents edits during review
- Email approval: approvers can approve/reject from email without logging in
- Final Actions ≠ Step Actions — Final Actions fire only when ALL steps complete
- Entry Criteria failure = submission fails (record not submitted)

---

## Exam Traps
- **Step Approval ≠ Final Approval.** Step approval actions run when an individual step is approved. Final approval actions run when the ENTIRE process is complete (all steps done). Don't confuse them.
- **Sequential vs. Parallel is a step-level setting, not process-level.** Within a multi-step approval, each step can be sequential or parallel independently.
- **Record locking is configurable.** The exam sometimes tests whether you know that locking happens by default at submission but can be configured. Admins and approvers can unlock records.
- **Unanimous vs. First Response.** Unanimous requires ALL assigned approvers to approve. First Response means whoever votes first (approve or reject) determines the step outcome — fast but potentially unpredictable.
- **Entry Criteria failure.** If a record doesn't meet entry criteria, submission fails with an error message. The record is not submitted — it doesn't go to a step that automatically rejects it.

---

## Practice Questions

**Q:** An Opportunity approval process has two steps: Step 1 is Manager Approval, Step 2 is Finance Approval. A manager approves Step 1 but Finance rejects Step 2. Which actions fire?
**A:** Step 1's Approval Actions (for the manager's approval) already fired when the manager approved. When Finance rejects Step 2, the Step 2 Rejection Actions fire. The Final Rejection Actions also fire (since the process ends in rejection). Step 1 Rejection Actions do NOT fire — the manager already approved.

**Q:** A company wants 3 regional directors to simultaneously review a contract, and the contract is approved only when ALL three approve. How should the approval step be configured?
**A:** Configure one approval step with 3 assigned approvers. Set the approval order to "All Approvers" (Parallel) and the voting option to "Unanimous" — all three must approve before the step completes. If any one rejects, the step is rejected.

**Q:** A user submits a Discount record for approval. An hour later, they find a typo in the Amount field. The record is locked. Who can edit it?
**A:** Only System Administrators can edit locked approval records (and the assigned approver can, in some configurations). The submitter cannot edit it themselves. To allow the correction, an admin must unlock the record, the submitter makes the correction, and resubmits.
