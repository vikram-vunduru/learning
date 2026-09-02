# User Setup & Management

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Users are the foundation of access control. Every person who logs into Salesforce needs a user record, and that record determines who they are, what they can do, and when they can log in.

**Required fields when creating a user:**
- First Name, Last Name
- Email (must be unique across all Salesforce orgs — globally unique)
- Username (must be unique globally; format: email format, but doesn't have to be a real email)
- Alias (short display name)
- Profile (exactly 1 required)
- Role (optional, but critical for record visibility)
- License Type (determines available profiles and features)

**User License Types (common ones):**
| License | What It Gets You |
|---|---|
| Salesforce | Full CRM access; standard + custom objects |
| Salesforce Platform | Custom objects only; no standard CRM objects (Leads, Opps) |
| Chatter Free | Chatter collaboration only; no CRM records |
| Chatter External | External (non-employee) Chatter access |

**Freeze vs Deactivate:**
| | Freeze | Deactivate |
|---|---|---|
| Can log in? | No | No |
| License consumed? | Yes | No |
| Can reactivate? | Yes (immediate) | Yes |
| When to use? | Temporary, urgent block | Permanent departure |
| Automation triggered? | No | Possibly (ownership rules) |

Key point: You **cannot delete** users in Salesforce. You can only deactivate them. This is because their records (records they created, owned, modified) would have no owner.

**Deactivating a user triggers:**
- Remove from all groups and queues
- Remove from approval processes (if sole approver, you get a warning)
- Running automations that reference the user still execute if the user is the running user

## PTA / SA Relevance

User management seems simple but creates real enterprise problems:

**License audit:** Many large customers overpay because they have hundreds of deactivated users who were never reviewed. Deactivated users don't consume licenses, but licenses purchased vs licenses in-use is a critical cost optimization area. In every org assessment, run a license utilization report.

**Username uniqueness (global):** This catches customers off guard. If an employee has a username in one org (even a sandbox), they can't reuse it in another org. This is why orgs typically use naming conventions like `user@company.com.sandbox` for sandbox users. This matters for sandbox management — when you refresh a sandbox, usernames are changed to prevent conflicts.

**Profile assignment:** Every user gets exactly one profile. This is where the access control design starts. In mature orgs, profiles are lean (minimal permissions) and Permission Sets handle additional access. The Salesforce roadmap is moving toward Permission Set Groups as the primary access mechanism.

## Architecture / How It Works

```
User Record — Access Chain
━━━━━━━━━━━━━━━━━━━━━━━━━

  USER RECORD
  ┌─────────────────────────────────────────┐
  │  Username (globally unique)             │
  │  Email (globally unique)                │
  │  License Type ──────────┐               │
  │  Profile (required) ────┤──► What you   │
  │  Role (optional)        │    CAN DO +   │
  │  Permission Sets (0+) ──┘    CAN SEE    │
  └─────────────────────────────────────────┘

  License → gates which Profiles are available
  Profile → controls: CRUD, FLS, app access, login hours, IP ranges
  Role → controls: record visibility (upward in hierarchy)
  Permission Sets → additive permissions on top of Profile

  Freeze vs Deactivate:
  ┌────────────────────────────────────────────┐
  │  FREEZE: User blocked, license still used  │
  │  DEACTIVATE: User blocked, license freed   │
  └────────────────────────────────────────────┘
```

**Limitations:**
- Users cannot be deleted — only deactivated
- Usernames must be unique across all Salesforce orgs (production + sandboxes) globally
- You cannot change a user's license type if it would conflict with their current profile/permission sets
- A deactivated user who is the sole approver in an approval process must be replaced before deactivating

## Key Facts to Memorize

- Email = globally unique across all Salesforce orgs
- Username = globally unique, email format (doesn't need to be real email)
- Profile = required (exactly 1 per user)
- Role = optional, controls record visibility up the hierarchy
- Cannot DELETE users; only deactivate
- Freeze = blocks login, keeps license; Deactivate = blocks login, frees license
- Deactivated users' records remain; their data/records persist
- Salesforce license = full CRM; Platform license = custom objects only
- Chatter Free = collaboration only, no CRM objects

## Exam Traps

- **"You can delete a user in Salesforce"** — FALSE. Users can only be deactivated, never deleted.
- **"Freezing a user frees up their license"** — FALSE. Only deactivating frees the license. Freeze just blocks login.
- **"A user's username can be reused across orgs"** — FALSE. Usernames are globally unique across all Salesforce orgs.
- **"A user can have multiple profiles assigned"** — FALSE. Exactly one profile per user. Multiple Permission Sets are OK.
- **"Deactivating a user removes all records they owned"** — FALSE. Their records remain and keep the user as owner until reassigned.

## Practice Questions

**Q:** A sales rep leaves the company immediately under suspicious circumstances. The admin needs to prevent them from logging in RIGHT NOW while the offboarding process is handled. What is the quickest action?
**A:** Freeze the user. This immediately prevents login without the overhead of deactivation. Deactivate later once offboarding is complete.

**Q:** A company has 100 Salesforce licenses but only 75 active users. What happened to the remaining 25 licenses?
**A:** They are freed by deactivated users. Deactivated users do not consume licenses.

**Q:** What field format is required for a Salesforce username?
**A:** Email format (e.g., user@domain.com), but it doesn't have to be a real email address. It must be unique across ALL Salesforce orgs globally.

**Q:** An admin tries to create a new user with the username john.smith@company.com but gets an error saying it already exists. The admin knows no one in their org uses that username. What is the likely cause?
**A:** The username exists in another Salesforce org (even a sandbox or a different company's org). Salesforce usernames are globally unique across all orgs.
