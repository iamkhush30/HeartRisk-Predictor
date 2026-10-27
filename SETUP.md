# Quick Setup & Run Guide

## 🚀 How to Run the Application

### Prerequisites
- Python 3.11+ installed
- Node.js and npm installed
- Virtual environment already set up (venv folder exists)

---

## Backend (Flask API)

### Step 1: Activate Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
venv\Scripts\activate
```

### Step 2: Install Dependencies (if needed)
```powershell
pip install -r requirements.txt
```

### Step 3: Start Flask Server
```powershell
python app.py
```

✅ **Server should start on:** `http://localhost:5000`

✅ **Look for:** "Model loaded successfully!" message

---

## Frontend (React App)

### Step 1: Navigate to Frontend Directory
```powershell
cd frontend
```

### Step 2: Install Dependencies (if needed)
```powershell
npm install
```

### Step 3: Start React Development Server
```powershell
npm start
```

✅ **App should open automatically at:** `http://localhost:3000`

✅ **Look for:** "Compiled successfully!" message

---

## 📝 Quick Reference

### Running Both Servers

**Terminal 1 (Backend):**
```powershell
# From project root
.\venv\Scripts\Activate.ps1
python app.py
```

**Terminal 2 (Frontend):**
```powershell
# From project root
cd frontend
npm start
```

---

## 🔄 CI/CD & Automated Pipeline Setup (Jenkins, Docker, Nexus)

### Prerequisites for CI/CD
- **Docker Desktop** installed and running
- **Jenkins** server running (default: `http://localhost:8080`)
- **Sonatype Nexus Repository Manager** (default: `http://localhost:8081` with Docker connector on `8082`)

### 1. Running Unit & Schema Tests Locally
Before pushing changes or building images, run the automated test suite:
```powershell
python -m pytest test_app.py -v
```
✅ **Expected Output:** All 6 unit and feature schema tests passing.

### 2. Manual Docker Containerization
If running directly with Docker:
```powershell
# 1. Build the Docker image
docker build --no-cache -t ml-app .

# 2. Run the container
docker run -d -p 5000:5000 --name ml-container ml-app
```
✅ **Verify API:** Visit `http://localhost:5000/api/health` (should return `{"status":"ok"}`).

### 3. Automated Jenkins Pipeline Setup
1. **Create Jenkins Job**:
   - In Jenkins Dashboard, click **New Item** → Name: `ml-project-pipeline` → Choose **Pipeline** → Click **OK**.
2. **Configure SCM**:
   - Under **Pipeline**, set Definition to **Pipeline script from SCM**.
   - SCM: **Git**
   - Repository URL: `https://github.com/iamkhush30/HeartRisk-Predictor`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
3. **Configure Nexus Credentials in Jenkins**:
   - Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials** → **Add Credentials**.
   - Kind: **Username with password**
   - Username: `<your-nexus-username>` (e.g., `admin`)
   - Password: `<your-nexus-password>`
   - ID: `nexus-credentials` (matches `NEXUS_CRED_ID` in `Jenkinsfile`)
4. **Automated Webhook Trigger (GitLab / GitHub)**:
   - Check **Build when a change is pushed to GitLab/GitHub** to trigger execution on every push to `main`.
5. **Run the Pipeline**:
   - Click **Build Now** to trigger the automated 6-stage pipeline:
     1. Stop & Remove Old Container (`ml-container`)
     2. Remove Old Docker Image (`ml-app`)
     3. Run Unit & Schema Tests (`pytest`)
     4. Build Docker Image (`ml-app:latest`)
     5. Push to Sonatype Nexus (`ml-app:${BUILD_NUMBER}`)
     6. Run Container on Port 5000

---

## 🔧 Troubleshooting

### Backend Issues
- **Port already in use:** Kill process on port 5000 or change port in `app.py`
- **Module not found:** Run `pip install -r requirements.txt` again
- **Model loading error:** Ensure `cardio_model.pkl` exists in root directory

### Frontend Issues
- **Port 3000 in use:** React will prompt to use a different port
- **Module errors:** Delete `node_modules` and run `npm install` again
- **Connection refused:** Ensure backend is running on port 5000

### CI/CD & Docker Issues
- **Docker daemon not running:** Start Docker Desktop and ensure it appears active in the system tray.
- **Pytest failure in pipeline:** Run `python -m pytest test_app.py -v` locally to view detailed failure traces.
- **Nexus push skipped/unstable:** Verify Nexus is running and credentials ID `nexus-credentials` exists in Jenkins. The container will still launch safely via `catchError`.

### API Connection
- Frontend connects to: `http://localhost:5000/api/predict`
- Check browser console (F12) for any errors
- Verify CORS is enabled in Flask (`flask-cors` installed)

---

## 🎯 Usage

1. Open browser to `http://localhost:3000`
2. Fill in patient information:
   - Age, Gender, Height, Weight
   - Blood Pressure (Systolic/Diastolic)
   - Cholesterol and Glucose levels
   - Lifestyle factors (Smoking, Alcohol, Physical Activity)
3. Click **"ANALYZE DATA"** button
4. View risk assessment results with percentage and recommendations

---

## 📊 Expected Output

- **Risk Percentage:** 0-100%
- **Risk Level:** Very Low / Low / Moderate / Elevated / High / Very High
- **BMI Calculation:** Automatic
- **Blood Pressure Visualization:** Color-coded meters
- **Health Recommendations:** Based on risk level

---

## 🛑 Stopping the Application

**Backend (Flask):**
- Press `Ctrl + C` in the terminal

**Frontend (React):**
- Press `Ctrl + C` in the terminal
- Confirm with `Y` when prompted

**Docker Container:**
```powershell
docker stop ml-container
docker rm ml-container
```

---

## 📦 Project Structure

```
HeartRisk-Predictor/
├── frontend/                # React application (UI Dashboard)
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   └── App.css         # Styling
│   └── package.json
├── Model Tasks/             # Offline Model Training & Exploration
│   ├── Dataset_Exploration.ipynb
│   ├── Data_Cleaning_Preprocessing.ipynb
│   └── Model_Creation_Evaluation.ipynb
├── app.py                   # Flask REST API backend
├── cardio_model.pkl         # Trained ML model & scaler bundle
├── sklearn_functions.py     # Custom ML unpickler & classifier functions
├── test_app.py              # Pytest unit & schema test suite
├── Dockerfile               # Containerization definition (python:3.11-slim)
├── Jenkinsfile              # Declarative CI/CD pipeline
├── requirements.txt         # Python dependencies
├── README.md                # Project documentation & architecture
└── SETUP.md                 # Setup & deployment guide
```

---

## ✅ Verification Checklist

- [ ] Virtual environment activated & dependencies installed
- [ ] Pytest unit & schema tests pass (`python -m pytest test_app.py -v`)
- [ ] Flask server running on port 5000 (or via Docker container)
- [ ] React server running on port 3000
- [ ] Browser opens automatically at `http://localhost:3000`
- [ ] Form inputs and "Analyze Data" button operational
- [ ] Risk assessment results display accurately
- [ ] Jenkins pipeline executes all stages and runs container smoothly

---

**Note:** The backend API and frontend React server (or containerized backend) must be accessible for the application to function properly.