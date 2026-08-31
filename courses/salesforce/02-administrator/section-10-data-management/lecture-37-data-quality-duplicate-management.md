# L37: Data Quality & Duplicate Management

## 🎯 Learning Objectives
- Configure Matching Rules to identify potential duplicate records using standard and fuzzy matching
- Set up Duplicate Rules to control what happens when duplicates are detected (Alert, Block, Report)
- Understand the standard duplicate rules for Leads, Contacts, and Accounts
- Use Duplicate Jobs to find and clean existing duplicates in the org
- Merge duplicate records (Accounts, Contacts, Leads — up to 3 at once)

## 📊 SLIDES

### Slide 1: The Duplicate Management Framework
**Visual:** Three-tier architecture diagram: Matching Rules (bottom) → Duplicate Rules (middle) → User Experience (top: alert/block message), with arrows showing the flow
**Content:**
- Salesforce's duplicate management consists of two components:
  1. **Matching Rules:** Define HOW to identify a potential duplicate (the algorithm)
  2. **Duplicate Rules:** Define WHAT to do when a duplicate is detected (the action)
- **Matching Rule:** Specifies which fields to compare and how (exact vs. fuzzy)
- **Duplicate Rule:** References one or more matching rules; defines the action (alert, block, report)
- **Works on:** Save (when creating or editing a record), and via Duplicate Jobs (for existing data)
- Standard matching/duplicate rules are provided for Leads, Contacts, and Accounts
**Speaker Notes:** The two-tier approach separates the detection logic from the enforcement action. This means you can reuse the same matching rule in multiple duplicate rules with different actions. For example, one duplicate rule might just alert users (for Contacts), while another blocks saves entirely (for critical Account records). This architecture gives admins granular control.

### Slide 2: Matching Rules — How Duplicate Detection Works
**Visual:** Matching Rule configuration screen showing a field list with match types: Exact, First Word, Last Word, Full Name, Email (exact), Phone (fuzzy — normalizes formatting)
**Content:**
- A **Matching Rule** specifies:
  - Which **fields** to compare between the new record and existing records
  - What **match type** to use for each field:
    - **Exact:** Values must match exactly (case-insensitive)
    - **Fuzzy:** Tolerates variations (e.g., "IBM" matches "International Business Machines")
    - **First Word / Last Word:** Match on first or last word of a name field
    - **Acronym:** Matches acronyms to full names
    - **Phone:** Normalizes phone number formatting before matching
    - **Email:** Domain and local part matching options
- Multiple fields → records must match on a combination (all fields combined = weighted score)
- A matching score threshold determines if two records are "matches"
**Speaker Notes:** Fuzzy matching is what makes Salesforce duplicate detection intelligent. Instead of just checking if "IBM" equals "IBM," fuzzy matching can detect that "IBM Corp" and "International Business Machines Corporation" likely refer to the same company. Different match types are better for different field types. Phone normalization is particularly useful because users enter phone numbers in many formats. The matching threshold is a percentage score — records above the threshold are flagged as potential duplicates.

### Slide 3: Standard Matching Rules and Duplicate Rules
**Visual:** Table showing three standard sets: (1) Standard Contact Matching Rule + Standard Contact Duplicate Rule, (2) Standard Lead Matching Rule + Standard Lead Duplicate Rule, (3) Standard Account Matching Rule + Standard Account Duplicate Rule
**Content:**
- **Standard Contact Matching Rule:** Matches on First Name, Last Name, Account Name, Email (fuzzy + exact combinations)
- **Standard Lead Matching Rule:** Matches on First Name, Last Name, Company, Email
- **Standard Account Matching Rule:** Matches on Account Name and Billing Address
- **Standard Duplicate Rules:** Alert (don't block) when a potential duplicate is found
  - Users see a warning but can still save the record
  - Default action: Alert — can be changed to Block
- Standard rules are inactive by default and must be ACTIVATED before they work
- Standard rules can be edited (change action) or used as templates for custom rules
**Speaker Notes:** Standard rules come pre-configured but inactive. An admin must activate them for them to have any effect. This is a common gotcha — duplicate rules only work when activated. The default standard rules use the Alert action, which warns users without blocking saves. If your business needs stricter enforcement, edit the rule to use the Block action instead. You can also create custom matching and duplicate rules for custom objects or for more complex matching logic.

### Slide 4: Duplicate Rule Actions — Alert, Block, Report
**Visual:** Three outcome screenshots: (1) Alert: yellow banner "Possible duplicate found" with option to continue, (2) Block: red error "Record cannot be saved - duplicate detected", (3) Report Only: no UI feedback, record saves but logged
**Content:**
- **Alert:**
  - Shows a warning to the user: "Possible duplicate found"
  - Displays the potential duplicate record(s) with a comparison view
  - User can review and choose to save anyway or not
  - Does NOT prevent saving — user has final say
- **Block:**
  - Prevents the record from being saved
  - User sees an error message; must resolve the duplicate situation
  - Enforces strict deduplication — no overrides allowed
- **Report (Allow with Report):**
  - Record saves with no visible warning
  - Duplicate is logged in a system report for later review
  - Used for background monitoring without disrupting users
**Speaker Notes:** The three actions represent three different philosophies. Alert trusts users to make the right call — it warns but doesn't block. Block takes control away from the user — zero tolerance for duplicates. Report is the stealth option — silent monitoring that lets admins review the duplicate situation without disrupting workflows. Choose Alert for initial rollout to avoid user frustration; switch to Block once data quality standards are established and users understand the process.

### Slide 5: Duplicate Rules Configuration Details
**Visual:** Duplicate Rule configuration screen showing: Object selector, Action (Alert/Block), On Create/On Edit checkboxes, Security settings (run on profile exceptions), and Associated Matching Rule selector
**Content:**
- **When to run:**
  - **On Create:** Check for duplicates when a new record is created
  - **On Edit:** Check for duplicates when an existing record is updated
- **Scope of comparison:** Compare against all records, or only records the user can access
  - "All records" (recommended for full coverage)
  - "Records user can access" (limited by sharing rules — may miss duplicates outside user's scope)
- **Profile/Permission Set bypass:** Add profiles or permission sets that bypass the rule
  - Use for data migration users, system admin bypass, or integration profiles
- **Alert text:** Customize the message users see in Alert mode
- **Associate Matching Rule(s):** Link one or more matching rules to this duplicate rule
**Speaker Notes:** The "compare against" setting is important. If set to "records user can access," a user with limited data visibility might not be alerted to duplicates that exist outside their sharing scope. For true org-wide deduplication, set it to "all records." The profile bypass is essential for data migration: temporarily add your data migration profile to the bypass list so imports aren't blocked by duplicate rules.

### Slide 6: Duplicate Jobs — Cleaning Existing Data
**Visual:** Setup → Duplicate Jobs screen showing: Create New Job (select object, associated rules), Job status (Running/Complete), Results showing X potential duplicates found, Download Results button
**Content:**
- **Duplicate Jobs** scan existing records in the org for duplicates
- Useful when duplicate rules are newly activated — existing data may already have duplicates
- Configuration:
  - Select the **object** to scan
  - Select the **matching rule** to use for comparison
  - Optionally filter records to scan (e.g., only recently modified)
- **Results:** Downloadable report of potential duplicate pairs with match scores
- Does **NOT** automatically merge records — admin reviews and merges manually
- Duplicate Jobs are separate from real-time duplicate rules
- **Limitation:** Large orgs may take significant time to process
**Speaker Notes:** Duplicate Jobs are the after-the-fact cleanup tool. If you enable duplicate rules today but have three years of data with duplicates, Duplicate Jobs help you find and clean that existing mess. The job produces a report of potential duplicate pairs — you then review and merge the ones that are actual duplicates. The job doesn't merge automatically because false positives exist — two "John Smith" Contacts might be genuinely different people.

### Slide 7: Merging Duplicate Records
**Visual:** Merge Records screen showing: three Contact records side by side with radio buttons to choose the master record and individual field value selections, with a "Merge" button
**Content:**
- Merge combines duplicate records into a single "master" record
- **Supported objects (standard merge tool):** Accounts, Contacts, Leads
- **Maximum per merge:** 3 records at a time
- **Merge process:**
  1. Select the **master record** (surviving record; its ID is preserved)
  2. Choose which field values to keep (per field, choose from any of the duplicates)
  3. All related records (Opportunities, Cases, Activities) from merged records are reparented to master
  4. Non-master records are deleted
- **Access:** Account/Contact/Lead list views → select records → Merge; or from Duplicate component
- **Permission required:** "Delete" on the object (to delete non-master records)
**Speaker Notes:** The merge operation is critical because it consolidates history. When you merge two Contacts, all Activities, Opportunities, and Cases associated with both Contacts are transferred to the master record. The master record's ID is preserved, which matters for integrations and reports. Always review field values carefully before merging — you can cherry-pick the best data from each duplicate. For example, one record might have the right phone number but the other has the right email.

### Slide 8: Data Quality Best Practices
**Visual:** Data quality pyramid showing layers: Governance (top) → Validation Rules → Duplicate Management → Import Best Practices → Training (base)
**Content:**
- **Prevention layer:** Validation rules, required fields, duplicate rules (block on create)
- **Detection layer:** Duplicate rules (alert), Duplicate Jobs, reports
- **Remediation layer:** Merge tools, Data Loader bulk updates
- **Governance:**
  - Establish data entry standards (address formats, phone formats)
  - Regular audits via scheduled reports
  - User training on data quality importance
- **Common data quality issues:**
  - Duplicate records (contacts, leads, accounts)
  - Incomplete records (missing key fields)
  - Stale data (old addresses, phone numbers)
  - Inconsistent formats (phone: 555-1234 vs. (555) 1234)
**Speaker Notes:** Data quality is an ongoing process, not a one-time project. The most effective approach layers prevention (stop bad data from entering), detection (find bad data that got through), and remediation (clean up existing bad data). Validation rules prevent formatting issues and required-field gaps. Duplicate rules prevent duplicate creation. Regular duplicate jobs and data quality reports catch issues that slip through. User training is the foundation — users who understand why data quality matters make better decisions.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 37 — Data Quality and Duplicate Management. Duplicate records are one of the most persistent data quality challenges in Salesforce, and the platform has a robust set of tools to prevent and remediate them.

Salesforce's duplicate management framework has two layers: Matching Rules and Duplicate Rules. A Matching Rule defines how Salesforce identifies potential duplicates — which fields to compare and how. A Duplicate Rule references matching rules and defines what to do when duplicates are detected.

Matching rules use different match types. Exact matching requires field values to be identical. Fuzzy matching uses algorithms to detect variations — "IBM" might match "International Business Machines." Phone matching normalizes formatting differences. Email matching is exact by default. You can combine multiple fields in one matching rule, and records that match above a threshold score are flagged as potential duplicates.

Salesforce provides standard matching and duplicate rules for Leads, Contacts, and Accounts — but they're inactive by default. You must activate them in Setup for them to have any effect.

When a duplicate is detected, the Duplicate Rule's action determines what happens. Alert shows a warning to the user but lets them save anyway. Block prevents the save entirely — zero tolerance. Report allows the save but silently logs the duplicate for admin review.

For existing data, use Duplicate Jobs. You run a job on an object with a matching rule, and Salesforce scans all existing records for potential duplicates. The job produces a downloadable report of duplicate pairs. You then manually review and merge the actual duplicates.

Merging is how you consolidate duplicate records. The standard merge tool works for Accounts, Contacts, and Leads — up to 3 records at a time. You select the master record (whose ID is preserved), choose which field values to keep, and merge. All related records are reparented to the master.

For the exam: know the Alert/Block/Report actions, that standard rules are inactive by default, that merge handles up to 3 records at once, and that Duplicate Jobs are for cleaning existing data.

## 🔔 EXAM TIPS
- **Two Components:** Matching Rules = HOW to detect duplicates. Duplicate Rules = WHAT to do. Both are required for the system to work.
- **Standard Rules Are Inactive:** Standard duplicate rules for Leads, Contacts, Accounts must be ACTIVATED by the admin — they don't work out of the box.
- **Three Actions:** Alert (warn, allow save), Block (prevent save), Report (silent logging). Know which enforces strictest control: Block.
- **Merge Limit:** Maximum 3 records per merge operation. Supported standard objects: Accounts, Contacts, Leads.
- **Merge Preserves Master ID:** The master record's Salesforce ID is preserved; related records (Opportunities, Cases, Activities) are reparented to the master.
- **Duplicate Jobs:** For scanning EXISTING records for duplicates — separate from real-time duplicate rules on saves.
- **Scope Setting:** Comparing against "all records" gives better coverage than "records user can access."

## ✅ LECTURE SUMMARY
- Duplicate management uses two components: Matching Rules (detection algorithm) and Duplicate Rules (action on detection)
- Matching rules support exact, fuzzy, phone normalization, email, and other match types
- Standard duplicate rules for Leads/Contacts/Accounts are inactive by default — must be activated
- Duplicate Rule actions: Alert (warn, allow save), Block (prevent save), Report (silent log)
- Duplicate Jobs scan existing records for duplicates; output is a report for manual review and merging
- Merge tool: Accounts/Contacts/Leads only; up to 3 records per merge; master record ID is preserved; related records reparented
- Data quality requires layered approach: prevention (validation rules + duplicate blocks), detection (alerts + jobs), and remediation (merge + bulk updates)

## ❓ MINI QUIZ

**Q1:** An admin sets up a Duplicate Rule for Contacts with the action set to "Block." A sales rep tries to create a new Contact with the same name and email as an existing Contact. What happens?
- A) The new Contact is saved but flagged as a potential duplicate in a report
- B) The user sees a warning but can still save the Contact
- C) The save is prevented and the user must resolve the duplicate situation before proceeding
- D) The duplicate is automatically merged with the existing Contact

**Answer:** C — The Block action prevents the record save entirely. The user sees an error message indicating a duplicate was found and cannot save the record until they either edit it to make it unique or navigate to the existing record instead. Salesforce does not automatically merge records — that is always a manual action.

**Q2:** An admin activates duplicate rules for the Account object today. These rules will prevent future duplicate accounts from being created. However, the admin suspects there are already hundreds of duplicate accounts in the system from the past two years. Which tool should the admin use to identify these existing duplicates?
- A) Data Import Wizard with "prevent duplicates" checkbox
- B) Account merge tool — manually search for each duplicate
- C) Duplicate Jobs — run a job on the Account object to scan for existing duplicates
- D) Create a report using the "Duplicates" standard report type

**Answer:** C — Duplicate Jobs are specifically designed to scan existing records in the org for potential duplicates using a matching rule. The admin runs a Duplicate Job on the Account object, specifying the appropriate matching rule. The job produces a downloadable report of potential duplicate pairs for review and subsequent merging.

**Q3:** A Salesforce admin needs to merge two duplicate Contact records. Record A has the correct phone number and Record B has the correct email address. How should the admin merge these records to preserve both correct values?
- A) Merge is all-or-nothing — you can only keep all values from one record
- B) Select Record A as master (to keep its phone), then Salesforce automatically takes the best values from Record B
- C) During the merge process, select the master record and then individually choose which field value to keep from either record for each field
- D) Export both records, manually combine the CSV, and re-import as one record

**Answer:** C — The merge interface shows all fields from both records side by side. For each field, you select which record's value to preserve in the final master record. This allows cherry-picking: keep Record A's phone number AND Record B's email address in the merged master record. It's a field-by-field selection process.
