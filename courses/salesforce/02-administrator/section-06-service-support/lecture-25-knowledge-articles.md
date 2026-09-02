# Knowledge Articles

## Exam Domain
Service & Support Apps — 11% of exam

## Core Concepts

Salesforce Knowledge is the knowledge base component of Service Cloud — a repository of articles that agents use to resolve cases, and that customers can search in self-service portals.

**Lightning Knowledge (current model):**
- One Knowledge object (called "Knowledge" with article types as Record Types)
- Simpler, unified model
- Default since Lightning Experience

**Classic Knowledge (legacy):**
- Each Article Type was a separate custom object (e.g., FAQ__kav, How_To__kav)
- More complex, multiple object types
- Still referenced in older orgs and sometimes on the exam

**The `__kav` suffix:** Knowledge Article Versions use the `__kav` API name suffix (vs regular custom objects = `__c`). This comes up on the exam.

**Article Lifecycle:**
```
Draft → In Review → Published → Archived
```
- **Draft:** Being written, not visible to anyone except authors
- **In Review:** Submitted for review/approval before publishing
- **Published:** Visible to configured audiences
- **Archived:** Removed from active use; still exists for records/history

**Article Visibility (Channels):**
- **Internal App:** Salesforce users only (agents)
- **Customer:** Experience Cloud / Community customers
- **Partner:** Partner Community users
- **Public Knowledge Base:** Unauthenticated public website visitors

**Data Categories:**
Dual-purpose feature:
1. **Organization:** Categorize articles so agents can find them by topic
2. **Visibility control:** Control which articles are visible to which audiences (internal vs customer-facing vs partner)

Data Category Groups → Data Categories within groups → Assigned to articles
Users' visibility to articles is controlled by their profile's data category access

## PTA / SA Relevance

Knowledge is one of the highest ROI investments in Service Cloud — articles resolve cases faster and enable self-service deflection (customers find answers without opening a case). The key metric: case deflection rate.

**Knowledge + Cases architecture:** The standard pattern is: agent opens a case → searches Knowledge from the case record → attaches the relevant article → closes the case. The article attachment creates an audit trail and enables reporting on which articles resolve which case types.

**Data Categories for governance:** In regulated industries, Data Categories are the mechanism for controlling which knowledge is visible to which audience. Healthcare customers might have articles that are internal-only (clinical protocols), partner-visible (billing processes), and public (general FAQ). Data Categories enforce this segmentation without separate Knowledge objects.

## Architecture / How It Works

```
Knowledge Article Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LIGHTNING KNOWLEDGE (current)
  ┌────────────────────────────────────────┐
  │  Knowledge Object                      │
  │  └── Record Types = Article Types      │
  │       ├── FAQ                          │
  │       ├── How-To                       │
  │       └── Troubleshooting              │
  └────────────────────────────────────────┘

  Article Lifecycle:
  [Draft] → [In Review] → [Published] → [Archived]
     ↑                          │
     └──────────────────────────┘ (un-publish back to draft)

  Channels (who can see published articles):
  ┌──────────────────────────────────────────┐
  │  Internal App  → Support agents           │
  │  Customer      → Experience Cloud users  │
  │  Partner       → Partner portal users    │
  │  Public        → Anyone (no login)       │
  └──────────────────────────────────────────┘

  Data Categories:
  ┌──────────────────────────────────────────┐
  │  Category Group: Products                │
  │    ├── Category: Product A               │
  │    └── Category: Product B               │
  │                                          │
  │  Category Group: Region                  │
  │    ├── Category: North America           │
  │    └── Category: EMEA                    │
  │                                          │
  │  Article assigned to categories          │
  │  User's profile controls category access │
  └──────────────────────────────────────────┘
```

**Limitations:**
- Articles must go through the full lifecycle (Draft → Published) before being visible in channels
- Archiving an article makes it invisible but doesn't delete it
- Data Category visibility requires configuration in profiles (Data Category Group Visibility)
- Classic Knowledge article types use `__kav` suffix and cannot be directly migrated to Lightning Knowledge record types without a migration process
- You cannot delete a Published article directly — must Archive it first

## Key Facts to Memorize

- Knowledge article API suffix = `__kav` (not `__c`)
- Article lifecycle: Draft → In Review → Published → Archived
- Published = visible to configured channels
- 4 channels: Internal App, Customer, Partner, Public Knowledge Base
- Data Categories: organize + control visibility (dual purpose)
- Lightning Knowledge: one object + Record Types for article types
- Classic Knowledge: separate object per article type (legacy)
- Archived articles exist but are not visible in channels

## Exam Traps

- **"Knowledge articles use the `__c` suffix"** — FALSE. Articles use `__kav`.
- **"Published articles are immediately visible to all users"** — FALSE. Visibility depends on channel settings — only users with access to the configured channels can see them.
- **"Archiving an article deletes it"** — FALSE. Archiving removes it from active visibility but the article record remains.
- **"Data Categories are only used for organizing articles"** — FALSE. Data Categories also control visibility — which users/communities can see which articles.
- **"Classic Knowledge and Lightning Knowledge work the same way"** — FALSE. Classic uses separate objects per article type; Lightning uses one object with Record Types.

## Practice Questions

**Q:** An admin publishes a Knowledge article but agents report they can't find it. The article is set to the "Customer" channel only. What is the issue?
**A:** The Internal App channel was not selected when publishing. Agents use the Internal App channel — to be visible to agents, the article must be published to the Internal App channel.

**Q:** What are the two purposes of Data Categories in Salesforce Knowledge?
**A:** (1) Organization — categorizing articles so users can browse/find by topic. (2) Visibility control — controlling which user groups (profiles, communities) can see which articles.

**Q:** A support manager wants to remove an outdated article from use without permanently deleting it. What should they do?
**A:** Archive the article. This removes it from all channels (agents and customers can no longer find it) but the article record is retained for historical reference.

**Q:** What is the difference between Lightning Knowledge and Classic Knowledge?
**A:** Lightning Knowledge uses a single Knowledge object with Record Types to differentiate article types (API name: Knowledge). Classic Knowledge creates a separate object for each article type (API names end in `__kav`). Lightning Knowledge is the current standard; Classic is legacy.
