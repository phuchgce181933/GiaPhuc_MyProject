# UC-01 — Create Staff Account (example)

> Illustrative example showing how to package a UC slice using this skill.

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-01--create-staff-account)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml`
- Sequence Diagram: `docs/plantuml/SD-01-Create-Staff.puml`
- Unit Tests: `UT-01` .. `UT-11`, `UT-18` .. `UT-20`, `UT-25`
- System Tests: `ST-01` .. `ST-03`
- Backlog rows: Status #4, #6, #20, #21, #22 (email-related fixes)

## One-paragraph summary

Admin POSTs `/api/staff` with `{fullName, email, phone, address, roleId,
temporaryPassword?}`. Backend validates, de-dupes against User collection,
hashes the password, persists, and triggers `EmailService.sendStaffAccountCreatedEmail`.
The route enforces `CREATE_STAFF` via `requirePermission`. Email failure is
non-fatal — the user is still created; response carries
`emailNotificationSent: false`.

## See also

- `notes.md` — change-impact matrix and drift observations for this UC.
