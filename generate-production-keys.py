#!/usr/bin/env python3
"""
Generate secure keys for CoreConnect production deployment
"""
import secrets
import string

def generate_secure_key(length=32):
    """Generate a secure random key."""
    return secrets.token_urlsafe(length)

def generate_password(length=16):
    """Generate a secure password with mixed characters."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

if __name__ == "__main__":
    print("CoreConnect Security Keys Generator")
    print("=" * 50)
    print()
    
    print("Environment Variables for Render:")
    print("-" * 30)
    print(f"SECRET_KEY={generate_secure_key(32)}")
    print(f"JWT_SECRET_KEY={generate_secure_key(32)}")
    print()
    
    print("Additional Security (if needed):")
    print("-" * 30)
    print(f"ADMIN_PASSWORD={generate_password(16)}")
    print(f"API_KEY={generate_secure_key(24)}")
    print()
    
    print("Instructions:")
    print("1. Copy the SECRET_KEY and JWT_SECRET_KEY values")
    print("2. Set them in your Render environment variables")
    print("3. Never commit these keys to git")
    print("4. Store them securely (password manager recommended)")
