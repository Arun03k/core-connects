import React from 'react';
import styled from 'styled-components';
import { 
  Typography, 
  Grid, 
  Box, 
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Assignment,
  EventNote,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { colors } from '../../theme/colors';
import type { DashboardStats as StatsType } from '../../types/dashboard';

const StatsContainer = styled.div`
  width: 100%;
`;

const StatCard = styled(Box)`
  padding: 1rem;
  border-radius: 8px;
  background: ${colors.background.default};
  border: 1px solid ${colors.border.light};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: ${colors.primary[500]};
    transform: translateY(-1px);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color}15;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const TrendIcon = styled.div<{ trend: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => {
    switch (props.trend) {
      case 'up': return colors.success[500];
      case 'down': return colors.error[500];
      default: return colors.neutral[500];
    }
  }};
  font-size: 0.75rem;
`;

interface DashboardStatsProps {
  stats: StatsType;
  role: 'EMPLOYEE' | 'HR' | 'MANAGER' | 'ADMIN';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, role }) => {
  const getStatsForRole = () => {
    switch (role) {
      case 'HR':
        return [
          {
            title: 'Total Employees',
            value: stats.totalEmployees || 0,
            icon: People,
            color: colors.primary[500],
            trend: 'up',
            change: '+5.2%',
            description: 'Total workforce'
          },
          {
            title: 'Active Employees',
            value: stats.activeEmployees || 0,
            icon: CheckCircle,
            color: colors.success[500],
            trend: 'up',
            change: '+2.1%',
            description: 'Currently active'
          },
          {
            title: 'Pending Requests',
            value: stats.pendingRequests || 0,
            icon: EventNote,
            color: colors.warning[500],
            trend: 'down',
            change: '-1.3%',
            description: 'Awaiting approval'
          },
          {
            title: 'Leave Requests',
            value: stats.leaveRequests || 0,
            icon: Assignment,
            color: colors.info[500],
            trend: 'neutral',
            change: '0%',
            description: 'This month'
          }
        ];

      case 'MANAGER':
        return [
          {
            title: 'Team Size',
            value: stats.activeEmployees || 0,
            icon: People,
            color: colors.primary[500],
            trend: 'neutral',
            change: '0%',
            description: 'Direct reports'
          },
          {
            title: 'Completed Tasks',
            value: stats.completedTasks || 0,
            icon: CheckCircle,
            color: colors.success[500],
            trend: 'up',
            change: '+8.5%',
            description: 'This week'
          },
          {
            title: 'Pending Approvals',
            value: stats.pendingRequests || 0,
            icon: EventNote,
            color: colors.warning[500],
            trend: 'down',
            change: '-2.1%',
            description: 'Require action'
          },
          {
            title: 'Team Performance',
            value: '92%',
            icon: TrendingUp,
            color: colors.info[500],
            trend: 'up',
            change: '+3.2%',
            description: 'Average score'
          }
        ];

      case 'ADMIN':
        return [
          {
            title: 'System Users',
            value: stats.totalEmployees || 0,
            icon: People,
            color: colors.primary[500],
            trend: 'up',
            change: '+1.8%',
            description: 'Total registered'
          },
          {
            title: 'Active Sessions',
            value: stats.activeEmployees || 0,
            icon: CheckCircle,
            color: colors.success[500],
            trend: 'up',
            change: '+12.3%',
            description: 'Currently online'
          },
          {
            title: 'System Alerts',
            value: 3,
            icon: EventNote,
            color: colors.warning[500],
            trend: 'down',
            change: '-50%',
            description: 'Need attention'
          },
          {
            title: 'Uptime',
            value: '99.9%',
            icon: TrendingUp,
            color: colors.info[500],
            trend: 'up',
            change: '+0.1%',
            description: 'System health'
          }
        ];

      default: // EMPLOYEE
        return [
          {
            title: 'My Tasks',
            value: stats.myTasks || 0,
            icon: Assignment,
            color: colors.primary[500],
            trend: 'down',
            change: '-2',
            description: 'Active tasks'
          },
          {
            title: 'Completed Tasks',
            value: stats.completedTasks || 0,
            icon: CheckCircle,
            color: colors.success[500],
            trend: 'up',
            change: '+5',
            description: 'This month'
          },
          {
            title: 'Leave Balance',
            value: stats.myLeaveBalance || 0,
            icon: EventNote,
            color: colors.info[500],
            trend: 'down',
            change: '-2 days',
            description: 'Available days'
          },
          {
            title: 'Attendance',
            value: '98%',
            icon: TrendingUp,
            color: colors.warning[500],
            trend: 'up',
            change: '+1%',
            description: 'This month'
          }
        ];
    }
  };

  const statsData = getStatsForRole();

  return (
    <StatsContainer>
      <Box mb={2}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          {role === 'EMPLOYEE' ? 'My Overview' : 
           role === 'HR' ? 'HR Dashboard' : 
           role === 'MANAGER' ? 'Team Overview' : 'System Overview'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Key metrics and performance indicators
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={2}>
        {statsData.map((stat, index) => (
          <StatCard key={index}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <StatIcon color={stat.color}>
                  <stat.icon fontSize="small" />
                </StatIcon>
                <Tooltip title={stat.description}>
                  <IconButton size="small" sx={{ padding: 0 }}>
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontWeight: 'bold', mb: 0.5 }}
              >
                {stat.value}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontSize: '0.75rem' }}
              >
                {stat.title}
              </Typography>
              
              <TrendIcon trend={stat.trend}>
                {stat.trend === 'up' && <TrendingUp fontSize="inherit" />}
                {stat.trend === 'down' && <TrendingDown fontSize="inherit" />}
                <span>{stat.change}</span>
              </TrendIcon>

              {/* Progress bar for certain metrics */}
              {(stat.title.includes('Performance') || stat.title.includes('Uptime') || stat.title.includes('Attendance')) && (
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(stat.value.toString().replace('%', ''))} 
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              )}
            </StatCard>
          ))}
        )}
      </Box>
    </StatsContainer>
  );
};

export default DashboardStats;
