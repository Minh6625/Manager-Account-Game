# Task 3 - Changelog

## v1.0.0 - 2026-07-11

**Loại**: Phát Hành Ban Đầu

### Đã Thêm

**Backend:**

- Repository methods:
  - `getAccountById()` - Lấy chi tiết account với members và 5 history gần nhất
  - `getAccountHistory()` - Lấy toàn bộ history trong 3 ngày với filter
- Service methods:
  - `getAccountById()` - Business logic cho account detail
  - `getAccountHistory()` - Business logic cho history loading
- Controller methods:
  - `getAccountById()` - GET /api/v1/accs/:id handler
  - `getAccountHistory()` - GET /api/v1/accs/:id/history handler
- Routes:
  - `GET /api/v1/accs/:id` - Account detail endpoint
  - `GET /api/v1/accs/:id/history` - History endpoint with query params
- Access control:
  - Verify user is owner hoặc member trước khi cho phép xem
  - Return null nếu không có quyền

**Frontend:**

- AccountDetailPage component với features:
  - Account info section: name, status, owner, current player, member count, note
  - Members list với role badges (Chủ phòng) và status badges
  - History section với 5 bản ghi mặc định
  - "Xem thêm" button để load full 3-day history
  - Loading states cho initial load và history loading
  - Navigation: Back button to list, clickable detail from list
- Status badges với color coding:
  - Account status: Rảnh (green), Đang chơi (blue), Chờ logout (yellow)
  - Member status: Rảnh (gray), Đang chơi (blue), Chờ logout (yellow), Đã kick (red)
  - Role badge: Chủ phòng (purple)
- Responsive design:
  - Mobile-friendly layout
  - Flexible grids và spacing
  - Touch-friendly buttons
- Permission-based UI:
  - Show management buttons chỉ cho owner
  - Disabled state cho future features (Sửa, Mời, Kick)
- History formatting:
  - Human-readable action descriptions
  - Datetime formatting (vi-VN locale)
  - Conditional display based on action types

### Files Tạo Mới

**Backend:**

- `apps/api/src/modules/accs/acc.repository.ts` - Added getAccountById, getAccountHistory methods

**Frontend:**

- `apps/web/src/pages/acc-detail/AccountDetailPage.tsx` - Main detail page component
- `apps/web/src/pages/acc-detail/index.ts` - Export file

### Files Sửa

**Backend:**

- `apps/api/src/modules/accs/acc.service.ts` - Added getAccountById, getAccountHistory methods
- `apps/api/src/modules/accs/acc.controller.ts` - Added getAccountById, getAccountHistory handlers
- `apps/api/src/modules/accs/acc.routes.ts` - Added GET /:id and GET /:id/history routes

**Frontend:**

- `apps/web/src/App.tsx` - Added /accounts/:id route
- `apps/web/src/pages/acc-list/AccountListPage.tsx` - Added onClick navigation to detail

### Technical Details

**Backend Implementation:**

- Prisma queries với nested includes: owner, memberships, statusHistory
- Filter by ownership: OR [ownerUserId match, memberships match]
- History limit: 5 mặc định, 3 days filter cho full view
- Order by: statusHistory DESC, memberships ASC by joinedAt
- Null safety: return null nếu access denied

**Frontend Implementation:**

- React hooks: useState, useEffect
- React Router: useParams, useNavigate
- Fetch API với credentials: 'include'
- Conditional rendering: showFullHistory state
- Loading states: loading, loadingHistory
- Error handling: navigate to /accounts nếu fail
- Access control: isOwner check based on currentUserId

**UI/UX:**

- Badge system với consistent color palette
- Responsive flexbox layout
- Disabled buttons có visual feedback
- Loading states với text indicators
- History timeline format với border-left accent
- Mobile-optimized spacing và button sizes
