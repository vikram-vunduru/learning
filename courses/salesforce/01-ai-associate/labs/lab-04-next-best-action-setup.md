# Lab 04: Next Best Action Setup — What You Need to Be Able to Do

**Lab Type:** Hands-On Practice
**Estimated Time:** 45-60 minutes

---

## Core Skills to Demonstrate

By end of this lab you should be able to:
- Create Recommendation records that define what to recommend
- Build a Strategy in Strategy Builder with Load → Filter → Sort → Limit elements
- Test the Strategy with qualifying and non-qualifying Account records
- Add the NBA Lightning component to a record page

---

## Checklist: Build an Account-Level NBA Implementation

### Step 1: Create Recommendation Records
- [ ] Navigate to App Launcher → Recommendations (or Setup → Search "Recommendations" → open the object)
- [ ] Click **New** to create the first Recommendation

**Recommendation 1: "Schedule Executive Business Review"**
- [ ] Name: "Schedule Executive Business Review"
- [ ] Acceptance Label: "Create EBR Task"
- [ ] Rejection Label: "Not Now"
- [ ] Description: "This account hasn't had an executive review in over 6 months. Schedule an EBR to strengthen the relationship."
- [ ] Action Flow: (for now, leave blank or link a simple test Flow if available)
- [ ] Save

**Recommendation 2: "Offer Premium Support Upgrade"**
- [ ] Name: "Offer Premium Support Upgrade"
- [ ] Acceptance Label: "Send Upgrade Email"
- [ ] Rejection Label: "Already Premium" 
- [ ] Description: "This account is on Standard Support. Offer an upgrade to Premium Support."
- [ ] Save

### Step 2: Build the Strategy
- [ ] Navigate: Setup → Einstein → Next Best Action → **Strategies** tab (or search "Strategies")
- [ ] Click **New Strategy**
- [ ] Name: "Account Recommendations Strategy"
- [ ] Context Object: **Account**
- [ ] Click **Open Strategy Builder** (launches visual flow builder)

**In Strategy Builder, build this flow:**

- [ ] **LOAD element**: Load Recommendations (load all active Recommendation records)
  - Source: Salesforce Recommendations
  - Filter conditions: Active = True

- [ ] **FILTER element**: Filter based on Account conditions
  - Connect after Load
  - Condition: Filter "Offer Premium Support Upgrade" to only show when Account.Support_Tier__c = "Standard"
  - (If you don't have this field: use any Account field for filter practice — e.g., Account.Type = "Customer")

- [ ] **SORT element**: Sort by Priority
  - Connect after Filter
  - Sort by Recommendation priority or a score field

- [ ] **LIMIT element**: Cap the output
  - Connect after Sort
  - Limit: 2 (show maximum 2 recommendations)

- [ ] **OUTPUT element**: Connect the final output
- [ ] Save the Strategy

### Step 3: Test the Strategy
- [ ] In Strategy Builder, use the **Preview/Test** function
- [ ] Test with Account 1 that MEETS the filter criteria (e.g., Support_Tier = Standard)
  - [ ] Expected: Both recommendations appear (or up to 2)
- [ ] Test with Account 2 that DOES NOT meet the criteria (e.g., Support_Tier = Premium)
  - [ ] Expected: "Offer Premium Support Upgrade" should be filtered out; only EBR shows (or 0 if EBR also has criteria)
- [ ] Verify the Limit is working — not more than 2 recommendations returned

### Step 4: Add NBA Component to Account Page
- [ ] Navigate to an Account record
- [ ] Click gear icon → **Edit Page** (Lightning App Builder)
- [ ] In left component panel, search for "Next Best Action"
- [ ] Drag the **Next Best Action** component onto the page layout
- [ ] Configure the component:
  - Strategy: select "Account Recommendations Strategy"
  - Header label: "Recommended Actions"
  - Max recommendations to display: 2
- [ ] Save and Activate the page
- [ ] Navigate back to an Account record — the NBA component should appear

### Step 5: Test Accept/Reject Behavior
- [ ] On an Account that qualifies (meets filter criteria), view the NBA component
- [ ] Click **Accept** on one recommendation
- [ ] Observe: if an Action Flow is linked, it runs. Without a Flow, just acceptance is logged.
- [ ] Click **Reject** on another recommendation
- [ ] Observe: recommendation disappears from the panel

---

## Concepts Reinforced by This Lab

| What You Did | What It Teaches |
|-------------|----------------|
| Created Recommendation records | The Recommendation object — what NBA recommends |
| Built Strategy with Load/Filter/Sort/Limit | Strategy Builder elements and their sequence |
| Tested with qualifying/non-qualifying records | How Filter elements work; NBA is contextual not universal |
| Added NBA Lightning Component to page | The 3-component NBA architecture (Rec + Strategy + Component) |
| Observed Accept/Reject | How Action Flows connect to Recommendation acceptance |

---

## Exam-Relevant Self-Check Questions

1. What are the 3 components of Einstein Next Best Action? What does each do?
2. In Strategy Builder, what is the difference between a Load element and a Filter element?
3. If a Recommendation has an Acceptance Label = "Book Meeting" and a user clicks it — what runs?
4. Can Next Best Action generate new recommendations dynamically (without pre-created Recommendation records)?
5. How could you use Einstein Prediction Builder alongside NBA? (Hint: use a prediction score field in a Filter condition)
6. What happens when no recommendations pass the Strategy's filters — does the user see an error or just an empty panel?
