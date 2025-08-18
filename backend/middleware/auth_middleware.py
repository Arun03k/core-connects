"""
Enhanced authentication middleware with rate limiting and security features
"""

import logging
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import jsonify, request

from models.user import User
from utils.auth_utils import verify_token
from utils.database import get_db

logger = logging.getLogger(__name__)


class AuthMiddleware:
    """Enhanced authentication middleware"""

    def __init__(self):
        self.user_model = User()
        self.db = None

    def _get_collection(self, collection_name: str):
        """Get database collection"""
        if self.db is None:
            self.db = get_db()
        return self.db[collection_name]

    def _get_client_ip(self, request):
        """Get client IP address"""
        # Check for forwarded IP first (behind proxy/load balancer)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        # Check other common headers
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        # Fall back to remote_addr
        return request.environ.get("REMOTE_ADDR", "unknown")

    def rate_limit(
        self, max_requests: int = 60, window_minutes: int = 1, per: str = "ip"
    ):
        """Rate limiting decorator"""

        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                try:
                    # Get identifier for rate limiting
                    if per == "ip":
                        identifier = self._get_client_ip(request)
                    elif per == "user":
                        # Get user from token if available
                        auth_header = request.headers.get("Authorization")
                        if auth_header and auth_header.startswith("Bearer "):
                            token = auth_header[7:]
                            payload = verify_token(token)
                            if payload:
                                identifier = payload.get(
                                    "user_id", self._get_client_ip(request)
                                )
                            else:
                                identifier = self._get_client_ip(request)
                        else:
                            identifier = self._get_client_ip(request)
                    else:
                        identifier = self._get_client_ip(request)

                    # Get current window
                    now = datetime.now(timezone.utc)
                    window_start = now - timedelta(minutes=window_minutes)

                    # Check rate limit
                    rate_limits = self._get_collection("rate_limits")

                    # Count requests in current window
                    request_count = rate_limits.count_documents(
                        {
                            "identifier": identifier,
                            "endpoint": request.endpoint,
                            "timestamp": {"$gte": window_start},
                        }
                    )

                    if request_count >= max_requests:
                        logger.warning(
                            f"Rate limit exceeded for {identifier} on {request.endpoint}"
                        )
                        return (
                            jsonify(
                                {
                                    "status": "error",
                                    "message": "Rate limit exceeded. Please try again later.",
                                    "errors": {"rateLimit": "Too many requests"},
                                }
                            ),
                            429,
                        )

                    # Record this request
                    rate_limits.insert_one(
                        {
                            "identifier": identifier,
                            "endpoint": request.endpoint,
                            "timestamp": now,
                            "ip_address": self._get_client_ip(request),
                            "user_agent": request.headers.get("User-Agent", ""),
                        }
                    )

                    # Clean up old records (optional, can be done via background job)
                    cutoff_time = now - timedelta(hours=24)
                    rate_limits.delete_many({"timestamp": {"$lt": cutoff_time}})

                    return f(*args, **kwargs)

                except Exception as e:
                    logger.error(f"Rate limiting error: {str(e)}")
                    # On error, allow the request to proceed
                    return f(*args, **kwargs)

            return decorated_function

        return decorator

    def enhanced_token_required(self, f):
        """Enhanced token validation with additional security checks"""

        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None

            # Get token from Authorization header
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header[7:]

            if not token:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Authentication token is missing",
                            "errors": {"token": "Token is required"},
                        }
                    ),
                    401,
                )

            # Verify token
            payload = verify_token(token)
            if not payload:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Token is invalid or expired",
                            "errors": {"token": "Invalid or expired token"},
                        }
                    ),
                    401,
                )

            # Additional security checks
            if payload.get("type") != "access":
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Invalid token type",
                            "errors": {"token": "Invalid token type"},
                        }
                    ),
                    401,
                )

            # Get user from database
            try:
                user = self.user_model.find_by_id(payload["user_id"])
                if not user:
                    return (
                        jsonify(
                            {
                                "status": "error",
                                "message": "User not found",
                                "errors": {"user": "User not found"},
                            }
                        ),
                        401,
                    )

                if not user.get("is_active"):
                    return (
                        jsonify(
                            {
                                "status": "error",
                                "message": "Account is deactivated",
                                "errors": {"user": "Account is deactivated"},
                            }
                        ),
                        401,
                    )

                # Add user to request context
                request.current_user = user
                request.current_token_payload = payload

                # Log access for security monitoring
                self._log_access(user, request)

            except Exception as e:
                logger.error(f"User verification error: {str(e)}")
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Failed to verify user",
                            "errors": {"server": "Internal server error"},
                        }
                    ),
                    500,
                )

            return f(*args, **kwargs)

        return decorated_function

    def _log_access(self, user, request):
        """Log user access for security monitoring"""
        try:
            access_logs = self._get_collection("access_logs")
            access_logs.insert_one(
                {
                    "user_id": str(user["_id"]),
                    "email": user["email"],
                    "endpoint": request.endpoint,
                    "method": request.method,
                    "ip_address": self._get_client_ip(request),
                    "user_agent": request.headers.get("User-Agent", ""),
                    "timestamp": datetime.now(timezone.utc),
                }
            )
        except Exception as e:
            logger.error(f"Access logging error: {str(e)}")

    def admin_required(self, f):
        """Require admin role (can be extended for role-based access)"""

        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = getattr(request, "current_user", None)

            if not user:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Authentication required",
                            "errors": {"auth": "Authentication required"},
                        }
                    ),
                    401,
                )

            # Check if user has admin role
            user_role = user.get("role", "user")
            if user_role != "admin":
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Admin access required",
                            "errors": {"permission": "Admin access required"},
                        }
                    ),
                    403,
                )

            return f(*args, **kwargs)

        return decorated_function

    def verified_email_required(self, f):
        """Require verified email address"""

        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = getattr(request, "current_user", None)

            if not user:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Authentication required",
                            "errors": {"auth": "Authentication required"},
                        }
                    ),
                    401,
                )

            if not user.get("is_verified", False):
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Email verification required",
                            "errors": {
                                "verification": "Please verify your email address"
                            },
                        }
                    ),
                    403,
                )

            return f(*args, **kwargs)

        return decorated_function


# Create global middleware instance
auth_middleware = AuthMiddleware()

# Export decorators for easy import
rate_limit = auth_middleware.rate_limit
enhanced_token_required = auth_middleware.enhanced_token_required
admin_required = auth_middleware.admin_required
verified_email_required = auth_middleware.verified_email_required
