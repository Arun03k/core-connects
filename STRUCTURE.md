# CoreConnect - Clean Project Structure

## 📁 Project Structure

```
core-connect/
├── 📄 README.md                 # Main project documentation
├── 📄 package.json             # Root package.json for Vercel deployment
├── 📄 .env.template            # Environment variables template
├── 📄 .gitignore               # Git ignore rules
│
├── 📁 backend/                 # Flask Backend API
│   ├── 📄 app.py              # Main Flask application
│   ├── 📄 config.py           # Configuration settings
│   ├── 📄 index.py            # Entry point for deployment
│   ├── 📄 requirements.txt    # Python dependencies
│   ├── 📁 api/                # API endpoints
│   ├── 📁 core/               # Core business logic
│   ├── 📁 middleware/         # Express-like middleware
│   ├── 📁 models/             # Data models
│   ├── 📁 services/           # Business services
│   ├── 📁 utils/              # Utility functions
│   └── 📁 tests/              # Backend tests
│       ├── 📄 __init__.py
│       ├── 📄 test_app.py
│       ├── 📄 test_auth_enhanced.py
│       ├── 📄 test_auth_system.py
│       └── 📄 test_mongodb.py
│
├── 📁 frontend/               # React + TypeScript Frontend
│   ├── 📄 package.json       # Frontend dependencies
│   ├── 📄 vite.config.ts     # Vite configuration
│   ├── 📄 tsconfig.json      # TypeScript configuration
│   ├── 📁 src/               # Source code
│   ├── 📁 public/            # Static assets
│   └── 📄 Dockerfile         # Frontend container
│
├── 📁 config/                # Configuration files
│   ├── 📄 docker-compose.yml     # Main docker compose
│   ├── 📄 docker-compose.dev.yml # Development config
│   ├── 📄 docker-compose.prod.yml # Production config
│   ├── 📄 vercel.json            # Vercel deployment config
│   └── 📁 mongodb-init/          # MongoDB initialization
│
├── 📁 scripts/               # Development & build scripts
│   ├── 📄 dev-setup.bat     # Interactive dev setup
│   ├── 📄 dev-start.bat     # Start development
│   ├── 📄 dev-stop.bat      # Stop development
│   └── 📄 docker-setup.bat  # Docker setup helper
│
└── 📁 docs/                  # Documentation
    └── 📄 DEVELOPMENT.md     # Development guide
```

## 🚀 Quick Start

### Option 1: Using Scripts (Recommended)
```bash
# Interactive setup
cd scripts
./dev-setup.bat

# Or start directly
./dev-start.bat
```

### Option 2: Manual Docker Commands
```bash
# From project root
docker-compose -f config/docker-compose.dev.yml up --build
```

## 🧪 Running Tests

### Backend Tests
```bash
# Run all backend tests
cd backend
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_app.py -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 What Was Cleaned Up

### ❌ Removed Files:
- Empty test files: `frontend/src/__tests__/auth.simple.test.ts`, `auth.test.tsx`
- Empty debug files: `backend/verify_issue_3.py`, `backend/test_imports.py`
- Duplicate Jest configs: `frontend/jest.config.cjs`, `frontend/jest.config.js`
- Outdated root `requirements.txt`

### 📁 Reorganized Structure:
- **Tests**: Moved backend tests to `backend/tests/`
- **Documentation**: Moved to `docs/`  
- **Scripts**: Centralized in `scripts/`
- **Configuration**: Docker & deployment configs in `config/`

### 🎯 Benefits:
- **Cleaner root directory**: Only essential files at root level
- **Logical grouping**: Related files are grouped together
- **Better development workflow**: All scripts in one place
- **Easier maintenance**: Clear separation of concerns
- **Standard conventions**: Following industry best practices

## 🔧 Configuration Files Updated

All script files have been updated to reference the new paths:
- `scripts/dev-start.bat` → Points to `../config/docker-compose.dev.yml`
- `scripts/dev-stop.bat` → Points to `../config/docker-compose.dev.yml`
- `scripts/docker-setup.bat` → Points to `../config/docker-compose.prod.yml`

## 📚 Next Steps

1. **Update CI/CD**: Update any GitHub Actions or CI scripts to use new paths
2. **Update Documentation**: Review and update any other documentation references
3. **Team Communication**: Inform team members about the new structure
4. **IDE Configuration**: Update any IDE-specific configurations if needed

## 🤝 Contributing

See `docs/DEVELOPMENT.md` for detailed development setup and guidelines.
