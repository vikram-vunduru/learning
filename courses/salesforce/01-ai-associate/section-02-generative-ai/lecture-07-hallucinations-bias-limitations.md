# Lecture 7: Hallucinations, Bias, and Limitations of AI
**Section:** Section 02 — Generative AI
**Duration:** 12 minutes
**Exam Weight:** ~10% of AI Associate exam (Ethics & AI Limitations domain)

---

## Learning Objectives
By the end of this lecture, students will be able to:
1. Define AI hallucination and explain why it happens at a fundamental level
2. Distinguish between training data bias and feedback loop bias with real examples
3. Describe how the Salesforce Einstein Trust Layer helps mitigate hallucinations and bias in enterprise contexts
4. Recognize exam scenarios that describe hallucination vs. bias behaviors

---

## SLIDES

### Slide 1: The Confident Liar — What Is an AI Hallucination?
**Visual:** A cartoon robot confidently holding up a made-up newspaper headline. The headline reads: "Mount Everest Located in Central Ohio."
**Content:**
- AI hallucination = when an AI generates false information presented as fact
- The AI does not know it is wrong
- It sounds completely confident and fluent
- This is not a bug — it is a fundamental characteristic of how LLMs work

**Speaker Notes:** Open with the newspaper visual and ask: "What would you think if a very confident, very articulate colleague came to you and presented you with completely made-up facts — stated as if they were totally true? That's essentially what an AI hallucination looks like."

---

### Slide 2: A Real Example of Hallucination
**Visual:** Split screen — a lawyer's real court brief on the left, a ChatGPT-generated case citation on the right with a red "DOES NOT EXIST" stamp
**Content:**
- 2023: New York lawyers submitted a brief citing AI-generated court cases
- Cases were completely fabricated — but the citations looked real
- The AI invented case names, judges, dates, and legal holdings
- The lawyers faced sanctions from the court
**Speaker Notes:** This is the most famous real-world example of AI hallucination causing real harm. Walk through what happened step by step. Emphasize: the output sounded authoritative. The formatting was perfect. The citations looked exactly like real citations. There was no warning, no asterisk, no "I'm not sure about this."

---

### Slide 3: Why Does Hallucination Happen? The Probability Engine
**Visual:** A wheel of fortune spinner with words — "The", "quick", "brown", "fox" — each with a percentage. Next spin: "flew" (5%), "ran" (40%), "jumped" (55%). Arrow lands on "ran."
**Content:**
- LLMs are not "looking up facts" — they are predicting the next most likely word
- They are trained on patterns, not truth
- When the model doesn't know something, it doesn't say "I don't know" — it fills in the gap with what statistically sounds right
- It has no internal "fact-checker"
**Speaker Notes:** "Here's the core insight that explains everything about why AI hallucinations happen. A language model is fundamentally a prediction engine. It asks one question over and over: given everything that came before, what word should come next? It learned this by reading billions of web pages, books, and articles. So it's very good at predicting what a sentence about, say, a legal case should sound like. But sounding like a legal case citation and being a real legal case citation are two completely different things. The model cannot tell the difference."

---

### Slide 4: Hallucination — The Three Root Causes
**Visual:** Three columns labeled: 1) No ground truth, 2) Training data gaps, 3) Overconfidence by design
**Content:**
- **No ground truth:** The model was never taught "this is a fact, this is not"
- **Training data gaps:** If the real answer wasn't in the training data, the model guesses
- **Overconfidence by design:** Models are fine-tuned to sound helpful and decisive — not to say "I don't know"
**Speaker Notes:** "Let me break down the three reasons hallucinations happen. First, the model was never given a reference library of verified facts. Second, if the specific answer just wasn't in the training data — maybe it's too recent, too specialized, too obscure — the model bridges the gap by generating something plausible. Third, and this is subtle: when we train these models with human feedback, we often reward confident, complete-sounding answers. So the model learns that saying 'I'm not sure' gets a worse score than giving an answer. We accidentally trained it to sound confident even when it's guessing."

---

### Slide 5: What Is AI Bias? The Mirror Problem
**Visual:** A mirror reflecting a skewed image — the mirror has cracks labeled "incomplete data," "historical inequity," "feedback loops"
**Content:**
- AI bias = the model produces outputs that systematically favor or disadvantage certain groups
- Bias comes from the data used to train the model
- If the training data reflects human prejudice, the model learns that prejudice
- Bias can be subtle and hard to detect
**Speaker Notes:** "Now let's talk about something arguably more dangerous than hallucination: AI bias. If hallucination is the AI making things up, bias is the AI faithfully learning something harmful that was already present in the world. Think of it like a mirror. A mirror doesn't lie — it shows you what's in front of it. But if the world it's reflecting is biased, the model reflects that bias right back."

---

### Slide 6: Training Data Bias — Learning Prejudice from History
**Visual:** Timeline of historical job ads showing only men in engineering roles → model trained on this data → model outputs "he" when asked to describe an engineer
**Content:**
- Training data bias: the input dataset contains historical or societal inequities
- Example: Resume screening AI trained on past hiring decisions
- If historically men were hired for tech roles, the model learns to prefer male candidates
- Amazon actually scrapped a recruiting tool for exactly this reason (2018)
**Speaker Notes:** "Here's a real, documented example. Amazon built an AI recruiting tool to screen resumes. They trained it on 10 years of their own hiring data. The problem? Their historical hiring data was biased — it reflected a tech industry where men were disproportionately hired. So the model learned that being male, or attending an all-male college, or having the word 'men's' in your resume (like 'captain of the men's chess club') was a positive signal. The model was penalizing resumes submitted by women. Amazon caught this and scrapped the tool. But imagine if they hadn't."

---

### Slide 7: Feedback Loop Bias — When AI Teaches Itself to Be More Biased
**Visual:** A hamster wheel diagram — "biased output" feeds "user accepts it" feeds "reinforcement signal" feeds "model doubles down" — cycling endlessly
**Content:**
- Feedback loop bias: when users interact with biased outputs, those interactions train the model further
- The model's own outputs become future training data
- Bias compounds over time
- Also called "model collapse" or "amplification bias"
**Speaker Notes:** "Training data bias is bad enough, but feedback loop bias is when things can spiral. Here's how it works: suppose a model has a subtle bias — maybe it's more likely to show loan approval predictions for certain zip codes. Users see those outputs. Some users rate those outputs as helpful or correct because the predictions match their existing assumptions. That positive feedback signal gets baked into the next version of the model, which now shows that bias even more strongly. And the cycle continues. The model didn't get more biased because someone was malicious. It got more biased because each interaction reinforced the existing pattern."

---

### Slide 8: Harmful AI Bias in the Real World
**Visual:** Three news headline cards: 1) Facial recognition misidentifying dark-skinned faces, 2) Predictive policing software over-targeting minority neighborhoods, 3) Healthcare algorithms under-treating Black patients
**Content:**
- MIT Study (2018): facial recognition from top vendors had 0.8% error rate for light-skinned men vs. 34.7% for dark-skinned women
- Predictive policing tools in several US cities were shown to disproportionately flag minority neighborhoods
- A widely-used healthcare algorithm deprioritized Black patients for care management programs because it used healthcare spending as a proxy for health need
**Speaker Notes:** "These are not hypothetical examples. Let me walk through each. The MIT study, known as Gender Shades, tested commercial facial recognition from Microsoft, IBM, and Face Plus Plus. The systems worked great for white men. They were almost five times more likely to misidentify dark-skinned women. Why? Because the training datasets were mostly white faces. The model learned faces primarily from that demographic. The healthcare algorithm is especially troubling — the company wasn't trying to be biased. They used 'how much has this person spent on healthcare' as a proxy for 'how sick is this person.' But Black patients, who face economic barriers to accessing care, spent less on healthcare on average — so the model incorrectly concluded they were healthier."

---

### Slide 9: How the Salesforce Einstein Trust Layer Mitigates These Risks
**Visual:** A shield icon labeled "Einstein Trust Layer" with four sections: Data Masking, Toxicity Scoring, Zero Data Retention, Audit Trail
**Content:**
- Salesforce built the Einstein Trust Layer specifically to make AI safe for enterprise use
- It sits between your Salesforce data and the LLM
- It addresses both hallucination risk and bias risk
- It is built into every Einstein and Agentforce feature
**Speaker Notes:** "Now let's connect this to Salesforce specifically. Salesforce recognized that hallucinations and bias are serious risks for enterprise customers — companies that are using AI to make decisions about loans, support cases, hiring, medical records. They built what they call the Einstein Trust Layer as a protective layer that sits between your company's data and the AI model. Think of it as a safety membrane. We will go very deep on this in the next lecture, but let me give you a preview of how it addresses the problems we've been talking about."

---

### Slide 10: Trust Layer and Hallucination — Grounding to Reality
**Visual:** Diagram showing "prompt goes in → Trust Layer injects CRM data context → grounded prompt sent to LLM → grounded response returned"
**Content:**
- Grounding: the Trust Layer injects real, current data from your CRM into the prompt
- Instead of the LLM guessing, it is given the actual facts
- Example: "Here is the customer's account history, their open cases, their recent purchases — now generate a response"
- This dramatically reduces hallucination because the model is working from real data, not memory
**Speaker Notes:** "One of the biggest ways Salesforce fights hallucination is through something called grounding. Instead of just sending a vague prompt to an LLM and hoping for accurate output, the Einstein Trust Layer retrieves real data from your Salesforce org — actual customer records, real account history, live case data — and injects that into the prompt before it ever reaches the LLM. Now the model isn't guessing. It's reading real facts and generating a response based on those facts. It's like the difference between asking someone to describe your house from memory versus handing them a floor plan and photos."

---

### Slide 11: Trust Layer and Bias — Toxicity Scoring and Data Masking
**Visual:** Pipeline diagram showing "raw prompt → toxicity check → PII stripped → clean prompt → LLM → response → toxicity check → delivered to user"
**Content:**
- Toxicity Scoring: incoming prompts and outgoing responses are scored for harmful content
- Outputs that score above a toxicity threshold are blocked before reaching the user
- Data Masking: personally identifiable information is stripped from prompts before they leave Salesforce
- This prevents both bias exposure and privacy violations
**Speaker Notes:** "The Trust Layer does two more important things related to bias. First, toxicity scoring. Before a response from the LLM ever reaches your end user, the Trust Layer scores it for potentially harmful, biased, or inappropriate content. If the score is too high — if the output is saying something that shouldn't be said — it gets blocked. Second, data masking. Remember, sensitive customer data in Salesforce might include race, age, gender, medical history. The Trust Layer can strip or mask those fields before the prompt goes to the external LLM. This means the LLM is not even being given data that could trigger biased outputs."

---

### Slide 12: Limitations Are Not Failures — They Are Features to Manage
**Visual:** A scale — on one side "AI capabilities" (speed, scale, pattern recognition), on the other "AI limitations" (hallucination, bias, knowledge cutoffs)
**Content:**
- AI hallucination and bias are not signs that AI is broken — they are known limitations
- Knowing the limitations allows you to build safeguards
- The Salesforce approach: use AI for what it's good at, build trust infrastructure around the limitations
- The AI Associate exam expects you to know BOTH what AI can do AND where it fails

**Speaker Notes:** "Let me close this lecture with a mindset shift. Knowing about hallucinations and bias doesn't mean AI is useless — it means you're a responsible practitioner. Every powerful tool has limitations. A chainsaw is incredible at cutting wood and terrible at cutting butter. The professionals who get the most value from AI are not the ones who pretend it's perfect. They're the ones who understand the failure modes and architect systems that account for them. Salesforce has done a lot of that work for you with the Einstein Trust Layer — but you need to understand why it exists to use it well."

---

## RECORDING SCRIPT

Hey everyone, welcome to Lecture 7. This is one of my favorite lectures in the whole course because we're going to talk about something that most AI hype cycles completely skip over: the ways AI fails, and what you should actually do about it. And honestly, understanding these limitations is going to make you a much better Salesforce practitioner than someone who just knows the buzzwords.

Let's start with a story.

In 2023, a New York attorney named Steven Schwartz was working on a case. He used ChatGPT to help with research, and ChatGPT came back with a list of legal precedents — real-sounding case citations, with judge names, dates, court holdings, everything. It looked totally legitimate. Schwartz included these citations in his actual court brief.

There was one problem.

The cases didn't exist. They were completely made up. ChatGPT had fabricated the case names, the courts, the judges, the legal reasoning — all of it. And when the opposing counsel couldn't find these cases, the judge ordered Schwartz to explain himself. He faced sanctions. His client faced consequences. It was a disaster.

Now here's the critical question: Was ChatGPT lying?

No. And this is what makes hallucination so insidious. The AI wasn't being deceptive. It had no concept of "this is real" versus "this sounds real." It was doing exactly what it was designed to do: produce the most statistically plausible next token given the context. And a legal-sounding court citation is exactly what a language model predicts should follow a request for legal precedents.

This is the definition of an AI hallucination: when an AI generates false or fabricated information presented with complete confidence as if it were true. The AI has no internal alarm bell that fires when it's making something up. It can't — it doesn't have a conception of truth. It only has patterns.

So why does this happen at a deeper level? Think of it this way. A language model is basically a very, very sophisticated autocomplete. You know how your phone predicts the next word when you're texting? Language models do that, but at an almost incomprehensible scale. They were trained on hundreds of billions of words — websites, books, Wikipedia, academic papers, Reddit threads, news articles — and from all that data they learned the statistical relationships between words and concepts.

When you ask the model a question, it doesn't go look up the answer. It generates an answer that matches the pattern of "what an answer to this type of question looks like." Usually that's fine — patterns in language often correspond to reality. But when the model encounters a question where it doesn't have good data, instead of saying "I don't know," it fills in the gap with something that sounds right.

And here's the kicker that makes this even worse: these models are trained with human feedback. Researchers showed humans different outputs and asked them to rate which responses were better. And humans consistently preferred confident, complete-sounding answers over hedged, uncertain ones. So the model learned: sound confident. Sound complete. Don't say "I don't know." That behavior was literally reinforced during training.

Now let me show you something equally important: AI bias.

If hallucination is the AI making things up, bias is the AI faithfully learning something harmful that already existed in the world. Let me give you the clearest example I know.

Amazon — yes, that Amazon — built an AI tool to help screen job resumes. They trained it on 10 years of their own hiring data. Makes sense, right? Use your best historical hires to define what a good candidate looks like. 

The problem was that their historical hiring data reflected a tech industry where, for many years, men were hired at much higher rates than women. So the model learned that certain signals — attending a male-dominated college, being in a fraternity, even using the word "executed" versus "collaborated" in your resume — were positive indicators. It learned to rank resumes from women lower. Not because anyone programmed it to be biased. Because the training data encoded the bias that already existed in hiring.

Amazon caught this and scrapped the tool entirely.

This is called training data bias. The model is a mirror. It reflects back what was in the data used to train it. If that data encodes historical inequality, the model amplifies it.

But there's a second type of bias that's even trickier: feedback loop bias. Here's how it works. Suppose a model has a small bias — maybe it's slightly more likely to recommend certain products to certain demographic groups. Users interact with these outputs. Some users rate these recommendations positively. Those positive ratings become part of the next training cycle. Now the model is even more confident in its biased pattern. The bias compounds. Over time, a small tilt becomes a strong lean.

Think about what this means for Salesforce deployments. If you build an AI-powered lead scoring model and it has even a slight initial bias toward certain types of customers, every sales rep who follows that scoring and reports success to the system teaches the model to be more biased. You have to actively monitor for this.

Let me give you three real-world examples that show how serious this gets.

First: facial recognition. An MIT researcher named Joy Buolamwini ran a study called Gender Shades. She tested commercial facial recognition from major tech companies. For light-skinned men, error rates were below 1%. For dark-skinned women, error rates shot up to nearly 35%. Why? Because the training datasets were predominantly images of white, male faces. The model learned faces primarily from that demographic.

Second: predictive policing. Several US cities deployed AI tools to predict where crimes would occur. These tools were trained on historical crime data — but historical crime data reflects where police had historically patrolled, which in many cities was disproportionately in minority neighborhoods. So the model predicted those neighborhoods would have more crime, which sent more police there, which generated more crime data, which reinforced the prediction. A self-fulfilling prophecy encoded in software.

Third: healthcare. A widely-deployed healthcare algorithm used spending on healthcare as a proxy for how sick a patient was. The assumption: sicker people spend more on healthcare. But Black patients, on average, spent less on healthcare than white patients with equivalent health conditions — because of economic barriers to accessing care. The model concluded Black patients were healthier than they actually were, and deprioritized them for care management programs. The bias had nothing to do with race explicitly — it crept in through a flawed proxy variable.

Now, here's where Salesforce comes in.

EXAM TIP: The exam will ask you to identify what the Einstein Trust Layer does in terms of safety and reliability. Know all four components: Data Masking, Toxicity Scoring, Zero Data Retention, and Audit Trail.

Salesforce built the Einstein Trust Layer because they serve enterprise customers — banks, hospitals, insurance companies, retailers — who cannot afford hallucinations in customer-facing AI, and cannot afford biased outputs in decisions that affect real people. The Trust Layer is a protective infrastructure layer that sits between your Salesforce data and whatever LLM is processing that data.

Here's how it fights hallucination. The biggest weapon is grounding. Instead of sending a vague prompt to an LLM and hoping for accurate output, the Trust Layer retrieves actual CRM data — real account history, real customer records, real open cases — and injects that into the prompt. Now the model isn't guessing. It's reading real facts. When your AI sales assistant says "Your customer last purchased in March and has an open support case," it's not making that up. It's reading it from the actual Salesforce record. The hallucination risk drops dramatically because you've replaced the model's uncertain memory with verified facts.

For bias, the Trust Layer uses toxicity scoring — every output from the LLM is analyzed for harmful content before it reaches your end user. And data masking strips personally identifiable information — including attributes like age, gender, or health status — from prompts before they ever leave your Salesforce environment. This means the external LLM is never even given the data that could trigger biased outputs.

Let me close with a mindset point.

Hallucinations and bias are not signs that AI is broken. They are known, documented limitations of current AI technology. Every competent AI practitioner knows them. The ones who cause harm are the ones who deploy AI while ignoring these limitations. The ones who do this well — the ones you want to be — are the ones who understand the limitations and build systems that account for them.

That's what Salesforce has done with the Einstein Trust Layer. They didn't pretend these problems don't exist. They built infrastructure to manage them at enterprise scale.

Alright, that's lecture 7 wrapped up. In the next lecture, we're going deep on the Einstein Trust Layer specifically — we're going to go component by component, trace exactly how data flows through it, and work through three real exam questions on this topic. The Trust Layer is the highest-weight topic in the ethics and safety domain, so you do not want to miss lecture 8.

See you there.

---

## EXAM TIPS
- The exam may describe a scenario where "an AI generates a response that sounds confident but contains incorrect information" — the answer is hallucination, not bias
- Know the difference: hallucination = AI makes something up; bias = AI has learned a skewed pattern from data
- Training data bias comes from what the model was trained ON; feedback loop bias develops AFTER deployment through user interaction signals
- The Einstein Trust Layer is Salesforce's answer to both — know its four main components for the exam: Data Masking, Toxicity Scoring, Zero Data Retention, Audit Trail
- A common exam question pattern: "Which Trust Layer feature prevents PII from being sent to an external LLM?" — Answer: Data Masking
- If an exam scenario describes AI producing outputs that systematically disadvantage a demographic group, that is bias — not hallucination

---

## LECTURE SUMMARY
- AI hallucination happens because LLMs predict statistically likely text, not verified facts — they have no internal concept of truth
- AI bias happens when models learn discriminatory patterns from training data or from feedback loops after deployment
- Real-world harms from AI bias include discriminatory hiring tools (Amazon), facial recognition failures, and healthcare algorithm disparities
- The Einstein Trust Layer addresses hallucination through grounding (injecting real CRM data) and addresses bias through toxicity scoring and data masking
- Understanding limitations is not pessimism — it is responsible AI practice and a testable domain on the AI Associate exam

---

## MINI QUIZ (3 questions with answers)

**Q1:** A Salesforce Einstein feature generates a customer email that contains a product feature that does not exist. What AI limitation does this best describe?

**A:** AI hallucination

**Explanation:** Hallucination is when an AI generates false information — in this case, a non-existent product feature — presented as fact. This is a classic hallucination scenario. It is not bias because the issue is fabricated content, not a systematic disadvantage applied to a demographic group.

---

**Q2:** An AI model trained on historical sales data consistently scores leads from certain geographic regions lower than leads from other regions, even when deal size and industry are identical. What type of AI limitation is this?

**A:** Training data bias

**Explanation:** This is training data bias. The model learned from historical data that may have encoded a regional sales bias (perhaps certain territories were historically under-resourced by the sales team). The model learned this pattern and is now perpetuating it. This is distinct from hallucination (which is about fabricating false content) and from feedback loop bias (which develops post-deployment through iterative reinforcement).

---

**Q3:** Which Einstein Trust Layer feature is specifically designed to prevent sensitive customer data from being exposed to an external large language model?

**A:** Data Masking

**Explanation:** Data Masking strips or anonymizes personally identifiable information and other sensitive data from prompts before they are sent to the external LLM. This protects customer privacy and also prevents the LLM from being given data that could trigger biased outputs. Toxicity Scoring evaluates content quality, Zero Data Retention prevents the LLM provider from storing data, and Audit Trail logs AI interactions — but Data Masking is specifically about preventing sensitive data from leaving Salesforce.
