"""
Response utilities for consistent API responses.
Provides standardized response formats and error handling.
"""

from flask import jsonify, Response
from typing import Any, Dict, Optional, Union, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class APIResponse:
    """Standardized API response builder."""
    
    @staticmethod
    def success(
        data: Any = None,
        message: str = "Operation successful",
        status_code: int = 200,
        meta: Optional[Dict[str, Any]] = None
    ) -> tuple[Response, int]:
        """
        Create a successful API response.
        
        Args:
            data: Response data
            message: Success message
            status_code: HTTP status code
            meta: Additional metadata
            
        Returns:
            tuple: Flask response and status code
        """
        response_data = {
            'success': True,
            'message': message,
            'data': data,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        if meta:
            response_data['meta'] = meta
            
        return jsonify(response_data), status_code
    
    @staticmethod
    def error(
        message: str = "An error occurred",
        status_code: int = 400,
        error_code: Optional[str] = None,
        details: Optional[Any] = None,
        validation_errors: Optional[Dict[str, List[str]]] = None
    ) -> tuple[Response, int]:
        """
        Create an error API response.
        
        Args:
            message: Error message
            status_code: HTTP status code
            error_code: Application-specific error code
            details: Additional error details
            validation_errors: Field validation errors
            
        Returns:
            tuple: Flask response and status code
        """
        response_data = {
            'success': False,
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        if error_code:
            response_data['error_code'] = error_code
            
        if details:
            response_data['details'] = details
            
        if validation_errors:
            response_data['validation_errors'] = validation_errors
            
        # Log error for debugging
        logger.error(f"API Error {status_code}: {message}")
        if details:
            logger.error(f"Error details: {details}")
            
        return jsonify(response_data), status_code
    
    @staticmethod
    def paginated(
        data: List[Any],
        page: int,
        per_page: int,
        total: int,
        message: str = "Data retrieved successfully"
    ) -> tuple[Response, int]:
        """
        Create a paginated API response.
        
        Args:
            data: List of items
            page: Current page number
            per_page: Items per page
            total: Total number of items
            message: Success message
            
        Returns:
            tuple: Flask response and status code
        """
        total_pages = (total + per_page - 1) // per_page
        has_next = page < total_pages
        has_prev = page > 1
        
        meta = {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': total_pages,
                'has_next': has_next,
                'has_prev': has_prev,
                'next_page': page + 1 if has_next else None,
                'prev_page': page - 1 if has_prev else None
            }
        }
        
        return APIResponse.success(
            data=data,
            message=message,
            meta=meta
        )
    
    @staticmethod
    def created(
        data: Any = None,
        message: str = "Resource created successfully",
        location: Optional[str] = None
    ) -> tuple[Response, int]:
        """
        Create a resource creation response.
        
        Args:
            data: Created resource data
            message: Success message
            location: Location of created resource
            
        Returns:
            tuple: Flask response with 201 status
        """
        response, status_code = APIResponse.success(
            data=data,
            message=message,
            status_code=201
        )
        
        if location:
            response.headers['Location'] = location
            
        return response, status_code
    
    @staticmethod
    def no_content(message: str = "Operation completed successfully") -> tuple[Response, int]:
        """
        Create a no content response.
        
        Args:
            message: Success message
            
        Returns:
            tuple: Flask response with 204 status
        """
        return APIResponse.success(
            message=message,
            status_code=204
        )

# Common error responses
class ErrorResponses:
    """Pre-defined common error responses."""
    
    @staticmethod
    def unauthorized(message: str = "Authentication required") -> tuple[Response, int]:
        """Return 401 Unauthorized response."""
        return APIResponse.error(
            message=message,
            status_code=401,
            error_code="UNAUTHORIZED"
        )
    
    @staticmethod
    def forbidden(message: str = "Access denied") -> tuple[Response, int]:
        """Return 403 Forbidden response."""
        return APIResponse.error(
            message=message,
            status_code=403,
            error_code="FORBIDDEN"
        )
    
    @staticmethod
    def not_found(message: str = "Resource not found") -> tuple[Response, int]:
        """Return 404 Not Found response."""
        return APIResponse.error(
            message=message,
            status_code=404,
            error_code="NOT_FOUND"
        )
    
    @staticmethod
    def validation_error(
        message: str = "Validation failed",
        validation_errors: Dict[str, List[str]] = None
    ) -> tuple[Response, int]:
        """Return 422 Validation Error response."""
        return APIResponse.error(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            validation_errors=validation_errors
        )
    
    @staticmethod
    def conflict(message: str = "Resource conflict") -> tuple[Response, int]:
        """Return 409 Conflict response."""
        return APIResponse.error(
            message=message,
            status_code=409,
            error_code="CONFLICT"
        )
    
    @staticmethod
    def rate_limit_exceeded(message: str = "Rate limit exceeded") -> tuple[Response, int]:
        """Return 429 Rate Limit Exceeded response."""
        return APIResponse.error(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED"
        )
    
    @staticmethod
    def internal_error(message: str = "Internal server error") -> tuple[Response, int]:
        """Return 500 Internal Server Error response."""
        return APIResponse.error(
            message=message,
            status_code=500,
            error_code="INTERNAL_ERROR"
        )
    
    @staticmethod
    def service_unavailable(message: str = "Service temporarily unavailable") -> tuple[Response, int]:
        """Return 503 Service Unavailable response."""
        return APIResponse.error(
            message=message,
            status_code=503,
            error_code="SERVICE_UNAVAILABLE"
        )

# Authentication-specific responses
class AuthResponses:
    """Authentication-specific response helpers."""
    
    @staticmethod
    def login_success(user_data: Dict[str, Any], tokens: Dict[str, Any]) -> tuple[Response, int]:
        """Return successful login response."""
        return APIResponse.success(
            data={
                'user': {
                    'id': str(user_data['_id']),
                    'name': user_data['name'],
                    'email': user_data['email'],
                    'is_verified': user_data.get('is_verified', False),
                    'created_at': user_data.get('created_at')
                },
                **tokens
            },
            message="Login successful"
        )
    
    @staticmethod
    def registration_success(user_data: Dict[str, Any]) -> tuple[Response, int]:
        """Return successful registration response."""
        return APIResponse.created(
            data={
                'user': {
                    'id': str(user_data['_id']),
                    'name': user_data['name'],
                    'email': user_data['email'],
                    'is_verified': user_data.get('is_verified', False),
                    'created_at': user_data.get('created_at')
                }
            },
            message="Account created successfully. Please check your email for verification."
        )
    
    @staticmethod
    def logout_success() -> tuple[Response, int]:
        """Return successful logout response."""
        return APIResponse.success(
            message="Logged out successfully"
        )
    
    @staticmethod
    def token_refresh_success(tokens: Dict[str, Any]) -> tuple[Response, int]:
        """Return successful token refresh response."""
        return APIResponse.success(
            data=tokens,
            message="Tokens refreshed successfully"
        )
    
    @staticmethod
    def password_reset_email_sent() -> tuple[Response, int]:
        """Return password reset email sent response."""
        return APIResponse.success(
            message="If an account with that email exists, a password reset link has been sent."
        )
    
    @staticmethod
    def password_reset_success() -> tuple[Response, int]:
        """Return password reset success response."""
        return APIResponse.success(
            message="Password has been reset successfully"
        )
    
    @staticmethod
    def email_verification_success() -> tuple[Response, int]:
        """Return email verification success response."""
        return APIResponse.success(
            message="Email verified successfully"
        )
    
    @staticmethod
    def verification_email_sent() -> tuple[Response, int]:
        """Return verification email sent response."""
        return APIResponse.success(
            message="Verification email has been sent"
        )

# Validation helpers
class ValidationHelper:
    """Helper functions for request validation."""
    
    @staticmethod
    def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> Optional[Dict[str, List[str]]]:
        """
        Validate that required fields are present and not empty.
        
        Args:
            data: Request data
            required_fields: List of required field names
            
        Returns:
            dict: Validation errors or None if valid
        """
        errors = {}
        
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                errors[field] = [f"{field.replace('_', ' ').title()} is required"]
        
        return errors if errors else None
    
    @staticmethod
    def validate_email(email: str) -> Optional[str]:
        """
        Validate email format.
        
        Args:
            email: Email to validate
            
        Returns:
            str: Error message or None if valid
        """
        import re
        
        if not email:
            return "Email is required"
        
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return "Invalid email format"
        
        return None
    
    @staticmethod
    def validate_password(password: str) -> Optional[List[str]]:
        """
        Validate password strength.
        
        Args:
            password: Password to validate
            
        Returns:
            list: List of validation errors or None if valid
        """
        from .security import PasswordManager
        
        validation_result = PasswordManager.validate_password_strength(password)
        
        if not validation_result['is_valid']:
            return validation_result['requirements']
        
        return None
