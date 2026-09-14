import logging
import os

from api.auth import auth_bp
from core.database import db_manager, init_database
from core.responses import APIResponse, ErrorResponses
from core.security import SecurityMiddleware
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from middleware.auth_middleware import roles_required
from models.user import User
from werkzeug.exceptions import HTTPException

from config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


def create_app(config_name=None, config_overrides=None):
    """Application factory pattern for both development and production"""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config[config_name])

    if config_overrides:
        app.config.update(config_overrides)
    if config_name == "production":
        for name in ("SECRET_KEY", "JWT_SECRET_KEY"):
            value = (config_overrides or {}).get(name) or os.getenv(name)
            if (
                not value
                or len(value) < 32
                or value.startswith(("dev-", "change-", "replace-"))
            ):
                raise ValueError(
                    f"Production requires a strong {name} of at least 32 characters"
                )
            app.config[name] = value
    configured_origins = os.getenv("CORS_ORIGINS", app.config["FRONTEND_URL"])
    origins = (config_overrides or {}).get("CORS_ORIGINS") or [
        value.strip() for value in configured_origins.split(",") if value.strip()
    ]
    if any("*" in origin for origin in origins):
        raise ValueError("CORS_ORIGINS must contain explicit origins")
    CORS(
        app,
        origins=origins,
        supports_credentials=False,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    @app.before_request
    def validate_json_body():
        if request.method in {"POST", "PUT", "PATCH"} and request.path.startswith(
            "/api/"
        ):
            if request.content_length:
                if not request.is_json:
                    return APIResponse.error(
                        "Request must be JSON", 415, "UNSUPPORTED_MEDIA_TYPE"
                    )
                data = request.get_json()
                if not isinstance(data, dict):
                    return APIResponse.error(
                        "Request must be a JSON object", 400, "INVALID_REQUEST"
                    )
                for field in (
                    "email",
                    "password",
                    "newPassword",
                    "old_password",
                    "new_password",
                    "token",
                    "refreshToken",
                ):
                    if field in data and not isinstance(data[field], str):
                        return APIResponse.error(
                            f"{field} must be a string", 400, "INVALID_REQUEST"
                        )

    db_manager.init_app(app)

    @app.cli.command("init-db")
    def initialize_database_command():
        """Apply additive authentication indexes; never seed or delete users."""
        init_database()
        print("Authentication indexes are ready.")

    # Register blueprints
    app.register_blueprint(auth_bp)

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return APIResponse.error(
            error.name, error.code, error.name.upper().replace(" ", "_")
        )

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        logger.error("unhandled_request_error type=%s", type(error).__name__)
        return APIResponse.error("An unexpected error occurred", 500, "INTERNAL_ERROR")

    @app.after_request
    def add_security_headers(response):
        if request.path.startswith("/api/auth"):
            response.headers["Cache-Control"] = "no-store"
        return SecurityMiddleware.add_security_headers(response)

    # Basic health check endpoint
    @app.route("/")
    def home():
        return APIResponse.success(
            data={
                "version": "1.0.0",
                "api_name": "CoreConnect API",
                "documentation": "/docs",
                "health_check": "/health",
            },
            message="CoreConnect API is running",
        )

    @app.route("/health")
    def health_check():
        """Comprehensive health check endpoint."""
        health_data = db_manager.health_check()

        return (
            APIResponse.success(
                data={"api": "healthy", "database": health_data, "version": "1.0.0"},
                message=(
                    "Service is healthy"
                    if health_data["connected"]
                    else "Service has issues"
                ),
            )
            if health_data["connected"]
            else ErrorResponses.service_unavailable("Database connection issues")
        )

    @app.route("/api/health")
    def api_health_check():
        """API-specific health check endpoint for deployment monitoring."""
        try:
            health_data = db_manager.health_check()

            # Check critical components
            checks = {
                "api": "healthy",
                "database": "healthy" if health_data["connected"] else "unhealthy",
                "auth_service": "healthy",  # Could add actual auth service check
                "timestamp": health_data.get("timestamp", ""),
                "version": "1.0.0",
            }

            # Determine overall health
            overall_health = all(
                status == "healthy"
                for key, status in checks.items()
                if key not in ["timestamp", "version"]
            )

            if overall_health:
                return APIResponse.success(
                    data=checks, message="All API services are healthy"
                )
            else:
                return ErrorResponses.service_unavailable(
                    "One or more API services are unhealthy", details=checks
                )
        except Exception as e:
            logger.error(f"API health check error: {str(e)}")
            return ErrorResponses.internal_error("Health check failed")

    # API routes
    @app.route("/api/stats")
    @roles_required("ADMIN", "HR")
    def api_stats():
        """Get API statistics"""
        try:
            user_model = User()
            stats = user_model.get_user_stats()

            return APIResponse.success(
                data=stats, message="Statistics retrieved successfully"
            )
        except Exception as e:
            logger.error(f"Stats error: {str(e)}")
            return ErrorResponses.internal_error("Failed to get statistics")

    @app.route("/api/status")
    @roles_required("ADMIN")
    def api_status():
        """Get detailed API status for deployment monitoring"""
        try:
            # Gather system information
            health_data = db_manager.health_check()

            status_info = {
                "api_version": "1.0.0",
                "service_name": "CoreConnect API",
                "environment": os.getenv("FLASK_ENV", "unknown"),
                "database": {
                    "status": (
                        "connected" if health_data["connected"] else "disconnected"
                    ),
                    "details": health_data,
                },
                "endpoints": {
                    "auth": "available",
                    "health": "available",
                    "cors": "configured",
                },
                "deployment": {
                    "platform": (
                        "render" if os.getenv("RENDER_EXTERNAL_URL") else "unknown"
                    ),
                    "url": os.getenv("RENDER_EXTERNAL_URL", "unknown"),
                    "frontend_url": os.getenv("FRONTEND_URL", "unknown"),
                },
                "timestamp": health_data.get("timestamp", ""),
            }

            return APIResponse.success(
                data=status_info, message="API status retrieved successfully"
            )
        except Exception as e:
            logger.error(f"Status check error: {str(e)}")
            return ErrorResponses.internal_error("Failed to get API status")

    return app


# Create app instance
app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug_mode = (
        os.getenv("FLASK_ENV") == "development" or os.getenv("FLASK_DEBUG") == "1"
    )
    app.run(
        host="0.0.0.0",
        port=port,
        debug=debug_mode,
        use_reloader=True,
        use_debugger=debug_mode,
    )
