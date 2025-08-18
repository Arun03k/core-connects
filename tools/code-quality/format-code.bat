@echo off
REM Optional Code Formatting Script for CoreConnect Backend (Windows)
REM Run this manually if you want to format your Python code

echo 🔧 CoreConnect - Code Formatting (Optional)
echo ===========================================

cd /d "%~dp0\..\..\"

REM Check if we're in the project root
if not exist "backend" (
    echo ❌ Error: Backend directory not found
    exit /b 1
)

cd backend

REM Install required tools if not present
echo 📦 Installing/updating formatting tools...
pip install black isort >nul 2>&1

echo.
echo 🎨 Formatting Python code with Black...
black . --line-length=88

echo.
echo 📋 Organizing imports with isort...
isort . --profile=black

echo.
echo 🎉 Code formatting completed!
echo This is optional - you can commit without running this.
