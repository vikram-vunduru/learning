# Lab 02: Identity Resolution Configuration

## Lab Domain
Data Modeling & Identity Resolution — hands-on for exam scenario questions

## What You Need to Be Able to Do

### Field Mapping — DMO Setup
- [ ] Navigate to Data Cloud → Data Model → Field Mapping
- [ ] Select a DLO from a configured Data Stream
- [ ] Map DLO fields to the **Individual** DMO:
  - [ ] Source primary key → Individual.PartyId
  - [ ] First name field → Individual.FirstName
  - [ ] Last name field → Individual.LastName
  - [ ] Birth date (if available) → Individual.BirthDate
  - [ ] Loyalty tier (if available) → Individual.PersonLifeStage or custom field
- [ ] Map a **separate** DLO email field → Contact Point Email DMO:
  - [ ] Email address → ContactPointEmail.EmailAddress
  - [ ] Source customer ID → ContactPointEmail.IndividualId (FK — links email to person)
- [ ] Map phone (if available) → Contact Point Phone DMO:
  - [ ] Phone number → ContactPointPhone.TelephoneNumber
  - [ ] Source customer ID → ContactPointPhone.IndividualId (FK)
- [ ] Save and verify DMO record counts after the next Data Stream run

### Confirming Field Mapping is Working
- [ ] Verify Individual DMO has records (not 0) — if 0, Primary Key mapping is probably wrong
- [ ] Verify Contact Point Email DMO has records — if 0, email IR matching will produce 0 matches
- [ ] Spot-check: find a known customer in Individual DMO and confirm their email is in CPEmail with matching IndividualId

### Identity Resolution Ruleset Configuration
- [ ] Navigate to Data Cloud → Identity Resolution → New Ruleset
- [ ] Add a Match Rule: Exact Match on Contact Point Email DMO → EmailAddress field
- [ ] Add a second Match Rule (optional): Fuzzy Match on Individual DMO → FirstName + LastName (set threshold 85–90%)
- [ ] Configure Reconciliation Rules for Individual attribute fields:
  - [ ] Source Priority: rank CRM highest for FirstName, LastName
  - [ ] Most Recent: for Address/City fields
- [ ] Activate the ruleset
- [ ] Run the ruleset and observe:
  - [ ] Number of match groups created
  - [ ] Number of Unified Individuals created
  - [ ] Match group size distribution (watch for "super-matchers" — huge match groups indicating a shared email/phone problem)

### Verifying IR Results
- [ ] Navigate to a Unified Individual record and verify:
  - [ ] Reconciled attribute values match expected source priority
  - [ ] ALL Contact Points from ALL source records appear (additive — not just one source)
  - [ ] Source record links are present (how many source records were merged)
- [ ] Compare: source Individual DMO record count vs. Unified Individual count (ratio indicates deduplication)

### Troubleshooting IR
- [ ] What to check if Unified Individuals = 0:
  - [ ] Is the ruleset in Active (not Draft) state?
  - [ ] Does the Individual DMO have records?
  - [ ] Does the Contact Point Email DMO have records?
- [ ] What to check if too many records are merged (false positives):
  - [ ] Is fuzzy match threshold too low? Increase it.
  - [ ] Is there a "super-matcher" email (e.g., a shared corporate email)? Exclude it with a qualifying condition.
- [ ] What to check if too few records are merged:
  - [ ] Is CPEmail DMO populated with IndividualId FK correctly?
  - [ ] Are emails in the same format across sources? (consider Normalized match for phone)

---

## Key Checks After Lab Completion

Before moving on, verify:
- Individual DMO has records
- Contact Point Email DMO has records with IndividualId FK populated
- IR ruleset is Active and has run at least once
- Unified Individuals exist with count < Individual DMO count (dedup ratio > 1:1 means IR is working)
- At least one Unified Individual shows multiple source records linked and all contact points present

---

## Common Lab Mistakes to Avoid

- Only mapping email to Individual DMO (not to Contact Point Email DMO) — results in 0 IR email matches
- Forgetting to ACTIVATE the ruleset after configuration — it runs but creates no matches in Draft state
- Setting fuzzy threshold too low (50–60%) and getting false positive merges across different customers
- Not checking the IndividualId FK on Contact Point Email — without it, the email record can't be linked to the person record
