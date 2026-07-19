# Changelog — Task 5 Play Session

## v1.1.0 — 2026-07-13

### Added

- Email nhắc xác nhận log out sau **5 phút** nếu vẫn `PENDING_LOGOUT`
- Schema membership: `pending_logout_at`, `logout_reminder_sent_at`
- Background job `logout-reminder.job.ts` (poll 30s khi API chạy)
- Template + `sendLogoutReminderEmail`
- History action `LOGOUT_REMINDER`
- Constant `LOGOUT_REMINDER_MINUTES = 5`

## v1.0.0 — 2026-07-13

### Added

- Backend module `play-session`: play / end / confirm-logout / force-reset
- Optimistic claim acc status trong transaction
- Frontend `PlaySessionPanel` + `usePlaySession` trên trang chi tiết
- History actions: START_PLAY, END_PLAY, CONFIRM_LOGOUT, FORCE_RESET
- Shared constant `HISTORY_ACTION`

### Docs

- `docs/tasks_report/task-5/` (README, COMPLETED, CHANGELOG)
- Cập nhật `docs/tasks_report/INDEX.md`
