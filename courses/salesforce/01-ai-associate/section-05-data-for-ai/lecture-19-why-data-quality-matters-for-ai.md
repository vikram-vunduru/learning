# Lecture 19: Why Data Quality Matters for AI
**Duration:** 15 minutes | **Exam Weight:** 17% (Data for AI)

---

## Learning Objectives

1. Explain the "garbage in, garbage out" principle as it applies to AI systems
2. Define and distinguish the 6 dimensions of data quality
3. Describe how poor Salesforce data degrades Einstein AI feature performance
4. Outline a process for assessing data quality before enabling AI
5. Identify data profiling approaches available in Salesforce

---

## SLIDES

### Slide 1: Title Slide
**Visual:** Clean dark background, white text. Icon of a funnel with clean data flowing in and a sparkle/AI icon on the output side.
**Content:**
- Lecture 19: Why Data Quality Matters for AI
- "AI is only as smart as the data you feed it"
- Section 5: Data for AI

**Speaker Notes:** Welcome to lecture 19. We're now in Section 5 — Data for AI — which covers 17% of the exam. Today we tackle one of the most foundational concepts: why data quality is the single biggest predictor of whether your AI project succeeds or fails.

---

### Slide 2: The Fundamental Problem — GIGO
**Visual:** Classic "garbage in, garbage out" diagram: trash can on left → machine in center → trash can on right. Contrast side: clean data in → machine → gold bar out.
**Content:**
- **GIGO: Garbage In, Garbage Out**
- AI models learn patterns from data
- If data is wrong, incomplete, or inconsistent → model learns wrong patterns
- The model has no way to "know" data is bad
- Clean data = better predictions, better outputs

**Speaker Notes:** GIGO — Garbage In, Garbage Out — is a concept that predates AI, but it has never been more relevant than it is today. A machine learning model is, at its core, a pattern-recognition engine. It finds correlations in historical data and uses those correlations to make predictions. If the historical data is wrong, the model learns wrong patterns — confidently and at scale.

---

### Slide 3: What Does "Data Quality" Actually Mean?
**Visual:** Hexagon diagram with 6 labeled sections, each a different color.
**Content:**
The 6 Dimensions of Data Quality:
1. **Accuracy** — Is the data correct?
2. **Completeness** — Is the data all there?
3. **Consistency** — Does the data agree across systems?
4. **Timeliness** — Is the data current?
5. **Validity** — Does the data conform to expected formats/rules?
6. **Uniqueness** — Are there duplicate records?

**Speaker Notes:** Data quality isn't a single thing — it has six dimensions, each of which matters independently. A dataset can be accurate but not timely. It can be complete but have duplicates. Let's walk through each one carefully because the exam will test all six.

---

### Slide 4: Dimension 1 — Accuracy
**Visual:** Two columns — "Bad Data" vs "Good Data." Example: Lead.AnnualRevenue = $999,999,999 (likely a placeholder) vs. $4,500,000 (real value).
**Content:**
- **Definition:** The data correctly represents the real-world entity or event
- Common accuracy problems in Salesforce:
  - Default or placeholder values (e.g., "555-1234" phone, "test@test.com" email)
  - Manual entry errors ("Gogle" instead of "Google")
  - Outdated contact info never updated
- **Impact on AI:** Einstein Lead Scoring trains on inaccurate revenue signals → scores high-revenue leads the same as low-revenue leads

**Speaker Notes:** Accuracy is about truth. Is the data in your CRM actually correct? This sounds obvious, but Salesforce orgs are full of placeholder values that reps entered just to save a record — "999-999-9999" for phone numbers, fake email addresses to pass validation rules. Einstein doesn't know these are fake. It treats them as real signals.

---

### Slide 5: Dimension 2 — Completeness
**Visual:** Bar chart showing percentage of filled fields for a sample Lead object. Some fields at 95%, some at 30%, some at 5%.
**Content:**
- **Definition:** All required data is present — no missing values
- Common completeness problems:
  - Required fields bypassed via import or API
  - Optional fields rarely populated (Industry, # of Employees)
  - Null values in fields Einstein needs to score
- **Impact on AI:** Einstein Opportunity Scoring can't evaluate deals missing key fields — outputs low-confidence or no score
- **Rule of thumb:** Fields used as AI inputs should have >70% population rate

**Speaker Notes:** Completeness is about gaps. If Einstein Lead Scoring uses the Industry, Annual Revenue, and Number of Employees fields to score leads — but those fields are blank on 60% of your records — what happens? Einstein either ignores those records, uses defaults, or makes predictions with very low confidence. You end up with scores that are essentially guesses.

---

### Slide 6: Dimension 3 — Consistency
**Visual:** Three database icons labeled "Salesforce," "ERP," and "Marketing Automation." Arrow pointing to a customer record showing three different annual revenue values.
**Content:**
- **Definition:** Data values are the same across systems, fields, and time
- Common consistency problems:
  - "Industry" field has 47 values when there should be 12 (typos, freeform entry)
  - Customer address differs between Salesforce, ERP, and billing system
  - Same product named differently in Sales vs. Service
- **Impact on AI:** Data Cloud merges records from multiple systems — inconsistent data creates incoherent unified profiles

**Speaker Notes:** Consistency is about agreement. When you pull data from Salesforce, your ERP, and your marketing platform — do they tell the same story about the same customer? Inconsistency is one of the hardest problems to solve because you have to decide which system is the "source of truth" for each data element. This is exactly what Data Cloud's identity resolution feature handles.

---

### Slide 7: Dimensions 4, 5, and 6
**Visual:** Three-panel slide, one per dimension with icon.
**Content:**

**Timeliness**
- Data is current and updated regularly
- Example: A lead's job title from 3 years ago is no longer accurate
- AI using stale data predicts based on who the customer was, not who they are

**Validity**
- Data conforms to defined formats, ranges, and business rules
- Example: A close date of 1/1/1900 is technically a date but is not valid
- Phone numbers with letters, email without "@" sign

**Uniqueness**
- Each real-world entity appears once (no duplicates)
- Duplicates make one customer look like many, skewing segmentation and scoring
- Einstein may score the same person twice, inconsistently

**Speaker Notes:** These last three are equally critical. Timeliness matters especially for AI features like next-best-action — a recommendation based on an interaction from 18 months ago is worse than no recommendation at all. Validity matters because AI models often encode field values — an invalid date or negative quantity throws off numerical models. And uniqueness — duplicates are the enemy of AI. They inflate counts, create conflicting signals, and confuse identity resolution.

---

### Slide 8: Real Example — How Bad Data Ruins Einstein Lead Scoring
**Visual:** Split screen. Left: "Ideal Einstein Setup" with clean data flowing into good scores. Right: "Real World" with messy data and random scores.
**Content:**
**Scenario:** A B2B SaaS company enables Einstein Lead Scoring.

**Their data problems:**
- Annual Revenue: 80% of leads have $0 or $1 (default from web form)
- Industry: 34 different spellings for "Technology"
- Lead Source: "Other" for 60% of records
- Duplicates: 22% duplicate rate in Leads

**Result of Einstein scoring:**
- Scores are nearly random — low correlation with actual conversion
- Sales team stops trusting scores within 2 weeks
- AI feature abandoned

**Speaker Notes:** This scenario plays out in real Salesforce implementations every day. Einstein Lead Scoring is a genuinely powerful feature — but it requires clean, populated, consistent data to train on. When Salesforce implementation teams skip the data quality step and just "turn on Einstein," they get outputs that look authoritative but are essentially meaningless. Then the business blames AI when the real problem was data hygiene.

---

### Slide 9: How to Assess Data Quality Before Enabling AI
**Visual:** Checklist or 5-step process flow.
**Content:**
**Pre-AI Data Quality Assessment Steps:**

1. **Identify AI inputs** — which fields does the feature use? (Check Salesforce documentation)
2. **Measure field population rates** — what % of records have values in those fields?
3. **Audit value distribution** — are picklist values standardized? Any obvious junk?
4. **Check for duplicates** — run duplicate rules or use Duplicate Jobs
5. **Assess recency** — when were records last updated? Are they stale?
6. **Set minimum threshold** — Salesforce recommends having enough records with historical outcomes before training (e.g., Einstein Lead Scoring needs sufficient converted leads)

**Speaker Notes:** Before you click "Enable Einstein," do your homework. Pull a field-by-field population report. Look at the distribution of values — if your Annual Revenue field has 80% zeros, that's not a data point, that's a gap. Run duplicate detection. Check when records were last modified. This assessment should be a standard part of any Salesforce AI enablement project.

---

### Slide 10: Data Profiling in Salesforce
**Visual:** Screenshot mockup of Salesforce Setup showing Data Assessment or Field History Tracking options.
**Content:**
**Tools for data profiling in Salesforce:**
- **Salesforce Optimizer** — free app that flags field usage, data quality issues, and adoption gaps
- **Reports and Dashboards** — custom reports to measure field population, blank rates
- **Duplicate Rules and Duplicate Jobs** — identify and manage duplicate records
- **Data Cloud Data Explorer** — profile ingested data, see completeness metrics per field
- **Einstein Discovery Data Assessment** — (in Analytics Studio) profiles datasets for ML readiness
- **Third-party tools** — Informatica, Validity DemandTools, RingLead

**Speaker Notes:** Salesforce provides several native tools for data profiling. The Salesforce Optimizer is a great starting point — it's free and scans your org for common issues including low field adoption rates. For more structured ML readiness assessment, Einstein Discovery in Analytics Studio has built-in data quality checks. And Data Cloud has a Data Explorer that lets you see field-level completeness once data is ingested.

---

### Slide 11: The Business Case for Data Quality Investment
**Visual:** ROI equation: Data Quality Investment → Better AI Outputs → Business Value.
**Content:**
- Data quality is not a one-time cleanup — it's an ongoing discipline
- Establish data governance policies BEFORE enabling AI
- Key governance elements:
  - Validation rules for critical fields
  - Required fields based on data completeness needs
  - Duplicate management rules
  - Regular data audits (quarterly minimum)
  - Data steward ownership per object
- Better data quality = more confident AI predictions = higher user adoption

**Speaker Notes:** The ROI case here is strong. Bad data doesn't just hurt AI — it hurts every reporting, forecasting, and operational process in your org. But AI makes bad data catastrophically visible because the outputs are concrete predictions. When a rep gets told "this lead has a 95% chance of converting" and it doesn't convert repeatedly, trust collapses fast. Data quality investment pays dividends across the entire business.

---

### Slide 12: Exam Recap and Key Terms
**Visual:** Table of key terms and definitions.
**Content:**

| Term | One-Line Definition |
|------|---------------------|
| GIGO | Garbage In, Garbage Out — bad input data produces bad AI output |
| Data Quality | Fitness of data for its intended use, measured across 6 dimensions |
| Accuracy | Data correctly represents the real-world entity |
| Completeness | No missing values in required fields |
| Consistency | Data agrees across systems and over time |
| Timeliness | Data is current and up-to-date |
| Validity | Data conforms to defined formats and rules |
| Uniqueness | Each entity appears only once — no duplicates |
| Data Profiling | Analyzing data to understand its quality characteristics |

---

## RECORDING SCRIPT

Welcome to Lecture 19. I'm really glad you're here for this one, because this lecture covers something that determines whether AI projects succeed or fail in the real world — and yet it's consistently underestimated by both students and practitioners.

The topic is data quality — specifically, why it matters so much for AI, and what you need to know for the Salesforce AI Associate exam.

Let me start with a story. Imagine a company that spent four months and significant budget implementing Einstein Lead Scoring. They went through the configuration, they set up the scoring model, they trained their sales team on how to read the scores. Two months after go-live, the VP of Sales calls a meeting and says: "These scores are useless. We turned on AI and our close rates haven't moved." So they turned it off.

What happened? The data. Their Annual Revenue field had placeholder zeros on 80% of lead records. Their Industry picklist had 34 variations of "Technology." Sixty percent of their leads were tagged with Lead Source = "Other." Einstein learned patterns from this noisy, incomplete data and produced scores that were essentially random.

The technical name for this problem is GIGO: Garbage In, Garbage Out. This principle predates AI — programmers have used it since the 1960s to describe how bad inputs produce bad outputs from any computational system. But it is more consequential in AI than almost anywhere else, for a specific reason: an AI model produces confident-sounding outputs regardless of data quality. It doesn't say "I'm not sure about this." It says "This lead has a 72% chance of converting." That confidence makes bad predictions dangerous.

So let's break down data quality properly. Data quality is measured across six dimensions — and I need you to know all six for the exam.

**Accuracy** is whether the data correctly represents reality. Are the phone numbers real? Are the revenue figures from actual research, or did someone type 999 to get past a required field? Inaccurate data teaches AI wrong lessons.

**Completeness** is whether all necessary values are present. If Einstein is supposed to use Annual Revenue, Industry, and Company Size to score a lead — but those fields are blank on most records — the model has nothing to work with. Salesforce generally recommends key AI input fields have at least 70% population rates, and some features require even higher thresholds.

**Consistency** is about agreement. Does the customer's name, address, and revenue look the same in Salesforce, in your ERP, and in your marketing platform? Inconsistent data is a major obstacle when you're trying to build unified customer profiles in Data Cloud, because the system can't confidently merge records that describe the same customer differently.

**Timeliness** is about currency. A contact's job title from 2019 is not useful for making a recommendation in 2024. AI systems trained on stale data make recommendations based on who the customer was, not who they are. This is particularly critical for Next Best Action and personalization use cases.

**Validity** is about format and rule conformance. A close date of January 1, 1900 is technically a date — it passes the field type check — but it's not valid business data. Phone numbers with letters, emails without the @ symbol, negative quantities — these are validity failures. ML models encode these values and they produce distorted patterns.

**Uniqueness** means each real-world entity appears once in your dataset. Duplicate records are especially damaging for AI because they create artificial signals. If one customer appears as three separate records, the AI might identify three different "people" with contradictory behaviors, or it might score the same person multiple times inconsistently.

Now, how do you actually assess data quality before enabling AI? I recommend a six-step process. First, identify which fields the AI feature actually uses — read the Salesforce documentation for the specific feature. Second, measure field population rates — what percentage of relevant records have actual values? Third, audit value distribution — look at picklists and text fields for junk data, inconsistent values, or placeholders. Fourth, run duplicate detection — use Salesforce's built-in duplicate rules or a tool like DemandTools. Fifth, assess recency — when were these records last meaningfully updated? And sixth, verify you meet minimum data thresholds — Einstein Lead Scoring, for example, needs a sufficient number of historical converted leads to train on.

For tooling, Salesforce gives you several options. The Salesforce Optimizer is a free app that scans your org and flags data quality issues alongside other setup problems. Standard Salesforce Reports let you build field-level completeness dashboards — for example, a report showing the percentage of open Opportunities where Annual Revenue is null. If you're using Data Cloud, the Data Explorer shows completeness metrics for ingested data. And Einstein Discovery in Tableau CRM has built-in dataset quality analysis for machine learning readiness.

The bottom line here is this: data quality is not an IT problem, it's a business problem with technical symptoms. The solution requires both governance — policies, validation rules, required fields, duplicate management — and culture — training reps to enter data correctly, making data entry easy, and holding teams accountable for data completeness.

When you're taking the exam and you see a question about why an Einstein feature is producing poor results, think data quality first. And when you see a scenario about what an admin should do before enabling Einstein, think: assess the data.

Let's move on to the exam tips and then the mini quiz.

---

## EXAM TIPS

- **Know all 6 dimensions by name:** The exam tests whether you can identify which dimension is violated in a scenario. Practice mapping example problems to the right dimension.
- **GIGO is a foundational concept** — it may be asked directly ("What does GIGO stand for?") or tested implicitly in a scenario.
- **Completeness is the most commonly tested dimension** — questions often describe Einstein giving poor scores and ask why. Missing field values are the most common answer.
- **Uniqueness ties to Data Cloud** — duplicate records are mentioned in both data quality AND Data Cloud identity resolution contexts.
- **Data profiling tools:** Know that Salesforce Optimizer and Reports/Dashboards are the primary native tools. You don't need to know third-party tools for the exam.
- **Timeliness** is often the answer when a question describes an AI feature making "outdated" or "irrelevant" recommendations.

---

## LECTURE SUMMARY

- **GIGO** (Garbage In, Garbage Out) means AI models learn bad patterns from bad data — and output confidently wrong predictions.
- Data quality has **6 dimensions**: Accuracy, Completeness, Consistency, Timeliness, Validity, and Uniqueness — each represents a different type of data problem.
- **Real-world impact**: Einstein Lead Scoring with bad CRM data produces random, useless scores that erode sales team trust.
- **Pre-AI assessment** involves measuring field population rates, auditing value distributions, running duplicate checks, and verifying recency.
- **Native Salesforce tools** for data profiling include Salesforce Optimizer, Reports, Duplicate Rules, and Data Cloud Data Explorer.
- Data quality requires ongoing **governance**, not just one-time cleanup.

---

## MINI QUIZ

**Question 1:** An AI model is trained on Salesforce opportunity data. 70% of opportunities have the "Number of Employees" field blank. Which data quality dimension is most directly violated?

- A) Accuracy
- B) Validity
- C) Completeness
- D) Consistency

**Correct Answer: C**
**Explanation:** Completeness refers to the presence of required data values. When 70% of records are missing a field value, the dataset is incomplete. Accuracy (A) would be violated if the values were wrong. Validity (B) would be violated if values were in the wrong format. Consistency (D) would be violated if values differed across systems.

---

**Question 2:** What does the principle of "Garbage In, Garbage Out" mean in the context of AI?

- A) AI systems produce more output than they consume
- B) AI systems produce low-quality outputs when trained on low-quality data
- C) AI systems should filter out garbage data automatically
- D) AI outputs become garbage over time without retraining

**Correct Answer: B**
**Explanation:** GIGO means that AI models trained on bad data will produce bad predictions — because they learn patterns from whatever data they're given, without the ability to judge data quality. Option A is nonsensical. Option C describes an ideal that doesn't currently exist in practice. Option D describes model drift, which is a related but distinct concept.

---

**Question 3:** A Salesforce admin notices that the same customer appears as three separate Account records with slightly different names and addresses. Which data quality dimension does this violate?

- A) Accuracy
- B) Timeliness
- C) Validity
- D) Uniqueness

**Correct Answer: D**
**Explanation:** Uniqueness means each real-world entity appears exactly once in the dataset. Three records for the same customer is a duplicate problem — a uniqueness violation. Accuracy (A) might also be partially violated, but the primary dimension here is uniqueness. Timeliness (B) and Validity (C) are not relevant to duplicate records.
