#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "🚀 Starting Folio Finance Application..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed or not in PATH"
    print_info "Please install Python 3.8+ using:"
    print_info "  macOS: brew install python3"
    print_info "  Or download from: https://www.python.org/downloads/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed or not in PATH"
    print_info "Please install Node.js 18+ using:"
    print_info "  macOS: brew install node"
    print_info "  Or download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed or not in PATH"
    print_info "Please install Node.js with npm"
    exit 1
fi

print_status "Python and Node.js detected"
echo

# Backend setup
print_info "Setting up backend environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    print_info "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Frontend setup
print_info "Setting up frontend environment..."

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    print_info "Installing frontend dependencies..."
    cd frontend
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
fi

print_status "All dependencies installed"
echo

print_info "Starting servers..."
echo

# Function to cleanup processes on exit
cleanup() {
    echo
    print_warning "Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend server
print_info "Starting backend server (FastAPI)..."
cd backend
source venv/bin/activate
python start.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend server
print_info "Starting frontend server (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

echo
print_status "Servers are running!"
echo
print_info "Backend API: http://localhost:8000"
print_info "Frontend App: http://localhost:3000"
print_info "API Documentation: http://localhost:8000/docs"
echo
print_warning "Press Ctrl+C to stop both servers"
echo

# Wait for user to stop servers
wait
