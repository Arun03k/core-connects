# CoreConnect Backend

Flask-based backend API for the CoreConnect application.

## 🐳 Docker Setup (Recommended)

The easiest way to run the backend is using Docker. This ensures consistent environment across all systems.

### Quick Start with Docker

1. **From the project root:**
   ```bash
   # Start backend only
   docker-compose up -d backend
   
   # Or start full application (frontend + backend)
   docker-compose up -d
   ```

2. **Check backend health:**
   ```bash
   curl http://localhost:5000/health
   ```

3. **View backend logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

## 🛠️ Development with Docker

### Backend Development

1. **Start backend in development mode:**
   ```bash
   docker-compose up -d backend
   ```

2. **Access backend container for debugging:**
   ```bash
   docker-compose exec backend sh
   ```

3. **Run tests inside container:**
   ```bash
   docker-compose exec backend python -m pytest
   ```

4. **View real-time logs:**
   ```bash
   docker-compose logs -f backend
   ```

### Environment Configuration

Set environment variables in docker-compose.yml or create a .env file:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
PORT=5000
```

## 📋 Manual Setup (Local Development Only)

⚠️ **Note**: This method is only recommended if you cannot use Docker.

### Prerequisites
- Python 3.11 or higher
- pip (Python package manager)

### Local Installation Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment:**
   ```bash
   copy .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/` - Basic API status
- **GET** `/health` - Health check endpoint

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration  
- **POST** `/api/auth/logout` - User logout

### Test
- **GET** `/api/test` - Test API endpoint

## 📁 Project Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── test_app.py         # Test suite
├── Dockerfile          # Container configuration
├── .dockerignore       # Docker ignore rules
├── README.md          # Backend documentation
├── .env.example       # Environment template
├── .gitignore         # Git ignore file
├── api/               # API route modules
│   ├── __init__.py
│   └── auth.py        # Authentication routes
├── models/            # Database models (ready for expansion)
│   └── __init__.py
└── utils/             # Utility functions
    └── __init__.py
```

## 🔧 Development

### Adding New Routes
1. Create a new file in the `api/` directory
2. Define your blueprint
3. Register the blueprint in `app.py`

### Adding Models
1. Create model files in the `models/` directory
2. Import and use them in your route handlers

### Running Tests
```bash
# Using Docker (recommended)
docker-compose exec backend python -m pytest

# Local development
python -m pytest
```

## 🌐 Environment Variables

- `FLASK_ENV` - Set to 'development' for debug mode
- `SECRET_KEY` - Secret key for Flask sessions
- `PORT` - Port to run the server on (default: 5000)

## 🔗 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:80` (Docker frontend)

## 📊 Health Monitoring

- `GET /health` - Health check endpoint
- Container includes built-in health checks
- Logs available via `docker-compose logs backend`
