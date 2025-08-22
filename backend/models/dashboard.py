"""
Dashboard model for MongoDB operations
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from bson import ObjectId

from utils.database import get_db

logger = logging.getLogger(__name__)

class DashboardModel:
    """Dashboard model for MongoDB operations"""

    def __init__(self):
        self.db = None

    def _get_db(self):
        """Get database connection"""
        if self.db is None:
            self.db = get_db()
        return self.db

    def _get_collection(self, collection_name: str):
        """Get collection from database"""
        db = self._get_db()
        return db[collection_name]

    def get_user_activities(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent activities for a user"""
        try:
            activities_collection = self._get_collection('user_activities')
            
            activities = list(activities_collection.find(
                {"user_id": ObjectId(user_id)}
            ).sort("timestamp", -1).limit(limit))
            
            # Convert ObjectId to string
            for activity in activities:
                activity["_id"] = str(activity["_id"])
                activity["user_id"] = str(activity["user_id"])
            
            return activities
            
        except Exception as e:
            logger.error(f"Error getting user activities: {str(e)}")
            return []

    def get_user_notifications(self, user_id: str, limit: int = 10, offset: int = 0, 
                             unread_only: bool = False) -> List[Dict[str, Any]]:
        """Get notifications for a user"""
        try:
            notifications_collection = self._get_collection('notifications')
            
            query = {"user_id": ObjectId(user_id)}
            if unread_only:
                query["read"] = False
            
            notifications = list(notifications_collection.find(query)
                               .sort("timestamp", -1)
                               .skip(offset)
                               .limit(limit))
            
            # Convert ObjectId to string
            for notification in notifications:
                notification["_id"] = str(notification["_id"])
                notification["user_id"] = str(notification["user_id"])
            
            return notifications
            
        except Exception as e:
            logger.error(f"Error getting user notifications: {str(e)}")
            return []

    def mark_notification_read(self, notification_id: str, user_id: str) -> bool:
        """Mark a notification as read"""
        try:
            notifications_collection = self._get_collection('notifications')
            
            result = notifications_collection.update_one(
                {"_id": ObjectId(notification_id), "user_id": ObjectId(user_id)},
                {"$set": {"read": True, "read_at": datetime.now(timezone.utc)}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error marking notification as read: {str(e)}")
            return False

    def mark_all_notifications_read(self, user_id: str) -> int:
        """Mark all notifications as read for a user"""
        try:
            notifications_collection = self._get_collection('notifications')
            
            result = notifications_collection.update_many(
                {"user_id": ObjectId(user_id), "read": False},
                {"$set": {"read": True, "read_at": datetime.now(timezone.utc)}}
            )
            
            return result.modified_count
            
        except Exception as e:
            logger.error(f"Error marking all notifications as read: {str(e)}")
            return 0

    def get_hr_applications(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get job applications for HR dashboard"""
        try:
            applications_collection = self._get_collection('job_applications')
            
            applications = list(applications_collection.find()
                              .sort("applied_date", -1)
                              .limit(limit))
            
            # Convert ObjectId to string
            for app in applications:
                app["_id"] = str(app["_id"])
            
            return applications
            
        except Exception as e:
            logger.error(f"Error getting HR applications: {str(e)}")
            return []

    def get_department_overview(self) -> List[Dict[str, Any]]:
        """Get department overview for HR dashboard"""
        try:
            users_collection = self._get_collection('users')
            
            # Aggregate department statistics
            pipeline = [
                {"$match": {"is_active": True}},
                {"$group": {
                    "_id": "$department",
                    "employee_count": {"$sum": 1},
                    "avg_performance": {"$avg": "$performance_score"}
                }},
                {"$project": {
                    "name": "$_id",
                    "employee_count": 1,
                    "avg_performance": {"$round": ["$avg_performance", 1]},
                    "_id": 0
                }}
            ]
            
            departments = list(users_collection.aggregate(pipeline))
            
            # Add mock data for missing fields
            for dept in departments:
                dept.update({
                    "id": dept["name"].lower().replace(" ", "_"),
                    "budget": 100000,  # Mock budget
                    "performance": dept.get("avg_performance", 85),
                    "open_positions": 2  # Mock open positions
                })
            
            return departments
            
        except Exception as e:
            logger.error(f"Error getting department overview: {str(e)}")
            return []

    def get_employee_tasks(self, user_id: str) -> List[Dict[str, Any]]:
        """Get tasks for an employee"""
        try:
            tasks_collection = self._get_collection('tasks')
            
            tasks = list(tasks_collection.find(
                {"assigned_to": ObjectId(user_id)}
            ).sort("due_date", 1))
            
            # Convert ObjectId to string
            for task in tasks:
                task["_id"] = str(task["_id"])
                task["assigned_to"] = str(task["assigned_to"])
            
            return tasks
            
        except Exception as e:
            logger.error(f"Error getting employee tasks: {str(e)}")
            return []

    def get_team_members(self, department: str) -> List[Dict[str, Any]]:
        """Get team members in the same department"""
        try:
            users_collection = self._get_collection('users')
            
            team_members = list(users_collection.find(
                {"department": department, "is_active": True},
                {"first_name": 1, "last_name": 1, "position": 1, "profile.avatar_url": 1, "last_login": 1}
            ).limit(10))
            
            # Convert ObjectId to string and format data
            for member in team_members:
                member["_id"] = str(member["_id"])
                member["name"] = f"{member.get('first_name', '')} {member.get('last_name', '')}".strip()
                
                # Determine online status based on last login
                last_login = member.get("last_login")
                if last_login:
                    time_diff = datetime.now(timezone.utc) - last_login
                    if time_diff.total_seconds() < 300:  # 5 minutes
                        member["status"] = "online"
                    elif time_diff.total_seconds() < 1800:  # 30 minutes
                        member["status"] = "away"
                    else:
                        member["status"] = "offline"
                else:
                    member["status"] = "offline"
                
                # Clean up fields
                member.pop("first_name", None)
                member.pop("last_name", None)
                member.pop("last_login", None)
                
                if "profile" in member:
                    member["avatar"] = member["profile"].get("avatar_url")
                    member.pop("profile", None)
            
            return team_members
            
        except Exception as e:
            logger.error(f"Error getting team members: {str(e)}")
            return []

    def get_learning_progress(self, user_id: str) -> List[Dict[str, Any]]:
        """Get learning progress for a user"""
        try:
            learning_collection = self._get_collection('user_learning')
            
            progress = list(learning_collection.find(
                {"user_id": ObjectId(user_id)}
            ))
            
            # Convert ObjectId to string
            for item in progress:
                item["_id"] = str(item["_id"])
                item["user_id"] = str(item["user_id"])
            
            return progress
            
        except Exception as e:
            logger.error(f"Error getting learning progress: {str(e)}")
            return []

    def get_user_goals(self, user_id: str) -> List[Dict[str, Any]]:
        """Get goals for a user"""
        try:
            goals_collection = self._get_collection('user_goals')
            
            goals = list(goals_collection.find(
                {"user_id": ObjectId(user_id)}
            ).sort("deadline", 1))
            
            # Convert ObjectId to string
            for goal in goals:
                goal["_id"] = str(goal["_id"])
                goal["user_id"] = str(goal["user_id"])
            
            return goals
            
        except Exception as e:
            logger.error(f"Error getting user goals: {str(e)}")
            return []

    def get_system_metrics(self) -> Dict[str, Any]:
        """Get system metrics for admin dashboard"""
        try:
            users_collection = self._get_collection('users')
            
            total_users = users_collection.count_documents({})
            active_users = users_collection.count_documents({"is_active": True})
            
            # Mock system metrics
            metrics = {
                "total_users": total_users,
                "active_users": active_users,
                "cpu_usage": 45,
                "memory_usage": 67,
                "disk_usage": 23,
                "network_traffic": 234,
                "active_connections": 156,
                "system_uptime": 99.9
            }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error getting system metrics: {str(e)}")
            return {}

    def log_user_activity(self, user_id: str, activity_type: str, description: str, 
                         metadata: Dict[str, Any] = None) -> bool:
        """Log user activity"""
        try:
            activities_collection = self._get_collection('user_activities')
            
            activity = {
                "user_id": ObjectId(user_id),
                "type": activity_type,
                "description": description,
                "timestamp": datetime.now(timezone.utc),
                "metadata": metadata or {},
                "status": "success"
            }
            
            result = activities_collection.insert_one(activity)
            return bool(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error logging user activity: {str(e)}")
            return False

    def create_notification(self, user_id: str, title: str, message: str, 
                          notification_type: str = "info") -> bool:
        """Create a notification for a user"""
        try:
            notifications_collection = self._get_collection('notifications')
            
            notification = {
                "user_id": ObjectId(user_id),
                "title": title,
                "message": message,
                "type": notification_type,
                "read": False,
                "timestamp": datetime.now(timezone.utc),
                "read_at": None
            }
            
            result = notifications_collection.insert_one(notification)
            return bool(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error creating notification: {str(e)}")
            return False
