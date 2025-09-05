Billiard Skill Level Prediction App
Overview

This application predicts a billiards player's skill level and Fargo rate based on training data, match statistics, and drill performance.

Frontend: Deployed on Vercel, built with Vite.

Backend: Deployed on Render, built with Flask.

The frontend communicates with the backend via REST API endpoints to perform skill calculations and Fargo rate predictions.

Backend (Render)

Framework: Flask

Language: Python 3.13+

Dependencies: Listed in requirements.txt

flask, flask-cors, numpy, pandas, gunicorn

API Endpoints:

Endpoint	Method	Description
/calculate_skill	POST	Computes projected skill levels from player data and drill scores.
/predict_fargo_lr	POST	Predicts Fargo Rate using a pre-trained linear regression model.

CORS is enabled for cross-origin requests from the frontend.


Frontend (Vercel)

Framework: Vite (React)

Purpose: Collects player input data and displays predicted skill and Fargo rate.

API Integration: Calls backend endpoints deployed on Render via HTTP POST requests.

Deployment Notes

Frontend (Vercel):

Project root contains Vite app.

Calls backend via full URL to Render

Backend (Render):

Ensure requirements.txt is up to date.

Use gunicorn app:app as start command in Render.

All necessary packages (numpy, pandas, flask-cors) must be installed.






































#old version - use this if running locally in browser (also change source to http://localhost:5173/)
Frontend - React/Vite
```sh
cd frontend
npm i
npm run dev
```
-> go to http://localhost:5173/ to see the page

Backend - Flask
```sh
cd backend
py -m pip install Flask scikit-learn joblib pandas numpy flask-cors
py -m flask run # backup python app.py
```
-> you should see  "* Running on http://127.0.0.1:5000" in the terminal and should be able to send requests
"# test" 
