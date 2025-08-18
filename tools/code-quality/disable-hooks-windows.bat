@echo off
echo Temporarily disabling git hooks...

git config --local core.hooksPath ""

echo.
echo Git hooks have been disabled.
echo You can now commit and push without pre-commit hook interference.
echo.
echo To re-enable hooks later, run:
echo git config --local --unset core.hooksPath
echo.
pause
