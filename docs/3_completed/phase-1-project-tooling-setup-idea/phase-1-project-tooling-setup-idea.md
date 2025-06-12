### Phase 1 – Project & Tooling Setup

1. **Bootstrap Next.js project**

   - `pnpm dlx create-next-app@latest web-app --ts`
   - Pin Next.js to v15.3.2: `pnpm add next@15.3.2 react react-dom`

2. **Install & configure Tailwind v4**

   - `pnpm add tailwindcss@^4.0 postcss autoprefixer`
   - `pnpm dlx tailwindcss init -p`
   - Update `tailwind.config.js` content paths (`app/`, `pages/`, `components/`) and enable JIT.

3. **Add shadcn/ui**

   - `pnpm dlx shadcnui@latest init` → select Buttons, Forms, Cards, Modals, Gallery, etc.
   - Audit `components/ui/` and tweak theme tokens (colors, spacing).

4. **Set up Prisma & PostgreSQL**

   - `pnpm add @prisma/client`
   - `pnpm add -D prisma`
   - `pnpm prisma init`
   - Configure `DATABASE_URL` in `.env`
