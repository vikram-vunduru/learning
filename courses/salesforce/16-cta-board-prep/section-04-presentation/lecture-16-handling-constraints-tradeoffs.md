# Handling Constraints and Trade-offs

## Why This Matters for CTA

The CTA board exam scenario is deliberately designed to have no perfect solution. Every scenario contains requirements that pull in opposite directions: a security requirement that conflicts with an integration pattern, a performance requirement that conflicts with the sharing model, a budget constraint that forces a compromise on the ideal architecture, a timeline constraint that requires phasing features the business wants immediately. The panel knows this. They are not looking for a candidate who produces a perfect architecture — they are looking for a candidate who identifies the tensions, names the trade-offs, and makes a defensible choice.

Candidates who present an architecture as if it has no trade-offs fail the board for one of two reasons: either they haven't identified the tensions in the scenario (analytical gap), or they identified them but lacked the confidence to surface them (communication gap). Both fail. The architectural maturity that the CTA title certifies is precisely the ability to navigate complexity honestly — to say "these two requirements are in tension, here is my analysis, here is my choice, and here is what I would do if my assumption changes."

For a PTA, this is the core of enterprise advisory work. Customers with complex requirements routinely present a PTA with a set of requirements that cannot all be satisfied simultaneously. The PTA's value is in identifying which requirements are truly non-negotiable (hard constraints), which are preferences (soft constraints), and which trade-off produces the best outcome given the full set of constraints. The CTA board is testing that exact skill in a 90-minute time-compressed format.

---

## Core Technique / Approach

### The Four-Step Trade-off Framework

When you identify a trade-off in the scenario, follow this four-step structure:

```
1. Name the tension (what two things are pulling against each other)
2. Present both options (with honest characterization of each)
3. State your choice and primary justification (tied to a specific scenario constraint)
4. Name the condition under which your choice would change
```

This structure accomplishes three things: it demonstrates that you identified the tension (Step 1), it shows that you considered alternatives (Step 2), it provides a defensible basis for your decision (Step 3), and it pre-empts the panel's "what if?" question (Step 4).

**Example — applying the four-step:**

Tension identified: "The scenario requires Private OWD on Account for sales rep data isolation, but the Account object has 8.5M records (LDV), making sharing recalculation a performance risk."

Step 1 — Name the tension: "The security requirement for rep data isolation pulls toward Private OWD. The LDV volume pulls away from Private OWD because of sharing recalculation performance impact. These requirements are in tension."

Step 2 — Present both options: "Option A: Private OWD with Territory Management — provides the required isolation, but sharing recalculation must be carefully managed. Option B: Public Read Only OWD with Restriction Rules — eliminates sharing recalculation risk, but requires a newer platform capability and a different access model for the sharing components."

Step 3 — State your choice: "I'm choosing Territory Management with Private OWD because the business has a clearly defined geographic territory model, Territory Management is specifically designed for this access pattern at scale, and the sharing recalculation risk is manageable by limiting territory reassignment frequency to monthly rather than real-time."

Step 4 — Change condition: "If the business requires real-time territory reassignment — for example, if accounts are frequently moved between reps during the same day — the recalculation risk becomes unacceptable and I would revisit Public Read Only OWD with Restriction Rules as the safer pattern."

---

### Classifying Constraints: Hard vs. Soft

Before presenting any architecture, mentally classify every constraint in the scenario as hard (C-H) or soft (C-S):

**Hard constraints (C-H):** Non-negotiable. The architecture cannot violate these. If the architecture appears to violate a hard constraint, the candidate must explain why it actually doesn't — or revise the architecture.

Examples of hard constraints:
- "All EU personal data must remain in EU data centers" → hard; violating it is a GDPR breach
- "All SAP connections must go through the corporate ESB" → hard; IT governance controls this
- "Production deployments must be approved by the Change Advisory Board" → hard; compliance requirement
- "No custom code — declarative only" → hard; budget/staffing reality

**Soft constraints (C-S):** Preferences. The architecture should respect them but may trade them off for more important considerations. When a soft constraint is traded off, name it explicitly and justify the trade-off.

Examples of soft constraints:
- "Prefer to avoid third-party managed packages" → soft; can be overridden if a managed package is the best solution
- "Single sign-on is preferred for all user types" → soft; may not be achievable for external users without an IdP
- "Would like all historical data migrated" → soft; migrating only active data may be the right first phase decision

**The C-H/C-S classification test:**
Ask: "If the architecture violates this constraint, does the project fail, face a regulatory penalty, or break a signed contract?" If yes → C-H. If no → C-S.

---

### The Common Trade-off Pairs in CTA Scenarios

Memorize these recurring trade-off tensions — they appear in different surface forms across every scenario type:

**1. Security isolation vs. performance at scale**
- Tension: Private OWD (best security isolation) + LDV records = sharing recalculation performance risk
- Resolution options: Territory Management, Public Read Only + Restriction Rules, Apex Managed Sharing
- Panel signal: "You've proposed Private OWD on a 5M-record object — what's your mitigation for sharing recalculation?"

**2. Real-time integration vs. system resilience**
- Tension: Synchronous real-time integration (meets latency SLA, simple UX) vs. asynchronous integration (resilient to external system downtime, no direct coupling)
- Resolution: asynchronous is almost always right for enterprise; synchronous only when data is truly needed in the immediate user interaction
- Panel signal: "What happens when SAP goes down? Does Salesforce fail too?"

**3. Single org simplicity vs. multi-org isolation**
- Tension: Single org (unified data model, simpler integration, Customer 360) vs. multi-org (data isolation, regulatory boundary, independent release cadence)
- Resolution: default to single org unless hard regulatory or business isolation requirement exists
- Panel signal: "The EU subsidiary's legal team says they need separate data storage — does your single-org recommendation hold?"

**4. Migrate everything vs. migrate enough to go live**
- Tension: Full historical data migration (complete business continuity) vs. active data migration only (faster, lower risk go-live)
- Resolution: always migrate active data (records in use on day one) in full; stage historical data migration as a separate workstream
- Panel signal: "The migration timeline is at risk. What do you defer and what do you protect?"

**5. Managed package vs. custom build**
- Tension: Managed package (faster delivery, vendor-supported, AppExchange ecosystem) vs. custom build (complete control, no vendor dependency, org-specific optimization)
- Resolution: prefer managed packages for commoditized functionality (CPQ, volunteer management, document generation); custom build only when no managed package meets the requirement
- Panel signal: "There's a managed package that does exactly this on the AppExchange. Why are you building custom?"

**6. NPSP/NPC migration now vs. waiting for platform maturity**
- Tension: Migrate now (clean slate, modern data model) vs. wait (fewer bugs, more ecosystem knowledge, fewer surprises)
- Resolution: depends on whether the current platform state is stable or actively degrading; if technical debt is accumulating, migrate now
- Panel signal: "Nonprofit Cloud is relatively new. What are you risking by migrating to it now?"

**7. Full encryption vs. functional limitations**
- Tension: Shield Platform Encryption on all PHI fields (maximum compliance) vs. limited encryption (functional) because encrypted fields break formula fields, reports, and SOQL filters
- Resolution: encrypt the fields that legal/compliance requires; design alternative query/reporting paths for encrypted fields; don't encrypt fields the business needs for operational queries unless required
- Panel signal: "If you encrypt the Name field on Contact, how does the contact search work?"

**8. Custom CPQ configuration vs. system simplicity**
- Tension: Rich CPQ configuration (handles all pricing scenarios) vs. keeping the product catalog simple enough to maintain
- Resolution: design for the 80% of products and deals that follow standard patterns; use CPQ's advanced scripting or custom pricing plugin only for the exception cases
- Panel signal: "You have 180,000 SKUs in CPQ — who maintains the product compatibility rules when the catalog changes?"

---

### Handling "I Don't Know" in the Trade-off Discussion

The panel occasionally probes a trade-off that the candidate genuinely cannot answer — a newer platform feature, a platform limit the candidate hasn't memorized, or a regulatory requirement outside their expertise. The correct response is not to guess or bluff — it is to name the knowledge boundary honestly and propose how you would close the gap.

**The "I don't know" framework:**
1. Acknowledge what you know and what you don't: "I'm aware that Hyperforce data residency supports object-level isolation, but I'd want to verify the specific residency granularity for the APAC tenant before committing to it in the architecture."
2. State how you would validate: "I would validate this through Salesforce's data residency documentation and, if necessary, through a direct conversation with the Trust team during the architecture review."
3. State the contingency: "If Hyperforce doesn't provide the required granularity, the fallback is a separate APAC org with a cross-org data sync integration — which is architecturally viable but more complex."

This response demonstrates: (1) honest self-assessment, (2) a clear path to resolution, (3) a contingency plan. A candidate who says "I believe Hyperforce supports this" without the caveat is making a specific claim — if it's wrong, it's a knowledge error. A candidate who qualifies it is showing architectural rigor.

---

## PTA/SA Connection

Trade-off discussions in customer engagements are the highest-value advisory moments a PTA has. When a customer asks "why can't we just do [simpler thing]?" the PTA's answer — in the form of the four-step trade-off framework — is what separates an advisor from an order-taker.

In practice: customers often push for synchronous real-time integration when asynchronous is safer. They often push for a single-phase migration when phased migration reduces go-live risk. They often want to encrypt everything when encrypting only what's required preserves functionality. The ability to name the trade-off clearly, present both options honestly, and recommend with justification is the PTA advisory skill. The CTA exam is testing that skill in compressed form.

The C-H/C-S classification is directly applicable to customer requirements gathering. When customers present a long list of requirements, the PTA's job is to help them classify: which are true non-negotiables (C-H), and which are preferences that can be deprioritized if the project budget or timeline is at risk (C-S)? Many project failures result from treating preferences as non-negotiables and running out of budget before the project delivers anything.

---

## Do's and Don'ts

**Do:**
- Identify trade-offs proactively before the panel asks — say "I see a tension between X and Y" before they do
- Use the four-step framework consistently for every trade-off named
- Classify constraints as hard vs. soft at the beginning of your presentation (in the Assumptions section)
- Name the condition under which your architectural choice would change — this pre-empts the "what if?" question
- Be honest when you're uncertain — propose validation and a contingency rather than guessing

**Don't:**
- Present an architecture as if it has no trade-offs — this signals naivety about enterprise complexity
- Choose one option and never name the alternative — a decision without a considered alternative is not a trade-off analysis
- Become defensive when the panel challenges a trade-off — they are stress-testing the decision, not disqualifying you
- Treat every constraint as a hard constraint — this makes the architecture impossible to adapt; the panel will notice that no trade-offs are possible
- Apologize for trade-offs — "unfortunately, this design has a limitation" is weak. "The limitation of this approach is X; the reason I accept it is Y" is confident

---

## Practice Exercise

**Exercise 1 — Trade-off Inventory**

Take the retail scenario from Lecture 10. Before reading the Recommended Approach section, identify every trade-off tension in the scenario. Write the tension as: "[Requirement A] pulls toward [Decision X]; [Requirement B] pulls toward [Decision Y]." Compare your list to the trade-offs documented in the scenario — how many did you find independently?

**Exercise 2 — Four-Step Out Loud**

For each trade-off in the financial services scenario (Lecture 11), deliver the four-step trade-off explanation out loud in under 90 seconds. Record it. Review: did you name the tension clearly? Did you present both options honestly? Did you name a condition under which your choice changes?

**Exercise 3 — Hard vs. Soft Classification**

Take the healthcare scenario (Lecture 12). List all stated and implied constraints. Classify each as C-H or C-S and explain your classification. For all C-S constraints, write one sentence on how the architecture would change if the constraint were elevated to C-H (e.g., "if 'prefer to avoid third-party packages' becomes a hard constraint, the volunteer management solution changes to...").

**Exercise 4 — The Adversarial Panel Simulation**

Have a colleague (or yourself in a second pass) challenge your architecture for the B2B scenario (Lecture 13) with "what if" questions that change constraints. For each challenge, respond using the four-step framework. Example challenges: "What if the consolidation must happen in 18 months instead of 30?" "What if one distributor represents 40% of revenue and demands their own org?" "What if SAP is modernized to a REST API — does your integration architecture change?"
