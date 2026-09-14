"""All tests use a fresh in-memory store, never environment MongoDB data."""

import sys
from pathlib import Path

import mongomock
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def isolated_database(monkeypatch):
    from app import app
    from core import database
    from services.email_service import EmailService

    monkeypatch.setattr(database, "MongoClient", mongomock.MongoClient)
    monkeypatch.setattr(EmailService, "send_email", lambda *args, **kwargs: False)
    app.config.update(TESTING=True, BCRYPT_ROUNDS=4)
    database.db_manager.init_app(app)
    with app.app_context():
        database.create_auth_indexes()
    yield


@pytest.fixture
def app():
    from app import create_app
    from core.database import create_auth_indexes

    application = create_app("testing")
    with application.app_context():
        create_auth_indexes()
    yield application


@pytest.fixture
def client(app):
    return app.test_client()
