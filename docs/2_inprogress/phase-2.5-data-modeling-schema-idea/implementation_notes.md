# Implementation Notes: Phase 2.5 - Data Modeling & Schema

## Key Decisions & Observations:

1.  **Timestamp Fields:**

    - Added `createdAt` (with `@default(now())`) and `updatedAt` (with `@updatedAt`) to all models (`User`, `Run`, `RSVP`, `Photo`) for consistent record tracking.
    - The `RSVP.taggedAt` field mentioned in `README.md`'s open questions was deemed a typo/redundant and replaced by these standard timestamps.

2.  **User-Photo Relation:**

    - Ensured the relation from `User` to `Photo` was explicitly named `UploadedPhotos` in `schema.prisma` for clarity:

      ```prisma
      // In User model
      photos    Photo[]  @relation("UploadedPhotos")

      // In Photo model
      uploadedBy User     @relation("UploadedPhotos", fields: [uploaderId], references: [id])
      ```

3.  **Prisma Enum Formatting Issue & Resolution:**

    - Encountered a Prisma validation error (`Error validating: This line is not an enum value definition.` and `An enum must have at least one value.`) during the `prisma migrate dev` step, even though the `enum RSVPStatus { YES NO MAYBE }` syntax appeared correct.
    - **Troubleshooting Steps:**
      - Initial attempts to add newlines around the enum did not resolve the issue directly.
      - Running `pnpm prisma format` initially failed, highlighting the enum as the problematic area.
    - **Resolution:** The issue was resolved by changing the `enum RSVPStatus` definition from a single line to a multi-line format:

      ```prisma
      // From:
      // enum RSVPStatus { YES NO MAYBE }

      // To:
      enum RSVPStatus {
        YES
        NO
        MAYBE
      }
      ```

      After this change, `pnpm prisma format` succeeded, and `pnpm prisma migrate dev --name init_data_models` also ran successfully, applying migrations and generating the Prisma client.

    - **Hypothesis:** The single-line enum format, while valid, might have been interacting poorly with the Prisma parser or formatter in this specific context, possibly due to non-visible characters or an environment-specific parsing quirk. The multi-line format is more robust in such cases.

## Challenges Encountered:

- The primary challenge was the Prisma schema validation error related to the `RSVPStatus` enum, which required several attempts to diagnose and fix.

## Next Steps:

- With the database schema defined, migrated, and the Prisma client generated, the backend can now be developed to utilize these models for CRUD operations and business logic.
