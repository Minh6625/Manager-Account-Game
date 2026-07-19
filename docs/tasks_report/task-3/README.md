# Task 3: Account Detail Page

## Mô tả

Hiển thị đầy đủ thông tin acc, danh sách thành viên, trạng thái từng thành viên và lịch sử hoạt động.

## Thời gian

- **Ước lượng**: 60-90 phút
- **Thực tế**: ~75 phút

## Scope

### Được làm

- ✅ Trang chi tiết account với thông tin đầy đủ
- ✅ Hiển thị trạng thái acc (AVAILABLE, IN_USE, PENDING_LOGOUT)
- ✅ Hiển thị chủ phòng và người đang chơi
- ✅ Danh sách thành viên với role và status badges
- ✅ Hiển thị 5 bản ghi lịch sử gần nhất
- ✅ Nút "Xem thêm" để load lịch sử 3 ngày
- ✅ Responsive design (desktop & mobile)

### Không được làm

- ❌ Luồng mời thành viên
- ❌ Luồng đăng ký chơi
- ❌ Tạo/sửa/xóa acc
- ❌ Kick thành viên

## Kiến trúc

### Backend

```
apps/api/src/modules/accs/
├── acc.repository.ts      # Added getAccountById, getAccountHistory
├── acc.service.ts         # Added getAccountById, getAccountHistory
├── acc.controller.ts      # Added getAccountById, getAccountHistory
└── acc.routes.ts          # Added GET /:id, GET /:id/history
```

### Frontend

```
apps/web/src/
├── pages/
│   └── acc-detail/
│       ├── AccountDetailPage.tsx  # Main detail page
│       └── index.ts
└── App.tsx                        # Added /accounts/:id route
```

## API Endpoints

### GET /api/v1/accs/:id

Lấy thông tin chi tiết account.

**Headers:** Cookie with token

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Account Name",
    "status": "AVAILABLE",
    "note": "Optional note",
    "ownerUserId": "uuid",
    "owner": {
      "id": "uuid",
      "email": "owner@example.com",
      "displayName": "Owner Name"
    },
    "memberships": [
      {
        "id": "uuid",
        "role": "OWNER",
        "memberStatus": "IDLE",
        "joinedAt": "2026-07-11T...",
        "user": {
          "id": "uuid",
          "email": "member@example.com",
          "displayName": "Member Name"
        }
      }
    ],
    "statusHistory": [
      {
        "id": "uuid",
        "actionType": "CREATE",
        "fromStatus": null,
        "toStatus": "AVAILABLE",
        "note": null,
        "createdAt": "2026-07-11T...",
        "user": {
          "id": "uuid",
          "email": "user@example.com",
          "displayName": "User Name"
        }
      }
    ]
  }
}
```

### GET /api/v1/accs/:id/history

Lấy toàn bộ lịch sử 3 ngày gần nhất.

**Query params:**

- `limit` (optional): Giới hạn số bản ghi

**Headers:** Cookie with token

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "actionType": "START_PLAY",
      "fromStatus": "AVAILABLE",
      "toStatus": "IN_USE",
      "note": null,
      "createdAt": "2026-07-11T...",
      "user": {
        "id": "uuid",
        "email": "player@example.com",
        "displayName": "Player Name"
      }
    }
  ]
}
```

## Features

### Account Information Display

- Tên account
- Status badge (Rảnh/Đang chơi/Chờ logout)
- Chủ phòng
- Người đang chơi (nếu có)
- Số thành viên (X/5)
- Ghi chú (nếu có)

### Members List

- Danh sách tất cả thành viên
- Role badge (Chủ phòng cho OWNER)
- Status badge (Rảnh/Đang chơi/Chờ logout/Đã kick)
- Thời gian tham gia
- Nút Kick (disabled, cho future tasks)

### History Section

- Hiển thị 5 bản ghi mới nhất mặc định
- Format dễ đọc: "User đã làm gì" + thời gian
- Nút "Xem thêm" hiển thị khi có >= 5 bản ghi
- Load toàn bộ lịch sử 3 ngày khi click "Xem thêm"

### Action Buttons

- Nút "Sửa thông tin" (disabled, cho Task 6)
- Nút "Mời thành viên" (disabled, cho Task 4)
- Chỉ hiển thị cho chủ phòng

## Security

- Verify user có quyền xem account (owner hoặc member)
- Return 404 nếu user không có quyền
- Auth middleware protect tất cả routes

## Testing

### Quick Test

```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev

# Open: http://localhost:5173
```

### Test Cases

1. **View detail** - Click "Xem chi tiết" từ danh sách
2. **Account info** - Kiểm tra thông tin hiển thị đúng
3. **Members list** - Kiểm tra danh sách thành viên với role/status
4. **History default** - Kiểm tra hiển thị 5 bản ghi mới nhất
5. **Load more history** - Click "Xem thêm" và kiểm tra load đủ
6. **Owner permissions** - Kiểm tra nút hiển thị đúng cho owner
7. **Member view** - Kiểm tra member không thấy nút quản lý
8. **Responsive** - Kiểm tra trên mobile và desktop
9. **Back button** - Click "Quay lại danh sách" hoạt động
10. **Access control** - Thử truy cập account không có quyền

## Dependencies

### Backend

- Sử dụng Prisma queries có sẵn
- Không thêm dependency mới

### Frontend

- Sử dụng react-router-dom có sẵn
- Tailwind CSS styling có sẵn
