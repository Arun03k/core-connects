"""
Enhanced password utilities and validation
"""
import re
import bcrypt
from typing import Tuple, List

class PasswordValidator:
    """Enhanced password validation with security requirements"""
    
    def __init__(self):
        self.MIN_LENGTH = 8
        self.MAX_LENGTH = 128
        
        # Password patterns
        self.patterns = {
            'uppercase': re.compile(r'[A-Z]'),
            'lowercase': re.compile(r'[a-z]'),
            'digit': re.compile(r'\d'),
            'special': re.compile(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]'),
            'common_sequences': [
                re.compile(r'123'),
                re.compile(r'abc', re.IGNORECASE),
                re.compile(r'qwe', re.IGNORECASE),
                re.compile(r'password', re.IGNORECASE),
                re.compile(r'admin', re.IGNORECASE),
            ]
        }
        
        # Common passwords to reject
        self.common_passwords = {
            'password', 'password123', '123456', '123456789', 'qwerty',
            'abc123', 'password1', 'admin', 'letmein', 'welcome',
            '1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
            'iloveyou', 'princess', 'rockyou', 'nicole', 'daniel',
            'babygirl', 'monkey', 'lovely', 'jessica', '654321',
            'michael', 'ashley', 'qwerty123', 'hello', 'amanda',
            'passw0rd', '12345678', 'superman', 'baseball',
        }
    
    def validate_password(self, password: str) -> Tuple[bool, List[str]]:
        """
        Validate password strength
        Returns: (is_valid, list_of_errors)
        """
        errors = []
        
        # Length check
        if len(password) < self.MIN_LENGTH:
            errors.append(f"Password must be at least {self.MIN_LENGTH} characters long")
        
        if len(password) > self.MAX_LENGTH:
            errors.append(f"Password must be no more than {self.MAX_LENGTH} characters long")
        
        # Character requirements
        if not self.patterns['uppercase'].search(password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not self.patterns['lowercase'].search(password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not self.patterns['digit'].search(password):
            errors.append("Password must contain at least one number")
        
        if not self.patterns['special'].search(password):
            errors.append("Password must contain at least one special character")
        
        # Common password check
        if password.lower() in self.common_passwords:
            errors.append("Password is too common. Please choose a more secure password")
        
        # Common sequence check
        for pattern in self.patterns['common_sequences']:
            if pattern.search(password):
                errors.append("Password contains common sequences. Please choose a more complex password")
                break
        
        # Repeated characters check
        if self._has_repeated_characters(password):
            errors.append("Password contains too many repeated characters")
        
        return len(errors) == 0, errors
    
    def _has_repeated_characters(self, password: str, max_repeats: int = 3) -> bool:
        """Check if password has too many repeated characters"""
        for i in range(len(password) - max_repeats + 1):
            char = password[i]
            count = 1
            for j in range(i + 1, min(i + max_repeats, len(password))):
                if password[j] == char:
                    count += 1
                else:
                    break
            if count >= max_repeats:
                return True
        return False
    
    def get_password_strength_score(self, password: str) -> Tuple[int, str]:
        """
        Calculate password strength score
        Returns: (score_out_of_100, strength_label)
        """
        score = 0
        
        # Length scoring
        if len(password) >= self.MIN_LENGTH:
            score += 20
            if len(password) >= 12:
                score += 10
            if len(password) >= 16:
                score += 10
        
        # Character variety scoring
        if self.patterns['uppercase'].search(password):
            score += 15
        if self.patterns['lowercase'].search(password):
            score += 15
        if self.patterns['digit'].search(password):
            score += 15
        if self.patterns['special'].search(password):
            score += 15
        
        # Additional complexity scoring
        unique_chars = len(set(password))
        if unique_chars >= len(password) * 0.7:  # 70% unique characters
            score += 10
        
        # Penalty for common passwords
        if password.lower() in self.common_passwords:
            score -= 30
        
        # Penalty for repeated characters
        if self._has_repeated_characters(password):
            score -= 10
        
        # Ensure score is within bounds
        score = max(0, min(100, score))
        
        # Determine strength label
        if score < 30:
            strength = "Very Weak"
        elif score < 50:
            strength = "Weak"
        elif score < 70:
            strength = "Fair"
        elif score < 90:
            strength = "Strong"
        else:
            strength = "Very Strong"
        
        return score, strength
    
    def generate_password_suggestions(self) -> List[str]:
        """Generate password suggestions"""
        import secrets
        import string
        
        suggestions = []
        
        for _ in range(3):
            # Generate a secure random password
            length = secrets.randbelow(5) + 12  # 12-16 characters
            
            # Ensure we have each required character type
            password_chars = []
            
            # Add at least one of each required type
            password_chars.append(secrets.choice(string.ascii_uppercase))
            password_chars.append(secrets.choice(string.ascii_lowercase))
            password_chars.append(secrets.choice(string.digits))
            password_chars.append(secrets.choice('!@#$%^&*(),.?":{}|<>'))
            
            # Fill the rest randomly
            all_chars = string.ascii_letters + string.digits + '!@#$%^&*(),.?":{}|<>'
            for _ in range(length - 4):
                password_chars.append(secrets.choice(all_chars))
            
            # Shuffle the characters
            import random
            random.shuffle(password_chars)
            
            suggestions.append(''.join(password_chars))
        
        return suggestions

class PasswordHasher:
    """Enhanced password hashing utilities"""
    
    @staticmethod
    def hash_password(password: str, rounds: int = 12) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt(rounds=rounds)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def needs_rehash(hashed: str, rounds: int = 12) -> bool:
        """Check if password hash needs to be updated"""
        try:
            # Extract rounds from hash
            parts = hashed.split('$')
            if len(parts) >= 3 and parts[1] == '2b':
                current_rounds = int(parts[2])
                return current_rounds < rounds
        except (ValueError, IndexError):
            pass
        return True

# Global instances
password_validator = PasswordValidator()
password_hasher = PasswordHasher()
