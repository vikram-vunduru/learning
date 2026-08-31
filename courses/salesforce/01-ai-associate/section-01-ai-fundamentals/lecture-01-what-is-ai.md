# Lecture 1: What Is Artificial Intelligence?
**Section:** Section 01 — AI Fundamentals
**Duration:** 12–15 minutes
**Exam Weight:** AI Fundamentals ~17% of exam

---

## Learning Objectives
By the end of this lecture, students will be able to:
1. Define artificial intelligence in plain language and in Salesforce exam terminology
2. Explain the core difference between traditional rule-based software and AI-driven software
3. Identify the two main categories of AI (narrow vs. general) and give real-world examples
4. Describe where AI appears in everyday technology and map those examples to Salesforce products like Einstein and Agentforce

---

## SLIDES

### Slide 1: Welcome to the AI Fundamentals Section
**Visual:** Clean title card — "Section 1: AI Fundamentals" with a simple brain icon and the Salesforce cloud logo
**Content:**
- What this section covers
- Why AI fundamentals matter for the exam
- How Salesforce fits into the AI world
**Speaker Notes:** Open with energy. Tell students this section is the foundation for everything else in the course. If they understand what AI actually is — not the science-fiction version, the real version — every other concept clicks faster.

---

### Slide 2: What AI Is NOT
**Visual:** Split image — a Hollywood robot on the left (labeled "Science Fiction AI"), a spreadsheet + decision tree on the right (labeled "What AI Actually Is")
**Content:**
- Not a thinking robot that wants to take over the world
- Not magic
- Not a single technology
- AI is a broad field of techniques that let computers perform tasks that previously required human judgment
**Speaker Notes:** Start by killing misconceptions. Most beginners come in with a movie version of AI in their heads. Acknowledge it, laugh about it, move on. The Salesforce exam is testing practical AI literacy, not sci-fi trivia.

---

### Slide 3: The Official Definition (Exam Language)
**Visual:** Clean definition card with the Salesforce brand color
**Content:**
- **Artificial Intelligence (AI):** The simulation of human intelligence processes by machines, especially computer systems
- Key processes: Learning, Reasoning, Self-Correction
- Salesforce frames AI as: "Technology that helps people make better decisions and get work done faster"
**Speaker Notes:** The exam will test whether you know this definition. But more importantly — help students understand WHY the definition includes "simulation." AI doesn't actually understand things the way humans do. It finds patterns and applies them. That distinction matters later when we talk about limitations.

---

### Slide 4: Traditional Software vs. AI — The Fundamental Difference
**Visual:** Two-column comparison table
**Content:**
- **Traditional Software:** Humans write explicit rules → Computer follows rules → Output
- **AI Software:** Humans provide examples/data → AI finds the rules itself → Output
- Traditional: "IF deal size > $50K AND deal age > 30 days THEN flag as at-risk"
- AI: "Here are 10,000 past deals. You figure out what makes a deal at-risk."
**Speaker Notes:** This slide is the most important conceptual moment in the whole lecture. Spend extra time here. The shift from rule-writing to example-giving is what makes AI different from all software that came before it.

---

### Slide 5: A Quick History of AI (The Exam-Relevant Parts)
**Visual:** Horizontal timeline from 1950 to today
**Content:**
- **1950:** Alan Turing proposes the Turing Test — "Can a machine think?"
- **1956:** Term "Artificial Intelligence" coined at Dartmouth Conference
- **1980s–90s:** Expert systems (rule-based AI) — promising but brittle
- **2006:** Deep learning resurgence — Geoffrey Hinton's work on neural networks
- **2012:** ImageNet breakthrough — deep learning beats human performance on image recognition
- **2017:** Transformer architecture invented → foundation for modern LLMs
- **2023–present:** Generative AI explosion (ChatGPT, Salesforce Einstein Copilot, Agentforce)
**Speaker Notes:** Keep history light. The exam doesn't ask "what year was deep learning invented?" But it DOES expect you to understand that AI has gone through cycles — big promises, then "AI winters" when progress stalled, then breakthroughs. The current moment is a genuine breakthrough, not just hype.

---

### Slide 6: Narrow AI vs. General AI
**Visual:** Two icons — a chess piece (Narrow AI) and a human silhouette (General AI / AGI)
**Content:**
- **Narrow AI (Weak AI):** Designed to do ONE task extremely well
  - Examples: Chess engines, spam filters, face recognition, recommendation engines
  - ALL of today's commercial AI is narrow AI
- **General AI (AGI):** A system that could do ANY cognitive task a human can
  - Does not exist yet
  - Not what Salesforce Einstein does
**Speaker Notes:** This distinction is absolutely exam-critical. If a question asks about "current AI capabilities" or "what type of AI powers Einstein?" — the answer is always Narrow AI. AGI is theoretical. Every real AI product you'll ever use in your career today is narrow AI doing one job really well.

---

### Slide 7: Types of AI Systems in the Real World
**Visual:** Four quadrant grid showing categories
**Content:**
- **Reactive Machines:** No memory, just responds (Deep Blue chess computer)
- **Limited Memory:** Uses recent data to improve (self-driving cars, recommendation engines)
- **Theory of Mind:** Understands human emotions/intentions (research stage only)
- **Self-Aware AI:** Conscious AI (science fiction)
- **Salesforce AI today = Limited Memory category**
**Speaker Notes:** Einstein Lead Scoring, for example, uses historical data about past leads to predict future ones. That's "limited memory" — it learns from past examples and applies that to new situations. Students don't need to memorize all four types, but knowing that Salesforce sits in the "limited memory" bucket helps them answer scenario questions correctly.

---

### Slide 8: Where AI Lives in Everyday Technology
**Visual:** Collage of familiar apps and services
**Content:**
- Netflix: "Because you watched..." recommendations
- Google Maps: Traffic prediction and rerouting
- Gmail: Smart Reply, spam filter
- Spotify: Discover Weekly playlist
- Your bank: Fraud detection
- Amazon: "Customers also bought..."
- All of these = AI making predictions from patterns in data
**Speaker Notes:** The goal of this slide is to make AI feel FAMILIAR. Students use AI dozens of times a day without thinking about it. The spam filter that caught 12 junk emails this morning — that's AI. When that becomes real to them, the Salesforce concepts land much more naturally.

---

### Slide 9: AI Inside the Salesforce Platform
**Visual:** Salesforce Einstein logo with radiating product names
**Content:**
- **Einstein (since 2016):** Salesforce's AI layer built into the CRM
- **Einstein Lead Scoring:** Predicts which leads are most likely to convert
- **Einstein Opportunity Scoring:** Predicts which deals will close
- **Einstein Case Classification:** Automatically routes support cases
- **Einstein Bots:** Conversational AI for customer service
- **Einstein Copilot (now Agentforce):** Generative AI assistant built into Salesforce
- **Prompt Builder:** Tools to customize AI prompts within Salesforce
**Speaker Notes:** Spend real time here. This is the "why does any of this matter to me" moment. Einstein isn't something separate from Salesforce — it's baked into every cloud. Sales Cloud, Service Cloud, Marketing Cloud — they all have Einstein features. And now with Agentforce, Salesforce is moving from AI that suggests to AI that actually takes action. That shift is a major exam theme.

---

### Slide 10: The Three Core AI Capabilities Salesforce Talks About
**Visual:** Three icons — crystal ball, chatbot, robot arm
**Content:**
- **Predictive AI:** Uses historical data to predict future outcomes (Einstein Scoring)
- **Generative AI:** Creates new content — text, code, emails (Einstein Copilot, Prompt Builder)
- **Autonomous AI (Agents):** Takes action on your behalf (Agentforce)
- The exam will test that you know which Salesforce products belong in each category
**Speaker Notes:** These three categories will come up again and again throughout this course. Predictive AI has been in Salesforce since 2016. Generative AI was added around 2023. Autonomous AI via Agentforce is the newest frontier. Think of it as an evolution — AI went from "predicting" to "generating" to "doing."

---

### Slide 11: Key Vocabulary — Know These Cold
**Visual:** Flashcard-style definitions
**Content:**
- **Algorithm:** A set of rules/instructions a computer follows
- **Model:** An AI system trained on data that makes predictions
- **Training Data:** The examples used to teach an AI model
- **Inference:** When a trained model makes predictions on new data
- **Feature:** An input variable the model uses to make predictions (e.g., lead industry, company size)
- **Label:** The output the model is predicting (e.g., "converted" or "not converted")
**Speaker Notes:** These words will appear in exam questions without definition. Students need to recognize them immediately. Take 2 minutes to have them write these down or screenshot this slide. Coming back to vocabulary in context throughout the course reinforces them.

---

### Slide 12: Lecture Summary
**Visual:** Clean recap slide
**Content:**
- AI = teaching computers to perform tasks that require human judgment, by learning from examples
- Traditional software follows explicit rules; AI discovers its own rules from data
- All commercial AI today is Narrow AI — designed for one specific task
- Salesforce Einstein is AI embedded into the CRM — predictive, generative, and now autonomous
- Key vocabulary: algorithm, model, training data, inference, feature, label
**Speaker Notes:** Quick verbal recap. Then bridge to Lecture 2 — "Now that you know WHAT AI is, the next lecture digs into the different ways AI actually learns. There are three main flavors, and the exam tests all three."

---

## RECORDING SCRIPT

Hey, welcome to Section 1 of your Salesforce AI Associate prep course. I'm genuinely excited about this section because everything else we cover in this course builds on what we're going to talk about here. So let's make sure the foundation is rock solid.

Let me start by asking you a question: when you hear the words "artificial intelligence," what do you picture? If you're like most people, somewhere in the back of your mind there's probably a scene from a movie — maybe a robot with glowing eyes, or HAL 9000 from 2001: A Space Odyssey, or maybe the Terminator. And look, those are great movies. But that version of AI? It has almost nothing to do with the AI on your Salesforce AI Associate exam.

The AI we're going to talk about is far less dramatic and far more useful. It's the thing that figured out you might like that second Netflix show. It's the reason your email inbox isn't completely buried in spam. It's what tells Google Maps to reroute you before you even know there's traffic ahead. That's real AI. And that's exactly the kind of AI that lives inside Salesforce.

So let's start with a clean definition. Artificial Intelligence is the simulation of human intelligence processes by machines. That word "simulation" is doing a lot of work. AI doesn't actually understand anything the way you and I understand things. It finds patterns in data, and it applies those patterns to new situations. That's it. That's the magic. Pattern recognition at scale, done very fast, on very large amounts of data.

Now, here's the thing that really matters — and I want you to lock this in because it's the conceptual shift that separates someone who understands AI from someone who's just memorized definitions.

**Traditional software works like this:** A human programmer sits down and writes explicit rules. "IF the lead's annual revenue is greater than one million dollars AND the lead has visited the pricing page more than twice AND the lead is in the technology industry, THEN flag this lead as high priority." The human writes the rule. The computer executes the rule. Simple.

**AI software works like this:** Instead of writing rules, you hand the system thousands of examples. "Here are 50,000 leads from the past three years. Here's whether each one converted or didn't. Now you — the AI model — figure out what patterns predict conversion." You don't write the rules. You give the AI the data, and the AI discovers the rules itself.

Think of it this way. Imagine you want to teach someone to recognize a good cup of coffee. You could write a rulebook: "beans should be X age, grind should be Y fineness, water temperature should be Z degrees." That's traditional programming. OR — you could take that person to 500 different coffee shops, let them taste each cup, and tell them "good" or "bad" after each one. Eventually, they'd develop their own taste. They'd be able to walk into a new café and just know whether the coffee was going to be good. That's machine learning. The system learned from examples rather than explicit rules.

Okay, so where did all this come from? Let me give you the extremely condensed history, just the parts that matter for your mental model.

The term "Artificial Intelligence" was coined in 1956 at a conference at Dartmouth College. For the first couple decades, researchers were optimistic — maybe overly so. They thought rule-based systems, called "expert systems," would eventually be able to replicate human expertise. And for narrow domains, they worked. But they were incredibly brittle. Add one new scenario the rules didn't cover, and the whole thing fell apart.

Then in the 2000s and especially 2012, something changed. Researchers figured out how to make neural networks — a type of AI modeled loosely on the brain — work really well on really large datasets. Suddenly AI wasn't brittle anymore. It was handling images, speech, language. And it kept getting better as you gave it more data.

That 2017 moment I mentioned — the Transformer architecture — that's what gave us ChatGPT, that's what gave us Salesforce's Einstein Copilot, that's what gave us Agentforce. We're living through one of those rare moments where a technology genuinely changes how work gets done. And the Salesforce AI Associate certification is your credential that says you understand this moment.

Now, let's talk about types of AI, because the exam is going to test something specific here.

There are two big categories: **Narrow AI** and **General AI**, sometimes called AGI — Artificial General Intelligence.

Narrow AI is designed to do exactly one thing. It does that one thing incredibly well — often better than any human — but ask it to do something different and it's completely lost. The chess engine that beats world champions can't write you an email. The spam filter that protects your inbox can't predict your sales pipeline. Every AI product you will ever use in your professional life, right now, today, is Narrow AI.

General AI — AGI — would be a system that could do any cognitive task a human can do. It could learn a new job, hold a conversation about anything, solve problems it's never seen before. AGI does not exist. It's the subject of intense research and philosophical debate. But it is NOT what Salesforce Einstein is. This is going to come up on the exam. If you see a question asking what type of AI powers Salesforce's features, the answer is Narrow AI.

Let me give you a flavor of where AI already lives in your daily life, because this is going to make the Salesforce stuff feel a lot less abstract.

Netflix: when it says "because you watched this show, you might like this one" — that's AI analyzing patterns across millions of viewers. Spotify's Discover Weekly playlist? AI figured out your taste in music by analyzing what you skip and what you replay. Your bank's fraud alert that pops up when you use your card in an unusual location? AI noticed that the transaction looked different from your normal pattern and flagged it in milliseconds. Google Maps rerouting you around traffic before the congestion even peaks? AI predicting traffic patterns based on historical data plus real-time signals.

You're already living with AI. You're already benefiting from it constantly. The Salesforce exam just wants to make sure you can name what's happening and apply those principles to a CRM context.

So let's connect all of this to Salesforce. Salesforce introduced Einstein in 2016 as their AI layer. And Einstein isn't a separate product — it's woven into every Salesforce cloud. Einstein Lead Scoring, for example, looks at historical data about your leads — what industry they're in, how they engaged with your website, what their company size is — and produces a score predicting how likely they are to convert. That's predictive AI. Einstein Case Classification looks at incoming support tickets and automatically routes them to the right team. That's AI making a classification decision.

Then around 2023, Salesforce went big on generative AI — AI that doesn't just predict, but creates. Einstein Copilot (now part of what Salesforce calls Agentforce) can draft emails for your sales reps, summarize case histories for your service agents, generate code suggestions. Prompt Builder is the tool that lets admins and developers customize how those AI prompts behave within their specific Salesforce org.

And the newest frontier — Agentforce — takes this a step further. Instead of AI that suggests, Agentforce is AI that actually takes action. An Agentforce agent can look up a customer's history, draft a proposal, send a follow-up email, and update the Salesforce record — without a human doing each step. The AI isn't just assisting, it's executing.

This is the progression you need to understand: from predictive AI, to generative AI, to autonomous AI agents. Each stage is more capable. Each stage requires more trust in the system. And the exam will test that you understand both the capabilities and the appropriate use cases for each.

Before I wrap up this lecture, let me make sure you have the vocabulary nailed down, because these words will appear in exam questions as if you already know them.

An **algorithm** is just a set of steps or rules a computer follows. A **model** is a trained AI system — it's the result of feeding data through an algorithm. Think of the model as the "brain" after it's been educated. **Training data** is the dataset of examples you used to teach the model. **Inference** is what happens when you take your trained model and point it at brand-new data — the model makes a prediction. **Features** are the inputs — the characteristics of a lead or a case or a deal that the model considers. **Labels** are the outputs — the answer the model is predicting.

This is going to be on your exam, so pay attention: when you see a scenario describing "a Salesforce admin uploaded past sales data to train a model that now predicts deal close probability" — be ready to identify which part is the training data, which part is the model, and which part is inference. The scenario question will mix those terms up.

Alright, let's recap. AI is technology that learns from examples rather than following rules humans explicitly wrote. All commercial AI today is Narrow AI — great at one job. The history of AI has had ups and downs but we're currently in a breakthrough period. Salesforce Einstein is AI embedded into the CRM, covering prediction, generation, and now autonomous action with Agentforce.

In the next lecture, we're going to go one level deeper. Now that you know what AI is and that it learns from data, the question becomes: HOW does it learn? It turns out there are three very different approaches — supervised learning, unsupervised learning, and reinforcement learning — and the exam specifically tests whether you can tell them apart and explain which one Salesforce uses for things like lead scoring. That lecture is coming right up.

---

## EXAM TIPS
- The Salesforce AI Associate exam will present scenario questions — "A company wants to predict which customers will churn. What type of AI is this?" Always check whether the scenario involves predicting a known outcome (that's supervised learning / predictive AI) vs. discovering unknown patterns.
- When asked about Salesforce AI products, remember the three tiers: Einstein for predictive AI, Einstein Copilot/Generative features for generative AI, Agentforce for autonomous AI. Match the product to the capability.
- "Narrow AI" and "Weak AI" are the same thing. The exam may use either term. Both mean AI designed for a specific task. Never confuse this with AGI (General AI), which does not exist commercially.
- Know that ALL current Salesforce AI is Narrow AI. A question that implies Einstein can do "anything a human can do" is describing something false.
- The difference between traditional software and AI software is a foundational concept. If a question asks "what makes AI different from traditional rule-based systems?" the answer involves learning from data rather than following pre-written rules.
- Vocabulary you must know cold: algorithm, model, training data, inference, feature, label. These words appear in scenario questions without being defined.

---

## LECTURE SUMMARY
- Artificial Intelligence is the simulation of human intelligence — pattern recognition and prediction from data, not rule-following
- The key distinction: traditional software follows human-written rules; AI learns its own rules from examples
- All commercial AI today is Narrow AI, designed for specific tasks — Salesforce Einstein is Narrow AI
- AI has evolved from predictive (Einstein Scoring) to generative (Einstein Copilot) to autonomous (Agentforce)
- The Salesforce platform has AI embedded at every layer — not a separate product, but woven into Sales, Service, and Marketing clouds

---

## MINI QUIZ

**Q1:** A company is using a Salesforce feature that analyzes thousands of past support tickets and their resolutions to automatically route new tickets to the correct team. Which statement BEST describes what is happening?

**A:** The system is using AI to learn patterns from historical data (past tickets and resolutions) and applying those patterns to classify new tickets — this is AI inference using a trained model.

**Explanation:** This is a classic example of predictive/narrow AI in a Salesforce context. The "past tickets and resolutions" are the training data. The system that learned from them is the model. Routing new tickets is inference. Einstein Case Classification does exactly this.

---

**Q2:** What is the fundamental difference between traditional software and AI-based software?

**A:** Traditional software follows explicit rules written by human programmers. AI-based software learns rules and patterns from data, discovering relationships the programmer did not explicitly code.

**Explanation:** This is the conceptual core of AI. If a question describes a system where a human wrote "IF X THEN Y" rules, that is traditional software. If a question describes a system that was "trained on historical data" to make decisions, that is AI.

---

**Q3:** A sales manager hears about "Artificial General Intelligence" and asks if Salesforce Einstein uses it to handle all sales tasks automatically. How should you respond?

**A:** Salesforce Einstein uses Narrow AI (also called Weak AI), not AGI. Narrow AI is designed for specific tasks like lead scoring or case classification. AGI — a system that could perform any human cognitive task — does not exist commercially and is not what powers any Salesforce product today.

**Explanation:** The exam may try to trick you by describing capabilities that sound like AGI. Real Salesforce AI is always Narrow AI. Agentforce agents are also Narrow AI — they are purpose-built for specific workflows, not general intelligence.
