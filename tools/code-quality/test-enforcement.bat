@echo off
REM Test script to verify code quality enforcement is working (Windows)

echo 🧪 Testing Code Quality Enforcement
echo ==================================

cd /d "%~dp0\..\..\"

REM Test Python formatting
echo.
echo 🐍 Testing Python code quality...
cd backend

where black >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    black --check . >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Python code is properly formatted (Black)
    ) else (
        echo ❌ Python formatting issues found
        echo ℹ️  Run: cd backend ^&^& black .
    )
) else (
    echo ⚠️  Black not installed
)

where isort >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    isort --check-only . >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Python imports are properly sorted (isort)
    ) else (
        echo ❌ Python import sorting issues found
        echo ℹ️  Run: cd backend ^&^& isort .
    )
) else (
    echo ⚠️  isort not installed
)

where flake8 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    flake8 . --config=.flake8 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Python linting passes (flake8)
    ) else (
        echo ❌ Python linting issues found
        echo ℹ️  Run: cd backend ^&^& flake8 . --config=.flake8
    )
) else (
    echo ⚠️  flake8 not installed
)

cd ..

REM Test frontend
echo.
echo 🌐 Testing frontend code quality...
cd frontend

if exist "package.json" (
    if exist "node_modules" (
        npm run lint >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Frontend linting passes (ESLint)
        ) else (
            echo ❌ Frontend linting issues found
            echo ℹ️  Run: cd frontend ^&^& npm run lint -- --fix
        )
        
        npx tsc --noEmit >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo ✅ TypeScript type checking passes
        ) else (
            echo ❌ TypeScript type errors found
            echo ℹ️  Run: cd frontend ^&^& npx tsc --noEmit
        )
    ) else (
        echo ⚠️  Frontend dependencies not installed
        echo ℹ️  Run: cd frontend ^&^& npm install
    )
)

cd ..

REM Test pre-commit framework
echo.
echo 🔧 Testing pre-commit framework...

where pre-commit >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Pre-commit framework installed
    
    if exist ".pre-commit-config.yaml" (
        echo ✅ Pre-commit configuration found
    ) else (
        echo ❌ Pre-commit configuration missing
    )
) else (
    echo ❌ Pre-commit framework not installed
    echo ℹ️  Run: pip install pre-commit
)

REM Test git hooks
echo.
echo 🪝 Testing git hooks...
if exist ".git\hooks\pre-commit" (
    echo ✅ Pre-commit hook installed
) else (
    echo ❌ Pre-commit hook missing
)

if exist ".git\hooks\pre-push" (
    echo ✅ Pre-push hook installed
) else (
    echo ❌ Pre-push hook missing
)

if exist ".git\hooks\commit-msg" (
    echo ✅ Commit-msg hook installed
) else (
    echo ❌ Commit-msg hook missing
)

REM Test configuration files
echo.
echo 📋 Testing configuration files...

if exist "backend\.flake8" (
    echo ✅ Flake8 configuration found
) else (
    echo ❌ Flake8 configuration missing
)

if exist "backend\pyproject.toml" (
    echo ✅ Black/isort configuration found
) else (
    echo ❌ Black/isort configuration missing
)

if exist "frontend\eslint.config.js" (
    echo ✅ ESLint configuration found
) else (
    echo ❌ ESLint configuration missing
)

REM Test GitHub workflows
echo.
echo 🚀 Testing GitHub Actions workflows...

set workflow_count=0
if exist ".github\workflows\style-enforcement.yml" (
    echo ✅ Style enforcement workflow found
    set /a workflow_count+=1
)

if exist ".github\workflows\code-quality.yml" (
    echo ✅ Advanced code quality workflow found
    set /a workflow_count+=1
)

if exist ".github\workflows\docker-build-test.yml" (
    echo ✅ Docker build test workflow found
    set /a workflow_count+=1
)

if exist ".github\workflows\api-integration-tests.yml" (
    echo ✅ API integration tests workflow found
    set /a workflow_count+=1
)

echo ℹ️  %workflow_count% GitHub Actions workflows configured

echo.
echo 📊 Summary
echo ==========
echo ℹ️  Code quality enforcement system status:

where black >nul 2>&1 && where isort >nul 2>&1 && where flake8 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python tools installed
) else (
    echo ❌ Some Python tools missing
)

where pre-commit >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Pre-commit framework ready
) else (
    echo ❌ Pre-commit framework needs setup
)

if exist ".git\hooks\pre-commit" (
    if exist ".git\hooks\pre-push" (
        echo ✅ Git hooks configured
    ) else (
        echo ❌ Git hooks need setup
    )
) else (
    echo ❌ Git hooks need setup
)

echo.
echo ℹ️  To fix any issues, run:
echo   .\tools\code-quality\setup-dev.bat
echo.
echo 🎯 Code quality enforcement test complete!
