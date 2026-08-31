# L07: Schema Builder

## 🎯 Learning Objectives
- Explain what Schema Builder is and how to access it in Salesforce Setup
- Create objects and fields directly in Schema Builder using the visual canvas
- Read a Schema Builder diagram to identify relationship types and field configurations
- Describe Schema Builder's limitations and when to use Object Manager instead

---

## 📊 SLIDES

### Slide 1: What Is Schema Builder?
**Visual:** Split-screen. Left: Text-based Object Manager interface showing a list of objects. Right: Schema Builder canvas showing the same objects as boxes with connecting relationship lines. Arrow pointing right labeled "Same data, visual view."
**Content:**
- **Schema Builder** is a visual, canvas-based tool for viewing and managing your Salesforce data model
- Access via: **Setup > Schema Builder** (or search "Schema Builder" in Quick Find)
- Displays objects as boxes and relationships as connecting lines
- You can create objects, fields, and relationships directly on the canvas — without leaving Schema Builder
- Provides a holistic view of your entire data model at once — impossible to get from Object Manager alone
**Speaker Notes:** Schema Builder is one of those tools that's underused by beginners and loved by experienced app builders. Object Manager gives you access to every setting for every object, but it shows you one object at a time. Schema Builder steps back and shows you the whole picture — all your objects, all your relationships, all your fields — on one canvas. When you're designing a new app or trying to understand an org you've inherited, Schema Builder is the place to start.

### Slide 2: Opening and Navigating Schema Builder
**Visual:** Annotated screenshot of Schema Builder with callout labels: (1) Left sidebar for object filtering — "Filter which objects appear on canvas." (2) Canvas area — "Drag objects to arrange, zoom in/out." (3) Selected object panel — "Click a field to see its properties." (4) Relationship lines — "Blue = Lookup, Gold/Orange = Master-Detail."
**Content:**
- **Left Sidebar:** Shows all objects. Check/uncheck to show or hide objects on canvas.
- **Canvas:** Main working area. Drag objects to rearrange. Zoom in/out with the scroll wheel.
- **Relationship Lines:** Blue lines = Lookup. Gold/orange lines = Master-Detail.
- **Clicking a field:** Shows field type, API name, and properties in the sidebar
- **Searching:** Type in the search box to filter the object list — helpful in large orgs with many objects
**Speaker Notes:** The first time you open Schema Builder in a real-world org, you may be overwhelmed — there could be hundreds of objects, all piled on top of each other. The key skill is filtering. Use the left sidebar to show only the objects relevant to the app you're working on. Check five or six objects and arrange them on the canvas. Now you have a clear, focused view of the data model for that app. This is the way experienced app builders use Schema Builder — not by looking at everything at once, but by focusing on the relevant slice.

### Slide 3: Creating Objects and Fields in Schema Builder
**Visual:** Illustrated steps. Step 1: "Click Elements tab in sidebar → drag 'Object' onto canvas." Step 2: "Fill in object details in the popup (Label, Plural Label, API Name, Name Field type)." Step 3: "Drag a field type from Elements sidebar onto the object box." Step 4: "Drag a 'Relationship' element to connect two objects."
**Content:**
- **Creating an object:** Drag the "Object" element from the Elements palette onto the canvas → fill in the object details
- **Creating a field:** Drag a field type from the Elements palette onto an object box → configure the field properties
- **Creating a relationship:** Drag "Lookup Relationship" or "Master-Detail Relationship" onto the child object, then select the parent
- All elements available: objects, all field types, relationships (Lookup, Master-Detail, Hierarchy)
- Changes are saved immediately when you confirm — no "save all" button
**Speaker Notes:** Building in Schema Builder feels more natural for visual thinkers because you're literally placing objects on a canvas and drawing lines between them. It's especially good for design sessions with stakeholders — you can share your screen, show the evolving data model, and make changes in real time as the conversation progresses. The interactive nature makes it a great collaborative tool. That said, know that Schema Builder doesn't support every action that Object Manager supports — that's what we cover in the next few slides.

### Slide 4: Viewing Relationships in Schema Builder
**Visual:** Schema Builder canvas showing three objects: Account (top), Contact (left bottom), Opportunity (right bottom). Lines connecting them: blue line from Contact to Account labeled "AccountId (Lookup)," blue line from Opportunity to Account labeled "AccountId (Lookup)," golden line from Opportunity_Line_Item__c to Opportunity labeled "(Master-Detail)."
**Content:**
- Relationship lines show the **type** and **direction** of each relationship
- Blue/dark lines = **Lookup relationships** (optional, no cascade delete)
- Gold/orange lines = **Master-Detail relationships** (required, cascade delete, roll-up summary)
- Hover over a relationship line to see the field name and relationship details
- Cardinality (one-to-many direction) is shown by which object the line originates from (child) vs. ends at (parent)
**Speaker Notes:** Being able to read a Schema Builder diagram is a skill tested on the exam. If you see a screenshot of Schema Builder, you should be able to identify: which objects are in a Master-Detail relationship versus a Lookup, which object is the parent versus child (the relationship line originates from the child), and what the relationship field is named. Practice looking at Schema Builder diagrams until you can read them as easily as a map. The color coding is your best friend — gold for Master-Detail, blue for Lookup.

### Slide 5: Schema Builder Limitations — What It Cannot Do
**Visual:** Red X list of limitations with explanations: Cannot delete objects or fields, Cannot create all field types (some complex types missing), Cannot manage page layouts, Cannot configure FLS, Cannot manage validation rules or Flows, Cannot view or manage record types.
**Content:**
- **Cannot delete objects or fields** — must use Object Manager for deletions
- **Cannot create all field types** — some complex types (Geolocation, External Lookup) may not be available
- **Cannot manage page layouts** — Schema Builder is data model only, not UI configuration
- **Cannot configure Field-Level Security** — FLS must be set in Object Manager or Profile settings
- **Cannot manage validation rules** — those are managed from the object's detail page in Object Manager
- **Summary:** Schema Builder is for **viewing and creating** data model elements, not for managing all object settings
**Speaker Notes:** The limitations of Schema Builder are just as important as its capabilities for the exam. When you see an exam question asking where to configure something, and Schema Builder is one of the options, remember: Schema Builder creates objects and fields. It does NOT do page layouts, FLS, validation rules, or record types. Those all live in Object Manager. A common exam trap is to offer Schema Builder as an option for something that requires Object Manager, counting on you not to know the difference.

### Slide 6: Schema Builder vs. Object Manager — When to Use Each
**Visual:** Two-column "use this when" guide. Left "Schema Builder": Visualizing the full data model, Design sessions with stakeholders, Creating new objects and relationships quickly, Getting a bird's-eye view of an inherited org. Right "Object Manager": Detailed field configuration, Page layouts, Record types, FLS, Validation rules, Deleting objects and fields, Global picklist management.
**Content:**
- **Use Schema Builder for:** Visualization, high-level design, creating objects and basic fields, relationship planning
- **Use Object Manager for:** Detailed configuration, page layouts, record types, FLS, validation rules, deletions
- Best practice: **Design in Schema Builder, configure details in Object Manager**
- You can start an object in Schema Builder and continue detailed configuration in Object Manager — they're the same underlying data
- For large orgs with complex models: Schema Builder filtered to relevant objects is invaluable for documentation
**Speaker Notes:** Think of Schema Builder and Object Manager as complementary tools, not alternatives. Schema Builder gives you the picture; Object Manager gives you the details. A good workflow for a new app: sketch the data model in Schema Builder, then use Object Manager to add page layouts, record types, and validation rules. Some app builders never use Schema Builder at all and work entirely in Object Manager — that's fine, but they're missing out on the visualization and the collaborative design benefits that Schema Builder provides.

### Slide 7: Reading a Schema Builder Diagram — Exam Skill
**Visual:** A sample Schema Builder-style diagram with 4 objects: Project__c, Milestone__c, Task__c, and User. Project-to-Milestone: gold line (Master-Detail). Milestone-to-Task: gold line (Master-Detail). Task-to-User: blue line (Lookup). Labels on relationship lines.
**Content:**
- Given a Schema Builder diagram, identify: object names, relationship types (Lookup vs MD), parent vs. child
- **Parent is where the line ENDS** (the "one" side); **child is where the line STARTS** (the "many" side)
- Master-Detail (gold line): child records cannot exist without parent, cascade delete applies
- Lookup (blue line): child records can exist independently
- Field names appear along the relationship lines — use them to identify which field creates the relationship
**Speaker Notes:** Exam questions will sometimes show you a Schema Builder diagram and ask questions like "what happens if a Project is deleted?" To answer, you look at the gold lines — Master-Detail — and trace the cascade. Delete Project → delete all Milestones (Master-Detail). Delete Milestones → delete all Tasks (Master-Detail). But the User record is not deleted because the Task-to-User relationship is a Lookup. Practice reading these diagrams until the logic is second nature.

### Slide 8: Schema Builder as a Documentation Tool
**Visual:** A printed Schema Builder diagram (like a poster) labeled "Data Model Documentation — MyApp v2.0" with date and team name. Annotations showing which objects are new (highlighted green) and which are standard (highlighted blue).
**Content:**
- Schema Builder exports to **PDF** or image — useful for documentation and stakeholder communication
- Use filtered views to export focused diagrams per app or feature area
- Annotating exported diagrams with version information helps track data model evolution
- Compare before/after diagrams when doing a change impact analysis
- Some teams embed Schema Builder exports in their technical design documents
**Speaker Notes:** This is a professional practice point more than an exam point, but it's worth mentioning. Every significant Salesforce project should have its data model documented, and Schema Builder makes that documentation almost free — you filter the objects, arrange them nicely, and export. A printed or PDF data model diagram in your design document immediately communicates more than a list of object names in a table. Share it with developers, with stakeholders, with the next admin who inherits the org. Documentation is a professional responsibility, not an optional extra.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 07 — Schema Builder. If Object Manager is your workshop for detailed configuration, Schema Builder is your architect's drawing board. It's the visual layer on top of your data model, and it's one of those tools that makes an immediate difference once you know how to use it.

Slide 1 defines Schema Builder simply: it's a canvas-based visual view of your Salesforce data model, where objects are boxes and relationships are connecting lines. Access it from Setup, search "Schema Builder" in Quick Find. What it gives you is perspective — instead of clicking from object to object in Object Manager, you see the entire model in one view.

Slide 2 walks through the interface. The key features: the left sidebar for filtering which objects appear on canvas, the canvas itself where you arrange your objects, and the color-coded relationship lines. Blue for Lookup, gold for Master-Detail. That color distinction is testable on the exam — recognize it.

Slide 3 covers how to create things in Schema Builder. You can drag objects from the Elements palette onto the canvas. You can drag field types onto objects. You can draw relationship lines between objects. It's genuinely intuitive once you try it. What's especially useful is creating objects during a design session — you can whiteboard a data model with stakeholders and then immediately build it in Schema Builder on the same screen call.

Slide 4 is about reading relationship diagrams — this is the exam skill. The line originates from the child object and ends at the parent. The color tells you the type. The field name appears along the line. If you can read a Schema Builder diagram fluently, you can answer a whole category of exam questions that show you a diagram and ask about relationship behavior.

Slide 5 — the limitations. This is critical. Schema Builder cannot delete objects or fields. It cannot manage page layouts, FLS, validation rules, or record types. It creates data model elements; it does not manage all configuration. The exam will offer Schema Builder as a wrong answer for tasks that require Object Manager. Know the boundary.

Slide 6 gives you the use-each-tool guidance. Schema Builder for visualization and creation. Object Manager for detailed configuration. Use them together — design in Schema Builder, configure in Object Manager.

Slide 7 is a practice slide. Look at the sample diagram — Project to Milestone (gold, Master-Detail), Milestone to Task (gold, Master-Detail), Task to User (blue, Lookup). Trace the cascade: delete a Project and you lose all its Milestones and Tasks, but User records are untouched.

And Slide 8 — Schema Builder exports to PDF. Document your data model. Future you, and future colleagues, will thank present you.

---

## 🔔 EXAM TIPS
- **Schema Builder limitations:** Cannot delete objects/fields, cannot manage page layouts, FLS, validation rules, or record types. These require Object Manager.
- **Color coding:** Blue/dark lines = Lookup; Gold/orange lines = Master-Detail. Recognizing this in diagrams is a direct exam skill.
- **Reading diagram direction:** The child object is where the relationship field lives (where the line starts). The parent is where the line ends (the "one" side).
- **Where to find Schema Builder:** Setup > Schema Builder (or Quick Find search). This is the correct navigation path on the exam.
- **Schema Builder can create:** Objects, fields (most types), Lookup relationships, Master-Detail relationships. It is NOT the place for page layouts or validation rules.

---

## ✅ LECTURE SUMMARY
- Schema Builder is a visual canvas tool that displays objects as boxes and relationships as color-coded lines (blue = Lookup, gold = Master-Detail)
- Accessed via Setup > Schema Builder; supports creating objects, fields, and relationships directly on the canvas
- Schema Builder cannot delete objects/fields, cannot manage page layouts, FLS, validation rules, or record types — those require Object Manager
- Use Schema Builder for visualization, design sessions, and creating data model elements; use Object Manager for detailed configuration
- Reading Schema Builder diagrams is an exam skill: identify relationship types by line color and direction, then reason about cascade delete and Roll-Up Summary availability

---

## ❓ MINI QUIZ

**Q1:** An App Builder needs to configure the page layout for a custom object so that certain fields appear in a two-column format. Where should the App Builder go to make this change?
- A) Schema Builder — drag and drop fields onto the layout canvas
- B) Object Manager — Page Layouts section for the custom object
- C) Schema Builder — click the object and edit the Layout tab
- D) Lightning App Builder — add fields to the Lightning page

**Answer:** B — Schema Builder does not manage page layouts. Page layouts are configured in Object Manager under the specific object's "Page Layouts" section. Schema Builder is for data model visualization and creating objects/fields/relationships only.

**Q2:** While reviewing a Schema Builder diagram, an App Builder notices a gold line connecting the Order_Line__c object to the Order__c object. What does this indicate?
- A) Order_Line__c has a Lookup relationship to Order__c
- B) Order_Line__c has a Master-Detail relationship to Order__c, with Order__c as the master
- C) Order__c has a Master-Detail relationship to Order_Line__c, with Order_Line__c as the master
- D) Order_Line__c and Order__c share a many-to-many junction relationship

**Answer:** B — Gold/orange lines in Schema Builder represent Master-Detail relationships. The line originates from the child (Order_Line__c) and ends at the parent (Order__c), making Order__c the master and Order_Line__c the detail.

**Q3:** An App Builder wants to use Schema Builder to delete a custom field that is no longer needed. What will happen when the App Builder attempts this in Schema Builder?
- A) The App Builder can delete the field by right-clicking it on the canvas
- B) Schema Builder does not support deleting fields — this must be done in Object Manager
- C) The field will be moved to a recycle bin in Schema Builder for 15 days before permanent deletion
- D) Schema Builder will prompt for confirmation and then delete the field and all its data

**Answer:** B — Schema Builder cannot delete objects or fields. Deleting a custom field requires navigating to the field in Object Manager (or the object's field list) and using the Delete action there.
