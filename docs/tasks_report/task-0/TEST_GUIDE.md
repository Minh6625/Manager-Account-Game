# 🧪 Task 0: Setup & Verification Guide

## 🎯 Mục Tiêu

Setup môi trường development và verify architecture đã được implement đúng.

---

## ✅ Prerequisites

- Node.js 20+ installed
- npm installed
- Code editor (VS Code recommended)
- Internet connection
- Browser (Chrome/Edge/Firefox)

---

## 📋 Setup Steps

### Step 1: Supabase Setup

**Chi tiết:** Xem [HUONG_DAN_SUPABASE.md](../../guides/HUONG_DAN_SUPABASE.md)

**Tóm tắt:**

1. Tạo account tại https://supabase.com
2. Create new project: `manager-account-lienquan`
3. Chọn region: Singapore
4. Lấy connection string (Settings → Database → URI)
5. Thay [YOUR-PASSWORD] bằng password thực

---

### Step 2: Environment Configuration

```bash
# Navigate to API folder
cd Manager_Account_Lienquan/apps/api

# File .env đã được tạo sẵn
# Mở và update DATABASE_URL
```

**File `.env` cần có:**

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

### Step 3: Install Dependencies

```bash
# Root folder
cd Manager_Account_Lienquan
npm install
```

**Expected:** Dependencies installed for all workspaces (root, api, web)

---

### Step 4: Generate Prisma Client

```bash
# In API folder
cd apps/api
npm run prisma:generate
```

**Expected:**

```
✔ Generated Prisma Client
```

---

### Step 5: Push Schema to Database

```bash
npm run prisma:push
```

**Expected:**

```
🚀 Your database is now in sync with your Prisma schema
✔ Generated Prisma Client
```

**Verify in Supabase:**

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Should see 5 tables:
   - users
   - accs
   - memberships
   - invitations
   - status_history

---

### Step 6: Start API Server

```bash
# Terminal 1
cd Manager_Account_Lienquan/apps/api
npm run dev
```

**Expected:**

```
🚀 Server is running!
📍 Port: 3000
🌍 Environment: development
🔗 API: http://localhost:3000
🏥 Health: http://localhost:3000/health
```

---

### Step 7: Start Frontend

**Open new terminal** (keep API running)

```bash
# Terminal 2
cd Manager_Account_Lienquan/apps/web
npm run dev
```

**Expected:**

```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## ✅ Verification Tests

### Test 1: API Health Check

**Open browser:**

```
http://localhost:3000/health
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-07-08T...",
  "database": "connected"
}
```

✅ **Pass if:** `"database": "connected"`

---

### Test 2: API Info Endpoint

**Open browser:**

```
http://localhost:3000/api/v1
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Manager Account Liên Quân API v1",
  "version": "1.0.0"
}
```

✅ **Pass if:** Returns 200 OK with version info

---

### Test 3: Frontend Loads

**Open browser:**

```
http://localhost:5173
```

**Expected:**

- Page loads (no errors)
- Redirects to `/login` (Task 1 will implement)
- No console errors in DevTools

✅ **Pass if:** Page loads without crashes

---

### Test 4: Database Tables

**Supabase Dashboard:**

1. Go to Table Editor
2. Click each table
3. Verify columns

**users table should have:**

- id (uuid)
- email (text, unique)
- password_hash (text)
- display_name (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**accs table should have:**

- id (uuid)
- name (text)
- owner_user_id (uuid, FK to users)
- status (enum: AVAILABLE, IN_USE, PENDING_LOGOUT)
- note (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

✅ **Pass if:** All 5 tables exist with correct columns

---

### Test 5: Prisma Studio (Optional)

```bash
# In API folder
cd apps/api
npm run prisma:studio
```

**Expected:**

- Opens http://localhost:5555
- Shows 5 tables
- Can browse empty tables

✅ **Pass if:** Studio opens and displays tables

---

## 📊 Verification Checklist

After all tests:

- [ ] Supabase project created
- [ ] 5 tables created in database
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Prisma Client generated
- [ ] API server running (port 3000)
- [ ] Frontend running (port 5173)
- [ ] Health check returns "connected"
- [ ] No errors in console
- [ ] All tables have correct schema

---

## 🐛 Troubleshooting

### "Can't reach database server"

**Solutions:**

1. Check DATABASE_URL in .env
2. Verify password is correct
3. Check Supabase project is active
4. Wait 2-3 minutes if just created project
5. Try `npm run prisma:generate` again

---

### "Port 3000 already in use"

**Solution 1:** Kill process

```bash
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

**Solution 2:** Change port in .env

```env
PORT=3001
```

---

### "Prisma Client not found"

**Solution:**

```bash
cd apps/api
npm run prisma:generate
```

---

### Frontend CORS error

**Check:**

1. API server is running
2. FRONTEND_URL in .env = `http://localhost:5173`
3. Restart API server

---

### Tables not showing in Supabase

**Solutions:**

1. Run `npm run prisma:push` again
2. Refresh Supabase Dashboard
3. Check Console for errors
4. Verify DATABASE_URL is correct

---

## 📚 Additional Resources

**Setup Guides:**

- [Supabase Setup Guide](../../guides/HUONG_DAN_SUPABASE.md) - Chi tiết setup Supabase
- [Run Application Guide](../../guides/HUONG_DAN_CHAY.md) - Hướng dẫn chạy ứng dụng
- [Setup Success](../../guides/SETUP_SUCCESS.md) - Xác nhận setup thành công

**Architecture:**

- [Architecture Decision](./COMPLETED.md) - Chi tiết kiến trúc
- [Requirements FRS](../../workflow/01_Requirements_FRS.md) - Requirements

---

## 🎊 Success Criteria

Setup thành công khi:

- ✅ API health check returns "database": "connected"
- ✅ Frontend loads without errors
- ✅ 5 tables exist in Supabase
- ✅ Both servers running simultaneously
- ✅ No errors in terminal or browser console

**→ Ready for Task 1: Authentication!** 🚀

---

**Created:** 2026-07-08  
**Last Updated:** 2026-07-08  
**Estimated Time:** 15-20 minutes
