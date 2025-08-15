@echo off
echo =================================
echo   CoreConnect - Test Runner
echo =================================
echo.

echo [1] Run Backend Tests
echo [2] Run Frontend Tests  
echo [3] Run All Tests
echo [0] Exit
echo.

set /p choice="Enter your choice (0-3): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto all
if "%choice%"=="0" goto exit
goto invalid

:backend
echo.
echo 🧪 Running Backend Tests...
echo ==========================
cd backend
python -m pytest tests/ -v
if errorlevel 1 (
    echo.
    echo ❌ Backend tests failed!
) else (
    echo.
    echo ✅ Backend tests passed!
)
cd ..
goto end

:frontend
echo.
echo 🧪 Running Frontend Tests...
echo ===========================
cd frontend
call npm test
if errorlevel 1 (
    echo.
    echo ❌ Frontend tests failed!
) else (
    echo.
    echo ✅ Frontend tests passed!
)
cd ..
goto end

:all
echo.
echo 🧪 Running All Tests...
echo ======================
echo.
echo Backend Tests:
echo --------------
cd backend
python -m pytest tests/ -v
set backend_result=%errorlevel%
cd ..
echo.
echo Frontend Tests:
echo ---------------
cd frontend
call npm test
set frontend_result=%errorlevel%
cd ..
echo.
echo Results Summary:
echo ===============
if %backend_result% equ 0 (
    echo ✅ Backend: PASSED
) else (
    echo ❌ Backend: FAILED
)
if %frontend_result% equ 0 (
    echo ✅ Frontend: PASSED
) else (
    echo ❌ Frontend: FAILED
)
goto end

:invalid
echo.
echo ❌ Invalid choice. Please try again.
goto start

:exit
goto end

:end
echo.
pause
