# Project Backlog

Owner: **Huỳnh Gia Phúc**  
Last updated: 2026-09-30

---

## I. Status Report

| # | Project Task | In-charge | Status | Notes (Work Item in Details) |
| - | ------------ | --------- | ------ | ---------------------------- |
| 1 | Project bootstrap (backend + frontend skeleton) | Huỳnh Gia Phúc | Completed | Backend: Node.js + Express + Mongoose scaffolded with config/env, logger, ApiError, db, mail. Frontend: Vite + React scaffolded with axios client, AuthContext, router. |
| 2 | Database design (User / Role / Permission) | Huỳnh Gia Phúc | Completed | Mongoose models with indexes on email/phone/username; passwordHash marked `select:false`; `toSafeJSON()` strips sensitive fields. |
| 3 | RBAC layer (Permission middleware, role–permission map) | Huỳnh Gia Phúc | Completed | `requirePermission(...perms)` middleware checks `req.user.role.permissions`. No `if (role === "ADMIN")` in controllers/services. |
| 4 | Staff module (controller / service / repository / router / validator) | Huỳnh Gia Phúc | Completed | Endpoints: `POST /api/staff`, `GET /api/staff`, `GET /api/staff/:id`, `PUT /api/staff/:id`, `PATCH /api/staff/:id/role`, `PATCH /api/staff/:id/status`. |
| 5 | Profile module | Huỳnh Gia Phúc | Completed | `/api/profile/me` (any auth user) + `/api/profile/:id` (requires `VIEW_PROFILE`). |
| 6 | Email service (nodemailer) | Huỳnh Gia Phúc | Completed | Centralised `EmailService` with HTML escaping, returns `{ok, error}` instead of throwing, no secrets in logs. |
| 7 | Seed script (permissions + roles + admin) | Huỳnh Gia Phúc | Completed | Idempotent. Reads `SEED_ADMIN_*` env. ADMIN gets all permissions; STAFF only `VIEW_PROFILE`. |
| 8 | Auth module (login + refresh) | Huỳnh Gia Phúc | Completed | JWT access + refresh, populates role+permissions for downstream checks. |
| 9 | Frontend pages (Login, Staff List/Create/Edit/View, Profile) | Huỳnh Gia Phúc | Completed | Permission-aware UI: Create button hidden without `CREATE_STAFF`, Edit/Role disabled without respective permissions. |
| 10 | Frontend auth context + permission hook | Huỳnh Gia Phúc | Completed | `useAuth` + `usePermission` hooks; tokens persisted in localStorage. |
| 11 | Environment / configuration hygiene | Huỳnh Gia Phúc | Completed | `.env.example` for backend and frontend; `MONGODB_URI`, `MAIL_USER`, `MAIL_PASS`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `BACKEND_URL` all from env. No hard-coded localhost/credentials in any class. |
| 12 | Unit tests (StaffService, permission middleware, EmailService, validator) | Huỳnh Gia Phúc | Completed | 25 tests, all passing on 2026-09-30 (see `docs/tests/UNIT-TEST.md`). |
| 13 | Unit Test Document | Huỳnh Gia Phúc | Completed | `docs/tests/UNIT-TEST.md` with 25 cases using real test data. |
| 14 | System Test Document | Huỳnh Gia Phúc | Completed (document only) | `docs/tests/SYSTEM-TEST.md` with 24 scenarios. Execution requires live MongoDB + SMTP — see **Project Issues #1**. |
| 15 | UC package | Huỳnh Gia Phúc | Completed | `docs/UC/UC-PACKAGE.md` — UC-01 through UC-08. |
| 16 | PlantUML diagrams | Huỳnh Gia Phúc | Completed | 8 diagrams: `CD-01-Staff-Management.puml`, `CD-02-Profile-and-Auth.puml`, `SD-01-Create-Staff.puml`, `SD-02-View-Profile.puml`, `SD-03-Update-Staff.puml`, `SD-04-Assign-Role.puml`, `SD-05-Activate-Deactivate.puml`, `SD-06-View-Own-Profile.puml` — all orthogonal edges, no fabricated classes, full UC coverage (see UC ↔ Diagram Traceability in `docs/UC/UC-PACKAGE.md`). |
| 17 | Lint (`npm run lint`) | Huỳnh Gia Phúc | Completed | Backend: 0 errors / 0 warnings. Frontend: 0 errors / 0 warnings. |
| 18 | Backend unit-test run (`npm test`) | Huỳnh Gia Phúc | Completed | 25/25 passed, executed 2026-09-30. |
| 19 | Frontend production build (`npm run build`) | Huỳnh Gia Phúc | Completed | Built in ~0.7s, 106 modules, 242 kB JS / 1.85 kB CSS. |
| 20 | Backend dev-server smoke | Huỳnh Gia Phúc | Completed | `node src/server.js` started on 2026-09-30 → logs `MongoDB connected`, `Mail server is ready`, `Server listening on port 5000`. Seed script (`npm run seed`) inserted 8 permissions, 2 system roles (ADMIN, STAFF) and admin user `admin@giaphuc.local`. Smoke calls via PowerShell + `Invoke-WebRequest`: `/health` → 200; `/api/auth/login` (admin) → 200 + JWT; `/api/staff` (Bearer admin) → 200 list; `/api/roles` → 200 + 2 roles; missing/invalid Bearer → 401 UNAUTHORIZED; safe DTO contains no `passwordHash` and no `activationToken`. |
| 21 | End-to-end UC-01 (Create Staff + Send Email) smoke | Huỳnh Gia Phúc | Completed | Logged in as ADMIN, POSTed `/api/staff` with STAFF roleId, real Gmail SMTP accepted the message: response `emailNotificationSent: true`, new row visible in `/api/staff`. Remaining 23 system-test scenarios in `docs/tests/SYSTEM-TEST.md` are still `Not Executed` (see **Project Issues #4**) — full matrix execution is a follow-up. |
| 22 | Fixes during smoke: `dotenv` load order, `passwordHash` select, duplicate indexes | Huỳnh Gia Phúc | Completed | (a) `server.js` now calls `require('dotenv').config()` before `require('./app')` so `MONGODB_URI` etc. are loaded. (b) `auth.service.login` adds `.select('+passwordHash')` because the field is `select:false` on the User schema — without this, every login returned `Invalid credentials`. (c) Removed duplicate `schema.index({...}, {unique:true})` declarations in User/Role/Permission models (the `unique:true` on the field already creates the index). Mongoose duplicate-index warnings are gone. |
| 23 | Re-run unit tests after fixes | Huỳnh Gia Phúc | Completed | `npm test` on 2026-09-30 → 25/25 still passing after the three fixes above. |

---

## II. Project Issues

| # | Project Issue | Owner | Status | Notes (Solution, Suggestion, etc.) |
| - | ------------- | ----- | ------ | ---------------------------------- |
| 1 | MongoDB Atlas cluster not provisioned in this environment | Huỳnh Gia Phúc | Resolved | `MONGODB_URI` set in `backend/.env`, `connectDb()` resolved, `npm run seed` inserted 8 permissions + ADMIN/STAFF roles + admin user in DB `giaphuc`. |
| 2 | Gmail App Password rotation | Huỳnh Gia Phúc | Resolved (live) | The provided App Password (`pyyl cqya sqro gqya`) successfully delivered the UC-01 welcome email on 2026-09-30. Suggestion still applies: keep `MAIL_PASS` only in `backend/.env`; rotate if used in CI. |
| 3 | Gmail SMTP from-address limitation | Huỳnh Gia Phúc | Open | Gmail ignores custom `From:` headers that don't match the authenticated user; the current implementation forces `from = "<MAIL_USER>"`. If a custom sender is later required, switch to a transactional provider (SendGrid, Mailgun, SES). |
| 4 | System Test execution gating | Huỳnh Gia Phúc | Partially Resolved | ST-01, ST-02, ST-03, ST-10, ST-18 (and the related ST-19/ST-21 boundaries) were effectively exercised via the live smoke run on 2026-09-30 — see Status #20/#21. The remaining 19 scenarios in `docs/tests/SYSTEM-TEST.md` are still marked `Not Executed` and require manual API + UI verification. |
| 5 | No rate-limiting on auth endpoints | Huỳnh Gia Phúc | Open (not in scope) | Out of the original feature spec; tracked for a future iteration. Suggested library: `express-rate-limit`. |
| 6 | Frontend uses localStorage for tokens | Huỳnh Gia Phúc | Open (accepted trade-off) | XSS-exposed by design for this iteration. A future iteration should move to httpOnly cookies with CSRF protection. |
| 7 | DB name separation (`giaphuc` vs `test_giaPhuc`) | Huỳnh Gia Phúc | Resolved | `MONGODB_DB` is now a separate env var (default `giaphuc` at runtime; Jest overrides to `test_giaPhuc` in `tests/setup.js`). `config/db.js` passes `dbName: env.mongodbDb` to `mongoose.connect`. `scripts/seed.js` also passes `dbName` so it always seeds the intended DB. `scripts/reset-db.js` provides a safe drop for the configured DB only (refuses `NODE_ENV=production`). |
