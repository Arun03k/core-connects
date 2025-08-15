# 🚀 CoreConnect Development Guide

This guide explains how to set up CoreConnect for development with **live reloading** - no more rebuilding Docker containers for every change!

## 🔥 Hot Reload Development Setup

### 🎯 What You Get
- **Frontend**: Vite dev server with instant hot reload (React components update live)
- **Backend**: Flask with auto-restart when Python files change
- **No Rebuilds**: Code changes are reflected immediately
- **Docker Volumes**: Your local files are mounted into containers

### 🚀 Quick Start

#### Option 1: Use the Batch Script (Recommended)
```cmd
# Start development with hot reload
dev-start.bat

# Stop development environment (in another terminal)
dev-stop.bat
```

#### Option 2: Docker Compose Commands
```cmd
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment (Ctrl+C, then:)
docker-compose -f docker-compose.dev.yml down
```

### 🌐 Access URLs

Once started, you can access:

- **Frontend (Hot Reload)**: http://localhost:5173
- **Frontend (Alternative)**: http://localhost:80 
- **Backend API**: http://localhost:5000
- **Backend Health**: http://localhost:5000/health

### 🔄 How Hot Reload Works

#### Frontend (React + Vite)
- ✅ **Component changes**: Instantly reflected
- ✅ **CSS changes**: Update without page refresh  
- ✅ **TypeScript changes**: Compiled and updated live
- ✅ **New files**: Automatically detected
- ✅ **Routing changes**: Updated immediately

#### Backend (Flask)
- ✅ **Python code changes**: Server restarts automatically
- ✅ **API route changes**: Available immediately after restart
- ✅ **Config changes**: Picked up on restart
- ✅ **New modules**: Imported automatically

### 📁 File Structure for Development

```
core-connect/
├── docker-compose.dev.yml        # Development configuration
├── dev-start.bat                 # Development startup script
├── dev-stop.bat                  # Development cleanup script
├── backend/
│   ├── Dockerfile.dev            # Development backend container
│   └── [your python files]      # These will auto-reload
└── frontend/
    ├── Dockerfile.dev            # Development frontend container  
    ├── vite.config.ts            # Configured for Docker hot reload
    └── src/                      # These will hot reload
        └── [your react files]
```

### 🛠️ Development Workflow

1. **Start the environment**
   ```cmd
   dev-start.bat
   ```

2. **Make your changes**
   - Edit any file in `backend/` or `frontend/src/`
   - Changes appear immediately (frontend) or after auto-restart (backend)

3. **View logs** (if needed)
   ```cmd
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. **Stop when done**
   ```cmd
   dev-stop.bat
   ```

### 🐛 Troubleshooting

#### Frontend not updating?
- Check if Vite dev server is running: http://localhost:5173
- Look for TypeScript errors in the console
- Restart with: `docker-compose -f docker-compose.dev.yml restart frontend`

#### Backend not restarting?
- Check Flask logs: `docker-compose -f docker-compose.dev.yml logs backend`
- Ensure files are saved properly
- Restart with: `docker-compose -f docker-compose.dev.yml restart backend`

#### Port conflicts?
- Make sure ports 5173, 5000, and 80 are not used by other applications
- Stop other development servers before starting

### 🆚 Development vs Production

| Feature | Development (`docker-compose.dev.yml`) | Production (`docker-compose.yml`) |
|---------|-----------------------------------|----------------------------------|
| Frontend | Vite dev server (hot reload) | Nginx with built files |
| Backend | Flask dev mode (auto-restart) | Flask production mode |
| Volumes | Local files mounted | Files copied into container |
| Rebuilds | Not needed for code changes | Required for any changes |
| Performance | Optimized for development | Optimized for performance |
| URLs | Frontend: :5173, Backend: :5000 | Frontend: :80, Backend: :5000 |

### 💡 Pro Tips

1. **Keep dev environment running**: Start it once and code all day
2. **Use the batch scripts**: They handle cleanup and provide helpful output
3. **Check logs**: If something's not working, logs will tell you why
4. **Port mapping**: Frontend is available on both :80 and :5173 in dev mode
5. **File watching**: The setup uses polling for better Docker compatibility

### 🧪 Testing Changes

- **Frontend**: Open http://localhost:5173, make a change, see it instantly
- **Backend**: Make a Python change, wait ~2 seconds for restart, test API
- **Full stack**: Both frontend and backend work together seamlessly

---

Happy coding! 🎉 No more waiting for Docker rebuilds!
