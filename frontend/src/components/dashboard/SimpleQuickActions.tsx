import React from 'react';
import { Typography, Box, Button } from '@mui/material';

interface SimpleQuickActionsProps {
  actions: any[];
}

const QuickActions: React.FC<SimpleQuickActionsProps> = ({ actions }) => {
  return (
    <Box>
      <Typography variant="h6">Quick Actions</Typography>
      {actions.map((action, index) => (
        <Button key={index} variant="outlined" sx={{ m: 0.5 }}>
          {action.title}
        </Button>
      ))}
    </Box>
  );
};

export default QuickActions;
