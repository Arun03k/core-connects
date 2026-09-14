"""Central authentication, role policies and shared atomic rate limits."""

import hashlib
import logging
from datetime import datetime, timezone
from functools import wraps

from core.responses import APIResponse
from flask import request
from models.user import User
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from utils.auth_utils import verify_token
from utils.database import get_db

logger = logging.getLogger(__name__)
ROLES = frozenset({"ADMIN", "HR", "MANAGER", "EMPLOYEE"})


def user_role(user):
    role = str(user.get("role", "EMPLOYEE")).upper()
    return role if role in ROLES else "EMPLOYEE"


def enhanced_token_required(function):
    @wraps(function)
    def wrapped(*args, **kwargs):
        scheme, _, token = request.headers.get("Authorization", "").partition(" ")
        payload = verify_token(token) if scheme.lower() == "bearer" and token else None
        if not payload or payload.get("type") != "access":
            return APIResponse.error("Authentication required", 401, "UNAUTHORIZED")
        try:
            user = User().find_by_id(payload["user_id"])
        except Exception:
            logger.warning("authentication_store_unavailable")
            return APIResponse.error(
                "Authentication unavailable", 503, "SERVICE_UNAVAILABLE"
            )
        if not user or not user.get("is_active"):
            return APIResponse.error("Account is unavailable", 401, "UNAUTHORIZED")
        request.current_user = user
        request.current_token_payload = payload
        return function(*args, **kwargs)

    return wrapped


def roles_required(*roles):
    allowed = {role.upper() for role in roles}
    if not allowed <= ROLES:
        raise ValueError("Unknown role in permission policy")

    def decorate(function):
        @enhanced_token_required
        @wraps(function)
        def wrapped(*args, **kwargs):
            if user_role(request.current_user) not in allowed:
                return APIResponse.error("Access denied", 403, "FORBIDDEN")
            return function(*args, **kwargs)

        return wrapped

    return decorate


admin_required = roles_required("ADMIN")


def verified_email_required(function):
    @enhanced_token_required
    @wraps(function)
    def wrapped(*args, **kwargs):
        if not request.current_user.get("is_verified"):
            return APIResponse.error(
                "Email verification required", 403, "EMAIL_NOT_VERIFIED"
            )
        return function(*args, **kwargs)

    return wrapped


def rate_limit(max_requests=60, window_minutes=1, per="ip"):
    """Fixed-window Mongo counters. Client-supplied forwarded headers are untrusted."""

    def decorate(function):
        @wraps(function)
        def wrapped(*args, **kwargs):
            if request.method == "OPTIONS":
                return function(*args, **kwargs)
            seconds = window_minutes * 60
            now = int(datetime.now(timezone.utc).timestamp())
            window = now // seconds
            identity = request.remote_addr or "unknown"
            key = hashlib.sha256(
                f"{identity}:{request.endpoint}:{window}".encode()
            ).hexdigest()
            try:
                collection = get_db().rate_limits
                update = {
                    "$inc": {"count": 1},
                    "$setOnInsert": {
                        "key": key,
                        "expires_at": datetime.fromtimestamp(
                            (window + 1) * seconds, timezone.utc
                        ),
                    },
                }
                try:
                    counter = collection.find_one_and_update(
                        {"_id": key},
                        update,
                        upsert=True,
                        return_document=ReturnDocument.AFTER,
                    )
                except DuplicateKeyError:
                    counter = collection.find_one_and_update(
                        {"_id": key},
                        {"$inc": {"count": 1}},
                        return_document=ReturnDocument.AFTER,
                    )
            except Exception:
                logger.warning("rate_limit_store_unavailable")
                return APIResponse.error(
                    "Service temporarily unavailable", 503, "SERVICE_UNAVAILABLE"
                )
            if counter["count"] > max_requests:
                response, status = APIResponse.error(
                    "Too many requests. Please try again later.", 429, "RATE_LIMITED"
                )
                response.headers["Retry-After"] = str((window + 1) * seconds - now)
                return response, status
            # Handler exceptions must never cause a second invocation.
            return function(*args, **kwargs)

        return wrapped

    return decorate
