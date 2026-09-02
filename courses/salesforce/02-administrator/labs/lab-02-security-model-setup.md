# Lab 02 — Security Model Setup

## What You Need to Be Able to Do

This lab covers the full security model stack. Work through each section to build a working security model from scratch in your Developer Edition org. Understanding this hands-on is critical — security is 20% of the exam.

### Build a Role Hierarchy
- [ ] Navigate to Setup → Users → Roles
- [ ] Create the following hierarchy:
  ```
  CEO
  ├── VP Sales
  │   ├── Regional Manager — East
  │   │   ├── Sales Rep — East 1
  │   │   └── Sales Rep — East 2
  │   └── Regional Manager — West
  │       ├── Sales Rep — West 1
  │       └── Sales Rep — West 2
  └── VP Service
      └── Support Manager
          └── Support Agent 1
  ```
- [ ] Understand: can VP Sales see Sales Rep East 1's records? YES (above in hierarchy)
- [ ] Understand: can Sales Rep East 1 see VP Sales's records? NO (below in hierarchy)

### Create Profiles
- [ ] Navigate to Setup → Profiles
- [ ] Clone the "Standard User" profile to create "Sales Rep Profile"
- [ ] Clone again to create "Support Agent Profile"
- [ ] On Sales Rep Profile: review and understand which objects have CRUD access
- [ ] On Sales Rep Profile: find the Field-Level Security section for Opportunity → verify what fields are visible/editable

### Create Test Users
- [ ] Navigate to Setup → Users → New User
- [ ] Create 3 test users:
  - `eastRep1@yourorg.com` — profile: Sales Rep Profile, role: Sales Rep — East 1
  - `westRep1@yourorg.com` — profile: Sales Rep Profile, role: Sales Rep — West 1
  - `eastMgr@yourorg.com` — profile: Sales Rep Profile, role: Regional Manager — East
- [ ] Verify email confirmation (or use "Reset Password" to set passwords)

### Configure Org-Wide Defaults
- [ ] Navigate to Setup → Security → Sharing Settings
- [ ] Change Account OWD to: Private
- [ ] Change Contact OWD to: Private
- [ ] Change Opportunity OWD to: Private
- [ ] Note: a sharing recalculation will run (may take a moment)
- [ ] Log in as `eastRep1` — create an Account owned by eastRep1
- [ ] Log in as `westRep1` — attempt to find eastRep1's Account. Can they see it? NO (Private OWD)
- [ ] Log in as `eastMgr` — can they see eastRep1's Account? YES (Role Hierarchy, above in tree)

### Create Sharing Rules
- [ ] Still in Sharing Settings, scroll to Account Sharing Rules section
- [ ] Create an Owner-Based Sharing Rule:
  - Records owned by: "Regional Manager — East" role
  - Share with: "Regional Manager — West" role
  - Access: Read Only
- [ ] Test: log in as westRep1 (under West Manager) — can they now see East Manager-owned accounts? Yes (via sharing rule)

### Create Permission Sets
- [ ] Navigate to Setup → Permission Sets → New
- [ ] Create "Data Export Access" Permission Set
- [ ] Add "Export Reports" user permission
- [ ] Assign the Permission Set to `eastRep1` user
- [ ] Log in as eastRep1 and verify they now have report export capability

### Configure Field-Level Security
- [ ] Find the Account object in Object Manager
- [ ] Open the "Annual Revenue" field
- [ ] Click "Set Field-Level Security"
- [ ] Set Sales Rep Profile to: Read Only (not editable)
- [ ] Log in as eastRep1 — open an Account — verify Annual Revenue is read-only

## Key Validation Points

After completing this lab, verify you can answer:
- What is the OWD floor and what can override it?
- Why can a manager see a subordinate's records but not vice versa?
- What is the difference between Profile FLS and page layout visibility?
- How does a Sharing Rule differ from the Role Hierarchy for granting access?
- Can a Permission Set remove access granted by a profile?
