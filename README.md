# NotebookLM RAG — AI-Powered Document Question Answering System

A lightweight clone of Google NotebookLM that allows users to upload PDF or text documents and ask questions grounded strictly in the uploaded content.

This project demonstrates a complete Retrieval-Augmented Generation (RAG) pipeline using modern AI tools including Next.js, LangChain, Google Gemini, and Qdrant.

---

# Project Overview

Traditional LLMs may hallucinate or provide inaccurate responses.  
This project solves that problem using Retrieval-Augmented Generation (RAG), where the system retrieves relevant information from uploaded documents before generating answers.

The application:
- Uploads and processes documents
- Splits content into semantic chunks
- Generates embeddings
- Stores embeddings in Qdrant Vector DB
- Retrieves relevant chunks for user queries
- Generates grounded responses using Gemini

---

# Features

- Upload PDF and `.txt` files
- AI-powered document Q&A
- Semantic search using vector embeddings
- Context-aware answers
- Fast retrieval with Qdrant
- Modern UI with Next.js
- End-to-end RAG implementation
- Scalable architecture

---

# System Architecture

```text
                ┌────────────────────┐
                │   User Uploads     │
                │   PDF / TXT File   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Document Loader  │
                │ PDFLoader / Text   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Text Chunking    │
                │ Recursive Splitter │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │  Generate Embeds   │
                │ Gemini Embeddings  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Store in Qdrant DB │
                │  Vector Database   │
                └─────────┬──────────┘
                          │
──────────────────────────────────────────────────────

                ┌────────────────────┐
                │   User Question    │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Query Embedding  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Retrieve Top-K     │
                │ Relevant Chunks    │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Gemini 2.5 Flash   │
                │ Generates Answer   │
                └────────────────────┘
```

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 |
| Language | TypeScript |
| LLM | Google Gemini 2.5 Flash |
| Embeddings | Gemini Embedding 001 |
| Vector Database | Qdrant Cloud |
| AI Framework | LangChain JS |
| Deployment | Vercel |

---

# Workflow

## 1. Document Upload
Users upload PDF or text files through the frontend interface.

## 2. Document Parsing
The system extracts text using:
- `PDFLoader` for PDFs
- Native parsing for `.txt` files

## 3. Text Chunking
Documents are divided into smaller overlapping chunks using:
- `RecursiveCharacterTextSplitter`

This improves retrieval quality and embedding accuracy.

## 4. Embedding Generation
Each chunk is converted into vector embeddings using:
- `gemini-embedding-001`

## 5. Vector Storage
Embeddings are stored inside Qdrant Cloud for semantic similarity search.

## 6. Question Answering
When a user asks a question:
1. Query embedding is generated
2. Relevant chunks are retrieved
3. Retrieved context is passed to Gemini
4. Gemini generates a grounded answer

---

# Folder Structure

```bash
project-root/
│
├── app/                  # Next.js App Router
├── components/           # UI Components
├── lib/                  # Utility Functions
├── services/             # Gemini + Qdrant Logic
├── uploads/              # Uploaded Documents
├── vectorstore/          # Vector DB Operations
├── types/                # TypeScript Types
├── public/
├── package.json
└── README.md
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/notebooklm-rag.git
cd notebooklm-rag
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create a `.env.local` file:

```env
GOOGLE_API_KEY=your_google_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

## Run the Development Server

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:3000
```

---

# Future Enhancements

- Multi-document querying
- Chat history and memory
- Citation references
- OCR support for scanned PDFs
- Streaming responses
- Authentication
- Hybrid search
- File summarisation
- Export chat conversations

---

# Learning Outcomes

This project helped in understanding:
- Retrieval-Augmented Generation (RAG)
- Vector databases
- Embeddings and semantic search
- LangChain orchestration
- Prompt engineering
- AI application architecture
- Full-stack AI development
- Cloud deployment workflows

---

# Conclusion

NotebookLM RAG showcases how Large Language Models can be enhanced with retrieval systems to create accurate, context-aware AI applications.

The project demonstrates a complete production-style RAG pipeline using modern AI tooling and scalable architecture principles.

---

## Example

<img width="1470" height="956" alt="example" src="https://github.com/user-attachments/assets/72ee362c-1d0e-4830-9f0f-e38e2bc3181e" />

