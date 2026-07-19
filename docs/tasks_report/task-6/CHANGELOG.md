# Changelog — Task 6 CRUD Acc & Kick

## v1.0.0 — 2026-07-14

### Added

- **Backend**
  - `PATCH /api/v1/accs/:id` — owner update name/note (unique name)
  - `DELETE /api/v1/accs/:id` — owner hard delete (cascade)
  - `DELETE /api/v1/accs/:id/members/:memberId` — owner kick
  - Module `memberships/` (repository, service, controller, routes)
  - History: CREATE on create; UPDATE; DELETE; MEMBER_KICK (+ STATUS_CHANGE when holder kicked)
- **Frontend**
  - Edit account modal
  - Confirm modal for delete & kick
  - Owner controls: Sửa / Xóa / Kick
  - Warning copy when kicking member who holds acc
- **Shared**
  - `updateAccSchema`, `UpdateAccountDto`
  - `HISTORY_ACTION.UPDATE`, `HISTORY_ACTION.DELETE`

### Docs

- `docs/tasks_report/task-6/` (README, COMPLETED, CHANGELOG)
- Cập nhật `docs/tasks_report/INDEX.md`
