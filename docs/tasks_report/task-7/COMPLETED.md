# Task 7 - Báo Cáo Hoàn Thành

**Trạng thái**: ✅ Hoàn thành  
**Ngày**: 2026-07-14  

## 1. Tóm tắt

Chuẩn hóa luồng **kick thành viên**. Sau kick: member mất quyền ngay (`KICKED` + `leftAt` trong DB), **không giữ thẻ** trên danh sách thành viên — chỉ lưu **changelog** (`status_history` MEMBER_KICK) với actor + note.

## 2. Thay đổi chính

### Backend

- `membership.service.ts` / `repository.ts`: history `userId` = actor; note chứa người bị kick + actor label
- `acc.repository.getAccountById`: **chỉ active** (`leftAt: null`, không KICKED)

### Frontend

- `MembersList`: chỉ active; sau kick thẻ biến mất
- `formatHistoryAction`: `{actor} đã kick thành viên` (chi tiết ở note)

### Docs / Prompt

- `Promt/Task-7/prompt.xml`
- `docs/tasks_report/task-7/*`
- Cập nhật `INDEX.md`

## 3. Acceptance

| Criteria | Status |
|----------|--------|
| Chỉ chủ phòng thấy/dùng nút kick | ✅ |
| Member bị kick mất quyền ngay | ✅ leftAt + KICKED; access leftAt null |
| Modal xác nhận trước khi kick | ✅ |
| Kick holder được + cảnh báo UI | ✅ modal body + free acc |
| History: thời điểm + người thực hiện | ✅ userId=actor, createdAt, note |
| Không giữ thẻ member KICKED trên list | ✅ chỉ active; audit qua history |

## 4. Build

- `@manager-acc/shared` ✅  
- `@manager-acc/api` ✅  
- `@manager-acc/web` ✅  

## 5. Rủi ro

| Rủi ro | Mức | Ghi chú |
|--------|-----|--------|
| Kick holder cắt phiên đang chơi | By design | Modal cảnh báo |
| Ai đã bị kick chỉ xem ở history | By design | Không list thẻ KICKED |
| Re-invite sau kick | Thấp | Task 4 `createMembership` re-activate |

## 6. Ngoài scope

- CRUD acc, invite, play session
