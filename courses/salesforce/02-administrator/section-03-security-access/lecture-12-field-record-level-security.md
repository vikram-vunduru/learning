# Field-Level Security & Record Access

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Field-Level Security (FLS) controls access to individual fields, not entire objects. Even if you can see a record, FLS controls whether you can see or edit specific fields on that record. This is a separate layer from the sharing model (which controls access to records).

**The three FLS states:**
1. **Visible + Editable** — user can see and change the field value
2. **Visible, Not Editable (Read Only)** — user can see the value but cannot change it
3. **Not Visible** — the field is completely hidden from the user; appears blank even if it has a value

**FLS vs Page Layout — this is a critical exam distinction:**
| | FLS | Page Layout |
|---|---|---|
| Controlled via | Profile / Permission Set | Page Layout editor |
| Scope | Everywhere (API, reports, all UIs) | That specific page layout only |
| Which wins? | **FLS wins** | Overridden by FLS |

**FLS WINS over page layout.** If FLS says "not visible" but the page layout has the field, the field is hidden. If page layout has "required" but FLS says "read only," the field cannot be required (user can't edit it). FLS is the security layer; page layout is the UI layer.

**Where FLS is set:**
- Profile: Setup → Profiles → [Profile] → Field Permissions section
- Permission Set: Setup → Permission Sets → [Set] → Object Settings → [Object] → Field Permissions
- Field accessibility view: Object Manager → [Object] → Fields → [Field] → Field Accessibility (shows access by profile)

**Record-level security reminder:**
The full picture of "can this user access this record and its fields?" requires all three layers to align:
1. **OLS (Object-Level):** Can they access the object at all? (Profile CRUD)
2. **Record-level:** Can they access this specific record? (OWD + hierarchy + sharing)
3. **FLS (Field-Level):** Can they access this specific field? (Profile/Permission Set FLS)

All three must say YES for the user to see a field value on a record.

## PTA / SA Relevance

FLS is the enforcement layer that makes the difference between "users shouldn't see salary data" and "users definitely can't see salary data." Page layouts are cosmetic — a user with full field access and a page that hides a field can still see that data via:
- Reports
- API calls
- List views
- Related lists

This is a critical security architecture point. If sensitive data must be hidden, FLS (not page layout) is the control. This comes up constantly in HR, finance, and healthcare Salesforce implementations.

**Integration users:** API integrations bypass page layouts entirely. An integration user's FLS controls what the API can read or write. A common debugging session: "The API isn't returning the field value" — check FLS on the integration user's profile first.

## Architecture / How It Works

```
Three-Layer Access Model
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Can the user see field value X on record R?

  LAYER 1: Object-Level Security (OLS)
  ┌──────────────────────────────────────────┐
  │  Profile/Permission Set: READ on Object? │
  │  NO → Access denied (can't even see the  │
  │        object)                           │
  │  YES → Continue to Layer 2               │
  └──────────────────────────────────────────┘
                    ↓ YES
  LAYER 2: Record-Level Security
  ┌──────────────────────────────────────────┐
  │  OWD + Role Hierarchy + Sharing:         │
  │  Can user access this specific record?   │
  │  NO → Cannot see the record at all       │
  │  YES → Continue to Layer 3               │
  └──────────────────────────────────────────┘
                    ↓ YES
  LAYER 3: Field-Level Security (FLS)
  ┌──────────────────────────────────────────┐
  │  Profile/Permission Set: Field visible?  │
  │  VISIBLE + EDITABLE → See and edit ✓     │
  │  VISIBLE, READ ONLY  → See only ✓        │
  │  NOT VISIBLE         → Field hidden ✗    │
  └──────────────────────────────────────────┘

  FLS vs Page Layout Priority:
  ┌──────────────────────────────────────────┐
  │  FLS: Visible  + Page Layout: Hidden     │
  │    → Field HIDDEN (page layout wins on   │
  │      UI layout, but FLS still allows API)│
  │                                          │
  │  FLS: Not Visible + Page Layout: Visible │
  │    → Field HIDDEN (FLS always wins)      │
  │                                          │
  │  FLS: Read Only + Page Layout: Required  │
  │    → Field is NOT required (FLS wins)    │
  └──────────────────────────────────────────┘
```

**Limitations:**
- FLS set to "Not Visible" hides data everywhere — UI, API, reports, list views
- Page layouts are UI controls only — do not protect data from API or report access
- FLS cannot make a field visible to some users if OLS says they can't access the object
- FLS set via Permission Set is additive — if profile says "Not Visible" but Permission Set says "Visible," the field IS visible
- Fields with FLS = Not Visible will appear blank in reports; they won't throw an error

## Key Facts to Memorize

- FLS 3 states: Visible+Editable, Read Only, Not Visible
- **FLS wins over page layout** — FLS is the security layer; page layout is UI layer
- Page layout ≠ security — fields on page layout can still be accessed via API/reports
- To truly hide a field from all access: set FLS to Not Visible (not just remove from page layout)
- FLS is set per Profile and per Permission Set
- Permission Set FLS is additive: if profile says hidden but PS says visible → visible
- All three layers must allow access: OLS (object CRUD) + Record-level (sharing) + FLS (field)

## Exam Traps

- **"Removing a field from a page layout hides it from users"** — FALSE (from a security perspective). The field can still be accessed via reports, API, and other views. FLS = Not Visible is required for true security.
- **"FLS is the same as page layout visibility"** — FALSE. FLS is enforced everywhere; page layout is UI-only.
- **"A field set to Read Only in FLS can be made required in a page layout"** — FALSE. FLS Read Only means the user cannot edit the field, so it cannot be required.
- **"If a user has a Permission Set that makes a field visible, the profile's Not Visible setting still blocks it"** — FALSE. Permission Sets are additive — they override the profile's restriction.

## Practice Questions

**Q:** An admin wants to prevent users from seeing the Salary__c field on the Employee__c object in all contexts (UI, reports, API). What should they configure?
**A:** Set FLS to "Not Visible" for all relevant profiles/permission sets for the Salary__c field. Do NOT rely on removing it from page layouts — that only hides it in the UI.

**Q:** A page layout has the Annual_Revenue field marked as required. A user's profile has Annual_Revenue set to Read Only in FLS. What happens when the user tries to save a new Account?
**A:** FLS wins. Since FLS is Read Only, the user can't edit the field. The required constraint from the page layout doesn't apply because the user can't fulfill it. The field won't be enforced as required for this user.

**Q:** An integration via API is not returning the value of a custom field, even though the field has data. What is the most likely cause?
**A:** FLS on the integration user's profile (or permission set) has the field set to "Not Visible." FLS applies to API access — the integration user cannot read what FLS hides.

**Q:** What are the three layers of access control in Salesforce?
**A:** (1) Object-Level Security (OLS via Profile/Permission Set CRUD), (2) Record-Level Security (OWD + Role Hierarchy + Sharing Rules + Manual Sharing), (3) Field-Level Security (FLS via Profile/Permission Set).
