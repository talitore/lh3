### Phase 2 – Data Modeling & Schema

1. **Define Prisma schema** (`prisma/schema.prisma`):

   - Models: User, Run, RSVP (with status & taggedAt), Photo
   - Enums: RSVPStatus { YES, NO, MAYBE }

2. **Run migration**

   - `pnpm prisma migrate dev --name init`

3. **Generate Prisma client**

   - `pnpm prisma generate`
