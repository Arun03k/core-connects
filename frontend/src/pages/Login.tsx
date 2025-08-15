import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Link,
  Alert,
  CircularProgress,
  Fade,
  Collapse,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { colors } from "../theme/colors";

interface User {
  id: number;
  email: string;
  fullName: string;
  provider?: string;
}

interface LoginProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ open, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError("");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      if (isSignUp) {
        if (!formData.fullName || !formData.confirmPassword) {
          throw new Error("Please fill in all required fields");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        id: 1,
        email: formData.email,
        fullName: formData.fullName || formData.email.split('@')[0],
      };

      onSuccess?.(userData);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during authentication";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = {
        id: 1,
        email: `user@${provider}.com`,
        fullName: `${provider} User`,
        provider,
      };
      onSuccess?.(userData);
      onClose();
    } catch {
      setError(`Failed to login with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setError("");
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: `0 10px 40px ${colors.shadow.medium}`,
          background: colors.background.paper,
          overflow: 'visible',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Clean Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            color: colors.text.inverse,
            p: 3,
            position: "relative",
            textAlign: "center",
          }}
        >
          <IconButton
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: colors.text.inverse,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {isSignUp 
              ? "Join CoreConnect today" 
              : "Sign in to your account"
            }
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          {/* Error Alert */}
          <Collapse in={!!error}>
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Collapse>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              {/* Full Name Field - Only for Sign Up */}
              {isSignUp && (
                <Fade in={isSignUp} timeout={300}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange("fullName")}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: colors.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </Fade>
              )}

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: colors.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: colors.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        disabled={isLoading}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: isSignUp ? 2 : 1 }}
              />

              {/* Confirm Password Field - Only for Sign Up */}
              {isSignUp && (
                <Fade in={isSignUp} timeout={300}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: colors.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                </Fade>
              )}
            </Box>

            {/* Forgot Password Link - Only for Sign In */}
            {!isSignUp && (
              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle forgot password
                  }}
                  sx={{ 
                    color: colors.primary[500],
                    textDecoration: "none",
                    fontSize: '0.875rem',
                    '&:hover': { 
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                },
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </Box>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, px: 2 }}>
              OR
            </Typography>
          </Divider>

          {/* Social Login Buttons */}
          <Box sx={{ mb: 3, display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: colors.border.light,
                color: colors.text.primary,
                '&:hover': {
                  backgroundColor: colors.button.hover,
                  borderColor: colors.primary[300],
                },
              }}
            >
              Google
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              startIcon={<GitHubIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: colors.border.light,
                color: colors.text.primary,
                '&:hover': {
                  backgroundColor: colors.button.hover,
                  borderColor: colors.primary[300],
                },
              }}
            >
              GitHub
            </Button>
          </Box>

          {/* Toggle Mode */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Typography>
            <Button
              onClick={toggleMode}
              variant="text"
              disabled={isLoading}
              sx={{ 
                color: colors.primary[500],
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: colors.button.hover,
                },
              }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
