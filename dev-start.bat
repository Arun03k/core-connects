@echo off
echo Starting CoreConnect in DEVELOPMENT mode with hot reload...
echo.
echo This will start:
echo - Backend Flask server with auto-reload at http://localhost:5000
echo - Frontend Vite dev server with hot reload at http://localhost:5173
echo - Frontend also accessible at http://localhost:80 (mapped to 5173)
echo.
echo To stop: Press Ctrl+C and run: docker-compose -f docker-compose.dev.yml down
echo.

docker-compose -f docker-compose.dev.yml up --build
