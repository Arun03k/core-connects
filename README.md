# CoreConnect - Complete Workforce Management Platform

![CoreConnect Banner](src/assets/backgroundLanding.png)

## 🚀 Live Demo

**🌐 Production Website**: https://core-connect-iqcmjox77-arun03ks-projects.vercel.app
**📊 Project Dashboard**: https://vercel.com/arun03ks-projects/core-connect
**🔗 GitHub Repository**: https://github.com/Arun03k/core-connects

## 🚀 Overview

CoreConnect is a modern, comprehensive workforce management platform designed to empower both HR teams and employees with powerful tools for managing the entire employee lifecycle. From onboarding to daily operations, CoreConnect streamlines processes and enhances productivity across your organization.

**✅ NOW LIVE ON VERCEL** - The application has been successfully deployed and is fully functional with both frontend and backend services running on Vercel's serverless platform.

## ✨ Current Features (Completed)

### 🌐 Landing Page ✅
- Modern, responsive design with animated components
- Professional hero section with gradient backgrounds
- Interactive feature cards with hover effects
- Mobile-first design principles
- Performance-optimized loading animations

### 📚 Documentation System ✅
- Interactive documentation with tabbed navigation
- Comprehensive setup guides (Docker & manual)
- Technology stack overview
- Feature roadmap with progress tracking
- Responsive design with smooth animations

### 🔐 Authentication Framework ✅
- Complete Redux authentication state management
- Login and signup component architecture
- Protected route system with authentication guards
- JWT token handling and persistence
- Form validation and error handling

### 🐳 Docker Containerization ✅
- Production-ready Docker containers
- Multi-stage builds for optimized images
- Development and production environments
- Health checks and monitoring
- Automated CI/CD pipeline integration

### ☁️ **Vercel Deployment ✅ NEW!**
- **Full-stack serverless deployment** on Vercel platform
- **Frontend**: React + Vite static site deployment
- **Backend**: Flask Python serverless functions
- **Production optimized** builds with CDN distribution
- **Environment variables** configured for production security
- **Automatic HTTPS** and custom domain support ready

### 🎨 Component Library ✅
- Reusable UI components (Button, InputField)
- Material-UI integration with custom theming
- TypeScript interfaces and type safety
- Consistent styling with Emotion CSS-in-JS

### 🚀 Development Infrastructure ✅
- Hot reload development environment
- ESLint and TypeScript configuration
- Automated testing setup (backend with pytest)
- GitHub Actions CI/CD pipeline
- Security scanning and vulnerability checks

## 🔄 Planned Features (Under Development)

### 👥 Employee Management
- Comprehensive HR tools for managing profiles, roles, and departments
- Organizational structure management with role-based access
- Employee lifecycle tracking from hiring to offboarding

### ⏰ Time Tracking
- Log working hours with intuitive time tracking interface
- Track productivity and manage overtime automatically
- Generate detailed timesheets and reports
- Real-time attendance monitoring

### 📅 Leave Management
- Self-service leave request system
- Real-time leave balance checking
- Automated approval workflows
- Team calendar integration
- Conflict detection and resolution

### 📋 Task Management
- Personal task and project management
- Assignment and deadline tracking
- Productivity insights and analytics
- Collaborative project tools

## 🛠 Technology Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Fast build tool and dev server
- **Material-UI 7.3.1** - Modern component library
- **Emotion 11.14.0** - CSS-in-JS styling solution
- **React Router DOM 7.8.0** - Client-side routing
- **Redux Toolkit 2.8.2** - State management
- **React Redux 9.2.0** - React-Redux bindings
- **Styled Components 6.1.19** - Component styling

### Backend
- **Flask 3.0.0** - Modern Python web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **Python-dotenv 1.0.0** - Environment variable management
- **Werkzeug 3.0.1** - WSGI utility library
- **Requests 2.31.0** - HTTP library for Python
- **Pytest 7.4.3** - Testing framework
- **Flake8 6.1.0** - Code linting

### DevOps & Deployment
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline automation
- **Nginx** - Web server and reverse proxy (production)
- **Vercel** - Serverless deployment platform (production)
- **Vercel CLI** - Deployment and project management

### Development Tools
- **ESLint 9.33.0** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite React Plugin** - React integration for Vite
- **Flake8** - Python code linting
- **Pytest** - Python testing framework

### Routing & Navigation
- **React Router DOM 7.8.0** - Client-side routing

### Styling & Design
- **@mui/material** - Component library
- **@mui/icons-material** - Material Design icons
- **@emotion/react** - CSS-in-JS runtime
- **@emotion/styled** - Styled components
- **Styled Components 6.1.19** - Component styling

## 📁 Project Structure

```
core-connect/
├── frontend/                       # React frontend application
│   ├── public/
│   │   └── vite.svg                # Vite logo
│   ├── src/
│   │   ├── assets/
│   │   │   └── backgroundLanding.png   # Hero background image
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx           # Login component
│   │   │   │   └── Signup.tsx          # Signup component
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx          # Reusable button component
│   │   │   │   ├── InputField.tsx      # Form input component
│   │   │   │   └── ProtectedRoute.tsx  # Route protection component
│   │   │   └── index.ts                # Component exports
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx         # Authentication context
│   │   │   └── useAuth.ts              # Authentication hook
│   │   ├── pages/
│   │   │   ├── AuthDemo.tsx            # Authentication demo page
│   │   │   ├── Dashboard.tsx           # User dashboard
│   │   │   ├── Documentation.tsx       # Interactive documentation
│   │   │   ├── Footer.tsx              # Footer component
│   │   │   └── Landing.tsx             # Main landing page
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx           # Application routing
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts        # Authentication state
│   │   │   │   └── index.ts            # Slice exports
│   │   │   ├── thunks/
│   │   │   │   ├── authThunks.ts       # Authentication thunks
│   │   │   │   └── index.ts            # Thunk exports
│   │   │   ├── hooks.ts                # Redux hooks
│   │   │   └── index.ts                # Store configuration
│   │   ├── theme/
│   │   │   ├── colors.ts               # Color palette
│   │   │   └── index.ts                # Theme configuration
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript type definitions
│   │   ├── App.css                     # Global app styles
│   │   ├── App.tsx                     # Main app component
│   │   ├── index.css                   # Global CSS reset & styles
│   │   ├── main.tsx                    # App entry point
│   │   └── vite-env.d.ts               # Vite type declarations
│   ├── Dockerfile                      # Production container config
│   ├── Dockerfile.dev                  # Development container config
│   ├── nginx.conf                      # Nginx configuration
│   ├── eslint.config.js                # ESLint configuration
│   ├── index.html                      # HTML template
│   ├── package.json                    # Dependencies & scripts
│   ├── tsconfig.app.json               # TypeScript app config
│   ├── tsconfig.json                   # TypeScript main config
│   ├── tsconfig.node.json              # TypeScript Node config
│   └── vite.config.ts                  # Vite configuration
├── backend/                          # Flask backend API
│   ├── api/
│   │   ├── __init__.py               # API module init
│   │   └── auth.py                   # Authentication routes
│   ├── models/
│   │   └── __init__.py               # Models module init
│   ├── utils/
│   │   └── __init__.py               # Utilities module init
│   ├── app.py                        # Main Flask application
│   ├── config.py                     # Configuration settings
│   ├── requirements.txt              # Python dependencies
│   ├── test_app.py                   # Test suite
│   ├── Dockerfile                    # Production container config
│   ├── Dockerfile.dev                # Development container config
│   └── README.md                     # Backend documentation
├── docker-compose.yml                # Production docker setup
├── docker-compose.dev.yml            # Development docker setup
├── docker-compose.prod.yml           # Production docker setup (alt)
├── dev-setup.bat                     # Development helper script (Windows)
├── dev-start.bat                     # Start development script (Windows)
├── dev-stop.bat                      # Stop development script (Windows)
├── docker-setup.bat                  # Docker setup script (Windows)
├── DOCKER.md                         # Docker & CI/CD documentation
├── QUICKSTART.md                     # Quick start guide
└── README.md                         # This documentation
```

## 🎨 Design Philosophy

### User Experience
- **Mobile-First Design** - Responsive across all devices
- **Intuitive Navigation** - Clear, logical user flows
- **Accessibility** - WCAG compliant design patterns
- **Performance** - Optimized for speed and efficiency

### Visual Design
- **Modern Aesthetics** - Clean, professional interface
- **Consistent Branding** - Cohesive color scheme and typography
- **Micro-Interactions** - Smooth animations and transitions
- **Professional Animations** - Engaging but not distracting

### Technical Architecture
- **Component-Based** - Reusable, maintainable code
- **Type Safety** - Full TypeScript implementation
- **Performance Optimized** - Code splitting and lazy loading
- **Scalable Structure** - Organized for team collaboration

## 🚀 Getting Started

### 🌐 **Try It Live First!**
Visit the live application at: **https://core-connect-iqcmjox77-arun03ks-projects.vercel.app**
- ✅ Fully functional frontend
- ✅ Backend API endpoints
- ✅ Authentication system
- ✅ Responsive design on all devices

### Prerequisites
- **Docker Desktop** (recommended) - For containerized development
- **Node.js (v20+)** - Only if running frontend locally
- **Python 3.11+** - Only if running backend locally
- **Git** - Version control
- **Vercel Account** - For deployment (optional)

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run CoreConnect is using Docker. This method ensures consistent environments across all systems and includes our comprehensive CI/CD pipeline.

#### Production Mode (Recommended for Testing)
For production-like testing with optimized builds:

```cmd
# Windows Users - Interactive Setup
dev-setup.bat

# OR Direct Commands (All Platforms)
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
docker-compose up -d
```

**Production URLs:**
- **Frontend**: http://localhost:80 (Nginx serving React production build)
- **Backend API**: http://localhost:5000 (Flask in production mode)
- **Health Check**: http://localhost:5000/health
- **API Test**: http://localhost:5000/api/test

#### Development Mode (For Active Development)
For development with hot reload and debugging:

```cmd
# Start development environment with hot reload
dev-start.bat
# OR
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
dev-stop.bat
# OR
docker-compose -f docker-compose.dev.yml down
```

**Development URLs:**
- **Frontend**: http://localhost:5173 (Vite dev server with hot reload)
- **Frontend Alt**: http://localhost:80 (mapped to dev server)
- **Backend API**: http://localhost:5000 (Flask with debug mode and auto-reload)
- **Health Check**: http://localhost:5000/health

#### Quick Status Check
```cmd
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Health check
curl http://localhost:5000/health
curl http://localhost:80
```

### 🛠️ Development with Docker

#### Frontend Development
```bash
# Start only frontend (with backend dependency)
docker-compose up -d

# View frontend logs
docker-compose logs -f frontend

# Access frontend container
docker-compose exec frontend sh
```

#### Backend Development
```bash
# Start only backend
docker-compose up -d backend

# View backend logs  
docker-compose logs -f backend

# Run backend tests
docker-compose exec backend python -m pytest

# Access backend container
docker-compose exec backend sh
```

### 📋 Local Development (Alternative)

⚠️ **Note**: This method requires manual setup and is only recommended if Docker cannot be used.

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
copy .env.example .env  # Edit with your settings
python app.py
# Access at http://localhost:5000
```

### 🐳 Docker Commands Reference

#### Basic Operations
- `docker-compose up -d` - Start all services in background
- `docker-compose down` - Stop and remove all containers
- `docker-compose ps` - Show running containers
- `docker-compose logs -f [service]` - Follow logs

#### Development Commands
- `docker-compose build` - Rebuild containers
- `docker-compose build --no-cache` - Clean rebuild
- `docker-compose exec [service] sh` - Access container shell
- `docker-compose restart [service]` - Restart specific service

#### Production Commands
- `docker-compose -f docker-compose.prod.yml up -d` - Start production
- `docker-compose -f docker-compose.prod.yml down` - Stop production

### 📚 Additional Resources

For detailed Docker and deployment information, see:
- **[DOCKER.md](./DOCKER.md)** - Complete Docker & CI/CD guide
- **[DEPLOYMENT-SUCCESS.md](./DEPLOYMENT-SUCCESS.md)** - Vercel deployment guide
- **[Backend README](./backend/README.md)** - Backend-specific documentation

### 🌐 **Vercel Deployment** (Production)

The application is deployed on Vercel with the following configuration:
- **Frontend**: Static site deployment with CDN optimization
- **Backend**: Serverless Python functions
- **Environment**: Production-optimized with security configurations
- **SSL**: Automatic HTTPS with custom domain support

#### Deploy Your Own Copy:
```bash
# Clone and deploy to your Vercel account
git clone https://github.com/Arun03k/core-connects.git
cd core-connects
npm install -g vercel  # Install Vercel CLI
vercel login           # Login to your account
vercel --prod          # Deploy to production
```

#### Environment Variables (Vercel Dashboard):
Set these in your Vercel project settings:
```
SECRET_KEY=your-secure-secret-key-32-chars-minimum
FLASK_ENV=production
API_VERSION=v1
```

## 📱 Responsive Design

CoreConnect is fully responsive and optimized for:

### Mobile Devices (320px - 599px)
- Single column layout
- Touch-friendly interactions
- Optimized typography and spacing
- Mobile-specific navigation patterns

### Tablets (600px - 899px)
- Two-column feature grid
- Balanced content distribution
- Touch and mouse interaction support
- Adaptive component sizing

### Desktop (900px+)
- Three-column feature grid
- Full-width utilization
- Advanced hover effects
- Optimal reading widths

## 🎭 Animation & Interactions

### Entrance Animations
- **Fade In** - Smooth element reveals
- **Slide Up** - Content sliding from bottom
- **Zoom In** - Scale-based entrances
- **Staggered Timing** - Sequential element reveals

### Hover Effects
- **Card Lifting** - 3D elevation on hover
- **Icon Rotation** - Subtle icon animations
- **Color Transitions** - Smooth color changes
- **Shadow Enhancement** - Dynamic shadow effects

### Micro-Interactions
- **Button States** - Clear feedback on interactions
- **Loading States** - Smooth loading animations
- **Form Validation** - Real-time feedback
- **Navigation Transitions** - Smooth page transitions

## 🔧 Configuration

### TypeScript Configuration
- Strict type checking enabled
- Path mapping for clean imports
- Modern ES2022 target
- React JSX transformation

### Vite Configuration
- React plugin integration
- Fast refresh for development
- Optimized production builds
- Asset optimization

### ESLint Configuration
- React hooks rules
- TypeScript-specific rules
- Import/export validation
- Code quality standards

## 🚀 Performance Optimizations

### Build Optimizations
- **Code Splitting** - Reduced bundle sizes
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Compressed images and fonts
- **Lazy Loading** - On-demand component loading

### Runtime Optimizations
- **Memoization** - Prevent unnecessary re-renders
- **Virtual Scrolling** - Efficient large list handling
- **Image Optimization** - Responsive images
- **Caching Strategies** - Efficient data management

## 🔒 Security Considerations

### Frontend Security
- **Input Validation** - Client-side validation
- **XSS Prevention** - Safe content rendering
- **CSRF Protection** - Token-based protection
- **Secure Routing** - Protected route access

## 🎯 Future Roadmap

### Phase 1 (Current - Completed ✅)
- ✅ Modern responsive landing page design
- ✅ Interactive documentation system
- ✅ Component architecture with TypeScript
- ✅ Animation system with Material-UI
- ✅ Docker containerization (dev + production)
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Authentication framework (frontend state management)
- ✅ Routing system with protected routes
- ✅ Redux state management setup
- ✅ Health monitoring and logging
- ✅ **Vercel deployment with serverless backend**
- ✅ **Production environment with HTTPS**

### Phase 2 (In Progress 🔄)
- 🔄 Complete authentication implementation (backend integration)
- 🔄 User dashboard with profile management
- 🔄 Database integration (PostgreSQL)
- 🔄 API authentication with JWT tokens
- 🔄 Form validation and error handling
- 🔄 User session management

### Phase 3 (Planned ⏳)
- ⏳ Employee management module
- ⏳ Time tracking interface
- ⏳ Leave management system
- ⏳ Task management module
- ⏳ Reporting & analytics
- ⏳ Email notifications system
- ⏳ Mobile responsiveness enhancements
- ⏳ Advanced API features
- ⏳ Custom domain and branding
- ⏳ Multi-tenant architecture

## 👥 Team

**Developer & Designer**
- **Arun Kumar** - Full Stack Developer
- **GitHub**: [@Arun03k](https://github.com/Arun03k)
- **Repository**: [core-connects](https://github.com/Arun03k/core-connects)

## 📄 License

© 2025 CoreConnect by @Arun Kumar. All rights reserved.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain responsive design principles
3. Write comprehensive tests
4. Document new features
5. Follow existing code patterns

## 📞 Support

For support and questions:
- **Email**: support@coreconnect.com
- **GitHub Issues**: [Create an issue](https://github.com/Arun03k/core-connects/issues)
- **Documentation**: This README file

---

**Made with ❤️ for growing businesses**

*CoreConnect - Empowering teams, streamlining success.*
