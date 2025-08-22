// Dashboard Types for CoreConnect
import type { User } from '../store/slices/authSlice';

export interface DashboardUser extends User {
  role: 'EMPLOYEE' | 'HR' | 'MANAGER' | 'ADMIN';
  department?: string;
  position?: string;
  avatar?: string;
  permissions: string[];
  employeeId?: string;
  hireDate?: string;
  lastActivity?: string;
}

export interface DashboardStats {
  totalEmployees?: number;
  activeEmployees?: number;
  pendingRequests?: number;
  completedTasks?: number;
  leaveRequests?: number;
  upcomingEvents?: number;
  myTasks?: number;
  myLeaveBalance?: number;
}

export interface ActivityItem {
  id: string;
  type: 'TASK' | 'LEAVE' | 'ATTENDANCE' | 'SYSTEM' | 'PROFILE';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface NotificationItem {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  link?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'STATS' | 'CHART' | 'ACTIVITY' | 'CALENDAR' | 'QUICK_ACTIONS';
  title: string;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any;
}

export interface DashboardConfig {
  role: 'EMPLOYEE' | 'HR' | 'MANAGER' | 'ADMIN';
  allowedWidgets: string[];
  defaultLayout: DashboardWidget[];
  permissions: {
    canViewEmployees: boolean;
    canManageLeave: boolean;
    canViewReports: boolean;
    canManageUsers: boolean;
    canEditSettings: boolean;
  };
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  description: string;
  link: string;
  permission?: string;
  color?: string;
}

export interface DashboardData {
  user: DashboardUser;
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  notifications: NotificationItem[];
  quickActions: QuickAction[];
  upcomingEvents: any[];
  config: DashboardConfig;
}

// Re-export User type for convenience
export type { User } from '../store/slices/authSlice';
