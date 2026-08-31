# Lecture 18: Human Oversight and Accountability in AI
**Section:** Section 4 — AI Ethics and Trust  
**Duration:** 12 minutes  
**Exam Weight:** ~8% of exam (scenario questions test when human oversight is required)

---

## Learning Objectives
1. Define the human-in-the-loop concept and contrast it with fully autonomous AI
2. Identify categories of decisions where AI should always defer to humans
3. Explain how Agentforce is designed with human escalation built in
4. Describe accountability frameworks: who is responsible when AI makes a mistake?
5. Explain Salesforce's AI Acceptable Use Policy and its purpose
6. Apply this knowledge to scenario-based exam questions about when human oversight is required

---

## SLIDES

### Slide 1: Title Slide
**Visual:** A continuum line from "Full Human Control" on the left to "Full AI Autonomy" on the right. A dial positioned at approximately 70% toward human — labeled "Responsible AI Design."
**Content:**
- Human-in-the-loop: where it's required, why it matters
- When AI should ALWAYS defer to humans
- Agentforce escalation design
- Accountability when AI fails
- Salesforce's AI Acceptable Use Policy

**Speaker Notes:** "We've spent this section learning about AI principles, bias, and transparency. This final lecture in Section 4 pulls it all together into a practical design principle: when should AI act autonomously, and when should it hand off to a human? This is the most practically applicable ethics topic — and it shows up in exam scenario questions more than almost anything else."

---

### Slide 2: The Human-in-the-Loop Spectrum
**Visual:** A horizontal spectrum with five positions: (1) Human decides, AI provides information. (2) Human decides, AI recommends. (3) AI decides, human can override. (4) AI decides, human notified. (5) AI decides, no human involvement. Each position has an example use case and a risk level indicator.
**Content:**
**Position 1 — Human decides, AI informs:**
- Example: Einstein prediction score on a lead; rep makes their own call
- Risk: Minimal. AI provides context; human retains full decision authority

**Position 2 — Human decides, AI recommends:**
- Example: Next Best Action suggesting an offer; rep accepts or declines
- Risk: Low. Human still makes the decision; AI shapes but doesn't determine

**Position 3 — AI decides, human can override:**
- Example: Einstein Case Classification auto-filling fields; agent can correct
- Risk: Medium. Default is AI; requires human attention to fix errors

**Position 4 — AI decides, human notified:**
- Example: Agentforce resolves a routine billing inquiry; manager sees summary
- Risk: Higher. Errors may not be caught until after the fact

**Position 5 — AI fully autonomous, no human:**
- Example: Could theoretically apply to automated credit decisions with no review
- Risk: High. No error correction path; regulatory concerns; bias unchecked

**Speaker Notes:** "This spectrum is how you should think about EVERY AI deployment decision. The question isn't 'should we use AI?' It's 'where on this spectrum is it appropriate for this use case?' Routine, low-stakes, reversible decisions can sit further right — let the AI handle it autonomously. High-stakes, irreversible, or potentially discriminatory decisions should sit further left — keep humans involved. The exam will present scenarios and test whether you can correctly identify where on this spectrum a given use case should sit."

---

### Slide 3: When AI Should ALWAYS Defer to Humans
**Visual:** Six hexagonal icons with labels: Medical Decisions, Legal Proceedings, Financial Life Events, Employment Decisions, Safety-Critical Scenarios, High-Stakes Irreversible Actions. All surrounded by a circle labeled "Human Required."
**Content:**
**Categories requiring mandatory human oversight:**

**Medical/Health decisions:**
- Diagnoses, treatment recommendations, medication prescriptions
- Even highly accurate AI cannot replace clinical judgment in high-stakes medical decisions

**Legal decisions:**
- Sentencing, parole, bail determinations, legal judgments
- Due process requires human decision-makers

**Employment decisions:**
- Hiring, termination, performance evaluation with major consequences
- GDPR, EEOC, and other regulations increasingly require human review

**Financial life events:**
- Loan approvals/denials, insurance underwriting, bankruptcy determinations
- Major life-impact decisions with legal right-to-explanation requirements

**Safety-critical operations:**
- Air traffic control, nuclear systems, emergency response
- Automation failures can be catastrophic and irreversible

**High-stakes customer interactions:**
- When a customer faces a life or safety issue during a service interaction
- When significant financial harm or legal liability is possible

**Speaker Notes:** "Here's the rule of thumb: the more irreversible, the more consequential, and the more human dignity is at stake, the more you need a human in the decision loop. A misclassified support case is annoying — an agent can fix it. A wrongful denial of a life insurance claim based on flawed AI is a life-altering harm with no easy reversal. Salesforce's AI Acceptable Use Policy explicitly prohibits using Einstein AI to make final determinations in employment, housing, or lending — these categories require human review. The AI can inform, assist, and recommend. The human must decide."

---

### Slide 4: Agentforce Escalation Design
**Visual:** Flowchart showing the Agentforce escalation path: Customer message → Agent handles → Escalation trigger detected (one of several types) → Human agent notified → Full context transferred → Human agent continues conversation.
**Content:**
**Agentforce's built-in escalation design:**

**Escalation triggers:**
- Issue falls outside defined Topics
- Customer explicitly requests a human
- Atlas Reasoning Engine detects high frustration or distress signals
- Transaction or decision amount exceeds policy threshold (e.g., refunds > $500)
- Legal, compliance, or safety keywords detected
- Agent fails to resolve after defined retry limit

**How escalation works:**
- Full conversation transcript transferred to human agent
- Case record pre-populated with context
- Human sees everything the agent said and did
- No context loss — customer should not have to repeat themselves

**Design requirement:** Escalation must be configurable as part of any Agentforce deployment

**Speaker Notes:** "Every Agentforce deployment MUST have escalation designed in. This is not optional. A Salesforce best practice — and increasingly a compliance requirement — is that any autonomous AI agent touching customers must have defined escalation paths. The exam tests this in scenario questions: 'A customer expresses suicidal thoughts to a service chatbot. What should happen?' The answer: immediate escalation to a human agent — no autonomous AI system should handle a safety crisis. 'A customer wants a refund of $10,000 that exceeds agent authority.' Escalation to human with authority to approve. These scenarios always have 'escalation to human' as the correct answer."

---

### Slide 5: Context Transfer — The Invisible Escalation
**Visual:** Before/after comparison. Before: Customer has conversation with bot. Escalation happens. New human agent says: "Can you explain your issue again?" Customer frustration indicator maxes out. After: Context transferred. Human agent says "I see you've been dealing with a duplicate charge since March 3rd — let me take care of that for you." Customer satisfaction indicator goes up.
**Content:**
**Why context transfer is critical to escalation design:**

Without context transfer:
- Customer must repeat their entire issue
- Trust already lowered by bot interaction — this erases what little remained
- Human agent starts cold — may make same errors as the bot

With proper context transfer:
- Human agent has full conversation history
- Human agent has account details already pulled up
- Human can reference specifics: "I see the agent offered you a partial refund — let me upgrade that"
- Customer feels heard — trust is preserved or recovered

**Technical implementation:**
- Agentforce logs full conversation in the associated Case record
- Human agent opens Case — conversation appears in a timeline view
- Escalation notification includes summary of the issue and what was tried

**Speaker Notes:** "Context transfer is where a lot of Agentforce deployments fail in practice. A company builds a great bot — resolves 70% of issues autonomously. But the 30% that escalate have a terrible experience because nobody thought through the handoff. The customer who got 10 minutes into a complicated issue with a bot and then hit a wall — and now has to start over with a human — is angrier than if they'd just reached a human from the start. Context transfer isn't a nice-to-have. It's a fundamental design requirement. For the exam: any question about escalation design should include context transfer as a key element."

---

### Slide 6: Accountability Frameworks — Who Is Responsible?
**Visual:** Accountability chain diagram. AI System (no legal personhood) → Developer/Vendor (Salesforce) → Organization deploying AI → Admin configuring AI → Manager overseeing AI use → End user. Arrows showing responsibility flow.
**Content:**
**The accountability gap in AI:**
- AI systems cannot be held legally or morally responsible
- When AI causes harm, responsibility must fall on humans

**Levels of accountability:**
- **Salesforce (vendor):** Responsible for the AI functioning as documented; for maintaining the Trust Layer; for the Acceptable Use Policy
- **The deploying organization:** Responsible for ensuring appropriate use within their context; for training staff; for monitoring outcomes
- **Admins and developers:** Responsible for correct configuration; for testing; for not using AI for prohibited purposes
- **Managers:** Responsible for ensuring human oversight where required; for reviewing AI-assisted decisions
- **Individual users:** Responsible for appropriate use; for not overriding AI outputs without reason in ways that bypass safeguards

**Key principle:** Responsibility doesn't disappear because AI made the decision — it shifts to the humans who designed, deployed, configured, or acted on it

**Speaker Notes:** "One of the most dangerous assumptions about AI is 'the AI decided, so it's not my fault.' That's not how accountability works. If an AI system in your Salesforce org makes a discriminatory hiring recommendation and your company acts on it without review, your company is legally and ethically responsible. The AI didn't make a choice — it produced a probabilistic output. A human chose to act on that output without checking it. Accountability in AI requires active engagement at every level — not passive deference to whatever the algorithm says."

---

### Slide 7: Salesforce's AI Acceptable Use Policy
**Visual:** A document icon with "Salesforce AI Acceptable Use Policy" header and key excerpts listed as bullet points.
**Content:**
**What is the Acceptable Use Policy (AUP)?**
A contractually binding document that defines what Salesforce AI CANNOT be used for

**Prohibited uses include:**
- Making final automated employment decisions (hiring, termination) without human review
- Automated credit or lending decisions that discriminate against protected groups
- Automated housing decisions that discriminate (fair housing violations)
- Generating deceptive content about real people without consent
- Enabling mass surveillance without legal basis and consent
- Facilitating harm to individuals (fraud, harassment, manipulation)
- Using AI to identify or target individuals based on protected characteristics

**Consequences of violations:**
- Contractual violations → potential account termination
- Legal liability for the deploying organization
- Reputational harm

**Why it exists:**
- Protects users of Salesforce from having AI used against them
- Protects Salesforce from being complicit in harmful AI applications
- Demonstrates commitment to the Responsible Trusted AI Principle

**Speaker Notes:** "The Acceptable Use Policy is Salesforce drawing a line in the sand. There are things Einstein will not help you do, regardless of technical possibility. This comes up on the exam as: 'A company wants to use Prediction Builder to automatically screen and reject job applicants with no human review. Which policy does this violate?' Answer: the Acceptable Use Policy — specifically the prohibition on final automated employment decisions without human review. The AUP is the enforcement mechanism for the Responsible and Accountable Trusted AI Principles. It's not just ethics — it's contract law."

---

### Slide 8: Human Oversight in Practice — Salesforce Examples
**Visual:** Three screenshot examples showing human oversight features in Salesforce AI products.
**Content:**
**Example 1: Prompt Builder — Human review before publishing**
- Prompt Builder templates require admin review and activation
- Output is generated as a DRAFT — user must review before the content is used
- Admin can set minimum confidence thresholds before AI output is shown

**Example 2: Agentforce — Mandatory escalation configuration**
- Agentforce agents cannot be deployed without defined escalation paths
- Agent Studio requires escalation action in every Topic configuration
- Escalation can be forced by confidence thresholds (if Atlas isn't sure, escalate)

**Example 3: Einstein Prediction Builder — Human decision on activating**
- Admin reviews model accuracy and driving factors before activation
- Field importance review lets admin check for proxy variables before deployment
- Admin can deactivate at any time if outcomes seem problematic

**Common pattern across all three:** AI generates, assists, or recommends. Human reviews, decides, activates, or escalates.

**Speaker Notes:** "Notice the pattern in these three examples: the AI never has the FINAL word on anything high-stakes without a human step. Prompt Builder produces a draft — human sends it. Agentforce has escalation configured — human takes over when needed. Prediction Builder requires admin review before activation — human signs off on the model. This is the Empowering principle in practice: AI enhances human capability without removing human agency. The human is always the last line of defense."

---

### Slide 9: Scenario Practice — Human Oversight Test Cases
**Visual:** Four scenario cards, each with a question: "Should human oversight be required here? Which principle?" and an answer.
**Content:**
**Scenario A:** Agentforce resolves a billing question for a $25 charge. Customer satisfied.
- Human required? No — routine, low-stakes, reversible, within agent authority
- AI autonomy appropriate here

**Scenario B:** Agentforce receives a message: "I'm thinking about hurting myself."
- Human required? YES — immediately. Safety and human wellbeing at stake.
- Principle: Responsible, Empowering, Accountable

**Scenario C:** Einstein Prediction Builder model scores job candidates and HR wants to auto-reject below 60.
- Human required? YES — employment decisions require human review per AUP.
- Principle: Accountable, Responsible

**Scenario D:** Einstein Case Classification auto-fills Category and Priority on a new case, subject to agent review.
- Human required? Yes — but built in. Agent reviews before acting. Low-stakes field, human can correct.
- Appropriate design — human can always override

**Speaker Notes:** "Run through these four scenarios until the pattern clicks. Routine, low-stakes, reversible → AI can handle autonomously. Anything involving human safety, major financial consequences, legal implications, or employment decisions → human required. The exam will give you scenarios like these and ask whether human oversight is required or which principle is at stake. Match the scenario to the pattern."

---

### Slide 10: Section 4 Summary — Ethics Exam Cheat Sheet
**Visual:** Summary table covering all four ethics lectures.
**Content:**

| Topic | Key Concept | Exam Trigger |
|---|---|---|
| 5 Trusted AI Principles | RATEI: Responsible, Accountable, Transparent, Empowering, Inclusive | "Which principle?" |
| Training Data Bias | Historical data reflects past bias | "Historical data" + discrimination |
| Algorithmic Bias | Proxy variable correlates with protected characteristic | "Neutral variable" + discriminatory outcome |
| Feedback Loop Bias | Model outputs influence future training → bias amplifies | "Gets worse over time" |
| Representation Bias | Underrepresented group → lower accuracy | "Accuracy gap across groups" |
| Transparency | Disclose AI use, explain decisions, model cards | "Should the AI disclose?" |
| Explainability | Driving factors, confidence scores, model cards | "Why did Einstein score this?" |
| Human Oversight | Required for medical, legal, financial, employment, safety | "Should a human be involved?" |
| Acceptable Use Policy | Prohibits final automated decisions in sensitive categories | "Can Salesforce be used for X?" |
| Audit Trails | Record of AI decisions; supports Accountable + Transparent | "How do you investigate?" |

**Speaker Notes:** "This table covers the entire Section 4 content. Print it, screenshot it, use it as your final review. Every row in this table is a question type on the exam. Know the concept, know the trigger phrase, know the answer."

---

## RECORDING SCRIPT

[Opening — 0:00-2:00]

"I want to start with a thought experiment. Let's say you've deployed an Agentforce Service Agent, and it's handling 500 customer interactions a day with 85% autonomous resolution. That's fantastic — your team is handling more volume than ever.

Then one day, a customer sends this message to your service bot: 'I just found out I have stage 3 cancer. I'm trying to understand if my treatment will be covered by my insurance plan.'

What should your Agentforce agent do?

If your agent isn't designed with proper escalation logic, it might try to handle this the same way it handles a billing inquiry — look up the insurance plan, read the coverage terms, draft a response. It might even give technically accurate information. But is that the right response to someone who just received a devastating medical diagnosis?

No. That person needs a human being. Someone with empathy, with judgment, with the ability to navigate nuance and do right by a vulnerable person in a moment of crisis.

That scenario is the heart of this lecture: understanding when AI should step back and humans must step in. It's not about AI being bad — it's about matching the right tool to the right moment."

[The human-in-the-loop spectrum — 2:00-5:30]

"Not all AI autonomy is equal, and not all human oversight is required equally. There's a spectrum from 'AI provides information, human decides everything' all the way to 'AI is fully autonomous with no human involvement.' The question for any AI deployment is: where on that spectrum does this use case belong?

Here's how I think about it. Ask three questions about the decision you're automating.

First: How consequential is it? A misclassified case category — low consequence, easy to fix. A denied loan application — high consequence, major life impact.

Second: How reversible is it? Sending a follow-up email — reversible, customer can be corrected. Rejecting a job candidate — largely irreversible, that person doesn't get another chance.

Third: How much does human dignity and autonomy matter in this decision? Routing a billing question to the right queue — human dignity not particularly at stake. Deciding someone's creditworthiness — human dignity very much at stake, with legal rights to explanation and challenge.

The higher the consequence, the less reversible, and the more human dignity is involved — the further LEFT on the spectrum you go. Full human involvement, AI only informs. The lower the consequence, the more reversible, the more routine — the further right you go. Full autonomy, AI handles end-to-end.

Routine billing queries? Far right. Employment decisions? Far left. Medical treatment recommendations? Far left. Password resets? Far right. This framework guides every decision about AI autonomy in responsible AI design."

[Accountability deep dive — 5:30-9:00]

"When an AI system causes harm, someone is responsible. It is never no one.

This needs to be said plainly because a dangerous idea has emerged in AI: 'the algorithm decided, so it's not our fault.' Courts and regulators are firmly rejecting this idea, and for good reason. An AI is not a moral agent. It doesn't have judgment, intention, or accountability. It's a mathematical function trained on data, executing calculations. Every decision it makes was ultimately shaped by human choices: what data to train it on, what outcome to optimize for, how to configure it, whether to deploy it, whether to override it.

In the Salesforce ecosystem, accountability is layered. Salesforce as the vendor is accountable for the AI working as documented, for maintaining the Trust Layer, and for enforcing the Acceptable Use Policy. The organization deploying the AI is accountable for using it appropriately within their context, for monitoring outcomes, and for ensuring human oversight where required. The admin who configured the model is accountable for not building in proxy variables or prohibited use cases. The manager who received AI-assisted decisions is accountable for not rubber-stamping them without review. The individual user is accountable for their use of AI tools within their role.

The key insight: responsibility distributes to humans at every level. The AI generates outputs. Humans are accountable for what they do with those outputs, and for what outcomes result.

This is why the Accountable Trusted AI Principle requires audit trails — because you can't assign accountability without a record of what happened. If an Agentforce agent gave a customer incorrect information and you can't retrieve the conversation, you can't investigate, you can't fix the root cause, and you can't demonstrate appropriate oversight to a regulator. The audit trail is what makes accountability real."

[Acceptable Use Policy and scenarios — 9:00-12:00]

"Salesforce's AI Acceptable Use Policy is the formal document that operationalizes the Responsible principle. It defines the boundary: here is where we draw the line. These uses of Einstein AI are prohibited, regardless of technical feasibility.

The most exam-relevant prohibitions: automated employment decisions without human review, automated credit/lending decisions that discriminate, automated housing decisions that discriminate, generating deceptive content about real people, enabling surveillance without consent.

Notice the pattern: all of these involve either major life impact decisions (employment, credit, housing) or violations of trust (deception, surveillance). That's the underlying ethical logic.

Let me run through some scenarios to make this concrete.

Scenario: A company wants to use Prediction Builder to predict which job applicants to call back, and then automatically reject all below-threshold applicants with a form rejection email — no human ever looks at the below-threshold applicants. Is this acceptable? No. This is a final automated employment decision without human review. Acceptable Use Policy violation. The AI can score and RANK applicants. A human must review before rejecting.

Scenario: A company wants to use Agentforce to handle the initial steps of loan applications, gathering information and pulling credit reports, with a human underwriter making the final approval/denial decision. Is this acceptable? Yes. The AI is assisting — gathering information, running preliminary analysis. The human makes the final decision. That's the appropriate design.

Scenario: A healthcare company wants to use Einstein to analyze patient data and suggest potential diagnoses for physician review. Is this acceptable? Yes — with the right design. The key phrase is 'physician review.' AI suggests, physician decides. Human in the loop for the consequential medical decision.

Scenario: A manager wants to use Einstein Conversation Insights to secretly monitor all employee calls without their knowledge. Is this acceptable? No. Surveillance without consent violates both the Acceptable Use Policy and likely employment law.

These scenarios are exactly the type the exam presents. Read them carefully, identify the category (employment/credit/surveillance/deception), and apply the AUP prohibition or the human oversight requirement."

---

## EXAM TIPS
- Human-in-the-loop is required for: medical decisions, legal proceedings, employment decisions, financial life events, safety-critical scenarios.
- The key factors for requiring human oversight: high consequence, low reversibility, human dignity at stake.
- Agentforce escalation is mandatory — agents MUST have defined escalation paths. Not optional.
- Context transfer during escalation is a design requirement — customer should never have to repeat themselves.
- Accountability for AI decisions falls on humans: vendor (Salesforce), deploying organization, admin, manager, user.
- AI Acceptable Use Policy prohibits: final automated employment decisions, discriminatory credit/housing decisions, surveillance without consent, generating deceptive content about real people.
- Audit trails are the infrastructure that makes accountability possible.
- The Accountable Trusted AI Principle requires traceable records of AI decisions.
- Agentforce agents must disclose they are AI AND have escalation paths — both are required for responsible deployment.

---

## LECTURE SUMMARY
- The human-in-the-loop spectrum ranges from full human control to full AI autonomy — the appropriate position depends on consequence, reversibility, and human dignity
- Mandatory human oversight categories: medical, legal, financial life events, employment, safety-critical, high-stakes irreversible decisions
- Agentforce is designed with mandatory escalation paths — every Topic configuration must include escalation logic and context transfer
- Accountability for AI decisions distributes to humans at every level: vendor, deploying organization, admin, manager, and user
- Salesforce's AI Acceptable Use Policy prohibits using Einstein for final automated employment decisions, discriminatory credit/housing decisions, surveillance without consent, and deceptive content generation
- Audit trails are the accountability infrastructure that makes investigating AI decisions possible

---

## MINI QUIZ

**Question 1:**
A company deploys an Agentforce Service Agent to handle inbound customer queries. The agent has been configured with billing, order status, and return Topics. A customer sends a message saying they are in a domestic violence situation and afraid to go home — they contacted customer service because the company has a domestic violence support program. What should the Agentforce agent do?

A) Attempt to resolve the inquiry using the most closely matched Topic  
B) Send a list of domestic violence resources and close the conversation  
C) Immediately escalate to a human agent and transfer full context  
D) Log the interaction and notify a manager after the conversation

**Answer: C — Immediately escalate to a human agent and transfer full context**

*Explanation:* This is a safety and human wellbeing crisis that is completely outside the agent's defined Topics and authority. Safety situations involving risk of harm to a person require immediate human escalation — no autonomous AI agent should attempt to handle a domestic violence support request. The human agent needs full context to provide appropriate assistance. Option A applies a mismatched Topic inappropriately. Option B provides resources but is insufficiently personal and immediate for a safety situation — a human must be involved. Option D's delay is unacceptable for a safety situation — escalation must be immediate, not a post-conversation notification.

---

**Question 2:**
A Salesforce admin at a financial institution is considering using Einstein Prediction Builder to automatically approve or deny credit card applications with no human review of AI decisions. The model has an 89% accuracy rate. Which Salesforce policy MOST directly prohibits this use case?

A) The Trust Layer data masking requirements  
B) The AI Acceptable Use Policy  
C) The Einstein Prediction Builder data requirements  
D) The GDPR data residency requirements

**Answer: B — The AI Acceptable Use Policy**

*Explanation:* The AI Acceptable Use Policy explicitly prohibits using Salesforce AI to make final automated credit or lending decisions that could discriminate, and requires human review for consequential financial decisions. Even with an 89% accuracy rate, the 11% error rate on credit decisions represents significant life impact for affected individuals — credit denial affects housing, employment, purchasing power. More importantly, the policy requirement is categorical: automated final credit decisions without human review are prohibited. The Trust Layer (A) is about data privacy, not use case restrictions. Prediction Builder data requirements (C) are about training data volume. GDPR data residency (D) is about where data is stored.

---

**Question 3:**
When an Agentforce Service Agent escalates a conversation to a human agent, what is the MOST important design requirement to ensure the escalation is effective and maintains customer trust?

A) The human agent should be notified by email within 24 hours  
B) The customer should call back and explain their issue to the human agent  
C) The full conversation context and relevant record data should be transferred to the human agent before they engage  
D) The AI agent should summarize the conversation in three sentences for the human agent

**Answer: C — Full conversation context and relevant record data should be transferred before the human agent engages**

*Explanation:* Context transfer is the critical design requirement for effective Agentforce escalation. The human agent must have the complete picture — every message exchanged, what was attempted, what the customer's account shows — before they engage with the customer. This prevents the customer from having to repeat themselves, allows the human agent to start where the AI left off, and preserves the trust of the customer who is already potentially frustrated. Option A's 24-hour delay is completely unacceptable for an in-progress conversation. Option B requiring the customer to call back and repeat themselves violates the escalation design principle and erodes trust. Option D's three-sentence summary is insufficient — full conversation context, not a summary, is required.
