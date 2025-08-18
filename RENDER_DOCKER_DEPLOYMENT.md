# Render Deployment with Docker - CoreConnect Backend

## Overview
This guide will help you deploy your CoreConnect backend to Render using your existing Docker configuration.

## Prerequisites
1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **MongoDB Atlas**: Set up a MongoDB cluster for production
4. **Email Service**: Configure SMTP credentials (Gmail App Password recommended)

## Step-by-Step Deployment Guide

### Step 1: Prepare Your Repository

Ensure your repository is up to date with the latest changes:

```bash
git add .
git commit -m "Prepare for Render deployment with Docker"
git push origin main
```

### Step 2: Create Web Service on Render

1. **Login to Render**:
   - Go to [render.com](https://render.com)
   - Sign in with your GitHub account

2. **Create New Web Service**:
   - Click "New +" in the dashboard
   - Select "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Connect and select your `core-connects` repository

### Step 3: Configure Service Settings

**Basic Settings**:
- **Name**: `coreconnect-backend`
- **Environment**: `Docker`
- **Region**: Choose the closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main`

**Build Settings**:
- **Root Directory**: `backend` (important!)
- **Dockerfile Path**: `Dockerfile` (Render will auto-detect)

**Deploy Settings**:
- **Runtime**: Docker will be auto-selected
- **Build Command**: Leave empty (Docker handles this)
- **Start Command**: Leave empty (Docker CMD handles this)

### Step 4: Set Environment Variables

In the "Environment" section, add these variables:

#### Required Variables:
```
FLASK_ENV=production
SECRET_KEY=<generate-a-secure-32-character-key>
JWT_SECRET_KEY=<generate-a-secure-jwt-key>
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGO_DBNAME=coreconnect_prod
PORT=5000
```

#### CORS and Frontend:
```
FRONTEND_URL=https://core-connects.vercel.app
RENDER_EXTERNAL_URL=https://coreconnect-backend.onrender.com
```

#### Email Configuration:
```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=<your-email@gmail.com>
MAIL_PASSWORD=<your-gmail-app-password>
MAIL_DEFAULT_SENDER=<your-email@gmail.com>
```

#### Security Settings:
```
BCRYPT_ROUNDS=12
RATE_LIMIT_PER_MINUTE=60
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=1800
JWT_ACCESS_TOKEN_EXPIRES=900
JWT_REFRESH_TOKEN_EXPIRES=604800
```

### Step 5: Advanced Settings

**Health Check**:
- **Health Check Path**: `/health`
- **Health Check Interval**: `30s`
- **Health Check Timeout**: `10s`

**Instance Settings**:
- **Plan**: Start with "Free" for testing, upgrade to "Starter" for production
- **Auto-Deploy**: Enable for automatic deployments on git push

### Step 6: Deploy

1. Click "Create Web Service"
2. Render will start building your Docker container
3. Monitor the build logs for any issues
4. Once deployed, your service will be available at: `https://coreconnect-backend.onrender.com`

### Step 7: Test Your Deployment

**Health Check**:
```bash
curl https://coreconnect-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Service is healthy",
  "data": {
    "api": "healthy",
    "database": {
      "connected": true,
      "status": "healthy"
    },
    "version": "1.0.0"
  }
}
```

**API Test**:
```bash
curl https://coreconnect-backend.onrender.com/api/test
```

## Docker Configuration Details

### Current Docker Setup Analysis:

**Production Dockerfile** (`backend/Dockerfile`):
- ✅ Uses Python 3.11 slim
- ✅ Sets proper environment variables
- ✅ Includes health check
- ✅ Creates non-root user for security
- ✅ Exposes port 5000
- ✅ Optimized layer caching

**What Render Does**:
1. Clones your repository
2. Navigates to the `backend` directory
3. Builds the Docker image using your Dockerfile
4. Runs the container with environment variables
5. Routes traffic to your container

## Environment Variables Reference

### MongoDB Atlas Setup:
1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user with read/write permissions
3. Get connection string: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
4. Whitelist all IP addresses (0.0.0.0/0) or add Render's IP ranges

### Gmail App Password Setup:
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings > Security > 2-Step Verification
3. Generate an "App Password" for "Mail"
4. Use this 16-character password for `MAIL_PASSWORD`

### Security Key Generation:
```python
# Run this in Python to generate secure keys
import secrets
print("SECRET_KEY:", secrets.token_urlsafe(32))
print("JWT_SECRET_KEY:", secrets.token_urlsafe(32))
```

## Troubleshooting

### Common Issues:

**Build Failures**:
- Check that all dependencies are in `requirements.txt`
- Verify Dockerfile syntax
- Check build logs in Render dashboard

**Health Check Failures**:
- Ensure `/health` endpoint is accessible
- Verify MongoDB connection
- Check environment variables are set correctly

**Database Connection Issues**:
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has correct permissions

**CORS Issues**:
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Check that CORS origins are configured correctly

### Monitoring:
- Render provides built-in logs and metrics
- Set up alerts for service downtime
- Monitor response times and error rates

## Scaling and Performance

**Free Tier Limitations**:
- Service may sleep after 15 minutes of inactivity
- Limited to 750 hours per month
- Shared resources

**Paid Tier Benefits**:
- Always-on service
- Dedicated resources
- Better performance
- SSL certificates
- Custom domains

## Next Steps After Backend Deployment

1. **Test all endpoints** thoroughly
2. **Deploy frontend** to Vercel with correct backend URL
3. **Set up monitoring** and alerts
4. **Configure custom domain** (optional)
5. **Set up CI/CD pipeline** for automated deployments

Your Docker-based deployment on Render will be production-ready with proper containerization, health checks, and security measures in place!
