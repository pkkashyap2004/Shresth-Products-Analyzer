# Shresth Products Analyzer

AI-powered product analytics platform built with React + Express + MongoDB and a Python FastAPI analytics service.

## Architecture
- frontend: React + Vite
- backend: Node.js + Express + MongoDB/Mongoose
- ai-service: Python + FastAPI + pandas/scikit-learn

## Core loop
Measure -> Understand -> Decide -> Experiment -> Learn

## Local setup
1. Start MongoDB.
2. Backend: `cd backend && npm install && npm run dev`
3. Frontend: `cd frontend && npm install && npm run dev`
4. AI service: `cd ai-service && python -m venv .venv && pip install -r requirements.txt && uvicorn main:app --reload --port 8000`

Environment variables are documented in `.env.example` files.
