# Lecture 10: Prompt Templates as Agentforce Actions

## Learning Objectives
- Configure a Flex Prompt Template as an Agentforce Action within a Topic
- Explain how Atlas decides to invoke a Prompt Template Action versus a Flow or Knowledge Action
- Describe the data flow from agent conversation context through a Prompt Template Action and back to the agent
- Write an effective Action description for a Prompt Template Action
- Identify use cases where a Prompt Template Action is the most appropriate Action type

## Slides

### Slide 1: Connecting Prompt Builder to Agentforce
**Visual:** An architecture diagram showing Prompt Builder and Agentforce as two connected platform components. Left: Prompt Builder (template editor, test panel, template library). Right: Agentforce (agent Topics, Actions configuration). A bridge labeled "Prompt Template Action" connects them. Data flow: Agent conversation context → Atlas reasons → invokes Prompt Template Action → Prompt Builder template runs → generated text returned → Atlas composes response. Einstein Trust Layer wraps the entire diagram.
**Content:**
- Prompt Templates are standalone AI assets — they can be used independently of Agentforce (via Flow, Apex, LWC)
- When connected to Agentforce as a **Prompt Template Action**, a template becomes something an agent can invoke during a conversation
- The connection enables: **AI content generation within agent workflows** — not just data retrieval or record updates, but AI-powered synthesis and generation
- Prompt Template Actions are ideal when the agent needs to **generate complex, contextualized text** — not retrieve an article, not execute a Flow, but produce new content
- The two platforms share infrastructure (Trust Layer, merge fields, grounding) but serve different purposes: Prompt Builder = managed templates; Agentforce = autonomous agent orchestration
**Speaker Notes:** Understanding why Prompt Template Actions exist is as important as knowing how to configure them. You can do almost everything with a Flex template that you can do in a Flow — but the key advantage is AI generation. A Flow can look up a case and return its status. A Prompt Template Action can look up the case and return a professionally written case escalation email draft tailored to the customer's history. The generation capability is what makes Prompt Template Actions valuable as a distinct action type.

### Slide 2: When to Use a Prompt Template Action
**Visual:** A decision matrix with use case categories on the left and action type recommendations across the top. Columns: Flow Action, Apex Action, Knowledge Search, Prompt Template Action. Rows: "Look up a record" (Flow ✓), "Perform a calculation" (Apex ✓), "Answer an FAQ" (Knowledge ✓), "Generate a personalized email" (Prompt Template ✓), "Summarize case history for a customer" (Prompt Template ✓), "Create a new record" (Flow ✓), "Produce a recommendation based on customer data" (Prompt Template ✓), "Search for how-to instructions" (Knowledge ✓).
**Content:**
- Use a Prompt Template Action when the agent needs to **generate AI-authored text** as part of its response
- Typical use cases for Prompt Template Actions:
  - **Generate a personalized response:** "Write a response to the customer explaining their account status in a friendly, empathetic tone"
  - **Summarize complex data:** "Summarize the customer's last 5 service interactions in 3 concise bullet points"
  - **Draft content:** "Draft a follow-up email for the customer based on the resolution we just provided"
  - **Produce recommendations:** "Based on the customer's product usage data, recommend the three most relevant upgrade paths"
  - **Format complex output:** "Format the billing details we just retrieved as a clear, customer-friendly explanation"
- **Do NOT use Prompt Template Action** for: simple data retrieval (use Flow), FAQ answers (use Knowledge Search), record updates (use Flow/Apex), operations requiring deterministic output
**Speaker Notes:** The decision framework here is: if the task is about DOING something with data (query, update, create, calculate) → Flow or Apex. If the task is about ANSWERING a specific question from a verified source → Knowledge Search. If the task is about GENERATING new text content based on context → Prompt Template Action. These three categories cover the vast majority of agent action needs. The exam will give you scenarios and ask which action type is most appropriate — use this framework.

### Slide 3: Configuring a Flex Template for Agent Use
**Visual:** Prompt Builder configuration panel showing a Flex template being prepared for agent use. Highlighted elements: Template Type = Flex, Input Parameters section showing two custom inputs: {!agentContext} (Text) and {!customerName} (Text). System Prompt: "You are a customer service specialist for Acme Corp. Generate a clear, empathetic response based on the context provided." Template Body: "Customer name: {!customerName}\nContext: {!agentContext}\n\nGenerate a professional response that acknowledges the customer's situation and explains next steps."
**Content:**
- **Template Type must be Flex** — other template types (Record Summary, Field Generation, Sales Email) cannot be used as Agentforce Actions
- **Input Parameters** — define the data the template accepts from the agent; these become available as merge fields in the template body
  - Input parameters are the "interface" between the agent context and the template
  - Name inputs clearly: `customerName`, `agentContext`, `orderStatus` rather than generic names
  - Data type: Text for most cases; Number, Boolean if needed
- **System Prompt** — establish the AI's role in the context of agent deployment: "You are an assistant for [company] responding to customer service inquiries"
- **Template Body** — use the input parameter merge fields to incorporate agent-context data into the generation task
- Test the Flex template with representative inputs before connecting to the agent
**Speaker Notes:** The input parameters are the architectural key to connecting a template to an agent. When Atlas invokes a Prompt Template Action, it passes values to these input parameters from the conversation context — the customer's name, the status retrieved by a previous Flow action, the customer's account tier. The template uses these as merge fields to produce a contextual, personalized generated response. This is why naming input parameters clearly matters — a parameter named `x1` is hard to map in the Action configuration; a parameter named `resolvedIssueDescription` is self-explanatory.

### Slide 4: Adding a Prompt Template Action to a Topic
**Visual:** Agentforce Builder showing a Topic (Customer Resolution) with an Action being added. Step-by-step screenshot mockup: (1) Click "Add Action" within the Topic. (2) In the Action type selector, choose "Prompt Template." (3) A template browser shows available Flex templates — select "Customer Response Generator." (4) Input Mapping panel: map agent context to template input parameters. (5) Action Description text area where the developer writes the routing description. (6) Save and Test buttons.
**Content:**
- **Navigation:** Agentforce Builder → select Agent → Topics → select Topic → Actions → Add Action → Prompt Template
- Only **Flex templates that are Active** appear in the template browser
- **Input Mapping** — map conversation data to template input parameters:
  - "Agent extracts from conversation" — Atlas extracts a value from the conversation (e.g., customer name)
  - "From prior Action output" — use a value returned by a previous Action in the reasoning loop
  - "Static value" — a hardcoded value constant for all invocations
- **Action Description** — this is required and must follow the same best practices as any other Action description: what it generates, when Atlas should invoke it, what inputs it needs
- **Output** — the generated text from the template is returned as the Action's output and available to Atlas for the response
**Speaker Notes:** The input mapping step is where the "prior action output" pattern becomes particularly powerful. Imagine a Topic with three actions: (1) a Flow Action that retrieves the customer's account status, (2) a Flow Action that retrieves their recent case history, (3) a Prompt Template Action that generates a personalized response. Atlas invokes Action 1, gets the account status, invokes Action 2, gets the case history, then invokes Action 3 with both pieces of data mapped as inputs. The template gets a rich context and generates a response that synthesizes all of it. This multi-step agent pattern is tested on the exam.

### Slide 5: The Data Flow — Agent to Template and Back
**Visual:** A detailed data flow diagram for a Prompt Template Action invocation. Start: Customer message "I'm frustrated about my billing issue." Atlas reasoning step: decides to invoke "Generate Empathetic Billing Response" Prompt Template Action. Input mapping: customerName = "John Smith" (from session), billingContext = "Invoice #INV-001, Amount $450, Past Due 15 days" (from prior Flow action output). Template runs: System prompt + body with resolved merge fields → LLM generates 3-paragraph response. Output: generated text string. Atlas receives generated text → incorporates into final response → customer sees empathetic, personalized message.
**Content:**
- **Step 1:** Atlas determines a Prompt Template Action is the right tool based on the Action description
- **Step 2:** Atlas extracts/assembles the input values from conversation context and prior Action outputs
- **Step 3:** Input values are passed to the template as merge field values
- **Step 4:** Template body is assembled with all merge fields resolved
- **Step 5:** System prompt + resolved template body are sent to the LLM through the Trust Layer
- **Step 6:** LLM generates text; output is returned through Trust Layer
- **Step 7:** Generated text is returned to Atlas as the Action's output
- **Step 8:** Atlas may use the generated text directly as its response, or may combine it with other information for the final reply
- The entire cycle adds roughly 1-3 seconds to the response time vs. a simple Flow Action
**Speaker Notes:** Understanding the complete data flow helps you debug issues when they arise. If the template output is not personalized, check that the input mapping is working — log or preview the inputs that Atlas is actually passing. If the generated text is off-topic, check the system prompt and template body for clarity. If the response is too long, add length constraints to the template body. If the trust layer is rejecting content, check the trust layer logs. Each layer of this stack is independently configurable and debuggable.

### Slide 6: Writing the Action Description for Prompt Template Actions
**Visual:** Two Action description examples. Weak: "Generates a response using AI." Strong: "Generates a professionally written, empathetic customer service response based on the customer's name and the issue context. Invoke when the agent has gathered all necessary information about the customer's issue and needs to compose the final response to send to the customer. Requires: customerName (from session or conversation), issueContext (the description of the problem and any resolution details gathered by prior actions). Returns a complete, ready-to-send customer message." Annotations highlight: what it generates (blue), when to invoke (green), required inputs (orange), what it returns (purple).
**Content:**
- Action descriptions for Prompt Template Actions follow the same structure as all other Action descriptions: What / When / Inputs / Returns
- **Unique considerations for Prompt Template Actions:**
  - Specify **what type of content** is generated: email draft, bullet summary, recommendation list, explanation paragraph
  - Specify **the trigger conditions carefully** — these actions should be invoked after information gathering is complete, not as first actions
  - Specify **what input context** the template needs for quality output — if a prior Action's output is required, say so
  - Specify the **output format** if the template is configured to produce structured output
- The description must distinguish this Action from other Actions in the Topic — if there is both a "Get Account Status" Flow Action and a "Generate Account Summary" Prompt Template Action, Atlas needs clear descriptions to know which to call when
**Speaker Notes:** A common mistake with Prompt Template Action descriptions is being too vague: "generates a response." Atlas might invoke this for almost any customer message if the description does not specify trigger conditions. A better description includes "invoke when the agent has gathered the necessary information" — this positions the template as a final-step generator rather than a first-step action. Think about the workflow: gather data (Flow Actions), then generate the response (Prompt Template Action). The description should reflect that sequence.

### Slide 7: Flow Action vs Prompt Template Action — Knowing the Difference
**Visual:** Two scenarios side by side with the correct action type labeled. Scenario 1: "Customer asks what their current plan is" → Flow Action (deterministic lookup, exact plan name from a field). Scenario 2: "Customer asks for an explanation of why their bill increased" → Prompt Template Action (requires AI synthesis of billing data into a natural, personalized explanation). Scenario 3: "Create a case for the issue" → Flow Action (record creation, deterministic). Scenario 4: "Draft a follow-up email summarizing the resolution" → Prompt Template Action (content generation). A decision question: "Is the task deterministic (same input = same output) or generative (requires language synthesis)?"
**Content:**
| Task Type | Use Flow/Apex | Use Prompt Template |
|-----------|--------------|-------------------|
| Look up specific data | ✓ | |
| Create/update records | ✓ | |
| Calculate a value | ✓ | |
| Generate an explanation | | ✓ |
| Draft a personalized message | | ✓ |
| Summarize multiple records | | ✓ |
| Produce a recommendation | | ✓ |
| Format complex data for human reading | | ✓ |

- **Key question:** Is the task **deterministic** (the same input should always produce the same output) or **generative** (requires natural language synthesis, personalization, or composition)?
- Deterministic → Flow or Apex
- Generative → Prompt Template Action
**Speaker Notes:** This deterministic vs. generative distinction is the most useful heuristic for choosing between Flow Actions and Prompt Template Actions. "What is the account balance?" is deterministic — there is one correct answer and it should always be the same. "Explain the account balance to the customer in a friendly, easy-to-understand way" is generative — the output requires language synthesis and should be adapted to the customer's context. If you find yourself writing a Flow with a formula that produces a long text response, that is a signal you should be using a Prompt Template Action instead.

### Slide 8: Multi-Action Patterns with Prompt Templates
**Visual:** A multi-step Topic workflow diagram. Topic: "Account Resolution." Three sequential Actions with arrows: Action 1 (Flow) — "Get Account Details" → returns accountBalance, planType, accountAge. Action 2 (Flow) — "Get Recent Cases" → returns recentCaseHistory as formatted text. Action 3 (Prompt Template Action) — "Generate Account Summary Response" — receives accountBalance, planType, accountAge, recentCaseHistory as inputs → generates personalized account status explanation. Final output: customer receives comprehensive, personalized response synthesizing all data.
**Content:**
- **Multi-Action patterns** combine Flow Actions (data gathering) with Prompt Template Actions (synthesis/generation)
- Pattern: Get Data → Get More Data → Generate Response
- Benefits of this pattern:
  - Flows handle deterministic data retrieval reliably
  - The Prompt Template gets rich, verified data to generate a high-quality, personalized response
  - Each component is independently testable and maintainable
- The Prompt Template receives all gathered data as input parameters mapped from prior Action outputs
- This pattern is more reliable than asking the template to both retrieve and generate — separate concerns cleanly
- The same Prompt Template can be reused across multiple Topics by creating separate Actions pointing to it with different input mappings
**Speaker Notes:** The multi-action pattern is the professional-grade approach to building agent workflows. First-time implementers sometimes try to put everything in one template — the template is supposed to figure out what data it needs and somehow get it. This leads to unreliable behavior because templates are generation tools, not retrieval tools. The clean architecture is: Flows gather the specific data you need, and one Prompt Template at the end generates the polished response from that data. Each component does what it is best at. For the exam, if you see a scenario describing "an agent that first retrieves customer data and then generates a personalized explanation" — this is a multi-action pattern with Flow Actions feeding a Prompt Template Action.

## Recording Script
In this lecture we connect the two components we have studied separately — Prompt Builder templates and Agentforce Actions. When you configure a Flex Prompt Template as an Agentforce Action, you give your agent the power to generate AI-authored content as part of its conversational workflow. This is what separates a data-retrieval agent from a truly useful service agent.

The connection is straightforward. You add an Action to a Topic, select "Prompt Template" as the action type, and choose an Active Flex template from your org's template library. Then you configure the input mapping: where does each template input parameter come from? From the conversation? From session context? From the output of a prior Action? And you write the Action description telling Atlas when to invoke this template.

The data flow is worth tracing carefully. Atlas decides to invoke the template, assembles the input values from conversation context and prior action outputs, passes them to the template as merge field values, the template runs through the LLM with the Trust Layer, and the generated text comes back to Atlas. Atlas then uses that text — possibly directly as the response, possibly combined with other information.

The key design pattern is: use Flow Actions for data gathering (deterministic, retrieving specific record values), and use a Prompt Template Action as the final step for generating the polished, personalized response. Flows know how to query records reliably. Templates know how to synthesize data into natural language. Separate those concerns.

The Action description for a Prompt Template Action follows the same structure: what does it generate, when should Atlas invoke it, what inputs does it need, what does it return. Be specific about the trigger conditions — "invoke when information gathering is complete" tells Atlas this is a final step, not a first step.

## Exam Tips
- Only Flex templates (Active status) can be used as Agentforce Actions — Field Generation, Record Summary, and Sales Email cannot be wired to agent Topics
- Use Prompt Template Actions for generative tasks (generate an email, summarize data, produce a recommendation); use Flow/Apex Actions for deterministic tasks (look up a value, create a record, calculate)
- Input parameters on a Flex template become the "interface" for the Action — they receive values from Atlas via input mapping (from conversation, from prior action output, or static)
- Multi-action pattern: Flow Actions gather data → Prompt Template Action synthesizes data into generated response — each component does what it does best
- Action description for Prompt Template Actions: specify what type of content is generated, when to invoke (after data gathering), required inputs from prior Actions, and what the output is

## Lecture Summary
Flex Prompt Templates become Agentforce Actions by adding a "Prompt Template" action type to a Topic in Agentforce Builder and selecting an Active Flex template. Only Flex templates support this integration — other template types have UI dependencies incompatible with agent invocation. Input parameters on the Flex template become the interface: they receive values from Atlas via input mapping configured in the Action setup (from conversation context, prior Action outputs, or static values). The generated text output is returned to Atlas as the Action's result. Use Prompt Template Actions for generative tasks — generating personalized responses, summaries, recommendations, or content drafts. Use Flow or Apex Actions for deterministic tasks — data lookup, record operations, calculations. The professional multi-action pattern is: Flow Actions gather data → Prompt Template Action synthesizes it into a polished generated response. Action descriptions for Prompt Template Actions must follow the same What / When / Inputs / Returns structure as all other Action descriptions.

## Mini Quiz

**Q1:** An Agentforce developer wants to create an Action that takes a customer's complaint, retrieves their account history from a prior Flow action, and generates a professionally written apology and resolution message. Which template type and invocation method should they use?
A) Record Summary template invoked via the record page Generate button
B) Field Generation template invoked via an Apex class
C) Active Flex template added as a Prompt Template Action to the Topic, with account history mapped from the prior Flow Action's output
D) Sales Email template invoked from the agent's email channel
**Answer:** C — A Flex template configured as an Agentforce Action is the correct approach. The Account history from the prior Flow Action can be mapped to a template input parameter using "From prior Action output" in the input mapping. Flex templates are the only type that can be used as Agentforce Actions. Record Summary and Field Generation have UI-based invocation patterns, not agent-based. Sales Email generates email drafts in the CRM email compose window.

**Q2:** In the Agentforce Builder, a developer adds a Prompt Template Action but it does not appear in the template browser. The developer has an Active Flex template in the org. What is the most likely cause?
A) Prompt Template Actions require a special Agentforce permission to access templates
B) The template is Flex type but may still be in Draft/Inactive status — only Active Flex templates appear in the Agentforce Action template browser
C) The template is in a different Salesforce org — templates cannot be used across org boundaries
D) Prompt Template Actions are not supported for the Service Agent template type
**Answer:** B — Only Active Flex templates appear in the Agentforce template browser for Action configuration. If the template is Flex type but still in Draft or Inactive status, it will not be listed. The developer should navigate to Prompt Builder, open the template, and Activate it. Prompt Template Actions do not require special permissions beyond standard Agentforce and Prompt Builder access. Prompt Template Actions are supported for all Agentforce agent types including Service Agent.

**Q3:** An Agentforce agent has a Topic with three Actions: (1) Get Account Status (Flow), (2) Get Recent Interactions (Flow), and (3) Generate Personalized Response (Prompt Template Action). A tester reports that the agent sometimes invokes the Prompt Template Action first, before gathering account data, resulting in a poorly contextualized response. What configuration change would fix this?
A) Change the Prompt Template Action to a Flow Action
B) Move the Prompt Template Action to a separate Topic
C) Update the Prompt Template Action description to specify "Invoke only after account status and recent interaction data have been gathered by prior actions in this conversation turn"
D) Set the Prompt Template Action as the default Action for the Topic
**Answer:** C — The Action description is what Atlas uses to determine when to invoke an Action. If the description does not specify that the template should be a final step (after data gathering), Atlas may invoke it at any point, including before the data is collected. Adding explicit ordering guidance to the description — "invoke only after account status and recent interaction data have been gathered" — tells Atlas this is a synthesis step, not a first-step action. This is a description fix, not a structural change.
