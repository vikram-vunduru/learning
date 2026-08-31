# Lab 2: Security Model Setup

## 🎯 Lab Objectives
- Create a role hierarchy (CEO → VP Sales → Sales Rep)
- Create custom profiles (Sales User, Read-Only User)
- Set Opportunity OWD (Organization-Wide Default) to Private
- Create a criteria-based sharing rule for Opportunities
- Create a Permission Set for Reports export
- Assign a permission set to a user

## ⏱️ Estimated Time
60–90 minutes

## 🔧 Prerequisites
- Completed Lab 1 (Developer Edition org with My Domain set up)
- Basic understanding of the Salesforce security model (OWD → Role Hierarchy → Sharing Rules)
- At least 2 user accounts in the org (you'll create test users during this lab)

## 📋 Step-by-Step Instructions

### Part 1: Build the Role Hierarchy

1. Navigate to **Setup** → Quick Find: `Roles` → click **Roles**.
2. You will see a role hierarchy tree. Click **Set Up Roles**.
3. Click **Add Role** at the top level to create the CEO role:
   - **Role Label:** CEO
   - **Role Name:** (auto-populated: CEO)
   - **Reports To:** Leave blank (this is the top of the hierarchy)
   - **Opportunity Access:** Read/Write (users below can access this role's records)
   - Click **Save**.
4. Under the CEO role, click **Add Role** to create VP Sales:
   - **Role Label:** VP of Sales
   - **Role Name:** VP_of_Sales
   - **Reports To:** CEO (should be pre-selected since you clicked Add under CEO)
   - Click **Save**.
5. Under VP of Sales, click **Add Role** to create Sales Rep:
   - **Role Label:** Sales Representative
   - **Role Name:** Sales_Representative
   - **Reports To:** VP of Sales
   - Click **Save**.
6. Verify the hierarchy looks like:
   ```
   CEO
   └── VP of Sales
       └── Sales Representative
   ```

> **Checkpoint:** You have built a three-tier role hierarchy. Roles control record visibility — users in higher roles can see records owned by users in lower roles (when OWD is Private or Public Read Only).

### Part 2: Create Custom Profiles

**Profile A: Sales User (cloned from Standard User)**

1. Navigate to **Setup** → Quick Find: `Profiles` → click **Profiles**.
2. Find the **Standard User** profile and click **Clone**.
3. Set the new profile name: `Sales User`
4. Click **Save**.
5. You are now viewing the Sales User profile. Review but do NOT change settings yet.

**Profile B: Read-Only User (cloned from Minimum Access)**

6. Return to the Profiles list. Find **Minimum Access - Salesforce** profile and click **Clone**.
7. Set the name: `Read-Only User`
8. Click **Save**.
9. On the Read-Only User profile, scroll to find **Standard Object Permissions**.
10. For the Accounts and Contacts objects, verify only **Read** is checked (no Create/Edit/Delete).

> **Note:** In a Developer Edition org, you may have limited ability to edit standard profiles. Cloning creates a custom profile you can modify freely.

### Part 3: Create Test Users

1. Navigate to **Setup** → Quick Find: `Users` → click **Users**.
2. Click **New User** and create User 1:
   - **First Name:** Alice
   - **Last Name:** Sales
   - **Email:** Use a real email you can access (or use a variation like `alice+sales@youremail.com`)
   - **Username:** `alice.sales.certlab@uniquedomain.com` (must be globally unique)
   - **Role:** Sales Representative
   - **Profile:** Sales User
   - **User License:** Salesforce
   - Click **Save**.
3. Click **New User** and create User 2:
   - **First Name:** Bob
   - **Last Name:** Manager
   - **Email:** Another accessible email
   - **Username:** `bob.manager.certlab@uniquedomain.com`
   - **Role:** VP of Sales
   - **Profile:** Sales User
   - Click **Save**.

> **Checkpoint:** You now have two users: Alice (Sales Rep) and Bob (VP Sales). They will be used to test the sharing model.

### Part 4: Set OWD for Opportunities to Private

1. Navigate to **Setup** → Quick Find: `Sharing Settings` → click **Sharing Settings**.
2. Click **Edit** next to the Organization-Wide Defaults section.
3. Find the **Opportunities** object row.
4. Change the **Default Internal Access** to **Private**.
5. Click **Save** → click **OK** on the warning dialog (recalculation may take a moment).

> **What Private means for Opportunities:** Opportunity records are only visible to the record owner, their managers in the role hierarchy, and users with explicit sharing. Users in the same role or below cannot see each other's opportunities.

> **Checkpoint:** With OWD = Private, Alice (Sales Rep) cannot see Bob's Opportunities, and Bob can see Alice's Opportunities (because Bob is Alice's manager in the role hierarchy).

### Part 5: Create a Criteria-Based Sharing Rule

Now let's create a sharing rule that shares high-value Opportunities broadly.

1. In **Sharing Settings**, scroll down to the **Opportunity Sharing Rules** section.
2. Click **New** in the Opportunity Sharing Rules section.
3. Configure the sharing rule:
   - **Rule Name:** Share_High_Value_Opportunities
   - **Rule Type:** Based on criteria (not based on owner)
   - **Criteria:**
     - Field: Amount
     - Operator: greater than or equal to
     - Value: 100000
   - **Share with:** Role — Sales Representative (or a Public Group you create)
   - **Access Level:** Read Only
4. Click **Save** and allow the sharing calculation to complete.

> **What this rule does:** Any Opportunity with Amount >= $100,000 is automatically shared (Read Only) with all Sales Representatives, even if they're not the owner.

> **Checkpoint:** Create a test Opportunity worth $150,000 as Bob (VP Sales). Log in as Alice (Sales Rep) and verify she can see it (due to the sharing rule). Create one for $50,000 and verify Alice CANNOT see it (below threshold).

### Part 6: Create a Permission Set for Report Export

1. Navigate to **Setup** → Quick Find: `Permission Sets` → click **Permission Sets**.
2. Click **New**.
3. Configure the permission set:
   - **Label:** Reports Export Access
   - **API Name:** Reports_Export_Access
   - **License:** Salesforce
4. Click **Save**.
5. Click **System Permissions** in the permission set detail.
6. Click **Edit**.
7. Find and enable: **Export Reports**
8. Also enable: **Run Reports** (required baseline permission for report access)
9. Click **Save**.

> **Note:** Permission sets add permissions ON TOP of a user's profile. They never restrict access — only grant additional access.

### Part 7: Assign the Permission Set to Alice

1. Navigate to **Setup** → Quick Find: `Users` → click **Users**.
2. Click Alice Sales's name to open her user record.
3. Scroll to the **Permission Set Assignments** related list.
4. Click **Edit Assignments**.
5. Move **Reports Export Access** from the Available list to the Enabled list.
6. Click **Save**.
7. Verify the permission set appears under Alice's Permission Set Assignments.

> **Checkpoint:** Alice can now export reports. To verify: log in as Alice, navigate to Reports, create or open a report, and verify the Export button is available.

---

## ✅ Verification Checklist

- [ ] Role hierarchy created: CEO → VP of Sales → Sales Representative
- [ ] Sales User profile created (cloned from Standard User)
- [ ] Read-Only User profile created (cloned from Minimum Access)
- [ ] Test users created: Alice Sales (Sales Rep / Sales User profile) and Bob Manager (VP Sales / Sales User profile)
- [ ] Opportunity OWD set to Private
- [ ] Criteria-based sharing rule created: Opportunities with Amount >= $100,000 shared Read Only with Sales Representative role
- [ ] Permission Set "Reports Export Access" created with Export Reports and Run Reports permissions
- [ ] Permission Set assigned to Alice Sales
- [ ] Tested: Alice can see high-value Opportunities she doesn't own (via sharing rule)
- [ ] Tested: Alice cannot see low-value Opportunities she doesn't own (below sharing rule threshold)

## 💡 Bonus Challenges

1. **Manual Sharing:** Create an Opportunity worth $50,000 as Bob. From the Opportunity record, click the Sharing button and manually share it with Alice (Read Only). Verify Alice can now see it. Note: Manual Sharing only appears when OWD is less than Public Read/Write.

2. **Public Group:** Create a Public Group called "West Region Sales" that includes Alice. Modify the sharing rule to share with this Public Group instead of the Role. Verify the sharing behavior is the same.

3. **Field-Level Security:** On the Sales User profile, navigate to the Opportunity field-level security settings. Remove Read access from the "Probability (%)" field. Log in as Alice and verify that Probability does not appear on Opportunity records or in reports (note: in newer Salesforce orgs, FLS is managed more via Permission Sets).

4. **Login As:** From Setup → Users, click "Login" next to Alice's user to log in as her. Navigate to Opportunities. Observe which records are visible based on the sharing model you've configured. Return to your admin session.

5. **OWD Impact Analysis:** Change Opportunity OWD to "Public Read Only" and observe the difference in what Alice can see. Then change it back to Private and observe the change. This demonstrates how OWD is the foundation of the sharing model.
