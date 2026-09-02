# Additional Practice Questions (Mixed Topics)

**Source:** Additional practice questions — supplemental to the 40-question practice exam
**Use:** After completing the main 40-question exam; use these for final review of weak areas

---

## Set 1: Einstein Trust Layer (10 Questions)

**Q1: A developer is writing a Prompt Builder template that includes the customer's Social Security Number in the prompt body. The template is activated. What happens to the SSN before the prompt is sent to the LLM?**

A) The SSN is encrypted and sent securely to the LLM
B) The SSN is replaced with a token by Data Masking before reaching the LLM provider
C) The SSN is blocked and the template fails to generate a response
D) The SSN is sent as-is since the LLM provider has signed a ZDR agreement

**Answer: B** — Data Masking detects PII including SSNs and replaces them with tokens before the prompt leaves Salesforce. The LLM receives the tokenized version. After LLM generates its response, Salesforce restores the original value. The ZDR agreement governs retention but Data Masking governs what PII is even sent.

---

**Q2: Which Einstein Trust Layer component operates on the LLM's RESPONSE (output) rather than on the user's prompt (input)?**

A) Data Masking
B) Zero Data Retention
C) Toxicity Scoring
D) Audit Trail

**Answer: C** — Toxicity Scoring evaluates the LLM's generated response after it's received but before it's shown to the user. Data Masking and ZDR operate on the INPUT side. Audit Trail logs both sides.

---

**Q3: A Salesforce admin reviews the AI Audit Trail and finds a logged interaction from two months ago showing a case summary was generated for Case #12345. What information can they see in this log entry?**

A) Only the timestamp and user name — content is not stored for privacy reasons
B) The full resolved prompt including all merge field values, and the LLM's response, along with timestamp and user identity
C) Only the template name used, not the actual prompt content
D) The prompt content but not the LLM response, as responses are considered temporary

**Answer: B** — The Audit Trail stores the complete interaction: who ran it, the fully resolved prompt (with all field values substituted), the LLM response, and the timestamp. This is what makes it useful for compliance audits.

---

**Q4: An organization is deploying Agentforce for customer-facing chat. Their CTO asks: "If a customer types their credit card number into the chat, will that go to the LLM?" What is the correct answer?**

A) Yes — the LLM receives all user input as-is
B) No — Data Masking will detect and tokenize the credit card number before it reaches the LLM
C) Yes — but ZDR ensures the LLM provider can't retain it
D) No — Agentforce doesn't allow users to type free text, only structured options

**Answer: B** — Data Masking runs on all content in the prompt before it reaches the LLM, including user-provided text in Agentforce conversations. Credit card numbers are recognized as PII and tokenized.

---

**Q5: Which of the following scenarios would be ACCURATELY addressed by Zero Data Retention but NOT by Data Masking?**

A) A customer's name appears in a prompt sent to the LLM provider
B) The LLM provider uses data from Salesforce prompts to improve their general AI model
C) An LLM response contains offensive language directed at a customer
D) A compliance team cannot identify which users have been using AI features

**Answer: B** — ZDR specifically prevents the LLM provider from using prompt data for model training. Data Masking prevents PII from being visible in the prompt, but even if something was received (tokenized) by the LLM, ZDR prevents them from retaining or training on it.

---

## Set 2: Ethics and Bias (8 Questions)

**Q6: A predictive model used to screen job applications scores candidates. An audit finds that candidates with names associated with certain ethnic backgrounds receive systematically lower scores even when qualifications are identical. The training data reflected past hiring patterns at a company that had historically under-hired from those groups. What type of bias is this?**

A) Algorithmic Bias
B) Feedback Loop Bias
C) Training Data Bias
D) Representation Bias

**Answer: C** — Training Data Bias. The historical hiring data reflected discriminatory practices — fewer people from those groups were hired historically, so those groups are associated with "not hired" labels in the training data. The model learned this discriminatory pattern from the labels in the data.

---

**Q7: A recommendation AI at a financial services firm consistently recommends more complex investment products to customers of a certain age group, even when simpler products would better serve their needs. The AI was optimized to maximize "product complexity score" as a proxy for revenue. What type of bias is this most likely?**

A) Training Data Bias
B) Algorithmic Bias
C) Feedback Loop Bias
D) Representation Bias

**Answer: B** — Algorithmic Bias. The choice to optimize for "product complexity score" as a proxy metric introduced bias into the algorithm's objective. Even if the training data was representative, the optimization target itself created unfair outcomes for certain age groups.

---

**Q8: An Agentforce agent for customer service starts providing noticeably different levels of detail in responses based on how formally a customer writes. Customers who write in casual language (which correlates with certain demographics) receive briefer, less helpful responses. Over time, this causes those customers to disengage, reducing their representation in future training data. What combination of bias types is at play?**

A) Training Data Bias only
B) Training Data Bias and Representation Bias
C) Algorithmic Bias and Feedback Loop Bias
D) Representation Bias and Feedback Loop Bias

**Answer: D** — The initial disparity (different response quality by communication style) could be Representation Bias (if training data underrepresented certain communication styles). The disengagement causing future underrepresentation is a Feedback Loop — the outputs affect future data, reinforcing the pattern.

---

**Q9: A company tells their customers: "Our pricing recommendations are determined by an AI algorithm that considers your purchase history and account tier." Which Trusted AI Principle does this disclosure exemplify?**

A) Responsible
B) Accountable
C) Transparent
D) Empowering

**Answer: C** — Transparent. Disclosing that AI is being used (that recommendations are AI-generated) and what data it uses is purpose transparency and process transparency — both dimensions of the Transparent principle.

---

**Q10: A customer calls in to dispute a loan denial and asks why they were denied. The loan decision was made by an AI model. What regulatory framework gives EU residents the right to receive an explanation of this decision?**

A) GDPR Article 7 (right to consent)
B) GDPR Article 22 (right not to be subject to automated decisions)
C) EU AI Act Article 5 (prohibited AI practices)
D) Data Protection Directive 1995

**Answer: B** — GDPR Article 22 gives EU data subjects the right not to be subject solely to automated decisions that significantly affect them, AND the right to obtain an explanation of such decisions and contest them.

---

## Set 3: AI Fundamentals (6 Questions)

**Q11: A data science team is building a model to forecast quarterly revenue for each Salesforce Account based on historical deal data. The output is a dollar amount. What ML subtype does this represent?**

A) Binary classification
B) Unsupervised clustering
C) Supervised regression
D) Reinforcement learning

**Answer: C** — Forecasting a continuous numeric value (dollar amount) from historical labeled data is supervised regression. Binary classification outputs Yes/No. Clustering is unsupervised. Reinforcement learning uses reward signals.

---

**Q12: An Einstein Lead Scoring model achieves 91% accuracy on training data but only 63% on test data. A newer, simpler model achieves 78% on both training and test data. Which model should be chosen for production deployment?**

A) The first model — higher training accuracy means better feature learning
B) The second model — similar performance on both datasets indicates better generalization
C) Neither model — both fail to meet the minimum 80% accuracy threshold
D) The first model — test accuracy will improve once more data is added

**Answer: B** — The second model generalizes better. The first model is overfit (large gap between training and test accuracy). A model that performs consistently on training and test data will be more reliable on new, unseen records in production. There is no universal "minimum 80%" threshold mentioned in Salesforce documentation.

---

**Q13: Salesforce Einstein Lead Scoring trains on your organization's specific historical lead conversion data. What type of AI does this personalized model training represent?**

A) General AI (AGI)
B) Transfer Learning
C) Narrow AI — Supervised Learning
D) Unsupervised Clustering

**Answer: C** — Einstein Lead Scoring is Narrow AI (task-specific: predicting lead conversion) using Supervised Learning (it trains on labeled historical records where Converted = True/False). AGI doesn't exist commercially. Transfer learning is a different concept. Lead Scoring is not unsupervised.

---

## Set 4: Data for AI (6 Questions)

**Q14: A Salesforce admin runs a data quality report before enabling Einstein Lead Scoring. They find that 55% of leads have "Annual Revenue" blank, 40% have "Industry" blank, and 80% have "Number of Employees" blank. What should the admin do?**

A) Enable Lead Scoring immediately — the model will compensate for missing data
B) Remediate data quality (fill in missing fields, add data enrichment) before training the model, since high incompleteness will produce unreliable scores
C) Remove Annual Revenue, Industry, and Number of Employees from the model's feature list and train only on well-populated fields
D) Train the model and assess accuracy — if accuracy is acceptable, the data quality is sufficient

**Answer: B** — High field incompleteness (Completeness dimension violation) means the model can't effectively use these fields as predictors. Remediating data quality before training is the correct approach. Note: C is a reasonable partial mitigation but doesn't address the underlying data quality problem.

---

**Q15: Which Salesforce tool provides an overall health report of an org's configuration and data quality, useful for identifying issues before enabling Einstein features?**

A) Einstein Prediction Builder accuracy dashboard
B) Salesforce Optimizer
C) Data Cloud Data Explorer
D) Einstein Audit Trail

**Answer: B** — Salesforce Optimizer provides an org-wide health report including field usage statistics, completion rates, and configuration issues — a good first-pass assessment of data quality before enabling AI features. Data Cloud Data Explorer is for Data Cloud unified profile health. Prediction Builder dashboard shows model accuracy after training.

---

**Q16: A company's customer data exists in three systems: Salesforce CRM (service data), an e-commerce platform (purchase data), and a loyalty system (points and tier data). The same customer has a record in each system. What Data Cloud capability is needed to create a single, complete customer view for AI personalization?**

A) Calculated Insights
B) Einstein Vector Store
C) Identity Resolution
D) Data Streams

**Answer: C** — Identity Resolution is the Data Cloud capability that matches records from multiple source systems (CRM, e-commerce, loyalty) that represent the same individual, and consolidates them into a Unified Customer Profile. Data Streams handle ingestion. Einstein Vector Store is for document embeddings. Calculated Insights are computed metrics on top of the unified profile.

---

## Score Key and Interpretation

| Your Score | Interpretation | Action |
|-----------|---------------|--------|
| 15-16/16 (93-100%) | Excellent — you're ready | Final review of cheat sheet only |
| 12-14/16 (75-87%) | Good — minor gaps remain | Review the sections where you missed questions |
| 8-11/16 (50-68%) | Moderate — significant gaps | Re-study weak sections; take practice exam again |
| Below 8 (< 50%) | Needs more study | Go back to the lecture notes for missed concepts |

**Remember:** The actual exam needs 26/40 (65%). These questions are calibrated to be at exam difficulty. Consistent performance at 75%+ on practice materials should translate to passing the real exam.
