from flask import Blueprint, jsonify, request
from models.user import User
from utils.auth_utils import generate_token, token_required
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# Create blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def serialize_user(user_dict):
    """Convert MongoDB document to JSON serializable format"""
    if user_dict and '_id' in user_dict:
        user_dict['id'] = str(user_dict['_id'])
        user_dict.pop('_id', None)
    user_dict.pop('password_hash', None)  # Never return password hash
    return user_dict

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint with MongoDB authentication"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({
                'error': 'Email and password are required',
                'status': 'error'
            }), 400
        
        email = data['email'].strip()
        password = data['password']
        
        if not email or not password:
            return jsonify({
                'error': 'Email and password cannot be empty',
                'status': 'error'
            }), 400
        
        # Authenticate user
        user_model = User()
        user = user_model.authenticate(email, password)
        
        if not user:
            return jsonify({
                'error': 'Invalid email or password',
                'status': 'error'
            }), 401
        
        if not user.get('is_active'):
            return jsonify({
                'error': 'Account is deactivated',
                'status': 'error'
            }), 401
        
        # Generate JWT token
        token = generate_token(str(user['_id']), user['email'])
        
        return jsonify({
            'message': 'Login successful',
            'status': 'success',
            'token': token,
            'user': serialize_user(user.copy())
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            'error': 'An error occurred during login',
            'status': 'error'
        }), 500

@auth_bp.route('/register', methods=['POST'])
@auth_bp.route('/signup', methods=['POST'])  # Add signup alias for frontend compatibility
def register():
    """Registration endpoint with MongoDB user creation"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Request data is required',
                'status': 'error'
            }), 400
        
        # Required fields
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                'error': 'Email and password are required',
                'status': 'error'
            }), 400
        
        # Optional fields
        username = data.get('username', '').strip() or None
        first_name = data.get('first_name', '').strip() or None
        last_name = data.get('last_name', '').strip() or None
        
        # Create user
        user_model = User()
        user = user_model.create_user(
            email=email,
            password=password,
            username=username,
            first_name=first_name,
            last_name=last_name
        )
        
        # Generate JWT token
        token = generate_token(str(user['_id']), user['email'])
        
        return jsonify({
            'message': 'Registration successful',
            'status': 'success',
            'token': token,
            'user': serialize_user(user.copy())
        }), 201
        
    except ValueError as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'error': 'An error occurred during registration',
            'status': 'error'
        }), 500

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Logout endpoint"""
    # In a stateless JWT setup, logout is handled client-side by removing the token
    # For additional security, you could maintain a blacklist of tokens
    return jsonify({
        'message': 'Logout successful',
        'status': 'success'
    }), 200

@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify():
    """Token verification endpoint"""
    try:
        user = request.current_user
        
        return jsonify({
            'message': 'Token is valid',
            'status': 'success',
            'user': serialize_user(user.copy())
        }), 200
        
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return jsonify({
            'error': 'Token verification failed',
            'status': 'error'
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
