"""
Test authentication services and enhanced JWT functionality
"""
import pytest
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from services.auth_service import AuthService
from services.token_service import TokenService
from utils.password_utils import PasswordValidator
from utils.database import get_db
import json


@pytest.fixture
def app():
    """Create Flask app for testing"""
    app = create_app('testing')
    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


@pytest.fixture
def auth_service():
    """Create AuthService instance"""
    return AuthService()


class TestPasswordValidator:
    """Test password validation functionality"""
    
    def test_strong_password_validation(self):
        """Test validation of strong password"""
        validator = PasswordValidator()
        is_valid, errors = validator.validate_password_strength("StrongPassword123!")
        
        assert is_valid is True
        assert len(errors) == 0
    
    def test_weak_password_validation(self):
        """Test validation of weak password"""
        validator = PasswordValidator()
        is_valid, errors = validator.validate_password_strength("weak")
        
        assert is_valid is False
        assert len(errors) > 0
    
    def test_common_password_validation(self):
        """Test validation against common passwords"""
        validator = PasswordValidator()
        is_valid, errors = validator.validate_password_strength("password123")
        
        assert is_valid is False
        assert any("common" in error.lower() for error in errors)
    
    def test_password_strength_score(self):
        """Test password strength scoring"""
        validator = PasswordValidator()
        
        # Strong password should have high score
        strong_score = validator.get_password_strength_score("StrongPassword123!")
        assert strong_score >= 80
        
        # Weak password should have low score
        weak_score = validator.get_password_strength_score("weak")
        assert weak_score < 50


class TestTokenService:
    """Test JWT token service functionality"""
    
    def test_token_generation(self, app):
        """Test token generation"""
        with app.app_context():
            user_id = "64f1a2b3c4d5e6f7g8h9i0j1"
            email = "test@example.com"
            
            access_token, refresh_token = TokenService.generate_tokens(user_id, email)
            
            assert access_token is not None
            assert refresh_token is not None
            assert isinstance(access_token, str)
            assert isinstance(refresh_token, str)
    
    def test_token_verification(self, app):
        """Test token verification"""
        with app.app_context():
            user_id = "64f1a2b3c4d5e6f7g8h9i0j1"
            email = "test@example.com"
            
            access_token, refresh_token = TokenService.generate_tokens(user_id, email)
            
            # Verify access token
            access_payload = TokenService.verify_token(access_token, 'access')
            assert access_payload is not None
            assert access_payload['user_id'] == user_id
            assert access_payload['email'] == email
            assert access_payload['token_type'] == 'access'
            
            # Verify refresh token
            refresh_payload = TokenService.verify_token(refresh_token, 'refresh')
            assert refresh_payload is not None
            assert refresh_payload['user_id'] == user_id
            assert refresh_payload['email'] == email
            assert refresh_payload['token_type'] == 'refresh'
    
    def test_token_refresh(self, app):
        """Test token refresh functionality"""
        with app.app_context():
            user_id = "64f1a2b3c4d5e6f7g8h9i0j1"
            email = "test@example.com"
            
            _, refresh_token = TokenService.generate_tokens(user_id, email)
            
            # Refresh tokens
            result = TokenService.refresh_access_token(refresh_token)
            assert result is not None
            
            new_access_token, new_refresh_token = result
            assert new_access_token is not None
            assert new_refresh_token is not None
            
            # Verify new tokens
            new_access_payload = TokenService.verify_token(new_access_token, 'access')
            assert new_access_payload['user_id'] == user_id


class TestAuthService:
    """Test authentication service functionality"""
    
    def test_password_validation_in_registration(self, app, auth_service):
        """Test password validation during registration"""
        with app.app_context():
            # Clean up any existing test user
            try:
                db = get_db()
                db.users.delete_many({'email': 'pwdtest@example.com'})
            except:
                pass
            
            # Test weak password
            weak_data = {
                'email': 'pwdtest@example.com',
                'password': 'weak',
                'firstName': 'Test',
                'lastName': 'User'
            }
            
            result = auth_service.register_user(weak_data)
            assert result['status'] == 'error'
            assert 'validation' in result['message'].lower()
            
            # Test strong password
            strong_data = {
                'email': 'pwdtest@example.com',
                'password': 'StrongPassword123!',
                'firstName': 'Test',
                'lastName': 'User'
            }
            
            result = auth_service.register_user(strong_data)
            assert result['status'] == 'success'
            assert 'data' in result
            assert 'accessToken' in result['data']
            assert 'refreshToken' in result['data']


class TestEnhancedAuthAPI:
    """Test enhanced authentication API endpoints"""
    
    def test_registration_with_strong_password(self, client, app):
        """Test registration endpoint with strong password"""
        with app.app_context():
            # Clean up any existing test user
            try:
                db = get_db()
                db.users.delete_many({'email': 'apitest@example.com'})
            except:
                pass
        
        response = client.post('/api/auth/register', 
            json={
                'email': 'apitest@example.com',
                'password': 'StrongPassword123!',
                'firstName': 'API',
                'lastName': 'Test'
            })
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'data' in data
        assert 'accessToken' in data['data']
        assert 'refreshToken' in data['data']
        assert 'expiresIn' in data['data']
        assert data['data']['user']['email'] == 'apitest@example.com'
    
    def test_registration_with_weak_password(self, client, app):
        """Test registration endpoint with weak password"""
        response = client.post('/api/auth/register', 
            json={
                'email': 'weaktest@example.com',
                'password': 'weak',
                'firstName': 'Weak',
                'lastName': 'Test'
            })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'validation' in data['message'].lower()
    
    def test_token_refresh_endpoint(self, client, app):
        """Test token refresh endpoint"""
        with app.app_context():
            # Clean up and create test user
            try:
                db = get_db()
                db.users.delete_many({'email': 'refreshtest@example.com'})
            except:
                pass
        
        # Register user first
        reg_response = client.post('/api/auth/register', 
            json={
                'email': 'refreshtest@example.com',
                'password': 'RefreshTest123!',
                'firstName': 'Refresh',
                'lastName': 'Test'
            })
        
        assert reg_response.status_code == 201
        reg_data = json.loads(reg_response.data)
        refresh_token = reg_data['data']['refreshToken']
        
        # Test refresh endpoint
        refresh_response = client.post('/api/auth/refresh',
            json={'refreshToken': refresh_token})
        
        assert refresh_response.status_code == 200
        refresh_data = json.loads(refresh_response.data)
        assert refresh_data['status'] == 'success'
        assert 'accessToken' in refresh_data['data']
        assert 'refreshToken' in refresh_data['data']
        assert 'expiresIn' in refresh_data['data']