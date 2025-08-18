# CoreConnect - Workforce Management Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge)](https://core-connect-seven.vercel.app)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-red?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)

## 🚀 Quick Start

```bash
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
docker-compose up -d
```

**Access:** http://localhost:80 | **API:** http://localhost:5000

## 🌐 Live Demo
**Production:** https://core-connect-seven.vercel.app

CoreConnect is a modern workforce management platform built with React, Flask, and Docker. Currently features a responsive landing page, documentation system, and authentication framework.

## 🎯 Features

### ✅ Implemented
- **Modern Landing Page** - Responsive design with animations
- **Documentation System** - Interactive guides and setup instructions  
- **Authentication Framework** - Redux state management and JWT-ready components
- **Docker Containerization** - Production and development environments
- **Vercel Deployment** - Live production environment with serverless backend
- **Component Library** - Reusable TypeScript components with Material-UI

### � In Development  
- Complete authentication with database integration
- User profile management and dashboard
- Employee management tools
- Time tracking and leave management

## 🛠 Tech Stack

**Frontend:** React 19.1.1, TypeScript, Vite, Material-UI, Redux Toolkit
**Backend:** Flask 3.0.0, Python 3.11+
**Deployment:** Docker, Vercel, GitHub Actions CI/CD
**Database:** PostgreSQL (planned)

## 📁 Project Structure

```
core-connect/
├── frontend/           # React TypeScript app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Application pages
│   │   ├── store/      # Redux state management
│   │   └── types/      # TypeScript definitions
├── backend/            # Flask API
│   ├── api/           # Route handlers
│   ├── models/        # Database models
│   └── utils/         # Utility functions
└── docker-compose.yml # Container orchestration
```

## 🚀 Development Setup

### 🐳 Docker (Recommended)

**Production Mode:**
```bash
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
docker-compose up -d
```
- Frontend: http://localhost:80
- Backend: http://localhost:5000

**Development Mode (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Helper Scripts (Windows):**
- `dev-setup.bat` - Interactive setup menu
- `dev-start.bat` - Start development environment
- `dev-stop.bat` - Stop all services

### � Manual Setup

**Frontend:**
```bash
cd frontend && npm install && npm run dev
```

**Backend:**  
```bash
cd backend && pip install -r requirements.txt && python app.py
```

## 🐳 Docker Commands

```bash
docker-compose ps              # Check status
docker-compose logs -f         # View logs
docker-compose exec backend sh # Access backend container
docker-compose down            # Stop services
```

## 🚀 Deployment & CI/CD

### Comprehensive Pipeline System

The project features a robust, security-focused CI/CD pipeline with multiple automated workflows:

#### 🛡️ Security & Access Control
- **Repository Owner-Only Deployments**: Only the repository owner can deploy to production
- **Pull Request Enforcement**: Third-party contributors must use pull requests
- **Security Policy Documentation**: Complete security guidelines in `SECURITY.md`
- **Automated Security Scanning**: Dependency vulnerability detection

#### 🔧 Automated Testing Workflows

**Code Quality Pipeline** (`.github/workflows/code-quality.yml`):
- Python code formatting with Black
- Linting with flake8 and Pylint
- TypeScript/JavaScript linting with ESLint
- Dependency vulnerability scanning
- Code style consistency enforcement

**Docker Build Testing** (`.github/workflows/docker-build-test.yml`):
- Multi-stage Docker image building
- Container functionality testing
- Health check validation
- Security scanning with Trivy
- Image optimization verification

**API Integration Testing** (`.github/workflows/api-integration-tests.yml`):
- MongoDB service integration
- Full API endpoint testing
- Authentication flow validation
- CORS and security header testing
- Performance and load testing

**Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`):
- Repository owner verification
- Automated dependency installation
- Comprehensive test execution
- Production deployment to Vercel and Render
- Environment-specific configurations

#### 📊 Pipeline Features
- **Multi-Environment Support**: Development, staging, and production
- **Parallel Test Execution**: Faster feedback loops
- **Comprehensive Health Checks**: Application availability monitoring
- **Error Handling**: Graceful failure recovery and notifications
- **Performance Monitoring**: Build time and resource optimization

### Manual Deployment Options

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Docker Production Deployment
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d

# Or use the provided scripts
# Windows
scripts/docker-setup.bat

# Linux/macOS
chmod +x scripts/docker-setup.sh && ./scripts/docker-setup.sh
```

### Security Policies

- **Owner-Only Direct Deployment**: Only repository owners can push directly to main for production deployment
- **Contributor Workflow**: External contributors must use pull requests for all changes
- **Automated Security Scanning**: All dependencies and Docker images scanned for vulnerabilities
- **Environment Protection**: Production environments require approval and security verification

## 📊 API Endpoints

```
GET  /                     # API status
GET  /health              # Health check
GET  /api/test           # Test endpoint
POST /api/auth/login     # User login
POST /api/auth/register  # User registration
```

## 🎯 Roadmap

**Phase 1 (Completed ✅)**
- Landing page and documentation
- Authentication framework
- Docker containerization
- Vercel deployment

**Phase 2 (In Progress 🔄)**
- Database integration (PostgreSQL)
- Complete authentication backend
- User profile management
- Dashboard implementation

**Phase 3 (Planned ⏳)**
- Employee management
- Time tracking
- Leave management system
- Advanced features and analytics

## 🤝 Contributing

### Code Quality Standards

We enforce **strict code quality standards** with automatic formatting and validation:

#### 🚀 **Quick Setup (Recommended)**
```bash
# Windows
setup-dev.bat

# Linux/macOS
chmod +x setup-dev.sh && ./setup-dev.sh
```

This installs:
- ✅ **Optional formatting tools** (use when you want)
- ✅ **Pre-push hooks** (block push if code quality fails)
- ✅ **Commit message validation** (conventional commits)
- ✅ **Code quality tools** (Black, isort, flake8, ESLint)

#### 🛡️ **Automatic Enforcement**

**Git Hooks Behavior:**
- **Optional Tools**: Manual code formatting available in tools/ directory
- **Pre-push**: Blocks push if code quality checks fail
- **Commit-msg**: Enforces conventional commit message format

**GitHub Actions:**
- **Pull Requests**: Auto-fixes formatting issues and commits them
- **Push to main**: Strict validation - blocks merge if style issues exist

#### 📝 **Manual Commands**

**Backend (Python) Code Formatting:**
```bash
cd backend

# Auto-format everything (recommended)
./format-code.bat  # Windows
./format-code.sh   # Linux/macOS

# Or run tools individually:
black .                    # Code formatting
isort .                    # Import sorting  
flake8 . --config=.flake8  # Linting
```

**Frontend (TypeScript) Code Quality:**
```bash
cd frontend

# Check linting
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit
```

#### 🚫 **Enforcement Rules**

- **No commits allowed** with unformatted Python code
- **No pushes allowed** with linting errors
- **Pull requests automatically receive** formatting fixes
- **Commit messages must follow** conventional commit format:
  ```
  feat: add new feature
  fix: resolve login bug
  docs: update API documentation
  style: format code with black
  refactor: restructure auth service
  test: add user authentication tests
  ```

#### ⚡ **Optional Code Formatting**

We provide optional formatting tools if you want to clean up your code:

```bash
# Windows
./tools/code-quality/format-code.bat

# Linux/Mac  
./tools/code-quality/format-code.sh
```

**Note:** These tools are completely optional - you can commit and push without using them!

### Contribution Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. **Format your code** using the tools above
4. Commit changes: `git commit -m 'Add feature'`
5. Push branch: `git push origin feature/name`
6. Submit pull request

**Note:** All pull requests must pass automated code quality checks including Black formatting, import sorting, linting, and security scans.

## 📄 License

© 2025 CoreConnect. All rights reserved.

---

**Made with ❤️ for modern workforce management**
