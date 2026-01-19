"use client";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age_years: 50,
    gender: "Male",
    height: 170,
    weight: 70,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 0,
  });

  const [heightUnit, setHeightUnit] = useState("metric"); // 'metric' or 'imperial'
  const [imperialHeight, setImperialHeight] = useState({
    feet: 5,
    inches: 7,
  });
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  const [results, setResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const calculateBMI = (height, weight) => {
    return (weight / (height / 100) ** 2).toFixed(1);
  };

  const toPercent = (value, min, max) => {
    const v = Number.parseFloat(value);
    if (!Number.isFinite(v)) return 0;
    const clamped = Math.max(min, Math.min(max, v));
    return Math.round(((clamped - min) / (max - min)) * 100);
  };

  const getSystolicCategory = (v) => {
    const n = Number.parseFloat(v);
    if (!Number.isFinite(n)) return "normal";
    if (n >= 130) return "very-high";
    if (n >= 120) return "high";
    return "normal";
  };

  const getDiastolicCategory = (v) => {
    const n = Number.parseFloat(v);
    if (!Number.isFinite(n)) return "normal";
    if (n >= 90) return "very-high";
    if (n >= 80) return "high";
    return "normal";
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const convertToCm = (feet, inches) => {
    const totalInches = Number.parseInt(feet) * 12 + Number.parseInt(inches);
    return Math.round(totalInches * 2.54);
  };

  const convertCmToFtIn = (cm) => {
    const cmNum = typeof cm === "number" ? cm : Number.parseFloat(cm);
    if (!Number.isFinite(cmNum) || cmNum <= 0) return null;
    const totalInches = Math.round(cmNum / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
  };

  const handleHeightUnitChange = (unit) => {
    setHeightUnit(unit);
    if (unit === "imperial") {
      // Convert current cm to feet/inches when switching to imperial
      const totalInches = Math.round(formData.height / 2.54);
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      setImperialHeight({ feet, inches });
    } else {
      // Convert current feet/inches to cm when switching to metric
      const cm = convertToCm(imperialHeight.feet, imperialHeight.inches);
      setFormData((prev) => ({ ...prev, height: cm }));
    }
  };

  const handleImperialHeightChange = (field, value) => {
    const newImperialHeight = { ...imperialHeight, [field]: value };
    setImperialHeight(newImperialHeight);

    // Always update the height in cm for backend processing
    const cm = convertToCm(newImperialHeight.feet, newImperialHeight.inches);
    setFormData((prev) => ({ ...prev, height: cm }));
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
    setGenderDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : name === "cholesterol" || name === "gluc"
            ? Number.parseInt(value)
            : Number.parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const genderMap = { Male: 2, Female: 1 };

    const payload = {
      age_years: formData.age_years,
      gender_encoded: genderMap[formData.gender],
      height: formData.height,
      weight: formData.weight,
      ap_hi: formData.ap_hi,
      ap_lo: formData.ap_lo,
      cholesterol: formData.cholesterol,
      gluc: formData.gluc,
      smoke: formData.smoke,
      alco: formData.alco,
      active: formData.active,
    };

    // Call Flask API
    fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const bmi = calculateBMI(formData.height, formData.weight);
        const bmiCategory = getBMICategory(bmi);

        setResults({
          bmi: bmi,
          category: bmiCategory,
          prediction: data.prediction,
          proba: data.probability,
        });
        setSubmitted(true);
        console.log("[v0] Prediction received:", data);
      })
      .catch((error) => {
        console.error("[v0] API Error:", error);
        alert(
          "Error connecting to server. Make sure Flask is running on port 5000",
        );
      });
  };

  const getRiskLevel = (percentage) => {
    if (percentage < 20) return "Very Low Risk";
    if (percentage < 40) return "Low Risk";
    if (percentage < 60) return "Moderate Risk";
    if (percentage < 80) return "High Risk";
    return "Very High Risk";
  };

  const getRiskDescription = (percentage) => {
    if (percentage < 20)
      return "Your cardiovascular health appears to be in excellent condition.";
    if (percentage < 40)
      return "Your risk is relatively low, but regular check-ups are recommended.";
    if (percentage < 60)
      return "Moderate risk detected. Consider lifestyle improvements.";
    if (percentage < 80)
      return "High risk detected. Please consult a healthcare professional.";
    return "Very high risk detected. Immediate medical attention is advised.";
  };

  return (
    <div className="app-container">
      <div className="container-lg">
        {/* Intro Section */}
        <div className="intro-section mb-4">
          <div className="intro-title">Welcome to HeartRisk-Predictor</div>
          <div className="intro-text">
            This AI-powered tool estimates your risk of cardiovascular disease
            using key health metrics. It gives you personalized insights and
            explains what your numbers actually mean—clearly and simply.
          </div>
        </div>

        {/* Header */}
        <h1 className="main-title">HeartRisk-Predictor</h1>
        <p className="subtitle">AI-powered heart health assessment</p>

        {/* Form Section */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Demographics */}
            <h3 className="section-header">Patient Information</h3>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Age</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="age_years"
                    min="20"
                    max="90"
                    value={formData.age_years}
                    onChange={handleInputChange}
                  />
                  <span className="input-group-text">years</span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <div className="custom-dropdown">
                  <button
                    type="button"
                    className="custom-dropdown-trigger"
                    onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                  >
                    {formData.gender}
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="#c9d1d9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {genderDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <div
                        className="custom-dropdown-option"
                        onClick={() => handleGenderSelect("Male")}
                      >
                        Male
                      </div>
                      <div
                        className="custom-dropdown-option"
                        onClick={() => handleGenderSelect("Female")}
                      >
                        Female
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Measurements */}
            <h4 className="mt-4 mb-3">Physical Measurements</h4>

            <div className="row mb-3">
              <div className="col-md-6">
                {heightUnit === "metric" ? (
                  <>
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <label className="form-label mb-0">Height</label>
                      {/* Height Unit Toggle */}
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn ${heightUnit === "metric" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => handleHeightUnitChange("metric")}
                        >
                          <span>cm</span>
                        </button>
                        <button
                          type="button"
                          className={`btn ${heightUnit === "imperial" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => handleHeightUnitChange("imperial")}
                        >
                          <span>ft/in</span>
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="height"
                        min="120"
                        max="220"
                        value={formData.height}
                        onChange={handleInputChange}
                      />
                      <span className="input-group-text">cm</span>
                    </div>
                    {(() => {
                      const ftIn = convertCmToFtIn(formData.height);
                      return ftIn ? (
                        <small className="text-white">
                          ({ftIn.feet} ft {ftIn.inches} in)
                        </small>
                      ) : null;
                    })()}
                  </>
                ) : (
                  <>
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <label className="form-label mb-0">Height</label>
                      {/* Height Unit Toggle */}
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn ${heightUnit === "metric" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => handleHeightUnitChange("metric")}
                        >
                          <span>cm</span>
                        </button>
                        <button
                          type="button"
                          className={`btn ${heightUnit === "imperial" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => handleHeightUnitChange("imperial")}
                        >
                          <span>ft/in</span>
                        </button>
                      </div>
                    </div>
                    <div className="imperial-height-container">
                      <div className="imperial-height-input">
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Feet"
                            min="3"
                            max="8"
                            value={imperialHeight.feet}
                            onChange={(e) =>
                              handleImperialHeightChange("feet", e.target.value)
                            }
                          />
                          <span className="input-group-text">ft</span>
                        </div>
                      </div>
                      <div className="imperial-height-input">
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Inches"
                            min="0"
                            max="11"
                            value={imperialHeight.inches}
                            onChange={(e) =>
                              handleImperialHeightChange(
                                "inches",
                                e.target.value,
                              )
                            }
                          />
                          <span className="input-group-text">in</span>
                        </div>
                      </div>
                    </div>
                    <small className="text-white">({formData.height} cm)</small>
                  </>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Weight</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="weight"
                    min="40"
                    max="150"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                  <span className="input-group-text">kg</span>
                </div>
              </div>
            </div>

            {/* BMI Info */}
            <p className="explanation">
              BMI (Body Mass Index) is calculated from your height and weight.
              It indicates if you're underweight, normal weight, overweight, or
              obese.
            </p>
            <div className="mb-3">
              <span className="range-box range-normal">Normal: 18.5-24.9</span>
              <span className="range-box range-high">Overweight: 25-29.9</span>
              <span className="range-box range-very-high">Obese: 30+</span>
            </div>

            {/* Vital Signs */}
            <h4 className="mt-4 mb-3">Vital Signs</h4>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Systolic BP</label>
                <p className="explanation">pressure when your heart beats</p>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="ap_hi"
                    min="90"
                    max="250"
                    value={formData.ap_hi}
                    onChange={handleInputChange}
                  />
                  <span className="input-group-text">mmHg</span>
                </div>
                <div className="mt-2">
                  <span className="range-box range-normal">
                    Normal: &lt;120
                  </span>
                  <span className="range-box range-high">High: 120-129</span>
                  <span className="range-box range-very-high">
                    Very High: 130+
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Diastolic BP</label>
                <p className="explanation">pressure when your heart relaxes</p>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="ap_lo"
                    min="40"
                    max="180"
                    value={formData.ap_lo}
                    onChange={handleInputChange}
                  />
                  <span className="input-group-text">mmHg</span>
                </div>
                <div className="mt-2">
                  <span className="range-box range-normal">Normal: &lt;80</span>
                  <span className="range-box range-high">High: 80-89</span>
                  <span className="range-box range-very-high">
                    Very High: 90+
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Markers */}
            <h4 className="mt-4 mb-3">Clinical Markers</h4>

            <div className="mb-3">
              <label className="form-label d-block">Cholesterol Level</label>
              <p className="explanation">
                Total cholesterol level - indicates heart disease risk
              </p>
              <div className="form-check-grid">
                <label className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cholesterol"
                    value={1}
                    checked={formData.cholesterol === 1}
                    onChange={handleInputChange}
                  />
                  <span className="form-check-label">
                    Normal (&lt;200 mg/dL)
                  </span>
                </label>
                <label className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cholesterol"
                    value={2}
                    checked={formData.cholesterol === 2}
                    onChange={handleInputChange}
                  />
                  <span className="form-check-label">
                    Above Normal (200-239 mg/dL)
                  </span>
                </label>
                <label className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cholesterol"
                    value={3}
                    checked={formData.cholesterol === 3}
                    onChange={handleInputChange}
                  />
                  <span className="form-check-label">High (240+ mg/dL)</span>
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label d-block">Glucose Level</label>
              <p className="explanation">
                Blood glucose level - indicates diabetes risk
              </p>
              <div className="form-check-grid">
                <label className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gluc"
                    value={1}
                    checked={formData.gluc === 1}
                    onChange={handleInputChange}
                  />
                  <span className="form-check-label">
                    Normal (&lt;100 mg/dL)
                  </span>
                </label>
                <label className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gluc"
                    value={2}
                    checked={formData.gluc === 2}
                    onChange={handleInputChange}
                  />
                  <span className="form-check-label">
                    Above Normal (100-125 mg/dL)
                  </span>
                </label>
                <label className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gluc"
                    value={3}
                    checked={formData.gluc === 3}
                    onChange={handleInputChange}
                  />
                  <span className="form-check-label">High (126+ mg/dL)</span>
                </label>
              </div>
            </div>

            {/* Lifestyle Factors */}
            <h4 className="form-label d-block">Lifestyle Factors</h4>
            <div className="form-check-grid">
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="smoke"
                  checked={formData.smoke === 1}
                  onChange={handleInputChange}
                />
                <span className="form-check-label">Smoking</span>
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="alco"
                  checked={formData.alco === 1}
                  onChange={handleInputChange}
                />
                <span className="form-check-label">Alcohol</span>
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="active"
                  checked={formData.active === 1}
                  onChange={handleInputChange}
                />
                <span className="form-check-label">Physical Activity</span>
              </label>
            </div>

            <button type="submit" className="btn-analyze mt-4">
              Analyze Data
            </button>
          </form>
        </div>

        {/* Results Section */}
        {submitted &&
          results &&
          (() => {
            const riskPercent = Math.max(
              0,
              Math.min(100, Number.parseFloat(results.proba)),
            );

            // 5 distinct risk categories
            let riskCategory;
            if (riskPercent < 30) {
              riskCategory = "normal"; // Green
            } else if (riskPercent < 50) {
              riskCategory = "moderate"; // Light green/yellow-green (between green and yellow)
            } else if (riskPercent < 65) {
              riskCategory = "elevated"; // Yellow
            } else if (riskPercent < 80) {
              riskCategory = "high"; // Orange (between yellow and red)
            } else {
              riskCategory = "very-high"; // Red
            }

            return (
              <>
                <h3 className="section-header mt-5">Assessment Results</h3>
                <div className="results-container">
                  <div className="results-grid">
                    <div
                      className={`assessment-card result-main ${riskCategory}`}
                    >
                      <div className="risk-percentage">{riskPercent}%</div>
                      <div className="risk-level">
                        <span className="risk-dot"></span>
                        {getRiskLevel(riskPercent)}
                      </div>
                      <div className="risk-description">
                        {getRiskDescription(riskPercent)}
                      </div>

                      {/* Recommendation Message */}
                      <div className="risk-recommendation mt-3">
                        {riskPercent >= 60 ? (
                          <div className="recommendation-badge warning">
                            <strong>⚠️ Recommendation:</strong> Please consult
                            with a healthcare professional for a comprehensive
                            evaluation.
                          </div>
                        ) : (
                          <div className="recommendation-badge success">
                            <strong>✓ Great news!</strong> Your risk indicators
                            suggest a healthy cardiovascular profile.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="result-side">
                      <div className="mini-card">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="mini-title">Systolic BP</div>
                          <div className="text-white fw-semibold">
                            {formData.ap_hi} mmHg
                          </div>
                        </div>
                        <div
                          className="bp-meter"
                          style={{
                            "--risk-percent": `${toPercent(formData.ap_hi, 90, 200)}`,
                          }}
                        >
                          <div className="bp-meter-bar">
                            <div className="bp-meter-fill"></div>
                            <div
                              className="bp-marker"
                              style={{
                                "--marker-percent": `${toPercent(formData.ap_hi, 90, 200)}`,
                              }}
                            ></div>
                            <div
                              className="bp-tick"
                              style={{ left: `${toPercent(120, 90, 200)}%` }}
                            ></div>
                            <div
                              className="bp-tick"
                              style={{ left: `${toPercent(130, 90, 200)}%` }}
                            ></div>
                            <div
                              className="bp-tick-label"
                              style={{ left: `${toPercent(120, 90, 200)}%` }}
                            >
                              120
                            </div>
                            <div
                              className="bp-tick-label"
                              style={{ left: `${toPercent(130, 90, 200)}%` }}
                            >
                              130
                            </div>
                          </div>
                          <div className="bp-labels">
                            <span
                              className={`bp-label-badge ${getSystolicCategory(formData.ap_hi) === "normal" ? "active" : ""}`}
                            >
                              Normal
                            </span>
                            <span
                              className={`bp-label-badge ${getSystolicCategory(formData.ap_hi) === "high" ? "active" : ""}`}
                            >
                              High
                            </span>
                            <span
                              className={`bp-label-badge ${getSystolicCategory(formData.ap_hi) === "very-high" ? "active" : ""}`}
                            >
                              Very High
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mini-card">
                        <div
                          className="bp-meter"
                          style={{
                            "--risk-percent": `${toPercent(formData.ap_lo, 50, 120)}`,
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-white-50">Diastolic BP</span>
                            <span className="text-white fw-semibold">
                              {formData.ap_lo} mmHg
                            </span>
                          </div>
                          <div className="bp-meter-bar">
                            <div className="bp-meter-fill"></div>
                            <div
                              className="bp-marker"
                              style={{
                                "--marker-percent": `${toPercent(formData.ap_lo, 50, 120)}`,
                              }}
                            ></div>
                            <div
                              className="bp-tick"
                              style={{ left: `${toPercent(80, 50, 120)}%` }}
                            ></div>
                            <div
                              className="bp-tick"
                              style={{ left: `${toPercent(90, 50, 120)}%` }}
                            ></div>
                            <div
                              className="bp-tick-label"
                              style={{ left: `${toPercent(80, 50, 120)}%` }}
                            >
                              80
                            </div>
                            <div
                              className="bp-tick-label"
                              style={{ left: `${toPercent(90, 50, 120)}%` }}
                            >
                              90
                            </div>
                          </div>
                          <div className="bp-labels">
                            <span
                              className={`bp-label-badge ${getDiastolicCategory(formData.ap_lo) === "normal" ? "active" : ""}`}
                            >
                              Normal
                            </span>
                            <span
                              className={`bp-label-badge ${getDiastolicCategory(formData.ap_lo) === "high" ? "active" : ""}`}
                            >
                              High
                            </span>
                            <span
                              className={`bp-label-badge ${getDiastolicCategory(formData.ap_lo) === "very-high" ? "active" : ""}`}
                            >
                              Very High
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bmi-full-width">
                      <div
                        className="bp-meter"
                        style={{
                          "--risk-percent": `${toPercent(results.bmi, 12, 45)}`,
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-c  enter mb-2">
                          <span className="text-white-50">Your BMI</span>
                          <span className="text-white fw-semibold">
                            {results.bmi} - {results.category}
                          </span>
                        </div>
                        <div className="bp-meter-bar">
                          <div className="bp-meter-fill"></div>
                          <div
                            className="bp-marker"
                            style={{
                              "--marker-percent": `${toPercent(results.bmi, 12, 45)}`,
                            }}
                          ></div>
                          <div
                            className="bp-tick"
                            style={{ left: `${toPercent(18.5, 12, 45)}%` }}
                          ></div>
                          <div
                            className="bp-tick"
                            style={{ left: `${toPercent(25, 12, 45)}%` }}
                          ></div>
                          <div
                            className="bp-tick"
                            style={{ left: `${toPercent(30, 12, 45)}%` }}
                          ></div>
                          <div
                            className="bp-tick-label"
                            style={{ left: `${toPercent(18.5, 12, 45)}%` }}
                          >
                            18.5
                          </div>
                          <div
                            className="bp-tick-label"
                            style={{ left: `${toPercent(25, 12, 45)}%` }}
                          >
                            25
                          </div>
                          <div
                            className="bp-tick-label"
                            style={{ left: `${toPercent(30, 12, 45)}%` }}
                          >
                            30
                          </div>
                        </div>
                        <div className="bp-labels">
                          <span
                            className={`bp-label-badge ${results.category === "Underweight" ? "active" : ""}`}
                          >
                            Underweight: &lt;18.5
                          </span>
                          <span
                            className={`bp-label-badge ${results.category === "Normal" ? "active" : ""}`}
                          >
                            Normal: 18.5-24.9
                          </span>
                          <span
                            className={`bp-label-badge ${results.category === "Overweight" ? "active" : ""}`}
                          >
                            Overweight: 25-29.9
                          </span>
                          <span
                            className={`bp-label-badge ${results.category === "Obese" ? "active" : ""}`}
                          >
                            Obese: 30+
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Category Information */}
                <div className="category-info-section mt-4">
                  <h4 className="category-section-title">Your Risk Category</h4>
                  <div className="category-grid">
                    <div
                      className={`category-item ${riskCategory === "normal" ? "active" : ""}`}
                    >
                      <div className="category-name">Normal</div>
                      <div className="category-range">&lt; 30%</div>
                    </div>
                    <div
                      className={`category-item ${riskCategory === "moderate" ? "active" : ""}`}
                    >
                      <div className="category-name">Moderate</div>
                      <div className="category-range">30-50%</div>
                    </div>
                    <div
                      className={`category-item ${riskCategory === "elevated" ? "active" : ""}`}
                    >
                      <div className="category-name">Elevated</div>
                      <div className="category-range">50-65%</div>
                    </div>
                    <div
                      className={`category-item ${riskCategory === "high" ? "active" : ""}`}
                    >
                      <div className="category-name">High</div>
                      <div className="category-range">65-80%</div>
                    </div>
                    <div
                      className={`category-item ${riskCategory === "very-high" ? "active" : ""}`}
                    >
                      <div className="category-name">Very High</div>
                      <div className="category-range">≥ 80%</div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

        {/* Footer */}
        <div className="text-center mt-5 text-white-50">
          <small>
            Disclaimer: This tool is for informational purposes only and should
            not replace professional medical advice.
          </small>
        </div>
      </div>
    </div>
  );
}

export default App;
