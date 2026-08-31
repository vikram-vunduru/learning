# Lecture 22: Debugging Tools

## Learning Objectives
- Configure and read Apex debug logs using the available log categories and levels
- Use System.debug() with LoggingLevel enum values to control log verbosity
- Navigate the Developer Console to inspect execution logs, stack traces, and variable state
- Use Anonymous Apex and checkpoints to rapidly test and inspect code at runtime

## Slides

### Slide 1: Debug Logs Overview
**Visual:** Diagram of Salesforce platform architecture with a "Debug Log Capture" layer highlighted, showing logs flowing from Apex execution to the log store
**Content:**
- Debug logs capture detailed execution information for a specific **user or automated process**
- Configurable via **Setup > Debug Logs**: add a log filter for a user, then trigger the code
- Logs are retained for **24 hours** or until the **1,000-log-per-org limit** is reached
- Maximum log size is **20 MB** — logs truncate if they exceed this
- Log categories: `APEX_CODE`, `APEX_PROFILING`, `CALLOUT`, `DATABASE`, `SYSTEM`, `VALIDATION`, `VISUALFORCE`, `WORKFLOW`
- Each category has an independent level setting
**Speaker Notes:** Debug logs are the primary window into what Apex is actually doing at runtime. Unlike breakpoints in traditional IDEs, Salesforce debugging requires that you pre-configure which user's execution you want to capture before the code runs. Understanding how to set this up and read the output is essential for any Apex developer.

---

### Slide 2: Log Levels and Categories
**Visual:** Table grid with categories as rows and levels (NONE, ERROR, WARN, INFO, DEBUG, FINE, FINER, FINEST) as columns, with common settings highlighted
**Content:**
- **Log levels** in increasing verbosity: `NONE` → `ERROR` → `WARN` → `INFO` → `DEBUG` → `FINE` → `FINER` → `FINEST`
- Higher levels include all messages from lower levels
- Key categories and recommended levels for debugging:
  - `APEX_CODE: DEBUG` — captures System.debug() calls and exceptions
  - `DATABASE: INFO` — captures DML and query operations
  - `CALLOUT: INFO` — captures HTTP request/response headers and bodies
  - `SYSTEM: DEBUG` — captures system method calls and governor limit events
- `FINEST` on all categories produces the most detailed but largest logs
**Speaker Notes:** Setting everything to FINEST is tempting but counterproductive — logs fill up fast, truncate, and become hard to read. For most debugging, APEX_CODE at DEBUG plus DATABASE at INFO gives you 90% of what you need. Add CALLOUT INFO when debugging integrations and WORKFLOW INFO when troubleshooting automation interactions.

---

### Slide 3: System.debug() and LoggingLevel
**Visual:** Code snippet showing System.debug with different LoggingLevel values, and a sample log output line with timestamp, category, level, and message labeled
**Content:**
- `System.debug(message)` writes to the log at `DEBUG` level under `APEX_CODE`
- `System.debug(LoggingLevel.WARN, message)` writes at WARN level — only appears when that log filter captures WARN or above
- LoggingLevel enum values: `ERROR`, `WARN`, `INFO`, `DEBUG`, `FINE`, `FINER`, `FINEST`
- Useful for tracing values through complex logic:
```apex
System.debug('Account Rating: ' + acct.Rating);
System.debug(LoggingLevel.WARN, 'Revenue below threshold: ' + acct.AnnualRevenue);
System.debug(LoggingLevel.FINE, 'Processing record: ' + JSON.serialize(acct));
```
- Log line format: `timestamp | category | level | ... | USER_DEBUG | [line#] | LEVEL | message`
**Speaker Notes:** System.debug is your most basic tool but also your most reliable. Unlike conditional logging in some languages, every System.debug call you write will appear in the log when that level is active. Use different LoggingLevel values to tier your log verbosity — keep routine trace output at FINE so it only appears during deep debugging sessions.

---

### Slide 4: The Developer Console
**Visual:** Screenshot mockup of Developer Console with labeled panels: Query Editor, Source panel, Log Inspector panels (Stack Tree, Execution Log, Variables/View State)
**Content:**
- Access via **Setup menu > Developer Console** (or gear icon > Developer Console)
- **Log Inspector**: opens a structured view of the selected debug log
  - **Execution Log**: chronological list of log events with timestamps
  - **Stack Tree**: hierarchical view of method calls
  - **Source**: shows the source file and highlights the line for the selected log event
  - **Variables/View State**: shows variable values at the selected execution point
- **Execute Anonymous**: run Apex snippets directly from the console
- **Query Editor**: run SOQL/SOSL directly
**Speaker Notes:** The Developer Console's Log Inspector transforms a wall of raw text into a navigable tree. When you click on a log event in the Execution Log, the Source panel jumps to that exact line of code. This makes it much faster to trace the path through a complex execution than reading raw log output.

---

### Slide 5: Anonymous Apex — Quick Testing Without Deployment
**Visual:** Flow diagram: developer types Apex → Execute Anonymous → platform compiles and runs in the current org context → output appears in log → no class saved
**Content:**
- **Execute Anonymous** runs Apex code immediately without saving it as a class
- Perfect for: quick data fixes, exploring API behavior, testing a snippet before putting it in a class
- Access from Developer Console: `Debug > Open Execute Anonymous Window` or `Ctrl+E`
- Also accessible via Salesforce CLI: `sf apex run` (interactive) or `sf apex run --file script.apex`
- No governor limit relaxation — anonymous Apex runs under the same limits as any other Apex
- Output appears in the debug log tied to the running user
```apex
// Quick test: does this SOQL return what I expect?
List<Account> accts = [SELECT Id, Name, Rating FROM Account WHERE AnnualRevenue > 1000000 LIMIT 5];
for (Account a : accts) {
    System.debug(a.Name + ' | ' + a.Rating);
}
```
**Speaker Notes:** Execute Anonymous is one of the most underused tools in the Salesforce developer toolkit. Instead of deploying a test class and running it, you can write exploratory code directly in the console, execute it against real org data, and see the results in seconds. It's excellent for prototyping logic before you commit it to a class.

---

### Slide 6: Checkpoints for Heap Inspection
**Visual:** Code editor screenshot showing a red checkpoint dot on a line, with a separate Checkpoints panel below showing heap variable values at that breakpoint
**Content:**
- **Checkpoints** are similar to breakpoints — they pause execution (conceptually) and capture the heap state at that line
- Set via Developer Console: click in the left gutter of the Source Code Editor, or use `Ctrl+Shift+K`
- Maximum **5 checkpoints** per transaction
- View captured heap in **Checkpoints tab** after execution: see all variables and their values at that instant
- Useful for: investigating what's in a collection at mid-execution, verifying SOQL query results before they're processed
- Checkpoints do NOT stop execution — the code continues; they capture a snapshot
**Speaker Notes:** Checkpoints solve the problem of wanting to see what a variable contains in the middle of a long execution without adding a dozen System.debug calls. You set a checkpoint at the line you're interested in, run the code, then inspect the heap snapshot in the Checkpoints tab. The code never pauses — you get the snapshot after the fact.

---

### Slide 7: Debug Log Retention and Management
**Visual:** Timeline showing 24-hour retention window with icons for logs being created and deleted, and a counter showing the 1000-log org limit
**Content:**
- Logs are automatically deleted after **24 hours**
- Org limit: **1,000 debug logs** — oldest logs are dropped when the limit is reached
- A single log is limited to **20 MB** — after that, it is truncated with a warning message
- Per-user log filters expire after a configurable duration (default: **30 minutes**)
- **Save logs before they expire**: Developer Console > Logs tab > right-click > Download, or use VSCode Salesforce extension
- Production debugging: be conservative with log levels and duration — excessive logging can impact performance
**Speaker Notes:** Log management is especially important in busy production orgs. If you set a log filter and then get called away, the log may have already cycled through 1,000 records by the time you come back. Set the minimum duration needed, use targeted log levels, and download any logs you want to keep before the 24-hour window closes.

---

### Slide 8: VS Code and Salesforce CLI Debugging
**Visual:** VS Code screenshot showing Salesforce Extension Pack with an open debug log file, log level filter, and timeline view in the left sidebar
**Content:**
- **Salesforce Extensions for VS Code** provide Apex Replay Debugger — step through historical execution using saved logs
- `sf apex log list` — list all debug logs in the org
- `sf apex log get --log-id <id>` — download a specific log
- `sf apex log tail` — stream logs in real time as code executes
- Apex Replay Debugger: download log → open in VS Code → set breakpoints → replay execution step by step
- Available in scratch orgs and sandboxes (not production — requires separate configuration)
**Speaker Notes:** The Apex Replay Debugger is a significant step up from reading raw log text. You download a debug log, load it in VS Code, and the extension lets you step through the execution history as if you were in a traditional debugger — complete with variable inspection at each step. It's particularly valuable for debugging complex trigger stacks or long-running batch processes.

---

## Recording Script

Welcome to Lecture 22 — Debugging Tools.

Debugging Apex can feel very different from debugging in traditional languages because you don't have a live debugger you can attach to. Instead, you work primarily with debug logs. Understanding how to configure, read, and analyze those logs efficiently is one of the most valuable skills you can develop as an Apex developer.

Let's start with the basics. A debug log captures the execution output for a specific user. You set it up in Setup under Debug Logs — you add a trace flag for the user you want to monitor, choose your log levels for each category, set a duration, and then trigger the code. The log appears in the list a few seconds after execution completes.

Log categories control which events are captured. APEX_CODE covers your System.debug calls and method entry/exit. DATABASE covers SOQL queries and DML operations. CALLOUT captures the request and response for HTTP calls. Each category has an independent level, ranging from NONE (nothing captured) through FINEST (everything, including internal platform events). For day-to-day debugging, APEX_CODE at DEBUG is usually sufficient. Add DATABASE at INFO when you're troubleshooting queries.

System.debug is your basic logging tool. Use it freely during development, but be thoughtful about what you leave in production code. The LoggingLevel parameter lets you assign different verbosities to different messages. Routine trace output goes at FINE — it won't show up unless someone specifically enables FINE-level logging. Error conditions go at WARN or ERROR so they're visible even with minimal logging configured.

The Developer Console's Log Inspector is where raw logs become readable. The Execution Log gives you a chronological event list. Click any event and the Source panel jumps to that exact line of code. The Stack Tree shows you the call hierarchy. Variables and View State lets you inspect data at that execution point.

For quick experiments, Execute Anonymous is invaluable. Open the console, type some Apex, hit Execute, and see the output immediately. No class to save, no deployment, no test class to write. It's perfect for prototyping logic, verifying SOQL results, or running a quick data fix.

Checkpoints take it a step further — they let you capture heap snapshots mid-execution without instrumenting the code with System.debug calls. Set up to five checkpoints on lines you care about, run the code, then inspect what was in memory at each checkpoint.

Finally, if you're using VS Code with the Salesforce Extension Pack, the Apex Replay Debugger is worth learning. It turns a debug log into a step-through debugging experience — much closer to the traditional debugger experience you might be used to from other languages.

---

## Exam Tips
- The 24-hour log retention and 1,000-log limit are favorite exam facts — know both numbers
- APEX_CODE level DEBUG captures System.debug() calls; a lower level like WARN would miss them
- Checkpoints capture heap snapshots but do NOT pause execution — code continues running
- Anonymous Apex executes under the same governor limits as any other Apex — no relaxed limits
- The Apex Replay Debugger uses saved debug logs to simulate step-through debugging — it does NOT connect live to the running process

## Lecture Summary
Debug logs capture Apex execution for a specific user and are retained for 24 hours up to 1,000 logs per org, with 8 configurable categories each independently set from NONE through FINEST. System.debug() writes to the APEX_CODE category and accepts an optional LoggingLevel parameter to control message visibility. The Developer Console's Log Inspector provides structured navigation of log events with Source, Stack Tree, and Variables panels, while checkpoints capture heap snapshots at specific lines. Anonymous Apex enables immediate code execution without deployment, and the Apex Replay Debugger in VS Code enables step-through replay of saved logs.

## Mini Quiz
**Q1:** A developer sets the APEX_CODE log level to WARN. Which System.debug() call will appear in the log?
A) System.debug('Record processed');
B) System.debug(LoggingLevel.INFO, 'Record processed');
C) System.debug(LoggingLevel.WARN, 'Validation failed');
D) System.debug(LoggingLevel.FINE, 'Debug detail');
**Answer:** C — The log level is set to WARN, which means only messages at WARN, ERROR, or higher verbosity levels are captured. The default System.debug and INFO level calls are lower on the scale and will not appear.

**Q2:** How many checkpoints can be active in a single Apex transaction in the Developer Console?
A) 1
B) 5
C) 10
D) 20
**Answer:** B — The Developer Console allows a maximum of 5 checkpoints per transaction. Checkpoints capture a heap snapshot at that line but do not pause execution.

**Q3:** A developer wants to run a quick SOQL query against production data and see the results immediately without creating a class. What is the best approach?
A) Create a test class with seeAllData=true and run it
B) Use Execute Anonymous in the Developer Console with a System.debug call
C) Write a batch job and schedule it immediately
D) Use the REST API with Workbench
**Answer:** B — Execute Anonymous is the appropriate tool for running ad-hoc Apex immediately against org data without saving the code as a class. The results appear in the debug log.
