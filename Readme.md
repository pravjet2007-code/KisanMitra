# 🌾 KisanMitra — Digital Saathi for Indian Farmers

KisanMitra is an AI-powered, full-stack agriculture platform designed to empower Indian farmers with precision farming insights, multilingual AI assistance, plant disease detection, a weather dashboard, and a direct farmer-to-buyer marketplace.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Phone OTP Login** | Secure phone-based login with JWT sessions (Mock OTP: `123456`) |
| **Farmer Dashboard** | Tabbed portal with soil health, pest alerts, disease scanner, gov schemes, marketplace & transactions |
| **Buyer Dashboard** | Browse produce listings, view farmer profiles, and make contact |
| **Marketplace** | Direct farmer-to-buyer listings with detail pages |
| **🤖 KisanBot (AI Chatbot)** | Floating AI chatbot powered by Google Gemini for real-time farming Q&A |
| **🩺 Crop Doctor (Leaf Scan)** | Upload a leaf photo → ML model identifies the plant disease + confidence score |
| **🌱 Soil Analyst** | Enter NPK & pH → Gemini AI generates fertilizer recommendations |
| **☀️ Live Weather** | Real-time 5-day weather forecast from Open-Meteo API using geolocation |
| **🏛️ Gov Schemes Finder** | Browse PM Kisan, KCC, Fasal Bima, eNAM and other relevant schemes |
| **🔊 Voice I/O** | Voice-to-text input (STT) and text-to-speech output (TTS) in the chatbot |
| **🌐 8-Language UI** | Full UI & AI responses in English, Hindi, Marathi, Punjabi, Gujarati, Tamil, Telugu, Bengali |

---

## 🏗️ Project Structure

```
KisanMitra/
├── backend/                        # FastAPI Python backend
│   ├── main.py                     # All API routes + ML inference endpoint (/api/predict)
│   ├── auth.py                     # JWT token creation & verification (PyJWT)
│   ├── models.py                   # SQLAlchemy ORM models (User table)
│   ├── schemas.py                  # Pydantic request/response schemas
│   ├── database.py                 # SQLite engine & session dependency
│   └── requirements.txt            # All Python dependencies
│
├── frontend/                       # React + Vite + TypeScript frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx        # Public landing page
│       │   ├── FeaturesPage.tsx    # Feature showcase page
│       │   ├── FarmerDashboard.tsx # Full farmer portal (tabs: overview,soil,pest,disease,schemes,market)
│       │   ├── BuyerDashboard.tsx  # Buyer portal
│       │   ├── Marketplace.tsx     # Produce listing browse page
│       │   └── ListingDetail.tsx   # Individual listing view
│       ├── components/
│       │   ├── KisanBot.tsx        # Floating AI chatbot (Gemini + STT + TTS + i18n)
│       │   ├── Navbar.tsx          # Top navigation bar
│       │   └── Footer.tsx          # Site footer
│       ├── utils/
│       │   └── gemini.ts           # Gemini API client (chatbot, soil analyst, crop doctor)
│       ├── locales/                # i18n JSON translation files (8 languages)
│       │   ├── en.json, hi.json, mr.json, pa.json
│       │   └── gu.json, ta.json, te.json, bn.json
│       └── i18n.ts                 # i18next + language detector configuration
│
├── best_plant_model.keras          # Trained MobileNetV2 model (PlantVillage dataset, 38 classes)
├── label_encoder.pkl               # Scikit-learn label encoder for disease class names
├── plant_disease_model.ipynb       # Training notebook (MobileNetV2 transfer learning)
├── predict.py                      # Standalone CLI prediction script
└── Datasets.md                     # Links to the PlantVillage dataset splits
```

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- **Node.js** v18+
- **Python** v3.9+ (v3.11 recommended for TensorFlow compatibility)
- **Git**
- A **Google Gemini API Key** (free tier available at [aistudio.google.com](https://aistudio.google.com))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/KisanMitra.git
cd KisanMitra
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (use py -3.11 on Windows for best TF compat)
py -3.11 -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Mac/Linux)
# source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

> ✅ API is live at **`http://localhost:8000`**
> 📖 Interactive docs at **`http://localhost:8000/docs`**

> ⚠️ **Note on TensorFlow:** TF is required only for the Leaf Scan (Crop Doctor) ML inference. If TF fails to install, all other features work normally — the `/api/predict` endpoint will return `503` instead.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:8000
```

Then run the dev server:

```bash
npm run dev
```

> 🌐 App is live at **`http://localhost:5173`** (or the port shown in your terminal)

---

## 🤖 AI & ML Architecture

### KisanBot (Floating Chatbot)
- Powered by **Google Gemini** with automatic model fallback: `gemini-2.0-flash` → `gemini-1.5-flash` → `gemini-2.0-flash-lite`
- Language detection: reads `i18n.language` and maps it to a BCP-47 locale (e.g. `hi` → `hi-IN`)
- AI always responds **in the user's selected language** via explicit system prompt injection
- **Voice Input (STT):** Web Speech API — recognizes speech in the selected language
- **Voice Output (TTS):** Web Speech Synthesis API — speaks the AI reply in the selected language
- Chat history (last 6 messages) is passed as context for multi-turn conversations

### Soil Analyst (Farmer Dashboard → Soil Tab)
- User enters **pH, Nitrogen (N), Phosphorus (P), Potassium (K)** levels
- Sends to `getSoilAnalysis()` in `gemini.ts` → Gemini responds with fertilizer advice in user's language

### Crop Doctor / Leaf Scan (Farmer Dashboard → Disease Scanner Tab)
- User uploads a leaf image from the Farmer Dashboard
- Image is `POST`-ed to `/api/predict` on the FastAPI backend
- Backend runs the **MobileNetV2** model (`best_plant_model.keras`) to classify 38 disease categories from the PlantVillage dataset
- Returns `{ disease_name, confidence }` to the frontend
- Frontend then calls `getDiseaseAnalysis()` → Gemini generates treatment, prevention, and organic remedy in the user's language

---

## 🌐 Supported Languages

| Code | Language  | Chatbot | UI | AI Responses |
|------|-----------|---------|-----|---|
| `en` | English   | ✅ | ✅ | ✅ |
| `hi` | Hindi     | ✅ | ✅ | ✅ |
| `mr` | Marathi   | ✅ | ✅ | ✅ |
| `pa` | Punjabi   | ✅ | ✅ | ✅ |
| `gu` | Gujarati  | ✅ | ✅ | ✅ |
| `ta` | Tamil     | ✅ | ✅ | ✅ |
| `te` | Telugu    | ✅ | ✅ | ✅ |
| `bn` | Bengali   | ✅ | ✅ | ✅ |

Language is auto-detected from the browser and can be changed in the Profile tab. All AI services follow the selected language.

---

## 🔌 Backend API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | Health check |
| `POST` | `/api/auth/send-otp` | ❌ | Trigger OTP to phone number |
| `POST` | `/api/auth/verify-otp` | ❌ | Verify OTP & receive JWT token |
| `GET` | `/api/user/profile` | ✅ Bearer | Fetch authenticated user profile |
| `PUT` | `/api/user/profile` | ✅ Bearer | Update name, location, crop, language |
| `POST` | `/api/predict` | ❌ | Upload leaf image → disease label + confidence |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core UI framework |
| Vite | Build tool & dev server |
| React Router v6 (HashRouter) | Client-side routing |
| i18next + react-i18next | Internationalization (8 languages) |
| Google Gemini API | AI chatbot, soil analysis, crop doctor |
| Web Speech API | Voice input (STT) and voice output (TTS) |
| Open-Meteo API | Free, no-key weather forecasts |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI + Uvicorn | REST API framework |
| SQLAlchemy + SQLite | ORM and local database (MySQL-ready) |
| PyJWT | JWT creation and verification |
| TensorFlow / Keras | ML model inference for disease detection |
| Scikit-learn + Joblib | Label encoder for disease class names |
| Python-multipart | File upload handling |

---

## 📝 Important Notes

- **Mock OTP:** `123456` is the OTP for all phone numbers during local development. Replace with Twilio / MSG91 for production.
- **Gemini API Key:** Must be set in `frontend/.env` as `VITE_GEMINI_API_KEY`. Without it, KisanBot, Soil Analyst, and Crop Doctor will show an error.
- **PlantVillage Dataset:** The dataset folder is **excluded from Git** to keep the repo lightweight. See `Datasets.md` for dataset links and `plant_disease_model.ipynb` for training.
- **CORS:** Backend currently allows all origins (`*`). Restrict to your frontend domain for production.
- **Database:** SQLite is used locally. To switch to MySQL, install `pymysql` and `cryptography`, then update the `DATABASE_URL` in `database.py`.

---

## 📄 License

This project is open-source and available for educational and community use.
