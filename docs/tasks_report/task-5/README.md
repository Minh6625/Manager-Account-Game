# Task 5: Luồng đăng ký chơi và xác nhận log out

## Mô tả

Thành viên đăng ký chơi khi acc **rảnh**, chặn khi đang có người giữ, kết thúc phiên → **chờ xác nhận log out**, xác nhận xong → acc **rảnh**. Chủ phòng có thể **ép reset** khi trạng thái bị kẹt. Không auto-expire `PENDING_LOGOUT`.

## Thời gian

- **Ước lượng**: 60–90 phút
- **Thực tế**: ~75 phút

## Scope

### Được làm

- ✅ Đăng ký chơi (`POST .../status/play`)
- ✅ Chặn khi acc đang được giữ (IN_USE / PENDING_LOGOUT)
- ✅ Kết thúc phiên → PENDING_LOGOUT (`.../status/end`)
- ✅ Xác nhận log out → AVAILABLE (`.../status/confirm-logout`)
- ✅ Owner force reset (`.../status/force-reset`)
- ✅ Ghi `status_history` (START_PLAY, END_PLAY, CONFIRM_LOGOUT, FORCE_RESET)
- ✅ UI panel phiên chơi trên trang chi tiết acc

### Không được làm

- ❌ Tích hợp game thật
- ❌ Realtime / WebSocket
- ❌ Thay đổi luồng mời thành viên (Task 4)
- ❌ Kick member / CRUD update-delete acc (Task 6–7)

## Kiến trúc

### Backend

```
apps/api/src/modules/play-session/
├── play-session.repository.ts   # Transaction + optimistic claim acc.status
├── play-session.service.ts      # Business rules
├── play-session.controller.ts
└── play-session.routes.ts       # Nested under /accs/:id/status
```

Mounted in `acc.routes.ts`: `router.use('/:id/status', playSessionRoutes)`.

### Frontend

```
apps/web/src/features/play-session/
├── api.ts
├── usePlaySession.ts
├── PlaySessionPanel.tsx
└── index.ts
```

Wired on `pages/acc-detail/AccountDetailPage.tsx`.

### Shared

- `packages/shared/src/constants/history.ts` — `HISTORY_ACTION` constants

## API Endpoints

| Method | Path | Ai | Mô tả |
|--------|------|-----|--------|
| POST | `/api/v1/accs/:id/status/play` | Member | Đăng ký chơi khi AVAILABLE |
| POST | `/api/v1/accs/:id/status/end` | Người đang PLAYING | Kết thúc → PENDING_LOGOUT |
| POST | `/api/v1/accs/:id/status/confirm-logout` | Người PENDING_LOGOUT | Trả acc → AVAILABLE |
| POST | `/api/v1/accs/:id/status/force-reset` | Owner | Ép về AVAILABLE + member IDLE |

**Response (play/end/confirm):**

```json
{
  "success": true,
  "message": "...",
  "data": {
    "acc": { "id": "...", "status": "IN_USE", "..." : "..." },
    "membership": { "id": "...", "memberStatus": "PLAYING", "..." : "..." }
  }
}
```

## Logic nghiệp vụ

| Bước | Acc status | Member status | Điều kiện |
|------|------------|---------------|-----------|
| Start play | AVAILABLE → IN_USE | IDLE → PLAYING | Member active; claim atomic `updateMany` status=AVAILABLE |
| End session | IN_USE → PENDING_LOGOUT | PLAYING → PENDING_LOGOUT | Chỉ người đang PLAYING |
| Confirm logout | PENDING_LOGOUT → AVAILABLE | PENDING_LOGOUT → IDLE | Chỉ người đang PENDING_LOGOUT; **không** auto-expire |
| Force reset | * → AVAILABLE | holders → IDLE | Chỉ owner |

- 1 người giữ acc tại 1 thời điểm.
- Concurrent start: optimistic lock trên `acc.status = AVAILABLE`.

## Email nhắc log out (v1.1)

Sau **Kết thúc phiên**, nếu sau **5 phút** user vẫn `PENDING_LOGOUT` và chưa confirm:

1. Background job (API process, poll ~30s) gửi **1 email** nhắc.
2. Email có link tới trang chi tiết acc.
3. Ghi history `LOGOUT_REMINDER`.
4. Chỉ gửi **một lần** (`logout_reminder_sent_at`).

Cấu hình SMTP giống invitation: `EMAIL_ENABLED`, `SMTP_*`, `MAIL_FROM`, `FRONTEND_URL`.  
Dev không SMTP → log console `[email:log]`.

**Lưu ý:** API phải đang chạy để job quét. Confirm/force-reset trước 5 phút → không gửi.

## Testing

```bash
cd apps/api && npm run dev
cd apps/web && npm run dev
```

**Test cases:**

1. Acc rảnh → member bấm **Đăng ký chơi** → status IN_USE, badge PLAYING, history START_PLAY.
2. Member khác mở cùng acc → không đăng ký được (API 409 + UI thông báo).
3. Người đang chơi **Kết thúc phiên** → PENDING_LOGOUT, history END_PLAY.
4. **Xác nhận đã log out** → AVAILABLE / IDLE, history CONFIRM_LOGOUT.
5. Owner **Ép reset** khi kẹt IN_USE hoặc PENDING_LOGOUT → AVAILABLE, history FORCE_RESET.
6. End session → **không** confirm → chờ ≥ 5 phút (API chạy) → nhận email nhắc (hoặc log `[email:log]` / `[logout-reminder]`).
