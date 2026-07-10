# 📝 Task 0 Changelog

## Version 1.0 - Initial Architecture & Setup

**Date:** 2026-07-08  
**Type:** Foundation

---

## ✨ Architecture Decisions

### Database Schema

- ✅ Designed 5 core tables: users, accs, memberships, invitations, status_history
- ✅ Defined relationships with foreign keys
- ✅ Created enums: AccStatus, MemberRole, MemberStatus, InvitationStatus
- ✅ Prisma schema with snake_case mapping

### Tech Stack

- ✅ Frontend: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS 3
- ✅ Backend: Node.js 20 + Express 4 + TypeScript 5 + Prisma 5
- ✅ Database: PostgreSQL via Supabase (free tier)
- ✅ Authentication: JWT + bcrypt + httpOnly cookies

### Project Structure

- ✅ Monorepo with workspace
- ✅ Feature-based folder structure
- ✅ Separation of concerns (modules, infra, shared)

---

## 📦 What Was Created

### Backend (apps/api):

```
src/
├── app/
│   ├── server.ts           # Express server
│   ├── config/index.ts     # Environment config
│   └── middleware/
│       └── errorHandler.ts # Global error handler
├── modules/                # Business logic (empty, ready)
├── infra/
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── db/
│       └── prisma.ts       # DB connection singleton
└── shared/
    └── errors/AppError.ts  # Custom error classes
```

### Frontend (apps/web):

```
src/
├── pages/          # 4 pages ready
├── components/     # common, layout, widgets
├── features/       # 5 features ready
├── shared/         # api, ui, hooks, lib
├── main.tsx
├── App.tsx
└── index.css
```

### Configuration:

- ✅ package.json (root, api, web)
- ✅ tsconfig.json (api, web)
- ✅ vite.config.ts
- ✅ tailwind.config.js
- ✅ .env.example
- ✅ .gitignore

---

## 🗄️ Database Schema Details

### Tables Created:

**users:**

- id, email, passwordHash, displayName
- Relations: ownedAccs, memberships, invitations

**accs:**

- id, name, ownerUserId, status, note
- Status: AVAILABLE | IN_USE | PENDING_LOGOUT
- Relations: owner, memberships, invitations, statusHistory

**memberships:**

- id, accId, userId, role, memberStatus
- Role: OWNER | MEMBER
- Status: IDLE | PLAYING | PENDING_LOGOUT | KICKED

**invitations:**

- id, accId, invitedUserId, invitedByUserId, status, expiresAt
- Status: PENDING | ACCEPTED | REJECTED | EXPIRED
- 24-hour expiry

**status_history:**

- id, accId, userId, actionType, fromStatus, toStatus, note
- Audit trail for all status changes

---

## 📊 Business Rules Locked

### Session Management:

- ✅ 7-day session validity
- ✅ httpOnly cookie for security
- ✅ Auto logout after expiry

### Account System:

- ✅ Max 5 members per account
- ✅ 1 player at a time
- ✅ 3-tab filter (All, My Accs, Joined Accs)

### Invitation System:

- ✅ 24-hour expiry
- ✅ Pending invitations don't count toward 5-member limit

### Permissions:

- ✅ Owner: Full CRUD, invite/kick, force reset
- ✅ Member: View, play, end session, confirm logout

---

## 🔧 Configuration Changes

### Environment Variables:

```env
DATABASE_URL         # Supabase connection string
JWT_SECRET          # JWT signing secret
PORT                # API port (default: 3000)
NODE_ENV            # development | production
FRONTEND_URL        # CORS allowed origin
```

### Dependencies Added:

**Backend:**

- express, @types/express
- @prisma/client, prisma
- bcrypt, @types/bcrypt
- jsonwebtoken, @types/jsonwebtoken
- cookie-parser, cors, dotenv, zod

**Frontend:**

- react, react-dom
- vite, @vitejs/plugin-react
- typescript
- tailwindcss, autoprefixer, postcss
- react-router-dom, axios

---

## 📂 Files Created

**Total:** 31 files

- Backend: 10 files
- Frontend: 9 files
- Documentation: 5 files
- Configuration: 7 files

**Total Folders:** 32 folders

- Backend: 14 folders
- Frontend: 13 folders
- Shared: 5 folders

**Total Lines:** ~2,010 lines

- Prisma Schema: ~140 lines
- Backend Code: ~350 lines
- Frontend Code: ~120 lines
- Documentation: ~1,200 lines
- Config: ~200 lines

---

## 🚀 API Structure Ready

### Implemented:

```
GET  /health        # Health check + DB connection test
GET  /api/v1        # API info
```

### Ready for Implementation (Tasks 1-6):

```
# Authentication (Task 1)
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

# Accounts (Task 2, 3, 6)
GET    /api/v1/accs
POST   /api/v1/accs
GET    /api/v1/accs/:id
PATCH  /api/v1/accs/:id
DELETE /api/v1/accs/:id

# Members (Task 3, 6)
GET    /api/v1/accs/:id/members
DELETE /api/v1/accs/:id/members/:id

# Invitations (Task 4)
POST   /api/v1/accs/:id/invitations
POST   /api/v1/invitations/:id/accept

# Play Session (Task 5)
POST   /api/v1/accs/:id/status/play
POST   /api/v1/accs/:id/status/end

# History (Task 3)
GET    /api/v1/history
```

---

## ✅ Impact Analysis

### Performance:

- ✅ No impact (foundation only)
- ✅ Prisma provides efficient queries
- ✅ Connection pooling configured

### Security:

- ✅ Strong foundation
- ✅ httpOnly cookies planned
- ✅ Password hashing planned
- ✅ CORS configured

### Scalability:

- ✅ Modular architecture
- ✅ Easy to add features
- ✅ Supabase can scale with project

---

## 📝 Notes

### Design Decisions:

**Why Prisma?**

- Type-safe database access
- Auto-generated types
- Migration management
- Great DX with TypeScript

**Why Supabase?**

- Free tier sufficient for MVP
- PostgreSQL (production-ready)
- Easy setup
- Built-in features (future use)

**Why Monorepo?**

- Share types between FE/BE
- Single npm install
- Consistent tooling
- Easy workspace management

**Why Feature-based Structure?**

- Scalable
- Easy to find code
- Clear separation of concerns
- Follows best practices

---

## 🔜 Next Steps

Task 0 provides foundation for:

- ✅ Task 1: Authentication
- ✅ Task 2: Account List
- ✅ Task 3: Account Detail
- ✅ Task 4: Invitation System
- ✅ Task 5: Play Session
- ✅ Task 6: CRUD Operations

All tasks can now be implemented independently using the established architecture.

---

**Version:** 1.0  
**Status:** ✅ Complete  
**Breaking Changes:** N/A (initial version)  
**Migration Required:** No
