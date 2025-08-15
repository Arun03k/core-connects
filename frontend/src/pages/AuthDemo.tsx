import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme/colors';

const DemoContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${colors.background.gradient.secondary};
  padding: 2rem;
`;

const DemoCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h1`
  background: ${colors.background.gradient.primary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

const Subtitle = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  line-height: 1.5;
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const DemoLink = styled(Link)`
  display: block;
  padding: 1.5rem;
  background: ${colors.background.default};
  border: 2px solid ${colors.border.light};
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
  color: ${colors.text.primary};

  &:hover {
    border-color: ${colors.primary[500]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 77, 255, 0.15);
  }

  h3 {
    color: ${colors.primary[500]};
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: ${colors.text.secondary};
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
  }
`;

const FeaturesList = styled.div`
  text-align: left;
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${colors.neutral[50]};
  border-radius: 0.75rem;

  h4 {
    color: ${colors.text.primary};
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
    color: ${colors.text.secondary};

    li {
      margin: 0.5rem 0;
      line-height: 1.4;
    }
  }
`;

const AuthDemo: React.FC = () => {
  return (
    <DemoContainer>
      <DemoCard>
        <Title>CoreConnect Auth</Title>
        <Subtitle>
          Modern authentication system with Redux state management, 
          responsive design, and comprehensive form validation.
        </Subtitle>

        <LinksGrid>
          <DemoLink to="/login">
            <h3>🔐 Login Page</h3>
            <p>Clean login form with validation, loading states, and error handling</p>
          </DemoLink>

          <DemoLink to="/signup">
            <h3>📝 Signup Page</h3>
            <p>Registration form with password strength indicator and real-time validation</p>
          </DemoLink>

          <DemoLink to="/dashboard">
            <h3>🏠 Dashboard</h3>
            <p>Protected route that requires authentication (redirects to login)</p>
          </DemoLink>

          <DemoLink to="/">
            <h3>🌟 Landing Page</h3>
            <p>Updated landing page with navigation to auth pages</p>
          </DemoLink>
        </LinksGrid>

        <FeaturesList>
          <h4>✨ Key Features</h4>
          <ul>
            <li><strong>Modern Design:</strong> Glassmorphism effects, gradients, and smooth animations</li>
            <li><strong>Redux Integration:</strong> Centralized state management with RTK</li>
            <li><strong>Form Validation:</strong> Real-time validation with helpful error messages</li>
            <li><strong>Password Strength:</strong> Visual indicator for password complexity</li>
            <li><strong>Responsive Layout:</strong> Mobile-first design that works on all devices</li>
            <li><strong>Protected Routes:</strong> Automatic redirection for unauthenticated users</li>
            <li><strong>Clean Architecture:</strong> Organized components and proper separation of concerns</li>
          </ul>
        </FeaturesList>
      </DemoCard>
    </DemoContainer>
  );
};

export default AuthDemo;
