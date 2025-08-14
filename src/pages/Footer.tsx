import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)",
        color: "white",
        mt: "auto",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }
      }}
    >
      {/* Main Footer Content */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: { xs: 6, sm: 8 },
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          maxWidth: "1400px",
          mx: "auto"
        }}
      >
        <Grid container spacing={{ xs: 4, sm: 6 }}>
          {/* Company Info */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 3,
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CoreConnect
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
              }}
            >
              Complete workforce management platform designed to empower teams 
              and streamline HR operations for growing businesses.
            </Typography>
            
            {/* Social Media Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#60a5fa",
                    borderColor: "#60a5fa",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#0077b5",
                    borderColor: "#0077b5",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#1da1f2",
                    borderColor: "#1da1f2",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "white",
              }}
            >
              Product
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "Employee Management",
                "Time Tracking",
                "Leave Management",
                "Task Manager",
                "Onboarding",
                "Reports & Analytics",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#60a5fa",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "white",
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "About Us",
                "Careers",
                "Contact",
                "Blog",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#60a5fa",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "white",
              }}
            >
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Link
                href="https://github.com/Arun03k/core-connects/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#60a5fa",
                    transform: "translateX(4px)",
                  },
                }}
              >
                Documentation
              </Link>
              {[
                "API Reference",
                "Help Center",
                "Community",
                "Status",
                "Changelog",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#60a5fa",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "white",
              }}
            >
              Get in Touch
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Email 
                  sx={{ 
                    color: "#60a5fa", 
                    fontSize: "1.1rem" 
                  }} 
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  support@coreconnect.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Phone 
                  sx={{ 
                    color: "#60a5fa", 
                    fontSize: "1.1rem" 
                  }} 
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOn 
                  sx={{ 
                    color: "#60a5fa", 
                    fontSize: "1.1rem",
                    mt: 0.1 
                  }} 
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  123 Business Ave, Suite 100<br />
                  Tech City, TC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Copyright Section */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          py: 3,
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            maxWidth: "1400px",
            mx: "auto"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", sm: "center" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.6)",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              © 2025 CoreConnect by{" "}
              <Link
                href="#"
                sx={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    color: "#93c5fd",
                    textDecoration: "underline",
                  },
                }}
              >
                @Arun Kumar
              </Link>
              . All rights reserved.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.6)",
                textAlign: { xs: "center", sm: "right" },
              }}
            >
              Made with ❤️ for growing businesses
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": {
              transform: "translateY(0px) rotate(0deg)",
            },
            "50%": {
              transform: "translateY(-20px) rotate(180deg)",
            },
          },
        }}
      />
      
      <Box
        sx={{
          position: "absolute",
          bottom: "30%",
          left: "-5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />
    </Box>
  );
};

export default Footer;
