# Salesforce Architect-Level Certifications

> **Last Updated:** August 2026  
> **Path Position:** Months 9–12 in the 12-Month Technical Architect Sprint  
> **Always verify:** passing scores, topic weights, and fees at `trailheadacademy.salesforce.com` before sitting any exam

---

## The CTA Credential Map

```
CTA (Board Review) ← PINNACLE
├── Application Architect (auto-awarded bundle)
│   ├── Platform Developer I
│   ├── Platform App Builder
│   ├── Data Architect          ← Section 1
│   └── Sharing & Visibility Architect  ← Section 2
└── System Architect (auto-awarded bundle)
    ├── Integration Architect       ← Section 3
    ├── Development Lifecycle & Deployment Architect
    ├── Identity and Access Management Designer
    └── Mobile Solutions Architecture Designer
```

**You need 8 individual certifications before the CTA board review.**

---

## 1. Salesforce Certified Data Architect

### Why This Cert Matters
Validates ability to design scalable data models, manage large data volumes (LDV), govern data quality, and execute migrations. Required for the Application Architect bundle.

### Exam Details

| Parameter | Value |
|-----------|-------|
| Questions | 60 multiple-choice / multi-select |
| Time Limit | 105 minutes |
| Passing Score | ~62% |
| Cost | $400 (retake $200) |
| Prerequisites | None required; Admin cert strongly recommended |

### Topic Weights

| Topic | Weight |
|-------|--------|
| Data Modeling and Management | **28%** |
| Master Data Management (MDM) | 18% |
| Data Governance | 17% |
| Large Data Volume (LDV) | 17% |
| Data Migration | 12% |
| Data Quality | 8% |

### Key Concepts to Master

**LDV (17%):** Thresholds (>1M records), skinny tables, custom indexes, selective SOQL, async SOQL, Big Objects for archiving, impact on sharing/reports

**MDM (18%):** Registry vs. co-existence vs. centralized MDM; duplicate management with matching rules; external ID mapping across systems

**Data Migration (12%):** ETL sequencing, relationship/lookup resolution order, rollback planning, Bulk API 2.0, error handling

### Official Trailhead Path

- Trailmix: "Prepare for Your Salesforce Certified Data Architect Credential" (search on Trailhead)
- Key modules: Data Modeling, Large Data Volumes, Duplicate Management, Big Objects, Custom Metadata Types, External Objects & Salesforce Connect, Shield Platform Encryption

### Real-World Architect Labs

1. **LDV Performance Rescue** — A financial firm has 50M transaction records on a custom object; reports time out. Design: custom indexes on high-selectivity fields, skinny tables, async SOQL for batch reporting, Big Objects for archived data.

2. **MDM Architecture** — A global retailer has customer records in Salesforce, SAP, and a legacy CRM. Design: registry vs. centralized MDM choice, duplicate rule config, external ID mapping, sync frequency.

3. **Data Migration Plan** — Migrate 5M accounts + 20M related contacts from legacy CRM. Design: migration sequence (parent before child), relationship resolution, error handling, rollback plan, validation queries.

4. **GDPR Erasure Workflow** — Healthcare org needs right-to-erasure compliance. Design: field audit trail config, data retention policies, anonymization workflow, data classification schema.

5. **Complex ERD Design** — A healthcare company needs to model patient–provider–appointment–billing relationships with strict record ownership. Draw the ERD and justify each relationship type.

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| 2–3 years Salesforce (admin/dev) | 3–4 months |
| 4–5 years with data architecture work | 2–3 months |
| DBA/enterprise data background | 2–3 months |

---

## 2. Salesforce Certified Sharing and Visibility Architect

### Why This Cert Matters
Validates expertise in designing Salesforce's entire security and sharing stack — from OWDs to programmatic Apex sharing to Shield encryption and compliance. Required for Application Architect bundle.

### Exam Details

| Parameter | Value |
|-----------|-------|
| Questions | 60 multiple-choice / multi-select |
| Time Limit | 105 minutes |
| Passing Score | ~63% |
| Cost | $400 (retake $200) |
| Prerequisites | None required; Admin cert required in practice |

### Topic Weights

| Topic | Weight |
|-------|--------|
| Sharing Architecture Design | **26%** |
| Programmatic Sharing | 20% |
| Platform Encryption | 19% |
| Compliance Requirements | 18% |
| LDV and Sharing Performance | 17% |

### Key Concepts to Master

**Sharing Stack (26%):** OWDs → Role Hierarchy → Sharing Rules (ownership-based vs. criteria-based) → Team Sharing → Manual Sharing → Programmatic Sharing. Know the additive nature — each layer only opens access, never restricts.

**Programmatic Sharing (20%):** Apex Share objects (`AccountShare`, `CustomObject__Share`), `rowCause` field, share reason, maintaining shares on record transfer, Platform Events to trigger sharing updates.

**Shield Encryption (19%):** Deterministic vs. probabilistic encryption, BYOK (Bring Your Own Key), Cache-Only Keys, what CANNOT be encrypted (formula fields that reference encrypted fields, certain system fields), impact on search/reports/workflow.

**Sharing Performance (17%):** Criteria-based sharing anti-patterns on high-volume objects, sharing recalculation deferral, parallel recalculation, skinny table impact on shared objects.

### Official Trailhead Path

- Trailmix: "Prepare for Your Salesforce Certified Sharing and Visibility Architect Credential"
- Key modules: Data Security, Shield Platform Encryption, Apex Sharing, Territory Management, Large Data Volumes

### Real-World Architect Labs

1. **Complex Sharing Model** — 500 sales territories, strict role hierarchy, accounts visible to owning rep + direct manager + territory team. OWDs = Private. Design complete sharing model using Enterprise Territory Management, sharing rules, and Apex managed sharing.

2. **Shield Encryption Design** — Financial firm must encrypt SSNs, bank account numbers, and DOB with customer-managed keys. Design: deterministic vs. probabilistic choice per field, BYOK config, document affected features.

3. **HIPAA Sharing Architecture** — Hospital system on Health Cloud must comply with HIPAA. Design org sharing model, encryption fields, Event Monitoring config, patient right-of-access workflow.

4. **Apex Managed Sharing** — `Project__c` records must be shared with all members via junction object `ProjectMember__c`. Declarative sharing can't handle this. Design: Share object, trigger logic, re-share on transfer.

5. **LDV Sharing Performance Fix** — 10M Account records, 500 criteria-based sharing rules, 72-hour recalculation time. Diagnose anti-patterns and redesign for performance.

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| Experienced admin with security knowledge | 2–3 months |
| Developer with limited sharing experience | 3–4 months |
| Studying alongside Data Architect | Add 1–2 months overlap |

---

## 3. Salesforce Certified Integration Architect

### Why This Cert Matters
Validates ability to design and govern integrations connecting Salesforce with external systems — patterns, middleware, security, error handling, and lifecycle management. Required for System Architect bundle.

### Exam Details

| Parameter | Value |
|-----------|-------|
| Questions | 60 multiple-choice / multi-select |
| Time Limit | 105 minutes |
| Passing Score | ~63% |
| Cost | $400 (retake $200) |
| Prerequisites | None required; Admin or PDI recommended |

### Topic Weights

| Topic | Weight |
|-------|--------|
| Translate Needs to Integration Architecture | **27%** |
| Design Integration Solutions | 24% |
| Govern Integration Architecture | 18% |
| Implement and Monitor Integrations | 16% |
| Evaluate Integration Trade-offs | 15% |

### Key Concepts to Master

**Pattern Selection (27%):** Know when to use each API:
- REST API → general-purpose CRUD, mobile, web
- SOAP API → legacy system integration, enterprise middleware
- Bulk API 2.0 → large data volumes (>50k records)
- Streaming/Platform Events → real-time event-driven
- Composite API → multiple operations in one call
- Change Data Capture → change notification to external systems

**Integration Patterns:** Point-to-point vs. hub-and-spoke vs. ESB vs. event-driven; sync vs. async; idempotency; compensation transactions.

**Governance (18%):** API versioning, OAuth 2.0 flows (User-Agent, Web Server, JWT Bearer, Client Credentials), Named Credentials, rate limiting, monitoring.

### Official Trailhead Path

- Trailmix: "Prepare for Your Salesforce Certified Integration Architect Credential"
- Key modules: Salesforce APIs, MuleSoft Basics, Platform Events & CDC, Apex Integration Services, Named Credentials
- External: MuleSoft integration patterns docs, `architect.salesforce.com` Integration pillar

### Real-World Architect Labs

1. **ERP Real-Time Sync** — Manufacturing company: real-time order sync between Salesforce and SAP. Latency < 2 sec, 10k orders/day. Design: pattern, API selection, error handling, middleware topology.

2. **High-Volume Batch** — Retailer syncs 2M product records from PIM nightly. Design: Bulk API 2.0, error handling, upsert with external IDs, monitoring dashboard.

3. **Event-Driven Architecture** — When Opportunity is Closed Won, notify billing + provisioning + email marketing. Design: Platform Events, idempotency, at-least-once delivery, consumer error handling.

4. **Coexistence Migration** — 18-month phased migration from on-premise CRM to Salesforce. Design coexistence integration: bidirectional sync, conflict resolution rules, cutover strategy.

5. **API Governance Model** — 40 integrations across 3 Salesforce orgs. Design: versioning strategy, deprecation policy, auth standards, SLA monitoring.

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| Experienced integration developer/architect | 2–3 months |
| Salesforce developer learning integration | 3–5 months |
| Admin background, no prior integration | 5–7 months |

---

## 4. Application Architect (Bundle — Auto-Awarded)

**No separate exam.** Automatically awarded when all 4 component certs are active:

| Required Cert | Section |
|--------------|---------|
| Platform Developer I | Developer guide |
| Platform App Builder | Foundation guide |
| Data Architect | Section 1 above |
| Sharing & Visibility Architect | Section 2 above |

All 4 must remain maintained (annual maintenance modules) for the bundle to stay active.

**Recommended order:** App Builder → Platform Developer I → Data Architect → Sharing & Visibility Architect

---

## 5. System Architect (Bundle — Auto-Awarded)

**No separate exam.** Automatically awarded when all 4 component certs are active:

| Required Cert | Focus |
|--------------|-------|
| Integration Architect | Section 3 above |
| Development Lifecycle & Deployment Architect | DevOps, CI/CD, SFDX, packaging, sandboxes |
| Identity & Access Management Designer | SSO, SAML, OAuth 2.0, MFA, Connected Apps |
| Mobile Solutions Architecture Designer | Salesforce Mobile App, Mobile Publisher, offline-first, SmartStore |

### Brief Notes on Other System Architect Components

**Dev Lifecycle & Deployment Architect:**
- SFDX scratch orgs, unlocked packages, managed packages, sandbox strategy (full → partial → developer sandbox), CI/CD with GitHub Actions/Copado/Flosum, change set limitations, environment branching strategy
- Study time: 3–5 months for experienced developers

**Identity & Access Management Designer:**
- SAML 2.0, OAuth 2.0 flows (all 5 grant types), OpenID Connect, SSO as SP vs. IdP, delegated authentication, MFA enforcement strategies, Connected App scopes, Named Credentials, Social Sign-On
- Study time: 2–4 months

**Mobile Solutions Architecture Designer:**
- Salesforce Mobile App customization, Mobile Publisher (branded mobile app), PWAs, offline-first with SmartStore/MobileSync, Salesforce Mobile SDK (React Native), UX patterns for mobile
- Study time: 2–3 months

---

## 6. Salesforce Certified Technical Architect (CTA)

### The Pinnacle — Fewer Than 1,000 Holders Worldwide

### Prerequisites (All Must Be Active)
- Application Architect bundle (4 certs)
- System Architect bundle (4 certs)
- **Total: 8 individual certifications active**

### Written Exam

| Parameter | Value |
|-----------|-------|
| Format | Scenario-based multiple-choice |
| Questions | ~60 |
| Time | ~120 minutes |
| Passing Score | ~57% |
| Cost | ~$400 |

### Board Review Process

| Phase | Description | Duration |
|-------|-------------|----------|
| Case Study | Multi-page enterprise scenario distributed | Day of exam |
| Preparation | Review case, prepare architecture presentation | ~2 hours |
| Presentation | Present proposed architecture to 3-person panel | ~20–30 min |
| Q&A / Challenges | Panel probes, introduces scenario changes | ~30–40 min |

**Panel:** 3 senior Salesforce architects/CTAs  
**Total cost:** ~$3,000–4,000 USD (written + board review slot)

### What the Panel Evaluates

- Architectural completeness and technical correctness
- Trade-off analysis and justification
- Risk identification and mitigation strategies
- Communication clarity (both technical and business audiences)
- Ability to defend decisions under pressure
- Business context awareness

### CTA Board Prep Labs (Practice These Weekly)

1. **Multi-Cloud Enterprise** — Fortune 500 implementing Sales Cloud + Service Cloud + Experience Cloud + MuleSoft. 50k employees, 5M customers, GDPR across EU/US. Design the complete architecture.

2. **Org Strategy Decision** — Company acquiring 3 businesses, each with their own Salesforce org. Consolidate vs. multi-org? Justify with data architecture, integration, identity federation, change management implications.

3. **Scale for Growth** — Org currently at 500k records / 200 users. 3-year projection: 10M records / 5,000 users. Identify today's architectural risks and redesign for scale.

4. **Compliance-Driven Redesign** — Healthcare payer must achieve HIPAA compliance within 6 months. Identify all gaps and design remediation roadmap.

5. **Legacy Modernization** — Replacing 20-year-old on-premise system with Salesforce. Design phased migration, coexistence architecture, integration strategy, cutover plan.

### CTA Key Resources

| Resource | URL |
|----------|-----|
| Architect Journey | `trailhead.salesforce.com/credentials/architectoverview` |
| Salesforce Architects site | `architect.salesforce.com` |
| Well-Architected Framework | `architect.salesforce.com/well-architected` |
| Architecture Decision Guides | `architect.salesforce.com/decision-guides` |
| Trailblazer CTA Community | Search "CTA" in Trailblazer Community groups |
| Certification Verification | `trailhead.salesforce.com/credentials/verification` |

### Realistic CTA Timeline

| Phase | Duration |
|-------|----------|
| All 8 component certs (from Admin baseline) | 2–4 years |
| CTA-specific board prep (post all certs) | 6–18 months |
| **Aggressive 12-month sprint (all certs + board prep start)** | Certs achievable; board review likely extends to month 13–18 |

---

## All Architect Certs — Quick Reference

| Credential | Type | Questions | Time | Pass Score | Cost | Unlocks |
|-----------|------|-----------|------|-----------|------|---------|
| Data Architect | Exam | 60 | 105 min | ~62% | $400 | Application Architect (w/ 3 others) |
| Sharing & Visibility Architect | Exam | 60 | 105 min | ~63% | $400 | Application Architect (w/ 3 others) |
| Integration Architect | Exam | 60 | 105 min | ~63% | $400 | System Architect (w/ 3 others) |
| Dev Lifecycle & Deployment Architect | Exam | 60 | 105 min | ~63% | $400 | System Architect (w/ 3 others) |
| IAM Designer | Exam | 60 | 105 min | ~63% | $400 | System Architect (w/ 3 others) |
| Mobile Solutions Designer | Exam | 60 | 105 min | ~63% | $400 | System Architect (w/ 3 others) |
| Application Architect | Bundle (auto) | N/A | N/A | N/A | Free | CTA prerequisite |
| System Architect | Bundle (auto) | N/A | N/A | N/A | Free | CTA prerequisite |
| Technical Architect (CTA) | Written + Board | ~60 written | ~120 min + 2 hr board | ~57% written | ~$3,000–4,000 | Pinnacle |

---

## Key Links

| Resource | URL |
|----------|-----|
| All Architect Credentials | `trailheadacademy.salesforce.com` |
| Architect Reference Site | `architect.salesforce.com` |
| Well-Architected Framework | `architect.salesforce.com/well-architected` |
| Decision Guides | `architect.salesforce.com/decision-guides` |
| Exam Registration | `webassessor.com/salesforce` |
