import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Box,
  Button,
  Chip,
  useTheme,
  Divider
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Info,
  Warning,
  CheckCircle,
  Error,
  Close,
  MarkEmailRead
} from '@mui/icons-material';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  maxItems?: number;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  maxItems = 5
}) => {
  const theme = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = notifications.slice(0, maxItems);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <Error sx={{ color: theme.palette.error.main }} />;
      case 'info':
      default:
        return <Info sx={{ color: theme.palette.info.main }} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Paper sx={{ p: 3, height: 'fit-content' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsActive color="primary" />
        </Badge>
        <Typography variant="h6" component="h2" sx={{ ml: 1, flexGrow: 1 }}>
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={onMarkAllAsRead}
            sx={{ fontSize: '0.75rem' }}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      {/* Notifications List */}
      {displayNotifications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Notifications sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
          <Typography variant="body2">
            No notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {displayNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 1.5,
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: notification.read ? 'action.hover' : 'action.selected',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.read ? 'normal' : 'bold',
                          color: 'text.primary',
                          flexGrow: 1,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip
                          label="New"
                          size="small"
                          color="primary"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            '& .MuiChip-label': {
                              px: 1,
                            }
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.85rem',
                          mt: 0.5,
                          mb: 0.5,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.disabled',
                          fontSize: '0.75rem',
                        }}
                      >
                        {formatTimestamp(notification.timestamp)}
                      </Typography>
                    </Box>
                  }
                  sx={{ my: 0 }}
                />
                
                {!notification.read && (
                  <IconButton
                    size="small"
                    onClick={() => onMarkAsRead(notification.id)}
                    sx={{ ml: 1 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
              {index < displayNotifications.length - 1 && (
                <Divider sx={{ my: 0.5 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* View More Link */}
      {notifications.length > maxItems && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Button
              size="small"
              variant="text"
              sx={{ fontSize: '0.875rem' }}
            >
              View All Notifications ({notifications.length})
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default NotificationPanel;
