"""
JWT utilities for authentication and token management
"""

from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Any, Dict, Optional

import jwt
from flask import current_app


def generate_token(user_id: str, email: str) -> str:
    """Generate JWT access token"""
    try:
        payload = {
            "user_id": str(user_id),
            "email": email,
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc)
            + timedelta(seconds=current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]),
        }

        token = jwt.encode(
            payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256"
        )

        return token

    except Exception as e:
        raise Exception(f"Failed to generate token: {str(e)}")


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(
            token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"]
        )
        return payload

    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None


def token_required(f):
    """Decorator to require valid JWT token"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import jsonify, request

        from models.user import User

        token = None

        # Get token from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return (
                    jsonify(
                        {
                            "error": "Invalid authorization header format",
                            "status": "error",
                        }
                    ),
                    401,
                )

        if not token:
            return jsonify({"error": "Token is missing", "status": "error"}), 401

        # Verify token
        payload = verify_token(token)
        if not payload:
            return (
                jsonify({"error": "Token is invalid or expired", "status": "error"}),
                401,
            )

        # Get user from database
        try:
            user_model = User()
            user = user_model.find_by_id(payload["user_id"])
            if not user or not user.get("is_active"):
                return (
                    jsonify({"error": "User not found or inactive", "status": "error"}),
                    401,
                )

            # Add user to request context
            request.current_user = user

        except Exception as e:
            return jsonify({"error": "Failed to verify user", "status": "error"}), 401

        return f(*args, **kwargs)

    return decorated_function


def optional_token(f):
    """Decorator to optionally require JWT token (user can be None)"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request

        from models.user import User

        token = None

        # Get token from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                token = None

        request.current_user = None

        if token:
            # Verify token
            payload = verify_token(token)
            if payload:
                try:
                    user_model = User()
                    user = user_model.find_by_id(payload["user_id"])
                    if user and user.get("is_active"):
                        request.current_user = user
                except Exception:
                    pass  # Ignore errors for optional token

        return f(*args, **kwargs)

    return decorated_function
