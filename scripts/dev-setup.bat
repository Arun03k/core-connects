@echo off
echo ===========================================
echo   CoreConnect - Development Quick Start
echo ===========================================
echo.
echo This script helps you get started with CoreConnect development using Docker.
echo.

:: Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Docker is not installed or running!
    echo.
    echo Please install Docker Desktop and make sure it's running:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is available!
echo.

echo Choose your development setup:
echo.
echo [1] 🚀 Start Full Application (Frontend + Backend)
echo [2] 🎯 Start Backend Only
echo [3] 🎨 Start Frontend Only  
echo [4] 📊 View Application Status
echo [5] 📝 View Logs
echo [6] 🧪 Run Tests
echo [7] 🛑 Stop All Services
echo [8] 🧹 Clean Reset (rebuild containers)
echo [0] 🚪 Exit
echo.

set /p choice="Enter your choice (0-8): "

if "%choice%"=="1" goto full
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto tests
if "%choice%"=="7" goto stop
if "%choice%"=="8" goto reset
if "%choice%"=="0" goto exit
goto invalid

:full
echo.
echo 🚀 Starting Full Application...
echo.
docker-compose up -d
if errorlevel 1 (
    echo.
    echo ❌ Failed to start services!
    echo.
    echo Common issues:
    echo - Docker Desktop not running
    echo - Ports already in use ^(80, 5000^)
    echo - Build errors ^(run 'docker-compose build' to check^)
    echo.
    echo For detailed logs: docker-compose logs
    pause
    exit /b 1
)
echo.
echo ✅ Services are starting up!
echo.
echo 🌐 Your application will be available at:
echo   • Frontend:    http://localhost:80
echo   • Backend:     http://localhost:5000
echo   • Health:      http://localhost:5000/health
echo.
echo 💡 Useful commands:
echo   • View logs:     docker-compose logs -f
echo   • Stop services: docker-compose down
goto end

:backend
echo.
echo 🎯 Starting Backend Only...
echo.
docker-compose up -d backend
echo.
echo ✅ Backend is starting!
echo   • Backend API: http://localhost:5000
echo   • Health Check: http://localhost:5000/health
goto end

:frontend
echo.
echo 🎨 Starting Frontend Only...
echo Note: This will also start the backend as it's a dependency.
echo.
docker-compose up -d frontend
echo.
echo ✅ Frontend is starting!
echo   • Frontend: http://localhost:80
goto end

:status
echo.
echo 📊 Application Status:
echo ====================
docker-compose ps
echo.
echo Docker Images:
echo ==============
docker images | findstr coreconnect
goto end

:logs
echo.
echo 📝 Recent Logs (Press Ctrl+C to stop):
echo =====================================
echo.
docker-compose logs -f
goto end

:tests
echo.
echo 🧪 Running Tests...
echo ==================
echo.
echo Backend Tests:
echo --------------
docker-compose exec backend python -m pytest -v
echo.
echo Frontend Tests:
echo ---------------
docker-compose exec frontend npm test
goto end

:stop
echo.
echo 🛑 Stopping All Services...
echo.
docker-compose down
echo.
echo ✅ All services stopped!
goto end

:reset
echo.
echo 🧹 Clean Reset - This will rebuild all containers...
echo.
set /p confirm="Are you sure? This will take a few minutes (y/N): "
if not "%confirm%"=="y" if not "%confirm%"=="Y" (
    echo Reset cancelled.
    goto end
)
echo.
echo Stopping services...
docker-compose down
echo.
echo Rebuilding containers...
docker-compose build --no-cache
echo.
echo Starting services...
docker-compose up -d
echo.
echo ✅ Clean reset completed!
goto end

:invalid
echo.
echo ❌ Invalid choice. Please try again.
echo.
pause
cls
goto start

:exit
echo.
echo 👋 Happy coding!
goto end

:end
echo.
echo 💡 For more advanced Docker commands, see DOCKER.md
echo.
pause
