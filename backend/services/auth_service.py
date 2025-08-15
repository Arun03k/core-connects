"""
Authentication service for user authentication business logic
"""
from typing import Dict, Any
from models.user import User
from services.token_service import TokenService
from utils.password_utils import PasswordValidator
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Service for handling authentication business logic"""

    def __init__(self):
        self.user_model = User()
        self.password_validator = PasswordValidator()

    def register_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Register a new user with validation and token generation

        Args:
            user_data: Dictionary containing user registration data

        Returns:
            Dictionary with status, user data, and tokens
        """
        try:
            # Extract and validate required fields
            email = user_data.get('email', '').strip().lower()
            password = user_data.get('password', '')
            first_name = user_data.get('firstName', user_data.get('first_name', ''))
            last_name = user_data.get('lastName', user_data.get('last_name', ''))
            username = user_data.get('username', '')

            # Basic validation
            if not email or not password:
                raise ValueError("Email and password are required")

            # Password strength validation
            is_valid, password_errors = self.password_validator.validate_password_strength(password)
            if not is_valid:
                raise ValueError(f"Password validation failed: {'; '.join(password_errors)}")

            # Create user
            user = self.user_model.create_user(
                email=email,
                password=password,
                username=username if username else None,
                first_name=first_name,
                last_name=last_name
            )

            # Generate tokens
            access_token, refresh_token = TokenService.generate_tokens(str(user['_id']), user['email'])

            # Get token expiry info
            expiry_info = TokenService.get_token_expiry_info()

            # Prepare response
            return {
                'status': 'success',
                'message': 'Registration successful',
                'data': {
                    'user': self._serialize_user(user),
                    'accessToken': access_token,
                    'refreshToken': refresh_token,
                    'expiresIn': expiry_info['access_token_expires_in']
                }
            }

        except ValueError as e:
            logger.warning(f"Registration validation error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'errors': {'validation': str(e)}
            }
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return {
                'status': 'error',
                'message': 'An error occurred during registration',
                'errors': {'general': 'Registration failed'}
            }

    def login_user(self, credentials: Dict[str, Any]) -> Dict[str, Any]:
        """
        Authenticate user login with credentials

        Args:
            credentials: Dictionary containing login credentials

        Returns:
            Dictionary with status, user data, and tokens
        """
        try:
            # Extract credentials
            email = credentials.get('email', '').strip().lower()
            password = credentials.get('password', '')

            # Basic validation
            if not email or not password:
                raise ValueError("Email and password are required")

            # Authenticate user
            user = self.user_model.authenticate(email, password)

            if not user:
                raise ValueError("Invalid email or password")

            if not user.get('is_active'):
                raise ValueError("Account is deactivated")

            # Generate tokens
            access_token, refresh_token = TokenService.generate_tokens(str(user['_id']), user['email'])

            # Get token expiry info
            expiry_info = TokenService.get_token_expiry_info()

            # Prepare response
            return {
                'status': 'success',
                'message': 'Login successful',
                'data': {
                    'user': self._serialize_user(user),
                    'accessToken': access_token,
                    'refreshToken': refresh_token,
                    'expiresIn': expiry_info['access_token_expires_in']
                }
            }

        except ValueError as e:
            logger.warning(f"Login validation error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'errors': {'credentials': str(e)}
            }
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return {
                'status': 'error',
                'message': 'An error occurred during login',
                'errors': {'general': 'Login failed'}
            }

    def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh access token using refresh token

        Args:
            refresh_token: The refresh token

        Returns:
            Dictionary with new tokens or error
        """
        try:
            result = TokenService.refresh_access_token(refresh_token)

            if not result:
                raise ValueError("Invalid or expired refresh token")

            access_token, new_refresh_token = result
            expiry_info = TokenService.get_token_expiry_info()

            return {
                'status': 'success',
                'message': 'Token refreshed successfully',
                'data': {
                    'accessToken': access_token,
                    'refreshToken': new_refresh_token,
                    'expiresIn': expiry_info['access_token_expires_in']
                }
            }

        except ValueError as e:
            logger.warning(f"Token refresh error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'errors': {'token': str(e)}
            }
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return {
                'status': 'error',
                'message': 'An error occurred during token refresh',
                'errors': {'general': 'Token refresh failed'}
            }

    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify access token and return user data

        Args:
            token: The access token to verify

        Returns:
            Dictionary with user data or error
        """
        try:
            # Verify token
            payload = TokenService.verify_token(token, 'access')
            if not payload:
                raise ValueError("Invalid or expired token")

            # Get user data
            user = self.user_model.find_by_id(payload['user_id'])
            if not user or not user.get('is_active'):
                raise ValueError("User not found or inactive")

            return {
                'status': 'success',
                'message': 'Token is valid',
                'data': {
                    'user': self._serialize_user(user)
                }
            }

        except ValueError as e:
            logger.warning(f"Token verification error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'errors': {'token': str(e)}
            }
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            return {
                'status': 'error',
                'message': 'Token verification failed',
                'errors': {'general': 'Verification failed'}
            }

    def logout_user(self, token: str) -> Dict[str, Any]:
        """
        Logout user (for future token blacklisting)

        Args:
            token: The access token

        Returns:
            Dictionary with logout status
        """
        try:
            # For now, logout is handled client-side by removing tokens
            # In the future, we can implement token blacklisting here
            return {
                'status': 'success',
                'message': 'Logout successful'
            }

        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return {
                'status': 'error',
                'message': 'An error occurred during logout',
                'errors': {'general': 'Logout failed'}
            }

    @staticmethod
    def _serialize_user(user: Dict[str, Any]) -> Dict[str, Any]:
        """
        Serialize user data for API response

        Args:
            user: User document from database

        Returns:
            Serialized user data
        """
        return {
            'id': str(user['_id']),
            'email': user['email'],
            'firstName': user.get('first_name', ''),
            'lastName': user.get('last_name', ''),
            'username': user.get('username', ''),
            'isVerified': user.get('is_verified', False),
            'isActive': user.get('is_active', True),
            'createdAt': user.get('created_at'),
            'lastLogin': user.get('last_login'),
            'profile': user.get('profile', {}),
            'settings': user.get('settings', {})
        }
