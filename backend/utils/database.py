"""Compatibility API for the application's shared MongoDB pool."""

from core.database import get_db


def init_db(app):
    from core.database import db_manager

    db_manager.init_app(app)


def close_db(error=None):
    # Pools are application-scoped, not request-scoped.
    pass


def test_connection():
    try:
        get_db().command("ping")
        return True
    except Exception:
        return False
