# CoreConnect repository audit — 14 September 2026

This assessment describes the repository before Phase 1 changes. Source code is
the authority; README claims and deployment badges are not runtime verification.

## Current state and reusable work

- React 19, TypeScript, Vite, Material UI, Redux Toolkit and React Router are
  already established. Preserve them and the existing theme and auth components.
- Flask has an application factory, configuration classes, auth blueprint,
  services, validators, response helpers and bcrypt-backed user persistence.
- MongoDB/PyMongo is implemented, despite the README describing PostgreSQL as
  planned. Preserve MongoDB and existing users; a relational migration needs a
  separate, justified data migration plan.
- Auth routes cover registration/signup, login, logout, refresh, verification,
  resend verification, password recovery, profile and password change.
- Other routes: `/`, `/health`, `/api/health`, `/api/stats`, `/api/status`.
- UI pages: landing, documentation, auth demo, login/signup, password recovery,
  and a protected dashboard containing a placeholder.
- Dockerfiles, three Compose definitions, deployment configuration and seven
  workflows exist. Their presence does not establish that deployment works.

## Partial, missing and technical debt

| Area | Evidence / finding before implementation |
| --- | --- |
| Session security | `authSlice.ts` trusts localStorage on startup; verify/refresh thunks have no lifecycle caller. |
| Authorization | `app.py` exposes statistics/status publicly; legacy `token_required` accepts any signed token type. |
| CORS/config | `app.py` reflects arbitrary preflight origins with credentials; production accepts development secret defaults. |
| Password recovery | `api/auth.py` sends password_hash to `User.update_user`, which strips it: reset reports success but does not change the password. |
| Verification | Registration returns verificationToken when SMTP fails, including production; frontend has no matching email-link route. |
| Database | `core/database.py` and `utils/database.py` create separate clients. Models/global services cache handles across app instances. Index fields do not match rate-limit/failed-attempt documents. |
| Contracts | User properties are snake_case on the API and camelCase in frontend types; mixed response envelopes. |
| Duplicate code | Legacy JWTManager, TokenService and auth utilities compete; TokenService references a collections abstraction with no implemented classes. Unused AuthContext contains no-op functions. |
| Tests | Existing tests assume live MongoDB, share data, and contain stale status/response expectations. Frontend has no test command. Initial run failed and was stopped during database waits. |
| Build | Local frontend dependencies are incomplete: tsc/eslint binaries unavailable in the initial build/lint attempt. |
| UI | MUI theme is reusable; Vite starter CSS conflicts with it. Documentation/API components are large. No workforce shell, business tables, or role dashboards. |
| Delivery | README Compose paths do not exist at the root; Compose omits MongoDB, requires a missing env file and probes HTTP without checking status. Production runs Flask dev server. Docker ignore files are outside context root. CI suppresses backend failures and calls a nonexistent frontend test script. Render references the wrong Dockerfile path. |

Only a user identity model is implemented. Organizations, departments, teams,
employee metadata, attendance, leave, tasks, announcements, notifications,
reports, administrative audit logs, AI providers/tools and schema migrations
are missing. Access logs are not administrative audit logs. No multi-tenant
isolation exists. Dependency vulnerability status has not been certified.

## Implementation order

1. **Foundation / critical fixes:** secure app configuration and CORS; unify
   database access; enforce access-token and role checks; fix password recovery;
   verify restored frontend sessions; centralize API parsing; establish isolated
   regression tests and an honest CI signal. Preserve routes/data.
2. **Core workforce:** add organization boundary and employee metadata on the
   existing identity, departments/teams/managers, paginated employee APIs, then
   attendance transitions, leave overlap/approval rules, tasks, announcements,
   notifications and administrative audit events. Use versioned additive data
   migrations and backend authorization tests for each feature.
3. **Professional UI/UX:** extend MUI tokens, responsive sidebar/topbar, role
   dashboards backed by APIs, reusable tables/forms/dialogs and complete async
   states. Verify keyboard, mobile, tablet and desktop behavior.
4. **AI workflows:** read-only allowlisted workforce tools with the same actor
   scope as normal APIs, provider abstraction, sanitized responses and graceful
   unconfigured behavior. No arbitrary SQL or autonomous administrative actions.
5. **Testing and delivery:** real MongoDB integration/concurrency checks,
   browser workflow tests, production WSGI and MongoDB Compose, deployment and
   CI cleanup, opt-in demo seed, screenshots, accessibility and documentation.

Phase 1 is a bounded foundation increment, not completion of the full SaaS
roadmap. No existing database will be dropped or automatically reseeded.
