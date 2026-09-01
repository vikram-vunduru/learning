# Lecture 09: Data Governance & Access Control

## Learning Objectives
- Explain what Data Spaces are and how they support multi-tenant data isolation within a single Data Cloud org
- Describe the Data Cloud permission sets and what each grants access to
- Configure access control for Data Streams, Segments, and other Data Cloud objects
- Understand how sharing rules and profile permissions apply to Data Cloud components

---

## Slides

### Slide 1: Data Cloud Governance Overview
**Visual:**
```
  GOVERNANCE HIERARCHY
  ──────────────────────────────────────────────────────────
  ┌──────────────────────────────────────────────────────┐
  │              SALESFORCE ORG                          │
  │  Profiles, Permission Sets (foundation access)       │
  │  ┌────────────────────────────────────────────────┐  │
  │  │           DATA CLOUD INSTANCE                  │  │
  │  │  Data Cloud Permission Sets (feature access)   │  │
  │  │  ┌─────────────────┐  ┌─────────────────────┐  │  │
  │  │  │  DEFAULT DATA   │  │  CUSTOM DATA SPACE  │  │  │
  │  │  │  SPACE          │  │  (e.g., Marketing)  │  │  │
  │  │  │  All users       │  │  Marketing team     │  │  │
  │  │  │  see this        │  │  only               │  │  │
  │  │  └─────────────────┘  └─────────────────────┘  │  │
  │  └────────────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────┘

  Layer 1: Profile → can user access Data Cloud at all?
  Layer 2: Permission Sets → what features can they use?
  Layer 3: Data Spaces → what data objects can they see?
```

**Content:**
- Data Cloud governance controls **who can see and work with what data**
- Governance operates at multiple levels: org-level (Salesforce profiles/permissions), Data Cloud-level (Data Cloud permission sets), and Data Space-level (data isolation)
- Key governance components:
  - **Data Spaces** — logical partitions of data within Data Cloud
  - **Permission Sets** — grant access to Data Cloud features and objects
  - **Profile Permissions** — control what users can do in the Salesforce org
  - **Access Control** — fine-grained control on individual Data Streams, Segments, and other objects

**Speaker Notes:** Data Cloud governance is an exam topic that appears in both the Administration & Governance domain and in scenario questions throughout the exam. The governance model in Data Cloud is layered: the standard Salesforce permission model (profiles, permission sets) controls who can access the Data Cloud UI and objects in Salesforce Setup. Above that, Data Cloud has its own permission sets that specifically grant access to Data Cloud functionality. And at the top, Data Spaces provide logical data partitioning within a single Data Cloud instance — important for organizations that want to keep marketing data separate from operational data, or maintain regional data isolation.

---

### Slide 2: Data Spaces
**Visual:**
```
  DATA CLOUD INSTANCE
  ──────────────────────────────────────────────────────────
  ┌────────────────────────────────────────────────────────┐
  │  DEFAULT DATA SPACE                                    │
  │  ─────────────────────────────────────────────────     │
  │  Sales Cloud Data Streams  │  CRM Segments             │
  │  (All users with DC access can see these)              │
  └────────────────────────────────────────────────────────┘
  ┌────────────────────────────────────────────────────────┐
  │  MARKETING DATA SPACE (custom)                         │
  │  ─────────────────────────────────────────────────     │
  │  MC Data Streams  │  Marketing Segments                │
  │  Marketing-specific Activation Targets                 │
  │  (Only Marketing team permission set users)            │
  └────────────────────────────────────────────────────────┘
  ┌────────────────────────────────────────────────────────┐
  │  FINANCE DATA SPACE (custom)                           │
  │  ─────────────────────────────────────────────────     │
  │  Revenue Data Streams  │  Finance Analytics Segments   │
  │  (Only Finance analysts — NOT visible to Marketing)    │
  └────────────────────────────────────────────────────────┘
  NOTE: Data Spaces are LOGICAL — not physical separation
        All data is in the same Data Cloud instance
```

**Content:**
- A **Data Space** is a logical partition within a Data Cloud instance
- **Default Data Space:** exists in every Data Cloud org; all objects are in default unless assigned elsewhere
- **Custom Data Spaces:** created for specific use cases, teams, or business units
- Data Streams, DMOs, Segments, and Activation Targets can be assigned to specific Data Spaces
- Users/permission sets can be granted access to specific Data Spaces
- Data Spaces do NOT provide physical data isolation — they're logical access boundaries
- Use cases: department separation (marketing vs. service), regional data governance, multi-brand management

**Speaker Notes:** Data Spaces are a moderately complex exam topic. The key distinction: they are logical partitions, not physical database separations. Data Spaces control visibility — a user assigned only to the Marketing Data Space can only see objects in that space. But the underlying data is all in the same Data Cloud instance. This is important for organizations that want to give Marketing team members access to marketing segments without exposing service or sales data. The exam may test when to create a custom Data Space versus using the default — use a custom Data Space when you need to restrict data visibility between different teams or purposes.

---

### Slide 3: Data Cloud Permission Sets
**Visual:**
```
  ┌──────────────────────────────────────────────────────────┐
  │ PERMISSION SET              │ ACCESS LEVEL               │
  ├──────────────────────────────┼────────────────────────────┤
  │ Data Cloud Admin             │ Full: Data Streams, DMOs,  │
  │                              │ IR, ATs, Segments, Settings│
  ├──────────────────────────────┼────────────────────────────┤
  │ Data Cloud Data Aware        │ Build/manage: Segments,    │
  │ Specialist                   │ CIs, Activation Targets    │
  │                              │ Cannot: configure Data     │
  │                              │ Streams or system config   │
  ├──────────────────────────────┼────────────────────────────┤
  │ Data Cloud Marketing         │ Read-only: Segments and    │
  │ Specialist                   │ activations (reporting)    │
  ├──────────────────────────────┼────────────────────────────┤
  │ Data Cloud for Marketing     │ MC Connector integration   │
  │ Cloud                        │ user (bidirectional)       │
  └──────────────────────────────┴────────────────────────────┘
  Permission sets are EXPLICITLY ASSIGNED — not automatic
  Multiple sets can be combined for specific role needs
```

**Content:**
- **Data Cloud Admin:** Full access to all Data Cloud configuration — Data Streams, DMOs, Identity Resolution, Activation Targets, Segments, Settings
- **Data Cloud Data Aware Specialist:** Can create and manage segments, Calculated Insights, and Activation Targets; cannot manage Data Streams or system config
- **Data Cloud Marketing Specialist:** Read-only access to segments and activation; primarily for Marketing Cloud connection users
- **Data Cloud for Marketing Cloud:** Enables the Marketing Cloud Connector; assigned to MC-connected user
- Permission sets must be **explicitly assigned** to users — they don't apply by default
- Multiple permission sets can be combined for specific role needs

**Speaker Notes:** Permission sets for Data Cloud follow the principle of least privilege. You don't give everyone the Admin permission set — you give each user role the minimum access they need. The exam tests matching roles to permission sets. An implementation consultant setting up Data Streams needs the Admin permission set. A marketing analyst building segments needs the Data Aware Specialist permission set. A Marketing Cloud integration user needs the Marketing Cloud-specific permission set. Common exam trap: a user can see the Data Cloud app but can't create segments — they likely have a profile with app access but no Data Cloud permission set assigned.

---

### Slide 4: Profile Permissions for Data Cloud
**Visual:**
```
  PROFILE PERMISSION LAYERS FOR DATA CLOUD ACCESS
  ──────────────────────────────────────────────────────────
  LAYER 1: Profile — App & Object Access
  ┌──────────────────────────────────────────────────────┐
  │ App Visibility: [✓] Data Cloud                       │
  │ Object Permissions:                                  │
  │   Data Stream:      [R] [C] [E] [D]                  │
  │   Segment:          [R] [C] [E] [D]                  │
  │   Activation Target:[R] [C] [E] [D]                  │
  │   Calculated Insight:[R] [C] [E] [D]                 │
  └──────────────────────────────────────────────────────┘
  System Administrator profile: full access by default

  LAYER 2: Data Cloud Permission Sets (additive)
  ┌──────────────────────────────────────────────────────┐
  │ Data Cloud Admin / Data Aware Specialist / etc.      │
  │ Grants DC-specific feature access on top of profile  │
  └──────────────────────────────────────────────────────┘

  TROUBLESHOOT ACCESS: Profile first → Permission Sets → Data Space
  If user sees DC app but can't create segments:
  → Check Data Cloud permission set is assigned
```

**Content:**
- Standard Salesforce **profile object permissions** apply to Data Cloud objects
- Key objects requiring profile permissions: Data Streams, DMOs, Segments, Activation Targets, Calculated Insights
- **System Administrator** profile has full access by default
- Custom profiles need Data Cloud object permissions explicitly enabled
- Common required permissions: "View All Data" (for admins), object-level CRUD for Data Cloud objects
- **FLS (Field Level Security)** applies to Data Cloud DMO fields in some contexts
- Profile permissions are the first layer — Data Cloud permission sets are additive on top

**Speaker Notes:** Profile permissions and Data Cloud permission sets work together. Think of profiles as controlling the "foundation" of what a user can do in Salesforce, and permission sets as granting additional specific capabilities. A common troubleshooting scenario on the exam: a user has been assigned the Data Cloud Data Aware Specialist permission set but still can't access segments. The issue might be at the profile level — the profile doesn't have visibility into the Data Cloud app or the Segment object. Always check both layers when troubleshooting access issues.

---

### Slide 5: Access Control for Data Streams
**Visual:**
```
  DATA STREAM ACCESS CONTROL
  ──────────────────────────────────────────────────────────
  Data Stream: Revenue_Transactions__dlm (sensitive)
  ┌──────────────────────────────────────────────────────┐
  │ Data Space:   [ Finance Data Space          ]        │
  │ Access:       [ Finance Analysts group      ]        │
  │               [ Finance Data Space members  ]        │
  └──────────────────────────────────────────────────────┘
  Marketing Analyst user:
  → Has Data Aware Specialist permission set ✓
  → Does NOT have Finance Data Space access ✗
  → CANNOT see Revenue_Transactions__dlm
  → CANNOT see segments built from it

  Finance Analyst user:
  → Has Data Aware Specialist permission set ✓
  → HAS Finance Data Space access ✓
  → CAN see and work with Revenue_Transactions__dlm

  Admin user: can access ALL Data Streams regardless of Data Space
```

**Content:**
- Data Streams can have **access control** configured to restrict which users can view/edit them
- Access is controlled by assigning Data Streams to specific **Data Spaces**
- Users with access to a Data Space can work with all Data Streams within that space
- Important for compliance: restrict access to sensitive source data (PII, financial records)
- **Read vs. Manage access:** some users may need to read a Data Stream's status without editing it
- Admin users can access all Data Streams regardless of Data Space assignment

**Speaker Notes:** Data Stream access control is a practical governance topic. In a large enterprise, you might have a Data Stream ingesting sensitive financial records that only the compliance team should see. By assigning that Data Stream to a restricted Data Space and only granting the compliance team access to that space, you ensure appropriate data handling. The exam tests this in scenarios where "a marketing analyst should be able to see segment results but not the underlying source data from the financial system" — the solution is Data Spaces with appropriate access assignment.

---

### Slide 6: Segment and Activation Target Access Control
**Visual:**
```
  SEGMENT ACCESS CONTROL
  ──────────────────────────────────────────────────────────
  ┌────────────────────────────────────────────────────────┐
  │  Segment: High_Value_Finance_Customers                 │
  │  ────────────────────────────────────                  │
  │  Data Space: [ Finance Data Space ]                    │
  │  Owner:      [finance.analyst@co.com]                  │
  │  Sharing:    [Finance Team — View/Edit]                │
  └────────────────────────────────────────────────────────┘
  Marketing Analyst: CANNOT see this segment (wrong space)

  ACTIVATION TARGET ACCESS (high privilege action):
  ┌────────────────────────────────────────────────────────┐
  │  Creating new Activation Targets = Data Cloud Admin    │
  │  ONLY — prevents unauthorized data egress to external  │
  │  systems                                               │
  │                                                        │
  │  Why: Activation Targets connect Data Cloud to         │
  │  external systems; creating one means customer data    │
  │  can leave the org                                     │
  └────────────────────────────────────────────────────────┘
  BEST PRACTICE: Test segments in separate Data Space from
                 production segments
```

**Content:**
- Segments can be assigned to specific **Data Spaces** to restrict visibility
- Users without access to a Data Space cannot see segments in that space
- **Segment ownership:** the creator of a segment owns it by default
- Sharing can be configured to grant additional users view/edit/manage access
- **Activation Target access:** typically Admin-only — prevents unauthorized activation of customer data
- Best practice: use separate Data Spaces for test segments vs. production segments
- Changes to segment sharing require the owner or Admin-level permission

**Speaker Notes:** Segment access control is critical because segments represent targeting intelligence — you don't want an unauthorized user to create a segment and activate it to an external ad platform. The principle is similar to CRM report folders: segments live in Data Spaces, and access to those spaces controls who can find and use specific segments. The Activation Target access being Admin-only by default is a governance safeguard — not just any Data Cloud user should be able to connect new channels or trigger activations to external platforms. The exam may test this as "who should have permission to create new Activation Targets?" — the answer is Data Cloud Admin.

---

### Slide 7: Sharing Rules & Record-Level Security
**Visual:**
```
  ACCESS CONTROL COMPARISON
  ──────────────────────────────────────────────────────────
  ┌────────────────────────────┐  ┌────────────────────────┐
  │  SALESFORCE CRM            │  │  DATA CLOUD            │
  │  (Standard sharing model)  │  │  (Data Space model)    │
  ├────────────────────────────┤  ├────────────────────────┤
  │  Sharing Rules             │  │  Data Space assignment │
  │  OWD (Org-Wide Defaults)   │  │  + Permission Sets     │
  │  Role Hierarchy            │  │                        │
  │  Manual Sharing            │  │                        │
  ├────────────────────────────┤  ├────────────────────────┤
  │  Controls: Account,        │  │  Controls: Data Stream,│
  │  Contact, Opportunity      │  │  Segment, AT, CI,      │
  │  record visibility         │  │  DMO access            │
  └────────────────────────────┘  └────────────────────────┘

  NOTE: Standard Salesforce sharing rules DO NOT control
        DMO record-level access in Data Cloud.
        Use Data Spaces + Permission Sets for DC governance.
        Standard sharing applies to Salesforce UI WRAPPER
        objects (e.g., Segment object in CRM layer).
```

**Content:**
- Salesforce's standard **sharing rules** apply to some Data Cloud UI objects
- Owner-based sharing: the creator of a segment can share it with specific users/groups
- Role hierarchy: Data Cloud respects the Salesforce role hierarchy for record visibility in some contexts
- **Restriction rules** (Salesforce Record Access): can restrict visibility of specific individual records
- Data Cloud does NOT support Salesforce's standard Opportunity/Account sharing model for DMO records
- For DMO record-level security: use Data Space assignment + permission set access control

**Speaker Notes:** This is an area where candidates sometimes get confused because they try to apply standard Salesforce CRM sharing concepts (like sharing rules, OWD, and role hierarchy) directly to Data Cloud objects. The reality is that Data Cloud has its own access control model based on Data Spaces and permission sets. The standard Salesforce sharing model applies to the Salesforce objects that WRAP the Data Cloud UI (like the Segment object in the CRM layer), but DMO data itself is governed by Data Spaces. The exam may test whether you can apply sharing rules to control access to a specific customer's DMO records — the answer is that you use Data Spaces, not traditional sharing rules.

---

### Slide 8: Governance Best Practices
**Visual:**
```
  DATA GOVERNANCE CHECKLIST
  ──────────────────────────────────────────────────────────
  ✅  Create separate Data Spaces for dev/test and production
      (prevents accidental activation of test segments)

  ✅  Apply least-privilege permission sets
      (don't assign Data Cloud Admin to all users)

  ✅  Assign PII-containing Data Streams to restricted
      Data Spaces accessible only to authorized roles

  ✅  Restrict Activation Target creation to Data Cloud Admin
      (unauthorized activation = data egress risk)

  ✅  Review and audit permission set assignments quarterly
      (departures, role changes may leave excess permissions)

  ✅  Document Data Space design decisions with business
      justification for each space created
```

**Content:**
- ✅ Use separate Data Spaces for development/testing and production data
- ✅ Apply least-privilege permission sets — don't assign Admin to all users
- ✅ Assign PII-containing Data Streams to restricted Data Spaces accessible only to authorized roles
- ✅ Restrict Activation Target creation and management to Data Cloud Admin users
- ✅ Review and audit permission set assignments quarterly
- ✅ Document Data Space design decisions with business justification for each space

**Speaker Notes:** Governance best practices appear in exam scenarios as "what should the consultant recommend?" questions. The least-privilege principle is most important — only give Data Cloud Admin access to those who truly need it. Data Spaces for dev/test vs. production is a safeguard against accidentally activating test segments to real customer channels. Restricting Activation Target management to Admins prevents unauthorized data egress. These practices collectively implement a responsible data governance model that protects both the organization and its customers.

---

## Recording Script

Welcome to Lecture 09. We're continuing Section 3 with Data Cloud governance and access control — how you control who can see and work with what in Data Cloud.

Data Cloud governance operates at multiple levels. At the foundational level, standard Salesforce profile permissions control whether a user can access Data Cloud features at all. On top of that, Data Cloud-specific permission sets grant access to specific functionality. And at a higher level, Data Spaces provide logical data partitioning within a single Data Cloud instance.

Let's start with Data Spaces. Think of them as folders within Data Cloud. You might have a "Marketing" Data Space for all your marketing-related data streams, segments, and activation targets, and a "Service Analytics" Data Space for service-related data. Users are granted access to specific Data Spaces, so a marketing analyst only sees marketing objects. Importantly, Data Spaces are logical, not physical — the data is all in the same Data Cloud instance, but access boundaries are enforced.

Permission sets for Data Cloud map to roles. The **Data Cloud Admin** has full configuration access. The **Data Cloud Data Aware Specialist** can build segments and Calculated Insights but can't configure Data Streams. The Marketing Specialist has read access for reporting. These should be assigned based on actual job responsibilities — not everyone needs admin.

For specific objects: Data Streams can be assigned to Data Spaces to restrict who can see the underlying source data. Segments have owner-based access and can be shared. Activation Targets should be Admin-only — creating new activation connections is a high-privilege action that can result in customer data going to external systems.

The troubleshooting pattern for access issues is: check the profile first (can they access Data Cloud at all?), then check the permission sets (do they have the right Data Cloud functionality permission?), then check Data Spaces (can they see the specific objects they're trying to work with?).

In Lecture 10, we look at monitoring — how to track ingestion jobs, identify errors, and maintain data quality. See you there.

---

## Exam Tips

- Data Spaces are **logical** partitions — they control access visibility but do NOT provide physical data isolation
- The **Data Cloud Admin** permission set grants full configuration access; **Data Aware Specialist** is for segment/CI builders
- Users without access to a Data Space **cannot see** segments, Data Streams, or Activation Targets assigned to that space
- Activation Target creation should be restricted to **Data Cloud Admin** users — unauthorized activation can cause data to leave the org
- Troubleshoot access issues in this order: Profile → Permission Sets → Data Space assignment

---

## Lecture Summary

Data Cloud governance is implemented through three layers: Salesforce profile permissions (foundation access), Data Cloud permission sets (functional access), and Data Spaces (data partitioning and visibility control). Data Spaces logically partition objects within a Data Cloud instance, allowing different teams or purposes to have isolated views without physical data separation. The four key permission sets are Data Cloud Admin (full access), Data Aware Specialist (segments and CIs), Marketing Specialist (read access), and Marketing Cloud integration. Access to individual Data Streams, Segments, and Activation Targets is controlled through Data Space assignment. Best practices include least-privilege permission set assignment, separate Data Spaces for development and production, and restricting Activation Target management to admin users.

---

## Mini Quiz

**Question 1:** A marketing analyst needs to create and manage segments in Data Cloud but should not have access to configure Data Streams or modify system settings. Which permission set should be assigned?

A) Data Cloud Admin  
B) Data Cloud Data Aware Specialist  
C) Data Cloud Marketing Specialist  
D) System Administrator  

**Answer: B**
The Data Cloud Data Aware Specialist permission set grants the ability to create and manage segments, Calculated Insights, and Activation Targets, without providing access to Data Stream configuration or system-level settings. The Admin permission set would give too much access, and the Marketing Specialist is typically read-only.

---

**Question 2:** An organization has both a Marketing team and a Finance Analytics team using Data Cloud. Finance data contains sensitive revenue information that Marketing should not see. What is the recommended governance approach?

A) Create separate Salesforce orgs for Marketing and Finance  
B) Create separate Data Spaces for Marketing and Finance, and assign Data Streams and users accordingly  
C) Use Salesforce sharing rules to restrict Finance data to the Finance role  
D) Encrypt Finance Data Streams so Marketing users cannot read the values  

**Answer: B**
Data Spaces provide logical data isolation within a single Data Cloud instance. By creating a Finance Data Space and assigning sensitive Finance Data Streams to it, and only granting Finance team members access to that Data Space, Marketing users will not be able to see or access Finance data. This is the correct Data Cloud governance tool for this requirement.

---

**Question 3:** A new Data Cloud user has been assigned the Data Aware Specialist permission set but reports they cannot see any segments in the Segment Builder. What is the most likely cause?

A) The Data Aware Specialist permission set does not allow viewing segments  
B) The user's profile does not have access to the Data Cloud app  
C) The segments are in a Data Space the user has not been granted access to  
D) The user must first complete Data Cloud training before segment access is enabled  

**Answer: C**
The Data Aware Specialist permission set grants the capability to work with segments, but if those segments are assigned to a Data Space the user hasn't been granted access to, they won't see them. After confirming the permission set is assigned correctly and the profile has app access, the next check is whether the user has been granted access to the relevant Data Space.
