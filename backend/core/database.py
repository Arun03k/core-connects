"""One lazy MongoDB connection pool per Flask application."""

import logging

from flask import current_app
from pymongo import MongoClient

logger = logging.getLogger(__name__)


class DatabaseManager:
    def init_app(self, app):
        client = MongoClient(
            app.config["MONGO_URI"],
            connect=False,
            tz_aware=True,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=3000,
            socketTimeoutMS=5000,
        )
        app.extensions["mongo_client"] = client
        app.extensions["mongo_db"] = client[app.config["MONGO_DBNAME"]]

    def get_database(self):
        return current_app.extensions["mongo_db"]

    def health_check(self):
        try:
            self.get_database().command("ping")
            return {"status": "healthy", "connected": True}
        except Exception:
            logger.warning("database_health_unavailable")
            return {"status": "unavailable", "connected": False}

    def connect(self):
        return self.health_check()["connected"]

    def disconnect(self):
        current_app.extensions["mongo_client"].close()


db_manager = DatabaseManager()


def get_db():
    return db_manager.get_database()


def create_auth_indexes():
    """Add indexes matching actual queries; never remove existing user data."""
    db = get_db()
    db.users.create_index("email", unique=True)
    db.users.create_index("created_at")
    db.refresh_tokens.create_index("user_id")
    db.refresh_tokens.create_index([("jti", 1), ("is_revoked", 1)])
    for name in ("verification_tokens", "reset_tokens"):
        db[name].create_index("token", unique=True)
        db[name].create_index("user_id")
    db.failed_attempts.create_index([("email", 1), ("attempted_at", 1)])
    db.rate_limits.create_index("expires_at", expireAfterSeconds=0)


def init_database():
    create_auth_indexes()
    return True


def close_database():
    db_manager.disconnect()
