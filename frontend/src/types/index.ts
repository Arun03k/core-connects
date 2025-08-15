// Re-export store types
export type { RootState, AppDispatch } from '../store';
export type { User, AuthState } from '../store/slices/authSlice';
export type { 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse 
} from '../store/thunks/authThunks';

// Import types for hook interfaces
import type { RootState, AppDispatch } from '../store';

// Hook types for Redux
export interface UseAppDispatch {
  (): AppDispatch;
}

export interface UseAppSelector {
  <TSelected>(selector: (state: RootState) => TSelected): TSelected;
}
