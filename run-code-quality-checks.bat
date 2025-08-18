@echo off
REM Code Quality Checks for CoreConnect
REM This script runs the same checks as the GitHub Actions workflow

echo 🔧 CoreConnect - Code Quality Checks
echo =====================================

cd /d "%~dp0"

REM Check if we're in the project root
if not exist "backend" (
    echo ❌ Error: Backend directory not found
    exit /b 1
)

cd backend

echo.
echo 📦 Installing/updating required tools...
pip install black isort colorama flake8 bandit >nul 2>&1

echo.
echo 🎨 Python Code Formatting (Black)...
black --check --diff --color . || (
    echo ❌ Code formatting issues found. Run 'black .' to fix.
    exit /b 1
)
echo ✅ Black formatting check passed!

echo.
echo 📋 Python Import Sorting (isort)...
isort --check-only --diff --color . || (
    echo ❌ Import sorting issues found. Run 'isort .' to fix.
    exit /b 1
)
echo ✅ Import sorting check passed!

echo.
echo 🔍 Python Linting (flake8)...
flake8 . --config=config/.flake8 || (
    echo ❌ Linting issues found. Check the output above.
    exit /b 1
)
echo ✅ Linting check passed!

echo.
echo 🛡️ Python Security Scan (bandit)...
bandit -r . -x tests/ || (
    echo ⚠️  Security issues found, but continuing...
)

echo.
echo 🎉 All code quality checks completed!
echo If any issues were found, please fix them before committing.

pause
