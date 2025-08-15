from flask import Blueprint, jsonify, request
from services.auth_service import AuthService
from utils.auth_utils import token_required
import logging

logger = logging.getLogger(__name__)

# Create blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint with JWT authentication"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Request body is required',
                'errors': {'request': 'JSON data is required'}
            }), 400
        
        # Use AuthService for login
        auth_service = AuthService()
        result = auth_service.login_user(data)
        
        # Return appropriate status code based on result
        if result['status'] == 'success':
            return jsonify(result), 200
        else:
            return jsonify(result), 401
        
    except Exception as e:
        logger.error(f"Login endpoint error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during login',
            'errors': {'general': 'Internal server error'}
        }), 500

@auth_bp.route('/register', methods=['POST'])
@auth_bp.route('/signup', methods=['POST'])  # Add signup alias for frontend compatibility
def register():
    """Registration endpoint with enhanced validation"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Request body is required',
                'errors': {'request': 'JSON data is required'}
            }), 400
        
        # Use AuthService for registration
        auth_service = AuthService()
        result = auth_service.register_user(data)
        
        # Return appropriate status code based on result
        if result['status'] == 'success':
            return jsonify(result), 201
        else:
            return jsonify(result), 400
        
    except Exception as e:
        logger.error(f"Registration endpoint error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during registration',
            'errors': {'general': 'Internal server error'}
        }), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token using refresh token"""
    try:
        data = request.get_json()
        
        if not data or 'refreshToken' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Refresh token is required',
                'errors': {'token': 'Refresh token is required'}
            }), 400
        
        refresh_token = data['refreshToken']
        
        # Use AuthService for token refresh
        auth_service = AuthService()
        result = auth_service.refresh_token(refresh_token)
        
        # Return appropriate status code based on result
        if result['status'] == 'success':
            return jsonify(result), 200
        else:
            return jsonify(result), 401
        
    except Exception as e:
        logger.error(f"Token refresh endpoint error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during token refresh',
            'errors': {'general': 'Internal server error'}
        }), 500


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Logout endpoint"""
    try:
        # Use AuthService for logout
        auth_service = AuthService()
        result = auth_service.logout_user(None)  # Token validation already done by decorator
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Logout endpoint error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during logout',
            'errors': {'general': 'Internal server error'}
        }), 500


@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify():
    """Token verification endpoint"""
    try:
        # Get user from request context (set by token_required decorator)
        user = request.current_user
        
        # Use AuthService for user serialization
        auth_service = AuthService()
        serialized_user = auth_service._serialize_user(user)
        
        return jsonify({
            'status': 'success',
            'message': 'Token is valid',
            'data': {
                'user': serialized_user
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Token verification failed',
            'errors': {'general': 'Verification failed'}
        }), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    """Get user profile"""
    try:
        user = request.current_user
        
        return jsonify({
            'status': 'success',
            'user': serialize_user(user.copy())
        }), 200
        
    except Exception as e:
        logger.error(f"Get profile error: {str(e)}")
        return jsonify({
            'error': 'Failed to get profile',
            'status': 'error'
        }), 500

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        user = request.current_user
        
        if not data:
            return jsonify({
                'error': 'Update data is required',
                'status': 'error'
            }), 400
        
        # Fields that can be updated
        allowed_fields = ['first_name', 'last_name', 'username', 'profile', 'settings']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not update_data:
            return jsonify({
                'error': 'No valid fields to update',
                'status': 'error'
            }), 400
        
        user_model = User()
        success = user_model.update_user(str(user['_id']), update_data)
        
        if not success:
            return jsonify({
                'error': 'Failed to update profile',
                'status': 'error'
            }), 500
        
        # Get updated user
        updated_user = user_model.find_by_id(str(user['_id']))
        
        return jsonify({
            'message': 'Profile updated successfully',
            'status': 'success',
            'user': serialize_user(updated_user.copy())
        }), 200
        
    except Exception as e:
        logger.error(f"Update profile error: {str(e)}")
        return jsonify({
            'error': 'An error occurred while updating profile',
            'status': 'error'
        }), 500

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        user = request.current_user
        
        if not data or 'old_password' not in data or 'new_password' not in data:
            return jsonify({
                'error': 'Old password and new password are required',
                'status': 'error'
            }), 400
        
        old_password = data['old_password']
        new_password = data['new_password']
        
        user_model = User()
        success = user_model.change_password(str(user['_id']), old_password, new_password)
        
        if not success:
            return jsonify({
                'error': 'Failed to change password',
                'status': 'error'
            }), 500
        
        return jsonify({
            'message': 'Password changed successfully',
            'status': 'success'
        }), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400
    except Exception as e:
        logger.error(f"Change password error: {str(e)}")
        return jsonify({
            'error': 'An error occurred while changing password',
            'status': 'error'
        }), 500
