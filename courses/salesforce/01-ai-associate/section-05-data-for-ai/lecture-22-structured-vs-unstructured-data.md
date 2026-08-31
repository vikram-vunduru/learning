# Lecture 22: Structured vs. Unstructured Data
**Duration:** 12 minutes | **Exam Weight:** 17% (Data for AI)

---

## Learning Objectives

1. Define structured and unstructured data with clear examples
2. Explain why unstructured data is strategically valuable for AI
3. Describe how LLMs handle unstructured data differently from traditional ML models
4. Identify Salesforce's unstructured data capabilities (Einstein for documents, Data Cloud ingestion)
5. Explain vector embeddings in accessible terms — how text becomes numbers AI can process

---

## SLIDES

### Slide 1: Title Slide
**Visual:** Side-by-side visual — left: a clean spreadsheet/table. Right: a jumble of emails, chat transcripts, PDFs, audio waveforms, and images.
**Content:**
- Lecture 22: Structured vs. Unstructured Data
- "Most of your business knowledge is locked in unstructured data — AI is the key"
- Section 5: Data for AI

**Speaker Notes:** Welcome to Lecture 22. Today we're exploring one of the most important distinctions in enterprise AI: the difference between structured and unstructured data. This matters because traditional software — including traditional machine learning — was designed to work with structured data. Generative AI has opened the door to using ALL of your enterprise data, including the vast majority that was previously inaccessible to automated systems.

---

### Slide 2: What Is Structured Data?
**Visual:** Database table showing rows and columns — customer records with fields like Name, Email, Revenue, Industry, Lead Score.
**Content:**
**Structured Data:**
- Organized in rows and columns (tabular format)
- Each field has a defined type and meaning
- Queryable with SQL and standard tools
- Examples:
  - Salesforce CRM records (Accounts, Contacts, Opportunities)
  - Spreadsheet data
  - Database tables
  - Transaction logs
  - Survey rating scales (1-5)

**Advantages:** Easy to query, filter, aggregate, and use in traditional ML
**Limitation:** Only captures what was designed to be captured — misses nuance, context, sentiment

**Speaker Notes:** Structured data is the data that traditional enterprise software was built around. Every field in a Salesforce record is structured data — Contact.Email, Opportunity.Amount, Account.Industry. It's clean, organized, and queryable. Traditional machine learning works natively with structured data because algorithms can read numerical and categorical fields directly.

---

### Slide 3: What Is Unstructured Data?
**Visual:** Collage of unstructured data types — email screenshot, chat transcript, PDF document, audio waveform, image, video thumbnail, social media post.
**Content:**
**Unstructured Data:**
- Not organized in a predefined schema
- Cannot be directly queried with SQL
- Requires interpretation — meaning must be extracted
- Examples:
  - Emails and chat messages
  - Call recordings and voicemails
  - PDFs, Word documents, contracts
  - Images and videos
  - Social media posts
  - Product reviews and feedback
  - Support case text notes

**The big statistic:** 80-90% of enterprise data is unstructured

**Speaker Notes:** Unstructured data is everything that doesn't fit neatly into rows and columns. An email your customer sent complaining about a product defect is unstructured. A call recording where a customer explains their exact problem is unstructured. A PDF contract with detailed terms and conditions is unstructured. A product review saying "I loved the quality but the sizing runs small" is unstructured. For decades, this data sat largely unused by automated systems — too complex to process. AI is changing that.

---

### Slide 4: Semi-Structured Data (Bonus Concept)
**Visual:** JSON/XML code snippet next to a structured table, positioned between the structured and unstructured examples.
**Content:**
**Semi-Structured Data:**
- Has some organizational structure, but not fully relational
- Not stored in rows/columns, but has tags or markers
- Examples: JSON, XML, HTML, log files
- Can be parsed programmatically but is more flexible than relational data

**Salesforce context:**
- API responses are typically JSON (semi-structured)
- Einstein returns predictions as JSON objects
- Data Cloud ingests JSON event streams from web/mobile

**Speaker Notes:** There's a third category worth knowing: semi-structured data. JSON and XML are the primary examples. They have structure — keys and values, parent-child relationships — but they don't fit into a flat relational table. Salesforce APIs communicate in JSON. When Einstein returns a lead score, it comes back as a JSON object. Data Cloud ingests behavioral events from websites and mobile apps as JSON streams. You don't need to go deep on this for the exam, but you should recognize the term.

---

### Slide 5: Why Unstructured Data Is Valuable for AI
**Visual:** Iceberg diagram — structured data (10-20%) visible above water, unstructured data (80-90%) hidden below surface. AI unlocks the submerged portion.
**Content:**
**The strategic case for unstructured data in AI:**
1. **Volume:** 80-90% of enterprise data is unstructured — ignoring it means ignoring most of your information
2. **Richness:** Unstructured data contains context, nuance, and sentiment that structured data can't capture
3. **Unique signals:** Customer voice and intent often lives only in unstructured data (emails, calls, reviews)
4. **Competitive insight:** Analysis of competitor data, market trends, and customer sentiment requires unstructured processing
5. **AI training signal:** Case resolutions, support transcripts, and email exchanges are rich training data for customer service AI

**The transformation:** Generative AI turned unstructured data from a liability (expensive, hard to process) into a strategic asset.

**Speaker Notes:** Think about what lives in your support email inbox, your call recordings, your contract library, your customer reviews. The actual voice of the customer — their frustrations, their praise, their requests, their confusion — all of that is in unstructured data. Traditional BI tools couldn't access it. Traditional ML couldn't use it. Large language models can read it, understand it, summarize it, classify it, and extract insights from it. This is perhaps the single biggest capability shift that generative AI has enabled for enterprise data.

---

### Slide 6: How Traditional ML vs. LLMs Handle Unstructured Data
**Visual:** Two-track diagram showing the different processing paths.
**Content:**

**Traditional ML (tabular models):**
- Requires numerical or categorical inputs
- Text must be pre-processed: bag of words, TF-IDF, feature extraction
- Cannot natively read raw text, images, or audio
- Each model is purpose-built for a specific task
- Process: Raw text → Manual feature engineering → Numeric features → ML model

**Large Language Models (LLMs):**
- Trained directly on raw text (and multimodal variants on images, audio)
- Can read, understand, and reason over unstructured text natively
- No manual feature engineering for text required
- General-purpose: same model can summarize, classify, answer questions, translate
- Process: Raw text → Tokenization → Embedding → LLM → Output

**Key insight:** LLMs made unstructured data directly usable for AI at scale.

**Speaker Notes:** Traditional machine learning could work with text, but it required significant preprocessing. You had to convert text into numerical features — counting word frequencies, extracting specific keywords, using topic models. This was time-consuming, required ML expertise, and was limited in what it could capture. Large language models changed this fundamentally. They were trained directly on raw text and can process it natively. You can give an LLM a customer email and ask "What is the customer's main complaint and what is their emotional tone?" — and it understands. No feature engineering required.

---

### Slide 7: Salesforce's Unstructured Data Capabilities
**Visual:** Salesforce product logos: Einstein for Documents, Data Cloud, Einstein Copilot, Flow with AI.
**Content:**
**How Salesforce handles unstructured data:**

**Einstein AI for Documents/Files:**
- Extract structured data from PDFs, images, and documents
- Use cases: contract extraction, invoice processing, form parsing
- Returns structured fields from unstructured inputs (e.g., extract vendor name, amount, and date from a PDF invoice)

**Data Cloud — Unstructured Data Ingestion:**
- Ingest email data, call transcripts, and web content
- Connect to unstructured data sources via Data Streams
- Enables AI features to access unstructured interaction history

**Einstein Copilot / Agentforce:**
- Natively reads and processes case descriptions, email threads, chat transcripts
- Generates summaries, next steps, and responses from unstructured input

**Einstein Call Coaching:**
- Analyzes recorded sales calls (audio → transcript → AI analysis)
- Identifies talk/listen ratio, competitor mentions, customer sentiment

**Speaker Notes:** Salesforce has built multiple products around unstructured data processing. Einstein for Documents extracts structured fields from unstructured files — a huge use case for accounts payable, contract management, and insurance claims. Data Cloud can ingest email bodies, call transcripts, and web content as unstructured data sources, making that content available to AI features. Agentforce and Einstein Copilot work with case descriptions, email threads, and chat histories natively — reading them as unstructured text and generating contextual responses.

---

### Slide 8: Vector Embeddings — How Text Becomes Numbers
**Visual:** Text "I love this product" → colorful vector representation [0.23, -0.15, 0.87, 0.42, ...] → space where similar meanings cluster together.
**Content:**
**The fundamental challenge:**
- Computers process numbers, not words
- AI models cannot directly read text — text must be converted to numbers

**Vector embeddings:**
- A method of representing words, sentences, or documents as lists of numbers (vectors)
- Each number captures a dimension of meaning
- **Similar meanings → similar vectors** (close together in vector space)
- Example: "happy" and "joyful" have similar vectors; "happy" and "invoice" do not

**Analogy:** Like GPS coordinates — a specific location in meaning-space, not physical space

**Speaker Notes:** This is a genuinely fascinating concept and one that the exam occasionally tests at a conceptual level. When you type text into ChatGPT or ask Agentforce a question, your text must be converted into numbers before the AI can process it. The conversion method is called embedding — specifically, turning text into a high-dimensional vector, which is a list of hundreds or thousands of numbers. Each number in the list captures some aspect of the meaning. The brilliant part is that this encoding preserves semantic relationships — words and phrases with similar meanings get similar vectors.

---

### Slide 9: Why Vector Embeddings Matter — The Semantic Search Power
**Visual:** Customer question "My package hasn't arrived" → embedding → vector database search → matches "shipping delay" and "order tracking" knowledge base articles (even though those words weren't in the question).
**Content:**
**Traditional keyword search problem:**
- Searches for exact words or synonyms explicitly programmed
- "My package hasn't arrived" doesn't match "shipment delay" because the words differ

**Vector/semantic search:**
- Converts both the query AND the knowledge base to vectors
- Finds matches based on **meaning similarity**, not exact word matches
- "My package hasn't arrived" → similar vector to "delivery issue" → finds relevant results

**Salesforce applications:**
- Agentforce uses vector search over knowledge articles
- Einstein Search with AI uses semantic understanding
- Data Cloud stores vectors for similarity-based retrieval (RAG)

**Speaker Notes:** This is why AI-powered search is so much better than keyword search. When a customer types "my stuff never came," a keyword system can't match that to "shipment delivery failure." But a vector-based system converts both to vectors and recognizes they mean the same thing — and surfaces the right knowledge article. This is the technology underlying Agentforce's ability to find relevant knowledge and context even when the exact words don't match.

---

### Slide 10: Vector Databases — Storing Embeddings for AI
**Visual:** Traditional database (rows/columns) on left vs. vector database (cloud of points) on right. Arrow from vector database to AI model.
**Content:**
**Vector Database:**
- A specialized database designed to store and search vector embeddings
- Supports **nearest-neighbor search** — find vectors most similar to a query vector
- Essential infrastructure for RAG (Retrieval-Augmented Generation)

**How RAG works with vectors:**
1. Ingest documents → convert to vectors → store in vector database
2. User asks a question → convert question to vector
3. Search vector database for most similar document vectors
4. Return top matching documents as context
5. LLM generates answer using that context

**Salesforce:** Data Cloud includes vector database capabilities (Einstein Vector Store) for storing and retrieving embeddings used by Agentforce.

**Speaker Notes:** A vector database is the storage layer that makes semantic search and RAG possible at scale. Salesforce has built vector database capabilities directly into Data Cloud under the name Einstein Vector Store. This means you can store your knowledge articles, documents, email templates, and other content as vectors, and Agentforce can retrieve the most semantically relevant pieces of information for any given customer query or situation — all without exact keyword matching.

---

### Slide 11: Structured vs. Unstructured — When to Use Which
**Visual:** Decision matrix: Structured data for prediction models (Einstein scoring), Unstructured data for generative/LLM tasks (Agentforce responses, document processing).
**Content:**

| Use Case | Best Data Type | Salesforce Feature |
|----------|---------------|-------------------|
| Lead scoring | Structured (CRM fields) | Einstein Lead Scoring |
| Customer segmentation | Structured + behavioral | Data Cloud Segments |
| Service case summarization | Unstructured (case text) | Einstein Copilot / Agentforce |
| Contract review | Unstructured (PDF) | Einstein for Documents |
| Call sentiment analysis | Unstructured (audio/transcript) | Einstein Call Coaching |
| Personalized recommendations | Both | Agentforce + Data Cloud |
| Churn prediction | Structured + calculated | Einstein Analytics |

**Speaker Notes:** In practice, the most powerful AI applications combine both structured and unstructured data. Einstein Lead Scoring is predominantly structured — it uses CRM fields. But Agentforce doing service case resolution is predominantly unstructured — it reads case descriptions, email threads, and knowledge articles. The most sophisticated applications, like truly personalized Agentforce interactions, leverage both — structured profile data from Data Cloud combined with unstructured interaction history and knowledge content.

---

### Slide 12: Exam Key Concepts
**Visual:** Summary card.
**Content:**

| Concept | Key Point |
|---------|-----------|
| Structured data | Tabular, rows/columns, directly queryable — CRM fields |
| Unstructured data | No predefined schema — emails, PDFs, audio, images |
| Semi-structured data | Has structure but not relational — JSON, XML |
| 80-90% rule | Most enterprise data is unstructured |
| LLM advantage | Natively reads and processes unstructured text |
| Embedding | Converting text to a vector (list of numbers) that preserves meaning |
| Vector database | Specialized storage for embeddings, enables semantic search |
| RAG | Retrieve relevant context (from vector DB) before generating AI response |
| Einstein Vector Store | Data Cloud's built-in vector database capability |

---

## RECORDING SCRIPT

Welcome to Lecture 22. This is the final lecture in our Data for AI section, and we're going to close out with a concept that is genuinely exciting: the difference between structured and unstructured data, and why this distinction is transforming enterprise AI.

Let me start with a question. What percentage of your company's business knowledge do you think is captured in your CRM fields? Your Contact records, your Opportunity records, your Case records — the structured, organized data in those forms?

Most enterprise leaders, when they really think about this, say something like 10 or 20 percent. The rest is in emails, Slack messages, call recordings, meeting notes, contract documents, support transcripts, product reviews, social media mentions, PDFs in shared drives. That data has always existed. It's often the richest signal available about your customers, your products, and your business. But for decades, it was essentially inaccessible to automated systems.

Structured data is data organized in rows and columns, with a predefined schema. Every field in a Salesforce record is structured: Contact.Email, Opportunity.Amount, Account.Industry. You can query it with SQL. You can filter, sort, aggregate, and use it in traditional machine learning algorithms directly. Structured data is the foundation of traditional enterprise software.

Unstructured data has no predefined schema. An email is unstructured — it has text, but the text doesn't map to fixed columns. A call recording is unstructured — it contains audio that encodes words, emotion, pace, and emphasis. A PDF contract is unstructured — it has text and possibly images, but there's no schema that says "vendor name is in field X." According to various industry estimates, 80 to 90 percent of enterprise data is unstructured. For most of computing history, this vast majority of enterprise knowledge was essentially dark matter — it existed but couldn't be systematically used.

Traditional machine learning was designed for structured data. When ML practitioners wanted to work with text, they had to transform it — using techniques like bag of words, TF-IDF, or topic modeling — to convert text into numerical features that a traditional model could process. This worked, but it was labor-intensive, required specialized expertise, and could only capture a limited range of what text actually conveyed.

Large language models changed this. LLMs are trained directly on raw text — billions of documents, web pages, books, and conversations. They learned to understand language natively. You don't need to manually engineer features from text — you can provide raw text and the model understands it. Summarize this email. What is the customer's primary concern in this case description? Does this contract contain a non-compete clause? These are questions an LLM can answer directly from raw unstructured text.

Salesforce has built multiple capabilities around unstructured data. Einstein for Documents can extract structured information from unstructured files — give it a PDF invoice and it returns the vendor name, invoice number, amount, and due date as structured fields. This is transformational for processes like accounts payable, contract management, and regulatory compliance. Data Cloud can ingest email bodies, call transcripts, and web content as unstructured data streams, making that content available to AI features. Agentforce reads case descriptions, email threads, and chat histories natively to generate contextually relevant responses. Einstein Call Coaching converts call recordings to transcripts and runs AI analysis on them — identifying competitor mentions, customer sentiment, and talking points.

Now let me explain vector embeddings, because this concept is tested occasionally on the exam and it's important for understanding how AI actually processes text.

Computers process numbers, not words. AI models can't read "the customer is frustrated with the product" — they need numbers. The solution is embeddings. An embedding is the conversion of text into a vector — a list of numbers, typically hundreds or thousands of numbers long. Each number in the vector captures some dimension of the text's meaning.

Here's the brilliant part: similar meanings produce similar vectors. The sentence "I'm happy with my purchase" and "I'm delighted with my order" produce vectors that are close together in mathematical space, even though they use different words. The sentence "I need help with my invoice" and "I have a billing question" produce similar vectors. This property — semantic similarity preserved in vector space — is what enables AI-powered search to be so much better than keyword search.

Traditional keyword search matches exact words. If a customer types "my stuff never came" and your knowledge base has an article titled "Shipment Delivery Failures," a keyword system finds no match. A vector-based semantic search converts both the query and the knowledge article to vectors, measures the mathematical distance between them, and finds that they're semantically very similar — and surfaces the right article.

Salesforce uses vector databases — specifically, Data Cloud's Einstein Vector Store — to store embeddings of knowledge articles, documents, and content. When Agentforce is handling a customer interaction and needs to find relevant knowledge, it converts the customer's question to a vector and searches the vector database for the most semantically similar knowledge articles. This is the Retrieval-Augmented Generation pattern — retrieve context first, then generate a grounded response.

The practical takeaway is this: structured data powers your predictive AI features — Einstein scoring, forecasting, segmentation. Unstructured data powers your generative AI features — Agentforce responses, document processing, call analysis. The most powerful applications combine both, using Data Cloud as the unified layer that makes both available to AI simultaneously.

---

## EXAM TIPS

- **Know the 80-90% statistic** — most enterprise data is unstructured. This framing appears in exam questions about why unstructured data matters.
- **LLMs natively process unstructured text** — this is their key advantage over traditional ML for text-based tasks.
- **Vector embeddings = text to numbers** — conceptual understanding is enough; you don't need to know the math.
- **Semantic similarity** — the key property of embeddings: similar meaning = similar vector. This enables semantic search.
- **RAG = retrieve then generate** — Data Cloud (via Einstein Vector Store) is the retrieval layer for Agentforce.
- **Einstein Vector Store** — know this as Data Cloud's vector database capability. May appear in AI infrastructure questions.
- **Semi-structured data (JSON/XML)** — know it exists and that API responses are typically JSON. Less frequently tested.

---

## LECTURE SUMMARY

- **Structured data** is tabular (rows/columns) and directly queryable — Salesforce CRM fields are the primary example.
- **Unstructured data** has no predefined schema — emails, PDFs, call recordings, images — and represents 80-90% of enterprise data.
- **LLMs process unstructured text natively**, unlike traditional ML which required manual feature engineering.
- **Salesforce unstructured capabilities** include Einstein for Documents (PDF extraction), Data Cloud ingestion, Agentforce (case/email reading), and Einstein Call Coaching.
- **Vector embeddings** convert text to lists of numbers that preserve semantic meaning — similar meanings produce similar vectors.
- **Vector databases** (Salesforce: Einstein Vector Store in Data Cloud) enable semantic search and RAG — the foundation of Agentforce's ability to retrieve relevant context.

---

## MINI QUIZ

**Question 1:** An enterprise company wants to automatically extract vendor names, invoice amounts, and payment due dates from thousands of PDF invoices stored in Salesforce Files. Which type of data are these invoices?

- A) Structured data
- B) Semi-structured data
- C) Unstructured data
- D) Relational data

**Correct Answer: C**
**Explanation:** PDF files are unstructured data — they contain text and possibly images but do not conform to a predefined schema of rows and columns. Structured data (A) is tabular, like database records. Semi-structured data (B) has flexible but machine-readable structure like JSON or XML. "Relational data" (D) is a type of structured data stored in relational databases — not applicable here.

---

**Question 2:** What is the primary advantage of vector embeddings in the context of AI search?

- A) They compress files to reduce storage costs
- B) They enable exact keyword matching across large document sets
- C) They allow AI to find semantically similar content even without exact word matches
- D) They encrypt sensitive customer data before storage

**Correct Answer: C**
**Explanation:** Vector embeddings convert text to mathematical vectors that preserve semantic meaning — similar meanings produce similar vectors. This enables semantic search: finding relevant content based on meaning, not just exact keyword matches. This is the core reason Agentforce can surface relevant knowledge articles even when the customer's words don't exactly match the article's text. Compression (A), keyword matching (B), and encryption (D) are unrelated to embeddings.

---

**Question 3:** Which Salesforce Data Cloud feature serves as the vector database that enables Agentforce to perform semantic search over knowledge content?

- A) Identity Resolution
- B) Einstein Vector Store
- C) Calculated Insights
- D) Data Streams

**Correct Answer: B**
**Explanation:** Einstein Vector Store is Data Cloud's built-in vector database capability that stores embeddings of knowledge articles and other content, enabling Agentforce to perform semantic similarity search during the RAG (Retrieval-Augmented Generation) process. Identity Resolution (A) merges duplicate customer records. Calculated Insights (C) are custom computed metrics. Data Streams (D) are ingestion pipelines — they bring data in, but don't store or search vectors.
