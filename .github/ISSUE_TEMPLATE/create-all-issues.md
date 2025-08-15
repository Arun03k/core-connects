# Bulk Issue Creation Guide

This guide provides multiple methods to create all CoreConnect development issues at once.

## Method 1: GitHub CLI (Recommended)

### Prerequisites
- Install [GitHub CLI](https://cli.github.com/)
- Authenticate: `gh auth login`

### Bulk Creation Script

```bash
#!/bin/bash
# create-issues.sh

REPO="Arun03k/core-connects"

# Issue 1: Database Setup
gh issue create \
  --repo "$REPO" \
  --title "🗄️ Database Setup: PostgreSQL Integration with User Management Schema" \
  --label "enhancement,backend,database,high-priority" \
  --body-file ".github/ISSUE_TEMPLATE/01-database-setup.md"

# Issue 2: Authentication System  
gh issue create \
  --repo "$REPO" \
  --title "🔐 Authentication System: JWT-based Login/Signup with Password Security" \
  --label "enhancement,backend,frontend,security,high-priority" \
  --body-file ".github/ISSUE_TEMPLATE/02-authentication-system.md"

# Issue 3: User Profile Management
gh issue create \
  --repo "$REPO" \
  --title "👤 User Profile Management: Dashboard and Profile CRUD Operations" \
  --label "enhancement,frontend,backend,user-experience" \
  --body-file ".github/ISSUE_TEMPLATE/03-user-profile-management.md"

# Issue 4: Security Hardening
gh issue create \
  --repo "$REPO" \
  --title "🛡️ Security Hardening: Production Security and Monitoring" \
  --label "security,production,monitoring,high-priority" \
  --body-file ".github/ISSUE_TEMPLATE/04-security-hardening.md"

echo "All CoreConnect development issues created successfully!"
```

### Usage
```bash
# Make script executable
chmod +x create-issues.sh

# Run the script
./create-issues.sh
```

## Method 2: GitHub REST API

### Using curl
```bash
#!/bin/bash
# create-issues-api.sh

REPO="Arun03k/core-connects"
TOKEN="your_github_token"  # Replace with your token

# Function to create issue
create_issue() {
  local title="$1"
  local body_file="$2" 
  local labels="$3"
  
  local body=$(cat "$body_file")
  
  curl -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$REPO/issues" \
    -d "{
      \"title\": \"$title\",
      \"body\": $(echo "$body" | jq -R -s .),
      \"labels\": [$(echo "$labels" | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
      \"assignees\": []
    }"
}

# Create all issues
create_issue "🗄️ Database Setup: PostgreSQL Integration with User Management Schema" \
  ".github/ISSUE_TEMPLATE/01-database-setup.md" \
  "enhancement,backend,database,high-priority"

create_issue "🔐 Authentication System: JWT-based Login/Signup with Password Security" \
  ".github/ISSUE_TEMPLATE/02-authentication-system.md" \
  "enhancement,backend,frontend,security,high-priority"

create_issue "👤 User Profile Management: Dashboard and Profile CRUD Operations" \
  ".github/ISSUE_TEMPLATE/03-user-profile-management.md" \
  "enhancement,frontend,backend,user-experience"

create_issue "🛡️ Security Hardening: Production Security and Monitoring" \
  ".github/ISSUE_TEMPLATE/04-security-hardening.md" \
  "security,production,monitoring,high-priority"
```

## Method 3: Manual Creation Checklist

If you prefer to create issues manually, follow this checklist:

### Issue #1: Database Setup
- [ ] Go to [GitHub Issues](https://github.com/Arun03k/core-connects/issues/new)
- [ ] Title: `🗄️ Database Setup: PostgreSQL Integration with User Management Schema`
- [ ] Copy content from `01-database-setup.md`
- [ ] Add labels: `enhancement`, `backend`, `database`, `high-priority`
- [ ] Submit issue

### Issue #2: Authentication System
- [ ] Go to [GitHub Issues](https://github.com/Arun03k/core-connects/issues/new)
- [ ] Title: `🔐 Authentication System: JWT-based Login/Signup with Password Security`
- [ ] Copy content from `02-authentication-system.md`
- [ ] Add labels: `enhancement`, `backend`, `frontend`, `security`, `high-priority`
- [ ] Submit issue

### Issue #3: User Profile Management
- [ ] Go to [GitHub Issues](https://github.com/Arun03k/core-connects/issues/new)
- [ ] Title: `👤 User Profile Management: Dashboard and Profile CRUD Operations`
- [ ] Copy content from `03-user-profile-management.md`
- [ ] Add labels: `enhancement`, `frontend`, `backend`, `user-experience`
- [ ] Submit issue

### Issue #4: Security Hardening
- [ ] Go to [GitHub Issues](https://github.com/Arun03k/core-connects/issues/new)
- [ ] Title: `🛡️ Security Hardening: Production Security and Monitoring`
- [ ] Copy content from `04-security-hardening.md`
- [ ] Add labels: `security`, `production`, `monitoring`, `high-priority`
- [ ] Submit issue

## Method 4: Python Script

```python
#!/usr/bin/env python3
# create_issues.py

import requests
import json
import os

REPO = "Arun03k/core-connects"
TOKEN = os.environ.get('GITHUB_TOKEN')  # Set as environment variable

def create_issue(title, body_file, labels):
    """Create a GitHub issue"""
    
    with open(body_file, 'r') as f:
        body = f.read()
    
    url = f"https://api.github.com/repos/{REPO}/issues"
    headers = {
        'Authorization': f'token {TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    data = {
        'title': title,
        'body': body,
        'labels': labels.split(',')
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        issue_data = response.json()
        print(f"✅ Created issue #{issue_data['number']}: {title}")
        return issue_data['number']
    else:
        print(f"❌ Failed to create issue: {title}")
        print(f"Error: {response.text}")
        return None

def main():
    """Create all CoreConnect issues"""
    
    if not TOKEN:
        print("❌ GitHub token not found. Set GITHUB_TOKEN environment variable.")
        return
    
    issues = [
        {
            'title': '🗄️ Database Setup: PostgreSQL Integration with User Management Schema',
            'file': '.github/ISSUE_TEMPLATE/01-database-setup.md',
            'labels': 'enhancement,backend,database,high-priority'
        },
        {
            'title': '🔐 Authentication System: JWT-based Login/Signup with Password Security',
            'file': '.github/ISSUE_TEMPLATE/02-authentication-system.md',
            'labels': 'enhancement,backend,frontend,security,high-priority'
        },
        {
            'title': '👤 User Profile Management: Dashboard and Profile CRUD Operations',
            'file': '.github/ISSUE_TEMPLATE/03-user-profile-management.md',
            'labels': 'enhancement,frontend,backend,user-experience'
        },
        {
            'title': '🛡️ Security Hardening: Production Security and Monitoring',
            'file': '.github/ISSUE_TEMPLATE/04-security-hardening.md',
            'labels': 'security,production,monitoring,high-priority'
        }
    ]
    
    created_issues = []
    
    for issue in issues:
        issue_number = create_issue(issue['title'], issue['file'], issue['labels'])
        if issue_number:
            created_issues.append(issue_number)
    
    print(f"\n🎉 Successfully created {len(created_issues)} issues!")
    print(f"Issue numbers: {', '.join([f'#{num}' for num in created_issues])}")

if __name__ == "__main__":
    main()
```

### Usage
```bash
# Set your GitHub token
export GITHUB_TOKEN="your_github_token"

# Run the script
python create_issues.py
```

## Verification

After creating the issues, verify they were created correctly:

```bash
# List recent issues
gh issue list --repo Arun03k/core-connects --limit 10

# Or check in browser
open https://github.com/Arun03k/core-connects/issues
```

## Issue Management

### Prioritization
The issues should be worked on in this order:
1. Database Setup (#1) - Foundation
2. Authentication System (#2) - Core functionality
3. User Profile Management (#3) - User experience
4. Security Hardening (#4) - Production readiness

### Project Board Setup
Consider creating a GitHub Project board with columns:
- 📋 **Backlog** - All issues
- 🔄 **In Progress** - Currently working
- 👀 **Review** - Ready for review
- ✅ **Done** - Completed

### Milestone Creation
Create milestones for better tracking:
- **Phase 1: Foundation** (Issues #1, #2)
- **Phase 2: User Experience** (Issue #3)
- **Phase 3: Production Ready** (Issue #4)

---

**Note**: Replace `your_github_token` with an actual GitHub personal access token with appropriate permissions to create issues in the repository.