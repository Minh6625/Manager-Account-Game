# Task 5 - Báo Cáo Hoàn Thành

**Trạng thái**: ✅ Hoàn thành  
**Ngày**: 2026-07-13  

## 1. Tóm tắt

Implement play session: AVAILABLE → IN_USE → PENDING_LOGOUT → AVAILABLE. Chặn đăng ký chồng. Owner force-reset. History ghi đầy đủ. UI panel trên trang chi tiết.

## 2. Files chính

### Backend

- `apps/api/src/modules/play-session/*` (repository, service, controller, routes)
- `apps/api/src/modules/accs/acc.routes.ts` — nest `/:id/status`

### Frontend

- `apps/web/src/features/play-session/*`
- `apps/web/src/pages/acc-detail/AccountDetailPage.tsx` — wire panel
- `apps/web/src/features/acc-management/useAccountDetail.ts` — pendingLogoutMember, myMembership
- `apps/web/src/features/acc-management/AccountInfoCard.tsx` — hiển thị chờ log out
- `apps/web/src/shared/lib/format.ts` — FORCE_RESET label

### Shared

- `packages/shared/src/constants/history.ts` — HISTORY_ACTION

## 3. Acceptance

| Criteria | Status |
|----------|--------|
| Member đăng ký chơi khi acc rảnh | ✅ |
| Member khác bị chặn khi đang có người giữ | ✅ (409 Conflict) |
| Kết thúc phiên → chờ xác nhận log out | ✅ |
| Xác nhận log out → acc rảnh | ✅ |
| PENDING_LOGOUT không tự hết hạn | ✅ (chỉ confirm hoặc force-reset) |
| Owner force reset trạng thái kẹt | ✅ |
| Ghi status_history | ✅ START_PLAY / END_PLAY / CONFIRM_LOGOUT / FORCE_RESET |

## 4. Kết quả build

- `npm run build -w @manager-acc/shared` ✅  
- `npm run build -w @manager-acc/api` ✅  
- `npm run build -w @manager-acc/web` ✅  

## 5. Rủi ro / Ghi chú

| Rủi ro | Mức | Ghi chú |
|--------|-----|--------|
| Race khi 2 user bấm play cùng lúc | Thấp | `updateMany` where status=AVAILABLE trong transaction |
| Acc IN_USE nhưng member không PLAYING (data lệch) | Thấp | Owner force-reset; UI gợi ý khi thiếu holder |
| Không realtime | Dự kiến MVP | User cần reload / sau action tự reload detail |
| Force-reset có thể “cướp” phiên đang chơi | By design | Chỉ owner; modal cảnh báo |
| Job nhắc email chỉ chạy khi API process sống | Trung bình | Interval in-process; restart API sẽ quét lại DB |
| SMTP tắt → email log console | Thấp | Giống invitation; bật SMTP để gửi thật |

### v1.1 — Email nhắc log out (5 phút)

- End session ghi `pendingLogoutAt`
- Job mỗi 30s: nếu `PENDING_LOGOUT` ≥ 5 phút và chưa gửi → email + mark `logoutReminderSentAt`
- Confirm / force-reset / start play xóa các field nhắc

## 6. Ngoài scope (cố ý)

- Kick member, sửa/xóa acc
- Email notify khi play/end
- WebSocket realtime status
