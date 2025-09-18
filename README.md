# 🎱 Billiard Skill Level Prediction App  

👉 **[Try the app here](https://billiard-skill-level-prediction-imp-sigma.vercel.app)**  

---

## 📌 Overview  
This application predicts a billiards player's **skill level** and **FargoRate** based on:  
- Training data  
- Match statistics  
- Drill performance  

- **Frontend:** Vercel (Vite + React)  
- **Backend:** Render (Flask + Python)  

The frontend communicates with the backend via **REST API endpoints** to perform skill calculations and FargoRate predictions.  

---

## 🖥️ Backend (Render)  

- **Framework:** Flask  
- **Language:** Python 3.13+  
- **Dependencies:** Listed in `requirements.txt`  
  - `flask`, `flask-cors`, `numpy`, `pandas`, `gunicorn`  

### API Endpoints  

| Endpoint            | Method | Description                                                         |
|---------------------|--------|---------------------------------------------------------------------|
| `/calculate_skill`  | POST   | Computes projected skill levels from player data and drill scores.  |
| `/predict_fargo_lr` | POST   | Predicts FargoRate using a pre-trained linear regression model.     |

🔗 **CORS** is enabled to allow cross-origin requests from the frontend.  

---

## 🌐 Frontend (Vercel)  

- **Framework:** Vite (React)  
- **Purpose:** Collects player input data and displays predicted skill and FargoRate.  
- **API Integration:** Communicates with backend endpoints (deployed on Render) via HTTP `POST` requests.  

---

## 🚀 Deployment Notes  

### Frontend (Vercel)  
- Project root contains the Vite app.  
- Calls backend via the full Render API URL.  

### Backend (Render)  
- Ensure `requirements.txt` is up to date.  
- Start command:  
  ```bash
  gunicorn app:app
