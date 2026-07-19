# Task 6: CRUD Acc và Kick thành viên

## Mô tả

Cho phép **chủ phòng** quản lý acc (sửa/xóa; tạo đã có từ Task 2) và **kick thành viên**. Controls chỉ hiện với owner. Hành động phá hủy (xóa, kick) bắt buộc dialog xác nhận. Mọi thao tác quản lý ghi `status_history`.

## Thời gian

- **Ước lượng**: 45–90 phút
- **Thực tế**: ~75 phút

## Scope

### Được làm

- ✅ Tạo acc (đã có Task 2; bổ sung ghi history `CREATE`)
- ✅ Sửa acc (tên, note) — owner only
- ✅ Xóa acc — owner only + modal xác nhận
- ✅ Kick thành viên — owner only + modal xác nhận
- ✅ Ẩn/hiện controls theo quyền owner
- ✅ Ghi lịch sử: CREATE, UPDATE, DELETE, MEMBER_KICK (+ STATUS_CHANGE nếu kick người đang giữ)

### Không được làm

- ❌ Thêm thẳng member (phải qua invitation — Task 4)
- ❌ Thay đổi play session flow (Task 5)
- ❌ Realtime / WebSocket

## Kiến trúc

### Backend

```
apps/api/src/modules/accs/
├── acc.controller.ts    # + updateAccount, deleteAccount
├── acc.service.ts       # owner check + history
├── acc.repository.ts    # update/delete
├── acc.schemas.ts       # updateAccSchema
└── acc.routes.ts        # PATCH/DELETE /:id, nest members

apps/api/src/modules/memberships/
├── membership.repository.ts
├── membership.service.ts
├── membership.controller.ts
└── membership.routes.ts   # DELETE /:memberId
```

### Frontend

```
apps/web/src/features/acc-management/
├── api.ts                 # updateAccount, deleteAccount, kickMember
├── EditAccountModal.tsx
├── ConfirmActionModal.tsx
├── AccountInfoCard.tsx    # Sửa / Xóa (owner)
├── MembersList.tsx        # Kick (owner)
└── index.ts

pages/acc-detail/AccountDetailPage.tsx  # wire handlers
```

### Shared

- `updateAccSchema`, `UpdateAccountDto`
- `HISTORY_ACTION.UPDATE`, `HISTORY_ACTION.DELETE`

## API Endpoints

| Method | Path | Ai | Mô tả |
|--------|------|-----|--------|
| POST | `/api/v1/accs` | Auth user | Tạo acc (creator = owner) |
| PATCH | `/api/v1/accs/:id` | Owner | Sửa name/note |
| DELETE | `/api/v1/accs/:id` | Owner | Xóa acc (cascade) |
| DELETE | `/api/v1/accs/:id/members/:memberId` | Owner | Kick member |

### PATCH body

```json
{
  "name": "optional new name",
  "note": "optional note or null to clear"
}
```

Ít nhất một trong `name` | `note` phải có.

### Kick response

```json
{
  "success": true,
  "message": "Đã kick thành viên khỏi acc",
  "data": {
    "membership": { "id": "...", "memberStatus": "KICKED", "leftAt": "..." },
    "acc": { "id": "...", "name": "...", "status": "AVAILABLE" }
  }
}
```

## Logic nghiệp vụ

| Rule | Chi tiết |
|------|----------|
| Owner only | Edit / delete / kick → 403 nếu không phải owner |
| Tên unique | Không trùng tên acc khác trong hệ thống |
| Không kick owner | BadRequest nếu role OWNER |
| Kick holder | Nếu PLAYING/PENDING_LOGOUT → acc về AVAILABLE |
| Mất quyền ngay | `leftAt` set + `memberStatus=KICKED`; access check yêu cầu `leftAt: null` |
| Xác nhận UI | Delete & kick mở modal trước khi gọi API |

## Testing

```bash
cd apps/api && npm run dev
cd apps/web && npm run dev
```

**Test cases:**

1. Owner thấy Sửa / Xóa / Kick; member thường không thấy
2. Sửa tên/note → reload đúng; history UPDATE
3. Sửa trùng tên → lỗi
4. Member gọi PATCH/DELETE → 403
5. Xóa acc → modal → redirect list; acc biến mất
6. Kick member → modal → member mất khỏi list; history MEMBER_KICK
7. Kick member đang PLAYING → acc AVAILABLE
8. Member bị kick không mở được detail / không play được

## Dependencies

- **Backend**: HistoryService, AppError, Prisma
- **Frontend**: acc-management feature, shared types
