# L02: Data Modeling Fundamentals

## Exam Domain
Data Modeling & Management — 22% of exam weight

---

## Core Concepts

### Objects vs. Records
The key thing to understand is that an **object** is the template (the blueprint), and a **record** is an instance of that template with actual data. Account is an object. "Acme Corp" is a record on that object. Every time someone creates a new Account, they're creating a new record — the object definition stays the same. Getting this distinction right matters because it comes up in every deployment and data migration question.

### Standard Objects vs. Custom Objects
Salesforce ships with built-in **standard objects** (Account, Contact, Lead, Opportunity, Case, etc.). You cannot delete them. **Custom objects** are ones you create — their API names end in `__c` (e.g., `Job__c`). Standard object fields you add also end in `__c`. Standard fields on standard objects (like `Account.Name`) have no suffix.

### The Three-Question Framework
Before creating any custom object, answer: (1) What distinct entities does my business track? (2) How do those entities relate to each other? (3) What data needs to be captured on each entity? If you can capture the information as fields on an existing object, don't create a new object. Create a new object only when the entity has its own lifecycle, needs its own reports, or relates to other objects independently.

### When Not to Create a Custom Object
A common modeling mistake is over-normalizing — creating a separate object for something that should just be a picklist field. If a value is a category (Status, Type, Stage), it's a field. If it's an independent entity that users need to track, report on, and relate to other records, it's an object.

### Normalization Balance
Every object you create adds UI complexity, security configuration overhead, and relationship management cost. The design principle: normalize enough to avoid redundant data entry and reporting complexity, but not so much that users need to navigate four objects to complete a simple task.

---

## PTA / SA Relevance

**In discovery workshops:** Use the three-question framework as a structured way to capture data model requirements from business stakeholders. Ask "what do you track?" before asking "how do you use it?" — stakeholders naturally answer entity questions before workflow questions.

**For data model reviews:** The most common anti-pattern is creating custom objects for things that belong in a picklist or a related field. Challenge every proposed object: "Does this need its own list view? Its own reports? Its own security?" If the answer is no on all three, it's probably not an object.

**At enterprise scale:** Large implementations often have 200+ custom objects. The technical debt is real — every extra object is a join in SOQL, a security record to maintain, and a page layout to manage. Architecture reviews should include a data model simplification pass.

**Integration design:** External IDs are the bridge between Salesforce and external systems. Design your data model with integration in mind — identify the natural external keys early (customer ID, order number, etc.) and mark them as External ID fields so upsert operations work cleanly.

---

## Architecture / How It Works

```
Data Model Hierarchy:
┌──────────────────────────────────────────┐
│  OBJECT (blueprint)                       │
│  e.g., Account                           │
│  ┌──────────┬──────────┬──────────┐      │
│  │ Field 1  │ Field 2  │ Field 3  │      │  ← object definition = metadata
│  │  Name    │Industry  │Revenue   │      │
│  └──────────┴──────────┴──────────┘      │
└──────────────────────────────────────────┘
           │   creates instances  │
           ▼                      ▼
┌──────────────────┐  ┌──────────────────┐
│ RECORD (instance)│  │ RECORD (instance)│
│  Acme Corp       │  │  BetaCo Inc      │  ← records = data
│  Technology      │  │  Healthcare      │
│  $50M            │  │  $12M            │
└──────────────────┘  └──────────────────┘
```

**Limitations:**
- You cannot delete a standard object
- Custom objects cannot be renamed after creation without losing all references
- Object API names are permanent once created (label can change, not the API name)

```
Standard vs. Custom: API Name Rules
┌──────────────────────────────────────────────────┐
│ Standard object API name:   Account              │
│ Standard field API name:    Account.Name         │
│                                                  │
│ Custom object API name:     Job__c               │
│ Custom field API name:      Job__c.Title__c      │
│                                                  │
│ Relationship field (Lookup):  Account__c         │
│ Relationship traversal:       Account__r.Name    │
│                                (__r = relationship)
└──────────────────────────────────────────────────┘
```

**Limitations:**
- `__c` suffix is permanent — you cannot remove it from a custom component API name
- `__r` notation only works in SOQL and formula cross-object references, not in direct field queries

```
Three-Question Decision Framework:
"Should I create a new object?"
        │
        ▼
1. Does it have its own lifecycle 
   (create/edit/delete independently)?
        │
        ├─ NO → It's a field or a picklist value
        │
        └─ YES ──────────────────────────────────┐
                                                 │
2. Does it need its own reports?                 │
        │                                        │
        ├─ NO → Probably a related field          │
        │                                        │
        └─ YES ──────────────────────────────────┤
                                                 │
3. Does it relate to other entities?             │
        │                                        │
        └─ YES → Create the custom object ◄──────┘
```

**Limitations:**
- This is a heuristic, not a rule — judgment is required for complex cases
- Once an object is created and has records, it cannot be easily merged with another object

---

## Key Facts to Memorize
- Object = template/blueprint; Record = instance with actual data
- Standard objects cannot be deleted; custom objects have `__c` suffix
- The three questions before creating a custom object: lifecycle / reportable / relatable
- Custom field API names always end in `__c`; cross-object relationship traversal uses `__r`
- Standard objects included in every org: Account, Contact, Lead, Opportunity, Case, Campaign, Task, Event
- You can have up to 200 custom objects in Developer Edition, 2,000 in Enterprise Edition
- Object labels and names can change; API names are permanent

---

## Exam Traps
- **Object vs. Record confusion.** "Create a new Account" means creating a record, not creating an object. Know which term the question uses.
- **Standard fields don't end in `__c`.** `Account.Name` is standard. `Account.My_Field__c` is custom. On a custom object, all fields end in `__c`.
- **Don't confuse standard field on custom object.** The Name field on a custom object is still called "Name" (no `__c`) — it's the one standard field every custom object gets.
- **Picklist vs. Object.** If a scenario describes a "Type" or "Category" with a few values, the answer is almost always a picklist field, not a custom object.
- **API names are case-sensitive in code.** `Account__c` is not the same as `account__c` in Apex.

---

## Practice Questions

**Q:** A company needs to track job postings, where each posting has a title, department, and location. They want to report on postings and relate them to candidates. Is a custom object appropriate?
**A:** Yes — job postings have their own lifecycle, need reporting, and relate to candidates. All three criteria are met. Create a `Job__c` custom object.

**Q:** A user asks to "add a field to track the industry size of each Account." What is being modified — an object or a record?
**A:** The object (the Account object definition) is being modified by adding a new custom field. Individual Account records will then have this new field available to fill in.

**Q:** What is the API name of a custom field called "Hire Date" on a custom object called "Job Application"?
**A:** The object API name is `Job_Application__c` (spaces become underscores, `__c` appended). The field API name is `Hire_Date__c`. Fully qualified: `Job_Application__c.Hire_Date__c`.
