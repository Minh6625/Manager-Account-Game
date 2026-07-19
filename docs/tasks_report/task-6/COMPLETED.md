# Task 6 - Báo Cáo Hoàn Thành

**Trạng thái**: ✅ Hoàn thành  
**Ngày**: 2026-07-14  

## 1. Tóm tắt

Implement CRUD acc (update/delete + create history) và kick member. Chỉ owner thấy/dùng controls. Delete & kick có modal xác nhận. History ghi CREATE / UPDATE / DELETE / MEMBER_KICK. Kick người đang giữ acc sẽ trả acc về AVAILABLE.

## 2. Files chính

### Shared

- `packages/shared/src/validators/account.ts` — `updateAccSchema`
- `packages/shared/src/dto/account.ts` — `UpdateAccountDto`
- `packages/shared/src/constants/history.ts` — UPDATE, DELETE

### Backend

- `modules/accs/*` — PATCH/DELETE + CREATE history
- `modules/memberships/*` — kick module mới
- `acc.routes.ts` — nest `/:id/members`, register PATCH/DELETE

### Frontend

- `features/acc-management/api.ts` — update / delete / kick
- `EditAccountModal.tsx`, `ConfirmActionModal.tsx`
- `AccountInfoCard.tsx` — Sửa / Xóa
- `MembersList.tsx` — Kick
- `AccountDetailPage.tsx` — wire
- `shared/lib/format.ts` — labels UPDATE / DELETE

## 3. Acceptance

| Criteria | Status |
|----------|--------|
| Chỉ owner thấy/dùng edit/delete/kick | ✅ |
| CRUD account theo phân quyền | ✅ (create sẵn; update/delete mới) |
| Member bị kick mất quyền ngay | ✅ leftAt + KICKED; access filter leftAt null |
| Delete & kick yêu cầu xác nhận UI | ✅ ConfirmActionModal |
| Ghi lịch sử quản lý | ✅ CREATE/UPDATE/DELETE/MEMBER_KICK |

## 4. Kết quả build

- `npm run build -w @manager-acc/shared` ✅  
- `npm run build -w @manager-acc/api` ✅  
- `npm run build -w @manager-acc/web` ✅  

## 5. Rủi ro / Ghi chú

| Rủi ro | Mức | Ghi chú |
|--------|-----|--------|
| History DELETE bị cascade xóa theo acc | Trung bình | Hard delete → row history mất cùng acc; ghi trước delete chỉ có ý nghĩa nếu đọc DB trước cascade |
| Kick holder có thể “cướp” phiên đang chơi | By design | Modal cảnh báo; owner only |
| Re-invite sau kick | Thấp | Invitation `createMembership` re-activate row (leftAt null, IDLE) — đã có từ Task 4 |
| Không soft-delete acc | MVP | Xóa là vĩnh viễn |
| Không realtime | Dự kiến | Sau action FE reload detail / redirect list |

## 6. Ngoài scope (cố ý)

- Add thẳng member
- Play session changes
- Soft-delete / archive acc
- Audit log global ngoài status_history
