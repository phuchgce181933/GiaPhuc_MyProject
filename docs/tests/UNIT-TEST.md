# Unit Test Document — Staff Account Management

| # | Test Case | Condition (Precondition / Input) | Confirm (Return / Exception / Log / Result) | Result Type | Passed/Failed | Executed Date |
| - | --------- | -------------------------------- | ------------------------------------------- | ----------- | ------------- | ------------- |
| 1 | Create staff successfully | Pre: roles seeded; Input: `fullName="Nguyen Van Test"`, `email="nguyenvantest@example.com"`, `phone="0901234567"`, `roleId="66f1a2b3c4d5e6f789012999"` | Return: user with `_id="66f1a2b3c4d5e6f789012777"`, `emailNotificationSent=true`. Log: `Staff account created successfully`. Result: account persisted. | N | Passed | 2026-09-30 |
| 2 | Reject duplicate email | Pre: existing user with `email="nguyenvantest@example.com"`; Input: same email | Exception: `ApiError` `statusCode=409`, `message=/email/i`. No create. | A | Passed | 2026-09-30 |
| 3 | Reject duplicate phone | Pre: existing user with `phone="0901234567"`; Input: `phone="0901234567"` | Exception: `ApiError` `statusCode=409`. No create. | A | Passed | 2026-09-30 |
| 4 | Reject invalid email format | Pre: validator only; Input: `email="not-an-email"` | Exception: `ApiError` `statusCode=400`, `details[0].path="email"`. | A | Passed | 2026-09-30 |
| 5 | Reject missing required field fullName | Pre: validator only; Input: `email="ok@example.com"`, `phone="0901234567"`, `roleId="66f1a2b3c4d5e6f789012999"` (no fullName) | Exception: `ApiError` `statusCode=400`, `details[0].path="fullName"`. | A | Passed | 2026-09-30 |
| 6 | Reject invalid roleId | Pre: validator only; Input: `roleId="not-an-objectid"` | Exception: `ApiError` `statusCode=400`, `details[0].path="roleId"`. | A | Passed | 2026-09-30 |
| 7 | Reject invalid phone format | Pre: validator only; Input: `phone="abc"` | Exception: `ApiError` `statusCode=400`. | A | Passed | 2026-09-30 |
| 8 | Provided temporaryPassword is hashed | Pre: input `temporaryPassword="Sup3rSecret!"` | Return: `passwordHash !== "Sup3rSecret!"`; `bcrypt.compare("Sup3rSecret!", passwordHash) === true`. | N | Passed | 2026-09-30 |
| 9 | Empty temporaryPassword generates a fallback | Pre: input `temporaryPassword` undefined | Email arg contains `temporaryPassword` of length ≥ 8 (alphanumeric). | B | Passed | 2026-09-30 |
| 10 | Invalid role (roleId not found) throws 400 | Pre: `roleRepo.findById` returns null; Input: `roleId="66f1a2b3c4d5e6f789012999"` | Exception: `ApiError` `statusCode=400`. No create. | A | Passed | 2026-09-30 |
| 11 | Email failure does not throw; account still created | Pre: `sendStaffAccountCreatedEmail` resolves `{ ok: false, error: "smtp-down" }` | Return: `emailNotificationSent=false`, `emailError="smtp-down"`, user persisted. Log: `ERROR Email notification failed error=smtp-down`. | A | Passed | 2026-09-30 |
| 12 | Admin without permission cannot call protected route | Pre: middleware only; `req.user.role.permissions=["VIEW_PROFILE"]`, route needs `CREATE_STAFF` | Exception: `ApiError` `statusCode=403`, message includes `CREATE_STAFF`. | A | Passed | 2026-09-30 |
| 13 | Permission middleware accepts permission when role has it | Pre: `req.user.role.permissions=["CREATE_STAFF"]`, route needs `CREATE_STAFF` | Return: no error, next() called. | N | Passed | 2026-09-30 |
| 14 | Permission middleware fails 401 when no user | Pre: `req.user === undefined`, route needs `VIEW_PROFILE` | Exception: `ApiError` `statusCode=401`. | A | Passed | 2026-09-30 |
| 15 | Permission middleware fails 403 when role is null | Pre: `req.user.role === null`, route needs `VIEW_PROFILE` | Exception: `ApiError` `statusCode=403`. | A | Passed | 2026-09-30 |
| 16 | Permission middleware accepts string-form permissions | Pre: `req.user.role.permissions=["VIEW_STAFF","VIEW_PROFILE"]`, route needs `VIEW_PROFILE` | Return: no error. | N | Passed | 2026-09-30 |
| 17 | Permission middleware requires ALL listed permissions | Pre: `req.user.role.permissions=["VIEW_STAFF"]`, route needs `VIEW_STAFF` + `UPDATE_STAFF` | Exception: `ApiError` `statusCode=403`, message includes `UPDATE_STAFF`. | B | Passed | 2026-09-30 |
| 18 | Email service returns ok on success | Pre: transport mock resolves `{ messageId:"m-1", accepted:["staff@example.com"] }` | Return: `{ ok:true, messageId:"m-1" }`. | N | Passed | 2026-09-30 |
| 19 | Email service returns ok:false on provider failure | Pre: transport mock rejects `Error("smtp-down")` | Return: `{ ok:false, error:"smtp-down" }`. No throw. | A | Passed | 2026-09-30 |
| 20 | Email service HTML-escapes user input | Pre: input `fullName='<script>alert(1)</script>'` | Confirm: rendered HTML contains `&lt;script&gt;`, not `<script>`. | B | Passed | 2026-09-30 |
| 21 | assignRole updates the user and returns safe DTO | Pre: `roleRepo.findById` returns `{_id:"66f1a2b3c4d5e6f789012000",name:"ADMIN"}`, user exists | Return: dto with `role._id="66f1a2b3c4d5e6f789012000"`; no `passwordHash` in dto. | N | Passed | 2026-09-30 |
| 22 | assignRole with unknown roleId throws 400 | Pre: `roleRepo.findById` returns null; Input: `roleId="66f1a2b3c4d5e6f789012999"` | Exception: `ApiError` `statusCode=400`. | A | Passed | 2026-09-30 |
| 23 | setActive toggles isActive | Pre: user exists; Input: `isActive=false` | Return: dto with `isActive=false`. | N | Passed | 2026-09-30 |
| 24 | setActive on missing user throws 404 | Pre: user not found; Input: `id="66f1a2b3c4d5e6f789012777"`, `isActive=true` | Exception: `ApiError` `statusCode=404`. | A | Passed | 2026-09-30 |
| 25 | Validator passes valid payload and lowercases email | Pre: `email="  NVTEST@Example.COM "` | Return: parsed payload with `email="nvtest@example.com"`, `address=""`, `avatar=""`. | N | Passed | 2026-09-30 |

## Summary

| Metric | Value |
| ------ | ----- |
| Total | 25 |
| Passed | 25 |
| Failed | 0 |
| Not Executed | 0 |

All tests executed with `npm test` on **2026-09-30** using Node.js v22.20.0, jest 29.7.0.
