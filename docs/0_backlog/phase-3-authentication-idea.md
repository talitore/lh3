### Phase 3 – Authentication

1. **Install NextAuth**

   - `pnpm add next-auth`

2. **Configure providers** (Google/GitHub) in `app/api/auth/[...nextauth].ts`
3. **Protect API routes** via `getServerSession`
