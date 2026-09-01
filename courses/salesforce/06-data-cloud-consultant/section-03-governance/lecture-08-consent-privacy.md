# Lecture 08: Consent & Privacy

## Learning Objectives
- Explain how Data Cloud manages consent for individual customers
- Identify the key Contact Point and Individual fields used to track consent status
- Describe consent categories and how they are applied to restrict data use
- Understand the relevance of GDPR and CCPA to Data Cloud implementations and the consent API

---

## Slides

### Slide 1: Why Consent Management Matters in Data Cloud
**Visual:**
```
                        DATA CLOUD
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
  ┌─────────────────────┐     ┌─────────────────────┐
  │   DATA UTILITY      │     │  CUSTOMER RIGHTS    │
  │                     │     │  & COMPLIANCE       │
  │  • Unified profiles │     │                     │
  │  • Segmentation     │     │  • GDPR (EU)        │
  │  • Personalization  │     │  • CCPA (California)│
  │  • AI grounding     │     │  • Right to opt out │
  │  • Analytics        │     │  • Right to erasure │
  └─────────────────────┘     └─────────────────────┘
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
              Consent must flow from collection
              through activation — every step
```

**Content:**
- Data Cloud aggregates vast amounts of customer data — which creates compliance obligations
- **GDPR (EU):** Requires lawful basis for data processing; explicit consent for marketing
- **CCPA (California):** Gives consumers the right to opt out of sale/sharing of personal data
- Data Cloud must respect customer consent preferences across all activation channels
- Failure to honor consent = regulatory risk, reputational damage, and potential fines
- Data Cloud's consent model ensures consent signals flow from collection through to activation

**Speaker Notes:** Consent management is not just a legal checkbox — it's a core functional capability of Data Cloud. The exam tests both the "why" (regulatory context) and the "how" (specific fields, features, and configurations). You don't need to be a GDPR expert for the exam, but you should understand that GDPR and CCPA are the regulatory drivers, and that Data Cloud has specific features to help organizations comply. The key insight is that consent must be captured, stored, and respected — meaning a customer's opt-out preference must flow from wherever it was captured all the way to the point where segments are activated. A consent flag that exists in the system but isn't applied to segment exclusions is as bad as not having it at all.

---

### Slide 2: Contact Point Consent Fields
**Visual:**
```
  ContactPointEmail DMO Record
  ──────────────────────────────────────────────────────────
  EmailAddress:           john@co.com
  IndividualId:           00U-001 (links to Individual)
  ──────────────────────────────────────────────────────────
  CONSENT FIELDS:
  HasOptedOutOfEmail:     false   ← KEY FIELD for email segments
  EmailOptOutDateTime:    (blank — not opted out)
  EmailOptOutSource:      (blank)
  CaptureDatetime:        2024-01-15T10:30:00Z
  EffectiveDate:          2024-01-15
  ──────────────────────────────────────────────────────────

  ContactPointPhone DMO Record
  ──────────────────────────────────────────────────────────
  HasSmsOptedOut:         false   ← KEY FIELD for SMS segments
  ──────────────────────────────────────────────────────────
  RULE: Always add segment exclusion: HasOptedOutOfEmail = true
        for ALL email-based activation segments
```

**Content:**
- **HasOptedOutOfEmail** — Boolean field on Contact Point Email; true = opted out of email marketing
- **HasOptedOutOfFax** — Boolean field on Contact Point Fax
- **HasSmsOptedOut** — Boolean field on Contact Point Phone (SMS channel)
- **EmailOptOutDateTime** — Timestamp when opt-out was captured
- **EmailOptOutSource** — The source where opt-out was recorded (e.g., "unsubscribe link," "preference center")
- These fields are updated when consent signals are ingested into Data Cloud
- Always include `HasOptedOutOfEmail = false` exclusion in email activation segments

**Speaker Notes:** The HasOptedOut fields are the most directly exam-tested consent fields. The exam will often present a scenario where customers are receiving emails after unsubscribing, and ask what the consultant should check — the answer involves verifying that the segment has an exclusion filter for HasOptedOutOfEmail = true. These fields exist on the Contact Point DMOs, not on the Individual DMO. This is important because a customer might have multiple Contact Point Email records (multiple email addresses) with different consent statuses — one email opted in, another opted out. The channel-specific opt-out fields correctly model this per-contact-point consent.

---

### Slide 3: Individual Privacy Fields
**Visual:**
```
  Individual DMO Record — Privacy Fields
  ──────────────────────────────────────────────────────────
  FIELD                    │ VALUE  │ MAPS TO
  ─────────────────────────┼────────┼──────────────────────
  HasOptedOutOfEmail       │ false  │ Person-level email opt
  DoNotProcess             │ false  │ GDPR Right to Erasure
  DoNotTrack               │ false  │ Behavioral tracking opt
  HasOptedOutOfGeoTracking │ false  │ Location data opt-out
  HasOptedOutOfSharing     │ false  │ CCPA data sharing opt

  ──────────────────────────────────────────────────────────
  KEY MAPPINGS FOR EXAM:
  ┌────────────────────┬──────────────────────────────────┐
  │ GDPR right to      │ DoNotProcess = true on Individual│
  │ erasure            │ + data deletion from DLO/DMO     │
  ├────────────────────┼──────────────────────────────────┤
  │ CCPA opt out of    │ HasOptedOutOfSharing = true       │
  │ data sharing       │ on Individual                    │
  └────────────────────┴──────────────────────────────────┘
```

**Content:**
- The **Individual DMO** also has privacy fields that apply across all contact points
- **HasOptedOutOfEmail** on Individual — broader email opt-out at the person level
- **DoNotProcess** — GDPR-aligned field; when true, indicates individual should not be processed at all
- **DoNotTrack** — Signals the customer has opted out of behavioral tracking
- **HasOptedOutOfGeoTracking** — Opt out of location-based data collection
- **HasOptedOutOfSharing** — CCPA-aligned; individual has opted out of sharing data with third parties
- These fields are respected during identity resolution and activation processing

**Speaker Notes:** Individual-level privacy fields are broader than Contact Point consent fields. While Contact Point fields control channel-specific communication consent, Individual-level fields control broader data processing rights. DoNotProcess is the most important for GDPR — if a customer exercises their right to be forgotten, you'd set DoNotProcess = true (and ultimately need to delete their records). HasOptedOutOfSharing is CCPA-relevant — California consumers have the right to opt out of having their data shared or sold to third parties. The exam won't require deep regulatory knowledge, but you should know which field maps to which regulation (GDPR → DoNotProcess, CCPA → HasOptedOutOfSharing).

---

### Slide 4: Consent Categories
**Visual:**
```
  CONSENT CATEGORIES — Granular Per-Purpose Consent
  ──────────────────────────────────────────────────────────
  ┌──────────────────────────┬──────────────┬──────────────┐
  │ Category                 │ Customer A   │ Customer B   │
  ├──────────────────────────┼──────────────┼──────────────┤
  │ Marketing Communications │ OPT IN  ✓    │ OPT OUT  ✗   │
  │ Product Analytics        │ OPT IN  ✓    │ OPT IN   ✓   │
  │ Personalization          │ OPT IN  ✓    │ OPT OUT  ✗   │
  │ Third-Party Sharing      │ OPT OUT ✗    │ OPT OUT  ✗   │
  └──────────────────────────┴──────────────┴──────────────┘

  Customer A: gets personalized marketing
  Customer B: gets only analytics tracking, no marketing

  Configured in: Setup → Consent Management → Consent Categories
  Applied in segments: "Consent Category: Marketing = true"
  MORE granular than a single HasOptedOutOfEmail field
```

**Content:**
- **Consent Categories** allow granular consent management beyond a simple opt-in/opt-out
- Examples: Marketing Communications, Product Analytics, Personalization, Third-Party Data Sharing
- Each category can be independently opted in or out by the customer
- Data Cloud can filter segments and activations based on consent category status
- Consent categories align with cookie consent preferences (banner options)
- Configured in Data Cloud Setup → Consent Management → Consent Categories

**Speaker Notes:** Consent categories represent the modern reality of consent management, where customers are given granular control over what their data is used for. A customer might consent to "product improvement analytics" but opt out of "marketing communications." Data Cloud's consent category feature allows you to model this granularity. In segment design, you might add a filter "consent category: Marketing Communications = true" to ensure only customers who explicitly consented to marketing are included. The exam may test whether you understand that consent categories provide more granularity than a single opt-in/opt-out flag, and that they must be actively applied in segment criteria to be effective.

---

### Slide 5: Consent Data Ingestion
**Visual:**
```
  CONSENT SIGNAL FLOW
  ──────────────────────────────────────────────────────────
  Customer Action           Source System          Data Cloud
  ─────────────────────────────────────────────────────────
  Unsubscribes from   ──▶  MC unsubscribe    ──▶  MC Connector
  MC email                  event                  (batch)

  Opts out via        ──▶  CRM Contact       ──▶  Salesforce
  preference form           HasOptedOut=true       Connector
                                                   (incremental)

  Submits CCPA        ──▶  External pref     ──▶  Ingestion API
  opt-out request           center                 (STREAMING)
                            (OneTrust, etc.)       ← preferred for
                                                     fast compliance

  All paths update Contact Point / Individual consent fields
  in Data Cloud — must then flow to segment exclusion filters
  ──────────────────────────────────────────────────────────
  BEST PRACTICE: Streaming ingestion for consent = minimum
                 compliance window (near-real-time opt-out)
```

**Content:**
- Consent signals can be ingested from multiple sources:
  - **Salesforce CRM** (via Salesforce Connector) — Salesforce stores HasOptedOutOfEmail on Contacts
  - **Marketing Cloud** (via MC Connector) — MC subscriber opt-out status
  - **External preference centers** (via Ingestion API) — custom consent management systems
  - **Data streams from consent management platforms** (OneTrust, Didomi, etc.)
- Consent must be kept **current** — stale consent data is a compliance risk
- Best practice: consent updates should trigger near-real-time ingestion (Ingestion API streaming)

**Speaker Notes:** One of the most important operational questions for consent management is: how quickly do consent changes propagate through Data Cloud? If a customer opts out and the consent update won't reach Data Cloud for 24 hours (because the consent system only does batch export once per day), there's a 24-hour window where they could still be activated to a marketing campaign. For GDPR compliance, the expectation is that opt-outs are honored promptly. This is why near-real-time ingestion of consent signals via the Ingestion API is a best practice. The exam may present this as a scenario asking how to ensure consent changes are reflected in Data Cloud "as quickly as possible" — the answer is streaming ingestion via the Ingestion API, not a 24-hour batch.

---

### Slide 6: The Consent API
**Visual:**
```
  CONSENT API — Programmatic Consent Management
  ──────────────────────────────────────────────────────────
  External System                         Data Cloud
  ─────────────────────────────────────────────────────────
  Step 1: Authenticate (OAuth 2.0)
  POST /services/oauth2/token
  → Bearer token

  Step 2: Update consent
  POST /services/data/v57.0/consent/action/optout
  Authorization: Bearer {token}
  {
    "identifiers": [{"id": "john@co.com", "type": "email"}],
    "action": "optout",
    "purpose": "Marketing"                     │
  }                                            ▼
                                    Individual.HasOptedOutOfEmail
                                    ContactPoint.HasOptedOutOfEmail
                                    updated in Data Cloud

  Step 3: Read consent status (before communication)
  GET /services/data/v57.0/consent/...
  → Current consent status returned
```

**Content:**
- The **Consent API** allows programmatic management of consent preferences
- Enables external systems to read and write consent fields via REST API
- Key endpoint: `/services/data/vXX.0/consent/action/` for channel-specific consent
- Common operations: opt-in to marketing, opt-out of email, query current consent status
- Also supports **Data Use Purpose** objects for GDPR lawful basis documentation
- Authentication: same OAuth 2.0 pattern as Ingestion API (Connected App)

**Speaker Notes:** The Consent API isn't just about writing opt-outs — it's also about reading consent status before making decisions about whether to communicate with a customer. A real-time personalization system might query the Consent API to check whether a customer has consented to personalization before serving personalized content. For the exam, the key facts are: the Consent API is REST-based, it uses OAuth 2.0 authentication, and it manages consent data programmatically. You're unlikely to be asked to write Consent API code on the exam, but scenario questions might ask "how would an external system update a customer's consent preferences in Data Cloud in real time?" — the answer is the Consent API.

---

### Slide 7: GDPR & CCPA in Practice
**Visual:**
```
  ┌────────────────────────────┐  ┌────────────────────────────┐
  │      GDPR (EU)             │  │      CCPA (California)     │
  ├────────────────────────────┤  ├────────────────────────────┤
  │ Right to erasure           │  │ Right to opt out of        │
  │ → DoNotProcess = true      │  │ data sharing               │
  │ → Delete from DLO/DMO      │  │ → HasOptedOutOfSharing=true│
  ├────────────────────────────┤  ├────────────────────────────┤
  │ Right of access            │  │ Right to know              │
  │ → Data Explorer review     │  │ → Export customer data     │
  ├────────────────────────────┤  ├────────────────────────────┤
  │ Lawful basis               │  │ Right to delete            │
  │ documentation              │  │ → Delete from Data Cloud   │
  │ → Data Use Purpose objects │  │   + connected systems      │
  ├────────────────────────────┤  ├────────────────────────────┤
  │ Data minimization          │  │ Non-discrimination         │
  │ → Limit DLO/DMO fields     │  │ → No service degradation   │
  └────────────────────────────┘  └────────────────────────────┘
  Data Cloud provides the TOOLS — compliance is the organization's RESPONSIBILITY
```

**Content:**
- **GDPR (EU):**
  - Right to erasure → `DoNotProcess` flag + data deletion process
  - Right of access → Data Explorer allows customer data review
  - Lawful basis documentation → Data Use Purpose objects
  - Data minimization → limit DLO/DMO fields to what's necessary
- **CCPA (California):**
  - Right to opt out of data sharing → `HasOptedOutOfSharing` field
  - Right to know → Data Cloud data can be exported for access requests
  - Right to delete → requires deletion from Data Cloud and all connected systems
- Data Cloud provides tools to support compliance — compliance is ultimately the organization's responsibility

**Speaker Notes:** The exam doesn't test deep legal knowledge of GDPR or CCPA, but it does test that you can map regulatory rights to Data Cloud features. The most exam-relevant mappings are: right to erasure / right to delete → DoNotProcess flag and manual deletion, right to opt out of data sharing → HasOptedOutOfSharing field, and lawful basis → Data Use Purpose objects. One important disclaimer to know: Data Cloud provides tools to support compliance, but compliance itself is the organization's responsibility. Data Cloud can't guarantee GDPR compliance — it's a tool, not a compliance certification.

---

### Slide 8: Consent Best Practices
**Visual:**
```
  CONSENT MANAGEMENT CHECKLIST
  ──────────────────────────────────────────────────────────
  ✅  Include HasOptedOutOfEmail = false exclusion in ALL
      email activation segments (most important)

  ✅  Ingest consent changes via streaming (Ingestion API)
      to minimize opt-out processing lag window

  ✅  Use Consent Categories for granular per-purpose consent
      management beyond binary opt-in/opt-out

  ✅  Document lawful basis for each data processing purpose
      using Data Use Purpose objects (GDPR requirement)

  ✅  Regularly audit consent field values — stale or missing
      consent data is a compliance risk

  ✅  Test consent exclusions before campaign launch —
      validate opted-out customers are excluded in test runs
```

**Content:**
- ✅ Always include `HasOptedOutOfEmail = false` exclusion in email activation segments
- ✅ Ingest consent changes via streaming (Ingestion API) to minimize opt-out processing lag
- ✅ Use Consent Categories for granular consent management beyond binary opt-in/out
- ✅ Document the lawful basis for each data processing purpose using Data Use Purpose objects
- ✅ Regularly audit consent field values — stale or missing consent data is a compliance risk
- ✅ Test consent exclusions before launch — validate that opted-out customers are excluded from test activations

**Speaker Notes:** These best practices are directly testable as "what should the consultant do?" questions. The first one — always include consent exclusions in email segments — is the most important and most tested. The streaming consent ingestion recommendation comes up in latency scenarios. The Data Use Purpose audit recommendation supports GDPR documentation requirements. The most practical exam pattern is a scenario where a client says "our unsubscribe rate is high but customers keep receiving emails" — the answer is to audit whether consent exclusions are properly applied in the segment AND whether consent data is current (not stale batch imports).

---

## Recording Script

Welcome to Section 3 and Lecture 08. In this lecture, we're covering one of the most important topics that bridges technology and compliance: consent management in Data Cloud.

Here's the core principle: Data Cloud has the power to aggregate data about millions of customers. With that power comes the responsibility to respect their preferences about how that data is used. Regulations like GDPR in Europe and CCPA in California give consumers specific rights — including the right to opt out of marketing, the right to restrict data sharing, and in some cases, the right to have their data deleted entirely.

Data Cloud supports these rights through specific fields on the Contact Point and Individual DMOs. The most important for marketing is **HasOptedOutOfEmail** on the Contact Point Email DMO. When this is true, the customer has unsubscribed from email marketing. Every email-based segment and activation should include an exclusion filter for this field.

For broader GDPR rights: the **DoNotProcess** flag on Individual signals that this customer should not be processed at all — relevant for right-to-erasure requests. **HasOptedOutOfSharing** maps to CCPA's right to opt out of data sharing with third parties.

Consent Categories go a step further — allowing customers to give granular consent for specific purposes like analytics, personalization, or marketing. This is what powers modern preference centers where customers choose what they agree to.

Consent data needs to stay current. If a customer unsubscribes at 3 PM but your consent batch import doesn't run until 2 AM, there's a compliance window. The solution is streaming consent ingestion via the Ingestion API — push consent changes to Data Cloud in near-real-time.

The Consent API allows external systems to programmatically read and write consent preferences. Authentication uses OAuth 2.0 via a Connected App — same as the Ingestion API.

Remember: Data Cloud provides tools for compliance. Compliance itself is the organization's responsibility. In Lecture 09, we look at the broader data governance picture — data spaces, permissions, and access control. See you there.

---

## Exam Tips

- **HasOptedOutOfEmail** lives on the **Contact Point Email DMO** — always include it as an exclusion filter in email activation segments
- **DoNotProcess** on Individual is the GDPR right-to-erasure flag; **HasOptedOutOfSharing** on Individual is the CCPA opt-out flag
- Consent changes should be ingested via **streaming Ingestion API** to minimize the compliance lag window
- **Consent Categories** enable granular per-purpose consent management beyond a simple binary opt-in/out
- Data Cloud provides consent management tools, but **compliance is the organization's responsibility** — Data Cloud alone doesn't guarantee GDPR compliance

---

## Lecture Summary

Data Cloud's consent management capabilities support regulatory compliance with GDPR and CCPA by providing specific fields for consent status on Contact Point and Individual DMOs. The most critical field is HasOptedOutOfEmail on Contact Point Email, which must be used as an exclusion filter in all email-based segments. Individual-level privacy fields include DoNotProcess (GDPR right to erasure) and HasOptedOutOfSharing (CCPA data sharing opt-out). Consent Categories enable granular per-purpose consent management. Consent signals should be ingested via streaming Ingestion API to minimize the window between a customer's opt-out action and its effect on activations. The Consent API allows programmatic management of consent preferences from external systems.

---

## Mini Quiz

**Question 1:** A customer unsubscribed from email marketing through a company's preference center. Three days later, the customer receives a marketing email. After investigation, the consultant confirms the HasOptedOutOfEmail field on the customer's Contact Point Email record is set to true in Data Cloud. What is the most likely cause of the issue?

A) The HasOptedOutOfEmail field on Individual DMO is not set to true  
B) The email segment used for the campaign does not include an exclusion filter for HasOptedOutOfEmail = true  
C) The Ingestion API is not streaming consent updates in real time  
D) The Consent API is not connected to Marketing Cloud  

**Answer: B**
The consent flag IS set correctly in Data Cloud. The issue is that the segment being used for the campaign doesn't include an exclusion filter for HasOptedOutOfEmail = true. Even if the consent data is accurate, it has no effect unless segment criteria actively exclude opted-out individuals.

---

**Question 2:** Under GDPR, a customer requests erasure of all their personal data. Which Data Cloud field should the consultant update to honor this request?

A) HasOptedOutOfEmail on Contact Point Email  
B) HasOptedOutOfSharing on Individual  
C) DoNotProcess on Individual  
D) HasOptedOutOfGeoTracking on Individual  

**Answer: C**
DoNotProcess on the Individual DMO is the GDPR-aligned field for right-to-erasure / right-to-be-forgotten requests. Setting this to true flags that the individual's data should not be processed. Note that simply setting the flag is not sufficient for full erasure — the actual data must also be deleted, but the flag is the first step in Data Cloud.

---

**Question 3:** A client wants to give customers granular control over their data — specifically the ability to consent to analytics tracking separately from marketing communications. Which Data Cloud feature supports this?

A) Separate HasOptedOut fields for each data use case on the Individual DMO  
B) Consent Categories configured in Data Cloud Setup  
C) Separate Contact Point records for each use case  
D) Data Use Purpose objects linked to Contact Point records  

**Answer: B**
Consent Categories in Data Cloud enable granular, per-purpose consent management. You can define categories like "Analytics," "Marketing," and "Personalization" and track consent for each independently. This is the feature designed for preference center implementations that offer customers fine-grained control.
