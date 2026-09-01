# Agentforce Specialist Practice Exam — 60 Questions

**Exam:** Salesforce Certified Agentforce Specialist (CRT-271)  
**Time Limit:** 105 minutes  
**Passing Score:** 65% (39/60)  
**Format:** Multiple choice, single best answer unless noted

---

## Section 1: Agentforce Concepts & Architecture (12 questions)

**Q1.** What is the primary distinction between Agentforce and Einstein Copilot?
A) Agentforce is only available for Sales Cloud; Copilot works across all clouds
B) Agentforce agents operate autonomously to complete multi-step tasks; Einstein Copilot required human confirmation at each step
C) Einstein Copilot uses the Atlas Reasoning Engine; Agentforce uses a rule-based routing system
D) Agentforce is designed only for external customers; Copilot was for internal users
**Answer: B** — Agentforce agents are autonomous; they can complete multi-step tasks without waiting for human confirmation at each step. Einstein Copilot was assistant-based: it suggested actions but required human approval.

**Q2.** An Agentforce agent is processing a customer request. After invoking a Flow Action that retrieves account data, the agent determines it needs one more piece of information before it can respond. What describes this behavior?
A) A bug — the agent should respond after each action invocation
B) The Atlas Reasoning Engine's loop — after observing the action result, Atlas reasons again and determines another action is needed
C) A configuration error — agents should complete all actions simultaneously
D) The Einstein Trust Layer blocking the second action
**Answer: B** — The Atlas Reasoning Engine operates in an Observe → Reason → Act → Observe loop. After observing the first action's result, Atlas reasons again and determines a second action is needed before it can compose a complete response.

**Q3.** Which four components make up an Agentforce agent's configuration?
A) Identity, Instructions, Topics, and Actions
B) Persona, System Prompt, Channels, and Flows
C) Template, Grounding, Escalation, and Routing
D) Name, Description, Knowledge Base, and API Connection
**Answer: A** — The four agent building blocks are Identity (name, company, persona tone), Instructions (system-level behavioral prompt), Topics (conversation domains), and Actions (callable operations within Topics).

**Q4.** What does the Atlas Reasoning Engine primarily use to determine which Action to invoke for a given customer message?
A) A keyword matching algorithm that scans the message for predefined trigger words
B) A hard-coded routing table configured by the administrator in Agentforce Builder
C) The natural language descriptions of Topics and Actions, using semantic matching
D) The customer's purchase history from Data Cloud
**Answer: C** — Atlas uses semantic matching against the natural language descriptions of Topics and Actions to determine which Action best fits the user's intent. This is why description quality is the highest-leverage configuration factor.

**Q5.** A customer sends a message that does not match any of the agent's configured Topics. What is the default Atlas behavior?
A) Atlas generates a best-effort response using its general training knowledge
B) Atlas returns a system error to the agent that is displayed to the customer
C) Atlas responds using the out-of-scope message defined in Agent Instructions, or escalates to a human
D) Atlas restarts the conversation session
**Answer: C** — When no Topic matches the input, Atlas responds with the out-of-scope handling defined in Agent Instructions. This prevents the agent from improvising answers on topics it has not been configured and tested to handle.

**Q6.** Which Agentforce agent type is designed to autonomously engage inbound prospects via email, ask qualifying questions, and book meetings with Account Executives?
A) Service Agent
B) Sales Coach Agent
C) Sales Development Rep (SDR) Agent
D) Custom Agent
**Answer: C** — The SDR Agent is designed for external-facing inbound lead qualification: engage leads via email, ask BANT qualification questions, and book meetings for qualified leads.

**Q7.** The Einstein Trust Layer provides which five controls for Agentforce deployments?
A) Authentication, Authorization, Encryption, Auditing, and Rate Limiting
B) Data Masking, Zero Data Retention, Toxicity Detection, Audit Log, and Grounding
C) Identity Verification, PII Protection, Content Filtering, Logging, and Data Sync
D) SSO, MFA, IP Restrictions, Session Limits, and Field-Level Security
**Answer: B** — The five Einstein Trust Layer controls are: Data Masking, Zero Data Retention, Toxicity Detection, Audit Log, and Grounding (RAG). These apply to all Salesforce AI features, not just Agentforce.

**Q8.** An organization needs to ensure that customer account numbers are never sent to an external LLM provider when the Agentforce agent processes requests. Which Trust Layer control addresses this?
A) Zero Data Retention
B) Audit Log
C) Toxicity Detection
D) Data Masking
**Answer: D** — Data Masking detects and replaces sensitive data (including account numbers, SSNs, credit card numbers) in the prompt before it is sent to the external LLM provider.

**Q9.** Sales Coach agent output goes to which audience?
A) Customers, after a sales call
B) Sales reps and their managers
C) Marketing teams for campaign optimization
D) The Salesforce administrator for reporting
**Answer: B** — Sales Coach analyzes call recordings and CRM data to generate coaching feedback for sales reps and their managers. It is an internal tool — the feedback never goes to customers.

**Q10.** Which statement correctly describes Zero Data Retention in the Einstein Trust Layer?
A) Salesforce does not store any conversation transcripts in the customer's org
B) By contractual agreement, the LLM provider discards prompt and completion data after processing and does not use it to train models
C) The agent deletes all conversation data from the customer's browser after each session
D) Zero Data Retention means the agent's reasoning trace is not logged
**Answer: B** — Zero Data Retention is a contractual agreement between Salesforce and its LLM providers. The provider processes the prompt and returns a response but does not retain the data afterward. Salesforce's own platform does store conversation transcripts in the customer's org.

**Q11.** An architect is designing an Agentforce deployment and needs the agent to complete a 5-step workflow: greet → verify identity → look up account → retrieve recent cases → generate summary. How many Atlas reasoning loop iterations will this take?
A) 1 — Atlas completes all steps in one pass
B) Up to 5 — Atlas may invoke one Action per iteration, cycling through the loop up to 5 times
C) Exactly 5 — each step requires exactly one loop iteration
D) The workflow cannot be completed because agents are limited to 3 actions per turn
**Answer: B** — The Atlas loop can cycle multiple times within a single user turn. Each action invocation requires one cycle (Act step), followed by an Observe step before the next reasoning step. A 5-step workflow could require up to 5 loop iterations plus final response generation.

**Q12.** A developer notices that an agent's response quality improves significantly when specific Knowledge articles exist for a topic, but degrades to incorrect answers when no articles are found. What is the correct term for this behavior and the pattern that prevents it?
A) Routing failure — prevented by improving Topic descriptions
B) Hallucination — prevented by grounding with verified knowledge sources
C) Escalation error — prevented by adding more escalation triggers to Instructions
D) Context overflow — prevented by reducing the length of Agent Instructions
**Answer: B** — When no grounded content is available, the LLM generates responses from training data, which can be incorrect — this is hallucination. Grounding with verified Knowledge articles prevents hallucination by providing the model with accurate source material to reference.

---

## Section 2: Building Agents — Topics & Actions (15 questions)

**Q13.** A developer creates a Topic called "Customer Support" and adds 15 Actions to it covering everything from order status to billing to technical support. What problem does this architecture create?
A) A single Topic can have a maximum of 10 Actions — the 15th Action will be silently ignored
B) Topic routing becomes irrelevant — Atlas immediately jumps to Action selection, which is less accurate with 15 similar Actions
C) The Topic description will be too long to fit in the context window
D) Actions cannot share a parent Topic — each Action must be in its own Topic
**Answer: B** — With one catch-all Topic, Atlas skips the Topic routing step (which provides scoping) and goes directly to Action selection among 15 items. With many Actions and less scoping, routing becomes less accurate. Best practice is 3-7 well-scoped Topics.

**Q14.** Which Flow type is required for a Flow to be used as an Agentforce Action?
A) Screen Flow
B) Schedule-Triggered Flow
C) Record-Triggered Flow
D) Autolaunched Flow (No Trigger)
**Answer: D** — Only Autolaunched Flows can be used as Agentforce Actions. Screen Flows have UI elements and cannot be invoked headlessly. Schedule-Triggered and Record-Triggered Flows fire on schedules or record events, not on-demand by an agent.

**Q15.** A developer builds an Autolaunched Flow to use as an agent Action, but when testing, the agent cannot pass a customer-provided order number to the Flow. What is the most likely cause?
A) Autolaunched Flows cannot accept inputs from Agentforce agents
B) The input variable on the Flow does not have "Available for Input" checked
C) The Flow is in a managed package and cannot be exposed as an agent Action
D) The agent must use an Apex Action instead of a Flow for parameter passing
**Answer: B** — For Atlas to pass parameter values to a Flow, the Flow's input variables must have "Available for Input" checked in the variable properties. Without this setting, Atlas cannot see or pass values to the variable.

**Q16.** What property of the `@InvocableMethod` annotation does Atlas primarily use to determine when to invoke an Apex Action?
A) `label` — the display name shown in Agentforce Builder
B) `description` — the natural language description read by Atlas for routing
C) `callout` — whether the method makes external web service calls
D) `category` — the action category used for grouping in Builder
**Answer: B** — The `description` property of `@InvocableMethod` is what Atlas reads to determine whether to invoke this Apex action for a given user intent — exactly like the Action description field in Agentforce Builder for Flow Actions.

**Q17.** An agent has two Actions in an "Account Management" Topic: "Update Billing Address" and "Update Shipping Address." Testers observe that Atlas frequently invokes "Update Billing Address" when customers ask to update their shipping address. What is the most effective fix?
A) Create separate Topics for billing and shipping address updates
B) Remove "Update Billing Address" — only keep one address update Action
C) Improve both Action descriptions to be more specific, and add explicit exclusion text: "Update Billing Address: use for billing/payment address only — NOT for shipping/delivery address"
D) Add an escalation trigger that routes address updates to a human agent
**Answer: C** — This is an Action description ambiguity problem. Adding explicit exclusions ("NOT for shipping/delivery address") to the Billing Address Action's description gives Atlas clear signal to differentiate. Option A (separate Topics) would work but is a heavier structural change; Option C is the most targeted fix.

**Q18.** A customer sends the message "I want to check my balance." The agent asks "What is your account number?" even though the customer is authenticated and their account ID is available in the session context. What configuration change would improve this experience?
A) Add the account balance lookup to the Agent Instructions
B) Change the accountId input parameter mapping from "Agent extracts from conversation" to a session context variable or "From prior Action output"
C) Remove the accountId as a required input parameter from the Action
D) Enable Data Cloud grounding to automatically populate account information
**Answer: B** — If the customer's account ID is already known from session context or authentication, the input mapping should pull from that context source rather than asking the customer. Changing the input source configuration from "Agent extracts from conversation" to the appropriate session/context source eliminates the unnecessary question.

**Q19.** Which statement correctly describes when to use a Knowledge Search Action vs. a Flow Action?
A) Knowledge Search Actions are faster; Flow Actions are slower — always use Knowledge Search for better performance
B) Knowledge Search Actions retrieve information from verified Knowledge articles; Flow Actions execute business logic and interact with Salesforce data
C) Knowledge Search Actions require Data Cloud; Flow Actions work with standard Salesforce objects
D) Both Action types do the same thing; the choice is a developer preference
**Answer: B** — Knowledge Search Actions search and retrieve content from Knowledge articles — they are for answering questions from a documented knowledge base. Flow Actions execute business logic, query records, update data, and return structured results. The use case determines the type: FAQ/policy question → Knowledge; data lookup/record operation → Flow.

**Q20.** An agent Topic description reads: "Handles questions." An administrator reports the agent routes unrelated questions to this Topic. What is the most likely cause and fix?
A) The Topic has too many Actions — reduce to one Action to improve routing
B) The description is too vague — almost any question could match it; rewrite with specific subject matter, trigger conditions, and explicit exclusions
C) The agent needs a separate "General Questions" Topic to catch overflow
D) The Trust Layer is misconfigured and blocking accurate routing
**Answer: B** — "Handles questions" is maximally vague — it semantically matches any question. Topic descriptions must be specific about what KIND of questions, what SUBJECT MATTER, and what is NOT included. This is the fundamental Topic description anti-pattern.

**Q21.** A Prompt Template Action is added to a Topic. When Atlas invokes it, the template returns generic, non-personalized content despite having merge fields for the customer's account tier and recent orders. What is the most likely cause?
A) Prompt Template Actions cannot use merge fields — they only generate generic text
B) The template input parameters for account tier and recent orders are not mapped in the Action configuration; Atlas is passing empty values to those parameters
C) Merge fields only work in Record Summary templates, not Flex templates
D) The template must be connected to Data Cloud to access account tier data
**Answer: B** — When input parameters are not configured in the Action's input mapping, Atlas passes empty values to the template. The template runs but the merge fields resolve to blank, producing generic output. Configure each input parameter's mapping (from conversation, session context, or prior action output) in the Action configuration.

**Q22.** Which of the following Action descriptions would Atlas be BEST able to use for accurate routing?
A) "Processes customer requests related to orders"
B) "Order API action"
C) "Retrieves the current fulfillment status, estimated delivery date, and carrier tracking number for a customer's order. Invoke when a customer asks where their order is, whether it has shipped, or when it will arrive. Requires the customer's order number."
D) "Handles order status queries by querying the SF_ORDER_LOOKUP_V2 endpoint with the orderId parameter"
**Answer: C** — Option C includes all three components of an effective Action description: what it returns (status, delivery date, tracking number), when to invoke it (asks about order location, shipping, or delivery), and what input it needs (order number). Options A and B are too vague. Option D uses technical jargon (system names and parameters) that does not help Atlas understand the action's business purpose.

**Q23.** A developer needs to create an Agentforce Action that makes an HTTP callout to a third-party shipment tracking API. Which Action type and annotation property is required?
A) Flow Action — use the HTTP Callout element in Flow Builder
B) Apex Action with `@InvocableMethod(callout=true)`
C) External API Action configured through Embedded Service settings
D) Knowledge Search Action pointed at an external URL
**Answer: B** — For HTTP callouts in an Agentforce Action, use an Apex Action with `@InvocableMethod(callout=true)`. The `callout=true` annotation property is required for any invocable method that makes external web service calls.

**Q24.** When configuring a Flow Action in Agentforce Builder, what does the "From prior Action output" input source setting allow?
A) The agent to retrieve data from a previous conversation session
B) The action to use a value returned by an earlier action in the same reasoning loop turn, without asking the customer
C) The agent to import data from a Data Cloud pipeline
D) The Flow to access values from the agent's Identity configuration
**Answer: B** — "From prior Action output" allows an input parameter to receive its value from the output of a previously invoked Action within the same turn's reasoning loop. This enables multi-step workflows where each action builds on the result of the previous one.

**Q25.** An administrator adds a Fault Path to an Agentforce Flow Action that sets an output variable `errorMessage` when the query returns no records. What is the advantage of this approach vs. letting the Flow throw an unhandled exception?
A) Fault paths improve Flow performance by bypassing error-prone SOQL queries
B) A structured error output allows Atlas to observe meaningful feedback and compose a helpful customer-facing error message, rather than experiencing an unhandled exception that disrupts the reasoning loop
C) Fault paths automatically retry the Flow query up to 3 times before returning an error
D) Only Flows with Fault paths can be used as Agentforce Actions
**Answer: B** — When a Flow throws an unhandled exception, Atlas receives an error state it cannot easily reason about. When the Flow returns a structured error output (via Fault Path), Atlas can observe the error message and generate an appropriate, helpful response for the customer — for example, "I couldn't find an order with that number. Could you double-check?"

**Q26.** Which statement about Topic descriptions and Action descriptions is correct?
A) Topic descriptions are used for routing to the right Action; Action descriptions are only for documentation
B) Topic descriptions scope which Actions are "in play" for a given message; Action descriptions determine which specific Action within that Topic Atlas invokes
C) Topic descriptions and Action descriptions serve identical purposes and either one can be left blank
D) Action descriptions are used for Topic-level routing; Topic descriptions are used for Action-level selection
**Answer: B** — Topic routing happens first: Atlas matches the message to a Topic using Topic descriptions. Once a Topic is matched, all Actions within that Topic are candidates, and Atlas uses Action descriptions to select the specific Action to invoke. Both levels of description matter.

**Q27.** A developer wants to understand why Atlas is invoking Action B instead of Action A for a specific customer message. Which tool provides the most direct diagnostic insight?
A) The Einstein Trust Layer audit log
B) The Agentforce Builder Conversation Simulator Reasoning Trace
C) The Salesforce Debug Log with CALLOUT log level
D) The Prompt Builder preview panel
**Answer: B** — The Reasoning Trace in the Agentforce Builder Conversation Simulator shows Atlas's internal decision process: which Topic matched, which Action was selected, what parameter values were extracted. This directly reveals where the routing decision diverged from expectations.

---

## Section 3: Prompt Builder & Templates (12 questions)

**Q28.** A company wants to add an AI-generated "Executive Summary" field to their Account records that sales reps can populate on demand from the record page. Which Prompt Template type should they use?
A) Flex
B) Record Summary
C) Field Generation
D) Sales Email
**Answer: C** — Field Generation templates save AI-generated content directly to a Salesforce record field. The "Generate" button on the record page triggers the template, which populates the field. Record Summary displays content transiently without saving. Flex requires developer invocation.

**Q29.** Which Prompt Template type is the correct choice when the template will be used as an Agentforce Action?
A) Field Generation
B) Record Summary
C) Sales Email
D) Flex
**Answer: D** — Only Flex templates can be used as Agentforce Actions. They have no UI dependency and support programmatic invocation from Flow, Apex, API, and Agentforce Actions. The other template types have UI-based invocation patterns incompatible with agent action invocation.

**Q30.** A Prompt Template merge field is `{!Case.Contact.Email}`. After running a preview, the merge field appears empty. Which investigation steps should the developer take first?
A) Check whether the merge field syntax is wrong — it should use square brackets instead of curly braces
B) Verify (1) the test Case has a Contact linked, and (2) that Contact has an Email value populated, and (3) the running user has FLS Read access to Contact.Email
C) Confirm that email fields are approved for use in Prompt Templates by Salesforce support
D) Increase the character limit of the email field to allow merge field access
**Answer: B** — An empty merge field means either the related record doesn't exist (no Contact linked to the Case), the field is blank on the record, or FLS is blocking field access. Investigate these three in order before assuming a syntax or configuration error.

**Q31.** After deploying a Prompt Template from sandbox to production using a change set, the template is not working. The administrator confirms the template deployed successfully. What is the most likely missing step?
A) The template needs to be re-tested in production before it can work
B) The template arrived in production in Inactive/Draft status and needs to be Activated
C) A metadata API deployment must also be run in addition to the change set
D) Prompt Templates cannot be deployed via change sets — they require Salesforce DX
**Answer: B** — Prompt Templates always arrive in the target org in an Inactive state after deployment. They must be manually activated in the target environment. This is by design to require a deliberate human review step before the template goes live.

**Q32.** A developer wants to include a list of all Contacts on an Account in a Prompt Template. They try `{!Account.Contacts.Name}` as a merge field but it returns empty. What is the correct approach?
A) Use `{!Account.Contacts[*].Name}` — the array notation is required for related list traversal
B) Pre-process the Contact list in a Flow (join names into a text string) and pass it to the template as a Text input parameter
C) Configure a related object context in the template that selects all related Contacts
D) Only the first Contact can be accessed — use `{!Account.Contact.Name}` (singular)
**Answer: B** — Prompt Builder merge fields do not support child record list iteration. The workaround is to pre-process the list in a Flow (concatenate contact names into a formatted string) and pass that string as a text input parameter to the template.

**Q33.** What is the purpose of the System Prompt section in a Prompt Template?
A) It defines the merge fields that can be used in the template body
B) It establishes the AI's role and context that applies globally to every invocation of the template
C) It specifies which grounding source the template uses
D) It is the section that is sent to the LLM as the user's message
**Answer: B** — The System Prompt establishes the AI's role, persona, and behavioral context — it is analogous to the system message in a direct LLM API call. It applies to every invocation of the template regardless of which record or input is used.

**Q34.** A Record Summary template produces the same output for every Case record it is previewed with. What is the most likely cause?
A) Record Summary templates generate static content by design
B) The Case-specific merge fields are placed in the System Prompt section rather than the Template Body section
C) The template has too few related object contexts configured
D) Record Summary templates require a minimum of 10 published Knowledge articles to produce dynamic content
**Answer: B** — The System Prompt is static across all invocations — it does not refresh per record. Merge fields in the System Prompt always use the same value (or are evaluated once). Dynamic, record-specific content must be in the Template Body, which is evaluated per record invocation.

**Q35.** Which of the four Prompt Template types displays AI-generated content on a Salesforce record page for a user to read, but does NOT save the content to the record?
A) Field Generation
B) Flex
C) Sales Email
D) Record Summary
**Answer: D** — Record Summary displays AI-generated content as a transient panel on the record page. It is for human consumption in the moment — the content is not saved to any record field. Field Generation saves to a field. Sales Email goes to the email composer. Flex is for programmatic invocation.

**Q36.** A developer tests a Flex template intended for use as an Agentforce Action. The preview produces good results with a specific Account record. However, after connecting it as an Action, the agent's response using this template seems lower quality. What is the most likely issue?
A) Flex templates lose quality when invoked by an agent versus the preview panel
B) The input parameters passed by the agent contain less or different data than the test record used in preview; the mapping configuration needs to be reviewed
C) Agents degrade template quality due to Trust Layer processing overhead
D) The template must be re-activated after connecting it to an agent Action
**Answer: B** — The Prompt Builder preview uses a selected record's full, real data. When invoked by an agent, the template receives only what the input mapping is configured to pass. If the agent is passing empty or partial inputs, the template produces lower-quality output. Review the input mapping in the Action configuration.

**Q37.** A company wants AI-generated draft emails to appear in the Salesforce email compose window when a sales rep opens a follow-up email to a contact. Which template type enables this?
A) Flex
B) Field Generation
C) Sales Email
D) Record Summary
**Answer: C** — Sales Email templates generate draft email content in the Salesforce email compose window. The AI-generated draft appears for the rep to review and edit before sending. Flex requires programmatic invocation, not a compose-window integration.

**Q38.** A Flex template is configured with an input parameter `customerName` (Text type). When the Agentforce Action for this template is invoked, `customerName` receives empty string. Which input mapping source would correctly populate it with the authenticated customer's name?
A) "Agent extracts from conversation" — Atlas will find the name in the chat
B) "Static value" set to a hardcoded placeholder name
C) "From session context" using the authenticated user's Name field (if session identity is configured)
D) The customerName field must be removed — templates cannot receive user identity data
**Answer: C** — If the customer is authenticated and the agent session has identity context, the input mapping can reference the session's user name. "From session context" (or the specific option available in your release) pulls the authenticated user's name directly without requiring the customer to state it. The exact label in the UI may vary by release.

**Q39.** When Grounding is configured within a Prompt Template, what is the role of the Search Query field?
A) It defines a keyword list that Salesforce uses to build a SOQL query against Knowledge
B) It specifies the dynamic query (often a merge field expression) used to search the grounding source; the query drives which content is retrieved and injected into the prompt context
C) It sets the minimum character count for the retrieved article before inclusion
D) It is a static label that identifies which Knowledge base to search
**Answer: B** — The Search Query field specifies what to search for in the grounding source. It can be a static phrase or a merge field expression (e.g., `{!Case.Subject}` so each case searches for articles relevant to that specific case subject). The query result — the relevant articles or records — is then injected into the prompt context.

---

## Section 4: Testing, Deployment & Monitoring (9 questions)

**Q40.** After running agent test cases, a developer finds the agent provides incorrect policy information. The agent has no Knowledge grounding configured. Which remediation most directly addresses the root cause?
A) Add more explicit behavioral rules to Agent Instructions
B) Add a Knowledge Search Action grounded with verified Knowledge articles
C) Increase the number of Topics to provide more routing options
D) Reduce the maximum reasoning iterations to prevent the agent from generating extra content
**Answer: B** — Incorrect factual information from an ungrounded agent is hallucination — the LLM generates from training data, which may be wrong. The root cause fix is grounding: add a Knowledge Search Action pointing at verified Knowledge articles so the agent answers from authoritative source material.

**Q41.** What state must an Agentforce agent be in to receive live customer conversations from deployed channels?
A) Draft
B) Preview
C) Active
D) Published
**Answer: C** — An agent must be in the Active state to receive live conversations. Draft agents can only be tested in the Builder simulator. There is no "Published" state — agents are Active or Deactivated (or Draft during configuration).

**Q42.** During testing, a customer message triggers the agent to ask for an order number. When the tester provides the order number, the agent asks for it again. This repeats three times. Which failure mode is this and what is the recommended fix?
A) Hallucination — fix by adding Knowledge grounding
B) Wrong Action invocation — fix by improving the Action description
C) Stuck in loop — fix by verifying the Flow input variable has "Available for Input" checked and the input mapping is correct
D) Out-of-scope — fix by adding the Order Status Topic
**Answer: C** — This is a stuck-in-loop failure mode specifically caused by the agent not being able to use the value it collects. The Flow input variable likely doesn't have "Available for Input" checked, so the extracted order number is not passed to the Flow correctly and the agent keeps asking.

**Q43.** A company deploys their Agentforce agent to three channels: Embedded Service Chat (web), Salesforce Mobile (internal reps), and Slack (employee support). How many separate agent configurations are required?
A) Three — one per channel
B) One — channels are configured separately but they all reference the same agent
C) Two — external channels (web) share one agent; internal channels share another
D) Six — each channel requires a separate Topics configuration
**Answer: B** — Agentforce is channel-agnostic: one agent configuration serves multiple deployment channels. The channels (Embedded Chat, Mobile, Slack) are configured as separate deployments in the channel settings, but they all point to the same underlying agent with its Topics, Actions, and Instructions.

**Q44.** What is the Agentforce licensing model?
A) Per-user seat licensing — priced by number of licensed Salesforce users
B) Per-org flat fee — one annual price regardless of usage
C) Consumption-based — priced per conversation (agent session)
D) Per-action licensing — priced by the number of Flow and Apex actions invoked
**Answer: C** — Agentforce uses consumption-based licensing measured per conversation (session). You purchase a block of conversations, not user seats. Simulator testing in Agentforce Builder does not count toward consumption.

**Q45.** After deploying an agent, the analytics show a 12% resolution rate (agents resolves only 12% of conversations without escalating). What is the correct initial response?
A) Disable the agent immediately — a 12% resolution rate means it is broken
B) Increase the Omni-Channel queue capacity to handle the 88% escalation volume
C) Review a sample of escalated conversation transcripts to identify the most common reasons for escalation, then improve the configuration based on those patterns
D) Add more Topics to the agent to cover more scenarios
**Answer: C** — A low resolution rate signals that the agent is not handling many conversations successfully, but the correct response is diagnosis before action. Reviewing escalated transcripts reveals the root cause: is there a missing Topic? Are Actions failing? Are customers asking for things outside configured scope? The fix depends on the diagnosis.

**Q46.** A company needs to prove to their compliance team that customer conversations with the Agentforce agent can be reviewed for audit purposes. Which Salesforce feature provides this capability?
A) Einstein Trust Layer Zero Data Retention — stores conversation data for compliance
B) Agentforce conversation history records stored in the Salesforce org, accessible via SOQL and reports
C) The Agentforce Builder Conversation Simulator logs — retained for 90 days
D) This capability requires a third-party compliance tool — Salesforce does not store agent conversations
**Answer: B** — Agentforce stores conversation records (transcripts, action logs, outcomes) as Salesforce records in the customer's org. These are accessible via SOQL queries and can be reported on. Zero Data Retention is about the LLM provider, not Salesforce's own storage.

**Q47.** For an Embedded Service Chat deployment, what is required for the agent to successfully transfer a customer to a live human agent when escalation is needed?
A) A Prompt Template Action that generates an escalation message
B) A configured Omni-Channel routing queue with live agents assigned
C) A separate "Human Handoff" agent that receives the escalation
D) An Apex Action that calls the Salesforce LiveAgent API directly
**Answer: B** — Escalation from an Agentforce agent to a live human requires a configured Omni-Channel routing queue with live service agents assigned. The agent's Instructions define when to escalate; the Omni-Channel configuration determines where the escalation routes.

**Q48.** A developer made configuration changes to a live Active agent and users are now reporting inconsistent behavior. What is the likely cause and best practice to prevent this in future?
A) Configuration changes to Active agents are not allowed — the changes were rejected
B) Configuration changes to an Active agent take effect immediately and can affect live conversations; best practice is to deactivate before making changes, test in simulator, then reactivate
C) The Trust Layer detected the changes as suspicious and rolled back the agent configuration
D) The agent needs to be redeployed to the channel after any configuration change
**Answer: B** — Changes to an Active agent take effect immediately for live conversations. Making changes while the agent is handling real customer interactions can cause inconsistent behavior mid-conversation. Best practice: deactivate → make changes → test → reactivate.

---

## Section 5: Use Cases & Business Value (12 questions)

**Q49.** A retail company receives 5,000 customer service inquiries per day. Analysis shows 60% are for order status, return policy questions, and shipping inquiries. The remaining 40% require human specialist involvement. Which Agentforce design is most appropriate?
A) SDR Agent handling all 5,000 contacts to pre-qualify them before routing to human agents
B) Service Agent with Topics for Order Status, Return Policy (Knowledge-grounded), and Shipping FAQ (Knowledge-grounded), deployed via Embedded Service Chat, with Omni-Channel escalation for the 40%
C) Custom Agent with a single Topic covering all service scenarios to maximize routing flexibility
D) Sales Coach Agent analyzing customer interactions to improve human agent response quality
**Answer: B** — This is a textbook customer service deflection use case: high volume, well-defined service topics, clear escalation path for complex cases. Service Agent template is the right starting point. Knowledge grounding for policy topics, Flow Actions for personalized data (order status), Omni-Channel escalation for the 40% requiring human involvement.

**Q50.** An HR team wants to deploy an agent that answers employee questions about PTO policies, benefits enrollment, and payroll schedule. Which template should they start with?
A) Service Agent — it is the most full-featured template
B) SDR Agent — it handles form-like intake conversations
C) Custom Agent — there is no pre-built HR template; Service Agent is designed for external customer service
D) Sales Coach — it has manager-employee interaction workflows built in
**Answer: C** — There is no pre-built HR template in Agentforce. Service Agent is designed for external customer-facing service scenarios with default Topics like Order Management that are not relevant to HR. Custom Agent is the correct starting point for HR employee self-service.

**Q51.** A company wants employees to access the HR self-service agent from the tool they use for all team communication, without opening Salesforce. Which deployment channel is most appropriate?
A) Embedded Service Chat — deployed on the company intranet
B) Salesforce Mobile — available on all employee devices
C) Slack — meets employees where they already work, without requiring them to open Salesforce
D) API — accessed via a custom browser extension
**Answer: C** — Slack deployment is ideal for internal-facing agents because employees are already in Slack for team communication. It meets users where they are rather than requiring context switching to Salesforce. This is the recommended channel for internal-facing Custom Agents serving employees.

**Q52.** A field service company wants to let customers schedule technician visits via a chat widget on their website. The agent should capture the issue description, offer available appointment slots from the FSM system, and create a work order when the customer confirms. Which agent type and key actions are needed?
A) Service Agent + Knowledge Search for appointment availability
B) Custom Agent + Flow Actions connected to Salesforce Field Service Management
C) SDR Agent + email channel + meeting booking integration
D) Sales Coach + calendar integration
**Answer: B** — Field service scheduling is a Custom Agent use case (no pre-built template). The key Actions are Flow Actions connecting to Salesforce Field Service Management — querying available slots, creating Work Orders, and sending confirmation. Service Agent doesn't have FSM integration by default.

**Q53.** Which characteristic makes a business process a POOR fit for Agentforce?
A) High volume of similar requests
B) Well-defined step-by-step workflow
C) Requires human judgment with legal accountability for each decision
D) Outcome is predictable given the inputs
**Answer: C** — Processes that require named human accountability for legally significant decisions (e.g., credit decisions, medical diagnoses, legal commitments) are poor fits for autonomous agent action. The agent can assist in gathering information, but the actual decision should be made by a human.

**Q54.** An SDR Agent is configured to qualify inbound leads and book meetings. A manager reports that the agent is booking meetings for clearly unqualified leads (company size under 10 employees; the company targets mid-market with 200+ employees). What is the most likely configuration gap?
A) The SDR Agent does not support qualification filtering — this requires a human SDR
B) The disqualification criteria (company size thresholds) are not clearly defined in the agent's Topics or Instructions; add explicit qualification criteria
C) The calendar booking Flow has a bug — it is not checking the Lead record before booking
D) The meeting booking Action has no Action description — Atlas is invoking it for all leads
**Answer: B** — If the qualification criteria (200+ employees for mid-market) are not defined in the agent's configuration, the agent cannot apply them. Add explicit qualification criteria to the Lead Qualification Topic instructions or create a Decision element in the qualification Flow that checks company size before allowing the meeting booking step.

**Q55.** A sales manager wants automated coaching feedback on their team's sales calls to help reps improve their discovery and closing techniques. Which Agentforce feature is designed for this?
A) SDR Agent — analyzes call recordings and sends feedback to leads
B) Service Agent — monitors customer interactions for service quality
C) Sales Coach Agent — analyzes call recordings and CRM data to generate coaching feedback for reps
D) Custom Agent deployed via Slack with call recording integration
**Answer: C** — Sales Coach is purpose-built for this use case: analyze sales call recordings and CRM data, generate coaching feedback for sales reps. The output goes to reps and managers, not customers. SDR Agent handles external lead qualification, not internal coaching.

**Q56.** What is the primary business value metric used to quantify the ROI of a customer service Agentforce deployment?
A) Number of Knowledge articles created
B) Number of agent Actions configured
C) Deflection rate — the percentage of contacts resolved by the agent without human agent involvement
D) Average agent reasoning loop iterations per conversation
**Answer: C** — Deflection rate (the percentage of service contacts resolved by the agent autonomously without escalating to a human) is the primary ROI metric for customer service deployments. It directly translates to cost savings: deflected contacts cost significantly less per interaction than human-handled contacts.

**Q57.** An organization is deciding between building one large Custom Agent that handles all use cases (customer service, internal HR, and sales qualification) vs. three separate specialized agents. Which approach is recommended and why?
A) One large agent — easier to maintain; fewer configurations to update
B) Three specialized agents — each agent has focused scope, more accurate routing, and dedicated testing; Topics are more specific and Atlas routing is more reliable
C) One large agent — Salesforce licensing is per agent, so consolidation saves money
D) The choice makes no difference — Atlas routing is accurate regardless of scope
**Answer: B** — Three specialized agents is the recommended approach. Focused scope means better routing accuracy (fewer Topics competing for each message), easier maintenance (changes to HR agent don't risk breaking customer service behavior), and clearer ownership. One large agent with many Topics across multiple domains is an anti-pattern that leads to routing ambiguity.

**Q58.** Which of the following use cases is best suited for an Agentforce Prompt Template Action rather than a Flow Action?
A) Retrieving the customer's account balance from the Account object
B) Creating a new Case record when a customer reports an issue
C) Generating a personalized empathetic response explaining a billing discrepancy
D) Updating the customer's shipping address on their account record
**Answer: C** — Generating personalized, natural-language content (an empathetic explanation) is a generative task that requires LLM capabilities — use a Prompt Template Action. The other options (retrieve balance, create Case, update address) are deterministic record operations — use Flow Actions for these.

**Q59.** A Service Agent has been deployed for 30 days. The operations team reviews analytics and finds that the "Technical Support" Topic has a 72% abandonment rate (customers leave without resolution or escalation). What does this metric most likely indicate?
A) The Trust Layer is blocking too many responses
B) The Technical Support Topic does not have good enough Knowledge articles or Flow Actions to resolve the common issues; customers are abandoning because the agent is not helpful
C) The Technical Support Topic is working correctly — 28% resolution is expected for technical issues
D) The agent needs more Questions Topics to improve initial routing to Technical Support
**Answer: B** — A 72% abandonment rate means customers are leaving mid-conversation without getting help. This indicates the agent is not providing useful responses for technical issues — likely due to missing or poor-quality Knowledge articles, missing Actions for common technical tasks, or knowledge gaps. The fix is to improve the Knowledge base and Actions for Technical Support.

**Q60.** A developer is asked to justify deploying Agentforce for a process that currently handles 50 inquiries per day and requires specialized judgment with regulatory compliance requirements. How should they respond?
A) Proceed with deployment — Agentforce handles all volumes and compliance requirements
B) Recommend against deployment — 50 daily inquiries is too low-volume to justify the setup cost, and regulatory compliance requirements with accountability concerns make this a poor fit for autonomous agent actions
C) Proceed with deployment using "assisted" actions so a human reviews every decision
D) Deploy the SDR Agent template with compliance-specific Instructions
**Answer: B** — This is a poor fit for Agentforce on two counts: (1) low volume (50/day) provides insufficient ROI to justify the implementation cost, and (2) regulatory compliance with accountability requirements means human judgment and named responsibility are needed — autonomous agent actions are inappropriate. Recognizing a poor fit is as important as designing good fits.

---

## Answer Key Summary

| Q | A | Q | A | Q | A |
|---|---|---|---|---|---|
| 1 | B | 21 | B | 41 | C |
| 2 | B | 22 | C | 42 | C |
| 3 | A | 23 | B | 43 | B |
| 4 | C | 24 | B | 44 | C |
| 5 | C | 25 | B | 45 | C |
| 6 | C | 26 | B | 46 | B |
| 7 | B | 27 | B | 47 | B |
| 8 | D | 28 | C | 48 | B |
| 9 | B | 29 | D | 49 | B |
| 10 | B | 30 | B | 50 | C |
| 11 | B | 31 | B | 51 | C |
| 12 | B | 32 | B | 52 | B |
| 13 | B | 33 | B | 53 | C |
| 14 | D | 34 | B | 54 | B |
| 15 | B | 35 | D | 55 | C |
| 16 | B | 36 | B | 56 | C |
| 17 | C | 37 | C | 57 | B |
| 18 | B | 38 | C | 58 | C |
| 19 | B | 39 | B | 59 | B |
| 20 | B | 40 | B | 60 | B |

**Scoring Guide:**
- 54-60 correct (90-100%): Excellent — ready for exam
- 46-53 correct (77-88%): Good — review weak areas before exam
- 39-45 correct (65-75%): Passing threshold area — additional study recommended
- Under 39 correct (<65%): Review course materials for identified weak sections
