@echo off
echo Installing pre-commit for Windows...

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Install pre-commit
echo Installing pre-commit package...
pip install pre-commit

REM Install the git hook scripts
echo Installing pre-commit hooks...
pre-commit install

REM Run pre-commit on all files to test
echo Testing pre-commit setup...
pre-commit run --all-files

echo.
echo Pre-commit setup completed successfully!
echo Git hooks are now active for code quality enforcement.
pause
