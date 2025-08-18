import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, getColorWithOpacity } from '../../theme/colors';
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
import SupportIcon from '@mui/icons-material/Support';
import CloudIcon from '@mui/icons-material/Cloud';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SpeedIcon from '@mui/icons-material/Speed';

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  padding: 2rem;
  gap: 4rem;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: white;
  
  @media (max-width: 968px) {
    text-align: center;
    order: 2;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  max-width: 480px;
  
  @media (max-width: 968px) {
    order: 1;
    width: 100%;
    max-width: 400px;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  svg {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(-1px);
  }

  @media (max-width: 768px) {
    top: 1.5rem;
    left: 1.5rem;
    width: 3rem;
    height: 3rem;
    
    svg {
      font-size: 1.125rem;
    }
  }
`;

const WelcomeSection = styled.div`
  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.1;

    @media (max-width: 968px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 2rem;

    @media (max-width: 968px) {
      font-size: 1.125rem;
    }
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  svg {
    color: #FFD700;
    font-size: 2rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  div {
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: white;
    }

    p {
      font-size: 0.875rem;
      opacity: 0.8;
      margin: 0;
    }
  }
`;

const SignupCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 3rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 35px 70px -12px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 968px) {
    padding: 2rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LogoIcon = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);

  svg {
    font-size: 2rem;
    color: white;
  }
`;

const LogoText = styled.div`
  h2 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2.25rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: ${colors.text.secondary};
    font-size: 1rem;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PasswordStrengthContainer = styled.div`
  margin-top: 0.75rem;
`;

const PasswordStrengthIndicator = styled.div<{ strength: number }>`
  height: 6px;
  background-color: ${colors.neutral[200]};
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => (props.strength / 4) * 100}%;
    background: ${props => {
      if (props.strength <= 1) return `linear-gradient(90deg, ${colors.error[400]} 0%, ${colors.error[500]} 100%)`;
      if (props.strength <= 2) return `linear-gradient(90deg, ${colors.warning[400]} 0%, ${colors.warning[500]} 100%)`;
      if (props.strength <= 3) return `linear-gradient(90deg, ${colors.info[400]} 0%, ${colors.info[500]} 100%)`;
      return `linear-gradient(90deg, ${colors.success[400]} 0%, ${colors.success[500]} 100%)`;
    }};
    transition: all 0.3s ease;
    border-radius: 3px;
  }
`;

const PasswordStrengthText = styled.div<{ strength: number }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
  color: ${props => {
    if (props.strength <= 1) return colors.error[600];
    if (props.strength <= 2) return colors.warning[600];
    if (props.strength <= 3) return colors.info[600];
    return colors.success[600];
  }};

  svg {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, ${colors.error[50]} 0%, ${colors.error[100]} 100%);
  color: ${colors.error[700]};
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.error[200]};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px ${getColorWithOpacity(colors.error[500], 0.1)};
`;

const TermsContainer = styled.div`
  background: ${colors.neutral[50]};
  border: 1px solid ${colors.neutral[200]};
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1rem 0;
`;

const TermsText = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  text-align: center;
  margin: 0;
  line-height: 1.5;

  a {
    color: ${colors.primary[600]};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.primary[700]};
      text-decoration: underline;
    }
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${colors.border.light};
`;

const LoginText = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const LoginLink = styled(Link)`
  color: ${colors.primary[600]};
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary[700]};
    text-decoration: underline;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  justify-content: center;

  @media (max-width: 968px) {
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: white;

  .number {
    font-size: 2rem;
    font-weight: 800;
    display: block;
    opacity: 0.9;
  }

  .label {
    font-size: 0.875rem;
    opacity: 0.7;
    margin-top: 0.25rem;
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
      </BackButton>
      
      <ContentWrapper>
        <LeftPanel>
          <WelcomeSection>
            <h1>Join thousands of teams</h1>
            <p>Start your journey with CoreConnect and transform how your team collaborates and grows together.</p>
          </WelcomeSection>

          <FeatureGrid>
            <FeatureCard>
              <WorkspacePremiumIcon />
              <div>
                <h3>Premium Features</h3>
                <p>Access advanced team management tools and analytics</p>
              </div>
            </FeatureCard>
            <FeatureCard>
              <SpeedIcon />
              <div>
                <h3>Lightning Fast</h3>
                <p>Optimized performance for seamless collaboration</p>
              </div>
            </FeatureCard>
            <FeatureCard>
              <CloudIcon />
              <div>
                <h3>Cloud Synced</h3>
                <p>Your data is always synchronized across devices</p>
              </div>
            </FeatureCard>
            <FeatureCard>
              <SupportIcon />
              <div>
                <h3>24/7 Support</h3>
                <p>Get help whenever you need it from our expert team</p>
              </div>
            </FeatureCard>
          </FeatureGrid>

          <StatsContainer>
            <StatItem>
              <span className="number">50K+</span>
              <span className="label">Active Users</span>
            </StatItem>
            <StatItem>
              <span className="number">99.9%</span>
              <span className="label">Uptime</span>
            </StatItem>
            <StatItem>
              <span className="number">24/7</span>
              <span className="label">Support</span>
            </StatItem>
          </StatsContainer>
        </LeftPanel>

        <RightPanel>
          <SignupCard>
            <Logo>
              <LogoIcon>
                <SecurityIcon />
              </LogoIcon>
              <LogoText>
                <h2>CoreConnect</h2>
                <p>Create your account</p>
              </LogoText>
            </Logo>

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
                placeholder="Enter your email address"
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
                  <PasswordStrengthContainer>
                    <PasswordStrengthIndicator strength={passwordStrength} />
                    <PasswordStrengthText strength={passwordStrength}>
                      {passwordStrength >= 3 && <CheckCircleIcon />}
                      {getPasswordStrengthText(passwordStrength)}
                    </PasswordStrengthText>
                  </PasswordStrengthContainer>
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

              <TermsContainer>
                <TermsText>
                  By creating an account, you agree to our{' '}
                  <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </TermsText>
              </TermsContainer>

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
          </SignupCard>
        </RightPanel>
      </ContentWrapper>
    </SignupContainer>
  );
};

export default Signup;
