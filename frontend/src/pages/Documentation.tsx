import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  Button,
  Fade,
  Slide,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  ExpandMore,
  Code,
  Rocket,
  Group,
  Schedule,
  Assignment,
  Security,
  Speed,
  GitHub,
  CheckCircle,
  RadioButtonUnchecked,
  PlayArrow,
  Description,
  Build,
  DeviceHub,
  Api as ApiIcon,
} from "@mui/icons-material";
import backgroundLanding from "../assets/backgroundLanding.png";
import Footer from "./Footer";
import { Api } from "../components";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: { xs: 2, sm: 4 } }}>{children}</Box>}
    </div>
  );
};

const Documentation: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const techStack = [
    { name: "React", version: "19.1.1", color: "#61dafb", icon: "⚛️" },
    { name: "TypeScript", version: "5.8.3", color: "#3178c6", icon: "📘" },
    { name: "Flask", version: "3.0.0", color: "#000000", icon: "🐍" },
    { name: "MongoDB", version: "7.0", color: "#47A248", icon: "🍃" },
    { name: "Docker", version: "Latest", color: "#2496ed", icon: "🐳" },
    { name: "Material-UI", version: "7.3.1", color: "#1976d2", icon: "🎨" },
    { name: "Vite", version: "7.1.2", color: "#646cff", icon: "⚡" },
    { name: "Redux Toolkit", version: "2.8.2", color: "#764abc", icon: "🏪" },
    { name: "React Router", version: "7.8.0", color: "#CA4245", icon: "🛣️" },
  ];

  const features = [
    {
      icon: <Code sx={{ color: "#1976d2" }} />,
      title: "Landing Page",
      description: "Modern, responsive landing page with professional animations and Material-UI components",
      status: "completed",
    },
    {
      icon: <Description sx={{ color: "#1976d2" }} />,
      title: "Interactive Documentation",
      description: "Comprehensive documentation system with tabbed navigation and responsive design",
      status: "completed",
    },
    {
      icon: <DeviceHub sx={{ color: "#1976d2" }} />,
      title: "Docker Containerization",
      description: "Complete containerization with development and production environments",
      status: "completed",
    },
    {
      icon: <Security sx={{ color: "#f57c00" }} />,
      title: "Authentication System",
      description: "JWT-based authentication backend complete, frontend integration and user dashboard in progress",
      status: "in-progress",
    },
    {
      icon: <DeviceHub sx={{ color: "#1976d2" }} />,
      title: "Database Integration",
      description: "MongoDB integration with user collections, security tokens, and comprehensive data validation",
      status: "completed",
    },
    {
      icon: <Group sx={{ color: "#f57c00" }} />,
      title: "User Dashboard",
      description: "User profile management, settings, and dashboard interface for authenticated users",
      status: "in-progress",
    },
    {
      icon: <Build sx={{ color: "#1976d2" }} />,
      title: "Component Library",
      description: "Reusable TypeScript components with Material-UI theming and validation",
      status: "completed",
    },
    {
      icon: <Speed sx={{ color: "#1976d2" }} />,
      title: "CI/CD Pipeline",
      description: "Advanced GitHub Actions pipeline with extended timeouts (45-min), 30-attempt health checks, comprehensive testing, automated security scanning, and deployment",
      status: "completed",
    },
    {
      icon: <Security sx={{ color: "#1976d2" }} />,
      title: "Security Framework",
      description: "Repository owner-only deployments, automated vulnerability scanning, and comprehensive security policies",
      status: "completed",
    },
    {
      icon: <Build sx={{ color: "#1976d2" }} />,
      title: "Optional Code Tools",
      description: "Optional code formatting tools with Black and ESLint - no mandatory enforcement",
      status: "completed",
    },
    {
      icon: <DeviceHub sx={{ color: "#1976d2" }} />,
      title: "Development Tools",
      description: "Comprehensive developer tooling with automated setup, formatting scripts, and quality testing",
      status: "completed",
    },
    {
      icon: <Rocket sx={{ color: "#1976d2" }} />,
      title: "Vercel Deployment",
      description: "Production deployment on Vercel with serverless functions and CDN optimization",
      status: "completed",
    },
    {
      icon: <Group sx={{ color: "#f57c00" }} />,
      title: "Employee Management",
      description: "Comprehensive HR tools for managing profiles, roles, and departments",
      status: "planned",
    },
    {
      icon: <Schedule sx={{ color: "#f57c00" }} />,
      title: "Time Tracking",
      description: "Intuitive time tracking interface with productivity insights and reporting",
      status: "planned",
    },
    {
      icon: <Assignment sx={{ color: "#f57c00" }} />,
      title: "Leave Management",
      description: "Self-service leave requests with automated approval workflows",
      status: "planned",
    },
  ];

  const roadmapPhases = [
    {
      phase: "Phase 1 (Completed ✅)",
      items: [
        { task: "Modern responsive landing page", completed: true },
        { task: "Interactive documentation system", completed: true },
        { task: "Component architecture with TypeScript", completed: true },
        { task: "Animation system with Material-UI", completed: true },
        { task: "Docker containerization (dev + prod)", completed: true },
        { task: "CI/CD pipeline with GitHub Actions", completed: true },
        { task: "Comprehensive testing workflows", completed: true },
        { task: "Optional code quality tools (no mandatory enforcement)", completed: true },
        { task: "Organized project structure with tools/ and docs/ directories", completed: true },
        { task: "Security policies and repository protection", completed: true },
        { task: "Optional developer tools (no mandatory requirements)", completed: true },
        { task: "Authentication framework (frontend)", completed: true },
        { task: "Redux state management setup", completed: true },
        { task: "Protected routes system", completed: true },
        { task: "Vercel deployment with serverless backend", completed: true },
        { task: "Production environment with HTTPS", completed: true },
      ],
    },
    {
      phase: "Phase 2 (In Progress 🔄)",
      items: [
        { task: "JWT authentication backend API", completed: true },
        { task: "MongoDB database integration", completed: true },
        { task: "Password security & validation", completed: true },
        { task: "Email verification system (backend)", completed: true },
        { task: "User registration & login endpoints", completed: true },
        { task: "Frontend authentication forms", completed: true },
        { task: "Redux state management for auth", completed: true },
        { task: "User dashboard with profile management", completed: false },
        { task: "Complete frontend-backend integration", completed: false },
        { task: "Form validation & error handling", completed: false },
        { task: "Session management & token refresh", completed: false },
        { task: "Password reset flow (frontend)", completed: false },
      ],
    },
    {
      phase: "Phase 3 (In Progress 🔄)",
      items: [
        { task: "User dashboard with role-based access", completed: false },
        { task: "Employee management module", completed: false },
        { task: "Time tracking interface", completed: false },
        { task: "Leave management system", completed: false },
        { task: "Task management module", completed: false },
        { task: "Reporting & analytics dashboard", completed: false },
        { task: "Real-time notifications system", completed: false },
        { task: "Advanced user permissions & roles", completed: false },
      ],
    },
  ];

  return (
    <Box 
      sx={{ 
        width: "100%", 
        overflow: "hidden",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
        "& *": {
          boxSizing: "border-box"
        }
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: "50vh", sm: "55vh", md: "60vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          py: { xs: 4, sm: 6, md: 8, lg: 10 },
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%), url(${backgroundLanding})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          overflow: "hidden",
          margin: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(124,77,255,0.1) 50%, rgba(255,99,132,0.1) 100%)",
            animation: "gradientShift 8s ease-in-out infinite alternate",
          },
          "@keyframes gradientShift": {
            "0%": {
              background: "linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(124,77,255,0.1) 50%, rgba(255,99,132,0.1) 100%)",
            },
            "100%": {
              background: "linear-gradient(135deg, rgba(255,99,132,0.1) 0%, rgba(124,77,255,0.1) 50%, rgba(63,81,181,0.1) 100%)",
            },
          },
        }}
      >
        <Fade in timeout={800}>
          <Box sx={{ position: "relative", zIndex: 2 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
                mb: 2,
                background: "linear-gradient(90deg, #1976d2, #1565c0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "slideInUp 1s ease-out both",
              }}
            >
              CoreConnect Docs
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255,255,255,0.9)",
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 300,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                animation: "slideInUp 1s ease-out 0.2s both",
                px: { xs: 1, sm: 0 },
              }}
            >
              Complete documentation for the workforce management platform
            </Typography>
            
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: { xs: 2, sm: 3 }, flexDirection: { xs: "column", sm: "row" }, alignItems: "center", px: { xs: 1, sm: 0 } }}>
              <Button
                component="a"
                href="/"
                variant="outlined"
                sx={{
                  px: { xs: 3, sm: 4, md: 6 }, 
                  py: { xs: 1.5, sm: 2 }, 
                  borderRadius: 50, 
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" },
                  minWidth: { xs: "180px", sm: "200px", md: "240px" },
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  textTransform: "none",
                  backdropFilter: "blur(10px)",
                  background: "rgba(255,255,255,0.1)",
                  animation: "fadeInScale 1s ease-out 0.3s both",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.2)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                ← Back to Home
              </Button>
              
              <Button
                component="a"
                href="https://core-connect-seven.vercel.app"
                target="_blank"
                variant="outlined"
                startIcon={<Rocket />}
                sx={{
                  px: { xs: 3, sm: 4, md: 6 }, 
                  py: { xs: 1.5, sm: 2 }, 
                  borderRadius: 50, 
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" },
                  minWidth: { xs: "180px", sm: "200px", md: "240px" },
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  textTransform: "none",
                  backdropFilter: "blur(10px)",
                  background: "rgba(255,255,255,0.1)",
                  animation: "fadeInScale 1s ease-out 0.4s both",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.2)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2)",
                  },
                  "@keyframes fadeInScale": {
                    "0%": {
                      transform: "scale(0.9)",
                      opacity: 0,
                    },
                    "100%": {
                      transform: "scale(1)",
                      opacity: 1,
                    },
                  },
                }}
              >
                🌐 Live Demo
              </Button>
              
              <Button
                variant="contained"
                startIcon={<GitHub />}
                href="https://github.com/Arun03k/core-connects"
                target="_blank"
                sx={{
                  px: { xs: 3, sm: 4, md: 6 }, 
                  py: { xs: 1.5, sm: 2 }, 
                  borderRadius: 50, 
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" },
                  minWidth: { xs: "180px", sm: "200px", md: "240px" },
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
                  textTransform: "none",
                  color: "white",
                  animation: "fadeInScale 1s ease-out 0.6s both",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                    boxShadow: "0 12px 40px rgba(25, 118, 210, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                View on GitHub
              </Button>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 3 } }}>
        {/* Navigation Tabs */}
        <Slide in direction="up" timeout={1000}>
          <Paper
            sx={{
              mb: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTab-root": {
                  color: "#666",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                  py: { xs: 2, sm: 3 },
                  minHeight: { xs: "auto", sm: "72px" },
                  "&.Mui-selected": {
                    color: "#1976d2",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#1976d2",
                  height: 3,
                },
                "& .MuiTabs-scrollButtons": {
                  "&.Mui-disabled": {
                    opacity: 0.3,
                  },
                },
                // Center tabs on larger screens
                "& .MuiTabs-flexContainer": {
                  justifyContent: { xs: "flex-start", md: "center" },
                },
              }}
            >
              <Tab 
                icon={<Rocket />} 
                label="Overview" 
                sx={{ 
                  "& .MuiTab-iconWrapper": { 
                    marginBottom: { xs: "4px", sm: "6px" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  } 
                }} 
              />
              <Tab 
                icon={<Build />} 
                label="Setup" 
                sx={{ 
                  "& .MuiTab-iconWrapper": { 
                    marginBottom: { xs: "4px", sm: "6px" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  } 
                }} 
              />
              <Tab 
                icon={<Code />} 
                label="Tech Stack" 
                sx={{ 
                  "& .MuiTab-iconWrapper": { 
                    marginBottom: { xs: "4px", sm: "6px" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  } 
                }} 
              />
              <Tab 
                icon={<DeviceHub />} 
                label="Features" 
                sx={{ 
                  "& .MuiTab-iconWrapper": { 
                    marginBottom: { xs: "4px", sm: "6px" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  } 
                }} 
              />
              <Tab 
                icon={<Description />} 
                label="Roadmap" 
                sx={{ 
                  "& .MuiTab-iconWrapper": { 
                    marginBottom: { xs: "4px", sm: "6px" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  } 
                }} 
              />
              <Tab 
                icon={<ApiIcon />} 
                label="API Docs" 
                sx={{ 
                  "& .MuiTab-iconWrapper": { 
                    marginBottom: { xs: "4px", sm: "6px" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  } 
                }} 
              />
            </Tabs>
          </Paper>
        </Slide>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Overview */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
                    What is CoreConnect?
                  </Typography>
                  <Box sx={{ mb: 3, p: 3, background: "linear-gradient(135deg, #e3f2fd, #f3e5f5)", borderRadius: 2, border: "2px solid #1976d2" }}>
                    <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 700, mb: 1 }}>
                      🌐 Now Live on Vercel!
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1565c0", fontWeight: 600 }}>
                      Experience the full application at: <a href="https://core-connect-seven.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>core-connect-seven.vercel.app</a>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3, p: 3, background: "linear-gradient(135deg, #fff3e0, #ffe0b2)", borderRadius: 2, border: "2px solid #ff9800" }}>
                    <Typography variant="h6" sx={{ color: "#e65100", fontWeight: 700, mb: 1 }}>
                      🚧 Phase 2 Authentication - In Progress
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#f57c00", fontWeight: 600, mb: 1 }}>
                      ✅ Backend API Complete • ✅ Database Integration • ✅ Auth Forms • ⏳ Dashboard & Full Integration
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#e65100", fontSize: "0.9rem" }}>
                      Backend authentication system is complete, but frontend dashboard and full user management features are still in development.
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555", fontSize: "1.1rem" }}>
                    CoreConnect is a modern, comprehensive workforce management platform built with cutting-edge technologies. 
                    Now successfully deployed on <strong>Vercel's serverless platform</strong> with <strong>Phase 2 authentication in active development</strong>, 
                    featuring a robust JWT backend API, MongoDB integration, and frontend authentication forms. 
                    The platform is progressing toward a complete user management system.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555", fontSize: "1.1rem" }}>
                    The platform uses React 19 with TypeScript for type-safe frontend development, Flask 3.0 for the robust backend API with 
                    <strong> MongoDB database integration</strong>, and is fully containerized with Docker for consistent deployment across environments. 
                    Our automated CI/CD pipeline features <strong>comprehensive security policies</strong>, multi-stage testing workflows with extended timeouts (45-min job limits, 30-attempt health checks), 
                    and automated deployments with <strong>repository owner-only protection</strong>. 
                    The production deployment leverages <strong> Vercel's serverless functions</strong> for the backend and <strong>CDN distribution</strong> for the frontend.
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ color: "#1565c0", mt: 4, fontWeight: 600 }}>
                    Key Benefits
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Modern React 19 with TypeScript for type safety" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="JWT authentication backend with MongoDB" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Password security, email verification, and user registration" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Frontend authentication forms with Redux state management" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Production deployment on Vercel with serverless backend" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Docker containerization with dev/prod environments" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="CI/CD pipeline with automated testing & deployment" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Repository owner-only security with pull request enforcement" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Comprehensive testing: code quality and security scanning" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Automated security scanning with vulnerability detection" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Interactive documentation and component library" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Optional code formatting tools - developer-friendly approach" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Organized project structure with tools/ and docs/ directories" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Responsive design with Material-UI components" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #1976d2, #1565c0)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                    Project Stats
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Pages</Typography>
                      <Chip label="8+" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Components</Typography>
                      <Chip label="15+" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Features</Typography>
                      <Chip label="13 Complete" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Code Quality</Typography>
                      <Chip label="✅ Optional" size="small" sx={{ background: "rgba(76,175,80,0.9)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Security</Typography>
                      <Chip label="✅ Owner-Only" size="small" sx={{ background: "rgba(76,175,80,0.9)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Testing</Typography>
                      <Chip label="Multi-Workflow" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Authentication</Typography>
                      <Chip label="⏳ In Progress" size="small" sx={{ background: "rgba(255,152,0,0.9)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>User Dashboard</Typography>
                      <Chip label="⏳ Pending" size="small" sx={{ background: "rgba(158,158,158,0.9)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Database</Typography>
                      <Chip label="MongoDB" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Deployment</Typography>
                      <Chip label="✅ Live" size="small" sx={{ background: "rgba(76,175,80,0.9)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Platform</Typography>
                      <Chip label="Vercel" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Responsive</Typography>
                      <Chip label="100%" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>State Management</Typography>
                      <Chip label="Redux Toolkit" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Container</Typography>
                      <Chip label="Docker" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>CI/CD</Typography>
                      <Chip label="GitHub Actions" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Setup Guide */}
          <Card
            sx={{
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
                <Rocket sx={{ verticalAlign: "middle", mr: 1 }} fontSize="inherit" />
                Getting Started
              </Typography>
              
              <Box sx={{ mb: 4, p: { xs: 2, sm: 3 }, background: "linear-gradient(135deg, #e8f5e8, #f1f8e9)", borderRadius: 3, border: "2px solid #4caf50" }}>
                <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 700, mb: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                  🌐 Try the Live Application First!
                </Typography>
                <Typography variant="body1" sx={{ color: "#388e3c", mb: 2, fontWeight: 500, fontSize: { xs: "0.9rem", sm: "1rem" }, wordBreak: "break-word" }}>
                  Visit our production deployment: <a href="https://core-connect-seven.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", fontWeight: 600, textDecoration: "none" }}>core-connect-seven.vercel.app</a>
                </Typography>
                <Typography variant="body2" sx={{ color: "#2e7d32", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  ✅ Fully functional frontend • ✅ Backend API endpoints • ✅ Authentication system • ✅ Mobile responsive
                </Typography>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ color: "#1976d2", fontWeight: 600, mb: 3, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                🐳 Local Development Setup
              </Typography>
              
              <Accordion
                expanded={expandedAccordion === "prerequisites"}
                onChange={handleAccordionChange("prerequisites")}
                sx={{ 
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  mb: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#1976d2" }} />}>
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                    1. Prerequisites
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="Docker Desktop" 
                        secondary="Download from docker.com - includes Docker Compose"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500 },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="Git for version control" 
                        secondary="Download from git-scm.com"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500 },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="4GB RAM minimum" 
                        secondary="8GB recommended for smooth Docker performance"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500 },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "docker-setup"}
                onChange={handleAccordionChange("docker-setup")}
                sx={{ 
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  mb: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#1976d2" }} />}>
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                    2. Quick Start (30 seconds!)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Windows Users (Interactive Setup):
                      </Typography>
                      <Paper sx={{ p: { xs: 2, sm: 3 }, background: "#e3f2fd", borderRadius: 2, border: "2px solid #1976d2", overflow: "auto" }}>
                        <code style={{ color: "#1976d2", fontWeight: 600, fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)", overflowWrap: "break-word" }}>
                          git clone https://github.com/Arun03k/core-connects.git<br/>
                          cd core-connects<br/>
                          dev-setup.bat
                        </code>
                      </Paper>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        All Platforms (Production Mode):
                      </Typography>
                      <Paper sx={{ p: { xs: 2, sm: 3 }, background: "#f5f5f5", borderRadius: 2, fontFamily: "monospace", overflow: "auto" }}>
                        <code style={{ color: "#1976d2", fontWeight: 600, fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)", wordBreak: "break-all" }}>
                          git clone https://github.com/Arun03k/core-connects.git<br/>
                          cd core-connects<br/>
                          docker-compose up -d
                        </code>
                      </Paper>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Development Mode (Hot Reload):
                      </Typography>
                      <Paper sx={{ p: { xs: 2, sm: 3 }, background: "#fff3e0", borderRadius: 2, fontFamily: "monospace", border: "2px solid #ff9800", overflow: "auto" }}>
                        <code style={{ color: "#f57c00", fontWeight: 600, fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)", wordBreak: "break-all" }}>
                          docker-compose -f docker-compose.dev.yml up<br/>
                          # OR<br/>
                          dev-start.bat
                        </code>
                      </Paper>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Access Your Application:
                      </Typography>
                      <Paper sx={{ p: { xs: 2, sm: 3 }, background: "#e8f5e8", borderRadius: 2, border: "2px solid #4caf50", overflow: "auto" }}>
                        <Typography component="div" sx={{ fontFamily: "monospace", fontWeight: 600, color: "#2e7d32", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>
                          🌐 Frontend: <a href="http://localhost:80" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>http://localhost:80</a><br/>
                          🔧 Backend: <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>http://localhost:5000</a><br/>
                          ❤️ Health: <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>http://localhost:5000/health</a><br/>
                          📱 Dev Server: <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>http://localhost:5173</a> (dev mode only)
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "vercel-deploy"}
                onChange={handleAccordionChange("vercel-deploy")}
                sx={{ 
                  background: "linear-gradient(145deg, #e3f2fd 0%, #e8f5e8 100%)",
                  boxShadow: "0 4px 16px rgba(25,118,210,0.15)",
                  borderRadius: 2,
                  mb: 2,
                  "&:before": { display: "none" },
                  border: "2px solid #1976d2"
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#1976d2" }} />}>
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                    🚀 Deploy to Vercel (Your Own Copy)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                      Quick Deploy (CLI Method):
                    </Typography>
                    <Paper sx={{ p: 3, background: "#f5f5f5", borderRadius: 2, fontFamily: "monospace" }}>
                      <code style={{ color: "#1976d2", fontWeight: 600, fontSize: "1rem" }}>
                        git clone https://github.com/Arun03k/core-connects.git<br/>
                        cd core-connects<br/>
                        npm install -g vercel<br/>
                        vercel login<br/>
                        vercel --prod
                      </code>
                    </Paper>
                    
                    <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                      Environment Variables (Required):
                    </Typography>
                    <Paper sx={{ p: 3, background: "#fff3e0", borderRadius: 2, border: "1px solid #ff9800" }}>
                      <Typography component="div" sx={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#f57c00" }}>
                        SECRET_KEY=your-secure-32-char-key<br/>
                        FLASK_ENV=production<br/>
                        API_VERSION=v1
                      </Typography>
                    </Paper>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "docker-commands"}
                onChange={handleAccordionChange("docker-commands")}
                sx={{ 
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  mb: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#1976d2" }} />}>
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                    3. Docker Commands
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><PlayArrow sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="docker-compose up -d" 
                        secondary="Start all services in background"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Speed sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="docker-compose logs -f" 
                        secondary="View real-time logs from all services"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Security sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="docker-compose exec backend python -m pytest" 
                        secondary="Run backend tests inside container"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Build sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="docker-compose down" 
                        secondary="Stop and remove all containers"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "manual-setup"}
                onChange={handleAccordionChange("manual-setup")}
                sx={{ 
                  background: "linear-gradient(145deg, #fff8e1 0%, #fff3c4 100%)",
                  boxShadow: "0 4px 16px rgba(255,193,7,0.2)",
                  borderRadius: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#f57c00" }} />}>
                  <Typography variant="h6" sx={{ color: "#f57c00", fontWeight: 600 }}>
                    ⚠️ Manual Setup (Fallback Option)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2, p: 2, background: "rgba(255,193,7,0.1)", borderRadius: 1, border: "1px solid #ffb74d" }}>
                    <Typography variant="body2" sx={{ color: "#f57c00", fontWeight: 600 }}>
                      Note: Manual setup is only recommended if Docker cannot be used. Docker provides a much better development experience.
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 600 }}>
                      Frontend Setup:
                    </Typography>
                    <Paper sx={{ p: 2, background: "#f5f5f5", borderRadius: 1, fontFamily: "monospace", fontSize: "0.9rem" }}>
                      <code>
                        cd frontend<br/>
                        npm install<br/>
                        npm run dev
                      </code>
                    </Paper>
                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 600 }}>
                      Backend Setup:
                    </Typography>
                    <Paper sx={{ p: 2, background: "#f5f5f5", borderRadius: 1, fontFamily: "monospace", fontSize: "0.9rem" }}>
                      <code>
                        cd backend<br/>
                        pip install -r requirements.txt<br/>
                        python app.py
                      </code>
                    </Paper>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "project-structure"}
                onChange={handleAccordionChange("project-structure")}
                sx={{ 
                  background: "linear-gradient(145deg, #e3f2fd 0%, #f3e5f5 100%)",
                  boxShadow: "0 4px 16px rgba(25,118,210,0.1)",
                  borderRadius: 2,
                  mt: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#1976d2" }} />}>
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                    📁 Project Structure Overview
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph sx={{ color: "#555" }}>
                    CoreConnect is organized for easy navigation and development:
                  </Typography>
                  
                  <Paper sx={{ p: 3, background: "#f8f9fa", borderRadius: 2, fontFamily: "monospace", fontSize: "0.8rem", overflow: "auto" }}>
                    <Typography component="div" sx={{ color: "#333", lineHeight: 1.4 }}>
                      core-connect/<br/>
                      ├── 📚 docs/              # Documentation<br/>
                      ├── 🔧 tools/             # Optional dev tools<br/>
                      │   ├── code-quality/     # Optional formatting<br/>
                      │   └── deployment/       # Deploy utilities<br/>
                      ├── 🐍 backend/           # Flask API<br/>
                      │   ├── config/           # Configuration<br/>
                      │   ├── docker/           # Docker files<br/>
                      │   └── deployment/       # Deploy configs<br/>
                      ├── 🌐 frontend/          # React app<br/>
                      │   ├── config/           # TypeScript configs<br/>
                      │   ├── docker/           # Docker files<br/>
                      │   └── src/              # Source code<br/>
                      ├── 🐳 config/            # Docker compose<br/>
                      ├── 🚀 deployment/        # Platform configs<br/>
                      └── 📜 scripts/           # Helper scripts
                    </Typography>
                  </Paper>

                  <Box sx={{ mt: 3, p: 2, background: "rgba(76, 175, 80, 0.1)", borderRadius: 2, border: "1px solid #4caf50" }}>
                    <Typography variant="subtitle2" sx={{ color: "#2e7d32", fontWeight: 600, mb: 1 }}>
                      🎯 Key Benefits:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#388e3c" }}>
                      • Clean separation of concerns<br/>
                      • Docker files organized in dedicated folders<br/>
                      • Configuration files centralized<br/>
                      • Optional tools - use when you want<br/>
                      • Easy to find what you're looking for
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
              
              {/* Developer Tools Section */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ color: "#1976d2", fontWeight: 600, mb: 3, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  🛠️ Optional Developer Tools
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <AlertTitle>Developer-Friendly Approach</AlertTitle>
                  Code formatting tools are available but completely optional. No hooks, no enforcement - just easy development!
                </Alert>

                <Accordion sx={{ mb: 2, borderRadius: 2, boxShadow: "0 4px 16px rgba(25,118,210,0.1)" }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                      Optional Code Formatting Tools
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" paragraph sx={{ color: "#555" }}>
                      We provide optional formatting scripts if you want to clean up your code, but they're entirely optional:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><Build sx={{ color: "#4caf50" }} /></ListItemIcon>
                        <ListItemText primary="Python: tools/code-quality/format-code.bat (Windows) or .sh (Linux)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Build sx={{ color: "#4caf50" }} /></ListItemIcon>
                        <ListItemText primary="Uses Black for Python formatting and isort for import organization" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Build sx={{ color: "#4caf50" }} /></ListItemIcon>
                        <ListItemText primary="Run manually when you want - no automatic enforcement" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle sx={{ color: "#4caf50" }} /></ListItemIcon>
                        <ListItemText primary="Push code anytime without formatting requirements" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Tech Stack */}
          <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textAlign: "center", fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
            Technology Stack
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {techStack.map((tech, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tech.name}>
                <Fade in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      borderRadius: 3,
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: { xs: "none", sm: "translateY(-8px)" },
                        boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, textAlign: { xs: "center", sm: "left" } }}>
                        <Typography variant="h4" sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, fontSize: { xs: "2rem", sm: "2.5rem" } }}>
                          {tech.icon}
                        </Typography>
                        <Box>
                          <Typography variant="h6" sx={{ color: tech.color, fontWeight: 700, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                            {tech.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666", fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            v{tech.version}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6, fontSize: { xs: "0.8rem", sm: "0.875rem" }, textAlign: { xs: "center", sm: "left" } }}>
                        {tech.name === "React" && "Modern React with latest features, hooks, and concurrent rendering"}
                        {tech.name === "TypeScript" && "Type-safe development with full IntelliSense and compile-time error checking"}
                        {tech.name === "Flask" && "Lightweight Python web framework for robust RESTful API development"}
                        {tech.name === "MongoDB" && "NoSQL database with flexible schema, perfect for user management and scalability"}
                        {tech.name === "Docker" && "Containerization for consistent development and production environments"}
                        {tech.name === "Material-UI" && "Comprehensive component library with theming and responsive design"}
                        {tech.name === "Vite" && "Lightning-fast build tool with HMR and optimized production builds"}
                        {tech.name === "Redux Toolkit" && "Modern Redux with simplified state management and built-in best practices"}
                        {tech.name === "React Router" && "Declarative client-side routing with protected routes and navigation guards"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Features */}
          <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textAlign: "center", fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
            Platform Features
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={feature.title}>
                <Slide in direction="up" timeout={800 + index * 200}>
                  <Card
                    sx={{
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      borderRadius: 3,
                      height: "100%",
                      border: feature.status === "completed" ? "2px solid #1976d2" : 
                             feature.status === "in-progress" ? "2px solid #ff9800" : 
                             "2px solid rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: { xs: "none", sm: "translateY(-4px)" },
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ mr: 2, minWidth: "24px" }}>
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 0 } }}>
                            <Typography variant="h6" sx={{ color: "#333", fontWeight: 700, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                              {feature.title}
                            </Typography>
                            <Chip
                              label={feature.status}
                              size="small"
                              sx={{
                                background: feature.status === "completed" ? "#1976d2" : 
                                           feature.status === "in-progress" ? "#ff9800" :
                                           "#f5f5f5",
                                color: feature.status === "completed" ? "white" : 
                                      feature.status === "in-progress" ? "white" :
                                      "#666",
                                fontWeight: 600,
                                textTransform: "capitalize",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {/* Roadmap */}
          <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textAlign: "center", fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
            Development Roadmap
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {roadmapPhases.map((phase, phaseIndex) => (
              <Grid size={{ xs: 12, md: 4 }} key={phase.phase}>
                <Fade in timeout={1000 + phaseIndex * 300}>
                  <Card
                    sx={{
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      borderRadius: 3,
                      height: "100%",
                      border: phaseIndex === 0 ? "2px solid #1976d2" : "2px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: phaseIndex === 0 ? "#1976d2" : phaseIndex === 1 ? "#1565c0" : "#666",
                          mb: 3,
                          fontWeight: 700,
                          textAlign: "center",
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}
                      >
                        {phase.phase}
                      </Typography>
                      <List dense>
                        {phase.items.map((item, itemIndex) => (
                          <ListItem key={itemIndex} sx={{ px: 0 }}>
                            <ListItemIcon>
                              {item.completed ? (
                                <CheckCircle sx={{ color: "#1976d2", fontSize: "1.2rem" }} />
                              ) : (
                                <RadioButtonUnchecked sx={{ color: "#ccc", fontSize: "1.2rem" }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.task}
                              sx={{
                                "& .MuiListItemText-primary": {
                                  fontSize: { xs: "0.8rem", sm: "0.95rem" },
                                  color: item.completed ? "#333" : "#666",
                                  fontWeight: item.completed ? 600 : 400,
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          {/* API Documentation */}
          <Api />
        </TabPanel>

        {/* Back to Top Button */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Button
            variant="contained"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 50,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
              fontWeight: 700,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                boxShadow: "0 12px 40px rgba(25, 118, 210, 0.5)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Back to Top
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Documentation;
