"""
JWT utilities for authentication and token management
"""
import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app
from functools import wraps
from typing import Dict, Any, Optional


def generate_token(user_id: str, email: str) -> str:
    """Generate JWT access token (legacy function for compatibility)"""
    from services.token_service import TokenService
    access_token, _ = TokenService.generate_tokens(user_id, email)
    return access_token


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload (legacy function for compatibility)"""
    from services.token_service import TokenService
    return TokenService.verify_token(token, 'access')

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, jsonify
        from models.user import User
        
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid authorization header format', 'status': 'error'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing', 'status': 'error'}), 401
        
        # Verify token
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired', 'status': 'error'}), 401
        
        # Get user from database
        try:
            user_model = User()
            user = user_model.find_by_id(payload['user_id'])
            if not user or not user.get('is_active'):
                return jsonify({'error': 'User not found or inactive', 'status': 'error'}), 401
            
            # Add user to request context
            request.current_user = user
            
        except Exception as e:
            return jsonify({'error': 'Failed to verify user', 'status': 'error'}), 401
        
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
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                token = None
        
        request.current_user = None
        
        if token:
            # Verify token
            payload = verify_token(token)
            if payload:
                try:
                    user_model = User()
                    user = user_model.find_by_id(payload['user_id'])
                    if user and user.get('is_active'):
                        request.current_user = user
                except Exception:
                    pass  # Ignore errors for optional token
        
        return f(*args, **kwargs)
    
    return decorated_function
