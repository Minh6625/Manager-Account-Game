# 🗄️ Hướng Dẫn Setup Supabase Database

## Bước 1: Tạo Tài Khoản Supabase

1. Truy cập: **https://supabase.com**
2. Click **"Start your project"** hoặc **"Sign up"**
3. Đăng nhập bằng GitHub (khuyên dùng) hoặc Email
4. Xác nhận email nếu dùng email

---

## Bước 2: Tạo Project Mới

1. Sau khi đăng nhập, click **"New project"**
2. Điền thông tin:
   - **Name**: `manager-account-lienquan`
   - **Database Password**: Tạo password mạnh và **GHI NHỚ** (cần dùng ở bước sau)
   - **Region**: Chọn `Southeast Asia (Singapore)` - gần Việt Nam nhất
   - **Pricing Plan**: Chọn **Free** (đủ dùng cho development)

3. Click **"Create new project"**
4. **Đợi 2-3 phút** để Supabase khởi tạo database

⏳ Bạn sẽ thấy màn hình loading, hãy kiên nhẫn đợi cho đến khi dashboard hiển thị.

---

## Bước 3: Lấy Connection String

**QUAN TRỌNG:** Không phải vào "Database" ở sidebar trái (đó là Database Management - Schema Visualizer)!

### Các bước chi tiết:

1. Vào project vừa tạo trên Supabase Dashboard
2. Nhìn sidebar bên trái, **kéo xuống cuối cùng**
3. Click vào biểu tượng **⚙️ Settings** (bánh răng - ở dưới cùng sidebar)
4. Trong trang Settings, sidebar trái sẽ hiện menu mới
5. Trong menu Settings này → Click **"Database"**
6. Bạn sẽ thấy trang Database Settings (khác với Database ở sidebar chính)
7. Scroll xuống phần **"Connection string"** (khoảng giữa trang)
8. Bạn sẽ thấy có nhiều tabs:
   - **Pooler (Session mode)**
   - **Pooler (Transaction mode)**
   - **Direct connection**
   - **URI** ← **CHỌN TAB NÀY!**
9. Click vào tab **"URI"**
10. Copy toàn bộ connection string hiển thị

### 📍 Vị trí chính xác:

```
Supabase Dashboard
 └─ Project của bạn
     └─ ⚙️ Settings (cuối sidebar trái - dưới cùng)
         └─ Database (trong Settings menu)
             └─ Connection string section
                 └─ Tab "URI" ← Copy ở đây!
```

**Connection string sẽ có dạng:**

```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

11. **Thay thế** `[YOUR-PASSWORD]` bằng password bạn đã tạo ở Bước 2

**Ví dụ:**

- Password bạn tạo: `MySecurePass123`
- Connection string ban đầu: `postgresql://postgres.abc:[YOUR-PASSWORD]@aws...`
- Connection string sau khi thay: `postgresql://postgres.abc:MySecurePass123@aws...`

---

## Bước 4: Cập Nhật File .env

1. Mở file `.env` tại đường dẫn: `Manager_Account_Lienquan/apps/api/.env`

2. Thay thế dòng `DATABASE_URL` bằng connection string vừa copy:

```env
DATABASE_URL="postgresql://postgres.abc:MySecurePass123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**Lưu ý:**

- Phải có dấu ngoặc kép `"` bao quanh connection string
- Không có dấu cách thừa
- Password phải chính xác (phân biệt chữ hoa/thường)

3. Save file

---

## Bước 5: Kiểm Tra Kết Nối

Sau khi setup xong, chạy lệnh sau để kiểm tra:

```bash
cd Manager_Account_Lienquan\apps\api
npm run prisma:generate
npm run prisma:push
```

**Nếu thành công**, bạn sẽ thấy:

```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema
```

**Nếu lỗi**, kiểm tra lại:

- Password có đúng không?
- Connection string có dấu ngoặc kép không?
- Có space thừa trong .env không?

---

## Bước 6: Kiểm Tra Tables Đã Tạo

1. Quay lại Supabase Dashboard
2. Click **"Table Editor"** ở sidebar trái
3. Bạn sẽ thấy **5 tables** đã được tạo:
   - ✅ `users` - Thông tin người dùng
   - ✅ `accs` - Thông tin tài khoản game
   - ✅ `memberships` - Thành viên trong tài khoản
   - ✅ `invitations` - Lời mời tham gia
   - ✅ `status_history` - Lịch sử thay đổi trạng thái

---

## ✅ Hoàn Thành!

Setup Supabase thành công! Bây giờ bạn có thể chạy ứng dụng.

➡️ Tiếp theo: Xem file **HUONG_DAN_CHAY.md** để start server và frontend.

---

## 🔧 Troubleshooting

### Lỗi: "Can't reach database server"

**Nguyên nhân:**

- Password sai
- Connection string không đúng format
- Project Supabase chưa khởi tạo xong

**Giải pháp:**

1. Kiểm tra lại password trong Supabase Settings → Database → Reset password nếu cần
2. Copy lại connection string từ Supabase
3. Đảm bảo chọn tab "URI" không phải "Pooler"
4. Đợi 2-3 phút nếu vừa tạo project

### Lỗi: "Environment variable not found: DATABASE_URL"

**Giải pháp:**

1. Kiểm tra file `.env` có tồn tại trong `apps/api/` không
2. Kiểm tra tên biến phải là `DATABASE_URL` (viết hoa)
3. Restart terminal và chạy lại lệnh

### Tables không hiển thị trong Table Editor

**Giải pháp:**

1. Chạy lại: `npm run prisma:push` trong `apps/api/`
2. Refresh trang Supabase Dashboard
3. Kiểm tra Console trong Dashboard có báo lỗi không

---

**Cập nhật:** 2026-07-08  
**Thời gian setup:** ~5-7 phút
