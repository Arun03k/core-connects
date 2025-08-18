"""
Basic tests for CoreConnect Flask API
"""

import json

import pytest

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_home_endpoint(client):
    """Test the home endpoint."""
    response = client.get("/")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["message"] == "CoreConnect API is running"
    assert data["status"] == "success"
    assert data["version"] == "1.0.0"


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["status"] == "success"
    assert "database" in data["data"]
    assert "api" in data["data"]


def test_api_health_check(client):
    """Test the API health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["status"] == "success"
    assert "api" in data["data"]
    assert "database" in data["data"]
    assert "version" in data["data"]


def test_api_status_endpoint(client):
    """Test the API status endpoint."""
    response = client.get("/api/status")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["status"] == "success"
    assert "api_version" in data["data"]
    assert "service_name" in data["data"]
    assert "environment" in data["data"]


def test_api_test_endpoint(client):
    """Test the API test endpoint."""
    response = client.get("/api/test")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["message"] == "API endpoint is working"
    assert data["data"] == "Hello from Flask backend!"


def test_login_endpoint_missing_data(client):
    """Test login endpoint with missing data."""
    response = client.post("/api/auth/login", json={}, content_type="application/json")
    assert response.status_code == 400

    data = json.loads(response.data)
    assert data["status"] == "error"
    assert "Email and password are required" in data["error"]


def test_login_endpoint_valid_data(client):
    """Test login endpoint with valid data."""
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "password123"},
        content_type="application/json",
    )
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["status"] == "success"
    assert data["message"] == "Login successful"
    assert data["user"]["email"] == "test@example.com"


def test_register_endpoint_missing_data(client):
    """Test register endpoint with missing data."""
    response = client.post(
        "/api/auth/register", json={}, content_type="application/json"
    )
    assert response.status_code == 400

    data = json.loads(response.data)
    assert data["status"] == "error"
    assert "Email and password are required" in data["error"]


def test_register_endpoint_valid_data(client):
    """Test register endpoint with valid data."""
    response = client.post(
        "/api/auth/register",
        json={"email": "newuser@example.com", "password": "newpassword123"},
        content_type="application/json",
    )
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["status"] == "success"
    assert data["message"] == "Registration successful"
    assert data["user"]["email"] == "newuser@example.com"


def test_logout_endpoint(client):
    """Test logout endpoint."""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["status"] == "success"
    assert data["message"] == "Logout successful"
