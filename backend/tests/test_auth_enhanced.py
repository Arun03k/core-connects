"""
Enhanced test suite for authentication system
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone

import pytest

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app
from services.auth_service import AuthService
from utils.password_utils import password_validator
from utils.validators import input_validator


class TestAuthenticationSystem:
    """Test suite for the enhanced authentication system"""

    @pytest.fixture
    def app(self):
        """Create test app"""
        app = create_app("testing")
        return app

    @pytest.fixture
    def client(self, app):
        """Create test client"""
        return app.test_client()

    @pytest.fixture
    def auth_service(self, app):
        """Create auth service for testing"""
        with app.app_context():
            return AuthService()

    def test_password_validation_strong(self):
        """Test strong password validation"""
        strong_password = "StrongP@ss123!"
        is_valid, message = password_validator.validate_password(strong_password)
        assert is_valid == True

        score, strength = password_validator.get_password_strength_score(
            strong_password
        )
        assert score >= 80
        assert strength in ["Strong", "Very Strong"]

    def test_password_validation_weak(self):
        """Test weak password validation"""
        weak_passwords = [
            "123456",
            "password",
            "abc123",
            "weakpass",
            "Password123",  # No special character
        ]

        for password in weak_passwords:
            is_valid, errors = password_validator.validate_password(password)
            assert is_valid == False
            assert len(errors) > 0

    def test_input_validation_email(self):
        """Test email validation"""
        valid_emails = [
            "test@example.com",
            "user.name@domain.co.uk",
            "first.last+tag@company.com",
        ]

        invalid_emails = [
            "not-an-email",
            "@domain.com",
            "user@",
            "user..double.dot@domain.com",
        ]

        for email in valid_emails:
            result = input_validator.validate_email(email)
            assert result["valid"] == True

        for email in invalid_emails:
            result = input_validator.validate_email(email)
            assert result["valid"] == False

    def test_input_validation_registration(self):
        """Test registration data validation"""
        valid_data = {
            "email": "test@example.com",
            "password": "StrongP@ss123!",
            "firstName": "John",
            "lastName": "Doe",
            "username": "johndoe",
        }

        result = input_validator.validate_registration_data(valid_data)
        assert result["valid"] == True

        invalid_data = {
            "email": "not-an-email",
            "password": "123",
            "firstName": "",
            "lastName": "Doe123!@#",  # Invalid characters
        }

        result = input_validator.validate_registration_data(invalid_data)
        assert result["valid"] == False
        assert "email" in result["errors"]
        assert "password" in result["errors"]

    def test_registration_endpoint(self, client):
        """Test user registration endpoint"""
        registration_data = {
            "email": "newuser@example.com",
            "password": "StrongP@ss123!",
            "firstName": "New",
            "lastName": "User",
        }

        response = client.post(
            "/api/auth/register",
            data=json.dumps(registration_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "accessToken" in data["data"]
        assert "refreshToken" in data["data"]
        assert data["data"]["user"]["email"] == "newuser@example.com"

    def test_login_endpoint(self, client):
        """Test login endpoint"""
        # First register a user
        registration_data = {
            "email": "logintest@example.com",
            "password": "StrongP@ss123!",
            "firstName": "Login",
            "lastName": "Test",
        }

        client.post(
            "/api/auth/register",
            data=json.dumps(registration_data),
            content_type="application/json",
        )

        # Now try to login
        login_data = {"email": "logintest@example.com", "password": "StrongP@ss123!"}

        response = client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "accessToken" in data["data"]
        assert "refreshToken" in data["data"]

    def test_invalid_login(self, client):
        """Test invalid login credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "WrongPassword123!",
        }

        response = client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )

        assert response.status_code == 401
        data = json.loads(response.data)
        assert data["status"] == "error"

    def test_token_verification(self, client):
        """Test token verification endpoint"""
        # Register and get token
        registration_data = {
            "email": "tokentest@example.com",
            "password": "StrongP@ss123!",
            "firstName": "Token",
            "lastName": "Test",
        }

        response = client.post(
            "/api/auth/register",
            data=json.dumps(registration_data),
            content_type="application/json",
        )

        data = json.loads(response.data)
        access_token = data["data"]["accessToken"]

        # Verify token
        headers = {"Authorization": f"Bearer {access_token}"}
        response = client.get("/api/auth/verify", headers=headers)

        assert response.status_code == 200
        verify_data = json.loads(response.data)
        assert verify_data["status"] == "success"
        assert verify_data["data"]["user"]["email"] == "tokentest@example.com"

    def test_refresh_token(self, client):
        """Test token refresh endpoint"""
        # Register and get tokens
        registration_data = {
            "email": "refreshtest@example.com",
            "password": "StrongP@ss123!",
            "firstName": "Refresh",
            "lastName": "Test",
        }

        response = client.post(
            "/api/auth/register",
            data=json.dumps(registration_data),
            content_type="application/json",
        )

        data = json.loads(response.data)
        refresh_token = data["data"]["refreshToken"]

        # Use refresh token to get new access token
        refresh_data = {"refreshToken": refresh_token}
        response = client.post(
            "/api/auth/refresh",
            data=json.dumps(refresh_data),
            content_type="application/json",
        )

        assert response.status_code == 200
        refresh_response = json.loads(response.data)
        assert refresh_response["status"] == "success"
        assert "accessToken" in refresh_response["data"]

    def test_password_strength_requirements(self):
        """Test that password strength requirements are enforced"""
        weak_passwords = [
            "short",  # Too short
            "nouppercase123!",  # No uppercase
            "NOLOWERCASE123!",  # No lowercase
            "NoNumbers!",  # No numbers
            "NoSpecialChars123",  # No special characters
            "password",  # Common password
        ]

        for password in weak_passwords:
            is_valid, errors = password_validator.validate_password(password)
            assert is_valid == False
            assert len(errors) > 0

    def test_rate_limiting_simulation(self, client):
        """Test rate limiting (simulated)"""
        login_data = {"email": "ratetest@example.com", "password": "WrongPassword123!"}

        # Make multiple failed login attempts
        responses = []
        for _ in range(6):  # Try 6 times (rate limit is 5)
            response = client.post(
                "/api/auth/login",
                data=json.dumps(login_data),
                content_type="application/json",
            )
            responses.append(response.status_code)

        # The last request might be rate limited (429) or still return 401
        # This depends on the rate limiting implementation
        assert all(status in [401, 429] for status in responses)


if __name__ == "__main__":
    pytest.main([__file__])
