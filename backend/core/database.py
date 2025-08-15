"""
Database connection and utilities for CoreConnect.
Provides MongoDB connection management and database operations.
"""

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages MongoDB connections and operations."""
    
    def __init__(self):
        self._client: Optional[MongoClient] = None
        self._database: Optional[Database] = None
        self.connection_string = os.getenv(
            'MONGODB_URI', 
            'mongodb://localhost:27017/coreconnect'
        )
        self.database_name = os.getenv('DATABASE_NAME', 'coreconnect')
    
    def connect(self) -> bool:
        """
        Establish connection to MongoDB.
        
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            self._client = MongoClient(
                self.connection_string,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000
            )
            
            # Test the connection
            self._client.admin.command('ping')
            self._database = self._client[self.database_name]
            
            logger.info(f"Successfully connected to MongoDB database: {self.database_name}")
            return True
            
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            self._client = None
            self._database = None
            return False
        except Exception as e:
            logger.error(f"Unexpected error connecting to MongoDB: {e}")
            self._client = None
            self._database = None
            return False
    
    def disconnect(self):
        """Close the MongoDB connection."""
        if self._client:
            self._client.close()
            self._client = None
            self._database = None
            logger.info("Disconnected from MongoDB")
    
    def get_database(self) -> Optional[Database]:
        """
        Get the database instance.
        
        Returns:
            Database: MongoDB database instance or None if not connected
        """
        if not self._database:
            if self.connect():
                return self._database
            return None
        return self._database
    
    def health_check(self) -> dict:
        """
        Check database health and connectivity.
        
        Returns:
            dict: Health status information
        """
        try:
            if not self._database:
                return {
                    'status': 'disconnected',
                    'message': 'Not connected to database',
                    'connected': False
                }
            
            # Ping the database
            self._client.admin.command('ping')
            
            # Get server info
            server_info = self._client.server_info()
            
            return {
                'status': 'healthy',
                'message': 'Database connection is healthy',
                'connected': True,
                'server_version': server_info.get('version'),
                'database_name': self.database_name
            }
            
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return {
                'status': 'unhealthy',
                'message': f'Database health check failed: {str(e)}',
                'connected': False
            }

# Global database manager instance
db_manager = DatabaseManager()

def get_db() -> Optional[Database]:
    """
    Get database instance using the global database manager.
    
    Returns:
        Database: MongoDB database instance or None if connection fails
    """
    return db_manager.get_database()

def init_database() -> bool:
    """
    Initialize database connection.
    
    Returns:
        bool: True if initialization successful, False otherwise
    """
    success = db_manager.connect()
    if success:
        # Create indexes for authentication collections
        create_auth_indexes()
    return success

def create_auth_indexes():
    """Create necessary indexes for authentication collections."""
    try:
        db = get_db()
        if not db:
            return
        
        # Users collection indexes
        db.users.create_index("email", unique=True)
        db.users.create_index("created_at")
        
        # Refresh tokens indexes
        db.refresh_tokens.create_index("user_id")
        db.refresh_tokens.create_index("expires_at")
        db.refresh_tokens.create_index("revoked")
        
        # Verification tokens indexes
        db.verification_tokens.create_index("user_id")
        db.verification_tokens.create_index("token", unique=True)
        db.verification_tokens.create_index("expires_at")
        
        # Reset tokens indexes
        db.reset_tokens.create_index("user_id")
        db.reset_tokens.create_index("token", unique=True)
        db.reset_tokens.create_index("expires_at")
        
        # Failed attempts indexes
        db.failed_attempts.create_index("email")
        db.failed_attempts.create_index("ip_address")
        db.failed_attempts.create_index("created_at")
        
        # Rate limits indexes
        db.rate_limits.create_index("key", unique=True)
        db.rate_limits.create_index("reset_time")
        
        # Access logs indexes
        db.access_logs.create_index("user_id")
        db.access_logs.create_index("ip_address")
        db.access_logs.create_index("timestamp")
        
        logger.info("Successfully created database indexes")
        
    except Exception as e:
        logger.error(f"Failed to create database indexes: {e}")

def close_database():
    """Close database connection."""
    db_manager.disconnect()
