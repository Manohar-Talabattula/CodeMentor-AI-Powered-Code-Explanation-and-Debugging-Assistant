# CodeMentor – AI-Powered Code Explanation and Debugging Assistant

CodeMentor is a full-stack Generative AI application designed to help developers understand, debug, test, and optimize their source code. It integrates Google's Gemini large language model with LangChain to provide intelligent coding assistance through a simple and interactive interface.

In addition to code assistance, CodeMentor implements a Retrieval-Augmented Generation (RAG) pipeline that enables users to upload PDF documents and ask questions about their contents. The system extracts document information, generates semantic embeddings, stores them in a vector database, and retrieves relevant information to generate context-aware answers.

The application combines Generative AI, prompt engineering, semantic search, vector databases, and full-stack development in a single platform.

---

## Table of Contents

1. Project Overview
2. Key Features
3. Technology Stack
4. System Architecture
5. Code Assistant Workflow
6. RAG-Based Document Question Answering
7. Project Structure
8. Backend API Endpoints
9. Installation and Setup
10. Environment Configuration
11. Running the Application
12. Core Concepts Implemented
13. Current Scope and Limitations
14. Future Enhancements
15. Author

---

## 1. Project Overview

Developers frequently encounter challenges when understanding unfamiliar code, identifying programming errors, writing test cases, and improving inefficient implementations.

CodeMentor addresses these challenges using Generative AI.

The application provides two primary modules:

**A. AI Code Assistant**

Provides four code-analysis capabilities:

- Explain Code
- Debug Code
- Generate Test Cases
- Optimize Code

**B. RAG-Based Document Assistant**

Allows users to upload PDF documents and interact with their content through natural-language questions. Instead of sending an entire document to the language model, the system retrieves relevant document chunks and uses them as context for generating answers.

---

## 2. Key Features

### 2.1 Explain Code

Helps developers understand source code through AI-generated explanations.

- Explains the overall purpose of the submitted code.
- Describes important statements and logic step by step.
- Explains programming concepts in simple language.
- Identifies potential issues when relevant.
- Provides time and space complexity analysis when applicable.

### 2.2 Debug Code

Assists developers in identifying and understanding potential programming errors.

- Identifies potential syntax errors.
- Analyzes logical errors.
- Identifies possible runtime issues.
- Explains the root cause of detected problems.
- Suggests corrected code.
- Describes the changes made to fix the issues.

### 2.3 Generate Test Cases

Generates test scenarios to help developers evaluate their implementations.

- Generates normal test cases.
- Generates boundary test cases.
- Identifies edge cases.
- Provides input values and expected outputs.
- Explains the purpose of each test case.
- Identifies potential failure scenarios.

### 2.4 Optimize Code

Analyzes source code and suggests improvements.

- Identifies inefficient operations.
- Suggests alternative approaches.
- Generates optimized implementations.
- Explains the improvements.
- Compares time complexity.
- Compares space complexity.
- Preserves the intended functionality of the original implementation.

### 2.5 PDF Document Question Answering

Provides document-based question answering through Retrieval-Augmented Generation.

- Supports PDF document uploads.
- Extracts text from PDF pages.
- Splits extracted text into manageable chunks.
- Generates semantic embeddings using Sentence Transformers.
- Stores document chunks and embeddings in ChromaDB.
- Retrieves relevant chunks using vector similarity search.
- Generates context-aware answers using Google Gemini.
- Provides source information, including document name and page references.

---

## 3. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React.js | User interface |
| Programming Language | JavaScript | Frontend development |
| Build Tool | Vite | Frontend development server and build |
| Styling | Tailwind CSS | Responsive interface styling |
| Code Editor | Monaco Editor | Source code editing |
| Backend | Python | Server-side development |
| API Framework | FastAPI | REST API development |
| LLM | Google Gemini API | AI-generated responses |
| LLM Framework | LangChain | Prompt templates and LLM integration |
| Embedding Model | all-MiniLM-L6-v2 | Semantic embedding generation |
| Embedding Library | Sentence Transformers | Text embedding generation |
| Vector Database | ChromaDB | Vector storage and retrieval |
| PDF Processing | PyPDF | PDF text extraction |
| Text Splitting | LangChain Text Splitters | Document chunking |
| HTTP Client | Axios | Frontend-backend communication |

---

## 4. System Architecture

CodeMentor follows a modular full-stack architecture consisting of a React frontend and a FastAPI backend.

The frontend handles user interaction, code editing, document uploads, and displaying AI-generated responses.

The backend manages API requests, prompt selection, Gemini communication, PDF processing, embedding generation, and vector retrieval.

### High-Level Architecture

```text
                  USER
                    |
                    v
          REACT FRONTEND (VITE)
                    |
          -----------------------
          |                     |
          v                     v
    CODE ASSISTANT        DOCUMENT ASSISTANT
          |                     |
          v                     v
      FASTAPI BACKEND
          |
     ------------------
     |                |
     v                v
  CODE ANALYSIS    RAG PIPELINE
     |                |
     v                v
  LANGCHAIN        PDF EXTRACTION
  PROMPTS              |
     |                 v
     v              CHUNKING
  GEMINI API            |
     |                 v
     v              EMBEDDINGS
  AI RESPONSE           |
     |                 v
     |              CHROMADB
     |                 |
     |                 v
     |             SIMILARITY
     |               SEARCH
     |                 |
     |                 v
     |               GEMINI
     |                 |
     ------------------
            |
            v
       FINAL RESPONSE
            |
            v
       REACT FRONTEND
```

---

## 5. Code Assistant Workflow

The Code Assistant uses a common backend service to handle four different code-analysis tasks.

### Step 1: User Input

The user enters source code in the Monaco Editor and selects an analysis mode.

The frontend collects:
- Programming language
- Source code
- User question or instructions
- Selected analysis task

### Step 2: API Request

The frontend sends the request to the FastAPI backend through Axios.

Example request:

```json
{
  "language": "Java",
  "code": "public class Main { ... }",
  "question": "Explain this code",
  "task": "explain"
}
```

The supported task values are:

- `explain`
- `debug`
- `test`
- `optimize`

### Step 3: Prompt Selection

The backend uses LangChain PromptTemplate objects to maintain separate instructions for each task.

The selected task determines which prompt is used.

For example:

- Explain Code selects the explanation prompt.
- Debug Code selects the debugging prompt.
- Test Code selects the test-generation prompt.
- Optimize Code selects the optimization prompt.

### Step 4: Gemini Integration

The selected prompt is populated with the user's programming language, code, and question.

The completed prompt is passed to Google's Gemini model through LangChain's ChatGoogleGenerativeAI integration.

### Step 5: Response Generation

Gemini processes the request and generates an appropriate response.

The backend extracts the response text and returns it to the frontend.

### Step 6: Display Response

React displays the generated explanation, debugging suggestions, test cases, or optimized implementation.

**Important:** The current code assistant provides AI-based analysis and suggestions. It does not compile or execute submitted source code.

---

## 6. RAG-Based Document Question Answering

One of the major components of CodeMentor is its Retrieval-Augmented Generation pipeline.

RAG combines information retrieval with language generation. It allows the application to retrieve relevant information from uploaded documents and provide that information to an LLM as context.

The implementation consists of two main stages.

### 6.1 Document Indexing Pipeline

The indexing pipeline processes the PDF before the user asks questions.

**Step 1: PDF Upload**

The user uploads a PDF through the React interface.

FastAPI receives the uploaded file through the document upload endpoint.

**Step 2: Text Extraction**

PyPDF extracts text from the uploaded PDF.

The extracted content is processed page by page so that page information can be retained.

**Step 3: Text Chunking**

Large documents are divided into smaller text segments using LangChain's RecursiveCharacterTextSplitter.

Current configuration:

| Parameter | Value |
|---|---:|
| Chunk Size | 1000 |
| Chunk Overlap | 200 |

Chunking makes it easier to retrieve relevant sections without processing the entire document for every question.

The overlap helps preserve contextual continuity between neighboring chunks.

**Step 4: Embedding Generation**

The Sentence Transformers library generates numerical vector representations of the document chunks.

Embedding model:

`all-MiniLM-L6-v2`

These embeddings represent the semantic meaning of the text and enable similarity-based retrieval.

**Step 5: Vector Storage**

The generated embeddings and their corresponding text chunks are stored in ChromaDB.

Metadata is also stored, including:

- PDF filename
- Chunk index
- Page number

ChromaDB is configured with cosine distance for similarity-based retrieval.

### 6.2 Document Retrieval and Answer Generation

When a user asks a question, the following process takes place.

**Step 1: User Question**

The user submits a natural-language question about an uploaded PDF.

**Step 2: Query Embedding**

The question is converted into a numerical embedding using the same Sentence Transformers model.

**Step 3: Similarity Search**

The query embedding is compared against the stored document embeddings in ChromaDB.

The system retrieves the most relevant chunks based on vector similarity.

The current retrieval configuration requests up to five chunks for document question answering.

**Step 4: Context Construction**

The retrieved chunks are combined into a context containing relevant information from the document.

**Step 5: Gemini Response Generation**

The retrieved context and user question are passed to Gemini through a structured prompt.

The prompt instructs the model to:
- Answer using the provided document context.
- Explain technical concepts clearly.
- Avoid inventing information not present in the retrieved content.
- Mention relevant PDF page numbers when available.
- Clearly state when the requested information is unavailable.

**Step 6: Final Response**

Gemini generates a context-aware response.

The backend returns:
- User question
- Generated answer
- Retrieved source information

The frontend displays the answer and its document sources.

### RAG Pipeline Summary

```text
          PDF DOCUMENT
                |
                v
          TEXT EXTRACTION
                |
                v
           TEXT CHUNKING
                |
                v
        EMBEDDING GENERATION
                |
                v
             CHROMADB
                |
                |
          USER QUESTION
                |
                v
          QUERY EMBEDDING
                |
                v
        SIMILARITY SEARCH
                |
                v
        RETRIEVED CHUNKS
                |
                v
         CONTEXT CREATION
                |
                v
            GEMINI LLM
                |
                v
        CONTEXTUAL ANSWER
                |
                v
          FRONTEND DISPLAY
```

---

## 7. Project Structure

The project is organized into separate frontend and backend directories.

```text
CodeMentor/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatPanel.jsx
│   │   │   ├── codeEditor.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Header.jsx
│   │   │   └── sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── app/
│   │   ├── database/
│   │   │   └── connection.py
│   │   │
│   │   ├── prompts/
│   │   │   └── code_prompts.py
│   │   │
│   │   ├── routes/
│   │   │   ├── chat_routes.py
│   │   │   ├── code_routes.py
│   │   │   └── document_routes.py
│   │   │
│   │   ├── services/
│   │   │   ├── embedding_service.py
│   │   │   ├── llm_service.py
│   │   │   └── rag_service.py
│   │   │
│   │   ├── workflows/
│   │   │   └── debug_workflow.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── chroma_db/
│   ├── uploads/
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

### Important Backend Modules

| File | Responsibility |
|---|---|
| `main.py` | Initializes FastAPI and registers routers and middleware |
| `config.py` | Loads application configuration and API credentials |
| `code_prompts.py` | Defines prompts for the four code-analysis tasks |
| `code_routes.py` | Exposes code-analysis API endpoints |
| `llm_service.py` | Handles Gemini initialization and LLM response generation |
| `document_routes.py` | Handles PDF upload and processing |
| `embedding_service.py` | Generates embeddings using Sentence Transformers |
| `rag_service.py` | Handles chunking, vector storage, and similarity retrieval |
| `chat_routes.py` | Handles document-based question answering |

---

## 8. Backend API Endpoints

The FastAPI backend exposes REST endpoints for frontend communication.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root endpoint, if enabled in the application |
| GET | `/api/health` | Checks backend availability |
| POST | `/api/code/analyze` | Handles all four code-analysis tasks |
| POST | `/api/code/explain` | Handles code explanation |
| POST | `/api/documents/upload` | Uploads and processes PDF files |
| POST | `/api/chat/ask` | Answers questions using retrieved PDF content |

### Example: Code Analysis Request

Endpoint:

`POST /api/code/analyze`

Request:

```json
{
  "language": "Java",
  "code": "public class Main { ... }",
  "question": "Identify potential errors",
  "task": "debug"
}
```

Response structure:

```json
{
  "task": "debug",
  "answer": "AI-generated debugging analysis..."
}
```

### Example: Document Question Request

Endpoint:

`POST /api/chat/ask`

Request:

```json
{
  "question": "Explain the architecture described in the document",
  "filename": "document.pdf"
}
```

Response structure:

```json
{
  "question": "Explain the architecture described in the document",
  "answer": "Context-aware answer generated by Gemini...",
  "sources": [
    {
      "filename": "document.pdf",
      "chunk_index": 2,
      "page_number": 4
    }
  ]
}
```

These examples illustrate the API response structure; actual generated answers and source references depend on the submitted content.

---

## 9. Installation and Setup

Follow these steps to run CodeMentor locally.

### Prerequisites

Install the following:

- Python 3.12 or compatible version
- Node.js and npm
- Git
- Google Gemini API key

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CodeMentor
```

### Step 2: Set Up the Backend

Navigate to the backend directory:

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate the environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the backend directory.

Add your Gemini API key:

```env
GOOGLE_API_KEY=your_gemini_api_key
```

Do not commit this file to GitHub.

### Step 4: Start the Backend Server

Run:

```powershell
uvicorn app.main:app --reload --port 8000
```

The backend will be available at:

`http://127.0.0.1:8000`

FastAPI Swagger documentation:

`http://127.0.0.1:8000/docs`

### Step 5: Set Up the Frontend

Open another terminal.

Navigate to the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

---

## 10. Environment Configuration

The backend requires a valid Google Gemini API key.

The key is loaded from the backend `.env` file through the application's configuration module.

Example:

```env
GOOGLE_API_KEY=your_gemini_api_key
```

The frontend API configuration is maintained separately in:

`frontend/src/services/api.js`

The local development configuration currently uses:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 120000,
});

export default API;
```

For local development, ensure that the frontend API URL matches the running FastAPI server.

---

## 11. Running the Application

CodeMentor requires two development servers.

**Terminal 1 – Backend**

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 – Frontend**

```powershell
cd frontend
npm run dev
```

Open the frontend in your browser:

`http://localhost:5173`

The user can then:
1. Enter code in the editor.
2. Select an AI code-analysis task.
3. Submit the request.
4. View the generated AI response.
5. Switch to Documents mode.
6. Upload a PDF.
7. Ask questions about the uploaded document.

---

## 12. Core Concepts Implemented

The project demonstrates practical implementation of several important computer science and Generative AI concepts.

**Large Language Models (LLMs)**

Integrated Google Gemini to understand programming instructions, analyze source code, and generate natural-language responses.

**Prompt Engineering**

Designed separate structured prompts for code explanation, debugging, test generation, and optimization to guide model responses according to the selected task.

**Retrieval-Augmented Generation (RAG)**

Combined document retrieval with LLM generation to produce answers grounded in relevant PDF content.

**Text Chunking**

Used RecursiveCharacterTextSplitter to divide large documents into smaller, overlapping segments.

**Text Embeddings**

Used Sentence Transformers to convert text into numerical vectors representing semantic information.

**Vector Databases**

Used ChromaDB to persist document embeddings and retrieve relevant chunks through similarity search.

**Semantic Search**

Retrieved document content based on semantic similarity rather than relying only on exact keyword matching.

**REST API Development**

Used FastAPI to build modular backend endpoints and Axios to connect the React frontend with the backend.

**Full-Stack Integration**

Connected the frontend, backend, LLM services, document processing pipeline, and vector database into a single application.

---

## 13. Current Scope and Limitations

- Code analysis is generated by an LLM; submitted programs are not compiled or executed by the application.
- Test cases are generated with expected outputs but are not automatically executed.
- Optimization suggestions are not benchmarked automatically.
- AI response quality depends on the submitted code, prompt, selected Gemini model, and API availability.
- Document answers depend on the relevance and quality of retrieved chunks.
- Uploaded PDFs and ChromaDB data are stored locally in the backend directories.
- Local document and vector data may need to be recreated when setting up the application on another computer.
- A valid Gemini API key and available API quota are required for AI-generated responses.

---

## 14. Future Enhancements

Potential improvements include:

- Support for additional programming languages.
- Improved Markdown rendering and syntax-highlighted AI responses.
- Persistent document storage and document management.
- User authentication and personalized workspaces.
- Conversation history.
- Automated execution and validation of generated test cases in a secure environment.
- More advanced retrieval strategies and document ranking.
- Additional LLM provider support.

---

## 15. Author

**Manohar Talabattula**

B.Tech – Computer Science and Engineering (AI/ML)

VIT-AP University

**Areas of Interest:** Generative AI, Large Language Models, Retrieval-Augmented Generation, Machine Learning, Deep Learning, and Full-Stack Development.

---

## Acknowledgements

This project uses open-source libraries and frameworks, including React, FastAPI, LangChain, Sentence Transformers, ChromaDB, and PyPDF, along with Google's Gemini API.
