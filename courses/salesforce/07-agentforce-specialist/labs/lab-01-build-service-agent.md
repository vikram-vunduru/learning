# Lab 01 — What You Need to Be Able to Do: Build a Basic Service Agent

## What This Tests
Building a Service Agent from scratch: Knowledge grounding + Flow Action + testing in the simulator. Covers ~50% of the "Building Agents" exam domain in practice.

## Prerequisites
- [ ] Salesforce Developer Edition org with Agentforce enabled
- [ ] Einstein Knowledge enabled in the org
- [ ] Basic familiarity with Flow Builder

---

## Part 1 — Knowledge Setup

### Create Knowledge Articles
- [ ] Navigate to: App Launcher → Knowledge
- [ ] Create at least two articles:
  - **Article 1:** "Shipping and Delivery Policy"
    - Body: include shipping timeframes, carrier info, free shipping threshold
    - Data Category: assign to a category (e.g., "Order and Shipping")
    - Status: Published
  - **Article 2:** "Return and Refund Policy"
    - Body: include return window, eligible items, refund timeline
    - Data Category: assign appropriately
    - Status: Published
- [ ] Confirm both articles are published and searchable
- [ ] Know: Knowledge Search Action requires Published articles to retrieve them

---

## Part 2 — Build the Flow Action

### Create an Autolaunched Flow: `Agent_Get_Order_Status`
- [ ] Go to: Setup → Flows → New Flow
- [ ] Select: **Autolaunched Flow (No Trigger)** — NOT Screen Flow
- [ ] Add input variable:
  - Name: `orderNumber`
  - Type: Text
  - **Check: Available for Input** ← critical
- [ ] Add Get Records element:
  - Object: Order
  - Filter: OrderNumber = `{!orderNumber}`
  - Store: Single record → variable `orderRecord`
- [ ] Add Fault Path on Get Records element:
  - Fault Path Assignment: `errorMessage` = "Order not found. Please verify your order number."
- [ ] Add output variables (Available for Output checked for each):
  - `orderStatus` (Text): assigned `{!orderRecord.Status}`
  - `estimatedDelivery` (Date): assigned `{!orderRecord.EstimatedDeliveryDate__c}`
  - `errorMessage` (Text): assigned `""` (empty on success path)
- [ ] Save → Activate
- [ ] Verify: Flow appears in Action picker only after activation

**Why this matters for the exam:**
- Screen Flow = fails; Autolaunched = works
- "Available for Input/Output" not checked = Atlas can't pass/read values
- No Fault Path = unhandled errors bubble up to Atlas with no useful message

---

## Part 3 — Build the Service Agent

### Create the Agent
- [ ] Go to: Setup → Agentforce → Agents → New Agent
- [ ] Select template: **Service Agent**
- [ ] Name: `Aria`
- [ ] Company: [your test company name]
- [ ] Complete setup wizard:
  - Step 1 (Data Sources): Link your Knowledge base
  - Step 2 (Topics): Select pre-built topic templates (or skip — you'll customize)
  - Step 3 (Escalation): Select or create an Omni-Channel queue
  - Step 4 (Channel): Select Embedded Chat (or API for testing)

### Configure Identity
- [ ] Name: `Aria`
- [ ] Persona tone: Friendly and professional

### Configure Instructions
- [ ] Persona section: "You are Aria, a friendly and professional customer service assistant for [Company]. You respond concisely and empathetically."
- [ ] Behavioral rules: "Always greet the user if this is the first message. Keep responses under 150 words unless more detail is requested."
- [ ] Escalation guidance: "Escalate to a human agent when: the customer is repeatedly frustrated, asks for a supervisor, or has an issue you cannot resolve with available information."
- [ ] Exclusions: "Do not discuss competitor products or make commitments about pricing exceptions."

---

## Part 4 — Configure Topics

### Topic 1: Product and Policy Information
- [ ] Label: `Product and Policy Information`
- [ ] Description: "This topic handles questions about product specifications, shipping policies, return policies, and general order information. Activate when a customer asks about policies, how shipping works, return windows, or refund procedures. Do NOT activate for specific order status lookups or billing disputes."
- [ ] Add Action: Knowledge Search
  - Description: "Searches Knowledge for product information, shipping policies, return and refund policies."
  - Configure relevance threshold: 0.5–0.6

### Topic 2: Order Inquiry
- [ ] Label: `Order Inquiry`
- [ ] Description: "This topic handles requests for specific order status, estimated delivery dates, and order tracking. Activate when a customer provides an order number or asks where a specific order is. Do NOT activate for policy questions or returns processing."
- [ ] Add Action 1: Get Order Status (Flow Action)
  - Select your `Agent_Get_Order_Status` Flow
  - Description: "Retrieves the current status and estimated delivery date for a specific order. Call when the customer asks about order status, tracking, or delivery date. Requires the order number — ask if not provided."
  - Map input: `orderNumber` → Conversation Context
- [ ] Add Action 2: Knowledge Search
  - Description: "Searches for general order management and shipping FAQs."

---

## Part 5 — Test in Simulator

### Run These Six Test Scenarios
For each, note: which Topic was selected, which Action was invoked, was the response correct?

- [ ] **Happy path:** "What is the status of order #12345?"
  - Expected: Order Inquiry Topic → Get Order Status Action → returns status

- [ ] **Alternate phrasing:** "Where's my stuff? My order number is 12345"
  - Expected: same routing as above

- [ ] **Missing parameter:** "What's my order status?"
  - Expected: Agent asks for order number (clarifying question)

- [ ] **Policy question:** "What is your return policy?"
  - Expected: Product and Policy Topic → Knowledge Search → returns policy content

- [ ] **Out of scope:** "What's the weather in New York today?"
  - Expected: Out-of-scope response; agent declines and offers to help with something else

- [ ] **Escalation trigger:** "I've asked three times and nobody helps me. I want to speak to a manager."
  - Expected: Empathetic acknowledgment + escalation to Omni-Channel queue

### For each test:
- [ ] Check the Reasoning Trace (expand trace in simulator)
- [ ] Verify correct Topic selection
- [ ] Verify correct Action selection
- [ ] Verify response quality and accuracy

---

## What You Must Be Able to Do for the Exam
- [ ] Identify why a Screen Flow fails as an Agent Action
- [ ] State the three Flow requirements: Autolaunched, Active, Available for Input/Output
- [ ] Explain what "Available for Input/Output" does and where to set it
- [ ] Write a three-part Topic description (what / when / exclusions)
- [ ] Write a three-part Action description (what / when / required inputs)
- [ ] Use the Reasoning Trace to identify routing failures
- [ ] Explain the difference between a Knowledge Search Action and a Flow Action
- [ ] Add a Fault Path to a Flow and set a meaningful error message output
