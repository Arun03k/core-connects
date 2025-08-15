import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signupUser } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import InputField from '../common/InputField';
import Button from '../common/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportIcon from '@mui/icons-material/Support';
import CloudIcon from '@mui/icons-material/Cloud';

const SignupContainer = styled.div`
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

const SignupCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
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

const PasswordStrengthIndicator = styled.div<{ strength: number }>`
  height: 4px;
  background-color: ${colors.neutral[200]};
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => (props.strength / 4) * 100}%;
    background-color: ${props => {
      if (props.strength <= 1) return colors.error[500];
      if (props.strength <= 2) return colors.warning[500];
      if (props.strength <= 3) return colors.info[500];
      return colors.success[500];
    }};
    transition: all 0.3s ease;
  }
`;

const PasswordStrengthText = styled.span<{ strength: number }>`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  color: ${props => {
    if (props.strength <= 1) return colors.error[500];
    if (props.strength <= 2) return colors.warning[500];
    if (props.strength <= 3) return colors.info[500];
    return colors.success[500];
  }};
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

const TermsText = styled.p`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  text-align: center;
  margin: 1rem 0;
  line-height: 1.4;

  a {
    color: ${colors.primary[500]};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPrompt = styled.div`
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

const LoginText = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
`;

const LoginLink = styled(Link)`
  color: ${colors.primary[500]};
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
};

const getPasswordStrengthText = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return 'Weak password';
    case 2:
      return 'Fair password';
    case 3:
      return 'Good password';
    case 4:
      return 'Strong password';
    default:
      return '';
  }
};

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(formData.password));
  }, [formData.password]);

  const validateForm = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      // Convert formData to match SignupCredentials interface
      const signupData = {
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      
      await dispatch(signupUser(signupData)).unwrap();
      // Navigation will be handled by the useEffect watching isAuthenticated
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <SignupContainer>
      <BackButton to="/">
        <ArrowBackIcon />
        Back to Home
      </BackButton>
      
      <SignupCard>
        <Logo>
          <LogoIcon>
            <SecurityIcon />
          </LogoIcon>
          <LogoText>CoreConnect</LogoText>
        </Logo>
        
        <Title>Create your account</Title>
        <Subtitle>Join CoreConnect and start managing your team efficiently</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputField
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            autoComplete="name"
            required
            startIcon={<PersonIcon />}
          />

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

          <div>
            <InputField
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              autoComplete="new-password"
              required
              startIcon={<LockIcon />}
              endIcon={showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onEndIconClick={() => setShowPassword(!showPassword)}
            />
            {formData.password && (
              <>
                <PasswordStrengthIndicator strength={passwordStrength} />
                <PasswordStrengthText strength={passwordStrength}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {passwordStrength >= 3 && <CheckCircleIcon style={{ fontSize: '1rem' }} />}
                    {getPasswordStrengthText(passwordStrength)}
                  </div>
                </PasswordStrengthText>
              </>
            )}
          </div>

          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={formErrors.confirmPassword}
            autoComplete="new-password"
            required
            startIcon={<LockIcon />}
            endIcon={showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <TermsText>
            By creating an account, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </TermsText>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              {!isLoading && <PersonAddIcon style={{ fontSize: '1.125rem' }} />}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </div>
          </Button>
        </Form>

        <LoginPrompt>
          <LoginText>
            Already have an account?
            <LoginLink to="/login">Sign in here</LoginLink>
          </LoginText>
        </LoginPrompt>

        <Features>
          <FeatureItem>
            <TrendingUpIcon />
            <span>Boost team productivity</span>
          </FeatureItem>
          <FeatureItem>
            <CloudIcon />
            <span>Cloud-based collaboration</span>
          </FeatureItem>
          <FeatureItem>
            <SupportIcon />
            <span>24/7 customer support</span>
          </FeatureItem>
        </Features>
      </SignupCard>
    </SignupContainer>
  );
};

export default Signup;
