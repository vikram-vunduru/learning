
# Salesforce Integration Architecture Designer (CRT-404)
## Complete Study Guide — Course Overview

---

## Exam Metadata

| Field | Detail |
|-------|--------|
| Exam Code | CRT-404 |
| Full Name | Salesforce Certified Integration Architecture Designer |
| Number of Questions | 60 multiple-choice |
| Passing Score | 63% (~38 correct out of 60) |
| Time Limit | 120 minutes |
| Registration Fee | $200 USD |
| Retake Fee | $100 USD |
| Delivery | Webassessor (online proctored or test center) |
| Prerequisites | None formal, but Salesforce Admin or Developer strongly recommended |
| Recertification | Required — check Trailhead for current cycle |

---

## Domain Breakdown

This exam tests five domains. The weighting tells you where to spend study time.

| Domain | Weight | Questions (approx) | Priority |
|--------|--------|---------------------|----------|
| Integration Problem Design | 26% | ~16 questions | HIGHEST |
| Salesforce API Use | 22% | ~13 questions | HIGH |
| Integration Architecture Patterns | 22% | ~13 questions | HIGH |
| Security Considerations | 17% | ~10 questions | MEDIUM-HIGH |
| Problem-Solving Integration Issues | 13% | ~8 questions | MEDIUM |

### Domain Deep Dive

**Domain 1: Integration Problem Design (26%)**
This is the heaviest domain. It tests whether you can take a business problem and decompose it into the right integration architecture. Key sub-topics:
- Identifying the correct integration pattern from a scenario description
- Choosing between synchronous and asynchronous approaches
- Understanding the business implications of latency, throughput, and error handling
- Designing for scale, fault tolerance, and observability
- Data transformation and canonical modeling

**Domain 2: Salesforce API Use (22%)**
This domain tests deep knowledge of Salesforce's own API surface. You must know:
- REST API, SOAP API, Bulk API, Streaming API, Metadata API, Tooling API — when each is appropriate
- Governor limits and how they affect API design decisions
- OAuth flows and connected app configuration
- Composite API patterns (SObject Tree, Batch, Graph)
- Platform Events vs CDC vs Streaming API
- Long-running vs short-running API patterns

**Domain 3: Integration Architecture Patterns (22%)**
Tests structural pattern knowledge:
- ESB, iPaaS, Point-to-Point, API Gateway, Service Mesh
- Message transformation, routing, aggregation patterns
- Canonical data model
- Error handling and dead-letter patterns
- Idempotency, retry, and circuit breaker patterns

**Domain 4: Security Considerations (17%)**
A deceptively important domain:
- OAuth 2.0 flows (Web Server, User-Agent, JWT Bearer, Device, Client Credentials)
- Named Credentials and how they abstract callout authentication
- Field-level security in integration context
- Data masking, tokenization, and encryption in transit/at rest
- Shield Platform Encryption implications for integrations
- External Services and Apex callout security

**Domain 5: Problem-Solving Integration Issues (13%)**
Scenario-based troubleshooting:
- Governor limit violations in integration scenarios
- Debugging callout failures (HTTP errors, timeouts, CORS)
- Data synchronization conflicts and resolution strategies
- Idempotency failures and duplicate prevention
- Performance bottlenecks (bulk API vs REST for volume scenarios)

---

## The Mindset Shift: Integration Architect vs Developer

This is perhaps the most important section for passing this exam. The CRT-404 is NOT a developer exam.

### Developer Mindset vs Architect Mindset

| Scenario | Developer Thinks | Architect Thinks |
|----------|-----------------|------------------|
| "We need to sync Account data to ERP" | "I'll write an Apex callout triggered on Account update" | "What is the volume? Frequency? Tolerance for latency? What happens on failure? Who owns the canonical model?" |
| "The integration is failing" | "Check the logs, fix the code" | "What is the SLA? Is this a systemic pattern or a one-off? How do we alert? How do we recover?" |
| "We need real-time data" | "Use triggers + callouts" | "Define 'real-time' — is 500ms acceptable? 5 seconds? What's the cost of async vs sync?" |
| "The API returns too slowly" | "Increase timeout" | "Is the integration design wrong? Should this be async? Should we cache? Is this an N+1 pattern?" |
| "Customer wants Salesforce connected to everything" | "Build it" | "Hub-and-spoke or mesh? What's the enterprise integration strategy? Where does the canonical data model live?" |

### How to Read Exam Questions as an Architect

1. **Identify the forcing function** — What constraint makes this hard? Volume? Latency? Legacy system? Security requirement?
2. **Eliminate developer-only answers** — If an answer says "write an Apex trigger," it's usually wrong unless it's explicitly the only option
3. **Look for the most scalable, maintainable answer** — Not the quickest to implement
4. **Watch for security red flags** — Hardcoded credentials, missing encryption, overly permissive OAuth scopes
5. **Prefer standard Salesforce patterns** — The exam rewards knowing the "Salesforce way" over custom solutions

---

## PTA Advisory Angle: Why This Cert Makes You a Better Trusted Advisor

As a Partner Technical Architect, you sit in front of customers and help them make architectural decisions. The CRT-404 sharpens skills that directly translate to customer value:

### Discovery Questions This Cert Teaches You to Ask

**Volume and Frequency:**
- How many records per day/hour/minute need to be synced?
- Is this event-driven or batch? What's the acceptable latency?
- What is the peak load vs average load?

**Failure and Recovery:**
- What happens if the integration fails? Can we lose data? For how long?
- Is this integration in the critical path for a user-facing operation?
- Who gets alerted when it breaks?

**Ownership and Governance:**
- Who owns the canonical data model?
- How is API versioning handled when the target system upgrades?
- Is there an enterprise integration team (iPaaS/ESB) or is this a direct connection?

**Security and Compliance:**
- What data classification does this data carry? (PII, PCI, PHI)
- Is there an existing API gateway or WAF in front of systems?
- Are there network egress restrictions (firewall, VPN, private connect)?

### How Customers Describe Problems (Translation Guide)

| Customer Says | Architect Hears |
|---------------|-----------------|
| "We need Salesforce to talk to SAP" | Integration pattern decision: sync vs async, volume assessment, error handling strategy |
| "The sync is always slow" | Likely a synchronous pattern where async is needed, or N+1 API call pattern |
| "Data keeps getting out of sync" | Bidirectional sync without conflict resolution, or event ordering problem |
| "The integration breaks when we have a big campaign" | No load balancing, no bulkification, governor limit exposure |
| "We need it to be real-time" | Scope "real-time" — usually means sub-5-second, often Platform Events or CDC solves it |

---

## 6-Week Study Plan

### Week 1: Foundations and Pattern Taxonomy
**Goal:** Build mental models for all integration patterns before going deep on any one.

| Day | Activity | Time |
|-----|----------|------|
| Mon | Lecture 01: Integration Patterns Overview | 2 hrs |
| Tue | Lecture 02: API Design — REST vs SOAP | 2 hrs |
| Wed | Lecture 03: Event-Driven Architecture | 2 hrs |
| Thu | Lecture 04: Middleware and ESB Patterns | 2 hrs |
| Fri | Review + Flashcards for Week 1 | 1.5 hrs |
| Sat | Practice: 20 questions on Domain 1 | 1 hr |
| Sun | Rest or light review | 30 min |

### Week 2: Salesforce API Surface (Domain 2)
**Goal:** Know every Salesforce API, its limits, and its exact use case.

| Day | Activity | Time |
|-----|----------|------|
| Mon | Lecture 05: Salesforce REST API Deep Dive | 2 hrs |
| Tue | Lecture 06: SOAP, Bulk, and Metadata APIs | 2 hrs |
| Wed | Lecture 07: Streaming API, Platform Events, CDC | 2 hrs |
| Thu | Lecture 08: Composite API Patterns | 2 hrs |
| Fri | Review + Governor Limits cheat sheet | 1.5 hrs |
| Sat | Practice: 20 questions on Domain 2 | 1 hr |
| Sun | Lab 01: API Integration Hands-On | 2 hrs |

### Week 3: Enterprise Architecture Patterns (Domain 3)
**Goal:** Think in enterprise patterns, not code.

| Day | Activity | Time |
|-----|----------|------|
| Mon | Lecture 09: iPaaS and MuleSoft Architecture | 2 hrs |
| Tue | Lecture 10: API Gateway and Service Mesh | 2 hrs |
| Wed | Lecture 11: Error Handling, Dead Letter, Retry | 2 hrs |
| Thu | Lecture 12: Idempotency and Deduplication | 2 hrs |
| Fri | Review + Enterprise pattern decision tree | 1.5 hrs |
| Sat | Practice: 20 questions on Domain 3 | 1 hr |
| Sun | Rest | — |

### Week 4: Security Deep Dive (Domain 4)
**Goal:** Master every OAuth flow, Named Credentials, and data security pattern.

| Day | Activity | Time |
|-----|----------|------|
| Mon | Lecture 13: OAuth 2.0 Flows in Salesforce | 2 hrs |
| Tue | Lecture 14: Named Credentials and External Services | 2 hrs |
| Wed | Lecture 15: Shield, Encryption, Data Masking | 2 hrs |
| Thu | Security review: Cross-domain security scenarios | 1.5 hrs |
| Fri | Lab 02: OAuth and Named Credentials | 2 hrs |
| Sat | Practice: 20 questions on Domain 4 | 1 hr |
| Sun | Rest | — |

### Week 5: Troubleshooting + Full Domain Review (Domain 5)
**Goal:** Develop pattern recognition for integration failure scenarios.

| Day | Activity | Time |
|-----|----------|------|
| Mon | Domain 5: Integration Troubleshooting patterns | 2 hrs |
| Tue | Cross-domain review: Where domains overlap | 1.5 hrs |
| Wed | Full practice test #1 (60 questions, timed) | 2 hrs |
| Thu | Review wrong answers — identify weak domains | 1.5 hrs |
| Fri | Targeted review of weakest domain | 2 hrs |
| Sat | Full practice test #2 | 2 hrs |
| Sun | Review + cheat sheet creation | 1.5 hrs |

### Week 6: Final Prep and Exam
**Goal:** Consolidate, not learn new material.

| Day | Activity | Time |
|-----|----------|------|
| Mon | Cheat sheet review — all 5 domains | 1.5 hrs |
| Tue | Flash card drill — API names, limits, patterns | 1 hr |
| Wed | Final practice test (45 questions, timed) | 1.5 hrs |
| Thu | Light review only — do not cram | 30 min |
| Fri | **EXAM DAY** — arrive/log in early | — |

---

## Course File Index

### Section 01: Integration Fundamentals
| File | Topic | Exam Domain | Priority |
|------|-------|-------------|----------|
| [Lecture 01](section-01-integration-fundamentals/lecture-01-integration-patterns-overview.md) | Integration Patterns Overview | Domain 1 — 26% | CRITICAL |
| [Lecture 02](section-01-integration-fundamentals/lecture-02-api-design-rest-soap.md) | API Design — REST vs SOAP | Domain 2 — 22% | CRITICAL |
| [Lecture 03](section-01-integration-fundamentals/lecture-03-event-driven-architecture.md) | Event-Driven Architecture | Domain 1 + 3 — 48% | CRITICAL |
| [Lecture 04](section-01-integration-fundamentals/lecture-04-middleware-esb-patterns.md) | Middleware and ESB Patterns | Domain 3 — 22% | HIGH |

### Section 02: Salesforce Integration APIs
| File | Topic | Exam Domain | Priority |
|------|-------|-------------|----------|
| Lecture 05 | Salesforce REST API Deep Dive | Domain 2 — 22% | CRITICAL |
| Lecture 06 | SOAP, Bulk, and Metadata APIs | Domain 2 — 22% | CRITICAL |
| Lecture 07 | Streaming API, Platform Events, CDC | Domain 1 + 2 | CRITICAL |
| Lecture 08 | Composite API Patterns | Domain 2 — 22% | HIGH |

### Section 03: Enterprise Patterns
| File | Topic | Exam Domain | Priority |
|------|-------|-------------|----------|
| Lecture 09 | iPaaS and MuleSoft Architecture | Domain 3 — 22% | HIGH |
| Lecture 10 | API Gateway and Service Mesh | Domain 3 — 22% | HIGH |
| Lecture 11 | Error Handling, Dead Letter, Retry | Domain 5 — 13% | HIGH |
| Lecture 12 | Idempotency and Deduplication | Domain 5 — 13% | HIGH |

### Section 04: Security and Governance
| File | Topic | Exam Domain | Priority |
|------|-------|-------------|----------|
| Lecture 13 | OAuth 2.0 Flows in Salesforce | Domain 4 — 17% | CRITICAL |
| Lecture 14 | Named Credentials and External Services | Domain 4 — 17% | HIGH |
| Lecture 15 | Shield, Encryption, Data Masking | Domain 4 — 17% | HIGH |

### Labs
| File | Topic |
|------|-------|
| [Lab 01](labs/lab-01-api-integration-hands-on.md) | REST API callout from Apex + error handling |
| [Lab 02](labs/lab-02-oauth-named-credentials.md) | OAuth JWT flow + Named Credentials |

### Exam Prep
| File | Purpose |
|------|---------|
| [Practice Exam](exam-prep/practice-exam-full.md) | 60 questions, timed, answers with explanations |
| [Cheat Sheet](exam-prep/cheat-sheet.md) | One-page reference: all APIs, limits, patterns |

---

## What High Scorers Know That Others Don't

After studying hundreds of certification candidates, here are the differentiators between 63% and 85%+ scorers on this exam:

### 1. They Internalize the API Selection Framework
They can immediately answer "Bulk API or REST API?" based on 4 parameters: volume, real-time requirement, error handling need, and field complexity.

### 2. They Know Platform Events vs CDC vs Streaming API Without Hesitation
These three are the most commonly confused on the exam. The differentiator: who publishes, who consumes, what triggers it, and what the replay window is.

### 3. They Think in Failure Modes
For every integration pattern question, they ask "what happens when this fails?" — and pick the answer that has the best failure story.

### 4. They Know Every OAuth Flow Cold
The exam regularly tests subtle differences between Web Server OAuth, JWT Bearer, and Client Credentials. Know which one requires no user interaction (JWT Bearer, Client Credentials) and which requires a human login step.

### 5. They Understand Governor Limits as Architecture Constraints
Governor limits are not obstacles to code around — they are signals about the right architecture. If you're hitting the 100-callout limit, the architecture is wrong, not the code.

---

## Quick Reference: Key Numbers to Memorize

| Metric | Value |
|--------|-------|
| Apex callout timeout (max) | 120 seconds |
| Apex callout limit per transaction | 100 |
| Bulk API batch size (v1) | 10,000 records |
| Bulk API v2 batch size | 150 MB / file |
| Platform Event daily allocation (base) | 250,000 |
| Platform Event retention (replay) | 72 hours |
| Streaming API (push topic) retention | 24 hours |
| REST API record retrieval limit | 2,000 per query |
| SOQL query row limit per transaction | 50,000 |
| REST Composite batch limit | 25 subrequests |
| Named Credential: max per org | No hard limit (governed by list) |
| Connected App OAuth token validity | Configurable, typically 2 hours |

---

## Exam Day Strategy

### Time Management
- 60 questions in 120 minutes = 2 minutes per question
- Flag and skip anything that takes more than 90 seconds on first pass
- Most candidates have 20-30 minutes left for review — use it

### Answer Selection Strategy
1. Read the entire question including ALL answer choices before answering
2. Eliminate clearly wrong answers first (usually 1-2 are obvious)
3. For remaining choices: apply the architect mindset — scalability, maintainability, standard patterns
4. If two answers are both "correct," pick the one that fits a larger enterprise, higher volume, or more resilient scenario
5. Watch for "best practice" language — the exam rewards Salesforce's recommended approach

### Common Exam Traps
- **Trigger-based callout as default** — In most volume scenarios, triggers + synchronous callouts fail at scale; the architect answer is usually Platform Events or async processing
- **REST API for everything** — Bulk API exists for a reason; if volume > 1,000 records, consider Bulk
- **OAuth Username-Password flow** — This flow is deprecated/discouraged; the exam knows this and will test whether you know the secure alternatives
- **Ignoring idempotency** — Any answer that doesn't account for retry/duplicate scenarios is usually wrong
- **ESB for simple integrations** — Over-engineering is an architecture failure too

---

*This study guide is designed for Salesforce Partner Technical Architects preparing for CRT-404. Content reflects exam blueprint as of 2024-2025 exam version. Always verify current exam objectives on Trailhead.*
