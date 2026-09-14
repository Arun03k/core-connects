import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, sessionStatus } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (sessionStatus !== 'ready') {
    return <Box role="status" aria-live="polite" sx={{ minHeight: '70vh', display: 'grid', placeContent: 'center', gap: 2, justifyItems: 'center' }}>
      <CircularProgress aria-label="Checking session" />
      <Typography>Checking your session…</Typography>
    </Box>;
  }
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
