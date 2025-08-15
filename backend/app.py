from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from api.auth import auth_bp
from config import config
from utils.database import init_db, test_connection
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
        init_db(app)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    
    # Basic health check endpoint
    @app.route('/')
    def home():
        return jsonify({
            'message': 'CoreConnect API is running',
            'status': 'success',
            'version': '1.0.0'
        })
    
    @app.route('/health')
    def health_check():
        db_status = test_connection()
        return jsonify({
            'status': 'healthy' if db_status else 'unhealthy',
            'database': 'connected' if db_status else 'disconnected',
            'timestamp': '2025-08-15T00:00:00Z'
        }), 200 if db_status else 503
    
    # API routes
    @app.route('/api/test')
    def api_test():
        return jsonify({
            'message': 'API endpoint is working',
            'data': 'Hello from Flask backend!'
        })
    
    @app.route('/api/stats')
    def api_stats():
        """Get API statistics"""
        try:
            user_model = User()
            stats = user_model.get_user_stats()
            
            return jsonify({
                'status': 'success',
                'stats': stats
            })
        except Exception as e:
            logger.error(f"Stats error: {str(e)}")
            return jsonify({
                'status': 'error',
                'error': 'Failed to get statistics'
            }), 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_DEBUG') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode, use_reloader=True, use_debugger=debug_mode)
