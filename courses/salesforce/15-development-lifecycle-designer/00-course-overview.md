# Salesforce Development Lifecycle & Deployment Designer (CRT-406)
## Complete Study Guide — Partner Technical Architect Edition

---

## Exam Facts

| Field | Detail |
|---|---|
| Exam Code | CRT-406 |
| Full Name | Development Lifecycle and Deployment Designer |
| Questions | 60 multiple choice / multiple select |
| Passing Score | 63% (~38 out of 60) |
| Time Allowed | 120 minutes |
| Exam Fee | $200 USD |
| Retake Fee | $100 USD |
| Format | Proctored (online or testing center) |
| Prerequisite | None formally required; Salesforce Admin recommended |

### Certification Pyramid Contribution

This credential counts toward **three** advanced paths:
- **Application Architect** (with Data Architecture & Management Designer, Sharing & Visibility Designer, Integration Architecture Designer)
- **System Architect** (with Integration Architecture Designer, Identity & Access Management Designer, Development Lifecycle Designer)
- **CTA (Certified Technical Architect)** — all designer certs contribute to the CTA journey

This means the CRT-406 is doubly leveraged: it unlocks both the Application Architect and System Architect credentials, making it one of the highest-ROI exams on the Salesforce certification path.

---

## Domain Weights

| Domain | Weight | Approx. Questions |
|---|---|---|
| Application Lifecycle Management | 23% | ~14 |
| Environment Management | 22% | ~13 |
| Release Management | 20% | ~12 |
| Source Control & Collaboration | 18% | ~11 |
| Testing & QA | 17% | ~10 |
| **Total** | **100%** | **60** |

**Key insight:** ALM + Environment Management = 45% of the exam. These two domains together are almost half the test. If you master those two areas deeply, you have a significant structural advantage before touching the other three domains.

---

## PTA / SA Relevance

### Why This Cert Matters More Than Its Name Suggests

The Development Lifecycle Designer credential is often dismissed as a "developer cert" by architects who see themselves as strategists rather than engineers. That framing is wrong and costly. As a Partner Technical Architect at Salesforce, you are routinely in rooms where customers ask:

- "We have 12 developers all hitting the same sandbox — how do we scale?"
- "Our deployments break production every sprint — how do we fix this?"
- "We're acquiring a company with a Salesforce org — how do we merge them?"
- "Copado vs Gearset vs home-built pipelines — what do you recommend?"
- "Our ISV partner wants us to use their managed package — is that the right model?"

None of these questions can be answered well without deep mastery of the content in this certification. The CRT-406 directly funds your ability to run environment strategy workshops, evaluate DevOps vendor proposals, and architect CI/CD pipelines for enterprise customers.

### Advisory Scenarios Where This Content Appears

1. **Pre-sales architecture reviews:** Customers ask about Salesforce DevOps in almost every enterprise deal. Your ability to recommend org model vs package model, scratch orgs vs sandboxes, and CI/CD tool selection differentiates Salesforce-led advisory from generic consulting.

2. **Implementation quality gates:** You sit on SOW reviews and delivery checkpoints. Understanding what "good" looks like for test coverage, deployment gates, and environment strategy lets you ask the right questions before a project goes off-track.

3. **Digital transformation programs:** Large customers migrating from legacy CPQ/ERP/CLM to Salesforce need a deployment strategy that handles both the migration and ongoing ALM. This exam covers exactly that.

4. **ISV partner assessments:** When customers evaluate AppExchange packages, understanding managed vs unlocked packages, namespace implications, and upgrade paths gives you credibility and protects customers from bad decisions.

5. **DevOps tool evaluations:** Copado, Gearset, AutoRABIT, Flosum — these are frequent customer conversations. The CRT-406 gives you the mental model to evaluate any tool objectively against the underlying ALM principles.

---

## Domain-by-Domain Advisory Mapping

| Exam Domain | Customer Conversation |
|---|---|
| Application Lifecycle Management | "How should we structure our development process?" |
| Environment Management | "How many sandboxes do we need and what are they for?" |
| Release Management | "How do we go from sprint to production reliably?" |
| Source Control & Collaboration | "Do we need Git? We've been using change sets." |
| Testing & QA | "How do we know a deployment won't break production?" |

---

## Key Numbers to Memorize (Exam Critical)

These numbers appear directly in exam questions. Know them cold.

| Item | Number |
|---|---|
| Apex test coverage threshold | **75%** (org-wide average) |
| Quick deploy validity window | **10 days** after successful validation |
| Quick deploy minimum test pass rate | **75%** of selected tests must pass |
| Sandbox refresh — Developer | **1 day** minimum between refreshes |
| Sandbox refresh — Developer Pro | **1 day** minimum |
| Sandbox refresh — Partial Copy | **5 days** minimum |
| Sandbox refresh — Full | **29 days** minimum |
| Sandbox storage — Developer | **200 MB** |
| Sandbox storage — Developer Pro | **1 GB** |
| Sandbox storage — Partial Copy | **5 GB** (subset of production data) |
| Sandbox storage — Full | **Full copy of production** |
| Scratch org default lifespan | **7 days** (max 30 days) |
| Max active scratch orgs (per day) | Depends on edition; typically 6 active / 3 per day for standard |
| Metadata API deployment: async? | **Yes** — returns a job ID, poll for completion |
| Change set direction | **Outbound** (source) → **Inbound** (target) |
| Package version format | **major.minor.patch.build** (e.g., 1.2.0.NEXT) |
| 1GP managed package: namespace required? | **Yes** |
| Unlocked package: namespace required? | **No** (optional) |
| RunLocalTests covers | All local Apex tests **excluding** managed package tests |
| RunAllTests covers | All Apex tests **including** managed package tests |
| Deployment validation without commit | **Validate** operation (not Deploy) |

---

## Key Themes Across the Exam

Understanding the *themes* helps you answer questions you haven't seen before:

1. **Isolation is the goal.** Whether it's scratch orgs, separate sandboxes, or separate Git branches — the exam consistently rewards answers that isolate developers/teams from each other and from production.

2. **Automation over manual.** Change sets, manual deployments, and ad-hoc processes are almost always wrong answers. Pipelines, gates, and automated tests are almost always right answers.

3. **Source of truth is Git.** The org is the delivery artifact, not the source of truth. Answers that treat the org as the source of truth (e.g., retrieve from org as backup strategy) are wrong.

4. **Test gates must be enforced, not optional.** Deployments without test execution gates are architectural anti-patterns. The exam tests whether you know where and how to enforce test gates.

5. **Environments must match their purpose.** Developer orgs for dev, UAT sandboxes for UAT, Full sandboxes for staging. Mismatched environment-to-purpose is a red flag the exam exploits.

6. **Package model is the future; org model is legacy.** When the exam presents a greenfield scenario with multiple teams, the answer usually involves Salesforce DX + unlocked packages + CI/CD.

7. **Rollback is hard; prevention is better.** The exam tests rollback scenarios, but the correct answer is usually "prevent problems with gates" rather than "execute a rollback." When rollback IS the right answer, the method matters.

---

## Course File Index

### Section 01 — Application Lifecycle Management
| File | Topic |
|---|---|
| lecture-01-alm-fundamentals.md | ALM Phases, Org vs Package Model, Governance |
| lecture-02-salesforce-dx-overview.md | Salesforce DX, sfdx-project.json, Source Format |
| lecture-03-scratch-orgs-sandboxes.md | Scratch Orgs, Sandbox Types, Environment Strategy |
| lecture-04-source-control-git.md | Git, Branching Strategies, Conflict Resolution |

### Section 02 — Deployment
| File | Topic |
|---|---|
| lecture-05-metadata-api-deployment.md | Metadata API, Quick Deploy, Test Levels |
| lecture-06-change-sets-limitations.md | Change Sets, Limitations, Migration Path |
| lecture-07-salesforce-cli-deployment.md | sf CLI Commands, JWT Auth, Deploy Flags |
| lecture-08-package-development-model.md | Unmanaged, Managed, Unlocked Packages, 2GP |

### Section 03 — Testing & QA
| File | Topic |
|---|---|
| lecture-09-testing-strategy-design.md | Testing Pyramid, Test Data Strategy, UAT |
| lecture-10-apex-test-coverage.md | 75% Rule, Coverage Calculation, Bulk Testing |
| lecture-11-automated-testing-tools.md | Jest, Provar, UTAM, PMD, ESLint |

### Section 04 — CI/CD & Release Management
| File | Topic |
|---|---|
| lecture-12-cicd-pipeline-design.md | Pipeline Design, Gate Criteria, Tool Selection |
| lecture-13-github-actions-salesforce.md | GitHub Actions YAML, JWT Auth, Branch Protection |
| lecture-14-environment-strategy.md | Environment Tiers, Governance, Refresh Strategy |
| lecture-15-release-management.md | Release Trains, Hotfix Process, Go/No-Go |

### Labs
| File | Topic |
|---|---|
| labs/lab-01-sfdx-project-setup.md | SFDX Project, Scratch Org, Git Setup |
| labs/lab-02-cicd-pipeline.md | GitHub Actions Pipeline for Salesforce |

### Exam Prep
| File | Topic |
|---|---|
| exam-prep/practice-exam-60-questions.md | 100 scenario-based questions with full answer key |
| exam-prep/devops-cheat-sheet.md | Quick-reference for all critical exam content |

---

## 4-Week Study Plan

### Week 1 — Foundations (Application Lifecycle Management)
**Goal:** Master the mental model of ALM, environments, and source control.

| Day | Activity | Time |
|---|---|---|
| Monday | Read lecture-01 (ALM Fundamentals), do the practice questions | 90 min |
| Tuesday | Read lecture-02 (Salesforce DX), set up SFDX on your machine | 90 min |
| Wednesday | Read lecture-03 (Scratch Orgs & Sandboxes), draw the sandbox ladder | 60 min |
| Thursday | Read lecture-04 (Git for Salesforce), practice GitFlow branching diagram | 90 min |
| Friday | Lab-01: SFDX Project Setup + Git | 2 hours |
| Weekend | Cheat sheet review, first 25 practice questions | 2 hours |

### Week 2 — Deployment Deep Dive
**Goal:** Know every deployment mechanism, its limitations, and when to use each.

| Day | Activity | Time |
|---|---|---|
| Monday | Read lecture-05 (Metadata API), memorize quick deploy conditions | 90 min |
| Tuesday | Read lecture-06 (Change Sets), internalize all limitations | 60 min |
| Wednesday | Read lecture-07 (sf CLI), run CLI commands in a scratch org | 90 min |
| Thursday | Read lecture-08 (Package Development Model), draw the decision tree | 90 min |
| Friday | Review deploy scenarios, do deployment domain practice questions | 60 min |
| Weekend | Mid-point review, questions 26-50 from practice exam | 2 hours |

### Week 3 — Testing, CI/CD, and Pipelines
**Goal:** Design test strategies and full CI/CD pipelines from scratch.

| Day | Activity | Time |
|---|---|---|
| Monday | Read lecture-09 (Testing Strategy Design) | 90 min |
| Tuesday | Read lecture-10 (Apex Test Coverage) | 60 min |
| Wednesday | Read lecture-11 (Automated Testing Tools) | 60 min |
| Thursday | Read lecture-12 (CI/CD Pipeline Design) | 90 min |
| Friday | Lab-02: GitHub Actions Pipeline | 2 hours |
| Weekend | Read lectures 13-14, practice questions 51-75 | 2 hours |

### Week 4 — Release Management + Final Review
**Goal:** Seal the gaps, drill weak areas, simulate exam conditions.

| Day | Activity | Time |
|---|---|---|
| Monday | Read lecture-13 (GitHub Actions) + lecture-14 (Env Strategy) | 2 hours |
| Tuesday | Read lecture-15 (Release Management), draw the release train | 90 min |
| Wednesday | Full timed practice exam (100 questions, 120 min) | 2 hours |
| Thursday | Review wrong answers, re-read relevant lectures | 2 hours |
| Friday | Cheat sheet memorization, numbers review | 60 min |
| Weekend | Second timed practice exam (re-shuffle questions), final cheat sheet pass | 2 hours |

---

## Study Tips for PTAs

1. **Map every topic to a real customer.** When you read about sandbox refresh intervals, think: "Which customer I worked with last quarter would have benefited from knowing this?"

2. **Draw, don't just read.** The Mermaid diagrams in each lecture are not decoration — redrawing them from memory is the fastest way to cement architectural patterns.

3. **The exam tests decisions, not recall.** Questions are scenario-based. Practice asking "What is the architect's primary concern here, and which option best addresses it?"

4. **Time box your practice exams.** 120 minutes / 60 questions = 2 minutes per question. Some questions take 30 seconds; save those minutes for 4-answer analysis questions.

5. **Use your PTA intuition.** The exam rewards architect thinking: automation over manual, isolation over sharing, prevention over remediation. When in doubt, apply these principles.
