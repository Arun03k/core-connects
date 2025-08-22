import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

interface SimpleActivityFeedProps {
  activities: any[];
  title?: string;
}

const ActivityFeed: React.FC<SimpleActivityFeedProps> = ({ activities, title = "Activity Feed" }) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <List>
        {activities.slice(0, 5).map((activity, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={activity.title}
              secondary={activity.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ActivityFeed;
