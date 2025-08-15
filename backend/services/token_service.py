"""
Token service for JWT management and token operations
"""
import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app
from typing import Dict, Any, Optional, Tuple


class TokenService:
    """Service for handling JWT token operations"""

    @staticmethod
    def generate_tokens(user_id: str, email: str) -> Tuple[str, str]:
        """Generate both access and refresh tokens"""
        access_token = TokenService._generate_access_token(user_id, email)
        refresh_token = TokenService._generate_refresh_token(user_id, email)
        return access_token, refresh_token

    @staticmethod
    def _generate_access_token(user_id: str, email: str) -> str:
        """Generate JWT access token"""
        try:
            payload = {
                'user_id': str(user_id),
                'email': email,
                'token_type': 'access',
                'iat': datetime.now(timezone.utc),
                'exp': datetime.now(timezone.utc) + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
            }

            token = jwt.encode(
                payload,
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )

            return token

        except Exception as e:
            raise Exception(f"Failed to generate access token: {str(e)}")

    @staticmethod
    def _generate_refresh_token(user_id: str, email: str) -> str:
        """Generate JWT refresh token"""
        try:
            payload = {
                'user_id': str(user_id),
                'email': email,
                'token_type': 'refresh',
                'iat': datetime.now(timezone.utc),
                'exp': datetime.now(timezone.utc) + timedelta(seconds=current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])
            }

            token = jwt.encode(
                payload,
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )

            return token

        except Exception as e:
            raise Exception(f"Failed to generate refresh token: {str(e)}")

    @staticmethod
    def verify_token(token: str, expected_type: str = None) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )

            # Check token type if specified
            if expected_type and payload.get('token_type') != expected_type:
                return None

            return payload

        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        except Exception:
            return None

    @staticmethod
    def refresh_access_token(refresh_token: str) -> Optional[Tuple[str, str]]:
        """Generate new access token using refresh token"""
        try:
            # Verify refresh token
            payload = TokenService.verify_token(refresh_token, 'refresh')
            if not payload:
                return None

            user_id = payload['user_id']
            email = payload['email']

            # Generate new tokens
            access_token, new_refresh_token = TokenService.generate_tokens(user_id, email)

            return access_token, new_refresh_token

        except Exception:
            return None

    @staticmethod
    def get_token_expiry_info() -> Dict[str, int]:
        """Get token expiry configuration"""
        return {
            'access_token_expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
            'refresh_token_expires_in': current_app.config['JWT_REFRESH_TOKEN_EXPIRES']
        }
