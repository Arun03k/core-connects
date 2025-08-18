#!/bin/bash

# Optional Code Formatting Script for CoreConnect Backend
# Run this manually if you want to format your Python code

echo "🔧 CoreConnect - Code Formatting (Optional)"
echo "=========================================="

# Navigate to project root
cd "$(dirname "$0")/../.."

# Check if we're in the project root
if [ ! -d "backend" ]; then
    echo "❌ Error: Backend directory not found"
    exit 1
fi

cd backend

# Install required tools if not present
echo "📦 Installing/updating formatting tools..."
pip install black isort > /dev/null 2>&1

echo ""
echo "🎨 Formatting Python code with Black..."
black . --line-length=88

echo ""
echo "📋 Organizing imports with isort..."
isort . --profile=black

echo ""
echo "🎉 Code formatting completed!"
echo "This is optional - you can commit without running this."
