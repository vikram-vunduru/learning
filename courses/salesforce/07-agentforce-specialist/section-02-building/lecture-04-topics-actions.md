# Lecture 04: Topics and Actions

## Learning Objectives
- Define a Topic and explain its role in scoping agent conversations
- Identify the four primary Action types: Apex actions, Flow actions, Prompt Template actions, and Knowledge search actions
- Distinguish between a Topic's description (conversation scope) and an Action's description (invocation routing)
- Explain how Atlas uses Action descriptions to decide which Action to invoke for a given user intent
- Write effective Topic and Action descriptions using natural language best practices

## Slides

### Slide 1: What is a Topic?
**Visual:** An agent diagram with the agent in the center and five Topic bubbles radiating outward, each labeled with an example (Order Management, Billing Inquiries, Product Information, Account Updates, Technical Support). Each bubble contains 2-3 small action icons. A dotted boundary circle around the agent labeled "Agent Scope" — messages landing inside the boundary are handled, messages outside it get out-of-scope response.
**Content:**
- A **Topic** defines a domain of conversation that the agent is equipped to handle
- Think of it as a "chapter" in the agent's capability book — each Topic represents a subject area with its own set of tools
- A Topic has three key components:
  - **Label** — short name (e.g., "Order Management")
  - **Description** — natural language explanation of what conversations this Topic covers and when it applies; this is what Atlas reads for routing
  - **Actions** — one or more callable operations the agent can invoke when it is in this Topic context
- A well-defined agent typically has 3–7 Topics — fewer is better; too many Topics can cause routing ambiguity
- Topics are exclusive in the sense that Atlas picks the best-matching Topic for each conversational intent
**Speaker Notes:** The Topic concept is the most important building block to understand for the exam. A common beginner mistake is creating one giant Topic called "Customer Service" and putting all 20 Actions under it. This is problematic because Atlas's Topic selection is the first routing step — if everything is one Topic, Atlas skips to Action selection immediately, and Action descriptions have to carry the entire routing burden. Breaking into meaningful Topics makes Atlas's reasoning more accurate and makes the agent easier to maintain.

### Slide 2: Topic Description — Writing for Atlas
**Visual:** Two side-by-side Topic description cards. Card 1 labeled "Weak Description" (red border): "Handles various customer service tasks related to orders, shipping, and delivery." Card 2 labeled "Strong Description" (green border): "Handles customer inquiries specifically about the status, location, or estimated delivery of existing orders. Use when a customer asks where their order is, whether it has shipped, or when it will arrive. Does NOT handle order cancellations or returns — those use the Returns topic." Annotations point to the three elements: what it covers, trigger conditions, explicit exclusions.
**Content:**
- Topic descriptions should explain **what conversations this Topic handles** with enough specificity for Atlas to distinguish it from other Topics
- **Best practices for Topic descriptions:**
  - State the subject area clearly (what kinds of conversations)
  - Include trigger phrases or intents ("when a customer asks about...")
  - Explicitly exclude related topics that are handled elsewhere ("does NOT handle...")
  - Describe the scope boundary — what fits and what does not
- Avoid generic descriptions like "handles customer questions" — every Topic technically does that
- Topic descriptions are **part of the LLM's context** — write them as if explaining to a smart colleague who has never seen your system
- Length: 3-5 sentences is usually enough — longer descriptions consume more context window without adding value
**Speaker Notes:** The "does NOT handle" exclusion in Topic descriptions is a powerful technique that the exam sometimes tests. When two Topics have overlapping scope — for example, "Order Inquiry" and "Returns & Cancellations" — you can significantly reduce misrouting by adding explicit exclusions to each. "This Topic handles order status questions but does NOT handle cancellation requests" tells Atlas to route cancellation conversations elsewhere. This is natural language guardrailing that any Salesforce Admin can do without code.

### Slide 3: What is an Action?
**Visual:** A Topic box (Order Management) with four Action boxes below it, each connected by a line, each showing Action type icon: Flow (lightning bolt), Apex (code brackets), Prompt Template (document with sparkle), Knowledge (book icon). Each Action box shows: Name, Action Type, Input Parameters, Output. An arrow from Atlas labeled "Semantic match based on description" points to one of the Actions.
**Content:**
- An **Action** is a callable operation that the agent can invoke when it determines that operation is needed
- Actions are nested within Topics — an Action is only available when its parent Topic has been matched
- Every Action has:
  - **Label** — short name ("Get Order Status")
  - **Description** — what this action does, what inputs it needs, when Atlas should invoke it
  - **Action Type** — Flow, Apex, Prompt Template, Knowledge Search, or External API
  - **Input/Output mappings** — how conversation context maps to the action's parameters
- Actions are the "hands" of the agent — Topics define what the agent talks about, Actions define what the agent can DO
- A Topic can have 1–20+ Actions; keep it manageable; group related operations under the same Topic
**Speaker Notes:** The relationship between Topics and Actions is hierarchical: you do not have free-floating Actions, they always belong to a Topic. This is architecturally important because Atlas first selects a Topic, then selects an Action within that Topic. It is a two-stage routing process. This means your Topic description scopes which Actions are even "in play" for a given message — a billing question never reaches Order Management Actions. This scoping makes the agent faster and more accurate.

### Slide 4: Flow Actions — The Most Common Action Type
**Visual:** Data flow diagram: (1) Customer message: "What's the status of order 12345?" → (2) Atlas extracts parameter: orderId = "12345" → (3) Invokes Autolaunched Flow "Get_Order_Status" with input variable orderId → (4) Flow queries Order__c WHERE Id = orderId → (5) Flow returns output variables: {status: "Shipped", deliveryDate: "Dec 15"} → (6) Atlas composes response using output values → (7) Customer sees: "Your order is shipped and expected Dec 15."
**Content:**
- **Flow Actions** invoke Autolaunched Flows that have been configured to accept input variables and return output variables
- Requirements for a Flow to be usable as an agent Action:
  - Must be an **Autolaunched Flow** (not Screen Flow)
  - Must be **active** (deployed)
  - Input variables must have their "Available for Input" setting enabled
  - Output variables must have their "Available for Output" setting enabled
- Atlas **extracts parameter values from the conversation** and maps them to Flow input variables based on variable descriptions
- Flow output variables are returned to Atlas as structured data — Atlas synthesizes them into natural language for the response
- Flow Actions are the recommended approach for **most business logic** — they require no code, they can be modified by admins, and they follow Salesforce automation best practices
**Speaker Notes:** Flow Actions are the most common action type in real Agentforce deployments, and they are the most exam-tested. Know the requirements: Autolaunched (not Screen Flow), active, input variables available for input, output variables available for output. The most common mistake is creating a Screen Flow (which has UI elements) and trying to use it as an agent action — this will not work. Another common mistake is forgetting to check the "Available for Input/Output" settings on variables. If Atlas cannot see the variable, it cannot pass data to or receive data from the Flow.

### Slide 5: Apex Actions — Code-Level Extensibility
**Visual:** Code editor showing an Apex class with the `@InvocableMethod` annotation highlighted in yellow. Below the class, a Flow/agent connection diagram showing the same flow as Slide 4 but with "Apex Class" in the middle instead of "Autolaunched Flow." Annotations point to: `@InvocableMethod` label (what makes it available), `List<Request>` parameter (input), `List<Result>` return type (output).
**Content:**
- **Apex Actions** invoke Apex methods annotated with `@InvocableMethod`
- The `@InvocableMethod` annotation is the same one used to expose Apex to Flows — if your Apex is callable from Flow, it can be callable from an agent Action
- Input and output are defined via inner classes with `@InvocableVariable` annotated fields
- Use Apex Actions when business logic requires:
  - Complex calculations not possible in Flow
  - Bulk operations with custom governor limit management
  - Specific error handling that Flow cannot provide
  - Calls to third-party web services (via `HttpRequest`)
- The `label` property of `@InvocableMethod` is used as the action's display name in Agentforce Builder
- Best practice: keep `@InvocableMethod` classes thin — call a service class for the actual logic
**Speaker Notes:** Apex Actions are important for the developer audience but appear less frequently on the exam than Flow Actions. When an exam question asks "what type of action would you use when Flow cannot handle the complexity of the business logic?" — the answer is Apex Action. If the question says "a developer wants to invoke a web service call from an agent" — Apex Action (HttpRequest in Apex, not Flow HTTP callout, which has more limitations). For the `@InvocableMethod` annotation, the key properties to know are `label` (display name), `description` (what Atlas uses for routing), and `callout` (must be true if the method makes a web service call).

### Slide 6: Prompt Template Actions and Knowledge Actions
**Visual:** Split slide. Left half — Prompt Template Action: customer message → Atlas invokes Prompt Template action → Prompt Builder template with merge fields fills in (Account Name, Case Summary from context) → LLM generates text → returns generated text to Atlas → Atlas includes in response. Right half — Knowledge Action: customer message → Atlas invokes Knowledge Search action → Einstein Knowledge semantic search over articles → returns top-N relevant articles → Atlas synthesizes answer from article content.
**Content:**
- **Prompt Template Actions** invoke a Prompt Builder template as an agent action; the agent passes context data to populate template merge fields; the LLM generates text; the generated text is returned to Atlas
  - Use when: the agent needs to generate structured content (email draft, case summary, recommendation, personalized message)
  - The Prompt Template action connects the agent to Prompt Builder — covered in detail in Section 3
- **Knowledge Search Actions** perform semantic search over Einstein Knowledge articles
  - Use when: the agent should answer questions using verified, structured knowledge (product documentation, FAQ, policy articles)
  - Returns ranked article content; Atlas synthesizes the answer — the agent does not return raw article text
  - Key configuration: which Knowledge base to search, minimum relevance threshold, number of articles to retrieve
- Both action types use LLM calls internally — all calls go through the Einstein Trust Layer
**Speaker Notes:** The key distinction between Prompt Template Actions and Knowledge Actions for the exam: Knowledge Actions search for an existing answer in an article library (retrieval), while Prompt Template Actions generate new content using an AI template (generation). A question about "answering a customer's frequently asked question" should make you think Knowledge Action. A question about "generating a personalized email for the customer" should make you think Prompt Template Action. These are different because one is about finding verified information, the other is about creating new content.

### Slide 7: Action Description — The Critical Field
**Visual:** Two action description examples side by side. Weak (red): "Gets order information." Strong (green): "Retrieves the current fulfillment status, estimated delivery date, and carrier tracking number for a customer order. Invoke when the customer asks where their order is, whether it has shipped, what the tracking number is, or when their package will arrive. Requires orderId as input — extract this from the conversation or ask the customer to provide their order number." Three color-coded annotations: What it returns (blue), When to invoke (green), Required inputs (orange).
**Content:**
- The Action description is the **most critical field** in Agentforce configuration — Atlas reads it to decide whether to invoke this action for a given input
- A good Action description has three components:
  1. **What it does** — what information it retrieves or what operation it performs
  2. **When to invoke it** — the trigger conditions, expressed as user intent phrases
  3. **Required inputs** — what parameters are needed and how Atlas should obtain them
- Descriptions are read as part of the LLM's context window — write in **natural language, not technical jargon**
- Avoid system names, variable names, and object API names in descriptions — write what the action does in plain English
- Test descriptions by asking: "If a colleague read only this description, would they know exactly when and how to use this action?"
**Speaker Notes:** I cannot overstate how much Action descriptions matter. In testing, the most common cause of agent mis-routing is vague or missing Action descriptions. An Action description should be as specific as you can make it while remaining readable. The "when to invoke" component is the most important part — it directly tells Atlas the intent pattern that should trigger this action. If your descriptions are good, Atlas will route correctly even for unusual phrasings of the customer's intent. If they are vague, you will see incorrect routing in your test cases.

### Slide 8: Topic and Action Best Practices Summary
**Visual:** A two-column checklist card. Left column: "Topics" with 5 green checkmarks: Scope to one clear domain; Write 3-5 sentence description; Include explicit exclusions; Aim for 3-7 Topics total; Test routing with 10+ varied intents. Right column: "Actions" with 5 green checkmarks: Include What / When / Inputs in description; Use plain English, no jargon; Write distinct descriptions for similar Actions; Map all input/output variables; Test each Action independently.
**Content:**
- **Topic best practices:**
  - One domain per Topic; no catch-all Topics
  - Descriptions include scope, trigger conditions, and explicit exclusions
  - 3–7 Topics is the recommended range for most agents
  - Test each Topic's routing with at least 10 varied user inputs before going live
- **Action best practices:**
  - Every Action description answers: What does it do? When should I use it? What does it need?
  - Similar Actions must have clearly differentiated descriptions
  - Flow and Apex input variables should have their own descriptions (used as hints for Atlas when extracting parameters)
  - Test each Action individually before testing combined Topic + Action flows
- General principle: **if Atlas routing is wrong, the fix is almost always in descriptions, not in code**
**Speaker Notes:** This slide summarizes the practical guidance for building agents that work reliably. The "if Atlas routing is wrong, fix descriptions first" principle is the most important troubleshooting heuristic in Agentforce. Before you add code or restructure your Topics and Actions, update the descriptions, redeploy, and retest. Most routing problems are description problems in disguise. This matters for the exam because exam questions about agent troubleshooting often have "fix the Action description" as the correct answer option.

## Recording Script
Topics and Actions are the building blocks of every Agentforce agent. If you understand these two concepts deeply, you understand how to build an agent that actually works. Everything else — grounding, Prompt Builder, deployment channels — builds on this foundation.

A Topic defines a domain of conversation your agent can handle. Think of it as a capability chapter: "This agent can help with Order Management. It can also help with Billing Inquiries. And with Product Questions." Each Topic has a label, a description, and a set of Actions. The description is what Atlas reads to determine whether an incoming message belongs to this Topic. If the description is vague, Atlas will mis-route. If it is specific and well-written, Atlas will route reliably even for unusual phrasings.

An Action is a callable operation within a Topic — it is what the agent actually DOES when it decides to take action. There are four primary Action types. Flow Actions invoke Autolaunched Flows — the most common type, requiring no code, leveraging your existing automation. Apex Actions invoke `@InvocableMethod` Apex methods — used when business logic is too complex for Flow. Prompt Template Actions invoke Prompt Builder templates — used when you need AI-generated content. Knowledge Search Actions query Einstein Knowledge articles — used for FAQ and deflection scenarios.

For every Action you create, you need to write a description. This description is what Atlas uses to decide whether to invoke this specific Action for a given user input. The description should answer three questions: what does this Action do? when should Atlas invoke it? what inputs does it need? A description like "gets order info" is nearly useless. A description like "retrieves the shipment status, estimated delivery date, and tracking number for a customer order — use when a customer asks where their order is or when it will arrive" gives Atlas everything it needs to route correctly.

The practical lesson: most agent reliability problems come from poor Topic or Action descriptions. Before you write code, write better descriptions. That is the highest-leverage improvement you can make.

## Exam Tips
- Topics scope conversation domains; Actions are the operations within a Topic — Atlas performs two-stage routing: first Topic match, then Action match
- The four Action types: Flow (most common, no code), Apex (`@InvocableMethod`, complex logic), Prompt Template (AI-generated content), Knowledge Search (article retrieval) — know when to use each
- Action descriptions are the most critical field — they must include what the action does, when to invoke it, and what inputs are needed; vague descriptions cause misrouting
- Flow Actions require an Autolaunched Flow (not Screen Flow), active status, and input/output variables with "Available for Input/Output" enabled
- If Atlas routes to the wrong Action, the fix is almost always improving the Action description — not restructuring the agent or rewriting the Flow

## Lecture Summary
Topics define the conversation domains an agent can handle; Actions are the callable operations within each Topic. Atlas performs two-stage routing: it first selects the best-matching Topic by reading Topic descriptions, then selects the best-matching Action within that Topic by reading Action descriptions. The four primary Action types are: Flow Actions (Autolaunched Flows, most common, no code required), Apex Actions (`@InvocableMethod` methods, for complex logic), Prompt Template Actions (Prompt Builder templates, for AI-generated content), and Knowledge Search Actions (Einstein Knowledge, for FAQ and deflection). Action descriptions are the most critical configuration field — they must include what the action does, trigger conditions, and required inputs, written in plain natural language. If Atlas routing is incorrect, improving Action descriptions is the highest-leverage fix before considering code or structural changes.

## Mini Quiz

**Q1:** An Agentforce developer notices that when customers ask "can I cancel my order?", the agent correctly identifies the "Order Management" Topic but then invokes the "Get Order Status" Action instead of the "Cancel Order" Action. What is the most likely cause and best fix?
A) The Cancel Order Flow has a bug — debug the Flow logic
B) The "Cancel Order" Action description is too similar to or less specific than the "Get Order Status" description; improve the Cancel Order description to include explicit cancellation trigger phrases
C) The agent needs a separate "Order Cancellation" Topic to separate cancellation from status inquiries
D) The Einstein Trust Layer is blocking cancellation actions because they modify data
**Answer:** B — This is a classic Action description problem. When two Actions within the same Topic have similar or vague descriptions, Atlas cannot reliably distinguish between them and defaults to one. The fix is to improve the "Cancel Order" Action description with explicit trigger conditions like "invoke when a customer asks to cancel, stop, or not proceed with an order." Option C (separate Topic) is a valid architectural choice but the description fix is more targeted and efficient.

**Q2:** A developer needs to wire a Salesforce Flow to an Agentforce agent Action. The Flow queries a custom Invoice__c object and returns the invoice total and due date. Which Flow type and variable settings are required?
A) Screen Flow with all variables as required inputs
B) Autolaunched Flow with input variables set to "Available for Input" and output variables set to "Available for Output"
C) Autolaunched Flow with all variables public and the Flow marked as active in a Sandbox
D) Record-Triggered Flow with output variables
**Answer:** B — Agent Flow Actions require an Autolaunched Flow (not a Screen Flow) that is active. Input variables must have "Available for Input" enabled so Atlas can pass parameters to them. Output variables must have "Available for Output" enabled so the Flow can return data to Atlas. Screen Flows have UI elements and cannot be invoked headlessly by agents. Record-Triggered Flows fire on record events, not on-demand.

**Q3:** A company wants their Agentforce Service Agent to answer customer questions by searching their existing Salesforce Knowledge articles. Which Action type should be added to the FAQ Topic?
A) Apex Action that queries KnowledgeArticleVersion via SOQL
B) Flow Action that runs a Flow to retrieve Knowledge articles
C) Knowledge Search Action
D) Prompt Template Action with article merge fields
**Answer:** C — The Knowledge Search Action is the purpose-built action type for searching Einstein Knowledge articles. It performs semantic search and returns relevant article content to Atlas, which synthesizes the answer. While you could build an Apex action that queries Knowledge via SOQL, the Knowledge Search Action is the platform-native, recommended approach — it uses semantic search rather than keyword SOQL, handles relevance ranking automatically, and integrates with Einstein's AI infrastructure.
