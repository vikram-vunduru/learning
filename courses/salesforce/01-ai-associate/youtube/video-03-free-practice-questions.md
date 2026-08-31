# YouTube Video: 10 FREE Salesforce AI Associate Practice Questions (With Explanations)

**Target Length:** 18-20 minutes
**Thumbnail text:** "10 PRACTICE QUESTIONS" (large) + "AI ASSOCIATE EXAM" (smaller) + a checkmark icon or quiz graphic
**Tags:** salesforce ai associate practice questions, salesforce ai associate exam questions, salesforce ai associate free practice exam, salesforce einstein practice test, ai associate certification practice, salesforce practice questions 2024, salesforce ai exam prep, einstein trust layer questions
**Description:**
```
10 free Salesforce AI Associate practice questions — with full answer explanations for each one. This is the format, the difficulty, and the topic coverage you'll see on the real exam.

For each question I'll:
📖 Read the question and options
⏸️ Give you time to think
✅ Reveal the correct answer
❌ Explain why each WRONG answer is wrong (this is the most important part)

📌 TIMESTAMPS
0:00 - Intro
0:45 - Q1: AI Fundamentals — Types of Machine Learning
2:30 - Q2: Generative AI vs. Predictive AI
4:00 - Q3: Einstein Trust Layer — Zero Data Retention
5:45 - Q4: Einstein Trust Layer — Data Masking
7:15 - Q5: Ethical AI — Bias in Training Data
8:45 - Q6: Next Best Action
10:15 - Q7: Prompt Builder
11:45 - Q8: Ethical AI Scenario
13:15 - Q9: Data Quality for AI
14:45 - Q10: Mixed Scenario — Trust Layer + Ethics
16:30 - Final tips + Full course plug

🎓 Want 40 more questions like these?
My Udemy course has 40 practice exam questions in the exact same format as the real exam — with detailed explanations for every answer.
👉 [UDEMY LINK] — use code [DISCOUNT CODE] for [X]% off

📚 Related videos:
- Complete 2-Week Study Plan: [link]
- Einstein Trust Layer Deep Dive: [link]

#SalesforceAIAssociate #PracticeQuestions #SalesforceExam #EinsteinTrustLayer #AIAssociate
```

---

## SCRIPT

---

[INTRO - 0:00]

[SCREEN SHOW: Camera — upbeat, direct energy]

Welcome back. Today's video is ten free practice exam questions for the Salesforce AI Associate certification — with full explanations.

Here's how this works: I read the question, I read the four options, I say "pause the video and think about it" — and you actually pause. Not just half-pause. Actually stop the video, think through it, pick your answer, THEN unpause to hear the explanation.

This is research-backed. Active recall — testing yourself before seeing the answer — is significantly more effective for retention than passively reading or watching. So the pause is not just a YouTube gimmick. Use it.

By the end of this video, you'll have a realistic sense of where you stand on the exam. If you're getting 8 out of 10 or better, you're probably ready. If you're getting 5 or 6, you know exactly where to focus your remaining study time.

Let's go.

---

[Q1 - 0:45]

[SCREEN SHOW: Question 1 slide — clean exam-style format]

**Question 1 — Topic: AI Fundamentals**

"A data science team at a retail company has a large dataset of past customer purchases and knows which customers churned and which stayed. They want to train an AI model to predict future churn. What type of machine learning best describes this approach?

A) Unsupervised Learning  
B) Reinforcement Learning  
C) Supervised Learning  
D) Transfer Learning"

[SCREEN SHOW: "Pause the video — pick your answer" text with a 5-second countdown or pause graphic]

---

[SCREEN SHOW: "ANSWER: C — Supervised Learning"]

The answer is **C — Supervised Learning**.

Here's why. The team has labeled data — they know the historical outcome (churned vs. stayed) for each past customer. In supervised learning, you train a model using labeled examples — inputs paired with known outputs. The model learns the pattern between customer behavior features and the churn outcome, then applies that pattern to new data.

Let's check the wrong answers:

**A — Unsupervised Learning:** This is used when you DON'T have labeled outcomes and want the model to find patterns on its own — like customer segmentation, where you don't pre-define the groups. The key difference: if you have labels, it's supervised. If you don't, it's unsupervised.

**B — Reinforcement Learning:** This is used when an agent learns through trial and error, receiving rewards or penalties. Think robotics, game-playing AI (like Chess engines). It's not used for this type of CRM prediction problem.

**D — Transfer Learning:** This is when you take a model trained on one task and adapt it for a different but related task. For example, taking a language model trained on web text and fine-tuning it for legal documents. Not the primary concept here.

**Pattern to recognize:** Any question that describes "we have historical data with known outcomes" and "we want to predict future outcomes" → Supervised Learning.

---

[Q2 - 2:30]

[SCREEN SHOW: Question 2 slide]

**Question 2 — Topic: AI Capabilities in CRM**

"A Salesforce admin wants to add an AI feature that will automatically write a personalized follow-up email draft for a sales rep based on the rep's previous email conversations and Opportunity details. What type of AI is this an example of?

A) Predictive AI  
B) Generative AI  
C) Supervised Machine Learning  
D) Analytical AI"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: B — Generative AI"]

**B — Generative AI** is correct.

Generative AI creates new content — text, images, code, audio. Writing a personalized email draft is creating new text content. That's generative AI, specifically what Salesforce's Prompt Builder and Einstein Copilot are designed to do.

**A — Predictive AI:** Predictive AI scores or forecasts — it tells you the LIKELIHOOD of something happening. "This email will result in a 72% chance of a reply" — that's predictive. "Write me an email" — that's generative. The difference: predictive outputs a number or category; generative outputs new content.

**C — Supervised Machine Learning:** This is a training methodology — it describes HOW a model learns, not what it does. It's a subset of AI, not the right level of abstraction for this question.

**D — Analytical AI:** This is a distractor term that sounds plausible. Analytical AI typically refers to AI that analyzes data for insights — dashboards, reports, anomaly detection. Not content generation.

**Key mental shortcut:** If the output is text/image/content → Generative. If the output is a score/forecast/category → Predictive.

---

[Q3 - 4:00]

[SCREEN SHOW: Question 3 slide]

**Question 3 — Topic: Einstein Trust Layer**

"A company's legal team has approved the use of Einstein Copilot with one condition: customer data sent to the LLM must not be stored or used for training purposes by the AI vendor. Which component of the Einstein Trust Layer satisfies this requirement?

A) Data Masking and Anonymization  
B) Secure Data Retrieval  
C) Zero Data Retention  
D) Toxicity Detection"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: C — Zero Data Retention"]

**C — Zero Data Retention**.

The legal team's concern is about DATA BEING STORED and used for model training by the AI vendor. Zero Data Retention is Salesforce's contractual agreement with its LLM partners that they will not retain data after the API call completes and will not use that data for model training.

**A — Data Masking:** This prevents PII from reaching the LLM in plain text — but data masking doesn't prevent the LLM from receiving and processing the data (in masked form). The concern here is about storage and training, not about visibility of raw data.

**B — Secure Data Retrieval:** This enforces that the AI only pulls Salesforce data the user is permitted to see. It's about ACCESS control within Salesforce, not about what happens to data after it reaches the LLM.

**D — Toxicity Detection:** This filters AI OUTPUTS for harmful content. Completely unrelated to data storage.

**Exam trap:** A and C are frequently confused. Remember: Masking = don't show PII to the LLM. Zero Retention = LLM doesn't keep what it saw. Different problems, different solutions.

---

[Q4 - 5:45]

[SCREEN SHOW: Question 4 slide]

**Question 4 — Topic: Einstein Trust Layer**

"During a Prompt Builder session, an Einstein prompt template pulls in a Contact record that includes a Social Security Number stored in a custom field. The Salesforce admin wants to ensure this SSN is never transmitted to the external LLM in readable form. Which Trust Layer feature handles this?

A) Audit Trail  
B) Zero Data Retention  
C) Field-Level Security  
D) Dynamic Grounding with Secure Data Masking"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: D — Dynamic Grounding with Secure Data Masking"]

**D — Dynamic Grounding with Secure Data Masking**.

The concern is about PII (SSN) being transmitted to the LLM in readable/plain text form. Secure Data Masking intercepts the data before it's sent to the LLM and replaces sensitive values with placeholder tokens. The LLM processes the token, not the actual SSN.

**B — Zero Data Retention:** This is about storage AFTER the fact. The LLM would still receive the plain text SSN if masking wasn't in place — it just wouldn't store it. Zero Retention alone doesn't prevent the LLM from seeing the raw data.

**C — Field-Level Security:** This is a Salesforce permission that restricts WHICH USERS can see the field on a page layout or in a query. But if the field is included in the grounding data for the prompt template, it could still reach the LLM. FLS is a Salesforce access control, not a Trust Layer component.

**A — Audit Trail:** This logs interactions — it doesn't protect data in transit.

This question intentionally tests whether you know the distinction between Masking (prevents LLM from seeing PII in plain text) and Zero Retention (prevents LLM from storing data).

---

[Q5 - 7:15]

[SCREEN SHOW: Question 5 slide]

**Question 5 — Topic: Ethical Considerations of AI**

"An AI model trained to evaluate employee performance has been found to give consistently lower scores to employees who took parental leave in the past 2 years. An investigation reveals that historically, employees who took parental leave received lower performance ratings from their managers. The AI model learned this pattern. What is the most likely root cause of this bias?

A) Model overfitting  
B) Biased training data  
C) Incorrect algorithm selection  
D) Insufficient computing resources"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: B — Biased Training Data"]

**B — Biased Training Data**.

The AI learned from historical performance ratings that were themselves biased — human managers had unconsciously (or consciously) rated parental leave-takers lower. The AI model did exactly what it was trained to do: it found patterns in the training data and applied them. The problem is that the training data reflected human bias, and the model faithfully reproduced it.

This is one of the most important concepts in AI ethics: **garbage in, garbage out** — or more specifically, **bias in, bias out**.

**A — Model Overfitting:** Overfitting means the model is too closely fitted to the training data and fails to generalize to new data. It doesn't explain systematically biased outputs against a specific group.

**C — Incorrect Algorithm Selection:** The algorithm choice is not the cause here. A different algorithm trained on the same biased data would likely reproduce the same bias.

**D — Insufficient Computing Resources:** Computational resources affect training speed and model complexity — they have nothing to do with systematic bias.

**Exam pattern:** Whenever a question describes AI producing systematically unfair outcomes against a group, and the scenario describes historical data — the answer is ALWAYS biased training data.

---

[Q6 - 8:45]

[SCREEN SHOW: Question 6 slide]

**Question 6 — Topic: AI Capabilities in CRM — Next Best Action**

"A Salesforce admin wants to display contextual, real-time recommendations on the Account record page that guide sales reps on the most effective next action — such as 'Schedule a follow-up call' or 'Send a product brochure.' The recommendations should be based on rules the admin configures. Which Salesforce feature is designed for this use case?

A) Einstein Prediction Builder  
B) Prompt Builder  
C) Next Best Action  
D) Einstein Activity Capture"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: C — Next Best Action"]

**C — Next Best Action**.

Next Best Action (NBA) surfaces rule-based or AI-informed recommendations directly on record pages. The admin creates Recommendation records, builds a Strategy (using Strategy Builder / Flow logic) that determines WHEN and to WHOM each recommendation is shown, and deploys the component on the record page. This matches every element of the question: contextual, real-time, on the record page, rule-based.

**A — Einstein Prediction Builder:** This creates a score (likelihood %). It might tell you "this account has a 78% chance of churn" but it doesn't surface an actionable recommendation with buttons. Prediction Builder feeds data INTO decision-making — it doesn't surface the recommendation UI.

**B — Prompt Builder:** This generates text content using AI. It could generate a suggested message — but it doesn't provide the "recommend an action with accept/reject buttons on the record page" experience.

**D — Einstein Activity Capture:** This automatically syncs emails and calendar events between Salesforce and your email client. Completely different product.

**Exam shortcut:** "Recommendations on a record page" + "admin configures rules" = Next Best Action.

---

[Q7 - 10:15]

[SCREEN SHOW: Question 7 slide]

**Question 7 — Topic: Prompt Builder**

"A Salesforce admin creates a Prompt Builder template designed to generate a draft renewal email for Account records. The template includes merge fields that pull the Account Name, Contract End Date, and Primary Contact Name from the record. What is the term for including this Salesforce record data in the AI prompt?

A) Prompt Engineering  
B) Fine-Tuning  
C) Grounding  
D) RAG (Retrieval-Augmented Generation)"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: C — Grounding"]

**C — Grounding**.

In the context of Salesforce and the AI Associate exam, **grounding** refers to providing relevant, contextual data to the AI model — usually pulled from Salesforce records — so the AI can generate accurate, relevant outputs specific to that record. When you add `{!$Record.AccountName}` to a Prompt Builder template, you are grounding the prompt in that specific Account's data.

**A — Prompt Engineering:** This is the broader practice of designing prompts effectively — choosing the right instructions, tone, format, and context. Grounding is a technique WITHIN prompt engineering, but the specific act of including record data is called grounding, not prompt engineering.

**B — Fine-Tuning:** Fine-tuning is a process of retraining a pre-trained model on a specific dataset to improve its performance for a particular domain. It's a training technique — not something that happens at prompt execution time.

**D — RAG (Retrieval-Augmented Generation):** RAG is a broader AI architecture pattern where a retrieval system fetches relevant documents and includes them in the prompt context. Salesforce's grounding is related to RAG, but the specific term the AI Associate exam uses for including Salesforce record data in a prompt is grounding — not RAG.

---

[Q8 - 11:45]

[SCREEN SHOW: Question 8 slide]

**Question 8 — Topic: Ethical AI — Scenario**

"A bank is using an AI model to assist loan officers with initial loan application decisions. The model's recommendations are presented to loan officers who must approve or reject each application. The bank's compliance team wants to ensure that humans remain in control of final decisions and that the AI's reasoning is understandable to the loan officers. Which two AI principles does this scenario prioritize? (Choose 2)

A) Accuracy  
B) Human Oversight  
C) Inclusivity  
D) Transparency / Explainability"

[SCREEN SHOW: Pause graphic — "Choose 2 correct answers"]

---

[SCREEN SHOW: "ANSWER: B and D"]

**B — Human Oversight and D — Transparency / Explainability**.

The question describes two distinct concerns:

**"Humans remain in control of final decisions"** → This is the principle of **Human Oversight** (also called Human-in-the-Loop). The AI assists but does not replace human judgment. Loan officers must approve every decision — the AI never makes a final call autonomously.

**"AI's reasoning is understandable to the loan officers"** → This is the principle of **Transparency / Explainability**. Explainable AI means the model's recommendations come with reasons — "This application was flagged due to high debt-to-income ratio and short employment history." Without explainability, the loan officer is just rubber-stamping an opaque recommendation.

**A — Accuracy:** Accuracy is important but not what the scenario specifically prioritizes. The question doesn't mention the model being accurate — it mentions human control and understandability.

**C — Inclusivity:** Inclusivity is about ensuring AI works fairly across diverse groups. The scenario doesn't specifically address this, though it's related to the broader ethical concern about lending AI.

**Salesforce's 5 Trusted AI Principles** (worth memorizing): Responsible, Accountable, Transparent, Empowering, and Inclusive. This question maps to Accountable (human oversight) and Transparent (explainability).

---

[Q9 - 13:15]

[SCREEN SHOW: Question 9 slide]

**Question 9 — Topic: Data for AI**

"An admin notices that the Einstein Prediction Builder model predicts Opportunity win rates with very high accuracy on the training dataset, but performs poorly when scoring new, live Opportunities. The model was trained on 10,000 historical Opportunities. What is the most likely explanation for this behavior?

A) The training dataset was too large  
B) The model is experiencing underfitting  
C) The model is experiencing overfitting  
D) The Opportunity object has too many fields"

[SCREEN SHOW: Pause graphic]

---

[SCREEN SHOW: "ANSWER: C — Overfitting"]

**C — Overfitting**.

Overfitting happens when a model learns the training data TOO well — it memorizes specific patterns and noise in the training data rather than learning generalizable rules. The result: excellent accuracy on training data, poor accuracy on new data.

Analogy: Imagine a student who memorizes every answer from last year's exam rather than learning the concepts. They'd ace a re-run of last year's exam but fail a new test with different questions.

The symptom in this question — high training accuracy, poor live performance — is the textbook definition of overfitting.

**B — Underfitting:** Underfitting is the OPPOSITE problem. The model is too simple — it doesn't learn the training data well enough and performs poorly on BOTH training data and new data. This question describes HIGH accuracy on training data, ruling out underfitting.

**A — Training dataset too large:** More training data generally helps models generalize BETTER, not worse. Overfitting is more likely with too few training examples or too complex a model.

**D — Too many fields:** While having irrelevant features can contribute to overfitting, "too many fields" isn't the specific term for what's being described.

**Remember:** Overfit = memorizes training data, fails in the real world. Underfit = too simple, fails everywhere.

---

[Q10 - 14:45]

[SCREEN SHOW: Question 10 slide — slightly more complex scenario]

**Question 10 — Topic: Mixed (Trust Layer + Ethics)**

"A global pharmaceutical company is deploying Einstein Copilot for their medical affairs team. Team members will use AI to draft responses to healthcare provider inquiries. The company has the following concerns:

1. Patient data in Salesforce records should not be sent to the LLM in plain text  
2. The AI should not generate responses that could constitute medical advice without human review  
3. All AI interactions must be logged for FDA compliance audits

Which THREE Trust Layer or responsible AI features address these three concerns respectively?

A) Data Masking, Human-in-the-Loop Review, Audit Trail  
B) Zero Data Retention, Toxicity Detection, Field-Level Security  
C) Secure Data Retrieval, Data Masking, Zero Data Retention  
D) Secure Data Retrieval, Human Oversight, Audit Trail"

[SCREEN SHOW: Pause graphic — "This one is harder — take your time"]

---

[SCREEN SHOW: "ANSWER: A"]

**A — Data Masking, Human-in-the-Loop Review, Audit Trail**.

Let's map each concern to the solution:

**Concern 1: "Patient data should not be sent to the LLM in plain text"** → **Data Masking** (anonymizes PII before transmission to the LLM)

**Concern 2: "AI should not generate responses without human review"** → **Human-in-the-Loop Review** (an ethical AI principle and process control — humans review AI output before it reaches the end user)

**Concern 3: "All AI interactions must be logged for FDA compliance"** → **Audit Trail** (every interaction is logged: who, when, what was prompted, what was returned)

Why not the others?

**B:** Zero Data Retention addresses storage by the LLM provider (not plain-text transmission), Toxicity Detection filters for harmful content (not a compliance logging tool), and Field-Level Security is a Salesforce permission (not a Trust Layer component).

**C:** This maps three Trust Layer technical features but misses the human review concern entirely — and doesn't address the compliance logging requirement specifically.

**D:** Secure Data Retrieval controls WHICH records the AI can access; it doesn't prevent PII from reaching the LLM in plain text.

This was a harder question that tests whether you can map multiple requirements to multiple solutions simultaneously. This is the format of the more challenging questions on the real exam.

---

[SCORE CHECK - 16:15]

[SCREEN SHOW: "How did you do?" slide with a score guide]

Let's check your score. Give yourself 1 point for each correct answer:

- **9-10 correct:** You are well-prepared. Take the exam soon while this material is fresh.
- **7-8 correct:** You're close. Identify which topics you missed and do focused review. Take the exam in 1-2 weeks.
- **5-6 correct:** You need more time on the topics where you missed questions — especially if you missed multiple Trust Layer questions. Budget 2 more weeks.
- **4 or below:** Don't panic. The fact that you took this quiz means you're ahead of most people who just memorize definitions. Go through the questions you missed, understand each wrong answer, and rewatch my Trust Layer video. You'll get there.

---

[OUTRO - 16:30]

[SCREEN SHOW: Back to camera]

Ten down. I've got 40 more where those came from — same format, same difficulty, covering all five topic areas with full explanations for every answer option.

Those 40 questions, plus about 3 hours of video lessons, 4 hands-on labs where you actually build AI features in Salesforce, and a printable cheat sheet — that's what's in my Udemy course. The link is in the description. I keep a discount code in there as well.

If you're not ready to buy anything yet — totally fine. Hit subscribe. I'll keep releasing free content like this that you can use to study. New video every week.

Leave a comment with your score — how many did you get right? And which topic gave you the most trouble? I read every comment and it helps me decide what to cover next.

Good luck on the exam. Go get that cert.

[SCREEN SHOW: End screen — subscribe button, links to Trust Layer video and study plan video, course link]

---

## PRODUCTION NOTES

- Each question should have a CLEAN visual: white or light background, question in bold black text, A/B/C/D options clearly listed — this matches the look of a real exam
- The "pause the video" moments should have a clear visual indicator — a countdown timer animation (3 seconds) works well and trains viewers to actually stop
- Consider showing the answer on screen with a ✅ next to the correct option and ❌ next to each wrong one as you explain
- Q10 is the hardest question and should be framed differently — maybe a slightly longer pause prompt, or a visual that shows all three concerns side-by-side
- Energy should stay high throughout — quiz-show format keeps viewers engaged, but 20 minutes is long. Consider tighter pacing on Q1-Q5 (simpler questions) and slower, more deliberate pacing on Q8-Q10 (harder questions)
- Score breakdown at the end drives comment engagement — encourage viewers to share their score
- Thumbnail: test multiple versions — "10 FREE Questions" vs. "Quiz: AI Associate" vs. "How Ready Are You?" style — quiz-style thumbnails tend to get high CTR
