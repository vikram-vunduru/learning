# Lab 03: Einstein Prediction Builder — What You Need to Be Able to Do

**Lab Type:** Hands-On Practice
**Estimated Time:** 45-60 minutes

---

## Core Skills to Demonstrate

By end of this lab you should be able to:
- Navigate to Prediction Builder and start a new binary prediction
- Identify which object, outcome field, and training criteria to configure
- Understand the feature selection step and data health indicators
- Interpret the accuracy dashboard and driving factors
- Add the prediction score to a page layout for user visibility

---

## Checklist: Build a Binary Lead Conversion Prediction

### Step 1: Prepare Sample Data
- [ ] Ensure your org has at least 50+ Lead records (ideally 200+)
- [ ] Ensure some leads have Converted = True and some Converted = False
- [ ] Ensure key fields like Industry, Annual Revenue, Lead Source, Title are populated on most records
- [ ] If your org is sparse: use Data Loader or manual entry to add test leads with variety

### Step 2: Navigate to Prediction Builder
- [ ] Setup → Einstein → Prediction Builder
- [ ] Click **New Prediction** (or "Get Started" if first time)

### Step 3: Configure the Prediction
- [ ] Choose prediction type: **Binary Prediction** (will this lead convert? Yes/No)
- [ ] Select object: **Lead**
- [ ] Select outcome: **Converted** field = **True**
- [ ] Name: "Lead Conversion Prediction"
- [ ] Set training filter: e.g., "Only train on Leads created in the last 2 years"
- [ ] Click Next

### Step 4: Review Feature Selection
- [ ] Salesforce automatically identifies candidate features (Lead fields)
- [ ] Review the **data health indicators** for each field:
  - Green: well-populated, good quality
  - Yellow: moderate completeness
  - Red: sparse, poor predictor
- [ ] Notice which fields are flagged as sparse — these are your data quality gaps
- [ ] Remove any fields with obvious uniqueness issues (e.g., a unique ID field that would overfit)
- [ ] Keep core features: Industry, AnnualRevenue, LeadSource, Title, NumberOfEmployees

### Step 5: Train the Model
- [ ] Click **Train** (this may take several minutes to hours depending on data volume)
- [ ] When complete, you'll receive a notification and the accuracy dashboard loads

### Step 6: Review the Accuracy Dashboard
- [ ] Check **Overall Accuracy %** — what is the test set accuracy?
- [ ] Review **Top Predictors** (driving factors at model level, not individual record level)
  - Which fields have highest positive impact on conversion prediction?
  - Which fields have negative impact?
- [ ] Note: Is the model reliable enough? (For a demo with limited data, accuracy may be low — that's expected)
- [ ] Check: Is there a significant gap between training and test accuracy? (High gap = overfitting)

### Step 7: Deploy the Prediction
- [ ] If accuracy looks acceptable, click **Deploy** (or Activate)
- [ ] Salesforce will now score all existing Lead records and score new ones on a schedule

### Step 8: Expose Score on Page Layout
- [ ] Navigate to Lead object in Object Manager → Fields & Relationships
- [ ] Find the new prediction score field (named after your prediction)
- [ ] Add it to the Lead page layout (or use Lightning App Builder to add an Einstein Score component)
- [ ] Navigate to a Lead record — you should see the score + driving factors

### Step 9: Verify Driving Factors on a Record
- [ ] Open a specific Lead record that has been scored
- [ ] View the Prediction Score (0-99) and the driving factors specific to that record
- [ ] Understand: these factors show what contributed to THIS record's score specifically

---

## Concepts Reinforced by This Lab

| What You Did | What It Teaches |
|-------------|----------------|
| Chose binary prediction type | Binary vs. numeric prediction; what each outputs |
| Reviewed data health indicators | Data quality impact on AI; Completeness/Validity dimensions |
| Checked for overfitting (train vs. test gap) | Overfitting concept; how to diagnose it |
| Viewed model-level top predictors | Driving factors at model level vs. record level |
| Viewed record-level driving factors | Decision transparency; why a specific score was given |

---

## Exam-Relevant Self-Check Questions

1. What is the difference between a binary prediction and a numeric prediction?
2. Why would a prediction model trained on a new org's Lead data be unreliable?
3. If the model accuracy shows Training: 92%, Test: 71% — what does this indicate?
4. What do "driving factors" show you about an individual record's prediction score?
5. Which data quality dimension is violated when 60% of the Lead "Industry" field is blank?
6. How often does Salesforce update prediction scores on existing records — in real-time or on a schedule?
