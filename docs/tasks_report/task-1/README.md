# Task 1: Authentication

## Mô tả

Đăng nhập nội bộ với ghi nhớ phiên 7 ngày sử dụng JWT và httpOnly cookie.

## Thời gian

- **Ước lượng**: 30-60 phút
- **Thực tế**: ~45 phút

## Scope

### Được làm

- ✅ User signup/login với email/password
- ✅ JWT token với httpOnly cookie
- ✅ Remember login 7 ngày
- ✅ Protected routes
- ✅ Show/hide password toggle

### Không được làm

- ❌ Social login (Google, Facebook)
- ❌ Forgot password flow
- ❌ Email verification
- ❌ Two-factor authentication

## Kiến trúc

### Backend

```
apps/api/src/
├── modules/auth/
│   ├── auth.service.ts       # Business logic
│   ├── auth.controller.ts    # HTTP handlers
│   └── auth.routes.ts        # Route definitions
└── app/middleware/
    └── authMiddleware.ts     # Protected route middleware
```

### Frontend

```
apps/web/src/
├── pages/
│   └── login/
│       └── LoginPage.tsx     # Login/Signup UI
└── App.tsx                   # Routes
```

## API Endpoints

### POST /api/v1/auth/signup

Đăng ký user mới.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "User Name"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "User Name"
    }
  }
}
```

### POST /api/v1/auth/login

Đăng nhập và set httpOnly cookie.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      /* user info */
    }
  }
}
```

**Cookie:** `token` (httpOnly, 7 days)

### GET /api/v1/auth/me

Lấy thông tin user hiện tại (protected).

**Headers:** Cookie với token

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      /* user info */
    }
  }
}
```

### POST /api/v1/auth/logout

Đăng xuất và xóa cookie.

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Session Management

**Remember login 7 ngày:**

- JWT token lưu trong httpOnly cookie
- Cookie tự động expire sau 7 ngày
- Browser tự động gửi cookie với mỗi request
- Backend verify token mỗi request đến protected route

**Security:**

- `httpOnly: true` - Không thể access từ JavaScript
- `secure: true` (production) - Chỉ gửi qua HTTPS
- `sameSite: 'strict'` - Bảo vệ CSRF
- Password hash với bcrypt (10 rounds)

## Dependencies

### Backend

- `jsonwebtoken` - JWT token generation
- `bcryptjs` - Password hashing
- `cookie-parser` - Parse cookies

### Frontend

- `react-router-dom` - Routing
- Tailwind CSS - Styling

## Testing

### Quick Test

```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev

# Open: http://localhost:5173
```

### Test Cases

1. **Signup** - Tạo user mới
2. **Login** - Đăng nhập với credentials
3. **Logout** - Đăng xuất xóa cookie
4. **Reload** - F5 vẫn login
5. **Reopen browser** - Close browser, mở lại vẫn login
6. **Protected route** - Chưa login không vào được /accounts
7. **Expired session** - Sau 7 ngày phải login lại
