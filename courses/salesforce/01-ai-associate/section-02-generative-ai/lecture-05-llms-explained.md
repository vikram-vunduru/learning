# Lecture 5: Large Language Models Explained
**Section:** Section 02 — Generative AI
**Duration:** 15 minutes
**Exam Weight:** Generative AI concepts ~17% of exam; LLM fundamentals appear in multiple question types

---

## Learning Objectives
By the end of this lecture, students will be able to:
1. Define what a Large Language Model (LLM) is in plain English, without needing a math or computer science background
2. Explain at a conceptual level how LLMs are trained (tokenization, embeddings, transformers)
3. Define "tokens" and explain why they matter both technically and practically (pricing)
4. Explain what a context window is and why it constrains what an LLM can "remember"
5. Identify major LLMs (GPT-4o, Claude, Gemini, Llama) and explain how Salesforce uses them in its AI products

---

## SLIDES

### Slide 1: The Engine Under the Hood
**Visual:**
```
╔══════════════════════════════════════════════════════════╗
║        LECTURE 5: LARGE LANGUAGE MODELS EXPLAINED       ║
║                                                          ║
║   "The engine behind generative AI"                      ║
║   Section 2: Generative AI                               ║
╚══════════════════════════════════════════════════════════╝
```
**Content:**
- Everything in Generative AI runs on an LLM
- LLM = Large Language Model
- Understanding LLMs = understanding how all Salesforce GenAI actually works
- You don't need to be an engineer — you need to understand the concepts
**Speaker Notes:** Last lecture we talked about what Generative AI does. Now we're going to open the hood and understand what's actually powering it. All of Salesforce's generative features — Einstein Copilot, Prompt Builder, Agentforce — are powered by Large Language Models. You don't need to be a machine learning engineer to understand this. We're going to keep it conceptual and practical.

---

### Slide 2: What Is a Large Language Model?
**Visual:** Three words highlighted: LARGE (billions of parameters), LANGUAGE (trained on text), MODEL (a mathematical representation of patterns)
**Content:**
- **Large:** trained on billions (or trillions) of words; hundreds of billions of parameters
- **Language:** primarily trained on text — books, websites, code, conversations
- **Model:** a mathematical system that has "learned" statistical patterns in language
- Result: a system that can predict and generate human-like text
**Speaker Notes:** Let's break down the name. "Large" — these models are trained on enormous amounts of data. We're talking billions of web pages, books, articles, code repositories, scientific papers. The model itself has hundreds of billions of parameters — these are the internal numbers the model adjusts during training to capture patterns. "Language" — these models specialize in human language. They've absorbed massive amounts of text and learned its structure. "Model" — it's ultimately a mathematical system, a very complex function that takes some text as input and produces text as output.

---

### Slide 3: The Brilliant Friend Analogy
**Visual:** A person talking to a knowledgeable friend who seems to know everything about everything
**Content:**
- Imagine a friend who has read every book, every website, every Wikipedia article ever written
- You can ask them anything and they'll give you a thoughtful, articulate answer
- They don't "look it up" — they absorbed it all and can synthesize it on demand
- That's essentially what an LLM is
- Important caveat: they sometimes "remember" things wrong (hallucinations — more on that later)
**Speaker Notes:** Here's the analogy I find most helpful. Imagine you have a friend who, during their lifetime, read every book in every library, every website on the internet, every scientific paper, every news article, every novel. And they have perfect recall and can articulate ideas brilliantly. You ask them anything — "Write me a poem about rain in the style of Shakespeare" or "Explain quantum physics like I'm 10 years old" — and they can do it, because they've absorbed so much language and knowledge. That's what an LLM is. Not a lookup engine. Not a database. A system that has internalized patterns of human language so deeply that it can generate new, coherent, contextually appropriate text on demand.

---

### Slide 4: How LLMs Are Trained — Step 1: Tokenization
**Visual:**
```
   TOKENIZATION — Breaking text into tokens

   Raw text: "Salesforce Einstein scores leads"
                │
                ▼
   Token split:  ["Sales", "force", " Ein", "stein", " scores", " leads"]
                │
                ▼
   Token IDs:   [1842, 943, 17124, 267, 8901, 3204]
                │
                ▼
   Embeddings:  Each token → high-dimensional vector
                [0.24, -0.15, 0.87, 0.03, ...] (768+ numbers each)

   ● LLMs don't read words — they process token ID sequences
   ● Average English word ≈ 1.3 tokens
   ● "ChatGPT" is 3 tokens: "Chat" + "G" + "PT"
   ● Token limits define context window size
```
**Content:**
- Before training, text must be broken into chunks called **tokens**
- Tokens are NOT exactly words — they're word fragments, words, or punctuation
- "Salesforce" might be split into "Sales" + "force"
- "AI" might be a single token
- Tokenization makes text processable by a mathematical model
**Speaker Notes:** Here's the thing about computers — they can't read words the way you and I do. Everything has to become numbers. So the first step is tokenization. Tokenization means splitting text into small units called tokens. A token is roughly 4 characters or about three-quarters of a word in English. "Hello" is one token. "Salesforce" might be two tokens — "Sales" and "force." A full paragraph might be 80-100 tokens. The model then converts each token into a number, which can be processed mathematically.

---

### Slide 5: How LLMs Are Trained — Step 2: Embeddings
**Visual:**
```
   WORD EMBEDDING SPACE (conceptual — actual is 768+ dimensions)

                 "joyful"●
                          ╲
              "happy" ●────╲──── "elated" ●
                      │     ╲
                      │      "content" ●
                      │
   "invoice" ●        │                     "purchase" ●
              ╲       │                         /
               ╲      │                        /
        "bill" ●╲─────┼──────────────── "buy" ●
                      │
              ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

   Key insight: Similar meanings → close vectors in space
   ● "happy" and "joyful" are close together
   ● "happy" and "invoice" are far apart
   ● Enables semantic search (meaning-based, not keyword-based)
```
**Content:**
- Each token is converted to an **embedding** — a list of numbers (a vector)
- Embeddings capture *meaning*, not just spelling
- "King" and "Queen" have similar embeddings (both are royalty)
- "King" and "Banana" have very different embeddings
- This is how LLMs understand context, synonyms, and related concepts
**Speaker Notes:** After tokenization, each token gets converted into an embedding — a long list of numbers that represents its meaning in mathematical space. The genius of embeddings is that words with similar meanings end up with similar numbers. "Happy" and "joyful" cluster together. "Car" and "automobile" cluster together. "King" minus "Man" plus "Woman" is mathematically very close to "Queen." This isn't magic — it emerges from training on billions of sentences. The model learns that certain words appear in similar contexts, so they must be semantically related. Embeddings are how LLMs actually understand language at a meaningful level.

---

### Slide 6: How LLMs Are Trained — Step 3: The Transformer
**Visual:**
```
   TRANSFORMER SELF-ATTENTION MECHANISM

   Input tokens: "The  customer  loves  the  product"
                   │       │       │      │       │
                   ▼       ▼       ▼      ▼       ▼
               [Query] [Query] [Query] [Query] [Query]   ← each token
               [Key  ] [Key  ] [Key  ] [Key  ] [Key  ]     asks: "which
               [Value] [Value] [Value] [Value] [Value]      others matter
                   │                               │        to me?"
                   └───────── attention weights ───┘
                                     │
                                     ▼
                          Context-aware representations
                          (each token now knows about
                           all other tokens in the sequence)

   "loves" attends to "customer" AND "product" simultaneously
   This parallel context is the transformer's superpower
```
**Content:**
- The **Transformer** architecture is the core innovation behind modern LLMs
- Key mechanism: **Attention** — the model learns which words to "pay attention to" relative to each other
- "The bank by the river" vs. "The bank charged a fee" — "bank" means different things
- Attention helps the model understand context
- Training goal: predict the next token, billions of times, adjusting until accurate
**Speaker Notes:** Here's the key architectural innovation: the Transformer. I know that sounds intimidating, but the core idea is actually elegant. The Transformer uses a mechanism called "attention" — which means the model learns, for each word in a sentence, which other words it should pay attention to in order to understand the current word's meaning. Take the word "bank." In "I sat by the bank of the river," the model should pay attention to "river" to understand "bank" means riverbank. In "The bank charged me a fee," it should pay attention to "charged" and "fee" to understand "bank" means a financial institution. Attention handles this beautifully. During training, the model sees billions of sentences, and its job is simple: predict the next word. Every time it gets it wrong, it adjusts its parameters slightly. After enough examples, it gets very, very good at predicting what comes next — which is exactly what generating text requires.

---

### Slide 7: What Are Tokens? (Why You Should Care)
**Visual:** A pricing table showing cost per 1,000 tokens for different LLMs, alongside a visual showing "1 page of text ≈ 750 tokens"
**Content:**
- Tokens are the fundamental unit of LLM input and output
- **Practical rule of thumb:** 1 token ≈ ¾ of a word; 1 page of text ≈ 750 tokens
- **Why it matters:** LLM pricing is based on tokens consumed (input + output)
- Long prompts = more tokens = higher cost
- Salesforce abstracts token costs, but architects need to be token-aware
**Speaker Notes:** Tokens aren't just a technical curiosity — they have direct business implications. Every time you use an LLM, whether through Salesforce or the raw API, you're consuming tokens. Tokens are how LLM usage is measured and priced. If you're building enterprise AI features in Salesforce, you need to think about token efficiency. A Prompt Builder template that pulls in 2,000 words of account history before asking a question will cost more to run than one that pulls in 200 targeted words. As a Salesforce architect or admin, you may not write checks directly to OpenAI, but your design choices affect token consumption and therefore cost.

---

### Slide 8: Context Window — The LLM's Working Memory
**Visual:**
```
   LLM CONTEXT WINDOW — What the model "sees" at one time

   ┌─────────────────────────────────────────────────────────┐
   │                    CONTEXT WINDOW                       │
   │              (model's working memory)                   │
   │                                                         │
   │  ┌─────────────────────────────────────────────────┐    │
   │  │  System prompt: "You are a helpful Salesforce   │    │
   │  │  assistant..."                                  │    │
   │  │                                                 │    │
   │  │  Conversation history: [prior turns]            │    │
   │  │                                                 │    │
   │  │  RAG context: [retrieved knowledge articles]   │    │
   │  │                                                 │    │
   │  │  User message: "Summarize this case..."         │    │
   │  └─────────────────────────────────────────────────┘    │
   │                                                         │
   │  Everything outside the window = model cannot see it   │
   │  Window size: GPT-4 ~128K tokens, Claude ~200K tokens   │
   └─────────────────────────────────────────────────────────┘
```
**Content:**
- **Context window:** the maximum amount of text an LLM can "see" at one time
- Measured in tokens (e.g., 8K, 32K, 128K, 1M tokens)
- Everything outside the context window is invisible to the model
- Includes: your prompt + conversation history + any retrieved documents + the response
- Larger context window = can handle longer conversations + more complex tasks
**Speaker Notes:** Here's one of the most important and most misunderstood concepts about LLMs: the context window. Think of it as the LLM's working memory. At any given moment, the model can only "see" a limited amount of text — everything within its context window. Outside that window? It's blind. The context window includes everything: your current prompt, the entire conversation history so far, any documents you've provided for context, AND the response it's generating. Modern LLMs have dramatically expanded context windows — GPT-4o supports 128,000 tokens (roughly a 400-page book), and some models support even more. But it's still a hard limit. For Salesforce developers, this matters when you're designing Prompt Builder templates that pull in account history or knowledge articles — you need to make sure you're not exceeding the model's context window.

---

### Slide 9: Why Context Window Matters for Salesforce
**Visual:** A Salesforce org with arrows showing data flowing into the LLM context window — account data, case history, product info, conversation thread
**Content:**
- When Salesforce calls an LLM, it assembles a context package:
  - System instructions ("You are a helpful Salesforce assistant…")
  - Retrieved CRM data (account info, cases, contacts)
  - The user's actual question
  - Conversation history
- All of this must fit within the context window
- This is why Prompt Builder templates need to be designed thoughtfully
**Speaker Notes:** When Einstein Copilot answers your question about an account, Salesforce is assembling a very carefully crafted package of text to send to the LLM. It includes system instructions that tell the model how to behave, relevant CRM data pulled from your org, and your actual question. All of that gets sent to the LLM within a single context window. A well-designed Salesforce AI implementation thinks carefully about what to include and what to leave out, because you only have so much room.

---

### Slide 10: The LLM Landscape — Major Players
**Visual:**
```
   LLM LANDSCAPE (as of 2024)

   ┌─────────────────┬──────────────────────────────────────────────┐
   │  PROVIDER       │  MODELS / NOTES                              │
   ├─────────────────┼──────────────────────────────────────────────┤
   │ OpenAI          │ GPT-4, GPT-4o, o1 — powers many apps         │
   │ Anthropic       │ Claude 3.5 Sonnet/Opus — strong reasoning     │
   │ Google          │ Gemini 1.5 Pro — multimodal, long context     │
   │ Meta            │ Llama 3 — open-source, self-hostable          │
   │ Mistral         │ Mistral Large — European, open-weight         │
   │ Salesforce      │ xGen — foundation model for Einstein features │
   ├─────────────────┼──────────────────────────────────────────────┤
   │ SALESFORCE USE  │ Connects to partner LLMs via Einstein Trust   │
   │                 │ Layer — model-agnostic architecture           │
   └─────────────────┴──────────────────────────────────────────────┘

   ● Salesforce is NOT locked into one LLM
   ● Model choice abstracted behind the Trust Layer
   ● Key: data never retained by LLM providers (Zero Data Retention)
```
**Content:**
- **GPT-4o** (OpenAI): one of the most widely used; powers many commercial AI products
- **Claude** (Anthropic): known for safety, nuance, and handling long contexts; strong at reasoning
- **Gemini** (Google): Google's flagship LLM; strong multimodal capabilities (text + images)
- **Llama** (Meta): open-source LLM; can be run on private infrastructure
- Salesforce supports multiple LLMs through its **Model Garden** in Einstein 1 Studio
**Speaker Notes:** You don't need to be an LLM expert, but you should know the main players. GPT-4o from OpenAI is one of the most widely deployed LLMs in commercial products. Claude from Anthropic is known for its safety-focused design and particularly strong handling of long, complex documents — it's often used for tasks requiring nuance and careful reasoning. Gemini from Google is deeply integrated with Google's ecosystem and has strong multimodal capabilities. And Llama from Meta is fascinating because it's open-source — companies can download it and run it on their own servers, which is huge for data privacy in regulated industries. For the exam, you don't need to compare these in depth — just know they exist and that Salesforce can work with multiple LLMs.

---

### Slide 11: How Salesforce Uses LLMs — The Model Garden
**Visual:** Einstein 1 Studio interface showing the Model Garden with different LLM provider options
**Content:**
- Salesforce doesn't just use one LLM — it supports a **Model Garden**
- Admins can connect different LLMs to different use cases
- Built-in options: Einstein (Salesforce's own LLM), OpenAI via Azure, Anthropic Claude, others
- The same Prompt Builder template can be pointed at different models
- Einstein Trust Layer sits between Salesforce and any external LLM (data security)
**Speaker Notes:** One of the most important things to understand about Salesforce's AI strategy is that they're not betting on one horse. Through the Model Garden in Einstein 1 Studio, Salesforce supports multiple LLMs. You can use Salesforce's own Einstein LLMs, or you can connect to GPT-4o through Azure, or Anthropic's Claude. Different models have different strengths, and Salesforce wants its customers to have flexibility. Critically, whatever LLM you use, all traffic flows through the Einstein Trust Layer — Salesforce's security layer that ensures your CRM data never gets used to train external models. We'll cover the Trust Layer in depth in Section 3.

---

### Slide 12: LLM Limitations You Must Know
**Visual:**
```
   LLM LIMITATIONS — Key Risks

   ┌─────────────────────────────────────────────────────────┐
   │  ⚠ HALLUCINATION                                        │
   │  Model generates plausible-sounding but false content   │
   │  Cause: training to predict likely tokens, not truth    │
   │  Mitigation: RAG, grounding, human review               │
   ├─────────────────────────────────────────────────────────┤
   │  ⚠ KNOWLEDGE CUTOFF                                     │
   │  Training data has a cutoff date → no recent events     │
   │  Mitigation: RAG with live data, retrieval augmentation │
   ├─────────────────────────────────────────────────────────┤
   │  ⚠ CONTEXT WINDOW LIMIT                                 │
   │  Only processes tokens within its window                │
   │  Long documents must be chunked or summarized           │
   ├─────────────────────────────────────────────────────────┤
   │  ⚠ BIAS FROM TRAINING DATA                              │
   │  Inherits biases present in internet-scale text corpus  │
   │  Mitigation: RLHF, safety fine-tuning, Einstein filters │
   ├─────────────────────────────────────────────────────────┤
   │  ⚠ NO PERSISTENT MEMORY                                 │
   │  Each conversation starts fresh (unless explicitly stored│
   │  Agentforce manages memory through context management   │
   └─────────────────────────────────────────────────────────┘
```
**Content:**
- **Hallucination:** LLMs can confidently generate false information
- **Knowledge cutoff:** LLMs only know about events up to their training date
- **Bias:** LLMs reflect biases present in their training data
- **No real-time data:** without RAG or tool use, LLMs can't access live information
- These limitations shape how Salesforce designs its AI features
**Speaker Notes:** Here's where we get real. LLMs are impressive, but they have real limitations you need to know for the exam and for your career. First: hallucination. This is when an LLM confidently makes something up. It doesn't say "I don't know" — it generates a plausible-sounding answer that may be completely wrong. This is a fundamental property of how LLMs work: they're trained to generate probable next tokens, not to verify facts. Second: knowledge cutoff. An LLM's training data has a cutoff date. GPT-4o's knowledge might end in early 2024. If you ask about something that happened after that, it either doesn't know or will hallucinate. Third: bias. LLMs absorb the biases in their training data — racial, gender, cultural biases can emerge in outputs. These limitations are why the Einstein Trust Layer, grounding, and human review are so important in enterprise AI.

---

### Slide 13: Lecture Recap
**Visual:** LLM concept map connecting all the terms covered
**Content:**
- LLM = Large Language Model; trained on massive text data to generate human-like text
- Training process: tokenize → embed → train transformer via next-token prediction
- Token = basic unit of text; ~¾ word; basis for LLM pricing
- Context window = LLM's working memory; limits what it can see at once
- Major LLMs: GPT-4o, Claude, Gemini, Llama; Salesforce Model Garden supports all
**Speaker Notes:** Great work getting through this one — LLMs are the most technical topic in this entire course, and you just nailed the conceptual foundation. In the next lecture, we're going to put this knowledge to work by learning how to actually talk to an LLM: Prompt Engineering. How you phrase your instructions to an LLM dramatically changes the quality of what you get back. Let's go.

---

## RECORDING SCRIPT

Alright, welcome to what I think is one of the most fascinating lectures in this entire course. We're going to talk about Large Language Models — what they are, how they work, and why they matter for Salesforce. And I promise, we're keeping this jargon-free and practical.

**The engine under everything**

Here's the thing: every time you use Einstein Copilot, every time Prompt Builder generates a case summary, every time Agentforce takes an action — there's a Large Language Model running underneath it all. LLMs are the core technology powering the entire Generative AI revolution. So understanding what they are, even at a high level, is going to make everything else in this course click.

Let me start with the name. L-L-M. Large. Language. Model.

"Large" means these things are enormous. Not just in terms of the data they were trained on — we're talking billions of web pages, millions of books, enormous repositories of code — but also in terms of their internal complexity. A modern LLM might have hundreds of billions of parameters: internal numerical values that were adjusted during training to capture patterns in language. "Large" is almost an understatement.

"Language" means these models specialize in text. Human language, in all its messiness and nuance — sarcasm, metaphor, technical jargon, casual slang — LLMs have seen and absorbed enormous amounts of it.

"Model" means it's a mathematical system. Not a database you can look things up in. Not a search engine. A model — a mathematical function that takes text as input and produces text as output.

**The Brilliant Friend**

Here's the analogy I always come back to. Imagine you have a friend who, over the course of their lifetime, read absolutely everything. Every book in every library. Every Wikipedia article. Every news article ever published. Every scientific paper. Every novel. Every forum post. And they can recall and synthesize all of it, articulate it clearly, and apply it to whatever question you ask.

You ask them, "Write me a business proposal for a new SaaS product aimed at mid-market companies." They've never written that specific proposal before. But they've read thousands of business proposals, understood the structure, absorbed the patterns — and they can produce something thoughtful and coherent on demand. That's an LLM. It doesn't look up a stored answer. It generates a new one based on deeply internalized patterns of language.

Now — important caveat — this brilliant friend sometimes confidently states things that are wrong. We call that hallucination. We'll get to that. But first, let's understand how they got so smart.

**How LLMs Are Trained — The Conceptual Version**

Step one: Tokenization. Computers can't read words. Everything has to become numbers. So the first step in processing text is breaking it into chunks called tokens. A token is roughly three-quarters of a word in English. "Hello" is one token. "Salesforce" might be two tokens. "Artificial intelligence" might be three tokens. The tokenizer chops up every sentence into these fragments, and each fragment gets converted to a number. That's the entry point.

Step two: Embeddings. Here's where it gets cool. Each token gets mapped to an embedding — a list of numbers that represents its meaning. Not its spelling. Its meaning. The way this works is that words appearing in similar contexts end up with similar embeddings. "Happy" and "joyful" end up with similar numbers because they appear in similar sentences. "King" and "Queen" are close together mathematically because they share so many contexts. "King" minus the embedding for "Man" plus the embedding for "Woman" actually gets you mathematically close to "Queen." This isn't programmed in — it emerges from training. Embeddings are how LLMs understand semantic relationships between concepts.

Step three: The Transformer. The Transformer architecture is the core innovation. Its key mechanism is called "Attention," and the idea is elegant: for every word in a sentence, the model learns which other words in that sentence it should pay attention to in order to understand the current word. Take "bank." In "the bank of the river," the model should attend to "river." In "the bank charged a fee," the model should attend to "charged" and "fee." Attention handles this context-sensitivity brilliantly.

Training itself is conceptually simple: show the model billions of sentences, one token at a time, and its job is to predict the next token. Every time it gets it wrong, it adjusts its internal parameters slightly to do better next time. Repeat this process enough times on enough data, and the model becomes extraordinarily good at predicting and generating coherent, contextually appropriate text.

**Tokens and Why They Matter Beyond Theory**

EXAM TIP: Tokens matter not just as a technical concept but as a unit of cost and constraint. LLM providers charge per token. When Salesforce calls OpenAI or Anthropic, it pays per thousand tokens of input and output. This is why Prompt Builder templates should be designed efficiently — you want to include enough context for the model to do a great job, but not so much that you're burning tokens on irrelevant information.

A practical rule of thumb: 1 token is roughly ¾ of a word in English. 750 tokens is approximately one page of text. A typical Einstein Copilot interaction might involve 500-2,000 tokens total. An enterprise Agentforce workflow that pulls in detailed account history and long instructions could consume 5,000-10,000 tokens per run. At scale, token efficiency is a real operational concern.

**Context Window — The LLM's Working Memory**

Now let's talk about context windows, because this is genuinely critical for designing Salesforce AI features. The context window is the maximum amount of text an LLM can see at one time. Think of it as working memory. Whatever falls outside the context window is invisible to the model.

Here's what gets packed into that context window during a Salesforce AI interaction: system instructions telling the LLM how to behave ("You are a helpful Salesforce assistant. Always be professional and accurate."), retrieved CRM data pulled from your org (account info, related cases, contact details), the user's actual prompt or question, any conversation history from earlier in the session, and the response the model is in the process of generating.

All of that has to fit within the context window. Older models had small context windows — 4,000 or 8,000 tokens, limiting them to short conversations. Modern models have dramatically expanded: GPT-4o supports 128,000 tokens; Anthropic Claude 3.5 supports 200,000 tokens. That's enough to process several hundred pages of text. Still a constraint, but much more practical for enterprise use cases.

Why does this matter for Salesforce? When you build a Prompt Builder template that pulls in account data, you need to be intentional about how much data you pull. If you're trying to summarize an account, pulling in 50 cases when only the last 5 are relevant wastes tokens and risks hitting the context limit. Good AI design is partly about being efficient with the context window.

**The LLM Landscape**

Now let me give you a quick tour of the major LLMs you'll encounter. You don't need to be an expert on each, but you should recognize the names.

GPT-4o is OpenAI's flagship model. "o" stands for "omni" — it handles text, images, and audio. It's one of the most widely deployed LLMs in commercial products worldwide, and many Salesforce customers use it through the Azure OpenAI integration.

Claude is from Anthropic. It's known for its safety-focused training approach, its strong performance on nuanced writing and reasoning tasks, and its very large context window (up to 200,000 tokens in Claude 3.5). Many enterprise customers prefer it for legal, compliance, or document-heavy workflows.

Gemini is Google's flagship LLM. It has deep integration with Google's workspace ecosystem and strong multimodal capabilities — it can understand images and text together, which opens up interesting use cases.

Llama is Meta's open-source LLM. "Open-source" is the critical thing here. Companies can download Llama and run it entirely on their own infrastructure, on their own servers. This is huge for regulated industries — healthcare, financial services, government — where sending data to an external API raises compliance issues. Running Llama internally means your data never leaves your premises.

Salesforce doesn't lock you into one of these. Through the Model Garden in Einstein 1 Studio, you can connect multiple LLMs to your Salesforce org and point different use cases at different models. A customer service Prompt Builder template might use one model optimized for empathy and clarity; a data analysis template might use a different model optimized for structured reasoning. Flexibility is the design philosophy.

**LLM Limitations — Know These Cold**

EXAM TIP: The exam will ask about AI limitations. Know these three:

Hallucination: LLMs generate the most statistically probable next token — they don't verify facts. This means they can confidently write something that sounds entirely plausible but is factually wrong. An LLM asked "What cases does Account X have open?" might generate plausible-sounding case numbers that don't actually exist in your system. This is why grounding — connecting the LLM to real, current data — is so critical in Salesforce AI design.

Knowledge cutoff: LLMs are trained on data up to a specific date. Events after that date are unknown to the model (or it may hallucinate about them). For Salesforce use cases involving current product pricing, recent policy changes, or live account status, you need to ground the LLM with real-time data retrieved from your org — not just rely on what the model "knows."

Bias: LLMs absorb the biases present in their training data. Training data scraped from the internet reflects the biases of the internet. This can manifest as stereotyped language, unequal treatment of different demographic groups, or skewed recommendations. Responsible AI design includes bias awareness and testing, which we'll cover in the ethics section.

**Let's Lock This In**

An LLM is a mathematical model trained on billions of words of text, capable of generating coherent and contextually appropriate new text. Training involves tokenizing text into fragments, converting those fragments into semantic embeddings, and training a Transformer architecture via next-token prediction on enormous datasets.

Tokens are the basic unit of LLM input/output — roughly ¾ of a word — and they are the basis for LLM pricing and for the context window constraint.

The context window is the LLM's working memory: the total amount of text it can process at once, including your prompt, conversation history, retrieved data, and its response.

The major LLMs you should know: GPT-4o (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta, open-source). Salesforce supports all of them through its Model Garden.

In the next lecture, we're going to learn how to actually use an LLM well. Because knowing what an LLM is and knowing how to get great results from one are two very different skills. Welcome to Prompt Engineering.

---

## EXAM TIPS
- Know that tokenization, embeddings, and transformer architecture are the three key steps in how LLMs process and generate text — you may see these as vocabulary questions
- The context window is measured in tokens, not words or characters — "128K context window" means 128,000 tokens maximum input + output combined
- Hallucination is the most commonly tested LLM limitation — know the definition: the model generates confident but factually incorrect content
- Know the four major LLMs: GPT-4o (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta/open-source) — the exam may ask you to identify which is open-source
- The Einstein Trust Layer is Salesforce's mechanism for using external LLMs without exposing customer data — connecting it to the concept of LLMs (not just a security feature in isolation) helps answer multi-concept questions
- "Grounding" is how Salesforce addresses the knowledge cutoff and hallucination problem — it anchors the LLM to real, current CRM data rather than relying solely on training data
- Tokens are also the unit of pricing for LLM APIs — questions about cost optimization may reference token efficiency

---

## LECTURE SUMMARY
- A Large Language Model (LLM) is a mathematical system trained on massive amounts of text data to generate human-like text responses
- Training involves three conceptual steps: tokenization (breaking text into numeric fragments), embeddings (converting tokens to meaning-vectors), and Transformer training via next-token prediction
- Tokens are the basic unit of LLM text processing (~¾ word each); they determine both pricing and context window limits
- The context window is the LLM's working memory — the total text it can see at once, including prompts, conversation history, and retrieved data
- Major LLMs include GPT-4o, Claude, Gemini, and open-source Llama; Salesforce's Model Garden supports multiple LLMs in a single org
- Key LLM limitations: hallucination (generates false content confidently), knowledge cutoff (no awareness of events after training), and bias (reflects training data biases)

---

## MINI QUIZ (3 questions with answers)

**Q1:** A Salesforce architect is designing a Prompt Builder template that pulls in the full 5-year case history for each account before generating a summary. They notice performance is slow and costs are higher than expected. What is the most likely cause?

**A:** Excessive token consumption — the template is including far more text than necessary, consuming a large portion of the context window and increasing per-call token cost.

**Explanation:** Token efficiency is a real design consideration. Including 5 years of case history likely generates thousands of tokens of input, most of which is irrelevant to a current summary. A better design would retrieve only recent or high-priority cases. This question tests understanding of tokens as both a cost and a context window concern.

---

**Q2:** An Einstein Copilot user asks the AI assistant about a policy change that happened two weeks ago. The assistant confidently describes the old policy as if it were current. What LLM limitation is this an example of?

A) Context window overflow  
B) Hallucination  
C) Knowledge cutoff  
D) Token limit exceeded

**A:** C — Knowledge cutoff

**Explanation:** The LLM was trained on data up to a certain date and has no awareness of events after that cutoff. It's not making things up (hallucination) — it's accurately recalling what was true at training time but is now outdated. The solution is grounding: connecting the LLM to a real-time knowledge source with the current policy.

---

**Q3:** Which of the following BEST describes what a "context window" is in the context of a Large Language Model?

**A:** The maximum total amount of text (measured in tokens) that an LLM can process at one time, including the prompt, conversation history, retrieved data, and the response being generated.

**Explanation:** The context window is the LLM's working memory — everything it can see at once. It is measured in tokens (not words). It includes all text going into and coming out of the model in a single interaction. This is a frequently tested definition on the Salesforce AI Associate exam.
