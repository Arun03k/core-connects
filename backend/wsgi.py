"""
WSGI Entry Point for CoreConnect Backend
Unified entry point for both development and production deployments
"""

import os

from app import create_app

# Determine environment and create app
environment = os.getenv("FLASK_ENV", "production")
app = create_app(environment)

# Vercel serverless function handler
# This is the entry point that Vercel will use
app.wsgi_app = app.wsgi_app

# Application instance for WSGI servers
application = app

if __name__ == "__main__":
    # For local development
    port = int(os.getenv("PORT", 5000))
    debug_mode = environment == "development" or os.getenv("FLASK_DEBUG") == "1"

    app.run(
        host="0.0.0.0",
        port=port,
        debug=debug_mode,
        use_reloader=True,
        use_debugger=debug_mode,
    )
