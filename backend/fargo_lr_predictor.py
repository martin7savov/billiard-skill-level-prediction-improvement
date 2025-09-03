import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import os

# --- Model Training and Saving (Run this section once to generate fargo_model.pkl) ---
# In a real scenario, you'd load your actual DataFrame 'df' here from a CSV or database.
# For demonstration and initial setup, let's create a dummy DataFrame if the model file doesn't exist.
model_file_path = "fargo_model.pkl"

# Load the trained model once when the module is imported
try:
    fargo_model = joblib.load(model_file_path)
except FileNotFoundError:
    print(f"Error: {model_file_path} not found. Please ensure the model training script has been run to create it.")
    fargo_model = None # Set to None to indicate model is not loaded

def predict_fargo_rate_lr(features: list) -> float:
    """
    Predicts the Fargo Rate using the pre-trained linear regression model.

    Args:
        features (list): A list of 14 numeric features in the correct order:
                         [years_playing, years_tournament, win_pct, bu1, bu2, bu3, bu4, bu5, bu6, bu7, bu8, bu_total, table_difficulty, mental]

    Returns:
        float: The predicted Fargo Rate.

    Raises:
        ValueError: If the model is not loaded or the input features are incorrect.
    """
    if fargo_model is None:
        raise ValueError("Linear Regression Fargo model is not loaded. Cannot make predictions.")
    
    if len(features) != 14:
        raise ValueError(f"Expected 14 features, but got {len(features)}. Please provide all required inputs.")

    # Convert the list of features to a NumPy array, reshaping for a single sample prediction
    X_new = np.array([features])
    predicted_fargo = fargo_model.predict(X_new)[0]
    return round(predicted_fargo, 0)
