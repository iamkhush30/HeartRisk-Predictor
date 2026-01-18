from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import sys
from sklearn_functions import RandomForestClassifier

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name == 'RandomForestClassifier':
            return RandomForestClassifier
        return super().find_class(module, name)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load model exactly as in original app.py
try:
    with open("cardio_model.pkl", "rb") as f:
        bundle = CustomUnpickler(f).load()
    
    model = bundle['model']
    feature_order = bundle['columns']
    scaler_hi = bundle['scaler_hi']
    scaler_lo = bundle['scaler_lo']
    print("Model loaded successfully!")
    print(f"Feature order: {feature_order}")
except Exception as e:
    print(f"Error loading model: {e}")
    import traceback
    traceback.print_exc()
    model = None

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # Extract values from request
        age_years = data.get('age_years', 50)
        gender_val = data.get('gender_encoded', 2)
        height = data.get('height', 170)
        weight = data.get('weight', 70)
        ap_hi = data.get('ap_hi', 120)
        ap_lo = data.get('ap_lo', 80)
        cholesterol = data.get('cholesterol', 1)
        gluc = data.get('gluc', 1)
        smoke = data.get('smoke', 0)
        alco = data.get('alco', 0)
        active = data.get('active', 0)
        
        # Create DataFrame with base features
        features_df = pd.DataFrame([{
            'gender': gender_val,
            'height': height,
            'weight': weight,
            'ap_hi': ap_hi,
            'ap_lo': ap_lo,
            'cholesterol': cholesterol,
            'gluc': gluc,
            'smoke': smoke,
            'alco': alco,
            'active': active,
            'age_years': age_years
        }])
        
        # Feature engineering - EXACT same as training
        # 1. BMI
        features_df['bmi'] = features_df['weight'] / ((features_df['height'] / 100) ** 2)
        
        # 2. Age group binning
        features_df['age_group'] = pd.cut(
            features_df['age_years'],
            bins=[0, 40, 50, 60, np.inf],
            labels=[1, 2, 3, 4],
            right=False
        ).astype(int)
        
        # 3. Z-scores using loaded scalers
        features_df['ap_hi_z'] = scaler_hi.transform(features_df[['ap_hi']].to_numpy()).flatten()
        features_df['ap_lo_z'] = scaler_lo.transform(features_df[['ap_lo']].to_numpy()).flatten()
        
        # 4. Log transformations
        features_df['ap_hi_log'] = np.log(features_df['ap_hi'])
        features_df['ap_lo_log'] = np.log(features_df['ap_lo'])
        features_df['bmi_log'] = np.log(features_df['bmi'])
        
        # Reindex to match training feature order
        features_df = features_df.reindex(columns=feature_order, fill_value=0)
        
        # Cast categorical columns to int
        cat_cols = ['gender', 'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'age_group']
        for col in cat_cols:
            if col in features_df.columns:
                features_df[col] = features_df[col].astype(int)
        
        print(f"Features prepared: {features_df.columns.tolist()}")
        print(f"Feature values: {features_df.values[0]}")
        
        # Get prediction from model
        prediction = model.predict(features_df.to_numpy())[0]
        probability = model.predict_proba(features_df.to_numpy())[0][1] * 100
        
        print(f"Prediction: {prediction}, Probability: {probability}")
        
        return jsonify({
            'prediction': int(prediction),
            'probability': round(probability, 1)
        })
    
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
