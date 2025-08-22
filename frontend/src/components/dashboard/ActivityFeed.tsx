import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Typography,
  Box,
  useTheme,
  Divider,
  alpha,
  Fade,
  Button
} from '@mui/material';
import {
  Login,
  Person,
  CheckCircle,
  CloudUpload,
  Info,
  Warning,
  CheckCircleOutline,
  AccessTime
} from '@mui/icons-material';

interface Activity {
  id: string;
  type: 'login' | 'profile_update' | 'task_completion' | 'file_upload';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  maxItems = 10 
}) => {
  const theme = useTheme();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return <Login />;
      case 'profile_update':
        return <Person />;
      case 'task_completion':
        return <CheckCircle />;
      case 'file_upload':
        return <CloudUpload />;
      default:
        return <Info />;
    }
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutline fontSize="small" />;
      case 'warning':
        return <Warning fontSize="small" />;
      case 'info':
      default:
        return <Info fontSize="small" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
      default:
        return theme.palette.info.main;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  if (activities.length === 0) {
    return (
      <Fade in={true} timeout={800}>
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 6,
            color: 'text.secondary'
          }}
        >
          <AccessTime sx={{ fontSize: 64, opacity: 0.3, mb: 2, color: theme.palette.grey[400] }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            No Activity Yet
          </Typography>
          <Typography variant="body2">
            Your recent activities will appear here
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {displayActivities.map((activity, index) => (
        <Fade in={true} timeout={600 + index * 100} key={activity.id}>
          <Box>
            <ListItem 
              alignItems="flex-start"
              sx={{
                px: 0,
                py: 2.5,
                borderRadius: 2,
                mb: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.5),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  transform: 'translateX(8px)',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(getStatusColor(activity.status), 0.8)}, ${alpha(getStatusColor(activity.status), 0.6)})`,
                    width: 48,
                    height: 48,
                    boxShadow: `0 4px 12px ${alpha(getStatusColor(activity.status), 0.3)}`,
                    border: `2px solid ${alpha(getStatusColor(activity.status), 0.2)}`,
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                      fontSize: '1.4rem'
                    }
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      component="span"
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        flex: 1,
                        fontSize: '1rem'
                      }}
                    >
                      {activity.description}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(activity.status)}
                      label={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      size="small"
                      sx={{
                        height: 28,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha(getStatusColor(activity.status), 0.1)}, ${alpha(getStatusColor(activity.status), 0.05)})`,
                        border: `1px solid ${alpha(getStatusColor(activity.status), 0.3)}`,
                        color: getStatusColor(activity.status),
                        '& .MuiChip-icon': {
                          color: getStatusColor(activity.status),
                        }
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: '1rem', color: 'text.disabled' }} />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      {formatTimestamp(activity.timestamp)}
                    </Typography>
                  </Box>
                }
                sx={{ my: 0 }}
              />
            </ListItem>
          </Box>
        </Fade>
      ))}
      
      {activities.length > maxItems && (
        <Fade in={true} timeout={1000}>
          <Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="outlined"
                size="medium"
                sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                View All {activities.length} Activities
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </List>
  );
};

export default ActivityFeed;
