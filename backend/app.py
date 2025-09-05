from flask import Flask, jsonify, request
from numpy import numpy as np
from flask_cors import CORS
from skill_predictor_function import calculate_and_project_skill
from fargo_lr_predictor import predict_fargo_rate_lr

app = Flask(__name__)
# Enable CORS for all routes, allowing requests from your web app's origin.
CORS(app)

@app.route('/calculate_skill', methods=['POST'])
def calculate_skill():
    """
    API endpoint to calculate and project skill levels from the input data.
    The data is expected as a JSON object in the request body.
    This endpoint consumes the model logic as an external module.
    """
   
    if request.method == 'OPTIONS':
        # Preflight request
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid or missing JSON data in request body"}), 400

    try:
        # extract the inputs from the JSON data.
        fargorate = data.get('fargorate')
        bu_total = data.get('bu_total')
        win_percentage = data.get('win_percentage')
        years_of_experience = data.get('years_of_experience')

        bu_drill_2 = data.get('bu_drill_2')
        bu_drill_6 = data.get('bu_drill_6')
        bu_drill_7 = data.get('bu_drill_7')
        bu_drill_8 = data.get('bu_drill_8')
        practice_hours_per_week = data.get('practice_hours_per_week')

        required_inputs = [
            fargorate, bu_total, win_percentage, years_of_experience,
            bu_drill_7, bu_drill_8, practice_hours_per_week, bu_drill_2, bu_drill_6
        ]
        
        if not all(isinstance(x, (int, float)) for x in required_inputs):
            return jsonify({"error": "All inputs must be valid numbers"}), 400

        results = calculate_and_project_skill(
            fargorate,
            bu_total,
            win_percentage,
            years_of_experience,
            bu_drill_7,
            bu_drill_8,
            practice_hours_per_week,
            bu_drill_2,
            bu_drill_6
        )
        
        # calculate_and_project_skill function returns a single dictionary -> to JSON
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/predict_fargo_lr', methods=['POST'])
def predict_fargo_lr_endpoint():
    """
    API endpoint to predict Fargo Rate using the linear regression model.
    Expects all 14 features as a JSON object in the request body.
    """

    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response


    
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid or missing JSON data in request body"}), 400

    required_features = [
        'years_of_experience_playing', 'years_of_tournament_experience', 'win_pct_tournaments',
        'bu_drill_1', 'bu_drill_2', 'bu_drill_3', 'bu_drill_4', 'bu_drill_5',
        'bu_drill_6', 'bu_drill_7', 'bu_drill_8', 'bu_total',
        'table_difficulty_total', 'mental_drills'
    ]

    try:
        # Extract features and convert to float/int
        input_features = []
        for feature in required_features:
            value = data.get(feature)
            if value is None:
                return jsonify({"error": f"Missing required feature: {feature}"}), 400
            
            # Specific type conversion for 'mental_drills'
            if feature == 'mental_drills':
                input_features.append(int(value))
            else:
                input_features.append(float(value))

        # Call the prediction function from fargo_lr_predictor.py
        predicted_fargo = predict_fargo_rate_lr(input_features)

        return jsonify({"predicted_fargo_rate_lr": round(predicted_fargo, 1)})

    except ValueError:
        return jsonify({"error": "Invalid data type for one or more features. Ensure all are numeric."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


# -----------------------
# Vercel-specific handler
# -----------------------
import vercel_wsgi

def handler(event, context):
    return vercel_wsgi.handle(app, event, context)
