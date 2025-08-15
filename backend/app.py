from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from api.auth import auth_bp
from config import config
from core.database import init_database, db_manager
from core.security import SecurityMiddleware
from core.responses import APIResponse, ErrorResponses
from models.user import User
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Enable CORS for frontend communication
    CORS(app, origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:80",    # Docker frontend
        "http://localhost:3000",  # Alternative dev server
    ])
    
    # Initialize database
    try:
        init_database()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    
    # Add security middleware
    @app.after_request
    def add_security_headers(response):
        """Add security headers to all responses."""
        return SecurityMiddleware.add_security_headers(response)
    
    # Basic health check endpoint
    @app.route('/')
    def home():
        return APIResponse.success(
            data={
                'version': '1.0.0',
                'api_name': 'CoreConnect API',
                'documentation': '/docs',
                'health_check': '/health'
            },
            message='CoreConnect API is running'
        )
    
    @app.route('/health')
    def health_check():
        """Comprehensive health check endpoint."""
        health_data = db_manager.health_check()
        
        return APIResponse.success(
            data={
                'api': 'healthy',
                'database': health_data,
                'version': '1.0.0'
            },
            message='Service is healthy' if health_data['connected'] else 'Service has issues'
        ) if health_data['connected'] else ErrorResponses.service_unavailable("Database connection issues")
    
    # API routes
    @app.route('/api/test')
    def api_test():
        return APIResponse.success(
            data='Hello from Flask backend!',
            message='API endpoint is working'
        )
    
    @app.route('/api/stats')
    def api_stats():
        """Get API statistics"""
        try:
            user_model = User()
            stats = user_model.get_user_stats()
            
            return APIResponse.success(
                data=stats,
                message='Statistics retrieved successfully'
            )
        except Exception as e:
            logger.error(f"Stats error: {str(e)}")
            return ErrorResponses.internal_error('Failed to get statistics')
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_DEBUG') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode, use_reloader=True, use_debugger=debug_mode)
