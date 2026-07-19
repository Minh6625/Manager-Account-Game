# Changelog — Task 7 Kick Member

## v1.0.1 — 2026-07-14

### Changed

- Sau kick **không giữ thẻ member KICKED** trên danh sách
- Chỉ lưu changelog (`status_history` MEMBER_KICK); list member chỉ active

## v1.0.0 — 2026-07-14

### Added / Hardened

- Prompt chính thức: `Promt/Task-7/prompt.xml`
- History kick: `userId` = actor (người thực hiện); note = người bị kick + holding context
- Member type: `leftAt` optional
- Docs `docs/tasks_report/task-7/`

### Notes

- Kick API + modal đã có từ Task 6; Task 7 chuẩn hóa AC còn lại
