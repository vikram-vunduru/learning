# Lecture 4: Predictive AI vs. Generative AI
**Section:** Section 01 — AI Fundamentals
**Duration:** 12 minutes
**Exam Weight:** AI Fundamentals ~17% of exam; this distinction is one of the most frequently tested concepts

---

## Learning Objectives
By the end of this lecture, students will be able to:
1. Define Predictive AI and explain how it works using real-world analogies
2. Define Generative AI and explain what makes it fundamentally different from Predictive AI
3. Identify specific Salesforce products that fall into each category (Einstein Prediction Builder, lead scoring, Einstein Copilot, Prompt Builder)
4. Recall the key differences between the two AI types as they appear on the Salesforce AI Associate exam

---

## SLIDES

### Slide 1: Two Flavors of AI — And Why It Matters
**Visual:** Split screen — left side shows a weather forecast icon (predictive), right side shows a paintbrush creating something new (generative)
**Content:**
- AI is not one single thing — there are different types
- Two types you MUST know for the exam: Predictive AI and Generative AI
- Both live inside Salesforce products you'll use every day
**Speaker Notes:** We've been talking about AI as if it's one big thing, but today we're going to split it into two very different categories. Once you understand the difference, a lot of Salesforce's product lineup will suddenly make a lot more sense.

---

### Slide 2: What Is Predictive AI?
**Visual:** A crystal ball that shows numbers and percentages, with arrows pointing to specific outcomes
**Content:**
- Predicts a future outcome or classifies existing data
- Learns patterns from historical data
- Output: a score, a label, a yes/no, a probability
- Examples: "Will this lead close?" / "Will this customer churn?"
**Speaker Notes:** Predictive AI looks at the past to make an educated guess about the future. It doesn't create anything new — it just makes a call: will this happen or won't it? Will this customer buy or leave? Is this email spam or not?

---

### Slide 3: The Weather Forecast Analogy
**Visual:** Weather app showing "70% chance of rain" next to a Salesforce lead score showing "85% likely to convert"
**Content:**
- A weather forecast doesn't control the weather — it predicts it
- Based on patterns: temperature + humidity + historical storms = 70% rain
- Salesforce lead scoring: activity + demographics + history = 82% close probability
- Same logic. Different data.
**Speaker Notes:** Think about your weather app. It says "70% chance of rain tomorrow." That's Predictive AI in action. It looked at patterns — temperature, humidity, historical storms — and made a confident guess. Salesforce does the same thing with sales data. It looks at how a lead behaves — did they open your emails? Did they visit your pricing page? Are they in your target industry? — and spits out a score.

---

### Slide 4: Salesforce Predictive AI — Einstein Prediction Builder
**Visual:** Screenshot of Einstein Prediction Builder interface in Salesforce
**Content:**
- Einstein Prediction Builder: build custom AI predictions without code
- Point at a Salesforce object, pick a field to predict
- Einstein trains a model on your historical data
- Outputs a prediction score directly on your records
- Use cases: churn risk, upsell probability, case escalation risk
**Speaker Notes:** Inside Salesforce, the flagship Predictive AI tool for admins is Einstein Prediction Builder. You literally point it at your data — say, your Opportunity object — tell it what you want to predict — say, whether an opportunity will be marked "Closed Won" — and Einstein builds a model from your historical records. No coding required. The output shows up right on the record as a score.

---

### Slide 5: Salesforce Predictive AI — Einstein Lead Scoring
**Visual:** A Salesforce Lead record with an Einstein Score badge showing "A" grade and a score of 91
**Content:**
- Einstein Lead Scoring: out-of-the-box AI for sales teams
- Analyzes patterns from your won/lost leads historically
- Scores incoming leads from 1–100 (or A/B/C/D tiers)
- Sales reps focus on high-score leads first
- No setup required — Einstein builds the model automatically
**Speaker Notes:** Einstein Lead Scoring is another great example — and this one is essentially plug-and-play. Einstein looks at all your past leads: which ones converted, which ones didn't, and what did the converted ones have in common? Then it applies those patterns to score your new leads. Your sales reps wake up every morning and their lead list is already sorted by "most likely to buy." That's Predictive AI doing its job.

---

### Slide 6: What Is Generative AI?
**Visual:** A blank canvas with AI "painting" an email, a paragraph of text, and an image
**Content:**
- Creates NEW content — text, images, code, audio
- Doesn't just predict; it produces something that didn't exist before
- Learns the structure of language (or images) and generates new examples
- Output: a written response, a summary, a code snippet, an image
**Speaker Notes:** Now here's where it gets really interesting — and really different. Generative AI doesn't just predict. It creates. It can write an email you've never written, generate a product description that never existed, or write code from a plain English description. It's not predicting what will happen — it's producing something entirely new. That is a fundamentally different job.

---

### Slide 7: The Chef Analogy
**Visual:** Two chefs side by side — one reading a nutrition label to predict calories (predictive), one inventing a new recipe from scratch (generative)
**Content:**
- Predictive AI = analyzing a dish and saying "this has 450 calories"
- Generative AI = creating an entirely new recipe from your preferences
- Both require knowing a lot about food — but they do completely different jobs
**Speaker Notes:** Here's my favorite analogy for this. Imagine two chefs. The first chef takes any dish you put in front of them and can immediately tell you its calorie count, its macros, whether it will cause an allergic reaction. They're analyzing and predicting — that's Predictive AI. The second chef creates entirely new recipes based on what you tell them. "I want something spicy, Mediterranean, under 500 calories, with shrimp." They've never made this exact dish before, but they know food so deeply that they can invent something new. That's Generative AI.

---

### Slide 8: Salesforce Generative AI — Einstein Copilot
**Visual:** Salesforce Einstein Copilot chat panel open alongside a CRM record
**Content:**
- Einstein Copilot: AI assistant built into Salesforce
- Understands your CRM data + natural language instructions
- Can draft emails, summarize cases, answer questions about your records
- Powered by a Large Language Model (LLM) under the hood
- Part of the Agentforce platform
**Speaker Notes:** Einstein Copilot is Salesforce's answer to ChatGPT — but deeply embedded in your CRM. You can open a chat panel right next to a customer record and say, "Draft a follow-up email for this opportunity." Copilot reads the record, understands the context, and writes the email. You didn't give it a template. It generated something new, tailored to that specific customer. That's Generative AI at work inside Salesforce.

---

### Slide 9: Salesforce Generative AI — Prompt Builder
**Visual:** Prompt Builder template editor showing merge fields pulling from Salesforce records
**Content:**
- Prompt Builder: create reusable AI prompt templates in Salesforce
- Admins build prompts with merge fields from Salesforce data
- Templates can be used across email, chat, record summaries
- Connects your Salesforce data to any LLM (Einstein, OpenAI, etc.)
- No-code tool — admins, not developers, own this
**Speaker Notes:** Prompt Builder takes it one step further. Instead of asking reps to type prompts manually, admins build templates. Imagine a template that says "Summarize the last 3 cases from this account and identify the most common complaint." Every time a rep opens an account, that prompt fires automatically using the actual case data from that account. Prompt Builder is how Salesforce makes generative AI scalable across an entire organization.

---

### Slide 10: Side-by-Side Comparison — The Exam Loves This
**Visual:** Clean two-column table
**Content:**

| Dimension | Predictive AI | Generative AI |
|---|---|---|
| Primary job | Predict or classify | Create new content |
| Output type | Score, label, probability | Text, image, code, audio |
| Training basis | Labeled historical data | Massive unlabeled text/data |
| Example output | "85% close probability" | "Here's your follow-up email" |
| Salesforce product | Einstein Prediction Builder, Lead Scoring | Einstein Copilot, Prompt Builder |
| Exam keyword | "forecast," "score," "classify" | "generate," "draft," "create," "summarize" |

**Speaker Notes:** This table is your exam cheat sheet. Memorize both sides. The exam will give you a scenario — "A Salesforce admin wants to automatically score incoming support cases by urgency" — and you need to know that's Predictive AI, not Generative AI. Or "A sales rep wants to auto-generate a personalized email from a CRM record" — that's Generative AI.

---

### Slide 11: They Can Work Together
**Visual:** Pipeline diagram — Predictive AI feeds a score into a workflow that triggers Generative AI to write an outreach email
**Content:**
- Modern AI systems often combine both types
- Predictive AI identifies the right customer (lead score = 90)
- Generative AI writes the perfect message for that customer
- Salesforce Flow can connect both
- Together = smarter, more personalized automation
**Speaker Notes:** Here's something that surprises a lot of students: these two types of AI aren't in competition. They're complementary. Predictive AI figures out WHO you should be talking to. Generative AI figures out WHAT to say to them. In a sophisticated Salesforce org, you might have Einstein Lead Scoring identify your hottest leads, and then Einstein Copilot automatically drafting a personalized outreach email for each one. That's the real power.

---

### Slide 12: Lecture Recap
**Visual:** Two icons — crystal ball (predictive) and paintbrush (generative) — with bullet summary
**Content:**
- Predictive AI: uses historical data to forecast or classify → Einstein Prediction Builder, Lead Scoring
- Generative AI: creates new content from patterns in data → Einstein Copilot, Prompt Builder
- Key difference: predicting an outcome vs. producing new content
- Exam keyword map: scores/forecasts = predictive; drafts/summaries/generates = generative
**Speaker Notes:** Alright, let's lock this in. Predictive AI looks backward at historical data to make a forward-looking guess — a score, a probability, a classification. Generative AI doesn't just analyze — it creates. And in Salesforce, you've got a clear set of products for each. In the next lecture, we go deep on the engine powering all generative AI: Large Language Models. Let's go.

---

## RECORDING SCRIPT

Hey everyone, welcome back. Today we're covering one of the most important distinctions you'll encounter — not just on the exam, but in the real world of Salesforce: the difference between Predictive AI and Generative AI.

Now I want to be honest with you — when I first heard these terms, I assumed AI was just AI. Like, it's all smart computer stuff, right? But once I understood the difference, everything about Salesforce's product lineup clicked. So let's dig in.

**What is Predictive AI?**

Predictive AI is exactly what it sounds like — it predicts things. It looks at historical patterns in your data and makes an educated guess about the future or classifies something right now.

Think about your phone's weather app. It says "70% chance of rain tomorrow." Nobody programmed that number. A model looked at thousands of past weather patterns — temperature, humidity, cloud cover, historical rain events — identified the conditions that correlated with rain, and calculated a probability. That's Predictive AI. It's not controlling the weather. It's not creating anything new. It's analyzing the past to forecast the future.

Now translate that to Salesforce. You have thousands of past leads in your CRM. Some became customers. Most didn't. What made the difference? Was it industry? Company size? How many emails they opened? How quickly they responded? Predictive AI — specifically Einstein Lead Scoring — learns those patterns from your historical data and applies them to every new lead that comes in. Your sales team wakes up in the morning and their lead list is already sorted: here are your hottest leads, work these first. No manual qualification. No gut instinct required. Just data-driven prioritization.

And here's what makes it practical: Einstein Prediction Builder lets Salesforce admins build custom predictions without writing a single line of code. You want to predict which accounts are at risk of churning? Point Einstein at your account data, tell it which field represents churn (maybe a custom field called "Churned"), and Einstein trains a model on your past records. Within a few hours, every active account has a churn risk score right on its record. Same idea, different data.

**What is Generative AI?**

Now here's where things get fundamentally different. Generative AI doesn't predict. It creates. It produces new content — text, images, code, audio — that never existed before.

Here's my chef analogy. Imagine two chefs. The first chef is brilliant at analyzing dishes. You hand them any plate of food and they instantly tell you: "480 calories, 32 grams of protein, contains gluten, probably from a Mediterranean cuisine." That's Predictive AI — taking existing data and classifying or quantifying it.

The second chef does something completely different. You walk up and say, "I want something spicy, under 500 calories, with shrimp, Mediterranean-inspired, and I'm avoiding dairy." They've never made this exact recipe before. But they understand cooking so deeply — flavor pairings, techniques, ingredients — that they can invent something entirely new. That's Generative AI. It doesn't retrieve a stored answer. It generates a new one.

Now, how does this show up in Salesforce? Two products you absolutely need to know:

**Einstein Copilot** is Salesforce's AI assistant. It's embedded right in your CRM interface — there's a chat panel where you can type natural language instructions. "Summarize this account." "Draft a follow-up email for this opportunity." "What were the main issues in this customer's last three support cases?" Copilot reads your actual CRM data, understands your question, and generates a response. Notice the word "generates." It's not pulling up a pre-written template. It's composing something new, on the fly, tailored to that specific record. That is Generative AI.

**Prompt Builder** is the admin-facing tool that makes Generative AI scalable. Instead of asking every rep to write their own AI prompts, an admin builds reusable templates. "Here's a template for case summaries — pull the account name, the last three case subjects, and the resolution status, and summarize them in three sentences." That template fires automatically whenever a rep opens an account. Prompt Builder connects your Salesforce data to an LLM and produces custom content at scale. Again — Generative AI.

**The Key Differences — This is Going to Be on Your Exam**

EXAM TIP: The exam loves to test this distinction with scenario-based questions. They'll describe a use case and ask you to identify whether it's Predictive or Generative AI. Here's your decoder ring:

- If the scenario mentions **scoring, ranking, forecasting, classifying, predicting a likelihood** → that's Predictive AI
- If the scenario mentions **drafting, generating, creating, summarizing, writing, composing** → that's Generative AI

The output type is your giveaway. Predictive AI outputs a number or a label. Generative AI outputs actual content — text, images, code.

Let me run through a few quick scenarios:

"A Salesforce admin wants to automatically flag customer accounts that are likely to cancel their subscription before renewal." — Predictive AI. You're predicting a future event (cancellation), outputting a risk score or flag.

"A sales rep wants an AI to draft a personalized follow-up email after a demo call, using information from the Opportunity record." — Generative AI. You're creating new written content.

"A support manager wants incoming cases automatically tagged with a priority level based on customer language and past resolution times." — Predictive AI. You're classifying (tagging/labeling) based on patterns.

"An admin wants to build a tool that summarizes a customer's full interaction history in plain English when a rep opens their account." — Generative AI. You're generating a text summary.

**They Work Together**

Here's something I want you to walk away understanding: these two types of AI aren't opposed. In a well-designed Salesforce implementation, they work as a team. Predictive AI tells you who deserves your attention. Generative AI tells you what to say to them.

Imagine this pipeline: Einstein Lead Scoring identifies that a lead has an 89% close probability. That score triggers a Salesforce Flow. The Flow fires a Prompt Builder template that uses the lead's data to auto-draft a personalized outreach email. The rep reviews it, hits send. Predictive AI found the right person. Generative AI wrote the right message. One sale, two types of AI, zero extra effort from the rep. That is the future Salesforce is building.

Alright, let's lock in the key points before we move on.

Predictive AI: learns from historical data to predict a future outcome or classify existing data. Output is a score, a label, a probability. Salesforce products: Einstein Prediction Builder, Einstein Lead Scoring. Keywords on the exam: predict, score, classify, forecast, rank.

Generative AI: creates entirely new content based on patterns learned from massive amounts of data. Output is text, images, code, audio. Salesforce products: Einstein Copilot, Prompt Builder, and increasingly Agentforce. Keywords on the exam: generate, draft, create, summarize, compose, write.

In the next lecture, we're going inside the engine that powers ALL Generative AI — Large Language Models. What are they, how do they actually work, and how does Salesforce use them? Let's go.

---

## EXAM TIPS
- The exam frequently presents a scenario and asks you to identify whether it is Predictive or Generative AI — your key signal is the OUTPUT: a score/probability/label = Predictive; new content/text/summary = Generative
- Know these product-to-type mappings cold: Einstein Prediction Builder = Predictive; Einstein Lead Scoring = Predictive; Einstein Copilot = Generative; Prompt Builder = Generative
- The exam may use the phrase "Einstein Analytics" or "CRM Analytics" — these are data analytics/visualization tools, not pure Predictive AI, but they can surface AI predictions; don't confuse them
- "Classification" and "regression" are Predictive AI techniques — if you see these terms, think Predictive AI
- The exam sometimes asks about the *primary difference* between the two — always anchor your answer on "Predictive AI uses historical data to forecast; Generative AI creates new content"
- Agentforce is primarily associated with Generative AI — AI agents that take actions and generate responses

---

## LECTURE SUMMARY
- Predictive AI analyzes historical data to forecast outcomes or classify data — it outputs scores, probabilities, and labels
- Generative AI creates new content (text, images, code) that did not exist before — it outputs written responses, summaries, emails, and more
- Key Salesforce Predictive AI tools: Einstein Prediction Builder (custom predictions), Einstein Lead Scoring (automated lead ranking)
- Key Salesforce Generative AI tools: Einstein Copilot (AI assistant in CRM), Prompt Builder (reusable prompt templates for admins)
- The two types are complementary — Predictive AI identifies who to focus on; Generative AI creates the content to engage them

---

## MINI QUIZ (3 questions with answers)

**Q1:** A sales manager wants Salesforce to automatically assign a likelihood-to-close percentage to each opportunity based on historical win/loss patterns. Which type of AI is being used?

**A:** Predictive AI

**Explanation:** The key indicator here is "likelihood-to-close percentage" — a numerical probability based on historical data. That's the classic output of Predictive AI. Generative AI would be involved if the task were to *write* a summary or *draft* content about the opportunity, not to score it.

---

**Q2:** A Salesforce admin uses Prompt Builder to create a template that auto-generates a case resolution summary every time a support case is closed. Which type of AI does this represent?

**A:** Generative AI

**Explanation:** Prompt Builder is a Generative AI tool. The output here — a written case resolution summary — is content that is being *created*, not a prediction or classification. Whenever the task involves generating text, that's Generative AI.

---

**Q3:** Which of the following BEST describes the difference between Predictive AI and Generative AI?

A) Predictive AI is older technology; Generative AI is newer  
B) Predictive AI forecasts outcomes from historical data; Generative AI creates new content  
C) Predictive AI requires coding; Generative AI does not  
D) Predictive AI works with numbers; Generative AI works with text

**A:** B

**Explanation:** The fundamental distinction is function: Predictive AI's job is to forecast or classify based on patterns in historical data. Generative AI's job is to produce new content. Options A, C, and D contain partial truths but do not capture the core difference. Option B is the textbook-correct answer that the Salesforce AI Associate exam is looking for.
