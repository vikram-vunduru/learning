# Lecture 16: Bias in AI
**Section:** Section 4 — AI Ethics and Trust  
**Duration:** 15 minutes  
**Exam Weight:** ~10% of exam (scenario-based questions test your ability to identify the TYPE of bias)

---

## Learning Objectives
1. Define the four main types of AI bias: training data, algorithmic, feedback loop, and representation bias
2. Describe a vivid real-world example of each type
3. Explain how each type of bias can enter Salesforce AI features
4. Identify methods for detecting bias in AI outputs
5. Describe what Salesforce does to mitigate bias in Einstein features
6. Given a scenario, correctly identify which type of bias is present

---

## SLIDES

### Slide 1: Title Slide
**Visual:** A scale that's visibly unbalanced, weighted heavily to one side. Text: "Bias in AI: Where It Comes From, How to Find It, How to Fight It."
**Content:**
- Four types of bias every Salesforce professional must recognize
- Real-world stories for each
- How to identify bias type from a scenario description
- Exam format: scenario → identify the bias type

**Speaker Notes:** "The exam questions in this section are scenario-based — they describe a situation and ask you to identify what type of bias is present. To answer correctly, you need more than a definition — you need to be able to recognize the PATTERN of each bias type when it's described in real-world terms. By the end of this lecture, you'll be able to read a bias scenario and immediately categorize it."

---

### Slide 2: Why Bias in AI Is Different From Human Bias
**Visual:** Left column: "Human bias" — one person, one decision, identifiable, challengeable. Right column: "AI bias" — millions of decisions, invisible, at scale, self-reinforcing.
**Content:**
**Human bias:**
- Affects individual decisions
- Can sometimes be identified and challenged
- Limited in scale by individual capacity
- Can change when the individual is educated

**AI bias:**
- Affects EVERY decision the model makes — at scale, instantly
- Often invisible to the people it affects
- Encoded in mathematics — not open to persuasion
- Can persist and intensify over time (feedback loops)
- Often affects the most vulnerable populations the most

**Scale transforms the ethics:** A biased hiring manager harms dozens of candidates. A biased AI hiring tool harms thousands per year, invisibly.

**Speaker Notes:** "I want to be clear upfront that human beings are biased — all of us, in various ways. That's not a moral failing; it's a product of how human cognition works. But human bias at least has a human face. You can report a biased hiring manager to HR. You can ask for a different decision-maker. You can advocate for yourself. AI bias has no face. It's mathematics. You don't even know it happened to you. And it happens to everyone who goes through the same system — at once, instantly, at scale. That's what makes it a different kind of ethical challenge."

---

### Slide 3: Type 1 — Training Data Bias
**Visual:** Funnel diagram: Historical records (labeled with symbols: 80% circle/20% square) → AI model trains → AI model produces biased predictions (in favor of circles).
**Content:**
**Training Data Bias:**
- Occurs when the historical data used to train a model reflects past biases, underrepresents certain groups, or is incomplete
- The model learns the patterns in the data — including the biased patterns

**Real-world example:** Amazon's resume screening AI (covered in Lecture 15)
- Trained on 10 years of predominantly male hiring decisions
- Learned to penalize female indicators

**Salesforce example:**
- An Einstein Lead Scoring model trained in an org where leads from a specific industry or geography were historically not pursued (due to past rep bias, not lead quality)
- Einstein will score those leads LOW — not because they're worse, but because the historical data shows they didn't convert (because they were NEVER called)

**Key identifier:** The bias is IN THE DATA before the model trains

**Speaker Notes:** "Training data bias is the original sin of machine learning. The data you train on is history — and history was written by humans with all their biases intact. Amazon's case is the most famous, but it happens everywhere. Imagine a credit scoring model trained on historical loan approval data. For decades, banks systematically denied loans to certain neighborhoods — a practice called redlining. If you train a modern AI credit model on that historical data, it will learn that residents of those neighborhoods are 'high risk' — not because they are, but because the data never gave them a fair chance to prove otherwise. The AI optimized the past into the future."

---

### Slide 4: Type 2 — Algorithmic Bias
**Visual:** A decision tree where a neutral-seeming variable (e.g., "zip code") branches in ways that correlate with protected characteristics (race, income). The algorithm appears neutral but produces discriminatory outcomes.
**Content:**
**Algorithmic Bias:**
- Occurs when the model's design, architecture, or the FEATURES chosen produce biased outcomes — even if the training data was balanced
- Often involves proxy variables: neutral-seeming features that correlate with protected characteristics

**Real-world example:** COMPAS recidivism algorithm
- Used by US courts to predict likelihood of re-offending
- Found to produce higher "high risk" scores for Black defendants at nearly 2x the rate for white defendants
- The algorithm used factors like "job stability" that correlate with race and socioeconomic status

**Salesforce example:**
- A Prediction Builder model for sales territory assignment that uses "years of sales experience" as a feature
- If women have historically been excluded from senior sales roles, this feature becomes a proxy for gender, producing systematically lower scores for women even with equal qualifications

**Key identifier:** The bias emerges from the model's LOGIC or VARIABLE SELECTION — not just the data

**Speaker Notes:** "Algorithmic bias is trickier than training data bias because you can look at the training data and think 'this looks balanced' and still have a biased model. The classic mechanism is the proxy variable. A proxy variable is a seemingly neutral feature that secretly correlates with a protected characteristic like race, gender, or disability. Zip code correlates with race in the US due to housing segregation history. Credit score correlates with race. Name-recognition scores correlate with ethnicity. If your model uses any of these as features, even with balanced training data, it can produce discriminatory results. This is why feature selection — deciding which variables to include in a model — is an ethical decision, not just a technical one."

---

### Slide 5: Type 3 — Feedback Loop Bias
**Visual:** Circular diagram: AI Model Predicts → Human Acts on Prediction → Outcome Data Collected → Model Retrains on Outcomes → AI Model Predicts (circle continues). At each step, a bias indicator shows the loop amplifying over time.
**Content:**
**Feedback Loop Bias:**
- Also called "automation bias" or "self-fulfilling prophecy bias"
- Occurs when AI predictions influence human behavior, which generates new data that reinforces the original prediction
- The model's biases become self-perpetuating — and grow stronger over time

**Real-world example:**
- A predictive policing AI predicts high crime likelihood in certain neighborhoods
- Police increase patrols in those neighborhoods
- More police → more detected crime → more crime data from those neighborhoods
- AI retrains on this data → predicts EVEN HIGHER crime risk in same neighborhoods
- The prediction created the data that confirmed the prediction

**Salesforce example:**
- Einstein Lead Scoring gives low scores to leads from Sector X
- Reps deprioritize those leads (acting on the prediction)
- Leads from Sector X never convert (because they were never called)
- New model trains on this data → Sector X scores even lower
- Original bias compounds over time

**Key identifier:** Bias that grows stronger over time due to the model's outputs influencing future training data

**Speaker Notes:** "Feedback loop bias is arguably the most dangerous type because it self-reinforces. And it can be very hard to detect from inside the system. Everyone is doing their job 'correctly' — reps prioritize high-scored leads, the AI retrains on outcomes, everyone follows the numbers. But the system is spiraling away from reality. The leads from Sector X aren't actually worse — they just have the scarlet letter from the original biased model, and every cycle of prediction → action → outcome → retraining makes the scarlet letter darker. The fix requires an intervention that deliberately breaks the loop: force-testing the AI's predictions by having humans override them in a controlled sample, to see whether the outcomes actually match what the AI predicted."

---

### Slide 6: Type 4 — Representation Bias
**Visual:** A pie chart showing training data composition: 85% one demographic group, 15% others. Then accuracy bars for each group: 92% for majority group, 61% for minority groups.
**Content:**
**Representation Bias:**
- Occurs when certain groups are underrepresented in the training data
- The model performs significantly worse for underrepresented groups
- Can occur independently of intentional bias in the data — it's a data volume problem

**Real-world example:** Facial recognition accuracy gaps
- Models trained primarily on white, male faces
- Significantly higher error rates for women of color — up to 35% error rate vs. 1% for white men (MIT Media Lab study)

**Salesforce example:**
- An Einstein sentiment analysis model trained predominantly on English text from North American customers
- Model performs poorly at detecting sentiment in text from customers writing in English as a second language, or using regional expressions
- Result: customers from non-native English backgrounds get worse service because the AI misreads their emotional state

**Key identifier:** The bias shows up as UNEQUAL ACCURACY across different demographic or user groups

**Speaker Notes:** "Representation bias is sometimes the most sympathetically understandable type because it's not necessarily intentional. A small company builds an AI using their own customer data. Their customers happen to be predominantly from one demographic. The model works great for that demographic and poorly for others. It's not that anyone tried to exclude those other groups — they just weren't in the dataset. The problem is that when the company expands and starts serving a more diverse customer base, their AI is less accurate for the new customers. That asymmetry — the AI is better for the people it was trained on — is representation bias. It's solvable by intentionally collecting more diverse training data, but it requires explicitly recognizing the problem."

---

### Slide 7: Bias in Salesforce AI — Specific Scenarios
**Visual:** Four-panel scenario cards, one for each bias type, each with an Einstein feature example.
**Content:**
**Training Data Bias in Einstein Lead Scoring:**
A company trained Lead Scoring on 3 years of data from a team that only called domestic leads. International leads score consistently low. Not because they don't convert — because they never got called in the historical data.

**Algorithmic Bias in Prediction Builder:**
An admin builds an employee performance prediction using "educational institution prestige" as a feature. This correlates with socioeconomic background and potentially race.

**Feedback Loop Bias in Einstein Opportunity Scoring:**
Opportunity Scoring gives low scores to deals in the education vertical. Reps stop working those deals. Education deals rarely close. The model retrains: education vertical scores even lower.

**Representation Bias in Einstein Case Classification:**
Case Classification was trained on cases from large enterprise accounts. It misclassifies small business cases 3x more often because that category was underrepresented in training.

**Speaker Notes:** "These four scenarios are calibrated to look like exam questions. The exam will give you a scenario like one of these and ask you to identify the bias type. Practice reading these until you can immediately say: 'Training data bias — because the historical data was incomplete.' 'Feedback loop bias — because the model's outputs are influencing future training data.' 'Representation bias — because a group is underrepresented, producing unequal accuracy.' 'Algorithmic bias — because a proxy variable is creating discriminatory outcomes despite neutral-looking inputs.'"

---

### Slide 8: How to Detect Bias in AI Outputs
**Visual:** A dashboard showing model performance metrics broken down by subgroup — each metric displayed as a grouped bar chart comparing performance across demographic categories.
**Content:**
**Detection methods:**

**1. Disaggregated accuracy analysis:**
- Don't just measure overall accuracy — measure accuracy for each demographic subgroup separately
- Red flag: Large accuracy gaps between groups

**2. Outcome disparity analysis:**
- Does the AI produce different outcomes (higher/lower scores, different classifications) for different groups?
- Red flag: One group consistently receives higher risk scores, lower opportunity scores, etc.

**3. Feature audit:**
- Review which features the model uses most heavily
- Red flag: Proxy variables (zip code, educational institution, years in workforce) that correlate with protected characteristics

**4. Historical comparison:**
- Compare AI decisions to historical human decisions for the same scenarios
- Red flag: AI is replicating human decision patterns that were known to be biased

**5. A/B testing with intentional override:**
- Force the AI to surface some low-scored items and measure actual outcomes
- Red flag: Actual outcomes for "low-scored" items are similar to "high-scored" items (false negatives from bias)

**Speaker Notes:** "Detecting bias requires you to LOOK for it. This sounds obvious but it's not automatic. A model can be deployed, produce biased results for years, and never be identified as biased if nobody checks. The most important detection method is disaggregated accuracy analysis — instead of looking at your model's overall accuracy rate, break it down by subgroup. If your overall accuracy is 85% but the accuracy for Group X is 55%, you have a problem that the aggregate number was hiding. Every production AI model should have this kind of subgroup monitoring built in."

---

### Slide 9: What Salesforce Does to Mitigate Bias
**Visual:** Four-quadrant diagram: Build (diverse training data, feature review), Test (subgroup accuracy testing, red teaming), Deploy (human oversight requirements, escalation design), Monitor (audit trails, outcome monitoring).
**Content:**
**Salesforce's bias mitigation approaches:**

**At Build:**
- Curate training data to include diverse representation
- Audit features for proxy variable risk
- Require ethics review for any AI feature affecting protected characteristics

**At Test:**
- Disaggregated accuracy testing across demographic subgroups before release
- Red Team adversarial testing to find edge cases
- Model cards documenting known limitations and biases

**At Deploy:**
- Human oversight requirements for high-stakes AI decisions
- Customer guidelines in Model Cards for appropriate use contexts
- AI Acceptable Use Policy restrictions on discriminatory use

**At Monitor:**
- Audit trails for AI decisions and outcomes
- Outcome monitoring over time to detect feedback loop bias
- Mechanism for users to report suspected bias

**Speaker Notes:** "Salesforce's approach to bias mitigation is staged — they try to catch it at each phase of the AI lifecycle, not just at one checkpoint. Building diverse training data is the first defense. Testing for subgroup accuracy before release is the second. Requiring human oversight for consequential decisions is the third. Monitoring outcomes over time is the fourth. No single intervention is sufficient. Bias is a complex, multi-source problem — the mitigation has to be equally multi-layered."

---

### Slide 10: Exam Tips — Identifying Bias Type from Scenario
**Visual:** Decision flowchart. Question 1: "Is the bias in the training data?" → Yes → Training Data Bias. Question 2: "Does a proxy variable cause discrimination?" → Yes → Algorithmic Bias. Question 3: "Does the model's output influence future training?" → Yes → Feedback Loop Bias. Question 4: "Does accuracy differ across groups due to low representation?" → Yes → Representation Bias.
**Content:**
**Quick identification guide:**

| Trigger phrase in scenario | Bias type |
|---|---|
| "Historical data reflected past discrimination" | Training Data Bias |
| "The AI used a feature that correlates with race/gender" | Algorithmic Bias |
| "Model outputs influenced future data, making bias stronger" | Feedback Loop Bias |
| "Model accuracy is worse for certain demographic groups" | Representation Bias |
| "Underrepresented in the training dataset" | Representation Bias |
| "The model retrains and performs even worse over time" | Feedback Loop Bias |
| "Seems neutral but correlates with a protected characteristic" | Algorithmic Bias |

**Speaker Notes:** "Use this table as your exam answer key for bias type questions. Read the scenario, find the trigger phrase, match to the bias type. The exam scenario will always contain a tell — a phrase that describes the MECHANISM of bias. Your job is to recognize the mechanism and name the category."

---

## RECORDING SCRIPT

[Opening — 0:00-2:00]

"I want to try something different to open this lecture. I'm going to give you four mini-scenarios, and I want you to just sit with each one for a moment and think about what's happening.

Scenario one: A bank uses a loan approval AI. It approves 87% of loan applications from applicants in wealthy zip codes and 23% from applicants in lower-income zip codes. The bank says this is because the historical repayment data supports these rates.

Scenario two: A company uses an AI to score sales leads. Leads from female executives consistently score 40% lower than leads from male executives with identical job titles and company sizes.

Scenario three: An Agentforce service bot consistently misunderstands questions written by non-native English speakers, causing them to wait twice as long to resolve their issues.

Scenario four: An AI predictions model scores a neighborhood as high-risk for mortgage defaults. As a result, fewer home loans are made there. The homes become worth less. The families there have less wealth. Ten years later, the AI model still scores the neighborhood high-risk — but now because the people there have less wealth than when the AI started.

Each of these is a different type of bias. Each one causes real harm. And in each case, the AI system appears to be working 'correctly' — it's doing exactly what it was trained to do. That's the problem we're exploring today."

[Four bias types — 2:00-10:00]

"Let's start with Type 1: Training Data Bias. The scenario I described about the bank and zip codes — that's training data bias. The AI learned its approval rates from historical data. That historical data reflected decades of discriminatory lending practices where banks systematically denied loans to residents of certain neighborhoods. The AI found the pattern in the data and encoded it. It didn't create the discrimination — it inherited it. And now it perpetuates it at algorithmic scale.

In Salesforce terms: imagine you build a Lead Scoring model in an org where, for the last three years, the sales team only called leads from the manufacturing industry. Service sector leads were never pursued because the previous VP of Sales had a personal skepticism about that vertical. The historical data shows: manufacturing leads convert at 28%, service sector leads convert at 3%. Einstein trains on this data and gives service sector leads very low scores. But the 3% isn't because service sector leads are poor quality — it's because the team never invested in them. The AI learned a bias baked into the human team's past behavior.

Type 2: Algorithmic Bias. This is my scenario about female executives scoring lower than male executives with identical profiles. The algorithm might use a feature like 'years in current role' or 'connections on LinkedIn.' If the historical data shows that female executives have shorter average tenure in roles — not because they're less committed, but because they've been systematically pushed out or passed over for advancement — then using tenure as a feature encodes gender bias into the model through what looks like a neutral variable. That neutral-looking variable that correlates with a protected characteristic is called a proxy variable. It's the mechanism of algorithmic bias.

Type 3: Representation Bias. My scenario about non-native English speakers struggling with the service bot. That model was probably trained on customer service transcripts from the company's existing customers — who happened to be predominantly native English speakers. The model learned to understand standard American English idioms, syntax, and phrasing very well. When someone types in broken English, uses idioms from another culture, or structures sentences differently, the model struggles. It's not a bug — the model is performing exactly as trained. The problem is that the training data didn't represent the full diversity of the eventual user population. Accuracy is unequal, and the users who are most different from the training data pay the cost.

Type 4: Feedback Loop Bias. The mortgage neighborhood scenario is the classic example. AI predicts high risk → fewer loans made → neighborhood deteriorates → AI retrains → neighborhood scores even higher risk. The model's output became the cause of the outcome it was predicting. And each cycle makes the bias stronger. This is the most insidious type because it can look like the model is 'working' — the neighborhood IS higher risk after 10 years. What's invisible is that the model CAUSED the increased risk by restricting access to capital.

In Salesforce: Einstein Lead Scoring gives low scores to leads from Sector X. Reps don't call them. Sector X leads don't convert. Model retrains on data that includes 'Sector X leads have 0% conversion.' Next cycle: Sector X scores are even lower. The first low score might have been wrong. The second cycle's low score is backed by 'evidence' — evidence created by the first wrong prediction. The feedback loop has turned an error into a self-fulfilling prophecy."

[Detection and mitigation — 10:00-14:00]

"Knowing the four types is only half the battle. The exam also tests how to detect bias and what Salesforce does about it.

Detection is fundamentally about disaggregation. The classic mistake is evaluating an AI model only on aggregate accuracy. If your model is 85% accurate overall, you might feel good about it. But what if it's 95% accurate for Group A and 55% accurate for Group B? The aggregate number hides a serious disparity. Disaggregated accuracy analysis — breaking down performance metrics by demographic group — is the essential tool for detecting representation bias and many forms of training data bias.

Feature audits catch algorithmic bias. Before you train a model, review every feature you're planning to include. Ask: does this variable correlate with race, gender, age, disability, or other protected characteristics? Zip code, educational institution name, years of experience — all of these can be proxy variables that introduce algorithmic bias.

Outcome monitoring catches feedback loop bias. You need to compare what the model predicted with what actually happened — and specifically, you need to check whether the model's predictions are influencing the outcomes they're predicting. If you notice that a group that the model consistently scores low NEVER gets a chance to prove the score wrong (because humans always follow the AI), you've got a feedback loop risk.

What does Salesforce do? Four things. First, diverse training data curation — they intentionally seek out and include diverse training data for Einstein features. Second, subgroup accuracy testing before release — they run disaggregated accuracy checks as part of the release process. Third, model cards — they publish documentation for each AI feature detailing known limitations and biases so admins can make informed deployment decisions. And fourth, human oversight requirements — for any AI feature that affects high-stakes decisions about people, Salesforce's guidelines require a human in the loop."

[Closing — 14:00-15:00]

"Here's the practical takeaway. Bias in AI is not someone else's problem. If you're a Salesforce admin deploying Prediction Builder, you are making choices that determine what data trains your model, what features it uses, and how it gets evaluated. Those choices have ethical consequences. The exam tests whether you understand the types of bias and how to identify them — but in the real world, what matters is whether you ask the bias questions before you ship your AI feature, not after.

Know your four types: Training Data Bias, Algorithmic Bias, Feedback Loop Bias, Representation Bias. Know the mechanism of each. Know the real-world pattern. When you see a scenario on the exam, find the mechanism and name the type."

---

## EXAM TIPS
- Four bias types: Training Data Bias, Algorithmic Bias, Feedback Loop Bias, Representation Bias.
- Training Data Bias: bias is IN the historical data before training.
- Algorithmic Bias: a proxy variable correlates with a protected characteristic.
- Feedback Loop Bias: AI outputs influence future training data → bias grows stronger over time.
- Representation Bias: underrepresented group → lower accuracy for that group.
- Exam format: scenario description → identify which type of bias is present.
- Key detection method: disaggregated accuracy analysis (break performance down by demographic group).
- Proxy variables are the primary mechanism of algorithmic bias — seemingly neutral features that correlate with protected characteristics.
- Salesforce mitigates bias through: diverse training data, subgroup accuracy testing, model cards, human oversight requirements.

---

## LECTURE SUMMARY
- AI bias is different from human bias because it operates at scale, invisibly, and can self-reinforce over time
- Four main types: Training Data Bias (historical data reflects past bias), Algorithmic Bias (proxy variables produce discriminatory outcomes), Feedback Loop Bias (model outputs influence future training data), Representation Bias (underrepresented groups receive lower accuracy)
- All four types can appear in Salesforce Einstein features — particularly Prediction Builder and Lead Scoring
- Detection requires disaggregated accuracy analysis, feature audits, and outcome monitoring over time
- Salesforce mitigates bias through diverse data curation, subgroup testing, model cards, and human oversight requirements

---

## MINI QUIZ

**Question 1:**
A company uses Einstein Prediction Builder to predict which customers will accept upgrade offers. After 12 months, they notice that customers in rural areas are scored as very unlikely to accept upgrades. An investigation reveals that reps had historically not called rural customers with upgrade offers, so the historical conversion rate for that group appears near zero. Which type of bias is MOST present?

A) Algorithmic Bias  
B) Feedback Loop Bias  
C) Training Data Bias  
D) Representation Bias

**Answer: C — Training Data Bias**

*Explanation:* The scenario describes a situation where the historical data reflects past human behavior (reps didn't call rural customers) rather than the actual quality or likelihood of those customers. The data is biased because it didn't give rural customers an opportunity to demonstrate their conversion potential. This is classic Training Data Bias — the model learned from historical data that reflected a past business decision (don't call rural), not a genuine difference in customer quality. Feedback Loop Bias would involve the model's current outputs influencing new training data and growing stronger over time (not described). Algorithmic Bias would involve a proxy variable correlating with a protected characteristic. Representation Bias would show as lower model accuracy for rural customers.

---

**Question 2:**
A financial services company uses an Einstein Prediction Builder model to assess credit risk for small business loans. The model uses "neighborhood census tract median income" as a feature. An audit finds the model approves loans at 85% for predominantly white neighborhoods and 34% for predominantly minority neighborhoods. The model's developers say the income feature is purely economic, not racial. Which type of bias does this BEST describe?

A) Training Data Bias  
B) Algorithmic Bias  
C) Feedback Loop Bias  
D) Representation Bias

**Answer: B — Algorithmic Bias**

*Explanation:* This is a textbook example of Algorithmic Bias via proxy variable. "Census tract median income" may appear to be a neutral economic variable, but due to the history of housing segregation and redlining in the US, census tract income correlates strongly with racial demographics. Using this variable introduces racial discrimination into the model even if race was never directly used as a feature. The developers are correct that they didn't use race — but they used a proxy for race. Algorithmic Bias is specifically about variables that appear neutral but produce discriminatory outcomes because they correlate with protected characteristics. The bias is in the model's variable selection, not the volume of training data (Representation Bias) or feedback effects.

---

**Question 3:**
An Einstein Lead Scoring model was trained 18 months ago. At the time, it gave low scores to leads from the retail sector. As a result, reps stopped calling retail leads. Now, 18 months later, retail leads have a near-zero historical conversion rate in the CRM. When the model is retrained on this updated data, retail leads score even lower. What type of bias MOST accurately describes what is happening?

A) Training Data Bias  
B) Algorithmic Bias  
C) Feedback Loop Bias  
D) Representation Bias

**Answer: C — Feedback Loop Bias**

*Explanation:* This is a classic Feedback Loop Bias scenario. The original model's predictions (low retail scores) influenced human behavior (reps stopped calling retail leads). That behavior generated new outcome data (retail leads don't convert, because they weren't called). The new outcome data is now being used to retrain the model. Each retraining cycle makes the bias stronger — the model predicted low, human behavior confirmed low, model retrains on confirmed-low data, scores even lower. The key identifying features: the model's outputs affected future training data, and the bias grows stronger over time. If the scenario described the problem at a single point in time, it might look like Training Data Bias — but the described CYCLE of worsening bias is specifically Feedback Loop Bias.
