import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Typography, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Assignment,
  EventNote,
  AccessTime,
  SystemUpdateAlt,
  Person,
  MoreVert,
  Refresh
} from '@mui/icons-material';
import { colors } from '../../theme/colors';
import type { ActivityItem } from '../../types/dashboard';

const ActivityContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ActivityList = styled(List)`
  max-height: 400px;
  overflow-y: auto;
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

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.border.dark};
  }
`;

const ActivityListItem = styled(ListItem)`
  padding: 0.75rem 0;
  align-items: flex-start;
  
  &:hover {
    background: ${colors.background.default};
    border-radius: 8px;
  }
`;

const TimeStamp = styled(Typography)`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  margin-top: 0.25rem;
`;

const StatusChip = styled(Chip)<{ status: string }>`
  height: 20px;
  font-size: 0.625rem;
  margin-top: 0.25rem;
`;

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
}

// Icon mapping for different activity types
const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'TASK':
      return Assignment;
    case 'LEAVE':
      return EventNote;
    case 'ATTENDANCE':
      return AccessTime;
    case 'SYSTEM':
      return SystemUpdateAlt;
    case 'PROFILE':
      return Person;
    default:
      return Assignment;
  }
};

// Color mapping for different activity types
const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'TASK':
      return colors.info[500];
    case 'LEAVE':
      return colors.warning[500];
    case 'ATTENDANCE':
      return colors.success[500];
    case 'SYSTEM':
      return colors.neutral[500];
    case 'PROFILE':
      return colors.primary[500];
    default:
      return colors.info[500];
  }
};

// Status chip color mapping
const getStatusColor = (status?: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'APPROVED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
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
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  title = "Recent Activity",
  maxItems = 10 
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <ActivityContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest updates and changes
          </Typography>
        </div>
        <div>
          <Tooltip title="Refresh">
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <Refresh sx={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Tooltip>
        </div>
      </Box>

      {displayedActivities.length > 0 ? (
        <ActivityList>
          {displayedActivities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);

            return (
              <React.Fragment key={activity.id}>
                <ActivityListItem>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${iconColor}15`,
                        color: iconColor,
                        width: 40,
                        height: 40
                      }}
                    >
                      <IconComponent fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <TimeStamp>
                            {formatTimestamp(activity.timestamp)}
                          </TimeStamp>
                          {activity.status && (
                            <StatusChip
                              label={activity.status.toLowerCase()}
                              color={getStatusColor(activity.status)}
                              status={activity.status}
                              size="small"
                            />
                          )}
                          {activity.priority && activity.priority !== 'LOW' && (
                            <StatusChip
                              label={activity.priority.toLowerCase()}
                              color={activity.priority === 'URGENT' ? 'error' : 'warning'}
                              status={activity.priority}
                              size="small"
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ActivityListItem>
                {index < displayedActivities.length - 1 && <Divider variant="inset" />}
              </React.Fragment>
            );
          })}
        </ActivityList>
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          py={4}
        >
          <Assignment sx={{ fontSize: 48, color: colors.neutral[400], mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            No recent activity
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Activity will appear here as you use the system
          </Typography>
        </Box>
      )}

      {activities.length > maxItems && (
        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Showing {maxItems} of {activities.length} activities
          </Typography>
        </Box>
      )}
    </ActivityContainer>
  );
};

export default ActivityFeed;
