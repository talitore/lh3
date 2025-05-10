### Goal

The goal of this feature is to define the data models and schema for the application using Prisma.

### Key Requirements

- Define `User`, `Run`, `RSVP`, and `Photo` models.
- Establish relationships between models (e.g., a `User` can organize multiple `Run`s, a `Run` can have multiple `RSVP`s).
- Specify field types and constraints (e.g., unique, optional, default values).
- Include an `RSVPStatus` enum (`YES`, `NO`, `MAYBE`).
- Set up mechanisms for database migration and Prisma client generation.

### Target Audience

- Developers working on the application backend.

### Open Questions

- Are there any other entities or relationships that need to be modeled at this stage? No others.
- Should `Run.lat` and `Run.lng` be mandatory fields? no, optional
- What is the intended use of `RSVP.taggedAt`? Typo, not needed if we have createdAt/updatedAt timestamps. So, if we don't have those, then include them and make them mandatory going forward.
- Are there specific database indexing strategies to consider for performance early on? Only for obvious N+1s.
