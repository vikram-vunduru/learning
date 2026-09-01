# L16: Relationships & Junction Objects

## 🎯 Learning Objectives
- Compare Lookup and Master-Detail relationships and select the appropriate type for a given scenario
- Explain how to implement a many-to-many relationship using a junction object
- Identify relationship limits and special relationship types including self-relationships and external lookups

## 📊 SLIDES

### Slide 1: Why Relationships Matter
**Visual:**
```
  LOOKUP                        MASTER-DETAIL                  MANY-TO-MANY
  ─────────────────────         ──────────────────────         ─────────────────────────────
  Account ◀╌╌╌╌ Contact        Invoice ◀══════ Invoice Line   Student ◀══ Enrollment ══▶ Course
  (optional link)               (required link)                (Junction Object)

  - Loosely coupled             - Tightly coupled              - Junction object with
  - Child survives              - Cascade delete                 two Master-Details
    parent deletion               applies                      - Extra data on junction
  - No roll-ups                 - Roll-ups enabled               (Grade, Enroll Date)
  - Separate OWD                - Child OWD from Master        - Delete either parent
  Max: 40/object                Max: 2/object                    deletes all junctions
```
**Content:**
- Relationships link records across objects so related data can be viewed, reported, and rolled up together
- Choosing the wrong relationship type causes data integrity problems, unexpected deletions, and missing roll-up calculations
- Two primary relationship types: **Lookup** and **Master-Detail**
- Many-to-many relationships require a **Junction Object** with two master-detail relationships
**Speaker Notes:** Before creating any relationship, ask three questions: Is the parent required? Should deleting the parent delete the child? Do you need roll-up summaries? The answers determine which relationship type to use.

### Slide 2: Lookup Relationships
**Visual:**
```
  ┌──────────────────┐                       ┌──────────────────────┐
  │    ACCOUNT       │ ◀╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  │     CONTACT          │
  │    (Parent)      │    Lookup (optional)   │     (Child)          │
  └──────────────────┘                       └──────────────────────┘

  SCENARIO: Account is deleted
  ──────────────────────────────────────────────────────────────────
  ┌──────────────────┐                       ┌──────────────────────┐
  │    ACCOUNT       │   [DELETED]           │     CONTACT          │
  │    (gone)        │                       │  Account: (blank)    │
  └──────────────────┘                       │  ← lookup cleared,   │
                                             │    record SURVIVES   │
                                             └──────────────────────┘
  Key behaviors:
  - Parent field on child is OPTIONAL (can be left blank)
  - No cascade delete — child lives on if parent is removed
  - No roll-up summary fields available
  - Child record shares independently (own OWD)
```
**Content:**
- **Loosely coupled** — the child record can exist without a parent (parent field is optional)
- **No cascade delete** — deleting the parent does not delete child records; the lookup field is cleared
- **No roll-up summaries** — cannot aggregate child record data onto the parent via Roll-Up Summary fields
- Sharing is independent — the child record's OWD applies independently of the parent
- API name of the field ends in **Id** (e.g., AccountId); relationship accessor ends in **__r**
**Speaker Notes:** Lookup is the right choice when the relationship is optional or when you want child records to survive independently if the parent is deleted. Contact and Account use a Lookup — a Contact can exist without an Account, and deleting an Account does not automatically delete all its Contacts.

### Slide 3: Master-Detail Relationships
**Visual:**
```
  ┌──────────────────┐                       ┌──────────────────────┐
  │    INVOICE       │ ◀═══════════════════  │   INVOICE LINE       │
  │    (Master)      │  Master-Detail         │   (Detail)           │
  │                  │  (required)            │                      │
  │  Roll-Up         │                        │  OWD = Controlled    │
  │  Summary ✓       │                        │    by Parent         │
  │  (COUNT, SUM,    │                        │  Master field is     │
  │   MIN, MAX)      │                        │  REQUIRED            │
  └──────────────────┘                        └──────────────────────┘

  SCENARIO: Invoice is deleted
  ──────────────────────────────────────────────────────────────────
  ┌──────────────────┐   cascade             ┌──────────────────────┐
  │    INVOICE       │   delete              │   INVOICE LINE       │
  │    [DELETED]     │ ─────────────────────▶│   [DELETED]          │
  └──────────────────┘                       │   [DELETED]          │
                                             │   [DELETED]          │
                                             └──────────────────────┘
                                             All detail records auto-deleted
```
**Content:**
- **Tightly coupled** — the detail record cannot exist without a master; the master field is required and cannot be blank
- **Cascade delete** — deleting the master deletes all detail records automatically
- **Roll-Up Summary fields** — COUNT, SUM, MIN, MAX on detail records can be placed on the master
- **Sharing follows master** — detail record's OWD is set to Controlled by Parent; sharing is determined by master's sharing settings
- Maximum **2 master-detail relationships** per object
**Speaker Notes:** Master-Detail is the right choice when the child record has no independent existence — a line item on an invoice, a task on a project, a product component. The cascade delete is powerful but dangerous: deleting a master in bulk data operations can silently delete thousands of detail records. Always warn users before deleting master records.

### Slide 4: Lookup vs. Master-Detail — Side-by-Side
**Visual:**
```
  LOOKUP RELATIONSHIP            MASTER-DETAIL RELATIONSHIP
  ───────────────────            ──────────────────────────
  Account ◀╌╌╌╌ Contact         Account ◀═══ Contract
  (optional link)                (required link)

  ┌──────────────────────┬─────────────────────┬───────────────────────┐
  │  FEATURE             │  LOOKUP             │  MASTER-DETAIL        │
  ├──────────────────────┼─────────────────────┼───────────────────────┤
  │  Parent Required     │  No (optional)      │  Yes (mandatory)      │
  │  Cascade Delete      │  No                 │  Yes                  │
  │  Roll-Up Summary     │  No                 │  Yes (on master)      │
  │  Child OWD           │  Independent        │  Controlled by Parent │
  │  Max per Object      │  40                 │  2                    │
  │  Reparenting         │  Always allowed     │  Allowed if enabled   │
  ├──────────────────────┼─────────────────────┼───────────────────────┤
  │  Line style          │  ◀╌╌╌╌ (dashed)    │  ◀════ (solid/bold)   │
  └──────────────────────┴─────────────────────┴───────────────────────┘
```
**Content:**
- | Feature | Lookup | Master-Detail |
- | Parent Required | No | Yes |
- | Cascade Delete | No | Yes |
- | Roll-Up Summary | No | Yes (on master) |
- | Child OWD | Independent | Controlled by Parent |
- | Max per Object | 40 | 2 |
- | Reparenting | Yes (owner can change) | Allowed if enabled in setup |
**Speaker Notes:** Print this table in your mind. The exam will give you a scenario and ask which relationship type is correct. If roll-up summaries are mentioned, it must be Master-Detail. If the child should survive parent deletion, it must be Lookup. If you see "cascade delete," that is Master-Detail.

### Slide 5: Many-to-Many — Junction Objects
**Visual:**
```
  MANY-TO-MANY via JUNCTION OBJECT

  ┌───────────────┐                                   ┌───────────────┐
  │    STUDENT    │                                   │    COURSE     │
  │   (Master)    │                                   │   (Master)    │
  └───────┬───────┘                                   └───────┬───────┘
          ║                                                   ║
          ║  Master-Detail                    Master-Detail  ║
          ╚══════════════════╗       ╔══════════════════════╝
                             ▼       ▼
                  ┌───────────────────────────────┐
                  │         ENROLLMENT__c         │
                  │        [Junction Object]      │
                  │                               │
                  │  Student__c  (Master-Detail)  │
                  │  Course__c   (Master-Detail)  │
                  │  Grade__c    (extra field)    │
                  │  EnrollDate__c (extra field)  │
                  └───────────────────────────────┘

  - Deleting Student deletes ALL its Enrollment junction records
  - Deleting Course deletes ALL its Enrollment junction records
  - Enables: many Students enrolled in many Courses
  - Standard example: Campaign Member = junction of Campaign + Contact
```
**Content:**
- A **junction object** implements a many-to-many relationship using two master-detail relationships
- Example: A Student can enroll in many Courses; a Course can have many Students → Enrollment__c is the junction
- The junction object has two master-detail fields (one to each parent) and any additional data about the relationship (e.g., Grade, Enrollment Date)
- Deleting either parent deletes all junction records related to it (cascade delete from both sides)
**Speaker Notes:** Junction objects are a core Salesforce design pattern. The relationship between Contact and Campaign in standard Salesforce is implemented this way — Campaign Member is the junction object. Whenever you hear "a record can belong to many of X, and X can have many of those records," think junction object.

### Slide 6: Self-Relationships
**Visual:**
```
  SELF-RELATIONSHIP: Account → Parent Account

                ┌──────────────────────────────┐
                │          ACCOUNT             │
                │  Parent Account field        │◀──────┐
                │  (Lookup to Account itself)  │       │
                └──────────────────────────────┘       │
                          same object ─────────────────┘

  REAL-WORLD HIERARCHY EXAMPLE:
  ┌───────────────────┐
  │  Global HQ        │  ← no Parent Account (top of hierarchy)
  └────────┬──────────┘
           │ Parent Account
           ▼
  ┌───────────────────┐
  │  North America    │  ← Parent Account = Global HQ
  └────────┬──────────┘
           │ Parent Account
           ▼
  ┌───────────────────┐
  │  Canada Sub       │  ← Parent Account = North America
  └───────────────────┘

  User object equivalent: Hierarchy field type → Manager field
```
**Content:**
- A self-relationship is a Lookup from an object back to itself
- Standard example: **Account → Parent Account** — allows building an account hierarchy
- Used for organizational hierarchies, category trees, and parent-child structures within a single object
- The **Hierarchy** field type is a special self-relationship reserved for the User object (manager hierarchy)
- Only one Hierarchy field type is allowed per object (User already uses it for the Manager field)
**Speaker Notes:** Account hierarchies built with the Parent Account field are a great example of self-relationships in practice. Headquarters accounts link to regional subsidiaries. You can navigate up and down the hierarchy from any Account record and roll up data across the account hierarchy using reports.

### Slide 7: External Lookups and Indirect Lookups
**Visual:**
```
  SALESFORCE ORG              SALESFORCE CONNECT           EXTERNAL SYSTEM
  ─────────────────           ─────────────────────        ─────────────────
  ┌──────────────┐            ┌───────────────────┐        ┌───────────────┐
  │  Custom or   │  External  │   External        │ OData  │  External     │
  │  Standard    │  Lookup    │   Object          │◀──────▶│  Database     │
  │  Object (SF) │──────────▶ │   (read-only      │        │  / ERP        │
  └──────────────┘            │    virtual data)  │        └───────────────┘
                              └───────────────────┘
                                        │
                                        │  Indirect Lookup
                                        ▼
                              ┌──────────────┐
                              │  Standard or │
                              │  Custom      │
                              │  Object (SF) │
                              │  (via custom │
                              │  external ID)│
                              └──────────────┘

  External Lookup:  SF/Custom Object  ──▶  External Object
  Indirect Lookup:  External Object   ──▶  SF Object (using external ID field)
  Use case: connect Salesforce to live external ERP data without importing it
```
**Content:**
- **External Lookup** — child object (standard or custom in Salesforce) looks up to an **External Object** (data outside Salesforce accessed via Salesforce Connect)
- **Indirect Lookup** — External Object looks up to a standard or custom Salesforce object using a custom unique external ID field
- External Objects are read-only by default and are accessed via Salesforce Connect (OData, REST, etc.)
- These relationship types are less common but may appear on the exam as a "what is this used for" question
**Speaker Notes:** External Lookups and Indirect Lookups are niche but exam-testable. If you see a question about linking Salesforce records to data that lives in an external ERP or database without importing it, the answer involves Salesforce Connect, External Objects, and these special relationship types.

### Slide 8: Relationship Limits Per Object
**Visual:**
```
  KEY RELATIONSHIP LIMITS
  ──────────────────────────────────────────────────────────────────────
  ┌────────────────────────────────────────────────┬────────────────────┐
  │  LIMIT                                         │  VALUE             │
  ├────────────────────────────────────────────────┼────────────────────┤
  │  Master-Detail relationships per object        │  2                 │
  │  Lookup relationships per object               │  40                │
  │    (MD counts toward this 40)                  │                    │
  │  Master-Detail nesting levels                  │  3                 │
  │  Child records before sharing recalc slows     │  10,000            │
  └────────────────────────────────────────────────┴────────────────────┘

  NESTING LEVELS EXAMPLE (3 max):
  ┌───────────────┐
  │  Project      │  ← Level 1 (Master)
  └───────┬───────┘
          │ Master-Detail
          ▼
  ┌───────────────┐
  │  Phase        │  ← Level 2 (Detail of Project, Master of Task)
  └───────┬───────┘
          │ Master-Detail
          ▼
  ┌───────────────┐
  │  Task         │  ← Level 3 (Sub-Detail — maximum depth)
  └───────────────┘
```
**Content:**
- Maximum **2** Master-Detail relationships per object
- Maximum **40** Lookup relationships per object (including master-detail)
- Maximum **3** levels in a master-detail hierarchy (master → detail → subdetail)
- Maximum **10,000** child records per parent before sharing recalculation performance degrades
- Junction objects count toward both parent objects' relationship limits
**Speaker Notes:** The 2 master-detail limit is the most exam-relevant. If a design requires a third master-detail, the solution is to convert one to a Lookup and compensate for the lost functionality (no cascade delete from that parent, no roll-up summaries from that side). The 40 lookup limit is very rarely hit in practice.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 16. Relationships are the connective tissue of your Salesforce data model, and understanding them deeply is one of the marks of a skilled admin.

Let's start with the two primary types. A Lookup relationship is a loose connection between two objects. The parent field on the child record is optional — the child can exist without a parent. If you delete the parent, the child survives and the lookup field is simply cleared. There are no cascade deletes and no roll-up summary fields available. Contact's relationship to Account is a Lookup — you can have a Contact with no Account, and deleting an Account does not wipe out all its Contacts.

Master-Detail is the opposite. It is a tight, required relationship. The detail record cannot exist without the master. The master field is mandatory. Delete the master and all its detail records are automatically deleted — cascade delete. The detail record's sharing is controlled by the master. And critically, Roll-Up Summary fields become available on the master, letting you COUNT, SUM, MIN, or MAX values across all child records.

The decision between them comes down to three questions. Is the parent required? If yes, lean toward Master-Detail. Should deleting the parent delete the child? If yes, Master-Detail. Do you need roll-up summaries? If yes, you must use Master-Detail.

Now, many-to-many relationships. Sometimes a record needs to be related to many records of another type, and those records also need to be related to many of the first type. A Student enrolls in many Courses; a Course has many Students. You solve this with a Junction Object. The junction — let's call it Enrollment — has two master-detail relationships, one pointing to Student and one pointing to Course. Enrollment can also carry additional fields like Grade or Enrollment Date. Campaign Member in standard Salesforce is exactly this pattern — it is the junction between Campaign and Contact.

For the exam, know these key limits: 2 master-detail relationships per object (after that, you must use Lookup), 40 lookups per object, and 3 levels of master-detail nesting.

Two special types worth knowing: Self-Relationships (like Account's Parent Account field, which creates an account hierarchy) and the Hierarchy field type on User (which powers the manager chain). External Lookups and Indirect Lookups connect Salesforce to external data sources via Salesforce Connect — less common but exam-testable.

When a scenario question describes cascade delete or roll-up summaries, the answer is always Master-Detail. When it says the relationship is optional or the child should survive independently, the answer is Lookup.

## 🔔 EXAM TIPS
- **Roll-Up Summary requires Master-Detail:** If a scenario mentions needing roll-up summaries, the answer always involves Master-Detail, not Lookup.
- **Cascade delete:** Deleting a master record automatically deletes all its detail records. This is a Master-Detail behavior — not Lookup. Be careful with this in bulk operations.
- **2 Master-Detail limit:** Each object can have at most 2 master-detail relationships. If a third is needed, convert one to Lookup and accept the limitations (no roll-up, no cascade delete from that side).
- **Junction object pattern:** Many-to-many = junction object with two master-detail relationships. Know the standard example: Campaign Member (Campaign + Contact). Deleting either parent cascades to delete all junction records.
- **Reparenting:** In a Master-Detail relationship, reparenting (changing the master record on a detail record) is allowed by default but can be disabled. In a Lookup, changing the parent is always allowed.

## ✅ LECTURE SUMMARY
- Lookup relationships are loosely coupled: parent is optional, no cascade delete, no roll-up summaries, child shares independently
- Master-Detail relationships are tightly coupled: parent is required, cascade delete applies, roll-up summaries enabled, child sharing follows master, maximum 2 per object
- Many-to-many relationships are implemented using a junction object with two master-detail relationships pointing to each parent
- Self-relationships (like Account's Parent Account) allow hierarchical structures within a single object
- Key limits: 2 master-detail per object, 40 lookups per object, 3 levels of master-detail nesting

## ❓ MINI QUIZ

**Q1:** An admin is designing a data model for a Project object and a Task object. Each Task must belong to a Project, and deleting a Project should delete all its Tasks. Roll-up summary fields are also needed on Project to count Tasks. Which relationship type should be used?
- A) Lookup from Task to Project
- B) Master-Detail from Task (detail) to Project (master)
- C) Master-Detail from Project (detail) to Task (master)
- D) Self-relationship on the Task object

**Answer:** B — Master-Detail from Task to Project satisfies all three requirements: parent is required (Task cannot exist without Project), cascade delete applies (deleting Project deletes all Tasks), and roll-up summary fields are available on Project (the master side).

**Q2:** A Salesforce Admin is asked to model the relationship between Students and Courses — a student can enroll in many courses and a course can have many students. What is the correct approach?
- A) Create a Lookup from Student to Course
- B) Create a Master-Detail from Student to Course
- C) Create a junction object (Enrollment) with two Master-Detail relationships — one to Student and one to Course
- D) Use a Multi-Select Picklist on Student listing Course names

**Answer:** C — Many-to-many relationships require a junction object. Creating an Enrollment object with a Master-Detail to Student and a Master-Detail to Course implements the relationship correctly, with the ability to add enrollment-specific data (Grade, Enrollment Date) to the junction.

**Q3:** An object already has two Master-Detail relationship fields. The admin needs to add a third parent relationship. What is the only option available?
- A) Add a third Master-Detail relationship field
- B) Add a Lookup relationship field instead
- C) Delete one of the existing Master-Detail fields and replace it with the new one
- D) Use an External Lookup to the third parent object

**Answer:** B — Each object is limited to a maximum of 2 Master-Detail relationships. When a third parent relationship is needed, the only option is to use a Lookup relationship, which means losing cascade delete and roll-up summary capabilities for that particular relationship.
