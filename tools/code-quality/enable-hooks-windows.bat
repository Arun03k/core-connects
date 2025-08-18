@echo off
echo Re-enabling git hooks...

git config --local --unset core.hooksPath

echo.
echo Git hooks have been re-enabled.
echo Pre-commit hooks will now run on commits and pushes.
echo.
echo If you encounter bash errors, you may need to:
echo 1. Install Git for Windows (includes bash)
echo 2. Set SHELL environment variable
echo 3. Or use disable-hooks-windows.bat temporarily
echo.
pause
