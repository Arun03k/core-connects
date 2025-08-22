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
  Divider
} from '@mui/material';
import {
  Login,
  Person,
  CheckCircle,
  CloudUpload,
  Info,
  Warning,
  CheckCircleOutline
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
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 4,
          color: 'text.secondary' 
        }}
      >
        <Typography variant="body2">
          No recent activity to display
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {displayActivities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem 
            alignItems="flex-start"
            sx={{
              px: 0,
              py: 1.5,
              '&:hover': {
                bgcolor: 'action.hover',
                borderRadius: 1,
              }
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: getStatusColor(activity.status),
                  width: 40,
                  height: 40,
                }}
              >
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ 
                      fontWeight: 'medium',
                      color: 'text.primary',
                    }}
                  >
                    {activity.description}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(activity.status)}
                    label={activity.status}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      borderColor: getStatusColor(activity.status),
                      color: getStatusColor(activity.status),
                      '& .MuiChip-icon': {
                        color: getStatusColor(activity.status),
                      }
                    }}
                  />
                </Box>
              }
              secondary={
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {formatTimestamp(activity.timestamp)}
                </Typography>
              }
              sx={{ my: 0 }}
            />
          </ListItem>
          {index < displayActivities.length - 1 && (
            <Divider 
              variant="inset" 
              component="li" 
              sx={{ ml: '56px' }}
            />
          )}
        </React.Fragment>
      ))}
      
      {activities.length > maxItems && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Typography 
              variant="body2" 
              color="primary"
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              View {activities.length - maxItems} more activities
            </Typography>
          </Box>
        </>
      )}
    </List>
  );
};

export default ActivityFeed;
