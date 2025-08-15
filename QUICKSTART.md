# ⚡ CoreConnect Quick Start

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green?logo=github)](https://github.com/features/actions)
[![Flask](https://img.shields.io/badge/Backend-Flask-red?logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)

## 🚀 Get Started in 30 Seconds

### Windows Users (Recommended)
```cmd
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
dev-setup.bat
```

### All Platforms
```bash
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
docker-compose up -d
```

**Access your app:** http://localhost:80

## 🆘 Quick Fix for Build Errors

If you encounter build errors, try these solutions:

### Error: `tsc: not found` 
```bash
# Fixed in latest version - clean rebuild:
docker-compose build --no-cache
docker-compose up -d
```

### Error: Port already in use
```bash
# Stop conflicting services and retry:
docker-compose down
docker-compose up -d
```

### Error: Docker build fails
```bash
# Clean Docker cache and retry:
docker system prune -a
docker-compose build --no-cache
```

## 📚 Documentation

- **[Complete README](./README.md)** - Full project documentation
- **[Docker Guide](./DOCKER.md)** - Docker & CI/CD setup
- **[Backend API](./backend/README.md)** - Backend documentation

## 🛠️ Development Commands

```bash
# View status
docker-compose ps

# View logs  
docker-compose logs -f

# Run tests
docker-compose exec backend python -m pytest
docker-compose exec frontend npm test

# Stop services
docker-compose down
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite (Port 80)
- **Backend**: Flask + Python (Port 5000)  
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions with automated testing

---

**Made with ❤️ using Docker for seamless development**
