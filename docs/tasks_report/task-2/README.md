# Task 2: Danh sách acc và tab lọc

## Mô tả

Trang danh sách tài khoản với 3 tab lọc (Tất cả, Acc của tôi, Acc đã tham gia), search, và tạo account mới.

## Thời gian

- **Ước lượng**: 45-90 phút
- **Thực tế**: ~60 phút

## Scope

### Được làm

- ✅ Tạo UI danh sách acc responsive
- ✅ 3 tab lọc (Tất cả, Acc của tôi, Acc đã tham gia)
- ✅ Badge trạng thái acc
- ✅ Hiển thị người đang giữ acc
- ✅ Search acc theo tên
- ✅ Tạo acc mới

### Không được làm

- ❌ Chi tiết acc (Task 3)
- ❌ Mời thành viên (Task 4)
- ❌ Đăng ký chơi (Task 5)

## Kiến trúc

### Backend

```
apps/api/src/modules/accs/
├── acc.routes.ts       # Routes
├── acc.controller.ts   # HTTP handlers
├── acc.service.ts      # Business logic
├── acc.repository.ts   # Database operations
└── acc.schemas.ts      # Zod validation
```

### Frontend

```
apps/web/src/pages/acc-list/
└── AccountListPage.tsx # UI với tabs, search, modal
```

## API Endpoints

### GET /api/v1/accs

**Query Parameters:**

- `filter`: `all` | `owned` | `joined`
- `search`: Tìm kiếm theo tên

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tên acc",
      "status": "AVAILABLE",
      "note": "Ghi chú",
      "owner": { "id": "uuid", "displayName": "Owner" },
      "memberships": [...],
      "_count": { "memberships": 3 }
    }
  ]
}
```

### POST /api/v1/accs

**Body:**

```json
{
  "name": "Tên acc",
  "note": "Ghi chú (optional)"
}
```

**Validation:**

- Name required, max 100 chars, **must be unique**
- Note optional, max 500 chars

**Success (201):**

```json
{
  "success": true,
  "data": {
    /* account */
  },
  "message": "Tạo tài khoản thành công"
}
```

**Error (400):**

```json
{
  "success": false,
  "message": "Tên tài khoản đã tồn tại"
}
```

## Logic nghiệp vụ

### 3 Tab Filter

| Tab             | Logic                         |
| --------------- | ----------------------------- |
| Tất cả          | Owner HOẶC member             |
| Acc của tôi     | ownerUserId === userId        |
| Acc đã tham gia | Member NHƯNG KHÔNG phải owner |

### Status Display

| Status         | Badge      | Hiển thị thêm    |
| -------------- | ---------- | ---------------- |
| AVAILABLE      | Xanh lá    | -                |
| IN_USE         | Xanh dương | + tên người chơi |
| PENDING_LOGOUT | Vàng       | -                |

### Create Account

- User tự động là owner và member (role=OWNER)
- **Tên acc phải unique** - kiểm tra duplicate
- Tạo record `accs` + `memberships`

## Dependencies

- **Backend**: Express, Prisma, Zod
- **Frontend**: React, React Router, Tailwind CSS

## Testing

```bash
# Start servers
cd apps/api && npm run dev
cd apps/web && npm run dev

# Open: http://localhost:5173
```

**Test cases:**

1. Switch giữa 3 tabs
2. Search acc theo tên
3. Create acc mới
4. Create acc trùng tên (expect error)
5. Responsive trên mobile
