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
* **Language:** Python 3.11.9
* **Libraries:** 
    * `Pandas` & `NumPy` (Data Manipulation)
    * `Matplotlib` & `Seaborn` (Data Visualization)
    * `Scikit-Learn` (Machine Learning & Evaluation)
    * `Jupyter Notebook` (Development Environment)

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

## ⚙️ Installation & Usage

### 1. Clone the repository
```bash
git clone [https://github.com/Gaurav1665/ML---Cardiovascular-Disease-Prediction-Model](https://github.com/iamkhush30/HeartRisk-Predictor)
cd ML---Cardiovascular-Disease-Model
```

### 2. Install dependencies
It is recommended to use a virtual environment.
```bash
pip install -r requirements.txt
```
*(Note: If you don't have a requirements.txt, ensure you have pandas, numpy, seaborn, matplotlib, and scikit-learn installed.)*

### 3. Run the Notebook
Open the Jupyter notebook to see the analysis and model training:
```bash
jupyter notebook Cardiovascular_Disease.ipynb
```

## 📈 Results
* The final model achieved an accuracy of approximately **74.6%**.
* Key predictors identified: Blood Pressure, Cholesterol, and Age.

## 🤝 Contributing
Contributions are welcome! If you have suggestions for improving the model accuracy or adding new features, please feel free to:
1. Fork the Project
2. Create your Feature Branch (```git checkout -b feature/NewFeature```)
3. Commit your Changes (```git commit -m 'Add some NewFeature```')
4. Push to the Branch (```git push origin feature/NewFeature```)
5. Open a Pull Request



& ".\.venv\Scripts\python.exe" -m streamlit run app.py
