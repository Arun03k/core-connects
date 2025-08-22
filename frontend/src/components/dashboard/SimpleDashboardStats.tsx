import React from 'react';
import { Typography, Box } from '@mui/material';

interface SimpleStatsProps {
  stats: any;
  role: string;
}

const DashboardStats: React.FC<SimpleStatsProps> = ({ stats, role }) => {
  return (
    <Box>
      <Typography variant="h6">Dashboard Stats</Typography>
      <Typography>Role: {role}</Typography>
      <Typography>Tasks: {stats?.myTasks || 0}</Typography>
      <Typography>Employees: {stats?.totalEmployees || 0}</Typography>
    </Box>
  );
};

export default DashboardStats;
