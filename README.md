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
* **DevOps & CI/CD:** Jenkins (Declarative Pipeline), Docker, Pytest, Sonatype Nexus, AWS ECR
* **AWS Infrastructure:** Terraform, EC2, SSM, IAM

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

## 🔄 CI/CD Pipeline

The Jenkinsfile uses a declarative pipeline with five execution stages:

```
Source Change
      |
Jenkins Trigger
      |
Repository Checkout
      |
1. Run Unit & Schema Tests
   |-- Create/reuse workspace venv
   |-- Install requirements.txt and pytest
   |-- Run test_app.py against Flask endpoints and ML feature schemas
   |-- Abort before packaging if a test or install command fails
      |
2. Build Docker Image
   |-- docker build -t ml-app .
   |-- Base: python:3.11-slim
      |
3. Push to Sonatype Nexus
   |-- Tag ml-app with BUILD_NUMBER and latest
   |-- Push to nexus-docker-repo through host.docker.internal:8082
      |
4. Push to AWS ECR
   |-- Resolve the AWS account ECR endpoint
   |-- Tag ml-app with BUILD_NUMBER and latest
   |-- Push to ap-south-1
      |
5. Remove Older / Replace Local Container
   |-- Remove existing ml-container
   |-- Run ml-app on port 5000
      |
Post: docker image prune -f
```

### 🛡️ Pipeline Details

1. **Fail-Fast Pytest Stage**:
   * The Jenkins stage creates or reuses a workspace virtual environment.
   * Pytest validates Flask REST endpoint responses and ML feature transformations before Docker packaging.
   * A failed test or dependency installation stops the pipeline.

2. **Docker Image**:
   * The Dockerfile uses `python:3.11-slim` and installs `build-essential` and `gcc` before Python dependencies.
   * Jenkins builds the image as `ml-app`.

3. **Dual Registry Publishing**:
   * Jenkins adds both `${BUILD_NUMBER}` and `latest` tags.
   * The tagged image is pushed to the Sonatype Nexus Docker repository and AWS ECR.

4. **Local Container Replacement**:
   * Jenkins removes an existing `ml-container` and starts `ml-app` on port 5000.
   * The pipeline's post step runs `docker image prune -f`.

5. **AWS Provisioning and Deployment Scope**:
   * Terraform in `aws-cd-terraform` provisions an ECR repository and an EC2 host with Docker, SSM access, and IAM identities.
   * The Jenkinsfile pushes the image to AWS ECR, but it does not pull or run that image on EC2.
   * AWS deployment is manual: the user pulls the ECR image on EC2 and starts it as a container.

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
