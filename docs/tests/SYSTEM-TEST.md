# System Test Document — Staff Account Management

This document covers the end-to-end flow from Admin login through staff
creation, email dispatch, and profile viewing.

**Status:** System tests are authored; runtime execution requires a live
MongoDB instance and SMTP credentials (see **Section: How to run** at the
bottom).  Cells under **Actual Result** therefore read `Pending` and
**Executed Date** reads `Not Executed` for any scenario that hasn't been
manually verified yet.

| # | Test Scenario | Precondition | Test Data | Steps | Expected Result | Actual Result | Result Type | Passed/Failed | Executed Date |
| - | ------------- | ------------ | --------- | ----- | --------------- | ------------- | ----------- | ------------- | ------------- |
| ST-01 | Admin login | Admin account seeded; MongoDB up | email=`admin@giaphuc.local`, password=`Admin@12345` | POST `/api/auth/login` | 200 + `{ accessToken, refreshToken, user }` | Pending | N | Not Executed | Not Executed |
| ST-02 | Open Staff Management page | Logged in Admin | — | Open `/staff` | 200 page; GET `/api/staff` returns ≥ 1 row | Pending | N | Not Executed | Not Executed |
| ST-03 | Create staff — happy path | Logged in Admin; role `STAFF` exists | fullName=`Nguyen Van Test`, email=`nguyenvantest@example.com`, phone=`0901234567`, roleId=`66f1a2b3c4d5e6f789012999` | POST `/api/staff` | 201 with `emailNotificationSent=true`; MongoDB has 1 new user; SMTP outbox contains email | Pending | N | Not Executed | Not Executed |
| ST-04 | Create staff — duplicate email | Email already exists | email=`nguyenvantest@example.com` (already taken) | POST `/api/staff` | 409 `Duplicate email` | Pending | A | Not Executed | Not Executed |
| ST-05 | Create staff — duplicate phone | Phone already exists | phone=`0901234567` (already taken) | POST `/api/staff` | 409 `Duplicate phone` | Pending | A | Not Executed | Not Executed |
| ST-06 | Create staff — invalid role | roleId not in DB | roleId=`66f1a2b3c4d5e6f789012999` (nonexistent) | POST `/api/staff` | 400 `Role not found` | Pending | A | Not Executed | Not Executed |
| ST-07 | Create staff — validation failure | — | `email="not-an-email"`, `phone="abc"` | POST `/api/staff` | 400 with `details[].path` | Pending | A | Not Executed | Not Executed |
| ST-08 | Email provider failure | SMTP down; valid input | fullName=`SMTP Fail`, email=`smtpfail@example.com`, phone=`0901112222`, roleId valid | POST `/api/staff` | 201 with `emailNotificationSent=false`; user persisted; log records `ERROR Email notification failed error=...` (no creds) | Pending | A | Not Executed | Not Executed |
| ST-09 | Database failure | MongoDB disconnected | any valid payload | POST `/api/staff` | 500 INTERNAL_ERROR; no half-written user | Pending | A | Not Executed | Not Executed |
| ST-10 | View staff list | Logged in Admin | — | GET `/api/staff?page=1&limit=20` | 200 `{ items, total, page, limit }` | Pending | N | Not Executed | Not Executed |
| ST-11 | View single staff | Logged in Admin | id=`66f1a2b3c4d5e6f789012777` | GET `/api/staff/:id` | 200 safe DTO | Pending | N | Not Executed | Not Executed |
| ST-12 | Update staff — happy path | Logged in Admin; user exists | `address="New address"` | PUT `/api/staff/:id` | 200 with updated DTO | Pending | N | Not Executed | Not Executed |
| ST-13 | Update staff — duplicate email on edit | Other user owns new email | `email="someoneelse@example.com"` (taken) | PUT `/api/staff/:id` | 409 `Duplicate email` | Pending | A | Not Executed | Not Executed |
| ST-14 | Assign role | Logged in Admin | roleId for `STAFF` | PATCH `/api/staff/:id/role` | 200 with new role; log `Role assigned` | Pending | N | Not Executed | Not Executed |
| ST-15 | Assign role — invalid role | — | roleId=`66f1a2b3c4d5e6f789012999` (nonexistent) | PATCH `/api/staff/:id/role` | 400 `Role not found` | Pending | A | Not Executed | Not Executed |
| ST-16 | Activate / deactivate | Logged in Admin | `isActive=false` | PATCH `/api/staff/:id/status` | 200 with `isActive=false` | Pending | N | Not Executed | Not Executed |
| ST-17 | Login while deactivated | Account deactivated | deactivated user's credentials | POST `/api/auth/login` | 403 `Account is deactivated` | Pending | A | Not Executed | Not Executed |
| ST-18 | Unauthenticated access to staff list | No token | — | GET `/api/staff` | 401 UNAUTHORIZED | Pending | A | Not Executed | Not Executed |
| ST-19 | Forbidden access — no VIEW_STAFF | STAFF role logged in | STAFF token | GET `/api/staff` | 403 FORBIDDEN (missing `VIEW_STAFF`) | Pending | A | Not Executed | Not Executed |
| ST-20 | Profile — own | Any authenticated user | — | GET `/api/profile/me` | 200 own profile | Pending | N | Not Executed | Not Executed |
| ST-21 | Profile — other (with VIEW_PROFILE) | Admin (has VIEW_PROFILE) | id of any staff | GET `/api/profile/:id` | 200 staff profile | Pending | N | Not Executed | Not Executed |
| ST-22 | Profile — other (without VIEW_PROFILE) | STAFF role (no VIEW_PROFILE) | id of any staff | GET `/api/profile/:id` | 403 FORBIDDEN (missing `VIEW_PROFILE`) | Pending | A | Not Executed | Not Executed |
| ST-23 | Email content — sanity | Created account | — | Inspect sent email | Subject, name, role, login URL present; password present iff generated; HTML escapes `<script>` etc. | Pending | N | Not Executed | Not Executed |
| ST-24 | Logout & token rejected | After logout | previously valid token | GET `/api/staff` | 401 (token still cached; logout clears local storage) | Pending | A | Not Executed | Not Executed |

## Summary

| Metric | Value |
| ------ | ----- |
| Total | 24 |
| Passed | 0 |
| Failed | 0 |
| Not Executed | 24 |

## How to run

System tests require:

1. A running MongoDB instance reachable via the `MONGODB_URI` in
   `backend/.env`.
2. Valid Gmail App Password in `MAIL_PASS` and a working outbound SMTP
   path. (For ST-08, deliberately break the credentials to verify the
   partial-success flow.)
3. The seed script executed:

   ```bash
   cd backend
   npm run seed
   ```

4. Then drive the API manually (Postman / curl) or via the React frontend
   (`cd frontend && npm run dev`). After each scenario, update the
   **Actual Result**, **Passed/Failed**, and **Executed Date** columns in
   this document. **Do not modify those cells before the test has actually
   been executed.**
