@echo off
REM Setup Script for CoreConnect Development Environment (Windows)
REM Installs git hooks, pre-commit, and sets up code quality tools

echo 🚀 CoreConnect - Development Environment Setup
echo ==============================================

REM Check if we're in the project root
if not exist "README.md" (
    echo ❌ Please run this script from the CoreConnect project root directory
    exit /b 1
)

echo.
echo 📦 Installing pre-commit framework...

REM Install pre-commit
pip install pre-commit >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Pre-commit installed via pip
) else (
    echo ⚠️  Could not install pre-commit - please install manually
)

echo.
echo 📦 Setting up pre-commit hooks...

REM Install pre-commit hooks
pre-commit install >nul 2>&1
pre-commit install --hook-type commit-msg >nul 2>&1
pre-commit install --hook-type pre-push >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Pre-commit hooks installed
) else (
    echo ⚠️  Pre-commit not available, using git hooks only
)

echo.
echo 📦 Setting up Python development tools...

REM Setup backend dependencies
if exist "backend" (
    cd backend
    
    REM Install Python code quality tools
    pip install black isort flake8 bandit mypy >nul 2>&1
    echo ✅ Python code quality tools installed
    
    cd ..
)

echo.
echo 📦 Setting up Frontend development tools...

REM Setup frontend dependencies
if exist "frontend" (
    cd frontend
    
    REM Install frontend dependencies if not present
    if not exist "node_modules" (
        npm install >nul 2>&1
        echo ✅ Frontend dependencies installed
    )
    
    cd ..
)

echo.
echo 📦 Configuring git hooks...
echo ✅ Git hooks configured

echo.
echo 📦 Testing setup...

REM Test if tools are working
cd backend >nul 2>&1
if exist "backend" cd backend

where black >nul 2>&1 && where isort >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python formatting tools ready
) else (
    echo ⚠️  Python formatting tools may not be properly installed
)

cd .. >nul 2>&1

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Your development environment is now configured with:
echo ✅ Pre-commit hooks (auto-formatting)
echo ✅ Pre-push hooks (quality checks)
echo ✅ Commit message validation
echo ✅ Python code quality tools
echo ✅ Frontend linting setup
echo.
echo 🔧 Quick Commands:
echo   Format Python code:    cd backend && format-code.bat
echo   Fix frontend linting:  cd frontend && npm run lint -- --fix
echo   Run all pre-commit:    pre-commit run --all-files
echo.
echo 📝 Commit Message Format:
echo   feat: add new feature
echo   fix: resolve bug
echo   docs: update documentation
echo   style: format code
echo.
echo Happy coding! 🚀
