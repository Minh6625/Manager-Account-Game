# Task 4 Changelog

## 2026-07-12

- Initial invitation module (API + FE feature invite-member)
- Nested routes under `/accs/:id/invitations`
- Pending invites for current user
- Shared package invitation types/validators

## 2026-07-12 (email)

- FRS/Architecture/Task breakdown/Prompt: bắt buộc email invitation + welcome
- `infra/email` Nodemailer SMTP + templates
- Wire send after create invite and after accept
- `.env.example` SMTP / EMAIL_ENABLED
