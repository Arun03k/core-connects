"""
Tests for MongoDB User model and authentication
"""

import os
import sys

import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json

from app import create_app
from models.user import User
from utils.auth_utils import generate_token, verify_token
from utils.database import get_db


@pytest.fixture
def app():
    """Create test app"""
    app = create_app("testing")
    return app


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


@pytest.fixture
def user_model(app):
    """Create User model instance with app context"""
    with app.app_context():
        return User()


class TestUserModel:
    """Test User model operations"""

    def test_create_user(self, app, user_model):
        """Test user creation"""
        with app.app_context():
            # Clean up any existing test user
            try:
                db = get_db()
                db.users.delete_many({"email": "test@example.com"})
            except:
                pass

            user = user_model.create_user(
                email="test@example.com",
                password="password123",
                username="testuser",
                first_name="Test",
                last_name="User",
            )

            assert user is not None
            assert user["email"] == "test@example.com"
            assert user["username"] == "testuser"
            assert user["first_name"] == "Test"
            assert user["last_name"] == "User"
            assert "password_hash" not in user  # Should not return password hash
            assert user["is_active"] == True
            assert user["is_verified"] == False

    def test_authenticate_user(self, app, user_model):
        """Test user authentication"""
        with app.app_context():
            # Create a test user first
            try:
                db = get_db()
                db.users.delete_many({"email": "auth@example.com"})
            except:
                pass

            user_model.create_user(email="auth@example.com", password="password123")

            # Test successful authentication
            user = user_model.authenticate("auth@example.com", "password123")
            assert user is not None
            assert user["email"] == "auth@example.com"

            # Test failed authentication
            user = user_model.authenticate("auth@example.com", "wrongpassword")
            assert user is None

    def test_find_user_by_email(self, app, user_model):
        """Test finding user by email"""
        with app.app_context():
            # Clean up and create test user
            try:
                db = get_db()
                db.users.delete_many({"email": "find@example.com"})
            except:
                pass

            user_model.create_user(email="find@example.com", password="password123")

            # Test finding existing user
            user = user_model.find_by_email("find@example.com")
            assert user is not None
            assert user["email"] == "find@example.com"

            # Test finding non-existing user
            user = user_model.find_by_email("nonexistent@example.com")
            assert user is None


class TestAuthEndpoints:
    """Test authentication endpoints"""

    def test_register_endpoint(self, client, app):
        """Test user registration endpoint"""
        with app.app_context():
            # Clean up any existing test user
            try:
                db = get_db()
                db.users.delete_many({"email": "register@example.com"})
            except:
                pass

        response = client.post(
            "/api/auth/register",
            json={
                "email": "register@example.com",
                "password": "password123",
                "username": "registertest",
                "first_name": "Register",
                "last_name": "Test",
            },
        )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "token" in data
        assert data["user"]["email"] == "register@example.com"

    def test_login_endpoint(self, client, app):
        """Test user login endpoint"""
        with app.app_context():
            # Create a test user first
            try:
                db = get_db()
                db.users.delete_many({"email": "login@example.com"})
            except:
                pass

            user_model = User()
            user_model.create_user(email="login@example.com", password="password123")

        response = client.post(
            "/api/auth/login",
            json={"email": "login@example.com", "password": "password123"},
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "token" in data
        assert data["user"]["email"] == "login@example.com"

    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        response = client.post(
            "/api/auth/login",
            json={"email": "nonexistent@example.com", "password": "wrongpassword"},
        )

        assert response.status_code == 401
        data = json.loads(response.data)
        assert data["status"] == "error"


class TestJWTUtils:
    """Test JWT utilities"""

    def test_generate_and_verify_token(self, app):
        """Test JWT token generation and verification"""
        with app.app_context():
            user_id = "64f1a2b3c4d5e6f7g8h9i0j1"
            email = "jwt@example.com"

            # Generate token
            token = generate_token(user_id, email)
            assert token is not None
            assert isinstance(token, str)

            # Verify token
            payload = verify_token(token)
            assert payload is not None
            assert payload["user_id"] == user_id
            assert payload["email"] == email

    def test_verify_invalid_token(self, app):
        """Test verification of invalid token"""
        with app.app_context():
            invalid_token = "invalid.token.here"
            payload = verify_token(invalid_token)
            assert payload is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
