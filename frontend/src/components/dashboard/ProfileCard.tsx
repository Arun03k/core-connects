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
  useTheme
} from '@mui/material';
import {
  Edit,
  Email,
  Work,
  Business,
  Person,
  CheckCircle
} from '@mui/icons-material';

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
    <Paper
      sx={{
        p: 3,
        height: 'fit-content',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header with Edit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" component="h2">
          My Profile
        </Typography>
        <IconButton 
          size="small" 
          onClick={onEditProfile}
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
            }
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Box>

      {/* Avatar and Name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={profile.avatar}
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            fontSize: '2rem',
            bgcolor: 'primary.main',
            boxShadow: theme.shadows[4],
          }}
        >
          {!profile.avatar && getInitials(profile.firstName, profile.lastName)}
        </Avatar>
        
        <Typography
          variant="h6"
          component="h3"
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 0.5
          }}
        >
          {profile.firstName} {profile.lastName}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Employee ID: {profile.id}
        </Typography>
      </Box>

      {/* Profile Information */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Email sx={{ color: 'text.secondary', mr: 2, fontSize: '1.2rem' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Email
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {profile.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Business sx={{ color: 'text.secondary', mr: 2, fontSize: '1.2rem' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Department
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {profile.department}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Work sx={{ color: 'text.secondary', mr: 2, fontSize: '1.2rem' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Position
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {profile.position}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile Completion */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Profile Completion
          </Typography>
          <Chip
            icon={profile.completionPercentage === 100 ? <CheckCircle /> : undefined}
            label={`${profile.completionPercentage}%`}
            size="small"
            color={getCompletionColor(profile.completionPercentage)}
            variant={profile.completionPercentage === 100 ? "filled" : "outlined"}
          />
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={profile.completionPercentage}
          color={getCompletionColor(profile.completionPercentage)}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 1,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            }
          }}
        />
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.75rem' }}
        >
          {getCompletionMessage(profile.completionPercentage)}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<Person />}
          onClick={onEditProfile}
          fullWidth
          sx={{
            py: 1,
            fontWeight: 'medium',
          }}
        >
          Edit Profile
        </Button>
        
        {profile.completionPercentage < 100 && (
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={onEditProfile}
            sx={{
              py: 0.75,
              fontSize: '0.875rem',
            }}
          >
            Complete Profile ({100 - profile.completionPercentage}% remaining)
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ProfileCard;
