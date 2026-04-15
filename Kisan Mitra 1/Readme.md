# KisanMitra - Digital Saathi for Farmers

KisanMitra is an AI-powered agriculture platform designed to empower Indian farmers with precision farming data, weather forecasts, and a direct marketplace.

## Project Structure

- `/frontend`: React + Vite + Tailwind CSS (UI/UX)
- `/backend`: Python + FastAPI + SQLAlchemy (API & Database)

---

## Getting Started (Local Setup)

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Git**

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On Mac/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: If requirements.txt is missing, install manually: `pip install fastapi uvicorn sqlalchemy pyjwt`) shadowed by the dev server.*
4. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The website will be available at the URL shown in your terminal (usually `http://localhost:5173` or `5176`).

---

## Core Features
- **OTP Login:** Simple and secure login using phone number (Mock OTP: `123456`).
- **Farmer Dashboard:** Soil health monitoring, pest alerts, and weather insights.
- **AI KisanBot:** Multilingual AI assistant for farming queries.
- **Relational Database:** SQLite used for local dev, ready for MySQL migration.

## Important Note
- The `PlantVillage` dataset folder is ignored by Git to keep the repository light.
- Mock OTP `123456` is enabled for testing purposes.
