# Lecture 04: Identity Resolution

## Learning Objectives
- Explain the purpose and outcome of Identity Resolution in Data Cloud
- Describe match rules including exact match, fuzzy match, and normalized match
- Configure reconciliation rules that determine which field value appears on the Unified Individual
- Understand how the Unified Individual profile is created and what it contains

---

## Slides

### Slide 1: The Identity Problem
**Visual:** Three customer record cards side by side: Card 1 from CRM "John Smith / john.smith@email.com / ID: CRM-001," Card 2 from E-Commerce "J. Smith / johnsmith@email.com / ID: EC-4421," Card 3 from Loyalty App "John S / john.smith@email.com / Member: LY-99." An arrow below pointing to a single merged card labeled "Unified Individual."

**Content:**
- Most enterprises have **multiple records for the same customer** across different systems
- Each source system uses its own ID — no shared universal customer ID
- Without resolution, you get duplicate outreach, inconsistent personalization, incomplete profiles
- **Identity Resolution (IR)** is the automated process of recognizing and merging duplicate records
- Output: a single **Unified Individual** record representing one real-world person

**Speaker Notes:** Identity Resolution is one of the highest-value features of Data Cloud and is heavily tested on the exam. The exam tests both the conceptual understanding (why IR exists) and the technical configuration (how to set up rulesets, match rules, and reconciliation rules). The core problem IR solves is: the same customer has different IDs in different systems, and those systems don't know they're talking about the same person. IR finds those duplicate representations, links them together, and creates a single golden record — the Unified Individual — that reflects everything known about that customer.

---

### Slide 2: Identity Resolution Architecture
**Visual:** A pipeline diagram showing: Individual DMO records (from multiple sources) → Identity Resolution Ruleset → Match Graph (showing linked records) → Unified Individual DMO.

**Content:**
- IR operates on **Individual DMO records** and their associated **Contact Point** records
- Configured through an **Identity Resolution Ruleset** — a named set of rules
- The ruleset contains one or more **Match Rules** (who should be linked)
- And one or more **Reconciliation Rules** (what value to use when sources disagree)
- Running the ruleset produces/updates the **Unified Individual** records
- IR rulesets can be run **on demand** or on a **scheduled** basis

**Speaker Notes:** The architecture here is simple but the configuration details are complex, which is why the exam focuses heavily on it. A Ruleset is the container — think of it as the "policy" for how Data Cloud should identify and merge records. Within that ruleset, Match Rules define the criteria for saying "these two Individual records represent the same person." Reconciliation Rules define what to do with conflicting values — for example, if the CRM says the customer's first name is "Jon" and the e-commerce system says "John," which one wins? The ruleset runs against all Individual records and their Contact Points, builds a match graph, and outputs Unified Individual records.

---

### Slide 3: Match Rules — Exact Match
**Visual:** Two Individual records shown side by side. Match rule criteria highlighted: EmailAddress = "john.smith@company.com" matches on both records, shown in green. Result: "Match Detected."

**Content:**
- **Exact Match:** Records match only if the specified field values are character-for-character identical
- Most precise, lowest false positive rate, but misses variations like "john@company.com" vs "JOHN@COMPANY.COM"
- Common exact match fields: **Email Address, Phone Number, Government ID, Loyalty Member ID**
- Data Cloud applies case normalization to email before exact matching (case-insensitive)
- Multiple exact match rules can be combined with AND/OR logic
- **Use exact match** when data quality is high and fields are reliable unique identifiers

**Speaker Notes:** Exact match is the strictest form of matching and should be used for high-confidence identifiers like email addresses, phone numbers formatted consistently, or proprietary IDs that are truly unique (loyalty numbers, government IDs). The exam often tests a scenario where "email addresses from two sources don't match because one source stores them in uppercase." Data Cloud handles email case normalization automatically, so "JOHN@COMPANY.COM" and "john@company.com" will match. However, other fields are case-sensitive unless normalized. The exam may ask about the tradeoffs between exact and fuzzy matching — exact has fewer false positives but lower recall (misses more true matches due to minor variations).

---

### Slide 4: Match Rules — Fuzzy Match
**Visual:** Two Individual records. Name fields shown: "Robert Johnson" vs "Rob Johnson." A fuzzy match confidence score "87%" is displayed between them. Result: "Match with Confidence Score."

**Content:**
- **Fuzzy Match:** Uses algorithms to find records that are similar but not identical
- Used for name fields where variations, typos, or abbreviations are common
- Data Cloud uses **Levenshtein distance** and similar algorithms to compute similarity scores
- A **match threshold** (percentage) determines the minimum similarity to count as a match
- Higher threshold = fewer false positives, more false negatives
- Lower threshold = more matches found, higher risk of false positives (incorrect merges)
- Fuzzy match is computationally more expensive than exact match

**Speaker Notes:** Fuzzy matching is appropriate for name fields because people spell their names differently, use nicknames, or make typos during registration. "Robert" and "Rob," "Johnson" and "Johnston," "Katherine" and "Catherine" — all of these are cases where fuzzy matching catches true duplicates that exact match would miss. The exam tests the tradeoff: a very low threshold catches more matches but risks incorrectly merging two different people (false positive). A very high threshold is safer but misses some real duplicates (false negative). The art of configuring IR is tuning thresholds to achieve the right balance for the client's business requirements. For high-stakes industries like financial services, false positives (merging two different people) are more dangerous than false negatives.

---

### Slide 5: Match Rules — Normalized Match
**Visual:** Two phone number records: "1-800-555-0100" and "(800) 555-0100." A normalization transformation strips formatting to "8005550100" for both. Then an exact comparison shows "Match."

**Content:**
- **Normalized Match:** Applies a normalization transformation before comparing field values
- Strips formatting differences that don't represent different entities
- Common normalizations:
  - **Phone:** Removes dashes, parentheses, spaces, country codes → compare digit strings
  - **Name:** Removes salutations (Mr., Mrs., Dr.), suffixes (Jr., Sr.), converts to lowercase
  - **Address:** Expands abbreviations (St → Street, Ave → Avenue)
- After normalization, comparison can be exact or fuzzy
- Prevents false non-matches caused purely by formatting differences

**Speaker Notes:** Normalized matching bridges the gap between exact and fuzzy. It's "exact match on normalized data." The classic example is phone numbers: "(800) 555-0100" and "800-555-0100" and "8005550100" are all the same number but would fail an exact match without normalization. By stripping all formatting and comparing only the digit strings, normalized match correctly identifies them as the same number. The exam tests understanding that normalization is a preprocessing step — it doesn't change the source data, it just prepares the values for comparison. This is important because it means normalization doesn't affect what's stored in the DLO or DMO.

---

### Slide 6: Reconciliation Rules
**Visual:** A table showing two source records for the same customer: CRM source has FirstName="Jon", Loyalty source has FirstName="John". A reconciliation rule "Most Recently Updated Source Wins" shows an arrow pointing to the Loyalty record's "John" as the winner, which appears on the Unified Individual.

**Content:**
- **Reconciliation Rules** determine which source's value appears on the Unified Individual when sources disagree
- Configured per field on the Unified Individual
- **Reconciliation strategies:**
  - **Source Priority:** A manually ranked list of source systems; highest-ranked source wins
  - **Most Occurred:** The value that appears most frequently across all sources wins
  - **Most Recent:** The most recently updated source's value wins
- If no reconciliation rule is set, a default strategy applies
- Reconciliation only applies when there IS a conflict — if all sources agree, the value is used directly

**Speaker Notes:** Reconciliation rules are frequently tested because they represent a business decision: whose data do you trust most? For many clients, the CRM is the authoritative "source of truth" for basic profile data like name and address, so they'd use Source Priority with CRM ranked first. For behavioral data like last purchase date, the e-commerce platform might be more current, so Most Recent makes sense. The exam will present a business scenario and ask which reconciliation strategy is most appropriate. Know all three strategies cold: Source Priority (manual trust ranking), Most Occurred (democratic — majority wins), and Most Recent (time-based — newest update wins).

---

### Slide 7: Unified Individual — The Output
**Visual:** A unified profile card showing all attributes from multiple sources merged together. Sections visible: "Profile Attributes" (Name, DOB, Gender), "Contact Points" (3 emails, 2 phones listed), "Source Records" (CRM-001, EC-4421, LY-99 listed as linked source IDs).

**Content:**
- The **Unified Individual** is a standard DMO record created/updated by the IR ruleset
- Contains **reconciled attribute values** (winning values from reconciliation rules)
- Contains references to **all linked Contact Points** (all emails and phones across sources)
- Contains a list of **source Individual records** that were merged into it
- Serves as the root record for segmentation and activation
- One customer = one Unified Individual (ideally)
- Can be inspected in the Data Cloud UI → Unified Individual section

**Speaker Notes:** The Unified Individual is the North Star — the whole reason you're running all this complex processing. Every segment you build, every activation you run, every AI recommendation you serve — it all starts from the Unified Individual. When you inspect a Unified Individual record, you can see all the component records that contributed to it, all their contact points (email addresses, phone numbers), and the reconciled values that won in each field conflict. This transparency is important for data quality auditing. The exam sometimes tests what a consultant should do if a Unified Individual looks wrong — the answer is usually to review the match rules and reconciliation rules, not to edit the Unified Individual directly (you can't edit it directly).

---

### Slide 8: IR Troubleshooting & Match Quality
**Visual:** A traffic light graphic with three scenarios: Green — "High match confidence, records merged correctly." Yellow — "Possible false positive — review threshold." Red — "Records not matching — check Contact Point mapping."

**Content:**
- **Too many merges (false positives):** Lower match confidence threshold or remove aggressive fuzzy rules
- **Too few merges (false negatives):** Lower the threshold, add more match criteria (phone in addition to email), check Contact Point DMO mapping
- **Unexpected merge:** Review the match rule that caused it — add an exclusion criterion
- **IR not running:** Check if the ruleset is active and scheduled
- **Records missing from Unified Individual:** Verify field mapping for Individual DMO includes the primary key
- **Reviewing match results:** Use Data Cloud UI → Identity Resolution → Review Match Groups

**Speaker Notes:** Troubleshooting IR is a common exam scenario type. The pattern is always: describe a symptom, ask what the consultant should check. Low match counts → check Contact Point DMO mapping (most common root cause is unmapped email fields). Too many merges → tune match thresholds up or add qualifying criteria. Unexpected merges → review which rule caused the match and add an exclusion. Completely no merges → check that the ruleset is active and that Individual DMO records exist with valid primary keys. One specific exam trap: "the IR ruleset is configured but no Unified Individuals are being created" — check whether the Individual DMO has any records at all. If field mapping wasn't configured, the DMO is empty, and IR has nothing to process.

---

## Recording Script

Welcome to Lecture 04, where we tackle Identity Resolution — arguably the most technically complex topic on the Data Cloud Consultant exam.

Let's start with the problem. Your enterprise client has a customer named Sarah Chen. In their CRM, she's Contact ID 10045. In their e-commerce platform, she's customer sarah.chen at gmail. In their loyalty app, she's member number 7723. Three records, one person. Without Identity Resolution, any segment you build has a fragmented view of Sarah. She might receive duplicate emails, get served ads for products she already bought, or fall out of a churn-risk segment because the model only sees part of her activity.

Identity Resolution solves this by finding those three records and recognizing they represent the same person. The output is a Unified Individual record for Sarah that knows she has all three source records linked to her, knows all her contact points, and presents a single reconciled view of her attributes.

How does it know the records belong to the same person? Through **Match Rules**. You configure rules that say: if two Individual records share the same email address — exact match — link them. Or if two records have similar names — fuzzy match above an 85% similarity threshold — AND share the same city, link them. You can stack multiple match rules, and any single rule creating a link is sufficient to merge the records.

When two sources disagree on a field value — one source says her name is "Sara" and another says "Sarah" — **Reconciliation Rules** determine which value wins on the Unified Individual. You choose: trust the source with the highest priority (Source Priority), use the value that appears most often (Most Occurred), or use the most recently updated value (Most Recent).

The three types of matching: **Exact Match** for high-confidence identifiers like email and phone. **Fuzzy Match** for name fields where variations are expected. **Normalized Match** for data that has formatting differences but is actually the same — like phone numbers stored in different formats.

Remember: Identity Resolution works on the Individual DMO and Contact Point DMOs. If those DMOs aren't populated through field mapping, IR has nothing to process. That's the first troubleshooting step when IR isn't producing results.

Next up, we move from data modeling into segmentation. See you in Section 2.

---

## Exam Tips

- Identity Resolution uses the **Individual DMO** and **Contact Point DMOs** — not DLOs, and not the Unified Individual as input
- **Contact Point Email** DMO must be populated for email-based matching — this is one of the most common exam traps
- The three reconciliation strategies are **Source Priority, Most Occurred, and Most Recent** — know when to apply each
- **Fuzzy match threshold:** Higher = fewer false positives but more false negatives; Lower = more matches but higher merge risk
- If IR produces no Unified Individuals, check that field mapping is complete and Individual DMO records exist before checking ruleset configuration

---

## Lecture Summary

Identity Resolution is the Data Cloud process that matches records from multiple source systems and merges them into a single Unified Individual profile. It operates on Individual DMO records and their associated Contact Point records. The process is governed by an Identity Resolution Ruleset containing Match Rules and Reconciliation Rules. Match rules use exact matching for high-confidence identifiers, fuzzy matching for name fields, and normalized matching to handle formatting differences. Reconciliation rules determine which source's value wins on the Unified Individual when conflicts exist, using strategies of Source Priority, Most Occurred, or Most Recent. The Unified Individual is the output and the foundation for all downstream segmentation, activation, and analytics.

---

## Mini Quiz

**Question 1:** A consultant is configuring Identity Resolution and wants to match records where two Individual records share the same phone number, even if the phone numbers are formatted differently (e.g., "555-123-4567" vs "(555) 123-4567"). Which match rule type should be used?

A) Exact Match on the phone field  
B) Fuzzy Match with a 90% threshold  
C) Normalized Match with phone normalization  
D) Custom formula match using REGEX  

**Answer: C**
Normalized Match applies a normalization transformation (stripping formatting characters from phone numbers) before comparison, then performs an exact match on the normalized values. This correctly identifies the two phone numbers as identical despite formatting differences.

---

**Question 2:** After running Identity Resolution, a consultant reviews the Unified Individual records and finds that two customers with similar names but different email addresses have been incorrectly merged into one Unified Individual. What is the most appropriate corrective action?

A) Manually delete the incorrect Unified Individual record and create two new ones  
B) Review and increase the fuzzy match threshold for the name-based match rule to reduce false positives  
C) Add an exclusion rule for email addresses  
D) Disable Identity Resolution for all name-based matching  

**Answer: B**
The incorrect merge was caused by a fuzzy name match that was too permissive. Increasing the match threshold requires a higher similarity score before a match is declared, reducing false positives. Manually editing Unified Individual records is not supported. Disabling all name matching is too extreme.

---

**Question 3:** An organization has configured Identity Resolution with Source Priority reconciliation rules, ranking their CRM as the highest priority source. However, the Unified Individual records show email addresses from the e-commerce system instead of the CRM. What is the most likely explanation?

A) Source Priority reconciliation only applies to name fields, not Contact Point fields  
B) The CRM Individual records do not have associated Contact Point Email records  
C) The e-commerce system has a higher data volume and overrides Source Priority  
D) Contact Point fields cannot be reconciled — they are always taken from all sources  

**Answer: D**
Contact Points are additive — all contact points from all linked source Individual records are included on the Unified Individual. Reconciliation rules apply to attribute fields (name, birthdate, etc.) on the Unified Individual itself, not to Contact Points. All email addresses from all sources appear on the Unified Individual's contact point list.
