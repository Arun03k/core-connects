import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Fade,
  Grow,
  useTheme,
  alpha
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  DashboardStats,
  ActivityFeed,
  NotificationPanel,
  ProfileCard,
  QuickActions,
  HROverview,
  EmployeeOverview,
  ManagerOverview,
  AdminOverview
} from '../components/dashboard';
import { useAppSelector } from '../store/hooks';

interface DashboardData {
  stats: RoleBasedStats;
  recentActivity: Activity[];
  notifications: Notification[];
  userProfile: UserProfile;
  
  // Role-specific data sections
  roleSpecificData: {
    hr?: HRDashboardData;
    employee?: EmployeeDashboardData;
    manager?: ManagerDashboardData;
    admin?: AdminDashboardData;
  };
  
  // Common widgets that appear for all roles
  commonWidgets: {
    quickActions: QuickAction[];
    upcomingEvents: Event[];
    systemHealth: SystemHealth;
  };
}

interface RoleBasedStats {
  // Common stats for all users
  common: {
    totalEmployees: number;
    activeProjects: number;
    pendingTasks: number;
    completionRate: number;
  };
  
  // Role-specific stats
  roleSpecific: {
    hr?: HRStats;
    employee?: EmployeeStats;
    manager?: ManagerStats;
    admin?: AdminStats;
  };
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

interface HRDashboardData {
  pendingApplications: HRApplication[];
  departmentOverview: DepartmentOverview[];
  recentHires: Employee[];
  performanceAlerts: PerformanceAlert[];
  recruitmentMetrics: RecruitmentMetrics;
  leaveRequests: LeaveRequest[];
}

interface EmployeeDashboardData {
  myTasks: Task[];
  teamMembers: TeamMember[];
  upcomingEvents: Event[];
  learningProgress: LearningModule[];
  timesheet: TimesheetEntry[];
  goals: Goal[];
}

interface ManagerDashboardData {
  teamOverview: TeamOverview;
  pendingApprovals: Approval[];
  teamTasks: Task[];
  budgetSummary: BudgetSummary;
  performanceInsights: PerformanceInsight[];
}

interface AdminDashboardData {
  systemMetrics: SystemMetrics;
  userActivity: UserActivity[];
  securityAlerts: SecurityAlert[];
  systemLogs: SystemLog[];
  licenseInfo: LicenseInfo;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
  color?: string;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastUpdate?: string;
}

interface RecruitmentMetrics {
  totalApplications: number;
  shortlistedCandidates: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiredThisMonth: number;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

interface TimesheetEntry {
  id: string;
  date: string;
  hoursWorked: number;
  project: string;
  status: 'draft' | 'submitted' | 'approved';
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
}

interface TeamOverview {
  totalMembers: number;
  activeProjects: number;
  completedTasks: number;
  avgPerformance: number;
  productivityTrend: number;
}

interface Approval {
  id: string;
  type: 'leave' | 'expense' | 'timesheet' | 'budget';
  requestor: string;
  amount?: number;
  description: string;
  requestDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetSummary {
  allocated: number;
  spent: number;
  remaining: number;
  utilizationRate: number;
}

interface PerformanceInsight {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  activeConnections: number;
}

interface UserActivity {
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

interface SecurityAlert {
  id: string;
  type: 'intrusion' | 'suspicious_activity' | 'failed_login' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
}

interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  module: string;
}

interface LicenseInfo {
  totalLicenses: number;
  usedLicenses: number;
  expiringLicenses: LicenseExpiry[];
  renewalDate: string;
}

interface LicenseExpiry {
  software: string;
  expiryDate: string;
  licensesAffected: number;
}

interface HRApplication {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  appliedDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface DepartmentOverview {
  id: string;
  name: string;
  employeeCount: number;
  budget: number;
  performance: number;
  openPositions: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  avatar?: string;
}

interface PerformanceAlert {
  id: string;
  employeeName: string;
  type: 'low_performance' | 'deadline_missed' | 'attendance_issue';
  severity: 'high' | 'medium' | 'low';
  description: string;
  date: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  project: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

interface Event {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'training' | 'holiday';
  date: string;
  time?: string;
  location?: string;
}

interface LearningModule {
  id: string;
  title: string;
  progress: number;
  completionDate?: string;
  category: string;
}

interface Activity {
  id: string;
  type: 'login' | 'profile_update' | 'task_completion' | 'file_upload';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
  completionPercentage: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Get user role from Redux store
  const userRole = user?.role?.toLowerCase() || 'employee';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API loading delay for smooth animation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call that includes role parameter
        // const response = await fetch(`/api/dashboard/${userRole}`);
        // const data = await response.json();
        
        // Enhanced mock data with role-based structure
        const mockData: DashboardData = {
          stats: {
            common: {
              totalEmployees: 1247,
              activeProjects: 24,
              pendingTasks: userRole === 'hr' ? 15 : userRole === 'manager' ? 8 : 5,
              completionRate: 94
            },
            roleSpecific: getRoleSpecificStats(userRole)
          },
          recentActivity: [
            {
              id: '1',
              type: 'login',
              description: 'Successfully logged in from Chrome Browser',
              timestamp: new Date().toISOString(),
              status: 'success'
            },
            {
              id: '2',
              type: 'profile_update',
              description: 'Updated profile picture and contact information',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              status: 'info'
            },
            {
              id: '3',
              type: 'task_completion',
              description: 'Completed quarterly project review task',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: 'success'
            },
            {
              id: '4',
              type: 'file_upload',
              description: 'Uploaded monthly report documents',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              status: 'success'
            },
            {
              id: '5',
              type: 'task_completion',
              description: 'Reviewed team performance metrics',
              timestamp: new Date(Date.now() - 10800000).toISOString(),
              status: 'info'
            }
          ],
          notifications: [
            {
              id: '1',
              title: 'Welcome to CoreConnect!',
              message: 'Complete your profile to unlock all features and get personalized recommendations',
              type: 'info',
              timestamp: new Date().toISOString(),
              read: false
            },
            {
              id: '2',
              title: 'New Dashboard Features',
              message: 'Check out our enhanced analytics and reporting tools now available',
              type: 'success',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: false
            },
            {
              id: '3',
              title: 'System Maintenance Scheduled',
              message: 'Planned maintenance window this weekend from 2-4 AM EST',
              type: 'warning',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              read: true
            },
            {
              id: '4',
              title: 'Team Meeting Reminder',
              message: 'Weekly standup meeting tomorrow at 10:00 AM in Conference Room A',
              type: 'info',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              read: false
            }
          ],
          userProfile: {
            id: user?.id || '1',
            firstName: user?.firstName || 'Alex',
            lastName: user?.lastName || 'Johnson',
            email: user?.email || 'alex.johnson@coreconnect.com',
            department: 'Product Engineering',
            position: 'Senior Software Developer',
            completionPercentage: 87
          },
          roleSpecificData: getRoleSpecificData(userRole),
          commonWidgets: {
            quickActions: getQuickActions(userRole),
            upcomingEvents: [],
            systemHealth: { status: 'healthy', uptime: 99.9 }
          }
        };
        
        setDashboardData(mockData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userRole]);

  // Helper functions for role-based data
  const getRoleSpecificStats = (role: string) => {
    switch (role) {
      case 'hr':
        return {
          hr: {
            newHires: 12,
            pendingLeaves: 8,
            performanceReviews: 23,
            departmentCount: 8,
            avgSalary: 75000,
            turnoverRate: 3.2,
            recruitmentPipeline: 45,
            complianceAlerts: 2
          }
        };
      case 'manager':
        return {
          manager: {
            teamMembers: 12,
            teamPerformance: 87,
            budgetUtilization: 78,
            projectsManaged: 5,
            pendingApprovals: 7,
            teamSatisfaction: 4.2
          }
        };
      case 'admin':
        return {
          admin: {
            systemUptime: 99.9,
            activeUsers: 234,
            securityAlerts: 3,
            backupStatus: 100,
            licenseUtilization: 78,
            supportTickets: 12
          }
        };
      default:
        return {
          employee: {
            myProjects: 3,
            completedTasks: 24,
            upcomingDeadlines: 5,
            teamSize: 8,
            performanceScore: 92,
            learningProgress: 67,
            leaveBalance: 18
          }
        };
    }
  };

  const getRoleSpecificData = (role: string) => {
    switch (role) {
      case 'hr':
        return {
          hr: {
            pendingApplications: [
              { id: '1', candidateName: 'John Smith', position: 'Software Engineer', department: 'Engineering', status: 'pending' as const, appliedDate: '2024-01-15', priority: 'high' as const },
              { id: '2', candidateName: 'Sarah Johnson', position: 'Product Manager', department: 'Product', status: 'reviewing' as const, appliedDate: '2024-01-14', priority: 'medium' as const }
            ],
            departmentOverview: [
              { id: '1', name: 'Engineering', employeeCount: 45, budget: 500000, performance: 92, openPositions: 3 },
              { id: '2', name: 'Product', employeeCount: 12, budget: 200000, performance: 88, openPositions: 1 }
            ],
            recentHires: [
              { id: '1', name: 'Alice Cooper', position: 'Frontend Developer', department: 'Engineering', startDate: '2024-01-10' }
            ],
            performanceAlerts: [
              { id: '1', employeeName: 'Bob Wilson', type: 'low_performance' as const, severity: 'medium' as const, description: 'Below target performance', date: '2024-01-12' }
            ],
            recruitmentMetrics: {
              totalApplications: 156,
              shortlistedCandidates: 23,
              interviewsScheduled: 12,
              offersExtended: 5,
              hiredThisMonth: 3
            },
            leaveRequests: [
              { id: '1', employeeName: 'John Doe', type: 'Annual Leave', startDate: '2024-02-01', endDate: '2024-02-05', status: 'pending' as const, days: 4 }
            ]
          }
        };
      case 'manager':
        return {
          manager: {
            teamOverview: {
              totalMembers: 12,
              activeProjects: 5,
              completedTasks: 89,
              avgPerformance: 87,
              productivityTrend: 5.2
            },
            pendingApprovals: [
              { id: '1', type: 'leave' as const, requestor: 'Jane Smith', description: 'Annual leave request', requestDate: '2024-01-10', priority: 'medium' as const }
            ],
            teamTasks: [
              { id: '1', title: 'Complete Q1 Review', description: 'Quarterly performance review', dueDate: '2024-02-01', priority: 'high' as const, status: 'in_progress' as const, project: 'HR Operations' }
            ],
            budgetSummary: {
              allocated: 100000,
              spent: 78000,
              remaining: 22000,
              utilizationRate: 78
            },
            performanceInsights: [
              { metric: 'Team Productivity', value: 87, trend: 'up' as const, description: 'Increased by 5% this month' }
            ]
          }
        };
      case 'admin':
        return {
          admin: {
            systemMetrics: {
              cpuUsage: 45,
              memoryUsage: 67,
              diskUsage: 23,
              networkTraffic: 234,
              activeConnections: 156
            },
            userActivity: [
              { userId: '1', userName: 'John Doe', action: 'Login', timestamp: new Date().toISOString(), ipAddress: '192.168.1.1' }
            ],
            securityAlerts: [
              { id: '1', type: 'failed_login' as const, severity: 'medium' as const, description: 'Multiple failed login attempts', timestamp: new Date().toISOString(), status: 'new' as const }
            ],
            systemLogs: [
              { id: '1', level: 'info' as const, message: 'System backup completed', timestamp: new Date().toISOString(), module: 'Backup Service' }
            ],
            licenseInfo: {
              totalLicenses: 100,
              usedLicenses: 78,
              expiringLicenses: [
                { software: 'Office 365', expiryDate: '2024-03-01', licensesAffected: 10 }
              ],
              renewalDate: '2024-12-31'
            }
          }
        };
      default:
        return {
          employee: {
            myTasks: [
              { id: '1', title: 'Complete project documentation', description: 'Update API documentation', dueDate: '2024-01-20', priority: 'high' as const, status: 'in_progress' as const, project: 'CoreConnect API' }
            ],
            teamMembers: [
              { id: '1', name: 'Sarah Johnson', position: 'Product Manager', status: 'online' as const }
            ],
            upcomingEvents: [
              { id: '1', title: 'Team Standup', type: 'meeting' as const, date: '2024-01-16', time: '10:00 AM' }
            ],
            learningProgress: [
              { id: '1', title: 'React Advanced Concepts', progress: 75, category: 'Frontend Development' }
            ],
            timesheet: [
              { id: '1', date: '2024-01-15', hoursWorked: 8, project: 'CoreConnect', status: 'submitted' as const }
            ],
            goals: [
              { id: '1', title: 'Complete Q1 Training', description: 'Finish all assigned training modules', progress: 60, deadline: '2024-03-31', category: 'Professional Development' }
            ]
          }
        };
    }
  };

  const getQuickActions = (role: string): QuickAction[] => {
    const actions = {
      hr: [
        { id: 'hire', label: 'Post New Job', icon: '👥', path: '/hr/jobs/new', color: 'primary' },
        { id: 'review', label: 'Review Applications', icon: '📋', path: '/hr/applications', color: 'info' },
        { id: 'reports', label: 'Generate Report', icon: '📊', path: '/hr/reports', color: 'success' },
        { id: 'policies', label: 'Update Policies', icon: '📝', path: '/hr/policies', color: 'warning' }
      ],
      manager: [
        { id: 'approve', label: 'Pending Approvals', icon: '✅', path: '/manager/approvals', color: 'error' },
        { id: 'team', label: 'Team Performance', icon: '👥', path: '/manager/team', color: 'primary' },
        { id: 'budget', label: 'Budget Review', icon: '💰', path: '/manager/budget', color: 'success' },
        { id: 'meeting', label: 'Schedule Meeting', icon: '📅', path: '/manager/meetings', color: 'info' }
      ],
      admin: [
        { id: 'users', label: 'Manage Users', icon: '👤', path: '/admin/users', color: 'primary' },
        { id: 'security', label: 'Security Dashboard', icon: '🔒', path: '/admin/security', color: 'error' },
        { id: 'system', label: 'System Health', icon: '⚙️', path: '/admin/system', color: 'info' },
        { id: 'backup', label: 'Data Backup', icon: '💾', path: '/admin/backup', color: 'success' }
      ],
      employee: [
        { id: 'tasks', label: 'My Tasks', icon: '📋', path: '/employee/tasks', color: 'primary' },
        { id: 'timesheet', label: 'Submit Timesheet', icon: '⏰', path: '/employee/timesheet', color: 'info' },
        { id: 'leave', label: 'Request Leave', icon: '🏖️', path: '/employee/leave', color: 'success' },
        { id: 'learning', label: 'Learning Hub', icon: '📚', path: '/employee/learning', color: 'warning' }
      ]
    };
    
    return actions[role] || actions.employee;
  };

  // Render role-specific dashboard sections
  const renderRoleSpecificContent = () => {
    if (!dashboardData) return null;

    switch (userRole) {
      case 'hr':
        return (
          <HROverview 
            data={dashboardData.roleSpecificData.hr} 
            stats={dashboardData.stats.roleSpecific.hr}
          />
        );
      case 'manager':
        return (
          <ManagerOverview 
            data={dashboardData.roleSpecificData.manager}
            stats={dashboardData.stats.roleSpecific.manager}
          />
        );
      case 'admin':
        return (
          <AdminOverview 
            data={dashboardData.roleSpecificData.admin}
            stats={dashboardData.stats.roleSpecific.admin}
          />
        );
      default:
        return (
          <EmployeeOverview 
            data={dashboardData.roleSpecificData.employee}
            stats={dashboardData.stats.roleSpecific.employee}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 3,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          }}
        >
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              mb: 3,
              '& .MuiCircularProgress-circle': {
                stroke: `url(#gradient)`,
              }
            }}
          />
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.palette.primary.main} />
                <stop offset="100%" stopColor={theme.palette.secondary.main} />
              </linearGradient>
            </defs>
          </svg>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Loading Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preparing your personalized experience...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '2rem'
              }
            }}
          >
            {error || 'Unable to load dashboard data'}
          </Alert>
        </Fade>
      </Container>
    );
  }

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 50%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Welcome Section */}
        <Fade in={mounted} timeout={1000}>
          <Box 
            mb={4}
            sx={{
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              {getGreeting()}, {dashboardData.userProfile.firstName}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                letterSpacing: 0.5
              }}
            >
              Welcome to your {userRole.toUpperCase()} dashboard. Here's your personalized overview for today.
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Enhanced Profile Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Grow in={mounted} timeout={1200}>
              <Box>
                <ProfileCard 
                  profile={dashboardData.userProfile}
                  onEditProfile={() => {
                    // TODO: Navigate to profile editing
                    console.log('Navigate to profile editing');
                  }}
                />
              </Box>
            </Grow>
          </Grid>

          {/* Enhanced Stats Cards */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Fade in={mounted} timeout={1400}>
              <Box>
                <DashboardStats 
                  commonStats={dashboardData.stats.common}
                  roleSpecificStats={dashboardData.stats.roleSpecific}
                  role={userRole}
                />
              </Box>
            </Fade>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12 }}>
            <Grow in={mounted} timeout={1600}>
              <Box>
                <QuickActions 
                  actions={dashboardData.commonWidgets.quickActions}
                  onActionClick={(action) => {
                    // TODO: Implement navigation
                    console.log(`Navigate to ${action.path}`);
                  }}
                />
              </Box>
            </Grow>
          </Grid>

          {/* Role-specific content section */}
          <Grid size={{ xs: 12 }}>
            <Grow in={mounted} timeout={1800}>
              <Box>
                {renderRoleSpecificContent()}
              </Box>
            </Grow>
          </Grid>

          {/* Enhanced Activity Feed */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Grow in={mounted} timeout={2000}>
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
                    📊 Recent Activity
                  </Typography>
                  <ActivityFeed activities={dashboardData.recentActivity} />
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Enhanced Notifications Panel */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Fade in={mounted} timeout={2200}>
              <Box>
                <NotificationPanel 
                  notifications={dashboardData.notifications}
                  onMarkAsRead={(notificationId) => {
                    // TODO: Implement mark as read functionality
                    console.log('Mark notification as read:', notificationId);
                  }}
                  onMarkAllAsRead={() => {
                    // TODO: Implement mark all as read functionality
                    console.log('Mark all notifications as read');
                  }}
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
