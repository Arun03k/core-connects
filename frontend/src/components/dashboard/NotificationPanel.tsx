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
  Divider,
  Card,
  CardContent,
  alpha,
  Fade,
  Grow
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Info,
  Warning,
  CheckCircle,
  Error,
  Close,
  MarkEmailRead,
  NotificationsNone
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
    <Grow in={true} timeout={1000}>
      <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
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
        <CardContent sx={{ p: 3 }}>
          {/* Enhanced Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  minWidth: 20,
                  height: 20,
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      opacity: 0.8,
                    },
                    '100%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                  }
                }
              }}
            >
              <NotificationsActive 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: '1.5rem'
                }} 
              />
            </Badge>
            <Typography variant="h6" component="h2" sx={{ ml: 2, flexGrow: 1, fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkEmailRead />}
                onClick={onMarkAllAsRead}
                sx={{ 
                  fontSize: '0.75rem',
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                Clear All
              </Button>
            )}
          </Box>

          {/* Enhanced Notifications List */}
          {displayNotifications.length === 0 ? (
            <Fade in={true} timeout={800}>
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <NotificationsNone 
                  sx={{ 
                    fontSize: 64, 
                    opacity: 0.3, 
                    mb: 2,
                    color: theme.palette.grey[400]
                  }} 
                />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                  All caught up!
                </Typography>
                <Typography variant="body2">
                  No new notifications to display
                </Typography>
              </Box>
            </Fade>
          ) : (
            <List sx={{ p: 0 }}>
              {displayNotifications.map((notification, index) => (
                <Fade in={true} timeout={800 + index * 100} key={notification.id}>
                  <Box>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.03),
                        borderRadius: 2,
                        mb: 1,
                        border: notification.read 
                          ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
                          : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: notification.read 
                            ? alpha(theme.palette.action.hover, 0.5) 
                            : alpha(theme.palette.primary.main, 0.08),
                          transform: 'translateX(4px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette[notification.type]?.main || theme.palette.info.main, 0.1)}, ${alpha(theme.palette[notification.type]?.main || theme.palette.info.main, 0.2)})`,
                            border: `2px solid ${alpha(theme.palette[notification.type]?.main || theme.palette.info.main, 0.3)}`
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Box>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: notification.read ? 500 : 700,
                                color: 'text.primary',
                                flexGrow: 1,
                                fontSize: '0.95rem'
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip
                                label="New"
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                  color: 'white',
                                  '& .MuiChip-label': {
                                    px: 1.5,
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
                                mb: 1,
                                lineHeight: 1.4
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.disabled',
                                fontSize: '0.75rem',
                                fontWeight: 500
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
                          sx={{ 
                            ml: 1,
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              color: theme.palette.error.main,
                            }
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  </Box>
                </Fade>
              ))}
            </List>
          )}

          {/* Enhanced View More Link */}
          {notifications.length > maxItems && (
            <>
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
                    py: 1
                  }}
                >
                  View All {notifications.length} Notifications
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

export default NotificationPanel;
