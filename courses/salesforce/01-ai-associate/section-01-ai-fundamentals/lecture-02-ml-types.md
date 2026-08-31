# Lecture 2: The Three Types of Machine Learning
**Section:** Section 01 — AI Fundamentals
**Duration:** 15 minutes
**Exam Weight:** AI Fundamentals ~17% of exam (ML types are heavily tested)

---

## Learning Objectives
By the end of this lecture, students will be able to:
1. Define supervised learning, unsupervised learning, and reinforcement learning with real-world analogies
2. Identify which type of machine learning is used in specific Salesforce Einstein features
3. Distinguish between the three types when given a scenario question on the exam
4. Explain what "labeled data" means and why it matters for supervised learning

---

## SLIDES

### Slide 1: Why Machine Learning Types Matter
**Visual:** Three branching paths from a central "Machine Learning" node
**Content:**
- Machine learning is not one technique — it's a family of approaches
- The approach you use depends on: what data you have, what problem you're solving
- The Salesforce AI Associate exam specifically tests whether you can match a scenario to the right ML type
- Today: Supervised, Unsupervised, Reinforcement Learning
**Speaker Notes:** Set context. Students sometimes wonder why they need to know three different types. The answer: because the exam presents scenario questions where you must identify which type is being used. And in practice, knowing which type fits which problem is genuinely useful for any Salesforce admin or architect.

---

### Slide 2: The Big Picture — What All Three Have in Common
**Visual:** Simple diagram showing Data → Learning Algorithm → Model → Prediction
**Content:**
- All three types of ML involve an algorithm that learns from data
- The difference is in the TYPE of data and the TYPE of feedback the algorithm gets
- Supervised: Learns from labeled examples (told right/wrong answers)
- Unsupervised: Learns from unlabeled data (finds structure on its own)
- Reinforcement: Learns from trial-and-error feedback (rewarded for good actions)
**Speaker Notes:** Before diving into each type, give students the conceptual frame. The question to ask about any ML scenario is: "What kind of feedback does the learning system receive?" That single question will unlock the right answer on most exam questions.

---

### Slide 3: Supervised Learning — The Concept
**Visual:** Teacher at a whiteboard with flashcards, student learning
**Content:**
- Definition: Training a model using labeled data — examples where the correct answer is already known
- "Supervised" = the training process is supervised by correct labels
- The model learns the mapping between inputs (features) and outputs (labels)
- Once trained, it predicts the label for new, unseen inputs
**Speaker Notes:** The word "supervised" is a great memory hook. Imagine a supervisor standing over the model's shoulder during training, marking every answer right or wrong. The model adjusts based on those corrections until it gets consistently good at predicting the right answer.

---

### Slide 4: Supervised Learning — The Analogy
**Visual:** Flashcard deck with "Image → Label" pairs (cat = cat, dog = dog)
**Content:**
- Classic analogy: Teaching a child to identify animals using flashcards
  - Show photo of a cat → say "cat"
  - Show photo of a dog → say "dog"
  - Repeat thousands of times
  - Eventually: show a new photo the child has never seen → child correctly says "cat" or "dog"
- The child learned the pattern from labeled examples
- That IS supervised learning
**Speaker Notes:** The flashcard analogy is sticky and effective. Every student has either been taught this way or taught someone else this way. The "labeled examples" are the flashcards. The "model" is the knowledge in the child's head after training. The "prediction" is what they say when shown a brand new card.

---

### Slide 5: Supervised Learning — Salesforce Example
**Visual:** Einstein Lead Scoring screenshot / illustration
**Content:**
- **Einstein Lead Scoring** — the textbook supervised learning example
  - Training data: Thousands of past leads with labels ("converted" = 1, "did not convert" = 0)
  - Features: Industry, company size, web activity, email engagement, deal size
  - Model learns: "Leads with these combinations of features tend to convert"
  - Inference: New lead arrives → model outputs a probability score (e.g., 87% likely to convert)
- Other Salesforce supervised learning examples:
  - Einstein Opportunity Scoring (will this deal close?)
  - Einstein Case Classification (which team should handle this ticket?)
  - Einstein Email Classification (spam or not spam?)
**Speaker Notes:** This is the most important slide in this lecture from an exam standpoint. Einstein Lead Scoring is THE canonical supervised learning example for this certification. Students need to be able to explain: what are the labels, what are the features, what is the training data, and what happens during inference. Walk through it slowly.

---

### Slide 6: Supervised Learning — Two Sub-Types
**Visual:** Fork in the road — one path labeled "Classification," one labeled "Regression"
**Content:**
- **Classification:** Predicting a category — yes/no, which group, which label
  - Examples: Will lead convert? (yes/no), Which support queue? (billing, technical, returns)
  - Einstein Case Classification = classification problem
- **Regression:** Predicting a number on a continuous scale
  - Examples: What deal size will this opportunity close at? What revenue will next quarter generate?
  - Einstein Forecasting = regression problem
- The exam may ask you to identify whether a scenario is classification or regression
**Speaker Notes:** Students don't need to go deep on the math here. The practical question is: "Is the output a category or a number?" If the AI is deciding WHICH bucket something goes into, that's classification. If it's predicting HOW MUCH of something, that's regression. Both are supervised learning.

---

### Slide 7: Unsupervised Learning — The Concept
**Visual:** Scattered colored dots that gradually cluster together
**Content:**
- Definition: Training a model on data WITHOUT labeled outcomes — the model finds structure on its own
- "Unsupervised" = no teacher, no right/wrong feedback, no labels
- The model discovers hidden patterns, groups, or relationships in the data
- You don't tell it what to look for — it tells YOU what it found
**Speaker Notes:** The conceptual leap from supervised to unsupervised is significant. With supervised learning, you know what you're looking for. With unsupervised, you hand over the data and say "tell me something interesting." This is more exploratory and discovery-oriented.

---

### Slide 8: Unsupervised Learning — The Analogy
**Visual:** A party scene where people naturally form groups without being told to
**Content:**
- Party analogy: Drop 200 strangers into a room and observe
  - Without any instructions, people naturally cluster — by age, shared interests, professional background
  - No one told them to group themselves — they did it organically
  - You walk in later and notice the patterns
- That's unsupervised learning — the algorithm notices natural groupings in data
- The technical term: **Clustering**
**Speaker Notes:** The party analogy is intuitive. Another good one: imagine a librarian given a thousand books with no genre labels. They'd start grouping naturally — "these seem similar to these," "these are clearly different from those." That pattern-finding without pre-assigned labels is the essence of unsupervised learning.

---

### Slide 9: Unsupervised Learning — Salesforce Example
**Visual:** Audience segmentation visualization — different colored customer clusters
**Content:**
- **Einstein Discovery / Customer Segmentation** — classic unsupervised learning
  - Data: Customer profiles with demographics, purchase history, engagement behavior
  - No labels — we're not telling the model "this customer is type A or type B"
  - Model finds: "There appear to be 4 natural groups of customers in your data"
  - Output: Customer segments with shared characteristics
- Other Salesforce unsupervised examples:
  - Market Basket Analysis in Commerce Cloud (which products are often bought together?)
  - Anomaly detection (which transactions look different from the normal pattern?)
  - Account clustering in Salesforce CRM Analytics
**Speaker Notes:** Unsupervised learning is powerful because it reveals things you didn't know to look for. A retail company might run unsupervised clustering on their customer base and discover a segment they didn't know existed — say, "occasional high-value buyers who only shop during promotions." That insight drives new marketing strategy.

---

### Slide 10: Reinforcement Learning — The Concept
**Visual:** A simple maze with a character trying different paths, getting rewards (+) and penalties (-)
**Content:**
- Definition: An agent learns by taking actions in an environment and receiving rewards or penalties
- No pre-labeled training data — the agent learns through trial and error
- Maximize cumulative reward over time
- The agent develops a "policy" — a strategy for what to do in any given situation
- Key terms: Agent, Environment, Action, Reward, Policy
**Speaker Notes:** Reinforcement learning is conceptually different from both supervised and unsupervised. There's no dataset to learn from upfront. The agent literally tries things, sees what happens, and adjusts. It's the most "agent-like" type of learning, which is why it's directly connected to the new era of Agentforce.

---

### Slide 11: Reinforcement Learning — The Analogy
**Visual:** A dog learning to sit with treat rewards
**Content:**
- Dog training analogy:
  - Dog tries behaviors randomly at first
  - "Sit" → owner gives treat (+reward)
  - "Jump on couch" → owner says no (-penalty)
  - Over many repetitions, dog learns: "sitting gets treats, jumping gets scolded"
  - Dog develops a policy: when owner looks at me, sit
- Same principle: AlphaGo learned to beat world champions at Go by playing millions of games against itself, receiving +1 for winning, -1 for losing
**Speaker Notes:** The dog training analogy is universally understood. The AlphaGo example is worth mentioning — DeepMind's system learned to play Go better than any human by playing millions of simulated games with itself. No human trainer labeled "this move is good" or "this move is bad" for each situation. The reward signal was simply winning or losing.

---

### Slide 12: Reinforcement Learning — Salesforce Example
**Visual:** Agentforce agent making a sequence of decisions
**Content:**
- **Agentforce Autonomous Agents** — the emerging RL connection
  - An Agentforce agent deciding what action to take next in a workflow uses RL principles
  - The agent tries actions, observes results, and learns which actions achieve goals
- **Einstein Next Best Action:**
  - Recommends the best next step for a sales rep (call, email, discount offer)
  - Learns over time which recommendations actually resulted in closed deals
  - Reward signal: "this recommendation led to a conversion" = good policy
- **Chatbot optimization** — testing which response paths lead to customer satisfaction
**Speaker Notes:** Reinforcement learning is the most advanced type and also the most exciting for the Agentforce era. As Salesforce moves toward fully autonomous AI agents that can take multi-step actions, RL becomes the conceptual backbone. The exam currently focuses more on supervised and unsupervised learning, but RL is increasingly relevant as Agentforce matures.

---

### Slide 13: Side-by-Side Comparison (Exam Cheat Sheet)
**Visual:** Three-column comparison table
**Content:**

| | Supervised | Unsupervised | Reinforcement |
|---|---|---|---|
| **Data** | Labeled (input + correct output) | Unlabeled (input only) | No dataset — environment feedback |
| **Goal** | Predict known outcomes | Discover unknown patterns | Maximize cumulative reward |
| **Feedback** | Explicit labels (right/wrong) | No feedback — self-organized | Reward/penalty signals |
| **Use Case** | Lead scoring, case routing | Customer segmentation, anomaly detection | Recommendation optimization, autonomous agents |
| **Salesforce Example** | Einstein Lead Scoring | CRM Analytics clustering | Einstein Next Best Action, Agentforce |

**Speaker Notes:** This table is exam gold. Students should screenshot this or copy it to their notes. Scenario questions on the exam often give you a business situation and ask which type of ML is being used. The three columns of this table are your answer key.

---

### Slide 14: How to Crack Scenario Questions on the Exam
**Visual:** Decision flowchart
**Content:**
- Step 1: Does the scenario mention training on examples WITH known outcomes (labeled data)?
  - YES → Supervised Learning
- Step 2: Does the scenario mention finding hidden patterns or groupings WITHOUT predefined categories?
  - YES → Unsupervised Learning
- Step 3: Does the scenario mention an agent that tries actions and receives rewards/feedback from results?
  - YES → Reinforcement Learning
- If still unsure: Is the output a prediction of something we already know how to measure? → Supervised
**Speaker Notes:** Give students this decision tree and make them practice with it. The exam scenario questions are written to be distinguishable — they always give you a clear signal for which type to choose. The skill is learning to spot the signal words: "labeled data" → supervised, "discovered segments" or "found patterns" → unsupervised, "reward" or "agent takes action" → reinforcement.

---

### Slide 15: Lecture Summary
**Visual:** Clean recap
**Content:**
- Three types: Supervised (learns from labels), Unsupervised (finds patterns), Reinforcement (learns from rewards)
- Supervised learning powers most Salesforce Einstein features — lead scoring, case classification, opportunity scoring
- Unsupervised learning drives customer segmentation, anomaly detection, data discovery
- Reinforcement learning is behind recommendation optimization and the future of autonomous Agentforce agents
- Exam strategy: Find the signal word — "labeled," "patterns/clusters," "rewards/actions"
**Speaker Notes:** Wrap up with energy. Tell students this lecture is one of the most directly exam-testable in the entire course. Coming up next: neural networks and deep learning — the technology underneath all of this.

---

## RECORDING SCRIPT

Welcome back. In the last lecture, we established that AI is essentially a system that learns from data rather than following rules that humans pre-wrote. Now the logical question is: okay, but HOW does it learn? What's the mechanism?

And here's where it gets really interesting, because it turns out there isn't just one way. There are three fundamentally different approaches to machine learning, and they're suited to very different kinds of problems. The Salesforce AI Associate exam is going to test all three — and it's going to test them in a specific way: it'll give you a scenario, describe a business problem or a Salesforce feature, and ask you to identify which type of machine learning is at work.

So in this lecture, we're going to build a real mental model for each type, connect each one to a concrete real-world analogy, and then map each one to specific Salesforce features. By the end, you're going to be able to crack almost any ML scenario question the exam throws at you.

Let's start with the most common, most widely used type.

---

**Supervised Learning**

Supervised learning is called "supervised" because the training process has a supervisor — someone or something that tells the model whether each answer is right or wrong. The way this works is: you take a large dataset of examples where you ALREADY KNOW the correct answer, and you train a model to learn the relationship between the inputs and those known answers.

Here's an analogy I really like. Think about how you learned to identify animals as a kid. Maybe your parents gave you a set of flashcards. They showed you a picture of a cat and said "cat." Showed you a picture of a dog and said "dog." Over and over and over. Eventually, they held up a flashcard you'd never seen before — a different cat, photographed in a different place, maybe in weird lighting — and you immediately said "cat." You didn't need to be told that time. You'd learned the pattern.

That is supervised learning. The flashcards are the labeled training data. Each card has an input (the image) and a label (the answer). The model — in the analogy, that's your brain — learned the mapping between inputs and labels. And once trained, it could generalize to new inputs it had never seen.

Now let me translate that directly to Salesforce. The best example is **Einstein Lead Scoring**.

Here's how it works in practice. Salesforce takes your historical lead data — thousands or tens of thousands of past leads — and each lead comes with the outcome: did this lead convert to a customer, yes or no? That outcome is the label. The inputs — called "features" — are all the information about each lead: the industry, the company size, how many times they visited your website, whether they opened your emails, what content they downloaded.

Einstein runs supervised learning on that dataset. The model sees a lead with "technology company, 500 employees, visited pricing page 3 times, opened 5 emails" and it was labeled "converted." It sees another lead with "retail company, 10 employees, no website visits, no email opens" and it was labeled "did not convert." Over millions of these examples, the model starts to understand which combinations of features predict conversion.

Then, when a brand-new lead comes in — one the model has never seen before — it looks at that lead's features and outputs a probability. "This lead has an 87% chance of converting." That's inference. The model was trained on labeled past data and is now making predictions on unlabeled new data.

This is going to be on your exam so pay attention: Einstein Lead Scoring is supervised learning. Einstein Opportunity Scoring is supervised learning. Einstein Case Classification — which routes support tickets to the right team — is supervised learning. Any time Salesforce is predicting a known, definable outcome using historical examples, you're looking at supervised learning.

One more thing about supervised learning: there are two flavors. **Classification** is when the output is a category — yes or no, which team, which bucket. Einstein Case Classification is a classification problem. **Regression** is when the output is a number — how much, how many, what revenue. Einstein Forecasting predicts revenue as a number, so that's regression. Both are supervised learning. The exam may ask you to distinguish between them, and the question to ask is: "Is the model predicting a category, or a continuous number?"

---

**Unsupervised Learning**

Okay, shift gears. Unsupervised learning is what happens when you DON'T have labels. You have data, but you don't have pre-defined correct answers. And instead of predicting known outcomes, you're asking the model to discover hidden structure in the data.

The key word here is "discover." You're not telling the model what to look for. You're handing it data and saying: "I don't know what patterns exist in here — YOU go find them."

Here's my favorite analogy for this. Imagine you're hosting a party with 200 strangers. You don't give them any instructions. You just let them mingle. Thirty minutes later, you look around the room and you notice something interesting. Over by the bar, there's a cluster of people who are obviously talking about sports. In the corner by the window, there's a group deep in conversation about startups. Near the food table, there are people who clearly all have kids in the same school. Nobody organized these groups. Nobody labeled these people as "sports fans" or "entrepreneurs" before they arrived. They just naturally gravitated toward people they had something in common with.

That's unsupervised learning. The algorithm looks at your data points, notices which ones are similar to each other, and groups them. This is called clustering.

In a Salesforce context, think about customer segmentation. Say you run an e-commerce company and you have a database of 50,000 customers. Each customer has data: purchase frequency, average order value, categories of products they buy, time since last purchase, geographic region. But you don't have labels. Nobody has pre-categorized your customers as "type A," "type B," "type C."

You run unsupervised clustering on this dataset and the model comes back and says: "I found four natural groups in your data. Group 1: customers who buy frequently, high average order value, recently active. Group 2: customers who buy infrequently but spend a lot when they do. Group 3: customers who used to be active but haven't purchased in six months. Group 4: low-value, low-engagement customers."

You didn't tell it to find those groups. It found them. And now you have a customer segmentation you can use for targeted marketing campaigns in Salesforce Marketing Cloud. That's the power of unsupervised learning — it reveals things you didn't know to look for.

Other unsupervised learning applications in Salesforce: anomaly detection — flagging transactions or account behaviors that look different from the normal pattern. Einstein Discovery can surface unexpected correlations in your CRM data that you didn't ask about. Market basket analysis in Commerce Cloud — finding which products tend to be bought together, without being told in advance which products to pair.

The signal words for unsupervised learning on the exam: "segments," "clusters," "groups," "discovered patterns," "no predefined categories," "hidden relationships." If you see those phrases in a scenario, you're looking at unsupervised learning.

---

**Reinforcement Learning**

The third type is the most different. Reinforcement learning doesn't use a training dataset at all, at least not in the traditional sense. Instead, there's an agent — a software entity — that takes actions in an environment, observes what happens, and receives a reward signal. The goal of the agent is to learn which actions maximize the reward over time.

Think of teaching a dog a new trick. When the dog sits on command, you give it a treat. Reward. When the dog jumps on the couch, you firmly say no. Penalty. The dog doesn't read a rulebook about sitting. It doesn't look at labeled examples of "correct sitting posture." It tries things, sees what happens, and adjusts. Over time, it figures out: "sitting when a human makes eye contact leads to treats. That is a good policy."

Reinforcement learning works the same way. A famous real-world example is AlphaGo, the AI that learned to play the board game Go better than any human world champion. AlphaGo didn't learn from labeled examples of "good moves" and "bad moves." It played millions of games against itself. Win = +reward. Lose = -penalty. Over millions of games, it discovered strategies that humans had never seen before. It developed a policy — a set of rules for what to do in any board position — entirely through trial and error.

Now, how does this connect to Salesforce? Think about **Einstein Next Best Action**. This Salesforce feature recommends what a sales rep should do next — send a specific email template, offer a discount, schedule a call. Over time, the system learns which recommendations actually led to conversions and which didn't. That's a reward signal — "this recommendation worked" versus "this recommendation didn't." The system gradually learns a better policy: "in this type of situation with this type of customer, recommending X leads to the best outcomes."

And here's where it gets really exciting: this is directly connected to the future of **Agentforce**. Agentforce autonomous agents take a sequence of actions to accomplish a goal — looking up customer data, drafting an email, updating a Salesforce record, scheduling a follow-up. The agent needs to learn: what sequence of actions, in what order, leads to the best outcomes? That's a reinforcement learning problem. As Agentforce matures, RL principles become more and more central to how Salesforce AI works.

The signal words for reinforcement learning on the exam: "agent," "reward," "trial and error," "learns from actions," "policy," "environment feedback." Any time you see an AI that takes actions and learns from whether those actions worked, that's reinforcement learning.

---

**The Exam Strategy — How to Tell Them Apart**

Let me give you a decision tree that will get you through almost any scenario question on the exam.

Ask yourself: Does the scenario describe training on examples where the correct answer is already known? Did someone label the data? Did the system learn from "this lead converted" or "this ticket went to the billing team"? If yes — **supervised learning**.

Does the scenario describe an AI that found groups, segments, or patterns in data without being told what to look for? Did the output "discover" something that wasn't pre-defined? If yes — **unsupervised learning**.

Does the scenario describe an agent that takes actions, observes results, and adjusts its behavior based on rewards or feedback? Is there trial-and-error involved? If yes — **reinforcement learning**.

And if you're stuck between supervised and unsupervised, ask this: "Did someone have to label the training data beforehand?" If a human had to go through and say "this is a positive example, this is a negative example," it's supervised. If the data was just... data, and the model found structure on its own, it's unsupervised.

Here's a quick practice scenario. "Salesforce CRM Analytics analyzed a company's entire customer database and identified four distinct groups of customers based on purchase behavior, without the company specifying the groups in advance." Which type of ML is this?

The signal is "identified groups without specifying in advance." No labels. No predefined categories. The model discovered the groupings. That's **unsupervised learning**. Specifically, clustering.

One more. "Einstein Lead Scoring was trained on two years of historical lead data, including whether each lead ultimately became a customer. It now assigns scores to new leads predicting their likelihood to convert." Which type?

Training on historical examples with known outcomes — "whether each lead became a customer" is the label. Predicting a known outcome on new data. That's **supervised learning**.

---

Let's bring it all home. Three types of machine learning. Supervised learns from labeled examples to predict known outcomes — Einstein Lead Scoring, Case Classification, Opportunity Scoring. Unsupervised discovers hidden patterns in unlabeled data — customer segmentation, anomaly detection, market basket analysis. Reinforcement learns from trial-and-error feedback — Einstein Next Best Action, Agentforce autonomous agents.

Coming up in the next lecture, we're going to look at the technology that powers all of this at a deeper level — neural networks and deep learning. What is a neural network, how does it learn, and why does it matter that Salesforce uses deep learning models? That's coming up next.

---

## EXAM TIPS
- The most common supervised learning exam question involves Einstein Lead Scoring. Know the full story: historical lead data is the training data, "converted or not" is the label, feature input → probability score is inference.
- Unsupervised learning exam questions almost always involve the word "discovered," "segments," "clusters," or "patterns." If the scenario says the AI FOUND something that wasn't pre-defined, it's unsupervised.
- Reinforcement learning questions are less common on the current exam but increasing. Signal words: "agent," "takes action," "reward signal," "trial and error," "policy."
- Know the sub-types of supervised learning: classification (predicting a category) vs. regression (predicting a number). If the exam gives you a scenario where the output is "which team handles this?" that's classification. If the output is "how much revenue this quarter?" that's regression.
- A common trap question: "An AI analyzed customer data to predict whether a customer would churn." This is supervised learning (predicting a known binary outcome), NOT unsupervised — even though "analyzing customer data" sounds like discovery. The key is that churn is a predefined labeled outcome.
- Another trap: "The AI found that customers fall into three groups." This is unsupervised — groups were FOUND, not predicted. If instead the question said "the AI predicted which of three pre-defined customer tiers a new customer belongs to," THAT would be supervised (classification).

---

## LECTURE SUMMARY
- Supervised learning: trained on labeled data to predict known outcomes — the most common type in Salesforce Einstein features
- Unsupervised learning: finds hidden patterns or groupings in unlabeled data — customer segmentation, anomaly detection
- Reinforcement learning: agent learns through trial-and-error with reward signals — recommendation optimization, autonomous agents
- Salesforce Einstein Lead Scoring, Case Classification, and Opportunity Scoring are all supervised learning
- On exam scenario questions: look for signal words — "labeled," "converted/not converted," "predefined outcome" = supervised; "discovered segments," "found patterns" = unsupervised; "agent," "reward," "trial and error" = reinforcement

---

## MINI QUIZ

**Q1:** A Salesforce admin sets up Einstein Case Classification by uploading five years of support ticket history, including which department resolved each ticket. The model now automatically routes new tickets. What type of machine learning is this, and what is the "label" in this scenario?

**A:** This is supervised learning. The label is the department that resolved each ticket — it is the known outcome used to train the model. New tickets arriving are the inference step where the trained model predicts the correct routing.

**Explanation:** The historical tickets with their resolutions are labeled training data. The model learned the pattern between ticket content (features) and resolution department (label). This is classification — a sub-type of supervised learning — because the output is a category (which department), not a number.

---

**Q2:** A marketing team uses Salesforce CRM Analytics to analyze their 200,000-customer database. The tool identifies five distinct customer groups based on purchasing behavior, geographic region, and engagement frequency. No one pre-defined these groups. What type of machine learning was used?

**A:** Unsupervised learning (specifically, clustering). The key signal is that the groups were discovered by the algorithm without any pre-defined labels or categories. The marketing team did not tell the system what groups to find — it found them independently.

**Explanation:** If the marketing team had said "sort customers into Bronze, Silver, and Gold tiers based on these rules," that would be traditional software or supervised learning. The fact that the groups emerged from the data without prior definition is the hallmark of unsupervised clustering.

---

**Q3:** Einstein Next Best Action recommends sales follow-up strategies to reps and tracks which recommendations led to closed deals. Over time, it refines its recommendations to suggest actions with higher historical success rates. Which type of machine learning is most closely described here?

**A:** Reinforcement learning. The system takes actions (recommendations), observes outcomes (deal closed or not), and uses that feedback signal to improve its policy (which recommendations to make in similar situations in the future).

**Explanation:** While supervised learning also learns from historical data, reinforcement learning is characterized by the agent-action-reward loop. The system isn't just predicting from a fixed training set — it's continually learning from the outcomes of its own recommendations, adjusting its strategy over time. This is the RL pattern.
