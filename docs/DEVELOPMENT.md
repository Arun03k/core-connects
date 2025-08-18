# Development Guide

## Quick Start

```bash
# Clone and start
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
docker-compose up -d

# Access application
# Frontend: http://localhost:80
# Backend: http://localhost:5000
```

## Development Commands

```bash
# Development mode (hot reload)
docker-compose -f docker-compose.dev.yml up

# Check status
docker-compose ps

# View logs
docker-compose logs -f [frontend|backend]

# Run tests
docker-compose exec backend python -m pytest

# Stop services
docker-compose down

# Clean rebuild
docker-compose build --no-cache
```

## Windows Helper Scripts

- `dev-setup.bat` - Interactive development menu
- `dev-start.bat` - Start development environment
- `dev-stop.bat` - Stop all services

## Environment Variables

Create `.env` file in backend/ directory:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
PORT=5000
```

## Troubleshooting

**Port conflicts:**
```bash
# Check ports 80 and 5000
netstat -ano | findstr :80
netstat -ano | findstr :5000
```

**Build failures:**
```bash
# Clean Docker cache
docker system prune -a
docker-compose build --no-cache
```

**Container logs:**
```bash
# Debug specific container
docker-compose logs frontend
docker-compose logs backend
```
