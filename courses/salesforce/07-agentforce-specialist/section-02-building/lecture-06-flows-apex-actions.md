# Lecture 06: Wiring Flows and Apex as Agent Actions

## Learning Objectives
- Configure an Autolaunched Flow as an Agentforce Action, including correct variable settings
- Write `@InvocableMethod` Apex that can be used as an Agentforce Action, with proper `@InvocableVariable` input and output classes
- Map conversation-extracted parameters to Flow and Apex input variables using the Action configuration
- Write Action descriptions that enable Atlas to correctly extract parameters from conversation context
- Identify common configuration errors when wiring Flows and Apex to agent Actions

## Slides

### Slide 1: Why Flows and Apex Are the Workhorses
**Visual:** A capability wheel showing the four action types with size proportional to frequency of use. Flow Action is the largest segment (~50%), Apex Action is second (~25%), Prompt Template is third (~15%), Knowledge Search is smallest (~10%). Annotation: "Most Salesforce orgs have existing Flows and Apex — agent Actions reuse this investment."
**Content:**
- Flows and Apex actions are the primary mechanism for agents to **interact with Salesforce data and trigger business logic**
- Most Salesforce orgs already have Autolaunched Flows and `@InvocableMethod` Apex from existing automation — these can often be wired to agent Actions with minimal modification
- Flow Actions are preferred when: the logic is accessible to admins, the operation can be expressed declaratively, no complex error handling is needed
- Apex Actions are preferred when: logic requires imperative code, the operation involves complex calculations, HTTP callouts are needed, or bulk processing is required
- The data model is the same: both receive input from Atlas, execute logic, and return output to Atlas
**Speaker Notes:** The "reuse existing automation" message is important. When presenting Agentforce to a customer, one of the most compelling value propositions is that their existing Flows become agent capabilities with minimal rework. If an admin built a "Create Case" Flow last year, they can expose that Flow as an agent Action today. The only changes typically needed are making input/output variables available to the platform. This dramatically reduces the time-to-value for an Agentforce deployment.

### Slide 2: Flow Requirements for Agent Actions
**Visual:** A checklist diagram with a Flow icon in the center and five requirement boxes connected by arrows. Each box shows the requirement and a green checkmark if met / red X if not. Requirements: (1) Flow Type: Autolaunched ✓ / Screen Flow ✗, (2) Status: Active ✓ / Draft ✗, (3) Input vars: "Available for Input" checked ✓ / unchecked ✗, (4) Output vars: "Available for Output" checked ✓ / unchecked ✗, (5) API name unique and stable ✓ / changes break Action ✗.
**Content:**
- **Flow Type:** Must be **Autolaunched Flow** — Screen Flows require a UI and cannot be invoked headlessly
- **Status:** Must be **Active** — Agentforce cannot invoke a draft or inactive Flow
- **Input Variables:** Variables the Flow expects from Atlas must have **"Available for Input" checked** in the variable's properties
- **Output Variables:** Variables the Flow returns to Atlas must have **"Available for Output" checked** in the variable's properties
- **Variable Descriptions:** Each input/output variable should have a **Description** filled in — Atlas uses this to understand what each variable holds and how to extract/present values
- **API Name stability:** If you change a Flow's API name or variable names after the Action is configured, you must update the Action mapping — changes break silently and are hard to debug
**Speaker Notes:** The three most common mistakes when wiring a Flow are: using a Screen Flow instead of Autolaunched, forgetting to check "Available for Input/Output" on variables, and using a Flow that is in Draft status. All three result in the Action failing silently — the agent may return a vague error or say it cannot help, with no clear indication of the root cause. Always verify these three things first when debugging a Flow Action that is not working. For the exam, these requirements appear frequently as scenario questions: "A developer created a Flow action but the agent reports it cannot complete the task — what is the most likely cause?" Answer: one of these three missing requirements.

### Slide 3: Building a Flow for Agent Use — Step by Step
**Visual:** Flow Builder screenshot mockup showing an Autolaunched Flow with: Start element → Get Records element (queries Order__c by Id) → Assignment element (populates output variables) → End. Sidebar shows variable panel with two variables highlighted: (1) orderId (Text, Input, Available for Input, Description: "The Salesforce ID or order number of the order to look up") and (2) orderStatus (Text, Output, Available for Output, Description: "The current fulfillment status of the order").
**Content:**
- **Step 1:** Create a new Flow → Select "Autolaunched Flow (No Trigger)"
- **Step 2:** Create input variables for each piece of data the agent will pass in (e.g., `orderId`)
  - Data Type: match what Atlas will extract (Text, Number, Boolean, etc.)
  - Check "Available for Input"
  - Add a Description — this helps Atlas understand what value to pass
- **Step 3:** Build the Flow logic — Get Records, Update Records, Create Records, Decision, Assignment
- **Step 4:** Create output variables for data the Flow returns to Atlas (e.g., `orderStatus`, `estimatedDelivery`)
  - Check "Available for Output"
  - Add a Description
- **Step 5:** Activate the Flow
- **Step 6:** In Agentforce Builder, add a Flow Action to your Topic, search for the Flow by name, and map variables
**Speaker Notes:** The key practice habit here is variable naming and descriptions. For Atlas to successfully extract a parameter like an order number from "I'd like to know about order 12345," the input variable's description should say something like "The order number provided by the customer." This tells Atlas which piece of information from the conversation should be passed to this variable. Without that description, Atlas has to guess — and it may pass the customer's name instead of the order number. Get in the habit of describing every variable as if explaining it to a person who has no context about the Flow.

### Slide 4: `@InvocableMethod` Anatomy for Agentforce
**Visual:** Apex code editor showing a complete, well-structured `@InvocableMethod` class. Key elements highlighted with colored annotations: `@InvocableMethod(label='Get Customer Tier' description='Retrieves the loyalty tier for a customer given their account ID. Returns tier name and associated benefits.')` annotation (gold), inner class `Request` with `@InvocableVariable` annotated fields (blue), inner class `Result` with `@InvocableVariable` annotated fields (green), method signature `public static List<Result> execute(List<Request> requests)` (red).
**Content:**
```apex
public class GetCustomerTierAction {

    @InvocableMethod(
        label='Get Customer Tier'
        description='Retrieves the loyalty tier for a customer by Account ID. Returns the tier name and a list of associated benefits. Use when a customer asks about their membership level or rewards status.'
    )
    public static List<Result> execute(List<Request> requests) {
        List<Result> results = new List<Result>();
        for (Request req : requests) {
            Account acc = [SELECT Loyalty_Tier__c, Tier_Benefits__c
                           FROM Account WHERE Id = :req.accountId LIMIT 1];
            Result res = new Result();
            res.tierName = acc.Loyalty_Tier__c;
            res.benefits = acc.Tier_Benefits__c;
            results.add(res);
        }
        return results;
    }

    public class Request {
        @InvocableVariable(label='Account ID' description='The Salesforce Account ID of the customer' required=true)
        public Id accountId;
    }

    public class Result {
        @InvocableVariable(label='Tier Name' description='The name of the customer loyalty tier')
        public String tierName;
        @InvocableVariable(label='Tier Benefits' description='A description of benefits included in this tier')
        public String benefits;
    }
}
```
**Speaker Notes:** The `description` property on `@InvocableMethod` is the key field for Agentforce — it is what Atlas reads to decide whether to invoke this action. It should follow the same pattern as a good Action description: what it does, when to use it, and what inputs it needs. The `@InvocableVariable` `description` properties on the Request class fields are what Atlas uses to understand what values to extract from the conversation and pass as inputs. Do not skip these descriptions — they are the bridge between natural language conversation and structured code inputs.

### Slide 5: Mapping Parameters in Agentforce Builder
**Visual:** Agentforce Builder Action configuration panel showing a Flow Action configuration. Left side: "Inputs" section with two rows — "orderId" and "customerId" with an "Agent collects from conversation" indicator. Right side: "Outputs" section with three rows — "orderStatus," "deliveryDate," "trackingNumber" with "Available to Agent" indicators. Center: an "Action Description" text area with the description text visible. A "Test Action" button is visible at the bottom.
**Content:**
- After selecting a Flow or Apex action in Agentforce Builder, you see an **Input/Output Mapping** panel
- **Input sources available for each input parameter:**
  - "Agent extracts from conversation" — Atlas pulls the value from what the user said
  - "From prior Action output" — uses a value returned by a previous Action in the same reasoning loop
  - "Static value" — always passes the same hardcoded value (use for constants)
- For "Agent extracts from conversation": Atlas uses the variable's description plus the Action description to know what to look for
- **Outputs** are automatically made available to Atlas — they feed into the next reasoning step or the final response composition
- **Test the Action** using the Builder's testing panel to verify parameter extraction before adding to a live Topic
**Speaker Notes:** The input source configuration is a nuanced area that can appear on the exam. "Agent extracts from conversation" is the most common — the customer says their order number, Atlas extracts it and passes it to the Flow. "From prior Action output" is used in multi-Action sequences — if Action 1 returns an account ID, Action 2 can use that account ID as input without asking the customer again. This enables sophisticated multi-step agent behaviors: look up the customer → get their account → retrieve their tier → present benefits, all in one conversational turn.

### Slide 6: Writing Action Descriptions for Parameter Extraction
**Visual:** Two Action descriptions side by side with parameter extraction diagrams beneath each. Left (weak): Action description: "Updates customer address." Beneath: Atlas receives "change my address to 123 Main St" — question marks showing Atlas unsure which field to update, which address type (billing vs shipping), whether to confirm. Right (strong): Action description: "Updates a customer's billing or shipping address on their account. Invoke when a customer asks to change their mailing, billing, or delivery address. Requires: addressType (billing or shipping), newStreetAddress, newCity, newState, newZip. Always confirm with the customer before executing this change." — Beneath: Atlas correctly extracts all five fields and confirms.
**Content:**
- Good Action descriptions enable accurate **parameter extraction** — the process by which Atlas identifies the right values from the conversation to pass to the Action
- Include explicit **input parameter hints** in the description: "Requires: customerName, orderNumber"
- For **optional parameters**, note they are optional: "Optionally accepts a date range — if not provided, defaults to last 30 days"
- For **confirmation-required Actions**, include this in the description: "Always confirm with the customer before executing"
- When an Action has multiple required parameters, Atlas will ask clarifying questions automatically for missing ones — your description tells Atlas what to ask for
- **Ambiguous parameter types** should be clarified: "Accepts either the order number (format: ORD-XXXXX) or the Salesforce record ID"
**Speaker Notes:** Parameter extraction quality is directly tied to how well your Action descriptions explain the inputs. In the weak example on this slide, Atlas knows it should "update address" but has no idea what fields to look for — it might update the wrong address type or miss required fields. In the strong example, Atlas knows exactly what to extract, confirms before executing, and will ask for any missing fields. This is pure description work — no code required to enable better parameter extraction.

### Slide 7: Error Handling and Edge Cases
**Visual:** A flow diagram showing three error paths from an Agent Action invocation. Path 1: Flow throws an unhandled exception → Atlas observes error → applies reasoning: "I encountered an error getting your order status. Let me try again or connect you with a representative." Path 2: Flow returns empty result (no record found) → Atlas observes empty output → "I couldn't find an order with that number. Could you double-check the order number?" Path 3: Atlas cannot extract required parameter → Atlas generates clarifying question → user provides missing information → Action retried.
**Content:**
- **Unhandled exceptions in Flows/Apex** — if an uncaught exception bubbles up, the agent cannot complete the Action; Atlas will observe the error and generate a recovery response based on its reasoning
- **Best practice:** Add **fault paths** in your Flow to catch errors and return a meaningful output variable (e.g., `errorMessage = "No order found with this ID"`) rather than throwing an exception
- **Empty results** — when a query returns no records, the Flow should return an output variable indicating this rather than leaving outputs null; null outputs may be interpreted ambiguously by Atlas
- **Governor limits** — Apex Actions are subject to normal Salesforce governor limits; if a query fails due to limits, the exception should be caught and a clean error message returned
- **Fallback behavior in Instructions** — include guidance in Instructions for how the agent should respond when an Action fails (offer to escalate, ask the user to try a different approach)
**Speaker Notes:** Fault tolerance in Flow actions is often overlooked in early agent implementations. A Flow that throws an unhandled exception mid-conversation creates a confusing customer experience — the agent says something like "I'm sorry, I encountered an error" with no clear path forward. Adding proper fault paths to Flows (Add Element → Fault Path) lets you return a meaningful error message that Atlas can present gracefully. For Apex actions, wrapping the main logic in try/catch and returning an error Result object instead of throwing ensures Atlas always receives structured output it can work with.

### Slide 8: Flow vs Apex — Decision Guide
**Visual:** A decision tree. Root: "Do you need code logic?" → No → "Is it an Autolaunched Flow already?" → Yes → Wire existing Flow. No → Build new Autolaunched Flow. → Yes code needed → "Is it complex computation, HTTP callout, or custom error handling?" → Yes → Build Apex @InvocableMethod. No → Consider whether Flow handles it. Below: a quick-reference table comparing Flow and Apex on dimensions: Code required, Admin-maintainable, HTTP callouts, Complex logic, Existing asset reuse, Recommended for.
**Content:**
| Dimension | Flow Action | Apex Action |
|-----------|-------------|-------------|
| Code required | No | Yes |
| Admin-maintainable | Yes | No |
| HTTP callouts | Limited | Full support |
| Complex logic | Limited | Full support |
| Existing asset reuse | Very high | High |
| Governor limit control | Standard | Manual management |
| Recommended when | Most use cases | Complex logic, callouts, bulk processing |

- Default to **Flow Actions** — they are maintainable by admins without developer involvement, which is important for long-term agent maintenance
- Use **Apex Actions** when Flow genuinely cannot do what is needed — not just as a developer preference
- In enterprise teams: Flow Actions enable non-developer colleagues to modify agent behavior; Apex Actions require a developer for every change
**Speaker Notes:** The "admin-maintainable" advantage of Flow Actions is a real business benefit in enterprise deployments. If your agent's order lookup logic changes — new field, different query — an admin can update the Flow in the builder without deploying a code change. If it were an Apex Action, a developer would need to write, test, and deploy new Apex. For an exam question that asks "what is the advantage of using a Flow Action over an Apex Action?" — admin maintainability and no-code modification are the primary answers.

## Recording Script
In this lecture we get practical: building the Flow and Apex actions that make your agent actually do things. Most of the intelligence in Agentforce comes from Atlas's reasoning, but the actual work — querying records, updating data, creating cases — happens in Flows and Apex. Getting these wired up correctly is where many first-time Agentforce developers get stuck.

Let me start with Flow Actions because they are the most common. The requirements are simple but non-negotiable: the Flow must be an Autolaunched Flow, it must be active, and all input and output variables must have the "Available for Input" and "Available for Output" settings checked. If you use a Screen Flow, it will not work. If you forget to check those variable settings, Atlas cannot see the variables. These are the three things to check first when a Flow Action is not working.

For Apex Actions, the key is the `@InvocableMethod` annotation with a meaningful `description` property. That description is what Atlas reads to decide when to call your Apex class. Use the same structure as a good Action description: what it does, when to invoke it, what inputs it needs. The `@InvocableVariable` descriptions on your inner Request class fields tell Atlas what values to extract from the conversation.

Parameter extraction is where the intelligence of the agent meets the structure of your code. When a customer says "my order number is 12345," Atlas reads the Action description, sees that an `orderId` is required, extracts "12345" from the conversation, and passes it to your Flow or Apex. If your variable descriptions are good, this extraction is automatic and reliable. If they are vague, Atlas guesses — and guesses wrong.

For error handling: always add Fault Paths to your Flows to return meaningful error output variables rather than throwing unhandled exceptions. Wrap Apex logic in try/catch and return a Result object even in failure cases. The agent handles errors gracefully when it receives structured feedback; it looks broken when it receives unhandled exceptions.

## Exam Tips
- Flow Actions require: Autolaunched Flow (not Screen Flow), Active status, input variables with "Available for Input" checked, output variables with "Available for Output" checked
- `@InvocableMethod` must include a `description` property — this is what Atlas reads for action routing, equivalent to the Action description field in Builder
- Variable descriptions on `@InvocableVariable` fields guide Atlas in parameter extraction from the conversation — do not leave them empty
- Use Flow Actions by default; use Apex when you need HTTP callouts, complex logic, or governor limit control that Flow cannot provide
- Always add Fault Paths in Flows (and try/catch in Apex) to return meaningful error output to Atlas rather than throwing unhandled exceptions

## Lecture Summary
Flow Actions invoke Autolaunched Flows (never Screen Flows) that must be Active with input variables set to "Available for Input" and output variables set to "Available for Output." Apex Actions invoke `@InvocableMethod` Apex methods using inner Request and Result classes with `@InvocableVariable`-annotated fields. In both cases, the `description` property (in Flow variable descriptions and in the `@InvocableMethod` annotation) is what Atlas reads to understand parameters and routing. Atlas extracts parameter values from conversation context based on variable descriptions and passes them to the Action. Error handling best practice: add Fault Paths in Flows and try/catch in Apex to return structured error output rather than unhandled exceptions. Default to Flow Actions for admin maintainability; use Apex for HTTP callouts, complex logic, or advanced error handling.

## Mini Quiz

**Q1:** A Salesforce Admin built an Autolaunched Flow that looks up a customer's subscription plan and returns the plan name and renewal date. The admin activated the Flow and added it as an agent Action, but the agent reports it cannot complete the task when customers ask about their subscription. What is the most likely cause?
A) Autolaunched Flows cannot be used as agent Actions — only Apex methods can
B) The input and output variables on the Flow are likely missing "Available for Input" / "Available for Output" settings
C) The agent needs a Prompt Template Action, not a Flow Action, for subscription information
D) The agent can only invoke Flows that have the "Agent Accessible" field checked in the Flow's properties
**Answer:** B — This is the most common Flow Action configuration error. When "Available for Input" is not checked on input variables, Atlas cannot pass parameters to the Flow. When "Available for Output" is not checked on output variables, the Flow cannot return data to Atlas. The Flow runs but produces no usable results, causing the agent to report failure. Autolaunched Flows are fully supported as agent actions. There is no "Agent Accessible" field in standard Flow configuration.

**Q2:** A developer wants to create an Agentforce Action that makes an HTTP callout to a third-party shipping carrier API to retrieve real-time tracking data. Which action type is most appropriate and what annotation is required?
A) Flow Action — HTTP callout steps are available in Flow Builder
B) Apex Action using `@InvocableMethod` with `callout=true` in the annotation
C) External API Action — configured through Named Credentials in Agentforce Builder
D) Knowledge Search Action that is pointed at an external API endpoint
**Answer:** B — For HTTP callouts in Agentforce Actions, an Apex Action using `@InvocableMethod(callout=true)` is the appropriate approach. The `callout=true` annotation property is required for any `@InvocableMethod` that makes external web service calls. While External API Actions exist, for custom carrier API integrations requiring specific authentication and response parsing, an Apex implementation with a Named Credential for authentication is the recommended approach.

**Q3:** An Agentforce developer observes that when customers say "what tier is my membership?", the agent asks "What is your account ID?" even though the customer is already authenticated and their Salesforce Account is linked to the session context. What Action configuration would fix this?
A) Change the Action type from Flow to Apex
B) Configure the accountId input parameter source to "From prior Action output" or session context rather than "Agent extracts from conversation"
C) Add the accountId field directly into the Action description
D) Create a separate Topic for membership tier questions
**Answer:** B — The input parameter source determines where Atlas gets a value. If set to "Agent extracts from conversation," Atlas will ask the customer for data it should already have. If the customer's Account ID is available from session context or a prior Action (like a login verification action), the input source should be configured to pull from that context rather than prompting the customer. This creates a much better user experience by not asking for information that is already known.
