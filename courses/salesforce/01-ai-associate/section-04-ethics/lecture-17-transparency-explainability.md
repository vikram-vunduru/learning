# Lecture 17: Transparency and Explainability in AI
**Section:** Section 4 — AI Ethics and Trust  
**Duration:** 12 minutes  
**Exam Weight:** ~7% of exam (tested as part of Trusted AI Principles and Einstein-specific explainability features)

---

## Learning Objectives
1. Define AI transparency and explain why it matters for trust
2. Contrast black box AI with explainable AI
3. Describe what model cards are and what they document
4. Explain how Einstein specifically provides explainability (prediction driving factors, confidence scores)
5. Explain how audit trails in Salesforce support AI transparency
6. Identify relevant regulatory context: GDPR and EU AI Act requirements

---

## SLIDES

### Slide 1: Title Slide
**Visual:**
```
   BLACK BOX vs. TRANSPARENT AI

   ┌────────────────────────────┬────────────────────────────┐
   │      BLACK BOX AI          │     TRANSPARENT AI         │
   ├────────────────────────────┼────────────────────────────┤
   │  Input → [???] → Output    │  Input → [Visible Logic]   │
   │                            │         → Explained Output │
   │  "Lead score: 23"          │  "Lead score: 23 because:  │
   │  Why? Unknown.             │   - Small company (-15pts) │
   │                            │   - No decision maker (-8) │
   │                            │   - Low web engagement (-4)│
   │                            │   Contributing factors     │
   │                            │   shown"                   │
   │                            │                            │
   │ Trust: Low (can't verify)  │ Trust: High (verifiable)  │
   │ Accountability: Hard       │ Accountability: Possible   │
   │ Bias detection: Impossible │ Bias detection: Feasible   │
   └────────────────────────────┴────────────────────────────┘
```
**Content:**
- Transparency: The "why" behind AI decisions
- Black box vs. explainable AI
- Einstein's explainability features
- Regulatory requirements driving transparency

**Speaker Notes:** "Here's a question I want you to think about: would you be comfortable with a doctor prescribing you medication based on an AI recommendation — if neither you nor your doctor knew why the AI made that recommendation? Most people say no. That discomfort is the intuition behind AI transparency. We instinctively feel that decisions that affect us should come with reasons. This lecture is about how Salesforce builds that 'why' into Einstein AI."

---

### Slide 2: What Is AI Transparency?
**Visual:**
```
   THREE DIMENSIONS OF AI TRANSPARENCY

              ┌─────────────────────────────┐
              │                             │
   ┌──────────┤   ALGORITHMIC               ├──────────┐
   │          │   TRANSPARENCY              │          │
   │ DATA     │                             │ DECISION │
   │ TRANS.   │  How the model works:       │ TRANS.   │
   │          │  ● Model type disclosed     │          │
   │ Sources  │  ● Key features listed      │ Explain  │
   │ disclosed│  ● Confidence scores shown  │ each     │
   │          │  ● Limitations documented   │ specific │
   │ Training │                             │ decision │
   │ data     │                             │ made     │
   │ described│                             │          │
   └──────────┤                             ├──────────┘
              │                             │
              └─────────────────────────────┘
```
**Content:**
**AI Transparency has three dimensions:**

**1. Decision Transparency**
- Stakeholders can see WHAT the AI decided or recommended
- Example: "This lead is scored 73%"
- Most basic level — shows the output

**2. Process Transparency**
- Stakeholders can understand HOW the AI reached that decision
- Example: "Scored 73% because of high company revenue, matching job title, and recent web activity"
- This is explainability — the reasoning behind the output

**3. Purpose Transparency**
- Stakeholders know WHY an AI system was deployed and what it was designed to do
- Example: "Einstein Lead Scoring is designed to prioritize leads by conversion likelihood based on historical patterns from YOUR org"
- Includes disclosure that AI is being used at all

**Speaker Notes:** "These three levels of transparency are like the three levels of understanding a court verdict. Decision transparency: the jury said 'guilty.' Process transparency: the jury based this on evidence A, B, and C; here's their reasoning. Purpose transparency: here's what the legal system is designed to do, how juries are instructed, and why this process exists. Each level adds a layer of understanding — and a layer of accountability. AI systems that are only decision-transparent give you the verdict but not the reasoning. That's not good enough for high-stakes decisions."

---

### Slide 3: Black Box AI — The Problem
**Visual:**
```
   THE BLACK BOX PROBLEM IN DEEP LEARNING

   Input Features              Neural Network            Output
   ┌─────────────┐            ┌───────────────┐         ┌──────┐
   │ Age: 34     │            │               │         │      │
   │ Income: $8M │            │  ●──●──●──●   │         │ DENY │
   │ ZIP: 94102  │──────────▶ │  ●──●──●──●   │────────▶│ LOAN │
   │ Job: Tech   │            │  ●──●──●──●   │         │      │
   │ History...  │            │  (768 neurons │         │      │
   └─────────────┘            │   12 layers)  │         └──────┘
                              └───────────────┘
                                     ↑
                               WHY? UNKNOWN
                               No human-readable
                               explanation of which
                               inputs drove the denial

   Problem: Person denied loan cannot understand or challenge
   the decision. Regulators cannot audit for fairness.
```
**Content:**
**Black box AI:**
- The model makes decisions that humans cannot interpret or explain
- Most powerful deep learning models are black boxes
- Input goes in, output comes out — the internal logic is too complex to explain in human terms

**Why black box AI is a problem:**
- Users can't evaluate whether a decision was fair
- Errors are impossible to diagnose and fix at their source
- Discriminatory patterns can hide inside uninterpretable models
- Regulatory compliance may require explanation (GDPR, EU AI Act)
- User trust is undermined when people don't know why an AI decided something

**Real example:** Some AI medical diagnosis tools can identify cancer in imaging more accurately than radiologists — but no one can explain exactly WHAT the model is looking for. Would you use a cancer diagnosis you couldn't understand or verify?

**Speaker Notes:** "The medical imaging example is real. Deep learning AI can look at an X-ray and identify cancer with superhuman accuracy. But when you ask the AI 'why do you think this is cancer?' it cannot give an intelligible answer. It identified statistical patterns in millions of training images that don't map to human-understandable features. That's the black box problem: the accuracy is real, but the reasoning is inaccessible. For low-stakes recommendations, that might be acceptable. For decisions about someone's health, their credit, their freedom, or their employment — inaccessible reasoning is unacceptable. This is why the field of Explainable AI (XAI) exists."

---

### Slide 4: Explainable AI — The Solution
**Visual:**
```
   EXPLAINABLE AI (XAI) — Making Decisions Interpretable

   Prediction: Lead Score = 23 (Low Priority)

   CONTRIBUTING FACTORS (SHAP / Feature Importance):

   Annual Revenue < $1M     ████████████████████  -18 pts  (hurts)
   No Decision Maker        ████████████          -12 pts  (hurts)
   Low Web Engagement       ████████              -8 pts   (hurts)
   Industry: Retail         ████                  -4 pts   (hurts)
   Recent Email Open        ██                    +6 pts   (helps)
   Company size match       ██                    +5 pts   (helps)
   ─────────────────────────────────────────────────────────────
   Net: 23 / 100

   ✓ Rep can see why the score is low
   ✓ Rep can decide whether factors are accurate
   ✓ Bias auditor can check if factors are appropriate
```
**Content:**
**Explainable AI (XAI):**
- AI systems designed to provide human-understandable reasons for their decisions
- Trade-off: some model types are inherently more explainable but potentially less accurate
- Goal: maximum accuracy with sufficient explainability for the use case

**Techniques for explainability:**
- Feature importance scores: which input variables most influenced the output?
- Confidence scores: how certain is the model about this prediction?
- Counterfactual explanations: "If X had been different, the output would have been Y"
- LIME/SHAP (technical): mathematical techniques that approximate local explanations for complex models

**In Salesforce Einstein:**
- Prediction driving factors on every scored record
- Confidence levels alongside classifications
- Einstein Conversation Insights explaining call transcript analysis results

**Speaker Notes:** "Feature importance — which inputs most influenced the output — is the most intuitive form of explainability and the one Einstein uses. When you see a lead score of 84% with the driving factors showing 'Job Title: VP+' and 'Company Revenue: >$50M' as the top positive factors, you're seeing feature importance in action. Einstein has analyzed its model and identified: these are the variables that pushed this score UP. These are the ones that pulled it DOWN. A rep can look at that and immediately understand why the score is what it is — and more importantly, whether it makes sense given what they know about the lead."

---

### Slide 5: Model Cards — Documentation for AI Transparency
**Visual:**
```
   MODEL CARD — AI Transparency Document

   ┌─────────────────────────────────────────────────────────────┐
   │  MODEL: Einstein Lead Scoring — Acme Corp                   │
   ├─────────────────────────────────────────────────────────────┤
   │  INTENDED USE: Score B2B leads for sales prioritization     │
   │  MODEL TYPE: Gradient Boosting Classifier                   │
   │  TRAINING DATA: 18 months of Acme lead conversion history   │
   │  TRAINING SIZE: 4,200 converted/non-converted leads         │
   ├─────────────────────────────────────────────────────────────┤
   │  PERFORMANCE                                                │
   │  Overall accuracy: 84%   AUC-ROC: 0.91                     │
   │  Precision: 79%          Recall: 88%                        │
   ├─────────────────────────────────────────────────────────────┤
   │  KNOWN LIMITATIONS                                          │
   │  ● Limited data from APAC region — lower accuracy there     │
   │  ● Performance degrades after 90 days without retraining    │
   ├─────────────────────────────────────────────────────────────┤
   │  FAIRNESS EVALUATION                                        │
   │  No significant performance gap across Industry subgroups   │
   ├─────────────────────────────────────────────────────────────┤
   │  LAST UPDATED: Q1 2024   OWNER: Sales Ops Team              │
   └─────────────────────────────────────────────────────────────┘
```
**Content:**
**What is a Model Card?**
A standardized documentation artifact that ships WITH an AI model, describing:
- **Intended use:** What is this model designed to do? What use cases is it appropriate for?
- **Out-of-scope use:** What should this model NOT be used for?
- **Training data:** What data was used to train the model? What time period? What population?
- **Performance metrics:** How accurate is the model overall? By subgroup?
- **Known limitations:** Where does the model underperform or fail?
- **Known biases:** Any identified biases in the model's outputs

**Salesforce's commitment:** Publish model cards for Einstein AI features

**Why model cards enable transparency:**
- Admins can make informed deployment decisions
- Users understand what the AI can and can't do
- Accountability for model behavior is documented

**Speaker Notes:** "Model cards were introduced by Google researchers in 2019 and have become an industry standard for responsible AI documentation. Think of a model card as a nutrition label for an AI model. Just as a food nutrition label tells you what's in what you're eating, a model card tells you what's in the AI you're deploying. It's not just about transparency — it's about informed consent. When a company deploys an Einstein feature, the admin and the organization should know what they're working with. The model card provides that baseline knowledge. For the exam: model cards = transparency documentation for AI features, covering training data, intended use, limitations, and known biases."

---

### Slide 6: Einstein's Explainability Features
**Visual:** Three screenshots side by side. (1) Einstein Lead Score panel with driving factors. (2) Einstein Case Classification with confidence percentages on each classification. (3) Einstein Conversation Insights showing a call transcript analysis with specific moment-level insights.
**Content:**
**Einstein Lead Scoring and Opportunity Scoring:**
- Score (0-99) + list of top positive and negative driving factors
- Rep can see exactly which variables drove the score up or down
- Driving factors use business-understandable language, not technical terms

**Einstein Case Classification:**
- Predicted field values shown with confidence percentages
- "Category: Technical Issue (confidence: 87%)"
- Agent sees not just the recommendation but how confident Einstein is

**Einstein Conversation Insights:**
- Analyzes sales call recordings
- Shows specific moments: competitor mentions, pricing discussions, feature requests
- Each insight is tied to the specific point in the transcript where it occurred

**Einstein Prediction Builder:**
- After training: field importance visualization showing which fields contributed most to the model
- On records: prediction score + top factors (positive and negative)

**Speaker Notes:** "Every Einstein predictive feature follows the same explainability pattern: show the score AND show the reasons. This is a deliberate design choice, not an accident. Salesforce's guidance: a score without reasons doesn't empower anyone — it's just a number. A score with reasons gives the user enough to evaluate whether the AI's reasoning makes sense, override it if they disagree, and ultimately maintain their own judgment in the process. This is also how Einstein supports the 'Empowering' and 'Transparent' Trusted AI Principles simultaneously."

---

### Slide 7: Audit Trails in Salesforce AI
**Visual:** A Salesforce audit log screen showing AI-generated content with entries: timestamp, user, record, action ("Prompt Template: Case Summary Generated"), template name used, and a summary of the output.
**Content:**
**Audit trails in Salesforce AI record:**
- WHAT the AI did (generated content, made a classification, took an action)
- WHEN it happened (timestamp)
- WHO triggered it (user or automated process)
- WHICH AI feature/template was used
- WHAT the input was (record context)
- WHAT the output was (content generated or action taken)

**Where audit trails exist:**
- Prompt Builder: every generation logged
- Agentforce: every agent action logged (messages sent, records created, flows triggered)
- Einstein Prediction: predictions logged with timestamp and model version
- Einstein Copilot: conversation history maintained

**Why this matters:**
- Enables investigation of incorrect AI decisions
- Supports compliance with regulatory requirements
- Provides accountability when AI causes harm
- Allows pattern analysis to detect systematic errors

**Speaker Notes:** "Audit trails are the accountability infrastructure for AI transparency. Without them, you're flying blind. When a customer says 'your AI told me my refund would arrive in 3 days and it's been 2 weeks,' and you have no record of what the Agentforce agent said — you can't investigate, you can't learn from it, and you can't prove what happened. With audit trails, you can replay exactly what the agent said, understand why it said it (which template or reasoning path), and determine whether it was an isolated error or a systematic problem. For the exam: audit trails support the Accountable and Transparent Trusted AI Principles."

---

### Slide 8: Regulatory Context — GDPR and the Right to Explanation
**Visual:** EU flag alongside GDPR and EU AI Act logos. Key regulatory requirements listed with brief descriptions.
**Content:**
**GDPR (General Data Protection Regulation) — EU, 2018:**
- Article 22: Individuals have the right to not be subject to solely automated decisions that significantly affect them
- Right to explanation: if an automated decision is made, individuals can request an explanation of the logic used
- Applies when AI makes decisions about: creditworthiness, employment, insurance, legal matters
- Salesforce's audit trails and driving factors directly support GDPR Article 22 compliance

**EU AI Act — 2024:**
- Classifies AI systems by risk level (unacceptable/high/limited/minimal)
- High-risk AI (affecting employment, credit, education, essential services) requires:
  - Technical documentation
  - Human oversight
  - Transparency to users
  - Accuracy and robustness requirements
- Agentforce and Einstein features used for employment/credit decisions would fall under high-risk classification

**US Context:** Multiple state laws (Colorado, Illinois) and proposed federal regulations trending toward transparency requirements

**Speaker Notes:** "The regulatory landscape is moving fast. GDPR was passed in 2018 and gave European citizens the right to challenge and request explanations for automated decisions. The EU AI Act in 2024 went further — it categorizes AI by risk level and mandates human oversight, transparency, and documentation for anything classified as high-risk. If you're using Agentforce to help make hiring decisions, or Einstein Prediction Builder to score creditworthiness, those uses could fall under high-risk AI classification in Europe. For the exam, you don't need to know the regulatory details in depth — but you need to know that GDPR includes a right to explanation for automated decisions, and that Salesforce's explainability features directly support that right."

---

### Slide 9: Transparency vs. Explainability — The Distinction
**Visual:**
```
   TRANSPARENCY vs. EXPLAINABILITY — Key Distinction

   ┌─────────────────────────────────────────────────────────────┐
   │                                                             │
   │   TRANSPARENCY              EXPLAINABILITY                  │
   │   ┌─────────────────┐   ┌─────────────────┐                │
   │   │                 │   │                 │                │
   │   │ What model is   │   │ Why did this    │                │
   │   │ used            │   │ specific        │                │
   │   │ How it was      │ ∩ │ decision happen │                │
   │   │ trained         │   │                 │                │
   │   │ What data       │   │ Post-hoc        │                │
   │   │ it used         │   │ reasoning for   │                │
   │   │ Overall         │   │ individual      │                │
   │   │ performance     │   │ predictions     │                │
   │   └─────────────────┘   └─────────────────┘                │
   │                                                             │
   │   SHARED ZONE: Both serve the goal of trust and oversight   │
   │                                                             │
   │   Transparency = SYSTEM level   Explainability = DECISION  │
   │                  (disclosed)                    level       │
   │                                                 (explained) │
   └─────────────────────────────────────────────────────────────┘
```
**Content:**
**Transparency** (broader concept):
- Knowing THAT AI is being used and for what purpose
- Disclosing AI identity (Agentforce must say it's AI)
- Publishing model cards, acceptable use policies
- Making AI decisions visible in records

**Explainability** (subset of transparency):
- Understanding HOW the AI reached a specific decision
- Feature importance scores and driving factors
- Confidence levels
- Reasoning traces in Agentforce logs

**Relationship:** All explainability is transparency, but not all transparency is explainability.

**Exam note:** These terms are often used interchangeably, but Salesforce's exam distinguishes them. Transparency = disclosure and visibility. Explainability = the WHY of individual decisions.

**Speaker Notes:** "Students sometimes conflate these two terms. Remember: transparency is the bigger idea — it includes everything about making AI visible, disclosed, and documented. Explainability is specifically about the REASONING behind individual AI decisions. You can have transparency without explainability: 'We use AI for lead scoring' is transparent — but if you can't explain why a specific lead was scored 43%, you have transparency without explainability. Salesforce aims for both — disclosure that AI is used AND explanation of why it decided what it did."

---

### Slide 10: Exam Tips — Quick Reference
**Visual:** Bulleted list of exam-critical points.
**Content:**
**Key exam points for Transparency and Explainability:**

1. Transparent = one of the 5 Trusted AI Principles. Means: disclose AI use, explain AI decisions, acknowledge limitations
2. Black box AI: accurate but unexplainable. Explainable AI: slightly less accurate potentially, but interpretable
3. Einstein prediction driving factors = explainability in action (shows WHY a score is what it is)
4. Model cards = documentation covering training data, intended use, limitations, known biases
5. Audit trails support both Transparent and Accountable principles
6. GDPR Article 22 = right to explanation for automated decisions affecting individuals
7. EU AI Act = risk-based classification; high-risk AI requires human oversight and transparency
8. Agentforce agents MUST disclose they are AI — this is the most testable Transparent principle violation
9. Confidence scores (in Case Classification, etc.) are a form of process transparency

**Speaker Notes:** "These nine points cover the full scope of Transparency questions on the exam. The most common exam question types: identifying which Trusted AI Principle is being demonstrated (answer: Transparent when it's about disclosure or explanation), identifying what feature provides explainability (answer: driving factors, confidence scores), and identifying what regulation requires explanation rights (answer: GDPR Article 22)."

---

## RECORDING SCRIPT

[Opening — 0:00-1:30]

"Let me start with a scenario. Your loan application for a $250,000 mortgage was declined. The email from the bank says: 'Your application was reviewed by our automated assessment system and does not meet our lending criteria at this time.' Full stop. No details. No explanation. You have a good salary, a solid credit history — and you have no idea why you were declined.

This is not hypothetical. Before regulatory requirements forced changes, algorithmic lending decisions were routinely made without any explanation provided to applicants. And as we covered in the bias lecture, those systems were often producing discriminatory outcomes.

The demand for transparency in AI — the principle that affected people should be able to understand why an AI made a decision about them — is fundamentally a demand for fairness and accountability. It's also increasingly a legal requirement. That's what this lecture is about."

[Black box vs. explainable AI — 1:30-5:00]

"The central concept of this lecture is the contrast between black box AI and explainable AI.

A black box AI model is one where: input goes in, output comes out, and the mechanism connecting them is mathematically opaque. This happens because the most powerful types of AI — deep neural networks — make decisions by manipulating thousands or millions of parameters in ways that don't map to human-readable logic. The model finds patterns that humans might never consciously identify. That's the source of its power. It's also why it can't explain itself.

The medical imaging AI I mentioned in the slide notes is real. Deep learning AI can look at a mammography scan and identify malignant tumors with higher accuracy than trained radiologists. But if you ask it 'what exactly did you see that made you say this was malignant?', it cannot give an intelligible answer. It might say something like 'a 3-pixel cluster in sector 7 had anomalous intensity relative to surrounding tissue' — but that's not a medical explanation a radiologist or patient can reason about.

For medical diagnosis, we're still working through the implications of that. But for business applications — lead scoring, case classification, recommendation engines — we have good explainability options and no good reason to accept black boxes.

Explainable AI trades some potential accuracy for interpretability. Rather than a single deep neural network, it might use a gradient boosting model or a random forest — models that can report feature importance scores. 'These five variables contributed 80% of the prediction score. Here are their relative weights.' That's not perfect mechanistic explanation, but it's enough for a business user to evaluate whether the AI's reasoning makes sense."

[Einstein's explainability — 5:00-8:00]

"Every Einstein predictive feature includes explainability, and I want to make sure you understand exactly what that looks like in Salesforce because it'll appear in exam questions.

When Einstein Lead Scoring rates a lead at 78%, it doesn't just show '78%.' It shows driving factors — the specific fields on that lead record that most positively and negatively influenced the score. Something like: 'Positive factors: Job title matches our best customers (VP-level), Company size matches our sweet spot (500-2000 employees), Recent web activity (4 visits in last 7 days). Negative factors: No known industry match, Lead source is lower-quality list.'

A rep can look at that and understand: 'This lead scored high because they're a VP at a mid-market company who's actively researching us. They scored slightly lower than 78% could have been because we're not sure about their industry fit.' That's actionable. The rep can call the lead and immediately start investigating the industry question.

Einstein Case Classification works similarly but with confidence percentages. 'Category: Technical Issue (87% confidence), Priority: High (72% confidence).' The service agent sees not just the recommended classification but how sure Einstein is. An 87% confidence classification is probably right — accept it. A 52% confidence classification might warrant looking at it more carefully.

Model cards add another layer of explainability at the system level — not for individual decisions but for the AI feature overall. What was it trained on? What use cases is it good for? Where are its known weaknesses? That documentation lets admins make informed decisions about when to trust the AI and when to exercise more caution."

[Regulatory context and closing — 8:00-12:00]

"Let me spend a few minutes on the regulatory context because the exam expects you to know the basics.

GDPR, which went into effect in the EU in 2018, includes Article 22: individuals have the right not to be subject to solely automated decisions that significantly affect them. More specifically, if an automated decision IS made, individuals have the right to request human review and a meaningful explanation of the logic used.

What does 'significantly affects them' mean? Employment decisions. Credit and loan decisions. Insurance. Legal proceedings. Anywhere an AI's output changes someone's access to opportunities or resources.

If you're using Einstein Prediction Builder to help make employment or credit decisions in Europe, GDPR requires that you be able to explain those decisions to affected individuals. Salesforce's driving factors feature is literally designed to enable this — you can tell an applicant 'the model scored you low because of factor X and factor Y, which you can learn more about.'

The EU AI Act, which became law in 2024, goes further. It classifies AI systems by risk level. High-risk AI — which includes systems used in employment, education, credit, and certain public services — has specific requirements: technical documentation (like model cards), human oversight in the decision process, transparency to users about when AI is involved, and ongoing accuracy monitoring.

For the exam, you don't need to know every clause of these regulations. You need to know: GDPR gives EU citizens the right to explanation for automated decisions. EU AI Act creates risk tiers for AI with requirements that increase with risk level. Salesforce's audit trails, driving factors, model cards, and human oversight design directly support compliance with these frameworks."

---

## EXAM TIPS
- Transparent is one of the 5 Trusted AI Principles — it includes disclosing AI use AND explaining AI reasoning.
- Black box AI = accurate but no explainability. Explainable AI = accurate AND interpretable.
- Einstein's explainability = driving factors (why a score is what it is) + confidence percentages.
- Model cards = documentation for an AI feature: training data, intended use, limitations, known biases.
- Audit trails support both Transparent and Accountable principles simultaneously.
- GDPR Article 22 = right to explanation for automated decisions affecting EU individuals.
- EU AI Act = risk-based classification; high-risk AI (employment, credit, healthcare) requires human oversight and transparency.
- Agentforce must disclose it is AI — pretending to be human violates the Transparent principle.
- Transparency (broad) = disclosure, documentation, visibility. Explainability (specific) = the WHY of individual decisions.

---

## LECTURE SUMMARY
- AI transparency covers disclosure (knowing AI is used), explainability (knowing why it decided what it did), and documentation (model cards describing the AI system)
- Black box AI produces accurate but uninterpretable outputs; explainable AI provides human-understandable reasoning
- Einstein provides explainability via driving factors on prediction scores and confidence percentages on classifications
- Model cards document training data, intended use, limitations, and known biases for each Einstein feature
- Audit trails support both the Transparent and Accountable Trusted AI Principles
- GDPR Article 22 and the EU AI Act create legal requirements for explainability in high-stakes AI decision-making

---

## MINI QUIZ

**Question 1:**
A sales rep notices their Einstein Lead Scoring shows: "Score: 62% — Positive factors: Mid-market company size, Recent email engagement. Negative factors: No CRM activity in 30 days, Job title does not match typical buyer profile." What aspect of Salesforce's Trusted AI Principles does the display of positive and negative factors BEST demonstrate?

A) Empowering  
B) Responsible  
C) Transparent  
D) Inclusive

**Answer: C — Transparent**

*Explanation:* The display of driving factors (positive and negative contributors to a score) is the classic implementation of the Transparent principle — specifically the explainability dimension. It shows the rep WHY the AI scored the lead at 62%, not just THAT it scored 62%. Transparent AI means AI decisions come with understandable reasoning. Empowering is about preserving human agency (the rep can use this information to make their own decision — that's also true here, but the specific feature being described is the explainability mechanism, which maps to Transparent). Responsible is about harm prevention. Inclusive is about fairness across groups.

---

**Question 2:**
Under GDPR Article 22, what right do individuals in the EU have regarding automated decision-making?

A) The right to opt out of all AI-powered services  
B) The right to request a human review and explanation of the logic used in automated decisions that significantly affect them  
C) The right to receive a copy of the AI model used to make decisions about them  
D) The right to have all AI decisions reversed upon request

**Answer: B — The right to request human review and explanation of the logic used**

*Explanation:* GDPR Article 22 specifically gives EU individuals the right not to be subject to solely automated decisions that significantly affect them (employment, credit, legal matters, etc.) — and if such a decision is made, the right to request human intervention and a meaningful explanation of the logic used. It is NOT a right to opt out of all AI services (A — overly broad, doesn't match the specific right). It does NOT give access to the model itself (C). It does NOT give the right to automatic reversal (D). The right is specifically to human review + explanation of reasoning for high-stakes automated decisions.

---

**Question 3:**
A Salesforce admin is evaluating an Einstein Case Classification model before deploying it. They review the model's documentation and find sections covering: what the model was trained on, the intended use cases, known limitations in accuracy for complex technical cases, and an identified tendency to misclassify cases from non-English speaking customers. What type of document is this?

A) An Audit Trail  
B) A Model Card  
C) A Prompt Template  
D) An Acceptable Use Policy

**Answer: B — A Model Card**

*Explanation:* A Model Card is the standardized documentation artifact for AI models that covers exactly the sections described: training data, intended use, performance limitations, and known biases or accuracy gaps. This is the transparency documentation that ships with Einstein AI features to help admins make informed deployment decisions. An Audit Trail is a record of specific AI actions taken at runtime (not pre-deployment documentation). A Prompt Template is a Prompt Builder configuration file for generative AI (not model documentation). An Acceptable Use Policy defines what AI can and cannot be used for (not the model's technical characteristics).
