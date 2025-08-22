import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { colors } from '../../theme/colors';

interface SimpleWelcomeHeaderProps {
  user: any;
  stats: any;
}

const WelcomeHeader: React.FC<SimpleWelcomeHeaderProps> = ({ user, stats }) => {
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.lastName || user.username || 'User';
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: colors.background.paper }}>
      <Typography variant="h4">
        Welcome back, {getDisplayName()}!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Here's your dashboard overview.
      </Typography>
    </Paper>
  );
};

export default WelcomeHeader;
