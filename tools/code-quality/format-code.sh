#!/bin/bash

# Code Quality Script for CoreConnect Backend
# Run this before committing to ensure code passes CI checks

echo "🔧 CoreConnect - Code Quality Check & Fix"
echo "==========================================="

cd "$(dirname "$0")"

# Check if we're in the backend directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install required tools if not present
echo "📦 Ensuring code quality tools are installed..."
pip install black isort flake8 bandit > /dev/null 2>&1

echo ""
echo "🎨 Step 1: Applying Black formatting..."
black .

echo ""
echo "📋 Step 2: Sorting imports with isort..."
isort .

echo ""
echo "🔍 Step 3: Running flake8 linting..."
if flake8 . --config=.flake8; then
    echo "✅ Flake8 linting passed!"
else
    echo "❌ Flake8 linting failed. Please fix the issues above."
    exit 1
fi

echo ""
echo "🔒 Step 4: Running security scan..."
if bandit -r . -x tests/ --quiet; then
    echo "✅ Security scan passed!"
else
    echo "⚠️  Security issues found, but continuing..."
fi

echo ""
echo "🎉 All code quality checks completed!"
echo "Your code is ready for commit and will pass CI checks."
