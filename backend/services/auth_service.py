"""
Authentication service with enhanced security features
"""
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, Tuple
import jwt
import uuid
import re
from flask import current_app
from models.user import User
from utils.database import get_db
import logging

logger = logging.getLogger(__name__)

class AuthService:
    """Enhanced authentication service with JWT tokens, refresh tokens, and security features"""
    
    def __init__(self):
        self.user_model = User()
        self.db = None
        
        # Password requirements
        self.PASSWORD_MIN_LENGTH = 8
        self.PASSWORD_PATTERNS = {
            'uppercase': re.compile(r'[A-Z]'),
            'lowercase': re.compile(r'[a-z]'),
            'digit': re.compile(r'\d'),
            'special': re.compile(r'[!@#$%^&*(),.?":{}|<>]')
        }
        
        # Common passwords to reject
        self.COMMON_PASSWORDS = {
            'password', 'password123', '123456', '123456789', 'qwerty',
            'abc123', 'password1', 'admin', 'letmein', 'welcome'
        }
    
    def _get_collection(self, collection_name: str):
        """Get database collection"""
        if self.db is None:
            self.db = get_db()
        return self.db[collection_name]
    
    def validate_password_strength(self, password: str) -> Tuple[bool, str]:
        """Validate password strength according to security requirements"""
        if len(password) < self.PASSWORD_MIN_LENGTH:
            return False, f"Password must be at least {self.PASSWORD_MIN_LENGTH} characters long"
        
        if password.lower() in self.COMMON_PASSWORDS:
            return False, "Password is too common. Please choose a stronger password"
        
        missing_requirements = []
        
        if not self.PASSWORD_PATTERNS['uppercase'].search(password):
            missing_requirements.append("at least one uppercase letter")
        
        if not self.PASSWORD_PATTERNS['lowercase'].search(password):
            missing_requirements.append("at least one lowercase letter")
        
        if not self.PASSWORD_PATTERNS['digit'].search(password):
            missing_requirements.append("at least one number")
        
        if not self.PASSWORD_PATTERNS['special'].search(password):
            missing_requirements.append("at least one special character")
        
        if missing_requirements:
            return False, f"Password must contain {', '.join(missing_requirements)}"
        
        return True, "Password meets all requirements"
    
    def generate_tokens(self, user_id: str, email: str) -> Dict[str, Any]:
        """Generate both access and refresh tokens"""
        now = datetime.now(timezone.utc)
        
        # Access token (short-lived)
        access_payload = {
            'user_id': str(user_id),
            'email': email,
            'type': 'access',
            'iat': now,
            'exp': now + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
        }
        
        access_token = jwt.encode(
            access_payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        
        # Refresh token (long-lived)
        refresh_payload = {
            'user_id': str(user_id),
            'email': email,
            'type': 'refresh',
            'jti': str(uuid.uuid4()),  # Unique token ID
            'iat': now,
            'exp': now + timedelta(seconds=current_app.config.get('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # 7 days default
        }
        
        refresh_token = jwt.encode(
            refresh_payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        
        # Store refresh token in database
        refresh_tokens = self._get_collection('refresh_tokens')
        refresh_tokens.insert_one({
            'jti': refresh_payload['jti'],
            'user_id': str(user_id),
            'token': refresh_token,
            'created_at': now,
            'expires_at': refresh_payload['exp'],
            'is_revoked': False
        })
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'access_expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
            'refresh_expires_in': current_app.config.get('JWT_REFRESH_TOKEN_EXPIRES', 604800),
            'token_type': 'Bearer'
        }
    
    def register_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new user with enhanced validation"""
        try:
            email = user_data.get('email', '').strip().lower()
            password = user_data.get('password', '')
            first_name = user_data.get('firstName') or user_data.get('first_name', '').strip()
            last_name = user_data.get('lastName') or user_data.get('last_name', '').strip()
            username = user_data.get('username', '').strip().lower() or None
            
            # Validate password strength
            is_valid, message = self.validate_password_strength(password)
            if not is_valid:
                raise ValueError(message)
            
            # Check for account lockout (prevent abuse)
            if self._is_email_locked(email):
                raise ValueError("Too many failed attempts. Please try again later.")
            
            # Create user
            user = self.user_model.create_user(
                email=email,
                password=password,
                username=username,
                first_name=first_name,
                last_name=last_name
            )
            
            # Generate tokens
            tokens = self.generate_tokens(str(user['_id']), user['email'])
            
            # Generate email verification token (will be implemented with email service)
            verification_token = self._generate_verification_token(str(user['_id']))
            
            # Store verification token
            verification_tokens = self._get_collection('verification_tokens')
            verification_tokens.insert_one({
                'user_id': str(user['_id']),
                'token': verification_token,
                'created_at': datetime.now(timezone.utc),
                'expires_at': datetime.now(timezone.utc) + timedelta(hours=24),
                'is_used': False
            })
            
            # Remove sensitive data from response
            user.pop('password_hash', None)
            
            return {
                'user': user,
                'tokens': tokens,
                'verification_token': verification_token  # For testing; in production, this would be sent via email
            }
            
        except ValueError as e:
            raise e
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            raise Exception(f"Failed to register user: {str(e)}")
    
    def login_user(self, credentials: Dict[str, Any]) -> Dict[str, Any]:
        """Authenticate user with enhanced security"""
        try:
            email = credentials.get('email', '').strip().lower()
            password = credentials.get('password', '')
            
            if not email or not password:
                raise ValueError("Email and password are required")
            
            # Check for account lockout
            if self._is_email_locked(email):
                raise ValueError("Account is temporarily locked due to too many failed attempts. Please try again later.")
            
            # Attempt authentication
            user = self.user_model.authenticate(email, password)
            
            if not user:
                # Record failed attempt
                self._record_failed_attempt(email)
                raise ValueError("Invalid email or password")
            
            if not user.get('is_active'):
                raise ValueError("Account is deactivated")
            
            # Clear failed attempts on successful login
            self._clear_failed_attempts(email)
            
            # Generate tokens
            tokens = self.generate_tokens(str(user['_id']), user['email'])
            
            # Update last login
            self.user_model.update_user(str(user['_id']), {
                'last_login': datetime.now(timezone.utc)
            })
            
            # Remove sensitive data
            user.pop('password_hash', None)
            
            return {
                'user': user,
                'tokens': tokens
            }
            
        except ValueError as e:
            raise e
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise Exception("An error occurred during login")
    
    def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """Generate new access token using refresh token"""
        try:
            # Verify refresh token
            payload = jwt.decode(
                refresh_token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            
            if payload.get('type') != 'refresh':
                raise ValueError("Invalid token type")
            
            # Check if refresh token exists and is not revoked
            refresh_tokens = self._get_collection('refresh_tokens')
            token_doc = refresh_tokens.find_one({
                'jti': payload['jti'],
                'is_revoked': False
            })
            
            if not token_doc:
                raise ValueError("Refresh token is invalid or revoked")
            
            # Verify user still exists and is active
            user = self.user_model.find_by_id(payload['user_id'])
            if not user or not user.get('is_active'):
                # Revoke the refresh token
                refresh_tokens.update_one(
                    {'jti': payload['jti']},
                    {'$set': {'is_revoked': True}}
                )
                raise ValueError("User not found or inactive")
            
            # Generate new access token
            now = datetime.now(timezone.utc)
            access_payload = {
                'user_id': payload['user_id'],
                'email': payload['email'],
                'type': 'access',
                'iat': now,
                'exp': now + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
            }
            
            access_token = jwt.encode(
                access_payload,
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            
            return {
                'access_token': access_token,
                'expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
                'token_type': 'Bearer'
            }
            
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid refresh token")
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            raise Exception("Failed to refresh token")
    
    def logout_user(self, refresh_token: str = None) -> bool:
        """Logout user by revoking refresh token"""
        try:
            if refresh_token:
                # Decode to get JTI
                payload = jwt.decode(
                    refresh_token,
                    current_app.config['JWT_SECRET_KEY'],
                    algorithms=['HS256'],
                    options={"verify_exp": False}  # Allow expired tokens for logout
                )
                
                if payload.get('type') == 'refresh' and 'jti' in payload:
                    # Revoke refresh token
                    refresh_tokens = self._get_collection('refresh_tokens')
                    refresh_tokens.update_one(
                        {'jti': payload['jti']},
                        {'$set': {'is_revoked': True}}
                    )
            
            return True
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return False
    
    def verify_email(self, token: str) -> bool:
        """Verify user email address"""
        try:
            verification_tokens = self._get_collection('verification_tokens')
            token_doc = verification_tokens.find_one({
                'token': token,
                'is_used': False,
                'expires_at': {'$gt': datetime.now(timezone.utc)}
            })
            
            if not token_doc:
                return False
            
            # Mark user as verified
            user_id = token_doc['user_id']
            self.user_model.update_user(user_id, {
                'is_verified': True,
                'verified_at': datetime.now(timezone.utc)
            })
            
            # Mark token as used
            verification_tokens.update_one(
                {'_id': token_doc['_id']},
                {'$set': {'is_used': True}}
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Email verification error: {str(e)}")
            return False
    
    def _generate_verification_token(self, user_id: str) -> str:
        """Generate email verification token"""
        payload = {
            'user_id': user_id,
            'type': 'email_verification',
            'iat': datetime.now(timezone.utc),
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }
        
        return jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
    
    def _record_failed_attempt(self, email: str):
        """Record failed login attempt"""
        failed_attempts = self._get_collection('failed_attempts')
        now = datetime.now(timezone.utc)
        
        failed_attempts.insert_one({
            'email': email,
            'attempted_at': now,
            'ip_address': None  # Could be added with request context
        })
    
    def _clear_failed_attempts(self, email: str):
        """Clear failed login attempts for email"""
        failed_attempts = self._get_collection('failed_attempts')
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=1)
        
        failed_attempts.delete_many({
            'email': email,
            'attempted_at': {'$gte': cutoff_time}
        })
    
    def _is_email_locked(self, email: str) -> bool:
        """Check if email is locked due to too many failed attempts"""
        failed_attempts = self._get_collection('failed_attempts')
        cutoff_time = datetime.now(timezone.utc) - timedelta(minutes=30)  # 30 minute lockout window
        
        recent_attempts = failed_attempts.count_documents({
            'email': email,
            'attempted_at': {'$gte': cutoff_time}
        })
        
        return recent_attempts >= 5  # Lock after 5 failed attempts
    
    def revoke_all_tokens(self, user_id: str) -> bool:
        """Revoke all refresh tokens for a user (e.g., on password change)"""
        try:
            refresh_tokens = self._get_collection('refresh_tokens')
            refresh_tokens.update_many(
                {'user_id': str(user_id)},
                {'$set': {'is_revoked': True}}
            )
            return True
        except Exception as e:
            logger.error(f"Error revoking tokens: {str(e)}")
            return False
