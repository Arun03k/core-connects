# Phase 1 — foundation increment

## Changes

- Preserved React/TypeScript/MUI/Redux, Flask and MongoDB, existing auth URLs and users.
- Consolidated live database access to one lazy client per app, including health
  checks. Removed cached cross-app model/service handles. `flask --app app init-db`
  creates additive indexes matching the active query fields; no data was migrated,
  dropped or seeded during implementation. Old unused indexes are retained.
- Replaced competing token decorators with the shared access-token requirement;
  missing/expired/non-access tokens cannot access profile or administrative APIs.
  Current database roles control access; uppercase and legacy lowercase roles work.
- Restricted statistics to ADMIN/HR and detailed status to ADMIN.
- Removed arbitrary-origin preflight reflection, wildcard credentials and production
  default-secret fallback; added payload type/size checks and JSON HTTP errors.
- Fixed reset-password persistence via a dedicated credential-update method;
  tokens are claimed once, refresh credentials revoked, and reuse rejected.
  Password changes apply the registration policy and reject bcrypt byte truncation.
- Removed verification-token disclosure, aligned email links with the existing login
  page and normalized frontend user fields without deleting legacy response fields.
- Made rate counters atomic, persistent and fail closed; forwarded headers cannot
  evade them and handler errors cannot execute the handler twice.
- Added a shared frontend API parser with timeout/safe errors; restored sessions are
  server-verified with refresh recovery. Credentials are tab-scoped; obsolete
  persistent credentials are cleared. Removed unused no-op auth context code.
- Removed conflicting Vite starter CSS while retaining the established theme.
- Added isolated tests, corrected stale assertions, enabled frontend tests in CI,
  and stopped CI from treating backend failures as successful runs.

## Verification and limits

Backend tests cover auth lifecycle, reset persistence and replay, changed passwords,
role changes, deactivation, token types, malicious origins, malformed/oversized
payloads, forwarded-IP abuse, health sanitization and app/database isolation.
Frontend tests cover trusted session restoration, token renewal, revoked sessions,
offline logout and safe proxy-error feedback. Build, lint and type checks run locally.

Mongomock is a test-only substitute for MongoDB, not evidence of real database
concurrency or migration correctness. Real MongoDB/SMTP/container and browser
end-to-end checks have not been performed. No live deployment or user data was changed.

This increment does not complete the workforce SaaS. The dashboard and workforce
modules remain future work. Other remaining risks: JS-readable bearer tokens,
access-token lifetime after logout/reset, no tenant scoping, public registration
policy for future organizations, legacy deployment scripts/configuration, no
production WSGI setup, and consolidation of the remaining unused JWT/password
helpers. See PROJECT_AUDIT.md for the dependency order.

## Local results — 14 September 2026

- Backend: 47 tests passed; flake8, Black check and isort check passed.
- Frontend: 8 session tests passed; ESLint, TypeScript checking and Vite build passed.
- Frontend npm audit: zero known vulnerabilities after compatible lockfile updates
  and selecting patched Vitest 4.1.11. This does not certify Python dependencies.
- `git diff --check` passed.
- The Vite build still warns about the large main bundle; route-level splitting
  remains in the UI/performance phase. Mongomock emits upstream UTC deprecation
  warnings under the local Python runtime.
