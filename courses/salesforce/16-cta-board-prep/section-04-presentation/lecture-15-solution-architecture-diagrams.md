# Solution Architecture Diagrams

## Why This Matters for CTA

The whiteboard diagram is the most visible artifact in the CTA board exam. When a candidate finishes the 45-minute presentation, the panel has 45 minutes of Q&A to conduct. During every minute of that Q&A, the candidate's diagram is visible on the whiteboard behind them. Panelists refer to it, point to it, and challenge it. A clear, logically organized diagram reduces cognitive load for the panel and provides the candidate with a shared visual reference for Q&A. A chaotic, unlabeled, or incomplete diagram creates confusion and signals an unorganized thought process.

In customer advisory work, architecture diagrams are deliverables — they are the artifacts that survive beyond the meeting and shape implementation decisions. In the CTA exam, the diagram is a communication tool that must convey architectural intent in real time while being drawn under pressure. These are different skills, but the CTA board diagram borrows the discipline of good advisory diagramming: clear layering, labeled boxes with specific names (not generic placeholders), explicit data flows, and a consistent level of abstraction throughout.

The panel does not expect a polished Lucidchart output. They expect a diagram that shows: what the significant components are, how they are organized (layered architecture), and how data or control flows between them. A CTA candidate who draws a complete, logically structured whiteboard diagram in 10 minutes while describing it verbally has demonstrated an architectural communication skill that is impossible to fake.

---

## Core Technique / Approach

### The Three-Layer Architecture Diagram

The most effective CTA whiteboard diagram for enterprise scenarios uses a three-layer structure that corresponds to how Salesforce architects think about enterprise platform architecture:

```
Layer 1 (top): External Systems and Users
Layer 2 (middle): Salesforce Platform (the primary subject)
Layer 3 (bottom): Core Data Model and Services
```

This layout ensures that data flows can be drawn as vertical arrows (External → Salesforce → Data Model) and internal Salesforce architectural relationships are shown horizontally within Layer 2. The eye naturally reads top-to-bottom and left-to-right; organizing the diagram in this direction makes it easy for the panel to follow your verbal narration.

**Layer 1 — External Systems and Users:**
Draw boxes for every significant external system named in the scenario. Label them with the actual system names from the scenario (SAP, Epic, Azure AD, Zendesk), not generic labels ("External ERP," "Identity Provider"). Group them by category if there are many: ERP systems on the left, identity/SSO systems in the middle, third-party SaaS on the right.

**Layer 2 — Salesforce Platform:**
This is the main body of the diagram. Divide it into sub-sections:
- Experience Cloud (if applicable) on the left — this is the external-facing surface
- Salesforce Core (Sales, Service, Health Cloud, FSC — whichever applies) in the center
- Integration layer (MuleSoft, API Gateway, Platform Events) — can be on the right or between Layer 1 and Layer 2 as a "middleware lane"
- Shield / Security components — add a small box or annotation rather than a separate lane

**Layer 3 — Core Data Model (optional, for complex data architecture):**
For scenarios with complex object relationships, add a bottom lane showing the key objects and their relationships. This is especially valuable for data architecture-heavy scenarios (retail, financial services).

---

### Drawing Sequence — Narrate While You Draw

The worst candidates draw silently and then explain. The best candidates narrate as they draw — each box, each arrow, each label is described in one sentence as it is drawn. This synchronized narration accomplishes three things: it keeps the panel engaged, it forces you to articulate the architectural intent of every element, and it fills the silence that intimidates less experienced presenters.

**Narration template for each element:**
- Box: "Here I have [System/Component name] — this is [role in architecture, one sentence]."
- Arrow: "This arrow represents [data/event/API call] flowing from [source] to [target] — this is the [integration pattern] I described, triggered by [event/action]."
- Group/boundary: "I'm grouping these in a [zone/layer] because they share [common characteristic] and together they form the [name] tier."

---

### Naming Conventions for CTA Diagrams

Name everything with specificity. The panel differentiates candidates who know the platform from candidates who don't by whether they use precise platform terminology or generic placeholders.

| Generic (Poor) | Specific (Good) |
|----------------|-----------------|
| "CRM System" | "Salesforce Sales Cloud" or "Salesforce FSC" |
| "Integration Platform" | "MuleSoft Anypoint Platform" or "MuleSoft Flex Gateway" |
| "Identity Provider" | "Azure AD" or "Okta" |
| "Database" | "Salesforce Objects" with named objects (Account, Case, Asset) |
| "API" | Named API: "Epic FHIR R4 API" or "SAP RFC" |
| "Security" | "Shield Platform Encryption" and "Field Audit Trail" |
| "Portal" | "Salesforce Experience Cloud — Partner Community" |
| "Email Platform" | "Salesforce Marketing Cloud — Engagement" |

---

### The Minimum Viable CTA Diagram

For any enterprise scenario, the minimum viable diagram contains:

1. All named external systems from the scenario (labeled with actual names)
2. The Salesforce org boundary (a large rectangle)
3. Sub-zones within Salesforce: Experience Cloud (if applicable), Core Cloud (Sales/Service/etc.), Integration components (Platform Events, Named Credentials, Connected Apps)
4. Named key objects (Account, the primary LDV object, custom objects central to the scenario)
5. Integration flows as arrows: at minimum, which external systems connect to Salesforce and in which direction (unidirectional vs. bidirectional)
6. Compliance/security annotation: a small "Shield" box or annotation noting where encryption and audit components apply
7. User populations as stick figures or labeled boxes at the top of each channel (internal users, portal users, system integrations)

---

### Advanced Diagram Techniques

**Swim lanes for complex multi-audience scenarios:**
When the scenario has three or more distinct user populations (employees, partners, customers) with different access paths, add vertical swim lanes on the left side of the diagram representing each user type. This makes the access model visually clear without lengthy verbal explanation.

**Traffic annotation:**
For integration arrows, annotate with protocol and volume where architecturally significant: "REST, <3 sec SLA," "Batch, nightly," "Platform Event, near-real-time," "Bulk API 2.0." This eliminates the need for the panel to ask "how does that integration work?" for every arrow.

**Color coding (limited):**
Use three colors maximum with a clear legend: one color for Salesforce components, one for external systems, one for high-risk or compliance-sensitive components. In a whiteboard context, use the whiteboard's available marker colors consistently. Never use color as the only differentiator — label everything.

**Current state vs. target state:**
For migration scenarios, draw current state on the left half and target state on the right half, with a migration arrow or phase boundary between them. This immediately contextualizes the architecture as a transformation, not just a net-new deployment.

---

### Whiteboard Efficiency

You have approximately 10 minutes to draw a diagram while narrating. Practice this constraint explicitly. The technique for speed:
- Draw boxes as labeled rectangles before filling in details
- Draw all boxes first, then add arrows (prevents diagram spaghetti from connection lines drawn before you know where everything goes)
- Use abbreviations internally but label the first occurrence fully: "SF-CORE (Salesforce Sales Cloud)"
- Reserve the right margin for assumptions and key trade-offs you will reference in Q&A

---

## PTA/SA Connection

Advisory architects in the field produce three types of diagrams: context diagrams (system scope and boundaries), solution architecture diagrams (the detailed design), and data flow diagrams (how information moves). All three are tested implicitly in the CTA exam.

The skill most directly applicable from day-to-day PTA work is the context diagram — the diagram that shows, at a high level, how the proposed Salesforce implementation fits into the customer's existing technology landscape. This diagram is most useful in executive briefings and appears naturally in the Act 1 portion of the CTA presentation (establishing business and architectural context). Practice drawing this diagram quickly and clearly for every customer engagement, and it will transfer to CTA exam readiness.

The detailed solution architecture diagram — what is drawn during Act 3 — is the diagram you produce in architecture workshops. The CTA exam tests your ability to produce it in real time, under time pressure, without reference materials.

---

## Do's and Don'ts

**Do:**
- Label every box with the actual name from the scenario
- Narrate as you draw, one sentence per element
- Use a consistent three-layer layout for every scenario
- Annotate integration arrows with protocol and SLA
- Add a small "Compliance/Shield" annotation in the Salesforce zone when Shield components apply
- Leave whitespace — a dense, crowded diagram is harder to reference in Q&A than a spacious one
- Draw the diagram in the center of the whiteboard, leaving margins for notes and assumptions

**Don't:**
- Draw in silence and then explain — this wastes time and loses the panel
- Use generic labels ("System A," "Integration Layer," "Database")
- Draw every integration arrow as a bidirectional double-headed arrow — some integrations are explicitly one-directional; show this
- Attempt to draw a perfectly detailed ERD on the whiteboard — diagram the architecture, not the data model in full detail
- Erase and restart mid-diagram — if you draw something incorrectly, annotate it ("actually bidirectional — let me mark that") and move on; restarting breaks the presentation flow
- Draw the diagram before starting to speak — establish business context verbally (Act 1) before picking up the whiteboard marker

---

## Practice Exercise

**Exercise 1 — 10-Minute Diagram Drill**

Set a timer for 10 minutes. Using only the scenario title and a piece of paper, draw the three-layer architecture diagram for the Healthcare scenario (Lecture 12). Requirements: all external systems labeled, Salesforce zone with sub-sections, integration arrows with protocol annotations, and user populations shown. Review: does the diagram convey the "FHIR as a view" integration model clearly? Can someone who hasn't read the scenario understand from the diagram that Epic clinical data is not stored in Salesforce?

**Exercise 2 — Narration Practice**

Record yourself drawing the architecture diagram for the Retail scenario (Lecture 10) while narrating out loud. Play the recording back. Evaluate: Is every element labeled as you draw it? Are there silent pauses longer than 5 seconds? Do you use specific names or generic placeholders?

**Exercise 3 — Panel Reference Test**

After drawing a complete diagram from any scenario, hand it to a colleague who has not seen the scenario and ask them: "Where is the customer portal? How does data get from SAP to Salesforce? Which components are encrypted?" If they cannot answer from the diagram alone, identify what labeling or annotation is missing.

**Exercise 4 — Current vs. Target State**

For the B2B Enterprise scenario (Lecture 13 — three-org consolidation), draw a current-state diagram showing the three separate orgs and their integrations, then draw the target-state diagram showing the unified org. Practice this as a two-diagram sequence, narrating the transformation from current to target as you draw.

**Exercise 5 — Constraints Annotation**

Draw the Financial Services scenario architecture diagram and then annotate the diagram with the compliance constraints: where FINRA Rule 4511 communication archiving applies, where View All Data for compliance officers is active, where MFA high-assurance sessions are required. Practice adding these annotations as overlay notations on the diagram without redrawing it.
