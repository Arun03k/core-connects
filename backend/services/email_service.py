"""
Email service for sending authentication-related emails
"""

import logging
import smtplib
from typing import Any, Dict, Optional

try:
    from email.mime.multipart import MIMEMultipart as MimeMultipart
    from email.mime.text import MIMEText as MimeText
except ImportError:
    from email.mime.text import MimeText
    from email.mime.multipart import MimeMultipart

from flask import current_app

logger = logging.getLogger(__name__)


class EmailService:
    """Email service for authentication and notifications"""

    def __init__(self):
        self.smtp_server = None
        self.smtp_port = None
        self.username = None
        self.password = None
        self.use_tls = True
        self.from_email = None
        self.from_name = "CoreConnect"

        self._load_config()

    def _load_config(self):
        """Load email configuration from app config"""
        try:
            self.smtp_server = current_app.config.get("MAIL_SERVER", "smtp.gmail.com")
            self.smtp_port = current_app.config.get("MAIL_PORT", 587)
            self.username = current_app.config.get("MAIL_USERNAME")
            self.password = current_app.config.get("MAIL_PASSWORD")
            self.use_tls = current_app.config.get("MAIL_USE_TLS", True)
            self.from_email = self.username or current_app.config.get(
                "MAIL_DEFAULT_SENDER"
            )
        except Exception as e:
            logger.warning(f"Email configuration not fully loaded: {str(e)}")

    def _create_smtp_connection(self):
        """Create SMTP connection"""
        if not all([self.smtp_server, self.username, self.password]):
            raise Exception("Email configuration is incomplete")

        server = smtplib.SMTP(self.smtp_server, self.smtp_port)

        if self.use_tls:
            server.starttls()

        server.login(self.username, self.password)
        return server

    def send_email(
        self, to_email: str, subject: str, html_content: str, text_content: str = None
    ) -> bool:
        """Send email with HTML and optional text content"""
        try:
            msg = MimeMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email

            # Add text content if provided
            if text_content:
                text_part = MimeText(text_content, "plain")
                msg.attach(text_part)

            # Add HTML content
            html_part = MimeText(html_content, "html")
            msg.attach(html_part)

            # Send email
            server = self._create_smtp_connection()
            server.send_message(msg)
            server.quit()

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    def send_verification_email(
        self, user_email: str, user_name: str, verification_token: str
    ) -> bool:
        """Send email verification email"""
        try:
            base_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
            verification_url = f"{base_url}/verify-email/{verification_token}"

            subject = "Verify Your CoreConnect Account"

            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Account</title>
                <style>
                    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: white; }}
                    .header {{ background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; padding: 40px 20px; text-align: center; }}
                    .content {{ padding: 40px 20px; }}
                    .button {{ display: inline-block; background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }}
                    .logo {{ font-size: 28px; font-weight: 700; margin-bottom: 10px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">CoreConnect</div>
                        <h1 style="margin: 0; font-size: 24px;">Welcome to CoreConnect!</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #333; margin-bottom: 20px;">Hi {user_name or 'there'}!</h2>
                        
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            Thank you for signing up for CoreConnect! To complete your registration and start using our workforce management platform, please verify your email address.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verification_url}" class="button" style="color: white;">Verify Email Address</a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            If the button above doesn't work, you can copy and paste this link into your browser:<br>
                            <a href="{verification_url}" style="color: #1976d2; word-break: break-all;">{verification_url}</a>
                        </p>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            <strong>Note:</strong> This verification link will expire in 24 hours for security reasons.
                        </p>
                        
                        <p style="color: #666; font-size: 14px;">
                            If you didn't create an account with CoreConnect, please ignore this email.
                        </p>
                    </div>
                    <div class="footer">
                        <p style="margin: 0;">© 2025 CoreConnect. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">Modern Workforce Management Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """

            text_content = f"""
            Welcome to CoreConnect!
            
            Hi {user_name or 'there'}!
            
            Thank you for signing up for CoreConnect! To complete your registration, please verify your email address by clicking the link below:
            
            {verification_url}
            
            This verification link will expire in 24 hours.
            
            If you didn't create an account with CoreConnect, please ignore this email.
            
            © 2025 CoreConnect. All rights reserved.
            """

            return self.send_email(user_email, subject, html_content, text_content)

        except Exception as e:
            logger.error(f"Failed to send verification email: {str(e)}")
            return False

    def send_password_reset_email(
        self, user_email: str, user_name: str, reset_token: str
    ) -> bool:
        """Send password reset email"""
        try:
            base_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
            reset_url = f"{base_url}/reset-password/{reset_token}"

            subject = "Reset Your CoreConnect Password"

            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>
                    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: white; }}
                    .header {{ background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%); color: white; padding: 40px 20px; text-align: center; }}
                    .content {{ padding: 40px 20px; }}
                    .button {{ display: inline-block; background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }}
                    .logo {{ font-size: 28px; font-weight: 700; margin-bottom: 10px; }}
                    .warning {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">CoreConnect</div>
                        <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #333; margin-bottom: 20px;">Hi {user_name or 'there'}!</h2>
                        
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            We received a request to reset your CoreConnect password. If you made this request, click the button below to set a new password.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{reset_url}" class="button" style="color: white;">Reset Password</a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            If the button above doesn't work, you can copy and paste this link into your browser:<br>
                            <a href="{reset_url}" style="color: #d32f2f; word-break: break-all;">{reset_url}</a>
                        </p>
                        
                        <div class="warning">
                            <strong>Security Notice:</strong> This password reset link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                        </div>
                    </div>
                    <div class="footer">
                        <p style="margin: 0;">© 2025 CoreConnect. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">Modern Workforce Management Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """

            text_content = f"""
            Password Reset Request - CoreConnect
            
            Hi {user_name or 'there'}!
            
            We received a request to reset your CoreConnect password. If you made this request, use the link below to set a new password:
            
            {reset_url}
            
            This password reset link will expire in 1 hour for security reasons.
            
            If you didn't request a password reset, please ignore this email.
            
            © 2025 CoreConnect. All rights reserved.
            """

            return self.send_email(user_email, subject, html_content, text_content)

        except Exception as e:
            logger.error(f"Failed to send password reset email: {str(e)}")
            return False

    def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email after successful verification"""
        try:
            base_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
            dashboard_url = f"{base_url}/dashboard"

            subject = "Welcome to CoreConnect - Your Account is Ready!"

            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to CoreConnect</title>
                <style>
                    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: white; }}
                    .header {{ background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); color: white; padding: 40px 20px; text-align: center; }}
                    .content {{ padding: 40px 20px; }}
                    .button {{ display: inline-block; background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }}
                    .logo {{ font-size: 28px; font-weight: 700; margin-bottom: 10px; }}
                    .feature {{ margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">CoreConnect</div>
                        <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to CoreConnect!</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #333; margin-bottom: 20px;">Hi {user_name or 'there'}!</h2>
                        
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            Congratulations! Your CoreConnect account has been successfully verified and is ready to use. You now have access to our comprehensive workforce management platform.
                        </p>
                        
                        <h3 style="color: #1976d2; margin-top: 30px;">What you can do now:</h3>
                        
                        <div class="feature">
                            <strong>📊 Dashboard:</strong> View your personalized dashboard with key metrics and updates
                        </div>
                        
                        <div class="feature">
                            <strong>👤 Profile Management:</strong> Update your profile and preferences
                        </div>
                        
                        <div class="feature">
                            <strong>⏱️ Time Tracking:</strong> Clock in/out and manage your work hours (coming soon)
                        </div>
                        
                        <div class="feature">
                            <strong>🌴 Leave Management:</strong> Request and manage your time off (coming soon)
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{dashboard_url}" class="button" style="color: white;">Go to Dashboard</a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">
                            If you have any questions or need help getting started, feel free to explore our documentation or contact our support team.
                        </p>
                    </div>
                    <div class="footer">
                        <p style="margin: 0;">© 2025 CoreConnect. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">Modern Workforce Management Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """

            return self.send_email(user_email, subject, html_content)

        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
            return False
