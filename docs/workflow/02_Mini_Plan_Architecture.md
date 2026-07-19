# Mini Plan - Architecture & Tech Stack Decision

## 📋 Mục Đích

Document này chốt các quyết định về kiến trúc, công nghệ, data model và business rules **trước khi chia task và implement**.

Đây là cầu nối giữa FRS (yêu cầu nghiệp vụ) và Task Breakdown (chia task nhỏ).

---

## 🎯 Input & Output

**Input:**

- [01_Requirements_FRS.md](./01_Requirements_FRS.md) - Requirements đã được làm rõ

**Output:**

- Tech stack decisions (chốt)
- Architecture pattern (chốt)
- Data model mức cao (chốt)
- Business rules summary (chốt)
- Project structure (chốt)

**Sử dụng cho:**

- Task Breakdown (chia task 30-90 phút)
- Viết prompt.xml (có context architecture)
- Implementation (không phải đoán)

---

## 🏗️ 1. Kiến Trúc Hệ Thống

### 1.1. Architecture Pattern

**3-Tier Architecture:**

```
┌─────────────────┐
│   Frontend      │ ← React + Vite + TypeScript
│  (Port 5173)    │    Client-side SPA
└────────┬────────┘
         │ HTTP/REST API
         │ JSON over HTTPS
┌────────▼────────┐
│   API Server    │ ← Node.js + Express + TypeScript
│  (Port 3000)    │    RESTful endpoints
└────────┬────────┘
         │ Prisma ORM
         │ PostgreSQL protocol
┌────────▼────────┐
│   Database      │ ← PostgreSQL (Supabase)
│  (Cloud)        │    Relational database
└─────────────────┘
```

**Đặc điểm:**

- Stateless API (JWT/Cookie authentication)
- Client-side routing (React Router)
- Database migration via Prisma
- Monorepo structure (apps + packages)

---

### 1.2. Monorepo Structure

```
Manager_Account_Lienquan/
├── apps/
│   ├── web/                 # React frontend
│   └── api/                 # Express backend
├── packages/
│   └── shared/              # Shared types, constants
├── docs/                    # Documentation
├── Promt/                   # Task prompts
└── package.json             # Root workspace config
```

**Lý do chọn monorepo:**

- Share types giữa frontend & backend
- Single repo, dễ quản lý
- Consistent tooling (TypeScript, ESLint)

---

## 💻 2. Tech Stack (Chốt)

### 2.1. Frontend

| Technology       | Version | Lý do chọn                              |
| ---------------- | ------- | --------------------------------------- |
| **React**        | 18+     | Component-based, ecosystem lớn          |
| **Vite**         | 5+      | Fast dev server, HMR, optimized build   |
| **TypeScript**   | 5+      | Type safety, refactor an toàn           |
| **React Router** | 6+      | Client-side routing                     |
| **Tailwind CSS** | 3+      | Utility-first, responsive, fast styling |
| **Axios**        | Latest  | HTTP client                             |

**Deploy:** Vercel

---

### 2.2. Backend

| Technology       | Version | Lý do chọn                           |
| ---------------- | ------- | ------------------------------------ |
| **Node.js**      | 20 LTS  | Runtime ổn định, async I/O           |
| **Express**      | 4+      | Minimalist, flexible, mature         |
| **TypeScript**   | 5+      | Type safety, shared với frontend     |
| **Prisma**       | 5+      | Type-safe ORM, migration, PostgreSQL |
| **bcrypt**       | Latest  | Password hashing                     |
| **jsonwebtoken** | Latest  | JWT authentication                   |
| **nodemailer**   | Latest  | Gửi email invitation + welcome (SMTP) |

**Deploy:** Vercel Serverless hoặc Railway

---

### 2.3. Database

| Technology     | Lý do chọn                                      |
| -------------- | ----------------------------------------------- |
| **PostgreSQL** | Relational, ACID, proven                        |
| **Supabase**   | Managed PostgreSQL, free tier đủ MVP            |
| **Prisma ORM** | Type-safe queries, migration, schema versioning |

---

## 🗄️ 3. Data Model (Chốt)

### 3.1. Core Entities

**5 tables chính:**

1. **users** - Người dùng
2. **accs** - Tài khoản game
3. **memberships** - Thành viên của acc
4. **invitations** - Lời mời tham gia
5. **status_history** - Lịch sử thay đổi

### 3.2. Entity Relationships

```
User (1) ──────── (N) Acc
                       │
User (N) ─── (N) Membership ─── (N) Acc
                       │
User (1) ──────── (N) Invitation ──── (1) Acc
                       │
Acc (1) ───────── (N) StatusHistory
```

### 3.3. Schema Summary

#### users

- `id` (UUID, PK)
- `email` (unique)
- `passwordHash`
- `displayName`
- `createdAt`, `updatedAt`

#### accs

- `id` (UUID, PK)
- `name`
- `ownerUserId` (FK → users)
- `status` (AVAILABLE | IN_USE | PENDING_LOGOUT)
- `note`
- `createdAt`, `updatedAt`

#### memberships

- `id` (UUID, PK)
- `accId` (FK → accs)
- `userId` (FK → users)
- `role` (OWNER | MEMBER)
- `memberStatus` (IDLE | PLAYING | PENDING_LOGOUT | KICKED)
- `joinedAt`, `leftAt`
- **Unique:** (accId, userId)

#### invitations

- `id` (UUID, PK)
- `accId` (FK → accs)
- `invitedUserId` (FK → users, nullable)
- `invitedByUserId` (FK → users)
- `status` (PENDING | ACCEPTED | REJECTED | EXPIRED)
- `expiresAt` (createdAt + 24h)
- `createdAt`, `respondedAt`

#### status_history

- `id` (UUID, PK)
- `accId` (FK → accs)
- `userId` (FK → users, nullable)
- `actionType` (play_start, play_end, logout_confirm, etc.)
- `fromStatus`, `toStatus`
- `note`
- `createdAt`

**Full Prisma Schema:** Xem `apps/api/src/infra/prisma/schema.prisma`

---

## 🔐 4. Authentication Flow (Chốt)

### 4.1. Phương Thức

- **Email/Password authentication**
- Password hashing: **bcrypt** (10 rounds)
- Token: **JWT** (7 days expiry)
- Storage: **httpOnly cookie** (không dùng localStorage)
- Secure flag: `true` (production HTTPS only)
- SameSite: `strict` (CSRF protection)

### 4.2. Luồng Đăng Nhập

```
1. User submit email/password
2. API verify credentials
3. API generate JWT (exp: 7d)
4. API set httpOnly cookie
5. Client store user info (state/context)
6. Cookie auto-sent với mọi request
7. API middleware verify JWT từ cookie
8. Grant/deny access
```

### 4.3. Session Management

- Session valid: **7 ngày**
- Auto logout: sau 7 ngày hoặc manual logout
- Cookie cleared: khi logout
- No refresh token: (MVP simplicity)

---

## 📐 5. Project Structure (Chốt)

### 5.1. Frontend Structure (Feature-based)

```
apps/web/src/
├── pages/              # Routing pages
│   ├── login/
│   ├── acc-list/
│   ├── acc-detail/
│   └── profile/
├── components/         # Reusable UI
│   ├── common/        # Button, Input, Card
│   ├── layout/        # Header, Sidebar, Footer
│   └── widgets/       # Complex UI blocks
├── features/          # Business logic
│   ├── auth/
│   ├── acc-management/
│   ├── invite-member/
│   ├── play-session/
│   └── membership/
└── shared/            # Cross-cutting
    ├── api/          # API client
    ├── ui/           # Design primitives
    ├── hooks/        # Custom hooks
    ├── lib/          # Utils
    ├── constants/    # Enums, constants
    └── types/        # TypeScript types
```

**Quy tắc:**

- `pages`: Routing + layout assembly only
- `features`: Business logic + state
- `components`: Pure UI, reusable
- `shared`: Truly shared across features

---

### 5.2. Backend Structure (Domain-based)

```
apps/api/src/
├── app/
│   ├── server.ts       # Express setup
│   ├── routes.ts       # Route aggregation
│   ├── middleware/     # Auth, error handling
│   └── config/         # Environment config
├── modules/            # Domain modules
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   └── auth.schemas.ts
│   ├── accs/
│   ├── memberships/
│   ├── invitations/
│   └── history/
├── infra/              # Infrastructure
│   ├── prisma/        # Schema, migrations
│   ├── db/            # DB client
│   └── logger/        # Logging
└── shared/            # Shared backend code
    ├── errors/        # Custom errors
    ├── utils/         # Helpers
    ├── constants/     # Enums
    └── types/         # Types
```

**Layer responsibilities:**

- `routes`: HTTP routing
- `controller`: Request/response handling
- `service`: Business logic
- `repository`: Data access (Prisma wrapper)
- `schemas`: Validation (Zod)

---

## 📋 6. Business Rules (Chốt)

### 6.1. Session

- ✅ 7 ngày session validity
- ✅ httpOnly cookie (XSS protection)
- ✅ Auto logout sau expiry

### 6.2. Account Listing

- ✅ **3 tab bắt buộc:**
  - **Tất cả:** Toàn bộ acc có quyền xem
  - **Acc của tôi:** owner_user_id = current_user
  - **Acc đã tham gia:** membership.role = MEMBER

### 6.3. Invitation

- ✅ 24 giờ expiry
- ✅ Pending không tính vào member limit
- ✅ Chỉ owner mới invite được
- ✅ **Email notification (SMTP):**
  - Gửi email **invitation** khi tạo lời mời (tới `invited_email`)
  - Gửi email **welcome** khi accept thành công
  - Provider: **Nodemailer + SMTP** (env: `SMTP_*`, `MAIL_FROM`)
  - Module: `apps/api/src/infra/email/`
  - Gửi best-effort: lỗi SMTP không rollback invitation/membership (log lỗi); in-app flow vẫn là nguồn sự thật

### 6.4. Membership

- ✅ Max 5 members/acc (bao gồm owner)
- ✅ Owner cũng là member (role=OWNER)
- ✅ Kicked members không tính limit

### 6.5. Play Session

- ✅ 1 người chơi/acc tại 1 thời điểm
- ✅ Status flow: idle → playing → pending_logout → idle
- ✅ pending_logout không auto expire (MVP)
- ✅ Owner có quyền force reset

### 6.6. Permissions

| Action                   | Owner | Member |
| ------------------------ | ----- | ------ |
| View acc                 | ✅    | ✅     |
| Play                     | ✅    | ✅     |
| End session              | ✅    | ✅     |
| Confirm logout           | ✅    | ✅     |
| Create/Update/Delete acc | ✅    | ❌     |
| Invite member            | ✅    | ❌     |
| Kick member              | ✅    | ❌     |
| Force reset status       | ✅    | ❌     |

---

## 🌐 7. API Boundaries (Chốt)

### 7.1. Endpoint Structure

```
/api/v1
├── /auth
│   ├── POST   /signup
│   ├── POST   /login
│   ├── POST   /logout
│   └── GET    /me
│
├── /accs
│   ├── GET    /             # List (filter by tab)
│   ├── POST   /             # Create (owner)
│   ├── GET    /:id
│   ├── PATCH  /:id          # Update (owner)
│   └── DELETE /:id          # Delete (owner)
│
├── /accs/:id/members
│   ├── GET    /
│   └── DELETE /:memberId    # Kick (owner)
│
├── /accs/:id/invitations
│   ├── GET    /
│   ├── POST   /             # Send (owner)
│   ├── POST   /:invId/accept
│   └── POST   /:invId/reject
│
├── /accs/:id/status
│   ├── POST   /play
│   ├── POST   /end
│   ├── POST   /confirm-logout
│   └── POST   /force-reset  # Owner only
│
└── /history
    └── GET    /             # Filter by acc_id
```

### 7.2. Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## 🔒 8. Security (Chốt)

### 8.1. Authentication

- ✅ bcrypt password hashing (10 rounds)
- ✅ httpOnly cookies (XSS mitigation)
- ✅ Secure flag for HTTPS
- ✅ SameSite strict (CSRF protection)

### 8.2. Authorization

- ✅ JWT/session verification middleware
- ✅ Role-based checks (owner vs member)
- ✅ Resource ownership validation

### 8.3. Input Validation

- ✅ Zod schemas for all API inputs
- ✅ Sanitize user input
- ✅ Parameterized queries (Prisma)

### 8.4. CORS

- ✅ Allow frontend origin only
- ✅ Credentials: include

---

## 🚀 9. Deployment (Chốt)

### 9.1. Frontend (Vercel)

- Build: `npm run build`
- Output: `dist/`
- Framework: Vite
- Env: `VITE_API_URL`

### 9.2. Backend (Vercel/Railway)

- Runtime: Node.js 20
- Build: `npm run build`
- Start: `npm start`
- Env:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NODE_ENV=production`

### 9.3. Database (Supabase)

- Service: Supabase Free Tier
- Migration: Prisma CLI
- Backup: Auto by Supabase

---

## ✅ 10. Acceptance Criteria

Sau khi đọc document này, team phải:

- ✅ Biết chính xác tech stack sẽ dùng
- ✅ Hiểu rõ cấu trúc thư mục frontend/backend
- ✅ Biết data model có bao nhiêu table, quan hệ thế nào
- ✅ Hiểu auth flow (JWT + httpOnly cookie)
- ✅ Biết business rules chính (7d session, 24h invite, 5 max members, etc.)
- ✅ Biết API endpoints structure
- ✅ Không phải đoán hoặc tự quyết định lại architecture
- ✅ Có thể bắt đầu chia task nhỏ (Task Breakdown)
- ✅ Có thể viết prompt.xml có context architecture

---

## 📊 11. Decision Summary

| Decision           | Choice                           | Locked? |
| ------------------ | -------------------------------- | ------- |
| Frontend framework | React 18 + Vite 5 + TypeScript 5 | ✅ Yes  |
| Backend framework  | Node.js 20 + Express 4 + TS 5    | ✅ Yes  |
| Database           | PostgreSQL via Supabase          | ✅ Yes  |
| ORM                | Prisma 5                         | ✅ Yes  |
| Auth method        | JWT + httpOnly cookie            | ✅ Yes  |
| Session duration   | 7 days                           | ✅ Yes  |
| Invitation expiry  | 24 hours                         | ✅ Yes  |
| Max members/acc    | 5 (including owner)              | ✅ Yes  |
| Max players/acc    | 1 at a time                      | ✅ Yes  |
| Frontend structure | Feature-based modules            | ✅ Yes  |
| Backend structure  | Domain-based modules             | ✅ Yes  |
| Deployment (FE)    | Vercel                           | ✅ Yes  |
| Deployment (BE)    | Vercel/Railway                   | ✅ Yes  |

---

## 📝 12. Next Steps

**Sau document này:**

1. ✅ Đọc [04_Task_Breakdown.md](./04_Task_Breakdown.md)
2. ✅ Chia thành tasks 30-90 phút
3. ✅ Mỗi task viết prompt.xml theo [04_Prompt_Template.xml](./04_Prompt_Template.xml)
4. ✅ Giao cho AI Agent implement
5. ✅ Review, test, build

**Không được:**

- ❌ Thay đổi tech stack đã chốt
- ❌ Thay đổi data model đã chốt
- ❌ Thay đổi business rules đã chốt
- ❌ Tự suy diễn architecture khác

**Nếu cần thay đổi:**

- Phải update document này trước
- Phải review với team
- Phải có lý do rõ ràng

---

## 📖 Changelog

| Date       | Author  | Changes                            |
| ---------- | ------- | ---------------------------------- |
| 2026-07-10 | Kiro AI | Initial architecture decision doc  |
| 2026-07-10 | Kiro AI | Extracted from Task 0 COMPLETED.md |
| 2026-07-10 | Kiro AI | Renumbered from 03 to 02           |

---

**Status:** ✅ **LOCKED**  
**Purpose:** Architecture reference for all tasks  
**Usage:** Read before Task Breakdown and writing prompts
