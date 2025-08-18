# CoreConnect Frontend

## Project Structure

```
frontend/
├── src/                        # Source code
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── contexts/              # React contexts
│   ├── store/                 # Redux store
│   ├── routes/                # Routing configuration
│   ├── theme/                 # Theme configuration
│   ├── types/                 # TypeScript type definitions
│   └── assets/                # Static assets
├── public/                     # Public static files
├── config/                     # Configuration files
│   ├── eslint.config.js       # ESLint configuration
│   ├── tsconfig.json          # Main TypeScript config
│   ├── tsconfig.app.json      # App-specific TypeScript config
│   ├── tsconfig.node.json     # Node.js TypeScript config
│   └── tsconfig.test.json     # Test TypeScript config
├── docker/                     # Docker-related files
│   ├── Dockerfile             # Production Docker image
│   ├── Dockerfile.dev         # Development Docker image
│   ├── .dockerignore          # Docker ignore rules
│   └── nginx.conf             # Nginx configuration for production
├── dist/                       # Built application (generated)
├── node_modules/               # Dependencies (generated)
├── .env                        # Environment variables
├── .env.local                  # Local environment variables
├── .env.production            # Production environment variables
├── index.html                  # HTML entry point
├── package.json                # Node.js dependencies and scripts
├── package-lock.json          # Dependency lockfile
├── vite.config.ts             # Vite build configuration
└── README.md                  # Frontend documentation
```

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Configuration

Configuration files are organized in the `config/` directory:
- **ESLint**: Code quality and formatting rules
- **TypeScript**: Type checking and compilation settings
- **Docker**: Container configuration for different environments

## Build & Deployment

### Development
Uses Vite dev server with hot module replacement and fast refresh.

### Production
- Built with Vite for optimal performance
- Dockerized with Nginx for serving static files
- Deployed to Vercel with serverless functions

## Architecture

- **React 18** with TypeScript
- **Material-UI** for component library
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Vite** for build tooling
