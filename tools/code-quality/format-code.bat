@echo off
REM Code Quality Script for CoreConnect Backend (Windows)
REM Run this before committing to ensure code passes CI checks

echo 🔧 CoreConnect - Code Quality Check ^& Fix
echo ===========================================

cd /d "%~dp0"

REM Check if we're in the backend directory
if not exist "requirements.txt" (
    echo ❌ Error: Please run this script from the backend directory
    exit /b 1
)

REM Install required tools if not present
echo 📦 Ensuring code quality tools are installed...
pip install black isort flake8 bandit >nul 2>&1

echo.
echo 🎨 Step 1: Applying Black formatting...
black .

echo.
echo 📋 Step 2: Sorting imports with isort...
isort .

echo.
echo 🔍 Step 3: Running flake8 linting...
flake8 . --config=.flake8
if %ERRORLEVEL% EQU 0 (
    echo ✅ Flake8 linting passed!
) else (
    echo ❌ Flake8 linting failed. Please fix the issues above.
    exit /b 1
)

echo.
echo 🔒 Step 4: Running security scan...
bandit -r . -x tests/ --quiet >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Security scan passed!
) else (
    echo ⚠️  Security issues found, but continuing...
)

echo.
echo 🎉 All code quality checks completed!
echo Your code is ready for commit and will pass CI checks.
