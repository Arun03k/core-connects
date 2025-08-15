# 🐳 Docker & CI/CD Setup Guide

This guide covers the Docker containerization and CI/CD pipeline setup for CoreConnect.

## 📁 Docker Structure

```
core-connect/
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── backend/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore          # Backend ignore file
├── frontend/
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx configuration
│   └── .dockerignore          # Frontend ignore file
└── .github/workflows/         # CI/CD pipelines
    ├── ci-cd.yml             # Main pipeline
    ├── dependency-updates.yml # Dependency management
    └── security.yml          # Security scanning
```

## 🚀 Quick Start with Docker

### Prerequisites
- **Docker Desktop** installed and running
- **Docker Compose** v2.0+
- **Git** for repository cloning

### Development Environment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Arun03k/core-connects.git
   cd core-connects
   ```

2. **Start all services using the helper script (Windows):**
   ```cmd
   dev-setup.bat
   ```
   
   **Or start manually:**
   ```bash
   docker-compose up -d
   ```

3. **Check service health:**
   ```bash
   docker-compose ps
   ```

4. **Access your application:**
   - **Frontend**: http://localhost:80
   - **Backend API**: http://localhost:5000
   - **Health Check**: http://localhost:5000/health

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

6. **Stop services:**
   ```bash
   docker-compose down
   ```

## ⚙️ Environment Configuration

### Development Environment

The Docker Compose configuration automatically sets up the development environment with:

- **Backend Environment Variables:**
  - `FLASK_ENV=development` - Enable debug mode
  - `SECRET_KEY=docker-development-secret-key` - Development secret
  - `PORT=5000` - Backend port
  - `API_VERSION=v1` - API version

- **CORS Configuration:**
  - Frontend Docker container: `http://localhost:80`
  - Vite dev server: `http://localhost:5173`
  - Alternative dev server: `http://localhost:3000`

### Production Environment

For production deployment:

1. **Set environment variables:**
   ```bash
   export SECRET_KEY="your-production-secret-key"
   ```

2. **Deploy to production:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Custom Environment Variables

To override environment variables, you can:

1. **Modify docker-compose.yml** for persistent changes
2. **Use .env file** (create from `.env.example` in backend folder)
3. **Set environment variables** before running docker-compose

## 🔧 Individual Container Management

### Backend Container

```bash
# Build backend image
docker build -t coreconnect-backend ./backend

# Run backend container
docker run -p 5000:5000 -e FLASK_ENV=development coreconnect-backend

# Access backend logs
docker logs coreconnect-backend
```

### Frontend Container

```bash
# Build frontend image
docker build -t coreconnect-frontend ./frontend

# Run frontend container
docker run -p 80:80 coreconnect-frontend

# Access frontend logs
docker logs coreconnect-frontend
```

## 📊 Health Monitoring

Both containers include health checks:

- **Backend**: `GET /health` endpoint
- **Frontend**: Nginx status check
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

Check health status:
```bash
docker inspect --format='{{.State.Health.Status}}' container-name
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. **Main CI/CD Pipeline** (`ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**
1. **Backend Tests** - Python linting, testing, coverage
2. **Frontend Tests** - ESLint, testing, building
3. **Security Scan** - Trivy vulnerability scanning
4. **Build & Push** - Docker image building and pushing
5. **Deploy Staging** - Automated staging deployment
6. **Deploy Production** - Manual approval required

#### 2. **Security Scanning** (`security.yml`)

**Triggers:**
- Daily schedule (2 AM)
- Push to `main`
- Pull requests
- Manual trigger

**Features:**
- Trivy filesystem scanning
- Docker image vulnerability checks
- CodeQL static analysis
- SARIF upload to GitHub Security

#### 3. **Dependency Updates** (`dependency-updates.yml`)

**Triggers:**
- Weekly schedule (Monday)
- Manual trigger

**Features:**
- Python package updates
- Node.js package updates
- Automated PR creation
- Security vulnerability fixes

### Required GitHub Secrets

Set these in your repository settings → Secrets and variables → Actions:

```
DOCKER_USERNAME      # Docker Hub username
DOCKER_PASSWORD      # Docker Hub password or token
SECRET_KEY          # Production Flask secret key
```

### Environment Configuration

#### Staging Environment
- Automatic deployment from `main` branch
- Basic smoke tests
- No manual approval required

#### Production Environment
- Manual approval required
- Comprehensive health checks
- Rollback capabilities

## 🛠️ Development Workflow

## 🛠️ Development Workflow

### Using the Development Helper Script (Windows)

The `dev-setup.bat` script provides an interactive menu for all common development tasks:

```cmd
dev-setup.bat
```

**Available options:**
- 🚀 Start Full Application (Frontend + Backend)
- 🎯 Start Backend Only  
- 🎨 Start Frontend Only
- 📊 View Application Status
- 📝 View Logs
- 🧪 Run Tests
- 🛑 Stop All Services
- 🧹 Clean Reset (rebuild containers)

### Manual Development Commands

1. **Start development environment:**
   ```bash
   docker-compose up -d
   ```

2. **Develop backend:**
   ```bash
   # View backend logs
   docker-compose logs -f backend
   
   # Access backend container
   docker-compose exec backend sh
   
   # Run tests
   docker-compose exec backend python -m pytest
   ```

3. **Develop frontend:**
   ```bash
   # View frontend logs  
   docker-compose logs -f frontend
   
   # Access frontend container
   docker-compose exec frontend sh
   
   # Run frontend tests
   docker-compose exec frontend npm test
   ```

4. **Reset development environment:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Code Quality

The pipeline enforces:
- **Python**: Flake8 linting, pytest testing
- **TypeScript/React**: ESLint, type checking
- **Security**: Trivy scanning, CodeQL analysis
- **Docker**: Multi-stage builds, security best practices

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development
- `hotfix/*` - Production hotfixes

## 🔒 Security Features

1. **Container Security:**
   - Non-root user execution
   - Minimal base images (Alpine, Slim)
   - Regular vulnerability scanning

2. **Application Security:**
   - CORS configuration
   - Security headers in Nginx
   - Environment variable protection

3. **CI/CD Security:**
   - Secret management
   - SARIF security reports
   - Automated dependency updates

## 📈 Monitoring & Logging

### Production Monitoring

Add these tools for production:

```yaml
# Add to docker-compose.prod.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

### Log Management

Configure centralized logging:

```bash
# View aggregated logs
docker-compose logs

# Export logs for analysis
docker-compose logs > app-logs.txt
```

## 🚨 Troubleshooting

### Common Docker Build Issues

#### 1. **Frontend Build Errors**

**Error**: `sh: tsc: not found`
```bash
# Solution: Fixed in latest Dockerfile - rebuild without cache
docker-compose build --no-cache frontend
```

**Error**: `npm ci` fails or packages not found
```bash
# Solution: Clear npm cache and rebuild
docker-compose build --no-cache frontend
# Or manually clear Docker cache
docker system prune -a
```

#### 2. **Backend Build Issues**

**Error**: Python package installation fails
```bash
# Check if requirements.txt is accessible
docker-compose build --no-cache backend

# View build logs for specific errors
docker-compose build backend 2>&1 | tee build.log
```

#### 3. **Container Startup Issues**

**Error**: Port already in use (80, 5000)
```bash
# Find and stop conflicting processes
netstat -ano | findstr :80
netstat -ano | findstr :5000

# Or use different ports in docker-compose.yml
# Change "80:80" to "8080:80" for frontend
# Change "5000:5000" to "5001:5000" for backend
```

**Error**: Container exits immediately
```bash
# Check container logs
docker-compose logs frontend
docker-compose logs backend

# Check container status
docker-compose ps
```

#### 4. **Performance Issues**

**Error**: Build takes too long or fails with timeout
```bash
# Increase Docker memory allocation (Docker Desktop → Settings → Resources)
# Recommended: 4GB RAM minimum, 8GB preferred

# Clean up Docker to free space
docker system prune -a
docker volume prune
```

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check port usage
   netstat -tulpn | grep :5000
   netstat -tulpn | grep :80
   ```

2. **Container build failures:**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Health check failures:**
   ```bash
   # Check container logs
   docker logs container-name
   
   # Execute commands in container
   docker exec -it container-name sh
   ```

4. **CI/CD failures:**
   - Check GitHub Actions logs
   - Verify secrets are set
   - Ensure Docker Hub access

### Docker Desktop Issues

#### Windows-Specific Issues

**Error**: Docker Desktop won't start
1. Enable Virtualization in BIOS
2. Enable Hyper-V and WSL2
3. Update Docker Desktop to latest version

**Error**: File sharing issues
1. Go to Docker Desktop → Settings → Resources → File Sharing
2. Add your project directory
3. Click "Apply & Restart"

### Logs and Debugging

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend

# Last 50 lines
docker-compose logs --tail=50 frontend
```

#### Access Container Shell
```bash
# Frontend container (if running)
docker-compose exec frontend sh

# Backend container
docker-compose exec backend sh

# If containers are not running, use run instead
docker-compose run frontend sh
docker-compose run backend sh
```

#### Check Resource Usage
```bash
# Container stats
docker stats

# Container processes
docker-compose top

# System info
docker system df
```

### Performance Optimization

1. **Build optimization:**
   - Use multi-stage builds
   - Leverage build cache
   - Minimize layer count

2. **Runtime optimization:**
   - Resource limits in production
   - Health check intervals
   - Log rotation

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
