# 🔧 CoreConnect Developer Guide - Code Quality Enforcement

## Overview

CoreConnect enforces **strict code quality standards** through automated formatting and validation. This ensures consistent code style across all contributions and prevents style-related issues in production.

## 🚀 Quick Start

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/Arun03k/core-connects.git
cd core-connects

# Run setup script (installs all tools and hooks)
./setup-dev.bat    # Windows
./setup-dev.sh     # Linux/macOS
```

### Daily Development Workflow

1. **Make your changes** as usual
2. **Commit your code** - formatting happens automatically via pre-commit hooks
3. **Push your code** - quality checks run automatically via pre-push hooks
4. **Create PR** - additional validation and auto-fixes applied via GitHub Actions

## 🛡️ Enforcement Mechanisms

### 1. Pre-Commit Hooks (Auto-Format)
- **Triggers**: Before each git commit
- **Action**: Automatically formats your code using the pre-commit framework
- **Tools**: Black, isort, ESLint, file cleanup
- **Result**: Your code is formatted before it's committed

### 2. Pre-Push Hooks (Quality Gate)
- **Triggers**: Before git push (via pre-commit framework)
- **Action**: Validates code quality
- **Checks**: Formatting, linting, type checking
- **Result**: Blocks push if quality issues exist

### 3. GitHub Actions (CI/CD)
- **Triggers**: Pull requests and pushes to main
- **Action**: Strict validation + auto-fixes on PRs
- **Workflows**: Style Enforcement, Advanced Code Quality
- **Result**: Ensures production code meets standards

### 4. Commit Message Validation
- **Triggers**: After writing commit message (via pre-commit)
- **Action**: Validates conventional commit format
- **Examples**: `feat:`, `fix:`, `docs:`, `style:`
- **Result**: Enforces consistent commit history

## 📝 Code Style Standards

### Python (Backend)
- **Formatter**: Black (88 character line length)
- **Import Sorter**: isort (Black profile)
- **Linter**: flake8 with Black-compatible rules
- **Security**: Bandit scanning
- **Type Checker**: MyPy (optional)

### TypeScript/JavaScript (Frontend)
- **Linter**: ESLint with TypeScript rules
- **Type Checker**: TypeScript compiler
- **Auto-Fix**: ESLint auto-fix for common issues
- **Formatting**: Prettier-compatible ESLint rules

## 🔧 Manual Commands

### Quick Fix Everything
```bash
# Backend
cd backend
./format-code.bat    # Windows
./format-code.sh     # Linux/macOS

# Frontend
cd frontend
npm run lint -- --fix
```

### Individual Tools
```bash
# Python formatting
cd backend
black .              # Format code
isort .              # Sort imports
flake8 . --config=.flake8  # Check linting

# Frontend
cd frontend
npm run lint         # Check linting
npm run lint -- --fix     # Auto-fix issues
npx tsc --noEmit     # Type checking
```

### Pre-commit Framework
```bash
# Run all hooks manually
pre-commit run --all-files

# Run specific hook
pre-commit run black

# Update hook versions
pre-commit autoupdate

# Skip hooks for emergency commits (not recommended)
git commit -m "emergency fix" --no-verify
```

## ⚠️ Common Issues & Solutions

### Problem: "Black formatting failed"
**Solution**: 
```bash
cd backend && black .
```

### Problem: "Import sorting failed"
**Solution**:
```bash
cd backend && isort .
```

### Problem: "Push blocked by pre-push hook"
**Solution**:
```bash
# Fix all issues automatically
cd backend && ./format-code.bat
cd frontend && npm run lint -- --fix

# Then try pushing again
git push
```

### Problem: "Commit message format invalid"
**Solution**: Use conventional commit format:
```bash
# Good examples:
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login bug"
git commit -m "docs: update API documentation"
git commit -m "style: format code with black"

# Bad examples:
git commit -m "updated some stuff"
git commit -m "fixes"
```

### Problem: "Can't install pre-commit"
**Solution**:
```bash
# Try different installation methods:
pip install pre-commit
# or
conda install -c conda-forge pre-commit
# or
brew install pre-commit  # macOS
```

## 🎯 Advanced Configuration

### Custom Flake8 Rules
Edit `backend/.flake8`:
```ini
[flake8]
max-line-length = 88
extend-ignore = E203, W503, E501
exclude = __pycache__, .git, .venv
```

### Custom Black Configuration
Edit `backend/pyproject.toml`:
```toml
[tool.black]
line-length = 88
target-version = ['py311']
```

### Skip Hooks Temporarily
```bash
# Skip pre-commit hooks (not recommended)
git commit -m "commit message" --no-verify

# Skip specific pre-commit hook
SKIP=flake8 git commit -m "commit message"
```

## 🚫 What's Blocked

- ❌ **Unformatted Python code** (Black formatting required)
- ❌ **Unsorted imports** (isort required)
- ❌ **Python linting errors** (flake8 compliance required)
- ❌ **Frontend linting errors** (ESLint compliance required)
- ❌ **TypeScript type errors** (type safety required)
- ❌ **Invalid commit messages** (conventional commits required)
- ❌ **Large files** (>1MB blocked)
- ❌ **Merge conflicts** in committed files

## ✅ What's Allowed

- ✅ **Properly formatted code** that passes all checks
- ✅ **Conventional commit messages** (`feat:`, `fix:`, etc.)
- ✅ **Code with warnings** (warnings don't block, only errors do)
- ✅ **Emergency commits** with `--no-verify` (use sparingly)

## 🎉 Benefits

- **Consistent Code Style**: All code follows the same formatting rules
- **Reduced Review Time**: No style discussions in PR reviews
- **Better Code Quality**: Automatic linting catches common issues
- **Easy Onboarding**: New developers get proper tooling automatically
- **Professional Codebase**: Production-ready code standards
- **Automated Workflow**: Developers focus on logic, not formatting

## 🛠️ Tools & Configuration Files

### Configuration Files
- `.pre-commit-config.yaml` - Pre-commit framework configuration
- `backend/.flake8` - Python linting configuration
- `backend/pyproject.toml` - Black and isort configuration
- `frontend/eslint.config.js` - Frontend linting configuration

### Scripts & Tools
- `setup-dev.bat/.sh` - Development environment setup
- `backend/format-code.bat/.sh` - Python code formatting
- `tools/code-quality/` - Additional quality assurance tools

### GitHub Workflows
- `code-quality.yml` - Advanced code quality checks
- `security.yml` - Security scanning and validation

## 🆘 Getting Help

If you encounter issues with the code quality system:

1. **Check this guide** for common solutions
2. **Run the test script**: `tools/code-quality/test-enforcement.sh`
3. **View detailed errors**: Remove `> /dev/null 2>&1` from commands
4. **Check workflow logs**: View GitHub Actions for detailed error messages
5. **Ask for help**: Create an issue with your error message

## 📚 Additional Resources

- [Black Documentation](https://black.readthedocs.io/)
- [isort Documentation](https://isort.readthedocs.io/)
- [flake8 Documentation](https://flake8.pycqa.org/)
- [Pre-commit Documentation](https://pre-commit.com/)
- [Conventional Commits](https://conventionalcommits.org/)
- [ESLint Documentation](https://eslint.org/)

---

**Remember**: These tools are here to help you write better code faster, not to make development harder! The automated formatting means you can focus on logic and functionality while the tools handle style consistency. 🚀
