# AI Business Analyzer — React Frontend

React (Vite) frontend for the AI Business Analyzer Flask backend.

## Project Structure

```
src/
├── api/index.js          — All Flask API calls in one place
├── context/
│   └── BusinessContext.jsx — Global state (analysis data, auto-save)
├── pages/
│   ├── Home.jsx          — Landing + upload form
│   ├── Loading.jsx       — Fetches AI data, shows progress
│   └── Dashboard.jsx     — Full analysis dashboard (5 tabs)
├── components/
│   └── Navbar.jsx        — Top navigation bar
├── App.jsx               — Routes setup
└── index.css             — Global styles + design tokens
```

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set backend URL
```bash
cp .env.example .env
# .env already points to http://localhost:5000 by default
```

### 3. Make sure Flask backend is running
```bash
# In business_analyzer/backend/
python app.py
# Flask starts at http://localhost:5000
```

### 4. Start React dev server
```bash
npm run dev
# Opens at http://localhost:3000
```

## Deployment (Railway / Render)

### Backend (.env on server)
```
GROQ_API_KEY=your_groq_key_here
```

### Frontend (.env)
```
VITE_API_URL=https://your-flask-backend.railway.app
```

Then build:
```bash
npm run build
# dist/ folder — deploy to Vercel / Netlify / Railway static
```

## API Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/upload` | POST | Upload CSV file |
| `/submit-profile` | POST | Save business profile |
| `/analyze` | POST | Run KPI analysis |
| `/recommendations` | POST | Get Groq AI insights |
| `/charts` | POST | Get matplotlib charts |
| `/predict` | POST | Get ML predictions |
| `/generate-pdf` | POST | Download PDF report |
