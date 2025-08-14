import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import backgroundLanding from "../assets/backgroundLanding.png";

const Landing: React.FC = () => {
  return (
    <Box 
      sx={{ 
        width: "100%", 
        overflow: "hidden",
        margin: 0,
        padding: 0,
        "& *": {
          boxSizing: "border-box"
        }
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          minHeight: { xs: "100vh", sm: "100vh", md: "100vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          py: { xs: 4, sm: 6, md: 8 },
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
          "@keyframes float": {
            "0%, 100%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-10px)",
            },
          },
          "@keyframes slideInUp": {
            "0%": {
              transform: "translateY(50px)",
              opacity: 0,
            },
            "100%": {
              transform: "translateY(0)",
              opacity: 1,
            },
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
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5.5rem" },
              lineHeight: { xs: 1.1, sm: 1.2 },
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "slideInUp 1s ease-out 0.2s both",
              position: "relative",
              zIndex: 2,
            }}
          >
            Complete Workforce Management
          </Typography>
        </Fade>
        
        <Slide direction="up" in={true} timeout={1200}>
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: { xs: "90%", sm: 700, md: 800 }, 
              opacity: 0.95, 
              mb: { xs: 4, sm: 6 },
              fontSize: { xs: "1.125rem", sm: "1.375rem", md: "1.5rem" },
              lineHeight: { xs: 1.4, sm: 1.5 },
              px: { xs: 1, sm: 0 },
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              fontWeight: 400,
              animation: "slideInUp 1s ease-out 0.4s both",
              position: "relative",
              zIndex: 2,
            }}
          >
            Empower your entire team with an all-in-one platform. From HR management to employee self-service,
            time tracking to task management - everything your growing business needs in one place.
          </Typography>
        </Slide>

        <Zoom in={true} timeout={1500}>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: { xs: 4, sm: 6 }, 
              py: { xs: 1.5, sm: 2 }, 
              borderRadius: 50, 
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              minWidth: { xs: "240px", sm: "280px" },
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
              textTransform: "none",
              animation: "fadeInScale 1s ease-out 0.6s both, float 3s ease-in-out infinite 2s",
              position: "relative",
              zIndex: 2,
              "&:hover": {
                transform: "translateY(-2px) scale(1.02)",
                boxShadow: "0 12px 40px rgba(25, 118, 210, 0.4)",
                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
              },
              "&:active": {
                transform: "translateY(0) scale(0.98)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Get Started Today
          </Button>
        </Zoom>

        {/* Floating particles animation */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 1,
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              animation: "float 6s ease-in-out infinite",
            },
            "&::before": {
              top: "10%",
              left: "10%",
              animationDelay: "0s",
            },
            "&::after": {
              bottom: "10%",
              right: "10%",
              animationDelay: "3s",
            },
          }}
        />
      </Box>

      {/* WHAT YOU CAN DO */}
      <Container 
        maxWidth={false}
        sx={{ 
          py: { xs: 8, sm: 10, md: 12 },
          px: { xs: 3, sm: 4, md: 6, lg: 8, xl: 12 },
          background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
          position: "relative",
          width: "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "4px",
            background: "linear-gradient(90deg, #1976d2, #1565c0)",
            borderRadius: "2px",
          }
        }}
      >
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
              mb: { xs: 3, sm: 4 },
              color: "#1a1a1a",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "3px",
                background: "linear-gradient(90deg, #1976d2, #1565c0)",
                borderRadius: "2px",
              }
            }}
          >
            Everything Your Team Needs
          </Typography>
        </Fade>
        
        <Slide direction="up" in={true} timeout={1200}>
          <Typography
            variant="h6"
            align="center"
            sx={{ 
              maxWidth: { xs: "100%", sm: 700, md: 800 }, 
              mx: "auto", 
              color: "text.secondary", 
              mb: { xs: 5, sm: 6, md: 8 },
              fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" },
              lineHeight: { xs: 1.5, sm: 1.6 },
              px: { xs: 1, sm: 0 },
              fontWeight: 400,
            }}
          >
            A comprehensive platform designed for both HR teams and employees. 
            Manage workflows, track productivity, and empower your workforce with self-service tools.
          </Typography>
        </Slide>

        <Grid 
          container 
          spacing={{ xs: 4, sm: 5, md: 4 }} 
          justifyContent="center"
          sx={{ 
            maxWidth: "1600px", 
            mx: "auto",
            px: { xs: 0, sm: 2, md: 4 }
          }}
        >
          {[
            {
              icon: PeopleIcon,
              title: "Employee Management",
              description: "Comprehensive HR tools for managing profiles, roles, departments, and organizational structure with ease.",
              delay: "0.1s",
              color: "#1976d2"
            },
            {
              icon: AccessTimeIcon,
              title: "Time Tracking",
              description: "Log working hours, track productivity, manage overtime, and generate detailed timesheets automatically.",
              delay: "0.2s",
              color: "#2e7d32"
            },
            {
              icon: EventNoteIcon,
              title: "Leave Management",
              description: "Request time off, check leave balances, view team calendars, and get instant approval notifications.",
              delay: "0.3s",
              color: "#7c4dff"
            },
            {
              icon: ChecklistIcon,
              title: "Onboarding & Training",
              description: "Streamlined onboarding with role-based checklists, document management, and progress tracking.",
              delay: "0.4s",
              color: "#ff6384"
            },
            {
              icon: TaskAltIcon,
              title: "Task Manager",
              description: "Personal task management, project assignments, deadline tracking, and productivity insights.",
              delay: "0.5s",
              color: "#ff9800"
            },
            {
              icon: ReportProblemIcon,
              title: "Issues & Feedback",
              description: "Report workplace issues, submit suggestions, track resolution status, and improve company culture.",
              delay: "0.6s",
              color: "#e91e63"
            }
          ].map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Zoom in={true} timeout={1000} style={{ transitionDelay: feature.delay }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 4, sm: 5 }, 
                    textAlign: "center", 
                    height: "100%",
                    borderRadius: 4,
                    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid #e3f2fd",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      "& .feature-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                        color: feature.color,
                      },
                      "&::before": {
                        transform: "translateY(0)",
                        opacity: 1,
                      }
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${feature.color}, ${feature.color}aa)`,
                      transform: "translateY(-4px)",
                      opacity: 0,
                      transition: "all 0.3s ease",
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <feature.icon 
                      className="feature-icon"
                      sx={{ 
                        fontSize: { xs: 36, sm: 42 }, 
                        color: feature.color,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.375rem" },
                      fontWeight: 700,
                      mb: { xs: 2, sm: 2.5 },
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      lineHeight: { xs: 1.5, sm: 1.6 },
                      color: "#555",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* TWO PERSPECTIVES SECTION */}
      <Box
        sx={{
          py: { xs: 8, sm: 10, md: 12 },
          px: { xs: 3, sm: 4, md: 6, lg: 8, xl: 12 },
          background: "linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "40%",
            height: "200%",
            background: "linear-gradient(45deg, rgba(25, 118, 210, 0.05), rgba(124, 77, 255, 0.05))",
            transform: "rotate(15deg)",
          }
        }}
      >
        <Container maxWidth={false} sx={{ position: "relative", zIndex: 2, maxWidth: "1600px", mx: "auto" }}>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h2" 
              align="center" 
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontWeight: 700,
                mb: { xs: 4, sm: 6 },
                color: "#1a1a1a",
              }}
            >
              Built for Everyone
            </Typography>
          </Fade>

          <Grid container spacing={{ xs: 6, sm: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Slide direction="right" in={true} timeout={1200}>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3, 
                      color: "#1976d2",
                      fontSize: { xs: "1.75rem", sm: "2rem" }
                    }}
                  >
                    For HR Teams
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4, 
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      lineHeight: 1.6,
                      color: "#555"
                    }}
                  >
                    Powerful administrative tools to manage your entire workforce efficiently. 
                    Handle employee records, approve requests, track compliance, and generate insights.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      "Employee database management",
                      "Leave approval workflows",
                      "Onboarding process automation",
                      "Compliance tracking & reporting"
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <ChecklistIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                        <Typography sx={{ color: "#555" }}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Slide>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Slide direction="left" in={true} timeout={1200}>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3, 
                      color: "#7c4dff",
                      fontSize: { xs: "1.75rem", sm: "2rem" }
                    }}
                  >
                    For Employees
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4, 
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      lineHeight: 1.6,
                      color: "#555"
                    }}
                  >
                    Self-service tools that empower your team to manage their work-life balance, 
                    track productivity, and stay organized without constant supervision.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      "Time tracking & timesheet management",
                      "Leave requests & balance checking",
                      "Personal task & project management",
                      "Issue reporting & feedback submission"
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <TaskAltIcon sx={{ color: "#7c4dff", fontSize: 20 }} />
                        <Typography sx={{ color: "#555" }}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
