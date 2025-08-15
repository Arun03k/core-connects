@echo off
echo Stopping CoreConnect development environment...
docker-compose -f ..\config\docker-compose.dev.yml down

echo Removing development containers and images...
docker-compose -f ..\config\docker-compose.dev.yml down --rmi all --volumes --remove-orphans

echo Development environment stopped and cleaned up.
