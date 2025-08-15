"""
Input validation utilities for API endpoints
"""
import re
from typing import Dict, Any, List, Optional, Union
import email_validator
from flask import request

class InputValidator:
    """Comprehensive input validation for API requests"""
    
    def __init__(self):
        self.email_regex = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        self.phone_regex = re.compile(r'^\+?1?-?\.?\s?\(?([0-9]{3})\)?[-\.\s]?([0-9]{3})[-\.\s]?([0-9]{4})$')
        self.username_regex = re.compile(r'^[a-zA-Z0-9_]{3,30}$')
        
        # Dangerous patterns to reject
        self.dangerous_patterns = [
            re.compile(r'<script', re.IGNORECASE),
            re.compile(r'javascript:', re.IGNORECASE),
            re.compile(r'on\w+\s*=', re.IGNORECASE),
            re.compile(r'expression\s*\(', re.IGNORECASE),
            re.compile(r'vbscript:', re.IGNORECASE),
            re.compile(r'data:text/html', re.IGNORECASE),
        ]
    
    def validate_email(self, email: str, required: bool = True) -> Dict[str, Any]:
        """Validate email address"""
        if not email and not required:
            return {'valid': True, 'value': None}
        
        if not email:
            return {'valid': False, 'error': 'Email is required'}
        
        if not isinstance(email, str):
            return {'valid': False, 'error': 'Email must be a string'}
        
        email = email.strip().lower()
        
        if len(email) > 320:  # RFC 5321 limit
            return {'valid': False, 'error': 'Email address is too long'}
        
        if not self.email_regex.match(email):
            return {'valid': False, 'error': 'Invalid email format'}
        
        # Use email-validator library for more thorough validation
        try:
            validated_email = email_validator.validate_email(email)
            return {'valid': True, 'value': validated_email.email}
        except email_validator.EmailNotValidError as e:
            return {'valid': False, 'error': f'Invalid email: {str(e)}'}
    
    def validate_password(self, password: str, required: bool = True) -> Dict[str, Any]:
        """Basic password validation (detailed validation in PasswordValidator)"""
        if not password and not required:
            return {'valid': True, 'value': None}
        
        if not password:
            return {'valid': False, 'error': 'Password is required'}
        
        if not isinstance(password, str):
            return {'valid': False, 'error': 'Password must be a string'}
        
        if len(password) < 8:
            return {'valid': False, 'error': 'Password must be at least 8 characters long'}
        
        if len(password) > 128:
            return {'valid': False, 'error': 'Password is too long'}
        
        return {'valid': True, 'value': password}
    
    def validate_name(self, name: str, field_name: str = 'Name', required: bool = True, max_length: int = 50) -> Dict[str, Any]:
        """Validate name fields (first name, last name, etc.)"""
        if not name and not required:
            return {'valid': True, 'value': None}
        
        if not name:
            return {'valid': False, 'error': f'{field_name} is required'}
        
        if not isinstance(name, str):
            return {'valid': False, 'error': f'{field_name} must be a string'}
        
        name = name.strip()
        
        if len(name) == 0 and required:
            return {'valid': False, 'error': f'{field_name} cannot be empty'}
        
        if len(name) > max_length:
            return {'valid': False, 'error': f'{field_name} must be {max_length} characters or less'}
        
        # Check for dangerous content
        if self._contains_dangerous_content(name):
            return {'valid': False, 'error': f'{field_name} contains invalid characters'}
        
        # Basic name validation (letters, spaces, hyphens, apostrophes)
        name_pattern = re.compile(r"^[a-zA-Z\s'\-\.]+$")
        if name and not name_pattern.match(name):
            return {'valid': False, 'error': f'{field_name} can only contain letters, spaces, hyphens, and apostrophes'}
        
        return {'valid': True, 'value': name or None}
    
    def validate_username(self, username: str, required: bool = False) -> Dict[str, Any]:
        """Validate username"""
        if not username and not required:
            return {'valid': True, 'value': None}
        
        if not username:
            return {'valid': False, 'error': 'Username is required'}
        
        if not isinstance(username, str):
            return {'valid': False, 'error': 'Username must be a string'}
        
        username = username.strip().lower()
        
        if len(username) < 3:
            return {'valid': False, 'error': 'Username must be at least 3 characters long'}
        
        if len(username) > 30:
            return {'valid': False, 'error': 'Username must be 30 characters or less'}
        
        if not self.username_regex.match(username):
            return {'valid': False, 'error': 'Username can only contain letters, numbers, and underscores'}
        
        # Check for reserved usernames
        reserved_usernames = {
            'admin', 'administrator', 'root', 'system', 'api', 'www',
            'mail', 'email', 'test', 'demo', 'support', 'help', 'info',
            'noreply', 'no-reply', 'postmaster', 'webmaster'
        }
        
        if username in reserved_usernames:
            return {'valid': False, 'error': 'This username is reserved and cannot be used'}
        
        return {'valid': True, 'value': username}
    
    def validate_phone(self, phone: str, required: bool = False) -> Dict[str, Any]:
        """Validate phone number"""
        if not phone and not required:
            return {'valid': True, 'value': None}
        
        if not phone:
            return {'valid': False, 'error': 'Phone number is required'}
        
        if not isinstance(phone, str):
            return {'valid': False, 'error': 'Phone number must be a string'}
        
        phone = phone.strip()
        
        if not self.phone_regex.match(phone):
            return {'valid': False, 'error': 'Invalid phone number format'}
        
        return {'valid': True, 'value': phone}
    
    def validate_text_field(self, text: str, field_name: str, required: bool = True, 
                           max_length: int = 1000, min_length: int = 0) -> Dict[str, Any]:
        """Validate general text fields"""
        if not text and not required:
            return {'valid': True, 'value': None}
        
        if not text and required:
            return {'valid': False, 'error': f'{field_name} is required'}
        
        if not isinstance(text, str):
            return {'valid': False, 'error': f'{field_name} must be a string'}
        
        text = text.strip()
        
        if len(text) < min_length and required:
            return {'valid': False, 'error': f'{field_name} must be at least {min_length} characters long'}
        
        if len(text) > max_length:
            return {'valid': False, 'error': f'{field_name} must be {max_length} characters or less'}
        
        if self._contains_dangerous_content(text):
            return {'valid': False, 'error': f'{field_name} contains invalid content'}
        
        return {'valid': True, 'value': text or None}
    
    def validate_url(self, url: str, required: bool = False) -> Dict[str, Any]:
        """Validate URL"""
        if not url and not required:
            return {'valid': True, 'value': None}
        
        if not url:
            return {'valid': False, 'error': 'URL is required'}
        
        if not isinstance(url, str):
            return {'valid': False, 'error': 'URL must be a string'}
        
        url = url.strip()
        
        # Basic URL validation
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # IP
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(url):
            return {'valid': False, 'error': 'Invalid URL format'}
        
        return {'valid': True, 'value': url}
    
    def _contains_dangerous_content(self, text: str) -> bool:
        """Check if text contains dangerous patterns"""
        if not text:
            return False
        
        for pattern in self.dangerous_patterns:
            if pattern.search(text):
                return True
        
        return False
    
    def sanitize_input(self, text: str) -> str:
        """Basic input sanitization"""
        if not text:
            return text
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    def validate_registration_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate user registration data"""
        errors = {}
        cleaned_data = {}
        
        # Email validation
        email_result = self.validate_email(data.get('email'), required=True)
        if email_result['valid']:
            cleaned_data['email'] = email_result['value']
        else:
            errors['email'] = email_result['error']
        
        # Password validation
        password_result = self.validate_password(data.get('password'), required=True)
        if password_result['valid']:
            cleaned_data['password'] = password_result['value']
        else:
            errors['password'] = password_result['error']
        
        # First name validation
        first_name_result = self.validate_name(data.get('firstName') or data.get('first_name'), 'First name', required=False)
        if first_name_result['valid']:
            cleaned_data['first_name'] = first_name_result['value']
        else:
            errors['firstName'] = first_name_result['error']
        
        # Last name validation
        last_name_result = self.validate_name(data.get('lastName') or data.get('last_name'), 'Last name', required=False)
        if last_name_result['valid']:
            cleaned_data['last_name'] = last_name_result['value']
        else:
            errors['lastName'] = last_name_result['error']
        
        # Username validation
        username_result = self.validate_username(data.get('username'), required=False)
        if username_result['valid']:
            cleaned_data['username'] = username_result['value']
        else:
            errors['username'] = username_result['error']
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'data': cleaned_data
        }
    
    def validate_login_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate user login data"""
        errors = {}
        cleaned_data = {}
        
        # Email validation
        email_result = self.validate_email(data.get('email'), required=True)
        if email_result['valid']:
            cleaned_data['email'] = email_result['value']
        else:
            errors['email'] = email_result['error']
        
        # Password validation (just check if present)
        password = data.get('password')
        if not password:
            errors['password'] = 'Password is required'
        elif not isinstance(password, str):
            errors['password'] = 'Password must be a string'
        else:
            cleaned_data['password'] = password
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'data': cleaned_data
        }

# Global validator instance
input_validator = InputValidator()
