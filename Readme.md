# 🎯 Intelligent ATS Resume Screening & Keyword Suggestion System

> A web-based tool that helps job seekers evaluate and improve their resumes against a specific job description — before applying.

---

## 📌 Problem Statement

In today's competitive job market, most organizations use **Applicant Tracking Systems (ATS)** to automatically filter resumes before they ever reach a human recruiter. A large number of qualified candidates are rejected simply because their resumes lack the right keywords or formatting expected by ATS software.

Job seekers often remain completely unaware of why their applications fail at this initial screening stage.

**This system solves that problem by:**
- Simulating the ATS screening process using NLP and deep learning
- Computing a semantic match score between a resume and a job description
- Identifying missing keywords and skills the resume should include
- Providing actionable improvement suggestions to help pass ATS screening

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React.js Frontend                        │
│                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   │
│   │  Upload Page │   │ Score Panel  │   │  Keywords Panel  │   │
│   │ (Resume+JD)  │   │ (ATS Match%) │   │ (Match/Missing)  │   │
│   └──────┬───────┘   └──────────────┘   └──────────────────┘   │
│          │  Axios HTTP Requests                                  │
└──────────┼──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                            │
│                                                                 │
│  POST /upload   POST /analyze   GET /results/{session_id}       │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                   NLP Pipeline                           │  │
│   │                                                          │  │
│   │  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐  │  │
│   │  │  PDF Parser │   │  Preprocessor│   │  TF-IDF      │  │  │
│   │  │  (PyMuPDF)  │──▶│  (spaCy/NLTK)│──▶│  Keyword     │  │  │
│   │  └─────────────┘   └──────────────┘   │  Extractor   │  │  │
│   │                                        └──────┬───────┘  │  │
│   │                                               │           │  │
│   │  ┌────────────────────────────────────────────▼────────┐  │  │
│   │  │           ML Matching Engine                        │  │  │
│   │  │  BERT Sentence Transformer (all-MiniLM-L6-v2)       │  │  │
│   │  │  → Cosine Similarity → ATS Match Score (0–100%)     │  │  │
│   │  └─────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│                    SQLite / PostgreSQL                          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User uploads Resume (PDF) + Job Description (PDF / text)
        │
        ▼
PDF Text Extraction  ──▶  NLP Preprocessing (tokenize, lemmatize, NER)
        │
        ├──▶  BERT Embeddings  ──▶  Cosine Similarity  ──▶  ATS Match Score
        │
        └──▶  TF-IDF Extraction  ──▶  Keyword Comparison
                                          │
                              ┌───────────┴────────────┐
                              ▼                        ▼
                      Missing Keywords         Matched Keywords
                              │
                              ▼
                    Improvement Suggestions
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js 18 | UI — upload, results, keyword highlights |
| **HTTP Client** | Axios | API calls from React to FastAPI |
| **Routing** | React Router v6 | Page navigation (upload → results) |
| **Backend** | FastAPI (Python) | REST API, file handling, ML inference |
| **PDF Parsing** | PyMuPDF (`fitz`) | Extract raw text from uploaded PDFs |
| **NLP Preprocessing** | spaCy, NLTK | Tokenization, stopword removal, lemmatization, NER |
| **Keyword Extraction** | scikit-learn TF-IDF | Identify important terms in JD vs resume |
| **Semantic Embeddings** | Sentence-Transformers (`all-MiniLM-L6-v2`) | Deep contextual similarity scoring |
| **Similarity Scoring** | scikit-learn cosine similarity | Compute ATS match percentage |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Store session data and results |
| **Language** | Python 3.10+ | Backend and ML pipeline |
| **Version Control** | Git + GitHub | Source control |

---

## 📁 Project Structure

```
ats-resume-screener/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── routers/
│   │   ├── upload.py            # POST /upload endpoint
│   │   ├── analyze.py           # POST /analyze endpoint
│   │   └── results.py           # GET /results/{id} endpoint
│   ├── services/
│   │   ├── pdf_parser.py        # PyMuPDF text extraction
│   │   ├── preprocessor.py      # spaCy NLP preprocessing
│   │   ├── keyword_extractor.py # TF-IDF keyword extraction
│   │   ├── embedder.py          # Sentence-Transformers embeddings
│   │   ├── scorer.py            # Cosine similarity + ATS score
│   │   └── suggestion_engine.py # Improvement tip generation
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response models
│   ├── database/
│   │   └── db.py                # SQLite/PostgreSQL connection
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UploadPage.jsx   # Resume + JD upload UI
│   │   │   └── ResultsPage.jsx  # Score, keywords, tips UI
│   │   ├── components/
│   │   │   ├── ScoreGauge.jsx   # ATS match percentage display
│   │   │   ├── KeywordPanel.jsx # Matched/missing keyword view
│   │   │   ├── TipsPanel.jsx    # Improvement suggestions list
│   │   │   └── FileUpload.jsx   # Drag-and-drop PDF uploader
│   │   ├── api/
│   │   │   └── client.js        # Axios API client config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── tests/
│   ├── sample_resumes/          # Test PDFs for development
│   ├── sample_jds/              # Test job descriptions
│   └── test_pipeline.py         # pytest unit tests
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have these installed before cloning:

- **Python** 3.10 or higher — [python.org](https://python.org)
- **Node.js** 18 or higher + npm — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)

---

## 🚀 Clone & Run

### 1. Clone the repository

```bash
git clone https://github.com/jishnuanil2003/Score_My_CV.git
cd Score_My_CV
```

---

### 2. Backend setup

```bash
# Navigate to backend folder
cd backend

# Create and activate a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt

# Download spaCy English model
python -m spacy download en_core_web_sm

# Copy environment variables file and edit if needed
cp .env.example .env
```

#### `backend/requirements.txt`

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
python-multipart==0.0.9
pymupdf==1.24.3
spacy==3.7.4
nltk==3.8.1
scikit-learn==1.4.2
sentence-transformers==2.7.0
torch==2.3.0
sqlalchemy==2.0.30
pydantic==2.7.1
python-dotenv==1.0.1
pytest==8.2.0
httpx==0.27.0
```

#### Start the backend server

```bash
# From the /backend directory with venv activated
uvicorn main:app --reload --port 8000
```

Backend will be running at: `http://localhost:8000`
Interactive API docs at: `http://localhost:8000/docs`

---

### 3. Frontend setup

Open a **new terminal window** and run:

```bash
# From project root
cd frontend

# Install Node dependencies
npm install

# Copy environment variables
cp .env.example .env
```

#### `frontend/.env.example`

```
VITE_API_BASE_URL=http://localhost:8000
```

#### Start the frontend dev server

```bash
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

### 4. Open in browser

Go to `http://localhost:5173` — you should see the upload page ready to use.

---

## 🔑 Environment Variables

#### `backend/.env.example`

```
DATABASE_URL=sqlite:///./ats.db
MAX_FILE_SIZE_MB=5
MODEL_NAME=all-MiniLM-L6-v2
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload resume PDF + JD (PDF or text) |
| `POST` | `/analyze` | Run NLP + ML pipeline on uploaded files |
| `GET` | `/results/{session_id}` | Fetch score, keywords, tips for a session |
| `GET` | `/health` | Health check |

### Example response from `/results/{session_id}`

```json
{
  "session_id": "abc123",
  "ats_score": 74.5,
  "matched_keywords": ["Python", "FastAPI", "REST API", "SQL"],
  "missing_keywords": ["Docker", "Kubernetes", "CI/CD", "AWS"],
  "improvement_tips": [
    "Add Docker and containerization experience to your Skills section.",
    "Mention any CI/CD tools you have used (e.g. GitHub Actions, Jenkins).",
    "Include cloud platform experience — the JD specifically lists AWS."
  ],
  "keyword_highlights": {
    "resume": "...experience with <mark class='match'>Python</mark> and <mark class='missing'>Docker</mark>...",
    "jd": "...looking for <mark class='match'>Python</mark> developers with <mark class='missing'>Docker</mark>..."
  }
}
```

---

## 🧪 Running Tests

```bash
# From /backend with venv activated
pytest tests/ -v
```

---

## 📦 Building for Production

```bash
# Build React frontend
cd frontend
npm run build
# Output is in frontend/dist/

# Run FastAPI in production mode
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

---

## 🗺️ Roadmap

- [x] System design and architecture
- [ ] PDF parser and NLP preprocessing
- [ ] TF-IDF keyword extractor
- [ ] BERT embedding + cosine similarity scorer
- [ ] Improvement tip engine
- [ ] FastAPI REST endpoints
- [ ] React upload and results UI
- [ ] Keyword highlight view
- [ ] End-to-end integration testing
- [ ] Final report and documentation

---

## 👤 Author

**Jishnu. A**
Roll No: AA.SC.P2MCA24074107
Major Project 21CSA699A — Amrita Vishwa Vidyapeetham (Online)

---

## 📄 License

This project is developed as part of an academic major project submission. All design, development, and documentation is the sole work of the student.