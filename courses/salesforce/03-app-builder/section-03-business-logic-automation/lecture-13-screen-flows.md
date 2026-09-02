# L13: Screen Flows

## Exam Domain
Business Logic & Process Automation — 28% of exam weight

---

## Core Concepts

### What Screen Flows Are
Screen Flows are Flow Builder flows with a user interface — they display screens to users as a multi-step wizard. The key thing to understand is that Screen Flows require explicit user action to launch — they don't auto-trigger. They must be embedded in a Lightning page, added as a Quick Action (button), or launched from a component. Unlike Record-Triggered Flows, Screen Flows are entirely user-driven.

### Input and Output Components
Screen elements contain **input components** (fields where users enter data) and **output components** (display-only content). Input components include: Text Input, Number, Currency, Date, Date/Time, Checkbox, Picklist, Multi-Select Picklist, Long Text Area, Toggle, Radio Buttons. Output components include: Display Text (shows static text or formula output), Display Image. Input components store their values in Flow variables that subsequent elements can use.

### Navigation Buttons
Screen Flows provide navigation buttons that can be configured per screen: **Next** (go to next screen), **Previous** (go back), **Finish** (complete the flow), **Pause** (save progress and resume later). You can show/hide buttons per screen. "Pause" enables long-running processes where users need to stop and return — paused flows are stored in Salesforce and can be resumed.

### Input/Output Variables — Flow in Flow Page Context
When a Screen Flow is embedded in a Lightning record page (via a Flow component), you can pass the current record's ID into the flow as an input variable. The Flow component has a "Record ID" field that maps to a flow variable you define. This lets the screen flow pre-populate fields with data from the current record and operate in context.

### Component Visibility Rules
Individual components on a Screen element can be hidden or shown conditionally based on other field values. Example: show the "Discount Reason" text field only when "Discount %" is greater than 20. This is reactive — as the user fills in fields, other components appear/disappear in real time (Spring '23+, "Reactive Screens" feature).

---

## PTA / SA Relevance

**Replace custom Visualforce pages:** Screen Flows can replace many simple Visualforce pages and custom LWC components that collect user input and perform actions. Before scoping a custom LWC for a guided data-entry process, evaluate whether a Screen Flow can do the job — Screen Flows are admin-maintainable and no-code.

**Pause / Resume pattern:** For approval or review workflows that take days, the Pause element in Screen Flows lets users save their progress and return. This replaces manual workarounds like saving a "draft" record. However, note that paused flows create "Flow Interview" records that consume storage.

**LWC + Screen Flow hybrid:** For complex UI requirements beyond what Screen Flows support natively, a common pattern is a LWC wrapper that launches a Screen Flow. The LWC handles the complex UI parts; the Screen Flow handles the guided process steps. This keeps business logic in the Flow (maintainable) and complex UI in the component.

**Accessibility:** Screen Flows should be tested with accessibility tools — Salesforce has improved screen reader support for Flow screens, but complex visibility rule configurations can create confusing experiences for accessibility-tool users.

---

## Architecture / How It Works

```
Screen Flow Anatomy:
                                                              
  ┌──────────────────────────────────────────────────────┐   
  │  SCREEN 1: Gather Basic Info                         │   
  │  ┌─────────────────────┐  ┌──────────────────────┐   │   
  │  │ Text: First Name     │  │ Text: Last Name       │   │   
  │  └─────────────────────┘  └──────────────────────┘   │   
  │  ┌─────────────────────────────────────────────────┐  │   
  │  │ Picklist: Department (from object picklist)      │  │   
  │  └─────────────────────────────────────────────────┘  │   
  │  [Previous] [Next] [Pause]                            │   
  └──────────────────────────────────────────────────────┘   
                    │ Next                                    
                    ▼                                         
  ┌──────────────────────────────────────────────────────┐   
  │  SCREEN 2: Review & Submit                           │   
  │  ┌─────────────────────────────────────────────────┐  │   
  │  │ Display Text: "You entered: {!FirstName_Var}"    │  │   
  │  └─────────────────────────────────────────────────┘  │   
  │  [Previous] [Finish]                                  │   
  └──────────────────────────────────────────────────────┘   
                    │ Finish                                  
                    ▼                                         
             Create Record / Update Record elements          
```

**Limitations:**
- Screen Flows cannot auto-trigger — they require explicit user action to launch
- Screens cannot be embedded in Apex (Apex calls Auto-launched Flows, not Screen Flows)
- Paused flows consume Salesforce storage and count against flow interview limits
- Screen Flows don't support all input types (e.g., File Upload requires a custom LWC)

```
How to Launch a Screen Flow:
┌─────────────────────────────────────────────────────────────┐
│  1. Lightning App Builder → Flow component on any page      │
│     └─ Embed directly, auto-runs when page loads or         │
│        requires a button click (configurable)               │
│                                                             │
│  2. Quick Action → Flow type action → add to page layout    │
│     └─ Button in record highlights panel, pops in modal     │
│                                                             │
│  3. Utility Bar (Lightning apps)                            │
│     └─ Accessible from any page in the app                  │
│                                                             │
│  4. Custom button / Lightning component launches the flow   │
│     └─ Developer adds button that calls flow via API        │
│                                                             │
│  5. Home page, App page, or Record page via Lightning App   │
│     Builder component                                       │
└─────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Quick Action flows open in a modal overlay — they cannot fill the full screen
- Record context (Record ID) must be explicitly configured in the Flow component or Quick Action settings to pass the current record into the flow
- Screen Flows embedded in Communities/Experience Cloud have additional permission requirements

```
Component Visibility (Reactive Screens):
                                                               
  ┌─────────────────────────────────────────────────────┐      
  │  SCREEN                                             │      
  │  ┌─────────────────────────────────────────────┐    │      
  │  │ Number: Discount Percent (%): [    25    ]  │    │      
  │  └─────────────────────────────────────────────┘    │      
  │  Visibility rule on "Discount Reason":               │      
  │  SHOW WHEN: Discount_Percent > 20                   │      
  │  ┌─────────────────────────────────────────────┐    │      
  │  │ Text: Discount Reason: [________________]   │ ← appears when % > 20
  │  └─────────────────────────────────────────────┘    │      
  └─────────────────────────────────────────────────────┘      
```

**Limitations:**
- Component visibility rules evaluate in real-time (Spring '23+ Reactive Screens) — older orgs may need a Next/refresh to re-evaluate
- Hidden components do not clear their values when hidden — a user who enters a value then the field disappears still has the value in the variable

---

## Key Facts to Memorize
- Screen Flows have a UI; they require user action to launch (no auto-trigger)
- Input components: Text, Number, Currency, Date, Checkbox, Picklist, Multi-Select Picklist, Toggle
- Output components: Display Text, Display Image
- Navigation: Next / Previous / Finish / Pause
- Pause: saves flow state for user to resume later; creates a Flow Interview record
- Pass record context: configure Flow component "Record ID" field → maps to flow input variable
- Component visibility: conditionally show/hide screen components based on field values
- Reactive Screens (Spring '23+): visibility rules evaluate in real-time without refresh

---

## Exam Traps
- **Screen Flows cannot auto-trigger.** If a scenario says "when a record is saved, show a screen to the user," that's a different pattern — you'd embed a Screen Flow on the record page, but it won't auto-pop up on save. Record-Triggered Flows don't have screens.
- **Quick Actions for Screen Flows.** The "Quick Action — Flow" action type is the correct way to add a Screen Flow as a button. This is distinct from "Quick Action — Create/Update/Custom" action types.
- **Record context requires explicit configuration.** The Screen Flow does not automatically receive the current record's ID — you must set it up in the Flow component properties or Quick Action settings.
- **Hidden screen components retain their values.** This can cause unexpected data submissions. If a user enters a value and the field then hides, the variable still holds the value when the flow finishes.
- **Pause requires "Let Users Pause" setting.** This is a Flow property that must be enabled. Not all Screen Flows allow pause by default.

---

## Practice Questions

**Q:** A business wants a button on the Case record page that launches a 3-step wizard to gather escalation details and create a follow-up task. Which setup steps accomplish this?
**A:** (1) Create a Screen Flow with the 3-step wizard logic and a Create Records element for the Task. (2) Add the flow as a Quick Action (Action Type = Flow) on the Case object. (3) Add the Quick Action button to the Case page layout (or Lightning record page). When the user clicks the button, the Screen Flow launches in a modal overlay.

**Q:** A Screen Flow embedded on the Account record page needs to pre-populate a field with the current Account's Name. How is this configured?
**A:** Create an input variable in the Flow (e.g., `recordId`, Text type, Available for Input = checked). In the Lightning App Builder, add the Flow component to the page, and in the component properties, map "Record ID" to the `recordId` variable. The flow then uses `{!recordId}` to query the Account and access its Name field.

**Q:** A user starts a Screen Flow, fills in 3 screens, then pauses it. They log out and log back in the next day. How do they resume the paused flow?
**A:** Paused flows create "Flow Interview" records. Users can resume by navigating to their Home page (if the "Paused and Waiting Interviews" component is on the Home page) or by finding the interview via the "Paused Interviews" section. The flow resumes from the screen where they paused.
