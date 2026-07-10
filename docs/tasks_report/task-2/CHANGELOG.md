# Task 2 - Changelog

## v1.0.1 - 2026-07-10

**Type**: Bugfix

### Fixed

- Tên account có thể bị trùng lặp
- Thêm unique validation trong database check

### Modified

- `apps/api/src/modules/accs/acc.repository.ts` - Added duplicate check before create

---

## v1.0.0 - 2026-07-10

**Type**: Initial Release

### Added

**Backend:**

- Acc module với routes, controller, service, repository, schemas
- GET `/api/v1/accs` endpoint với filter (all/owned/joined) và search
- POST `/api/v1/accs` endpoint để tạo account mới
- Zod validation schemas
- Auto-create membership cho owner khi tạo acc
- Unique name validation

**Frontend:**

- AccountListPage với full functionality
- 3 tabs filter: Tất cả, Acc của tôi, Acc đã tham gia
- Search box với real-time filtering
- Account cards layout với status badges
- Current player display khi acc đang được sử dụng
- Create account modal với form validation
- Responsive design cho mobile và desktop

**Business Logic:**

- Filter logic cho 3 tabs
- Search by account name (case-insensitive)
- Status badge display (AVAILABLE, IN_USE, PENDING_LOGOUT)

### Files Created

- `apps/api/src/modules/accs/acc.routes.ts`
- `apps/api/src/modules/accs/acc.controller.ts`
- `apps/api/src/modules/accs/acc.service.ts`
- `apps/api/src/modules/accs/acc.repository.ts`
- `apps/api/src/modules/accs/acc.schemas.ts`
- `apps/web/src/pages/acc-list/AccountListPage.tsx`

### Files Modified

- `apps/api/src/app/server.ts` - Registered acc routes
- `apps/web/src/App.tsx` - Added /accounts route
