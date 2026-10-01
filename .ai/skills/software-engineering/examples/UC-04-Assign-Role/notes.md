# UC-04 — Impact matrix (delta)

| Area | Notes |
| ---- | ----- |
| Backend module | `staff/staff.{router,controller,service}.js` (`PATCH /:id/role`), `role/role.repository.js` |
| Backend tests | service tests for `assignRole` |
| Frontend | `StaffEditPage.jsx` role dropdown, `staff.api.js#assignRole` |
| Permissions | `ASSIGN_ROLE` |
| UC | UC-04 body |
| CD | `CD-01` (StaffService.assignRole, RoleRepository.findById) |
| SD | `SD-04` |
| UT | `UT-21`, `UT-22` |
| ST | `ST-08`, `ST-09` |

## Drift

- UC body wording vs implementation: see `README.md`. Update UC body, not
  implementation.
