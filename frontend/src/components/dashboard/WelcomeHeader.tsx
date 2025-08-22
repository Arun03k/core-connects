import React from 'react';
import styled from 'styled-components';
import { Typography, Box, Chip } from '@mui/material';
import { colors } from '../../theme/colors';
import type { DashboardUser, DashboardStats } from '../../types/dashboard';

const HeaderContainer = styled.div`
  background: ${colors.background.paper};
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
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

const StatsPreview = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

interface WelcomeHeaderProps {
  user: DashboardUser;
  stats: DashboardStats;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user, stats }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.lastName || user.username || 'User';
  };

  const getRoleMessage = () => {
    switch (user.role) {
      case 'HR':
        return "Here's your HR overview for today.";
      case 'MANAGER':
        return "Here's your team overview for today.";
      case 'ADMIN':
        return "Here's your system overview for today.";
      default:
        return "Here's your dashboard for today.";
    }
  };

  const getRelevantStats = () => {
    switch (user.role) {
      case 'HR':
        return [
          { label: 'Total Employees', value: stats.totalEmployees || 0, color: 'primary' },
          { label: 'Pending Requests', value: stats.pendingRequests || 0, color: 'warning' },
          { label: 'Active Employees', value: stats.activeEmployees || 0, color: 'success' }
        ];
      case 'MANAGER':
        return [
          { label: 'Team Tasks', value: stats.completedTasks || 0, color: 'info' },
          { label: 'Pending Approvals', value: stats.pendingRequests || 0, color: 'warning' },
          { label: 'Active Members', value: stats.activeEmployees || 0, color: 'success' }
        ];
      case 'ADMIN':
        return [
          { label: 'System Users', value: stats.totalEmployees || 0, color: 'primary' },
          { label: 'Active Sessions', value: stats.activeEmployees || 0, color: 'success' },
          { label: 'System Health', value: '99%', color: 'success' }
        ];
      default:
        return [
          { label: 'My Tasks', value: stats.myTasks || 0, color: 'info' },
          { label: 'Leave Balance', value: stats.myLeaveBalance || 0, color: 'primary' },
          { label: 'Completed', value: stats.completedTasks || 0, color: 'success' }
        ];
    }
  };

  return (
    <HeaderContainer>
      <WelcomeText>
        <Typography variant="h4" component="h1">
          {getGreeting()}, {getDisplayName()}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getRoleMessage()}
        </Typography>
        <Box mt={1}>
          <Chip 
            label={user.role.toLowerCase()} 
            size="small" 
            variant="outlined" 
            color="primary"
          />
        </Box>
      </WelcomeText>
      
      <StatsPreview>
        {getRelevantStats().map((stat, index) => (
          <Box key={index} textAlign="center">
            <Typography 
              variant="h6" 
              component="div" 
              color={`${stat.color}.main`}
              sx={{ fontWeight: 'bold' }}
            >
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
          </Box>
        ))}
      </StatsPreview>
    </HeaderContainer>
  );
};

export default WelcomeHeader;
