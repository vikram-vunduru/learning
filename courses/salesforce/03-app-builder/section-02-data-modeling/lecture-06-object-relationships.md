# L06: Object Relationships

## 🎯 Learning Objectives
- Distinguish between Lookup and Master-Detail relationships and their behavioral differences
- Explain when to use each relationship type based on business requirements
- Describe how to model many-to-many relationships using junction objects
- Identify the specialized relationship types (self-relationship, external lookup, indirect lookup)

---

## 📊 SLIDES

### Slide 1: Why Relationships Matter
**Visual:** Three separate boxes labeled "Account," "Contact," "Opportunity" with no connections — labeled "Disconnected Data (useless)." Then the same boxes with arrows connecting them — labeled "Related Data (meaningful)." Callout: "Relationships let you answer: Which contacts belong to this account? Which opportunities are at risk?"
**Content:**
- Relationships connect objects so records can reference and relate to each other
- Without relationships, every object is an isolated island of data
- Relationships enable: related lists on record pages, cross-object reports, roll-up summaries, automation that spans objects
- Every relationship has two sides: the **parent** (one side) and the **child** (many side)
- Salesforce has multiple relationship types — choosing the right one is a core App Builder skill
**Speaker Notes:** Data modeling is really relationship design. Anyone can create fields on objects, but knowing which relationship type to use and why — that's the skill that separates good app builders from great ones. The relationship you choose has cascading implications for security, data deletion, roll-up calculations, and how users interact with the data. Let's go through each type systematically.

### Slide 2: Lookup Relationship
**Visual:** Diagram showing Child Object box (e.g., Contact) with a Lookup field arrow pointing to Parent Object (e.g., Account). Labels: "Optional — Contact doesn't require an Account." "No roll-up summary available." "Parent deleted — child stays (relationship cleared)." "Up to 40 Lookup relationships per object."
**Content:**
- **Lookup:** A soft link between two objects. The child can exist independently of the parent.
- The lookup field on the child is **optional by default** (can be made required via validation)
- **No Roll-Up Summary** fields available — the parent cannot aggregate child data
- If the parent record is deleted, the child record remains but the lookup field is **cleared** (or you can prevent deletion)
- Standard Salesforce relationships are mostly Lookup: Contact to Account, Opportunity to Account
- Maximum 40 Lookup relationships per object
**Speaker Notes:** A Lookup relationship is the loose connection — it says "this child is associated with that parent, but the child can stand alone." The classic example is Contact-to-Account. A contact is associated with an account, but if you delete the account, the contact doesn't disappear. The account field on the contact is just cleared. When you're deciding between Lookup and Master-Detail, ask: "If I delete the parent, should the children be deleted too?" If yes, Master-Detail. If no, Lookup.

### Slide 3: Master-Detail Relationship
**Visual:** Diagram showing Master Object (Account) at the top, connected via bold arrow to Detail Object (Custom_Invoice__c). Labels: "Required — Detail cannot exist without Master." "Roll-Up Summary available on Master." "Master deleted → all Details DELETED (cascade delete)." "Up to 2 Master-Detail per object." "Detail inherits Master's sharing settings."
**Content:**
- **Master-Detail:** A tight, ownership-based relationship. The child (detail) cannot exist without the parent (master).
- The Master-Detail field on the child is **required** — a detail record always has a master
- **Roll-Up Summary fields** are available on the master — COUNT, SUM, MIN, MAX of child values
- Cascade delete: deleting the master **deletes all detail records**
- The detail record inherits the master's sharing settings — OWD for detail is controlled by master
- Maximum 2 Master-Detail relationships per object
**Speaker Notes:** Master-Detail is the tight coupling. The child cannot exist without the parent — it's owned by the parent. If you delete an account with all its invoices in a Master-Detail relationship, the invoices disappear too. This cascade delete makes sense for truly owned child records — line items on an invoice, for example. The sharing model inheritance is also significant: detail records don't have their own OWD setting, they inherit from the master. This is a common exam topic. If someone asks "what is the OWD for a Master-Detail child object," the answer is "it inherits from the master."

### Slide 4: Lookup vs. Master-Detail — Side-by-Side Comparison
**Visual:** Detailed comparison table. Headers: Feature | Lookup | Master-Detail. Rows: Field required?, Roll-Up Summary?, Cascade delete?, Sharing model, Max per object, Can change type?.
**Content:**
| Feature | Lookup | Master-Detail |
|---|---|---|
| Field required? | Optional (can require) | Always required |
| Roll-Up Summary? | No | Yes (on master) |
| Cascade delete? | No (field cleared) | Yes |
| Sharing model | Child has own OWD | Child inherits master |
| Max per object | 40 | 2 |
| Convert between? | Lookup → MD possible | MD → Lookup possible |

**Speaker Notes:** This comparison table is exam gold. Know it thoroughly. The most tested differences are: Roll-Up Summary only on Master-Detail, cascade delete on Master-Detail, and the sharing model difference. You can convert a Lookup to Master-Detail and vice versa, with some restrictions — you can only convert to Master-Detail if there are no blank values in the lookup field, since Master-Detail requires the field to always have a value.

### Slide 5: Many-to-Many Relationships — Junction Objects
**Visual:** Three-box diagram. Left: "Student" object. Right: "Course" object. Middle: "Enrollment__c" (junction object) with two Master-Detail arrows, one pointing left to Student, one pointing right to Course. Label: "Enrollment allows many students per course AND many courses per student."
**Content:**
- Salesforce has no native "Many-to-Many" relationship field type
- Model many-to-many using a **junction object** with two Master-Detail relationships
- The junction object represents the relationship itself — e.g., Enrollment (Student + Course), Membership (Contact + Group)
- The junction object can have its own fields: Enrollment Date, Grade, Status
- Deleting either master (Student or Course) deletes all related junction records
- Maximum 2 Master-Detail per object is why junction objects work — the junction uses both slots
**Speaker Notes:** Junction objects are one of those elegant Salesforce patterns that clicks once you see the logic. The junction object itself is a full Salesforce object — it has records, it can have fields, it shows up in reports, and it can trigger automation. The Enrollment object doesn't just store the Student-Course connection; it can store when they enrolled, their current grade, and their attendance. Junction objects turn the "many-to-many" limitation into a feature by making the relationship itself a first-class data entity.

### Slide 6: Self-Relationship and Hierarchy Relationship
**Visual:** Two diagrams. Left: "Self-Relationship" — an Account box with an arrow looping back to itself, labeled "Account lookup to Account (Parent Account field)." Right: "Hierarchy Relationship" — a User box with an arrow looping to another User box, labeled "Manager lookup to User (hierarchy)."
**Content:**
- **Self-Relationship (Lookup):** An object with a Lookup to itself. Example: Account's "Parent Account" field (account hierarchy for corporations)
- **Hierarchy Relationship:** Special self-relationship available only on the **User object**. Used for the Manager field.
- Hierarchy relationship is what enables the role hierarchy to work at the user record level
- Self-relationships can go many levels deep — a parent account can have a parent account
- Common self-relationship use cases: account hierarchies, employee-manager relationships, category parent-child
**Speaker Notes:** Self-relationships are used whenever your data has a hierarchical parent-child structure within the same entity. Account hierarchies are the classic example — a large enterprise account has subsidiary accounts. The "Parent Account" field on Account is a self-lookup. The Hierarchy relationship on User is a special case of this that Salesforce has given extra behavior — it's specifically for the management chain. When you build org charts or account hierarchies, you're using self-relationships.

### Slide 7: External Lookup and Indirect Lookup
**Visual:** Two-part diagram. Left: Salesforce-to-external diagram showing "External Lookup" — Salesforce Contact with an arrow pointing to an External Object (SAP Customer). Right: "Indirect Lookup" — External Object (Warehouse System) with an arrow pointing to Salesforce Account using External ID field as the bridge.
**Content:**
- **External Lookup:** On a Salesforce object, creates a lookup to an **External Object** (data source outside Salesforce via Salesforce Connect)
- **Indirect Lookup:** On an External Object, creates a lookup to a **Salesforce object** using an **External ID field** as the matching key
- External Objects are virtual — they display data from external systems in real time without storing it in Salesforce
- Salesforce Connect and External Objects require additional licensing
- For the exam: know that External Lookup and Indirect Lookup exist and what direction they point
**Speaker Notes:** External lookups and indirect lookups are on the exam, but only at a conceptual level — you won't be asked to configure Salesforce Connect. The key distinction: External Lookup points from Salesforce to an external system. Indirect Lookup points from an external system to Salesforce, matching on an External ID field. If you see "Salesforce Connect" or "External Object" in an exam scenario, you're in this territory.

### Slide 8: Relationship Query Notation — __r Syntax
**Visual:** Code-style graphic showing two SOQL query examples. First: "SELECT Id, Account.Name FROM Contact" — cross-object lookup traversal using dot notation. Second: "SELECT Id, (SELECT Id, Name FROM Contacts) FROM Account" — parent-to-child traversal using __r notation in subquery.
**Content:**
- In SOQL (Salesforce's query language) and formulas, related objects are accessed using **__r** notation
- For a **Lookup field** named Account__c, the relationship name is **Account__r** — used to traverse to parent fields
- For a **standard relationship**, just use the object name: Account.Name, Opportunity.StageName
- In formulas: `Account__r.Name` accesses the parent account's name from a child record
- The `__r` notation signals "traverse this relationship" — useful to recognize in exam questions about cross-object formulas
**Speaker Notes:** You won't write SOQL on the App Builder exam, but you'll see `__r` notation in formula examples and exam questions. When you see `MyCustomField__r.Name` in a formula, recognize it as: "go to the record pointed to by the MyCustomField relationship, and get its Name." The `__r` suffix tells you it's traversing a relationship. For standard relationships — Account-Contact, Account-Opportunity — you use the object name directly without `__r`. For custom lookup fields, swap the `__c` for `__r` to traverse the relationship.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 06 — Object Relationships. This is one of the most important lectures in the entire course. The CRT-403 exam dedicates a significant number of questions to relationship types, and many of those questions are scenario-based — they describe a business requirement and ask which relationship type is appropriate.

Slide 1 frames the why: relationships turn isolated data islands into a connected, meaningful data model. Relationships enable related lists, cross-object reports, roll-up summaries, and automation that spans objects. Before you click "New Field," you need to know the nature of the connection you're modeling.

Slides 2 and 3 are the core of this lecture. Lookup versus Master-Detail. Let me give you the mental model: Lookup is a reference — "this child is associated with that parent, but they're independent." Master-Detail is ownership — "this child is owned by that parent; they live and die together."

Lookup: optional field, no roll-up summary, no cascade delete, child has its own sharing model. Up to 40 per object.

Master-Detail: required field, roll-up summary available, cascade delete, child inherits master's sharing. Only 2 per object.

Slide 4 puts this comparison in a table. Memorize it. The exam will describe a scenario — "the parent record is deleted and the child records should also be deleted" — and you need to immediately recognize that as Master-Detail behavior.

Slide 5 is about many-to-many. Salesforce doesn't have a native many-to-many field. You model it with a junction object — a new object with two Master-Detail relationships, one to each side of the many-to-many. Enrollment connects Students and Courses. Membership connects Contacts and Groups. The junction object can carry its own data about the relationship.

Slide 6 covers self-relationships — an object that points to itself. Account's "Parent Account" field is a self-lookup. The Hierarchy relationship is a special version of this available only on the User object — it's what enables the manager-subordinate chain.

Slide 7 introduces External Lookup and Indirect Lookup. Know these exist and what direction they point. External Lookup goes from Salesforce to an External Object. Indirect Lookup goes from an External Object to Salesforce using an External ID. You'll see these in advanced integration scenarios.

Slide 8 covers the `__r` notation for traversing relationships in formulas. When you see `Parent__r.FieldName`, read it as "go to the parent via the Parent relationship and return the FieldName value."

The exam loves to give you a scenario with specific requirements — cascade delete, roll-up summary, sharing inherited from parent — and ask which relationship type you'd choose. By the end of this lecture, those scenarios should be straightforward.

---

## 🔔 EXAM TIPS
- **Roll-Up Summary = Master-Detail only:** If the scenario involves aggregating child values onto a parent, the answer requires a Master-Detail relationship. A Lookup relationship cannot have a Roll-Up Summary field.
- **Cascade delete = Master-Detail:** Deleting a master record deletes all detail records. Deleting a parent in a Lookup relationship only clears the lookup field on the child.
- **Master-Detail sharing:** Detail records inherit the master's sharing settings. Detail objects do not have their own OWD — this is set by the master object.
- **Max relationships:** 40 Lookup relationships per object, 2 Master-Detail per object. This limit is why many-to-many junction objects max out at 2 Master-Detail relationships.
- **Junction objects model many-to-many:** When an exam scenario requires both "many students can take many courses" relationships, the answer is a junction object with two Master-Detail relationships.
- **Converting relationships:** You can convert a Lookup to Master-Detail if all lookup fields currently have values (Master-Detail requires the field to be populated). You can also convert Master-Detail to Lookup.

---

## ✅ LECTURE SUMMARY
- Lookup relationships are optional, loose connections with no cascade delete and no roll-up summary; up to 40 per object
- Master-Detail relationships are required, tight ownership links with cascade delete, roll-up summary availability, and sharing inheritance from the master; limited to 2 per object
- Many-to-many relationships are modeled using a junction object with two Master-Detail fields
- Self-relationships let an object reference records of the same object; the User hierarchy relationship is a special case
- The `__r` notation in formulas and SOQL indicates traversal of a relationship to access fields on a related record

---

## ❓ MINI QUIZ

**Q1:** An App Builder is designing a data model for a construction company. Each Work Order must always belong to a Project, and if a Project is deleted, all associated Work Orders should also be deleted. The App Builder also needs to display the total labor hours from all Work Orders on the Project record. Which relationship type should be created from Work Order to Project?
- A) Lookup relationship, because it supports Roll-Up Summary fields
- B) Master-Detail relationship, because it supports both cascade delete and Roll-Up Summary fields
- C) Lookup relationship, because it is more flexible than Master-Detail
- D) Indirect Lookup, because it uses an External ID field

**Answer:** B — The requirement for cascade delete (deleting Project deletes Work Orders) and Roll-Up Summary (total labor hours on Project) both require a Master-Detail relationship. Roll-Up Summary is not available on Lookup relationships.

**Q2:** A company needs to track which Contacts are members of which Groups, where each Contact can be a member of multiple Groups and each Group can have multiple Contacts. Which data model structure should the App Builder use?
- A) Add a Multi-Select Picklist to the Contact object listing all Group names
- B) Add a Lookup from Group to Contact
- C) Create a junction object with two Master-Detail relationships — one to Contact and one to Group
- D) Create a self-relationship on the Contact object

**Answer:** C — Many-to-many relationships require a junction object. The junction object (e.g., Group_Membership__c) has one Master-Detail to Contact and one Master-Detail to Group, allowing each Contact to have multiple group memberships and each Group to have multiple members.

**Q3:** An App Builder creates a Lookup relationship from a custom object (Service_Request__c) to Account. A user deletes an Account record that has three associated Service Request records. What happens to the Service Request records?
- A) The three Service Request records are deleted (cascade delete)
- B) The three Service Request records remain and the Account lookup field is cleared
- C) The deletion of the Account is prevented because child records exist
- D) The Service Request records are moved to an archive object

**Answer:** B — In a Lookup relationship, deleting the parent (Account) does not delete the children. The Account lookup field on the Service Request records is cleared, but the Service Request records themselves remain. Cascade delete only occurs in Master-Detail relationships.
