import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotPassword } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import InputField from '../common/InputField';
import Button from '../common/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const ForgotPasswordContainer = styled.div`
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

const ForgotPasswordCard = styled.div`
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
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const SuccessMessage = styled.div`
  background-color: ${colors.success[50]};
  color: ${colors.success[700]};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.success[200]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${colors.success[500]};
    font-size: 2rem;
  }
`;

const InfoMessage = styled.div`
  background-color: ${colors.info[50]};
  color: ${colors.info[700]};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.info[200]};
  font-size: 0.875rem;
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  line-height: 1.5;

  svg {
    color: ${colors.info[500]};
    font-size: 1.25rem;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.border.light};
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

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

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

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError || error) {
      setEmailError('');
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsEmailSent(true);
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  };

  const handleResendEmail = async () => {
    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch (error) {
      console.error('Resend email failed:', error);
    }
  };

  if (isEmailSent) {
    return (
      <ForgotPasswordContainer>
        <BackButton to="/login">
          <ArrowBackIcon />
          Back to Login
        </BackButton>
        
        <ForgotPasswordCard>
          <Logo>
            <LogoIcon>
              <SecurityIcon />
            </LogoIcon>
            <LogoText>CoreConnect</LogoText>
          </Logo>
          
          <Title>Check your email</Title>
          <Subtitle>
            We've sent password reset instructions to <strong>{email}</strong>
          </Subtitle>

          <SuccessMessage>
            <CheckCircleIcon />
            <div>
              <strong>Email sent successfully!</strong>
              <br />
              Follow the link in the email to reset your password.
            </div>
          </SuccessMessage>

          <InfoMessage>
            <InfoIcon />
            <div>
              <strong>Didn't receive the email?</strong>
              <br />
              Check your spam folder or{' '}
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary[600],
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                click here to resend
              </button>
            </div>
          </InfoMessage>

          <LoginPrompt>
            <LoginText>
              Remember your password?
              <LoginLink to="/login">Back to login</LoginLink>
            </LoginText>
          </LoginPrompt>
        </ForgotPasswordCard>
      </ForgotPasswordContainer>
    );
  }

  return (
    <ForgotPasswordContainer>
      <BackButton to="/login">
        <ArrowBackIcon />
        Back to Login
      </BackButton>
      
      <ForgotPasswordCard>
        <Logo>
          <LogoIcon>
            <SecurityIcon />
          </LogoIcon>
          <LogoText>CoreConnect</LogoText>
        </Logo>
        
        <Title>Forgot your password?</Title>
        <Subtitle>
          No worries! Enter your email address and we'll send you a link to reset your password.
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            autoComplete="email"
            required
            startIcon={<EmailIcon />}
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !email}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              {!isLoading && <SendIcon style={{ fontSize: '1.125rem' }} />}
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </div>
          </Button>
        </Form>

        <InfoMessage>
          <InfoIcon />
          <div>
            <strong>Security Notice:</strong>
            <br />
            For security reasons, we'll send reset instructions only if an account with this email exists.
          </div>
        </InfoMessage>

        <LoginPrompt>
          <LoginText>
            Remember your password?
            <LoginLink to="/login">Back to login</LoginLink>
          </LoginText>
        </LoginPrompt>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
