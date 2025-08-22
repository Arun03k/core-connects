import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, Box, Paper, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { 
  NotificationsOutlined, 
  SettingsOutlined, 
  AccountCircleOutlined,
  ExitToAppOutlined,
  MenuOutlined 
} from '@mui/icons-material';
import { colors } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/thunks/authThunks';
import { getDashboardConfig, getQuickActions } from '../../config/dashboardConfig';
import type { DashboardData, DashboardUser } from '../../types/dashboard';

// Import dashboard components
import DashboardStats from './SimpleDashboardStats';
import QuickActions from './SimpleQuickActions';
import ActivityFeed from './SimpleActivityFeed';
import NotificationPanel from './SimpleNotificationPanel';
import WelcomeHeader from './SimpleWelcomeHeader';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.gradient.secondary};
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  background: ${colors.background.paper};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  h1 {
    color: ${colors.primary[500]};
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const WidgetContainer = styled(Paper)`
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Transform user to DashboardUser type
  const dashboardUser: DashboardUser = {
    ...user,
    role: (user?.role as any) || 'EMPLOYEE',
    permissions: [], // This would come from API
  } as DashboardUser;

  const config = getDashboardConfig(dashboardUser.role);
  const quickActions = getQuickActions(dashboardUser.role, config.permissions);

  useEffect(() => {
    // Load dashboard data
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // This would be an API call in real implementation
      const mockData: DashboardData = {
        user: dashboardUser,
        stats: {
          totalEmployees: 150,
          activeEmployees: 142,
          pendingRequests: 8,
          completedTasks: 23,
          myTasks: 5,
          myLeaveBalance: 12,
        },
        recentActivity: [
          {
            id: '1',
            type: 'TASK',
            title: 'Task Completed',
            description: 'Project Alpha milestone completed',
            timestamp: new Date().toISOString(),
            status: 'COMPLETED'
          },
          {
            id: '2',
            type: 'LEAVE',
            title: 'Leave Approved',
            description: 'Annual leave request approved',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'APPROVED'
          }
        ],
        notifications: [
          {
            id: '1',
            type: 'INFO',
            title: 'System Update',
            message: 'New features available in dashboard',
            timestamp: new Date().toISOString(),
            read: false
          }
        ],
        quickActions,
        upcomingEvents: [],
        config
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuAnchor(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  if (!dashboardData) {
    return (
      <DashboardContainer>
        <TopBar>
          <Logo>
            <Typography variant="h6">CoreConnect</Typography>
          </Logo>
        </TopBar>
        <MainContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography>Loading dashboard...</Typography>
          </Box>
        </MainContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <TopBar>
        <Logo>
          <IconButton 
            color="primary"
            sx={{ display: { md: 'none' } }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuOutlined />
          </IconButton>
          <Typography variant="h6" component="h1">
            CoreConnect
          </Typography>
        </Logo>

        <TopBarActions>
          <IconButton 
            color="primary"
            onClick={handleNotificationClick}
            sx={{ position: 'relative' }}
          >
            <NotificationsOutlined />
            {dashboardData.notifications.filter(n => !n.read).length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  bgcolor: 'error.main',
                  borderRadius: '50%',
                }}
              />
            )}
          </IconButton>

          <UserInfo>
            <Typography variant="body2" color="text.secondary">
              {dashboardUser.firstName || dashboardUser.username || 'User'}
            </Typography>
            <Avatar 
              src={dashboardUser.avatar}
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={handleUserMenuClick}
            >
              {(dashboardUser.firstName?.[0] || dashboardUser.username?.[0] || 'U').toUpperCase()}
            </Avatar>
          </UserInfo>

          <IconButton 
            color="primary"
            onClick={handleUserMenuClick}
            sx={{ display: { md: 'none' } }}
          >
            <AccountCircleOutlined />
          </IconButton>
        </TopBarActions>
      </TopBar>

      <MainContent>
        <WelcomeHeader user={dashboardUser} stats={dashboardData.stats} />
        
        <DashboardGrid>
          {/* Stats Widget */}
          <WidgetContainer>
            <DashboardStats 
              stats={dashboardData.stats}
              role={dashboardUser.role}
            />
          </WidgetContainer>

          {/* Quick Actions Widget */}
          <WidgetContainer>
            <QuickActions actions={dashboardData.quickActions} />
          </WidgetContainer>

          {/* Activity Feed Widget */}
          <WidgetContainer sx={{ gridColumn: { md: 'span 2' } }}>
            <ActivityFeed 
              activities={dashboardData.recentActivity}
              title={dashboardUser.role === 'EMPLOYEE' ? 'My Recent Activity' : 'Recent Activity'}
            />
          </WidgetContainer>
        </DashboardGrid>

        {children}
      </MainContent>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <NotificationPanel 
          notifications={dashboardData.notifications}
          onClose={() => setNotificationAnchor(null)}
        />
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
      >
        <MenuItem onClick={() => setUserMenuAnchor(null)}>
          <AccountCircleOutlined sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => setUserMenuAnchor(null)}>
          <SettingsOutlined sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToAppOutlined sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </DashboardContainer>
  );
};

export default DashboardLayout;
