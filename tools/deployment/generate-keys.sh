#!/bin/bash
# 🔐 Generate Secure Keys for Environment Variables

echo "🔑 Generating secure keys..."
echo ""

echo "SECRET_KEY:"
openssl rand -hex 32 || python -c "import secrets; print(secrets.token_hex(32))"
echo ""

echo "JWT_SECRET_KEY:"
openssl rand -hex 32 || python -c "import secrets; print(secrets.token_hex(32))"
echo ""

echo "✅ Copy these values to replace the ones in vercel-env-copy-paste.txt"
echo "📝 Make sure each key is different and 64 characters long"
