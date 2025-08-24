import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  Assignment,
  Group,
  Event,
  School,
  Schedule,
  Flag
} from '@mui/icons-material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  project: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'training' | 'holiday';
  date: string;
  time?: string;
  location?: string;
}

interface LearningModule {
  id: string;
  title: string;
  progress: number;
  completionDate?: string;
  category: string;
}

interface TimesheetEntry {
  id: string;
  date: string;
  hoursWorked: number;
  project: string;
  status: 'draft' | 'submitted' | 'approved';
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
}

interface EmployeeDashboardData {
  myTasks: Task[];
  teamMembers: TeamMember[];
  upcomingEvents: CalendarEvent[];
  learningProgress: LearningModule[];
  timesheet: TimesheetEntry[];
  goals: Goal[];
}

interface EmployeeStats {
  myProjects: number;
  completedTasks: number;
  upcomingDeadlines: number;
  teamSize: number;
  performanceScore: number;
  learningProgress: number;
  leaveBalance: number;
}

interface EmployeeOverviewProps {
  data?: EmployeeDashboardData;
  stats?: EmployeeStats;
  onRaiseTicket?: (payload: { title: string; message: string }) => void;
}

const EmployeeOverview: React.FC<EmployeeOverviewProps> = ({ data, stats, onRaiseTicket }) => {
  const theme = useTheme();

  const [ticketOpen, setTicketOpen] = React.useState(false);
  const [ticketTitle, setTicketTitle] = React.useState('');
  const [ticketMessage, setTicketMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const openTicket = () => setTicketOpen(true);
  const closeTicket = () => {
    setTicketOpen(false);
    setTicketTitle('');
    setTicketMessage('');
    setSubmitting(false);
  };

  const submitTicket = async () => {
    if (!ticketTitle || !ticketMessage) return;
    setSubmitting(true);
    try {
      onRaiseTicket?.({ title: ticketTitle, message: ticketMessage });
      closeTicket();
    } catch (err) {
      console.error('Failed to raise ticket', err);
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return theme.palette.info.main;
      case 'in_progress':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.success.main;
      case 'online':
        return theme.palette.success.main;
      case 'away':
        return theme.palette.warning.main;
      case 'offline':
        return theme.palette.grey[400];
      case 'approved':
        return theme.palette.success.main;
      case 'submitted':
        return theme.palette.info.main;
      case 'draft':
        return theme.palette.grey[500];
      default:
        return theme.palette.info.main;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return '🤝';
      case 'deadline':
        return '⏰';
      case 'training':
        return '🎓';
      case 'holiday':
        return '🏖️';
      default:
        return '📅';
    }
  };

  if (!data) {
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
            👤 Employee Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Employee dashboard data is loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

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
          👤 Employee Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Raise Support Ticket quick action */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button variant="outlined" startIcon={<SupportAgentIcon />} onClick={openTicket}>
                Report an Issue
              </Button>
            </Box>
          </Grid>
          {/* My Tasks */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                📋 My Tasks
              </Typography>
              
              <List dense>
                {data.myTasks.slice(0, 4).map((task) => (
                  <ListItem key={task.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getPriorityColor(task.priority), width: 32, height: 32 }}>
                        <Assignment fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {task.project} • Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={task.status.replace('_', ' ')}
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                background: alpha(getStatusColor(task.status), 0.1),
                                color: getStatusColor(task.status),
                                textTransform: 'capitalize'
                              }}
                            />
                            <Chip
                              size="small"
                              label={task.priority}
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                background: alpha(getPriorityColor(task.priority), 0.1),
                                color: getPriorityColor(task.priority)
                              }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Team Members */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                👥 Team Members
              </Typography>
              
              <List dense>
                {data.teamMembers.map((member) => (
                  <ListItem key={member.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar 
                        src={member.avatar}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          border: `2px solid ${getStatusColor(member.status)}`
                        }}
                      >
                        <Group fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {member.name}
                          </Typography>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: getStatusColor(member.status)
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {member.position} • {member.status}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Learning Progress */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.main, 0.1)})`,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                📚 Learning Progress
              </Typography>
              
              {data.learningProgress.map((module) => (
                <Box key={module.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {module.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={module.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: module.progress === 100 ? theme.palette.success.main :
                                      module.progress > 50 ? theme.palette.info.main :
                                      theme.palette.warning.main
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {module.category}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Goals */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.success.main, 0.1)})`,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                🎯 My Goals
              </Typography>
              
              {data.goals.map((goal) => (
                <Box key={goal.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {goal.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {goal.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: goal.progress === 100 ? theme.palette.success.main :
                                      goal.progress > 70 ? theme.palette.info.main :
                                      theme.palette.warning.main
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {goal.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Dialog open={ticketOpen} onClose={closeTicket} fullWidth maxWidth="sm">
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide a short title and a detailed description of the issue. Our admin team will review it.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Details"
              type="text"
              fullWidth
              multiline
              minRows={4}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeTicket} disabled={submitting}>Cancel</Button>
            <Button onClick={submitTicket} variant="contained" disabled={submitting || !ticketTitle || !ticketMessage}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeOverview;
