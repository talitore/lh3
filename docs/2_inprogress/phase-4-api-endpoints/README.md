# Phase 4 API Endpoints Feature

## Goal

The primary goal of this feature is to define and implement a set of API endpoints to manage "Runs", handle user RSVPs and attendance, and allow for photo uploads related to these runs.

## Key Requirements

Based on the initial idea, the key requirements are:

1.  **Runs CRUD Operations:**
    - Create a new run (including descriptor, number, dateTime, address, introLink).
    - List all existing runs, including their RSVP counts.
    - Retrieve detailed information for a specific run (including attendees and photos).
    - Update details of an existing run (descriptor, address, etc.).
2.  **RSVP & Attendance Management:**
    - Allow users to toggle their RSVP status for a run.
    - Allow authorized users (e.g., organizers) to mark a specified user as having attended a run.
3.  **Photo Uploads:**
    - Enable users to upload photos for a specific run, including a caption. This might involve signed URLs or direct file handling.

## Target Audience

- **Developers:** Software developers who will be building and integrating with these API endpoints.
- **Application Users (indirectly):** End-users of the application that will consume these APIs to interact with run data, RSVPs, and photos.

## Open Questions

- What are the specific authentication and authorization mechanisms required for each endpoint or group of endpoints? Authentication should already be determined (See [Phase 3 - Authentication](../../3_completed/phase-3-authentication/) and [Architecture](../../_reference/architecture.md)). Authorization is not yet defined but I like roles set by an admin.
- What are the detailed request and response payload structures (e.g., JSON schemas)? JSON schemas are not yet defined.
- Are there any versioning strategies to be considered for these APIs from the outset? Pick a simple appropriate scheme.
- What are the expected performance and scalability requirements (e.g., concurrent users, data volume)? Best practices for the tech stack should be followed, I'll scale later.
- How will error handling and status codes be consistently implemented across the API? Use the latest conventions from the tech stack.
- Are there any rate-limiting policies to be defined? No, not yet.
- What are the specific requirements for photo storage and retrieval (e.g., resolution, formats, CDN usage)? We'll use AWS S3 for photos.
