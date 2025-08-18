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

REM Install Git for Windows if not present (contains bash)
where git >nul 2>&1
if errorlevel 1 (
    echo Error: Git is not installed or not in PATH
    echo Please install Git for Windows and try again
    pause
    exit /b 1
)

REM Set SHELL environment variable to use Git Bash
set SHELL="C:\Program Files\Git\bin\bash.exe"

REM Alternative: Use PowerShell as shell for pre-commit
REM set SHELL=powershell

REM Install the git hook scripts
echo Installing pre-commit hooks...
pre-commit install

REM Create a simple test to avoid full run on install
echo Testing basic pre-commit setup...
echo # Test comment > test_temp.py
pre-commit run --files test_temp.py || echo "Some hooks may need configuration, but pre-commit is installed"
del test_temp.py 2>nul

echo.
echo Pre-commit setup completed!
echo Note: If you encounter bash errors, run: git config --local core.hooksPath ""
echo This will temporarily disable hooks until proper bash setup.
echo.
echo To re-enable after fixing: git config --local --unset core.hooksPath
pause
