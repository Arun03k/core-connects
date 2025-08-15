"""
Password utility functions for validation and security
"""
import re
from typing import List


class PasswordValidator:
    """Password validation utility class"""

    # Common weak passwords to check against
    COMMON_PASSWORDS = [
        'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
        'password1', 'admin', 'letmein', 'welcome', '111111', 'login',
        'password12', 'master', 'hello', 'guest', 'root', 'admin123'
    ]

    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, List[str]]:
        """
        Validate password strength according to security requirements

        Requirements:
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one number
        - At least one special character
        - Not a common password

        Returns:
            tuple: (is_valid, list_of_errors)
        """
        errors = []

        # Check minimum length
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")

        # Check for uppercase letter
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")

        # Check for lowercase letter
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")

        # Check for number
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one number")

        # Check for special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")

        # Check against common passwords
        if password.lower() in PasswordValidator.COMMON_PASSWORDS:
            errors.append("Password is too common, please choose a stronger password")

        return len(errors) == 0, errors

    @staticmethod
    def get_password_strength_score(password: str) -> int:
        """
        Calculate password strength score (0-100)
        """
        score = 0

        # Length score (up to 25 points)
        if len(password) >= 8:
            score += min(25, len(password) * 2)

        # Character variety (up to 60 points)
        if re.search(r'[a-z]', password):
            score += 15
        if re.search(r'[A-Z]', password):
            score += 15
        if re.search(r'\d', password):
            score += 15
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            score += 15

        # Deduct points for common patterns
        if password.lower() in PasswordValidator.COMMON_PASSWORDS:
            score -= 30

        # Sequential characters penalty
        if re.search(r'(123|abc|qwe)', password.lower()):
            score -= 10

        # Repeated characters penalty
        if re.search(r'(.)\1{2,}', password):
            score -= 10

        return max(0, min(100, score))

    @staticmethod
    def suggest_password_improvements(password: str) -> List[str]:
        """
        Suggest improvements for password strength
        """
        suggestions = []

        if len(password) < 8:
            suggestions.append("Make your password at least 8 characters long")
        elif len(password) < 12:
            suggestions.append("Consider making your password longer for better security")

        if not re.search(r'[A-Z]', password):
            suggestions.append("Add uppercase letters")

        if not re.search(r'[a-z]', password):
            suggestions.append("Add lowercase letters")

        if not re.search(r'\d', password):
            suggestions.append("Add numbers")

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            suggestions.append("Add special characters like !@#$%^&*")

        if password.lower() in PasswordValidator.COMMON_PASSWORDS:
            suggestions.append("Avoid common passwords")

        if re.search(r'(123|abc|qwe)', password.lower()):
            suggestions.append("Avoid sequential patterns like 123 or abc")

        if re.search(r'(.)\1{2,}', password):
            suggestions.append("Avoid repeating characters")

        return suggestions
