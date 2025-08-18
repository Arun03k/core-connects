#!/bin/bash

# Setup Script for CoreConnect Development Environment
# Installs git hooks, pre-commit, and sets up code quality tools

echo "🚀 CoreConnect - Development Environment Setup"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📦 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the project root
if [ ! -f "package.json" ] && [ ! -f "README.md" ]; then
    print_error "Please run this script from the CoreConnect project root directory"
    exit 1
fi

echo ""
print_step "Installing pre-commit framework..."

# Install pre-commit
if command -v pip &> /dev/null; then
    pip install pre-commit
    print_success "Pre-commit installed via pip"
elif command -v brew &> /dev/null; then
    brew install pre-commit
    print_success "Pre-commit installed via brew"
else
    print_warning "Could not install pre-commit automatically"
    echo "Please install pre-commit manually: https://pre-commit.com/#installation"
fi

echo ""
print_step "Setting up pre-commit hooks..."

# Install pre-commit hooks
if command -v pre-commit &> /dev/null; then
    pre-commit install
    pre-commit install --hook-type commit-msg
    pre-commit install --hook-type pre-push
    print_success "Pre-commit hooks installed"
else
    print_warning "Pre-commit not available, using git hooks only"
fi

echo ""
print_step "Setting up Python development tools..."

# Setup backend dependencies
if [ -d "backend" ]; then
    cd backend
    
    # Install Python code quality tools
    pip install black isort flake8 bandit mypy
    print_success "Python code quality tools installed"
    
    # Make format scripts executable
    if [ -f "format-code.sh" ]; then
        chmod +x format-code.sh
        print_success "Made format-code.sh executable"
    fi
    
    cd ..
fi

echo ""
print_step "Setting up Frontend development tools..."

# Setup frontend dependencies
if [ -d "frontend" ]; then
    cd frontend
    
    # Install frontend dependencies if not present
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Frontend dependencies installed"
    fi
    
    cd ..
fi

echo ""
print_step "Making git hooks executable..."

# Make git hooks executable
chmod +x .git/hooks/pre-commit 2>/dev/null || print_warning "Could not make pre-commit hook executable"
chmod +x .git/hooks/pre-push 2>/dev/null || print_warning "Could not make pre-push hook executable" 
chmod +x .git/hooks/commit-msg 2>/dev/null || print_warning "Could not make commit-msg hook executable"

print_success "Git hooks configured"

echo ""
print_step "Testing setup..."

# Test if tools are working
cd backend 2>/dev/null || true
if [ -d "backend" ]; then
    cd backend
fi

if command -v black &> /dev/null && command -v isort &> /dev/null; then
    print_success "Python formatting tools ready"
else
    print_warning "Python formatting tools may not be properly installed"
fi

cd .. 2>/dev/null || true

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your development environment is now configured with:"
echo "✅ Pre-commit hooks (auto-formatting)"
echo "✅ Pre-push hooks (quality checks)"
echo "✅ Commit message validation"
echo "✅ Python code quality tools"
echo "✅ Frontend linting setup"
echo ""
echo "🔧 Quick Commands:"
echo "  Format Python code:    cd backend && ./format-code.sh"
echo "  Format Python code:    cd backend && ./format-code.bat  # Windows"
echo "  Fix frontend linting:  cd frontend && npm run lint -- --fix"
echo "  Run all pre-commit:    pre-commit run --all-files"
echo ""
echo "📝 Commit Message Format:"
echo "  feat: add new feature"
echo "  fix: resolve bug"
echo "  docs: update documentation"
echo "  style: format code"
echo ""
echo "Happy coding! 🚀"
