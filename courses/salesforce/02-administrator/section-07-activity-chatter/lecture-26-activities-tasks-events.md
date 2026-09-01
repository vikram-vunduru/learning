# L26: Activities: Tasks & Events

## 🎯 Learning Objectives
- Describe the Activity object and the difference between Tasks and Events
- Explain Open Activities vs Activity History related lists
- Configure shared activities, logging calls, and Einstein Activity Capture

## 📊 SLIDES

### Slide 1: The Activity Object
**Visual:**
```
                    ┌─────────────────────┐
                    │     ACTIVITIES      │
                    │    (Umbrella Term)  │
                    └──────────┬──────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
   ┌───────────────────────┐     ┌─────────────────────────┐
   │         TASK          │     │         EVENT           │
   │  ─────────────────    │     │  ───────────────────    │
   │  Action item /        │     │  Calendar entry /       │
   │  to-do item           │     │  scheduled occurrence   │
   │                       │     │                         │
   │  Has: Due Date        │     │  Has: Start DateTime    │
   │       Status          │     │       End DateTime      │
   │       Priority        │     │       Location          │
   │                       │     │                         │
   │  Example: Follow up   │     │  Example: Demo at 2 PM  │
   │  call, send proposal  │     │  Team meeting, webinar  │
   └───────────────────────┘     └─────────────────────────┘
          │                                   │
          └──────────────┬────────────────────┘
                         ▼
   ┌──────────────────────────────────────────────────┐
   │  Related To: Lead, Contact, Account,             │
   │  Opportunity, Case, Custom Objects               │
   └──────────────────────────────────────────────────┘
```
**Content:**
- Activities is the umbrella term for both Tasks and Events in Salesforce
- **Task:** Action item with a due date (call someone, send a proposal, follow up)
- **Event:** Scheduled occurrence with start/end time (meeting, demo, call at 2 PM)
- Activities can be related to multiple objects: Lead, Contact, Account, Opportunity, Case, Custom Objects
- Primary difference: Tasks are to-do items; Events are calendar entries with a specific time
- Both visible in the Activity Timeline on records in Lightning Experience
**Speaker Notes:** Activities are the mechanism for tracking all interactions and to-do items in Salesforce. Every call logged, every meeting scheduled, every email sent can be tracked as an Activity. Understanding the difference between Tasks and Events — and where they show up on records — is essential for both the exam and daily Salesforce work.

### Slide 2: Task Fields
**Visual:**
```
  ┌──────────────────────────────────────────────────────┐
  │                    TASK RECORD                       │
  ├──────────────────────┬───────────────────────────────┤
  │  Subject             │  Follow up call               │
  │  Due Date            │  11/20/2024                   │
  │  Status              │  Open                         │
  │  Priority            │  High                         │
  │  Assigned To         │  John Smith (Owner)           │
  ├──────────────────────┼───────────────────────────────┤
  │  Related To (WhatId) │  Acme Q4 Deal (Opportunity)   │
  │                      │  ← links to non-person object │
  ├──────────────────────┼───────────────────────────────┤
  │  Name (WhoId)        │  Jane Doe (Contact)           │
  │                      │  ← links to Contact or Lead   │
  ├──────────────────────┼───────────────────────────────┤
  │  Comments            │  Discuss renewal options      │
  └──────────────────────┴───────────────────────────────┘
  
  WhatId = Related To (the "what" — object record)
  WhoId  = Name       (the "who"  — Contact or Lead)
```
**Content:**
- **Subject:** Brief description of the task (e.g., "Follow up call," "Send contract")
- **Due Date:** When the task should be completed
- **Status:** Open, In Progress, Completed, Waiting on Someone Else, Deferred
- **Priority:** Low, Normal, High
- **Assigned To:** The user responsible for completing the task
- **Related To (WhatId):** Links to a non-person object (Account, Opportunity, Case, etc.)
- **Name (WhoId):** Links to a Contact or Lead
**Speaker Notes:** The WhatId and WhoId fields are important technical details. WhatId relates the task to a record (the "what" — what are you doing this about?), and WhoId relates it to a person (the "who" — who are you doing this with?). Together, they create the full relational context for the activity.

### Slide 3: Event Fields
**Visual:**
```
  ┌──────────────────────────────────────────────────────┐
  │                    EVENT RECORD                      │
  ├──────────────────────┬───────────────────────────────┤
  │  Subject             │  Product Demo                 │
  │  Start Date/Time     │  11/18/2024  2:00 PM          │
  │  End Date/Time       │  11/18/2024  3:00 PM          │
  │  All-Day Event       │  [ ] toggle (off = timed)     │
  │  Location            │  Zoom / Conference Room A     │
  │  Description         │  Walk through Q4 feature set  │
  │  Assigned To         │  John Smith                   │
  ├──────────────────────┼───────────────────────────────┤
  │  Related To (WhatId) │  Acme Q4 Deal (Opportunity)   │
  │  Name (WhoId)        │  Jane Doe (Contact)           │
  └──────────────────────┴───────────────────────────────┘
  
  KEY DIFFERENCE FROM TASK:
  ┌────────────────────────┬──────────────────────────────┐
  │  TASK                  │  EVENT                       │
  │  Due Date only         │  Start + End DateTime        │
  │  To-do list item       │  Calendar block entry        │
  │  Open Activities list  │  Upcoming Events / Calendar  │
  └────────────────────────┴──────────────────────────────┘
```
**Content:**
- **Subject:** Description of the meeting/event
- **Start Date/Time and End Date/Time:** When the event occurs (precise time-based)
- **All-Day Event:** Toggles the event to span the full day without specific times
- **Location:** Physical or virtual meeting location
- **Assigned To:** The event owner (visible on their Salesforce calendar)
- **Related To / Name:** Same WhatId/WhoId relationship as Tasks
- Events appear on the Salesforce Calendar view (Home page → Calendar)
**Speaker Notes:** The biggest difference from a Task is that Events have Start and End DateTimes, making them calendar items. The Salesforce calendar shows events as blocks. When you log a call that already happened, you typically use a Task (log a call action) since the call is a past to-do item, while a future meeting is an Event.

### Slide 4: Open Activities vs Activity History
**Visual:**
```
  ┌──────────────────────────────┬───────────────────────────────┐
  │     OPEN ACTIVITIES          │      ACTIVITY HISTORY         │
  │   (Status ≠ Completed)       │  (Status = Completed /        │
  │                              │   past Events)                │
  ├──────────────────────────────┼───────────────────────────────┤
  │  Follow up call (Task)       │  Called Jane 11/01 (Task)     │
  │    Due: 11/20   [Open]       │    Status: Completed          │
  │                              │                               │
  │  Product Demo (Event)        │  Product Demo 10/15 (Event)   │
  │    11/18  2:00-3:00 PM       │    Status: Past Event         │
  │                              │                               │
  │  Send Proposal (Task)        │  Logged Call 11/05 (Task)     │
  │    Due: 11/22   [Open]       │    Status: Completed          │
  └──────────────────────────────┴───────────────────────────────┘
  
  ┌──────────────────────────────────────────────────────────────┐
  │  Lightning Experience → Activity Timeline (Combined View)    │
  │  Chronological feed of ALL activities on the record         │
  │  Activity History is append-only — records cannot be deleted │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Open Activities related list:** Shows Tasks that are NOT yet completed; upcoming Events
- **Activity History related list:** Shows completed Tasks; past Events; logged calls
- Both lists appear on Lead, Contact, Account, Opportunity, Case, and Custom Object records
- Classic Experience uses related lists; Lightning Experience uses the Activity Timeline (unified feed)
- Filtering and sorting differ between Classic and Lightning views
- Activity History is an append-only log — records cannot be deleted from Activity History
**Speaker Notes:** For the exam, know the distinction: Open Activities is the "to-do list" and Activity History is the "done list." In Lightning Experience, both are combined into the Activity Timeline, which shows a chronological view of all activities on the record. Users can filter the timeline by activity type.

### Slide 5: Logging Calls
**Visual:**
```
  Contact: Jane Doe
  ┌──────────────────────────────────────────────────────┐
  │  [New Task]   [New Event]   [Log a Call]  ◀── Quick Action
  └──────────────────────┬───────────────────────────────┘
                         │ Click "Log a Call"
                         ▼
  ┌──────────────────────────────────────────────────────┐
  │                 LOG A CALL FORM                      │
  ├───────────────────┬──────────────────────────────────┤
  │  Subject          │  Call                            │
  │  Date             │  11/15/2024                      │
  │  Status           │  Completed  (auto-set)           │
  │  Comments         │  Discussed renewal pricing       │
  │  Related To       │  Acme Q4 Deal (Opportunity)      │
  │  Name             │  Jane Doe (Contact)              │
  └───────────────────┴──────────────────────────────────┘
                         │ Save
                         ▼
              ┌──────────────────────┐
              │   ACTIVITY HISTORY   │
              │  (Completed Task)    │
              │  NOT Open Activities │
              └──────────────────────┘
```
**Content:**
- "Log a Call" is a quick action that creates a Task with Status = Completed immediately
- Available on most standard object records and via the global quick action bar
- Fields: Subject (usually "Call"), Date, Duration, Description (notes from the call)
- Logged calls appear in Activity History (completed task)
- Can be related to a Contact/Lead AND a second record (Account, Opportunity) simultaneously
- Call logs are critical for sales and service reps to track customer conversations
**Speaker Notes:** Log a Call is essentially a shortcut to create a completed Task. The distinction matters: logging a call after it happened creates a completed Task in Activity History. Scheduling a future call creates an open Task (due date in the future) in Open Activities. Getting this right keeps records clean and accurate.

### Slide 6: Shared Activities
**Visual:**
```
  ┌──────────────────────────────────────────────────────────┐
  │              SHARED ACTIVITIES ENABLED                   │
  │  Setup → Activity Settings → Allow Multiple Contacts     │
  └─────────────────────────┬────────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               │   ONE Task / Event      │
               │  "Q4 Discovery Call"    │
               └──┬────────┬────────┬───┘
                  │        │        │
          ┌───────▼──┐  ┌──▼────┐  ┌▼──────────┐
          │Contact 1 │  │Contact│  │ Contact 3 │
          │  Alice   │  │  Bob  │  │   Carol   │
          │ (WhoId)  │  │       │  │           │
          └──────────┘  └───────┘  └───────────┘
                  │
          ┌───────▼────────────┐
          │    Opportunity     │
          │  "Acme Q4 Deal"    │
          │   (WhatId)         │
          └────────────────────┘
  
  Appears in Activity History of ALL 3 Contacts + Opportunity
  Primary contact stored in WhoId; others use TaskRelation object
  Up to 50 Contacts per Activity (with Shared Activities enabled)
```
**Content:**
- **Shared Activities:** Allows one Activity (Task or Event) to be related to up to 50 Contacts
- Enabled in: Setup → Activity Settings → Allow Users to Relate Multiple Contacts to Tasks and Events
- Without Shared Activities: one Task = one Contact (WhoId) only
- With Shared Activities: one Task = multiple Contacts (stored in TaskRelation/EventRelation objects)
- The "Primary" contact is still stored in WhoId; additional contacts use the relation objects
- Shared Activities appear in the Activity History of ALL related contacts
**Speaker Notes:** Shared Activities solve the real-world problem of group meetings and group calls. If you have a discovery call with three stakeholders from the same account, Shared Activities lets you log one Event and link all three contacts to it. Without this feature, you'd have to create three separate activities.

### Slide 7: Einstein Activity Capture
**Visual:**
```
  ┌────────────────────┐              ┌────────────────────────────┐
  │     GMAIL          │              │       SALESFORCE           │
  │   (Inbox)          │◀───sync────▶│                            │
  │                    │  emails      │  ┌──────────────────────┐  │
  │  Sent emails ──────│──────────────│─▶│   Activity Timeline  │  │
  │  auto-logged       │              │  │   (EAC data appears  │  │
  └────────────────────┘              │  │    here, NOT as std  │  │
                                      │  │    Task/Event obj)   │  │
  ┌────────────────────┐              │  └──────────────────────┘  │
  │     OUTLOOK        │              │                            │
  │   (Calendar)       │◀───sync────▶│  Setup:                    │
  │                    │  calendar    │  Setup → Einstein Activity  │
  │  Calendar events   │  events      │  Capture → Connect email   │
  │  auto-synced       │              │  provider                  │
  └────────────────────┘              └────────────────────────────┘
  
  IMPORTANT: EAC data is NOT stored as standard Task or Event records
  ┌──────────────────────────────────────────────────────────────┐
  │  Stored in separate data layer → Limited in standard reports │
  │  and list views compared to manually created activities      │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- Einstein Activity Capture (EAC) automatically syncs email and calendar data from Gmail or Outlook to Salesforce
- Emails sent from a connected inbox are automatically added to relevant Salesforce records
- Calendar events sync between Salesforce and Google Calendar / Outlook Calendar
- EAC activities appear in the Activity Timeline but are NOT stored as standard Task/Event records
- EAC data is stored in Salesforce platform (not the Activity object); limited in reports and list views
- Setup: Setup → Einstein Activity Capture → Connect email provider
**Speaker Notes:** EAC is a significant feature shift from manual activity logging. Instead of reps manually logging every call and email, EAC automatically captures their external communications. The exam-critical fact is that EAC data is NOT stored as standard Task or Event records — it's stored separately, which affects reporting and data retention.

### Slide 8: Activity Settings & Configuration
**Visual:**
```
  Setup → Activity Settings
  ┌────────────────────────────────────────────────────────────┐
  │                   ACTIVITY SETTINGS                        │
  ├────────────────────────────────────────────────────────────┤
  │  [✓] Enable Shared Activities                              │
  │      Allow up to 50 Contacts per Task/Event               │
  ├────────────────────────────────────────────────────────────┤
  │  [✓] Enable Email to Salesforce (BCC Dropbox)             │
  │      Each user gets unique BCC address to auto-log emails  │
  │      user@company.com ──BCC──▶ abc123@salesforce.com      │
  ├────────────────────────────────────────────────────────────┤
  │  [✓] Enable Task Notifications                             │
  │      Email reminders for assigned tasks / due dates        │
  ├────────────────────────────────────────────────────────────┤
  │  [ ] Show Event Details on Multi-Day Events                │
  ├────────────────────────────────────────────────────────────┤
  │  [✓] Group Tasks                                           │
  │      Consolidate related tasks in Activity Timeline        │
  ├────────────────────────────────────────────────────────────┤
  │  Calendar Sharing:  Users can share Salesforce calendar    │
  │  with other users                                          │
  └────────────────────────────────────────────────────────────┘
```
**Content:**
- Setup path: Setup → Activity Settings
- Key settings: Enable Shared Activities, Enable Email to Salesforce (BCC Dropbox), Group Tasks, Task Notifications
- Email to Salesforce (BCC dropbox): A unique email address users BCC on external emails to auto-log them as Tasks
- Activity Reminders: Users can configure reminder notifications for upcoming tasks and events
- Task notifications: email reminders can be sent when tasks are assigned or when due dates approach
- Calendar Sharing: Users can share their Salesforce calendar with other users
**Speaker Notes:** The BCC Dropbox (Email to Salesforce) is different from EAC — it's a manual process where the user BCCs their unique Salesforce email address on outgoing emails to log them as activities. It's the lower-tech precursor to EAC. Admins enable it in Activity Settings and users find their personal BCC email address in their personal settings.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 26 — Activities: Tasks and Events. Activities are the daily tracking tools for every Salesforce user — sales reps, service agents, and managers alike — and they're a consistent presence on the Admin exam.

Let's start with the fundamental distinction. Activities is the umbrella term covering two things: Tasks and Events. A Task is an action item — something you need to do, like follow up with a customer, send a proposal, or review a contract. It has a due date and a status. An Event is a time-bound calendar entry — a meeting, a demo, a conference call that starts at 2 PM and ends at 3 PM. Both relate to other Salesforce records through two key fields: Related To (which links to a non-person record like an Opportunity or Case) and Name (which links to a Contact or Lead).

Task fields you need to know: Subject, Due Date, Status (Open, Completed, In Progress, Deferred), Priority, and Assigned To. Event fields add Start DateTime, End DateTime, Location, and the All-Day Event toggle.

On every standard record in Salesforce, you'll see two activity-related sections. Open Activities shows Tasks that aren't yet completed and upcoming Events. Activity History shows completed Tasks and past Events. In Lightning Experience, these are combined into the Activity Timeline, a unified chronological feed that's easy to read. Activity History is an append-only log — you can't delete records from it.

Logging a call is a quick action on most records. When you click "Log a Call," Salesforce creates a completed Task immediately — it pops into Activity History, not Open Activities, because the call already happened. If you want to schedule a future call, you create an open Task with a future due date instead.

Shared Activities is a feature you enable in Setup under Activity Settings. By default, one activity can only link to one Contact. With Shared Activities enabled, a single Task or Event can be related to up to 50 Contacts simultaneously. This is perfect for group meetings — log one Event and link every attendee.

Einstein Activity Capture takes a different approach — instead of manual logging, it automatically syncs emails and calendar events from Gmail or Outlook into Salesforce. Connected emails and calendar items appear in the Activity Timeline automatically. Important nuance for the exam: EAC data is NOT stored as standard Task or Event records. It lives in a separate data layer. This means EAC activities may not show up in traditional reports or list views the same way manually created activities do.

For admins who want a simpler email-to-activity solution, there's the BCC Dropbox — also called Email to Salesforce. Each user gets a unique Salesforce email address. When they BCC that address on any external email, Salesforce logs it as an activity on the matching contact and related record. It's manual but works with any email client.

From a configuration standpoint, Activity Settings in Setup is where you enable shared activities, the BCC dropbox, and task notification settings. Admins can also configure which objects support activities via the Activity Settings and object settings.

Activities are simple to understand conceptually but have some important nuances — especially around EAC data storage and the Open Activities vs Activity History distinction. Keep those straight and you'll be well prepared.

Up next: Chatter and Collaboration.

## 🔔 EXAM TIPS
- **Tasks = action items (due date); Events = calendar items (start/end time):** This is the core distinction.
- **Open Activities = not yet complete; Activity History = done:** In Lightning, both appear in the Activity Timeline.
- **Log a Call creates a Completed Task:** It goes to Activity History immediately, not Open Activities.
- **Shared Activities: up to 50 Contacts per activity:** Must be enabled in Setup → Activity Settings.
- **EAC data is NOT standard Task/Event records:** It's stored separately and has limitations in reports and list views.
- **WhatId links to objects (Opportunity, Case); WhoId links to people (Contact, Lead):** Both can be set on the same activity.

## ✅ LECTURE SUMMARY
- Tasks are action items (due date, status, priority); Events are calendar items (start/end datetime, location)
- Open Activities: incomplete tasks + upcoming events; Activity History: completed tasks + past events
- Lightning Experience combines both into the Activity Timeline
- Log a Call quick action creates a Completed Task directly in Activity History
- Shared Activities allows one Task/Event to relate to up to 50 Contacts; enabled in Activity Settings
- WhatId = Related To (object record); WhoId = Name (Contact or Lead)
- Einstein Activity Capture auto-syncs Gmail/Outlook activity; data stored separately from standard Task/Event objects
- BCC Dropbox (Email to Salesforce): manual BCC to unique address logs emails as activities

## ❓ MINI QUIZ

**Q1:** A sales rep had a discovery call with three contacts from the same account. They want to log one activity that appears in all three contacts' Activity History. Which feature must be enabled?
- A) Einstein Activity Capture
- B) Shared Activities in Setup → Activity Settings
- C) Activity Influence in Campaign Settings
- D) Log a Call with multiple related-to records
**Answer:** B — Shared Activities, enabled in Setup → Activity Settings, allows a single Task or Event to be related to up to 50 Contacts simultaneously. The activity then appears in the Activity History of all linked contacts.

**Q2:** A manager pulls a report on Activities and notices that emails captured by Einstein Activity Capture are not appearing in the standard Activity reports. What is the most likely reason?
- A) Einstein Activity Capture requires an additional license to appear in reports
- B) EAC-captured activities are not stored as standard Task or Event records; they are stored in a separate data layer with limited standard report visibility
- C) The manager needs to enable "Include EAC in Reports" in Activity Settings
- D) EAC activities only appear in reports after they are manually approved by an admin
**Answer:** B — Einstein Activity Capture stores synced email and calendar data in a separate Salesforce platform layer, not as standard Task or Event records. This means they do not appear in standard Activity reports the same way manually created tasks do.

**Q3:** A user wants to log a sales call that happened this morning on an Opportunity record. Which action should they take, and where will the resulting record appear?
- A) Create a new Task with Status = Open; it appears in Open Activities
- B) Click "Log a Call" on the Opportunity; the resulting completed Task appears in Activity History
- C) Click "New Event" on the Opportunity; the event appears in Open Activities
- D) Use "New Task" and set Due Date to today; it appears in Open Activities
**Answer:** B — "Log a Call" creates a Task with Status = Completed, which is immediately placed in Activity History (not Open Activities). This is the correct workflow for recording a call that has already occurred.
