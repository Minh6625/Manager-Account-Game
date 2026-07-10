# Task Documentation Template

## Cấu trúc 3 files cố định

Mỗi task có **3 files**:

```
task-X/
├── README.md         # Documentation (không thay đổi nhiều)
├── COMPLETED.md      # Báo cáo hoàn thành (cập nhật khi có thay đổi)
└── CHANGELOG.md      # Lịch sử versions (chỉ thêm version mới)
```

---

## 1. README.md Template

````markdown
# Task X: [Tên Task]

## Mô tả

[Mô tả ngắn gọn task làm gì]

## Thời gian

- **Ước lượng**: XX-YY phút
- **Thực tế**: ~ZZ phút

## Scope

### Được làm

- ✅ [Feature 1]
- ✅ [Feature 2]
- ✅ [Feature 3]

### Không được làm

- ❌ [Out of scope 1] (Task Y)
- ❌ [Out of scope 2] (Task Z)

## Kiến trúc

### Backend

[Cấu trúc files backend]

### Frontend

[Cấu trúc files frontend]

## API Endpoints

### [METHOD] /api/v1/[endpoint]

**Description**: [Mô tả endpoint]

**Query/Body Parameters:**

- [param1]: [description]
- [param2]: [description]

**Response:**
\```json
{
"success": true,
"data": {}
}
\```

## Logic nghiệp vụ

[Giải thích business logic chính]

### [Feature Name]

| [Column 1] | [Column 2] | [Column 3] |
| ---------- | ---------- | ---------- |
| [Data]     | [Data]     | [Data]     |

## Dependencies

- **Backend**: [List dependencies]
- **Frontend**: [List dependencies]

## Testing

\```bash

# Start servers

cd apps/api && npm run dev
cd apps/web && npm run dev
\```

**Test cases:**

1. [Test case 1]
2. [Test case 2]
3. [Test case 3]
````

---

## 2. COMPLETED.md Template

```markdown
# Task X - Báo Cáo Hoàn Thành

**Status**: ✅ Hoàn thành | ⏳ In Progress | ❌ Blocked  
**Date**: YYYY-MM-DD  
**Time**: ~XX phút

---

## 1. Thay Đổi

### 1.1. Tóm tắt

[Tóm tắt 2-3 dòng những gì đã làm]

### 1.2. Files Changed

**Backend:**

| Type     | File Path          |
| -------- | ------------------ |
| Created  | [path/to/file1.ts] |
| Created  | [path/to/file2.ts] |
| Modified | [path/to/file3.ts] |

**Frontend:**

| Type     | File Path           |
| -------- | ------------------- |
| Created  | [path/to/file1.tsx] |
| Modified | [path/to/file2.tsx] |

### 1.3. Features Added

| #   | Feature          | Description         |
| --- | ---------------- | ------------------- |
| 1   | [Feature name 1] | [Short description] |
| 2   | [Feature name 2] | [Short description] |
| 3   | [Feature name 3] | [Short description] |

---

## 2. Kết Quả

### 2.1. Acceptance Criteria

| #   | Criteria | Status |
| --- | -------- | ------ |
| 1   | [AC 1]   | ✅     |
| 2   | [AC 2]   | ✅     |
| 3   | [AC 3]   | ✅     |

### 2.2. Test Results

**Manual Testing:**

| #   | Test Case     | Result |
| --- | ------------- | ------ |
| 1   | [Test case 1] | ✅     |
| 2   | [Test case 2] | ✅     |
| 3   | [Test case 3] | ✅     |

**API Testing:**

| #   | Endpoint           | Expected      | Result |
| --- | ------------------ | ------------- | ------ |
| 1   | [METHOD /endpoint] | [200 OK]      | ✅     |
| 2   | [METHOD /endpoint] | [201 Created] | ✅     |

**Security/Other Testing** (nếu có):

| #   | Test Item             | Status |
| --- | --------------------- | ------ |
| 1   | [Security check 1]    | ✅     |
| 2   | [Performance check 1] | ✅     |

---

## 3. Rủi Ro

### 3.1. Known Issues

[List known issues hoặc "Không có issues"]

~~[Issue đã fix]~~ - **Fixed** (YYYY-MM-DD)

### 3.2. Potential Risks

| #   | Risk               | Impact | Mitigation        |
| --- | ------------------ | ------ | ----------------- |
| 1   | [Risk description] | High   | [How to mitigate] |
| 2   | [Risk description] | Medium | [How to mitigate] |
| 3   | [Risk description] | Low    | [How to mitigate] |

### 3.3. Next Steps

| Task   | Description                |
| ------ | -------------------------- |
| Task X | [Next task description]    |
| Task Y | [Another task description] |
```

---

## 3. CHANGELOG.md Template

```markdown
# Task X - Changelog

## v1.0.0 - YYYY-MM-DD

**Type**: Initial Release | Feature | Bugfix | Refactor

### Added

**Backend:**

- [Feature 1]
- [Feature 2]
- [Feature 3]

**Frontend:**

- [Feature 1]
- [Feature 2]

**Business Logic:**

- [Logic 1]
- [Logic 2]

### Files Created

- [path/to/file1.ts]
- [path/to/file2.ts]
- [path/to/file3.tsx]

### Files Modified

- [path/to/file4.ts] - [Description of changes]
- [path/to/file5.tsx] - [Description of changes]
```

### Template cho version updates:

```markdown
## v1.0.1 - YYYY-MM-DD

**Type**: Bugfix | Feature | Refactor

### Fixed / Added / Changed

- [Change 1]
- [Change 2]

### Modified

- [path/to/file.ts] - [Description]

---
```

---

## Quy tắc sử dụng

### Khi tạo task mới:

1. Copy 3 files template
2. Rename thành `task-X/`
3. Fill in thông tin vào README.md
4. Implement code
5. Fill in COMPLETED.md (sections 1, 2, 3)
6. Fill in CHANGELOG.md v1.0.0

### Khi update task:

1. Sửa code
2. **Update COMPLETED.md**:
   - Section 1.2: Thêm/sửa files
   - Section 2.1: Update AC nếu cần
   - Section 2.2: Update test results
   - Section 3: Update issues/risks
3. **Add version mới vào CHANGELOG.md** (ở đầu file)
4. **KHÔNG sửa README.md** trừ khi thay đổi lớn

### Version numbering:

- **v1.0.0**: Initial release
- **v1.0.x**: Bugfix (patch)
- **v1.x.0**: Feature mới (minor)
- **v2.0.0**: Breaking change (major)

---

**Created**: 2026-07-10  
**Purpose**: Chuẩn hóa task documentation cho tất cả tasks
