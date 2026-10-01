# UC-06 — Send Staff Account Notification (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-06--send-staff-account-notification)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml` (EmailService)
- Sequence Diagram: sub-flow inside `docs/plantuml/SD-01-Create-Staff.puml`
- Unit Tests: `UT-18`, `UT-19`, `UT-20`
- System Tests: `ST-01` (sub-step), `ST-21`

## One-paragraph summary

Triggered by UC-01. `StaffService.createStaff` calls
`EmailService.sendStaffAccountCreatedEmail`. The service builds HTML + text,
escapes user input, calls SMTP. Success → `logger.info("Email notification sent")`.
Failure → `logger.error("Email notification failed")` — **never logs the
password or token**.

## Drift

- None known. Email failure handling matches the implementation.
- Backlog Issue #3 (Gmail from-address limitation) is related but external to
  this UC's flow.
