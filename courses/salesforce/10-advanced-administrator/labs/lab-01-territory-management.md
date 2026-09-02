# Lab 01: Territory Management 2.0

## Lab Overview

**Objective:** Build a working Territory Management 2.0 structure for a fictional company, Universal Containers (UC). UC has a geographic sales model with regional reps AND a Named Accounts overlay team.

**Estimated time:** 60–90 minutes

**Prerequisites:**
- Developer org with Sales Cloud enabled
- Territory Management 2.0 enabled (Setup > Territory Management)
- At least 10 sample Account records

**What you'll build:**
- A 3-level territory hierarchy (National → Regional → Sub-Regional)
- Account assignment rules for geographic territories
- A Named Accounts overlay territory
- Users assigned to multiple territories
- Test the access model

---

## Business Scenario

Universal Containers has:
- 3 geographic regions: West, Central, East
- 2 sub-regions within West: Pacific (CA, OR, WA) and Mountain (CO, AZ, NV)
- A Named Accounts team that covers 5 strategic accounts regardless of geography
- All reps need to forecast separately from the role hierarchy

---

## Step 1: Enable Territory Management 2.0

1. Go to Setup > Territory Management > Enable Territory Management 2.0
2. If already enabled, proceed to Step 2
3. Note: TM2 cannot be undone easily — only do this in a dev/sandbox org

---

## Step 2: Create Territory Types

Territory Types are labels that classify your territories.

1. Setup > Territory Management > Territory Types > New
2. Create: **Geographic** (Priority: 1)
3. Create: **Named Accounts Overlay** (Priority: 2)

---

## Step 3: Create the Territory Model

1. Setup > Territory Management > Territory Models > New
2. Name: **FY2026 Sales Model**
3. Description: Geographic + Named Accounts for FY2026
4. State: Planning (leave as Planning — you'll activate later)
5. Save

---

## Step 4: Build the Territory Hierarchy

Navigate into the Territory Model you just created.

**Create the top-level territories:**

1. In the territory model, click "Add Territory"
2. Territory: **US National** | Type: Geographic | Parent: (none — top level)

**Create regional territories (children of US National):**
3. **US West** | Type: Geographic | Parent: US National
4. **US Central** | Type: Geographic | Parent: US National
5. **US East** | Type: Geographic | Parent: US National

**Create sub-regional territories (children of US West):**
6. **West - Pacific** | Type: Geographic | Parent: US West
7. **West - Mountain** | Type: Geographic | Parent: US West

**Create the overlay territory (peer of US National):**
8. **Named Accounts** | Type: Named Accounts Overlay | Parent: (top level)

Your hierarchy should look like:
```
US National
├── US West
│   ├── West - Pacific
│   └── West - Mountain
├── US Central
└── US East
Named Accounts (separate from geographic hierarchy)
```

---

## Step 5: Create Account Assignment Rules

Assignment Rules automatically assign accounts to territories based on field criteria.

**For West - Pacific:**
1. Navigate to West - Pacific territory
2. Click "Add Assignment Rule"
3. Rule Name: Pacific States
4. Criteria: `BillingState = CA OR BillingState = OR OR BillingState = WA`
5. Save

**For West - Mountain:**
1. Navigate to West - Mountain territory
2. Add Rule: Mountain States
3. Criteria: `BillingState = CO OR BillingState = AZ OR BillingState = NV`

**For US Central:**
1. Add Rule: Central States
2. Criteria: `BillingState = TX OR BillingState = IL OR BillingState = OH`

**For US East:**
1. Add Rule: East States
2. Criteria: `BillingState = NY OR BillingState = MA OR BillingState = FL`

**For Named Accounts (manual assignment — no rules):**
- No assignment rule needed — named accounts will be manually assigned

---

## Step 6: Assign Users to Territories

1. Navigate to West - Pacific territory
2. Click "Add Users"
3. Add a test user (if you don't have team members, create a test user in the org)
4. Role: Territory User

5. Navigate to Named Accounts territory
6. Add the same user (they can be in multiple territories)
7. Role: Territory User

Verify that the user now appears in both West - Pacific and Named Accounts territories.

---

## Step 7: Activate the Territory Model

1. Go back to the Territory Model (FY2026 Sales Model)
2. Click "Activate"
3. Salesforce will run assignment rules against all Account records
4. Watch the "Rules Last Run" status — it may take a few minutes
5. Model state changes to: Active

---

## Step 8: Run Assignment Rules

1. From the Territory Model page, click "Run Rules"
2. Wait for rules to complete (check Setup > Apex Jobs for the background job)
3. Navigate to a few Account records and look at the "Territory" related list
4. Accounts in CA, OR, WA should be assigned to "West - Pacific"
5. Accounts in CO, AZ, NV should be assigned to "West - Mountain"

---

## Step 9: Manually Assign Named Accounts

1. Navigate to 2–3 specific "strategic" Account records
2. On each Account, find the "Territory" related list
3. Click "Assign Territories"
4. Add the "Named Accounts" territory manually
5. These accounts should now appear in BOTH their geographic territory AND Named Accounts

---

## Step 10: Verify Access

1. Log in as the test user (use Login As in Setup > Users)
2. Verify they can see West - Pacific accounts (based on assignment rules)
3. Verify they can see the Named Accounts you manually assigned
4. Create a new Account with BillingState = "CA"
5. Run assignment rules again (or wait for auto-evaluation)
6. Verify the new CA account is now visible to the West-Pacific user

---

## Step 11: Test Forecast Integration (If Collaborative Forecasting Enabled)

1. Ensure the test user has a Role assigned (required for forecasting)
2. Go to the Forecasts tab
3. Verify forecast type includes a Territory-based forecast option
4. If enabled, the test user's territory should appear in their forecast view

---

## Lab Verification Checklist

- [ ] Territory Model created and Activated
- [ ] 3-level geographic hierarchy built (National → Regional → Sub-Regional)
- [ ] Named Accounts overlay territory created
- [ ] Assignment rules created for 4 geographic territories
- [ ] Test user assigned to West - Pacific AND Named Accounts territories
- [ ] Assignment rules ran and accounts are correctly assigned
- [ ] Named accounts manually assigned to Named Accounts territory (and their geographic territory)
- [ ] Test user can see their territory accounts after logging in as that user
- [ ] New account in CA auto-assigns to West - Pacific after rules run

---

## Key Takeaways from This Lab

1. **Territory hierarchy is independent of role hierarchy** — the test user may have a role in the role hierarchy (e.g., Sales Rep under West Manager) AND territory assignments. Both grant access.

2. **Assignment rules are automatic but async** — the rules ran in the background. In production with millions of accounts, this could take hours.

3. **One account, multiple territories** — the Named Accounts accounts appear in both geographic and named accounts territories. Access is additive.

4. **Activating the model is irreversible mid-cycle** — once active, you manage within it. Creating a new model for the next fiscal year is a separate exercise.

---

## Extension Challenges

1. **Create a second Territory Model** for FY2027 in Planning state. What happens when you try to activate it? (Answer: you must deactivate the FY2026 model first)

2. **Build a report** showing which accounts are in the Named Accounts territory vs. geographic territories.

3. **Configure Territory Forecasting** — add a Territory forecast type in Collaborative Forecasting and verify the test user sees their territory forecast.

---

## PTA Notes: What to Watch For in Real Engagements

- Customers often want to rebalance territories mid-year — this means creating a new model, building the new hierarchy, and activating it (which takes all accounts through re-assignment). Budget 3–5 days for this if accounts number in the hundreds of thousands.
- The "Named Accounts" overlay pattern is by far the most common real-world TM2 use case.
- Territory management adds significant operational overhead. Ask "what is the business value that you cannot get from the role hierarchy + sharing rules?" before committing to TM2.
