import React from 'react';
import {
  Paper,
  Box,
  Avatar,
  Typography,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  Card,
  CardContent,
  alpha,
  Fade,
  Grow
} from '@mui/material';
import {
  Edit,
  Email,
  Work,
  Business,
  Person,
  CheckCircle,
  Star,
  TrendingUp,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/thunks';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
  completionPercentage: number;
}

interface ProfileCardProps {
  profile: UserProfile;
  onEditProfile: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEditProfile
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Dispatch logout thunk which clears tokens/server-side session where possible
      // and clears local storage via the slice reducers
      // We don't strictly require unwrap here; navigate after dispatch regardless
      // to ensure UX is responsive even if server call fails.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dispatch(logoutUser());
    } catch (e) {
      console.warn('Logout failed:', e);
    } finally {
      navigate('/login');
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  const getCompletionMessage = (percentage: number) => {
    if (percentage === 100) return 'Profile Complete!';
    if (percentage >= 80) return 'Almost there!';
    if (percentage >= 50) return 'Good progress';
    return 'Complete your profile';
  };

  return (
    <Grow in={true} timeout={1000}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header with Edit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                My Profile
              </Typography>
              <Star sx={{ color: theme.palette.primary.main, fontSize: '1.2rem' }} />
            </Box>
            <IconButton 
              size="small" 
              onClick={onEditProfile}
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          {/* Enhanced Avatar and Name Section */}
          <Fade in={true} timeout={1500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={profile.avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: '2.5rem',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    border: `4px solid ${alpha(theme.palette.common.white, 0.8)}`,
                  }}
                >
                  {!profile.avatar && getInitials(profile.firstName, profile.lastName)}
                </Avatar>
                
                {/* Online Status Indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    bgcolor: 'success.main',
                    border: `3px solid ${theme.palette.background.paper}`,
                    borderRadius: '50%',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.4)}`
                  }}
                />
              </Box>
              
              <Typography
                variant="h5"
                component="h3"
                sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 0.5,
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {profile.firstName} {profile.lastName}
              </Typography>
              
              <Chip
                label={`ID: ${profile.id}`}
                size="small"
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              />
            </Box>
          </Fade>

          {/* Enhanced Profile Information */}
          <Box sx={{ mb: 4 }}>
            {[
              { icon: <Email />, label: 'Email', value: profile.email },
              { icon: <Business />, label: 'Department', value: profile.department },
              { icon: <Work />, label: 'Position', value: profile.position }
            ].map((item, index) => (
              <Fade in={true} timeout={1000 + index * 200} key={item.label}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2.5,
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.6),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                      mr: 2,
                      '& .MuiSvgIcon-root': {
                        color: theme.palette.primary.main,
                        fontSize: '1.25rem'
                      }
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>

          {/* Enhanced Profile Completion */}
          <Fade in={true} timeout={2000}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: theme.palette.primary.main }} />
                  Profile Completion
                </Typography>
                <Chip
                  icon={profile.completionPercentage === 100 ? <CheckCircle /> : undefined}
                  label={`${profile.completionPercentage}%`}
                  size="medium"
                  sx={{
                    background: profile.completionPercentage === 100 
                      ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                      : `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.8)}, ${alpha(theme.palette.warning.dark, 0.8)})`,
                    color: 'white',
                    fontWeight: 700,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={profile.completionPercentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  mb: 1,
                  background: alpha(theme.palette.grey[300], 0.3),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              />
              
              <Typography
                variant="body2"
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  textAlign: 'center'
                }}
              >
                {getCompletionMessage(profile.completionPercentage)}
              </Typography>
            </Box>
          </Fade>

          {/* Enhanced Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Person />}
              onClick={onEditProfile}
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              Edit Profile
            </Button>
            
            {profile.completionPercentage < 100 && (
              <Button
                variant="outlined"
                size="medium"
                fullWidth
                onClick={onEditProfile}
                sx={{
                  py: 1.25,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Complete Profile ({100 - profile.completionPercentage}% remaining)
              </Button>
            )}
            {/* Logout button */}
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              fullWidth
              sx={{
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderColor: alpha(theme.palette.error.main, 0.6),
                color: theme.palette.error.main,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: alpha(theme.palette.error.main, 0.06),
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProfileCard;
