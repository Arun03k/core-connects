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
  PersonAdd,
  Business,
  TrendingUp,
  Warning,
  Assessment
} from '@mui/icons-material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface HRApplication {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  appliedDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface DepartmentOverview {
  id: string;
  name: string;
  employeeCount: number;
  budget: number;
  performance: number;
  openPositions: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  avatar?: string;
}

interface PerformanceAlert {
  id: string;
  employeeName: string;
  type: 'low_performance' | 'deadline_missed' | 'attendance_issue';
  severity: 'high' | 'medium' | 'low';
  description: string;
  date: string;
}

interface RecruitmentMetrics {
  totalApplications: number;
  shortlistedCandidates: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiredThisMonth: number;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

interface HRDashboardData {
  pendingApplications: HRApplication[];
  departmentOverview: DepartmentOverview[];
  recentHires: Employee[];
  performanceAlerts: PerformanceAlert[];
  recruitmentMetrics: RecruitmentMetrics;
  leaveRequests: LeaveRequest[];
}

interface HRStats {
  newHires: number;
  pendingLeaves: number;
  performanceReviews: number;
  departmentCount: number;
  avgSalary: number;
  turnoverRate: number;
  recruitmentPipeline: number;
  complianceAlerts: number;
}

interface HROverviewProps {
  data?: HRDashboardData;
  stats?: HRStats;
  onRaiseTicket?: (payload: { title: string; message: string }) => void;
}

const HROverview: React.FC<HROverviewProps> = ({ data, stats, onRaiseTicket }) => {
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
  // call parent handler if provided
  onRaiseTicket?.({ title: ticketTitle, message: ticketMessage });
  closeTicket();
    } catch (err) {
      console.error('Failed to raise ticket', err);
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string, severity?: string) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'approved':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      case 'reviewing':
        return theme.palette.info.main;
      default:
        if (severity === 'high') return theme.palette.error.main;
        if (severity === 'medium') return theme.palette.warning.main;
        return theme.palette.info.main;
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
            🏢 HR Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            HR dashboard data is loading...
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
          🏢 HR Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Support ticket quick action area */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button variant="outlined" startIcon={<SupportAgentIcon />} onClick={openTicket}>
                Report an Issue
              </Button>
            </Box>
          </Grid>
          {/* Recruitment Metrics */}
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
                📊 Recruitment Pipeline
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Applications: {data.recruitmentMetrics.totalApplications}
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={(data.recruitmentMetrics.hiredThisMonth / data.recruitmentMetrics.totalApplications) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 2,
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  size="small" 
                  label={`Shortlisted: ${data.recruitmentMetrics.shortlistedCandidates}`}
                  sx={{ background: alpha(theme.palette.info.main, 0.1) }}
                />
                <Chip 
                  size="small" 
                  label={`Interviews: ${data.recruitmentMetrics.interviewsScheduled}`}
                  sx={{ background: alpha(theme.palette.warning.main, 0.1) }}
                />
                <Chip 
                  size="small" 
                  label={`Hired: ${data.recruitmentMetrics.hiredThisMonth}`}
                  sx={{ background: alpha(theme.palette.success.main, 0.1) }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Department Overview */}
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
                🏢 Department Overview
              </Typography>
              
              {data.departmentOverview.map((dept) => (
                <Box key={dept.id} sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {dept.name}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${dept.employeeCount} employees`}
                      sx={{ background: alpha(theme.palette.primary.main, 0.1) }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Performance: {dept.performance}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={dept.performance}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: dept.performance > 85 ? theme.palette.success.main : 
                                        dept.performance > 70 ? theme.palette.warning.main : 
                                        theme.palette.error.main
                        }
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Pending Applications */}
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
                📋 Pending Applications
              </Typography>
              
              <List dense>
                {data.pendingApplications.slice(0, 3).map((application) => (
                  <ListItem key={application.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getPriorityColor(application.priority), width: 32, height: 32 }}>
                        <PersonAdd fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {application.candidateName}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {application.position} - {application.department}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={application.status}
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                background: alpha(getStatusColor(application.status), 0.1),
                                color: getStatusColor(application.status)
                              }}
                            />
                            <Chip
                              size="small"
                              label={application.priority}
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                background: alpha(getPriorityColor(application.priority), 0.1),
                                color: getPriorityColor(application.priority)
                              }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              {data.pendingApplications.length > 3 && (
                <Typography 
                  variant="caption" 
                  color="primary" 
                  sx={{ 
                    cursor: 'pointer', 
                    textDecoration: 'underline',
                    display: 'block',
                    textAlign: 'center',
                    mt: 1
                  }}
                >
                  View all {data.pendingApplications.length} applications
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Performance Alerts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)}, ${alpha(theme.palette.warning.main, 0.1)})`,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                ⚠️ Performance Alerts
              </Typography>
              
              {data.performanceAlerts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No performance alerts at the moment
                </Typography>
              ) : (
                <List dense>
                  {data.performanceAlerts.map((alert) => (
                    <ListItem key={alert.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor('', alert.severity), width: 32, height: 32 }}>
                          <Warning fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {alert.employeeName}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {alert.description}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                size="small"
                                label={alert.severity}
                                sx={{
                                  fontSize: '0.7rem',
                                  height: 20,
                                  background: alpha(getStatusColor('', alert.severity), 0.1),
                                  color: getStatusColor('', alert.severity)
                                }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
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
    </Card>
  );
};

export default HROverview;
