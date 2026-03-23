from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow frontend to access this API

MODEL_PATH = 'revenue_model.pkl'
FEATURES_PATH = 'model_features.pkl'

# Load the trained model and features
model = None
features = []

if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
    model = joblib.load(MODEL_PATH)
    features = joblib.load(FEATURES_PATH)
    print("Model and features loaded successfully.")
else:
    print("Warning: Model files not found. Please train the model first.")

@app.route('/api/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not trained or loaded.'}), 500

    try:
        data = request.json
        # Create a DataFrame from incoming data ensuring all expected features exist
        input_data = {}
        for feature in features:
            input_data[feature] = data.get(feature, 0) # default to 0 if missing

        df = pd.DataFrame([input_data])
        prediction = model.predict(df)
        
        return jsonify({
            'predicted_revenue': round(prediction[0], 2),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'Backend API is running', 'model_loaded': model is not None})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Welcome to the SmartDashboard ML Backend API!',
        'status': 'Running',
        'predict_endpoint': 'POST /api/predict',
        'health_check': 'GET /api/status'
    })

if __name__ == '__main__':
    print("Starting Flask API Server...")
    app.run(debug=True, port=5000)
