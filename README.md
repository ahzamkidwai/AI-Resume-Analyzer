# FitCheckAI - AI Resume Analyzer

FitCheckAI is an AI-powered Resume Analyzer that helps candidates evaluate how well their resume matches a job description. Users can upload a resume and provide a job description, and the system returns a match score out of 100 using an integrated AI model for keyword and skill extraction.

## Features
- Upload resume in PDF format
- Input a job description
- Get a match score out of 100
- AI-based keyword and skill extraction for accurate scoring
- Modular architecture with separate frontend, backend, and model service

## Project Structure
FitCheckAI/
│
├── frontend/ # Next.js application for the user interface
├── backend/ # Node.js + Express API for handling requests
└── model-service/ # Python (FastAPI/Flask) service running AI model


## Tech Stack
- **Frontend:** Next.js
- **Backend:** Node.js + Express
- **Model Service:** Python (FastAPI/Flask) + Hugging Face Transformers

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

### Model Service
```bash
cd model-service
pip install -r requirements.txt
python app.py
```

### Usage

Open the frontend application in your browser.
Upload your resume (PDF) and enter the job description.
Click "Analyze" to get a match score out of 100.
