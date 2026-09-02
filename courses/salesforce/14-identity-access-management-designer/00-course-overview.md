# Salesforce Certified Identity & Access Management Designer — Study Guide

> **Cert Code:** CRT-405  
> **Audience:** Partner Technical Architects, Solution Architects, and senior developers who design or advise on Salesforce identity architectures  
> **This guide assumes:** You know Salesforce well. You have deployed orgs, built apps, and worked with customers. What you need is deep protocol-level identity/security knowledge to pass the exam and advise confidently.

---

## Exam Facts

| Item | Detail |
|---|---|
| Exam Code | CRT-405 |
| Number of Questions | 60 scored questions (may include ~5 unscored pilot questions) |
| Time Allowed | 105 minutes (~1.75 min/question) |
| Passing Score | 58% — approximately **35 out of 60** correct |
| Cost | $200 first attempt / $100 retake |
| Delivery | Webassessor (online proctored or test center) |
| Prerequisites | None formal; Salesforce Admin cert recommended |
| Validity | 3 years; annual Trailhead maintenance required |

---

## Exam Domain Breakdown

Understanding the domain weights tells you where to spend your study time. This is not an evenly distributed exam.

| Domain | Weight | ~Questions |
|---|---|---|
| Identity Management Concepts | 17% | ~10 questions |
| Authentication & Authorization | 22% | ~13 questions |
| Federation, SSO & Delegated Authentication | 22% | ~13 questions |
| Connected Apps & OAuth | 17% | ~10 questions |
| Communities / Experience Cloud Identity | 12% | ~7 questions |
| Identity Governance | 10% | ~6 questions |
| **Total** | **100%** | **~60** |

### Domain Priority Analysis

- **Highest ROI study areas:** Authentication & Authorization (22%) and Federation/SSO (22%) together account for 44% of the exam — nearly half your score. Master these first.
- **OAuth / Connected Apps** (17%) is highly technical and protocol-specific. Most candidates underestimate it.
- **Identity Governance** (10%) is the smallest domain but covers compliance, auditing, and lifecycle management — topics that are often confused with adjacent admin knowledge.
- **Communities/Experience Cloud** (12%) tests whether you can apply identity concepts in the context of external users — a common real-world scenario.

---

## What This Exam Actually Tests

The CRT-405 is not a configuration exam. It tests:

1. **Protocol knowledge** — Can you explain the SAML assertion flow step by step? Can you choose the right OAuth grant type for a given scenario?
2. **Architecture judgment** — Given a set of requirements, which identity solution is most appropriate and why?
3. **Salesforce-specific implementation** — How do these protocols map to Salesforce's actual settings (Auth. Providers, SSO Settings, Connected Apps, Named Credentials)?
4. **Security reasoning** — What are the risks of a given configuration? When is MFA required? What does Zero Trust mean in practice?

Questions often present a scenario and ask "which is the BEST approach" — there are often two plausible answers and you need to know the nuance.

---

## Study Path — Recommended Lecture Order

### Phase 1: Protocol Foundations (Weeks 1–2)
These lectures establish the vocabulary and protocol mechanics that everything else builds on. Do not skip or skim these.

| # | Lecture | Domain Coverage | Priority |
|---|---|---|---|
| 01 | Identity Concepts & Foundations | Identity Management Concepts | Critical |
| 02 | SAML SSO Deep Dive | Federation, SSO | Critical |
| 03 | OAuth 2.0 & OpenID Connect | Connected Apps, Auth | Critical |
| 04 | Authentication Providers | Federation, Auth | High |

### Phase 2: Salesforce Identity Implementation (Weeks 3–4)
These lectures map the protocols to actual Salesforce configuration.

| # | Lecture | Domain Coverage | Priority |
|---|---|---|---|
| 05 | Salesforce as Identity Provider | Federation, SSO | Critical |
| 06 | Salesforce as Service Provider (SSO In) | Federation, SSO | Critical |
| 07 | Connected Apps — Configuration & Security | Connected Apps | Critical |
| 08 | Delegated Authentication | Federation, SSO | High |
| 09 | JWT & Token Deep Dive | Authentication, OAuth | High |

### Phase 3: Access Management & Governance (Week 5)

| # | Lecture | Domain Coverage | Priority |
|---|---|---|---|
| 10 | MFA, Verification Methods & Login Flows | Authentication | Critical |
| 11 | Login Flows & Identity Verification | Authentication | High |
| 12 | User Provisioning & SCIM | Identity Governance | High |
| 13 | Identity Lifecycle & Governance | Identity Governance | High |

### Phase 4: Experience Cloud & Advanced Scenarios (Week 6)

| # | Lecture | Domain Coverage | Priority |
|---|---|---|---|
| 14 | Experience Cloud Identity | Communities | Critical |
| 15 | Advanced Scenarios & Exam Prep | All | Critical |

---

## How to Use This Guide

### Each Lecture Contains:
- **Foundations** — Protocol/concept background, starting from first principles
- **Core Concepts** — Deep technical content with the specificity the exam requires
- **PTA / SA Relevance** — How this shows up in real customer engagements
- **Architecture Diagrams** — Mermaid flowcharts and sequence diagrams you can reason about
- **Key Facts to Memorize** — The specific, testable facts that appear on the exam
- **Exam Traps** — Common wrong answers and the reasoning behind why they're wrong
- **Practice Questions** — 3–5 questions per lecture with detailed answer explanations

### Study Recommendations:
1. **First read:** Go through the entire lecture without stopping for note-taking. Understand the narrative.
2. **Second read:** Work through the diagrams manually. Trace each step in the flows yourself.
3. **Practice questions:** Attempt before reading the answers. If you get it wrong, re-read the relevant section.
4. **Teach it back:** For each flow (SP-initiated SAML, OAuth Auth Code, etc.), try to explain it to a colleague or draw it on a whiteboard from memory.
5. **Labs:** Use the companion labs directory to configure the concepts in a scratch org.

---

## Key Exam Strategy Tips

### Tip 1: The Protocol Is the Answer
When in doubt, reason from the protocol. The exam rewards candidates who understand *why* a protocol works a certain way, not just *what* the configuration looks like. If you know that SAML assertions are XML-signed and time-limited, you can answer questions about replay attacks correctly even if you've never seen that specific question before.

### Tip 2: Scenario → Requirements → Constraints → Best Answer
The exam uses scenario-based questions heavily. Before looking at the answers, identify:
- What is being asked? (Authentication? Authorization? Both?)
- What are the constraints? (Machine-to-machine? Mobile app? Legacy system?)
- Who is the user? (Internal employee? External customer? Automated service?)
Then pick the answer that best fits. Wrong answers are usually right for a *different* scenario.

### Tip 3: Know the Salesforce-Specific Nuances
General OAuth/SAML knowledge is necessary but not sufficient. You need to know:
- How Salesforce maps NameID to user attributes (Federation ID, Username, Email)
- Which OAuth grant types Salesforce supports and their specific names (Web Server, User-Agent, Username-Password, JWT Bearer)
- The exact fields in Connected App configuration and their security implications
- What JIT provisioning requires in terms of SAML attributes

### Tip 4: Watch for "Least Privilege" and "Most Secure"
The exam frequently asks for the most secure or least privileged option. Key principles:
- Client Credentials > Password flow (no user credentials transmitted)
- Authorization Code + PKCE > Implicit (for SPAs)
- Assertion-level signing > Response-level signing
- MFA always required for sensitive operations
- Refresh tokens should be rotated, not reused indefinitely

### Tip 5: Time Management
105 minutes for 60 questions = 1.75 minutes per question. You have more time than most Salesforce exams. Use it.
- Flag questions you're unsure about and return to them
- Don't spend more than 3 minutes on any single question on first pass
- The last 20 minutes: review flagged questions only

### Tip 6: Elimination Strategy
Most questions have one obviously wrong answer and one subtly wrong answer. Eliminate by:
- "Would this create a security risk?" — If yes, it's probably wrong
- "Does this even exist as a Salesforce feature?" — Fabricated features appear as distractors
- "Is this the right protocol for this scenario?" — SAML for authorization delegation is wrong; OAuth for XML-based enterprise SSO is wrong

---

## Quick Reference Index

### Core Protocols
| Topic | Lecture |
|---|---|
| SAML 2.0 flows, assertions, JIT | Lecture 02 |
| OAuth 2.0 grant types, flows | Lecture 03 |
| OpenID Connect (OIDC), ID tokens | Lecture 03 |
| JWT structure and validation | Lecture 09 |
| WS-Federation | Lecture 06 |
| SCIM provisioning | Lecture 12 |

### Salesforce Features
| Feature | Lecture |
|---|---|
| SSO Settings (Salesforce as SP) | Lecture 06 |
| My Domain (required for SSO) | Lecture 06 |
| Identity Provider (Salesforce as IdP) | Lecture 05 |
| Connected Apps | Lecture 07 |
| Auth. Providers | Lecture 04 |
| Named Credentials | Lecture 04, 07 |
| Delegated Authentication | Lecture 08 |
| Login Flows | Lecture 11 |
| MFA & Verification Methods | Lecture 10 |
| Experience Cloud / Profiles | Lecture 14 |
| User Provisioning (SCIM) | Lecture 12 |
| Identity Verification History | Lecture 13 |
| Permission Sets & Profiles | Lecture 10, 13 |

### Architecture Patterns
| Pattern | Lecture |
|---|---|
| Salesforce as IdP (SP-initiated) | Lecture 05 |
| Third-party IdP → Salesforce (SP-initiated) | Lecture 06 |
| Third-party IdP → Salesforce (IdP-initiated) | Lecture 06 |
| Social login (Google/Facebook) to Experience Cloud | Lecture 04, 14 |
| Machine-to-machine integration | Lecture 03, 07 |
| Mobile app OAuth | Lecture 03, 07 |
| Hybrid identity (AD + Salesforce) | Lecture 02, 06 |
| Zero Trust in Salesforce context | Lecture 01, 10 |

---

## As a PTA: Why This Certification Matters

### The Business Case for Getting CRT-405

As a Partner Technical Architect, identity is the foundation of every enterprise Salesforce deployment. Here is where it shows up:

**Every single enterprise deal:**
- "How does SSO work with our Active Directory?" — asked in every discovery call
- "Who manages user provisioning?" — governance question that blocks go-live
- "What happens when an employee is terminated?" — deprovisioning and audit question
- "Is Salesforce MFA compliant with our SOC 2 / ISO 27001 policy?" — compliance gate

**Revenue-impacting conversations:**
- A customer using Salesforce as a platform (Experience Cloud + API integrations) needs an identity architect who can design the full OAuth topology
- Financial services, healthcare, and government customers have strict identity governance requirements that require custom architecture
- ISV partners building apps on AppExchange need OAuth expertise to correctly implement Connected Apps

**Where PTA-level identity knowledge wins deals:**
- You can walk a CISO through the SAML trust model and explain why Salesforce federation is secure
- You can design the provisioning/deprovisioning workflow that satisfies the security team
- You can explain exactly why a particular OAuth flow is appropriate for a mobile app vs. a server-side integration
- You can review a proposed architecture and identify the gaps before they become incidents

### The Conversations This Cert Prepares You For

**With a CISO or security architect:**
"We require all applications to support our Okta-based SSO with SAML 2.0. How does Salesforce handle SP-initiated and IdP-initiated flows? What user attributes are required? How do we handle JIT provisioning vs. pre-provisioning?"

**With an enterprise architect:**
"We have 50,000 internal users on Azure AD and 200,000 external customers on our portal. How do we architect identity for both populations? What's the token lifetime strategy? How do we revoke access when a distributor relationship ends?"

**With a DevOps / platform team:**
"Our CI/CD pipeline needs to call Salesforce APIs without user interaction. What's the right OAuth flow? How do we rotate credentials? What scopes does it need?"

**With a compliance team:**
"GDPR requires us to be able to delete user identity data. What does that mean for our Salesforce implementation? How does SCIM deprovisioning work?"

This guide prepares you for every one of these conversations — and the exam is just the certification of that readiness.

---

## Prerequisites & Setup

### Recommended Background
- Salesforce Administrator certification (or equivalent experience)
- Basic understanding of HTTP, REST APIs, and web security concepts
- Familiarity with XML and JSON formats
- Some exposure to cloud architecture (AWS/Azure/GCP concepts helpful but not required)

### Tools & Environment
- **Scratch org or Developer Edition org** — for hands-on labs
- **SAML-tracer** (Firefox/Chrome extension) — essential for reading SAML assertions
- **JWT.io** — for decoding and validating JWTs
- **Postman** — for testing OAuth flows manually
- **SAML developer tools** at Salesforce Setup — available in any org

### Trailhead Modules (Recommended Companion)
- Identity and Access Management for Beginners
- Build a Connected App for API Integration
- Salesforce Identity
- User Authentication
- External Identity
- SAML Single Sign-On for Salesforce Communities

---

## Notation Used in This Guide

| Symbol | Meaning |
|---|---|
| ⚠️ | Common mistake or trap — often tested on the exam |
| 🔑 | Key fact to memorize |
| 💡 | Important insight or "aha" moment |
| 🏢 | Enterprise pattern relevant to PTA advisory work |
| 📋 | Exam-specific knowledge |
| 🔒 | Security consideration |

---

*Begin with Lecture 01 — Identity Concepts & Foundations. Even if you think you know this material, the vocabulary precision matters for the exam.*
