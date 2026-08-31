# L02: Data Modeling Fundamentals

## 🎯 Learning Objectives
- Define what data modeling means in the context of Salesforce
- Distinguish between a Salesforce object (template) and a record (instance)
- Identify when to use standard objects versus custom objects
- Apply a structured approach to planning a data model for a new app

---

## 📊 SLIDES

### Slide 1: What Is a Data Model?
**Visual:** Simple diagram showing "Data Model" in the center with three radiating branches: "Entities (Objects)" → "Relationships (How they connect)" → "Attributes (Fields)"
**Content:**
- A **data model** is a blueprint for how data is structured and related in your app
- Every business application is built on a data model — before you build in Salesforce, you design it
- Three questions define a data model: What are the **entities**? How do they **relate**? What **data** needs to be captured?
- A well-designed data model makes reporting, automation, and UX easier — a poor one creates technical debt
**Speaker Notes:** Think of a data model the way an architect thinks about a blueprint. Before you place a single brick, you need to know what rooms you're building, how they connect, and what goes in each room. In Salesforce, your "rooms" are objects, your hallways are relationships, and your furniture is fields. Every minute you spend designing a data model before building saves you hours of rework later.

### Slide 2: Entity-Relationship Concepts in Salesforce
**Visual:** Classic ER diagram style showing three boxes: "Account" ← (one-to-many) → "Contact" and "Account" ← (one-to-many) → "Opportunity." Crow's foot notation on the "many" sides.
**Content:**
- **Entity** = any distinct thing you need to track data about → becomes a **Salesforce Object**
- **Attribute** = a piece of data about an entity → becomes a **Field**
- **Relationship** = how entities are connected → becomes a **Lookup or Master-Detail relationship**
- One Account can have many Contacts (one-to-many)
- One Contact can relate to one Account at a time (the "one" side)
**Speaker Notes:** If you've studied any database design, Salesforce objects map directly to entities in an ER diagram. The terminology shifts — entities become objects, attributes become fields, and foreign key relationships become Lookup or Master-Detail relationships. The underlying concepts are the same. For those of you without database backgrounds, don't worry — we'll build this up from scratch throughout Section 2.

### Slide 3: Object vs. Record — Template vs. Instance
**Visual:** Two-column comparison. Left: "Object (Template)" with a blank form icon — "Account Object: Name, Phone, Industry, Annual Revenue." Right: "Record (Instance)" with a filled-in form icon — "Acme Corp | 415-555-0100 | Technology | $5,000,000."
**Content:**
- **Object** = the template/blueprint — defines what fields exist, what rules apply, how the page looks
- **Record** = one specific instance of that object — the actual data a user entered
- Analogy: Object is the **class**, Record is the **instance** (for developers); Object is the **cookie cutter**, Record is the **cookie**
- When you create a custom object, you define the template — your users then create records using that template
- Salesforce has millions of records across all orgs; each org has relatively few objects
**Speaker Notes:** This distinction between object and record is one of those foundational concepts that sounds simple but trips people up on the exam. When the exam says "an App Builder creates a custom object," it means they defined a template. When it says "a user creates a record," that's a data entry action. Customization lives at the object level. Data entry lives at the record level. Keep those two things separate in your mind.

### Slide 4: Standard Objects — Built Into Salesforce
**Visual:** Grid of standard object icons/names: Account, Contact, Lead, Opportunity, Case, Campaign, Product (Product2), Pricebook, Task, Event, User, Contract.
**Content:**
- **Standard objects** are pre-built by Salesforce — they ship with every org
- You can add fields to standard objects but cannot delete them or rename core fields
- Key standard objects for App Builder exam: Account, Contact, Lead, Opportunity, Case
- Standard objects have built-in features: Account-Contact relationship, Lead conversion to Account/Contact/Opportunity
- You cannot change an object's API name once records exist (standard or custom)
**Speaker Notes:** Standard objects represent the common nouns of business — customers, deals, support cases. Salesforce has already built the architecture for these, and most apps start with standard objects before adding custom ones. When you're designing a data model, always ask first: "Does a standard object already exist for this entity?" Extending a standard object is almost always better than creating a custom one from scratch.

### Slide 5: Custom Objects — Built by App Builders
**Visual:** Before/after comparison. Left "Before": standard CRM data model. Right "After": custom objects added — "Property__c", "Inspection__c", "Contractor__c" — connected to standard Account and Contact.
**Content:**
- **Custom objects** are created by admins and app builders to represent business-specific entities
- Custom object API names always end in `__c` (double underscore + c)
- Create a custom object when: no standard object fits the entity, you need to relate it to other objects, you need dedicated reports and dashboards
- Custom objects get all the same platform features as standard objects: layouts, record types, flows, reports
- Example: A real estate app needs Property, Listing, and Inspection objects — none exist as standard objects
**Speaker Notes:** The power of Salesforce as a platform is that you can extend it infinitely with custom objects. A healthcare company builds Patient and Appointment objects. A manufacturing company builds Product Line and Work Order objects. A nonprofit builds Volunteer and Program objects. Whatever your industry, you can model it in Salesforce. Custom objects are the building blocks of every custom Salesforce app you'll ever create.

### Slide 6: Planning a Data Model — The Three Questions
**Visual:** Flowchart with three sequential decision boxes: (1) "What entities need to be tracked?" → List objects. (2) "How do they relate to each other?" → Draw relationships. (3) "What data needs to be captured for each entity?" → List fields per object.
**Content:**
- **Step 1 — Entities:** Interview stakeholders. "What things do you track? What do you need to report on?" Each answer may be an object.
- **Step 2 — Relationships:** "Does one [X] have many [Y]?" If yes, that's a relationship. Decide if it's Lookup or Master-Detail (more in L06).
- **Step 3 — Fields:** "What do you need to know about each [entity]?" Each answer may be a field. Think about field type, required/optional, picklist values.
- Document before you build — a whiteboard diagram saves hours of rework
**Speaker Notes:** These three questions are your data modeling framework. Every time you start a new Salesforce app build, go through these steps before you touch Object Manager. Talk to stakeholders — they know the business entities. Ask about reporting — what reports do they need? Every column in a report is a field in your model. What they group by is often a relationship. This up-front design work is what separates good app builders from great ones.

### Slide 7: Design Principles — Normalization in Salesforce
**Visual:** Two diagrams. Left "Over-normalized": Five small objects with many relationships, complex to query. Right "Well-balanced": Three objects with clear relationships, efficient to use. Arrow pointing right labeled "Aim for this."
**Content:**
- **Normalization** = storing each piece of data once, in the right place
- In Salesforce, over-normalization creates too many objects with complex relationships — hard to use
- **Denormalization** = duplicating data for easier access — acceptable in Salesforce via formula fields and roll-up summaries
- Principle: Group related data on the same object. Only create a new object when the entity is distinct enough to stand alone.
- Bad smell: An object with only 2-3 fields and no standalone reporting need — likely should be a picklist on a parent object
**Speaker Notes:** Database purists normalize everything. Salesforce app builders have to find a balance. Roll-up summary fields and cross-object formulas let you access parent data on child records without complex joins, so some denormalization is built in. But don't create objects for things that are really just categories or statuses — those belong as picklist fields. Ask: "Would a user ever search directly for this entity, or report on it independently?" If yes, it deserves its own object.

### Slide 8: Data Model Documentation
**Visual:** Sample data model diagram with boxes for Account, Contact, Opportunity, Custom_Project__c, Custom_Milestone__c showing relationship lines with cardinality labels (1, *).
**Content:**
- Always document your data model before and after building
- Use Schema Builder (covered in L07) to visualize your model in the org
- Key documentation: object names, API names, field names, relationship types, cardinality, any special behavior (Master-Detail vs Lookup)
- Share documentation with stakeholders and developers — everyone works from the same blueprint
- Schema documentation is also the starting point for any future app changes
**Speaker Notes:** Documentation is often skipped when app builders are under deadline pressure, and it's almost always regretted later. A data model diagram you create today will save the next person hours of archaeology when they're asked to extend the app six months from now. Schema Builder generates this for you automatically — we'll use it in L07. For now, just know that your data model should be documented, not just built.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 02 — Data Modeling Fundamentals. If Platform Overview was the "what is Salesforce" lecture, this one is the "how do you think about building on it" lecture. Data modeling is the single most important skill you'll develop as an app builder, because every other decision — security, automation, UI — flows from your data model.

Slide 1 defines data modeling in three questions: What are your entities? How do they relate? What data needs to be captured? Every Salesforce app you've ever seen started with answers to these three questions, whether the builder knew it or not. If they knew it, the app is clean and scalable. If they didn't, you'll find fields in weird places and objects that don't quite make sense.

Slide 2 connects this to entity-relationship concepts. If you've done any database work, this is familiar — entities become objects, attributes become fields, relationships become Lookups or Master-Detail connections. If you haven't, don't worry. We'll build the vocabulary up gradually. The Account-Contact relationship is the perfect example: one Account, many Contacts. That's a one-to-many relationship, and in Salesforce it's modeled as a Lookup from Contact to Account.

Slide 3 — please internalize this one. An **object** is a template. A **record** is an instance of that template. The Account *object* defines that accounts have a Name, Phone, Industry, and Annual Revenue. The "Acme Corp" account *record* is actual data someone entered using that template. When you're building, you work at the object level. When your users are working, they create and edit records. This distinction comes up constantly on the exam.

Slides 4 and 5 cover the two categories of objects. Standard objects ship with Salesforce — Account, Contact, Opportunity, Case, and others. They're pre-built and pre-related in useful ways. Custom objects are what you create. They always have `__c` at the end of their API name. The rule of thumb: start with standard objects, extend them with custom fields, and only create a custom object when you have a distinct business entity that isn't represented by anything standard.

Slide 6 is your data modeling workflow. Do this every time you start a new app: list your entities, draw the relationships, then list the fields for each entity. Whiteboard it first. Don't open Object Manager until you've got a clear picture. I know that feels slow when you're excited to start building, but every minute of design work saves you ten minutes of rework.

Slides 7 and 8 cover design principles. In Salesforce, you want a balanced data model — not so normalized that you have dozens of objects with complex relationships, but not so flat that every possible piece of data is jammed onto one object. Use picklist fields for categories and statuses. Create separate objects only for distinct, independently reportable entities. And document what you build.

In the next lecture, we'll look at the Salesforce security model — because once your data model is designed, you need to decide who can see and edit what.

---

## 🔔 EXAM TIPS
- **Object vs. record distinction:** Exam questions about "creating a custom object" test your understanding that you're creating a template/blueprint, not actual data. Customization happens at the object level.
- **Standard vs. custom objects:** When an exam scenario describes a common business entity (customers, deals, support cases), the answer likely involves a **standard object**. Custom objects are for industry-specific or business-specific entities.
- **Custom object API naming:** Custom object and field API names always end in `__c`. This notation appears in exam questions — recognize it as a custom element.
- **"What objects should be created" scenarios:** Use the three-question framework. Ask: Is there a standard object? Can it be extended? Does this entity need independent reporting? If no standard object fits and you need dedicated reporting, create a custom object.

---

## ✅ LECTURE SUMMARY
- A data model defines entities (objects), their relationships, and the fields that capture data about each entity
- An object is a template/blueprint; a record is a specific instance of that object containing actual data
- Standard objects (Account, Contact, Opportunity) ship with Salesforce; custom objects are created by app builders and end in `__c`
- Always plan a data model using three questions: What are the entities? How do they relate? What data needs to be captured?
- Balance normalization — use picklists for categories, create separate objects only for genuinely distinct entities

---

## ❓ MINI QUIZ

**Q1:** A company wants to track "projects" in Salesforce. Each project belongs to an Account and has a start date, end date, status, and budget. No standard Salesforce object covers this. What should the App Builder do?
- A) Add fields for Start Date, End Date, Status, and Budget to the Account object
- B) Create a custom object called Project__c with the required fields and a relationship to Account
- C) Use the Opportunity object and rename the fields to match the project data
- D) Store project data in a related Contact record

**Answer:** B — When no standard object fits a distinct business entity, create a custom object. Adding fields to Account conflates projects with accounts; repurposing Opportunity is bad practice and breaks standard Sales Cloud functionality.

**Q2:** An App Builder is designing a data model and needs to know whether to create a new custom object for "Product Category." Each product belongs to one category, and a category has only a name and a description. Users never need to search for categories or run reports specifically on them. What is the best approach?
- A) Create a custom object called Product_Category__c with a Lookup to the Product object
- B) Add a text field called "Category" to the Product object
- C) Add a picklist field called "Category" to the Product object
- D) Use the standard Category object in Salesforce

**Answer:** C — If an entity has minimal data, no independent reporting need, and represents a classification/category, a picklist field is more appropriate than a separate custom object. Picklists enforce consistent values and are much simpler to manage.

**Q3:** Which of the following correctly describes the relationship between a Salesforce object and a Salesforce record?
- A) A record is the template that defines what fields exist; an object is an instance of data
- B) An object is the template that defines what fields exist; a record is a specific instance of data
- C) Objects and records are the same thing — the terms are interchangeable
- D) Records define the security model; objects define the data structure

**Answer:** B — An object is the template (blueprint) defining the structure, and a record is a specific instance containing actual data. This is a foundational concept for the App Builder exam.
