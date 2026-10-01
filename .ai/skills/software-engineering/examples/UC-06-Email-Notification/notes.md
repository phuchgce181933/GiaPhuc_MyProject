# UC-06 — Impact matrix (delta)

| Area | Notes |
| ---- | ----- |
| Backend module | `services/email.service.js`, `modules/staff/staff.service.js` (call site) |
| Backend tests | `email.service.test.js` |
| Frontend | none (server-triggered) |
| Permissions | none (inherits UC-01's `CREATE_STAFF`) |
| ENV vars | `MAIL_USER`, `MAIL_PASS`, `FRONTEND_URL`, `BACKEND_URL` |
| UC | UC-06 body |
| CD | `CD-01` (EmailService class) |
| SD | sub-flow in `SD-01` |
| UT | `UT-18`, `UT-19`, `UT-20` |
| ST | `ST-01` (sub-step), `ST-21` |
| Backlog | Status #6; Issue #2 (App Password), #3 (From-address) |

## Drift

None known.
