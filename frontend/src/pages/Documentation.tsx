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
  ArrowBack,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import backgroundLanding from "../assets/backgroundLanding.png";
import Footer from "./Footer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
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
    { name: "Material-UI", version: "7.3.1", color: "#1976d2", icon: "🎨" },
    { name: "Vite", version: "7.1.2", color: "#646cff", icon: "⚡" },
    { name: "React Router", version: "7.8.0", color: "#ca4245", icon: "🛣️" },
  ];

  const features = [
    {
      icon: <Group sx={{ color: "#1976d2" }} />,
      title: "Employee Management",
      description: "Comprehensive HR tools for managing profiles, roles, and departments",
      status: "planned",
    },
    {
      icon: <Schedule sx={{ color: "#1976d2" }} />,
      title: "Time Tracking",
      description: "Log working hours with intuitive interface and productivity insights",
      status: "planned",
    },
    {
      icon: <Assignment sx={{ color: "#1976d2" }} />,
      title: "Leave Management",
      description: "Self-service leave requests with automated approval workflows",
      status: "planned",
    },
    {
      icon: <Code sx={{ color: "#1976d2" }} />,
      title: "Landing Page",
      description: "Modern, responsive landing page with animations",
      status: "completed",
    },
    {
      icon: <Description sx={{ color: "#1976d2" }} />,
      title: "Documentation",
      description: "Interactive documentation with comprehensive guides",
      status: "completed",
    },
  ];

  const roadmapPhases = [
    {
      phase: "Phase 1 (Current)",
      items: [
        { task: "Landing page design", completed: true },
        { task: "Responsive layout", completed: true },
        { task: "Component architecture", completed: true },
        { task: "Animation system", completed: true },
        { task: "Documentation page", completed: true },
      ],
    },
    {
      phase: "Phase 2 (Next)",
      items: [
        { task: "Authentication system", completed: false },
        { task: "Employee dashboard", completed: false },
        { task: "Time tracking interface", completed: false },
        { task: "Leave management system", completed: false },
      ],
    },
    {
      phase: "Phase 3 (Future)",
      items: [
        { task: "Task management module", completed: false },
        { task: "Reporting & analytics", completed: false },
        { task: "Mobile app integration", completed: false },
        { task: "API development", completed: false },
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
          width: "100vw",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          py: { xs: 6, sm: 8, md: 10 },
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
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
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
                animation: "slideInUp 1s ease-out 0.2s both",
              }}
            >
              Complete documentation for the workforce management platform
            </Typography>
            
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 3, flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{
                  px: { xs: 4, sm: 6 }, 
                  py: { xs: 1.5, sm: 2 }, 
                  borderRadius: 50, 
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  minWidth: { xs: "200px", sm: "240px" },
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
                Back to Home
              </Button>
              
              <Button
                variant="contained"
                startIcon={<GitHub />}
                href="https://github.com/Arun03k/core-connects"
                target="_blank"
                sx={{
                  px: { xs: 4, sm: 6 }, 
                  py: { xs: 1.5, sm: 2 }, 
                  borderRadius: 50, 
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  minWidth: { xs: "200px", sm: "240px" },
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Navigation Tabs */}
        <Slide in direction="up" timeout={1000}>
          <Paper
            sx={{
              mb: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderRadius: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                "& .MuiTab-root": {
                  color: "#666",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 3,
                  "&.Mui-selected": {
                    color: "#1976d2",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#1976d2",
                  height: 3,
                },
              }}
            >
              <Tab icon={<Rocket />} label="Overview" />
              <Tab icon={<Build />} label="Setup" />
              <Tab icon={<Code />} label="Tech Stack" />
              <Tab icon={<DeviceHub />} label="Features" />
              <Tab icon={<Description />} label="Roadmap" />
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
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700 }}>
                    What is CoreConnect?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555", fontSize: "1.1rem" }}>
                    CoreConnect is a modern, comprehensive workforce management platform designed to empower both HR teams and employees. 
                    Built with cutting-edge technologies like React 19, TypeScript, and Material-UI, it provides powerful tools for managing 
                    the entire employee lifecycle from onboarding to daily operations.
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ color: "#1565c0", mt: 4, fontWeight: 600 }}>
                    Key Benefits
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Streamlined HR processes" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Enhanced employee productivity" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Real-time insights and analytics" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText primary="Mobile-responsive design" sx={{ "& .MuiListItemText-primary": { color: "#555", fontWeight: 500 } }} />
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
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Project Stats
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Components</Typography>
                      <Chip label="15+" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Features</Typography>
                      <Chip label="6" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>Responsive</Typography>
                      <Chip label="100%" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 500 }}>TypeScript</Typography>
                      <Chip label="Full" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
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
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4 }}>
                Quick Start Guide
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
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                    1. Prerequisites
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="Node.js (v16 or higher)" 
                        secondary="Download from nodejs.org"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500 },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="npm or yarn package manager" 
                        secondary="Comes with Node.js installation"
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
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "installation"}
                onChange={handleAccordionChange("installation")}
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
                    2. Installation Steps
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Clone the repository:
                      </Typography>
                      <Paper sx={{ p: 2, background: "#f5f5f5", borderRadius: 2, fontFamily: "monospace" }}>
                        <code style={{ color: "#1976d2", fontWeight: 600 }}>
                          git clone https://github.com/Arun03k/core-connects.git
                        </code>
                      </Paper>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Navigate to project directory:
                      </Typography>
                      <Paper sx={{ p: 2, background: "#f5f5f5", borderRadius: 2, fontFamily: "monospace" }}>
                        <code style={{ color: "#1976d2", fontWeight: 600 }}>
                          cd core-connects/frontend
                        </code>
                      </Paper>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Install dependencies:
                      </Typography>
                      <Paper sx={{ p: 2, background: "#f5f5f5", borderRadius: 2, fontFamily: "monospace" }}>
                        <code style={{ color: "#1976d2", fontWeight: 600 }}>
                          npm install
                        </code>
                      </Paper>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#1976d2", mb: 1, fontWeight: 600 }}>
                        Start development server:
                      </Typography>
                      <Paper sx={{ p: 2, background: "#f5f5f5", borderRadius: 2, fontFamily: "monospace" }}>
                        <code style={{ color: "#1976d2", fontWeight: 600 }}>
                          npm run dev
                        </code>
                      </Paper>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedAccordion === "scripts"}
                onChange={handleAccordionChange("scripts")}
                sx={{ 
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#1976d2" }} />}>
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                    3. Available Scripts
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><PlayArrow sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="npm run dev" 
                        secondary="Start development server with hot reload"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Build sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="npm run build" 
                        secondary="Build optimized production bundle"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Speed sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="npm run preview" 
                        secondary="Preview production build locally"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Security sx={{ color: "#1976d2" }} /></ListItemIcon>
                      <ListItemText 
                        primary="npm run lint" 
                        secondary="Run ESLint for code quality checks"
                        sx={{ 
                          "& .MuiListItemText-primary": { color: "#333", fontWeight: 500, fontFamily: "monospace" },
                          "& .MuiListItemText-secondary": { color: "#666" }
                        }}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Tech Stack */}
          <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textAlign: "center" }}>
            Technology Stack
          </Typography>
          <Grid container spacing={3}>
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
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                          {tech.icon}
                        </Typography>
                        <Box>
                          <Typography variant="h6" sx={{ color: tech.color, fontWeight: 700 }}>
                            {tech.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
                            v{tech.version}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6 }}>
                        {tech.name === "React" && "Modern React with latest features and hooks"}
                        {tech.name === "TypeScript" && "Type-safe development with full IntelliSense"}
                        {tech.name === "Material-UI" && "Comprehensive component library with theming"}
                        {tech.name === "Vite" && "Lightning-fast build tool and development server"}
                        {tech.name === "React Router" && "Client-side routing with modern navigation"}
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
          <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textAlign: "center" }}>
            Platform Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={feature.title}>
                <Slide in direction="up" timeout={800 + index * 200}>
                  <Card
                    sx={{
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      borderRadius: 3,
                      height: "100%",
                      border: feature.status === "completed" ? "2px solid #1976d2" : "2px solid rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ mr: 2 }}>
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="h6" sx={{ color: "#333", fontWeight: 700 }}>
                              {feature.title}
                            </Typography>
                            <Chip
                              label={feature.status}
                              size="small"
                              sx={{
                                background: feature.status === "completed" ? "#1976d2" : "#f5f5f5",
                                color: feature.status === "completed" ? "white" : "#666",
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6 }}>
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
          <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textAlign: "center" }}>
            Development Roadmap
          </Typography>
          <Grid container spacing={3}>
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
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: phaseIndex === 0 ? "#1976d2" : phaseIndex === 1 ? "#1565c0" : "#666",
                          mb: 3,
                          fontWeight: 700,
                          textAlign: "center",
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
                                  fontSize: "0.95rem",
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

        {/* Back to Top Button */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Button
            variant="contained"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 50,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
              fontWeight: 700,
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
