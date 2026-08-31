# L19: Accounts & Contacts

## 🎯 Learning Objectives
- Distinguish between Business Accounts and Person Accounts and explain when each is used
- Configure Account Hierarchy using the Parent Account field
- Explain Contact-to-Multiple-Accounts (related contacts) and Contact Roles on Opportunities

## 📊 SLIDES

### Slide 1: The Account Object
**Visual:** Account record showing standard fields: Account Name, Type, Industry, Rating, Annual Revenue, Phone, Website, Billing Address
**Content:**
- Account is the central object in Salesforce — virtually every other object relates to it
- Represents a company, organization, or (with Person Accounts) an individual consumer
- Key standard fields: Account Name, Type, Industry, Rating, Annual Revenue, Number of Employees, Billing/Shipping Address
- Account Type picklist: Prospect, Customer - Direct, Customer - Channel, Partner, Competitor, Other
- Account Rating picklist: Hot, Warm, Cold
**Speaker Notes:** The Account object is sometimes called the "hub" of Salesforce CRM because Contacts, Opportunities, Cases, and Activities all relate back to it. Admins must understand which standard fields exist, what they're used for, and how sharing rules interact with Account ownership.

### Slide 2: Business Accounts vs Person Accounts
**Visual:** Split-screen showing Business Account (Company) on the left and Person Account (Individual) on the right
**Content:**
- **Business Account (default):** Represents a company or organization; Contacts are separate records linked to the account
- **Person Account:** Combines Account + Contact into one record; used in B2C industries (financial services, healthcare, retail)
- Person Accounts are enabled in Setup — once enabled, they cannot be disabled
- Person Accounts have their own record type and icon (a person silhouette vs building)
- Person Accounts behave like Contacts in some ways (e.g., they can be Campaign Members)
**Speaker Notes:** The exam often tests whether candidates know that Person Accounts are irreversible once enabled. They're ideal for B2C scenarios where customers are individuals, not companies. Admins must request Salesforce Support to enable Person Accounts — it is not a self-service toggle.

### Slide 3: Account Hierarchy
**Visual:** Tree diagram showing Parent Account (Acme Corp) with two child accounts (Acme West, Acme East) beneath it
**Content:**
- Account Hierarchy is established via the Parent Account lookup field
- Allows modeling of corporate parent-subsidiary relationships
- "View Hierarchy" button appears on Account records with a parent or children
- Roll-up Summary Fields can aggregate data from child accounts (e.g., total revenue) — but only if using Master-Detail relationships
- Hierarchy does not restrict data sharing by default — children don't automatically share data with the parent
**Speaker Notes:** Account Hierarchy is a structural feature, not an access-control feature. Visibility is still controlled by OWD, roles, and sharing rules. The View Hierarchy button simply provides a visual tree of related accounts for navigation.

### Slide 4: Contact Object & Account Relationship
**Visual:** Contact record showing fields: First/Last Name, Account Name, Title, Email, Phone, Mailing Address, Reports To
**Content:**
- Contact represents a person — an employee, stakeholder, or decision-maker at an Account
- The Account Name field on Contact is a lookup to the Account object (primary account)
- Reports To field links to another Contact (useful for org chart mapping)
- A contact can only have ONE primary account (the Account Name field)
- Deleting an Account does NOT automatically delete Contacts (they become orphaned contacts)
**Speaker Notes:** Contacts are the people within accounts. The key distinction for the exam: deleting an account does not cascade-delete its contacts — they remain in the system as unattached (orphaned) contacts. However, deleting an account DOES delete related Opportunities, Cases, and Activities.

### Slide 5: Contacts to Multiple Accounts
**Visual:** Diagram showing one Contact linked to three different Accounts with "Indirect" relationship indicators
**Content:**
- Feature: Contacts to Multiple Accounts (also called Related Contacts)
- One Contact can be related to multiple Accounts — one primary + many indirect
- Enabled at: Setup → Account Settings → Allow users to relate a contact to multiple accounts
- Indirect relationships appear in the Related Contacts related list on Account records
- The indirect relationship stores a Relationship field (e.g., "Executive Sponsor," "Consultant")
- Does not affect who "owns" the contact — the primary Account Name field remains
**Speaker Notes:** This feature is perfect for consultants or executives who work with multiple companies. The Admin exam tests whether you know how to enable it and that it creates an indirect relationship — the Contact's primary account doesn't change.

### Slide 6: Contact Roles on Opportunities
**Visual:** Opportunity record showing Contact Roles related list with Role column (Decision Maker, Evaluator, Economic Buyer)
**Content:**
- Contact Roles link Contacts to Opportunities with a designated role
- Not the same as sharing — it's a relational indicator for sales insight
- Common roles: Decision Maker, Executive Sponsor, Economic Buyer, Evaluator, Technical Buyer, Champion, Other
- One Contact Role can be flagged as the Primary contact on the opportunity
- Contact Roles can be marked required in Opportunity Path or validation rules
- Setup path: Setup → Opportunity Contact Roles
**Speaker Notes:** Contact Roles are often overlooked but are frequently tested. They don't grant record access — they simply document WHO at the account is involved in a deal and in WHAT capacity. The Primary flag helps sales teams identify their main point of contact for each opportunity.

### Slide 7: Account Sharing & Implications
**Visual:** Flowchart showing Account OWD → Role Hierarchy → Sharing Rules → Manual Sharing
**Content:**
- Account OWD settings control default visibility (Private, Public Read Only, Public Read/Write)
- When Account OWD is Private, users can only see accounts they own or are granted access to
- Contacts, Opportunities, and Cases follow Account's sharing — if you can see the Account, you can typically see related records
- "Grant Access Using Hierarchies" must be enabled for role hierarchy to cascade account access
- Account Teams allow specific users to be added directly to an account for access
**Speaker Notes:** Account sharing has a cascade effect. If Account OWD is Private, a user who gets access to an Account (through a sharing rule or team) also gets access to the account's Contacts and Opportunities. This is why Account is the central record — sharing flows outward from it.

### Slide 8: Key Admin Configuration Points
**Visual:** Checklist of admin actions for Account and Contact setup
**Content:**
- Enable Person Accounts: Setup → Account Settings → Enable Person Accounts (irreversible)
- Enable Contacts to Multiple Accounts: Setup → Account Settings
- Configure Account Teams: Setup → Account Teams → Enable Account Teams
- Contact Roles picklist: Setup → Opportunity Contact Roles
- Account and Contact Page Layouts: Object Manager → Account/Contact → Page Layouts
- Validation Rules and Required Fields: Object Manager → Account/Contact → Validation Rules
**Speaker Notes:** For the exam, focus on where these features are enabled and what their consequences are. Person Accounts being irreversible is a classic gotcha. Account Teams are separate from Opportunity Teams — both exist and are configured differently.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 19 — Accounts and Contacts. These two objects form the foundation of every Salesforce CRM implementation, and understanding their nuances will serve you well on the Admin exam and in real-world admin work.

Let's start with Accounts. The Account object represents an organization — a company, an institution, or any entity you do business with. It's the hub of Salesforce. Almost every other object — Contacts, Opportunities, Cases, Activities — relates back to an Account. The standard Account fields you need to know include Account Name, Type, Industry, Rating, Annual Revenue, and Number of Employees. The Type field has values like Prospect, Customer, Partner, and Competitor. Rating has Hot, Warm, and Cold.

Now here's an important distinction: Business Accounts versus Person Accounts. By default, Salesforce uses Business Accounts — the Account is the company, and Contacts are the individual people linked to it. That model works perfectly for B2B sales. But what about B2C companies — insurance agencies, retail banks, hospitals — where the customer IS the individual? That's where Person Accounts come in. A Person Account merges the Account and Contact into a single record representing one human being. You enable Person Accounts in Setup under Account Settings. Here's the critical fact: once you enable Person Accounts, it cannot be undone. This is a one-way door.

Account Hierarchy lets you model parent-subsidiary corporate relationships. On any Account record, there's a Parent Account lookup field. Set it, and you've established the hierarchy. On the Account record, a View Hierarchy button appears so you can see the full family tree. Important nuance: hierarchy is structural only — it doesn't automatically share data between parent and child accounts. Sharing is still controlled by OWD, roles, and sharing rules.

Contacts are the people. Each Contact has a lookup to its primary Account. The Reports To field lets you chain contacts together — useful for modeling an organizational chart within a company. One important deletion behavior: if you delete an Account, the related Contacts do NOT get deleted. They stay in the system as orphaned contacts. However, related Opportunities, Cases, and Activities ARE deleted when the Account is deleted.

Related to Contacts is a feature called Contacts to Multiple Accounts. By default, a Contact has exactly one Account. But sometimes a consultant or board member is relevant to multiple companies. Enable this feature at Setup → Account Settings, and Contacts can be indirectly related to additional Accounts. The indirect relationships show in the Related Contacts related list. The Contact's primary Account Name field doesn't change — these extra relationships are supplemental.

Contact Roles on Opportunities are also important. When you're working an Opportunity, you want to know WHO at the company is involved and in WHAT role. Contact Roles let you attach Contacts to an Opportunity with labels like Decision Maker, Economic Buyer, Executive Sponsor, or Technical Buyer. One Contact Role can be flagged as Primary. This doesn't affect record sharing — it's informational, giving the sales team a clear picture of the buying committee.

Finally, remember that Account sharing has a cascade effect. When a user gets access to an Account record, they typically also get access to the related Contacts, Opportunities, and Cases. This is why Account OWD settings have such a big impact on your overall data visibility strategy.

That's Accounts and Contacts covered. Next up, we'll look at Opportunities and Products.

## 🔔 EXAM TIPS
- **Person Accounts are irreversible:** Enabling them in Setup cannot be undone — a permanent org-level change.
- **Deleting an Account does not delete Contacts:** Contacts become orphaned. Opportunities, Cases, and Activities are deleted.
- **Contacts to Multiple Accounts is not the default:** Must be explicitly enabled in Account Settings.
- **Contact Roles are informational only:** They do not grant record access to the Contact.
- **Account Hierarchy does not control sharing:** It's a visual/structural tool only; sharing rules still govern access.
- **Person Accounts can be Campaign Members:** Unlike Business Account records, Person Accounts can be added directly to Campaigns.

## ✅ LECTURE SUMMARY
- Business Accounts represent companies; Person Accounts merge Account + Contact for individual consumers (B2C) and are irreversible once enabled
- Account Hierarchy uses the Parent Account lookup; up to any depth; View Hierarchy button for navigation
- Deleting an Account does not delete Contacts (they become orphaned), but does delete Opportunities and Cases
- Contacts to Multiple Accounts allows one Contact to relate indirectly to additional Accounts; enabled in Account Settings
- Contact Roles link Contacts to Opportunities with a role designation (Decision Maker, Economic Buyer, etc.) and are informational, not sharing-related
- Account sharing cascades to related Contacts, Opportunities, and Cases

## ❓ MINI QUIZ

**Q1:** A Salesforce Administrator enabled Person Accounts three months ago and now the VP of Sales wants them removed. What should the administrator do?
- A) Disable Person Accounts in Setup → Account Settings
- B) Delete all Person Account records, then disable the feature
- C) Open a Salesforce Support case requesting removal
- D) Person Accounts cannot be disabled once enabled; inform the VP this is a permanent configuration
**Answer:** D — Person Accounts are irreversible once enabled. The administrator should inform the VP that this setting cannot be undone and discuss how to best work within the current configuration.

**Q2:** A contact named Sarah Chen works as a consultant for three different companies in Salesforce. Which feature allows Sarah's Contact record to appear in the related lists of all three Account records?
- A) Account Teams
- B) Contact Roles on Opportunities
- C) Contacts to Multiple Accounts (Related Contacts)
- D) Sharing Rules based on criteria
**Answer:** C — Contacts to Multiple Accounts allows a single Contact record to be indirectly related to additional Accounts beyond its primary Account. These indirect relationships appear in the Related Contacts related list.

**Q3:** An administrator is told that when an Account is deleted, the related Opportunities are also deleted, but Contacts remain. Which statement best completes this explanation?
- A) Contacts remain because they have a Master-Detail relationship with Account
- B) Contacts remain because they have a Lookup relationship with Account; Opportunities are deleted because of a Master-Detail relationship with Account
- C) Both Contacts and Opportunities remain; only Activities are deleted
- D) Contacts are deleted along with Opportunities and Cases
**Answer:** B — The Contact-to-Account relationship is a Lookup (not Master-Detail), so Contacts are not deleted when the Account is deleted. The Opportunity-to-Account relationship behaves as if it's a cascade delete — Opportunities, Cases, and Activities are removed when the parent Account is deleted.
