---
name: Database Setup and Schema Design
about: PostgreSQL Integration with SQLAlchemy ORM, complete schema design for users/sessions/profiles, Docker integration, and migration system
title: '🗄️ Database Setup: PostgreSQL Integration with User Management Schema'
labels: ['enhancement', 'backend', 'database', 'high-priority']
assignees: ''

---

## Overview
Implement PostgreSQL database integration for CoreConnect with proper user management schema, connection pooling, and migration system.

## Current Status
- ✅ Flask backend framework in place
- ✅ Basic API endpoints structure
- ❌ No database integration
- ❌ No user persistence
- ❌ No data models

## Requirements

### Database Setup
- [ ] PostgreSQL database configuration
- [ ] Database connection pooling with SQLAlchemy
- [ ] Environment-based configuration (dev/prod)
- [ ] Database migration system with Flask-Migrate
- [ ] Connection health checks

### Core Schema Design
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- User sessions/tokens
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User profiles (extended information)
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    bio TEXT,
    department VARCHAR(100),
    position VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Technical Implementation
- [ ] Flask-SQLAlchemy ORM setup
- [ ] Database models for Users, UserSessions, UserProfiles
- [ ] Database connection configuration
- [ ] Migration scripts
- [ ] Seed data for testing

### File Structure
```
backend/
├── models/
│   ├── __init__.py
│   ├── user.py           # User model
│   ├── user_session.py   # Session model
│   └── user_profile.py   # Profile model
├── database/
│   ├── __init__.py
│   ├── connection.py     # DB connection setup
│   └── migrations/       # Migration files
├── config.py             # Updated with DB config
└── requirements.txt      # Add DB dependencies
```

### Dependencies to Add
```txt
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
psycopg2-binary==2.9.7
python-decouple==3.8
```

### Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/coreconnect
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coreconnect
DB_USER=coreconnect_user
DB_PASSWORD=secure_password

# Development
DEV_DATABASE_URL=postgresql://username:password@localhost:5432/coreconnect_dev

# Production
PROD_DATABASE_URL=postgresql://username:password@prod-host:5432/coreconnect_prod
```

### Docker Integration
- [ ] PostgreSQL service in docker-compose.yml
- [ ] Database initialization scripts
- [ ] Volume persistence for data
- [ ] Health checks for database service

## Acceptance Criteria
- [ ] PostgreSQL database runs in Docker container
- [ ] Database models are properly defined with relationships
- [ ] Migration system works (create/migrate/rollback)
- [ ] Database connection is properly configured for all environments
- [ ] Health check endpoint includes database status
- [ ] Seed script creates test users
- [ ] All database operations are tested

## Testing Requirements
- [ ] Unit tests for database models
- [ ] Integration tests for database operations
- [ ] Migration testing
- [ ] Connection pooling tests

## Implementation Dependencies
None - this is the foundation issue that other issues depend on.

## Priority
🔥 **HIGH** - This is the foundation for all other features