import React from 'react';
import styled from 'styled-components';
import { 
  Typography, 
  Button,
  Box,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Assessment,
  Group,
  Settings,
  Add,
  CheckCircle,
  Schedule,
  Star,
  Security,
  Storage,
  MoreVert
} from '@mui/icons-material';
import { colors } from '../../theme/colors';
import type { QuickAction } from '../../types/dashboard';

const ActionsContainer = styled.div`
  width: 100%;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Button)<{ actionColor?: string }>`
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 8px;
  text-transform: none;
  background: ${props => props.actionColor || colors.background.default}15;
  border: 1px solid ${props => props.actionColor || colors.border.light};
  color: ${props => props.actionColor || colors.text.primary};
  transition: all 0.2s ease-in-out;
  height: auto;
  min-height: 60px;

  &:hover {
    background: ${props => props.actionColor || colors.primary[500]}25;
    border-color: ${props => props.actionColor || colors.primary[500]};
    transform: translateY(-1px);
  }

  .MuiButton-startIcon {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }
`;

const ActionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const ActionTitle = styled(Typography)`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
`;

const ActionDescription = styled(Typography)`
  font-size: 0.75rem;
  opacity: 0.7;
  line-height: 1.2;
  margin-top: 0.25rem;
`;

interface QuickActionsProps {
  actions: QuickAction[];
}

// Icon mapping
const iconMap: Record<string, React.ComponentType> = {
  CalendarIcon: CalendarToday,
  UserIcon: Person,
  DocumentIcon: Assessment,
  ClockIcon: Schedule,
  UserPlusIcon: Add,
  ChartBarIcon: Assessment,
  UsersIcon: Group,
  CheckIcon: CheckCircle,
  StarIcon: Star,
  CogIcon: Settings,
  ShieldIcon: Security,
  ServerIcon: Storage
};

const colorMap: Record<string, string> = {
  primary: colors.primary[500],
  secondary: colors.secondary[500],
  success: colors.success[500],
  error: colors.error[500],
  warning: colors.warning[500],
  info: colors.info[500]
};

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const handleActionClick = (action: QuickAction) => {
    // In a real app, this would use React Router or similar
    console.log('Navigate to:', action.link);
    
    // For demo purposes, show alert
    alert(`Navigation to ${action.title} (${action.link}) - This would use React Router in a real app`);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Assessment;
    return <IconComponent />;
  };

  const getColor = (colorName?: string) => {
    if (!colorName) return colors.primary[500];
    return colorMap[colorName] || colors.primary[500];
  };

  return (
    <ActionsContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Common tasks and shortcuts
          </Typography>
        </div>
        <Tooltip title="More actions">
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Tooltip>
      </Box>

      <ActionGrid>
        {actions.map((action) => (
          <Tooltip key={action.id} title={action.description}>
            <ActionButton
              startIcon={getIcon(action.icon)}
              actionColor={getColor(action.color)}
              onClick={() => handleActionClick(action)}
              fullWidth
            >
              <ActionContent>
                <ActionTitle>
                  {action.title}
                </ActionTitle>
                <ActionDescription>
                  {action.description}
                </ActionDescription>
              </ActionContent>
            </ActionButton>
          </Tooltip>
        ))}
      </ActionGrid>

      {actions.length === 0 && (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          py={4}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            No quick actions available
          </Typography>
        </Box>
      )}
    </ActionsContainer>
  );
};

export default QuickActions;
