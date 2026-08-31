# Lecture 20: Training Data Explained
**Duration:** 15 minutes | **Exam Weight:** 17% (Data for AI)

---

## Learning Objectives

1. Define training data and explain its role as the foundation of machine learning
2. Distinguish between labeled and unlabeled data using concrete analogies
3. Describe general data volume thresholds for machine learning models
4. Explain the three-way data split — training set, validation set, and test set — and the purpose of each
5. Define overfitting and underfitting and explain their causes
6. Describe how Salesforce uses customer data to train Einstein models

---

## SLIDES

### Slide 1: Title Slide
**Visual:** Image of a textbook, practice exam papers, and a final exam sheet arranged sequentially. AI/sparkle overlay.
**Content:**
- Lecture 20: Training Data Explained
- "A model is only as good as what it learned from"
- Section 5: Data for AI

**Speaker Notes:** Welcome to Lecture 20. We're going deeper into the technical side of AI data — specifically, training data. This is one of those topics where understanding the concepts well lets you answer multiple exam questions across different sections.

---

### Slide 2: What Is Training Data?
**Visual:** Diagram showing raw data flowing into a model training process, producing a "trained model" artifact.
**Content:**
- **Training data** is the dataset used to teach a machine learning model
- The model studies this data to find patterns, correlations, and rules
- After training, the model uses these learned patterns to make predictions on new data it has never seen
- Analogy: Training data is like the thousands of math problems a student solves before a test — the more varied and high-quality the practice problems, the better prepared they are
- **Key insight:** The model does not "remember" individual training records — it learns generalized patterns

**Speaker Notes:** Training data is the raw material of machine learning. When you train an Einstein model, you're giving it historical records where you already know the outcome — for example, leads that either converted or didn't — and letting it find the patterns that distinguish the two groups. It might discover that leads from certain industries who visited the pricing page with high Annual Revenue tend to convert. It encoded that as a pattern. Now when a new lead arrives, it uses that pattern to predict.

---

### Slide 3: Labeled vs. Unlabeled Data
**Visual:** Two columns with examples. Left: labeled images with tags. Right: unlabeled data without tags.
**Content:**
**Labeled Data:**
- Each record has a **label** — the "right answer" the model is trying to learn
- Examples:
  - Lead record + label: "Converted" or "Not Converted"
  - Email + label: "Spam" or "Not Spam"
  - Image + label: "Cat" or "Dog"
- Required for **supervised learning**
- More expensive to produce (humans must label it)

**Unlabeled Data:**
- Records without assigned outcomes
- The model must find its own patterns without guidance
- Used for **unsupervised learning** (e.g., customer segmentation)
- Cheaper to produce — no human labeling required

**Speaker Notes:** The distinction between labeled and unlabeled data maps directly to the supervised vs. unsupervised learning distinction. For Einstein Lead Scoring, the labeled data is your historical lead records — and the label is whether the lead converted. Salesforce uses your own org's conversion history to train a model specific to your business. This is why Einstein Lead Scoring gets more accurate over time: it accumulates more labeled examples.

---

### Slide 4: The Labeling Analogy
**Visual:** Teacher grading papers on left, stack of ungraded papers on right.
**Content:**
**The Grading Analogy:**
- **Labeled data** = a graded exam — you know which answers were right and wrong
- **Unlabeled data** = a stack of essays with no grades — you can group them by topic, writing style, or length, but you don't know which were "good"
- Human labeling is called **annotation**
- Large labeled datasets are expensive:
  - ImageNet: 14 million images labeled by humans
  - GPT training: web text used with implicit labels (next-word prediction)
- Salesforce advantage: your **historical CRM data already has implicit labels** — closed-won/closed-lost opportunities, converted/unconverted leads

**Speaker Notes:** One of Salesforce's clever design choices is leveraging implicit labels that already exist in your CRM. Your Opportunity records have a Stage field — won or lost. Your Lead records have an IsConverted field. These ARE labels. You don't need to do expensive human annotation to train Einstein models — the history of your business already contains the signal.

---

### Slide 5: How Much Data Do You Need?
**Visual:** Spectrum from "Not enough data" (weak/unreliable model) through "Sufficient data" (good model) to "Massive data" (state-of-the-art LLM).
**Content:**
**General thresholds (rules of thumb — not exact science):**
- **Minimum viable:** ~1,000 labeled examples (for simple classification with clean data)
- **Good starting point:** 10,000+ labeled examples (for business ML models)
- **Robust model:** 100,000+ labeled examples (for high-stakes decisions)
- **Foundation models (LLMs):** Billions to trillions of tokens

**For Einstein specifically:**
- Einstein Lead Scoring: Salesforce recommends having at least several hundred converted leads in the training window
- Einstein Opportunity Scoring: needs historical closed-won and closed-lost opportunities
- More data = more confident, accurate scores — up to a point (diminishing returns)

**Speaker Notes:** "How much data do I need?" is one of the most common questions in ML, and the honest answer is "it depends." It depends on the complexity of the problem, the quality of the data, the number of input features, and the acceptable error rate. But for the exam, understand that more historical data generally improves Einstein model quality — and that some Einstein features won't activate at all until you hit minimum data thresholds.

---

### Slide 6: The Three-Way Data Split — Overview
**Visual:** Three boxes arranged left to right: Training Set (large, ~70%) → Validation Set (medium, ~15%) → Test Set (small, ~15%). Each box labeled with purpose.
**Content:**
**Why split data into three sets?**
- We need to train the model, tune it, AND evaluate it honestly
- Using the same data for all three introduces bias
- The three-split approach gives us a clean, unbiased estimate of real-world performance

**The Three Sets:**
1. **Training Set** — the model learns from this
2. **Validation Set** — used to tune the model and prevent overfitting
3. **Test Set** — the final, unbiased performance evaluation

**Speaker Notes:** This is where we get to a really powerful analogy that will help you remember this for the exam. Think about how you prepare for the Salesforce AI Associate exam itself.

---

### Slide 7: The Textbook/Practice Exam/Final Exam Analogy
**Visual:** Three icons: Textbook (Training), Practice Exam papers (Validation), Diploma/Final Exam (Test).
**Content:**

| Data Split | Exam Analogy | Purpose |
|------------|--------------|---------|
| **Training Set** | Studying the textbook | Model learns the material |
| **Validation Set** | Taking practice exams | Identify weak areas, adjust, tune |
| **Test Set** | The real final exam | Unbiased measure of true knowledge |

**Key rule:** The test set must NEVER be seen during training or tuning — just like the real exam should not be seen before you take it.

If you practice on the final exam itself, your score looks great — but it doesn't tell you if you actually learned the material. That's **overfitting.**

**Speaker Notes:** This analogy is the cleanest way I know to explain the data split. You study the textbook — that's training. You take practice exams — that's validation, and if you fail certain sections you go back and study more (that's hyperparameter tuning). Then you take the final exam — that's the test set. Your score on the final exam is the honest measure of how well you learned. The same logic applies to ML: the test set is the honest, untouched evaluation.

---

### Slide 8: Overfitting — The Memorization Problem
**Visual:** Two graphs side by side. Left: overfitted model — wiggly curve that perfectly fits training points. Right: well-fit model — smooth curve that generalizes.
**Content:**
**Overfitting:**
- Model performs **extremely well on training data** but **poorly on new data**
- The model memorized the training data instead of learning generalizable patterns
- Analogy: A student who memorizes every past exam question verbatim — gets 100% on practice tests, fails on the real exam with slightly different questions

**Causes:**
- Training on too little data
- Model is too complex (too many parameters)
- Training for too many iterations

**Signs:** Training accuracy much higher than validation/test accuracy

**Speaker Notes:** Overfitting is one of the most important concepts in machine learning — and it shows up in the real world constantly. An overfitted Einstein model might look spectacular on historical data — 98% accuracy! — but when you deploy it on new leads, it performs no better than chance. The model learned the quirks and noise of the training set rather than the real underlying patterns. Think of it as memorization vs. understanding.

---

### Slide 9: Underfitting — The Generalization Failure
**Visual:** Graph showing an underfit model — too-simple line that fails to capture the real pattern in the data.
**Content:**
**Underfitting:**
- Model performs **poorly on both training data AND new data**
- The model hasn't learned enough patterns — too simple for the problem
- Analogy: A student who studied for only 30 minutes — doesn't know enough to answer questions from any exam

**Causes:**
- Model is too simple (not enough capacity)
- Training data is too small or too noisy
- Too few features provided

**Signs:** Both training accuracy and test accuracy are low

**The goal: find the Goldilocks zone** — a model that generalizes well (not too memorized, not too simple).

**Speaker Notes:** Underfitting is the opposite problem. The model hasn't learned enough. This can happen when you train on too little data, use too few features, or choose a model that's too simple for the complexity of the problem. The sweet spot is a model that has learned the real underlying patterns — it won't nail every training example perfectly, but it will generalize well to new examples.

---

### Slide 10: Visual — Overfitting vs. Underfitting vs. Good Fit
**Visual:** Three curves fitting the same data points. Underfit (straight line, misses pattern), Overfit (wiggly line, hits every point), Good Fit (smooth curve, captures trend without noise).
**Content:**
| | Training Performance | Test Performance |
|---|---|---|
| **Underfitting** | Poor | Poor |
| **Overfitting** | Excellent | Poor |
| **Good Fit** | Good | Good |

**How to fix overfitting:**
- Get more training data
- Simplify the model
- Use regularization techniques
- Use dropout (neural networks)

**How to fix underfitting:**
- Add more features
- Use a more complex model
- Train longer

**Speaker Notes:** This table is your cheat code for exam questions about model performance. If a question says a model performs great on training data but poorly on new data — that's overfitting. If performance is poor on both — that's underfitting. If someone describes an AI model that "worked perfectly on historical data but fails in production" — that is almost certainly overfitting.

---

### Slide 11: How Salesforce Trains Einstein Models
**Visual:** Data flow diagram: Salesforce Org Data → Model Training Pipeline (Salesforce infrastructure) → Einstein Model deployed to Org.
**Content:**
**Two training approaches in Einstein:**

**1. Org-Specific Models (Personalized Einstein)**
- Trained on YOUR Salesforce data
- Examples: Einstein Lead Scoring, Einstein Opportunity Scoring
- Advantages: tailored to your business patterns, industry, and customer base
- Requires sufficient historical data in your org

**2. Pre-trained Base Models (General Einstein)**
- Trained on broad datasets or Salesforce aggregate patterns
- Used as starting point when orgs lack sufficient data
- Examples: some Einstein language features, out-of-the-box sentiment analysis

**Privacy note:** Salesforce uses org data in isolated training pipelines — customer data is NOT commingled with other customers' data for org-specific models.

**Speaker Notes:** This is an important distinction. When you enable Einstein Lead Scoring, Salesforce is training a model specifically for your organization using your own lead conversion history. It's not using a model pre-trained on everyone else's data and applying it to yours. This is why the feature requires a minimum amount of historical data — there needs to be enough of YOUR data to train a meaningful model. And Salesforce is very clear that your data is not shared with other orgs during this process.

---

### Slide 12: Data Bias in Training Data
**Visual:** Biased funnel: if input data skews one direction, model outputs skew the same direction.
**Content:**
**Training data bias:**
- If training data over-represents or under-represents certain groups, the model learns those biases
- Example: If your historical lead conversion data shows that leads from certain industries never converted — but that's because your sales team never prioritized them — Einstein will score those industries low forever (perpetuating the bias)
- This is **historical bias encoded as intelligence**
- Relevance for exam: Ethical AI questions often trace bias back to training data

**Speaker Notes:** We'll go deep on AI ethics in Section 4, but I want to plant this seed here: the training data is where many AI biases originate. The model learns what it's shown. If historical decisions were biased — and human decisions often are — the model learns that bias and amplifies it at scale. This is one reason why data governance and diversity in training data are considered ethical imperatives, not just technical best practices.

---

## RECORDING SCRIPT

Welcome to Lecture 20. In the last lecture we talked about data quality — today we're going one level deeper into the mechanics of how AI actually learns from data. This topic is called training data, and understanding it well will help you with questions across multiple sections of the exam — not just the Data for AI section.

Let's start from the beginning. What is training data? Training data is the historical dataset that a machine learning model learns from. Think of it this way: before an AI model can make predictions, it needs to study thousands — sometimes millions — of examples where the right answer is already known. It finds the patterns that distinguish one outcome from another, and it encodes those patterns as mathematical relationships. After training, when a new example arrives, the model applies those learned patterns to generate a prediction.

Now, a critical distinction: the model does not memorize individual training records. It generalizes from them. This is the difference between memorization and learning, and it's central to a concept we'll discuss shortly called overfitting.

Let's talk about labeled versus unlabeled data. This distinction maps directly to supervised versus unsupervised learning, which was covered in Section 1.

Labeled data is data where each record includes the correct answer — the label. For Einstein Lead Scoring, the label is "Converted" or "Not Converted." For a spam filter, the label is "Spam" or "Not Spam." The model's job is to learn which input features predict each label.

Unlabeled data has no predefined answers. You have a bunch of customer records, but you haven't told the model what it should find. In this case, the model looks for its own structure — groupings, clusters, anomalies. That's unsupervised learning. Customer segmentation — where an AI groups customers by behavior without you defining the groups in advance — is a classic unlabeled data use case.

Here's a clever analogy: labeled data is like a stack of graded exams — you know which answers were right. Unlabeled data is like a stack of ungraded essays — you can organize them by length or topic, but you don't know which were excellent.

One of Salesforce's advantages is that your CRM data already contains implicit labels. Your Opportunity records have Closed Won and Closed Lost stages — those ARE labels. Your Lead records have IsConverted — that IS a label. You don't need to hire human annotators to label your data. The history of your business already provides the training signal.

Now, how much data do you need? This is a common question and there's no single universal answer. The amount depends on problem complexity, data quality, and how many input features you're using. But as general rules of thumb: simple classification problems can work with a thousand or so clean, labeled examples. Business ML models typically need tens of thousands of examples for reliable performance. And the foundation models powering large language models are trained on hundreds of billions to trillions of tokens — orders of magnitude beyond traditional ML.

For Einstein specifically, features like Lead Scoring and Opportunity Scoring require enough historical conversion data to find meaningful patterns. Salesforce sets minimum thresholds before these features will activate. If your org is new or you haven't been tracking conversions carefully, you may not have enough data to generate a reliable model yet.

Now let's talk about one of the most elegant concepts in machine learning: the training-validation-test split. And I have the perfect analogy.

Think about how you're preparing for the Salesforce AI Associate exam. You study from the course materials — that's your training data. You take practice exams — that's your validation set. And finally, you sit the real Salesforce exam — that's the test set.

Here's why this matters: imagine if you took the real exam before studying, figured out all the answers, and then studied specifically to pass that exact test. You'd ace it — but you wouldn't actually know the material. Your result would be inflated and dishonest.

The same problem exists in machine learning. If you train a model and evaluate it on the same data it was trained on, you get an inflated performance score. The model has essentially "seen the answers." The test set must be held back, completely untouched, until you want a final honest evaluation.

The validation set is the practice exam — it's used during the training process to check how the model is doing and make adjustments, called hyperparameter tuning. But because the model is indirectly exposed to the validation data through this tuning process, you still need a separate test set for the final evaluation.

This brings us to two of the most important failure modes in machine learning: overfitting and underfitting.

Overfitting happens when a model performs extremely well on training data but poorly on new, unseen data. The model memorized the training examples instead of learning generalizable patterns. It's like a student who memorized past exam papers word for word — they'd ace a repeat of those exact papers but fail when the questions are slightly rephrased.

How can you tell if a model is overfitting? Training accuracy is high, but validation or test accuracy is significantly lower. That gap is the tell.

Underfitting is the opposite — the model performs poorly on both training data and new data. It hasn't learned enough patterns. The model is too simple for the complexity of the problem. This is like the student who studied for 30 minutes — they don't know enough to answer questions from any version of the exam.

The goal is the middle ground — a model that has learned the real patterns in the training data and applies them confidently to new examples. Machine learning practitioners call this good generalization.

Finally, let's talk about how Salesforce uses your data to train Einstein models. For features like Einstein Lead Scoring, Salesforce trains a model specifically on your org's data — your own historical lead conversions. This personalized approach means the model is calibrated to your specific business context: your industry, your sales process, your customer base. That's why the scores get more accurate over time as more conversion data accumulates.

Salesforce also maintains data isolation — your data is not combined with other customers' data in these personalized training pipelines. This is part of the Einstein Trust Layer, which we'll cover in detail in the ethics section.

The final concept I want to plant in your mind today is training data bias. If your historical data reflects biased human decisions — for example, if certain lead types were never pursued not because they were bad fits, but because of conscious or unconscious bias — the model will learn and perpetuate that bias. AI doesn't correct for human bias; it amplifies it. This is why the quality and representativeness of training data is considered an ethical issue, not just a technical one.

Alright — let's wrap up with exam tips and the mini quiz.

---

## EXAM TIPS

- **Know labeled vs. unlabeled data** — and which type of learning each supports (supervised vs. unsupervised).
- **The data split analogy is memorable and testable** — textbook (training), practice exam (validation), final exam (test). Know the purpose of each.
- **Overfitting vs. underfitting identification:** "High training accuracy, low test accuracy" = overfitting. "Low accuracy on both" = underfitting. Expect scenario questions.
- **Einstein uses YOUR org data** for personalized models — not a generic pre-built model. This is a frequent exam trap.
- **Data bias origins** — the exam may ask where AI bias originates; training data is a primary answer.
- **Minimum data requirements** — know that Einstein features require sufficient historical data to train; a new Salesforce org with minimal history will not get good scores.

---

## LECTURE SUMMARY

- **Training data** is the historical dataset used to teach an ML model to find patterns.
- **Labeled data** has correct answers attached (required for supervised learning); **unlabeled data** does not (used in unsupervised learning).
- **Data volume thresholds:** rough minimums range from hundreds to thousands for simple models; foundation models use billions of tokens.
- **The three-way split:** Training set (learn) → Validation set (tune) → Test set (evaluate honestly). Like textbook → practice exam → final exam.
- **Overfitting:** great on training data, bad on new data — model memorized instead of generalizing.
- **Underfitting:** bad on both — model too simple or insufficient data.
- **Einstein models** are trained on your own org's historical CRM data for personalized predictions.

---

## MINI QUIZ

**Question 1:** A machine learning model has 99% accuracy on the training set but only 58% accuracy on the test set. What problem does this indicate?

- A) Underfitting
- B) Overfitting
- C) Data bias
- D) Insufficient training data

**Correct Answer: B**
**Explanation:** This pattern — high training accuracy, low test accuracy — is the classic signature of overfitting. The model memorized the training data rather than learning generalizable patterns. Underfitting (A) would show poor performance on both sets. Data bias (C) would manifest differently. Insufficient training data (D) typically causes underfitting, not this specific gap between training and test performance.

---

**Question 2:** Which type of data is required to train a supervised machine learning model?

- A) Unstructured data only
- B) Unlabeled data with many features
- C) Labeled data with known outcomes
- D) Real-time streaming data

**Correct Answer: C**
**Explanation:** Supervised learning requires labeled data — historical examples where the correct output (label) is already known. The model learns to predict the label from the input features. Unlabeled data (B) is used in unsupervised learning. Unstructured data (A) can be used in ML but it must be converted to a format the model can process. Real-time streaming data (D) is unrelated to this distinction.

---

**Question 3:** In the textbook-practice exam-final exam analogy for ML data splits, what does the practice exam represent?

- A) The training set
- B) The test set
- C) The validation set
- D) The feature engineering set

**Correct Answer: C**
**Explanation:** The practice exam maps to the validation set — it's used during the learning process to check progress and make adjustments, but it's not the final measure of performance. The textbook = training set. The final exam = test set. There is no "feature engineering set" in standard ML terminology.
