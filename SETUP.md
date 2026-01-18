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

## 🔧 Troubleshooting

### Backend Issues
- **Port already in use:** Kill process on port 5000 or change port in `app.py`
- **Module not found:** Run `pip install -r requirements.txt` again
- **Model loading error:** Ensure `cardio_model.pkl` exists in root directory

### Frontend Issues
- **Port 3000 in use:** React will prompt to use a different port
- **Module errors:** Delete `node_modules` and run `npm install` again
- **Connection refused:** Ensure backend is running on port 5000

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

---

## 📦 Project Structure

```
Cardiovascular-Disease-Prediction-Model/
├── venv/                    # Python virtual environment
├── frontend/                # React application
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   └── App.css         # Styling
│   └── package.json
├── app.py                   # Flask backend API
├── cardio_model.pkl         # Trained ML model
├── sklearn_functions.py     # Custom ML functions
├── requirements.txt         # Python dependencies
└── SETUP_GUIDE.md          # This file
```

---

## ✅ Verification Checklist

- [ ] Virtual environment activated
- [ ] Flask server running on port 5000
- [ ] React server running on port 3000
- [ ] Browser opens automatically
- [ ] No console errors in terminal
- [ ] Form inputs working
- [ ] "Analyze Data" button functional
- [ ] Results displaying correctly

---

**Note:** Both servers must be running simultaneously for the application to work properly.