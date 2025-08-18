"""
User model for MongoDB with schema validation and user management
"""

import re
from datetime import datetime, timezone
from typing import Any, Dict, Optional

import bcrypt
from bson import ObjectId

from utils.database import get_db


class User:
    """User model for MongoDB operations"""

    # Email validation regex
    EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

    def __init__(self):
        self.db = None

    def _get_collection(self):
        """Get users collection from database"""
        if self.db is None:
            self.db = get_db()
        return self.db.users

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        return bool(User.EMAIL_REGEX.match(email))

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

    def create_user(
        self,
        email: str,
        password: str,
        username: str = None,
        first_name: str = None,
        last_name: str = None,
    ) -> Dict[str, Any]:
        """Create a new user"""
        try:
            # Validation
            if not email or not password:
                raise ValueError("Email and password are required")

            if not self.validate_email(email):
                raise ValueError("Invalid email format")

            if len(password) < 6:
                raise ValueError("Password must be at least 6 characters long")

            # Check if user already exists
            existing_email_user = self.find_by_email(email)
            if existing_email_user is not None:
                raise ValueError("User with this email already exists")

            if username:
                existing_username_user = self.find_by_username(username)
                if existing_username_user is not None:
                    raise ValueError("Username already taken")

            # Create user document
            user_doc = {
                "email": email.lower().strip(),
                "username": username.lower().strip() if username else None,
                "password_hash": self.hash_password(password),
                "first_name": first_name,
                "last_name": last_name,
                "is_active": True,
                "is_verified": False,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "last_login": None,
                "profile": {
                    "avatar_url": None,
                    "bio": None,
                    "location": None,
                    "website": None,
                },
                "settings": {"email_notifications": True, "privacy_level": "public"},
            }

            # Insert user
            collection = self._get_collection()
            result = collection.insert_one(user_doc)

            # Return user without password hash
            user_doc["_id"] = result.inserted_id
            user_doc.pop("password_hash", None)

            return user_doc

        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Find user by email"""
        try:
            collection = self._get_collection()
            user = collection.find_one({"email": email.lower().strip()})
            return user
        except Exception as e:
            raise Exception(f"Failed to find user by email: {str(e)}")

    def find_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Find user by username"""
        try:
            collection = self._get_collection()
            user = collection.find_one({"username": username.lower().strip()})
            return user
        except Exception as e:
            raise Exception(f"Failed to find user by username: {str(e)}")

    def find_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Find user by ID"""
        try:
            collection = self._get_collection()
            user = collection.find_one({"_id": ObjectId(user_id)})
            return user
        except Exception as e:
            raise Exception(f"Failed to find user by ID: {str(e)}")

    def authenticate(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        try:
            user = self.find_by_email(email)
            if not user:
                return None

            if not self.verify_password(password, user["password_hash"]):
                return None

            # Update last login
            collection = self._get_collection()
            collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": datetime.now(timezone.utc)}},
            )

            # Return user without password hash
            user.pop("password_hash", None)
            return user

        except Exception as e:
            raise Exception(f"Failed to authenticate user: {str(e)}")

    def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user information"""
        try:
            # Remove sensitive fields from update
            update_data.pop("password_hash", None)
            update_data.pop("_id", None)
            update_data["updated_at"] = datetime.now(timezone.utc)

            collection = self._get_collection()
            result = collection.update_one(
                {"_id": ObjectId(user_id)}, {"$set": update_data}
            )

            return result.modified_count > 0

        except Exception as e:
            raise Exception(f"Failed to update user: {str(e)}")

    def change_password(
        self, user_id: str, old_password: str, new_password: str
    ) -> bool:
        """Change user password"""
        try:
            user = self.find_by_id(user_id)
            if not user:
                raise ValueError("User not found")

            if not self.verify_password(old_password, user["password_hash"]):
                raise ValueError("Invalid current password")

            if len(new_password) < 6:
                raise ValueError("New password must be at least 6 characters long")

            # Update password
            collection = self._get_collection()
            result = collection.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {
                        "password_hash": self.hash_password(new_password),
                        "updated_at": datetime.now(timezone.utc),
                    }
                },
            )

            return result.modified_count > 0

        except Exception as e:
            raise Exception(f"Failed to change password: {str(e)}")

    def delete_user(self, user_id: str) -> bool:
        """Delete user (soft delete by setting is_active to False)"""
        try:
            collection = self._get_collection()
            result = collection.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {
                        "is_active": False,
                        "updated_at": datetime.now(timezone.utc),
                    }
                },
            )

            return result.modified_count > 0

        except Exception as e:
            raise Exception(f"Failed to delete user: {str(e)}")

    def get_user_stats(self) -> Dict[str, Any]:
        """Get user statistics"""
        try:
            collection = self._get_collection()

            total_users = collection.count_documents({})
            active_users = collection.count_documents({"is_active": True})
            verified_users = collection.count_documents({"is_verified": True})

            return {
                "total_users": total_users,
                "active_users": active_users,
                "verified_users": verified_users,
                "inactive_users": total_users - active_users,
            }

        except Exception as e:
            raise Exception(f"Failed to get user stats: {str(e)}")
