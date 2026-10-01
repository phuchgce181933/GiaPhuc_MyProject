# UC Package — Admin Staff Account Management

Package: **UC**  
Owner: Huỳnh Gia Phúc  
Last updated: 2026-09-30

This package covers the Staff Account Management feature with RBAC and
Profile permission. All use cases below were authored alongside the actual
implementation; no duplicate UC numbering has been introduced.

---

## UC ↔ Diagram Traceability

| UC ID | UC Name | Class Diagram | Sequence Diagram |
| ----- | ------- | ------------- | ---------------- |
| UC-01 | Create Staff Account | CD-01, CD-02 | SD-01 |
| UC-02 | View Staff Profile | CD-01, CD-02 | SD-02 |
| UC-03 | Update Staff Profile | CD-01, CD-02 | SD-03 |
| UC-04 | Assign Role | CD-01, CD-02 | SD-04 |
| UC-05 | Activate / Deactivate Account | CD-01, CD-02 | SD-05 |
| UC-06 | Send Staff Account Notification | CD-01 | SD-01 (sub-flow) |
| UC-07 | Check Profile Permission | CD-01, CD-02 | SD-02 (authZ step) |
| UC-08 | View Own Profile | CD-02 | SD-06 |

Diagram files (all under `docs/plantuml/`, all using `skinparam linetype ortho`):

- `CD-01-Staff-Management.puml` — Staff CRUD + email
- `CD-02-Profile-and-Auth.puml` — Profile module + Auth (login/refresh)
- `SD-01-Create-Staff.puml` — UC-01 + UC-06
- `SD-02-View-Profile.puml` — UC-02 + UC-07
- `SD-03-Update-Staff.puml` — UC-03
- `SD-04-Assign-Role.puml` — UC-04
- `SD-05-Activate-Deactivate.puml` — UC-05
- `SD-06-View-Own-Profile.puml` — UC-08

---

## UC-01 — Create Staff Account

| Field | Value |
| ----- | ----- |
| UC Name | Create Staff Account |
| UC ID | UC-01 |
| Feature | Admin Staff Account Management |
| Actor | Admin (authenticated user with `CREATE_STAFF`) |
| Description | Admin provisions a new staff account, assigns a role, and the system sends a notification email containing login instructions. |
| Precondition | Admin is authenticated; backend has at least one role in the database; SMTP is configured (best-effort). |
| Main Flow | 1. Admin opens **Staff Management → Create Staff**. 2. Admin fills `fullName`, `email`, `phone`, `address`, picks `role`, optionally sets `temporaryPassword`. 3. Frontend POSTs to `/api/staff`. 4. Backend validates payload, checks duplicate email/phone/username, hashes the password, persists the User, and dispatches the email. 5. Backend responds `201 Created` with the safe DTO and `emailNotificationSent` flag. 6. Frontend shows success toast and redirects to the staff profile page. |
| Alternative Flow | Admin leaves `temporaryPassword` blank — backend auto-generates a 10-character alphanumeric temporary password. |
| Exception Flow | Duplicate email/phone → `409 Conflict`. Invalid role → `400 Bad Request`. Email provider fails → user is still created; response carries `emailNotificationSent: false` and the controller logs an error without exposing secrets. |
| Postcondition | A new User exists in MongoDB with the chosen role; an email was attempted. |

---

## UC-02 — View Staff Profile (by Admin / authorised user)

| Field | Value |
| ----- | ----- |
| UC Name | View Staff Profile |
| UC ID | UC-02 |
| Feature | Admin Staff Account Management / Profile Permission |
| Actor | User with `VIEW_PROFILE` permission (typically Admin) |
| Description | A user with the `VIEW_PROFILE` permission views another user's profile by id. |
| Precondition | Caller is authenticated and holds `VIEW_PROFILE`. |
| Main Flow | 1. Caller opens `/staff/:id`. 2. Frontend GETs `/api/staff/:id`. 3. `authenticate` → `requirePermission('VIEW_STAFF')` → controller. 4. Service returns safe DTO (no password hash, no activation token). |
| Alternative Flow | Caller may instead use `/api/profile/:id` which also requires `VIEW_PROFILE`. |
| Exception Flow | No token → `401 Unauthorized`. Token valid but missing permission → `403 Forbidden`. Unknown id → `404 Not Found`. |
| Postcondition | UI displays the staff record; nothing sensitive is rendered. |

---

## UC-03 — Update Staff Profile

| Field | Value |
| ----- | ----- |
| UC Name | Update Staff Profile |
| UC ID | UC-03 |
| Feature | Admin Staff Account Management |
| Actor | User with `UPDATE_STAFF` |
| Description | Authorised user edits a staff's full name, email, phone, address, status. |
| Precondition | Caller is authenticated and has `UPDATE_STAFF`. |
| Main Flow | 1. Caller opens the edit form. 2. Frontend PUTs to `/api/staff/:id`. 3. Backend re-validates; on email/phone change runs duplicate check. 4. Persisted and returned as safe DTO. |
| Alternative Flow | If caller also has `ASSIGN_ROLE`, the form lets them change role and triggers `PATCH /api/staff/:id/role`. |
| Exception Flow | Duplicate email/phone → `409`. Validation error → `400`. Missing id → `404`. Forbidden → `403`. |
| Postcondition | User record updated; activity logged. |

---

## UC-04 — Assign Role

| Field | Value |
| ----- | ----- |
| UC Name | Assign Role |
| UC ID | UC-04 |
| Feature | Admin Staff Account Management / RBAC |
| Actor | User with `ASSIGN_ROLE` |
| Description | Admin assigns a different role to a staff account. |
| Precondition | Caller authenticated, has `ASSIGN_ROLE`; target user exists; role exists. |
| Main Flow | 1. Caller selects a role from the dropdown. 2. Frontend PATCHes `/api/staff/:id/role` with `{ roleId }`. 3. Backend verifies the role exists, updates the user's `role` reference, returns safe DTO, logs the change. |
| Alternative Flow | Role management happens at seed time; admins can also call `GET /api/roles` to see what roles exist. |
| Exception Flow | Role not found → `400`. Staff not found → `404`. Caller missing `ASSIGN_ROLE` → `403`. No auth → `401`. |
| Postcondition | New role effective immediately on subsequent JWT refresh; effective on the next request because the JWT is decoded fresh from `req.user`. |

---

## UC-05 — Activate / Deactivate Account

| Field | Value |
| ----- | ----- |
| UC Name | Activate / Deactivate Account |
| UC ID | UC-05 |
| Feature | Admin Staff Account Management |
| Actor | User with `UPDATE_STAFF` |
| Description | Admin toggles `isActive` on a staff account. |
| Precondition | Caller authenticated, has `UPDATE_STAFF`; target user exists. |
| Main Flow | 1. Caller clicks Activate/Deactivate. 2. Frontend PATCHes `/api/staff/:id/status` with `{ isActive }`. 3. Backend updates the user, returns safe DTO, logs the change. |
| Alternative Flow | — |
| Exception Flow | Missing user → `404`. Validation error on body → `400`. Forbidden → `403`. |
| Postcondition | Deactivated users are blocked from authenticating by the `authenticate` middleware (returns `403 Forbidden`). |

---

## UC-06 — Send Staff Account Notification

| Field | Value |
| ----- | ----- |
| UC Name | Send Staff Account Notification |
| UC ID | UC-06 |
| Feature | Admin Staff Account Management / Email |
| Actor | System (triggered by UC-01) |
| Description | When a staff account is created, the system dispatches an email with login URL, role, and (if generated) temporary password. |
| Precondition | A staff account was just created via UC-01. |
| Main Flow | 1. `StaffService.createStaff` calls `EmailService.sendStaffAccountCreatedEmail`. 2. EmailService builds an HTML + plaintext body, HTML-escapes user input, and calls the SMTP transport. 3. On success, log `INFO Email notification sent`. 4. On failure, log `ERROR Email notification failed` with the error message but **no password or token**. |
| Alternative Flow | If a `temporaryPassword` was provided, it appears in the email body. Otherwise the auto-generated one is sent. |
| Exception Flow | SMTP failure does not roll back the database — the user is still created and the response carries `emailNotificationSent: false`. |
| Postcondition | Email attempted (with status surfaced to the API caller). |

---

## UC-07 — Check Profile Permission

| Field | Value |
| ----- | ----- |
| UC Name | Check Profile Permission |
| UC ID | UC-07 |
| Feature | RBAC / Profile Permission |
| Actor | Any authenticated user |
| Description | Backend middleware verifies that the caller's role includes the required permission before granting access. |
| Precondition | Caller has a valid JWT; the role is populated with permissions. |
| Main Flow | 1. Request hits `requirePermission('X')`. 2. Middleware looks at `req.user.role.permissions`. 3. If `X` is in the set → continue. Otherwise → `403`. |
| Alternative Flow | If role has no permissions array at all → `403`. |
| Exception Flow | No `req.user` → `401`. |
| Postcondition | Request proceeds only when authorised. |

---

## UC-08 — View Own Profile

| Field | Value |
| ----- | ----- |
| UC Name | View Own Profile |
| UC ID | UC-08 |
| Feature | Profile |
| Actor | Any authenticated user |
| Description | A user views their own profile without needing `VIEW_PROFILE`. |
| Precondition | Caller is authenticated. |
| Main Flow | Frontend GETs `/api/profile/me`. The route only needs `authenticate`. |
| Alternative Flow | — |
| Exception Flow | Inactive account → `403`. Missing token → `401`. |
| Postcondition | Own profile rendered; safe DTO returned. |
