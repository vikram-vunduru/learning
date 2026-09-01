# Lecture 14: Next Best Action and Recommendations
**Section:** Section 3 — AI in Salesforce  
**Duration:** 12 minutes  
**Exam Weight:** ~6% of exam (tested on components, use cases, and how ML enhances rule-based recommendations)

---

## Learning Objectives
1. Explain what Next Best Action (NBA) is and its business purpose
2. Distinguish between rule-based and ML-powered recommendation strategies
3. Identify the key components: Recommendation object, Strategy, and Lightning component
4. Trace through a real example of NBA surfacing a recommendation on a sales record
5. Explain how Einstein ML enhances NBA beyond static rules
6. Apply this knowledge to exam scenario questions

---

## SLIDES

### Slide 1: Title Slide
**Visual:** A Salesforce Account record page with an "Einstein Next Best Action" panel visible. The panel shows two recommendation cards: "Offer 20% loyalty discount" and "Schedule quarterly review call" — each with a context reason below it.
**Content:**
- Einstein Next Best Action: The right suggestion, at the right time, in the right record
- Rule-based logic meets machine learning intelligence
- Used in Sales Cloud, Service Cloud, and custom contexts

**Speaker Notes:** "Have you ever used an app that seems to know what you need before you ask? Spotify's 'Discover Weekly.' Amazon's 'customers who bought this also bought.' Netflix's 'Because you watched...' Those are recommendation engines. Salesforce's Next Best Action brings that same concept into your CRM — surfacing the most relevant recommendation for a rep or agent right when they're looking at a specific record. Let's learn how it works."

---

### Slide 2: What Is Next Best Action?
**Visual:** Diagram with a rep at a computer looking at a record. A lightbulb icon floats over the record with three suggestion bubbles: "Upsell", "Escalate to Manager", "Send Thank You Email."
**Content:**
**Next Best Action (NBA)** is a Salesforce feature that surfaces contextual recommendations on any record page

**Core concept:** Based on what is TRUE about this record RIGHT NOW, what is the most valuable action a human could take?

**Where it appears:** A Lightning component on any record page (Sales Cloud, Service Cloud, Community, custom)

**Who sees it:** Sales reps, service agents, any Salesforce user

**What recommendations can do:**
- Suggest a specific action ("Call the customer")
- Offer a discount or promotion ("Offer 15% off")
- Escalate a risk ("Flag for executive review")
- Trigger an automated process ("Launch onboarding flow")
- Display information ("This account has an open escalation")

**Speaker Notes:** "Next Best Action is one of those features that's simultaneously simple to describe and powerful in practice. The simple description: it's a panel on a record page that shows a rep their top recommended next action for that specific record. The powerful part: those recommendations aren't random. They're calculated based on the specific details of that record, the customer's history, your company's business rules, and — when Einstein ML is layered on — predictive intelligence about what's most likely to work."

---

### Slide 3: The Two Approaches — Rules vs. ML
**Visual:**
```
   NEXT BEST ACTION — Recommendations Engine

   ┌─────────────────────────────────────────────────────────────┐
   │                 STRATEGY BUILDER                            │
   │          (where you configure NBA logic)                    │
   ├───────────────────────────┬─────────────────────────────────┤
   │   BRANCH 1: RULES         │   BRANCH 2: ML MODEL            │
   │   (always applied)        │   (Einstein-powered)            │
   │                           │                                 │
   │ IF account.tier = VIP     │ Predict which offer has         │
   │ THEN show Renewal offer   │ highest probability of          │
   │                           │ acceptance for THIS customer    │
   │ IF case.open > 2          │ based on:                       │
   │ THEN show Apology offer   │ ● Customer profile              │
   │                           │ ● Similar customer behavior     │
   │ Static, admin-defined     │ ● Historical acceptance rates   │
   │ "business rules"          │ ● Contextual signals            │
   └───────────────────────────┴─────────────────────────────────┘
                               │
                               ▼
                     RANKED RECOMMENDATIONS
                     shown to rep or customer
```
**Content:**
**Approach 1: Rule-Based Recommendations**
- Business logic expressed as explicit conditions
- "IF account type = Gold AND renewal date < 60 days AND no recent contact THEN show 'Schedule Renewal Call'"
- Predictable, auditable, fully in your control
- Limitation: Can't adapt to complex patterns; requires manual maintenance

**Approach 2: ML-Powered Recommendations (Einstein)**
- Einstein analyzes historical data: which recommendations actually led to positive outcomes?
- Learns which recommendations work best for which customers under which conditions
- Adapts over time as more outcome data accumulates
- Limitation: Needs sufficient historical outcome data to learn from

**Best Practice:** Start with rules. Add Einstein ML as you accumulate outcome data.

**Speaker Notes:** "Here's a useful way to think about the difference. Rule-based NBA is like a well-trained experienced rep who has memorized the playbook. They know: when this customer type calls about this issue, always offer this solution. That's good. But it's rigid. Einstein-enhanced NBA is more like a seasoned veteran who has handled ten thousand customer interactions and developed intuition — they can read subtle signals and know when to deviate from the playbook because something about this specific customer is different. Both approaches are valid. The best implementations use both."

---

### Slide 4: Key Component #1 — The Recommendation Object
**Visual:** Salesforce Setup showing the Recommendations list view with several records: "Renew Annual Contract," "Upgrade to Enterprise," "Offer Priority Support." Each has fields for Name, Description, and Action Button Label.
**Content:**
**Recommendation Object:**
- A standard Salesforce object that stores each possible recommendation
- Each Recommendation record contains:
  - Name (what it's called)
  - Description (why this recommendation is being made)
  - Action (what the rep should do — can trigger a Flow)
  - Image (optional visual for the recommendation card)
  - Acceptance label (text on the "accept" button)
  - Rejection label (text on the "dismiss" button)

**Create recommendations in:** Setup → Recommendations (or via the object in your org)

**Think of it as:** A catalog of possible things you could recommend — a menu of options

**Speaker Notes:** "Before you can surface any recommendation to a rep, you have to define what your recommendations ARE. The Recommendation object is literally a catalog: here are all the possible actions we might ever suggest to a rep. 'Offer loyalty discount.' 'Schedule quarterly review.' 'Flag as at-risk account.' 'Upsell to premium tier.' Each of these is a Recommendation record. Then your Strategy (which we'll cover next) decides which recommendations from this catalog to surface, and when. Think of the Recommendation object as defining the ingredients; the Strategy is the recipe."

---

### Slide 5: Key Component #2 — The Recommendation Strategy
**Visual:**
```
   NBA STRATEGY — COMPONENT FLOW

   ┌─────────────────────────────────────────────────────────────┐
   │                       STRATEGY                              │
   │              (container for all NBA logic)                  │
   │                                                             │
   │  ┌─────────────────────────────────────────────────────┐    │
   │  │  LOAD RECOMMENDATIONS (candidate offers/actions)    │    │
   │  │  Define the pool of possible recommendations        │    │
   │  └─────────────────────────────────────────────────────┘    │
   │                          │                                  │
   │                          ▼                                  │
   │  ┌─────────────────────────────────────────────────────┐    │
   │  │  FILTER (eligibility rules)                         │    │
   │  │  IF not eligible → remove from pool                 │    │
   │  └─────────────────────────────────────────────────────┘    │
   │                          │                                  │
   │                          ▼                                  │
   │  ┌─────────────────────────────────────────────────────┐    │
   │  │  SCORE (ML model or rule-based ranking)             │    │
   │  │  Assign propensity score to each recommendation     │    │
   │  └─────────────────────────────────────────────────────┘    │
   │                          │                                  │
   │                          ▼                                  │
   │  ┌─────────────────────────────────────────────────────┐    │
   │  │  LIMIT (how many to show)                           │    │
   │  │  Return top N recommendations                       │    │
   │  └─────────────────────────────────────────────────────┘    │
   └─────────────────────────────────────────────────────────────┘
```
**Content:**
**Recommendation Strategy:**
- The logic engine that decides WHICH recommendations to show and in what ORDER
- Built in a visual, flow-like interface in Salesforce
- Combines business rules AND Einstein ML scoring

**Strategy components:**
- **Load nodes:** Pull in Recommendation records to consider
- **Filter nodes:** Apply conditions (only show if account type = Enterprise)
- **Branch nodes:** Different logic paths for different scenarios
- **Einstein nodes:** Score and rank recommendations using ML
- **Limit nodes:** Cap how many recommendations to display at once (typically 2-3)
- **Output node:** The final ranked list that appears in the UI component

**Speaker Notes:** "The Strategy is the heart of NBA. It's a canvas where you build decision logic — very similar in concept to a Salesforce Flow or decision tree. You start with your full catalog of recommendations, then filter down: is this relevant to this record? Is this relevant at this stage in the customer lifecycle? Then rank: of the relevant options, which is most likely to succeed? That ranking can be rule-based (show the highest discount option first) or Einstein-powered (show the recommendation that similar customers historically accepted most). The output is a ranked shortlist — usually 2-3 recommendations — that appears in the UI component."

---

### Slide 6: Key Component #3 — The Lightning Component
**Visual:** Lightning App Builder screen showing an Account record page layout, with the "Einstein Next Best Action" component dragged into a sidebar panel. Configuration panel on the right showing Strategy selection.
**Content:**
**Einstein Next Best Action Lightning Component:**
- The UI element that displays recommendations on the record page
- Configured in Lightning App Builder (drag and drop, no code)
- You assign it to a specific Strategy

**Configuration options:**
- Which Strategy to use
- Maximum recommendations to display
- Layout: stacked cards or horizontal carousel
- Which page (Account, Opportunity, Case, Contact, custom object)

**What the rep sees:**
- Recommendation card with title and description
- "Accept" button → can trigger a Flow or log the action
- "Decline/Later" button → logs the rejection (Einstein learns from this)
- Reason text: "Suggested because this account hasn't been contacted in 60 days"

**Speaker Notes:** "The Lightning component is the final step — it's where your Strategy configuration becomes something a rep can actually see and interact with. You go to Lightning App Builder, open the page layout for whatever record type you want, find the 'Einstein Next Best Action' component in the component panel, and drag it onto the page. Then you tell it which Strategy to run. That's it — no code. The rep sees a beautiful card interface with their top recommended actions. When they click 'Accept' on a recommendation, you can configure that click to automatically trigger a Flow — so accepting 'Schedule Renewal Call' could automatically create a task and send a calendar invite."

---

### Slide 7: Real Example — NBA in Action
**Visual:**
```
   NEXT BEST ACTION — REAL-TIME FLOW

   Step 1: Rep opens Account record or Customer starts chat
                            │
                            ▼
   Step 2: NBA Strategy invoked (via Lightning component or Flow)
                            │
                            ▼
   Step 3: Filter — remove ineligible offers
           (already purchased, not in eligible region, etc.)
                            │
                            ▼
   Step 4: Score — ML model ranks remaining offers by:
           ● Propensity to accept
           ● Lifetime value impact
           ● Strategic priority
                            │
                            ▼
   Step 5: Top recommendations displayed on screen
           ┌──────────────────────────────────────┐
           │ ★ Offer: Annual plan upgrade  89%    │
           │ ★ Offer: Add user licenses    74%    │
           │ ○ Offer: Support tier upgrade 42%    │
           └──────────────────────────────────────┘
                            │
                            ▼
   Step 6: Rep presents offer → Customer accepts/declines
           → Outcome feeds back to ML model (improves over time)
```
**Content:**
**Scenario:** A sales rep opens the Apex Industries account record.

**What happens behind the scenes:**
1. The NBA Lightning component fires and calls the assigned Strategy
2. Strategy loads all Recommendations from the catalog
3. Filter nodes evaluate Apex Industries' data:
   - Account type = Gold Tier ✓
   - Renewal date = 45 days away ✓
   - Last activity = 32 days ago ✓ 
   - Open cases = 0 ✓
4. These conditions match the "Loyalty Renewal" recommendation rule
5. Einstein scores this against historical data: similar accounts accepted this offer 68% of the time
6. Output: "Offer 20% Loyalty Discount" ranked #1

**What the rep sees:** A card with the recommendation, the reason ("Renewal approaching with no recent contact"), and an Accept button

**What happens when rep clicks Accept:** A task is created, a pre-drafted email opens for review

**Speaker Notes:** "Walk through this scenario carefully because it models almost exactly what an exam scenario question will describe. The rep opens a record — the NBA component runs. The Strategy evaluates data — applies rules, applies ML. The output is a ranked recommendation list — just the most relevant, not every possible recommendation. The rep acts on it — acceptance can trigger automation. This end-to-end flow is what the exam tests. Know all four pieces: Recommendation (the content), Strategy (the logic), Component (the UI), and the automation triggered on acceptance."

---

### Slide 8: How Einstein ML Enhances NBA
**Visual:**
```
   WITH vs. WITHOUT ML IN NEXT BEST ACTION

   ┌──────────────────────────────┬──────────────────────────────┐
   │   WITHOUT ML (Rules Only)    │    WITH ML SCORING           │
   ├──────────────────────────────┼──────────────────────────────┤
   │ Same offers shown to all     │ Personalized offers per      │
   │ eligible customers           │ individual customer          │
   │                              │                              │
   │ "Show Renewal offer to all   │ "Show Renewal to customers   │
   │  accounts expiring this Q"   │  most likely to upgrade;     │
   │                              │  show Downgrade save offer   │
   │                              │  to at-risk customers"       │
   │                              │                              │
   │ Static ranking               │ Dynamic ranking by           │
   │ (admin manually orders)      │ propensity score             │
   │                              │                              │
   │ Doesn't improve over time    │ Learns from outcomes,        │
   │                              │ gets more accurate           │
   └──────────────────────────────┴──────────────────────────────┘
```
**Content:**
**Without Einstein ML:**
- Rules define which recommendations to show
- Same rules apply to all customers meeting the criteria
- No learning over time — rules are static until an admin changes them

**With Einstein ML:**
- Einstein tracks which recommendations are ACCEPTED vs. DECLINED
- Learns patterns: what type of customer, in what situation, accepts which recommendation?
- Starts to RANK recommendations based on predicted acceptance likelihood
- Continuously improves — the more outcome data, the better the ranking

**Practical impact:**
- Rep who declines "big discount" offers → Einstein learns → stops showing those
- Enterprise customers who responded to exec outreach → Einstein prioritizes exec-level suggestions

**Speaker Notes:** "This is where NBA becomes genuinely intelligent rather than just rule-based. The moment you start tracking acceptance and rejection of recommendations, Einstein starts learning. It's like A/B testing on autopilot. You have two recommendations that both qualify based on rules — say 'Offer a 10% discount' and 'Schedule a QBR meeting.' For Customer Type A, the QBR always gets accepted and the discount gets declined. For Customer Type B, the discount gets accepted and QBR gets ignored. Without ML, you'd show both to everyone. With Einstein ML, the system learns that for THIS customer type, surface the QBR first. For THAT customer type, surface the discount first. The reps don't have to think about this — Einstein just surfaces the right thing first."

---

### Slide 9: NBA vs. Prediction Builder — Complementary, Not Competing
**Visual:**
```
   NEXT BEST ACTION — SALESFORCE INTEGRATION POINTS

   ┌──────────────────────────────────────────────────────────────┐
   │                                                              │
   │   DISPLAY CHANNELS              TRIGGER POINTS              │
   │   (where NBA appears)           (when NBA fires)            │
   │   ┌─────────────────┐           ┌─────────────────┐         │
   │   │ Account page    │           │ Record open     │         │
   │   │ Contact page    │           │ Flow automation │         │
   │   │ Case page       │           │ Agent trigger   │         │
   │   │ Opportunity page│           │ Scheduled batch │         │
   │   │ Service Console │           └─────────────────┘         │
   │   └─────────────────┘                   │                   │
   │                                         │                   │
   │   DATA SOURCES                  ◀───────┘                   │
   │   (NBA context)                                              │
   │   ┌─────────────────┐           ┌─────────────────┐         │
   │   │ Salesforce CRM  │           │ STRATEGY BUILDER│         │
   │   │ Data Cloud      │──────────▶│ (NBA Logic:     │         │
   │   │ Calc. Insights  │           │  Filter+Score   │         │
   │   └─────────────────┘           │  +Rank+Limit)   │         │
   │                                 └─────────────────┘         │
   └──────────────────────────────────────────────────────────────┘
```
**Content:**
**How NBA and Prediction Builder work TOGETHER:**

Example: Churn Risk Prediction Builder model scores every customer 0-100

NBA Strategy logic:
- IF Churn Risk Score > 70 → show "Emergency Retention Call" recommendation
- IF Churn Risk Score 40-70 → show "Quarterly Check-In" recommendation
- IF Churn Risk Score < 40 → show "Expansion Opportunity" recommendation

Result: The rep sees the exact right recommendation based on the AI-calculated risk level — without having to read the score themselves

**Key insight:** Prediction Builder generates intelligence. NBA surfaces actionable guidance based on that intelligence.

**Speaker Notes:** "These features are designed to work together, and exam questions sometimes test whether you understand the relationship. Prediction Builder's output is a score — it tells you something important about a record. But a score sitting on a record is only useful if a rep notices it and knows what to do about it. NBA is the bridge between the score and the action. Your Prediction Builder model says 'this customer is 78% likely to churn.' Your NBA Strategy says: when that score is over 70, surface the 'Emergency Retention Intervention' recommendation to the account manager. The rep doesn't have to know what churn prediction is — they just see the urgent recommendation and take action."

---

### Slide 10: Exam Tips — Quick Reference
**Visual:** Bulleted list with bold trigger words.
**Content:**
**NBA exam vocabulary:**
- "Next Best Action" or "NBA" = the feature name
- "Recommendation" = the Salesforce OBJECT that stores what to suggest
- "Strategy" = the logic engine that decides what to show
- "Einstein Next Best Action component" = the Lightning component placed on the record page

**Exam scenarios to recognize:**
- Scenario involves contextual suggestions on records → NBA
- Scenario asks about the logic engine for recommendations → Strategy
- Scenario asks about where to display recommendations → Lightning App Builder
- Scenario mentions learning from accepted/declined actions → Einstein ML in NBA
- Scenario combines a prediction score with a surfaced action → Prediction Builder + NBA integration

**Key distinction:** NBA surfaces recommendations. Agentforce takes autonomous action. Both can appear in the same org.

**Speaker Notes:** "The last point is key. NBA and Agentforce both 'do things' but in completely different ways. NBA surfaces a RECOMMENDATION and a human DECIDES to act on it. Agentforce acts autonomously without a human decision. If an exam question says 'automatically resolve the customer's issue without rep involvement,' that's Agentforce. If it says 'suggest the best next action for the rep to take,' that's NBA. Human in the loop = NBA. Fully autonomous = Agentforce."

---

## RECORDING SCRIPT

[Opening — 0:00-1:30]

"Think about the last time you called a customer support line and the agent came back after a pause and said: 'Based on your account, I'd like to offer you a free month of service as an apology for your experience.' That agent didn't just make that decision on the fly. They were probably looking at a screen that said: 'This customer has been with us 7 years, just had their third support issue this month, and their contract renews in 60 days. OFFER: Free month credit.' The system told them what to do. They just did it.

That's Next Best Action. It's the CRM surfacing the right recommendation at the right moment so the human can take smart action without having to analyze the situation from scratch. For a rep with 200 accounts or an agent handling 80 cases a day, that guidance is the difference between a good customer experience and a lost customer."

[Components explanation — 1:30-6:00]

"Next Best Action has three core building blocks. Let me explain each one with a real restaurant analogy, because I think it makes the system click.

The Recommendation Object is your MENU. In a restaurant, the menu is the complete list of everything the kitchen can serve. In NBA, the Recommendation object is the complete catalog of everything you might ever suggest to a rep: 'Offer loyalty discount,' 'Schedule QBR,' 'Flag for executive review,' 'Suggest premium upgrade,' 'Create renewal opportunity.' Each one is a Recommendation record. You have to build this catalog before you can show anything.

The Strategy is your CHEF. The chef doesn't just read the entire menu to every customer. They look at who's sitting at the table — are they a vegetarian? Celebrating something? On a budget? — and decide what to RECOMMEND from the menu for this specific person right now. The Strategy is the logic that looks at the record in front of it and decides which Recommendations from the catalog apply, and in what order. It uses business rules AND Einstein ML scoring to rank them.

The Lightning Component is your SERVER. The server is the interface between the kitchen and the customer. They bring the food to the table in a way that's presentable and actionable. The Einstein Next Best Action Lightning Component is placed on the record page in Lightning App Builder. It's what the rep actually sees — the cards, the buttons, the reason text. When the rep opens an Account, the component fires, calls the Strategy, gets back a ranked list, and displays the top recommendations as cards.

Three pieces: Recommendation (menu), Strategy (chef), Component (server). Build all three and you have a working NBA setup."

[Rules vs. ML — 6:00-9:00]

"Let me talk about the two approaches to NBA logic, because this is where the exam gets nuanced.

Rule-based NBA is explicit business logic. You write conditions: IF the account hasn't been contacted in 30 days AND they have an open renewal in the next 90 days AND their account health score is below 60, THEN show the 'Proactive Renewal Call' recommendation. These rules are predictable, transparent, and easy to audit. You know exactly why a recommendation is appearing. The limitation is maintenance — as your business changes, someone has to update the rules. And rules can't capture complex patterns that are hard to articulate as explicit logic.

Einstein-enhanced NBA adds machine learning on top of your rules. Once you've been running NBA for a while, Einstein starts watching: which recommendations get accepted? Which get declined? What's different about the records where reps accepted recommendation A versus recommendation B?

Over time, Einstein develops a ranking model. Even when two recommendations both pass your rules — both qualify for this record — Einstein can say: 'Based on similar situations in the past, this customer profile historically accepts recommendation A 73% of the time and recommendation B only 28% of the time. Show A first.'

The practical result: your NBA gets smarter over time without you having to update the rules. The rep's experience improves. Acceptance rates go up. And you learn something about your customers from the pattern data.

For the exam: rule-based = explicit IF/THEN conditions. ML-enhanced = learns from acceptance/rejection history, adapts rankings over time."

[Integration and closing — 9:00-12:00]

"One pattern that comes up in exam questions is the combination of Prediction Builder and Next Best Action. Let me show you how these two features work together.

Imagine you have a Prediction Builder model that scores every Account by churn risk — a score from 0 to 100. High score means high risk. You can use that score as a condition in your NBA Strategy. 

Your Strategy might say: Load all Retention Recommendations. Filter: if Churn Risk Score greater than 70, show 'Emergency Retention Outreach.' If Churn Risk Score between 40 and 70, show 'Friendly Check-In.' If below 40, show 'Expansion Opportunity.' 

Now the rep doesn't have to look at the churn risk field and think about what it means. They just open the account and see exactly what action is appropriate for THIS customer's risk level. The AI did the analysis. NBA surfaced the action.

That's the design principle: AI generates intelligence, NBA translates that intelligence into human-readable action guidance, humans execute.

And that brings me to the most important NBA vs. Agentforce distinction for the exam. Both NBA and Agentforce involve 'actions.' But there's a fundamental difference. NBA says: 'Here's what I recommend you do. You decide.' Agentforce says: 'I'm going to do it.' NBA keeps a human in the decision loop. Agentforce operates autonomously. If an exam question describes an automated process that runs without human approval — that's Agentforce. If a rep sees a recommendation and chooses to accept it — that's NBA.

In your exam, you'll see scenario questions that describe a sales or service situation and ask which feature handles it. Next Best Action = contextual recommendations surfaced to humans, who decide whether to act. Everything about NBA has a human in the loop."

---

## EXAM TIPS
- NBA has three core components: Recommendation object (catalog of suggestions), Strategy (logic engine), Lightning Component (UI on the record page).
- Recommendations are configured as Salesforce objects — they are not created in Flow or Process Builder.
- Strategies are built in a visual builder that combines filter/branch logic with optional Einstein ML scoring.
- Einstein NBA learns from acceptance/rejection data — this is how it gets smarter over time.
- NBA + Prediction Builder integration: use a prediction score as a filter condition in your Strategy.
- KEY DISTINCTION: NBA surfaces recommendations → humans decide. Agentforce acts autonomously.
- The Lightning Component is added to record pages via Lightning App Builder (no code required).
- NBA works across all clouds — Sales, Service, Community (Experience Cloud), custom pages.

---

## LECTURE SUMMARY
- Next Best Action (NBA) surfaces contextual recommendations on Salesforce record pages for reps and agents to act on
- Three components: Recommendation object (what to suggest), Strategy (when and why to suggest it), Lightning Component (where it displays)
- Strategies can be purely rule-based or enhanced with Einstein ML that learns from historical acceptance/rejection data
- NBA and Prediction Builder work together — prediction scores can drive NBA recommendation logic
- Critical distinction: NBA is human-guided (surfaces suggestions), Agentforce is autonomous (takes action without human decision)
- Configured entirely in Salesforce Setup and Lightning App Builder — no code required for standard implementations

---

## MINI QUIZ

**Question 1:**
A Salesforce admin is setting up Next Best Action for the sales team. They have defined five possible recommendations (e.g., "Offer 10% Discount," "Schedule Executive Briefing," "Assign to Partner"). What component determines which of these recommendations to display on a specific Opportunity record and in what priority order?

A) The Einstein Next Best Action Lightning Component  
B) The Recommendation Strategy  
C) The Recommendation Object  
D) Einstein Prediction Builder

**Answer: B — The Recommendation Strategy**

*Explanation:* The Recommendation Strategy is the logic engine that evaluates the current record's data and determines: (1) which recommendations from the catalog are relevant to this specific record, and (2) in what order to rank/display them. The Recommendation Object stores the CONTENT of each recommendation (what to suggest and what happens when accepted), but does not contain the selection logic. The Lightning Component is the UI that displays results — it doesn't contain the logic. Prediction Builder scores records but is not the mechanism that selects or ranks recommendations. The Strategy is always the answer for "which logic determines what to display."

---

**Question 2:**
An admin has been running Next Best Action for 6 months and notices that reps often accept "Schedule QBR" recommendations but almost always decline "Offer Upgrade" recommendations. If Einstein ML is enabled on the NBA Strategy, how will this affect future recommendations?

A) Einstein will remove the "Offer Upgrade" recommendation from the catalog  
B) Einstein will flag the "Offer Upgrade" recommendation for admin review  
C) Einstein will learn to rank "Schedule QBR" higher than "Offer Upgrade" for similar future records  
D) Einstein will disable rule-based filtering and use only ML-based recommendations

**Answer: C — Einstein will learn to rank "Schedule QBR" higher than "Offer Upgrade" for similar future records**

*Explanation:* When Einstein ML is enabled in a NBA Strategy, it tracks acceptance and rejection data over time. When reps consistently accept one recommendation and decline another, Einstein learns to rank the accepted recommendation higher for similar future situations. It does NOT delete or disable recommendations (A is wrong) — the admin retains control over the catalog. It does NOT flag for review (B is wrong) — it adapts automatically. It does NOT override rule-based filtering (D is wrong) — Einstein ML enhances the ranking after rules have been applied. The result is that over time, Einstein's ranking improves acceptance rates without the admin having to manually update logic.

---

**Question 3:**
A company wants to automatically take action on high-value leads that meet certain criteria — researching the company, drafting and sending a personalized outreach email, and booking a meeting — all without a sales rep being involved. Which Salesforce feature should they use?

A) Einstein Next Best Action  
B) Einstein Prediction Builder  
C) Agentforce SDR Agent  
D) Prompt Builder with a Sales Email template

**Answer: C — Agentforce SDR Agent**

*Explanation:* The key phrase is "without a sales rep being involved" — this is autonomous action, not a recommendation for a human to act on. NBA surfaces suggestions that humans decide to act on — it does not autonomously send emails or book meetings. Prediction Builder scores leads but does not take action. Prompt Builder drafts email content but does not send it or book meetings autonomously. The Agentforce SDR Agent is specifically designed for autonomous lead qualification and outreach — it researches prospects, drafts and sends personalized emails, and schedules meetings without human intervention. Autonomous multi-step action = Agentforce.
