import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  DashboardStats,
  ActivityFeed,
  NotificationPanel,
  ProfileCard
} from '../components/dashboard';
import { useAuth } from '../contexts/useAuth';

interface DashboardData {
  stats: {
    totalEmployees: number;
    activeProjects: number;
    pendingTasks: number;
    completionRate: number;
  };
  recentActivity: Activity[];
  notifications: Notification[];
  userProfile: UserProfile;
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
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/dashboard');
        // const data = await response.json();
        
        // Mock data for now
        const mockData: DashboardData = {
          stats: {
            totalEmployees: 150,
            activeProjects: 8,
            pendingTasks: 12,
            completionRate: 85
          },
          recentActivity: [
            {
              id: '1',
              type: 'login',
              description: 'Successfully logged in',
              timestamp: new Date().toISOString(),
              status: 'success'
            },
            {
              id: '2',
              type: 'profile_update',
              description: 'Updated profile information',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: 'info'
            },
            {
              id: '3',
              type: 'task_completion',
              description: 'Completed project review task',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              status: 'success'
            }
          ],
          notifications: [
            {
              id: '1',
              title: 'Welcome to CoreConnect',
              message: 'Complete your profile to get started',
              type: 'info',
              timestamp: new Date().toISOString(),
              read: false
            },
            {
              id: '2',
              title: 'System Update',
              message: 'New features available in the dashboard',
              type: 'success',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              read: false
            }
          ],
          userProfile: {
            id: user?.id || '1',
            firstName: user?.firstName || 'John',
            lastName: user?.lastName || 'Doe',
            email: user?.email || 'john.doe@example.com',
            department: 'Engineering',
            position: 'Software Developer',
            completionPercentage: 75
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
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Unable to load dashboard data'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {dashboardData.userProfile.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your account today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileCard 
            profile={dashboardData.userProfile}
            onEditProfile={() => {
              // TODO: Navigate to profile editing
              console.log('Navigate to profile editing');
            }}
          />
        </Grid>

        {/* Stats Cards */}
        <Grid size={{ xs: 12, md: 8 }}>
          <DashboardStats stats={dashboardData.stats} />
        </Grid>

        {/* Activity Feed */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Recent Activity
            </Typography>
            <ActivityFeed activities={dashboardData.recentActivity} />
          </Paper>
        </Grid>

        {/* Notifications Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
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
        </Grid>

        {/* System Announcements */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              System Announcements
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              🎉 New dashboard features are now available! Explore your enhanced profile management tools.
            </Alert>
            <Alert severity="success">
              ✅ System maintenance completed successfully. All services are running normally.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
