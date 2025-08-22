import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

interface AdminOverviewProps {
  data?: any;
  stats?: any;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ data, stats }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 3, 
            color: 'text.primary' 
          }}
        >
          ⚙️ Admin Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin dashboard features coming soon! This will include system monitoring, user management, security alerts, backup status, and system configuration.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdminOverview;
