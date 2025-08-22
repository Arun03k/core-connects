"""
Dashboard service for handling role-based dashboard logic
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List

from models.dashboard import DashboardModel
from models.user import User

logger = logging.getLogger(__name__)

class DashboardService:
    """Service class for dashboard operations"""

    def __init__(self):
        self.dashboard_model = DashboardModel()
        self.user_model = User()

    def get_dashboard_data(self, current_user: Dict[str, Any], user_role: str) -> Dict[str, Any]:
        """Get complete dashboard data based on user role"""
        try:
            # Get common data for all roles
            common_data = self._get_common_dashboard_data(current_user)
            
            # Get role-specific data
            role_data = self._get_role_specific_data(current_user, user_role)
            
            # Combine data
            dashboard_data = {
                "stats": {
                    "common": common_data["common_stats"],
                    "roleSpecific": role_data["stats"]
                },
                "recentActivity": common_data["recent_activity"],
                "notifications": common_data["notifications"],
                "userProfile": common_data["user_profile"],
                "roleSpecificData": {user_role: role_data["data"]},
                "commonWidgets": {
                    "quickActions": self.get_quick_actions(user_role),
                    "upcomingEvents": self._get_upcoming_events(current_user),
                    "systemHealth": self._get_system_health_summary()
                }
            }
            
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Error getting dashboard data: {str(e)}")
            raise Exception(f"Failed to get dashboard data: {str(e)}")

    def _get_common_dashboard_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get common dashboard data for all users"""
        try:
            user_id = str(current_user["_id"])
            
            # Get user stats
            user_stats = self.user_model.get_user_stats()
            
            # Get recent activity
            recent_activity = self.dashboard_model.get_user_activities(user_id, limit=10)
            
            # Get notifications
            notifications = self.dashboard_model.get_user_notifications(user_id, limit=5)
            
            # Build user profile
            user_profile = self._build_user_profile(current_user)
            
            # Common stats
            common_stats = {
                "totalEmployees": user_stats.get("active_users", 1247),
                "activeProjects": 24,  # Mock data - replace with actual query
                "pendingTasks": len(self.dashboard_model.get_employee_tasks(user_id)),
                "completionRate": 94  # Mock data - replace with calculation
            }
            
            return {
                "common_stats": common_stats,
                "recent_activity": self._format_activities(recent_activity),
                "notifications": self._format_notifications(notifications),
                "user_profile": user_profile
            }
            
        except Exception as e:
            logger.error(f"Error getting common dashboard data: {str(e)}")
            return {
                "common_stats": {"totalEmployees": 0, "activeProjects": 0, "pendingTasks": 0, "completionRate": 0},
                "recent_activity": [],
                "notifications": [],
                "user_profile": {}
            }

    def _get_role_specific_data(self, current_user: Dict[str, Any], user_role: str) -> Dict[str, Any]:
        """Get role-specific dashboard data"""
        try:
            if user_role == 'hr':
                return self._get_hr_data(current_user)
            elif user_role == 'manager':
                return self._get_manager_data(current_user)
            elif user_role == 'admin':
                return self._get_admin_data(current_user)
            else:
                return self._get_employee_data(current_user)
                
        except Exception as e:
            logger.error(f"Error getting role-specific data for {user_role}: {str(e)}")
            return {"stats": {}, "data": {}}

    def _get_hr_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get HR-specific dashboard data"""
        try:
            # Get HR applications
            applications = self.dashboard_model.get_hr_applications(limit=10)
            
            # Get department overview
            departments = self.dashboard_model.get_department_overview()
            
            # Mock HR stats and data
            hr_stats = {
                "newHires": 12,
                "pendingLeaves": 8,
                "performanceReviews": 23,
                "departmentCount": len(departments) if departments else 8,
                "avgSalary": 75000,
                "turnoverRate": 3.2,
                "recruitmentPipeline": len(applications) if applications else 45,
                "complianceAlerts": 2
            }
            
            hr_data = {
                "pendingApplications": applications[:5] if applications else self._get_mock_applications(),
                "departmentOverview": departments if departments else self._get_mock_departments(),
                "recentHires": self._get_mock_recent_hires(),
                "performanceAlerts": self._get_mock_performance_alerts(),
                "recruitmentMetrics": {
                    "totalApplications": len(applications) if applications else 156,
                    "shortlistedCandidates": 23,
                    "interviewsScheduled": 12,
                    "offersExtended": 5,
                    "hiredThisMonth": 3
                },
                "leaveRequests": self._get_mock_leave_requests()
            }
            
            return {"stats": hr_stats, "data": hr_data}
            
        except Exception as e:
            logger.error(f"Error getting HR data: {str(e)}")
            return {"stats": {}, "data": {}}

    def _get_employee_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get employee-specific dashboard data"""
        try:
            user_id = str(current_user["_id"])
            department = current_user.get("department", "General")
            
            # Get employee tasks
            tasks = self.dashboard_model.get_employee_tasks(user_id)
            
            # Get team members
            team_members = self.dashboard_model.get_team_members(department)
            
            # Get learning progress
            learning_progress = self.dashboard_model.get_learning_progress(user_id)
            
            # Get goals
            goals = self.dashboard_model.get_user_goals(user_id)
            
            # Employee stats
            employee_stats = {
                "myProjects": 3,  # Mock data
                "completedTasks": len([t for t in tasks if t.get("status") == "completed"]) if tasks else 24,
                "upcomingDeadlines": len([t for t in tasks if t.get("due_date")]) if tasks else 5,
                "teamSize": len(team_members) if team_members else 8,
                "performanceScore": current_user.get("performance_score", 92),
                "learningProgress": 67,  # Mock data
                "leaveBalance": 18  # Mock data
            }
            
            employee_data = {
                "myTasks": tasks[:5] if tasks else self._get_mock_tasks(),
                "teamMembers": team_members if team_members else self._get_mock_team_members(),
                "upcomingEvents": self._get_mock_events(),
                "learningProgress": learning_progress if learning_progress else self._get_mock_learning_progress(),
                "timesheet": self._get_mock_timesheet(),
                "goals": goals if goals else self._get_mock_goals()
            }
            
            return {"stats": employee_stats, "data": employee_data}
            
        except Exception as e:
            logger.error(f"Error getting employee data: {str(e)}")
            return {"stats": {}, "data": {}}

    def _get_manager_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get manager-specific dashboard data"""
        try:
            # Mock manager stats and data
            manager_stats = {
                "teamMembers": 12,
                "teamPerformance": 87,
                "budgetUtilization": 78,
                "projectsManaged": 5,
                "pendingApprovals": 7,
                "teamSatisfaction": 4.2
            }
            
            manager_data = {
                "teamOverview": {
                    "totalMembers": 12,
                    "activeProjects": 5,
                    "completedTasks": 89,
                    "avgPerformance": 87,
                    "productivityTrend": 5.2
                },
                "pendingApprovals": self._get_mock_approvals(),
                "teamTasks": self._get_mock_tasks(),
                "budgetSummary": {
                    "allocated": 100000,
                    "spent": 78000,
                    "remaining": 22000,
                    "utilizationRate": 78
                },
                "performanceInsights": [
                    {
                        "metric": "Team Productivity",
                        "value": 87,
                        "trend": "up",
                        "description": "Increased by 5% this month"
                    }
                ]
            }
            
            return {"stats": manager_stats, "data": manager_data}
            
        except Exception as e:
            logger.error(f"Error getting manager data: {str(e)}")
            return {"stats": {}, "data": {}}

    def _get_admin_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get admin-specific dashboard data"""
        try:
            # Get system metrics
            system_metrics = self.dashboard_model.get_system_metrics()
            
            admin_stats = {
                "systemUptime": system_metrics.get("system_uptime", 99.9),
                "activeUsers": system_metrics.get("active_users", 234),
                "securityAlerts": 3,  # Mock data
                "backupStatus": 100,  # Mock data
                "licenseUtilization": 78,  # Mock data
                "supportTickets": 12  # Mock data
            }
            
            admin_data = {
                "systemMetrics": system_metrics,
                "userActivity": self._get_mock_user_activity(),
                "securityAlerts": self._get_mock_security_alerts(),
                "systemLogs": self._get_mock_system_logs(),
                "licenseInfo": self._get_mock_license_info()
            }
            
            return {"stats": admin_stats, "data": admin_data}
            
        except Exception as e:
            logger.error(f"Error getting admin data: {str(e)}")
            return {"stats": {}, "data": {}}

    def get_quick_actions(self, user_role: str) -> List[Dict[str, Any]]:
        """Get quick actions based on user role"""
        actions = {
            'hr': [
                {'id': 'hire', 'label': 'Post New Job', 'icon': '👥', 'path': '/hr/jobs/new', 'color': 'primary'},
                {'id': 'review', 'label': 'Review Applications', 'icon': '📋', 'path': '/hr/applications', 'color': 'info'},
                {'id': 'reports', 'label': 'Generate Report', 'icon': '📊', 'path': '/hr/reports', 'color': 'success'},
                {'id': 'policies', 'label': 'Update Policies', 'icon': '📝', 'path': '/hr/policies', 'color': 'warning'}
            ],
            'manager': [
                {'id': 'approve', 'label': 'Pending Approvals', 'icon': '✅', 'path': '/manager/approvals', 'color': 'error'},
                {'id': 'team', 'label': 'Team Performance', 'icon': '👥', 'path': '/manager/team', 'color': 'primary'},
                {'id': 'budget', 'label': 'Budget Review', 'icon': '💰', 'path': '/manager/budget', 'color': 'success'},
                {'id': 'meeting', 'label': 'Schedule Meeting', 'icon': '📅', 'path': '/manager/meetings', 'color': 'info'}
            ],
            'admin': [
                {'id': 'users', 'label': 'Manage Users', 'icon': '👤', 'path': '/admin/users', 'color': 'primary'},
                {'id': 'security', 'label': 'Security Dashboard', 'icon': '🔒', 'path': '/admin/security', 'color': 'error'},
                {'id': 'system', 'label': 'System Health', 'icon': '⚙️', 'path': '/admin/system', 'color': 'info'},
                {'id': 'backup', 'label': 'Data Backup', 'icon': '💾', 'path': '/admin/backup', 'color': 'success'}
            ],
            'employee': [
                {'id': 'tasks', 'label': 'My Tasks', 'icon': '📋', 'path': '/employee/tasks', 'color': 'primary'},
                {'id': 'timesheet', 'label': 'Submit Timesheet', 'icon': '⏰', 'path': '/employee/timesheet', 'color': 'info'},
                {'id': 'leave', 'label': 'Request Leave', 'icon': '🏖️', 'path': '/employee/leave', 'color': 'success'},
                {'id': 'learning', 'label': 'Learning Hub', 'icon': '📚', 'path': '/employee/learning', 'color': 'warning'}
            ]
        }
        
        return actions.get(user_role, actions['employee'])

    def get_role_based_stats(self, current_user: Dict[str, Any], user_role: str) -> Dict[str, Any]:
        """Get role-based statistics"""
        try:
            common_data = self._get_common_dashboard_data(current_user)
            role_data = self._get_role_specific_data(current_user, user_role)
            
            return {
                "common": common_data["common_stats"],
                "roleSpecific": role_data["stats"]
            }
            
        except Exception as e:
            logger.error(f"Error getting role-based stats: {str(e)}")
            return {"common": {}, "roleSpecific": {}}

    # Helper methods for formatting and mock data
    def _build_user_profile(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Build user profile data"""
        profile_fields = ['first_name', 'last_name', 'email', 'role']
        optional_fields = ['profile.avatar_url', 'profile.bio', 'profile.location']
        
        completed_required = sum(1 for field in profile_fields if current_user.get(field))
        completed_optional = sum(1 for field in optional_fields 
                               if (current_user.get(field.split('.')[0], {}).get(field.split('.')[1]) 
                                   if '.' in field else current_user.get(field)))
        
        total_fields = len(profile_fields) + len(optional_fields)
        completion_percentage = int(((completed_required + completed_optional) / total_fields) * 100)
        
        return {
            "id": str(current_user["_id"]),
            "firstName": current_user.get("first_name", ""),
            "lastName": current_user.get("last_name", ""),
            "email": current_user.get("email", ""),
            "department": current_user.get("department", "General"),
            "position": current_user.get("position", "Employee"),
            "avatar": current_user.get("profile", {}).get("avatar_url"),
            "completionPercentage": completion_percentage
        }

    def _format_activities(self, activities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format activities for frontend"""
        formatted = []
        for activity in activities:
            formatted.append({
                "id": activity.get("_id", ""),
                "type": activity.get("type", "info"),
                "description": activity.get("description", ""),
                "timestamp": activity.get("timestamp", datetime.now(timezone.utc)).isoformat(),
                "status": activity.get("status", "info")
            })
        return formatted

    def _format_notifications(self, notifications: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format notifications for frontend"""
        formatted = []
        for notification in notifications:
            formatted.append({
                "id": notification.get("_id", ""),
                "title": notification.get("title", ""),
                "message": notification.get("message", ""),
                "type": notification.get("type", "info"),
                "timestamp": notification.get("timestamp", datetime.now(timezone.utc)).isoformat(),
                "read": notification.get("read", False)
            })
        return formatted

    def _get_upcoming_events(self, current_user: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get upcoming events for the user"""
        # Mock data - replace with actual implementation
        return []

    def _get_system_health_summary(self) -> Dict[str, Any]:
        """Get system health summary"""
        return {
            "status": "healthy",
            "uptime": 99.9,
            "lastUpdate": datetime.now(timezone.utc).isoformat()
        }

    # Mock data methods (replace with actual database queries)
    def _get_mock_applications(self) -> List[Dict[str, Any]]:
        """Mock HR applications data"""
        return [
            {
                "id": "1",
                "candidateName": "John Smith",
                "position": "Software Engineer",
                "department": "Engineering",
                "status": "pending",
                "appliedDate": "2024-01-15",
                "priority": "high"
            },
            {
                "id": "2",
                "candidateName": "Sarah Johnson",
                "position": "Product Manager",
                "department": "Product",
                "status": "reviewing",
                "appliedDate": "2024-01-14",
                "priority": "medium"
            }
        ]

    def _get_mock_departments(self) -> List[Dict[str, Any]]:
        """Mock department data"""
        return [
            {
                "id": "engineering",
                "name": "Engineering",
                "employee_count": 45,
                "budget": 500000,
                "performance": 92,
                "open_positions": 3
            },
            {
                "id": "product",
                "name": "Product",
                "employee_count": 12,
                "budget": 200000,
                "performance": 88,
                "open_positions": 1
            }
        ]

    def _get_mock_recent_hires(self) -> List[Dict[str, Any]]:
        """Mock recent hires data"""
        return [
            {
                "id": "1",
                "name": "Alice Cooper",
                "position": "Frontend Developer",
                "department": "Engineering",
                "startDate": "2024-01-10"
            }
        ]

    def _get_mock_performance_alerts(self) -> List[Dict[str, Any]]:
        """Mock performance alerts data"""
        return [
            {
                "id": "1",
                "employeeName": "Bob Wilson",
                "type": "low_performance",
                "severity": "medium",
                "description": "Below target performance",
                "date": "2024-01-12"
            }
        ]

    def _get_mock_leave_requests(self) -> List[Dict[str, Any]]:
        """Mock leave requests data"""
        return [
            {
                "id": "1",
                "employeeName": "John Doe",
                "type": "Annual Leave",
                "startDate": "2024-02-01",
                "endDate": "2024-02-05",
                "status": "pending",
                "days": 4
            }
        ]

    def _get_mock_tasks(self) -> List[Dict[str, Any]]:
        """Mock tasks data"""
        return [
            {
                "id": "1",
                "title": "Complete project documentation",
                "description": "Update API documentation",
                "due_date": "2024-01-20",
                "priority": "high",
                "status": "in_progress",
                "project": "CoreConnect API"
            }
        ]

    def _get_mock_team_members(self) -> List[Dict[str, Any]]:
        """Mock team members data"""
        return [
            {
                "id": "1",
                "name": "Sarah Johnson",
                "position": "Product Manager",
                "status": "online"
            }
        ]

    def _get_mock_events(self) -> List[Dict[str, Any]]:
        """Mock events data"""
        return [
            {
                "id": "1",
                "title": "Team Standup",
                "type": "meeting",
                "date": "2024-01-16",
                "time": "10:00 AM"
            }
        ]

    def _get_mock_learning_progress(self) -> List[Dict[str, Any]]:
        """Mock learning progress data"""
        return [
            {
                "id": "1",
                "title": "React Advanced Concepts",
                "progress": 75,
                "category": "Frontend Development"
            }
        ]

    def _get_mock_timesheet(self) -> List[Dict[str, Any]]:
        """Mock timesheet data"""
        return [
            {
                "id": "1",
                "date": "2024-01-15",
                "hoursWorked": 8,
                "project": "CoreConnect",
                "status": "submitted"
            }
        ]

    def _get_mock_goals(self) -> List[Dict[str, Any]]:
        """Mock goals data"""
        return [
            {
                "id": "1",
                "title": "Complete Q1 Training",
                "description": "Finish all assigned training modules",
                "progress": 60,
                "deadline": "2024-03-31",
                "category": "Professional Development"
            }
        ]

    def _get_mock_approvals(self) -> List[Dict[str, Any]]:
        """Mock approvals data"""
        return [
            {
                "id": "1",
                "type": "leave",
                "requestor": "Jane Smith",
                "description": "Annual leave request",
                "requestDate": "2024-01-10",
                "priority": "medium"
            }
        ]

    def _get_mock_user_activity(self) -> List[Dict[str, Any]]:
        """Mock user activity data"""
        return [
            {
                "userId": "1",
                "userName": "John Doe",
                "action": "Login",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "ipAddress": "192.168.1.1"
            }
        ]

    def _get_mock_security_alerts(self) -> List[Dict[str, Any]]:
        """Mock security alerts data"""
        return [
            {
                "id": "1",
                "type": "failed_login",
                "severity": "medium",
                "description": "Multiple failed login attempts",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": "new"
            }
        ]

    def _get_mock_system_logs(self) -> List[Dict[str, Any]]:
        """Mock system logs data"""
        return [
            {
                "id": "1",
                "level": "info",
                "message": "System backup completed",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "module": "Backup Service"
            }
        ]

    def _get_mock_license_info(self) -> Dict[str, Any]:
        """Mock license info data"""
        return {
            "totalLicenses": 100,
            "usedLicenses": 78,
            "expiringLicenses": [
                {
                    "software": "Office 365",
                    "expiryDate": "2024-03-01",
                    "licensesAffected": 10
                }
            ],
            "renewalDate": "2024-12-31"
        }

    # Additional methods for dashboard functionality
    def get_user_notifications(self, user_id: str, limit: int = 10, offset: int = 0, 
                             unread_only: bool = False) -> List[Dict[str, Any]]:
        """Get user notifications"""
        notifications = self.dashboard_model.get_user_notifications(user_id, limit, offset, unread_only)
        return self._format_notifications(notifications)

    def mark_notification_read(self, notification_id: str, user_id: str) -> bool:
        """Mark notification as read"""
        return self.dashboard_model.mark_notification_read(notification_id, user_id)

    def mark_all_notifications_read(self, user_id: str) -> int:
        """Mark all notifications as read"""
        return self.dashboard_model.mark_all_notifications_read(user_id)

    def get_recent_activity(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent activity"""
        activities = self.dashboard_model.get_user_activities(user_id, limit)
        return self._format_activities(activities)

    def get_hr_dashboard_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get HR dashboard data"""
        return self._get_hr_data(current_user)

    def get_employee_dashboard_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get employee dashboard data"""
        return self._get_employee_data(current_user)

    def get_manager_dashboard_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get manager dashboard data"""
        return self._get_manager_data(current_user)

    def get_admin_dashboard_data(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get admin dashboard data"""
        return self._get_admin_data(current_user)

    def get_system_health(self) -> Dict[str, Any]:
        """Get system health information"""
        system_metrics = self.dashboard_model.get_system_metrics()
        return {
            "status": "healthy" if system_metrics.get("active_users", 0) > 0 else "warning",
            "metrics": system_metrics,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
