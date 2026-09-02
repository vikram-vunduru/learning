# Flow and Apex Actions

## Exam Domain
Building Agentforce Agents — ~25% of exam weight

## Core Concepts

### Flow Action Requirements (Critical — Memorize This)
Every one of these must be true for a Flow to work as an Agentforce Action:

| Requirement | Detail |
|------------|--------|
| **Flow type** | Autolaunched Flow (NOT Screen Flow, NOT Schedule-Triggered, NOT Record-Triggered) |
| **Flow status** | Active (Draft flows don't appear in Action picker) |
| **Input variables** | "Available for Input" checkbox must be checked on each variable Atlas needs to pass |
| **Output variables** | "Available for Output" checkbox must be checked on each variable Atlas needs to read |
| **No user interaction** | Flow cannot have Screen elements, wait elements, or pause elements |

Screen Flows are the #1 technical blocker in new Agentforce implementations. When a customer says "we have Flows for our business processes," the first question is always "are they Autolaunched?"

### Building a Flow Action — Step by Step
1. In Flow Builder, create a new flow
2. Choose "Autolaunched Flow (No Trigger)" as the type
3. Add input variables (e.g., `orderNumber`) — in Variable settings, check "Available for Input"
4. Add output variables (e.g., `orderStatus`, `deliveryDate`, `errorMessage`) — check "Available for Output"
5. Build the logic (Get Records, Create Records, DML, callouts, etc.)
6. Save and Activate the Flow
7. In Agentforce Studio → Topic → Add Action → Select Flow → choose this Flow
8. Map parameters: Atlas can get them from conversation context, user input, or agent context

### Parameter Sources in Agentforce Action Builder
When you wire up a Flow Action in Agentforce Studio, you can specify where Atlas gets each input parameter from:
- **Conversation context:** Extract from what the user said or asked (Atlas extracts based on Action description)
- **User Input:** Atlas explicitly asks the user for this value
- **Agent/Session context:** From the current user session (e.g., logged-in user's Account ID)

The Action description tells Atlas which inputs it needs to extract. The "Required inputs" line in the Action description is what cues Atlas to ask a clarifying question if the input isn't available.

### Apex Action Requirements
Apex must use the `@InvocableMethod` annotation. Each parameter that Atlas can pass in or read out must use `@InvocableVariable`.

```java
public class OrderStatusAction {
    @InvocableMethod(
        label='Get Order Status'
        description='Returns order status and ETA for a given order number'
    )
    public static List<Result> getOrderStatus(List<Request> requests) {
        // Implementation
    }

    public class Request {
        @InvocableVariable(required=true label='Order Number')
        public String orderNumber;
    }

    public class Result {
        @InvocableVariable(label='Order Status')
        public String orderStatus;

        @InvocableVariable(label='Estimated Delivery')
        public String estimatedDelivery;

        @InvocableVariable(label='Error Message')
        public String errorMessage;
    }
}
```

Key notes on the code:
- `required=true` on InvocableVariable: Atlas must provide this input; if missing, it will ask
- `required=false`: optional input; Action can run without it
- The method takes `List<Request>` and returns `List<Result>` — this is the standard invocable pattern (bulk-safe)
- The `description` in `@InvocableMethod` is visible in Agentforce Studio; write it clearly

### Error Handling in Flow and Apex Actions
Atlas **observes** the result of an Action, including errors. If an Action throws an unhandled error, Atlas must reason about what to do next (it can't recover gracefully if it has nothing to work with).

**Flow error handling:**
- Always add a **Fault Path** on every DML element and callout element
- Fault path should set the output `errorMessage` variable to a meaningful message
- Example: Fault path assigns: `errorMessage = "We couldn't retrieve your order status. Please try again or contact support."`

**Apex error handling:**
- Wrap logic in try/catch
- On catch, set `errorMessage` on the Result object (don't throw exception; return the error message gracefully)
- Atlas reads the error message and can generate a helpful user response

### Flow vs Apex Decision Guide
| Scenario | Use |
|---------|-----|
| Standard Salesforce data queries (Get/Create/Update Records) | Flow |
| Multi-step sequences with conditional logic | Flow |
| External callouts (HTTP to non-Salesforce API) | Apex |
| Complex business logic with precise calculations | Apex |
| Reusing existing @InvocableMethod library | Apex |
| Transformation/aggregation logic (multiple queries combined) | Apex |
| Non-technical team maintains the automation | Flow |
| Precise control over error handling required | Apex |

General rule: **prefer Flow** for anything that can be done in Flow. Use Apex only when Flow genuinely can't handle it. Flow is more maintainable by admins; Apex requires developers.

## PTA / SA Relevance

### Flow Assessment in a Customer Org
Before building agent actions, audit the customer's existing Flows:
1. Identify all Flows that implement operations the agent would need (order lookup, case creation, status checks)
2. Check if they are Autolaunched — if Screen Flow, they need to be rebuilt as Autolaunched variants
3. Check input/output variable configuration — "Available for Input/Output" is often not checked because it wasn't needed before
4. Check for fault paths — many customer Flows were built without error handling

This audit typically finds that 20–30% of existing Flows can be reused with minor modifications, saving significant build time.

### Flow Conversion Pattern
When a customer has a Screen Flow for a process that needs to become an agent Action:
- **Do NOT convert the Screen Flow** — Screen elements need human interaction
- **Build a parallel Autolaunched Flow** for the same backend logic (minus the screen elements)
- Keep the Screen Flow intact for when human agents use it in Lightning Experience
- The Autolaunched version handles the same data operations without the UI

Many implementations end up with pairs: one Autolaunched version (for the agent) and one Screen version (for human agents in Lightning).

### Apex InvocableMethod Best Practices for Enterprise Implementations
- **Always handle bulkification:** Methods receive a List; even though the agent typically passes one record, bulk-safe code is required for deployment
- **Add meaningful error messages:** "Record not found" is not helpful to Atlas. "Order #12345 could not be found. Please verify the order number." is actionable.
- **Log callouts/errors:** Use Platform Events or custom logging objects to track Apex Action execution separately from agent conversation logs
- **Test class coverage:** Required for deployment; test both happy path and error path scenarios

### When to Use Flow vs Apex in Agent Context
From production implementations:
- **80% of Agent Actions are Flows** — most use cases involve standard Salesforce data operations
- **Apex preferred for:** External system integrations (ERPs, custom APIs), complex multi-object queries with aggregation, performance-sensitive operations where a single SOQL query is more efficient than multiple Flow Get Records elements
- **Never use @Future or Batch from InvocableMethod context** — Atlas waits synchronously for the Action result; async methods won't work correctly

## Architecture

### Flow Action Configuration in Agentforce Studio
```
Agentforce Studio → Agent → Topics → [Topic] → Actions → Add Action

Step 1: Select Action Type
    ○ Flow  ● Selected
    ○ Apex
    ○ Prompt Template
    ○ Knowledge Search

Step 2: Select Flow
    [Only Active Autolaunched Flows appear in picker]
    Search: "Get_Order_Status"
    Select: ✓ Get_Order_Status (v3)

Step 3: Configure Action Details
    Action Label: "Get Order Status"
    Action Description: [write 3-part description here]

Step 4: Map Input Parameters
    Input: orderNumber
    ┌─────────────────────────────────────────────┐
    │ Source: Conversation Context                 │
    │ (Atlas extracts from what user said)         │
    │                                             │
    │ OR Source: User Input                        │
    │ (Atlas explicitly asks user)                 │
    │                                             │
    │ OR Source: Agent Context                     │
    │ (from session/user profile data)             │
    └─────────────────────────────────────────────┘

Step 5: Save Action
```

**Limitations:**
- Only Active Flows appear — must activate Flow before it's selectable
- Input/Output "Available" checkboxes must be set in Flow Builder — cannot be changed in Agentforce Studio
- Each Action parameter mapping is static at configuration time — Atlas decides which value to pass based on description and conversation, but the parameter name is fixed

### Autolaunched Flow Anatomy for Agent Actions
```
[Start] (Autolaunched — No Trigger)
    │
    ▼
[Input Variables]
    orderNumber: Text, Available for Input ✓
    │
    ▼
[Get Records: Order]
    WHERE OrderNumber = {!orderNumber}
    Store: singleRecord → orderRecord
    │
    ├── FAULT PATH ──────────────────────────────────────┐
    │                                                    │
    ▼                                                    ▼
[Assignment: outputs]                          [Assignment: errorMessage]
    orderStatus = {!orderRecord.Status}            errorMessage = "Order not found"
    deliveryDate = {!orderRecord.ShipDate}              │
    errorMessage = ""                                   │
    │                                                   │
    ▼                                                   ▼
[End]                                               [End]

[Output Variables]
    orderStatus: Text, Available for Output ✓
    deliveryDate: Date, Available for Output ✓
    errorMessage: Text, Available for Output ✓
```

**Limitations:**
- Flow input/output variables must be primitive types (Text, Number, Date, Boolean) or sObject — complex nested types require Apex
- No Screen elements allowed — removes any possibility of user interaction steps in the Flow
- Flow runs in System context unless "Run Flow As" is configured — be aware of record access implications
- Fault path must be explicitly added — unconfigured faults propagate as unhandled exceptions to Atlas

### Apex Action End-to-End
```
@InvocableMethod on Apex class
        │
        ▼
Agentforce Studio: Add Apex Action
    ← shows @InvocableMethod classes available →
        │
        ▼
Map parameters in Studio
    (same source options: conversation, user input, session)
        │
        ▼
At runtime: Atlas invokes method via InvocableMethod framework
    Request object populated with extracted values
        │
        ▼
Apex runs (sync, within governor limits)
        │
        ▼
Result object returned to Atlas
    Atlas reads output variables
        │
        ▼
Atlas observes result → Reason → Respond
```

**Limitations:**
- Must run synchronously — async (@Future, Queueable, Batch) won't return results to Atlas
- Governed by Salesforce governor limits per transaction — callouts, SOQL rows, heap
- @InvocableMethod cannot be called from another @InvocableMethod (no chaining) — design as independent units
- Must be in a global or public class accessible to the running user context

## Key Facts to Memorize
- Flow Action: **Autolaunched only** (NOT Screen)
- Flow must be **Active** — Draft doesn't appear in picker
- Input variables: **"Available for Input" checked**
- Output variables: **"Available for Output" checked**
- Apex: must use **@InvocableMethod** annotation
- Apex params: must use **@InvocableVariable** annotation
- Always add Fault Paths on Flow DML/callout elements
- Wrap Apex in try/catch, return errorMessage in Result, don't throw
- Parameter sources: Conversation Context, User Input, Agent/Session Context
- Prefer Flow for standard data ops; use Apex for callouts and complex logic

## Customer Advisory Tips
- **Build a Flow testing wrapper:** Create a test record set and a simple Screen Flow that lets admins invoke the Autolaunched Flow with test inputs and see outputs. This makes iterative testing faster than running through the agent simulator every time.
- **Document the input/output contract:** For every agent Flow/Apex Action, document the input parameter names, types, and whether required/optional, plus all output fields. This becomes the spec for agent Action descriptions and makes onboarding new developers faster.
- **Audit existing Flows before building new ones:** In mature orgs, there are often existing Flows that do the same data operations. Reuse (with "Available for Input/Output" modifications) before building new. Reduces org complexity.
- **Error message quality is UX:** The errorMessage your Flow or Apex returns is what Atlas uses to generate the user-facing error response. "Error: null pointer" is not a good user experience. "We couldn't find an order with that number. Please check the number and try again." is.

## Exam Traps
- Screen Flows cannot be agent Actions — the most common wrong answer in build-related questions
- Draft Flows don't appear in the Action picker — must be Active
- "Available for Input" and "Available for Output" checkboxes — both must be explicitly enabled; they are NOT checked by default
- @InvocableMethod method signature must take List and return List — not single objects
- Async Apex (@Future, Queueable, Batch) cannot be called synchronously from InvocableMethod context and will not return results to Atlas

## Practice Questions
**Q:** A developer creates an Autolaunched Flow and activates it, but it doesn't appear in the Agentforce Action picker. What is the most likely cause?
**A:** The Flow input/output variables don't have "Available for Input"/"Available for Output" checked — or the Flow is not Autolaunched type. Most commonly: the variable availability checkboxes weren't set.

**Q:** Atlas invokes an order lookup Flow Action. The order doesn't exist. The Flow throws an unhandled fault. What happens?
**A:** Atlas observes an error result and must try to reason about recovery — but without a meaningful error message, it may respond generically or get stuck. Best practice: add a Fault Path that sets an errorMessage output variable with a clear, user-friendly message.

**Q:** What type of Apex annotation is required for a method to be callable as an Agentforce Action?
**A:** @InvocableMethod on the method, and @InvocableVariable on each input/output parameter.

**Q:** A customer has a Screen Flow that their support reps use to process returns. They want the Agentforce agent to also process returns. What is the correct approach?
**A:** Build a parallel Autolaunched Flow that contains the same backend data logic without Screen elements. Keep the Screen Flow for human agents in Lightning. Both Flows run the same operations; only the delivery mechanism differs.
