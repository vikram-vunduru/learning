# L06: Object Relationships

## Exam Domain
Data Modeling & Management — 22% of exam weight

---

## Core Concepts

### Lookup vs. Master-Detail — The Core Distinction
The key thing to understand is that relationships in Salesforce differ in **tightness of coupling**. A **Lookup** is a loose, optional reference — the child can exist without the parent, and deleting the parent doesn't automatically delete children. A **Master-Detail** is a tight, mandatory relationship — the child cannot exist without the parent, and deleting the master record **cascade-deletes all detail records**. Choose Master-Detail only when the child's existence depends entirely on the parent.

### What Master-Detail Unlocks
Master-Detail relationships enable two capabilities unavailable with Lookup: (1) **Roll-Up Summary fields** on the master that aggregate values from detail records (COUNT, SUM, MIN, MAX); (2) **Sharing inheritance** — the detail record automatically inherits the master record's OWD sharing settings. If you need either of these, the relationship must be Master-Detail.

### Junction Objects (Many-to-Many)
A junction object implements a many-to-many relationship by having **two Master-Detail relationships** to the two parent objects. Example: a Student can enroll in many Courses, and a Course can have many Students — Enrollment__c is the junction object with Master-Detail to both Student__c and Course__c. The junction object is the detail to both; deleting either parent cascades to delete the junction records.

### Cross-Object Formula Notation
To reference a parent field from a child record's formula, use `__r` (relationship API name) notation. For a custom relationship field `Account__c`, the relationship name for traversal is `Account__r`. So `Account__r.Industry` reads the Account's Industry field from a child record. For standard relationships like `AccountId` on Contact, use `Account.Industry` (no `__r` needed for standard lookups).

### External and Indirect Lookup (Advanced)
**External Lookup** relates a standard/custom Salesforce object to an External Object (from Salesforce Connect, pulling data from an external system in real-time). **Indirect Lookup** relates an External Object back to a standard/custom object using an External ID field as the join key. These are less common but do appear on the exam.

---

## PTA / SA Relevance

**In data model design:** The decision between Lookup and Master-Detail often comes down to "does the child record have business meaning without the parent?" A Contact without an Account is still a Contact (Lookup is fine). A Line Item without an Opportunity is meaningless (Master-Detail is appropriate).

**Cascade delete risk:** Deleting a master record deletes ALL detail records silently. This is a data governance risk. In architecture reviews, flag any Master-Detail where end users might delete parent records — a warning process or automation should prevent accidental mass deletes.

**Roll-Up Summary performance:** Roll-Up Summary fields recalculate when any detail record changes. In high-volume orgs with thousands of detail records per master, this can cause contention. If a customer reports slow saves on detail records, the roll-up recalculation is often the cause. Consider whether the roll-up is truly needed or if a nightly batch is sufficient.

**Integration note:** When integrating external systems via API, relationship fields are populated using the related record's **Id** (18-char Salesforce ID) or an **External ID** via upsert. Design your relationship model with external system keys in mind.

---

## Architecture / How It Works

```
Lookup vs. Master-Detail Comparison:
┌─────────────────────────┬──────────────────┬──────────────────────┐
│ Characteristic          │ Lookup           │ Master-Detail        │
├─────────────────────────┼──────────────────┼──────────────────────┤
│ Parent required?        │ No (optional)    │ Yes (mandatory)      │
│ Cascade delete?         │ No               │ Yes                  │
│ Roll-Up Summary?        │ No               │ Yes (on master)      │
│ Sharing inheritance?    │ No               │ Yes (detail inherits)│
│ OWD for detail?         │ Separate         │ Controlled by Parent │
│ Max per object          │ ~40              │ 2 (primary limit)    │
│ Child exists without    │ Yes              │ No                   │
│ parent?                 │                  │                      │
└─────────────────────────┴──────────────────┴──────────────────────┘
```

**Limitations:**
- An object can have at most 2 Master-Detail relationships (it can be a detail to at most 2 masters)
- You cannot convert a Lookup to Master-Detail if existing records have a blank (null) lookup value — all records must have a parent first
- The first Master-Detail on an object controls sharing; the second is secondary

```
Junction Object (Many-to-Many Pattern):
                                                            
  Student__c ◄────────────────────────────► Course__c     
       │                                        │          
       │ Master-Detail                Master-Detail │       
       │                                        │          
       └──────────► Enrollment__c ◄─────────────┘          
                   (Junction Object)                       
                                                           
Rules:                                                     
- Deleting Student__c → deletes all Enrollment__c records  
- Deleting Course__c  → deletes all Enrollment__c records  
- Enrollment__c OWD = Controlled by Parent (both masters)  
- Can have Roll-Up Summary on BOTH Student and Course      
```

**Limitations:**
- Junction objects can only have 2 Master-Detail relationships (not more)
- You cannot create a Roll-Up Summary on the junction object itself (it's the detail, not the master)
- The junction object inherits the MORE RESTRICTIVE of the two parent objects' OWD settings

```
Cross-Object Formula Notation:
                                                            
Child Object Formula accessing parent fields:              
                                                           
Custom relationship field: Account__c                      
Relationship name:         Account__r                      
Formula:                   Account__r.Industry             
                                                           
Standard relationship (Contact.AccountId):                 
Formula:                   Account.BillingCity             
(no __r suffix needed for standard relationship names)     
                                                           
2 levels deep:                                             
Child__r.Parent__r.GrandParent__c.Field__c                
(up to 5 levels deep)                                      
```

**Limitations:**
- Cross-object formula fields are read-only — they cannot write back to the parent
- Maximum 5 levels deep
- You cannot use cross-object formulas to reference child records (only parent records)
- Cross-object lookups from Formula fields count toward the query limit at runtime

---

## Key Facts to Memorize
- Lookup: optional, no cascade delete, no roll-up, no sharing inheritance
- Master-Detail: mandatory parent, cascade delete, enables roll-up summary + sharing inheritance
- Max 2 Master-Detail relationships per object
- Junction object = object with 2 Master-Detail relationships (implements many-to-many)
- `__r` suffix used to traverse a custom relationship in formulas and SOQL
- Standard relationship traversal: `Account.BillingCity` (no `__r`)
- Custom relationship traversal: `Account__r.BillingCity` (with `__r`)
- "Controlled by Parent" OWD = only available for detail objects in Master-Detail
- Roll-Up Summary: COUNT / SUM / MIN / MAX — Master-Detail only, on the master object

---

## Exam Traps
- **Roll-Up Summary requires Master-Detail.** If a scenario describes a Lookup relationship and asks how to SUM child values, the answer is NOT a Roll-Up Summary — it would need to be changed to Master-Detail first, OR use a Flow.
- **Cascade delete is silent.** If you delete a master record, all detail records are deleted without warning prompts. This is a key design risk.
- **Max 2 Master-Detail per object.** If you need a third Master-Detail, you must use a Lookup instead.
- **Converting Lookup to Master-Detail.** This is possible in Setup, but only if no existing child records have a null (blank) parent field. If any records have no parent, the conversion will fail.
- **`__r` vs. field API name.** The relationship name (`Account__r`) is NOT the same as the field API name (`Account__c`). The field stores the ID; the `__r` relationship lets you traverse to the parent's fields.

---

## Practice Questions

**Q:** An App Builder creates a Roll-Up Summary on Account to count related Contacts. Later, the business wants to do the same for Leads. Leads have a Lookup relationship to Account. Can a Roll-Up Summary be created?
**A:** No. Roll-Up Summary fields require a Master-Detail relationship. The Lead object uses a standard Lookup relationship to Account. To aggregate Leads on Account declaratively, a Flow would be needed to update a custom counter field.

**Q:** A company has Student__c and Course__c objects. Each student can be enrolled in multiple courses, and each course can have multiple students. The enrollment date and status need to be tracked. How should this be modeled?
**A:** Create a junction object Enrollment__c with two Master-Detail relationships — one to Student__c and one to Course__c. Add Enrollment_Date__c and Status__c fields to the junction object. This implements a proper many-to-many relationship with attributes on the relationship itself.

**Q:** An App Builder creates a formula field on a custom Job__c object with a Lookup to Account__c. The formula tries to display the Account's Industry. What is the correct formula syntax?
**A:** `Account__r.Industry` — using the `__r` suffix on the custom relationship name to traverse to the parent Account's Industry field.
