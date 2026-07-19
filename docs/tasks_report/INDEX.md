# 📚 Tasks Index

## Danh Sách Tasks

Đây là tổng hợp tất cả các tasks đã hoàn thành và đang thực hiện.

---

## ✅ Task 0: Architecture & Setup

**Status:** ✅ Complete  
**Date:** 2026-07-08  
**Time:** ~60 phút

**Mục tiêu:** Chốt kiến trúc, schema và công nghệ

**Deliverables:**

- Architecture Decision Document
- Database Schema (Prisma - 5 tables)
- Project Structure (Frontend + Backend)
- Supabase Setup & Connection
- Configuration Files
- Documentation

**Documentation:** [→ task-0/](./task-0/)

---

## ✅ Task 1: Authentication

**Status:** ✅ Complete  
**Date:** 2026-07-08  
**Time:** ~45 phút

**Mục tiêu:** Đăng nhập nội bộ và ghi nhớ phiên (7 ngày)

**Features:**

- User signup/login
- JWT token với httpOnly cookie
- Remember login (7 days)
- Show/hide password toggle
- Protected routes

**Documentation:** [→ task-1/](./task-1/)

---

## ✅ Task 2: Account List

**Status:** ✅ Complete  
**Date:** 2026-07-10  
**Time:** ~60 phút

**Mục tiêu:** Hiển thị danh sách tài khoản với 3-tab filter

**Features:**

- List all accounts with filter
- 3-tab filter (All, My Accs, Joined Accs)
- Search by account name
- Status badges (Available, In Use, Pending Logout)
- Create account modal
- Responsive mobile design

**Documentation:** [→ task-2/](./task-2/)

---

## ✅ Task 3: Account Detail

**Status:** ✅ Complete  
**Date:** 2026-07-10 (approx.)

**Mục tiêu:** Trang chi tiết tài khoản

**Features:**

- Account info display
- Member list
- Status history
- Action buttons placeholders by role

**Documentation:** [→ task-3/](./task-3/)

---

## ✅ Task 4: Invitation System

**Status:** ✅ Complete  
**Date:** 2026-07-12

**Mục tiêu:** Mời thành viên vào tài khoản

**Features:**

- Send invitation (owner, by email)
- Accept/reject invitation
- 24h expiry (lazy)
- Pending does not count toward 5 members
- Invitation list + my pending panel
- History INVITE_* / MEMBER_JOIN

**Documentation:** [→ task-4/](./task-4/)

---

## ✅ Task 5: Play Session Management

**Status:** ✅ Complete  
**Date:** 2026-07-13

**Mục tiêu:** Quản lý phiên chơi

**Features:**

- Start playing when AVAILABLE
- Block when held by another member
- End session → PENDING_LOGOUT
- Confirm logout → AVAILABLE
- Owner force reset
- Status history for all transitions

**Documentation:** [→ task-5/](./task-5/)

---

## ✅ Task 6: CRUD Accounts

**Status:** ✅ Complete  
**Date:** 2026-07-14  
**Time:** ~75 phút

**Mục tiêu:** Chủ phòng sửa/xóa acc (tạo acc đã có từ Task 2); skeleton kick

**Features:**

- Update account (name, note) — owner only
- Delete account + confirm modal — owner only
- Kick API/UI baseline
- History CREATE / UPDATE / DELETE / MEMBER_KICK

**Documentation:** [→ task-6/](./task-6/)

---

## ✅ Task 7: Kick Members

**Status:** ✅ Complete  
**Date:** 2026-07-14  
**Time:** ~40 phút

**Mục tiêu:** Chuẩn hóa kick thành viên theo AC Task 7

**Features:**

- Owner-only kick + confirm modal + holder warning
- `KICKED` + `leftAt`; mất quyền ngay; không giữ thẻ KICKED trên list
- History actor + note người bị kick

**Documentation:** [→ task-7/](./task-7/)

---

## 📊 Progress Summary

| Task                   | Status | Time | Files | LOC  |
| ---------------------- | ------ | ---- | ----- | ---- |
| Task 0: Architecture   | ✅     | 60m  | 12    | ~800 |
| Task 1: Authentication | ✅     | 45m  | 8     | ~500 |
| Task 2: Account List   | ✅     | 60m  | 9     | ~500 |
| Task 3: Account Detail | ✅     | ~75m | -     | -    |
| Task 4: Invitation     | ✅     | -    | -     | -    |
| Task 5: Play Session   | ✅     | ~75m | ~12   | ~900 |
| Task 6: CRUD           | ✅     | ~75m | ~15   | ~900 |
| Task 7: Kick           | ✅     | ~40m | ~8    | ~300 |

**Total Completed:** 8/8 tasks (MVP core done)

---

## 📂 Documentation Structure

Mỗi task có **4 file cố định**:

```
task-X/
├── README.md          ← Giới thiệu
├── COMPLETED.md       ← Báo cáo chi tiết
├── SUMMARY.md         ← Tóm tắt
├── CHANGELOG.md       ← Lịch sử thay đổi
└── TEST_GUIDE.md      ← Hướng dẫn test
```

**Template:** [→ TEMPLATE.md](./TEMPLATE.md)

---

## 🚀 Quick Navigation

### By Status

- **Completed:** [Task 0](./task-0/), [Task 1](./task-1/), [Task 2](./task-2/), [Task 3](./task-3/), [Task 4](./task-4/), [Task 5](./task-5/), [Task 6](./task-6/), [Task 7](./task-7/)
- **In Progress:** None
- **Planned:** None (MVP core)

### By Type

- **Auth:** [Task 1](./task-1/)
- **UI/List:** [Task 2](./task-2/)
- **Detail/CRUD:** [Task 3](./task-3/), [Task 6](./task-6/), [Task 7](./task-7/)
- **Features:** [Task 4](./task-4/), [Task 5](./task-5/)

---

## 📝 Update Instructions

**Khi hoàn thành task mới:**

1. Tạo folder `task-X/`
2. Copy structure từ `TEMPLATE.md`
3. Tạo 5 files (README + 4 core files)
4. Update `INDEX.md` này (status, stats)

**Khi update task đã có:**

1. Sửa code
2. Update 4 core files trong `task-X/`
3. Không tạo file mới!

---

**Created:** 2026-07-08  
**Last Updated:** 2026-07-14  
**Next Task:** Polish / deploy / post-MVP (email, realtime, …)

---

## Changelog

| Date       | Author   | Changes                                      |
| ---------- | -------- | -------------------------------------------- |
| 2026-07-08 | AI Agent | Initial creation                             |
| 2026-07-10 | AI Agent | Task 2 completed - Account list with filters |
| 2026-07-13 | AI Agent | Task 5 completed - Play session management   |
| 2026-07-14 | AI Agent | Task 6 completed - CRUD acc + kick baseline  |
| 2026-07-14 | AI Agent | Task 7 completed - Kick member (full AC)     |
