"""
Database utilities and connection management for MongoDB
"""

import logging

from flask import current_app, g
from pymongo import MongoClient

logger = logging.getLogger(__name__)


def get_db():
    """Get database connection from Flask application context"""
    if "db" not in g:
        try:
            client = MongoClient(current_app.config["MONGO_URI"])
            g.db = client[current_app.config["MONGO_DBNAME"]]
            # Test the connection
            g.db.command("ping")
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise e
    return g.db


def close_db(error):
    """Close database connection"""
    db = g.pop("db", None)
    if db is not None:
        # MongoDB connections are handled automatically
        pass


def init_db(app):
    """Initialize database with Flask app"""
    app.teardown_appcontext(close_db)

    with app.app_context():
        try:
            db = get_db()
            # Create indexes for user collection (ignore if they already exist)
            try:
                db.users.create_index("email", unique=True)
            except Exception as e:
                if "already exists" not in str(e) and "duplicate key" not in str(e):
                    logger.warning(f"Could not create email index: {str(e)}")

            try:
                db.users.create_index("username", unique=True, sparse=True)
            except Exception as e:
                if "already exists" not in str(e) and "duplicate key" not in str(e):
                    logger.warning(f"Could not create username index: {str(e)}")

            logger.info("Database initialization completed successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}")
            raise e


def test_connection():
    """Test MongoDB connection"""
    try:
        db = get_db()
        db.command("ping")
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return False
