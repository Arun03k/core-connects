# CoreConnect

CoreConnect is a workforce-management platform in development. The repository
currently provides a React/TypeScript interface and a Flask/MongoDB authentication
foundation. Employee operations and workforce workflows are the next increment.

See [the repository audit and five-phase plan](docs/PROJECT_AUDIT.md) for the
source-based assessment and [Phase 1 notes](docs/PHASE_1.md) for changes and limits.

## Features

Implemented:

- Landing page, documentation, sign-in, registration and password-recovery forms.
- Bcrypt password hashing, signed access tokens, stored refresh-token revocation,
  email verification, password reset, profile and password-change APIs.
- Access-token type checks and database-backed ADMIN/HR/MANAGER/EMPLOYEE policies.
  Existing lowercase roles are supported; absent/unknown roles resolve to EMPLOYEE.
- Authenticated-only profiles, ADMIN/HR statistics, and ADMIN operational status.
- Frontend session verification on reload with refresh recovery and loading state.
- Exact-origin CORS, production secret validation, request size/type validation,
  persistent rate limits and sanitized health/error responses.
- Isolated backend regression tests and frontend session tests.

Not implemented yet: employee directory, organization/team management, attendance,
leave, tasks, announcements, notifications, reports, administrative audit logs,
AI workflows, and demo seed data. The dashboard is still a placeholder.

## Screenshots

Screenshots will be added with the workforce application shell in Phase 3.

## Architecture

```text
React + Redux + Material UI
          |
       Flask API
          |
     Auth services
          |
  PyMongo -> MongoDB
```

MongoDB is the existing database and is preserved. The app uses one lazy connection
pool per Flask application. The API retains `/api/auth` for compatibility; business
modules can introduce `/api/v1` without breaking current clients. AI is planned,
not connected to the current application.

## Tech stack

React 19, TypeScript, Vite, Material UI, Redux Toolkit, React Router, Flask,
PyMongo/MongoDB, bcrypt, PyJWT, pytest, mongomock and Vitest. Existing infrastructure
includes Docker, Nginx and GitHub Actions; see the deployment limitations below.

## Local setup

Use Python 3.11+ and Node 22.12+ (or Node 24). MongoDB must be available separately.
The tests do not require a running database.

From the repository root, in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements-dev.txt
Copy-Item backend/.env.example backend/.env
```

Set `MONGO_URI` and `MONGO_DBNAME` in `backend/.env` to your development database.
Apply additive authentication indexes, then start Flask:

```powershell
cd backend
..\.venv\Scripts\python.exe -m flask --app app init-db
..\.venv\Scripts\python.exe app.py
```

In a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to `http://localhost:5000`.
The app creates no demo users or privileged accounts automatically. Registration
always creates an EMPLOYEE. Privileged account provisioning needs a trusted
administrative process until the employee-management increment implements it.

On macOS/Linux, activate `.venv/bin/activate` and use `python` for the commands above.

## Environment variables

Examples are in `backend/.env.example` and `frontend/.env.example`.

| Variable | Purpose |
| --- | --- |
| FLASK_ENV | development, testing or production |
| MONGO_URI / MONGO_DBNAME | MongoDB connection and explicit database name |
| SECRET_KEY / JWT_SECRET_KEY | Independent random production secrets, at least 32 characters |
| FRONTEND_URL | Public frontend origin and base for email links |
| CORS_ORIGINS | Comma-separated exact allowed origins; no wildcard |
| JWT_ACCESS_TOKEN_EXPIRES | Access-token lifetime in seconds; default 900 |
| JWT_REFRESH_TOKEN_EXPIRES | Refresh-token lifetime in seconds; default 604800 |
| MAIL_* | SMTP configuration for verification and password recovery |
| VITE_API_URL | Optional frontend build-time API origin; empty uses same-origin /api |

Generate each production secret separately with
`python -c "import secrets; print(secrets.token_urlsafe(48))"` and store it in the
host's secret configuration. Never commit real secrets. Development signing keys
are ephemeral when not configured, so restarting invalidates existing sessions.
SMTP failure does not reveal verification/reset tokens in API responses.

## Docker setup

The existing definitions are under `config/`, for example
`docker compose -f config/docker-compose.yml config` to inspect the configuration.
They are **not yet a self-contained production launch path**: MongoDB is not wired
in, backend env configuration is required, and the backend image still uses the
Flask development server. Use manual setup for this increment. Phase 5 will make
Compose a verified launch path and introduce a production WSGI server. Do not run
the legacy volume-removal helper commands against a database you want to retain.

## Testing

From the root:

```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests -q
.\.venv\Scripts\python.exe -m flake8 backend --config=backend/config/.flake8
cd frontend
npm test
npm run lint
npm run type-check
npm run build
```

Backend tests replace MongoDB with fresh in-memory mongomock clients and suppress
SMTP. They exercise application behavior but do not certify MongoDB concurrency,
index migrations on existing data, or SMTP delivery. Frontend tests cover restored
sessions, refresh failure, offline logout and API errors. Browser accessibility
and responsive checks are planned with the application shell.

CI now installs the test dependencies, runs real frontend tests and propagates
backend test failures. Docker image publication requires the repository variable
`DOCKER_PUBLISH_ENABLED=true` and configured credentials. No deployment was run as
part of this increment. Remaining workflow/deployment cleanup is tracked in the audit.

## Project structure

```text
backend/      Flask app, auth routes/services, user model, tests
frontend/     React components/pages/theme, Redux, shared API client, tests
config/       Existing Compose configurations and MongoDB initialization script
.github/      Existing CI and security workflows
docs/         Audit, implementation notes and development documentation
scripts/      Legacy development/deployment helper scripts
deployment/   Platform deployment configuration
```

## Security and current boundaries

Permissions are enforced on the backend using current database roles, not token
role claims or hidden buttons. Public registration cannot set a role. CORS is an
origin policy, not a substitute for authentication. The API currently uses bearer
headers rather than automatically attached auth cookies, so cookie CSRF defenses
will be needed if the transport changes.

Tokens use tab-scoped sessionStorage and are verified before protected pages
render. Old persistent localStorage credentials are removed. JavaScript can still
read these tokens; an HttpOnly cookie session design with CSRF protection remains
future work. Logout/password changes revoke refresh tokens; existing access tokens
can remain valid until their 15-minute expiry. Deactivation is checked on every
protected request. TLS and trusted reverse-proxy configuration belong to deployment.
Rate limits trust the server remote address, not forwarded headers supplied by a
client. Deployments behind a proxy currently share its IP quota.

## Future improvements

Follow the five-phase plan: organization/employee domain and permissions first,
then workforce workflows, professional UI, scoped AI tools, and verified delivery.
Keep additions incremental and preserve existing accounts and database data.
