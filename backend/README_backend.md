Backend - Flask
how to start the backend:
```sh
py -m pip install Flask scikit-learn joblib pandas numpy flask-cors
py -m flask run
```
-> you should see  "* Running on http://127.0.0.1:5000" in the terminal and should be able to send requests


Example API request to the /calculate_skill endpoint:
```javascript
fetch('http://localhost:5000/calculate_skill', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fargorate: 600,
    bu_total: 80,
    win_percentage: 0.45,
    years_of_experience: 5,
    bu_drill_7: 15,
    bu_drill_8: 18,
    practice_hours_per_week: 8,
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => console.error('Error:', error));
```
