# GiaPhuc — AI Engineering Skill Template

> **Đây KHÔNG phải dự án. Đây là một bộ skill template + meta-defense template** dùng để áp dụng lên một dự án thật bất kỳ.

Bộ skill này dạy AI agent cách implement / document / test / model / track work **mà không bịa architecture**. Có sẵn ví dụ minh họa là 8 UC về *Admin Staff Account Management + RBAC + Profile Permission* (trong `examples/UC-01..08/`).

---

## Đây là gì?

| Thư mục | Nội dung | Vai trò |
| ------- | -------- | ------- |
| `.ai/skills/software-engineering/` | 13 rules, 9 templates, 4 checklists, 8 example UCs | **Bộ skill chính** — copy sang dự án target |
| `.cursor/rules/*.mdc` | 5 Cursor rule files | **Layer 2** — Cursor auto-inject khi AI chạm file tương ứng |
| `.cursor/hooks/` | 1 hook script + 1 hook config | **Layer 3** — nhắc AI sau mỗi lần edit |
| `scripts/check-skill-compliance.js` | Validator 6 mechanical checks | **Layer 3** — chạy pre-commit trên dự án target |

## Đây KHÔNG phải gì?

- ❌ Không phải dự án phần mềm — không có source code thật ở đây
- ❌ Không phải dự án *Admin Staff Account Management* — đó chỉ là **ví dụ** minh họa trong `examples/`
- ❌ Không phải ứng dụng chạy được — không có `npm start` ở đây

Repo `backend/`, `frontend/`, `docs/` (đang DELETED trong git) thuộc về **ví dụ minh họa** trong skill, không phải của repo này.

---

## Cách áp dụng vào dự án thật

```bash
# Bước 1: Clone repo này (hoặc copy)
git clone <repo-skill> my-project
cd my-project

# Bước 2: Copy 4 thư mục sang dự án target
cp -r .ai/               /path/to/your-project/
cp -r .cursor/           /path/to/your-project/
cp -r scripts/           /path/to/your-project/

# Bước 3: Trong dự án target, điều chỉnh
#   - .ai/skills/software-engineering/examples/UC-*  ← xóa hoặc thay bằng UC thật
#   - .ai/skills/software-engineering/rules/         ← giữ nguyên, hoặc customize
#   - .cursor/rules/*  globs                        ← chỉnh lại cho match code path dự án

# Bước 4: Wire vào pre-commit
cat >> .git/hooks/pre-commit <<'EOF'
#!/bin/sh
node scripts/check-skill-compliance.js || exit 1
EOF
chmod +x .git/hooks/pre-commit

# Bước 5: Mở Cursor trong dự án target, AI sẽ tự động:
#   - Đọc skill theo AI-READING-GUIDE
#   - Inject rule khi chạm backend/src/** hoặc frontend/src/**
#   - Nhắc nhở sau khi edit
#   - Validate trước commit
```

---

## 3-Layer Defense System

Đảm bảo AI tuân thủ skill bằng 3 lớp phòng thủ (~90% compliance):

| Layer | Cơ chế | File | Compliance tăng |
| ----- | ------ | ---- | --------------- |
| **1 — Reduce friction** | AI đọc file nào trước? | `AI-READING-GUIDE.md` | +25% (so với chỉ có skill thuần) |
| **2 — Persistent context** | Cursor auto-inject | `.cursor/rules/*.mdc` | +10% |
| **3 — Mechanical enforcement** | Phần mềm chặn, không phụ thuộc LLM nhớ | `.cursor/hooks.json` + `scripts/check-skill-compliance.js` | +10% |

**Tổng**: ~95% (5% còn lại là giới hạn LLM, cần human review cuối).

## Compliance estimator

| Setup | Compliance |
| ----- | ---------- |
| Không có gì (baseline) | ~30% |
| Chỉ có skill `.ai/skills/...` | ~50% |
| + Layer 1 (AI-READING-GUIDE) | ~75% |
| + Layer 2 (Cursor rules) | ~85% |
| + Layer 3 (Hooks + validator) | **~95%** |

## Cấu trúc repo

```
.
├── .ai/skills/software-engineering/      ← BỘ SKILL CHÍNH
│   ├── AI-READING-GUIDE.md                ← bản đồ đọc
│   ├── SKILL.md                           ← entry point
│   ├── WORKFLOW.md                        ← 7 phase A–G
│   ├── rules/01..13/                      ← 13 rule ngắn
│   ├── templates/                         ← 9 template
│   ├── checklists/                        ← 4 checklist
│   └── examples/UC-01..08/                ← 8 UC ví dụ (Staff/RBAC)
│
├── .cursor/                               ← LAYER 2 + 3
│   ├── rules/*.mdc                        ← Cursor auto-inject
│   └── hooks/                             ← afterFileEdit
│
├── .cursor/hooks.json                     ← hook config
├── scripts/check-skill-compliance.js      ← validator
│
└── README.md (file này)
```

## Owner

**Huỳnh Gia Phúc** — Last updated: 2026-10-02
