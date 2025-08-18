import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  Api as ApiIcon,
  Security,
  Public,
  AccountCircle,
  BarChart,
  MonitorHeart,
  Code,
  ContentCopy,
  CheckCircle,
} from "@mui/icons-material";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requiresAuth: boolean;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  requestBody?: {
    contentType: string;
    properties: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
  };
  responses: Array<{
    status: number;
    description: string;
    example?: Record<string, unknown>;
  }>;
  example?: {
    request?: Record<string, unknown>;
    response?: Record<string, unknown>;
  };
}

interface ApiCategory {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  endpoints: ApiEndpoint[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Api: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "#4CAF50";
      case "POST": return "#2196F3";
      case "PUT": return "#FF9800";
      case "DELETE": return "#F44336";
      default: return "#757575";
    }
  };

  const apiCategories: ApiCategory[] = [
    {
      title: "Authentication",
      description: "User authentication and authorization endpoints",
      icon: <Security />,
      color: "#1976d2",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Authenticate user and receive JWT token",
          requiresAuth: false,
          requestBody: {
            contentType: "application/json",
            properties: [
              { name: "email", type: "string", required: true, description: "User's email address" },
              { name: "password", type: "string", required: true, description: "User's password" }
            ]
          },
          responses: [
            {
              status: 200,
              description: "Login successful",
              example: {
                message: "Login successful",
                status: "success",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                  id: "user123",
                  email: "user@example.com",
                  username: "johndoe",
                  first_name: "John",
                  last_name: "Doe"
                }
              }
            },
            { status: 400, description: "Email and password are required" },
            { status: 401, description: "Invalid email or password" }
          ]
        },
        {
          method: "POST",
          path: "/api/auth/register",
          description: "Register a new user account",
          requiresAuth: false,
          requestBody: {
            contentType: "application/json",
            properties: [
              { name: "email", type: "string", required: true, description: "User's email address" },
              { name: "password", type: "string", required: true, description: "User's password (min 6 chars)" },
              { name: "username", type: "string", required: false, description: "Unique username" },
              { name: "first_name", type: "string", required: false, description: "User's first name" },
              { name: "last_name", type: "string", required: false, description: "User's last name" }
            ]
          },
          responses: [
            {
              status: 201,
              description: "Registration successful",
              example: {
                message: "Registration successful",
                status: "success",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                  id: "user123",
                  email: "user@example.com",
                  username: "johndoe"
                }
              }
            },
            { status: 400, description: "Validation error" }
          ]
        },
        {
          method: "POST",
          path: "/api/auth/signup",
          description: "Alias for registration endpoint",
          requiresAuth: false,
          requestBody: {
            contentType: "application/json",
            properties: [
              { name: "email", type: "string", required: true, description: "User's email address" },
              { name: "password", type: "string", required: true, description: "User's password" },
              { name: "username", type: "string", required: false, description: "Username" },
              { name: "first_name", type: "string", required: false, description: "First name" },
              { name: "last_name", type: "string", required: false, description: "Last name" }
            ]
          },
          responses: [
            { status: 201, description: "Registration successful" },
            { status: 400, description: "Validation error" }
          ]
        },
        {
          method: "POST",
          path: "/api/auth/logout",
          description: "Logout user (client-side token removal)",
          requiresAuth: true,
          responses: [
            {
              status: 200,
              description: "Logout successful",
              example: {
                message: "Logout successful",
                status: "success"
              }
            }
          ]
        },
        {
          method: "GET",
          path: "/api/auth/verify",
          description: "Verify JWT token and get user info",
          requiresAuth: true,
          responses: [
            {
              status: 200,
              description: "Token is valid",
              example: {
                message: "Token is valid",
                status: "success",
                user: {
                  id: "user123",
                  email: "user@example.com",
                  username: "johndoe"
                }
              }
            },
            { status: 401, description: "Invalid or expired token" }
          ]
        }
      ]
    },
    {
      title: "User Profile",
      description: "User profile management endpoints",
      icon: <AccountCircle />,
      color: "#673AB7",
      endpoints: [
        {
          method: "GET",
          path: "/api/auth/profile",
          description: "Get current user's profile information",
          requiresAuth: true,
          responses: [
            {
              status: 200,
              description: "Profile retrieved successfully",
              example: {
                status: "success",
                user: {
                  id: "user123",
                  email: "user@example.com",
                  username: "johndoe",
                  first_name: "John",
                  last_name: "Doe",
                  profile: {
                    bio: "Software Developer",
                    location: "New York",
                    website: "https://johndoe.com"
                  }
                }
              }
            }
          ]
        },
        {
          method: "PUT",
          path: "/api/auth/profile",
          description: "Update user profile information",
          requiresAuth: true,
          requestBody: {
            contentType: "application/json",
            properties: [
              { name: "first_name", type: "string", required: false, description: "First name" },
              { name: "last_name", type: "string", required: false, description: "Last name" },
              { name: "username", type: "string", required: false, description: "Username" },
              { name: "profile", type: "object", required: false, description: "Profile information" },
              { name: "settings", type: "object", required: false, description: "User settings" }
            ]
          },
          responses: [
            {
              status: 200,
              description: "Profile updated successfully",
              example: {
                message: "Profile updated successfully",
                status: "success",
                user: {
                  id: "user123",
                  email: "user@example.com",
                  first_name: "John Updated"
                }
              }
            },
            { status: 400, description: "Invalid update data" }
          ]
        },
        {
          method: "POST",
          path: "/api/auth/change-password",
          description: "Change user password",
          requiresAuth: true,
          requestBody: {
            contentType: "application/json",
            properties: [
              { name: "old_password", type: "string", required: true, description: "Current password" },
              { name: "new_password", type: "string", required: true, description: "New password (min 6 chars)" }
            ]
          },
          responses: [
            {
              status: 200,
              description: "Password changed successfully",
              example: {
                message: "Password changed successfully",
                status: "success"
              }
            },
            { status: 400, description: "Invalid password data" }
          ]
        }
      ]
    },
    {
      title: "System",
      description: "System status and utility endpoints",
      icon: <MonitorHeart />,
      color: "#4CAF50",
      endpoints: [
        {
          method: "GET",
          path: "/",
          description: "API root endpoint with basic information",
          requiresAuth: false,
          responses: [
            {
              status: 200,
              description: "API information",
              example: {
                message: "CoreConnect API is running",
                status: "success",
                version: "1.0.0"
              }
            }
          ]
        },
        {
          method: "GET",
          path: "/health",
          description: "Health check endpoint for monitoring",
          requiresAuth: false,
          responses: [
            {
              status: 200,
              description: "System is healthy",
              example: {
                status: "healthy",
                database: "connected",
                timestamp: "2025-08-15T00:00:00Z"
              }
            },
            { status: 503, description: "System unhealthy" }
          ]
        },
        {
          method: "GET",
          path: "/api/test",
          description: "Test API endpoint for connectivity",
          requiresAuth: false,
          responses: [
            {
              status: 200,
              description: "API test successful",
              example: {
                message: "API endpoint is working",
                data: "Hello from Flask backend!"
              }
            }
          ]
        }
      ]
    },
    {
      title: "Statistics",
      description: "Application statistics and analytics",
      icon: <BarChart />,
      color: "#FF9800",
      endpoints: [
        {
          method: "GET",
          path: "/api/stats",
          description: "Get application statistics",
          requiresAuth: false,
          responses: [
            {
              status: 200,
              description: "Statistics retrieved successfully",
              example: {
                status: "success",
                stats: {
                  total_users: 150,
                  active_users: 142,
                  verified_users: 98,
                  inactive_users: 8
                }
              }
            },
            { status: 500, description: "Failed to get statistics" }
          ]
        }
      ]
    }
  ];

  const renderEndpoint = (endpoint: ApiEndpoint, index: string) => (
    <Accordion
      key={`${endpoint.method}-${endpoint.path}-${index}`}
      expanded={expandedAccordion === `endpoint-${index}`}
      onChange={handleAccordionChange(`endpoint-${index}`)}
      sx={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderRadius: 2,
        mb: 2,
        "&:before": { display: "none" },
        border: "1px solid rgba(0,0,0,0.1)"
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
          <Chip
            label={endpoint.method}
            size="small"
            sx={{
              backgroundColor: getMethodColor(endpoint.method),
              color: "white",
              fontWeight: 600,
              minWidth: 60
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontFamily: "monospace",
              fontWeight: 600,
              color: "#333",
              flex: 1
            }}
          >
            {endpoint.path}
          </Typography>
          {endpoint.requiresAuth && (
            <Chip
              label="Auth Required"
              size="small"
              icon={<Security sx={{ fontSize: "16px !important" }} />}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                fontSize: "0.7rem"
              }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {endpoint.description}
          </Typography>

          {/* Request Body */}
          {endpoint.requestBody && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontSize: "1rem" }}>
                Request Body ({endpoint.requestBody.contentType})
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Parameter</strong></TableCell>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Required</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {endpoint.requestBody.properties.map((prop) => (
                      <TableRow key={prop.name}>
                        <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                          {prop.name}
                        </TableCell>
                        <TableCell sx={{ color: "#666" }}>{prop.type}</TableCell>
                        <TableCell>
                          {prop.required ? (
                            <Chip label="Yes" size="small" color="error" />
                          ) : (
                            <Chip label="No" size="small" color="default" />
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "#666" }}>{prop.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Parameters */}
          {endpoint.parameters && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontSize: "1rem" }}>
                Parameters
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Parameter</strong></TableCell>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Required</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {endpoint.parameters.map((param) => (
                      <TableRow key={param.name}>
                        <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                          {param.name}
                        </TableCell>
                        <TableCell sx={{ color: "#666" }}>{param.type}</TableCell>
                        <TableCell>
                          {param.required ? (
                            <Chip label="Yes" size="small" color="error" />
                          ) : (
                            <Chip label="No" size="small" color="default" />
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "#666" }}>{param.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Responses */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontSize: "1rem" }}>
              Responses
            </Typography>
            {endpoint.responses.map((response, responseIndex) => (
              <Box key={responseIndex} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={response.status}
                    size="small"
                    sx={{
                      backgroundColor: response.status < 300 ? "#4CAF50" : response.status < 400 ? "#FF9800" : "#F44336",
                      color: "white",
                      fontWeight: 600
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {response.description}
                  </Typography>
                </Box>
                {response.example && (
                  <Box sx={{ position: "relative" }}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        overflow: "auto"
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {JSON.stringify(response.example, null, 2)}
                        </pre>
                        <Tooltip title={copiedText === `response-${responseIndex}` ? "Copied!" : "Copy to clipboard"}>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2), `response-${responseIndex}`)}
                            sx={{ ml: 1 }}
                          >
                            {copiedText === `response-${responseIndex}` ? <CheckCircle color="success" /> : <ContentCopy />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* cURL Example */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontSize: "1rem" }}>
              Example Request
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#263238",
                color: "#fff",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.85rem",
                position: "relative"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {`curl -X ${endpoint.method} \\
  http://localhost:5000${endpoint.path} \\
  -H "Content-Type: application/json"${endpoint.requiresAuth ? ' \\\n  -H "Authorization: Bearer YOUR_JWT_TOKEN"' : ''}${endpoint.requestBody ? ' \\\n  -d \'{\n    "email": "user@example.com",\n    "password": "password123"\n  }\'' : ''}`}
                </pre>
                <Tooltip title={copiedText === `curl-${index}` ? "Copied!" : "Copy cURL command"}>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(
                      `curl -X ${endpoint.method} http://localhost:5000${endpoint.path} -H "Content-Type: application/json"${endpoint.requiresAuth ? ' -H "Authorization: Bearer YOUR_JWT_TOKEN"' : ''}${endpoint.requestBody ? ' -d \'{"email": "user@example.com", "password": "password123"}\'' : ''}`,
                      `curl-${index}`
                    )}
                    sx={{ ml: 1, color: "#fff" }}
                  >
                    {copiedText === `curl-${index}` ? <CheckCircle color="success" /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#1976d2",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" }
          }}
        >
          <ApiIcon fontSize="inherit" />
          API Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Complete reference for all available API endpoints in CoreConnect. All endpoints return JSON responses.
        </Typography>
        
        {/* API Base URLs */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Base URLs:
          </Typography>
          <List dense>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <Public sx={{ fontSize: "1rem" }} />
              </ListItemIcon>
              <ListItemText
                primary="Production: https://core-connect-seven.vercel.app"
                sx={{ margin: 0, "& .MuiListItemText-primary": { fontSize: "0.9rem", fontFamily: "monospace" } }}
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <Code sx={{ fontSize: "1rem" }} />
              </ListItemIcon>
              <ListItemText
                primary="Local Development: http://localhost:5000"
                sx={{ margin: 0, "& .MuiListItemText-primary": { fontSize: "0.9rem", fontFamily: "monospace" } }}
              />
            </ListItem>
          </List>
        </Alert>
      </Box>

      {/* Navigation Tabs */}
      <Paper
        sx={{
          mb: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          borderRadius: 3,
          overflow: "hidden"
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
                color: "#1976d2"
              }
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
              height: 3
            }
          }}
        >
          {apiCategories.map((category, index) => (
            <Tab
              key={index}
              icon={category.icon}
              label={category.title}
              sx={{
                "& .MuiTab-iconWrapper": {
                  marginBottom: { xs: "4px", sm: "6px" },
                  fontSize: { xs: "1.2rem", sm: "1.5rem" }
                }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {apiCategories.map((category, categoryIndex) => (
        <TabPanel key={categoryIndex} value={tabValue} index={categoryIndex}>
          <Card
            sx={{
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderRadius: 3,
              mb: 4
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box sx={{ color: category.color, fontSize: "2rem", display: "flex", alignItems: "center" }}>
                  {category.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: category.color,
                      fontWeight: 600,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" }
                    }}
                  >
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Endpoints */}
              <Box>
                {category.endpoints.map((endpoint, endpointIndex) =>
                  renderEndpoint(endpoint, `${categoryIndex}-${endpointIndex}`)
                )}
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      ))}

      {/* Authentication Guide */}
      <Card
        sx={{
          background: "linear-gradient(145deg, #e3f2fd 0%, #e8f5e8 100%)",
          boxShadow: "0 8px 32px rgba(25,118,210,0.15)",
          borderRadius: 3,
          border: "2px solid #1976d2"
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#1976d2",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem" }
            }}
          >
            <Security />
            Authentication Guide
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
            CoreConnect API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected endpoints.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontSize: "1.125rem" }}>
              Getting a Token
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              1. Send a POST request to <code>/api/auth/login</code> or <code>/api/auth/register</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              2. Extract the <code>token</code> from the response
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              3. Include it in the Authorization header: <code>Authorization: Bearer &lt;your-token&gt;</code>
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontSize: "1.125rem" }}>
              Example Usage
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#263238",
                color: "#fff",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.85rem"
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{`// 1. Login and get token
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token } = await loginResponse.json();

// 2. Use token for authenticated requests
const profileResponse = await fetch('/api/auth/profile', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});`}
              </pre>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Api;
