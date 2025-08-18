# CoreConnect Backend

## Project Structure

```
backend/
├── api/                    # API endpoints and routes
├── core/                   # Core functionality (database, security, responses)
├── middleware/             # Custom middleware
├── models/                 # Data models
├── services/               # Business logic services
├── utils/                  # Utility functions
├── tests/                  # Unit and integration tests
├── config/                 # Configuration files
│   ├── .flake8            # Code quality configuration
│   └── pyproject.toml     # Python project configuration
├── docker/                 # Docker-related files
│   ├── Dockerfile         # Production Docker image
│   ├── Dockerfile.dev     # Development Docker image
│   └── .dockerignore      # Docker ignore rules
├── deployment/             # Deployment-specific files
│   └── vercel-index.py    # Original Vercel configuration (reference)
├── app.py                  # Main Flask application factory
├── index.py                # Vercel serverless entry point
├── wsgi.py                 # WSGI application entry point
├── config.py               # Application configuration
└── requirements.txt        # Python dependencies
```

## Entry Points

- **app.py**: Main application factory (development and production)
- **index.py**: Vercel serverless function entry point
- **wsgi.py**: WSGI application entry point for traditional deployments

## Development

Run the application locally:
```bash
python app.py
```

## Deployment

The application supports multiple deployment methods:
- **Vercel**: Uses `index.py` as the serverless function entry point
- **Traditional WSGI**: Uses `wsgi.py` for servers like Gunicorn
- **Docker**: Uses Docker files in the `docker/` directory

## Configuration

Configuration files are organized in the `config/` directory:
- Code quality settings (`.flake8`, `pyproject.toml`)
- Application configuration (`config.py`)
