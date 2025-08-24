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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Computer,
  People,
  Security,
  Backup,
  Support,
  Warning,
  Storage,
  StorageRounded
  , Delete, Visibility, Save, Search, PersonAdd, MoreVert
} from '@mui/icons-material';

interface RecentAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  description?: string;
}

interface RecentBackup {
  id: string;
  status: 'ok' | 'failed' | 'in_progress';
  date: string;
  size?: string;
}

interface RecentUser {
  id: string;
  name: string;
  email?: string;
  role?: 'admin' | 'manager' | 'hr' | 'employee' | string;
  registeredAt?: string;
  active?: boolean;
}

interface SupportTicket {
  id: string;
  title: string;
  reporter?: string;
  message?: string;
  timestamp: string;
  status: 'open' | 'in_progress' | 'resolved';
}

interface AdminStats {
  systemUptime: number; // percentage e.g., 99.98
  activeUsers: number;
  securityAlerts: number;
  backupHealth: number; // percentage
  licenseUtilization: number; // percentage
  supportTickets: number;
}

interface AdminDashboardData {
  stats: AdminStats;
  recentAlerts: RecentAlert[];
  recentBackups: RecentBackup[];
  recentRegisteredUsers?: RecentUser[];
  recentSupportTickets?: SupportTicket[];
}

interface AdminOverviewProps {
  data?: AdminDashboardData;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ data }) => {
  const theme = useTheme();

  const [assigning, setAssigning] = React.useState<Record<string, boolean>>({});
  const [userRoles, setUserRoles] = React.useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    (data?.recentRegisteredUsers ?? []).forEach((u) => {
      map[u.id] = u.role ?? 'employee';
    });
    return map;
  });
  const [users, setUsers] = React.useState<RecentUser[]>(() => (data?.recentRegisteredUsers ?? []).map(u => ({...u, active: true})));
  const [query, setQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [viewingUser, setViewingUser] = React.useState<RecentUser | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<RecentUser | null>(null);

  React.useEffect(() => {
    setUsers((data?.recentRegisteredUsers ?? []).map(u => ({...u, active: u['active'] ?? true})));
    const map: Record<string, string> = {};
    (data?.recentRegisteredUsers ?? []).forEach((u) => {
      map[u.id] = u.role ?? 'employee';
    });
    setUserRoles(map);
  }, [data]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  if (!data) {
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
            theme.palette.background.paper,
            0.85
          )} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
            ⚙️ Admin Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Loading admin metrics and system health...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { stats, recentAlerts, recentBackups, recentRegisteredUsers, recentSupportTickets } = data;
  const [tickets, setTickets] = React.useState<SupportTicket[]>(() => recentSupportTickets ?? []);

  React.useEffect(() => {
    setTickets(recentSupportTickets ?? []);
  }, [recentSupportTickets]);

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
          theme.palette.background.paper,
          0.85
        )} 100%)`,
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
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
          ⚙️ Admin Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2 }}>
              <Card sx={{ p: 2, borderRadius: 2, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        System Uptime
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {stats.systemUptime}%
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.12), width: 56, height: 56 }}>
                      <Computer sx={{ color: theme.palette.success.main }} />
                    </Avatar>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, stats.systemUptime)}
                      sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})` } }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Uptime measured over the last 30 days
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Active Users
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {stats.activeUsers}
                    </Typography>
                    <Avatar sx={{ mt: 1, bgcolor: alpha(theme.palette.primary.main, 0.12), width: 40, height: 40 }}>
                      <People sx={{ color: theme.palette.primary.main }} />
                    </Avatar>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Security Alerts
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {stats.securityAlerts}
                    </Typography>
                    <Avatar sx={{ mt: 1, bgcolor: alpha(theme.palette.error.main, 0.12), width: 40, height: 40 }}>
                      <Security sx={{ color: theme.palette.error.main }} />
                    </Avatar>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Backup Health
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {stats.backupHealth}%
                    </Typography>
                    <Avatar sx={{ mt: 1, bgcolor: alpha(theme.palette.info.main, 0.12), width: 40, height: 40 }}>
                      <Backup sx={{ color: theme.palette.info.main }} />
                    </Avatar>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Support Tickets
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {stats.supportTickets}
                    </Typography>
                    <Avatar sx={{ mt: 1, bgcolor: alpha(theme.palette.secondary.main, 0.12), width: 40, height: 40 }}>
                      <Support sx={{ color: theme.palette.secondary.main }} />
                    </Avatar>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                🔔 Recent Security Alerts
              </Typography>

              {recentAlerts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No recent security alerts</Typography>
              ) : (
                <List dense>
                  {recentAlerts.map((alert) => (
                    <React.Fragment key={alert.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(getSeverityColor(alert.severity), 0.12), width: 40, height: 40 }}>
                            <Warning sx={{ color: getSeverityColor(alert.severity) }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{alert.title}</Typography>}
                          secondary={
                            <>
                              <Typography variant="caption" color="text.secondary">{alert.description}</Typography>
                              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                {alert.date}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                🗄️ Recent Backups
              </Typography>

              {recentBackups.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No backups recorded</Typography>
              ) : (
                <List dense>
                  {recentBackups.map((bkp) => (
                    <React.Fragment key={bkp.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: bkp.status === 'failed' ? alpha(theme.palette.error.main, 0.12) : alpha(theme.palette.success.main, 0.12), width: 40, height: 40 }}>
                            <StorageRounded sx={{ color: bkp.status === 'failed' ? theme.palette.error.main : theme.palette.success.main }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{bkp.status === 'ok' ? 'Backup successful' : bkp.status === 'in_progress' ? 'Backup in progress' : 'Backup failed'}</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary">{bkp.date} • {bkp.size ?? '—'}</Typography>}
                        />
                        <Chip
                          label={bkp.status.replace('_', ' ')}
                          size="small"
                          sx={{ textTransform: 'capitalize', ml: 1, bgcolor: bkp.status === 'failed' ? alpha(theme.palette.error.main, 0.08) : alpha(theme.palette.success.main, 0.08) }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                🆕 Recent Registered Users
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search users by name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
                />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="role-filter-label">Role</InputLabel>
                  <Select
                    labelId="role-filter-label"
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(String(e.target.value))}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <List dense>
                {users
                  .filter((u) => {
                    if (roleFilter !== 'all' && (u.role ?? 'employee') !== roleFilter) return false;
                    if (!query) return true;
                    const q = query.toLowerCase();
                    return (u.name?.toLowerCase() || '').includes(q) || (u.email?.toLowerCase() || '').includes(q);
                  })
                  .map((u) => (
                    <React.Fragment key={u.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar>{u.name?.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{u.name}</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary">{u.email} • {u.registeredAt}</Typography>}
                        />

                        <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                          <Select
                            value={userRoles[u.id] ?? 'employee'}
                            onChange={(e) => setUserRoles((s) => ({ ...s, [u.id]: String(e.target.value) }))}
                          >
                            <MenuItem value="employee">Employee</MenuItem>
                            <MenuItem value="manager">Manager</MenuItem>
                            <MenuItem value="hr">HR</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                        </FormControl>

                        <Switch
                          checked={!!u.active}
                          onChange={async () => {
                            // simulate toggle active API
                            setUsers((list) => list.map(item => item.id === u.id ? {...item, active: !item.active} : item));
                            await new Promise(r => setTimeout(r, 400));
                          }}
                          color="primary"
                        />

                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => setViewingUser(u)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Save role">
                          <IconButton
                            size="small"
                            onClick={async () => {
                              setAssigning((s) => ({ ...s, [u.id]: true }));
                              // Simulate API call to save role
                              await new Promise(r => setTimeout(r, 700));
                              setUsers((list) => list.map(item => item.id === u.id ? {...item, role: userRoles[u.id]} : item));
                              setAssigning((s) => ({ ...s, [u.id]: false }));
                            }}
                          >
                            {assigning[u.id] ? <Chip label="Saving" size="small" /> : <Save />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete user">
                          <IconButton size="small" onClick={() => setDeletingUser(u)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                  ))}
              </List>

              {/* View dialog */}
              <Dialog open={!!viewingUser} onClose={() => setViewingUser(null)} fullWidth maxWidth="sm">
                <DialogTitle>User details</DialogTitle>
                <DialogContent>
                  {viewingUser && (
                    <Box>
                      <Typography variant="h6">{viewingUser.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{viewingUser.email}</Typography>
                      <Typography variant="caption" color="text.secondary">Registered: {viewingUser.registeredAt}</Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Role: {viewingUser.role}</Typography>
                        <Typography variant="subtitle2">Active: {viewingUser.active ? 'Yes' : 'No'}</Typography>
                      </Box>
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setViewingUser(null)}>Close</Button>
                </DialogActions>
              </Dialog>

            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                🆘 Recent Support Tickets
              </Typography>

              {(tickets ?? []).length === 0 ? (
                <Typography variant="body2" color="text.secondary">No support tickets</Typography>
              ) : (
                <List dense>
                  {tickets.map((t) => (
                    <React.Fragment key={t.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar>{t.reporter?.charAt(0) ?? 'S'}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.title}</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary">{t.reporter} • {t.timestamp}</Typography>}
                        />
                        <Chip label={t.status} size="small" sx={{ textTransform: 'capitalize', mr: 1 }} />
                        {t.status !== 'resolved' && (
                          <Button size="small" onClick={async () => {
                            // simulate mark in progress/resolved
                            setTickets((list) => list.map(x => x.id === t.id ? {...x, status: x.status === 'open' ? 'in_progress' : 'resolved'} : x));
                            await new Promise(r => setTimeout(r, 400));
                          }}>
                            {t.status === 'open' ? 'Start' : 'Resolve'}
                          </Button>
                        )}
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdminOverview;
