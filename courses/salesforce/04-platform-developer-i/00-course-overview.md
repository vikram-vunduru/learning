# Platform Developer I (PDI) — CRT-450

## Exam Facts
| Detail | Value |
|--------|-------|
| Exam Code | CRT-450 |
| Questions | 60 |
| Time | 110 minutes |
| Pass Score | 65% |
| Cost | $200 |
| Format | Multiple choice + multi-select |

## What This Course Covers
This course prepares you for the Salesforce Certified Platform Developer I exam (CRT-450). You will learn to build custom applications on the Salesforce platform using Apex (Salesforce's proprietary Java-like language), SOQL (Salesforce Object Query Language), and the Salesforce Lightning component framework. The course covers the full developer lifecycle — from setting up your development environment with VS Code and the Salesforce CLI, to writing bulkified Apex triggers, building Lightning Web Components, and deploying metadata between orgs using change sets and the CLI. By the end of this course, you will understand governor limits, platform events, Apex testing best practices, and how to use declarative tools alongside code to build robust, scalable solutions.

## Course Sections
1. Developer Fundamentals (L01-L04)
2. Apex Core (L05-L09)
3. Advanced Apex (L10-L14)
4. User Interface (L15-L19)
5. Testing & Deployment (L20-L24)

## Exam Weight Breakdown
| Domain | Weight |
|--------|--------|
| Developer Fundamentals | 23% |
| Process Automation & Logic | 30% |
| User Interface | 25% |
| Testing, Debugging & Deployment | 22% |

## 4-Week Study Timeline

**Week 1 — Developer Fundamentals & Apex Core (L01–L07)**
- Days 1-2: Set up VS Code, Salesforce CLI, and a Developer Edition org. Work through L01 (Developer Console & Tools) hands-on.
- Days 3-4: Study L02 (Apex Basics) and L03 (Variables, Types & Collections). Write Apex classes in Anonymous Apex to experiment.
- Days 5-7: Complete L04 (Control Flow), L05 (SOQL Fundamentals), and L06 (SOQL Advanced). Practice queries in the Developer Console Query Editor and Workbench.

**Week 2 — Apex Core & Advanced Apex (L07–L14)**
- Days 1-2: Study L07 (DML Operations) and L08 (Apex Triggers). Create a trigger on the Account object in your org.
- Days 3-4: Complete L09 (Trigger Best Practices). Refactor your trigger to use the handler class pattern.
- Days 5-7: Work through L10–L14 (Advanced Apex): asynchronous Apex (Future, Batch, Queueable, Scheduled), exception handling, and Apex integration.

**Week 3 — User Interface (L15–L19)**
- Days 1-3: Study Lightning Web Components (LWC) basics, component communication, and lifecycle hooks.
- Days 4-5: Learn Aura components for backward compatibility contexts, and understand when to use each framework.
- Days 6-7: Study Visualforce pages, controllers, and extensions. Practice reading and writing Visualforce markup.

**Week 4 — Testing, Debugging & Review (L20–L24)**
- Days 1-2: Complete L20–L21 on Apex testing: test classes, @TestSetup, System.assert methods, governor limit testing.
- Days 3-4: Study deployment: change sets, metadata API, sfdx project deployment, sandboxes vs scratch orgs.
- Days 5-6: Take 2-3 full practice exams (60 questions, 110 minutes each). Review every wrong answer.
- Day 7: Light review of weak areas only. Rest before exam day.

## Mini Quiz

**Q1:** Which governor limit applies to the total number of SOQL queries issued in a single synchronous Apex transaction?
A) 50 queries
B) 100 queries
C) 150 queries
D) 200 queries
**Answer:** B — Synchronous Apex is limited to 100 SOQL queries per transaction. Asynchronous contexts allow 200.

**Q2:** A developer needs to run a class that processes 10 million records overnight. Which Apex feature is most appropriate?
A) Future method
B) Queueable Apex
C) Batch Apex
D) Scheduled Apex called with a SOQL for loop
**Answer:** C — Batch Apex is designed for processing large data volumes by breaking work into manageable chunks (up to 2,000 records per batch execute() call), each running in its own governor limit context.

**Q3:** Which access modifier makes an Apex class accessible from any Apex code in any namespace, including managed packages?
A) public
B) private
C) protected
D) global
**Answer:** D — The `global` access modifier exposes a class or method to all Apex code regardless of namespace. It is required when building managed package APIs. `public` is accessible within the same namespace/application only.
