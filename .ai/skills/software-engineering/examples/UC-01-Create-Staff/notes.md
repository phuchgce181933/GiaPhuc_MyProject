# UC-01 — Change Impact Matrix

Snapshot of the impact this UC has on the repository. Used as a reference when
modifying anything in this slice.

| Area | Affected? | Files | Reason |
| ---- | --------- | ----- | ------ |
| Backend module(s) | yes | `backend/src/modules/staff/{router,controller,service,validator}.js`, `backend/src/modules/role/role.repository.js`, `backend/src/modules/auth/auth.service.js` (refresh), `backend/src/services/email.service.js` | core flow + email |
| Backend tests | yes | `backend/tests/unit/staff.service.test.js`, `backend/tests/unit/email.service.test.js`, `backend/tests/unit/permission.middleware.test.js` | UT-01..11, 18..20, 25 |
| Frontend pages | yes | `frontend/src/pages/StaffCreatePage.jsx` | submit form |
| Frontend API module | yes | `frontend/src/api/staff.api.js` | `createStaff` |
| Database / models | yes | `backend/src/models/user.model.js` | unique email/phone/username indexes |
| Permissions | yes | `backend/src/constants/permissions.js` | `CREATE_STAFF` |
| ENV vars | yes | `backend/.env.example` | `MAIL_USER`, `MAIL_PASS`, `FRONTEND_URL` |
| Use Case | yes | `docs/UC/UC-PACKAGE.md` | UC-01 body + UC-06 sub-flow |
| Class Diagram | yes | `docs/plantuml/CD-01-Staff-Management.puml` | Staff + Email classes |
| Sequence Diagram | yes | `docs/plantuml/SD-01-Create-Staff.puml` | full flow + email branch |
| Unit Test doc | yes | `docs/tests/UNIT-TEST.md` | UT-01..11, 18..20, 25 |
| System Test doc | yes | `docs/tests/SYSTEM-TEST.md` | ST-01..03 |
| Backlog Status | yes | Status #4, #6, #20, #21, #22 | |
| Backlog Issues | yes | Issue #2, #3 | Gmail App Password + From-address |
| README | yes | API table + env table | |

## Drift observations

- None known at skill creation time. SD-01 arrow labels match
  `staff.service.js` method names (`createStaff`, `assignRole`, `setActive`).
- CD-01 includes `EmailService` and `SMTP` even though SMTP is external —
  acceptable because the actual class `EmailService` exists and is the
  participant that calls SMTP.
