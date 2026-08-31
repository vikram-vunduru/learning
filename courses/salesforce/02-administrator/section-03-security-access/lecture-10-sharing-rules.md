# L10: Sharing Rules

## 🎯 Learning Objectives
- Explain the purpose of sharing rules and how they extend access beyond Org-Wide Defaults
- Distinguish between owner-based and criteria-based sharing rules
- Identify the limits and constraints that apply to sharing rules in Salesforce

## 📊 SLIDES

### Slide 1: What Are Sharing Rules?
**Visual:** A layered pyramid diagram with OWD at the base and a highlighted "Sharing Rules" layer sitting directly above it, with an upward arrow labeled "extends access"
**Content:**
- Sharing rules automatically extend record access to groups of users beyond what OWD allows
- They apply on top of OWD — sharing rules cannot restrict access, only open it up
- Sharing rules work only when OWD is set to **Private** or **Public Read Only** (if OWD is Public Read/Write, everyone already has full access)
- Two types: **Owner-Based** and **Criteria-Based**
**Speaker Notes:** Sharing rules solve the problem of blanket OWD settings being too restrictive for certain user groups. For example, you might set Opportunities to Private but still need the Sales Operations team to see all deals. A sharing rule handles that automatically without changing the OWD.

### Slide 2: Owner-Based Sharing Rules
**Visual:** A diagram showing "Records owned by Group A" with an arrow pointing to "Shared with Group B," using role/public group icons
**Content:**
- Share records based on **who owns the record**
- Source: a user, role, role and subordinates, public group, or territory
- Target: same options — a user, role, role and subordinates, public group, or territory
- Access level granted: Read Only or Read/Write
**Speaker Notes:** Owner-based rules are simple: "Give Group B access to all records owned by Group A." A classic example is sharing all records owned by the West Region role with the Sales Ops public group so they can report across territories.

### Slide 3: Criteria-Based Sharing Rules
**Visual:** A flowchart showing "Record meets criteria?" → Yes → "Share with target group" → No → "Standard OWD applies"
**Content:**
- Share records based on **field values on the record** — not who owns it
- Criteria examples: Industry = "Technology," Stage = "Closed Won," Region__c = "APAC"
- More flexible than owner-based rules; up to 50 filter conditions per rule
- Access level granted: Read Only or Read/Write
**Speaker Notes:** Criteria-based rules are the more powerful option. They let you say "share any Opportunity where Stage is Closed Won with the Finance team" — regardless of who owns the record. This is especially useful when ownership patterns don't map cleanly to your sharing needs.

### Slide 4: Sharing Rules Only Work with Restricted OWD
**Visual:** A decision tree: "Is OWD Private or Public Read Only?" → Yes → "Sharing Rules apply" / No (Public Read/Write) → "Sharing Rules have no effect"
**Content:**
- If OWD is **Public Read/Write**, sharing rules are redundant — everyone already has full access
- Sharing rules are meaningful only when OWD is **Private** or **Public Read Only**
- This is a commonly tested exam concept — know this cold
- Sharing rules add access on top of OWD; they never subtract it
**Speaker Notes:** Think of it this way: if everyone can already see and edit everything, adding a sharing rule that says "also share with this group" does nothing new. The whole point of sharing rules is to poke holes in a restrictive OWD without abandoning it entirely.

### Slide 5: Sharing Rule Limits
**Visual:** A reference card showing key numeric limits for sharing rules
**Content:**
- **300** sharing rules per object (combined owner-based and criteria-based)
- **50** filter conditions per criteria-based sharing rule
- Sharing rules apply to most standard objects and all custom objects
- Sharing rules are **not available** for some objects (e.g., Activities, if OWD is Controlled by Parent)
**Speaker Notes:** The 300-rule-per-object limit is high enough that most orgs never hit it, but it is tested on the exam. More practically, if you find yourself writing dozens of sharing rules, it is often a signal that your Role Hierarchy or public group design needs rethinking.

### Slide 6: How to Create a Sharing Rule
**Visual:** Step-by-step UI mockup showing Setup > Security > Sharing Settings > scroll to object > New Sharing Rule button, with fields for Rule Name, Based On, Source, Target, and Access Level
**Content:**
- Navigate to **Setup > Security > Sharing Settings**
- Scroll to the object section and click **New** under Sharing Rules
- Choose: Owner-based or Criteria-based
- Define: who the records belong to (source) and who gets access (target)
- Set access level: Read Only or Read/Write
**Speaker Notes:** The UI walks you through it step by step. The most important decision is choosing the correct source and target. Public groups are often the cleanest target because they are maintainable — add or remove users from the group rather than editing the sharing rule itself.

### Slide 7: Public Groups vs. Roles as Sharing Targets
**Visual:** A comparison table: Public Groups (flexible, manually maintained, cross-role membership) vs. Roles (hierarchical, automatic membership via role hierarchy)
**Content:**
- **Roles** — membership is determined by the role hierarchy; sharing rules that target a role automatically include users in subordinate roles
- **Roles and Subordinates** — explicitly includes the role and all roles below it
- **Public Groups** — manually defined, can include users, roles, and other groups; most flexible option
- **Best practice:** target public groups for sharing rules when membership doesn't follow the role hierarchy
**Speaker Notes:** If you share with a Role, users in subordinate roles also get access because of role hierarchy. If you share with a Role and Subordinates, you are explicit about including the whole subtree. Public groups are the Swiss Army knife — they let you group any combination of users regardless of hierarchy.

### Slide 8: Sharing Rules Cannot Restrict Access
**Visual:** A "No" symbol over a downward arrow, with text: "Sharing rules ONLY open access up. They NEVER restrict."
**Content:**
- Sharing rules always grant access at Read Only or Read/Write — never remove it
- To restrict access below OWD, you would need to lower the OWD itself
- There is no "negative" or "blocking" sharing rule in standard Salesforce
- For fine-grained restrictions within a record set, consider Field-Level Security or Record Types
**Speaker Notes:** This is another heavily tested concept. If an exam question asks how to restrict a group from seeing certain records, sharing rules are never the answer. Lower the OWD or restructure the role hierarchy instead. Sharing rules only give — they never take away.

## 🎙️ RECORDING SCRIPT

Welcome back. In this lecture we are covering Sharing Rules — the tool you use when Org-Wide Defaults are too restrictive for specific groups of users.

Here is the core mental model. You set OWD to Private because you want most users to see only their own records. But there is a management team, or a cross-regional support group, or a Finance team that legitimately needs access to records they don't own. Rather than making OWD less restrictive for everyone, you create a sharing rule that targets exactly that group.

There are two types of sharing rules. Owner-based sharing rules say: "take all records owned by this person or group, and share them with that person or group." You define a source — a user, role, public group, or territory — and a target, with the same options. You then choose whether to grant Read Only or Read/Write access.

Criteria-based sharing rules are more powerful. Instead of caring who owns the record, they look at the data on the record itself. If the Industry field equals Technology, share those Account records with the Tech Sales team. If the Opportunity Stage is Closed Won, share it with the Finance group. You can stack up to 50 filter conditions per rule.

Here is a critical exam point: sharing rules only matter when your OWD is Private or Public Read Only. If OWD is Public Read/Write, everyone already has full access and sharing rules are redundant. This gets tested repeatedly.

Also critical: sharing rules can only open access up. They cannot restrict. There is no such thing as a blocking sharing rule. If your goal is to prevent someone from seeing a record, you lower the OWD or restructure the role hierarchy — you do not create a sharing rule.

The limit you need to memorize is 300 sharing rules per object. That is the combined limit for owner-based and criteria-based rules on a single object.

When creating sharing rules, navigate to Setup, then Security, then Sharing Settings. Scroll to the object you want and click New in the Sharing Rules section. The UI is straightforward — choose the type, define source and target, set the access level, and save.

My best practice tip: use Public Groups as your target whenever possible. They are maintainable — when the Finance team changes, you update the public group membership once, and all sharing rules targeting that group automatically reflect the change. You do not have to edit each sharing rule individually.

Sharing rules are your primary tool for automating access beyond OWD. In the next lecture we will cover manual sharing and teams, which handle the cases that sharing rules cannot automate.

## 🔔 EXAM TIPS
- **OWD prerequisite:** Sharing rules only have effect when OWD is Private or Public Read Only. If OWD is Public Read/Write, sharing rules are irrelevant — this is tested repeatedly.
- **300-rule limit:** There are a maximum of 300 sharing rules per object (owner-based + criteria-based combined). Memorize this number.
- **Cannot restrict:** Sharing rules can only grant Read Only or Read/Write access. They can never be used to remove or restrict access — only OWD changes do that.
- **Roles include subordinates:** When a sharing rule targets a Role, it includes that role but NOT its subordinates by default. To include all levels below, explicitly choose "Roles and Subordinates."
- **Criteria-based flexibility:** Criteria-based sharing rules are more flexible than owner-based because they evaluate field values, not ownership. Expect scenario questions where criteria-based is clearly the right answer.

## ✅ LECTURE SUMMARY
- Sharing rules automatically extend record access beyond OWD for specific groups of users; they only work when OWD is Private or Public Read Only
- Owner-based sharing rules share records based on who owns them; criteria-based sharing rules share records based on field values on the record
- Sharing rules can only open up access — they can never restrict it
- The limit is 300 sharing rules per object (combined owner-based and criteria-based)
- Best practice is to target public groups in sharing rules for easier long-term maintenance

## ❓ MINI QUIZ

**Q1:** A Salesforce Admin creates a criteria-based sharing rule for Opportunities where Region = "West." The Opportunity OWD is set to Public Read/Write. What is the effect of this sharing rule?
- A) It gives the target group Read/Write access to all Western Opportunities
- B) It restricts Western Opportunities to only the target group
- C) It has no effect because OWD is already Public Read/Write
- D) It triggers an error because criteria-based rules require Private OWD

**Answer:** C — Sharing rules are redundant when OWD is Public Read/Write because all users already have full access. The rule has no practical effect.

**Q2:** An admin wants to share all Opportunity records owned by the North America Sales team with the Finance team, regardless of which specific users are in each team. What type of sharing rule should be used?
- A) Criteria-based sharing rule filtered by Region field
- B) Owner-based sharing rule from the North America Sales role to the Finance public group
- C) Manual sharing on each individual Opportunity record
- D) A profile-level permission to read all Opportunities

**Answer:** B — Owner-based sharing rules share records based on ownership. Targeting the North America Sales role as source and the Finance public group as target automatically shares the right records without manual intervention.

**Q3:** What is the maximum number of sharing rules allowed per object in Salesforce?
- A) 50
- B) 100
- C) 200
- D) 300

**Answer:** D — The limit is 300 sharing rules per object, combining both owner-based and criteria-based rules.
