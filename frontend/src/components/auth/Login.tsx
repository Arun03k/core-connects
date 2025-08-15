import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import InputField from '../common/InputField';
import Button from '../common/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.background.gradient.secondary};
  padding: 1rem;
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${colors.background.paper};
  border: 1px solid ${colors.border.light};
  border-radius: 0.5rem;
  color: ${colors.text.primary};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${colors.background.paper};
    border-color: ${colors.primary[200]};
    color: ${colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 1.125rem;
  }
`;

const LoginCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div`
  background: ${colors.background.gradient.primary};
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  svg {
    font-size: 1.5rem;
    color: white;
  }
`;

const LogoText = styled.h1`
  background: ${colors.background.gradient.primary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const Title = styled.h2`
  color: ${colors.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  text-align: center;
  margin: 0 0 2rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ForgotPasswordLink = styled(Link)`
  color: ${colors.primary[500]};
  text-decoration: none;
  font-size: 0.875rem;
  text-align: right;
  margin-top: -0.5rem;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${colors.error[50]};
  color: ${colors.error[700]};
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.error[200]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.border.light};
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.border.light};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  
  svg {
    color: ${colors.primary[500]};
    font-size: 1rem;
  }
`;

const SignupText = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
`;

const SignupLink = styled(Link)`
  color: ${colors.primary[500]};
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will be handled by the useEffect watching isAuthenticated
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginContainer>
      <BackButton to="/">
        <ArrowBackIcon />
        Back to Home
      </BackButton>
      
      <LoginCard>
        <Logo>
          <LogoIcon>
            <SecurityIcon />
          </LogoIcon>
          <LogoText>CoreConnect</LogoText>
        </Logo>
        
        <Title>Welcome back</Title>
        <Subtitle>Sign in to your account to continue your journey</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            autoComplete="email"
            required
            startIcon={<EmailIcon />}
          />

          <InputField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            autoComplete="current-password"
            required
            startIcon={<LockIcon />}
            endIcon={showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onEndIconClick={() => setShowPassword(!showPassword)}
          />

          <ForgotPasswordLink to="/forgot-password">
            Forgot your password?
          </ForgotPasswordLink>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              {!isLoading && <LoginIcon style={{ fontSize: '1.125rem' }} />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </div>
          </Button>
        </Form>

        <SignupPrompt>
          <SignupText>
            Don't have an account?
            <SignupLink to="/signup">Create one here</SignupLink>
          </SignupText>
        </SignupPrompt>

        <Features>
          <FeatureItem>
            <CheckCircleIcon />
            <span>Secure & reliable authentication</span>
          </FeatureItem>
          <FeatureItem>
            <SpeedIcon />
            <span>Lightning-fast team management</span>
          </FeatureItem>
          <FeatureItem>
            <GroupsIcon />
            <span>Collaborate with your team</span>
          </FeatureItem>
        </Features>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
