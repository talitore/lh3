Thought for a few seconds

Below is a sequential, detailed task list you can tick off as you build out HashHub with Next.js 15.3.2+, Tailwind v4 and shadcn/ui:

---

### Phase 1 – Project & Tooling Setup

1. **Bootstrap Next.js project**

   - `npx create-next-app@latest hashhub-web --ts`
   - Pin Next.js to v15.3.2: `npm install next@15.3.2 react react-dom`

2. **Install & configure Tailwind v4**

   - `npm install tailwindcss@^4.0 postcss autoprefixer` + `npx tailwindcss init -p`
   - Update `tailwind.config.js` content paths (`app/`, `pages/`, `components/`) and enable JIT.

3. **Add shadcn/ui**

   - `npm install @shadcn/ui`
   - `npx shadcn-ui init` → select Buttons, Forms, Cards, Modals, Gallery, etc.
   - Audit `components/ui/` and tweak theme tokens (colors, spacing).

4. **Set up Prisma & PostgreSQL**

   - `npm install prisma @prisma/client` + `npx prisma init`
   - Configure `DATABASE_URL` in `.env`

---

### Phase 2 – Data Modeling & Schema

5. **Define Prisma schema** (`prisma/schema.prisma`):

   - Models: User, Run, RSVP (with status & taggedAt), Photo
   - Enums: RSVPStatus { YES, NO, MAYBE }

6. **Run migration**

   - `npx prisma migrate dev --name init`

7. **Generate Prisma client**

   - `npx prisma generate`

---

### Phase 3 – Authentication

8. **Install NextAuth**

   - `npm install next-auth`

9. **Configure providers** (Google/GitHub) in `app/api/auth/[...nextauth].ts`
10. **Protect API routes** via `getServerSession`

---

### Phase 4 – API Endpoints

11. **Runs CRUD**

    - `POST /api/runs` → create run (descriptor, number, dateTime, address, introLink)
    - `GET  /api/runs` → list runs + RSVP counts
    - `GET  /api/runs/[id]` → details + attendees + photos
    - `PUT  /api/runs/[id]` → edit descriptor, address, etc.

12. **RSVP & Attendance**

    - `PUT /api/runs/[id]/rsvp` → toggle RSVP status
    - `PUT /api/runs/[id]/attend` → set `taggedAt` timestamp

13. **Photo uploads**

    - `POST /api/runs/[id]/photos` → accept file (signed URL or direct) + caption

---

### Phase 5 – Geocoding & Maps

14. **Address Autocomplete input**

    - Use shadcn’s Combobox/Input + integrate Google Places Autocomplete on client.

15. **Map picker component**

    - Embed Mapbox/Google Map with draggable pin to fine-tune lat/lng.

16. **Server-side geocoding fallback**

    - If client autocomplete fails, geocode in your API before saving.

---

### Phase 6 – Front-end Pages & Components

17. **Global Layout**

    - `app/layout.tsx`: header (logo, nav), sidebar (Upcoming, Stats, Admin Tools), main.

18. **Run-creation form** (`/runs/new`)

    - Fields: Run #, Descriptor, Date/Time picker, Address + Map, Intro-link URL.

19. **Run details page** (`/runs/[id]`)

    - Show Quick RSVP, Self-check-in CTA (on event day), “What’s Hashing?” info icon.
    - Photo album gallery component.

20. **Feed page** (`/`)

    - Card list: mix of “Next Run” card + community posts.

21. **Admin tools area**

    - Attendance tracking link, Hash Cash management, Manage Achievements

---

### Phase 7 – Styling & Responsiveness

22. **Tailwind utility classes**

    - Build out Card, Badge, Button variants via shadcn tokens.

23. **Mobile-first breakpoints**

    - Ensure form fields, maps, gallery grid collapse gracefully.

24. **Dark mode support** (optional)

---

### Phase 8 – Accessibility & Polish

25. **ARIA attributes**

    - Map pin role, info-icon labels, lightbox controls.

26. **Keyboard navigation**

    - Tab order for forms, modals, RSVP buttons.

27. **Image alt text**

    - On uploads, require or prompt for captions/alt.

---

### Phase 9 – Testing

28. **Unit tests**

    - Jest + React Testing Library for forms, map picker, RSVP toggles.

29. **E2E tests**

    - Cypress/Playwright flows: create run → RSVP → mark attendance → upload photo → view album.

30. **Visual regression**

    - Chromatic or Percy snapshots for core pages.

---

### Phase 10 – Deployment & Monitoring

31. **Deploy to Vercel**

    - Set environment variables: DB URL, NextAuth secrets, Google/Mapbox keys, Cloudinary/S3 creds.

32. **CI workflow**

    - GitHub Actions: `npm test` + `npm run lint` → deploy on merge to `main`.

33. **Analytics & Feedback**

    - Track “What’s Hashing?” clicks, RSVP vs attendance rates, photo uploads.
    - In-app feedback form for continuous improvement.

---

### Phase 11 – Iterate & Expand

34. **Review metrics weekly** → adjust UI/UX.
35. **Plan v2 features**: live GPS tracking, badges, in-app chat, run history.
36. **Optimize costs**: image resizing, lazy loading, user quotas.

---

Feel free to tick off each item in order and adjust as you uncover new requirements!
