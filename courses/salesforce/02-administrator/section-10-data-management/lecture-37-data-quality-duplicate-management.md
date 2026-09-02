# Data Quality & Duplicate Management

## Exam Domain
Data & Analytics — 14% of exam

## Core Concepts

Duplicate data is the enemy of CRM value. Salesforce has a built-in framework for preventing and managing duplicates: Matching Rules + Duplicate Rules.

**Two-component framework:**

**Matching Rules:**
- Define HOW to compare records to determine if they're duplicates
- Set the matching criteria and matching algorithm (fuzzy, exact)
- Examples: "Leads with the same email address," "Contacts with the same first name, last name, and phone"
- Standard matching rules come pre-configured for Accounts, Contacts, and Leads
- **Standard matching rules are INACTIVE by default** — you must activate them

**Duplicate Rules:**
- Define WHAT happens when a duplicate is detected
- Works with a Matching Rule to take action
- Three possible actions:
  1. **Allow (with alert)** — Save the record, but show a warning that a potential duplicate exists
  2. **Block** — Prevent saving the record (like a validation rule for duplicates)
  3. **Report** — Track duplicates for later review (stores them in a Duplicate Record Set)
- Can apply to: on record create only, or on create AND edit

**The pair:** One Matching Rule tells Duplicate Rules how to find duplicates; a Duplicate Rule tells what to do about them.

**Merge:**
- Combine duplicate records into one
- Available for: **Accounts, Contacts, and Leads only** (not Opportunities, Cases, or custom objects natively)
- Maximum: **3 records per merge operation**
- Process: choose the Master Record (this ID is preserved), select which field values to keep from each record
- After merge: related records (Contacts on an Account, Activities on a Contact) move to the master record
- Merged records go to the Recycle Bin (can be undeleted, but master record keeps the merged data)

**Duplicate Record Sets:**
- When a Duplicate Rule uses "Report" action, duplicates are stored in Duplicate Record Sets
- View and manage from: Setup → Duplicate Management → Duplicate Record Sets

## PTA / SA Relevance

Duplicate management is a data governance decision. The most common enterprise failure: customers enable Salesforce without activating matching rules, sales reps create duplicates for years, and then someone asks "why does this customer appear 50 times?"

**The activation trap:** Standard Matching Rules are inactive by default. Many admins don't realize this until they see duplicate accounts proliferating. First thing to check in any org assessment: are matching rules active?

**Block vs Allow:** The "Block" action is more aggressive — it prevents duplicate creation entirely. This improves data quality but frustrates users if the matching algorithm produces false positives (flagging records as duplicates that aren't). The "Allow with alert" action is softer — users can override and create the duplicate intentionally. Choose based on the organization's tolerance for duplicates vs user friction.

**Merge strategy at scale:** Merging 3 records at a time manually is impractical when you have 10,000 duplicate accounts. Enterprise duplicate management requires third-party deduplication tools (Cloudingo, DemandTools) for bulk merging. Salesforce's native merge is for tactical cleanup.

## Architecture / How It Works

```
Duplicate Management Framework
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  MATCHING RULE (how to find duplicates)
  ┌─────────────────────────────────────────┐
  │  Match Criteria:                        │
  │  Email = exact match                    │
  │  OR (First Name + Last Name = fuzzy)    │
  └────────────────┬────────────────────────┘
                   │ feeds into
                   ▼
  DUPLICATE RULE (what to do about it)
  ┌─────────────────────────────────────────┐
  │  Object: Lead                           │
  │  Action: Block (prevent save)           │
  │  Alert Message: "Duplicate lead found"  │
  │  Report: Yes (add to Duplicate Set)     │
  └─────────────────────────────────────────┘

  Merge Process:
  ┌─────────────────────────────────────────┐
  │  Record A  Record B  Record C           │
  │  (duplicate accounts)                   │
  │                                         │
  │  Choose Master: Record A                │
  │  Select field values:                   │
  │    Name: from A                         │
  │    Phone: from B (more current)         │
  │    Website: from C                      │
  │                                         │
  │  Result: Record A = merged master       │
  │  Records B & C → Recycle Bin            │
  │  Related records → move to Record A     │
  └─────────────────────────────────────────┘
```

**Limitations:**
- Standard Matching Rules are INACTIVE by default — must activate manually
- Merge: limited to Accounts, Contacts, Leads; max 3 records per operation
- Merge is not reversible once completed (though records B & C go to Recycle Bin, the merged master has new values)
- Duplicate Rules only work with Matching Rules — they can't function independently
- Cross-object duplicate detection (e.g., Lead vs. Contact) requires separate matching rules per object pair
- "Block" action can be bypassed by administrators using "Import" operations that skip duplicate rules

## Key Facts to Memorize

- Matching Rules = HOW to detect duplicates (criteria + algorithm)
- Duplicate Rules = WHAT to do when duplicate detected (Allow, Block, Report)
- Standard Matching Rules = **inactive by default** (must activate)
- 3 Duplicate Rule actions: Allow (with alert), Block, Report
- Merge available for: Accounts, Contacts, Leads ONLY
- Merge maximum: 3 records per operation
- Master record in merge = keeps its Salesforce ID; other records go to Recycle Bin
- Related records after merge = move to the master record

## Exam Traps

- **"Standard Matching Rules are active by default"** — FALSE. Must be activated manually.
- **"You can merge up to 10 records at once"** — FALSE. Maximum 3 records per merge.
- **"Merge can be used on Opportunities"** — FALSE. Merge is only available for Accounts, Contacts, and Leads natively.
- **"Duplicate Rules work without Matching Rules"** — FALSE. Duplicate Rules require an associated Matching Rule to identify duplicates.
- **"The Block action prevents ALL duplicates from being saved by any user"** — FALSE. System Administrators can bypass Block actions by using import tools.

## Practice Questions

**Q:** An admin enables Salesforce's built-in duplicate detection for Leads but users report that duplicate leads are still being created. What is the likely cause?
**A:** The Standard Matching Rules for Leads are inactive by default and must be activated. The admin needs to activate the standard Lead Matching Rule and ensure a Duplicate Rule is also active and set to Block.

**Q:** A CRM manager wants to prevent sales reps from saving a new Lead if a Lead with the same email address already exists. What should be configured?
**A:** 1. Activate (or create) a Matching Rule for Leads that matches on Email field. 2. Create a Duplicate Rule for Leads that uses this Matching Rule with Action = Block.

**Q:** What are the three possible actions a Duplicate Rule can take when it detects a duplicate?
**A:** Allow (let the user save but show a warning/alert), Block (prevent the save), or Report (allow save but log the duplicate in a Duplicate Record Set for review).

**Q:** A sales rep merges three duplicate Accounts (A, B, C) and selects Account A as the master. What happens to the related Contacts, Opportunities, and Activities from Accounts B and C?
**A:** All related records (Contacts, Opportunities, Activities) are moved to the master Account A. Accounts B and C are moved to the Recycle Bin.
