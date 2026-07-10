# 🎮 Manager Account Liên Quân - Project Overview

## 📋 Tổng Quan Dự Án

**Tên dự án:** Manager Account Liên Quân  
**Loại:** Web Application (Internal Tool)  
**Mục đích:** Quản lý trạng thái tài khoản game Liên Quân cho nhóm  
**Platform:** Web (Desktop & Mobile responsive)

---

## 🎯 Mục Tiêu

Xây dựng một web nội bộ để các thành viên trong nhóm quản lý trạng thái acc game Liên Quân theo cách **thủ công**, giúp mọi người biết:

- Acc nào đang có người giữ
- Ai đang chơi
- Ai quên log out
- Tránh tình trạng vào nhầm acc khi đã có người khác sử dụng

**Lưu ý:** Hệ thống **KHÔNG** kết nối trực tiếp với game. Mọi trạng thái đều do người dùng khai báo thủ công trên web.

---

## 👥 Đối Tượng Sử Dụng

### Thành Viên

- Xem acc
- Tham gia acc
- Đăng ký chơi
- Kết thúc phiên chơi

### Chủ Phòng (Owner)

- Tất cả quyền của thành viên
- **+** Tạo acc
- **+** Sửa acc
- **+** Xóa acc
- **+** Mời thành viên
- **+** Kick thành viên
- **+** Force reset

**Note:** Không có admin hệ thống riêng trong MVP.

---

## 🏗️ Kiến Trúc Hệ Thống

### Tech Stack

**Frontend:**

- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS 3
- React Router 6
- Axios

**Backend:**

- Node.js 20 LTS
- Express 4
- TypeScript 5
- Prisma 5 (ORM)

**Database:**

- PostgreSQL
- Supabase (hosting)

**Authentication:**

- JWT (JSON Web Tokens)
- bcrypt (password hashing)
- httpOnly cookies

---

### Architecture Pattern

**3-Tier Architecture:**

```
┌─────────────────┐
│   Frontend      │ ← React + Vite + TypeScript
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   API Server    │ ← Express + TypeScript
│  (Port 3000)    │
└────────┬────────┘
         │ Prisma ORM
         │
┌────────▼────────┐
│   Database      │ ← PostgreSQL (Supabase)
│  (Supabase)     │
└─────────────────┘
```

---

## 🗄️ Database Schema

### 5 Core Tables:

#### 1. **users** - Người dùng

- id (uuid)
- email (unique)
- passwordHash
- displayName
- createdAt, updatedAt

#### 2. **accs** - Tài khoản game

- id (uuid)
- name
- ownerUserId (FK → users)
- status (AVAILABLE | IN_USE | PENDING_LOGOUT)
- note
- createdAt, updatedAt

#### 3. **memberships** - Thành viên của acc

- id (uuid)
- accId (FK → accs)
- userId (FK → users)
- role (OWNER | MEMBER)
- memberStatus (IDLE | PLAYING | PENDING_LOGOUT | KICKED)
- joinedAt, leftAt

#### 4. **invitations** - Lời mời tham gia

- id (uuid)
- accId (FK → accs)
- invitedUserId (FK → users)
- invitedByUserId (FK → users)
- status (PENDING | ACCEPTED | REJECTED | EXPIRED)
- expiresAt (24 hours)
- createdAt, respondedAt

#### 5. **status_history** - Lịch sử thay đổi

- id (uuid)
- accId (FK → accs)
- userId (FK → users)
- actionType
- fromStatus, toStatus
- note
- createdAt

**Schema File:** `apps/api/src/infra/prisma/schema.prisma`

---

## 📂 Project Structure

### Monorepo Layout

```
Manager_Account_Lienquan/
├── apps/
│   ├── api/                    ← Backend
│   │   ├── src/
│   │   │   ├── app/           ← Server, config, middleware
│   │   │   ├── modules/       ← Business logic (auth, accs, etc.)
│   │   │   ├── infra/         ← Database, Prisma
│   │   │   └── shared/        ← Utils, errors, constants
│   │   ├── package.json
│   │   └── .env               ← Environment variables
│   │
│   └── web/                    ← Frontend
│       ├── src/
│       │   ├── pages/         ← Pages (login, acc-list, etc.)
│       │   ├── components/    ← UI components
│       │   ├── features/      ← Features (auth, acc-management)
│       │   └── shared/        ← Shared code (api, hooks, etc.)
│       └── package.json
│
├── packages/
│   └── shared/                 ← Shared types between FE & BE
│
├── docs/                       ← Documentation
│   ├── workflow/
│   ├── guides/
│   └── tasks/
│
├── Promt/                      ← Prompts cho AI Agent
│
└── package.json                ← Root workspace config
```

---

## 🎨 Màn Hình Chính

### 1. Trang Đăng Nhập

- Email/Password login
- Remember me (7 days)
- Simple signup

### 2. Trang Danh Sách Acc

- 3-tab filter:
  - **All Accounts** - Tất cả acc
  - **My Accounts** - Acc tôi sở hữu
  - **Joined Accounts** - Acc tôi tham gia
- Hiển thị:
  - Tên acc
  - Trạng thái hiện tại
  - Người đang giữ
  - Thời gian cập nhật

### 3. Trang Chi Tiết Acc

- Thông tin acc
- Trạng thái hiện tại
- Danh sách thành viên
- Lịch sử thay đổi
- Action buttons (theo quyền)

### 4. Trang Profile

- Thông tin user
- Danh sách acc tham gia
- Lời mời chưa xử lý

---

## ⚙️ Business Rules

### Session Management

- **7 days** session validity
- httpOnly cookie (secure)
- Auto logout sau expiry

### Account System

- Max **5 members** per account
- **1 player** tại 1 thời điểm
- Owner có full control

### Invitation System

- **24 hours** expiry
- Pending invitations không tính vào limit 5 members
- Có thể reject hoặc accept

### Permissions

| Action         | Owner | Member |
| -------------- | ----- | ------ |
| View acc       | ✅    | ✅     |
| Play           | ✅    | ✅     |
| End session    | ✅    | ✅     |
| Confirm logout | ✅    | ✅     |
| Create acc     | ✅    | ❌     |
| Update acc     | ✅    | ❌     |
| Delete acc     | ✅    | ❌     |
| Invite member  | ✅    | ❌     |
| Kick member    | ✅    | ❌     |

---

## 🚀 API Endpoints

### Authentication (Task 1) ✅

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Accounts (Task 2, 3, 6) 🔜

```
GET    /api/v1/accs
POST   /api/v1/accs
GET    /api/v1/accs/:id
PATCH  /api/v1/accs/:id
DELETE /api/v1/accs/:id
```

### Members (Task 3, 6) 🔜

```
GET    /api/v1/accs/:id/members
DELETE /api/v1/accs/:id/members/:id
```

### Invitations (Task 4) 🔜

```
POST   /api/v1/accs/:id/invitations
POST   /api/v1/invitations/:id/accept
POST   /api/v1/invitations/:id/reject
GET    /api/v1/invitations              # My invitations
```

### Play Session (Task 5) 🔜

```
POST   /api/v1/accs/:id/status/play
POST   /api/v1/accs/:id/status/end
POST   /api/v1/accs/:id/status/confirm-logout
```

### History (Task 3) 🔜

```
GET    /api/v1/history                   # Global history
GET    /api/v1/accs/:id/history          # Acc history
```

---

## 📊 Project Progress

### Completed: 2/6 Tasks

| Task   | Status | Time | Description                  |
| ------ | ------ | ---- | ---------------------------- |
| Task 0 | ✅     | 60m  | Architecture & Setup         |
| Task 1 | ✅     | 45m  | Authentication               |
| Task 2 | 🔜     | -    | Account List (3-tab filter)  |
| Task 3 | 🔜     | -    | Account Detail Page          |
| Task 4 | 🔜     | -    | Invitation System            |
| Task 5 | 🔜     | -    | Play Session Management      |
| Task 6 | 🔜     | -    | CRUD Accounts & Kick Members |

**Overall Progress:** 33% (2/6)

---

## 🔒 Security Features

### Implemented (Task 0, 1):

- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT tokens (7 days expiry)
- ✅ httpOnly cookies (XSS protection)
- ✅ Secure flag for HTTPS
- ✅ SameSite strict (CSRF protection)
- ✅ CORS configuration
- ✅ Input validation (Zod)

### Planned:

- Rate limiting
- Request logging
- Error monitoring

---

## 🧪 Testing Strategy

### Manual Testing:

- Test cases trong `docs/tasks/task-X/TEST_GUIDE.md`
- Step-by-step verification
- Expected results documented

### Future (Out of MVP Scope):

- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Playwright)

---

## 🚦 Development Workflow

### Quy Trình Với AI Agent:

1. **Làm rõ yêu cầu** - FRS
2. **Lập plan triển khai** - Task breakdown
3. **Chia task nhỏ** - 30-90 phút
4. **Tạo prompt.xml** - Cho agent
5. **Review prompt** - Trước khi giao
6. **Agent đọc hiểu** - Source/architecture
7. **Agent code** - Trong scope
8. **Engineer review** - Test, build
9. **Báo cáo** - Thay đổi, kết quả, rủi ro

**Documentation:** `docs/workflow/`

---

## 📦 Dependencies

### Backend:

```json
{
  "@prisma/client": "^5.7.0",
  "express": "^4.18.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "cookie-parser": "^1.4.0",
  "cors": "^2.8.0",
  "zod": "^3.22.0"
}
```

### Frontend:

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "axios": "^1.6.0"
}
```

---

## 🌐 Environment Variables

### Backend (.env):

```env
DATABASE_URL="postgresql://..."      # Supabase connection
JWT_SECRET="your-secret-key"         # JWT signing secret
PORT=3000                            # API port
NODE_ENV=development                 # Environment
FRONTEND_URL=http://localhost:5173   # CORS origin
```

### Frontend:

No environment variables needed (proxy via Vite)

---

## 📈 Future Enhancements (Post-MVP)

### Phase 2:

- Email notifications
- Real-time updates (WebSocket)
- Mobile app (React Native)
- Password reset flow
- 2FA authentication

### Phase 3:

- Admin dashboard
- Analytics & reporting
- Audit logs
- Role-based permissions (more granular)
- API rate limiting

---

## 🔗 Important Links

**Documentation:**

- [Documentation Guide](./docs/README.md)
- [Workflow](./docs/workflow/)
- [Architecture Decision](./docs/workflow/02_Mini_Plan_Architecture.md)
- [Guides](./docs/guides/)
- [Tasks](./docs/tasks/INDEX.md)

**Repository:**

- Location: `C:\Dev\Manager_Account_Lienquan`

**Deployment:**

- Database: Supabase (https://supabase.com)
- Frontend: TBD (Vercel recommended)
- Backend: TBD (Vercel or Railway recommended)

---

## 👥 Team

**Team:** Group N2  
**Purpose:** Learn AI Agent Code workflow  
**Duration:** 1 week (learning phase)

---

## 📝 Notes

### MVP Scope:

- Simple, functional, internal tool
- Manual status management (no game integration)
- Focus on core features
- Basic UI (functional over fancy)

### Non-MVP:

- Complex authentication (social login, 2FA)
- Real-time features
- Advanced analytics
- Mobile app
- Production-grade monitoring

---

## 🎓 Learning Objectives

Dự án này phục vụ mục tiêu học:

- ✅ Quy trình làm việc với AI Agent Code
- ✅ Chia task nhỏ (30-90 phút)
- ✅ Viết prompt chuẩn
- ✅ Review code từ agent
- ✅ Test và verify kết quả
- ✅ Document và báo cáo

**Goal:** Sau tuần này, mỗi thành viên có thể vận hành quy trình AI Agent Code một cách có kiểm soát.

---

## 📞 Support & Resources

**Tài liệu không rõ?**
→ Check [DOCUMENTATION_GUIDE.md](./DOCUMENTATION_GUIDE.md)

**Cần setup?**
→ Follow [guides/](./guides/)

**Hiểu architecture?**
→ Read [tasks/task-0/](./tasks/task-0/)

**Review tasks?**
→ See [tasks/INDEX.md](./tasks/INDEX.md)

---

## 📝 Changelog

| Date       | Author  | Changes                                         |
| ---------- | ------- | ----------------------------------------------- |
| 2026-07-08 | Kiro AI | Initial project overview created                |
| 2026-07-08 | Kiro AI | Added complete project structure and tech stack |

---

**Created:** 2026-07-08  
**Last Updated:** 2026-07-08  
**Version:** 1.0  
**Status:** ✅ Active Development

| 2026-07-08 | Kiro AI | Moved from docs/PROJECT_OVERVIEW.md to root |
| 2026-07-10 | Kiro AI | Updated docs links, workflow 00→README renumbered |
