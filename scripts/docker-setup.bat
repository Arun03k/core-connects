@echo off
echo =====================================
echo   CoreConnect - Docker Setup Guide
echo =====================================
echo.

:: Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop and make sure it's running.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker is available!
echo.

:: Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose is not available!
    echo Please make sure Docker Desktop is running properly.
    pause
    exit /b 1
)

echo Docker Compose is available!
echo.

echo Choose an option:
echo [1] Start development environment (with live reload)
echo [2] Start production environment
echo [3] Build and start (clean build)
echo [4] Stop all containers
echo [5] View logs
echo [6] Show status
echo [7] Clean up (remove containers and images)
echo [0] Exit
echo.

set /p choice="Enter your choice (0-7): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto build
if "%choice%"=="4" goto stop
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto status
if "%choice%"=="7" goto cleanup
if "%choice%"=="0" goto exit
goto invalid

:dev
echo.
echo Starting development environment...
echo This will start both frontend and backend with live reload.
echo.
docker-compose up -d
echo.
echo Services starting... Please wait a moment.
timeout /t 10 >nul
echo.
echo ✅ Development environment is starting!
echo.
echo Access your application:
echo - Frontend: http://localhost:80
echo - Backend API: http://localhost:5000
echo - Health Check: http://localhost:5000/health
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
goto end

:prod
echo.
echo Starting production environment...
echo.
set /p secret="Enter production SECRET_KEY (or press Enter for default): "
if "%secret%"=="" set SECRET_KEY=production-secret-key-change-me
if not "%secret%"=="" set SECRET_KEY=%secret%
echo.
docker-compose -f ..\config\docker-compose.prod.yml up -d
echo.
echo ✅ Production environment is starting!
echo.
echo Access your application:
echo - Frontend: http://localhost:80
echo - Backend API: http://localhost:5000
goto end

:build
echo.
echo Building and starting with clean build...
echo This may take a few minutes on first build...
echo.
docker-compose build --no-cache
if errorlevel 1 (
    echo.
    echo ❌ Build failed! Common issues:
    echo - Make sure Docker Desktop is running
    echo - Check your internet connection for downloading dependencies
    echo - Verify you have enough disk space ^(at least 2GB free^)
    echo.
    echo For troubleshooting help, see DOCKER.md
    pause
    exit /b 1
)
docker-compose up -d
if errorlevel 1 (
    echo.
    echo ❌ Failed to start containers!
    echo Check the build logs above for specific errors.
    pause
    exit /b 1
)
echo.
echo ✅ Clean build completed and services started!
echo.
echo Your application should be available at:
echo - Frontend: http://localhost:80
echo - Backend: http://localhost:5000
echo.
echo If containers fail to start, run: docker-compose logs
goto end

:stop
echo.
echo Stopping all containers...
echo.
docker-compose down
docker-compose -f ..\config\docker-compose.prod.yml down
echo.
echo ✅ All containers stopped!
goto end

:logs
echo.
echo Showing recent logs (press Ctrl+C to stop)...
echo.
docker-compose logs -f
goto end

:status
echo.
echo Container Status:
echo =================
docker-compose ps
echo.
echo Images:
echo =======
docker images | findstr coreconnect
goto end

:cleanup
echo.
echo WARNING: This will remove all CoreConnect containers and images!
set /p confirm="Are you sure? (y/N): "
if not "%confirm%"=="y" if not "%confirm%"=="Y" (
    echo Cleanup cancelled.
    goto end
)
echo.
echo Cleaning up...
docker-compose down --rmi all --volumes --remove-orphans
docker-compose -f ..\config\docker-compose.prod.yml down --rmi all --volumes --remove-orphans
echo.
echo ✅ Cleanup completed!
goto end

:invalid
echo.
echo Invalid choice. Please try again.
echo.
pause
cls
goto start

:exit
echo.
echo Goodbye!
goto end

:end
echo.
pause
