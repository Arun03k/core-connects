import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Grow
} from '@mui/material';
import Grid from "@mui/material/Grid";

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
  color?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  actions, 
  onActionClick 
}) => {
  const theme = useTheme();

  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      // Default navigation behavior
      console.log(`Navigate to ${action.path}`);
    }
  };

  const getActionColor = (colorName?: string) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
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
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary'
          }}
        >
          ⚡ Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => {
            const actionColor = getActionColor(action.color);
            
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.id}>
                <Grow in={true} timeout={600 + index * 100}>
                  <Card
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: `linear-gradient(135deg, ${alpha(actionColor, 0.05)}, ${alpha(actionColor, 0.1)})`,
                      border: `1px solid ${alpha(actionColor, 0.15)}`,
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.02)',
                        boxShadow: `0 16px 32px ${alpha(actionColor, 0.2)}`,
                        background: `linear-gradient(135deg, ${alpha(actionColor, 0.1)}, ${alpha(actionColor, 0.15)})`,
                        '& .action-icon': {
                          transform: 'scale(1.2) rotate(5deg)',
                        },
                        '&::before': {
                          transform: 'scaleX(1)',
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: `linear-gradient(90deg, ${actionColor}, ${alpha(actionColor, 0.7)})`,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }
                    }}
                    onClick={() => handleActionClick(action)}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h3" 
                        className="action-icon"
                        sx={{ 
                          mb: 2,
                          fontSize: '2.5rem',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'inline-block'
                        }}
                      >
                        {action.icon}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          lineHeight: 1.3
                        }}
                      >
                        {action.label}
                      </Typography>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
