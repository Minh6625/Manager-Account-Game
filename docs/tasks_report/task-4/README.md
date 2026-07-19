# Task 4: Luồng mời thành viên vào acc

## Mô tả

Chủ phòng gửi lời mời theo email. Người được mời phải **chấp nhận** mới trở thành member. Pending không tính giới hạn 5 member. Lời mời hết hạn sau 24 giờ.

## Scope

### Được làm

- ✅ Tạo / list invitation theo acc
- ✅ Accept / reject
- ✅ Pending list cho user hiện tại
- ✅ Ghi history INVITE_* / MEMBER_JOIN
- ✅ Enforce max 5 members, owner-only invite

### Không được làm

- ❌ Kick member (Task 6)
- ❌ Play session (Task 5)
- ❌ Add thẳng member bỏ qua invitation

## API

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/api/v1/accs/:id/invitations` | Owner gửi mời `{ email }` |
| GET | `/api/v1/accs/:id/invitations` | List lời mời của acc |
| POST | `/api/v1/accs/:id/invitations/:invId/accept` | Invitee chấp nhận |
| POST | `/api/v1/accs/:id/invitations/:invId/reject` | Invitee từ chối |
| GET | `/api/v1/invitations/pending` | Lời mời pending của tôi |

## Email

| Sự kiện | Email |
|---------|--------|
| Owner gửi lời mời | Invitation → `invited_email` |
| Invitee chấp nhận | Welcome → email user |

Cấu hình: `EMAIL_ENABLED`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `FRONTEND_URL`.

- `EMAIL_ENABLED=false` hoặc không có SMTP → log console (dev).
- Production: bật SMTP để gửi thật.

## Cấu trúc code

### Backend

`apps/api/src/modules/invitations/`  
`apps/api/src/infra/email/`

### Frontend

`apps/web/src/features/invite-member/`
