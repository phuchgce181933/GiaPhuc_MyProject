# UC-05 — Impact matrix (delta)

| Area | Notes |
| ---- | ----- |
| Backend module | `staff/staff.{router,controller,service}.js` (`PATCH /:id/status`) |
| Backend tests | service tests for `setActive` |
| Frontend | `StaffListPage.jsx` activate/deactivate button, `staff.api.js#setActive` |
| Permissions | `UPDATE_STAFF` |
| Auth middleware | `auth.middleware.js#authenticate` blocks inactive users |
| UC | UC-05 body |
| CD | `CD-01` |
| SD | `SD-05` |
| UT | `UT-23`, `UT-24` |
| ST | `ST-10`, `ST-11` |

## Drift

None known.
