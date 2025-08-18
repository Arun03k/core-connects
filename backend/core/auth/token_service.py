"""
Token management service for JWT tokens
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt
from flask import current_app

from ..database.collections import RefreshTokenCollection


class TokenService:
    """Service for managing JWT tokens and refresh tokens"""

    def __init__(self):
        self.refresh_token_collection = RefreshTokenCollection()

    def generate_access_token(
        self, user_id: str, email: str, expires_in: Optional[int] = None
    ) -> str:
        """Generate JWT access token"""
        now = datetime.now(timezone.utc)
        expires_in = expires_in or current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]

        payload = {
            "user_id": str(user_id),
            "email": email,
            "type": "access",
            "iat": now,
            "exp": now + timedelta(seconds=expires_in),
        }

        return jwt.encode(
            payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256"
        )

    def generate_refresh_token(
        self, user_id: str, email: str, expires_in: Optional[int] = None
    ) -> str:
        """Generate JWT refresh token"""
        now = datetime.now(timezone.utc)
        expires_in = expires_in or current_app.config.get(
            "JWT_REFRESH_TOKEN_EXPIRES", 604800
        )

        jti = str(uuid.uuid4())

        payload = {
            "user_id": str(user_id),
            "email": email,
            "type": "refresh",
            "jti": jti,
            "iat": now,
            "exp": now + timedelta(seconds=expires_in),
        }

        refresh_token = jwt.encode(
            payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256"
        )

        # Store refresh token in database
        self.refresh_token_collection.create(
            {
                "jti": jti,
                "user_id": str(user_id),
                "token": refresh_token,
                "created_at": now,
                "expires_at": payload["exp"],
                "is_revoked": False,
            }
        )

        return refresh_token

    def generate_token_pair(self, user_id: str, email: str) -> Dict[str, Any]:
        """Generate both access and refresh tokens"""
        access_token = self.generate_access_token(user_id, email)
        refresh_token = self.generate_refresh_token(user_id, email)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "access_expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES"],
            "refresh_expires_in": current_app.config.get(
                "JWT_REFRESH_TOKEN_EXPIRES", 604800
            ),
            "token_type": "Bearer",
        }

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(
                token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"]
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Generate new access token using refresh token"""
        # Verify refresh token
        payload = self.verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise ValueError("Invalid refresh token")

        # Check if refresh token exists and is not revoked
        token_doc = self.refresh_token_collection.find_by_jti(payload["jti"])
        if not token_doc or token_doc["is_revoked"]:
            raise ValueError("Refresh token is invalid or revoked")

        # Generate new access token
        access_token = self.generate_access_token(payload["user_id"], payload["email"])

        return {
            "access_token": access_token,
            "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES"],
            "token_type": "Bearer",
        }

    def revoke_refresh_token(self, refresh_token: str) -> bool:
        """Revoke a refresh token"""
        try:
            payload = self.verify_token(refresh_token)
            if payload and payload.get("type") == "refresh" and "jti" in payload:
                return self.refresh_token_collection.revoke_by_jti(payload["jti"])
            return False
        except Exception:
            return False

    def revoke_all_user_tokens(self, user_id: str) -> bool:
        """Revoke all refresh tokens for a user"""
        return self.refresh_token_collection.revoke_all_for_user(str(user_id))

    def cleanup_expired_tokens(self) -> int:
        """Clean up expired refresh tokens"""
        return self.refresh_token_collection.cleanup_expired()
