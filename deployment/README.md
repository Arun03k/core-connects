# CoreConnect Deployment Configuration

## Platform-Specific Deployment Files

This directory contains deployment configurations for various platforms:

```
deployment/
├── Procfile           # Heroku deployment configuration
├── render.yaml        # Render.com deployment configuration  
├── .vercelignore      # Vercel ignore rules
├── .trivyignore       # Trivy security scanner ignore rules
└── README.md          # This documentation
```

## Deployment Platforms

### Vercel (Primary)
- **Configuration**: `../vercel.json` (root level)
- **Frontend**: Automatically built and deployed from `frontend/`
- **Backend**: Serverless functions from `backend/index.py`
- **Ignore rules**: `.vercelignore`

### Render.com
- **Configuration**: `render.yaml`
- **Full-stack deployment** with web service and database
- **Auto-deployment** from Git pushes

### Heroku
- **Configuration**: `Procfile`
- **Process types** defined for web dyno
- **Buildpacks** automatically detected

### Docker
- **Configuration**: `../config/docker-compose*.yml`
- **Multi-container setup** for development and production
- **Database**: MongoDB container included

## Security Scanning

### Trivy
- **Ignore rules**: `.trivyignore`
- **Container vulnerability scanning**
- **Integrated in CI/CD pipeline**

## Environment Variables

Each platform requires the following environment variables:

### Required
- `MONGODB_URI`: Database connection string
- `JWT_SECRET_KEY`: JWT token signing key
- `FLASK_ENV`: Environment (development/production)

### Optional
- `FRONTEND_URL`: Frontend application URL
- `EMAIL_*`: Email service configuration
- `RATE_LIMIT_*`: Rate limiting configuration

## CI/CD Integration

All deployment configurations are integrated with GitHub Actions workflows in `../.github/workflows/`:
- Automated testing before deployment
- Security scanning with Trivy
- Multi-platform deployment support
