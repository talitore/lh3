# API Endpoints Specification

## Feature Overview

This document outlines the specification for the API endpoints related to managing "Runs," user RSVPs/attendance, and photo uploads. The goal is to provide a clear, consistent, and robust interface for these functionalities.

## Core Functionality

The API will provide the following core capabilities:

1.  **Run Management:** Create, retrieve, update, and list runs. This includes associated data like descriptors, timing, location, and introductory links.
2.  **RSVP and Attendance Tracking:** Allow users to RSVP for runs. Allow authorized users to mark specified users as attended.
3.  **Photo Management:** Enable uploading photos associated with specific runs, including captions.

## Technical Scope

- **Protocol:** HTTP/S
- **Data Format:** JSON for request and response bodies.
- **Authentication:** To be determined (e.g., JWT, OAuth2). This is a critical open question from the README.
- **Error Handling:** Standard HTTP status codes will be used, with consistent JSON error response bodies detailing the error.

## API Design Considerations & Options

While traditional "UI treatments" don't directly apply to an API, we can consider different structural and interaction patterns for the API itself. The initial proposal (`phase-4-api-endpoints-idea.md`) provides a good RESTful starting point. Here are some considerations and alternative perspectives:

### 1. Endpoint Structure (Proposed vs. Alternative)

- **Proposed (Resource-Oriented REST):**
  - `POST   /api/runs`
  - `GET    /api/runs`
  - `GET    /api/runs/[id]`
  - `PUT    /api/runs/[id]`
  - `PUT    /api/runs/[id]/rsvp` (Toggles RSVP)
  - `POST   /api/runs/[id]/attendance` (Marks a specified user as attended. Request: `{ "userId": "..." }`)
  - `POST   /api/runs/[id]/photos`
- **Alternative (More Granular Actions for RSVP/Attendance):**
  - Instead of a single `PUT` to toggle RSVP, consider separate endpoints or methods if the logic is complex or if we want to track the history of RSVPs more explicitly (e.g., `POST /api/runs/[id]/rsvp` to RSVP, `DELETE /api/runs/[id]/rsvp` to un-RSVP).
  - **Trade-offs:**
    - **Proposed:** Simpler for basic toggling. Fewer endpoints.
    - **Alternative:** More explicit, potentially better for auditing or more complex state changes. More endpoints to manage.

### 2. Photo Upload Mechanism

- **Option A: Direct Upload with Multipart/Form-Data**
  - `POST /api/runs/[id]/photos` accepts the file directly.
  - **Pros:** Simpler for clients, common pattern.
  - **Cons:** Server handles raw file stream, potentially higher load on API servers, might require larger request size limits.
- **Option B: Signed URL for Client-Side Upload to Storage**
  - `POST /api/generate-signed-url/runs/[id]/photos` (or similar) returns a pre-signed URL (e.g., for S3, Azure Blob Storage).
  - Client uploads the file directly to the storage provider using the signed URL.
  - An optional subsequent call to the API to confirm upload and associate metadata (e.g., `POST /api/runs/[id]/photos/complete` with caption and file key).
  - **Pros:** Offloads bandwidth and processing from API servers, often more scalable, better security posture for direct storage access.
  - **Cons:** More complex client-side logic, requires integration with a cloud storage service.

### 3. Data Retrieval and Filtering for `/api/runs`

- **Option A: Basic List**
  - `GET /api/runs` returns all runs with basic info and RSVP counts.
- **Option B: Enhanced Filtering and Pagination**
  - `GET /api/runs?status=upcoming&sort=dateTime&page=1&limit=20`
  - Allow query parameters for filtering (e.g., by date range, status), sorting, and pagination.
  - **Pros:** More flexible for clients, reduces data transfer if clients only need subsets of data, essential for large datasets.
  - **Cons:** More complex implementation on the backend.

## Decision Points

- **Authentication/Authorization Strategy:** Needs to be defined. (See Open Questions in README.md)
- **RSVP/Attendance Endpoint Granularity:**
  - RSVP: Prefer current proposal (toggle via PUT ` /api/runs/[id]/rsvp`) unless specific auditing or complex state management needs arise.
  - Attendance: Adopt `POST /api/runs/[id]/attendance` where an authorized user can mark a _specific_ user as attended by providing a `userId` in the request body. This aligns with the requirement that a subset of users manages attendance.
- **Photo Upload Mechanism:** **Option B (Signed URLs)** for scalability and offloading server load, despite slight increase in client complexity.
- **Data Retrieval for Run List:** **Option B (Enhanced Filtering and Pagination)** as it's a standard best practice for list endpoints.
- **Detailed Request/Response Schemas:** Need to be defined for each endpoint.

This spec will be updated as decisions are made and further details are fleshed out.
