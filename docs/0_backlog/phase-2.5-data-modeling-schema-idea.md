### Phase 2.5 – Data Modeling & Schema

1. **Define Prisma schema** (`prisma/schema.prisma`):

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  image     String?
  runs      Run[]    @relation("OrganizedRuns")
  rsvps     RSVP[]
}

model Run {
  id          String   @id @default(cuid())
  number      Int      @unique
  descriptor  String
  dateTime    DateTime
  address     String
  lat         Float?
  lng         Float?
  introLink   String?
  organizer   User     @relation("OrganizedRuns", fields: [organizerId], references: [id])
  organizerId String
  rsvps       RSVP[]
  photos      Photo[]
}

model RSVP {
  id       String   @id @default(cuid())
  run      Run      @relation(fields: [runId], references: [id])
  runId    String
  user     User     @relation(fields: [userId], references: [id])
  userId   String
  status   RSVPStatus
  taggedAt DateTime?
}

enum RSVPStatus { YES NO MAYBE }

model Photo {
  id        String   @id @default(cuid())
  url       String
  run       Run      @relation(fields: [runId], references: [id])
  runId     String
  uploadedBy User    @relation(fields: [uploaderId], references: [id])
  uploaderId String
  caption   String?
  createdAt DateTime @default(now())
}
```

2. **Run migration**

   - `pnpm prisma migrate dev --name init`

3. **Generate Prisma client**

   - `pnpm prisma generate`
