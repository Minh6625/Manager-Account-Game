# Workflow Index - Case Study Web Quản Lý Acc Liên Quân

## 📋 Thứ Tự Làm Việc

1. **Làm rõ yêu cầu** → [01_Requirements_FRS.md](01_Requirements_FRS.md)
2. **Lập mini plan** → [02_Mini_Plan_Architecture.md](02_Mini_Plan_Architecture.md)
3. **Chia task nhỏ** → [03_Task_Breakdown.md](03_Task_Breakdown.md)
4. **Tạo prompt.xml** → [04_Prompt_Template.xml](04_Prompt_Template.xml)
5. **Giao agent code** theo từng task
6. **Agent đọc hiểu** source/architecture
7. **Agent code** trong scope
8. **Engineer review** diff, test, build
9. **Báo cáo** thay đổi, kết quả và rủi ro

---

## 📚 Bộ Tài Liệu

### [01_Requirements_FRS.md](01_Requirements_FRS.md)

**Mục đích:** Yêu cầu nghiệp vụ, UI/UX, acceptance criteria

**Nội dung:**

- Mục tiêu hệ thống
- Đối tượng sử dụng
- Chức năng chính
- Màn hình và luồng nghiệp vụ
- Quy tắc nghiệp vụ
- Dữ liệu cần lưu

**Khi nào dùng:** Bắt đầu project, làm rõ scope

---

### [02_Mini_Plan_Architecture.md](02_Mini_Plan_Architecture.md) ⭐ MỚI

**Mục đích:** Chốt kiến trúc, tech stack, data model, business rules

**Nội dung:**

- Tech stack decisions (React, Node, PostgreSQL)
- Architecture pattern (3-tier)
- Data model (5 tables + relationships)
- Authentication flow (JWT + httpOnly cookie)
- Project structure (feature-based FE, domain-based BE)
- Business rules summary
- API boundaries
- Security considerations

**Khi nào dùng:** Sau FRS, trước Task Breakdown. Đây là foundation cho tất cả tasks.

**Lý do quan trọng:**

- Agent không phải đoán architecture
- Team có common understanding về tech
- Tránh inconsistent decisions giữa các tasks

---

### [03_Task_Breakdown.md](03_Task_Breakdown.md)

**Mục đích:** Chia thành tasks nhỏ 30-90 phút

**Nội dung:**

- Task list với scope rõ ràng
- Mỗi task có:
  - Mục tiêu
  - Scope được phép
  - Scope không được làm
  - Output cần có
  - Acceptance criteria
  - Test plan
  - Ước lượng thời gian

**Khi nào dùng:** Sau Mini Plan, trước viết prompt

---

### [04_Prompt_Template.xml](04_Prompt_Template.xml)

**Mục đích:** Template để tạo prompt.xml cho từng task

**Nội dung:**

- Cấu trúc prompt chuẩn
- Sections bắt buộc
- Ví dụ mẫu

**Khi nào dùng:** Khi viết prompt cho agent

---

## 🔄 Quy Trình Chi Tiết

### Bước 1: Làm Rõ Yêu Cầu (FRS)

- Input: Ý tưởng, user stories
- Output: Requirements document
- Tool: 01_Requirements_FRS.md
- Owner: Product/Business Analyst

### Bước 2: Lập Mini Plan (Architecture)

- Input: FRS
- Output: Architecture decisions, tech stack, data model
- Tool: 02_Mini_Plan_Architecture.md
- Owner: Tech Lead/Architect

### Bước 3: Chia Task Nhỏ (Task Breakdown)

- Input: FRS + Mini Plan
- Output: Task list (30-90 phút/task)
- Tool: 03_Task_Breakdown.md
- Owner: Tech Lead

### Bước 4: Tạo Prompt

- Input: Task Breakdown + Mini Plan
- Output: prompt.xml cho task cụ thể
- Tool: 04_Prompt_Template.xml
- Owner: Engineer

### Bước 5-9: Implementation & Review

- Agent implement theo prompt
- Engineer review code
- Test theo acceptance criteria
- Báo cáo kết quả

---

## 📝 Ghi Chú

### FRS (Requirements)

- ✅ Chỉ giữ yêu cầu nghiệp vụ
- ✅ Không chốt công nghệ
- ✅ Không có implementation details

### Mini Plan (Architecture)

- ✅ Chốt tech stack
- ✅ Chốt data model
- ✅ Chốt business rules
- ✅ Chốt project structure
- ✅ Foundation cho tất cả tasks
- ❌ Không có task breakdown chi tiết

### Task Breakdown

- ✅ Chia tasks 30-90 phút
- ✅ Scope rõ ràng từng task
- ✅ Acceptance criteria
- ✅ Test plan
- ❌ Không có code implementation

### Prompt Template

- ✅ Template để tạo prompt.xml
- ✅ Chứa context từ Mini Plan
- ✅ Chứa scope từ Task Breakdown
- ✅ Chỉ dẫn rõ ràng cho agent

---

## ⚠️ Lưu Ý Quan Trọng

### Đừng Skip Mini Plan!

- ❌ Không nhảy thẳng từ FRS → Task Breakdown
- ✅ Phải có Mini Plan ở giữa
- **Lý do:** Agent cần context về architecture để code đúng pattern

### Task Phải Nhỏ

- ✅ 30-90 phút/task
- ✅ Scope rõ ràng
- ❌ Không giao task lớn cho agent

### Prompt Phải Đầy Đủ Context

- ✅ Link đến Mini Plan
- ✅ Reference architecture decisions
- ✅ Chỉ rõ files cần đọc/sửa
- ✅ Output mong đợi cụ thể

---

## 📖 Changelog

| Date       | Author  | Changes                                        |
| ---------- | ------- | ---------------------------------------------- |
| 2026-07-08 | Kiro AI | Initial workflow index                         |
| 2026-07-10 | Kiro AI | Added Mini Plan Architecture step              |
| 2026-07-10 | Kiro AI | Updated workflow to 9 steps                    |
| 2026-07-10 | Kiro AI | Renamed 00→README, renumbered files (02,03,04) |

---

**Created:** 2026-07-08  
**Last Updated:** 2026-07-10  
**Purpose:** Guide workflow cho AI Agent Code development
