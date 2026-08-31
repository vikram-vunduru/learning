# Lecture 01: Developer Console & Tools

## Learning Objectives
- Navigate the Salesforce Developer Console and use its core panels: Log Inspector, Query Editor, and Execute Anonymous
- Set up a local development environment using VS Code with the Salesforce Extension Pack and the Salesforce CLI (SFDX)
- Distinguish between scratch orgs, sandboxes, and Developer Edition orgs for different development scenarios
- Use Workbench to explore REST resources and run ad-hoc SOQL queries

## Slides

### Slide 1: The Salesforce Developer Ecosystem
**Visual:** Diagram showing three layers — browser-based tools (Developer Console, Workbench), local tools (VS Code + SFDX), and org environments (Scratch Org, Sandbox, DE Org) connected by two-way arrows.
**Content:**
- Salesforce provides both browser-based and local development tools
- Browser tools: Developer Console, Workbench, Setup UI
- Local tools: VS Code + Salesforce Extension Pack, Salesforce CLI
- All tools interact with a Salesforce org via the Metadata API or Tooling API
**Speaker Notes:** There is no single "right" tool — each has its purpose. Developer Console is great for quick debugging and ad-hoc queries, while VS Code with the CLI is the standard for production development workflows. Understanding both is required for the PDI exam.

### Slide 2: The Developer Console
**Visual:** Annotated screenshot of the Developer Console showing the menu bar, source code editor, log panel, and the tabs for Logs, Tests, Checkpoints, Query Editor, and View State.
**Content:**
- Accessed via Setup menu → Developer Console (or gear icon)
- **Source Editor:** Create/edit Apex classes, triggers, Visualforce, Lightning components
- **Log Inspector:** Analyze debug logs with execution path, limits, heap, and callout details
- **Query Editor:** Run SOQL and SOSL queries interactively; view result grids
- **Execute Anonymous:** Run ad-hoc Apex without saving to the org
**Speaker Notes:** The Developer Console is entirely browser-based — no installation required. It is the fastest way to test a snippet of Apex or verify a SOQL query against live data. However, it has no version control, which is why professional development always involves the CLI and VS Code.

### Slide 3: Execute Anonymous Window
**Visual:** Split panel showing code typed in the Execute Anonymous input window on the left and a debug log output on the right, with a System.debug line highlighted.
**Content:**
- Debug menu → Open Execute Anonymous Window (Ctrl+E)
- Runs Apex in the context of the currently logged-in user
- Does NOT save code to the org — perfect for experimentation
- Output appears in the Logs tab; filter by USER_DEBUG to find System.debug output
- Exceptions show full stack traces — invaluable for testing

```apex
// Example: Execute Anonymous snippet
Account a = new Account(Name = 'Test Corp');
insert a;
System.debug('Inserted Account Id: ' + a.Id);
```
**Speaker Notes:** Execute Anonymous is your scratch pad. Every Apex developer uses it daily to test logic, verify governor limit counts, or quickly insert test data. On the exam, remember that Execute Anonymous runs under the current user's permissions — if the user lacks access to an object, DML will fail.

### Slide 4: Log Inspector & Debug Levels
**Visual:** Flowchart showing how a Salesforce transaction generates a debug log, which flows to the Log Inspector, and how log categories (Apex Code, Database, Workflow, etc.) can be set to different verbosity levels (ERROR, WARN, INFO, DEBUG, FINE, FINER, FINEST).
**Content:**
- Debug logs capture up to **2 MB** per log; oldest entries trimmed if exceeded
- Log categories: Apex Code, Database, System, Validation, Workflow, Callout, Visualforce
- Set verbosity in Setup → Debug Log or via the Developer Console Logs panel
- Log Inspector panels: Execution Overview, Execution Stack, Execution Log, Source
- Use `System.debug(LoggingLevel.ERROR, message)` to control log level programmatically
**Speaker Notes:** Being able to read a debug log efficiently separates novice developers from experienced ones. The Execution Stack panel shows the call hierarchy, while Execution Log shows every event in sequence. For the exam, know the 2 MB limit and that retained logs are stored for 24 hours.

### Slide 5: Salesforce CLI & SFDX Project Structure
**Visual:** Directory tree of a typical SFDX project — sfdx-project.json at root, force-app/main/default/ folder, with sub-folders for classes, triggers, lwc, aura, objects, layouts, and permissionsets.
**Content:**
- Install: `npm install -g @salesforce/cli` — produces the `sf` command
- Authenticate: `sf org login web --alias myOrg`
- Create project: `sf project generate --name MyProject`
- Key files: `sfdx-project.json` (package directories, API version), `.forceignore` (like .gitignore)
- Pull/push: `sf project retrieve start` / `sf project deploy start`
- Run tests: `sf apex run test --test-level RunLocalTests`
**Speaker Notes:** The Salesforce CLI is the backbone of modern Salesforce development. Version control, CI/CD pipelines, scratch org automation, and package development all depend on it. For the PDI exam, understand the core commands and the sfdx-project.json structure, particularly the `packageDirectories` and `sourceApiVersion` fields.

### Slide 6: VS Code & Salesforce Extension Pack
**Visual:** VS Code window with the Salesforce Extension Pack sidebar visible, showing icons for Org Browser, SFDX commands palette, and a Apex class file open with IntelliSense autocomplete dropdown.
**Content:**
- Install: VS Code + "Salesforce Extension Pack" from the marketplace
- Features: Apex syntax highlighting, IntelliSense, inline error checking
- **Org Browser:** Browse metadata in connected org graphically
- **SFDX commands:** Full CLI access via Command Palette (Cmd/Ctrl+Shift+P)
- Apex Replay Debugger: Step through debug logs line-by-line like a real debugger
- Supports Lightning Web Component development with local dev preview
**Speaker Notes:** VS Code with the Salesforce Extension Pack is the recommended IDE for all new Salesforce development. The Apex Replay Debugger is particularly powerful — it takes a debug log and lets you replay execution, inspect variables, and set breakpoints, all without rerunning code in the org.

### Slide 7: Workbench
**Visual:** Workbench interface screenshot showing the REST Explorer with a GET request to /services/data/v61.0/sobjects/Account and the JSON response panel.
**Content:**
- Free browser tool: workbench.developerforce.com
- **SOQL/SOSL queries:** Interactive query builder with bulk export
- **REST Explorer:** Test any Salesforce REST API endpoint
- **Metadata:** Deploy/retrieve metadata ZIP files
- **Bulk Data Load:** Insert/update/delete large datasets via Bulk API
- Login with OAuth — no password stored in Workbench
**Speaker Notes:** Workbench is an indispensable tool for exploring the Salesforce REST API and running complex SOQL queries with relationship traversal. Many developers use Workbench's SOQL query interface because it offers better formatting and CSV export than the Developer Console. On the exam, Workbench is often referenced in deployment and REST API scenarios.

### Slide 8: Org Types for Development
**Visual:** Comparison table with three columns — Scratch Org, Sandbox, Developer Edition — and rows for: Source, Purpose, Duration, Data, and Reset.
**Content:**
- **Developer Edition (DE) Org:** Free, permanent, 5 MB data — good for learning
- **Sandbox:** Copy of production (or empty); types: Developer (200 MB), Developer Pro (1 GB), Partial (5 GB), Full (full copy)
- **Scratch Org:** Temporary (max 30 days), source-driven, created from config file — ideal for CI/CD
- Scratch orgs require a Dev Hub enabled org
- `sf org create scratch --definition-file config/project-scratch-def.json --duration-days 7`
**Speaker Notes:** The exam tests your understanding of when to use each org type. Scratch orgs are preferred for package development and CI/CD because they are disposable, source-driven, and can be spun up with a specific set of features. Sandboxes remain essential when you need production data (Partial/Full) or need to test integrations with existing configuration.

## Recording Script
Welcome to Lecture 1 of the Salesforce Platform Developer I course. In this lecture, we are going to set up your development environment and get comfortable with the tools you will use every single day as a Salesforce developer.

Let's start with the Developer Console, because it is available in every Salesforce org with no installation required. You access it from the gear icon in the top right of any Salesforce page and selecting Developer Console. Once it opens, take a moment to look at the tabs at the top: Logs, Tests, Checkpoints, Problems, and at the bottom you will see the Query Editor and Source Code editor.

The first thing I want you to do is open the Execute Anonymous window. Go to Debug in the menu bar, then Open Execute Anonymous Window, or press Ctrl+E. This is your sandbox — any Apex you type here runs immediately in your org but does not get saved anywhere. Type `System.debug('Hello Salesforce');` and click Execute. Now check the Logs tab. Find your log entry, double-click it to open the Log Inspector, and look for the USER_DEBUG line. That is your output.

Now let's talk about the Log Inspector. When you are debugging a complex process — like an Apex trigger firing during a record save — the debug log is your primary diagnostic tool. The Execution Stack panel shows you exactly where in the call hierarchy you are. The Execution Log panel shows every event in sequence. You can filter by category, so if you only care about your Apex code output, filter to Apex Code.

For serious development work, we are going to move to VS Code. Download Visual Studio Code from code.visualstudio.com and then install the Salesforce Extension Pack from the Extensions marketplace. Once that is done, install the Salesforce CLI by running `npm install -g @salesforce/cli` in your terminal.

With the CLI installed, authenticate to your org by running `sf org login web --alias myDevOrg`. This opens a browser window, you log in, authorize the CLI, and you are connected. Now you can create a project with `sf project generate --name PDICourse`, open that folder in VS Code, and you are ready to develop.

The SFDX project structure is important to understand. The `sfdx-project.json` file at the root defines where your source code lives — typically `force-app/main/default/` — and what API version you are targeting. Inside that default folder, you will find separate directories for classes, triggers, lwc, aura, objects, and more. This mirrors exactly how Salesforce stores metadata.

I also want to introduce you to Workbench at workbench.developerforce.com. Log in with OAuth, and you get a powerful browser-based tool for running SOQL queries with relationship joins, exploring the REST API, and deploying metadata ZIP files. It is particularly useful for verifying data after a deployment or exploring API endpoints before writing integration code.

Finally, understand your org options. A free Developer Edition org is perfect for this course. If you are working in a professional context, you will use sandboxes — which are copies of your production org — or scratch orgs, which are temporary disposable environments you create from a configuration file. Scratch orgs are the future of Salesforce development, especially for package development and CI/CD pipelines.

With your environment set up, you are ready to start writing Apex in the next lecture. See you there.

## Exam Tips
- The Developer Console Execute Anonymous window runs Apex as the currently logged-in user — sharing/security rules apply just as they would for that user running any other operation.
- Debug logs are capped at **2 MB** per log; if exceeded, the log is truncated from the oldest entries (not the newest).
- Retained debug logs are kept for **24 hours** and up to **1,000 logs** per user.
- Scratch orgs require a **Dev Hub** org to be enabled; they can be created for a maximum of **30 days** per scratch org definition.
- The `sf project deploy start` command replaces the older `sfdx force:source:deploy`; know both naming conventions as exam questions may reference either.

## Lecture Summary
The Salesforce development toolchain combines browser-based tools — Developer Console, Workbench — with local tools including VS Code with the Salesforce Extension Pack and the Salesforce CLI. The Developer Console's Execute Anonymous window and Log Inspector are essential for day-to-day debugging, while the CLI enables source-driven development, scratch org management, and CI/CD automation. Choosing the right org type — Developer Edition for learning, Sandboxes for data-heavy testing, and Scratch Orgs for automated package development — is a recurring exam topic tied to the development lifecycle.

## Mini Quiz

**Q1:** A developer wants to test a small snippet of Apex code quickly without creating a permanent class in the org. Which tool should they use?
A) Create a new Apex class in VS Code and deploy it
B) Open the Execute Anonymous window in the Developer Console
C) Use the REST Explorer in Workbench
D) Write a test class and run it from the Developer Console Tests tab
**Answer:** B — Execute Anonymous runs Apex immediately in the current user's context without saving the code to the org, making it ideal for quick experimentation and testing.

**Q2:** A developer needs to create a temporary, source-driven org to develop a new managed package feature in isolation. Their pipeline will spin up this org automatically. Which org type is most appropriate?
A) Full Sandbox
B) Developer Sandbox
C) Scratch Org
D) Developer Edition Org
**Answer:** C — Scratch Orgs are temporary (up to 30 days), source-driven, and designed to be created and destroyed programmatically as part of CI/CD pipelines. They require a Dev Hub.

**Q3:** A debug log in the Developer Console is showing incomplete output, with the message indicating the log was truncated. What is the most likely cause?
A) The user does not have permission to view debug logs
B) The Apex class has a governor limit exception
C) The log exceeded the 2 MB per-log size limit
D) The log is older than 7 days and was partially deleted
**Answer:** C — Debug logs are capped at 2 MB. When a log exceeds this limit, the oldest entries are trimmed. Reducing log verbosity levels (e.g., changing Apex Code from FINEST to DEBUG) is the standard fix.
