### Phase 10 – Deployment & Monitoring

1. **Deploy to Vercel**

   - Set environment variables: DB URL, NextAuth secrets, Google/Mapbox keys, Cloudinary/S3 creds.

2. **CI workflow**

   - GitHub Actions: `pnpm test` + `pnpm run lint` → deploy on merge to `main`.

3. **Analytics & Feedback**

   - Track "What's Hashing?" clicks, RSVP vs attendance rates, photo uploads.
   - In-app feedback form for continuous improvement.
