# Lecture 15: Responsible AI Principles
**Section:** Section 4 — AI Ethics and Trust  
**Duration:** 18 minutes  
**Exam Weight:** ~12% of exam (Trusted AI Principles are ALWAYS tested — memorize all 5)

---

## Learning Objectives
1. Explain why AI ethics matter using real-world examples of AI failures
2. Name and define Salesforce's 5 Trusted AI Principles
3. Apply each principle to a concrete Salesforce product example
4. Articulate the difference between "can we build this?" and "should we build this?"
5. Recognize scenarios that violate specific Trusted AI Principles
6. Recall all 5 principles for exam purposes

---

## SLIDES

### Slide 1: Title Slide
**Visual:** A balanced scale — one side showing code/technology, the other showing a human silhouette. Text: "Responsible AI: The 'Should We?' Question."
**Content:**
- Why AI ethics aren't optional
- Salesforce's 5 Trusted AI Principles
- Real product examples for each
- This section is HIGH EXAM WEIGHT — know the principles by name

**Speaker Notes:** "Before we get into the Salesforce-specific content, I want to start with some real stories. Because AI ethics isn't abstract philosophy. It's about real consequences that happened to real people — and understanding those consequences is exactly what the exam tests."

---

### Slide 2: Why AI Ethics Matter — Amazon's Hiring Algorithm
**Visual:** A newspaper headline mockup: "Amazon Scraps Secret AI Recruiting Tool That Showed Bias Against Women." Below it: A pie chart showing gender imbalance in technical roles. Date: 2018.
**Content:**
**What happened:**
- Amazon built an AI tool to screen resumes for technical positions
- Trained on 10 years of historical hiring data
- Problem: 10 years of data reflected predominantly male engineering hires
- Result: The AI learned to PENALIZE resumes that contained the word "women's" (as in "women's chess club") and downgraded resumes from all-female colleges
- Amazon discovered the bias and shut the tool down in 2018

**Key lesson:** An AI system trained on biased historical data will replicate and amplify that bias — and it does so invisibly and at scale

**Speaker Notes:** "This story hits different when you understand the mechanics. Amazon's engineers didn't program the AI to discriminate against women. They just fed it historical data. The historical data reflected a hiring culture that had favored men for years. The AI found the pattern and encoded it. It wasn't malicious. It was mathematical. And that's what makes AI bias so insidious — it can emerge from seemingly neutral decisions about data, without anyone intending harm. And once it's deployed at scale, it's not one biased hiring manager making one decision — it's a system making biased decisions on EVERY resume, INSTANTLY, at scale."

---

### Slide 3: Why AI Ethics Matter — Facial Recognition
**Visual:** Split image — left: a facial recognition interface with overlaid ID markers. Right: News headlines about wrongful arrests due to facial recognition misidentification, including names and dates.
**Content:**
**What happened:**
- Facial recognition systems deployed by law enforcement to identify suspects
- Studies found error rates for darker-skinned faces 10-100x higher than for lighter-skinned faces (MIT Media Lab, 2019)
- Result: Multiple documented cases of wrongful arrests based on facial recognition misidentification
- In one case: A man was arrested and held for 30 hours before police realized the AI was wrong

**Root cause:** Training data for facial recognition was predominantly white, male faces — other demographic groups were underrepresented

**Key lesson:** When an AI system has worse accuracy for certain demographic groups, the consequences are not distributed equally — marginalized groups bear the highest cost of AI errors

**Speaker Notes:** "When an AI system makes a mistake about which movie to recommend to you, you watch a bad movie. When an AI system makes a mistake about your identity in a law enforcement context, you get wrongfully arrested. The stakes of AI failures are not uniform. The consequences land hardest on people who are already disadvantaged by systemic inequities. That asymmetry — that the populations most harmed by AI bias are often those least able to challenge it — is the moral core of why AI ethics matter. And it's why companies like Salesforce have made explicit commitments to responsible AI. Not as PR. As policy."

---

### Slide 4: The "Can We?" vs. "Should We?" Question
**Visual:** Two-panel thought experiment. Left panel: "Can we build a facial expression analyzer that detects employee emotions during Zoom calls and alerts managers to disengagement?" (answer: technically yes). Right panel: "Should we?" (answer: privacy invasion, surveillance concerns, inaccuracy, discrimination risk — no).
**Content:**
**The central ethical question in AI:**

"Can we build this?" is a technology question.  
"Should we build this?" is an ethics question.

The fact that something is technically possible does not mean it should be built.

**Salesforce's framework:** Before deploying any AI feature, ask:
- Who could be harmed by this AI if it's wrong?
- Who could be harmed by this AI even if it's right?
- Are humans meaningfully in control of high-stakes decisions?
- Are the people affected able to understand and challenge the AI's decisions?
- Are we being transparent about what this AI does?

**Speaker Notes:** "This is the conceptual foundation of everything in Section 4. When Jeff Goldblum in Jurassic Park says 'your scientists were so preoccupied with whether they could, they didn't stop to think if they should' — that's the AI ethics question in a nutshell. In the early days of ML, teams moved fast to build impressive things. The ethical analysis happened later — or not at all. The companies that got burned, like Amazon, learned this the hard way. Salesforce's Trusted AI Principles are their attempt to build the 'should we?' question into the development process from the start."

---

### Slide 5: Salesforce's 5 Trusted AI Principles — Overview
**Visual:** A pentagon diagram with each principle at one point, and "Trusted AI" in the center. Colors: each principle has a distinct color — Responsible (red), Accountable (orange), Transparent (yellow), Empowering (green), Inclusive (blue).
**Content:**
**Salesforce's 5 Trusted AI Principles:**

1. **Responsible** — AI should be safe and beneficial for all
2. **Accountable** — AI should have human oversight and clear accountability
3. **Transparent** — AI should be explainable and open about limitations
4. **Empowering** — AI should enhance human capability, not replace human agency
5. **Inclusive** — AI should be fair, equitable, and accessible to all

**Exam tip:** These are explicitly named on the exam. You must know all 5 by name AND know what each one means.

**Speaker Notes:** "Five principles. Say them out loud: Responsible, Accountable, Transparent, Empowering, Inclusive. One mnemonic students use: RATEI. Responsible, Accountable, Transparent, Empowering, Inclusive. Or make your own. These five words will appear on your exam. Not just as a list — as scenarios where you have to identify WHICH principle is being upheld or violated. Let's go through each one with a concrete Salesforce product example."

---

### Slide 6: Principle 1 — Responsible
**Visual:** Shield icon. A scenario: An AI predicts medical diagnoses. Next to it: An ethical review board reviewing the model before deployment. Caption: "Safety must precede deployment."
**Content:**
**Responsible AI means:**
- AI systems should be safe, beneficial, and avoid causing harm
- Consider potential negative consequences BEFORE deployment, not after
- Apply greater scrutiny to higher-stakes use cases

**In Salesforce products:**
- Salesforce's AI Red Team proactively tests Einstein features for harmful outputs before release
- Agentforce agents are required to have human escalation paths — cannot be deployed without defined escalation for high-stakes scenarios
- Salesforce maintains an AI Acceptable Use Policy — certain applications of Einstein are prohibited (e.g., using AI to discriminate in employment or lending)

**Violation example:** Deploying an Einstein scoring model without evaluating whether it produces discriminatory scores across demographic groups

**Speaker Notes:** "Responsible is the baseline principle — before you do anything else, does this AI cause harm? This is the 'first do no harm' of AI ethics. Notice that it's proactive, not reactive. The principle isn't 'fix it when it causes harm.' It's 'evaluate potential harm before it's deployed.' In practice, Salesforce builds this into their development process through internal red-teaming — teams that try to break the AI, find edge cases, and surface harmful outputs before users ever see them. For your exam, Responsible = safety, harm prevention, and proactive risk assessment."

---

### Slide 7: Principle 2 — Accountable
**Visual:** An organizational chart showing an AI system with a clear ownership chain — AI output → human review → human decision maker → accountability path.
**Content:**
**Accountable AI means:**
- Clear human ownership of AI systems and their outputs
- Audit trails documenting AI decisions
- When AI causes harm, there is a clear responsible party
- Humans — not AI — are ultimately responsible for consequential decisions

**In Salesforce products:**
- Every Prompt Builder generation is logged in the audit trail (who triggered it, what was generated, when)
- Agentforce actions are logged — what the agent did, what decisions it made, what it said to customers
- Salesforce provides mechanisms for admins to review and audit AI activity
- AI Acceptable Use Policy defines who is responsible for ensuring appropriate use (the organization deploying it)

**Violation example:** Deploying an Agentforce agent with no logging, so that if the agent gives a customer wrong information, there is no record of what was said or who is responsible

**Speaker Notes:** "Accountable is about answering the question: when something goes wrong, who is responsible? AI doesn't have legal personhood. It can't be sued, fired, or prosecuted. So when an AI system harms someone, the question of accountability falls to the humans who built it, deployed it, and configured it. Salesforce's position: the company deploying an AI system is accountable for how it behaves. That's why audit logging is a core feature of Agentforce and Prompt Builder — it creates the paper trail that makes accountability possible. For your exam: Accountable = audit trails, human oversight, clear responsibility chains."

---

### Slide 8: Principle 3 — Transparent
**Visual:** A "black box" with a question mark vs. an "open box" showing gears, inputs, and outputs labeled. Caption: "Users should be able to understand why an AI made a decision."
**Content:**
**Transparent AI means:**
- Users know when they're interacting with AI vs. a human
- AI decisions come with explainable reasoning
- AI systems are open about their limitations and confidence levels
- Organizations disclose that AI is being used in processes that affect people

**In Salesforce products:**
- Einstein prediction scores include driving factors (why is this lead scored high?)
- Agentforce agents are required to disclose they are AI — cannot pretend to be human
- Prompt Builder logs which template generated which content and when
- Einstein case classification shows confidence levels alongside its recommendations

**Violation example:** Deploying an Agentforce Service Agent that introduces itself as "Hi, I'm Alex, your support specialist" without disclosing that Alex is an AI

**Speaker Notes:** "Transparency has a specific sub-principle that comes up a lot on the exam: AI systems must disclose that they are AI when interacting with humans. You cannot deploy an Agentforce agent that pretends to be a human. This is both an ethical requirement and increasingly a legal one — the FTC in the US and various EU regulations are moving toward mandating AI disclosure in customer interactions. Salesforce bakes this into Agentforce — the system prompt for Agentforce agents includes a disclosure requirement. For your exam: Transparent = explainability, AI disclosure, open limitations."

---

### Slide 9: Principle 4 — Empowering
**Visual:** A human and an AI side-by-side, working together. The human holds a decision card; the AI holds a data/analysis card. Caption: "AI amplifies human capability. Humans retain meaningful choice."
**Content:**
**Empowering AI means:**
- AI should enhance human capabilities, not replace human agency
- AI should give humans MORE ability to make informed decisions
- Humans should retain meaningful control in high-stakes situations
- AI should not be deployed in ways that remove human choice

**In Salesforce products:**
- Einstein Prediction scores give reps MORE information to make better decisions — the rep still decides what to do
- Prompt Builder generates email DRAFTS — the human reviews and sends
- Next Best Action surfaces recommendations — humans accept or decline
- Agentforce escalation design: agents defer to humans for sensitive or high-stakes decisions

**Violation example:** An employer forces employees to follow all AI recommendations with no ability to override, effectively removing human judgment from the process

**Speaker Notes:** "Empowering is sometimes misread as 'AI should be powerful.' That's not it. Empowering means AI should empower HUMANS. The key word is agency — does the human still have meaningful control? A GPS is empowering — it gives you information, you still decide where to go. A car that physically locks the steering wheel and forces you to follow the GPS is NOT empowering — it removed your agency. The distinction is subtle but critical. AI tools that provide information, recommendations, or drafts while leaving the final decision to the human are empowering. AI systems that make consequential decisions for humans without recourse are not. For your exam: Empowering = human agency preserved, AI as an enhancer not a replacer."

---

### Slide 10: Principle 5 — Inclusive
**Visual:** A grid of diverse faces — different ages, ethnicities, abilities, genders — with an AI accuracy meter showing equal performance across all groups. Caption: "AI should work equally well for everyone."
**Content:**
**Inclusive AI means:**
- AI systems should be fair and equitable across demographic groups
- AI should not perpetuate or amplify historical inequities
- AI development should include diverse perspectives
- People affected by AI should have means to contest AI-driven decisions

**In Salesforce products:**
- Salesforce evaluates Einstein models across demographic segments before release
- Agentforce can be configured to handle multiple languages and regional variants
- Einstein's AI development teams include diversity metrics for team composition
- Salesforce's Office of Ethical and Humane Use reviews AI features for fairness

**Violation example:** An Einstein Lead Scoring model that produces lower scores for leads from certain zip codes (historically lower-income areas) — not because those leads are less likely to convert, but because of historical underinvestment in those areas

**Speaker Notes:** "Inclusive is where ethics gets most concrete and measurable. A model can be statistically accurate overall but still produce discriminatory results for specific groups. If your churn prediction model is 85% accurate overall but only 55% accurate for customers over 65, that's not inclusive — that group is being poorly served by a tool that claims to help them. Salesforce's approach: test AI features explicitly across demographic segments, not just on aggregate metrics. If the model works differently for different groups, investigate why and fix it before deployment. For your exam: Inclusive = fairness across groups, equal accuracy, diversity in development."

---

### Slide 11: The 5 Principles in Practice — Quick Reference Table
**Visual:** Clean five-row table with principle name, one-sentence definition, and a real example.
**Content:**

| Principle | Core Meaning | Real Example |
|---|---|---|
| Responsible | Safe and beneficial — avoid harm | Proactive testing before deployment; AI Acceptable Use Policy |
| Accountable | Clear human ownership and audit trails | Agentforce action logs; prompt generation audit trail |
| Transparent | Explainable, disclose AI use, show limitations | Disclose AI agent identity; show prediction driving factors |
| Empowering | Enhance humans, preserve human agency | Email drafts humans review; rep decides on recommendations |
| Inclusive | Fair across all demographic groups | Evaluate model accuracy across demographic segments |

**Exam mnemonic: RATEI** (Responsible, Accountable, Transparent, Empowering, Inclusive)

**Speaker Notes:** "Here's your reference table. The exam will give you a scenario and ask which principle is being demonstrated or violated. Read the scenario. Identify the key concept: Is it about preventing harm? Responsible. About who is responsible when something goes wrong? Accountable. About explaining or disclosing the AI? Transparent. About whether humans retain control? Empowering. About fairness across groups? Inclusive."

---

### Slide 12: Salesforce's Institutional Commitments
**Visual:** Salesforce organizational structure showing: Office of Ethical and Humane Use → AI Acceptable Use Policy → Public commitments. Icons representing each.
**Content:**
**Salesforce's structural commitments:**

**Office of Ethical and Humane Use:**
- Dedicated team that reviews AI products against ethical standards
- Reviews customer requests that seem to push ethical boundaries
- Maintains and updates the AI Acceptable Use Policy

**AI Acceptable Use Policy:**
- Defines what Salesforce's AI CANNOT be used for
- Prohibited: Using AI to discriminate in housing, lending, employment
- Prohibited: Generating deceptive content about real people
- Prohibited: Facilitating surveillance without consent

**Model cards:**
- Documentation for AI models describing training data, intended use, limitations, known biases
- Allows users to make informed decisions about when to trust AI outputs

**Speaker Notes:** "Salesforce doesn't just have principles on a slide. They have institutional infrastructure to enforce them. The Office of Ethical and Humane Use is a real team with real authority — they have actually blocked features from shipping because of ethical concerns. The Acceptable Use Policy is a binding commitment in Salesforce's terms of service. Model cards are documentation artifacts that ship WITH AI features, telling users exactly what the model was trained on and what it shouldn't be used for. These structures demonstrate that responsible AI isn't just marketing — it's built into the company's governance. The exam might reference the Office of Ethical and Humane Use by name."

---

## RECORDING SCRIPT

[Opening — 0:00-2:30]

"I want to start this lecture with a question. Not a Salesforce question — just a human question. Have you ever had an experience where a system made a decision about you that felt wrong, and you had no way to challenge it?

Maybe an algorithm decided you were a credit risk. Maybe a hiring system filtered out your resume before a human ever saw it. Maybe facial recognition software at an airport flagged you incorrectly. 

These aren't hypothetical scenarios. They've happened to millions of people. And in almost every case, the systems that made these decisions were built with good intentions. No one sat down and said 'let's build software that discriminates.' They sat down and said 'let's build software that's more efficient, more consistent, more scalable than human decision-making.'

The problem is that those systems learned from historical data — data that reflected historical human biases. And when you encode historical bias into a mathematical model and run it at scale, you get efficient, consistent, scalable discrimination.

That is why AI ethics matter. Not as abstract philosophy. Not as feel-good corporate values. As a practical safeguard against real harm at real scale. Let's talk about how Salesforce has chosen to address this."

[Stories of AI failures — 2:30-5:00]

"Let me tell you two stories that are now taught in every AI ethics course in the world.

Story one: Amazon's hiring algorithm. Starting around 2014, Amazon built an AI tool to automate the first pass of resume screening for engineering roles. They trained it on 10 years of historical hiring decisions — resumes that had been accepted and rejected by human reviewers over the previous decade.

The problem: Amazon's technical workforce had been predominantly male for those 10 years. So the AI learned that 'male indicators' correlated with good hires. It started actively penalizing resumes that mentioned the word 'women's' — as in 'women's chess club' or 'women's engineering society.' It downgraded resumes from all-women's colleges. Amazon discovered this in 2018 and shut the tool down.

Nobody programmed the AI to discriminate. The discrimination was learned from the data. And that's the lesson: AI systems don't inherit your good intentions. They inherit your data's patterns.

Story two: facial recognition in law enforcement. Studies by the MIT Media Lab in 2019 found that commercial facial recognition systems had dramatically higher error rates for darker-skinned individuals compared to lighter-skinned individuals — in some cases, 10 to 100 times higher. This isn't a minor accuracy gap. When those systems were used to identify criminal suspects, the errors led to wrongful arrests. Real people — specifically Black men, based on the documented cases — were detained for crimes they didn't commit because an AI was wrong about who it was looking at.

The root cause: training datasets for facial recognition were predominantly images of white, male faces. The models never adequately learned to recognize faces that looked different from the majority of their training data.

These two stories together explain why every AI company — including Salesforce — has had to grapple with a question their engineering teams weren't originally asking: not just 'does this work?' but 'does this work fairly for everyone? And who gets hurt when it doesn't?'"

[The 5 principles — 5:00-14:00]

"Salesforce responded to these industry-wide failures with five principles they call their Trusted AI Principles. These are real, documented commitments that shape how Salesforce builds and evaluates AI features. And they are absolutely on your exam.

Principle one: Responsible. AI should be safe and beneficial. Before you ship something, ask: could this cause harm? To who? Under what circumstances? This is the 'first do no harm' principle. In practice, Salesforce has an internal Red Team that adversarially tests AI features before release — actively trying to make the AI misbehave, produce harmful outputs, or be misused. If the Red Team finds something concerning, it gets fixed before customers ever see it.

Principle two: Accountable. There must be clear human ownership of AI systems and their decisions. When something goes wrong — and AI systems do make mistakes — there must be a person or organization responsible. This is why Salesforce built audit logging into Agentforce and Prompt Builder. Every AI interaction is recorded. If an Agentforce agent tells a customer something incorrect, you can go back to the audit log, see exactly what the agent said, understand why it said it, and fix the issue. Accountability requires traceable records.

Principle three: Transparent. Users should know when they're dealing with AI, should understand why the AI made a decision, and should be aware of the AI's limitations. This has several practical implications. One: Agentforce agents must disclose they are AI — they cannot impersonate humans. Two: Einstein prediction scores include driving factors — not just a number, but an explanation. Three: Salesforce publishes Model Cards for its AI features, documenting what data was used to train the model and what use cases it's appropriate for. Transparency is about making the AI's behavior legible to the humans affected by it.

Principle four: Empowering. AI should give humans MORE capability, not take capability AWAY. The key question is: do humans retain meaningful agency? An AI tool that drafts emails for a rep to review and edit is empowering — the rep has more time and better first drafts. An AI system that makes hiring decisions with no human review is not empowering — it replaced human judgment with algorithmic judgment, without consent or recourse. Every Salesforce AI feature is designed to keep humans in the loop at the decision-making step for consequential choices.

Principle five: Inclusive. AI should work fairly across demographic groups. It should not produce better outcomes for some groups and worse for others. And its development should involve diverse perspectives. This is the principle most directly tied to the bias stories we opened with. Salesforce evaluates Einstein models across demographic segments. If accuracy is unequal across groups, that's a signal to investigate the training data and fix the model before shipping."

[Institutional commitments — 14:00-17:00]

"Principles are only as good as the institutions that enforce them. So how does Salesforce actually operationalize these five principles?

Three main mechanisms. The Office of Ethical and Humane Use: a dedicated team inside Salesforce whose job is to evaluate AI features against the Trusted AI Principles and flag problems. This team has actual authority — they have stopped features from shipping.

The AI Acceptable Use Policy: a binding document that defines what Salesforce's AI cannot be used for. Not 'we don't recommend this' — CANNOT. Using Einstein AI to discriminate in hiring, lending, or housing is a policy violation with contractual consequences. Using AI to create deceptive content about real people is prohibited. Using AI to enable surveillance without consent is prohibited.

Model cards: documentation artifacts that ship with each AI feature. Think of a model card as a product label for an AI model. Ingredients: what data was it trained on? Intended use: what is it good for? Limitations: where does it fail or underperform? Known issues: what biases or inaccuracies have been identified? A model card gives every admin and developer the information they need to make informed decisions about whether and how to deploy an AI feature.

Together, these three mechanisms turn the five principles from values on a slide into enforceable policies with institutional accountability. That's the gap between 'having principles' and 'doing ethics.'"

[Closing — 17:00-18:00]

"Here's what I want you to leave this lecture with. Ethics in AI is not a constraint that slows down innovation. It's a design requirement that makes innovation safe to deploy at scale. The companies that ignored AI ethics early — and there are many — are now dealing with lawsuits, regulatory action, reputational damage, and products they can't trust.

Salesforce's bet is that building ethics in from the start is both the right thing to do AND the sustainable business strategy. The exam tests whether you understand these principles because any Salesforce professional deploying AI needs to be able to evaluate their implementations against them.

Five principles: Responsible, Accountable, Transparent, Empowering, Inclusive. Know them by name, know what each means, know a product example for each. That's the exam in this section."

---

## EXAM TIPS
- All 5 Trusted AI Principles are tested by name: Responsible, Accountable, Transparent, Empowering, Inclusive. Memorize them.
- Mnemonic: RATEI — Responsible, Accountable, Transparent, Empowering, Inclusive.
- Exam format: a scenario describes AI behavior → identify which principle is demonstrated OR violated.
- Responsible = harm prevention, safety review, ethical use policy.
- Accountable = audit logs, human ownership, who's responsible when AI fails.
- Transparent = disclose AI identity, show driving factors, limitations disclosure.
- Empowering = human agency preserved, AI enhances (not replaces) human decisions.
- Inclusive = equal performance across groups, fairness, anti-discrimination.
- The Office of Ethical and Humane Use is a real Salesforce org that enforces these principles.
- AI Acceptable Use Policy explicitly prohibits using Salesforce AI for discrimination in employment, housing, or lending.

---

## LECTURE SUMMARY
- AI ethics matter because AI systems can replicate and amplify human biases at scale — Amazon hiring algorithm and facial recognition are canonical examples
- Salesforce's 5 Trusted AI Principles: Responsible (prevent harm), Accountable (clear ownership + audit trails), Transparent (explain AI, disclose AI identity), Empowering (preserve human agency), Inclusive (fair across groups)
- The "can we?" question is technology. The "should we?" question is ethics.
- Salesforce enforces these principles through the Office of Ethical and Humane Use, the AI Acceptable Use Policy, and Model Cards
- Exam expects you to match principles to scenarios — know what each principle means in practice

---

## MINI QUIZ

**Question 1:**
An Agentforce Service Agent has been resolving customer inquiries for 3 months. A customer complains that the agent gave incorrect information about the return policy. The company's legal team asks for a record of exactly what the agent communicated to the customer. Which Trusted AI Principle does the existence of this audit log most directly support?

A) Responsible  
B) Accountable  
C) Transparent  
D) Inclusive

**Answer: B — Accountable**

*Explanation:* Accountable AI requires clear human ownership of AI systems and their outputs, including audit trails documenting AI decisions and interactions. The audit log of what the agent communicated enables the company to investigate the error, understand what went wrong, and identify who is responsible for the fix. This is the core of the Accountable principle. Responsible (harm prevention) is about preventing the error before it happens. Transparent is about explaining the reasoning to the users affected. Inclusive is about fairness across demographic groups. The audit trail for accountability investigation = Accountable principle.

---

**Question 2:**
A company deploys an Agentforce customer service agent. When customers ask if they're talking to a human or a bot, the agent is configured to respond: "I'm Alex, a real support specialist. How can I help?" Which Trusted AI Principle does this VIOLATE?

A) Responsible  
B) Accountable  
C) Transparent  
D) Empowering

**Answer: C — Transparent**

*Explanation:* Transparent AI requires that users know when they are interacting with AI. Configuring an AI agent to claim to be a human when directly asked is a direct violation of the Transparent principle. Salesforce's guidelines for Agentforce require AI agents to disclose their AI nature when asked. Responsible is about harm prevention. Accountable is about audit trails and ownership. Empowering is about preserving human agency. Deceiving users about whether they're talking to AI violates the fundamental transparency requirement that users know what they're dealing with.

---

**Question 3:**
Salesforce's Trusted AI Principle of "Empowering" is BEST demonstrated by which product behavior?

A) Einstein generates case summaries but an agent reviews and acts on them  
B) Agentforce autonomously resolves all customer issues without human review  
C) Einstein Prediction Builder requires admin configuration before use  
D) The Trust Layer masks PII before sending data to external LLMs

**Answer: A — Einstein generates case summaries but an agent reviews and acts on them**

*Explanation:* Empowering AI enhances human capabilities while preserving human agency — AI provides assistance, humans make the final decisions. Option A perfectly demonstrates this: Einstein provides the summary (enhancing capability), but the human agent reads it and decides what action to take (preserving agency). Option B describes autonomous action without human involvement — this is the OPPOSITE of Empowering (it removes human decision-making). Option C describes a configuration requirement, not empowerment. Option D describes the Trust Layer/privacy principle, not Empowering. The essence of Empowering: AI as assistant, human as decision-maker.
