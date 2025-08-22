import React from 'react';
import Grid from "@mui/material/Grid";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  useTheme,
  Card,
  CardContent,
  alpha,
  LinearProgress,
  Grow
} from '@mui/material';
import {
  People,
  Assignment,
  PendingActions,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  PersonAdd,
  BeachAccess,
  Assessment,
  Business,
  AttachMoney,
  TrendingDown,
  AccountTree,
  Warning,
  Work,
  Schedule,
  Group,
  Star,
  School,
  Timer,
  SupervisorAccount,
  MonetizationOn,
  Approval,
  SentimentSatisfied,
  Computer,
  Security,
  Backup,
  Support
} from '@mui/icons-material';

interface CommonStats {
  totalEmployees: number;
  activeProjects: number;
  pendingTasks: number;
  completionRate: number;
}

interface HRStats {
  newHires: number;
  pendingLeaves: number;
  performanceReviews: number;
  departmentCount: number;
  avgSalary: number;
  turnoverRate: number;
  recruitmentPipeline: number;
  complianceAlerts: number;
}

interface EmployeeStats {
  myProjects: number;
  completedTasks: number;
  upcomingDeadlines: number;
  teamSize: number;
  performanceScore: number;
  learningProgress: number;
  leaveBalance: number;
}

interface ManagerStats {
  teamMembers: number;
  teamPerformance: number;
  budgetUtilization: number;
  projectsManaged: number;
  pendingApprovals: number;
  teamSatisfaction: number;
}

interface AdminStats {
  systemUptime: number;
  activeUsers: number;
  securityAlerts: number;
  backupStatus: number;
  licenseUtilization: number;
  supportTickets: number;
}

interface RoleSpecificStats {
  hr?: HRStats;
  employee?: EmployeeStats;
  manager?: ManagerStats;
  admin?: AdminStats;
}

interface DashboardStatsProps {
  commonStats: CommonStats;
  roleSpecificStats: RoleSpecificStats;
  role: string;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  format?: 'number' | 'percentage' | 'currency';
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  format = 'number',
  trend,
  index
}) => {
  const theme = useTheme();
  
  const formatValue = (val: number | string) => {
    if (format === 'percentage') {
      return `${val}%`;
    }
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Number(val));
    }
    return typeof val === 'number' ? val.toLocaleString() : val;
  };

  return (
    <Grow in={true} timeout={800 + index * 200}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 20px 40px ${alpha(color, 0.15)}`,
            '& .icon-container': {
              transform: 'scale(1.1) rotate(5deg)',
            },
            '& .progress-bar': {
              transform: 'scaleX(1)',
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
          }
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  fontWeight: 500,
                  mb: 1,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                {title}
              </Typography>
              
              <Typography
                variant="h3"
                component="div"
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2.25rem' }
                }}
              >
                {formatValue(value)}
              </Typography>

              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {trend.direction === 'up' ? (
                    <ArrowUpward sx={{ fontSize: '1rem', color: 'success.main' }} />
                  ) : (
                    <ArrowDownward sx={{ fontSize: '1rem', color: 'error.main' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: trend.direction === 'up' ? 'success.main' : 'error.main',
                      fontWeight: 600
                    }}
                  >
                    {trend.value}% {trend.label}
                  </Typography>
                </Box>
              )}
            </Box>

            <Avatar
              className="icon-container"
              sx={{
                bgcolor: alpha(color, 0.15),
                border: `2px solid ${alpha(color, 0.3)}`,
                width: 64,
                height: 64,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiSvgIcon-root': {
                  fontSize: '2rem',
                  color: color
                }
              }}
            >
              {icon}
            </Avatar>
          </Box>

          {/* Animated progress indicator */}
          <LinearProgress
            className="progress-bar"
            variant="determinate"
            value={format === 'percentage' ? Number(value) : 85}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: `${index * 0.2}s`,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
              }
            }}
          />
        </CardContent>
      </Card>
    </Grow>
  );
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ commonStats, roleSpecificStats, role }) => {
  const theme = useTheme();

  // Common stats cards that appear for all roles
  const commonStatCards = [
    {
      title: 'Total Employees',
      value: commonStats.totalEmployees,
      icon: <People fontSize="large" />,
      color: theme.palette.primary.main,
      trend: {
        value: 12,
        direction: 'up' as const,
        label: 'this month'
      }
    },
    {
      title: 'Active Projects',
      value: commonStats.activeProjects,
      icon: <Assignment fontSize="large" />,
      color: theme.palette.secondary.main,
      trend: {
        value: 8,
        direction: 'up' as const,
        label: 'this week'
      }
    },
    {
      title: 'Pending Tasks',
      value: commonStats.pendingTasks,
      icon: <PendingActions fontSize="large" />,
      color: theme.palette.warning.main,
      trend: {
        value: 15,
        direction: 'down' as const,
        label: 'from last week'
      }
    },
    {
      title: 'Completion Rate',
      value: commonStats.completionRate,
      icon: <TrendingUp fontSize="large" />,
      color: theme.palette.success.main,
      format: 'percentage' as const,
      trend: {
        value: 5,
        direction: 'up' as const,
        label: 'this quarter'
      }
    },
  ];

  // Role-specific stats cards
  const getRoleSpecificCards = () => {
    switch (role) {
      case 'hr':
        const hrStats = roleSpecificStats.hr;
        if (!hrStats) return [];
        return [
          {
            title: 'New Hires',
            value: hrStats.newHires,
            icon: <PersonAdd fontSize="large" />,
            color: theme.palette.info.main,
            trend: { value: 8, direction: 'up' as const, label: 'this month' }
          },
          {
            title: 'Pending Leaves',
            value: hrStats.pendingLeaves,
            icon: <BeachAccess fontSize="large" />,
            color: theme.palette.warning.main,
            trend: { value: 3, direction: 'down' as const, label: 'this week' }
          },
          {
            title: 'Performance Reviews',
            value: hrStats.performanceReviews,
            icon: <Assessment fontSize="large" />,
            color: theme.palette.secondary.main,
            trend: { value: 12, direction: 'up' as const, label: 'completed' }
          },
          {
            title: 'Average Salary',
            value: hrStats.avgSalary,
            icon: <AttachMoney fontSize="large" />,
            color: theme.palette.success.main,
            format: 'currency' as const,
            trend: { value: 5, direction: 'up' as const, label: 'vs last year' }
          }
        ];
      case 'manager':
        const managerStats = roleSpecificStats.manager;
        if (!managerStats) return [];
        return [
          {
            title: 'Team Members',
            value: managerStats.teamMembers,
            icon: <Group fontSize="large" />,
            color: theme.palette.primary.main,
            trend: { value: 2, direction: 'up' as const, label: 'new hires' }
          },
          {
            title: 'Team Performance',
            value: managerStats.teamPerformance,
            icon: <Star fontSize="large" />,
            color: theme.palette.success.main,
            format: 'percentage' as const,
            trend: { value: 8, direction: 'up' as const, label: 'this month' }
          },
          {
            title: 'Budget Utilization',
            value: managerStats.budgetUtilization,
            icon: <MonetizationOn fontSize="large" />,
            color: theme.palette.info.main,
            format: 'percentage' as const,
            trend: { value: 5, direction: 'up' as const, label: 'this quarter' }
          },
          {
            title: 'Pending Approvals',
            value: managerStats.pendingApprovals,
            icon: <Approval fontSize="large" />,
            color: theme.palette.warning.main,
            trend: { value: 10, direction: 'down' as const, label: 'this week' }
          }
        ];
      case 'admin':
        const adminStats = roleSpecificStats.admin;
        if (!adminStats) return [];
        return [
          {
            title: 'System Uptime',
            value: adminStats.systemUptime,
            icon: <Computer fontSize="large" />,
            color: theme.palette.success.main,
            format: 'percentage' as const,
            trend: { value: 0.1, direction: 'up' as const, label: 'this month' }
          },
          {
            title: 'Active Users',
            value: adminStats.activeUsers,
            icon: <People fontSize="large" />,
            color: theme.palette.primary.main,
            trend: { value: 15, direction: 'up' as const, label: 'this week' }
          },
          {
            title: 'Security Alerts',
            value: adminStats.securityAlerts,
            icon: <Security fontSize="large" />,
            color: theme.palette.error.main,
            trend: { value: 20, direction: 'down' as const, label: 'this month' }
          },
          {
            title: 'Support Tickets',
            value: adminStats.supportTickets,
            icon: <Support fontSize="large" />,
            color: theme.palette.info.main,
            trend: { value: 8, direction: 'down' as const, label: 'this week' }
          }
        ];
      default: // employee
        const employeeStats = roleSpecificStats.employee;
        if (!employeeStats) return [];
        return [
          {
            title: 'My Projects',
            value: employeeStats.myProjects,
            icon: <Work fontSize="large" />,
            color: theme.palette.primary.main,
            trend: { value: 1, direction: 'up' as const, label: 'new project' }
          },
          {
            title: 'Completed Tasks',
            value: employeeStats.completedTasks,
            icon: <Assignment fontSize="large" />,
            color: theme.palette.success.main,
            trend: { value: 12, direction: 'up' as const, label: 'this week' }
          },
          {
            title: 'Performance Score',
            value: employeeStats.performanceScore,
            icon: <Star fontSize="large" />,
            color: theme.palette.info.main,
            format: 'percentage' as const,
            trend: { value: 5, direction: 'up' as const, label: 'this quarter' }
          },
          {
            title: 'Leave Balance',
            value: employeeStats.leaveBalance,
            icon: <BeachAccess fontSize="large" />,
            color: theme.palette.secondary.main,
            trend: { value: 2, direction: 'down' as const, label: 'days used' }
          }
        ];
    }
  };

  const roleSpecificCards = getRoleSpecificCards();
  const allStatCards = [...commonStatCards, ...roleSpecificCards];

  return (
    <Box>
      {/* Common Stats Section */}
      <Typography 
        variant="h6" 
        component="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          mb: 3,
          color: 'text.primary'
        }}
      >
        📊 Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {commonStatCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <StatCard {...stat} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Role-Specific Stats Section */}
      {roleSpecificCards.length > 0 && (
        <>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: 'text.primary',
              textTransform: 'capitalize'
            }}
          >
            {role === 'hr' ? '🏢 HR' : role === 'admin' ? '⚙️ System' : role === 'manager' ? '👔 Management' : '👤 Personal'} Metrics
          </Typography>
          <Grid container spacing={3}>
            {roleSpecificCards.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index + commonStatCards.length}>
                <StatCard {...stat} index={index + commonStatCards.length} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardStats;
