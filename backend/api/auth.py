import logging
from datetime import datetime, timedelta, timezone

import jwt
from flask import Blueprint, current_app, jsonify, request

from middleware.auth_middleware import enhanced_token_required, rate_limit
from models.user import User
from services.auth_service import AuthService
from services.email_service import EmailService
from utils.auth_utils import token_required
from utils.validators import input_validator

logger = logging.getLogger(__name__)

# Create blueprint for auth routes
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Initialize services
auth_service = AuthService()
email_service = EmailService()


def serialize_user(user_dict):
    """Convert MongoDB document to JSON serializable format"""
    if user_dict and "_id" in user_dict:
        user_dict["id"] = str(user_dict["_id"])
        user_dict.pop("_id", None)
    user_dict.pop("password_hash", None)  # Never return password hash
    return user_dict


@auth_bp.route("/login", methods=["POST", "OPTIONS"])
@rate_limit(
    max_requests=5, window_minutes=5, per="ip"
)  # 5 attempts per 5 minutes per IP
def login():
    """Enhanced login endpoint with security features"""
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    try:
        data = request.get_json()

        if not data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Request data is required",
                        "errors": {"request": "No data provided"},
                    }
                ),
                400,
            )

        # Validate input data
        validation_result = input_validator.validate_login_data(data)
        if not validation_result["valid"]:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Invalid input data",
                        "errors": validation_result["errors"],
                    }
                ),
                400,
            )

        # Use enhanced auth service
        result = auth_service.login_user(validation_result["data"])

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Login successful",
                    "data": {
                        "user": serialize_user(result["user"].copy()),
                        "accessToken": result["tokens"]["access_token"],
                        "refreshToken": result["tokens"]["refresh_token"],
                        "expiresIn": result["tokens"]["access_expires_in"],
                        "tokenType": result["tokens"]["token_type"],
                    },
                }
            ),
            200,
        )

    except ValueError as e:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": str(e),
                    "errors": {"credentials": str(e)},
                }
            ),
            401,
        )
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An error occurred during login",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/register", methods=["POST", "OPTIONS"])
@auth_bp.route(
    "/signup", methods=["POST", "OPTIONS"]
)  # Add signup alias for frontend compatibility
@rate_limit(
    max_requests=3, window_minutes=10, per="ip"
)  # 3 registrations per 10 minutes per IP
def register():
    """Enhanced registration endpoint with password validation and email verification"""
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    try:
        data = request.get_json()

        if not data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Request data is required",
                        "errors": {"request": "No data provided"},
                    }
                ),
                400,
            )

        # Validate input data
        validation_result = input_validator.validate_registration_data(data)
        if not validation_result["valid"]:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Invalid input data",
                        "errors": validation_result["errors"],
                    }
                ),
                400,
            )

        # Use enhanced auth service
        result = auth_service.register_user(validation_result["data"])

        # Send verification email (in production, don't return the token)
        user = result["user"]
        user_name = (
            f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
            or user.get("username")
            or "User"
        )

        email_sent = email_service.send_verification_email(
            user["email"], user_name, result["verification_token"]
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Registration successful. Please check your email to verify your account.",
                    "data": {
                        "user": serialize_user(result["user"].copy()),
                        "accessToken": result["tokens"]["access_token"],
                        "refreshToken": result["tokens"]["refresh_token"],
                        "expiresIn": result["tokens"]["access_expires_in"],
                        "tokenType": result["tokens"]["token_type"],
                        "emailSent": email_sent,
                        # For development/testing only - remove in production
                        "verificationToken": (
                            result["verification_token"] if not email_sent else None
                        ),
                    },
                }
            ),
            201,
        )

    except ValueError as e:
        return (
            jsonify(
                {"status": "error", "message": str(e), "errors": {"validation": str(e)}}
            ),
            400,
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An error occurred during registration",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout():
    """Enhanced logout endpoint that revokes refresh token"""
    try:
        # Get refresh token from request body
        data = request.get_json() or {}
        refresh_token = data.get("refreshToken")

        # Revoke refresh token if provided
        auth_service.logout_user(refresh_token)

        return jsonify({"status": "success", "message": "Logout successful"}), 200

    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Logout successful",  # Always return success for logout
                }
            ),
            200,
        )


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    """Refresh access token using refresh token"""
    try:
        data = request.get_json()

        if not data or "refreshToken" not in data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Refresh token is required",
                        "errors": {"refreshToken": "Refresh token is required"},
                    }
                ),
                400,
            )

        refresh_token = data["refreshToken"]
        result = auth_service.refresh_token(refresh_token)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Token refreshed successfully",
                    "data": {
                        "accessToken": result["access_token"],
                        "expiresIn": result["expires_in"],
                        "tokenType": result["token_type"],
                    },
                }
            ),
            200,
        )

    except ValueError as e:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": str(e),
                    "errors": {"refreshToken": str(e)},
                }
            ),
            401,
        )
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to refresh token",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):
    """Verify user email address"""
    try:
        success = auth_service.verify_email(token)

        if success:
            return (
                jsonify(
                    {"status": "success", "message": "Email verified successfully"}
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Invalid or expired verification token",
                        "errors": {"token": "Verification token is invalid or expired"},
                    }
                ),
                400,
            )

    except Exception as e:
        logger.error(f"Email verification error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An error occurred during email verification",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/resend-verification", methods=["POST"])
def resend_verification():
    """Resend email verification"""
    try:
        data = request.get_json()

        if not data or "email" not in data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Email is required",
                        "errors": {"email": "Email is required"},
                    }
                ),
                400,
            )

        email = data["email"].strip().lower()

        # Find user
        user_model = User()
        user = user_model.find_by_email(email)

        if not user:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "User not found",
                        "errors": {"email": "User with this email does not exist"},
                    }
                ),
                404,
            )

        if user.get("is_verified"):
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Email is already verified",
                        "errors": {"email": "This email is already verified"},
                    }
                ),
                400,
            )

        # Generate new verification token
        verification_token = auth_service._generate_verification_token(str(user["_id"]))

        # Store verification token
        from utils.database import get_db

        db = get_db()
        verification_tokens = db.verification_tokens

        # Remove old tokens
        verification_tokens.delete_many({"user_id": str(user["_id"])})

        # Insert new token
        verification_tokens.insert_one(
            {
                "user_id": str(user["_id"]),
                "token": verification_token,
                "created_at": datetime.now(timezone.utc),
                "expires_at": datetime.now(timezone.utc) + timedelta(hours=24),
                "is_used": False,
            }
        )

        # Send verification email
        user_name = (
            f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
            or user.get("username")
            or "User"
        )
        email_sent = email_service.send_verification_email(
            user["email"], user_name, verification_token
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Verification email sent successfully",
                    "data": {"emailSent": email_sent},
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Resend verification error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An error occurred while resending verification email",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()

        if not data or "email" not in data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Email is required",
                        "errors": {"email": "Email is required"},
                    }
                ),
                400,
            )

        email = data["email"].strip().lower()

        # Find user
        user_model = User()
        user = user_model.find_by_email(email)

        if not user:
            # Don't reveal if user exists or not for security
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "If an account with that email exists, a password reset link has been sent.",
                    }
                ),
                200,
            )

        if not user.get("is_active"):
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "If an account with that email exists, a password reset link has been sent.",
                    }
                ),
                200,
            )

        # Generate reset token
        reset_payload = {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "type": "password_reset",
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),  # 1 hour expiry
        }

        reset_token = jwt.encode(
            reset_payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256"
        )

        # Store reset token
        from utils.database import get_db

        db = get_db()
        reset_tokens = db.reset_tokens

        # Remove old reset tokens
        reset_tokens.delete_many({"user_id": str(user["_id"])})

        # Insert new token
        reset_tokens.insert_one(
            {
                "user_id": str(user["_id"]),
                "token": reset_token,
                "created_at": datetime.now(timezone.utc),
                "expires_at": reset_payload["exp"],
                "is_used": False,
            }
        )

        # Send reset email
        user_name = (
            f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
            or user.get("username")
            or "User"
        )
        email_sent = email_service.send_password_reset_email(
            user["email"], user_name, reset_token
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "If an account with that email exists, a password reset link has been sent.",
                    "data": {"emailSent": email_sent},
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Forgot password error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An error occurred while processing your request",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    """Reset password using reset token"""
    try:
        data = request.get_json()

        if not data or "token" not in data or "newPassword" not in data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Reset token and new password are required",
                        "errors": {"request": "Token and new password are required"},
                    }
                ),
                400,
            )

        reset_token = data["token"]
        new_password = data["newPassword"]

        # Verify reset token
        try:
            payload = jwt.decode(
                reset_token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"]
            )

            if payload.get("type") != "password_reset":
                raise ValueError("Invalid token type")

        except jwt.ExpiredSignatureError:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Reset token has expired",
                        "errors": {"token": "Reset token has expired"},
                    }
                ),
                400,
            )
        except jwt.InvalidTokenError:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Invalid reset token",
                        "errors": {"token": "Invalid reset token"},
                    }
                ),
                400,
            )

        # Check if token exists and is not used
        from utils.database import get_db

        db = get_db()
        reset_tokens = db.reset_tokens

        token_doc = reset_tokens.find_one(
            {
                "token": reset_token,
                "is_used": False,
                "expires_at": {"$gt": datetime.now(timezone.utc)},
            }
        )

        if not token_doc:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Reset token is invalid or has been used",
                        "errors": {"token": "Reset token is invalid or has been used"},
                    }
                ),
                400,
            )

        # Validate new password
        is_valid, message = auth_service.validate_password_strength(new_password)
        if not is_valid:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": message,
                        "errors": {"password": message},
                    }
                ),
                400,
            )

        # Get user and update password
        user_model = User()
        user = user_model.find_by_id(payload["user_id"])

        if not user or not user.get("is_active"):
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "User not found or inactive",
                        "errors": {"user": "User not found or inactive"},
                    }
                ),
                400,
            )

        # Update password
        user_model.update_user(
            str(user["_id"]),
            {
                "password_hash": user_model.hash_password(new_password),
                "updated_at": datetime.now(timezone.utc),
            },
        )

        # Mark reset token as used
        reset_tokens.update_one({"_id": token_doc["_id"]}, {"$set": {"is_used": True}})

        # Revoke all existing refresh tokens for security
        auth_service.revoke_all_tokens(str(user["_id"]))

        return (
            jsonify(
                {"status": "success", "message": "Password has been reset successfully"}
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Reset password error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An error occurred while resetting your password",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/verify", methods=["GET"])
@enhanced_token_required
def verify():
    """Token verification endpoint with enhanced security"""
    try:
        user = request.current_user

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Token is valid",
                    "data": {"user": serialize_user(user.copy())},
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Token verification failed",
                    "errors": {"server": "Internal server error"},
                }
            ),
            500,
        )


@auth_bp.route("/profile", methods=["GET"])
@token_required
def get_profile():
    """Get user profile"""
    try:
        user = request.current_user

        return jsonify({"status": "success", "user": serialize_user(user.copy())}), 200

    except Exception as e:
        logger.error(f"Get profile error: {str(e)}")
        return jsonify({"error": "Failed to get profile", "status": "error"}), 500


@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        user = request.current_user

        if not data:
            return jsonify({"error": "Update data is required", "status": "error"}), 400

        # Fields that can be updated
        allowed_fields = ["first_name", "last_name", "username", "profile", "settings"]
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            return (
                jsonify({"error": "No valid fields to update", "status": "error"}),
                400,
            )

        user_model = User()
        success = user_model.update_user(str(user["_id"]), update_data)

        if not success:
            return (
                jsonify({"error": "Failed to update profile", "status": "error"}),
                500,
            )

        # Get updated user
        updated_user = user_model.find_by_id(str(user["_id"]))

        return (
            jsonify(
                {
                    "message": "Profile updated successfully",
                    "status": "success",
                    "user": serialize_user(updated_user.copy()),
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Update profile error: {str(e)}")
        return (
            jsonify(
                {"error": "An error occurred while updating profile", "status": "error"}
            ),
            500,
        )


@auth_bp.route("/change-password", methods=["POST"])
@token_required
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        user = request.current_user

        if not data or "old_password" not in data or "new_password" not in data:
            return (
                jsonify(
                    {
                        "error": "Old password and new password are required",
                        "status": "error",
                    }
                ),
                400,
            )

        old_password = data["old_password"]
        new_password = data["new_password"]

        user_model = User()
        success = user_model.change_password(
            str(user["_id"]), old_password, new_password
        )

        if not success:
            return (
                jsonify({"error": "Failed to change password", "status": "error"}),
                500,
            )

        return (
            jsonify({"message": "Password changed successfully", "status": "success"}),
            200,
        )

    except ValueError as e:
        return jsonify({"error": str(e), "status": "error"}), 400
    except Exception as e:
        logger.error(f"Change password error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "An error occurred while changing password",
                    "status": "error",
                }
            ),
            500,
        )
