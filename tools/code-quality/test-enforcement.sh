#!/bin/bash

# Test script to verify code quality enforcement is working

echo "🧪 Testing Code Quality Enforcement"
echo "=================================="

cd "$(dirname "$0")/../.."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test Python formatting
echo ""
echo "🐍 Testing Python code quality..."
cd backend

if command -v black &> /dev/null; then
    if black --check . > /dev/null 2>&1; then
        print_status 0 "Python code is properly formatted (Black)"
    else
        print_status 1 "Python formatting issues found"
        print_info "Run: cd backend && black ."
    fi
else
    print_warning "Black not installed"
fi

if command -v isort &> /dev/null; then
    if isort --check-only . > /dev/null 2>&1; then
        print_status 0 "Python imports are properly sorted (isort)"
    else
        print_status 1 "Python import sorting issues found"
        print_info "Run: cd backend && isort ."
    fi
else
    print_warning "isort not installed"
fi

if command -v flake8 &> /dev/null; then
    if flake8 . --config=.flake8 > /dev/null 2>&1; then
        print_status 0 "Python linting passes (flake8)"
    else
        print_status 1 "Python linting issues found"
        print_info "Run: cd backend && flake8 . --config=.flake8"
    fi
else
    print_warning "flake8 not installed"
fi

cd ..

# Test frontend
echo ""
echo "🌐 Testing frontend code quality..."
cd frontend

if [ -f "package.json" ] && [ -d "node_modules" ]; then
    if npm run lint > /dev/null 2>&1; then
        print_status 0 "Frontend linting passes (ESLint)"
    else
        print_status 1 "Frontend linting issues found"
        print_info "Run: cd frontend && npm run lint -- --fix"
    fi
    
    if npx tsc --noEmit > /dev/null 2>&1; then
        print_status 0 "TypeScript type checking passes"
    else
        print_status 1 "TypeScript type errors found"
        print_info "Run: cd frontend && npx tsc --noEmit"
    fi
else
    print_warning "Frontend dependencies not installed"
    print_info "Run: cd frontend && npm install"
fi

cd ..

# Test pre-commit framework
echo ""
echo "🔧 Testing pre-commit framework..."

if command -v pre-commit &> /dev/null; then
    print_status 0 "Pre-commit framework installed"
    
    if [ -f ".pre-commit-config.yaml" ]; then
        print_status 0 "Pre-commit configuration found"
    else
        print_status 1 "Pre-commit configuration missing"
    fi
else
    print_status 1 "Pre-commit framework not installed"
    print_info "Run: pip install pre-commit"
fi

# Test git hooks
echo ""
echo "🪝 Testing git hooks..."
if [ -f ".git/hooks/pre-commit" ]; then
    print_status 0 "Pre-commit hook installed"
else
    print_status 1 "Pre-commit hook missing"
fi

if [ -f ".git/hooks/pre-push" ]; then
    print_status 0 "Pre-push hook installed"
else
    print_status 1 "Pre-push hook missing"
fi

if [ -f ".git/hooks/commit-msg" ]; then
    print_status 0 "Commit-msg hook installed"
else
    print_status 1 "Commit-msg hook missing"
fi

# Test configuration files
echo ""
echo "📋 Testing configuration files..."

if [ -f "backend/.flake8" ]; then
    print_status 0 "Flake8 configuration found"
else
    print_status 1 "Flake8 configuration missing"
fi

if [ -f "backend/pyproject.toml" ]; then
    print_status 0 "Black/isort configuration found"
else
    print_status 1 "Black/isort configuration missing"
fi

if [ -f "frontend/eslint.config.js" ]; then
    print_status 0 "ESLint configuration found"
else
    print_status 1 "ESLint configuration missing"
fi

# Test GitHub workflows
echo ""
echo "🚀 Testing GitHub Actions workflows..."

workflow_count=0
if [ -f ".github/workflows/style-enforcement.yml" ]; then
    print_status 0 "Style enforcement workflow found"
    ((workflow_count++))
fi

if [ -f ".github/workflows/code-quality.yml" ]; then
    print_status 0 "Advanced code quality workflow found"
    ((workflow_count++))
fi

if [ -f ".github/workflows/docker-build-test.yml" ]; then
    print_status 0 "Docker build test workflow found"
    ((workflow_count++))
fi

if [ -f ".github/workflows/api-integration-tests.yml" ]; then
    print_status 0 "API integration tests workflow found"
    ((workflow_count++))
fi

print_info "$workflow_count GitHub Actions workflows configured"

echo ""
echo "📊 Summary"
echo "=========="
print_info "Code quality enforcement system status:"

if command -v black &> /dev/null && command -v isort &> /dev/null && command -v flake8 &> /dev/null; then
    print_status 0 "Python tools installed"
else
    print_status 1 "Some Python tools missing"
fi

if command -v pre-commit &> /dev/null; then
    print_status 0 "Pre-commit framework ready"
else
    print_status 1 "Pre-commit framework needs setup"
fi

if [ -f ".git/hooks/pre-commit" ] && [ -f ".git/hooks/pre-push" ]; then
    print_status 0 "Git hooks configured"
else
    print_status 1 "Git hooks need setup"
fi

echo ""
print_info "To fix any issues, run:"
echo -e "${BLUE}  ./tools/code-quality/setup-dev.bat  # Windows${NC}"
echo -e "${BLUE}  ./tools/code-quality/setup-dev.sh   # Linux/macOS${NC}"

echo ""
echo "🎯 Code quality enforcement test complete!"
