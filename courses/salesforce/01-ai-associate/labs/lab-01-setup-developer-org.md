# Lab 01: Setup Developer Org — What You Need to Be Able to Do

**Lab Type:** Environment Setup
**Estimated Time:** 30-45 minutes

---

## Checklist: Developer Org Setup for AI Features

### 1. Create a Developer Edition Org
- [ ] Go to developer.salesforce.com/signup
- [ ] Fill in first name, last name, email, company name, username (must be unique email format, e.g., yourname+aidev@yourcompany.com)
- [ ] Verify via email → log in
- [ ] Note your org URL (e.g., https://yourorg.my.salesforce.com)

### 2. Enable Einstein Features
- [ ] Navigate: Setup → Einstein → AI Assistant Settings (or search "Einstein" in Setup)
- [ ] Turn ON Einstein generative AI features (if prompted for agreement, review and accept)
- [ ] Verify: Einstein menu items appear in Setup sidebar

### 3. Verify Prompt Builder Access
- [ ] Navigate: Setup → Einstein → Prompt Builder
- [ ] Confirm Prompt Builder page loads (not just an error/unavailable screen)
- [ ] You should be able to see "+ New Prompt Template" button
- [ ] If Prompt Builder not available: confirm your org edition supports it (Developer Edition should)

### 4. Verify Einstein Prediction Builder Access
- [ ] Navigate: Setup → Einstein → Prediction Builder
- [ ] Confirm Prediction Builder page loads
- [ ] You should see "+ New Prediction" or similar button
- [ ] If unavailable: Einstein Prediction Builder requires sufficient Salesforce data (may show a message about data requirements)

### 5. Verify Next Best Action Access
- [ ] Navigate: Setup → Einstein → Next Best Action
- [ ] Alternatively: Navigate to Salesforce Recommendations object in Object Manager
- [ ] Confirm Strategy Builder is accessible (you can create a new Strategy)

### 6. Set Up Sample Data (for testing)
- [ ] Import or manually create:
  - [ ] 5+ Account records (different industries, revenue sizes)
  - [ ] 10+ Lead records (mix of converted and open)
  - [ ] 5+ Opportunity records (mix of stages and values)
  - [ ] 3+ Case records (different priorities and statuses)

---

## What This Unlocks for Exam Prep

With this setup you can:
- **Actually run Prompt Builder templates** and see the Trust Layer in action (masking, audit trail)
- **See Einstein Prediction Builder wizard** and understand what it asks for (object, outcome, features)
- **Build a test Strategy** in NBA Strategy Builder and see the visual flow
- **Explore the Audit Trail** (Einstein → AI Activity) after any AI interaction

---

## Key Settings to Know for the Exam (Not Just for the Lab)

| Setting Location | What It Controls |
|----------------|----------------|
| Setup → Einstein → AI Assistant Settings | Enable/disable Einstein generative features org-wide |
| Setup → Profiles/Permission Sets | Control which users can USE Einstein features (different from which features are enabled) |
| Setup → Einstein → Audit Trail | View logs of all AI interactions |
| Setup → Duplicate Rules | Data quality for training data (Uniqueness dimension) |
| Setup → Validation Rules | Data quality enforcement (Validity dimension) |
| Setup → Salesforce Optimizer | Org-wide health report including data quality indicators |
