# 🚀 Hướng Dẫn Chạy Ứng Dụng

## Yêu Cầu Trước Khi Chạy

- ✅ Node.js 20+ đã cài đặt (`node --version`)
- ✅ npm đã cài đặt (`npm --version`)
- ✅ Đã setup Supabase (xem **HUONG_DAN_SUPABASE.md**)
- ✅ File `.env` đã được cấu hình đúng

---

## Bước 1: Install Dependencies

**Lần đầu tiên chạy project**, bạn cần cài đặt tất cả packages:

```bash
# Mở terminal tại thư mục gốc
cd C:\Dev\Manager_Account_Lienquan

# Cài đặt dependencies
npm install
```

⏳ Quá trình này mất khoảng 2-3 phút.

---

## Bước 2: Setup Database

Chỉ cần chạy **1 lần đầu tiên** hoặc khi có thay đổi database schema:

```bash
# Vào thư mục API
cd apps\api

# Tạo Prisma Client
npm run prisma:generate

# Tạo tables trong Supabase
npm run prisma:push
```

**Kết quả thành công:**

```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema
```

---

## Email (lời mời + welcome)

Copy biến từ `apps/api/.env.example` vào `apps/api/.env`.

| Chế độ | Cấu hình | Hành vi |
|--------|----------|---------|
| Dev (mặc định) | `EMAIL_ENABLED=false` hoặc không set `SMTP_HOST` | Log nội dung email ra console API |
| Gửi thật | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Nodemailer gửi SMTP |

- Khi **mời thành viên** → email invitation tới email được mời  
- Khi **chấp nhận** → email welcome  

Link trong email dùng `FRONTEND_URL` (vd. `http://localhost:5173`).

---

## Bước 3: Chạy API Server

**Mở terminal thứ nhất:**

```bash
# Vào thư mục API
cd C:\Dev\Manager_Account_Lienquan\apps\api

# Chạy server
npm run dev
```

**Kết quả thành công:**

```
🚀 Server is running!
📍 Port: 3000
🌍 Environment: development
🔗 API: http://localhost:3000
🏥 Health: http://localhost:3000/health
```

✅ Server đang chạy! **Giữ terminal này mở**.

---

## Bước 4: Chạy Frontend

**Mở terminal thứ hai** (terminal API vẫn đang chạy):

```bash
# Vào thư mục Web
cd C:\Dev\Manager_Account_Lienquan\apps\web

# Chạy frontend
npm run dev
```

**Kết quả thành công:**

```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ Frontend đang chạy!

---

## Bước 5: Kiểm Tra Ứng Dụng

1. Mở trình duyệt (Chrome, Edge, Firefox)
2. Truy cập: **http://localhost:5173**

**Bạn sẽ thấy trang hiển thị:**

```
✅ Frontend Status: Running on port 5173
✅ Backend Status: Connected
✅ Database: connected
```

**Nếu thấy 3 dấu tích xanh** → Setup thành công! 🎉

---

## 📋 Tóm Tắt Commands

### Lần Đầu Tiên Chạy:

```bash
# 1. Install dependencies (thư mục gốc)
cd C:\Dev\Manager_Account_Lienquan
npm install

# 2. Setup database (thư mục api)
cd apps\api
npm run prisma:generate
npm run prisma:push

# 3. Chạy API (terminal 1)
npm run dev

# 4. Chạy Frontend (terminal 2 - mới)
cd C:\Dev\Manager_Account_Lienquan\apps\web
npm run dev
```

### Lần Sau Chạy Lại:

Chỉ cần 2 bước:

**Terminal 1 - API:**

```bash
cd C:\Dev\Manager_Account_Lienquan\apps\api
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd C:\Dev\Manager_Account_Lienquan\apps\web
npm run dev
```

---

## 🛠️ Các Lệnh Hữu Ích

### Database Commands

```bash
# Tạo lại Prisma Client (sau khi sửa schema)
npm run prisma:generate

# Đồng bộ schema với database
npm run prisma:push

# Tạo migration (cho production)
npm run prisma:migrate

# Mở Prisma Studio (GUI xem database)
npm run prisma:studio
# Truy cập: http://localhost:5555
```

### Development Commands

```bash
# Chạy API với hot reload
cd apps\api
npm run dev

# Chạy Frontend với hot reload
cd apps\web
npm run dev

# Build cho production
npm run build
```

### Stop Servers

- Nhấn **Ctrl + C** trong terminal để dừng server
- Hoặc đóng terminal

---

## 🔍 Kiểm Tra Endpoints

### Health Check

Kiểm tra API có hoạt động không:

```
http://localhost:3000/health
```

**Response mong đợi:**

```json
{
  "success": true,
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2026-07-08T..."
}
```

### Các Endpoints Sẽ Có (Task tiếp theo)

```
POST   /api/v1/auth/signup          - Đăng ký
POST   /api/v1/auth/login           - Đăng nhập
POST   /api/v1/auth/logout          - Đăng xuất
GET    /api/v1/accs                 - Danh sách tài khoản
GET    /api/v1/accs/:id             - Chi tiết tài khoản
...
```

---

## ❓ Troubleshooting

### Lỗi: "Port 3000 already in use"

**Giải pháp 1:** Tắt process đang dùng port 3000

```bash
# Tìm process
netstat -ano | findstr :3000

# Kill process (thay PID bằng số tìm được)
taskkill /PID [PID] /F
```

**Giải pháp 2:** Đổi port trong `.env`

```env
PORT=3001
```

### Lỗi: "Cannot connect to backend"

**Kiểm tra:**

1. API server có đang chạy không? (Terminal 1)
2. URL đúng không: `http://localhost:3000`
3. File `.env` có đúng không?
4. Restart cả 2 servers

### Lỗi: "Prisma Client not generated"

**Giải pháp:**

```bash
cd apps\api
npm run prisma:generate
```

### Lỗi: Database connection failed

**Kiểm tra:**

1. Supabase project có đang active không?
2. Connection string trong `.env` đúng chưa?
3. Password có chính xác không?
4. Xem lại: **HUONG_DAN_SUPABASE.md**

### Frontend hiển thị lỗi CORS

**Kiểm tra:** File `apps/api/.env`

```env
FRONTEND_URL=http://localhost:5173
```

Phải khớp với port frontend đang chạy.

---

## 🎯 Port Summary

| Service       | Port | URL                   |
| ------------- | ---- | --------------------- |
| Frontend      | 5173 | http://localhost:5173 |
| API Backend   | 3000 | http://localhost:3000 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## 📂 Cấu Trúc Source Code

```
Manager_Account_Lienquan/
├── apps/
│   ├── api/                    # Backend (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── app/           # Server, config, middleware
│   │   │   ├── modules/       # Business logic (auth, accs, etc.)
│   │   │   ├── infra/         # Database, Prisma
│   │   │   └── shared/        # Utils, errors, constants
│   │   └── .env               # ⚠️ File cấu hình (không commit)
│   │
│   └── web/                    # Frontend (React + Vite)
│       ├── src/
│       │   ├── pages/         # Các trang (login, acc-list, etc.)
│       │   ├── components/    # UI components
│       │   ├── features/      # Features (auth, acc-management)
│       │   └── shared/        # Shared code (api, hooks, etc.)
│       └── ...
│
├── packages/
│   └── shared/                 # Code dùng chung giữa FE & BE
│
└── docs/                       # Tài liệu
```

---

## 🎊 Khi Nào Coi Như Setup Thành Công?

Khi bạn thấy:

- ✅ Terminal 1: API server đang chạy port 3000
- ✅ Terminal 2: Frontend đang chạy port 5173
- ✅ Browser hiển thị: 3 dấu tích xanh
- ✅ http://localhost:3000/health trả về `"database": "connected"`
- ✅ Supabase Dashboard: 5 tables đã được tạo

→ **Bạn đã sẵn sàng code Task 1!** 🚀

---

## 📚 Next Steps

Sau khi chạy thành công:

1. ✅ **Task 0 hoàn thành** - Kiến trúc & setup
2. ⏭️ **Task 1** - Implement Authentication (đăng ký, đăng nhập)
3. ⏭️ **Task 2** - Hiển thị danh sách tài khoản
4. ⏭️ **Task 3** - Chi tiết tài khoản
5. ⏭️ **Task 4** - Mời thành viên
6. ⏭️ **Task 5** - Quản lý phiên chơi
7. ⏭️ **Task 6** - CRUD tài khoản

---

**Cập nhật:** 2026-07-08  
**Team:** Group N2  
**Status:** ✅ Ready to use
