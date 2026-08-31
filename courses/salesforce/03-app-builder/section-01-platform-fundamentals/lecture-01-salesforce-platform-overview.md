# L01: Salesforce Platform Overview

## 🎯 Learning Objectives
- Explain what multi-tenant architecture means for app builders and why it matters
- Distinguish between declarative and programmatic development approaches
- Identify the core declarative tools available to app builders
- Describe when to use declarative tools versus code

---

## 📊 SLIDES

### Slide 1: What Is the Salesforce Platform?
**Visual:** A layered pyramid diagram — bottom layer labeled "Infrastructure (Salesforce manages)", middle layer labeled "Platform (Metadata, APIs, Runtime)", top layer labeled "Apps (Your custom apps + AppExchange apps)"
**Content:**
- Salesforce is a **Platform as a Service (PaaS)** — not just a CRM
- You build apps on top of a shared, managed infrastructure
- Salesforce handles servers, security patches, uptime, and upgrades
- You focus entirely on building the business solution
**Speaker Notes:** Most people think of Salesforce as CRM software, but it's really a platform for building any type of business application. When you build on Salesforce, you're renting space on a massive, managed infrastructure — you never worry about servers, database maintenance, or security patching. Your job is to design and build the solution.

### Slide 2: Multi-Tenant Architecture — What It Means for You
**Visual:** Diagram showing one large database with multiple org "containers" labeled Org A, Org B, Org C — all sharing the same infrastructure but isolated from each other. Arrows point to "Metadata" layer sitting above the shared data layer.
**Content:**
- **Multi-tenant:** Many customers share the same infrastructure
- Each org is **logically isolated** — your data is never visible to another org
- Salesforce uses **metadata** to make each org behave differently
- You customize through metadata, not code changes to the platform itself
- **Implication:** Changes one customer makes cannot break another customer's org
**Speaker Notes:** Multi-tenancy is fundamental to understanding why Salesforce works the way it does. You're not running your own server — you're a tenant in a shared building. Salesforce keeps the building running; you decorate your own unit. This is also why governor limits exist — to make sure one tenant can't hog shared resources and slow everyone else down.

### Slide 3: Metadata-Driven Development
**Visual:** Two-column table. Left column: "Metadata (declarative configuration)" with examples — Object definitions, Field definitions, Page layouts, Flows, Validation rules. Right column: "Data (actual records)" with examples — Account records, Contact records, Opportunity records.
**Content:**
- **Metadata** = the configuration of your org (what fields exist, what rules run)
- **Data** = the actual records your users enter
- When you create a custom field, you're creating metadata — not changing application code
- Metadata can be moved between environments using change sets or Salesforce DX
- This is what makes Salesforce **declarative** — you configure, not code
**Speaker Notes:** Here's the key insight: when you build in Salesforce, you're creating metadata — instructions that tell the platform how to behave. Creating a custom object doesn't write Java code; it creates a metadata record that says "treat this like a database table." This metadata-driven approach is why non-programmers can build powerful apps on Salesforce.

### Slide 4: Declarative vs. Programmatic Development
**Visual:** Decision flowchart. Start: "Does standard functionality cover the need?" → Yes → "Use standard features." → No → "Can a declarative tool do it?" → Yes → "Use Flow, Formula, Validation Rule, etc." → No → "Use Apex, LWC, or API."
**Content:**
- **Declarative (no-code/low-code):** Flow, Formulas, Validation Rules, Object Manager, Lightning App Builder
- **Programmatic (code):** Apex (Salesforce's Java-like language), Lightning Web Components (JavaScript), REST/SOAP APIs
- Salesforce's official guidance: **declarative first**, code only when necessary
- Declarative is easier to maintain, upgrade-safe, and accessible to non-developers
- As an App Builder, your primary tools are **declarative**
**Speaker Notes:** The Platform App Builder exam tests your knowledge of declarative tools almost exclusively. You won't write Apex on this exam. But you need to understand the boundary — when declarative tools can solve a problem, and when you'd need to hand off to a developer. Knowing that boundary is itself a testable skill.

### Slide 5: Core Declarative Tools for App Builders
**Visual:** Icon grid showing six tools: Object Manager (database icon), Flow Builder (flow chart icon), Lightning App Builder (page layout icon), Validation Rules (checkmark icon), Formula Fields (formula fx icon), AppExchange (store icon).
**Content:**
- **Object Manager:** Create and manage custom objects, fields, page layouts, record types
- **Flow Builder:** Automate business processes without code — the most powerful declarative tool
- **Lightning App Builder:** Build custom Lightning pages by dragging and dropping components
- **Validation Rules:** Enforce data quality rules on record save
- **Formula Fields:** Calculate values dynamically from other field data
- **AppExchange:** Install pre-built apps and components from Salesforce's marketplace
**Speaker Notes:** These six tools represent the core of what you'll use as an app builder. Flow Builder is particularly important — it's been expanding rapidly and has largely replaced older tools like Process Builder and Workflow Rules. On the exam, whenever you see an automation scenario, think Flow first.

### Slide 6: Governor Limits — Why They Exist
**Visual:** Analogy graphic showing a shared apartment building water meter — if one tenant runs the shower for 24 hours, other tenants run out of water. Salesforce logo replaces the water meter. Table of sample limits: SOQL queries per transaction (100), DML statements per transaction (150), CPU time per transaction (10,000ms).
**Content:**
- Governor limits are **runtime limits** enforced on each transaction
- They exist to prevent one tenant from consuming all shared resources
- As a declarative app builder, limits matter most when: using many lookups in Flow, triggering automation on bulk records
- Key limits to know: 100 SOQL queries per transaction, 150 DML operations per transaction
- Exceeding limits = runtime error — design your apps with limits in mind
**Speaker Notes:** You don't need to memorize every governor limit for the App Builder exam, but you need to understand why they exist and that they can be hit by declarative tools. If a Flow queries a related record in a loop, it will hit the SOQL query limit. Good app design avoids patterns that hit limits. This is a judgment question the exam loves to test.

### Slide 7: Salesforce Releases — Impact on App Builders
**Visual:** Calendar graphic showing three yearly releases labeled "Spring," "Summer," and "Winter" with arrows showing "New declarative features added" at each release.
**Content:**
- Salesforce releases **three major updates per year** (Spring, Summer, Winter)
- Updates are automatic — no action required from app builders
- New declarative features are added in every release (Flow gets new actions, new formula functions, etc.)
- App Builder certification requires **annual maintenance** to stay current
- **Sandbox Preview:** You can opt a sandbox into an upcoming release 4–6 weeks early to test
**Speaker Notes:** One of the benefits of multi-tenancy is that you get continuous improvements without paying for upgrades. The downside is that changes happen on Salesforce's schedule, not yours. Sandbox preview is your safety net — always test major releases in sandbox before they hit your production org. Your App Builder certification needs annual maintenance, so staying current is part of the job.

### Slide 8: App Builder's Role in the Development Lifecycle
**Visual:** Linear lifecycle diagram: Business Requirements → Data Model Design → Security Design → Automation Design → UI Design → Testing (Sandbox) → Deployment → Monitor & Iterate.
**Content:**
- App Builders bridge business requirements and technical implementation
- You own the **design phase** — data model, security, automation, UI
- Testing happens in **sandbox** before any changes reach production
- Deployment moves configuration (metadata) from sandbox to production
- The exam tests all phases of this lifecycle
**Speaker Notes:** The App Builder role spans the entire build lifecycle. You're not just clicking buttons — you're making design decisions that affect how well the app scales, how secure it is, and how maintainable it is. The exam scenarios will test whether you can look at a business requirement and choose the right design approach. Keep this lifecycle in mind as we move through every section of this course.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 01 — Salesforce Platform Overview. This lecture sets the foundation for everything we're going to build on throughout this course. Even if you've been using Salesforce for a while, take the time to really understand these concepts, because they explain *why* the platform works the way it does.

Let's start with the big picture. Salesforce is not just CRM software — it's a Platform as a Service. When you build on Salesforce, you're building on top of a massive, managed infrastructure that Salesforce operates for you. Look at Slide 1. Think of it as three layers: at the bottom, Salesforce manages the infrastructure — servers, databases, networking, security patches. In the middle is the platform itself — the metadata engine, APIs, and runtime. At the top are apps, both yours and third-party apps from the AppExchange. You only ever touch that top layer.

Now, Slide 2 — this is really important. Salesforce is a **multi-tenant** platform. That means thousands of companies are all running on the same infrastructure at the same time. Your org is logically isolated — no one else can see your data — but you're sharing computing resources with everyone else. Why does this matter? Two reasons. First, it's why Salesforce can offer such a cost-effective platform — shared infrastructure is cheaper to operate. Second, it's why **governor limits exist**. We'll talk about those in a moment.

Slide 3 introduces the concept of **metadata-driven development**. This is the key to understanding how Salesforce customization works. When you create a custom object, you're not writing database code. You're creating a metadata record that tells the Salesforce platform "treat this like a table, give it these fields, enforce these rules." Your custom configuration — objects, fields, flows, page layouts — is all stored as metadata. The actual records your users create? That's data. Keeping these two concepts separate in your mind will help you throughout the entire exam.

Slide 4 covers the declarative versus programmatic divide. Salesforce has a formal guidance: use declarative tools first, and only reach for code when the declarative options genuinely can't solve the problem. As a Platform App Builder, your toolbox is almost entirely declarative — Flow, formulas, validation rules, the Lightning App Builder. You won't be writing Apex. But you do need to know *when* to recommend code — that's a judgment skill the exam tests.

On Slide 5, I've listed the six core declarative tools you'll use throughout this course. Object Manager is your starting point for building the data model. Flow Builder is the most powerful tool in the declarative toolbox. Lightning App Builder is how you construct user interfaces. We'll spend dedicated lectures on each of these.

Slide 6 — governor limits. Because Salesforce is multi-tenant, it enforces limits on every transaction to prevent any single customer from hogging shared resources. As an app builder, the two you'll encounter most are the SOQL query limit — 100 per transaction — and the DML limit — 150 operations per transaction. Well-designed declarative apps respect these limits. Badly designed ones hit them and cause errors for your users.

Finally, Slides 7 and 8. Salesforce releases three major updates per year, and they're automatic. Use sandbox preview to test upcoming releases before they hit production. And always think about the full app builder lifecycle — from data model design all the way through deployment. The exam tests every phase.

That's your overview. In the next lecture, we dive into data modeling fundamentals — the backbone of every Salesforce app you'll ever build.

---

## 🔔 EXAM TIPS
- **Multi-tenancy and governor limits:** Exam scenarios will describe automation that runs in a loop. Recognize that querying or updating records inside a loop hits governor limits — this is a design flaw, not a feature.
- **Declarative first:** If an exam question asks "what is the best approach," a declarative answer (Flow, formula, validation rule) will nearly always be preferred over Apex unless the scenario explicitly requires code logic that declarative tools cannot handle.
- **Metadata vs. data:** The exam may ask what change sets and deployment tools move between environments. The answer is **metadata** (configuration), not data (records). Data migration requires separate data tools.
- **Three Salesforce releases per year:** Remember Spring, Summer, Winter. If asked about update frequency, the answer is three times per year, not monthly or annually.

---

## ✅ LECTURE SUMMARY
- Salesforce is a multi-tenant PaaS — you build on shared infrastructure that Salesforce manages
- Customizations are stored as metadata, which is separate from the actual data records in your org
- App builders primarily use declarative tools (Flow, Formula, Object Manager, Lightning App Builder) rather than code
- Governor limits exist because of multi-tenancy — one tenant cannot consume all shared resources
- The Platform App Builder lifecycle spans data model design, security design, automation, UI, testing, and deployment

---

## ❓ MINI QUIZ

**Q1:** A company wants to automate a business process that updates related records and sends email notifications when an Opportunity is marked Closed Won. Which approach should an App Builder use?
- A) Write an Apex trigger
- B) Build a record-triggered Flow
- C) Create a custom Visualforce page
- D) Use a SOQL query in the developer console

**Answer:** B — Flow Builder is the correct declarative-first approach. A record-triggered Flow can update related records and send emails without any code, which aligns with the Platform App Builder's toolset.

**Q2:** An app builder creates a custom object and adds 10 custom fields to it. What has the app builder actually created in Salesforce?
- A) New database tables and columns in the Salesforce database schema
- B) Metadata that tells the Salesforce platform how to structure and behave
- C) Apex classes that define the object behavior
- D) JavaScript components for the Lightning UI

**Answer:** B — Custom objects and fields are stored as metadata. The app builder is not directly creating database tables or writing code; they're creating configuration that the metadata-driven platform interprets.

**Q3:** A Flow is designed to query a related Contact record inside a loop that processes 200 Opportunity records. What problem will this cause?
- A) The Flow will complete successfully but run slowly
- B) The Flow will fail because Flow cannot query Contact records
- C) The Flow will exceed the SOQL governor limit of 100 queries per transaction
- D) The Flow will create duplicate records for each iteration

**Answer:** C — Querying inside a loop causes one SOQL query per iteration. With 200 iterations, the Flow will exceed the 100 SOQL queries per transaction governor limit and fail with a runtime error.
