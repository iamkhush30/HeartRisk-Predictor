# HeartRisk-Predictor Model

This repository contains a Machine Learning project focused on predicting the presence or absence of cardiovascular disease (CVD) in patients based on various health metrics and lifestyle factors.

## 📌 Project Overview
HeartRisk-Predictor are the leading cause of death globally. This project aims to build a predictive model that can assist healthcare professionals in identifying high-risk patients early using data-driven insights. 

The project involves data cleaning, exploratory data analysis (EDA), feature engineering, and the implementation of classification algorithms to achieve high prediction accuracy.

## 📊 Dataset Description
The dataset consists of 70,000 patient records with 11 features and 1 target variable (`cardio`).

| Feature | Description | Type |
| :--- | :--- | :--- |
| **Age** | Objective Feature | int (days) |
| **Height** | Objective Feature | int (cm) |
| **Weight** | Objective Feature | float (kg) |
| **Gender** | Objective Feature | categorical code |
| **Systolic BP (ap_hi)** | Examination Feature | int |
| **Diastolic BP (ap_lo)** | Examination Feature | int |
| **Cholesterol** | Examination Feature | 1: normal, 2: above normal, 3: well above normal |
| **Glucose** | Examination Feature | 1: normal, 2: above normal, 3: well above normal |
| **Smoking** | Subjective Feature | binary |
| **Alcohol intake** | Subjective Feature | binary |
| **Physical activity** | Subjective Feature | binary |
| **Cardio (Target)** | Presence/Absence of CVD | binary |

## 🛠️ Tech Stack
* **Language:** Python 3.11.9, JavaScript (React)
* **ML & Data Science:** `Scikit-Learn`, `Pandas`, `NumPy`, `Matplotlib`, `Seaborn`
* **Backend:** Flask, Flask-CORS
* **Testing:** Pytest (Unit & Schema Validation)
* **DevOps & CI/CD:** Jenkins (Declarative Pipeline), Docker, Sonatype Nexus Repository, Webhooks

## 🚀 Key Workflow
1.  **Data Preprocessing:**
    * Converted age from days to years.
    * Handled outliers in Blood Pressure (`ap_hi`, `ap_lo`) and Weight.
    * Removed duplicate entries.
2.  **Exploratory Data Analysis (EDA):** 
    * Analyzed the distribution of BMI (Body Mass Index).
    * Visualized the correlation between cholesterol levels and heart disease.
3.  **Model Building:** 
    * Split data into training and testing sets.
    * Implemented models with **Random Forest**.
4.  **Evaluation:** 
    * Assessed performance using Accuracy, Precision, Recall, and F1-Score.

## 🔄 CI/CD & Automated DevOps Pipeline

The application features a fully automated, declarative CI/CD pipeline built with **Jenkins**, **Docker**, and **Sonatype Nexus**:

```
[ Push to main ] ──( Webhook Trigger )──► [ Jenkins Declarative Pipeline ]
                                                   │
    ┌──────────────────────────────────────────────┴──────────────────────────────────────────────┐
    ▼                                              ▼                                              ▼
[ 1. Environment & Safe Cleanup ]       [ 2. Pytest & Schema Tests ]               [ 3. Docker Build ]
  • Idempotent container/image cleanup     • Tests Flask endpoints (/api/predict)     • Base: python:3.11-slim
  • Safe on fresh or existing agents       • Validates ML feature schema inputs       • gcc & build-essential
                                           • Fails build before image build           • apt cache cleanup
                                                   │
    ┌──────────────────────────────────────────────┴──────────────────────────────────────────────┘
    ▼                                              ▼
[ 4. Sonatype Nexus Push ]              [ 5. Container Deployment ]
  • Jenkins Credentials Binding            • Deploys ml-container on port 5000
  • Tagged with ${BUILD_NUMBER} & latest   • Zero-downtime container replacement
  • Private Docker hosted registry         • Isolated production runtime
```

### 🛡️ Pipeline Highlights & Engineering Solutions

1. **Automated Webhook Triggering**:
   * Pipeline automatically triggers on every push to the `main` branch via webhooks, running checkout, testing, building, tagging, and deployment with zero manual intervention.

2. **Pre-Build Testing & Schema Validation (`pytest`)**:
   * Automated test suite validates Flask REST endpoints (`/api/predict`, `/api/health`) and checks strict ML input feature schemas (BMI calculation, z-score scaling, blood pressure bounds).
   * **Fail-Fast Protection**: Any test failure immediately aborts the pipeline, preventing unverified code or broken schemas from reaching the container build phase.

3. **Optimized Docker Containerization**:
   * Built on `python:3.11-slim` for a minimal attack surface.
   * Resolved native C-compiler errors when compiling scientific dependencies (`scikit-learn`, `numpy`) by installing `gcc` and `build-essential`, followed by cleaning package lists (`rm -rf /var/lib/apt/lists/*`) to optimize image size.

4. **Artifact Management with Private Sonatype Nexus**:
   * Every build dynamically tags images with the Jenkins build identifier (`ml-app:${BUILD_NUMBER}`) and `ml-app:latest`.
   * Pushed to a private Sonatype Nexus Docker Hosted Repository for artifact versioning and traceability.

5. **Production Reliability & Security Hardening**:
   * **Credential Security**: Configured Jenkins **Credentials Binding** (`withCredentials`) for secure registry authentication, eliminating hardcoded secrets and preventing `401 Unauthorized` token expiry errors during long runs.
   * **Least-Privilege Execution**: Configured Jenkins agent permissions to execute Docker via group membership rather than running as root.
   * **Idempotent Agent Cleanup**: Teardown and cleanup stages handle missing containers and images safely (`|| exit 0`), ensuring flawless execution whether running on a fresh agent or existing environment.

## ⚙️ Installation & Usage

### 1. Clone the repository
```bash
git clone https://github.com/iamkhush30/HeartRisk-Predictor
cd HeartRisk-Predictor
```

### 2. Install dependencies
It is recommended to use a virtual environment:
```bash
pip install -r requirements.txt
```

### 3. Run the Backend & Frontend
```bash
# Terminal 1 - Backend API
python app.py

# Terminal 2 - Frontend UI
cd frontend
npm install
npm start
```

## 📈 Results
* The final model achieved an accuracy of approximately **74.6%**.
* Key predictors identified: Blood Pressure, Cholesterol, and Age.
