// Re-export store types
export type { RootState, AppDispatch } from '../store';
export type { User, AuthState } from '../store/slices/authSlice';
export type { 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse 
} from '../store/thunks/authThunks';

// Dashboard types
export type {
  DashboardUser,
  DashboardStats,
  ActivityItem,
  NotificationItem,
  DashboardWidget,
  DashboardConfig,
  QuickAction,
  DashboardData
} from './dashboard';

// Import types for hook interfaces
import type { RootState, AppDispatch } from '../store';

// Hook types for Redux
export interface UseAppDispatch {
  (): AppDispatch;
}

export interface UseAppSelector {
  <TSelected>(selector: (state: RootState) => TSelected): TSelected;
}
