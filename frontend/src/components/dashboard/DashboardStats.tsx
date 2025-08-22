import React from 'react';
import Grid from "@mui/material/Grid";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  useTheme
} from '@mui/material';
import {
  People,
  Assignment,
  PendingActions,
  TrendingUp
} from '@mui/icons-material';

interface Stats {
  totalEmployees: number;
  activeProjects: number;
  pendingTasks: number;
  completionRate: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  format?: 'number' | 'percentage';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  format = 'number' 
}) => {
  const theme = useTheme();
  
  const formatValue = (val: number | string) => {
    if (format === 'percentage') {
      return `${val}%`;
    }
    return typeof val === 'number' ? val.toLocaleString() : val;
  };

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        height: 120,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 56,
          height: 56,
          mr: 2
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography
          variant="h4"
          component="div"
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 0.5
          }}
        >
          {formatValue(value)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.9rem' }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const theme = useTheme();

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: <Assignment fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: <PendingActions fontSize="large" />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Completion Rate',
      value: stats.completionRate,
      icon: <TrendingUp fontSize="large" />,
      color: theme.palette.success.main,
      format: 'percentage' as const,
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;
