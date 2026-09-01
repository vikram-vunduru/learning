# Practice Exam: Salesforce Data Cloud Consultant (CRT-251)

**Instructions:** 60 questions. Allow 105 minutes. Passing score: 67% (40/60). Answers and explanations at the end.

---

## Section 1: Data Cloud Fundamentals (~8 questions)

**Q1.** A company is evaluating Salesforce Data Cloud. Which statement accurately describes Data Cloud's primary purpose?

A) It replaces the Salesforce CRM for customer record management  
B) It creates a Unified Customer Profile by ingesting and resolving data from multiple sources  
C) It provides a dedicated data warehouse for business intelligence reporting  
D) It is a Marketing Cloud add-on for email personalization  

---

**Q2.** What is the correct sequence of data processing in Data Cloud from ingestion to activation?

A) DMO → DLO → Identity Resolution → Segment → Activation  
B) Data Stream → DLO → Field Mapping → DMO → Identity Resolution → Unified Individual → Segment → Activation  
C) Data Stream → DMO → DLO → Unified Individual → Segment  
D) Ingestion API → Unified Individual → DLO → Segment → Activation  

---

**Q3.** A consultant needs to explain the difference between a Data Lake Object and a Data Model Object. Which statement is accurate?

A) DLOs are structured and used for segmentation; DMOs are raw staging objects  
B) DLOs store raw, untransformed source data; DMOs provide a standardized schema for processing  
C) DLOs and DMOs are the same object with different names depending on the context  
D) DLOs are created by administrators; DMOs are automatically created by the Salesforce Connector  

---

**Q4.** Which two statements about the Unified Individual in Data Cloud are correct? (Select 2)

A) The Unified Individual is manually created by configuring field mappings  
B) The Unified Individual is the output of the Identity Resolution process  
C) The Unified Individual is the basis for segmentation and activation  
D) The Unified Individual DMO must be deleted and recreated each time Identity Resolution runs  
E) The Unified Individual is identical to the Contact record in Salesforce CRM  

---

**Q5.** A consultant is setting up Data Cloud for the first time. Which permission set grants full access to configure Data Streams, Identity Resolution, and Activation Targets?

A) Data Cloud Data Aware Specialist  
B) System Administrator  
C) Data Cloud Admin  
D) Data Cloud Marketing Specialist  

---

**Q6.** A Data Cloud implementation uses data from Salesforce CRM, an e-commerce platform, and a loyalty program. After Identity Resolution, the Unified Individual count is significantly lower than the combined Individual DMO record count from all three sources. What does this indicate?

A) An error occurred in Identity Resolution  
B) Many customers appear in multiple sources and have been correctly merged into single Unified Individuals  
C) Not all Individual records were processed by the Identity Resolution ruleset  
D) The field mappings are incorrect  

---

**Q7.** Which two objects are NOT directly accessible in Data Cloud's Segment Builder? (Select 2)

A) Unified Individual  
B) Data Lake Objects (DLOs)  
C) Custom Data Model Objects  
D) Ingestion API endpoint schemas  
E) Calculated Insights  

---

**Q8.** A company's marketing team wants to use Data Cloud but needs to ensure their data is not visible to the finance analytics team using the same Data Cloud instance. Which feature provides this data isolation?

A) Salesforce Sharing Rules  
B) Data Spaces  
C) Separate Data Streams  
D) Profile-based Field Level Security  

---

## Section 2: Data Ingestion (~10 questions)

**Q9.** A retail company has nightly transaction exports delivered as Parquet files to a Google Cloud Storage bucket. Which connector should the consultant configure?

A) Salesforce Connector with full refresh  
B) Ingestion API in Bulk mode  
C) Google Cloud Storage Cloud Connector with batch refresh  
D) MuleSoft Connector with scheduled integration  

---

**Q10.** A web application needs to send customer clickstream events to Data Cloud within seconds of the event occurring. Which connector type and mode is most appropriate?

A) Salesforce Connector with 1-hour refresh  
B) Ingestion API in streaming mode  
C) Amazon S3 Cloud Storage Connector  
D) Marketing Cloud Connector  

---

**Q11.** A developer is implementing the Data Cloud Ingestion API for a server-to-server integration. Which authentication approach is correct?

A) Include the username and password in the request header  
B) Use an API key passed as a query parameter  
C) Create a Connected App and use OAuth 2.0 Client Credentials to obtain a Bearer token  
D) Use a named credential stored in Salesforce Setup  

---

**Q12.** A Salesforce CRM Data Stream is configured with an incremental refresh schedule. What does incremental refresh mean?

A) Only records created in the last 24 hours are ever ingested  
B) After the first full load, only records that have changed since the last run are ingested  
C) Records are deleted from Data Cloud when deleted from CRM  
D) The refresh runs once and then must be manually triggered each time  

---

**Q13.** A company uses MuleSoft as its enterprise integration platform. Their legacy ERP system needs to send data to Data Cloud. Which approach is most appropriate?

A) Create a direct JDBC connection from the ERP to Data Cloud  
B) Use the MuleSoft Connector to route ERP data into Data Cloud  
C) Export ERP data to S3 and use the Cloud Storage Connector  
D) Create a custom Apex integration from Salesforce to the ERP  

---

**Q14.** Which of the following file formats is NOT supported by Data Cloud's Cloud Storage connectors?

A) CSV  
B) JSON  
C) Parquet  
D) Microsoft Excel (.xlsx)  

---

**Q15.** A consultant sets up a Data Stream from the Marketing Cloud Connector. Which two capabilities does this connector support? (Select 2)

A) Ingesting MC subscriber and engagement data into Data Cloud  
B) Activating Data Cloud segments back to Marketing Cloud journeys  
C) Real-time streaming of MC email open events  
D) Replacing the need for the Ingestion API for web event data  
E) Synchronizing CRM Account records to Marketing Cloud  

---

**Q16.** An ingestion job shows a status of "Partially Succeeded" with 1,000 records processed and 50 records failed. What is the correct next action?

A) Delete and recreate the Data Stream to clear the error state  
B) Navigate to the Failed Records tab of that ingestion job to identify and resolve the error  
C) Wait for the next scheduled run — failed records are automatically retried  
D) Increase the connection timeout for the Data Stream  

---

**Q17.** What are the available batch refresh schedule intervals for Data Streams in Data Cloud?

A) 15 minutes, 30 minutes, 1 hour, 4 hours  
B) 1 hour, 6 hours, 12 hours, 24 hours  
C) 6 hours, 12 hours, 24 hours, 48 hours  
D) Any interval from 1 minute to 24 hours  

---

**Q18.** A consultant discovers that a Data Stream's ingestion job is consistently failing with "data type mismatch" errors. The source system recently changed the format of a date field from YYYY-MM-DD text to MM/DD/YYYY. What is the correct resolution?

A) Update the DLO schema to accept text in the date field  
B) Apply a formula transformation in the field mapping to convert the text format to the Date data type  
C) Create a new Data Stream that ignores the date field  
D) Contact Salesforce Support to update the DLO data type  

---

## Section 3: Data Modeling & Identity Resolution (~10 questions)

**Q19.** A consultant is mapping an e-commerce platform's DLO to Data Cloud DMOs. The DLO has a field "cust_email" that should drive Identity Resolution. To which DMO must this field be mapped?

A) Individual DMO — EmailAddress field  
B) Unified Individual DMO — Email field  
C) Contact Point Email DMO — EmailAddress field  
D) Custom Email DMO created by the consultant  

---

**Q20.** Which statement about the relationship between a Data Stream and a Data Lake Object is correct?

A) One DLO can support only one Data Stream  
B) A Data Stream is the raw storage container; a DLO is the pipeline configuration  
C) Each Data Stream creates and populates a corresponding DLO  
D) DLOs are manually created before a Data Stream can be configured  

---

**Q21.** A consultant maps a DLO field to the Individual DMO and another DLO field also to the same Individual DMO field. Is this supported?

A) No — one DMO field can only receive mappings from one DLO  
B) Yes — multiple DLOs can map to the same DMO, enabling data consolidation from multiple sources  
C) Yes — but only if both DLOs come from the same source system  
D) No — field conflicts would cause Identity Resolution errors  

---

**Q22.** In an Identity Resolution ruleset, what do reconciliation rules control?

A) Which Individual records should be matched together  
B) Which source system's field value appears on the Unified Individual when sources have conflicting values  
C) How frequently the Identity Resolution ruleset runs  
D) Which DMOs are included in the Identity Resolution process  

---

**Q23.** A consultant configures an Identity Resolution match rule using fuzzy match on the LastName field with a threshold of 95%. After running the ruleset, very few records are being merged. What should the consultant consider?

A) The threshold is too high — increase it to 100%  
B) The threshold may be too high — reducing it would find more potential matches (while accepting more false positives)  
C) Fuzzy match on LastName is not supported — use exact match instead  
D) The Contact Point Phone DMO must be populated before fuzzy matching can work  

---

**Q24.** After Identity Resolution runs, a consultant notices that two customers with different email addresses but identical names have been incorrectly merged. What is the most likely cause?

A) The Contact Point Email DMO has too many records  
B) A fuzzy name match rule has a threshold that is too permissive, creating false positives  
C) The Source Priority reconciliation rule is incorrectly configured  
D) The Individual DMO primary key field is not mapped  

---

**Q25.** A standard Individual DMO record and a Unified Individual DMO record exist for the same customer. What is the relationship between them?

A) They are the same object — Individual and Unified Individual are different names for the same DMO  
B) The Individual is a source record; the Unified Individual is the resolved, merged profile that may link multiple Individual records  
C) The Unified Individual replaces the Individual record after Identity Resolution runs  
D) Individual records are deleted after Identity Resolution creates Unified Individual records  

---

**Q26.** Which category of Data Model Object is specifically used as input for Identity Resolution matching?

A) Custom DMOs  
B) Data Lake Objects  
C) Standard DMOs (Individual and Contact Point DMOs)  
D) Calculated Insights  

---

**Q27.** A custom DMO called "VehicleOwnership" has been created and populated with data. Can this DMO be used as a segment criteria source?

A) No — only standard DMOs can be used in the Segment Builder  
B) Yes — custom DMOs can be used in segment criteria just like standard DMOs  
C) Yes — but only as an exclusion criteria, not an inclusion criteria  
D) No — custom DMOs require a separate license to use in segments  

---

**Q28.** A Data Cloud implementation ingests Individual records from two sources. Source A has 10,000 records; Source B has 8,000 records. After Identity Resolution, 14,000 Unified Individual records exist. What does this indicate?

A) Identity Resolution failed — it should have merged more records  
B) 4,000 customers appear in both Source A and Source B and were correctly merged  
C) There is a configuration error causing records to be duplicated  
D) The Individual DMO has a data quality issue  

---

## Section 4: Segmentation & Insights (~8 questions)

**Q29.** A marketing team wants to segment customers who have purchased a product in the "Electronics" category in the last 60 days. Product category is stored in a Sales Order Product DMO, which relates to Sales Order DMO, which relates to Individual. Which segment criteria type should be used?

A) Attribute Filter on Individual DMO  
B) Calculated Insight  
C) Direct relationship filter on Sales Order Product  
D) Indirect relationship filter traversing from Individual through Sales Order to Sales Order Product  

---

**Q30.** A consultant is building a segment for a re-engagement campaign targeting customers who haven't made a purchase in 60–90 days. Which feature is required to compute this metric?

A) A related attribute filter on Sales Order with a date range filter  
B) A Calculated Insight with MAX(OrderDate) to determine the last purchase date  
C) An attribute filter on the Individual DMO's LastPurchaseDate field  
D) An exclusion filter for customers with recent Sales Orders  

---

**Q31.** A segment has 8,000 members but the Activation Target in Marketing Cloud only receives 6,500 records. No errors are shown in the Activation Log. What is the most likely explanation?

A) Marketing Cloud has a 6,500-record limit per Data Extension  
B) 1,500 segment members do not have a valid email contact point or have HasOptedOutOfEmail = true  
C) The segment is in Draft status  
D) The CI refresh has not run since the last segment update  

---

**Q32.** In a Calculated Insight SQL query, which clause determines the dimension fields?

A) SELECT  
B) WHERE  
C) GROUP BY  
D) HAVING  

---

**Q33.** A consultant wants to create a Calculated Insight that shows the number of unique product categories each customer purchased in the last year. Which SQL function should be used?

A) SUM(ProductCategory)  
B) COUNT(ProductCategory)  
C) COUNT(DISTINCT ProductCategory)  
D) MAX(ProductCategory)  

---

**Q34.** A segment uses a Calculated Insight for filtering but the segment is not reflecting purchases made yesterday. The Data Stream ran successfully at 2 AM. What should the consultant check first?

A) Whether the segment criteria filters are correctly configured  
B) Whether the CI refresh is scheduled to run after the Data Stream completes  
C) Whether the Activation Target has published  
D) Whether Identity Resolution ran  

---

**Q35.** Which statement about segment membership is correct?

A) Segment membership is calculated in real time as data changes  
B) Segment membership is static after a segment is published  
C) Segment membership is recalculated on the segment's configured refresh schedule  
D) Segment membership only updates when an activation is manually triggered  

---

**Q36.** A consultant is designing a segment for an email campaign. Which exclusion criteria MUST be included to honor customer communication preferences?

A) Exclude customers with a Sales Order in the last 7 days  
B) Exclude customers where Contact Point Email HasOptedOutOfEmail = true  
C) Exclude customers where Individual DoNotProcess = true  
D) Exclude customers with no Calculated Insight records  

---

## Section 5: Activation & Engagement (~6 questions)

**Q37.** A company wants to activate a segment to Facebook Custom Audiences for ad targeting. How does Data Cloud transmit customer identity to Facebook?

A) Plain-text email addresses sent via HTTPS POST  
B) Salesforce Customer IDs linked to Facebook accounts  
C) SHA-256 hashed email addresses or phone numbers  
D) Salesforce Session IDs from authenticated web sessions  

---

**Q38.** A consultant configures a Marketing Cloud Activation Target and must ensure that activated customers are correctly matched to existing MC Subscriber records. Which configuration is critical?

A) Mapping the Unified Individual ID to the MC Campaign ID  
B) Configuring the Subscriber Key mapping to link Data Cloud's contact identifier to MC's Subscriber Key  
C) Setting the Activation Target publish schedule to match the MC send frequency  
D) Enabling the MC Connector's incremental refresh mode  

---

**Q39.** Which two activation target types are natively available in Data Cloud? (Select 2)

A) Salesforce CRM (Campaign Member)  
B) HubSpot  
C) Marketing Cloud  
D) Marketo  
E) Facebook Custom Audiences  

---

**Q40.** A segment is Published and the Activation Target is configured. However, no Campaign Members are being created in the connected CRM org. What should the consultant check first?

A) Whether the segment criteria are correctly configured  
B) Whether the Activation Target's publish schedule has run and check the Activation Log  
C) Whether the Unified Individual count exceeds the CRM record limit  
D) Whether the Data Stream refresh is complete  

---

**Q41.** What is the purpose of Activation Attributes in an Activation Target configuration?

A) To define which customers are included in the segment  
B) To include additional data fields (from DMOs or CIs) alongside segment membership in the activation payload  
C) To set the publish schedule for the Activation Target  
D) To configure the Subscriber Key mapping for Marketing Cloud  

---

**Q42.** A segment has 20,000 members. The company wants to activate this segment to Marketing Cloud for email, to a CRM Campaign for sales outreach, AND to Google Customer Match for display advertising. What is the minimum number of Activation Targets required?

A) 1 — one Activation Target can deliver to multiple destinations  
B) 2 — one for digital (MC + Google) and one for CRM  
C) 3 — one Activation Target per destination  
D) 6 — two per destination to support primary and fallback  

---

## Section 6: Administration & Governance (~8 questions)

**Q43.** A customer in the European Union has submitted a GDPR right-to-erasure (right to be forgotten) request. Which Data Cloud field should the consultant update as part of honoring this request?

A) HasOptedOutOfEmail on Contact Point Email  
B) HasOptedOutOfSharing on Individual  
C) DoNotProcess on Individual  
D) HasOptedOutOfGeoTracking on Individual  

---

**Q44.** An organization wants customers to be able to consent separately to marketing emails and to analytics-based personalization. Which Data Cloud feature enables this granular consent management?

A) Individual-level HasOptedOut fields for each channel  
B) Separate Contact Point records per use case  
C) Consent Categories configured in Data Cloud Setup  
D) Custom DMO with a ConsentType field  

---

**Q45.** A Data Cloud consultant is reviewing an implementation where consent preferences are batch-exported from the preference center every 24 hours and ingested via an S3 Data Stream. What compliance risk does this introduce?

A) No risk — 24-hour batch is an industry-standard consent sync frequency  
B) A customer who opts out could still receive marketing communications for up to 24 hours after opting out  
C) Consent data cannot be ingested via batch connectors — it must use the Consent API  
D) S3 connectors are not GDPR-compliant  

---

**Q46.** A marketing analyst should be able to build segments and Calculated Insights but should NOT be able to configure Data Streams or modify system settings. Which permission set should be assigned?

A) Data Cloud Admin  
B) Data Cloud Data Aware Specialist  
C) Data Cloud Marketing Specialist  
D) Salesforce System Administrator  

---

**Q47.** Which statement about Data Spaces in Data Cloud is correct?

A) Data Spaces provide physical data isolation in separate database instances  
B) Data Spaces are logical access boundaries that control which users can see which objects  
C) Data Spaces replace Salesforce Sharing Rules for all Data Cloud objects  
D) Data Spaces are only available in sandbox orgs  

---

**Q48.** An ingestion job is showing the status "Failed." What is the difference between "Failed" and "Partially Succeeded" statuses?

A) Failed means 0% of records were processed; Partially Succeeded means 50–99% were processed  
B) Failed means the job did not complete and no records were ingested; Partially Succeeded means some records were successfully ingested while others were rejected  
C) Failed and Partially Succeeded are synonymous — both indicate an error condition  
D) Failed means the connection to the source timed out; Partially Succeeded means the connection succeeded but the data format was wrong  

---

**Q49.** A consultant wants to ensure that records with email addresses not containing the "@" symbol are rejected before entering the Contact Point Email DMO. Which feature should be used?

A) A segment exclusion filter on email format  
B) A Data Quality Rule on the Contact Point Email DMO with a Reject action  
C) A formula transformation in the field mapping  
D) A validation rule on the source Salesforce Contact object  

---

**Q50.** A Data Cloud admin is configuring the Job Scheduler. The Data Stream refresh runs at 2 AM. A Calculated Insight uses data from this Data Stream. A segment uses the CI. At what time should each subsequent job be scheduled?

A) CI at 1 AM, Segment at 12 AM  
B) CI at 2 AM, Segment at 2 AM (all at the same time)  
C) CI at 4 AM (after Data Stream completes at ~3 AM), Segment at 6 AM  
D) Segments and CIs do not need to be scheduled — they run automatically  

---

## Section 7: Use Cases & Business Value (~10 questions)

**Q51.** A retail company wants to build a "Win-back" campaign targeting customers who were active (at least one purchase) between 6 and 12 months ago but have made no purchase in the last 6 months. Which combination of Data Cloud features enables this?

A) Two attribute filters on Individual DMO  
B) A Calculated Insight with LastOrderDate and a segment with date-range filters on the CI values  
C) A related attribute filter with two date conditions on Sales Order  
D) A custom DMO with WinbackEligible as a pre-computed field  

---

**Q52.** A financial services firm needs to ensure customers who have opted out of data sharing under CCPA cannot have their data activated to third-party advertising platforms. Which Data Cloud configuration achieves this?

A) Set DoNotProcess = true on the Individual and remove them from all segments  
B) Add an exclusion filter for HasOptedOutOfSharing = true to all segments that activate to advertising platforms  
C) Configure a Data Space that excludes CCPA opt-out customers from advertising activation targets  
D) Disable the Facebook and Google Activation Targets for all users  

---

**Q53.** A healthcare organization wants to identify patients who have not had a preventive cancer screening in the last 24 months. Before activating the segment for outreach, what is the MOST critical requirement?

A) The screening data must be stored in a standard Medical DMO  
B) The segment must include only patients who have explicitly consented to care coordination communications  
C) A Tableau dashboard must be created to review the patient list before activation  
D) A custom Identity Resolution ruleset must be created for healthcare data  

---

**Q54.** An e-commerce company's marketing team wants to suppress existing customers from seeing "new customer discount" ads on Facebook and Google. Which Data Cloud capability should the consultant recommend?

A) Create a segment of existing customers and activate it to Facebook and Google as a suppression audience  
B) Create a negative keyword list in Google Ads for existing customer names  
C) Use Marketing Cloud to trigger ad suppression via a Journey  
D) Exclude CRM contacts from the Facebook Ads account manually  

---

**Q55.** A Tableau analyst connects to Data Cloud to build a customer lifetime value dashboard. After connecting, they can see the Individual and Sales Order DMOs but cannot find the raw transaction events in the Web Engagement DLO. What is the reason?

A) The Tableau license doesn't include DLO access  
B) The Web Engagement DLO requires the Data Aware Specialist permission set  
C) DLOs are not exposed through the Data Cloud analytics interface — only DMOs and CIs are accessible  
D) The Web Engagement DLO must be published before it appears in Tableau  

---

**Q56.** A B2B company wants sales reps to see each account's total spend, number of transactions, and last purchase date directly in the Salesforce Account record page. Which combination of Data Cloud features enables this?

A) CRM Analytics dashboard embedded in the Account page, powered by Data Cloud CIs  
B) A standard Account report surfacing DLO data  
C) Calculated Insights published directly to the Account object via field updates  
D) A Marketing Cloud Email Report embedded in the Account record  

---

**Q57.** A company's Agentforce service agent needs to provide customers with personalized product recommendations based on their purchase history and loyalty status. Which Data Cloud data should be used as grounding for the agent?

A) Raw DLO records from the purchase transaction Data Stream  
B) Unified Individual profile and Calculated Insights for purchase metrics and loyalty tier  
C) Identity Resolution match group data  
D) Ingestion API schema definitions  

---

**Q58.** A consultant is designing a Data Cloud solution for a bank with retail banking, investment, and mortgage product lines managed in three separate Salesforce orgs. What approach enables a single Unified Customer Profile across all three?

A) Connect all three CRM orgs to Data Cloud using the Salesforce Connector (multi-org support) and run Identity Resolution across all ingested Individual records  
B) Create three separate Data Cloud instances, one per product line  
C) Migrate all three CRM orgs into a single Salesforce org before implementing Data Cloud  
D) Use MuleSoft to merge all CRM data before it reaches Data Cloud  

---

**Q59.** A company's marketing team wants to send personalized birthday emails to customers within 7 days of their birthday. Which segment criteria are required?

A) Attribute filter: BirthDate is in the next 7 days  
B) Calculated Insight: DaysToBirthday <= 7 with a segment filter on the CI measure  
C) Related attribute filter on the Contact Point Email BirthDate field  
D) An exclusion filter removing customers whose birthday is more than 7 days away  

---

**Q60.** Which statement best describes the business value of the Unified Customer Profile created by Data Cloud?

A) It reduces the number of Salesforce licenses required by consolidating customer records  
B) It provides every team (marketing, sales, service) with a single, complete view of the customer, enabling personalized and consistent experiences across channels  
C) It replaces the need for a data warehouse by storing all enterprise data in a single Salesforce object  
D) It automatically generates marketing campaigns based on customer purchase patterns  

---

## Answer Key

| Q | Answer | Q | Answer | Q | Answer |
|---|---|---|---|---|---|
| 1 | B | 21 | B | 41 | B |
| 2 | B | 22 | B | 42 | C |
| 3 | B | 23 | B | 43 | C |
| 4 | B, C | 24 | B | 44 | C |
| 5 | C | 25 | B | 45 | B |
| 6 | B | 26 | C | 46 | B |
| 7 | B, D | 27 | B | 47 | B |
| 8 | B | 28 | B | 48 | B |
| 9 | C | 29 | D | 49 | B |
| 10 | B | 30 | B | 50 | C |
| 11 | C | 31 | B | 51 | B |
| 12 | B | 32 | C | 52 | B |
| 13 | B | 33 | C | 53 | B |
| 14 | D | 34 | B | 54 | A |
| 15 | A, B | 35 | C | 55 | C |
| 16 | B | 36 | B | 56 | A |
| 17 | B | 37 | C | 57 | B |
| 18 | B | 38 | B | 58 | A |
| 19 | C | 39 | A, C | 59 | B |
| 20 | C | 40 | B | 60 | B |

---

## Explanations for Selected Questions

**Q4 (B, C):** The Unified Individual is the output of Identity Resolution (B) and is the basis for all downstream work including segmentation and activation (C). It is not manually created (A), not recreated/deleted each run (D), and is not the same as a CRM Contact (E).

**Q7 (B, D):** DLOs are raw staging data not accessible in the Segment Builder — only DMO-layer data is. Ingestion API endpoint schemas are not objects in Segment Builder. Unified Individual, Custom DMOs, and Calculated Insights ARE available in Segment Builder.

**Q15 (A, B):** The Marketing Cloud Connector ingests MC data (A) AND enables activation of segments to MC (B). It does not provide real-time streaming (C) — it's batch-oriented, does not replace the Ingestion API for web events (D), and does not sync CRM Accounts to MC (E).

**Q28:** 10,000 + 8,000 = 18,000 source records, but only 14,000 Unified Individuals means 4,000 records were merged (matched across sources). This is the expected, correct behavior — not an error.

**Q39 (A, C):** Native Activation Target types include Salesforce CRM, Marketing Cloud, Facebook Custom Audiences, Google Customer Match, and LinkedIn. HubSpot and Marketo are not native Data Cloud Activation Target types.

**Q59 (B):** Birthday "in the next 7 days" is a rolling date calculation that isn't directly available as a simple attribute filter. A Calculated Insight computing "DaysToBirthday" (days until next birthday anniversary) enables the segment filter. This is a common advanced segmentation scenario on the exam.

---

## Score Interpretation

| Score | Percentage | Result |
|---|---|---|
| 40+ correct | 67%+ | Pass |
| 35–39 correct | 58%–65% | Close — review weak domains |
| Under 35 | Below 58% | Revisit core sections |

**Identify your weak domains:** Count which domain questions you missed and prioritize review accordingly. Data Ingestion and Data Modeling have the highest weight — ensure mastery there first.
