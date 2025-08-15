from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from api.auth import auth_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend communication - Updated for Vercel
CORS(app, origins=[
    "http://localhost:5173",  # Vite dev server
    "http://localhost:80",    # Docker frontend
    "http://localhost:3000",  # Alternative dev server
    "https://*.vercel.app",   # Vercel domains
    "https://core-connects.vercel.app",  # Your specific Vercel domain
    "https://core-connects-*.vercel.app"  # Preview deployments
], supports_credentials=True)

# Register blueprints
app.register_blueprint(auth_bp)

# Basic configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'

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
    return jsonify({
        'status': 'healthy',
        'timestamp': '2025-08-15T00:00:00Z'
    })

# API routes
@app.route('/api/test')
def api_test():
    return jsonify({
        'message': 'API endpoint is working',
        'data': 'Hello from Flask backend!'
    })

# Export the Flask app for Vercel
# This is the entry point that Vercel will use
if __name__ != '__main__':
    # For Vercel deployment
    from werkzeug.middleware.proxy_fix import ProxyFix
    app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_DEBUG') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode, use_reloader=True, use_debugger=debug_mode)
