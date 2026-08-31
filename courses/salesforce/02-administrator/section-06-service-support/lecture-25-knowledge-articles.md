# L25: Knowledge Articles

## 🎯 Learning Objectives
- Set up Salesforce Knowledge and understand article record types vs data categories
- Describe the article lifecycle from Draft through Published to Archived
- Explain Lightning Knowledge versus Classic Knowledge and article use in case management

## 📊 SLIDES

### Slide 1: What Is Salesforce Knowledge?
**Visual:** Knowledge base diagram showing agents, customers, and partners all accessing articles from a central repository
**Content:**
- Salesforce Knowledge is a built-in knowledge base for creating, managing, and sharing articles
- Use cases: FAQ library, troubleshooting guides, product documentation, internal procedures
- Articles are accessible to agents in Case records, in Self-Service portals, and via Lightning Experience
- Requires Knowledge license/feature enabled in the org
- Setup path: Setup → Knowledge Settings → Enable Salesforce Knowledge
- Lightning Knowledge (current, recommended) vs Classic Knowledge (legacy)
**Speaker Notes:** Knowledge is one of the most impactful Service Cloud features. Instead of every agent re-solving the same problem from scratch, articles capture proven solutions and make them reusable. The Admin exam tests how to set up Knowledge, manage article visibility, and understand the article lifecycle.

### Slide 2: Lightning Knowledge vs Classic Knowledge
**Visual:** Comparison table: Lightning Knowledge (one Article object, Record Types) vs Classic Knowledge (separate Article Type objects)
**Content:**
- **Classic Knowledge:** Multiple Article Type objects (each type is a separate object); complex setup; legacy
- **Lightning Knowledge:** Single "Knowledge" object with Record Types for different article categories; simpler and modern
- Lightning Knowledge enables: multiple-column layouts, related lists, CRM record linking, standard object features
- Migration: Classic to Lightning Knowledge migration tool available in Setup
- New orgs default to Lightning Knowledge
- Article fields are standard field types: Rich Text, Text, Checkbox, URL, etc.
**Speaker Notes:** The exam may reference both but favors Lightning Knowledge concepts. The key difference: Classic Knowledge uses separate Article Type objects, making each type behave like a different object. Lightning Knowledge uses one Article object with Record Types — a model familiar to any Salesforce admin.

### Slide 3: Article Record Types
**Visual:** Record Type selector showing options: FAQ, How-To, Solution, Reference Guide
**Content:**
- Record Types in Lightning Knowledge differentiate article categories
- Examples: FAQ (question/answer format), How-To (step-by-step), Known Issue (bug documentation), Reference (product specs)
- Each Record Type can have its own page layout, fields, and validation rules
- Record Types control what agents see when creating a new article
- Agents must have the appropriate Record Type assigned to their profile to create that type
- Setup: Object Manager → Knowledge → Record Types
**Speaker Notes:** Record Types for Knowledge work exactly like Record Types on any other Salesforce object. They let you create different structures for different kinds of articles. A How-To article needs different fields than a Known Issue article. Using Record Types keeps your knowledge base organized and consistent.

### Slide 4: Data Categories for Visibility
**Visual:** Tree diagram showing Data Category Groups (Product, Region) with categories branching beneath each (Product A, Product B; North America, Europe)
**Content:**
- Data Categories control which articles are visible to which users and channels
- Structure: Category Group → Categories → Subcategories (up to 5 levels)
- Setup path: Setup → Data Categories
- Articles are tagged with one or more Data Categories
- Visibility rules: users see articles in categories they have visibility access to
- Channels: Data Categories also determine article visibility by channel (App, Portals, Public Sites)
**Speaker Notes:** Data Categories serve a dual purpose: they're an organizational taxonomy AND a visibility control mechanism. An agent in the North America region might only see articles tagged with the "North America" category. This lets you maintain one knowledge base while showing different content to different audiences.

### Slide 5: Article Lifecycle
**Visual:** Status flow: Draft → In Review → Published → Archived (with arrows showing transitions and possible return paths)
**Content:**
- **Draft:** Article is being written; not visible to end users
- **In Review / Review:** Article has been submitted for review; not yet published
- **Published:** Article is live and visible to the configured audience
- **Archived:** Article has been removed from publication; retained for historical reference
- Authors submit drafts for review; reviewers/publishers approve and publish
- Published articles can be "Edited" — this creates a new Draft version while the original stays published
- Only one version of an article is Published at a time
**Speaker Notes:** The lifecycle ensures content quality before publication. The important nuance for the exam: when you edit a published article, Salesforce creates a new DRAFT version. The original published version remains live until you publish the new draft. This prevents accidental removal of working content during editing.

### Slide 6: Article Actions & Management
**Visual:** Article record action menu showing: Submit for Review, Publish, Archive, Restore, Delete options
**Content:**
- **Promote to Knowledge Base:** Suggests articles from case solutions
- **Promote Solution:** Converts a Case Solution to a Knowledge article (Classic-era feature)
- **Archive:** Moves a Published article to Archived status (removes from searches/portals)
- **Restore:** Moves an Archived article back to Draft status
- **Delete:** Permanently removes the article (typically only available for Draft or Archived)
- **Article Version history:** Previous published versions are retained for auditing
- Article author, last modified, and Published Date are tracked
**Speaker Notes:** Archiving is the clean way to remove an outdated article from active use without permanently deleting it. You archive first, which removes it from user-facing search, and the article can be restored to Draft if it needs to be updated and republished. Permanent deletion is typically reserved for junk or accidental drafts.

### Slide 7: Knowledge in Case Management
**Visual:** Case record showing Knowledge search sidebar with suggested articles and "Attach to Case" button
**Content:**
- Agents can search the Knowledge base directly from a Case record
- Articles can be attached to a Case (tracked in the Knowledge Articles related list)
- Article attachment to a case helps track which articles were used to resolve issues
- Suggested Articles: Salesforce uses the case subject/description to suggest relevant articles automatically
- Agents can create new articles directly from cases ("Submit Article" action)
- Customer Communities: Knowledge articles can be published to self-service portals
**Speaker Notes:** The Case-Knowledge integration is the primary use case for agents. Instead of opening a separate tab and searching, agents get article suggestions right on the case. When an agent finds the right article, they can view it, attach it to the case for tracking, or even share the article URL with the customer via email.

### Slide 8: Knowledge Permissions & Channels
**Visual:** Table showing four channels: Internal App, Customer Community, Partner Community, Public Knowledge Base with checkboxes for visibility
**Content:**
- Article Visibility is controlled per channel during publication
- Channels: **Internal App** (agents in Salesforce), **Customer Community** (logged-in customers), **Partner Community** (partners), **Public Site** (anyone on the web)
- User Permissions for Knowledge: Knowledge User (read/search), Article Manager (create/edit/publish/archive)
- "Manage Articles" permission required to publish and archive articles
- Data Category visibility set per profile/user in Setup → Data Category Visibility
- Einstein Article Recommendations: AI-powered article suggestions on cases
**Speaker Notes:** Channel visibility allows the same article to be shared across different audiences simultaneously. A troubleshooting guide can be visible internally to agents, to logged-in customers via Community, AND on a public FAQ site — all from one article record. Admins control which channels each article is published to when approving it.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 25 — Knowledge Articles. Salesforce Knowledge is the platform's built-in knowledge base, and it's a cornerstone of any mature service operation. Let's cover what you need to know for the Admin exam.

Knowledge is all about capturing solutions and making them reusable. Instead of every agent spending 30 minutes figuring out how to solve the same product issue, you write it up once as a Knowledge article, and every agent can access it instantly. Articles can also be published to customer-facing portals so customers can self-serve.

There are two versions of Knowledge: Classic Knowledge and Lightning Knowledge. New orgs use Lightning Knowledge, which is the modern approach. In Lightning Knowledge, all articles are stored in a single Knowledge object, and you use Record Types to differentiate article categories — just like you'd use Record Types on any other Salesforce object. Classic Knowledge used separate Article Type objects, which was more complex. For the exam, understand both but focus on Lightning Knowledge.

Record Types in Lightning Knowledge let you create different article structures. A "How-To" article might have fields for numbered steps and screenshots. An "FAQ" article might have a Question field and an Answer field. A "Known Issue" article might have a Workaround field and a Fix Date. Each Record Type can have its own page layout and fields.

Data Categories are both an organizational tool and a visibility mechanism. You create Category Groups — like "Product" or "Region" — and then create categories within them. Articles are tagged with relevant categories. Then you set Data Category Visibility rules by profile, so agents only see articles relevant to their role or geography.

The article lifecycle is: Draft → Review → Published → Archived. An author writes the Draft. It goes to Review for quality checking. When approved, it's Published and becomes visible. When it's outdated, it gets Archived — which removes it from searches but doesn't delete it. Archived articles can be restored to Draft for updating and republishing.

Here's an important nuance: if you need to edit a Published article, you don't edit it directly. Salesforce creates a new Draft version of the article. The original published version stays live while you work on the update. When the new draft is published, it replaces the old published version. This prevents disruption to agents using the article during your editing process.

From a case management perspective, agents get Knowledge article suggestions directly on the Case record. Salesforce looks at the case subject and description and recommends relevant articles from the knowledge base. Agents can attach articles to cases for tracking, or share article links with customers. Agents can also create new articles directly from case solutions.

Articles can be published across multiple channels simultaneously: Internal (agents), Customer Community (logged-in customers), Partner Community (partners), and Public Sites (anonymous web visitors). One article can serve all four audiences at once with appropriate visibility controls.

For permissions: users need the Knowledge User checkbox on their profile or user record to search articles. Publishing, archiving, and managing articles requires the "Manage Articles" permission — typically given to knowledge managers and senior agents.

That's Salesforce Knowledge covered. Next, we move to Activities, Tasks, and Events.

## 🔔 EXAM TIPS
- **Lightning Knowledge = one object + Record Types:** Classic Knowledge used multiple Article Type objects — they're fundamentally different architectures.
- **Editing a Published article creates a new Draft:** The published version stays live during editing.
- **Data Categories serve dual purpose:** Organization AND visibility control.
- **Article lifecycle: Draft → Review → Published → Archived:** Archived articles are NOT deleted — they can be restored.
- **Four channels for publishing:** Internal App, Customer Community, Partner Community, Public Site — one article can cover all four.
- **Manage Articles permission required to publish:** The Knowledge User checkbox enables search/read; Manage Articles enables creating/publishing.

## ✅ LECTURE SUMMARY
- Salesforce Knowledge is a built-in knowledge base for articles accessible to agents, customers, and partners
- Lightning Knowledge uses one Knowledge object with Record Types; Classic Knowledge used separate Article Type objects
- Data Categories control article organization and visibility by profile and channel
- Article lifecycle: Draft → In Review → Published → Archived; editing a published article creates a new Draft version
- Articles are attached to Cases for tracking; Suggested Articles feature provides AI-powered recommendations on Case records
- Four publication channels: Internal App, Customer Community, Partner Community, Public Site
- Knowledge User permission enables article search; Manage Articles permission enables publishing and archiving

## ❓ MINI QUIZ

**Q1:** A support manager wants agents to see suggested Knowledge articles automatically when viewing a Case record without manually searching. Which feature provides this?
- A) Data Categories assigned to the Case record type
- B) Suggested Articles, which uses the case subject and description to recommend relevant articles
- C) A Workflow Rule that populates the Knowledge lookup field based on case priority
- D) Article Manager permission assigned to agents
**Answer:** B — Suggested Articles is a built-in Knowledge feature that automatically recommends articles based on the case subject and description. Agents see these suggestions on the case record without any manual search, improving resolution speed.

**Q2:** An administrator in a Lightning Knowledge org needs to create two article structures: one for FAQs (with Question and Answer fields) and one for Troubleshooting Guides (with Steps and Resolution fields). What is the correct approach?
- A) Create two separate Knowledge objects using Object Manager
- B) Create two Article Types in Classic Knowledge Settings
- C) Create two Record Types on the Knowledge object, each with its own page layout
- D) Use Data Category Groups to differentiate FAQ and Troubleshooting articles
**Answer:** C — In Lightning Knowledge, Record Types on the single Knowledge object differentiate article structures. Each Record Type can have its own page layout with different fields. This is the standard Lightning Knowledge approach.

**Q3:** A published Knowledge article contains outdated information. An administrator edits the article. What happens to the currently published version while the edit is in progress?
- A) The article is immediately unpublished and shows "In Review" to all users during editing
- B) The article is automatically archived when editing begins
- C) Salesforce creates a new Draft version; the original published version remains visible and accessible until the new draft is published
- D) The article is locked and cannot be viewed by agents until editing is complete
**Answer:** C — Editing a Published Knowledge article creates a new Draft version of the article. The currently published version remains live and accessible to agents and customers throughout the editing process, ensuring continuity of service.
