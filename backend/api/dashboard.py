"""
Dashboard API endpoints for role-based dashboard functionality
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from flask import Blueprint, request, jsonify

from core.responses import APIResponse, ErrorResponses
from middleware.auth_middleware import auth_required
from models.user import User
from models.dashboard import DashboardModel
from services.dashboard_service import DashboardService

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/', methods=['GET'])
@auth_required
def get_dashboard_data():
    """Get complete dashboard data for the authenticated user"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', 'employee').lower()
        
        dashboard_service = DashboardService()
        dashboard_data = dashboard_service.get_dashboard_data(current_user, user_role)
        
        return APIResponse.success(
            data=dashboard_data,
            message="Dashboard data retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Dashboard data retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve dashboard data")

from models.user import User
from services.dashboard_service import DashboardService


# Health endpoint for testing (no auth required)
@dashboard_bp.route('/health', methods=['GET'])
def dashboard_health():
    """Simple health check endpoint for the dashboard API"""
    return APIResponse.success(
        message="Dashboard API is running",
        data={
            "status": "healthy",
            "service": "dashboard-api",
            "version": "1.0.0"
        }
    )




@dashboard_bp.route('/stats', methods=['GET'])
@auth_required
def get_dashboard_stats():
    """Get dashboard statistics for the authenticated user"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', 'employee').lower()
        
        dashboard_service = DashboardService()
        stats = dashboard_service.get_role_based_stats(current_user, user_role)
        
        return APIResponse.success(
            data=stats,
            message="Dashboard statistics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Dashboard stats retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve dashboard statistics")

@dashboard_bp.route('/quick-actions', methods=['GET'])
@auth_required
def get_quick_actions():
    """Get quick actions based on user role"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', 'employee').lower()
        
        dashboard_service = DashboardService()
        quick_actions = dashboard_service.get_quick_actions(user_role)
        
        return APIResponse.success(
            data={"actions": quick_actions},
            message="Quick actions retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Quick actions retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve quick actions")

@dashboard_bp.route('/notifications', methods=['GET'])
@auth_required
def get_notifications():
    """Get user notifications"""
    try:
        current_user = request.current_user
        limit = request.args.get('limit', 10, type=int)
        offset = request.args.get('offset', 0, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        dashboard_service = DashboardService()
        notifications = dashboard_service.get_user_notifications(
            current_user['_id'], 
            limit=limit, 
            offset=offset,
            unread_only=unread_only
        )
        
        return APIResponse.success(
            data={"notifications": notifications},
            message="Notifications retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Notifications retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve notifications")

@dashboard_bp.route('/notifications/<notification_id>/mark-read', methods=['POST'])
@auth_required
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        current_user = request.current_user
        
        dashboard_service = DashboardService()
        success = dashboard_service.mark_notification_read(
            notification_id, 
            current_user['_id']
        )
        
        if success:
            return APIResponse.success(
                message="Notification marked as read"
            )
        else:
            return ErrorResponses.not_found("Notification not found")
        
    except Exception as e:
        logger.error(f"Mark notification read error: {str(e)}")
        return ErrorResponses.internal_error("Failed to mark notification as read")

@dashboard_bp.route('/notifications/mark-all-read', methods=['POST'])
@auth_required
def mark_all_notifications_read():
    """Mark all notifications as read for the current user"""
    try:
        current_user = request.current_user
        
        dashboard_service = DashboardService()
        count = dashboard_service.mark_all_notifications_read(current_user['_id'])
        
        return APIResponse.success(
            data={"updated_count": count},
            message=f"Marked {count} notifications as read"
        )
        
    except Exception as e:
        logger.error(f"Mark all notifications read error: {str(e)}")
        return ErrorResponses.internal_error("Failed to mark notifications as read")

@dashboard_bp.route('/activity', methods=['GET'])
@auth_required
def get_recent_activity():
    """Get recent activity for the current user"""
    try:
        current_user = request.current_user
        limit = request.args.get('limit', 20, type=int)
        
        dashboard_service = DashboardService()
        activity = dashboard_service.get_recent_activity(
            current_user['_id'], 
            limit=limit
        )
        
        return APIResponse.success(
            data={"activities": activity},
            message="Recent activity retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Recent activity retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve recent activity")

# Role-specific endpoints
@dashboard_bp.route('/hr/overview', methods=['GET'])
@auth_required
def get_hr_overview():
    """Get HR-specific dashboard data"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', '').lower()
        
        if user_role != 'hr':
            return ErrorResponses.forbidden("Access denied. HR role required.")
        
        dashboard_service = DashboardService()
        hr_data = dashboard_service.get_hr_dashboard_data(current_user)
        
        return APIResponse.success(
            data=hr_data,
            message="HR dashboard data retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"HR dashboard retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve HR dashboard data")

@dashboard_bp.route('/employee/overview', methods=['GET'])
@auth_required
def get_employee_overview():
    """Get employee-specific dashboard data"""
    try:
        current_user = request.current_user
        
        dashboard_service = DashboardService()
        employee_data = dashboard_service.get_employee_dashboard_data(current_user)
        
        return APIResponse.success(
            data=employee_data,
            message="Employee dashboard data retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Employee dashboard retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve employee dashboard data")

@dashboard_bp.route('/manager/overview', methods=['GET'])
@auth_required
def get_manager_overview():
    """Get manager-specific dashboard data"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', '').lower()
        
        if user_role != 'manager':
            return ErrorResponses.forbidden("Access denied. Manager role required.")
        
        dashboard_service = DashboardService()
        manager_data = dashboard_service.get_manager_dashboard_data(current_user)
        
        return APIResponse.success(
            data=manager_data,
            message="Manager dashboard data retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Manager dashboard retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve manager dashboard data")

@dashboard_bp.route('/admin/overview', methods=['GET'])
@auth_required
def get_admin_overview():
    """Get admin-specific dashboard data"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', '').lower()
        
        if user_role != 'admin':
            return ErrorResponses.forbidden("Access denied. Admin role required.")
        
        dashboard_service = DashboardService()
        admin_data = dashboard_service.get_admin_dashboard_data(current_user)
        
        return APIResponse.success(
            data=admin_data,
            message="Admin dashboard data retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Admin dashboard retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve admin dashboard data")

@dashboard_bp.route('/system-health', methods=['GET'])
@auth_required
def get_system_health():
    """Get system health information"""
    try:
        current_user = request.current_user
        user_role = current_user.get('role', '').lower()
        
        # Only admin and manager roles can access system health
        if user_role not in ['admin', 'manager']:
            return ErrorResponses.forbidden("Access denied. Admin or Manager role required.")
        
        dashboard_service = DashboardService()
        system_health = dashboard_service.get_system_health()
        
        return APIResponse.success(
            data=system_health,
            message="System health retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"System health retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve system health")

@dashboard_bp.route('/user-profile', methods=['GET'])
@auth_required
def get_user_profile():
    """Get user profile data for dashboard"""
    try:
        current_user = request.current_user
        
        # Calculate profile completion percentage
        profile_fields = ['first_name', 'last_name', 'email', 'role']
        optional_fields = ['profile.avatar_url', 'profile.bio', 'profile.location']
        
        completed_required = sum(1 for field in profile_fields if current_user.get(field))
        completed_optional = sum(1 for field in optional_fields 
                               if (current_user.get(field.split('.')[0], {}).get(field.split('.')[1]) 
                                   if '.' in field else current_user.get(field)))
        
        total_fields = len(profile_fields) + len(optional_fields)
        completion_percentage = int(((completed_required + completed_optional) / total_fields) * 100)
        
        profile_data = {
            "id": str(current_user["_id"]),
            "firstName": current_user.get("first_name", ""),
            "lastName": current_user.get("last_name", ""),
            "email": current_user.get("email", ""),
            "username": current_user.get("username", ""),
            "role": current_user.get("role", "employee"),
            "department": current_user.get("department", "General"),
            "position": current_user.get("position", "Employee"),
            "avatar": current_user.get("profile", {}).get("avatar_url"),
            "completionPercentage": completion_percentage,
            "isVerified": current_user.get("is_verified", False),
            "lastLogin": current_user.get("last_login"),
            "createdAt": current_user.get("created_at")
        }
        
        return APIResponse.success(
            data=profile_data,
            message="User profile retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"User profile retrieval error: {str(e)}")
        return ErrorResponses.internal_error("Failed to retrieve user profile")
