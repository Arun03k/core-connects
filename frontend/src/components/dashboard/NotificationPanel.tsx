import React from 'react';
import styled from 'styled-components';
import { 
  Typography, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import {
  Info,
  Warning,
  Error,
  CheckCircle,
  Close,
  MarkEmailRead,
  Settings
} from '@mui/icons-material';
import { colors } from '../../theme/colors';
import type { NotificationItem } from '../../types/dashboard';

const NotificationContainer = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationList = styled(List)`
  padding: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.background.default};
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.border.medium};
    border-radius: 3px;
  }
`;

const NotificationListItem = styled(ListItem)<{ read: boolean }>`
  background: ${props => props.read ? 'transparent' : colors.primary[50]};
  border-left: ${props => props.read ? 'none' : `3px solid ${colors.primary[500]}`};
  opacity: ${props => props.read ? 0.7 : 1};
  align-items: flex-start;
  padding: 0.75rem 1rem;

  &:hover {
    background: ${colors.background.default};
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${colors.border.light};
`;

const NotificationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid ${colors.border.light};
  background: ${colors.background.default};
`;

const TimeStamp = styled(Typography)`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  margin-top: 0.25rem;
`;

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

// Icon mapping for different notification types
const getNotificationIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'INFO':
      return Info;
    case 'WARNING':
      return Warning;
    case 'ERROR':
      return Error;
    case 'SUCCESS':
      return CheckCircle;
    default:
      return Info;
  }
};

// Color mapping for different notification types
const getNotificationColor = (type: NotificationItem['type']) => {
  switch (type) {
    case 'INFO':
      return colors.info[500];
    case 'WARNING':
      return colors.warning[500];
    case 'ERROR':
      return colors.error[500];
    case 'SUCCESS':
      return colors.success[500];
    default:
      return colors.info[500];
  }
};

// Format timestamp
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}h ago`;
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  notifications, 
  onClose,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to link if provided
    if (notification.link) {
      console.log('Navigate to:', notification.link);
      onClose();
    }
  };

  return (
    <NotificationContainer>
      <NotificationHeader>
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="primary">
              {unreadCount} unread
            </Typography>
          )}
        </div>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </NotificationHeader>

      {notifications.length > 0 ? (
        <>
          <NotificationList>
            {notifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);

              return (
                <React.Fragment key={notification.id}>
                  <NotificationListItem 
                    read={notification.read}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{ cursor: notification.link ? 'pointer' : 'default' }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${iconColor}15`,
                          color: iconColor,
                          width: 36,
                          height: 36
                        }}
                      >
                        <IconComponent fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: notification.read ? 400 : 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {notification.message}
                          </Typography>
                          <TimeStamp>
                            {formatTimestamp(notification.timestamp)}
                          </TimeStamp>
                        </Box>
                      }
                    />
                    {!notification.read && (
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        <MarkEmailRead fontSize="small" />
                      </IconButton>
                    )}
                  </NotificationListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </NotificationList>

          <NotificationFooter>
            {unreadCount > 0 ? (
              <Button 
                size="small" 
                onClick={handleMarkAllAsRead}
                startIcon={<MarkEmailRead />}
              >
                Mark all read
              </Button>
            ) : (
              <Typography variant="caption" color="text.secondary">
                All caught up!
              </Typography>
            )}
            <Button 
              size="small"
              startIcon={<Settings />}
              onClick={() => {
                console.log('Navigate to notification settings');
                onClose();
              }}
            >
              Settings
            </Button>
          </NotificationFooter>
        </>
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          py={4}
        >
          <CheckCircle sx={{ fontSize: 48, color: colors.neutral[400], mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            No notifications
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            You're all caught up!
          </Typography>
        </Box>
      )}
    </NotificationContainer>
  );
};

export default NotificationPanel;
