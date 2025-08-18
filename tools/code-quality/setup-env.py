#!/usr/bin/env python3
"""
🔧 Interactive .env Setup Script
This script will help you complete your .env file step by step
"""

import os
import re
from pathlib import Path

def get_user_input(prompt, default=None, mask=False):
    """Get user input with optional default and masking"""
    if default:
        full_prompt = f"{prompt} [{default}]: "
    else:
        full_prompt = f"{prompt}: "
    
    if mask:
        import getpass
        value = getpass.getpass(full_prompt)
    else:
        value = input(full_prompt).strip()
    
    return value if value else default

def validate_mongodb_uri(uri):
    """Validate MongoDB URI format"""
    pattern = r'^mongodb(\+srv)?://[^:]+:[^@]+@[^/]+\.[^/]+/[^?]+\?.*$'
    return bool(re.match(pattern, uri))

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def update_env_file():
    """Interactive .env file setup"""
    print("🔧 CoreConnect .env File Setup")
    print("=" * 50)
    print("This script will help you complete your .env file with real credentials.")
    print("Your inputs will be securely stored in backend/.env")
    print()
    
    env_path = Path("backend/.env")
    if not env_path.exists():
        print("❌ backend/.env file not found!")
        print("💡 Make sure you're running this from the project root directory")
        return False
    
    # Read current .env file
    with open(env_path, 'r') as f:
        content = f.read()
    
    print("📋 Current setup status:")
    has_mongo = "YOUR_USERNAME" not in content
    has_email = "your-development-email@gmail.com" not in content
    
    print(f"   MongoDB: {'✅ Configured' if has_mongo else '❌ Needs setup'}")
    print(f"   Email:   {'✅ Configured' if has_email else '❌ Needs setup'}")
    print()
    
    # MongoDB Setup
    if not has_mongo:
        print("🗄️ MONGODB ATLAS SETUP")
        print("-" * 30)
        print("First, make sure you have:")
        print("1. Created a MongoDB Atlas account (free)")
        print("2. Created a database user")
        print("3. Added your IP to Network Access")
        print()
        
        setup_mongo = get_user_input("Have you completed MongoDB Atlas setup? (y/n)", "n").lower()
        
        if setup_mongo == 'y':
            mongo_username = get_user_input("MongoDB Username")
            mongo_password = get_user_input("MongoDB Password", mask=True)
            mongo_cluster = get_user_input("MongoDB Cluster (e.g., cluster0.abcde)")
            
            if mongo_username and mongo_password and mongo_cluster:
                mongo_uri = f"mongodb+srv://{mongo_username}:{mongo_password}@{mongo_cluster}.mongodb.net/coreconnect_dev?retryWrites=true&w=majority"
                
                if validate_mongodb_uri(mongo_uri):
                    # Update MongoDB URI
                    old_pattern = r'MONGO_URI=mongodb\+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER\.mongodb\.net/coreconnect_dev\?retryWrites=true&w=majority'
                    content = re.sub(old_pattern, f'MONGO_URI={mongo_uri}', content)
                    print("✅ MongoDB configuration updated!")
                else:
                    print("⚠️ MongoDB URI format seems incorrect, but continuing...")
        else:
            print("📋 Please complete MongoDB Atlas setup first:")
            print("   1. Visit: https://cloud.mongodb.com/")
            print("   2. Create account and free cluster")
            print("   3. Create database user")
            print("   4. Add IP to Network Access")
            print("   5. Run this script again")
            print()
    
    # Email Setup
    if not has_email:
        print("📧 GMAIL SETUP")
        print("-" * 20)
        print("For email features (registration, password reset):")
        print("1. Enable 2-Factor Authentication on Gmail")
        print("2. Generate App Password (not your regular password)")
        print()
        
        setup_email = get_user_input("Do you want to setup email features? (y/n)", "y").lower()
        
        if setup_email == 'y':
            email_address = get_user_input("Gmail Address")
            
            if email_address and validate_email(email_address):
                print("Now you need your Gmail App Password:")
                print("1. Go to Google Account Settings → Security")
                print("2. App passwords → Generate for Mail")
                print("3. Copy the 16-character password (remove spaces)")
                print()
                
                app_password = get_user_input("Gmail App Password (16 chars)", mask=True)
                
                if app_password and len(app_password.replace(" ", "")) >= 16:
                    # Clean app password
                    clean_password = app_password.replace(" ", "").replace("-", "")
                    
                    # Update email settings
                    content = re.sub(r'MAIL_USERNAME=your-development-email@gmail\.com', f'MAIL_USERNAME={email_address}', content)
                    content = re.sub(r'MAIL_PASSWORD=your-16-character-app-password', f'MAIL_PASSWORD={clean_password}', content)
                    content = re.sub(r'MAIL_DEFAULT_SENDER=your-development-email@gmail\.com', f'MAIL_DEFAULT_SENDER={email_address}', content)
                    print("✅ Email configuration updated!")
                else:
                    print("⚠️ App password seems too short, please verify")
            else:
                print("⚠️ Invalid email format")
        else:
            print("⚠️ Email features will be disabled (registration won't work)")
    
    # Write updated .env file
    with open(env_path, 'w') as f:
        f.write(content)
    
    print()
    print("🎉 .env file updated successfully!")
    print("📁 Location: backend/.env")
    print()
    print("🔍 Next steps:")
    print("1. Run: cd backend && python validate-env.py")
    print("2. Run: python app.py")
    print("3. Start frontend: cd frontend && npm run dev")
    
    return True

if __name__ == "__main__":
    try:
        if update_env_file():
            print("\n✅ Setup complete! Your application is ready to run.")
        else:
            print("\n❌ Setup failed. Please check the instructions above.")
    except KeyboardInterrupt:
        print("\n\n👋 Setup cancelled by user.")
    except Exception as e:
        print(f"\n❌ Error during setup: {str(e)}")
        print("💡 Please check the COMPLETE-ENV-GUIDE.md for manual setup instructions.")
