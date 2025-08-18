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
    cors_origins = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:80",    # Docker frontend
        "http://localhost:3000",  # Alternative dev server
        "https://core-connect-seven.vercel.app",  # Production frontend
    ]
    
    # Add production URLs if available
    if os.getenv('FRONTEND_URL'):
        cors_origins.append(os.getenv('FRONTEND_URL'))
    
    # For Vercel deployment
    if os.getenv('VERCEL_URL'):
        cors_origins.append(f"https://{os.getenv('VERCEL_URL')}")
    
    # Allow all origins in development, specific origins in production
    if config_name == 'development':
        CORS(app, origins=cors_origins + ["*"], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
             allow_headers=['Content-Type', 'Authorization'], supports_credentials=True)
    else:
        CORS(app, origins=cors_origins, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
             allow_headers=['Content-Type', 'Authorization'], supports_credentials=True)
    
    # Ensure all responses are JSON
    @app.before_request
    def ensure_json_request():
        """Ensure request content type is correct for JSON endpoints"""
        if request.method in ['POST', 'PUT', 'PATCH'] and request.path.startswith('/api/'):
            if not request.is_json and request.content_length and request.content_length > 0:
                return jsonify({
                    'status': 'error',
                    'message': 'Request must be JSON',
                    'errors': {'content_type': 'Content-Type must be application/json'}
                }), 400
    
    # Initialize database
    try:
        init_database()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    
    # Add global error handlers
    @app.errorhandler(400)
    def handle_bad_request(e):
        """Handle 400 Bad Request errors"""
        return jsonify({
            'status': 'error',
            'message': 'Bad Request',
            'errors': {'request': str(e.description) if hasattr(e, 'description') else 'Invalid request'}
        }), 400

    @app.errorhandler(401)
    def handle_unauthorized(e):
        """Handle 401 Unauthorized errors"""
        return jsonify({
            'status': 'error',
            'message': 'Unauthorized',
            'errors': {'auth': str(e.description) if hasattr(e, 'description') else 'Authentication required'}
        }), 401

    @app.errorhandler(403)
    def handle_forbidden(e):
        """Handle 403 Forbidden errors"""
        return jsonify({
            'status': 'error',
            'message': 'Forbidden',
            'errors': {'auth': str(e.description) if hasattr(e, 'description') else 'Access denied'}
        }), 403

    @app.errorhandler(404)
    def handle_not_found(e):
        """Handle 404 Not Found errors"""
        return jsonify({
            'status': 'error',
            'message': 'Not Found',
            'errors': {'resource': 'The requested resource was not found'}
        }), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(e):
        """Handle 405 Method Not Allowed errors"""
        return jsonify({
            'status': 'error',
            'message': 'Method Not Allowed',
            'errors': {'method': str(e.description) if hasattr(e, 'description') else 'Method not allowed for this endpoint'}
        }), 405

    @app.errorhandler(500)
    def handle_internal_error(e):
        """Handle 500 Internal Server Error"""
        logger.error(f"Internal server error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal Server Error',
            'errors': {'server': 'An unexpected error occurred'}
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        """Handle any unexpected errors"""
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An unexpected error occurred',
            'errors': {'server': 'Please try again later'}
        }), 500
    
    # Add security middleware
    @app.after_request
    def add_security_headers(response):
        """Add security headers to all responses."""
        # Add CORS headers for production compatibility
        if request.method == 'OPTIONS':
            response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Max-Age'] = '86400'  # Cache preflight for 24 hours
        
        return SecurityMiddleware.add_security_headers(response)
    
    # Handle preflight requests
    @app.before_request
    def handle_preflight():
        """Handle CORS preflight requests"""
        if request.method == 'OPTIONS':
            response = jsonify({'status': 'success'})
            response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Max-Age'] = '86400'
            return response
    
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
    
    @app.route('/api/health')
    def api_health_check():
        """API-specific health check endpoint for deployment monitoring."""
        try:
            health_data = db_manager.health_check()
            
            # Check critical components
            checks = {
                'api': 'healthy',
                'database': 'healthy' if health_data['connected'] else 'unhealthy',
                'auth_service': 'healthy',  # Could add actual auth service check
                'timestamp': health_data.get('timestamp', ''),
                'version': '1.0.0'
            }
            
            # Determine overall health
            overall_health = all(status == 'healthy' for key, status in checks.items() 
                               if key not in ['timestamp', 'version'])
            
            if overall_health:
                return APIResponse.success(
                    data=checks,
                    message='All API services are healthy'
                )
            else:
                return ErrorResponses.service_unavailable(
                    "One or more API services are unhealthy",
                    details=checks
                )
        except Exception as e:
            logger.error(f"API health check error: {str(e)}")
            return ErrorResponses.internal_error("Health check failed")
    
    # API routes
    @app.route('/api/test')
    def api_test():
        return jsonify({
            'status': 'success',
            'message': 'API endpoint is working',
            'data': 'Hello from Flask backend!'
        })
    
    @app.route('/api/cors-test', methods=['GET', 'POST', 'OPTIONS'])
    def cors_test():
        """Explicit CORS test endpoint"""
        if request.method == 'OPTIONS':
            response = jsonify({'status': 'success', 'message': 'CORS preflight successful'})
        else:
            response = jsonify({
                'status': 'success',
                'message': 'CORS test endpoint',
                'data': {
                    'method': request.method,
                    'origin': request.headers.get('Origin'),
                    'user_agent': request.headers.get('User-Agent')
                }
            })
        
        # Explicitly set CORS headers
        origin = request.headers.get('Origin')
        allowed_origins = [
            'https://core-connect-seven.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ]
        
        if origin in allowed_origins or not origin:
            response.headers['Access-Control-Allow-Origin'] = origin or '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response
    
    @app.route('/api/test-json', methods=['POST'])
    def test_json():
        """Test JSON request/response handling"""
        try:
            data = request.get_json()
            return jsonify({
                'status': 'success',
                'message': 'JSON handling is working',
                'data': {
                    'received': data,
                    'method': request.method,
                    'content_type': request.content_type
                }
            }), 200
        except Exception as e:
            logger.error(f"JSON test error: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'JSON test failed',
                'errors': {'server': str(e)}
            }), 500
    
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
    
    @app.route('/api/status')
    def api_status():
        """Get detailed API status for deployment monitoring"""
        try:
            # Gather system information
            health_data = db_manager.health_check()
            
            status_info = {
                'api_version': '1.0.0',
                'service_name': 'CoreConnect API',
                'environment': os.getenv('FLASK_ENV', 'unknown'),
                'database': {
                    'status': 'connected' if health_data['connected'] else 'disconnected',
                    'details': health_data
                },
                'endpoints': {
                    'auth': 'available',
                    'health': 'available',
                    'cors': 'configured'
                },
                'deployment': {
                    'platform': 'render' if os.getenv('RENDER_EXTERNAL_URL') else 'unknown',
                    'url': os.getenv('RENDER_EXTERNAL_URL', 'unknown'),
                    'frontend_url': os.getenv('FRONTEND_URL', 'unknown')
                },
                'timestamp': health_data.get('timestamp', '')
            }
            
            return APIResponse.success(
                data=status_info,
                message='API status retrieved successfully'
            )
        except Exception as e:
            logger.error(f"Status check error: {str(e)}")
            return ErrorResponses.internal_error('Failed to get API status')
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_DEBUG') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode, use_reloader=True, use_debugger=debug_mode)
