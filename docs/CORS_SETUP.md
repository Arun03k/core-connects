# CoreConnect Development Setup & CORS Configuration Guide

## Quick Start

### Development Environment
1. **Backend**: Run `scripts\dev-start-backend.bat` 
2. **Frontend**: Run `scripts\dev-start-frontend.bat`

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set FLASK_ENV=development
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Configuration

### Environment Files Structure
```
.env.example                    # Template for all environments
backend/
├── .env                       # Current development config
├── .env.development           # Development specific
├── .env.production           # Production specific
frontend/
├── .env                      # Current development config  
├── .env.development          # Development specific
├── .env.production           # Production specific
```

### CORS Configuration

#### Development CORS Origins
- `http://localhost:5173` - Vite dev server
- `http://localhost:3000` - Alternative dev server
- `http://localhost:80` - Docker frontend
- `http://127.0.0.1:5173` - Alternative localhost
- `http://127.0.0.1:3000` - Alternative localhost

#### Production CORS Origins
- `https://core-connect-seven.vercel.app` - Production frontend
- `https://core-connect-seven-*.vercel.app` - Vercel preview deployments

### Environment Variables

#### Backend Environment Variables
```bash
# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Database
MONGO_URI=mongodb://localhost:27017/coreconnect_dev
MONGO_DBNAME=coreconnect_dev

# CORS & Frontend URLs
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://your-frontend.vercel.app
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:80

# Dynamic frontend URL (auto-selected based on FLASK_ENV)
FRONTEND_URL=http://localhost:5173

# Application Settings
FLASK_ENV=development
FLASK_DEBUG=1
PORT=5000
```

#### Frontend Environment Variables
```bash
# Development
VITE_API_URL=http://localhost:5000
VITE_NODE_ENV=development
```

## CORS Implementation Details

### Backend CORS Configuration
- **Environment-based**: Uses `CORS_ALLOWED_ORIGINS` environment variable
- **Credentials Support**: Configured for cookies and authentication
- **Security Headers**: Proper `SameSite` and `Secure` cookie settings
- **Preflight Handling**: Explicit OPTIONS request handling

### Cookie Configuration
- **Development**: `SameSite=Lax` for local development
- **Production**: `SameSite=None; Secure` for cross-origin cookies

### Security Features
- Rate limiting on auth endpoints
- JWT token validation
- Secure headers middleware
- Environment-specific configurations

## Testing CORS

### Development Testing
1. Start backend: `http://localhost:5000`
2. Start frontend: `http://localhost:5173`
3. Test login/signup from browser dev tools:
   ```javascript
   fetch('http://localhost:5000/api/auth/login', {
     method: 'POST',
     credentials: 'include',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@test.com', password: 'password' })
   })
   ```

### Production Testing
- Deployed frontend should connect to production backend
- Check browser dev tools for CORS errors
- Verify cookie settings in production environment

## Troubleshooting

### Common CORS Issues
1. **Preflight failures**: Check OPTIONS request responses
2. **Credential issues**: Verify `supports_credentials=True` and cookie settings
3. **Origin mismatches**: Ensure frontend URL is in CORS_ALLOWED_ORIGINS

### Debug Commands
```bash
# Check current CORS origins
curl -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -X OPTIONS http://localhost:5000/api/auth/login

# Check backend configuration
curl http://localhost:5000/api/status
```

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use `.env.example` as template
- Generate secure keys for production
- Rotate secrets regularly

### CORS Security
- Specific origins in production (no wildcards)
- Proper credential handling
- Secure cookie settings in production
- Rate limiting on sensitive endpoints
