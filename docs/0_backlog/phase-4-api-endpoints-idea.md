### Phase 4 – API Endpoints

1. **Runs CRUD**

   - `POST /api/runs` → create run (descriptor, number, dateTime, address, introLink)
   - `GET  /api/runs` → list runs + RSVP counts
   - `GET  /api/runs/[id]` → details + attendees + photos
   - `PUT  /api/runs/[id]` → edit descriptor, address, etc.

2. **RSVP & Attendance**

   - `PUT /api/runs/[id]/rsvp` → toggle RSVP status
   - `PUT /api/runs/[id]/attend` → set `taggedAt` timestamp

3. **Photo uploads**

   - `POST /api/runs/[id]/photos` → accept file (signed URL or direct) + caption
