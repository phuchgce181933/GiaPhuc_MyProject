# Documentation Guide

> **Hướng dẫn cho bất kỳ ai (con người hoặc AI agent) khi đã viết xong source code: cái gì cần document, khi nào cần viết, viết ở đâu, theo format nào.**

Owner: **Huỳnh Gia Phúc**  
Last updated: 2026-10-02

---

## 1. Triết lý: Code xong → Viết doc, không bao giờ ngược lại

Tài liệu trong project này **phản ánh code đang chạy**, không phải code trong đầu tác giả. Quy tắc bất di bất dịch:

1. **Code xong, lint pass, test pass** → mới viết doc.
2. Doc mô tả **hành vi quan sát được** (request → response, status code, payload), không mô tả ý định.
3. Khi sửa code → sửa doc trong cùng commit. Doc lệch code thì xóa.
5. Doc ngắn gọn, có bảng, có trace ID → dễ grep, dễ review.

Nếu bạn là AI agent, **đừng tự ý tạo file doc mới** nếu đã có file phù hợp — hãy cập nhật file hiện có.

---

## 2. Bản đồ tài liệu hiện có

| File | Mục đích | Khi nào cập nhật |
| ---- | -------- | ---------------- |
| `README.md` | Quick-start, kiến trúc tổng quan, API contract, biến môi trường. | Thêm/sửa endpoint, đổi ENV var, đổi stack. |
| `docs/DOC-GUIDE.md` | File này — hướng dẫn chính tài liệu. | Khi bạn tự nhận ra mình hay quên cập nhật một loại doc nào đó. |
| `docs/BACKLOG.md` | Status report (mỗi task là 1 hàng), Project Issues (rủi ro, debt). | Mỗi task hoàn thành hoặc phát sinh issue mới. |
| `docs/UC/UC-PACKAGE.md` | Use Case (UC-XX) — actor, pre/post, main flow, alt flow, business rule. | THÊM UC mới, đổi luồng nghiệp vụ. |
| `docs/tests/UNIT-TEST.md` | Bảng liệt kê từng test case đã chạy (input → expected). | THÊM / MỚI test case. |
| `docs/tests/SYSTEM-TEST.md` | Bảng liệt kê scenario end-to-end (UC ↔ test ↔ status). | THÊM scenario, đánh dấu `Passed` / `Failed`. |
| `docs/plantuml/CD-*.puml` | **C**lass/**D**eployment diagrams — kiến trúc tĩnh. | THÊM class/module mới hoặc đổi dependency graph. |
| `docs/plantuml/SD-*.puml` | **S**equence diagrams — luồng tương tác theo UC. | THÊM UC mới có ≥ 2 actor tương tác. |

> Tất cả những file trên đều là **technical documentation** — được review cùng code, được tham chiếu từ README, và có trong git.

---

## 3. Quy trình: Code xong thì viết doc gì?

### Bước A — Xác định loại thay đổi

| Bạn vừa làm gì? | Cập nhật những doc sau |
| ----------------- | ---------------------- |
| Thêm 1 endpoint mới (route + controller + service) | `README.md` (API table) + `docs/BACKLOG.md` (Status row) + `docs/tests/SYSTEM-TEST.md` (≥ 1 scenario) + `docs/UC/UC-PACKAGE.md` nếu là UC mới. |
| Sửa logic nghiệp vụ của 1 endpoint đã có | UC package (nếu thay đổi flow) + BACKLOG (issue mới). Không cần touch README nếu contract không đổi. |
| Thêm/thay model hoặc quan hệ | `README.md` (kiến trúc) + `docs/plantuml/CD-*.puml`. |
| Thêm/sửa test case | `docs/tests/UNIT-TEST.md` hoặc `docs/tests/SYSTEM-TEST.md`. |
| Phát hiện bug / tech debt | `docs/BACKLOG.md` → bảng **Project Issues** (hàng mới, status `Open`). |
| Thêm ENV var mới | `README.md` (ENV table) + `backend/.env.example`. |
| Đổi port / DB name / cluster | `README.md` + BACKLOG (Status row mới khi xác nhận xong). |

### Bước B — Viết theo template

#### 3.1 Endpoint mới (trong `README.md`)

Thêm vào **API table** theo đúng thứ tự CRUD: Create → Read → Update → Delete → Action. Mỗi hàng có **method + path + permission + body shape + response shape**.

```md
| Method | Path | Permission | Body | Success | Errors |
| ------ | ---- | ---------- | ---- | ------- | ------ |
| POST   | /api/staff | CREATE_STAFF | `{fullName, email, phone, address?, roleId}` | `201 {success:true, data:{user, userId, emailNotificationSent}}` | `400 VALIDATION_ERROR`, `409 DUPLICATE_KEY`, `403 FORBIDDEN` |
```

#### 3.2 Status Report row (trong `docs/BACKLOG.md`)

Một dòng duy nhất, đủ thông tin để người khác reproduce:

```md
| 24 | Tên task | Huỳnh Gia Phúc | Completed | Mô tả 1 câu + cách verify (URL, command, test ID) + Kết quả thực tế (status code, payload, log line). |
```

#### 3.3 Use Case mới (trong `docs/UC/UC-PACKAGE.md`)

Mỗi UC là 1 section với heading `## UC-XX — Tên`. Bắt buộc có:

- **Actor** (Admin / Staff / System)
- **Trigger** (hành động khởi phát)
- **Precondition** (DB phải có gì, user phải ở state nào)
- **Main flow** (numbered steps, mỗi step có actor rõ ràng)
- **Alt flow** (1a, 1b, ... — các nhánh lỗi hoặc exception)
- **Postcondition** (state sau khi UC chạy xong)
- **Business rule** (constraints không thể hiện qua validation, ví dụ "email gửi mỗi staff phải unique trong 24h")

#### 3.4 Test case (trong `docs/tests/UNIT-TEST.md` hoặc `SYSTEM-TEST.md`)

| ID | Test name | Input | Expected | Status |
| -- | --------- | ----- | -------- | ------ |
| UT-15 | N — StaffService.create rejects duplicate phone | `{phone:"0901234567"}` (existing) | `throws ApiError.conflict('DUPLICATE_KEY', ...)` | Passed |

`UT-XX` = unit test, `ST-XX` = system test. Status chỉ 1 trong 3: `Passed` / `Failed` / `Not Executed` (chưa chạy).

#### 3.5 Class/Deployment diagram (PlantUML)

- File mới → đặt tên `CD-XX-Tên.puml` hoặc `SD-XX-Tên.puml` (XX là số thứ tự).
- Class chỉ vẽ khi **đã có trong code** (`src/modules/<name>/` hoặc `src/models/<name>.model.js`). Không vẽ class "sẽ có sau".
- Edge **orthogonal** (`->` mặc định trong PlantUML), không vẽ cong.
- Mỗi diagram có 1 dòng comment đầu file: `title` + UC tương ứng (nếu có).

#### 3.6 Sequence diagram (PlantUML)

Một SD cho mỗi UC có ≥ 2 message qua lại giữa frontend ↔ backend ↔ DB ↔ email provider.

Format: `actor` → `participant "API" as api` → ... → `database "MongoDB"`. Mỗi arrow có nhãn là HTTP method + path hoặc tên method.

---

## 4. Các lỗi hay gặp khi viết doc — đừng phạm

❌ **Doc mô tả code chưa tồn tại**: "Hệ thống sẽ có role MANAGER" trong khi `Role` collection chưa có document `MANAGER`.  
   ✅ Cách đúng: chờ seed xong, rồi viết "Hệ thống hiện có 2 role: ADMIN, STAFF (seed xem `scripts/seed.js`)".

❌ **Endpoint doc chỉ liệt kê path, không có response shape**: "POST /api/staff — tạo staff".  
   ✅ Cách đúng: liệt kê status code, payload body, error codes.

❌ **BACKLOG row chỉ ghi "Done"**: không có cách verify.  
   ✅ Cách đúng: kèm URL + command + log line đã quan sát.

❌ **PlantUML vẽ class mà không có trong `src/`**: vi phạm "không bịa".  
   ✅ Cách đúng: chỉ vẽ class thực sự tồn tại.

❌ **Test doc liệt kê test chưa viết**: "ST-25: Performance test với 10k records".  
   ✅ Cách đúng: status `Not Executed`, kèm note "chưa implement, mục tiêu 100ms P95".

---

## 5. Checklist trước khi commit

- [ ] Code đã `npm run lint` pass.
- [ ] Code đã `npm test` pass (nếu có test).
- [ ] README API table khớp với router thật (`grep -r "router\." backend/src/modules/`).
- [ ] BACKLOG có hàng mới cho task vừa xong.
- [ ] UC package có UC tương ứng (nếu là UC mới).
- [ ] SYSTEM-TEST có scenario cho UC mới.
- [ ] Không có file doc thừa / trùng lặp trong commit.

---

## 6. Cách chạy tài liệu

```bash
# Render PlantUML sang PNG (cần PlantUML CLI hoặc docker)
docker run -v ${PWD}/docs/plantuml:/work plantuml/plantuml -tpng /work/*.puml

# Xem doc hệ thống nhanh
ls -la docs/
```

---

## 7. Khi nào KHÔNG cần viết docs?

- Sửa typo, format code, đổi tên biến private.
- Thêm 1 test case mới (chỉ thêm row vào `UNIT-TEST.md` hoặc `SYSTEM-TEST.md` — không cần file mới).
- Update dependency (chỉ cập nhật `README.md` nếu có compatibility note).