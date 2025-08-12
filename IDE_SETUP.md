# IDE Setup Guide for Folio Project

This guide helps you configure your IDE (VS Code, PyCharm, Cursor, etc.) to work properly with the Folio project.

## Python Environment Setup

### Option 1: Use the Project Virtual Environment (Recommended)

The project includes a virtual environment in `backend/venv/`. Your IDE should automatically detect and use this environment.

**For VS Code/Cursor:**
1. Open the project in your IDE
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Python: Select Interpreter"
4. Choose the interpreter at: `./backend/venv/bin/python` (Mac/Linux) or `.\backend\venv\Scripts\python.exe` (Windows)

**For PyCharm:**
1. Go to Settings/Preferences → Project → Python Interpreter
2. Click the gear icon → Add
3. Choose "Existing environment"
4. Navigate to `backend/venv/bin/python` (Mac/Linux) or `backend/venv/Scripts/python.exe` (Windows)

### Option 2: Auto-Install Dependencies

If your IDE has a setting like "Use Python Virtual Environment = true", enable it to automatically install dependencies in a virtual environment.

## FastAPI Installation Verification

To verify FastAPI is properly installed:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Verify FastAPI installation
python -c "import fastapi; print('FastAPI version:', fastapi.__version__)"
```

Expected output: `FastAPI version: 0.116.1` (or similar)

## Running the Backend

### Method 1: Using Startup Scripts (Easiest)
```bash
# Windows
start.bat

# Mac/Linux
./start.sh
```

### Method 2: Manual Start
```bash
cd backend
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

python start.py
```

The backend will be available at: http://localhost:8000
API documentation at: http://localhost:8000/docs

## Frontend Setup

The frontend requires Node.js 18+ and npm. Dependencies should be installed automatically by the startup scripts.

Manual installation:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

The frontend will be available at: http://localhost:3000

## IDE-Specific Configuration

### VS Code Extensions (Recommended)
- Python
- FastAPI
- Pylance
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense

### PyCharm
- FastAPI support is built-in
- Enable TypeScript/JavaScript support for frontend

## Troubleshooting

### "FastAPI not found" Error
1. Ensure you're using the correct Python interpreter (see Option 1 above)
2. Try reinstalling dependencies: `pip install -r backend/requirements.txt`
3. Check if virtual environment is activated

### Python Version Issues
- This project requires Python 3.8+
- Tested with Python 3.13
- If you have version conflicts, consider using pyenv or conda

### Node.js Issues
- Requires Node.js 18+
- Use `npm install --legacy-peer-deps` if you encounter peer dependency conflicts

## Quick Test

After setup, verify everything works:

1. **Backend Test:**
   ```bash
   curl http://localhost:8000/
   ```
   Expected: `{"message":"Finance API is running"}`

2. **Frontend Test:**
   Open http://localhost:3000 in your browser

3. **API Documentation:**
   Open http://localhost:8000/docs for interactive API documentation

## Support

If you continue to have issues:
1. Check that both Python 3.8+ and Node.js 18+ are installed
2. Verify the virtual environment is properly activated
3. Try the automated startup scripts first
4. Check the project's main README.md for additional guidance
