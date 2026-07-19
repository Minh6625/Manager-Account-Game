# Task 7: Kick thành viên

## Mô tả

Chủ phòng **kick** thành viên ra khỏi acc: nút theo quyền, modal xác nhận, trạng thái `KICKED`, mất quyền ngay, ghi lịch sử (thời điểm + người thực hiện). Cảnh báo nếu member đang giữ acc.

## Thời gian

- **Ước lượng**: 30–45 phút
- **Thực tế**: ~40 phút (chuẩn hóa trên nền kick Task 6)

## Scope

### Được làm

- ✅ Kick member (`DELETE /api/v1/accs/:id/members/:memberId`)
- ✅ Ẩn/hiện nút kick theo owner
- ✅ Modal xác nhận trước khi kick
- ✅ Cảnh báo khi member `PLAYING` / `PENDING_LOGOUT`
- ✅ `memberStatus = KICKED` + `leftAt`
- ✅ History `MEMBER_KICK` (actor + timestamp + note tên người bị kick)
- ✅ Không giữ thẻ member sau kick — chỉ xem qua lịch sử

### Không được làm

- ❌ CRUD acc (Task 6)
- ❌ Mời thành viên (Task 4)
- ❌ Play session (Task 5)

## Kiến trúc

### Backend

```
apps/api/src/modules/memberships/
├── membership.repository.ts  # kick transaction + history
├── membership.service.ts     # owner check, holder rules
├── membership.controller.ts
└── membership.routes.ts      # nested under /accs/:id/members
```

Detail acc: `getAccountById` chỉ memberships **active**. Kick ghi history, không list thẻ KICKED.

### Frontend

```
features/acc-management/
├── MembersList.tsx           # Kick + list kicked
├── ConfirmActionModal.tsx    # xác nhận
├── api.ts                    # kickMember
└── AccountDetailPage wire
```

## API

| Method | Path | Ai | Mô tả |
|--------|------|-----|--------|
| DELETE | `/api/v1/accs/:id/members/:memberId` | Owner | Kick member |

**Rules:**

- 403 nếu không phải owner
- 400 nếu kick owner / đã kick / đã left
- Nếu đang giữ acc → free acc (`AVAILABLE`) + history `STATUS_CHANGE`
- `status_history.userId` = **actor** (người kick)
- `note` = `Đã kick {name} · bởi {actor}` (+ holding context)

## Testing

1. Owner thấy Kick; member thường không thấy
2. Modal xác nhận trước khi kick
3. Kick xong: thẻ member biến mất khỏi list
4. Member bị kick không mở detail / không play
5. Kick đang PLAYING → acc AVAILABLE + cảnh báo modal
6. History MEMBER_KICK: actor + note + thời gian

## Dependencies

- Task 6 (CRUD + skeleton kick)
- History module, Prisma memberships
