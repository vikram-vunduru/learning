# Bias in AI

**Exam Domain:** Ethical Considerations of AI (20%)
**Study Priority:** HIGH — the exam gives you a scenario and asks you to identify the bias type

---

## Core Concepts

**AI Bias:** Systematic errors in AI model outputs that result in unfair or discriminatory outcomes, typically affecting certain groups more than others.

**Critical concept:** Bias is not always intentional. Even well-designed AI systems can produce biased outcomes because the training data itself reflects historical inequalities or societal biases.

---

### The 4 Bias Types (Memorize All 4)

| Bias Type | Definition | Classic Example |
|-----------|-----------|----------------|
| **Training Data Bias** | The training dataset itself contains bias — either because it overrepresents some groups or underrepresents others, or because it reflects historical discriminatory patterns | Amazon's hiring model trained on 10 years of resumes (historically male-dominated tech workforce) → model learned to downgrade women's resumes |
| **Algorithmic Bias** | The algorithm or model architecture itself introduces bias, even on unbiased data — happens when model optimization choices favor certain outcomes | A ranking algorithm optimizes for "most engagement" and systematically ranks one group higher; the choice of metric creates the bias |
| **Feedback Loop Bias** | The model's predictions influence future training data, which reinforces and amplifies the original bias | Predictive policing: model predicts high crime in certain neighborhoods → police patrol more there → more arrests recorded there → model predicts even higher crime in those areas |
| **Representation Bias** | Certain groups are underrepresented in training data → model performs worse for those groups | Facial recognition trained mostly on lighter-skinned faces → significantly higher error rates for darker-skinned individuals |

---

### How to Identify Bias Type from a Scenario

**Decision flowchart:**
```
Is the bias coming from the data used to train the model?
  → If underrepresentation of groups → REPRESENTATION BIAS
  → If historical patterns in the data reflect past discrimination → TRAINING DATA BIAS
  
Is the bias coming from how the model itself is designed or what it optimizes for?
  → ALGORITHMIC BIAS

Is the bias getting worse over time as model outputs influence future data?
  → FEEDBACK LOOP BIAS
```

**Note:** Training Data Bias and Representation Bias are closely related — both involve problems in training data. The distinction:
- Training Data Bias = data reflects historical discrimination or biased labels
- Representation Bias = data is simply missing/underrepresenting certain groups (not necessarily due to past discrimination — just sampling gaps)

---

### Bias Detection Methods

**Disaggregated accuracy analysis:** Measure model performance separately for different demographic groups (by race, gender, age, geography). If accuracy is significantly different across groups, the model has representational bias problems.

**Slice analysis:** Test model performance on specific subsets of data. A model that performs well overall may perform poorly on specific important subgroups.

**Human review of outputs:** Spot-check AI outputs for patterns of disparate treatment.

**Fairness metrics:**
- Equal accuracy: does the model achieve similar accuracy across groups?
- Equal opportunity: does the model give qualified applicants from all groups similar positive prediction rates?
- Equal error rates: do different groups have similar false positive / false negative rates?

---

### Salesforce Bias Mitigation Approaches

1. **Diverse training data curation**: Intentionally ensure training datasets include balanced representation of all relevant groups
2. **Bias testing before deployment**: Run disaggregated accuracy checks during model evaluation phase
3. **Regular bias audits post-deployment**: Schedule periodic reviews as model is used in production
4. **Human-in-the-loop for consequential decisions**: Especially in high-stakes domains (hiring, credit, healthcare)
5. **Model cards**: Publish known bias characteristics so deployers can make informed decisions
6. **Feedback mechanisms**: Allow users to flag potentially biased outputs

---

## PTA / SA Relevance

**Bias is a real risk in customer Salesforce deployments, not an abstract concern:**

**Einstein Lead Scoring bias scenario:**
- A customer trained Lead Scoring on 5 years of historical conversions
- During that period, the sales team only pursued leads from large companies
- Leads from small companies rarely converted — not because they weren't qualified, but because reps didn't pursue them
- Result: Lead Scoring assigns low scores to small company leads — a feedback loop bias that perpetuates the historical behavior
- PTA action: Audit the training data before deployment; assess whether historical patterns represent future behavior or historical bias

**Agentforce response bias:**
- LLMs trained on internet text absorb societal biases
- Customer service agent may give shorter, less helpful responses to users who write in less formal language (which can correlate with demographic characteristics)
- PTA action: Test the agent's response quality across diverse user communication styles; review Einstein model cards

**High-stakes deployment guidance for customers:**
- Any AI used in hiring, credit decisions, healthcare triage, law enforcement, housing, or education requires formal bias audits — these are legally regulated domains in many jurisdictions
- Always recommend human review for consequential decisions in these domains
- EU AI Act (coming into force) categorizes AI in these domains as "high risk" with strict requirements

**CTO framing:**
- "Bias in AI isn't a bug you can patch — it's a systemic risk that requires ongoing monitoring. Your AI governance program should include regular bias audits, not just a one-time check at deployment."

---

## Bias in AI Architecture (Detection and Mitigation)

```
╔════════════════════════════════════════════════════════════════════╗
║              BIAS DETECTION & MITIGATION FRAMEWORK                  ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  DATA PHASE                                                        ║
║  ┌──────────────────────────────────────────────────────────┐     ║
║  │ Audit training data:                                     │     ║
║  │ • Is each demographic group represented proportionally?  │     ║
║  │ • Do historical labels reflect bias, not just outcomes?  │     ║
║  │ • Is the data from a time period that reflects current   │     ║
║  │   business reality?                                      │     ║
║  └──────────────────────────────────────────────────────────┘     ║
║                          │                                         ║
║  MODEL TRAINING PHASE                                              ║
║  ┌──────────────────────────────────────────────────────────┐     ║
║  │ Check algorithmic choices:                               │     ║
║  │ • What metric is the model optimizing?                   │     ║
║  │ • Could optimization metric advantage certain groups?    │     ║
║  │ • Apply fairness constraints if needed                   │     ║
║  └──────────────────────────────────────────────────────────┘     ║
║                          │                                         ║
║  MODEL EVALUATION PHASE                                            ║
║  ┌──────────────────────────────────────────────────────────┐     ║
║  │ Disaggregated accuracy analysis:                         │     ║
║  │ • Run accuracy metrics by demographic subgroup           │     ║
║  │ • Compare false positive / false negative rates          │     ║
║  │ • If significant gaps found: investigate root cause      │     ║
║  └──────────────────────────────────────────────────────────┘     ║
║                          │                                         ║
║  PRODUCTION MONITORING                                             ║
║  ┌──────────────────────────────────────────────────────────┐     ║
║  │ Ongoing:                                                 │     ║
║  │ • Track output distribution by group over time           │     ║
║  │ • Watch for feedback loop amplification                  │     ║
║  │ • Regular re-audit (quarterly recommended)               │     ║
║  │ • Human review escalation path for flagged decisions     │     ║
║  └──────────────────────────────────────────────────────────┘     ║
╚════════════════════════════════════════════════════════════════════╝
```

**Limitations of bias mitigation:**
- No AI system can be proven 100% free of bias — bias detection is an ongoing process, not a one-time certification
- Fairness metrics can conflict — a model that achieves equal accuracy may still have unequal false positive rates; different fairness definitions require different tradeoffs
- Protected characteristic data may not be available in Salesforce CRM data — making it difficult to run demographic disaggregation analysis
- Mitigation techniques (e.g., rebalancing training data) can reduce bias for one group while inadvertently increasing it for another

---

## Key Facts to Memorize

- **4 bias types**: Training Data Bias, Algorithmic Bias, Feedback Loop Bias, Representation Bias
- **Training Data Bias**: historical discrimination baked into labels/data
- **Algorithmic Bias**: the algorithm's optimization choices create unfairness
- **Feedback Loop Bias**: model outputs influence future training data → amplification
- **Representation Bias**: underrepresentation of groups → worse performance for those groups
- **Disaggregated accuracy**: measure performance per demographic subgroup to detect bias
- Bias is systemic, not a one-time bug — requires ongoing monitoring
- Amazon hiring AI = canonical Training Data Bias example
- Predictive policing = canonical Feedback Loop Bias example
- Facial recognition disparate accuracy = canonical Representation Bias example

---

## Exam Traps

**Trap 1:** "Bias only exists if the model developer intended to discriminate." WRONG. Bias is typically unintentional — it emerges from historical patterns in data, algorithmic choices, and feedback loops.

**Trap 2:** Confusing Representation Bias with Training Data Bias. Key difference: Representation Bias = groups simply missing from training data (sampling gap). Training Data Bias = labels/outcomes in the data reflect historical discrimination (the data is there but is biased).

**Trap 3:** "If an AI model has high overall accuracy, it doesn't have bias." WRONG. A model can have very high overall accuracy while performing significantly worse on minority groups (if majority groups dominate the test set). Disaggregated analysis is essential.

**Trap 4:** "Feedback loop bias only happens with predictive policing." WRONG. Any system where AI outputs influence the generation of future training data can create feedback loops. Examples: content recommendation systems, credit scoring that affects financial behavior, hiring AI that shapes the applicant pool.

---

## Practice Questions

**Q1: A company uses Einstein Lead Scoring trained on three years of historical data. During those three years, the sales team primarily pursued leads from the financial services industry due to a company focus at that time. The model now assigns low scores to leads from other industries. What type of bias is this?**

A) Algorithmic Bias
B) Feedback Loop Bias
C) Representation Bias
D) Training Data Bias

**Answer: D** — Training Data Bias. The historical data reflects a biased sampling (only certain industry leads were pursued and converted), and those patterns are now encoded in the model. The labels (converted/not converted) represent historical behavior, not inherent lead quality.

---

**Q2: A facial recognition security system is found to have a 2% error rate for lighter-skinned individuals but a 19% error rate for darker-skinned individuals. The model was trained on a dataset that was 85% lighter-skinned faces. What type of bias does this represent?**

A) Training Data Bias
B) Feedback Loop Bias
C) Representation Bias
D) Algorithmic Bias

**Answer: C** — Representation Bias. The training dataset underrepresented darker-skinned individuals (only 15% of the dataset). As a result, the model performs significantly worse for that group — a classic representation bias outcome.

---

**Q3: A content recommendation AI on a social platform consistently recommends content that already has high engagement, which causes users to see more of that content, which drives more engagement, causing the algorithm to recommend it even more. Over time, diverse content becomes less visible. What type of bias is this?**

A) Training Data Bias
B) Representation Bias
C) Feedback Loop Bias
D) Algorithmic Bias

**Answer: C** — Feedback Loop Bias. The model's outputs (recommendations) influence user behavior (engagement), which becomes the future training data, which reinforces the model's existing tendencies. The cycle amplifies the initial bias over time.
