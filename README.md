# AI CRM HCP Module 🏥

An AI-powered CRM system for pharmaceutical field representatives to log and manage interactions with Healthcare Professionals (HCPs).

## Features
- 📋 Form Mode — Manual interaction logging
- 🤖 AI Chat Mode — Conversational interaction logging using LangGraph Agent
- ✏️ Edit/Delete interactions
- 📊 Sentiment tracking

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + Redux Toolkit |
| Backend | Python + FastAPI |
| AI Agent | LangGraph |
| LLM | Groq API (llama-3.1-8b-instant) |
| Database | PostgreSQL (Neon) |

## 5 LangGraph Tools
1. **log_interaction** — Save new HCP meeting
2. **edit_interaction** — Modify existing interaction
3. **get_hcp_history** — View doctor's past interactions
4. **suggest_followups** — AI-powered next step suggestions
5. **analyze_sentiment** — Analyze doctor's reaction

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv langgraph langchain-groq langchain-core pydantic
```

Create `.env` file in backend folder:
```
DATABASE_URL=your_postgresql_connection_string
GROQ_API_KEY=your_groq_api_key
```

```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Usage
- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:3000
- API Docs: http://localhost:8000/docs