# Lecture 13: Einstein Prediction Builder
**Section:** Section 3 — AI in Salesforce  
**Duration:** 15 minutes  
**Exam Weight:** ~8% of exam (tested on use cases, process, and comparison to built-in features)

---

## Learning Objectives
1. Explain what Einstein Prediction Builder is and its "no-code" value proposition
2. Describe the three main use case categories: lead conversion, churn risk, escalation prediction
3. Walk through the step-by-step process to create a prediction (object → outcome field → train → activate)
4. Explain how prediction scores appear on Salesforce records
5. Distinguish between Prediction Builder, Einstein Lead Scoring, and other built-in predictive features
6. Apply this knowledge to exam scenario questions

---

## SLIDES

### Slide 1: Title Slide
**Visual:** A Salesforce Contact record with a custom Einstein Prediction panel visible — showing a "Renewal Risk Score: 72% likely to cancel" meter gauge, with three contributing factors listed below it.
**Content:**
- Einstein Prediction Builder: Build custom AI predictions without writing code
- Any object, any outcome, any field
- The difference between pre-built and custom predictive AI

**Speaker Notes:** "Here's the question I want you to sit with as we start: what would your business predict if it could predict ANYTHING? Lead conversions? Product churn? Contract renewals? Employee attrition? The answer is probably something very specific to your industry and business model. Einstein Prediction Builder exists because Salesforce can't pre-build a prediction for every possible thing every business cares about. So they built the tool that lets YOU build it — with no machine learning knowledge required."

---

### Slide 2: What Is Einstein Prediction Builder?
**Visual:** Before/after split. Before: Data scientist workflow (months, SQL, Python, model training, deployment). After: Prediction Builder workflow (admin, Setup, point-and-click, weeks).
**Content:**
**Einstein Prediction Builder** is a no-code machine learning tool that lets Salesforce admins and business users create custom predictive AI models

**What it can predict:**
- Boolean (yes/no) outcomes: "Will this customer renew?" (Yes/No)
- Field values: "What will the case resolution time be?" (Numeric)

**What it needs to learn:** Historical data — records where the outcome has already happened

**What it outputs:** A prediction score field on any record that shows likelihood (0-100) or value prediction

**Who uses it:** Admins build the predictions; all users see the scores on records

**Speaker Notes:** "The key phrase is 'no-code.' Before tools like Prediction Builder, if a business wanted to predict which customers were going to churn, they needed a data scientist. Someone who could write Python, understand machine learning algorithms, train a model, validate it, and then build an integration to push predictions back into Salesforce. That's a months-long project. Prediction Builder condenses that entire process into a Setup wizard that any skilled Salesforce admin can complete. The intelligence is still real — it's a genuine machine learning model — but the complexity is abstracted away behind a point-and-click interface."

---

### Slide 3: When to Use Prediction Builder — Use Case Categories
**Visual:** Three-column layout with icon, category name, and example for each.
**Content:**
**Category 1: Conversion Predictions**
- Will this lead convert?
- Will this opportunity close?
- Will this free trial user upgrade to paid?

**Category 2: Risk Predictions (Churn / Escalation)**
- Will this customer cancel their subscription?
- Will this service case be escalated?
- Will this renewal be at risk?
- Will this employee leave? (HR use cases)

**Category 3: Value/Classification Predictions**
- What category will this incoming request fall into?
- What will be the resolution time for this case?
- What product will this customer be most likely to buy next?

**Speaker Notes:** "Notice what all these use cases have in common: they're all about predicting what will happen BEFORE it happens, so a human or an automated process can take action proactively. The business value is always the same: if I know IN ADVANCE that this customer is likely to cancel, I can call them today. If I know this case is likely to escalate, I can assign a senior agent now instead of reactively after it blows up. Prediction Builder turns your historical data into future awareness."

---

### Slide 4: How Prediction Builder Works — The Machine Learning Process
**Visual:** Circular flowchart: Historical Data → Feature Selection → Model Training → Validation → Predictions on New Records → Feedback Loop (outcomes recorded become new training data) → back to beginning.
**Content:**
**Step 1: Historical data**
- The model needs records where the outcome ALREADY HAPPENED
- Example: 5,000 leads, some converted (outcome=True), some didn't (outcome=False)

**Step 2: Feature selection**
- The model analyzes ALL fields on those records to find patterns
- Which fields correlate with conversion? (Lead source? Title? Company size? Response time?)
- You can guide which fields to include/exclude

**Step 3: Model training**
- Einstein's ML engine runs the analysis and builds a prediction model
- This takes time — hours to days depending on data volume

**Step 4: Validation**
- Einstein tests the model's accuracy on held-out historical data
- Shows you a score: how accurate is this model?

**Step 5: Activation**
- Prediction score appears as a custom field on every new (and existing) record
- Updates automatically as records change

**Speaker Notes:** "I want to demystify what 'machine learning' is actually doing here, because it's not magic. It's statistics at scale. When you train a Lead Conversion prediction, Einstein is essentially asking: 'Among all the leads that DID convert in our history, what do they have in common? Among all the leads that DIDN'T convert, what do they have in common? Can I use those patterns to score new leads?' It might find that leads from the 'Web - Organic' source that have a title containing 'VP' or 'Director' and who opened our onboarding email within 2 days convert at 85%. Leads from 'Purchased List' with no recorded activity convert at 3%. That pattern-finding is the machine learning. Einstein does it automatically — you just provide the historical data and choose the outcome field."

---

### Slide 5: Creating a Prediction — Step-by-Step Walkthrough
**Visual:** Eight annotated screenshots of the Prediction Builder setup wizard, each showing one step of the process.
**Content:**
**Step 1:** Setup → Einstein Prediction Builder → New Prediction  
**Step 2:** Choose the object (Lead, Opportunity, Case, Contact, or any custom object)  
**Step 3:** Define the prediction type: Binary (yes/no) or Numeric (value)  
**Step 4:** Choose the outcome field — the field that contains your historical outcomes  
   Example: "Converted" field on Lead (values: True/False)  
**Step 5:** Define the "positive outcome" — which field value means "yes"  
   Example: Converted = True  
**Step 6:** Set filters (optional) — which records to include in training  
**Step 7:** Configure field inclusion — which fields Einstein can use for analysis  
**Step 8:** Click "Build Prediction" → Einstein trains the model  
**Step 9:** Review accuracy score and field insights → Activate  

**Speaker Notes:** "The most important step in this whole process is Step 4 — choosing your outcome field. This is how you teach Einstein WHAT to predict. The outcome field is the historical answer you already know. For lead conversion, that's the Converted field. For case escalation, it might be a custom 'Was_Escalated__c' checkbox field on your Case object. For churn prediction, it might be a 'Contract_Cancelled__c' field. Einstein needs to see records where the outcome IS KNOWN so it can learn the patterns. New records don't have that outcome yet — that's what we're trying to predict."

---

### Slide 6: Reading Prediction Scores on Records
**Visual:** A Salesforce Opportunity record with an "Einstein Prediction" section visible on the page layout. The section shows: "Close Won Likelihood: 67%" with a meter visualization, and below it, three factors in a table: "Industry match: positive impact," "Deal size under quota: negative impact," "Active executive sponsor: positive impact."
**Content:**
**What shows on the record:**
- **Score:** 0-100 percentage likelihood (or numeric prediction for value predictions)
- **Driving factors:** Top positive and negative factors influencing the score
- **Trend:** Has the score gone up or down since last week?

**Where it appears:**
- As a field in any page layout or Lightning Record Page
- Can be used in List Views to sort/filter by score
- Can trigger Flows or alerts when score changes
- Can be referenced in reports and dashboards

**Driving factors explained:** Einstein shows which fields most influenced the score — this is the "explainability" piece (ties to transparency principles in Section 4)

**Speaker Notes:** "The driving factors are what make Prediction Builder genuinely useful rather than just a black-box number. If a rep sees '32% close likelihood' with no explanation, they don't know what to do with that. But if they see '32% close likelihood' plus 'negative factor: no executive sponsor engaged' and 'negative factor: deal has been in stage for 45 days' — now they have actionable information. Fix those things, and the score goes up. That's the difference between a prediction and a recommendation. And notice how this connects to the transparency principles in Section 4 — the reason for any AI decision should be visible and understandable to the humans affected by it."

---

### Slide 7: Data Requirements and Quality
**Visual:** Two-column comparison. Left: "Sufficient data — good prediction." Right: "Insufficient data — unreliable prediction." Shows recommended minimums.
**Content:**
**For reliable predictions, Einstein needs:**
- Minimum recommended: **400 records** with known outcomes
- Ideal: 1,000+ records for each possible outcome value
- Records should represent the full range of scenarios (not just successes)

**Common data quality issues:**
- Too few historical records → low accuracy model
- Imbalanced data (99% negative outcomes, 1% positive) → biased model
- Missing field values → fewer features for the model to learn from
- Outcomes not recorded consistently → model trains on noise, not signal

**The accuracy score:**
- After training, Einstein shows you a model accuracy score
- Below 60%: model is not reliable — investigate data quality
- 70-85%: good model for most business decisions
- Above 85%: excellent model

**Speaker Notes:** "This data quality section directly connects to the exam. If a question describes a scenario where a Prediction Builder model is giving inaccurate or unreliable results, the root cause is almost always data quality. Classic exam scenario: 'A company built a churn prediction model but it predicts almost all customers will stay, even customers who clearly cancel. What is the most likely cause?' Answer: imbalanced training data. If 98% of your historical customers stayed and only 2% cancelled, the model learns to say 'stays' for everything — and it's 98% accurate on historical data but useless for actually predicting churn. That's a representation bias problem, which we cover in the ethics section too."

---

### Slide 8: Prediction Builder vs. Einstein Lead Scoring — The Key Distinction
**Visual:** Side-by-side comparison table with blue column for Lead Scoring and green column for Prediction Builder.
**Content:**

| | Einstein Lead Scoring | Einstein Prediction Builder |
|---|---|---|
| Type | Pre-built feature | No-code tool you USE to build |
| Object | Leads ONLY | Any standard or custom object |
| Outcome | Always: Lead Conversion | Any field you choose |
| Setup | Turn on in Setup | Configure via wizard |
| Customization | Limited | Fully customizable |
| Output | Score + factors on Lead | Score + factors on any record |
| Use case | Standard lead scoring | Custom predictions |
| License | Included in Sales Cloud | Requires Einstein for Platform license |

**Speaker Notes:** "This table is the most exam-tested differentiation in this entire lecture. They test it in multiple ways. Scenario 1: 'An admin wants to predict which accounts are likely to churn.' Lead Scoring? No — wrong object. Prediction Builder? Yes — custom prediction on Account. Scenario 2: 'A sales manager wants to score leads by conversion likelihood with minimal setup.' Lead Scoring? Yes — that's exactly what it does out of the box. Prediction Builder? Could work but overkill for a standard lead scoring need. The key question to ask yourself: is this a standard lead conversion scenario? Use Lead Scoring. Is it ANYTHING else? Use Prediction Builder."

---

### Slide 9: Other Built-in Predictive Features vs. Prediction Builder
**Visual:** Comparison matrix showing multiple Einstein predictive features and their scope.
**Content:**

| Feature | What It Predicts | Object | Built-in or Custom? |
|---|---|---|---|
| Einstein Lead Scoring | Lead conversion likelihood | Leads | Built-in |
| Einstein Opportunity Scoring | Opportunity close likelihood | Opportunities | Built-in |
| Einstein Case Classification | Case field values (category, priority) | Cases | Built-in |
| Einstein Forecasting | Revenue forecast accuracy | Opportunities | Built-in |
| Einstein Prediction Builder | Anything you define | Any object | Custom (you build it) |

**Key rule:** If Salesforce has a pre-built feature for your use case, use it. Prediction Builder is for everything else.

**Speaker Notes:** "Think of built-in features as pre-built IKEA furniture — it's already assembled for the most common scenarios. Prediction Builder is the raw lumber and tools — you can build anything, but you have to build it yourself. If you need lead scoring, don't use Prediction Builder when Lead Scoring already exists. If you need opportunity close predictions, Opportunity Scoring is ready to go. Prediction Builder is for the business-specific, unique predictions that Salesforce couldn't anticipate — your specific churn model, your unique escalation logic, your custom renewal risk scores."

---

### Slide 10: Exam Tips Summary
**Visual:** Numbered list on a clean slide with key exam facts highlighted.
**Content:**
**Top Exam Points for Prediction Builder:**

1. Prediction Builder = no-code ML tool for CUSTOM predictions on ANY object
2. Lead Scoring = pre-built, leads ONLY, turn on in Setup
3. Minimum data requirement: ~400+ records with known outcomes
4. Two prediction types: Binary (yes/no) and Numeric (value)
5. Output: Score field + driving factors on the record
6. Outcome field = the field that contains your historical results (what Einstein learns from)
7. Accuracy score after training tells you if the model is reliable
8. Low accuracy = data quality problem, not a Prediction Builder limitation
9. Requires Einstein for Platform license (not included in base licenses)

**Speaker Notes:** "Nine facts. That's everything you need to know about Prediction Builder for the exam. The scenario questions always follow one of three patterns: which tool to use (Prediction Builder vs. built-in), what went wrong (data quality), or how it works (process steps). Know these nine points and you'll own the Prediction Builder questions."

---

## RECORDING SCRIPT

[Opening — 0:00-2:00]

"Let me tell you about a company I know in the insurance industry. They were using Salesforce to manage their policy renewals — thousands of policies up for renewal every quarter. They had a serious churn problem: customers would cancel after 2-3 years, and by the time the account manager noticed, it was already too late to save the relationship.

They tried hiring more account managers. Expensive. They tried sending renewal emails earlier. Didn't move the needle. What they really needed was to know, 90 days BEFORE a policy came up for renewal, which customers were high risk. Not all of them — just the ones showing early warning signs.

So they built a Prediction Builder model. They looked at their historical renewal data — 8,000 policies over three years, each one marked as either renewed or cancelled. Einstein analyzed the patterns: what did the cancelled policies have in common? Policies where the primary contact hadn't logged in to the portal in 6 months. Policies where there had been a billing dispute. Policies on older, lower-tier plans that had better options available.

Now every policy record shows a 'Renewal Risk Score.' Policies above 70% risk automatically get flagged for an account manager to call. The result: their renewal rate went from 72% to 86% in 18 months. All because they could predict the problem before it happened.

That's what Einstein Prediction Builder can do. Let's learn how to build it."

[What it is and the ML process — 2:00-5:30]

"Einstein Prediction Builder is a no-code machine learning tool. I want to emphasize 'no-code' because that's genuinely unusual. Machine learning typically requires a data scientist — someone who understands algorithms, can write Python, knows how to evaluate model accuracy. That's a scarce and expensive skill set.

Prediction Builder abstracts all of that behind a Setup wizard. You don't need to understand the math. You need to understand your data and your business question. That's something a skilled Salesforce admin can do.

Here's how the machine learning actually works under the hood, explained in plain English.

You give Einstein a dataset: historical Salesforce records where the outcome you care about has already happened. Let's say you want to predict case escalation. You show Einstein 10,000 historical cases. Some of them have 'Escalated = True.' Some have 'Escalated = False.' That's your training data.

Einstein then does something it's genuinely very good at: pattern finding at scale. It looks at every field on those 10,000 cases — priority, category, account type, initial response time, agent experience level, product involved, customer sentiment, channel — and it asks: 'Which combination of these fields most reliably separates the escalated cases from the non-escalated ones?'

Maybe it finds that cases opened by enterprise accounts (Account Type = Enterprise) where the initial response took more than 4 hours AND the product category was 'Integration' escalated 78% of the time. Cases that don't fit that pattern escalated only 8% of the time.

Einstein encodes that pattern into a model. Now when a NEW case comes in, it checks the same fields, applies the same pattern, and says: 'Given what I know about this case right now, there's a 74% chance it will escalate.' A human still makes the decision what to do with that information — assign a senior agent, escalate preemptively, create a proactive callback task. But the prediction gives them a 10-minute head start on a problem that might otherwise take 6 hours to surface."

[Step-by-step creation process — 5:30-9:30]

"Let me walk you through creating a prediction. Say we're building that case escalation predictor for a service team.

Step one: you go to Setup and search for Einstein Prediction Builder. Open it. Click New Prediction.

Step two: choose your object. We're working with Cases, so select Case.

Step three: choose the prediction type. Are we predicting a yes/no outcome? That's Binary. Are we predicting a number, like how many hours a case will take to resolve? That's Numeric. For escalation, it's yes/no — binary.

Step four — this is the critical one — choose your outcome field. This is the field that already contains the historical answer. In our case, it's a custom checkbox field called 'Was_Escalated__c' that the team has been filling in on closed cases. Einstein needs this field to have real values on historical records to learn from. If you don't have a field tracking your outcome, you need to create one and backfill it before you can build a prediction. No historical outcomes = no model.

Step five: tell Einstein which field value means the positive outcome. We want to predict escalation, so 'Was_Escalated__c = True' is our positive outcome.

Step six: optional filters. Maybe we only want to train on cases from the last two years, or only from enterprise accounts. Set those filters here.

Step seven: configure which fields Einstein can use. Generally, more fields = better. But you might want to exclude fields that would create data leakage — fields that only get filled in AFTER escalation happens, which would unfairly boost accuracy but make the model useless on new cases.

Step eight: click Build Prediction. Einstein processes your data. Depending on volume, this can take a few hours.

Step nine: review your accuracy score and the field insights panel. Einstein tells you which fields were most predictive. If accuracy is above 70%, activate it. The prediction score field now appears on every Case record.

That's the full process. For the exam, the most tested steps are: choosing the outcome field (step four) and understanding what low accuracy means (data quality problem)."

[Lead Scoring vs. Prediction Builder — 9:30-12:30]

"Here's the section most likely to save you points on the exam: the difference between Einstein Lead Scoring and Einstein Prediction Builder.

They both produce prediction scores. They're both predictive AI. But they are completely different tools for completely different scenarios.

Einstein Lead Scoring is a finished product. Salesforce built it, trained it on industry-wide patterns, and you turn it on. It works specifically on the Lead object, specifically predicting lead conversion. That's all it does. But it does that one thing extremely well, with minimal configuration, and it's included in Sales Cloud licenses.

Einstein Prediction Builder is a tool you USE to build predictions. It's a platform, not a product. You configure it. You choose the object, the outcome, the fields. You train it on your specific data. In exchange for that configuration work, you get complete flexibility — any object, any outcome, any field.

The exam loves this scenario: 'A company wants to build a model that predicts whether service contracts are likely to be cancelled at renewal, based on data in their custom Contract__c object. Which tool should they use?'

Read the scenario carefully. Custom object: Contract__c. That's not a standard Lead. That rules out Lead Scoring immediately. Outcome: cancellation prediction. That rules out Opportunity Scoring and Case Classification. The only tool flexible enough for a custom object with a custom outcome is Prediction Builder.

Contrast that with: 'A new sales manager at a startup wants to quickly implement lead scoring to help their team prioritize which leads to call first.' Quick implementation, standard leads, standard outcome (conversion). That's Lead Scoring — turn it on, it's done."

[Data quality and closing — 12:30-15:00]

"I want to close with a reality check about data quality, because this is where most Prediction Builder projects fail.

The number one reason an Einstein Prediction Builder model produces poor results is bad training data. Not a bug in Prediction Builder. Not a limitation of Einstein. Bad data.

The most common data problems I've seen: too few records (the model doesn't have enough examples to find reliable patterns), imbalanced data (99% of your historical cases were NOT escalated, so the model learns to say 'not escalated' for everything and looks 99% accurate, but misses every real escalation), and missing field values (if 40% of your records have blank Priority fields, the model can't use Priority as a predictor).

Einstein gives you an accuracy score after training. Think of it like a grade: above 70% is passing, above 80% is good, above 85% is excellent. If you get below 60%, that's a clear signal to investigate your data before using the model.

And here's an exam tip tied to the ethics section: a prediction model trained on imbalanced or biased data can perpetuate discrimination. If your historical conversion data reflects biased past decisions — you only converted leads from certain industries, not because others weren't qualified but because of past rep bias — Einstein will learn THAT pattern and replicate it. The model's accuracy and the model's fairness are two different things. A model can be statistically accurate and still be unfair. We'll explore this more in the bias lecture.

Alright — Prediction Builder done. You know what it is, how to build it, the key distinction from Lead Scoring, and the data quality fundamentals. Next lecture: Next Best Action, which combines predictive AI with rule-based logic to give sales and service reps smart recommendations right in the record."

---

## EXAM TIPS
- Prediction Builder = build CUSTOM predictions on ANY Salesforce object (standard or custom).
- Einstein Lead Scoring = PRE-BUILT, works ONLY on Leads, predicts lead conversion.
- The outcome field is the field Einstein learns FROM — it must have historical values on existing records.
- Two prediction types: Binary (yes/no outcome) and Numeric (value prediction).
- Minimum ~400 records with known outcomes for a reliable model; ideal is 1,000+.
- Low model accuracy = data quality issue (too few records, imbalanced data, missing field values).
- Prediction scores appear on records as a field, with driving factors showing WHY the score is what it is.
- Prediction Builder requires Einstein for Platform license (not base Sales/Service Cloud license).
- Built-in features (Lead Scoring, Opportunity Scoring, Case Classification) should be used instead of Prediction Builder when they cover your exact use case.

---

## LECTURE SUMMARY
- Einstein Prediction Builder is a no-code ML tool for creating custom predictive models on any Salesforce object
- The critical setup step is choosing the outcome field — the historical field Einstein learns from
- Two prediction types: Binary (yes/no) and Numeric (value)
- After training, Einstein displays a score and driving factors on every record
- Einstein Lead Scoring is pre-built for lead conversion only; Prediction Builder is for all custom prediction needs
- Data quality is the primary determinant of model accuracy — insufficient, imbalanced, or missing data leads to unreliable predictions

---

## MINI QUIZ

**Question 1:**
An admin at a telecommunications company wants to predict which customers are likely to upgrade their plan in the next 30 days. The data is stored on the custom object "Subscription__c." Which Einstein tool should they use?

A) Einstein Lead Scoring  
B) Einstein Opportunity Scoring  
C) Einstein Prediction Builder  
D) Einstein Case Classification

**Answer: C — Einstein Prediction Builder**

*Explanation:* This scenario involves a custom object (Subscription__c) and a custom outcome (plan upgrade likelihood). Einstein Lead Scoring works only on the Lead object. Einstein Opportunity Scoring works only on Opportunities. Einstein Case Classification works only on Cases and predicts field values, not upgrade likelihood. Einstein Prediction Builder is the only tool that can work on any object (including custom objects like Subscription__c) and predict any custom outcome. Custom object + custom outcome = always Prediction Builder.

---

**Question 2:**
An admin trains an Einstein Prediction Builder model to predict case escalation. After training, Einstein reports a model accuracy of 48%. What is the MOST likely root cause?

A) Prediction Builder does not support case escalation predictions  
B) The case object does not have enough field data for Einstein to analyze  
C) The training data has quality issues such as too few records or imbalanced outcomes  
D) The admin selected the wrong prediction type (Binary vs. Numeric)

**Answer: C — Training data has quality issues such as too few records or imbalanced outcomes**

*Explanation:* A 48% accuracy score (essentially chance-level) indicates a fundamental problem with training data quality, not with the Prediction Builder tool itself. Common causes: fewer than 400 records with known outcomes, severely imbalanced data (e.g., 99% non-escalated cases), missing field values across most records, or incorrectly recorded outcome values. Prediction Builder does support case escalation predictions (Option A is wrong). Lack of field data would produce a warning, not a completed model (Option B is partially true but too narrow). Choosing the wrong prediction type would not reduce accuracy to 48% — it would produce an error or wrong output type (Option D is wrong).

---

**Question 3:**
A sales manager reviews a lead record and sees the following in the Einstein Scoring section: "Conversion Score: 84% | Positive factors: Job title match, Active on website, Enterprise company size. Negative factors: Unresponsive to last 2 emails." What does the "Negative factors" section represent?

A) Data quality warnings about the lead record  
B) Fields that were excluded from the prediction model  
C) Features that are reducing the lead's predicted conversion likelihood  
D) Errors in the Einstein Lead Scoring configuration

**Answer: C — Features that are reducing the lead's predicted conversion likelihood**

*Explanation:* Einstein Prediction scores include driving factors — the specific field values or patterns that most influenced the score. "Negative factors" means these fields or conditions are pulling the score DOWN (reducing the predicted likelihood). In this case, being unresponsive to emails is a pattern Einstein has identified as correlating with lower conversion rates in historical data. This is the "explainability" aspect of Einstein predictions — it shows WHY the score is what it is, not just the number. This is not a data quality warning, an exclusion list, or a configuration error.
