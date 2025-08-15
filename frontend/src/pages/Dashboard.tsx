import React from 'react';
import styled from 'styled-components';
import { colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/thunks/authThunks';
import Button from '../components/common/Button';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.gradient.secondary};
  padding: 2rem;
`;

const Header = styled.header`
  background: ${colors.background.paper};
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeText = styled.div`
  h1 {
    color: ${colors.text.primary};
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }

  p {
    color: ${colors.text.secondary};
    margin: 0;
    font-size: 0.875rem;
  }
`;

const Content = styled.div`
  background: ${colors.background.paper};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const PlaceholderText = styled.h2`
  color: ${colors.text.secondary};
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
`;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <DashboardContainer>
      <Header>
        <WelcomeText>
          <h1>Welcome back, {user?.firstName || user?.username || 'User'}!</h1>
          <p>Here's what's happening with your team today.</p>
        </WelcomeText>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      
      <Content>
        <PlaceholderText>
          Dashboard content will be implemented here
        </PlaceholderText>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
