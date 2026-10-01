# UC-02 — Impact matrix (delta vs UC-01)

| Area | Notes |
| ---- | ----- |
| Backend module | `profile/profile.{router,controller,service}.js`, `staff/staff.controller.js` (`getOne`) |
| Backend tests | permission middleware tests (`UT-12..17`) |
| Frontend | `StaffViewPage.jsx`, `ProfilePage.jsx`, `profile.api.js`, `staff.api.js` |
| Permissions | `VIEW_PROFILE`, `VIEW_STAFF` |
| ENV vars | none |
| UC | UC-02 body + UC-07 (authZ step) sub-flow |
| CD | `CD-01`, `CD-02` |
| SD | `SD-02` (covers UC-02 + UC-07) |
| UT | `UT-12..17` |
| ST | `ST-04`, `ST-05` |
| Backlog | Status #5 (Profile module); Issue #7 (DB name separation) is unrelated |

## Drift

Permission divergence: see `README.md` of this example.
