@echo off
echo Starting Folio Finance Application...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js with npm and try again
    pause
    exit /b 1
)

echo ✓ Python and Node.js detected
echo.

REM Install backend dependencies if needed
echo Checking backend dependencies...
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

echo Activating virtual environment and installing dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies if needed
echo.
echo Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo ✓ All dependencies installed
echo.
echo Starting servers...
echo.

REM Start backend server in background
echo Starting backend server (FastAPI)...
cd backend
start "Folio Backend" cmd /k "venv\Scripts\activate && python start.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Go back to root and start frontend
cd ..
echo Starting frontend server (Next.js)...
cd frontend
start "Folio Frontend" cmd /k "npm run dev"

echo.
echo ✓ Servers starting...
echo.
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Both servers are starting in separate windows.
echo Close those windows to stop the servers.
echo.
pause
