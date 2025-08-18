import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { colors, getColorWithOpacity } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, verifyEmail } from '../../store/thunks/authThunks';
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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SupportIcon from '@mui/icons-material/Support';

const LoginContainer = styled.div`
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
  max-width: 450px;
  
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

const LoginCard = styled.div`
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

const ForgotPasswordLink = styled(Link)`
  color: ${colors.primary[600]};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: right;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary[700]};
    text-decoration: underline;
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

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, ${colors.success[50]} 0%, ${colors.success[100]} 100%);
  color: ${colors.success[700]};
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.success[200]};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px ${getColorWithOpacity(colors.success[500], 0.1)};
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -0.5rem 0 0.5rem 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.text.primary};
  }

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: ${colors.primary[500]};
    cursor: pointer;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${colors.border.light};
`;

const SignupText = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const SignupLink = styled(Link)`
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
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Handle email verification on component mount
  useEffect(() => {
    const verifyToken = searchParams.get('verify');
    if (verifyToken) {
      dispatch(verifyEmail(verifyToken))
        .unwrap()
        .then(() => {
          setVerificationMessage('Email verified successfully! You can now log in.');
        })
        .catch((error: string) => {
          setVerificationMessage(`Verification failed: ${error}`);
        });
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  // Load remembered email on component mount
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const lastEmail = localStorage.getItem('lastEmail');
    
    if (remembered === 'true' && lastEmail) {
      setFormData(prev => ({ ...prev, email: lastEmail }));
      setRememberMe(true);
    }
  }, []);

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
      
      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('lastEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('lastEmail');
      }
      // Navigation will be handled by the useEffect watching isAuthenticated
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginContainer>
      <BackButton to="/">
        <ArrowBackIcon />
      </BackButton>
      
      <ContentWrapper>
        <LeftPanel>
          <WelcomeSection>
            <h1>Welcome back!</h1>
            <p>Sign in to your CoreConnect account and continue collaborating with your team.</p>
          </WelcomeSection>

          <FeatureGrid>
            <FeatureCard>
              <WorkspacePremiumIcon />
              <div>
                <h3>Secure Authentication</h3>
                <p>Industry-standard security with multi-factor authentication</p>
              </div>
            </FeatureCard>
            <FeatureCard>
              <SpeedIcon />
              <div>
                <h3>Lightning Fast</h3>
                <p>Optimized performance for seamless user experience</p>
              </div>
            </FeatureCard>
            <FeatureCard>
              <CheckCircleIcon />
              <div>
                <h3>Reliable Access</h3>
                <p>99.9% uptime with robust infrastructure</p>
              </div>
            </FeatureCard>
            <FeatureCard>
              <SupportIcon />
              <div>
                <h3>Expert Support</h3>
                <p>Get help from our dedicated support team anytime</p>
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
              <span className="number">150+</span>
              <span className="label">Countries</span>
            </StatItem>
          </StatsContainer>
        </LeftPanel>

        <RightPanel>
          <LoginCard>
            <Logo>
              <LogoIcon>
                <SecurityIcon />
              </LogoIcon>
              <LogoText>
                <h2>CoreConnect</h2>
                <p>Welcome back</p>
              </LogoText>
            </Logo>

            {verificationMessage && (
              <SuccessMessage>{verificationMessage}</SuccessMessage>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
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

              <RememberMeContainer>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  Remember me
                </CheckboxLabel>

                <ForgotPasswordLink to="/forgot-password">
                  Forgot password?
                </ForgotPasswordLink>
              </RememberMeContainer>

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
          </LoginCard>
        </RightPanel>
      </ContentWrapper>
    </LoginContainer>
  );
};

export default Login;
