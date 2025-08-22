import type { DashboardConfig, QuickAction } from '../types/dashboard';

export const DASHBOARD_CONFIGS: Record<string, DashboardConfig> = {
  EMPLOYEE: {
    role: 'EMPLOYEE',
    allowedWidgets: [
      'my-stats',
      'my-tasks',
      'leave-balance',
      'recent-activity',
      'upcoming-events',
      'quick-actions'
    ],
    defaultLayout: [
      {
        id: 'my-stats',
        type: 'STATS',
        title: 'My Overview',
        visible: true,
        position: { x: 0, y: 0 },
        size: { width: 4, height: 2 }
      },
      {
        id: 'quick-actions',
        type: 'QUICK_ACTIONS',
        title: 'Quick Actions',
        visible: true,
        position: { x: 4, y: 0 },
        size: { width: 2, height: 2 }
      },
      {
        id: 'my-tasks',
        type: 'ACTIVITY',
        title: 'My Tasks',
        visible: true,
        position: { x: 0, y: 2 },
        size: { width: 3, height: 3 }
      },
      {
        id: 'recent-activity',
        type: 'ACTIVITY',
        title: 'Recent Activity',
        visible: true,
        position: { x: 3, y: 2 },
        size: { width: 3, height: 3 }
      }
    ],
    permissions: {
      canViewEmployees: false,
      canManageLeave: false,
      canViewReports: false,
      canManageUsers: false,
      canEditSettings: false
    }
  },

  HR: {
    role: 'HR',
    allowedWidgets: [
      'hr-stats',
      'employee-overview',
      'leave-requests',
      'recent-activity',
      'pending-approvals',
      'quick-actions',
      'reports-chart'
    ],
    defaultLayout: [
      {
        id: 'hr-stats',
        type: 'STATS',
        title: 'HR Overview',
        visible: true,
        position: { x: 0, y: 0 },
        size: { width: 4, height: 2 }
      },
      {
        id: 'quick-actions',
        type: 'QUICK_ACTIONS',
        title: 'HR Actions',
        visible: true,
        position: { x: 4, y: 0 },
        size: { width: 2, height: 2 }
      },
      {
        id: 'pending-approvals',
        type: 'ACTIVITY',
        title: 'Pending Approvals',
        visible: true,
        position: { x: 0, y: 2 },
        size: { width: 3, height: 3 }
      },
      {
        id: 'employee-overview',
        type: 'CHART',
        title: 'Employee Overview',
        visible: true,
        position: { x: 3, y: 2 },
        size: { width: 3, height: 3 }
      }
    ],
    permissions: {
      canViewEmployees: true,
      canManageLeave: true,
      canViewReports: true,
      canManageUsers: true,
      canEditSettings: false
    }
  },

  MANAGER: {
    role: 'MANAGER',
    allowedWidgets: [
      'team-stats',
      'team-tasks',
      'team-activity',
      'leave-requests',
      'performance-chart',
      'quick-actions'
    ],
    defaultLayout: [
      {
        id: 'team-stats',
        type: 'STATS',
        title: 'Team Overview',
        visible: true,
        position: { x: 0, y: 0 },
        size: { width: 4, height: 2 }
      },
      {
        id: 'quick-actions',
        type: 'QUICK_ACTIONS',
        title: 'Manager Actions',
        visible: true,
        position: { x: 4, y: 0 },
        size: { width: 2, height: 2 }
      },
      {
        id: 'team-tasks',
        type: 'ACTIVITY',
        title: 'Team Tasks',
        visible: true,
        position: { x: 0, y: 2 },
        size: { width: 3, height: 3 }
      },
      {
        id: 'performance-chart',
        type: 'CHART',
        title: 'Team Performance',
        visible: true,
        position: { x: 3, y: 2 },
        size: { width: 3, height: 3 }
      }
    ],
    permissions: {
      canViewEmployees: true,
      canManageLeave: true,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false
    }
  },

  ADMIN: {
    role: 'ADMIN',
    allowedWidgets: [
      'admin-stats',
      'system-health',
      'user-management',
      'security-logs',
      'analytics-chart',
      'quick-actions'
    ],
    defaultLayout: [
      {
        id: 'admin-stats',
        type: 'STATS',
        title: 'System Overview',
        visible: true,
        position: { x: 0, y: 0 },
        size: { width: 4, height: 2 }
      },
      {
        id: 'quick-actions',
        type: 'QUICK_ACTIONS',
        title: 'Admin Actions',
        visible: true,
        position: { x: 4, y: 0 },
        size: { width: 2, height: 2 }
      },
      {
        id: 'user-management',
        type: 'ACTIVITY',
        title: 'User Management',
        visible: true,
        position: { x: 0, y: 2 },
        size: { width: 3, height: 3 }
      },
      {
        id: 'system-health',
        type: 'CHART',
        title: 'System Health',
        visible: true,
        position: { x: 3, y: 2 },
        size: { width: 3, height: 3 }
      }
    ],
    permissions: {
      canViewEmployees: true,
      canManageLeave: true,
      canViewReports: true,
      canManageUsers: true,
      canEditSettings: true
    }
  }
};

export const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  EMPLOYEE: [
    {
      id: 'apply-leave',
      title: 'Apply Leave',
      icon: 'CalendarIcon',
      description: 'Request time off',
      link: '/leave/apply',
      color: 'primary'
    },
    {
      id: 'view-payslip',
      title: 'View Payslip',
      icon: 'DocumentIcon',
      description: 'Download payslip',
      link: '/payroll/payslip',
      color: 'info'
    },
    {
      id: 'update-profile',
      title: 'Update Profile',
      icon: 'UserIcon',
      description: 'Edit personal information',
      link: '/profile/edit',
      color: 'secondary'
    },
    {
      id: 'clock-in',
      title: 'Clock In/Out',
      icon: 'ClockIcon',
      description: 'Record attendance',
      link: '/attendance/clock',
      color: 'success'
    }
  ],

  HR: [
    {
      id: 'add-employee',
      title: 'Add Employee',
      icon: 'UserPlusIcon',
      description: 'Onboard new employee',
      link: '/employees/add',
      permission: 'canManageUsers',
      color: 'primary'
    },
    {
      id: 'manage-leave',
      title: 'Manage Leave',
      icon: 'CalendarIcon',
      description: 'Approve/reject leave requests',
      link: '/leave/manage',
      permission: 'canManageLeave',
      color: 'warning'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      icon: 'ChartBarIcon',
      description: 'Analytics and insights',
      link: '/reports',
      permission: 'canViewReports',
      color: 'info'
    },
    {
      id: 'employee-directory',
      title: 'Employee Directory',
      icon: 'UsersIcon',
      description: 'View all employees',
      link: '/employees',
      permission: 'canViewEmployees',
      color: 'secondary'
    }
  ],

  MANAGER: [
    {
      id: 'team-overview',
      title: 'Team Overview',
      icon: 'UsersIcon',
      description: 'View team performance',
      link: '/team/overview',
      color: 'primary'
    },
    {
      id: 'approve-requests',
      title: 'Approve Requests',
      icon: 'CheckIcon',
      description: 'Review pending approvals',
      link: '/approvals',
      color: 'warning'
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Meeting',
      icon: 'CalendarIcon',
      description: 'Create team meetings',
      link: '/meetings/schedule',
      color: 'info'
    },
    {
      id: 'performance-review',
      title: 'Performance Review',
      icon: 'StarIcon',
      description: 'Conduct reviews',
      link: '/performance/review',
      color: 'success'
    }
  ],

  ADMIN: [
    {
      id: 'system-settings',
      title: 'System Settings',
      icon: 'CogIcon',
      description: 'Configure system',
      link: '/admin/settings',
      permission: 'canEditSettings',
      color: 'primary'
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: 'UsersIcon',
      description: 'Manage all users',
      link: '/admin/users',
      permission: 'canManageUsers',
      color: 'secondary'
    },
    {
      id: 'security-audit',
      title: 'Security Audit',
      icon: 'ShieldIcon',
      description: 'View security logs',
      link: '/admin/security',
      color: 'error'
    },
    {
      id: 'backup-restore',
      title: 'Backup & Restore',
      icon: 'ServerIcon',
      description: 'Manage system backups',
      link: '/admin/backup',
      color: 'info'
    }
  ]
};

export const getDashboardConfig = (role: string): DashboardConfig => {
  return DASHBOARD_CONFIGS[role] || DASHBOARD_CONFIGS.EMPLOYEE;
};

export const getQuickActions = (role: string, permissions: any): QuickAction[] => {
  const actions = QUICK_ACTIONS[role] || QUICK_ACTIONS.EMPLOYEE;
  
  // Filter actions based on permissions
  return actions.filter(action => {
    if (!action.permission) return true;
    return permissions[action.permission] === true;
  });
};
