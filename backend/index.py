"""
Vercel Serverless Function Entry Point
Simplified entry point that imports from the main application
"""

from app import create_app

# Create app instance for Vercel with production settings
app = create_app("production")

# Vercel serverless function handler
app.wsgi_app = app.wsgi_app
