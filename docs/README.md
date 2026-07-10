# 📚 Documentation Index

Tất cả documentation của project Manager Account Liên Quân.

---

## 📂 Cấu Trúc

```
docs/
├── README.md                  ← File này
│
├── workflow/                  ← Quy trình làm việc với AI
│   ├── README.md
│   ├── 01_Requirements_FRS.md
│   ├── 02_Mini_Plan_Architecture.md
│   ├── 03_Task_Breakdown.md
│   └── 04_Prompt_Template.xml
│
├── guides/                    ← Hướng dẫn setup & sử dụng
│   ├── HUONG_DAN_SUPABASE.md
│   ├── HUONG_DAN_CHAY.md
│   └── SETUP_SUCCESS.md
│
└── tasks_report/              ← Báo cáo hoàn thành các tasks
    ├── TEMPLATE.md            ← Template cho task mới
    ├── task-0/                ← Architecture & Setup
    ├── task-1/                ← Authentication
    └── task-2/                ← Account List
```

---

## 🎯 3 Categories Chính

### 1. **workflow/** - Quy Trình & Requirements

Document quy trình làm việc, requirements, planning

**Files:**

- `README.md` - Tổng quan quy trình AI Agent Code
- `01_Requirements_FRS.md` - Functional Requirements
- `02_Mini_Plan_Architecture.md` - Chốt kiến trúc & tech stack
- `03_Task_Breakdown.md` - Breakdown tasks 30-90 phút
- `04_Prompt_Template.xml` - Template tạo prompt

**Khi nào dùng:**

- Hiểu quy trình development
- Tạo prompt cho task mới
- Reference requirements

---

### 2. **guides/** - Hướng Dẫn Thực Hành

Hướng dẫn setup, configuration, usage

**Files:**

- `HUONG_DAN_SUPABASE.md` - Setup Supabase database
- `HUONG_DAN_CHAY.md` - Chạy ứng dụng
- `SETUP_SUCCESS.md` - Verify setup thành công

**Khi nào dùng:**

- Setup project lần đầu
- Developer mới join
- Troubleshoot setup

---

### 3. **tasks_report/** - Báo Cáo Hoàn Thành Tasks

Báo cáo thay đổi, kết quả và rủi ro sau khi hoàn thành mỗi task

**Structure:**

- `TEMPLATE.md` - Template cho task mới (3 files: README, COMPLETED, CHANGELOG)
- `task-X/` - Folder riêng mỗi task

**Mỗi task có 3 files:**

| File           | Mục đích                           | Cập nhật                 |
| -------------- | ---------------------------------- | ------------------------ |
| `README.md`    | Documentation, API, scope, testing | Ít thay đổi              |
| `COMPLETED.md` | Thay đổi - Kết quả - Rủi ro        | Cập nhật khi có thay đổi |
| `CHANGELOG.md` | Lịch sử versions                   | Thêm version mới         |

**Khi nào dùng:**

- Implement task mới → Dùng TEMPLATE.md
- Review code → Đọc COMPLETED.md
- Track history → Xem CHANGELOG.md
- Test → Xem README.md section Testing

---

## 📋 Quy Tắc Documentation

### Rule 1: Mỗi Task = 1 Folder

```
task-0/  ← Architecture
task-1/  ← Authentication
task-2/  ← Account List
```

### Rule 2: 3 Files Cố Định

```
README.md       ← Documentation (scope, API, testing)
COMPLETED.md    ← Thay đổi - Kết quả - Rủi ro
CHANGELOG.md    ← Lịch sử versions
```

### Rule 3: Workflow Khi Có Thay Đổi

1. **Sửa code** (fix bug, add feature)
2. **Update COMPLETED.md**:
   - Section 1: Thay đổi (files, features)
   - Section 2: Kết quả (AC, tests)
   - Section 3: Rủi ro (issues, risks)
3. **Add version mới vào CHANGELOG.md** (ở đầu file)

### Rule 4: CHANGELOG Version

- **v1.0.0**: Initial release (toàn bộ task)
- **v1.0.x**: Bugfix (chỉ ghi bug đã fix)
- **v1.x.0**: Feature mới (chỉ ghi feature mới)
- **v2.0.0**: Breaking change

---

## 🚀 Quick Start

### Developer Mới:

1. Đọc [Project Overview](../README.md)
2. Setup theo [guides/](./guides/)
3. Hiểu architecture: [tasks_report/task-0/](./tasks_report/task-0/)
4. Review quy trình: [workflow/README.md](./workflow/README.md)

### Implement Task Mới:

1. Đọc [workflow/01_Requirements_FRS.md](./workflow/01_Requirements_FRS.md)
2. Review [workflow/02_Mini_Plan_Architecture.md](./workflow/02_Mini_Plan_Architecture.md)
3. Check [workflow/03_Task_Breakdown.md](./workflow/03_Task_Breakdown.md)
4. Tạo prompt theo [workflow/04_Prompt_Template.xml](./workflow/04_Prompt_Template.xml)
5. Tạo doc theo [tasks_report/TEMPLATE.md](./tasks_report/TEMPLATE.md)

### Review Code:

1. Vào `tasks_report/task-X/`
2. Đọc `COMPLETED.md` - Section 1: Thay đổi
3. Đọc `COMPLETED.md` - Section 2: Kết quả
4. Check `COMPLETED.md` - Section 3: Rủi ro
5. Run test theo `README.md` section Testing

---

## 📊 Project Status

### Completed: 2/6 Tasks

- ✅ Task 0: Architecture & Setup
- ✅ Task 1: Authentication

### Planned:

- 🔜 Task 2: Account List
- 🔜 Task 3: Account Detail
- 🔜 Task 4: Invitation System
- 🔜 Task 5: Play Session
- 🔜 Task 6: CRUD Operations

**Progress:** 33%

---

## 🔍 Quick Links

| Need to...          | Go to...                                                                         |
| ------------------- | -------------------------------------------------------------------------------- |
| Setup project       | [guides/HUONG_DAN_SUPABASE.md](./guides/HUONG_DAN_SUPABASE.md)                   |
| Run app             | [guides/HUONG_DAN_CHAY.md](./guides/HUONG_DAN_CHAY.md)                           |
| Understand workflow | [workflow/README.md](./workflow/README.md)                                       |
| See requirements    | [workflow/01_Requirements_FRS.md](./workflow/01_Requirements_FRS.md)             |
| Review architecture | [workflow/02_Mini_Plan_Architecture.md](./workflow/02_Mini_Plan_Architecture.md) |
| Create task doc     | [tasks_report/TEMPLATE.md](./tasks_report/TEMPLATE.md)                           |
| Review task 1       | [tasks_report/task-1/COMPLETED.md](./tasks_report/task-1/COMPLETED.md)           |
| Review task 2       | [tasks_report/task-2/COMPLETED.md](./tasks_report/task-2/COMPLETED.md)           |

---

## 💡 Best Practices

**Documentation:**

- ✅ Keep docs updated with code
- ✅ Write clear, concise
- ✅ Include examples
- ✅ Use tables for easy scanning

**Organization:**

- ✅ One folder per task
- ✅ Follow 3-file structure (README, COMPLETED, CHANGELOG)
- ✅ No duplicate files

**Versioning:**

- ✅ v1.0.0 = Initial release (toàn bộ)
- ✅ v1.0.x = Bugfix (chỉ ghi bug fix)
- ✅ v1.x.0 = Feature (chỉ ghi feature mới)
- ✅ Add new version ở đầu CHANGELOG

**When to Update:**

- ✅ Code changed → Update COMPLETED.md
- ✅ Bug fixed → Add version to CHANGELOG.md
- ✅ Feature added → Update both files
- ✅ README.md rarely changes

---

## 📝 Changelog

| Date       | Author  | Changes                                       |
| ---------- | ------- | --------------------------------------------- |
| 2026-07-10 | Kiro AI | Refactored tasks → tasks_report (3 files)     |
| 2026-07-10 | Kiro AI | Updated structure: README/COMPLETED/CHANGELOG |
| 2026-07-10 | Kiro AI | Added Mini Plan Architecture to workflow      |
| 2026-07-10 | Kiro AI | Renamed workflow/00→README, renumbered files  |
| 2026-07-08 | Kiro AI | Simplified structure                          |
| 2026-07-08 | Kiro AI | Merged with DOCUMENTATION_GUIDE               |
| 2026-07-08 | Kiro AI | Initial documentation index                   |

---

**Created:** 2026-07-08  
**Last Updated:** 2026-07-08  
**Maintainer:** Team N2
