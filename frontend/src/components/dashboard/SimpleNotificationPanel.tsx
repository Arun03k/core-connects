import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

interface SimpleNotificationPanelProps {
  notifications: any[];
  onClose: () => void;
}

const NotificationPanel: React.FC<SimpleNotificationPanelProps> = ({ notifications, onClose }) => {
  return (
    <Box p={2}>
      <Typography variant="h6">Notifications</Typography>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={notification.title}
              secondary={notification.message}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationPanel;
