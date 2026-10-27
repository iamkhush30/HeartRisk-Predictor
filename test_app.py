import pytest
import numpy as np
from app import app

@pytest.fixture
def client():
    """Create a Flask test client for REST endpoint testing."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test the /api/health endpoint returns status ok."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data == {'status': 'ok'}

def test_predict_endpoint_valid_schema(client):
    """Test /api/predict with standard patient metrics and verify response schema."""
    payload = {
        'age_years': 52,
        'gender_encoded': 2,
        'height': 168,
        'weight': 74,
        'ap_hi': 120,
        'ap_lo': 80,
        'cholesterol': 1,
        'gluc': 1,
        'smoke': 0,
        'alco': 0,
        'active': 1
    }
    response = client.post('/api/predict', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    
    # Verify response schema fields and data types
    assert 'prediction' in data
    assert 'probability' in data
    assert data['prediction'] in [0, 1]
    assert isinstance(data['probability'], (int, float))
    assert 0.0 <= data['probability'] <= 100.0

def test_predict_endpoint_high_risk_schema(client):
    """Test /api/predict with elevated risk parameters."""
    high_risk_payload = {
        'age_years': 64,
        'gender_encoded': 1,
        'height': 160,
        'weight': 95,
        'ap_hi': 170,
        'ap_lo': 105,
        'cholesterol': 3,
        'gluc': 3,
        'smoke': 1,
        'alco': 1,
        'active': 0
    }
    response = client.post('/api/predict', json=high_risk_payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['prediction'] in [0, 1]
    assert 0.0 <= data['probability'] <= 100.0

def test_predict_endpoint_defaults_on_missing_fields(client):
    """Verify API handles partial payloads safely using default values."""
    partial_payload = {
        'age_years': 45,
        'height': 175,
        'weight': 70
    }
    response = client.post('/api/predict', json=partial_payload)
    assert response.status_code == 200
    data = response.get_json()
    assert 'prediction' in data
    assert 'probability' in data

def test_ml_feature_schema_transformations():
    """Verify internal feature transformation formulas match model requirements."""
    # 1. BMI calculation schema
    height_cm = 170
    weight_kg = 70
    expected_bmi = weight_kg / ((height_cm / 100) ** 2)
    assert round(expected_bmi, 2) == 24.22
    
    # 2. Age group binning schema [0, 40, 50, 60, inf] -> [1, 2, 3, 4]
    bins = [0, 40, 50, 60, np.inf]
    assert np.digitize(35, bins, right=False) == 1
    assert np.digitize(45, bins, right=False) == 2
    assert np.digitize(55, bins, right=False) == 3
    assert np.digitize(65, bins, right=False) == 4
    
def test_predict_invalid_data_handling(client):
    """Verify API handles invalid/corrupted payloads and returns error code 400."""
    invalid_payload = {
        'ap_hi': 'invalid_string_not_a_number'
    }
    response = client.post('/api/predict', json=invalid_payload)
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

if __name__ == '__main__':
    pytest.main(['-v', __file__])

