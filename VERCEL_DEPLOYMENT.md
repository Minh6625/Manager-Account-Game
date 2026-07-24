# Hướng Dẫn Deploy Lên Vercel

## 🔧 Cấu Hình Environment Variables Trên Vercel

Đảm bảo các biến môi trường sau được set trong Vercel Dashboard (Settings → Environment Variables):

### Required Variables:

1. **DATABASE_URL**
   - Connection string PostgreSQL từ Supabase
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

2. **JWT_SECRET**
   - Secret key để sign JWT tokens
   - Sử dụng chuỗi ngẫu nhiên dài và phức tạp
   - Ví dụ: `openssl rand -base64 32`

3. **NODE_ENV**
   - Set: `production`

4. **FRONTEND_URL**
   - URL của web app trên Vercel
   - Ví dụ: `https://manager-account-game.vercel.app`

### Optional Variables (Email):

5. **EMAIL_ENABLED**
   - `false` (để tắt email trong MVP)

6. **MAIL_FROM**
   - Email gửi đi
   - Ví dụ: `Manager Account <noreply@example.com>`

## 🚀 Deployment Steps

1. **Push code lên GitHub**

   ```bash
   git add .
   git commit -m "Fix Vercel deployment routing"
   git push origin main
   ```

2. **Kết nối repo với Vercel**
   - Đăng nhập Vercel
   - Import GitHub repository
   - Chọn framework: **Other** (vì có custom build command)

3. **Build Settings** (Vercel sẽ tự động detect từ `vercel.json`):
   - Build Command: `npm run build -w @manager-acc/shared && npm run prisma:generate -w @manager-acc/api && npm run build -w @manager-acc/web`
   - Output Directory: `apps/web/dist`
   - Install Command: `npm install`

4. **Thêm Environment Variables**
   - Vào Settings → Environment Variables
   - Thêm tất cả các biến ở trên
   - Apply cho **Production**, **Preview**, và **Development**

5. **Deploy**
   - Click Deploy
   - Đợi build hoàn thành
   - Kiểm tra logs nếu có lỗi

## 🔍 Kiểm Tra Sau Deploy

### 1. Health Check

- Truy cập: `https://your-app.vercel.app/api/health`
- Kết quả mong đợi:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "database": "connected"
  }
  ```

### 2. API Version

- Truy cập: `https://your-app.vercel.app/api/v1`
- Kết quả mong đợi:
  ```json
  {
    "success": true,
    "message": "Manager Account Liên Quân API v1",
    "version": "1.0.0"
  }
  ```

### 3. Login Test

- Truy cập: `https://your-app.vercel.app/login`
- Thử đăng nhập với tài khoản test
- Kiểm tra Network tab trong DevTools
- URL should be: `https://your-app.vercel.app/api/v1/auth/login`
- Response status: `200 OK`

## 🐛 Troubleshooting

### Lỗi 404 - Route Not Found

**Nguyên nhân:**

- Serverless function không nhận đúng path từ Vercel
- Vercel rewrite rules không đúng

**Giải pháp:**

- ✅ Đã fix trong `api/[...path].ts`
- ✅ Đã fix trong `vercel.json`
- Redeploy lại project

### Lỗi 503 - Database Connection Failed

**Nguyên nhân:**

- `DATABASE_URL` không đúng hoặc thiếu
- Supabase database không accessible

**Giải pháp:**

1. Kiểm tra `DATABASE_URL` trong Vercel Environment Variables
2. Test connection string locally:
   ```bash
   cd apps/api
   npm run prisma:studio
   ```
3. Đảm bảo Supabase database đang chạy

### Lỗi CORS

**Nguyên nhân:**

- `FRONTEND_URL` không khớp với actual domain

**Giải pháp:**

1. Update `FRONTEND_URL` trong Vercel Environment Variables
2. Redeploy

### Build Failed

**Nguyên nhân:**

- Thiếu dependencies
- Prisma generate failed
- TypeScript compilation errors

**Giải pháp:**

1. Kiểm tra build logs trong Vercel
2. Test build locally:
   ```bash
   npm install
   npm run build -w @manager-acc/shared
   npm run prisma:generate -w @manager-acc/api
   npm run build -w @manager-acc/web
   ```

## 📝 Notes

- Vercel serverless functions có timeout 10s (free tier) / 60s (pro)
- Prisma Client được generate trong build time
- Frontend được serve từ `apps/web/dist`
- API routes được handle bởi serverless function tại `api/[...path].ts`

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
