# Task 0: Architecture & Setup

## 📋 Documentation Structure

Folder này chứa **4 file cố định** cho Task 0:

```
task-0/
├── README.md          ← File này (giới thiệu)
├── COMPLETED.md       ← Architecture Decision Document
├── SUMMARY.md         ← Báo cáo hoàn thành
├── CHANGELOG.md       ← Lịch sử thay đổi
└── TEST_GUIDE.md      ← Hướng dẫn setup & verify
```

---

## 📖 Mô Tả Các File

### 1. **COMPLETED.md** - Architecture Decision Document

- Kiến trúc 3-tier (Frontend/API/Database)
- Database schema design (5 tables)
- Tech stack decisions
- API structure & endpoints
- Business rules

**Khi nào đọc:** Khi cần hiểu architecture tổng thể

---

### 2. **SUMMARY.md** - Báo Cáo Hoàn Thành

- Tổng hợp những gì đã implement
- Statistics (files, folders, LOC)
- Project structure
- Setup status

**Khi nào đọc:** Khi cần overview nhanh Task 0

---

### 3. **CHANGELOG.md** - Lịch Sử Thay Đổi

- Version history
- Architecture updates
- Schema changes

**Khi nào đọc:** Khi cần track thay đổi architecture

---

### 4. **TEST_GUIDE.md** - Hướng Dẫn Setup

- Supabase setup instructions
- Environment configuration
- Run application
- Verify connections

**Khi nào đọc:** Khi cần setup project lần đầu

---

## 🎯 Task 0 Overview

**Mục tiêu:** Chốt kiến trúc, schema và công nghệ  
**Trạng thái:** ✅ Complete  
**Thời gian:** ~60 phút

**Deliverables:**

- ✅ Architecture Decision Document
- ✅ Database Schema (Prisma)
- ✅ Project Structure (Frontend + Backend)
- ✅ Supabase Setup & Connection
- ✅ Configuration Files
- ✅ Documentation

---

## 📂 What Was Created

### Database Schema (5 tables):

- `users` - User accounts
- `accs` - Game accounts
- `memberships` - Account members
- `invitations` - Membership invitations
- `status_history` - Audit trail

### Project Structure:

```
apps/
├── api/          ← Backend (Express + TypeScript + Prisma)
└── web/          ← Frontend (React + Vite + TypeScript)

packages/
└── shared/       ← Shared types & utils
```

### Tech Stack:

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js 20 + Express + TypeScript + Prisma
- **Database:** PostgreSQL (Supabase)

---

## 🚀 Quick Start

**Xem:** [TEST_GUIDE.md](./TEST_GUIDE.md) để setup từ đầu

**Hoặc nếu đã setup:**

```bash
# Terminal 1 - API
cd Manager_Account_Lienquan/apps/api
npm run dev

# Terminal 2 - Frontend
cd Manager_Account_Lienquan/apps/web
npm run dev
```

---

## 📝 Related Documentation

**Setup Guides:**

- [Supabase Setup](../../guides/HUONG_DAN_SUPABASE.md)
- [Run Application](../../guides/HUONG_DAN_CHAY.md)
- [Setup Success](../../guides/SETUP_SUCCESS.md)

**Workflow:**

- [Requirements FRS](../../workflow/01_Requirements_FRS.md)
- [Task Breakdown](../../workflow/02_Task_Breakdown.md)

---

**Created:** 2026-07-08  
**Last Updated:** 2026-07-08
