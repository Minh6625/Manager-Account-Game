# Task 4 - Báo Cáo Hoàn Thành

**Trạng thái**: ✅ Hoàn thành  
**Ngày**: 2026-07-12  

## 1. Tóm tắt

Implement invitation flow: owner mời bằng email → status PENDING (chưa là member) → invitee accept/reject. Lazy expire sau 24h. Max 5 members; pending không tính limit. History ghi INVITE_SENT / ACCEPTED / REJECTED / MEMBER_JOIN.

**Email (bổ sung theo FRS 6.4):**

- Gửi **email invitation** sau khi tạo lời mời (Nodemailer SMTP / log mode).
- Gửi **email welcome** sau khi accept thành công.
- Best-effort: lỗi SMTP không rollback invitation/membership.

## 2. Files chính

### Backend

- `modules/invitations/*` (repository, service, controller, routes, mine.routes)
- `modules/accs/acc.routes.ts` — nest `/:id/invitations`
- `app/server.ts` — mount `/api/v1/invitations`

### Frontend

- `features/invite-member/*`
- `pages/acc-detail`, `pages/acc-list` — wire UI
- `AccountInfoCard` — enable nút Mời

### Shared

- types/dto/validators invitation trong `@manager-acc/shared`

### Email

- `apps/api/src/infra/email/email.service.ts`
- `apps/api/src/infra/email/templates.ts`
- Env: `EMAIL_ENABLED`, `SMTP_*`, `MAIL_FROM`, `FRONTEND_URL`

## 3. Acceptance

| Criteria | Status |
|----------|--------|
| Không thành member ngay khi mời | ✅ PENDING only |
| Accept → membership MEMBER | ✅ |
| Hết hạn 24h | ✅ lazy EXPIRED |
| Max 5 members | ✅ create + accept |
| Pending không tính limit | ✅ count membership only |
| History | ✅ |
| Email invitation khi mời | ✅ SMTP hoặc log |
| Email welcome khi accept | ✅ SMTP hoặc log |

## 4. Test thủ công gợi ý

1. User A tạo acc, mời email User B → pending, B chưa trong members.
2. User B login → panel lời mời → Chấp nhận → thấy acc trong “đã tham gia”.
3. Acc đủ 5 member → không mời thêm / không accept.
4. Lời mời quá 24h → accept báo hết hạn, status EXPIRED.
