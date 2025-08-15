# CoreConnect - Complete Workforce Management Platform

![CoreConnect Banner](src/assets/backgroundLanding.png)

## 🚀 Overview

CoreConnect is a modern, comprehensive workforce management platform designed to empower both HR teams and employees with powerful tools for managing the entire employee lifecycle. From onboarding to daily operations, CoreConnect streamlines processes and enhances productivity across your organization.

## ✨ Key Features

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

### ✅ Onboarding & Training
- Role-based onboarding checklists
- Document management and verification
- Progress tracking and milestone monitoring
- Automated reminders and notifications

### 📋 Task Management
- Personal task and project management
- Assignment and deadline tracking
- Productivity insights and analytics
- Collaborative project tools

### 🔧 Issues & Feedback
- Workplace issue reporting system
- Suggestion submission and tracking
- Resolution status monitoring
- Company culture improvement tools

## 🛠 Technology Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Fast build tool and dev server
- **Material-UI 7.3.1** - Modern component library
- **Emotion** - CSS-in-JS styling solution

### Backend
- **Flask 3.0.0** - Modern Python web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **Python-dotenv 1.0.0** - Environment variable management
- **Werkzeug 3.0.1** - WSGI utility library

### DevOps & Deployment
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline automation
- **Nginx** - Web server and reverse proxy

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
│   │   │   ├── backgroundLanding.png   # Hero background image
│   │   │   └── react.svg              # React logo
│   │   ├── pages/
│   │   │   ├── Landing.tsx            # Main landing page
│   │   │   └── Footer.tsx             # Footer component
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx          # Application routing
│   │   ├── App.css                    # Global app styles
│   │   ├── App.tsx                    # Main app component
│   │   ├── index.css                  # Global CSS reset & styles
│   │   ├── main.tsx                   # App entry point
│   │   └── vite-env.d.ts             # Vite type declarations
│   ├── Dockerfile                     # Frontend container config
│   ├── nginx.conf                     # Nginx configuration
│   ├── .dockerignore                  # Docker ignore rules
│   ├── eslint.config.js              # ESLint configuration
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies & scripts
│   ├── tsconfig.app.json            # TypeScript app config
│   ├── tsconfig.json                # TypeScript main config
│   ├── tsconfig.node.json           # TypeScript Node config
│   └── vite.config.ts               # Vite configuration
├── backend/                          # Flask backend API
│   ├── api/
│   │   ├── __init__.py              # API module init
│   │   └── auth.py                  # Authentication routes
│   ├── models/
│   │   └── __init__.py              # Models module init
│   ├── utils/
│   │   └── __init__.py              # Utilities module init
│   ├── app.py                       # Main Flask application
│   ├── config.py                    # Configuration settings
│   ├── requirements.txt             # Python dependencies
│   ├── test_app.py                  # Test suite
│   ├── Dockerfile                   # Backend container config
│   ├── .dockerignore               # Docker ignore rules
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore rules
│   └── README.md                   # Backend documentation
├── .github/workflows/              # CI/CD pipeline configurations
│   ├── ci-cd.yml                  # Main CI/CD pipeline
│   ├── dependency-updates.yml     # Dependency management
│   └── security.yml               # Security scanning
├── docker-compose.yml             # Development docker setup
├── docker-compose.prod.yml        # Production docker setup
├── dev-setup.bat                  # Development helper script (Windows)
├── DOCKER.md                      # Docker & CI/CD documentation
└── README.md                      # This documentation
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

### Prerequisites
- **Docker Desktop** (recommended) - For containerized development
- **Node.js (v20+)** - Only if running frontend locally
- **Python 3.11+** - Only if running backend locally
- **Git** - Version control

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run CoreConnect is using Docker. This method ensures consistent environments across all systems.

#### Option 1: Interactive Setup (Windows)
```cmd
dev-setup.bat
```
*Easy interactive menu for all development tasks*

#### Option 2: Direct Commands
1. **Clone the repository**
   ```bash
   git clone https://github.com/Arun03k/core-connects.git
   cd core-connects
   ```

2. **Start the full application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:80
   - **Backend API**: http://localhost:5000
   - **Health Check**: http://localhost:5000/health

4. **View application logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the application**
   ```bash
   docker-compose down
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
- **[Backend README](./backend/README.md)** - Backend-specific documentation

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

### Phase 1 (Current)
- ✅ Landing page design
- ✅ Responsive layout
- ✅ Component architecture
- ✅ Animation system

### Phase 2 (Planned)
- 🔄 Authentication system
- 🔄 Employee dashboard
- 🔄 Time tracking interface
- 🔄 Leave management system

### Phase 3 (Future)
- ⏳ Task management module
- ⏳ Reporting & analytics
- ⏳ Mobile app integration
- ⏳ API development

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
