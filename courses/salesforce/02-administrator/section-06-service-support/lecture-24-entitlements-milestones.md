# Entitlements & Milestones

## Exam Domain
Service & Support Apps — 11% of exam

## Core Concepts

Entitlements are the formal SLA framework in Salesforce Service Cloud. They define what level of service a customer is entitled to — and Milestones track whether you're meeting those SLA targets.

**Entitlement:** A contract-level definition of what service a customer gets (e.g., "24/7 phone support for Premium customers," "Business hours email support for Standard customers"). Linked to an Account (and optionally to a Contact or Asset).

**Service Contract:** A formal contract associated with an Account that lists the Entitlements the customer has. Think of this as the formal record of the customer's support agreement.

**Entitlement Process:** The "SLA template" — defines the steps (Milestones) a case must meet and their time targets. You assign an Entitlement Process to an Entitlement.

**Milestone:** A specific time-based checkpoint within an Entitlement Process. Examples:
- First Response: must respond within 1 hour
- Resolution: must resolve within 4 hours
- Escalation: if not resolved in 2 hours, escalate

Each Milestone has:
- A time threshold
- Actions for when it's approaching (warning)
- Actions for when it's violated (breach)

**The chain:** Service Contract → Entitlement → Entitlement Process → Milestones → Case

**Milestone Actions:**
- Warning: notification when milestone is approaching (e.g., 30 min before breach)
- Success: action when milestone is met
- Violation: action when milestone is missed (escalate, notify manager, etc.)

## PTA / SA Relevance

Entitlements and Milestones are the difference between "we have Service Cloud" and "we have a managed SLA program." Enterprise Service implementations that manage response time SLAs need the full Entitlements stack.

**Common gap in implementations:** Customers enable Service Cloud, create cases, but never configure Entitlements. They then measure SLA compliance manually via reports. Entitlements automate the SLA tracking and proactive violation alerting — this is the ROI conversation for mature service operations.

**Entitlement + Asset:** The combination of Entitlements with Assets (physical products a customer owns) enables warranty management. A customer with a specific product has specific entitlements (warranty coverage). This is common in manufacturing, healthcare, and field service scenarios.

## Architecture / How It Works

```
Entitlement & Milestone Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ACCOUNT (customer)
  └── SERVICE CONTRACT (formal agreement)
       └── ENTITLEMENT (what they're entitled to)
            ├── Entitlement Process assigned
            │
            └── CASE created → Entitlement attached
                 │
                 └── MILESTONES tracked on case:
                      ┌─────────────────────────────┐
                      │ Milestone: First Response    │
                      │ Target: 1 hour               │
                      │ Status: [Incomplete]         │
                      │                              │
                      │ 30 min → Warning action      │
                      │ 60 min → Violation action    │
                      └─────────────────────────────┘

  Timeline:
  Case Created ──┬── 30 min (Warning) ──┬── 60 min (Breach)
                 │                      │
                 └── Respond here ✓     └── VIOLATION (if not responded)
```

**Limitations:**
- Entitlements require Service Cloud license (not available in basic Sales Cloud)
- Milestones only track time — they don't enforce resolution automatically
- Business hours: milestone clocks pause when outside configured business hours (if business hours set)
- Entitlement must be linked to a case for milestone tracking to work — no entitlement on case = no milestone
- Entitlement Processes cannot be edited once in active use (you'd need to create a new version)

## Key Facts to Memorize

- Entitlements = SLA definitions per customer
- Service Contract = formal agreement containing entitlements
- Entitlement Process = SLA template with milestones
- Milestone = time-based checkpoint on a case (First Response, Resolution, etc.)
- Milestone actions: Warning (approaching), Success (met), Violation (breached)
- Business hours can be set on an Entitlement Process to pause milestones after hours
- Entitlements link to: Account, and optionally Contact or Asset

## Exam Traps

- **"Entitlements are automatically attached to cases"** — FALSE. Entitlements must be associated either manually or via automation (Flow/Trigger) when a case is created.
- **"Milestones enforce resolution automatically"** — FALSE. Milestones track time and trigger actions (notifications, escalations), but don't automatically close or resolve cases.
- **"Entitlements are available in all Salesforce editions"** — FALSE. They require a Service Cloud license.
- **"One case can only have one milestone"** — FALSE. A case can have multiple milestones (e.g., First Response AND Resolution milestones).

## Practice Questions

**Q:** A company wants to automatically notify the support manager when a high-priority case hasn't been responded to within 1 hour. What feature set should be configured?
**A:** Entitlements + Milestones. Create an Entitlement Process with a "First Response" Milestone set to 1 hour, with a Violation action that sends a notification email to the support manager.

**Q:** What is the relationship hierarchy in the Entitlement framework?
**A:** Account → Service Contract → Entitlement (with Entitlement Process assigned) → Case (Milestones tracked on the case)

**Q:** A case has an Entitlement Process with a First Response Milestone of 2 hours. Business Hours are configured as 9 AM–5 PM. A case is created at 4:30 PM. When does the milestone clock stop?
**A:** At 5:00 PM. The milestone clock pauses when business hours end and resumes at 9 AM the next business day. The remaining 1.5 hours carry over to the next business day.
