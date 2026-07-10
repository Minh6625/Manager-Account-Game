# Task 1 - Changelog

## v1.0.1 - 2026-07-11

**Type**: Bugfix

### Fixed

- Cookie không được clear trên Safari khi logout

### Modified

- `apps/api/src/modules/auth/auth.controller.ts` - Updated logout cookie options

---

## v1.0.0 - 2026-07-08

**Type**: Initial Release

### Added

**Backend:**

- Auth service với signup, login, verifyToken
- Auth controller với 4 endpoints (signup, login, logout, me)
- Auth routes
- Auth middleware cho protected routes
- JWT token với 7 days expiry
- httpOnly cookie setup
- Password hashing với bcrypt
- Security: httpOnly, SameSite strict, Secure flag

**Frontend:**

- LoginPage với tab switch (Đăng nhập/Đăng ký)
- Show/hide password toggle
- Form validation
- Error handling và loading states
- Auto redirect sau login
- Responsive design

### Files Created

- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.routes.ts`
- `apps/api/src/app/middleware/authMiddleware.ts`
- `apps/web/src/pages/login/LoginPage.tsx`

### Files Modified

- `apps/api/src/app/server.ts` - Registered auth routes
- `apps/web/src/App.tsx` - Added routes
