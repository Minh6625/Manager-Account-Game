# Task 2 - Implementation Notes

## Quick Reference

### API Endpoints

```
GET  /api/v1/accs?filter=all|owned|joined&search=query
POST /api/v1/accs
```

### Files Created

**Backend (5)**:

- `apps/api/src/modules/accs/acc.routes.ts`
- `apps/api/src/modules/accs/acc.controller.ts`
- `apps/api/src/modules/accs/acc.service.ts`
- `apps/api/src/modules/accs/acc.repository.ts`
- `apps/api/src/modules/accs/acc.schemas.ts`

**Frontend (1)**:

- `apps/web/src/pages/AccountListPage.tsx`

**Type Definitions (1)**:

- `apps/api/src/shared/types/express.d.ts`

### Key Implementation Details

**Filter Logic (Backend)**:

```typescript
// All: Get all accounts where user is owner OR member
const allAccounts = await repository.getAccountsByUserId(userId);

// Owned: Filter where ownerUserId === userId
filteredAccounts = allAccounts.filter((acc) => acc.ownerUserId === userId);

// Joined: Filter where ownerUserId !== userId
filteredAccounts = allAccounts.filter((acc) => acc.ownerUserId !== userId);
```

**Create Account Logic**:

```typescript
// Creates both Acc and Membership in single transaction
await prisma.acc.create({
  data: {
    name,
    note,
    ownerUserId,
    memberships: {
      create: { userId, role: "OWNER", memberStatus: "IDLE" },
    },
  },
});
```

**Frontend State Management**:

```typescript
// Real-time filtering with useEffect
useEffect(() => {
  if (user) loadAccounts();
}, [user, activeTab, searchQuery]);
```

### Status Badge Mapping

| Database Status | Badge Color | Badge Text | Extra Display |
| --------------- | ----------- | ---------- | ------------- |
| AVAILABLE       | Green       | Rảnh       | -             |
| IN_USE          | Blue        | Đang chơi  | + Player name |
| PENDING_LOGOUT  | Yellow      | Chờ logout | -             |

### Responsive Breakpoints

- **Mobile**: < 640px - Stacked layout, horizontal scroll tabs
- **Desktop**: >= 640px - Flex layout, fixed tabs

### Authentication Flow

1. Check `/api/v1/auth/me` with credentials
2. If 401, redirect to `/login`
3. If 200, store user and load accounts
4. All account requests include credentials (cookies)

### Database Query Optimization

Single query includes:

- Account info
- Owner details (id, email, displayName)
- Current player (if status = PLAYING)
- Member count (active only, leftAt = null)

---

## Changelog

| Date       | Author   | Changes                      |
| ---------- | -------- | ---------------------------- |
| 2026-07-10 | AI Agent | Created implementation notes |
