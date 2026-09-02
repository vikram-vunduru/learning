# Monitoring & Analytics for Voice Agents

## Exam Domain
Use Cases & Business Value / Operations — Agentforce Specialist (CRT-271)

## Core Concepts

### The Monitoring Stack for Service Cloud Voice

| Monitoring Layer | Tool / Feature |
|---|---|
| Real-time call monitoring (agent status, queue depth, live call listen/barge/whisper) | Supervisor Console (Omni-Channel widget) |
| Post-call transcript + summary + intent classification | VoiceCall record + ConversationEntry |
| Voice agent performance metrics (containment, escalation, out-of-scope, topic hit rate) | Einstein Conversation Insights (ECI) |
| Historical call analytics (call volume, AHT, resolution, CSAT correlation) | CRM Analytics (Tableau CRM) + standard reports |
| Retrospective call pattern mining (trend identification, topic gap analysis) | Einstein Conversation Mining (ECM) |

**Key point:** Real-time = Supervisor Console + ECI alerts. Post-call = VoiceCall records + ECI insights + CRM Analytics reports. Retrospective trend analysis = Einstein Conversation Mining.

### Primary KPIs for Voice Agent Operations

```
VOICE AGENT KPI FRAMEWORK

Containment Rate (PRIMARY ROI METRIC)
  ────────────────────────────────
  = Calls resolved by AI agent / Total calls handled by AI agent × 100
  Target: 30–60% for typical self-service use cases
  Low containment → agent Topics too narrow or STT quality poor
  High containment → right use case + well-designed Topics

Escalation Rate
  = Calls escalated to human / Total calls handled × 100
  Inverse of containment; track reason codes (customer request,
  max turns, out-of-scope, error)

Average Handle Time (AHT)
  = Total call time / Number of calls handled
  For autonomous agent: should be significantly lower than human AHT
  Increase in AHT → agent asking for clarifications repeatedly (topic issue)

Out-of-Scope Rate
  = Calls where agent said "I'm not set up for that" / Total calls
  High out-of-scope → missing Topics (coverage gap)
  Track which utterances triggered out-of-scope → Topic backlog

First Contact Resolution (FCR)
  = Calls where issue resolved without callback / Total calls
  Harder to measure for voice; requires follow-up callback tracking

CSAT (Customer Satisfaction)
  Post-call survey score (if configured)
  Correlate with call outcomes (containment, escalation, AHT)
```

**Limitations:**
- Containment rate is self-reported by the system — "contained" means the call ended without escalating, not necessarily that the issue was resolved
- CSAT correlation requires a post-call survey mechanism (separate configuration); not included in base SCV

### Einstein Conversation Insights (ECI) — Key Metrics

**ECI Metrics Dashboard — Trend Metrics (week-over-week):**

| Metric | Value | Trend |
|---|---|---|
| Containment Rate | 62% | +4% vs. last week |
| Avg Handle Time | 2:14 | -0:12 vs. last week |
| Out-of-Scope Rate | 12% | -3% vs. last week |

**Top Out-of-Scope Utterances (this week):**
1. "I need to upgrade my plan" — 238 occurrences
2. "When is my renewal date?" — 119 occurrences
3. "Transfer my account to a new email" — 87 occurrences

**Action:** Create Topics for the top out-of-scope utterances.

**This is the continuous improvement loop.** Monitor out-of-scope utterances weekly. Each one is a new Topic or action to add. Most voice agents improve containment rate by 10–20% in the first 90 days post-launch through this monitoring process.

**Limitations:**
- ECI is retroactive — it shows what happened, not what is currently happening in real-time
- ECI dashboards require ECI license; not included in base Service Cloud Voice
- Keyword alerting is separate from containment analytics — both are part of ECI but configured independently

### Einstein Conversation Mining — When to Use

```
Einstein Conversation Mining (ECM) ≠ Einstein Conversation Insights (ECI)

ECI: per-call metrics + keyword alerts + agent performance (OPERATIONAL)
    Use during: post-go-live monitoring, weekly KPI review

ECM: unsupervised ML on call transcript corpus (STRATEGIC / RETROSPECTIVE)
    Use during: pre-build discovery (what Topics to build?)
                quarterly review (what new patterns have emerged?)
    NOT real-time — processes batches of historical transcripts

**ECM Output example — cluster distribution by call volume:**
- Cluster 1: Billing disputes — 28% of call volume
- Cluster 2: Account changes — 21% of call volume
- Cluster 3: Tech support — 19% of call volume
- Cluster 4: [Unclassified] — 12% of call volume
- Cluster 5: Plan information — 11% of call volume

Build Topics in priority order of call volume.
```

**Limitations:**
- Einstein Conversation Mining requires existing call transcript data — cannot be used before calls have been recorded
- ECM uses unsupervised clustering — clusters need human interpretation (business analyst must label each cluster)
- ECM is not available in all editions — check license requirements

### VoiceCall Reports — Standard Object Reporting

```
STANDARD REPORTS (via Salesforce Reports tab)

VoiceCall with ConversationEntry:
  Filters: Date range + Status = Completed
  Columns: Duration, Direction, Channel, AI Disposition,
           Contact (matched), Escalated (Y/N), Out-of-Scope (Y/N)

Out-of-Scope Utterances Report:
  Source: ConversationEntry where Disposition = Out-of-Scope
  Used for: Topic backlog (what to build next)

Containment by Topic:
  Group by: Topic Name
  Measure: % resolved without escalation
  Used for: identify which Topics have poor containment

Low Confidence Transcript Analysis:
  Source: ConversationEntry where Confidence < 0.75
  Used for: STT quality assessment, Custom Vocabulary gaps
```

**Limitations:**
- Standard reports rely on VoiceCall and ConversationEntry field population — if some fields are not populated (misconfiguration), reports show empty data
- Custom reports require CRM Analytics (Tableau CRM) for complex multi-metric analysis
- Report data is not real-time — it reflects committed data, which may lag by minutes for voice call records

### Call Quality Metrics — MOS Score

MOS (Mean Opinion Score) — audio quality assessment. Scale: 1.0 (unusable) to 5.0 (excellent). Target for voice agent: MOS ≥ 3.5 (acceptable); ≥ 4.0 preferred.

| MOS Range | Caller Experience | Impact on STT |
|---|---|---|
| 4.5 – 5.0 | Excellent | Minimal transcription errors |
| 3.5 – 4.4 | Good | Occasional errors, manageable |
| 2.5 – 3.4 | Fair / Acceptable | Noticeable errors, re-prompts |
| 1.5 – 2.4 | Poor | High WER, frequent failures |
| 1.0 – 1.4 | Unusable | STT cannot produce reliable output |

MOS is typically measured at the telephony provider layer, not in Salesforce. Amazon Connect provides MOS data in Contact Trace Records (CTR).

**Limitations:**
- Salesforce does not natively surface MOS scores — access via Amazon Connect Contact Trace Records (CTR) or a CTI integration that writes MOS to VoiceCall
- MOS varies per call based on network conditions, device, and environment — monitor as a distribution, not a single value
- Low MOS is a network/device issue, not a Salesforce configuration issue — fix at source (network routing, device upgrade)

### Monitoring Dashboard Design

```
RECOMMENDED MONITORING VIEWS

Daily Operations Dashboard:
  - Real-time: calls in queue, agent availability, queue wait time
  - Today: containment rate, escalation rate, avg handle time
  - Alerts: calls above 5-min queue wait, error-status VoiceCalls

Weekly Management Dashboard:
  - This week vs. last week: containment, AHT, out-of-scope rate
  - Top 10 out-of-scope utterances (Topic backlog input)
  - Confidence score distribution (STT quality trend)
  - Escalation reason code breakdown

Monthly Executive Dashboard:
  - Containment rate trend (month-over-month improvement)
  - Cost per call (autonomous vs. human agent)
  - Estimated FTE savings from automation
  - CSAT scores (if post-call survey configured)
```

**Limitations:**
- Real-time dashboards use Salesforce Streaming API or Live Agent data — they have polling latency, not instantaneous display
- Building the recommended dashboards requires CRM Analytics (Tableau CRM) — standard Reports & Dashboards are sufficient for basic views but limited for complex multi-metric analysis
- "Estimated FTE savings" requires baseline measurement before deployment — always capture pre-deployment metrics for ROI reporting

## PTA / SA Relevance

**Monitoring and analytics are where voice AI projects demonstrate business value post-launch.** As a PTA or SA, you need to help customers define success metrics BEFORE go-live so you can demonstrate ROI after. Without pre-defined baselines and targets, the project cannot show business value.

**The continuous improvement loop is the ongoing value driver:**
1. Monitor out-of-scope utterances weekly
2. Prioritize new Topics by call volume
3. Build and deploy new Topics
4. Measure containment rate improvement
5. Report improvement to business stakeholders
6. Repeat

**Common partner mistakes:**
- Delivering the project and not configuring ongoing monitoring — leaving the customer without visibility into agent performance
- Not establishing baseline metrics before go-live — impossible to prove ROI retroactively
- Using ECI for real-time monitoring (it's not real-time) — use Supervisor Console for real-time

**Enterprise monitoring considerations:**
- For large contact centers, ECI dashboards should integrate with existing WFM and BI tools — data export to Tableau or Power BI is common
- Escalation reason code tracking requires adding a mandatory field to the VoiceCall record for agents to capture reason at wrap-up time
- MOS monitoring should be included in the telephony partner's SLA — not an after-thought

**For a customer executive review:** "In the first 90 days post-launch, we improved containment rate from 38% to 52% by adding 6 new Topics based on the top out-of-scope utterances. At your call volume of 50K calls/month, that's 7,000 additional calls handled by the AI agent — saving approximately $56K/month in human handling cost."

## Customer Advisory Tips

**Define success metrics before go-live and get stakeholder alignment on targets.** Common metrics and typical targets:
- Containment rate: 30–50% Year 1, 50–70% Year 2 (as Topics mature)
- AHT reduction for AI-handled calls vs. human-handled: 40–60% is typical
- CSAT for AI-handled calls: within 5 points of human-handled CSAT

**Einstein Conversation Mining for initial Topic discovery:** If the customer has existing call recordings or chat transcripts, run ECM before building Topics. This prevents building the wrong Topics and dramatically reduces post-launch out-of-scope rates.

**Post-launch success review cadence:** Monthly for the first 6 months, quarterly thereafter. Each review should include: containment rate trend, top out-of-scope utterances, STT quality metrics, and ROI calculation. If containment is not improving, check STT quality and out-of-scope analysis first.

## Key Facts to Memorize
- Containment rate = primary ROI metric for voice AI; target 30–60%
- ECI = per-call metrics + keyword alerts + post-call coaching (operational monitoring)
- ECM = Einstein Conversation Mining = retrospective ML on corpus of transcripts (strategic, NOT real-time)
- Out-of-scope utterances = Topics to build next; monitor weekly via ECI
- MOS score = audio quality metric; measured at telephony layer (Amazon Connect CTR), not Salesforce
- VoiceCall + ConversationEntry = basis of all post-call reporting
- Continuous improvement loop: monitor out-of-scope → build Topics → measure containment improvement

## Exam Traps
- "Einstein Conversation Mining provides real-time call analytics" → False — ECM is retrospective batch analysis on historical transcripts
- "ECI and ECM are the same feature" → False — ECI is operational monitoring; ECM is strategic retrospective mining
- "Containment rate of 95% means the voice agent is performing excellently" → Not necessarily — if it means callers can't reach a human when needed, that's a UX problem; balance containment with CSAT
- "MOS scores are available in Salesforce VoiceCall records by default" → False — MOS is a telephony-layer metric from Amazon Connect CTR; must be written to Salesforce via integration if needed
- "Out-of-scope calls represent failures" → Not exactly — out-of-scope means a caller asked for something the agent wasn't built for; it's a gap, not a bug. Treat it as the Topic backlog.

## Practice Questions

**Q:** A voice agent went live 30 days ago. The business team wants to understand which call types the AI agent couldn't handle so they can prioritize the next set of Topics to build. Which feature provides this data?
**A:** Einstein Conversation Insights (ECI) — specifically the out-of-scope utterance report. ECI aggregates calls where the agent responded "I'm not set up for that" and shows the actual utterances that triggered out-of-scope responses, ranked by frequency. These become the input for the Topic backlog.

**Q:** A contact center has 3 years of call recordings from a legacy IVR. Before building an Agentforce Voice agent, the architect wants to understand the distribution of call types and common caller language. What Salesforce feature is best suited for this analysis?
**A:** Einstein Conversation Mining (ECM). ECM processes batches of historical call transcripts using unsupervised ML to cluster calls by topic and identify common phrases. The output shows call type distribution by volume, which drives Topic prioritization for the voice agent build.

**Q:** A voice agent's containment rate has been flat at 38% for 8 weeks post-launch with no improvement. What should be investigated first?
**A:** Review the top out-of-scope utterances from ECI. If callers are frequently asking about topics not covered by current Topics, build those Topics first. If out-of-scope rate is low and containment is still flat, investigate STT accuracy (WER) — callers may be failing in the speech recognition layer before reaching Topics.
