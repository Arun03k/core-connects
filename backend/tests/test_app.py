"""Application contracts and security regression tests."""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import jwt
import pytest
from app import create_app
from bson import ObjectId
from core.database import get_db

PASSWORD = "StrongP@ss123!"


def register(client, email="employee@example.com"):
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": PASSWORD,
            "firstName": "Test",
            "lastName": "Employee",
        },
    )
    assert response.status_code == 201, response.json
    return response.json["data"]


def bearer(token):
    return {"Authorization": f"Bearer {token}"}


def test_home_and_health(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json["data"]["version"] == "1.0.0"
    assert client.get("/health").status_code == 200
    assert client.get("/api/health").status_code == 200


def test_health_failure_is_sanitized(client):
    with patch(
        "core.database.DatabaseManager.get_database",
        side_effect=RuntimeError("private credentials"),
    ):
        response = client.get("/health")
    assert response.status_code == 503
    assert b"private credentials" not in response.data


@pytest.mark.parametrize(
    "path", ["/api/stats", "/api/status", "/api/auth/profile", "/api/auth/verify"]
)
def test_private_endpoints_require_auth(client, path):
    assert client.get(path).status_code == 401


def test_roles_enforced_from_database(client, app):
    data = register(client)
    headers = bearer(data["accessToken"])
    assert client.get("/api/stats", headers=headers).status_code == 403
    assert client.get("/api/status", headers=headers).status_code == 403
    with app.app_context():
        get_db().users.update_one(
            {"email": "employee@example.com"}, {"$set": {"role": "HR"}}
        )
    assert client.get("/api/stats", headers=headers).status_code == 200
    assert client.get("/api/status", headers=headers).status_code == 403
    with app.app_context():
        get_db().users.update_one(
            {"email": "employee@example.com"}, {"$set": {"role": "admin"}}
        )
    assert client.get("/api/status", headers=headers).status_code == 200


def test_registration_cannot_assign_privileges(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "safe@example.com", "password": PASSWORD, "role": "ADMIN"},
    )
    assert response.status_code == 201
    assert response.json["data"]["user"]["role"] == "EMPLOYEE"
    assert "verificationToken" not in response.json["data"]
    assert "password_hash" not in response.json["data"]["user"]
    assert response.headers["Cache-Control"] == "no-store"


@pytest.mark.parametrize(
    "token_type", ["refresh", "email_verification", "password_reset"]
)
def test_non_access_tokens_cannot_read_profile(client, app, token_type):
    data = register(client)
    now = datetime.now(timezone.utc)
    token = jwt.encode(
        {
            "user_id": data["user"]["id"],
            "type": token_type,
            "iat": now,
            "exp": now + timedelta(minutes=5),
        },
        app.config["JWT_SECRET_KEY"],
        algorithm="HS256",
    )
    assert client.get("/api/auth/profile", headers=bearer(token)).status_code == 401


def test_deactivation_invalidates_access_and_refresh(client, app):
    data = register(client)
    with app.app_context():
        get_db().users.update_one(
            {"email": "employee@example.com"}, {"$set": {"is_active": False}}
        )
    assert (
        client.get("/api/auth/verify", headers=bearer(data["accessToken"])).status_code
        == 401
    )
    assert (
        client.post(
            "/api/auth/refresh", json={"refreshToken": data["refreshToken"]}
        ).status_code
        == 401
    )


def test_logout_revokes_refresh(client):
    data = register(client)
    assert (
        client.post(
            "/api/auth/logout",
            json={"refreshToken": data["refreshToken"]},
            headers=bearer(data["accessToken"]),
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/auth/refresh", json={"refreshToken": data["refreshToken"]}
        ).status_code
        == 401
    )


def test_password_reset_changes_password_and_prevents_reuse(client, app):
    data = register(client)
    with patch("api.auth.email_service.send_password_reset_email", return_value=False):
        response = client.post(
            "/api/auth/forgot-password", json={"email": "employee@example.com"}
        )
    missing = client.post(
        "/api/auth/forgot-password", json={"email": "missing@example.com"}
    )
    assert response.json == missing.json
    with app.app_context():
        token = get_db().reset_tokens.find_one()["token"]
    new_password = "Different!839Secret"
    response = client.post(
        "/api/auth/reset-password", json={"token": token, "newPassword": new_password}
    )
    assert response.status_code == 200, response.json
    assert (
        client.post(
            "/api/auth/reset-password",
            json={"token": token, "newPassword": new_password},
        ).status_code
        == 400
    )
    assert (
        client.post(
            "/api/auth/login",
            json={"email": "employee@example.com", "password": PASSWORD},
        ).status_code
        == 401
    )
    assert (
        client.post(
            "/api/auth/login",
            json={"email": "employee@example.com", "password": new_password},
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/auth/refresh", json={"refreshToken": data["refreshToken"]}
        ).status_code
        == 401
    )
    with app.app_context():
        document = get_db().users.find_one({"_id": ObjectId(data["user"]["id"])})
        assert document["password_hash"] != new_password


def test_password_change_enforces_strength_and_revokes_refresh(client):
    data = register(client)
    headers = bearer(data["accessToken"])
    assert (
        client.post(
            "/api/auth/change-password",
            headers=headers,
            json={"old_password": PASSWORD, "new_password": "weak"},
        ).status_code
        == 400
    )
    assert (
        client.post(
            "/api/auth/change-password",
            headers=headers,
            json={"old_password": PASSWORD, "new_password": "Different!839Secret"},
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/auth/refresh", json={"refreshToken": data["refreshToken"]}
        ).status_code
        == 401
    )


def test_cors_allows_only_configured_origin(client):
    for method in (client.get, client.options):
        response = method(
            "/api/auth/verify",
            headers={
                "Origin": "https://evil.example",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert "Access-Control-Allow-Origin" not in response.headers
    response = client.options(
        "/api/auth/login",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:5173"
    assert "Access-Control-Allow-Credentials" not in response.headers


def test_production_requires_secrets(monkeypatch):
    monkeypatch.delenv("SECRET_KEY", raising=False)
    monkeypatch.delenv("JWT_SECRET_KEY", raising=False)
    with pytest.raises(ValueError, match="SECRET_KEY"):
        create_app("production")


@pytest.mark.parametrize(
    "payload", [[1], "text", {"email": {"$ne": None}}, {"password": 5}]
)
def test_invalid_json_shapes(client, payload):
    assert client.post("/api/auth/login", json=payload).status_code == 400


def test_malformed_json_and_large_body(client):
    assert (
        client.post(
            "/api/auth/login", data="{", content_type="application/json"
        ).status_code
        == 400
    )
    assert (
        client.post("/api/auth/login", data="x", content_type="text/plain").status_code
        == 415
    )
    response = client.post(
        "/api/auth/login",
        data='{"value":"' + "x" * (1024 * 1024) + '"}',
        content_type="application/json",
    )
    assert response.status_code == 413
    assert response.is_json


def test_rate_limit_cannot_be_bypassed_with_forwarded_ip(client):
    for attempt in range(5):
        response = client.post(
            "/api/auth/login",
            json={"email": "absent@example.com", "password": PASSWORD},
            headers={"X-Forwarded-For": f"192.0.2.{attempt}"},
        )
        assert response.status_code == 401
    response = client.post(
        "/api/auth/login",
        json={"email": "absent@example.com", "password": PASSWORD},
        headers={"X-Forwarded-For": "192.0.2.99"},
    )
    assert response.status_code == 429
    assert int(response.headers["Retry-After"]) > 0


def test_database_isolation_across_app_instances(app):
    other = create_app("testing")
    with app.app_context():
        get_db().users.insert_one({"email": "first@example.com"})
    with other.app_context():
        assert get_db().users.count_documents({}) == 0


def test_limiter_fails_closed_when_database_unavailable(client):
    with patch(
        "middleware.auth_middleware.get_db", side_effect=RuntimeError("private URI")
    ):
        response = client.post(
            "/api/auth/login", json={"email": "test@example.com", "password": PASSWORD}
        )
    assert response.status_code == 503
    assert b"private URI" not in response.data


def test_limiter_does_not_retry_a_failed_handler(app):
    from middleware.auth_middleware import rate_limit

    attempts = []

    @app.route("/api/failing-test", methods=["POST"])
    @rate_limit()
    def failing_handler():
        attempts.append(True)
        raise RuntimeError("private failure")

    response = app.test_client().post("/api/failing-test", json={})
    assert response.status_code == 500
    assert attempts == [True]
    assert b"private failure" not in response.data


def test_logout_with_expired_access_still_revokes_refresh(client):
    data = register(client)
    assert (
        client.post(
            "/api/auth/logout",
            json={"refreshToken": data["refreshToken"]},
            headers=bearer("expired"),
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/auth/refresh", json={"refreshToken": data["refreshToken"]}
        ).status_code
        == 401
    )


def test_bcrypt_truncation_is_rejected(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "long@example.com", "password": "Abc!9" + "x" * 70},
    )
    assert response.status_code == 400
    assert "72" in response.json["message"]
