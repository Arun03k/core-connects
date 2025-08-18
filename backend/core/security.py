"""
Security utilities and configurations for CoreConnect.
Handles JWT operations, password hashing, and security validations.
"""

import logging
import re
import secrets
from datetime import datetime, timedelta
from functools import wraps
from typing import Any, Dict, List, Optional

import bcrypt
import jwt
from flask import current_app, jsonify, request

logger = logging.getLogger(__name__)


class SecurityConfig:
    """Security configuration constants."""

    # JWT Configuration
    JWT_SECRET_KEY = secrets.token_urlsafe(32)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_ALGORITHM = "HS256"
    JWT_ISSUER = "coreconnect"

    # Password Configuration
    MIN_PASSWORD_LENGTH = 8
    MAX_PASSWORD_LENGTH = 128
    PASSWORD_HASH_ROUNDS = 12

    # Rate Limiting
    LOGIN_RATE_LIMIT = 5  # attempts per window
    LOGIN_RATE_WINDOW = 900  # 15 minutes in seconds
    API_RATE_LIMIT = 100  # requests per minute

    # Security Headers
    SECURITY_HEADERS = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'",
    }


class JWTManager:
    """Handles JWT token operations."""

    @staticmethod
    def generate_tokens(user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate access and refresh tokens for a user.

        Args:
            user_data: User information to include in token

        Returns:
            dict: Contains access_token, refresh_token, expires_in, token_type
        """
        now = datetime.utcnow()

        # Access token payload
        access_payload = {
            "user_id": str(user_data["_id"]),
            "email": user_data["email"],
            "name": user_data["name"],
            "is_verified": user_data.get("is_verified", False),
            "iat": now,
            "exp": now + SecurityConfig.JWT_ACCESS_TOKEN_EXPIRES,
            "iss": SecurityConfig.JWT_ISSUER,
            "type": "access",
        }

        # Refresh token payload
        refresh_payload = {
            "user_id": str(user_data["_id"]),
            "iat": now,
            "exp": now + SecurityConfig.JWT_REFRESH_TOKEN_EXPIRES,
            "iss": SecurityConfig.JWT_ISSUER,
            "type": "refresh",
            "jti": secrets.token_urlsafe(32),  # Unique token ID
        }

        try:
            access_token = jwt.encode(
                access_payload,
                SecurityConfig.JWT_SECRET_KEY,
                algorithm=SecurityConfig.JWT_ALGORITHM,
            )

            refresh_token = jwt.encode(
                refresh_payload,
                SecurityConfig.JWT_SECRET_KEY,
                algorithm=SecurityConfig.JWT_ALGORITHM,
            )

            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires_in": int(
                    SecurityConfig.JWT_ACCESS_TOKEN_EXPIRES.total_seconds()
                ),
                "token_type": "Bearer",
                "refresh_expires_in": int(
                    SecurityConfig.JWT_REFRESH_TOKEN_EXPIRES.total_seconds()
                ),
            }

        except Exception as e:
            logger.error(f"Failed to generate JWT tokens: {e}")
            raise ValueError("Failed to generate authentication tokens")

    @staticmethod
    def verify_token(
        token: str, token_type: str = "access"
    ) -> Optional[Dict[str, Any]]:
        """
        Verify and decode a JWT token.

        Args:
            token: JWT token to verify
            token_type: Expected token type ('access' or 'refresh')

        Returns:
            dict: Decoded token payload or None if invalid
        """
        try:
            payload = jwt.decode(
                token,
                SecurityConfig.JWT_SECRET_KEY,
                algorithms=[SecurityConfig.JWT_ALGORITHM],
                issuer=SecurityConfig.JWT_ISSUER,
            )

            # Verify token type
            if payload.get("type") != token_type:
                logger.warning(
                    f"Invalid token type. Expected: {token_type}, Got: {payload.get('type')}"
                )
                return None

            return payload

        except jwt.ExpiredSignatureError:
            logger.info("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            return None
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None


class PasswordManager:
    """Handles password hashing and validation."""

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt.

        Args:
            password: Plain text password

        Returns:
            str: Hashed password
        """
        try:
            password_bytes = password.encode("utf-8")
            salt = bcrypt.gensalt(rounds=SecurityConfig.PASSWORD_HASH_ROUNDS)
            hashed = bcrypt.hashpw(password_bytes, salt)
            return hashed.decode("utf-8")
        except Exception as e:
            logger.error(f"Password hashing failed: {e}")
            raise ValueError("Failed to hash password")

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash.

        Args:
            password: Plain text password
            hashed_password: Hashed password to verify against

        Returns:
            bool: True if password matches, False otherwise
        """
        try:
            password_bytes = password.encode("utf-8")
            hashed_bytes = hashed_password.encode("utf-8")
            return bcrypt.checkpw(password_bytes, hashed_bytes)
        except Exception as e:
            logger.error(f"Password verification failed: {e}")
            return False

    @staticmethod
    def validate_password_strength(password: str) -> Dict[str, Any]:
        """
        Validate password strength against security requirements.

        Args:
            password: Password to validate

        Returns:
            dict: Validation result with is_valid and requirements
        """
        if not password:
            return {
                "is_valid": False,
                "message": "Password is required",
                "requirements": [],
            }

        requirements = []

        # Length check
        if len(password) < SecurityConfig.MIN_PASSWORD_LENGTH:
            requirements.append(
                f"Must be at least {SecurityConfig.MIN_PASSWORD_LENGTH} characters long"
            )

        if len(password) > SecurityConfig.MAX_PASSWORD_LENGTH:
            requirements.append(
                f"Must not exceed {SecurityConfig.MAX_PASSWORD_LENGTH} characters"
            )

        # Character requirements
        if not re.search(r"[A-Z]", password):
            requirements.append("Must contain at least one uppercase letter")

        if not re.search(r"[a-z]", password):
            requirements.append("Must contain at least one lowercase letter")

        if not re.search(r"\d", password):
            requirements.append("Must contain at least one digit")

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            requirements.append("Must contain at least one special character")

        # Common password check
        common_passwords = [
            "password",
            "123456",
            "12345678",
            "qwerty",
            "abc123",
            "password123",
            "admin",
            "letmein",
            "welcome",
            "123123",
        ]

        if password.lower() in common_passwords:
            requirements.append("Cannot be a commonly used password")

        is_valid = len(requirements) == 0

        return {
            "is_valid": is_valid,
            "message": (
                "Password meets all requirements"
                if is_valid
                else "Password does not meet security requirements"
            ),
            "requirements": requirements,
            "strength_score": PasswordManager._calculate_strength_score(password),
        }

    @staticmethod
    def _calculate_strength_score(password: str) -> int:
        """Calculate password strength score (0-4)."""
        score = 0

        if len(password) >= 8:
            score += 1
        if re.search(r"[A-Z]", password):
            score += 1
        if re.search(r"[a-z]", password):
            score += 1
        if re.search(r"\d", password):
            score += 1
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            score += 1

        return min(score, 4)


class SecurityMiddleware:
    """Security middleware for request processing."""

    @staticmethod
    def add_security_headers(response):
        """Add security headers to response."""
        for header, value in SecurityConfig.SECURITY_HEADERS.items():
            response.headers[header] = value
        return response

    @staticmethod
    def validate_request_size(max_size: int = 1024 * 1024):  # 1MB default
        """Validate request content length."""

        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if request.content_length and request.content_length > max_size:
                    return (
                        jsonify({"success": False, "message": "Request too large"}),
                        413,
                    )
                return f(*args, **kwargs)

            return decorated_function

        return decorator

    @staticmethod
    def sanitize_input(data: Any) -> Any:
        """Sanitize input data to prevent XSS and injection attacks."""
        if isinstance(data, str):
            # Basic XSS prevention
            data = data.replace("<", "&lt;").replace(">", "&gt;")
            data = data.replace('"', "&quot;").replace("'", "&#x27;")
            return data.strip()
        elif isinstance(data, dict):
            return {
                key: SecurityMiddleware.sanitize_input(value)
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [SecurityMiddleware.sanitize_input(item) for item in data]
        else:
            return data


def generate_secure_token(length: int = 32) -> str:
    """Generate a cryptographically secure random token."""
    return secrets.token_urlsafe(length)


def generate_verification_code(length: int = 6) -> str:
    """Generate a numeric verification code."""
    return "".join(secrets.choice("0123456789") for _ in range(length))


def require_auth(f):
    """Decorator to require authentication for endpoints."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return (
                jsonify({"success": False, "message": "Authentication required"}),
                401,
            )

        token = auth_header.split(" ")[1]
        payload = JWTManager.verify_token(token, "access")

        if not payload:
            return (
                jsonify({"success": False, "message": "Invalid or expired token"}),
                401,
            )

        # Add user info to request context
        request.current_user = payload

        return f(*args, **kwargs)

    return decorated_function


def require_verified_user(f):
    """Decorator to require email verification."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(request, "current_user"):
            return (
                jsonify({"success": False, "message": "Authentication required"}),
                401,
            )

        if not request.current_user.get("is_verified", False):
            return (
                jsonify({"success": False, "message": "Email verification required"}),
                403,
            )

        return f(*args, **kwargs)

    return decorated_function
