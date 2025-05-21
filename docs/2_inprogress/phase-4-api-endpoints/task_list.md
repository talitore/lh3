# Phase 4 API Endpoints - Implementation Task List

This checklist outlines the main tasks required to build the API endpoints for managing Runs, RSVPs, attendance, and photo uploads.

## I. Core Infrastructure & Setup

- [x] **Define Authentication & Authorization Strategy:**
  - [x] Confirm integration with existing authentication (as per Phase 3).
  - [x] Design and implement role-based authorization for sensitive operations (e.g., marking attendance, editing runs).
- [x] **Database Schema Design & Migration:**
  - [x] Define schema for `Runs` table (descriptor, number, dateTime, address, introLink, etc.).
  - [x] Define schema for `RSVPs` table (linking users to runs, status).
  - [x] Define schema for `Attendance` table (linking users to runs, marking attendance).
  - [x] Define schema for `Photos` table (linking photos to runs, caption, storageKey/URL).
  - [x] Create and apply database migrations.
- [x] **Project Setup & Dependencies:**
  - [x] Set up new modules/services for API logic if necessary.
  - [x] Add any new dependencies (e.g., AWS SDK for S3 signed URLs).

## II. API Endpoint Implementation

- [x] **Runs CRUD Operations:**

  - [x] `POST /api/runs`: Create a new run.
    - [x] Implement request validation.
    - [x] Implement service logic to save run.
  - [x] `GET /api/runs`: List runs.
    - [x] Implement pagination.
    - [x] Implement filtering (e.g., by status, date range).
    - [x] Implement sorting (e.g., by dateTime).
    - [x] Include RSVP counts in the response.
  - [x] `GET /api/runs/[id]`: Get run details.
    - [x] Include associated attendees (from Attendance).
    - [x] Include associated photos (metadata).
  - [x] `PUT /api/runs/[id]`: Update an existing run.
    - [x] Implement request validation.
    - [x] Implement service logic to update run.

- [x] **RSVP Management:**

  - [x] `PUT /api/runs/[id]/rsvp`: Toggle user's RSVP status for a run.
    - [x] Implement logic to create/update/delete RSVP record.
    - [x] Ensure user is authenticated.

- [x] **Attendance Management:**

  - [x] `POST /api/runs/[id]/attendance`: Mark a specified user as attended.
    - [x] Request body: `{ "userId": "..." }`.
    - [x] Ensure requester is authorized (e.g., organizer role).
    - [x] Implement logic to record attendance.

- [x] **Photo Uploads (Signed URL Approach):**
  - [x] `POST /api/runs/[id]/photos/generate-signed-url`: Generate a pre-signed URL for photo upload.
    - [x] Request body could include filename, contentType.
    - [x] Implement logic to generate S3 (or other provider) signed URL.
    - [x] Potentially create a preliminary photo record in DB with a temporary ID.
  - [x] `POST /api/runs/[id]/photos/confirm-upload`: Confirm photo upload and save metadata.
    - [x] Request body could include `photoId` (from generate step, or the key from storage), `caption`.
    - [x] Implement logic to update photo record in DB with caption and mark as confirmed.

## III. Supporting Implementation

- [x] **Error Handling:**
  - [x] Implement consistent error response formats across all endpoints.
  - [x] Use appropriate HTTP status codes.
- [x] **Input Validation:**
  - [x] Implement robust validation for all request payloads and parameters.
- [x] **API Documentation:**
  - [x] Generate/update OpenAPI (Swagger) specification.

## IV. Testing

- [x] **Unit Tests:**
  - [x] Write unit tests for all new services and complex logic (e.g., RSVP toggling, attendance marking, signed URL generation).
- [x] **Integration Tests:**
  - [x] Write integration tests for each API endpoint, covering success and error cases.
  - [x] Test authentication and authorization rules.

## V. Deployment & Finalization

- [x] **Configuration:** Set up environment variables for S3 buckets, etc.
- [ ] **Deployment:** Deploy API changes to relevant environments. (Manual Task)
- [ ] **Review & QA:** Conduct final review and quality assurance. (Manual Task)
