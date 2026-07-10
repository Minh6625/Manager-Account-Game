# Task 0: Architecture Decision Document

## Web Quản Lý Acc Liên Quân - Kiến trúc hệ thống

---

## 1. Tóm tắt kiến trúc

### Tổng quan

Hệ thống web quản lý trạng thái acc game Liên Quân được xây dựng theo mô hình **3-tier architecture**:

- **Frontend**: React SPA (Single Page Application) với Vite + TypeScript
- **API Layer**: RESTful API với Node.js + Express + TypeScript
- **Database**: PostgreSQL qua Supabase (Database as a Service)

### Đặc điểm chính

- **Monorepo structure** với Apps và Packages riêng biệt
- **Feature-based module** cho frontend (dễ scale và maintain)
- **Domain-driven module** cho backend (theo nghiệp vụ)
- **Stateless API** với JWT/Session token cho authentication
- **Manual state management** - user tự khai báo trạng thái, không tích hợp game

---

## 2. Core Entities và Relationships

### 2.1. Entity Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────────┐
       │                      │
       ↓                      ↓
┌──────────────┐       ┌─────────────┐
│     Acc      │◄──────│ Membership  │
│  (Account)   │  N:M  │             │
└──────┬───────┘       └─────────────┘
       │
       │ 1:N
       ├──────────────────────┬──────────────────┐
       ↓                      ↓                  ↓
┌──────────────┐       ┌─────────────┐   ┌──────────────┐
│  Invitation  │       │   Status    │   │    History   │
│              │       │   History   │   │              │
└──────────────┘       └─────────────┘   └──────────────┘
```

### 2.2. Entities chi tiết

#### **User**

- `id` (UUID, PK)
- `email` (unique, not null)
- `password_hash` (not null)
- `display_name` (nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Business rule**: User có thể tạo nhiều acc, tham gia nhiều acc với vai trò khác nhau.

---

#### **Acc (Account)**

- `id` (UUID, PK)
- `name` (not null)
- `owner_user_id` (FK → User.id, not null)
- `status` (enum: 'available', 'in_use', 'pending_logout')
- `note` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Business rule**:

- Owner là chủ phòng, có full quyền CRUD
- Mỗi acc chỉ có 1 owner
- Status đồng bộ với member status

---

#### **Membership**

- `id` (UUID, PK)
- `acc_id` (FK → Acc.id, not null)
- `user_id` (FK → User.id, not null)
- `role` (enum: 'owner', 'member')
- `member_status` (enum: 'idle', 'playing', 'pending_logout', 'kicked')
- `joined_at` (timestamp)
- `left_at` (timestamp, nullable)

**Business rule**:

- Unique constraint: (acc_id, user_id) khi left_at IS NULL
- Tối đa 5 active members/acc
- Owner cũng là member với role='owner'

---

#### **Invitation**

- `id` (UUID, PK)
- `acc_id` (FK → Acc.id, not null)
- `invited_user_id` (FK → User.id, nullable)
- `invited_email` (string, nullable)
- `invited_by_user_id` (FK → User.id, not null)
- `status` (enum: 'pending', 'accepted', 'rejected', 'expired')
- `expires_at` (timestamp, default: created_at + 24h)
- `created_at` (timestamp)
- `responded_at` (timestamp, nullable)

**Business rule**:

- Hết hạn sau 24 giờ nếu không xác nhận
- Chỉ chuyển thành member sau khi accepted
- Pending invitation không tính vào giới hạn 5 members

---

#### **StatusHistory**

- `id` (UUID, PK)
- `acc_id` (FK → Acc.id, not null)
- `user_id` (FK → User.id, nullable)
- `action_type` (enum: 'play_start', 'play_end', 'logout_confirm', 'member_join', 'member_kick', 'acc_create', 'acc_update', 'acc_delete')
- `from_status` (string, nullable)
- `to_status` (string, nullable)
- `note` (text, nullable)
- `created_at` (timestamp)

**Business rule**: Audit trail cho mọi thay đổi quan trọng

---

## 3. Technology Decisions (Locked)

### 3.1. Frontend Stack

| Technology        | Version | Lý do chọn                                       |
| ----------------- | ------- | ------------------------------------------------ |
| **React**         | 18+     | Component-based, ecosystem lớn, dễ tìm dev       |
| **Vite**          | 5+      | Fast dev server, HMR nhanh, build tối ưu         |
| **TypeScript**    | 5+      | Type safety, refactor an toàn, IntelliSense      |
| **React Router**  | 6+      | Client-side routing chuẩn                        |
| **Axios / Fetch** | Latest  | HTTP client cho API calls                        |
| **Tailwind CSS**  | 3+      | Utility-first, responsive dễ, component-friendly |

**Deploy target**: Vercel (optimized for React/Vite)

---

### 3.2. Backend Stack

| Technology       | Version | Lý do chọn                                       |
| ---------------- | ------- | ------------------------------------------------ |
| **Node.js**      | 20 LTS  | Runtime ổn định, async I/O tốt                   |
| **Express**      | 4+      | Minimalist, flexible, nhiều middleware           |
| **TypeScript**   | 5+      | Shared types với frontend, type safety           |
| **Prisma**       | 5+      | Type-safe ORM, migration tốt, PostgreSQL support |
| **bcrypt**       | Latest  | Hash password an toàn                            |
| **jsonwebtoken** | Latest  | JWT cho stateless auth                           |

**Deploy target**: Vercel Serverless Functions hoặc service riêng

---

### 3.3. Database & Infrastructure

| Technology        | Lý do chọn                                                     |
| ----------------- | -------------------------------------------------------------- |
| **Supabase Free** | PostgreSQL managed, free tier đủ MVP, built-in auth (optional) |
| **PostgreSQL**    | Relational data, ACID, JSON support, proven stability          |
| **Prisma Schema** | Single source of truth cho database schema                     |

---

### 3.4. Authentication Flow (Locked)

```
┌──────────┐                    ┌─────────┐                   ┌──────────┐
│  Client  │                    │   API   │                   │ Database │
└─────┬────┘                    └────┬────┘                   └────┬─────┘
      │                              │                             │
      │  POST /auth/signup           │                             │
      │  {email, password}           │                             │
      ├─────────────────────────────>│                             │
      │                              │  Hash password              │
      │                              │  Create user                │
      │                              ├────────────────────────────>│
      │                              │<────────────────────────────┤
      │  201 Created                 │                             │
      │<─────────────────────────────┤                             │
      │                              │                             │
      │  POST /auth/login            │                             │
      │  {email, password}           │                             │
      ├─────────────────────────────>│                             │
      │                              │  Verify password            │
      │                              │  Query user                 │
      │                              ├────────────────────────────>│
      │                              │<────────────────────────────┤
      │                              │  Generate JWT (7d expiry)   │
      │  Set-Cookie: token           │  or create session          │
      │  200 OK {user}               │                             │
      │<─────────────────────────────┤                             │
      │                              │                             │
      │  GET /accs                   │                             │
      │  Cookie: token               │                             │
      ├─────────────────────────────>│                             │
      │                              │  Verify token               │
      │                              │  Query accs                 │
      │                              ├────────────────────────────>│
      │                              │<────────────────────────────┤
      │  200 OK {accs[]}             │                             │
      │<─────────────────────────────┤                             │
```

**Phương thức**:

- Email/password authentication
- Password hashing: bcrypt (salt rounds: 10)
- Session storage: **httpOnly cookie** (không dùng localStorage)
- Token: JWT với expiry 7 ngày
- Refresh: Tự động gia hạn khi còn hợp lệ

**Luồng quên mật khẩu**: Email OTP (implement sau, không blocking MVP)

---

## 4. Business Rules (Locked)

### 4.1. Session Management

- ✅ Session hợp lệ: **7 ngày** kể từ login gần nhất
- ✅ Tự động logout sau 7 ngày hoặc khi user chủ động logout
- ✅ Cookie httpOnly để bảo mật, tránh XSS

### 4.2. Account Listing

**3 Tab lọc bắt buộc**:

- **Tất cả**: Toàn bộ acc mà user có quyền xem
- **Acc của tôi**: Acc có `owner_user_id = current_user.id`
- **Acc đã tham gia**: Acc có membership với `user_id = current_user.id AND role = 'member'`

### 4.3. Invitation System

- ✅ Lời mời hết hạn sau: **24 giờ**
- ✅ Status flow: `pending` → `accepted` (trở thành member) hoặc `expired`/`rejected`
- ✅ Pending invitation **không tính** vào giới hạn member
- ✅ Chỉ owner mới được gửi invitation

### 4.4. Membership Limits

- ✅ Tối đa: **5 active members/acc** (bao gồm owner)
- ✅ Chặn invitation mới khi đã đủ 5 members
- ✅ Kicked members không tính vào limit

### 4.5. Play Session Management

- ✅ **1 người chơi/acc** tại một thời điểm
- ✅ Status flow: `idle` → `playing` → `pending_logout` → `idle`
- ✅ `pending_logout` **không tự động expire** trong MVP
- ✅ Owner có quyền **force reset** status khi bị kẹt

### 4.6. Permission Rules

**Owner (Chủ phòng)**:

- ✅ Create, Update, Delete acc
- ✅ Invite members
- ✅ Kick members
- ✅ Force reset status
- ✅ Owner vẫn là member trong acc

**Member (Thành viên)**:

- ✅ View acc details
- ✅ Register to play (nếu acc idle)
- ✅ End play session
- ✅ Confirm logout
- ❌ Không sửa/xóa acc
- ❌ Không mời/kick member

### 4.7. History & Audit

- ✅ Ghi log mọi thay đổi trạng thái quan trọng
- ✅ Hiển thị **5 bản ghi gần nhất** trên acc detail
- ✅ Ghi timestamp cho mọi action

---

## 5. API Boundaries (Locked)

### RESTful Endpoints Structure

```
/api/v1
│
├── /auth
│   ├── POST   /signup          # Đăng ký user mới
│   ├── POST   /login           # Đăng nhập
│   ├── POST   /logout          # Đăng xuất
│   └── POST   /forgot-password # Quên mật khẩu (future)
│
├── /accs
│   ├── GET    /                # List accs (filter by tab)
│   ├── POST   /                # Create acc (owner only)
│   ├── GET    /:id             # Get acc detail
│   ├── PATCH  /:id             # Update acc (owner only)
│   └── DELETE /:id             # Delete acc (owner only)
│
├── /accs/:id/members
│   ├── GET    /                # List members in acc
│   └── DELETE /:memberId       # Kick member (owner only)
│
├── /accs/:id/invitations
│   ├── GET    /                # List invitations
│   ├── POST   /                # Send invitation (owner only)
│   ├── POST   /:invitationId/accept   # Accept invitation
│   └── POST   /:invitationId/reject   # Reject invitation
│
├── /accs/:id/status
│   ├── POST   /play            # Start play session
│   ├── POST   /end             # End play session
│   ├── POST   /confirm-logout  # Confirm logout
│   └── POST   /force-reset     # Force reset (owner only)
│
└── /history
    └── GET    /                # Get history (filtered by acc_id)
```

---

## 6. Folder Structure (Locked)

### 6.1. Project Root

```
Manager_Account_Lienquan/
├── apps/
│   ├── web/                 # React frontend
│   └── api/                 # Express backend
├── packages/
│   └── shared/              # Shared types, utils
├── docs/                    # Documentation
├── Promt/                   # Task prompts
├── package.json             # Root package.json
└── README.md
```

### 6.2. Frontend Structure (Feature-based)

```
apps/web/
├── src/
│   ├── pages/              # Routing pages
│   │   ├── login/
│   │   ├── acc-list/
│   │   ├── acc-detail/
│   │   └── profile/
│   ├── components/         # Reusable UI
│   │   ├── common/        # Buttons, inputs, cards
│   │   ├── layout/        # Header, sidebar, footer
│   │   └── widgets/       # Complex composed components
│   ├── features/          # Business logic
│   │   ├── auth/
│   │   ├── acc-management/
│   │   ├── invite-member/
│   │   ├── play-session/
│   │   └── membership/
│   ├── shared/            # Cross-cutting concerns
│   │   ├── api/          # API client, axios config
│   │   ├── ui/           # Design system primitives
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities
│   │   ├── constants/    # Constants, enums
│   │   └── types/        # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── vite.config.ts
├── package.json
└── tsconfig.json
```

**Quy tắc**:

- `pages`: Chỉ routing và layout assembly
- `features`: Business logic, state management
- `components`: Pure UI, reusable
- `shared`: Dùng chung thật sự

---

### 6.3. Backend Structure (Domain-based)

```
apps/api/
├── src/
│   ├── app/
│   │   ├── server.ts       # Express app setup
│   │   ├── routes.ts       # Route aggregation
│   │   ├── middleware/     # Auth, error handling
│   │   └── config/         # Environment config
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.schemas.ts
│   │   ├── accs/
│   │   │   ├── acc.routes.ts
│   │   │   ├── acc.controller.ts
│   │   │   ├── acc.service.ts
│   │   │   ├── acc.repository.ts
│   │   │   └── acc.schemas.ts
│   │   ├── memberships/
│   │   ├── invitations/
│   │   └── history/
│   ├── infra/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── db/            # DB client singleton
│   │   └── logger/        # Logging setup
│   └── shared/
│       ├── errors/        # Custom error classes
│       ├── utils/         # Helper functions
│       ├── constants/     # Enums, constants
│       └── types/         # TypeScript types
├── package.json
├── tsconfig.json
└── .env.example
```

**Layer responsibilities**:

- `routes`: HTTP routing, request parsing
- `controller`: Request/response handling
- `service`: Business logic
- `repository`: Data access (Prisma wrapper)
- `schemas`: Validation (Zod/Joi)

---

### 6.4. Shared Package

```
packages/shared/
├── src/
│   ├── types/            # Shared TypeScript types
│   │   ├── user.ts
│   │   ├── acc.ts
│   │   ├── membership.ts
│   │   └── invitation.ts
│   ├── validators/       # Shared validation schemas
│   ├── constants/        # Shared enums, constants
│   └── dto/             # Data Transfer Objects
├── package.json
└── tsconfig.json
```

**Mục đích**: Tránh lặp code, đảm bảo type consistency giữa web và API

---

## 7. Database Schema (Prisma)

### 7.1. Core Schema

```prisma
// packages/shared/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  displayName   String?   @map("display_name")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  ownedAccs     Acc[]           @relation("OwnedAccs")
  memberships   Membership[]
  sentInvitations Invitation[]  @relation("SentInvitations")
  receivedInvitations Invitation[] @relation("ReceivedInvitations")
  statusHistory StatusHistory[]

  @@map("users")
}

model Acc {
  id          String   @id @default(uuid())
  name        String
  ownerUserId String   @map("owner_user_id")
  status      AccStatus @default(AVAILABLE)
  note        String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  owner       User     @relation("OwnedAccs", fields: [ownerUserId], references: [id], onDelete: Cascade)
  memberships Membership[]
  invitations Invitation[]
  statusHistory StatusHistory[]

  @@map("accs")
}

enum AccStatus {
  AVAILABLE
  IN_USE
  PENDING_LOGOUT
}

model Membership {
  id           String         @id @default(uuid())
  accId        String         @map("acc_id")
  userId       String         @map("user_id")
  role         MemberRole
  memberStatus MemberStatus   @default(IDLE) @map("member_status")
  joinedAt     DateTime       @default(now()) @map("joined_at")
  leftAt       DateTime?      @map("left_at")

  // Relations
  acc          Acc    @relation(fields: [accId], references: [id], onDelete: Cascade)
  user         User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([accId, userId])
  @@map("memberships")
}

enum MemberRole {
  OWNER
  MEMBER
}

enum MemberStatus {
  IDLE
  PLAYING
  PENDING_LOGOUT
  KICKED
}

model Invitation {
  id              String           @id @default(uuid())
  accId           String           @map("acc_id")
  invitedUserId   String?          @map("invited_user_id")
  invitedEmail    String?          @map("invited_email")
  invitedByUserId String           @map("invited_by_user_id")
  status          InvitationStatus @default(PENDING)
  expiresAt       DateTime         @map("expires_at")
  createdAt       DateTime         @default(now()) @map("created_at")
  respondedAt     DateTime?        @map("responded_at")

  // Relations
  acc         Acc  @relation(fields: [accId], references: [id], onDelete: Cascade)
  invitedBy   User @relation("SentInvitations", fields: [invitedByUserId], references: [id])
  invitedUser User? @relation("ReceivedInvitations", fields: [invitedUserId], references: [id])

  @@map("invitations")
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  REJECTED
  EXPIRED
}

model StatusHistory {
  id          String   @id @default(uuid())
  accId       String   @map("acc_id")
  userId      String?  @map("user_id")
  actionType  String   @map("action_type")
  fromStatus  String?  @map("from_status")
  toStatus    String?  @map("to_status")
  note        String?
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  acc  Acc   @relation(fields: [accId], references: [id], onDelete: Cascade)
  user User? @relation(fields: [userId], references: [id])

  @@map("status_history")
}
```

---

## 8. Deployment Strategy

### 8.1. Frontend (Vercel)

- ✅ **Build command**: `npm run build`
- ✅ **Output directory**: `dist/`
- ✅ **Framework preset**: Vite
- ✅ **Environment variables**: `VITE_API_URL`

### 8.2. Backend (Vercel Serverless hoặc Railway)

- ✅ **Runtime**: Node.js 20
- ✅ **Build command**: `npm run build`
- ✅ **Start command**: `npm start`
- ✅ **Environment variables**:
  - `DATABASE_URL` (Supabase connection string)
  - `JWT_SECRET`
  - `NODE_ENV=production`

### 8.3. Database (Supabase)

- ✅ **Service**: Supabase Free Tier
- ✅ **Region**: Nearest to users
- ✅ **Migrations**: Via Prisma CLI
- ✅ **Backup**: Auto-backup by Supabase

---

## 9. Security Considerations

### 9.1. Authentication

- ✅ Password hashing: bcrypt (10 rounds)
- ✅ httpOnly cookies (mitigate XSS)
- ✅ CORS configuration (allow frontend origin only)
- ✅ Rate limiting cho login endpoint

### 9.2. Authorization

- ✅ Middleware kiểm tra JWT/session trước mọi protected route
- ✅ Role-based check (owner vs member)
- ✅ Resource ownership check (user chỉ truy cập acc mình có quyền)

### 9.3. Input Validation

- ✅ Zod hoặc Joi schemas cho tất cả API input
- ✅ Sanitize user input (XSS prevention)
- ✅ Parameterized queries (SQL injection prevention via Prisma)

---

## 10. Summary for Next Tasks

### ✅ Locked Decisions

1. **Stack**: React+Vite, Node+Express, PostgreSQL via Supabase, Prisma ORM
2. **Auth**: Email/password, httpOnly cookie, 7-day session
3. **Structure**: Feature-based frontend, domain-based backend
4. **Rules**: 7d session, 24h invitation, 5 max members, 1 player/acc, owner permissions

### ✅ Handoff Artifacts

- Entity relationships diagram
- API endpoint structure
- Folder structure
- Prisma schema foundation
- Business rules reference

### ✅ Ready for Implementation

- **Task 1**: Setup auth flow với session management
- **Task 2**: Build acc list với 3 tab filters
- **Task 3**: Create acc detail với member status
- **Task 4**: Implement invitation flow
- **Task 5**: Build play session management
- **Task 6**: CRUD acc + member kick

---

## Acceptance Criteria Check

- ✅ Team có thể dùng doc này để bắt đầu implement
- ✅ Không phải đoán stack, auth, DB hay rules
- ✅ Có diagram rõ ràng về ranh giới frontend/API/DB
- ✅ Prisma schema ready để migrate
- ✅ API boundaries đã định nghĩa
- ✅ Folder structure chi tiết cho cả web và API

---

**Status**: ✅ **COMPLETED**  
**Reviewed by**: N/A (Self-review against FRS & Task Breakdown)  
**Date**: 2026-07-08  
**Next**: Task 1 - Authentication implementation
