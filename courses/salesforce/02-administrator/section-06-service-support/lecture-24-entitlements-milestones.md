# L24: Entitlements & Milestones

## 🎯 Learning Objectives
- Explain what Entitlements are and how they verify customer support eligibility
- Configure Entitlement Processes and Milestones for SLA enforcement
- Set up Milestone Actions (warning and violation) and Service Contracts

## 📊 SLIDES

### Slide 1: What Are Entitlements?
**Visual:** Diagram: Customer Account → Service Contract → Entitlement → Case (with SLA timer active)
**Content:**
- Entitlement = a customer's right to receive a specific level of support
- Verifies: Is this customer eligible for support? At what service tier?
- Entitlements can be tied to an Account, Contact, or Asset
- Common entitlement types: Business Hours support, 24/7 support, Phone support, Email support
- Entitlement Status: Active, Inactive, Expired
- Enables the "Entitlements" related list on Case records
**Speaker Notes:** Think of Entitlements as the "entitlement check" at a theme park — you verify whether the customer has a valid ticket before letting them in. When an agent creates a case, they look at whether the account has an active entitlement and which support tier applies. This prevents unauthorized support consumption.

### Slide 2: Entitlement Setup Steps
**Visual:** Numbered checklist of setup steps with Setup navigation paths
**Content:**
- Step 1: Enable Entitlements — Setup → Entitlement Settings → Enable Entitlements
- Step 2: Add Entitlements related list to Account, Contact, Asset, and Case page layouts
- Step 3: Create Entitlement Processes (SLA timelines)
- Step 4: Add Milestones to each Entitlement Process
- Step 5: Configure Milestone Actions (warning/violation emails, field updates)
- Step 6: Link Entitlements to Cases manually or via automated rules
**Speaker Notes:** The setup sequence matters for the exam. You can't add milestones without an entitlement process, and entitlement processes aren't useful without milestones. Most of the configuration work happens in Setup → Entitlements, so be familiar with that navigation path.

### Slide 3: Entitlement Processes
**Visual:** Timeline bar showing an Entitlement Process with milestones at hours 2, 8, and 24 marked
**Content:**
- An Entitlement Process defines the overall SLA timeline for a case
- Cases on an entitlement process have a Process Start Time and Process End Time
- Processes can be based on: Case Created Date, or a specific status change
- Processes respect Business Hours if configured (timer pauses outside of hours)
- Multiple processes can exist: Premium SLA (24h close), Standard SLA (72h close), Enterprise SLA
- One process is applied to a case at a time; assigned through the Entitlement record
**Speaker Notes:** The Entitlement Process is the container that holds milestones and drives the SLA clock. For example, a "Premium SLA" process might require First Response within 1 hour and Case Resolution within 8 hours. Assigning the right process ensures the right milestones activate automatically.

### Slide 4: Milestones
**Visual:** Milestone record showing: Milestone Name, Time Trigger (minutes), Start Time, Recurrence, Required checkbox
**Content:**
- Milestones are required steps within an Entitlement Process
- Example milestones: First Response (2 hours), Case Acknowledged (30 minutes), Case Resolution (8 hours)
- Milestone timeline is defined in minutes from process start
- **Required checkbox:** If checked, the case cannot close without completing this milestone
- Milestone Completion Status: Not Started, In Progress, Completed, Violated
- Milestones can recur (e.g., update customer every 2 hours until resolution)
**Speaker Notes:** Milestones are the individual checkpoints within an SLA. If your support SLA says "First Response within 2 hours," that's a milestone. Each milestone has a time trigger and can be required for case closure. Recurring milestones enforce ongoing update obligations during long-running cases.

### Slide 5: Milestone Actions
**Visual:** Milestone Actions panel showing three action types: Success Actions, Warning Actions, Violation Actions with time offsets
**Content:**
- Milestone Actions are automated responses when a milestone approaches or is violated
- **Warning Actions:** Fire X minutes BEFORE the milestone deadline (e.g., notify agent 30 min before First Response due)
- **Violation Actions:** Fire when the milestone deadline PASSES without completion
- **Success Actions:** Fire when the milestone IS completed successfully
- Action types: Email Alert, Field Update, Outbound Message, Flow Action
- Warning time is set as minutes before the milestone's time trigger
**Speaker Notes:** Milestone Actions are where the SLA enforcement teeth are. A Warning Action might email the assigned agent and their manager 30 minutes before the first response deadline. A Violation Action might escalate the case to a senior queue and fire an executive notification. These actions run automatically without manual intervention.

### Slide 6: Service Contracts
**Visual:** Service Contract record showing fields: Account, Contract Number, Status, Start Date, End Date, Price, Entitlements related list
**Content:**
- Service Contract represents the formal agreement covering what support a customer is entitled to
- A Service Contract can have multiple Entitlements (e.g., one contract covers 5 entitlements)
- Service Contract fields: Account Name, Status (Draft, Active, Expired, Cancelled), Start Date, End Date, Total Price
- Contract Line Items detail the specific services covered
- Service Contracts are distinct from the Sales Contracts object — these are support agreements
- Path: Service Contract → Entitlements related list → New Entitlement
**Speaker Notes:** Service Contracts sit above Entitlements in the hierarchy. One contract might cover multiple products or business units, each with their own entitlement. The Account gets the Service Contract, and then individual Entitlements are created under that contract specifying support terms for each covered asset or product.

### Slide 7: Entitlement Lookup on Cases
**Visual:** Case record showing Entitlement field (lookup) and Entitlement Process Start Time / End Time fields
**Content:**
- When an agent creates a Case, they can select the Entitlement in the Entitlement lookup field
- Selecting the Entitlement attaches the corresponding Entitlement Process to the Case
- Entitlement Process Start Time auto-populates when the entitlement is selected
- Milestones appear in the Milestones related list on the Case record
- Agents can see milestone status (met/violated) directly on the case
- Business Hours field on Case can override the process Business Hours setting
**Speaker Notes:** The entitlement-to-case connection is what activates the SLA clock. Once an agent links an entitlement to a case, the milestones appear in the related list with countdown timers visible. This gives agents real-time visibility into how much time they have to respond, update, and resolve.

### Slide 8: Key Entitlement Feature Interactions
**Visual:** Summary flowchart: Entitlement → Entitlement Process → Milestones → Milestone Actions → Case Events
**Content:**
- Entitlements verify ELIGIBILITY; Entitlement Processes enforce TIMELINES
- Business Hours: Processes can pause outside of configured business hours
- Milestone Required = true: Case cannot be closed until milestone is completed
- Multiple entitlement processes support different customer tiers (Gold, Silver, Bronze SLA)
- Reporting: Standard reports exist for Entitlement Compliance and Milestone Violations
- Entitlement Management requires Service Cloud or the Entitlements add-on license
**Speaker Notes:** Bring it all together: Entitlements check if the customer is eligible, Entitlement Processes set the SLA structure, Milestones define specific checkpoints, and Milestone Actions automate the enforcement. This whole system is what allows Salesforce to power true SLA management at scale.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 24 — Entitlements and Milestones. This is one of the more advanced service features, but it's consistently tested on the Admin exam and it's a real-world feature that sets professional Salesforce service implementations apart from basic ones.

Let's start with the concept. An Entitlement is a record that says: "This customer is authorized to receive this specific type and level of support." It answers the question: "Is this customer eligible for support?" before your team spends time on their case. Entitlements can be linked to an Account, a Contact, or even a specific Asset.

Service Contracts sit at the top of the hierarchy. A Service Contract is the formal agreement that covers what a customer is entitled to — think of it as the contract your sales team sold. Under that Service Contract, you create individual Entitlements for each supported product, location, or business unit covered by the contract.

When an agent opens a case for a customer, they look up the relevant Entitlement and link it to the case via the Entitlement lookup field. The moment that link is made, the associated Entitlement Process kicks in.

An Entitlement Process is the SLA timeline. It defines the clock. It says things like: "From the moment a case enters this process, the agent has 2 hours for first response and 8 hours for full resolution." You can have multiple processes for different service tiers — Gold, Silver, Bronze — each with different time requirements.

Inside each Entitlement Process are Milestones. A Milestone is a specific checkpoint. First Response in 2 hours. Case Acknowledged in 30 minutes. Full Resolution in 8 hours. Each milestone has a time trigger in minutes, and you can mark it as Required, which means the case literally cannot be closed until that milestone is completed.

The enforcement comes from Milestone Actions. Each milestone has three types of actions: Warning Actions fire before the deadline — say, 30 minutes before first response is due, send an email to the assigned agent. Violation Actions fire when the deadline passes without the milestone being completed — escalate the case, notify a manager, update a field. Success Actions fire when the milestone IS completed on time — maybe log it for SLA compliance reporting.

Setting this up requires a specific sequence. First, enable Entitlements in Setup under Entitlement Settings. Then add the Entitlements related list to your page layouts for Account, Contact, Asset, and Case. Then create your Entitlement Processes, add Milestones to each process, and configure the Milestone Actions. Finally, link the processes to Entitlements, and link Entitlements to Cases.

Business Hours integration is an important nuance. If you configure Business Hours on an Entitlement Process, the SLA timer pauses outside those hours. So if a case comes in Friday at 4:55 PM and your business hours end at 5 PM, the clock doesn't tick all weekend — it resumes Monday morning. This is critical for accurate SLA compliance.

From a reporting perspective, Salesforce provides standard reports for Entitlement Compliance and Milestone Violations, so management can track how well the team is meeting their SLA commitments.

That's Entitlements and Milestones. Up next is Knowledge Articles.

## 🔔 EXAM TIPS
- **Setup sequence matters:** Enable Entitlements → Create Process → Add Milestones → Configure Actions → Link to Cases.
- **Required milestone prevents case closure:** If a milestone is marked Required, the case cannot be closed until it's completed.
- **Business Hours pause the SLA clock:** Entitlement Processes respect Business Hours so off-hours don't count against SLA.
- **Milestone Actions have three types:** Warning (before deadline), Violation (after deadline), Success (when completed).
- **Service Contracts → Entitlements → Cases:** Know the hierarchy; Service Contract covers the agreement, Entitlements specify the terms, Cases are linked to individual Entitlements.
- **Warning time is set in minutes BEFORE the deadline:** Not after — it's a proactive alert, not a reactive one.

## ✅ LECTURE SUMMARY
- Entitlements verify a customer's eligibility for support; linked to Account, Contact, or Asset
- Service Contracts are the parent agreement; each contract can have multiple Entitlements
- Entitlement Processes define the SLA timeline; applied to Cases through the Entitlement lookup
- Milestones are checkpoints within a process (e.g., First Response: 2 hours); can be Required for case closure
- Milestone Actions: Warning Actions (before deadline), Violation Actions (after deadline), Success Actions (on completion)
- Business Hours can be configured on Entitlement Processes to pause the SLA clock outside work hours
- Setup path: Setup → Entitlement Settings → Enable; then manage at Setup → Entitlement Processes

## ❓ MINI QUIZ

**Q1:** An administrator is configuring an Entitlement Process. They want the system to automatically notify the agent's manager 30 minutes before the "First Response" milestone deadline. Which action type should they configure?
- A) Success Action with a 30-minute time offset
- B) Violation Action triggered 30 minutes after the deadline
- C) Warning Action set to trigger 30 minutes before the milestone time
- D) Escalation Rule with a 30-minute threshold
**Answer:** C — Warning Actions are configured to fire a specified number of minutes BEFORE the milestone deadline. Setting a Warning Action 30 minutes before the First Response milestone will notify the manager proactively before the SLA is breached.

**Q2:** A case has a "Case Resolution" milestone marked as Required. The assigned agent attempts to close the case before completing the milestone. What happens?
- A) The case closes but the milestone is flagged as Violated
- B) An escalation email is sent but the case still closes
- C) Salesforce prevents the case from being closed until the Required milestone is completed
- D) The Required field setting has no effect on case closure
**Answer:** C — When a Milestone is marked Required, Salesforce enforces completion before the case can be closed. The Required milestone acts as a gate on case closure, ensuring SLA steps are completed.

**Q3:** A company offers two support tiers: Gold (1-hour first response) and Silver (4-hour first response). How should the administrator model this in Salesforce?
- A) Create one Entitlement Process with two milestones at different times and assign both to every case
- B) Create two separate Entitlement Processes (Gold SLA and Silver SLA), each with their own First Response milestone, and assign the appropriate process through the Entitlement record
- C) Use Case Assignment Rules to set the priority to High for Gold customers and Low for Silver customers
- D) Create two Case Escalation Rules with different time thresholds for each tier
**Answer:** B — Multiple Entitlement Processes allow different SLA tiers. The Gold Entitlement references the Gold SLA process (1-hour milestone) and the Silver Entitlement references the Silver SLA process (4-hour milestone). Cases linked to each respective Entitlement automatically get the correct SLA clock.
