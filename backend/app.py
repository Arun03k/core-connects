from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from api.auth import auth_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app, origins=[
    "http://localhost:5173",  # Vite dev server
    "http://localhost:80",    # Docker frontend
    "http://localhost:3000",  # Alternative dev server
])

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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
