# 🔧 Quick Fix - Lỗi 404 Trên Vercel

## Vấn đề

Frontend gọi `/api/v1/auth/login` nhưng nhận 404 error.

## Nguyên nhân

- Serverless function routing không xử lý đúng path từ Vercel
- Vercel rewrite configuration cần điều chỉnh

## Đã Fix

✅ Cập nhật `api/[...path].ts` để xử lý đúng path từ Vercel
✅ Cập nhật `vercel.json` với rewrite rules phù hợp
✅ Đảm bảo Express routes handle cả `/api/v1/*` patterns

## Các Bước Deploy Lại

### 1. Commit Changes

```bash
git add .
git commit -m "Fix: Vercel serverless routing for API endpoints"
git push origin main
```

### 2. Cấu Hình Environment Variables Trên Vercel

Vào **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Thêm các biến sau:

| Variable        | Value                                           | Environment                      |
| --------------- | ----------------------------------------------- | -------------------------------- |
| `DATABASE_URL`  | `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` | Production, Preview, Development |
| `JWT_SECRET`    | `<random-string-32-chars>`                      | Production, Preview, Development |
| `NODE_ENV`      | `production`                                    | Production                       |
| `FRONTEND_URL`  | `https://your-app.vercel.app`                   | Production                       |
| `EMAIL_ENABLED` | `false`                                         | All (optional)                   |

**Lưu ý:**

- `FRONTEND_URL` phải match chính xác domain Vercel của bạn
- Generate JWT_SECRET: `openssl rand -base64 32`

### 3. Redeploy

- Vercel sẽ tự động redeploy khi có push mới
- Hoặc vào Vercel Dashboard → Deployments → Redeploy

### 4. Kiểm Tra

#### Test API Health

```bash
curl https://your-app.vercel.app/api/health
```

Kết quả mong đợi:

```json
{
  "success": true,
  "message": "Server is running",
  "database": "connected"
}
```

#### Test Login

1. Truy cập `https://your-app.vercel.app/login`
2. Nhập email/password
3. Mở DevTools → Network tab
4. Click "Đăng nhập"
5. Kiểm tra request tới `/api/v1/auth/login`
6. Status code phải là `200 OK`

## Troubleshooting

### Vẫn còn 404?

1. Xóa cache Vercel: Settings → Advanced → Clear Cache
2. Redeploy từ Vercel Dashboard
3. Kiểm tra Build Logs có error không

### Database Connection Error?

1. Kiểm tra `DATABASE_URL` đã set đúng chưa
2. Test connection từ local:
   ```bash
   cd apps/api
   npm run prisma:studio
   ```

### CORS Error?

1. Đảm bảo `FRONTEND_URL` match với Vercel domain
2. Kiểm tra browser console có error gì không

## Files Đã Thay Đổi

1. `api/[...path].ts` - Serverless function handler
2. `vercel.json` - Vercel deployment config
3. `apps/api/src/app/config/index.ts` - CORS config (giữ nguyên)
4. `.vercelignore` - Ignore unnecessary files (new)
5. `VERCEL_DEPLOYMENT.md` - Full deployment guide (new)

## Tài Liệu Đầy Đủ

Xem [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) để biết chi tiết hơn.
