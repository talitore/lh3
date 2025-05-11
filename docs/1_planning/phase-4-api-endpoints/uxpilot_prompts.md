# API Interaction Prompts (for Testing/Documentation)

This document provides example "prompts" or requests for interacting with the key API endpoints. These can be adapted for use in API testing tools (like Postman, Insomnia) or as `curl` command examples.

**Assumptions:**

- Base URL: `http://localhost:3000` (replace with actual deployment URL)
- Authentication: Assumes a Bearer token `YOUR_AUTH_TOKEN` is required for relevant endpoints.
- `runId` will be a placeholder like `123` or `existing_run_id`.

---

## 1. Runs CRUD

### 1.1. Create Run

- **Endpoint:** `POST /api/runs`
- **Description:** Creates a new run.
- **Tool Prompt (e.g., Postman Body - JSON):**
  ```json
  {
    "descriptor": "Evening City Jog - Central Park Loop",
    "number": 105,
    "dateTime": "2024-09-15T18:30:00Z",
    "address": "Central Park West & 72nd St, New York, NY",
    "introLink": "http://example.com/run105-details"
  }
  ```
- **Curl Prompt:**
  ```bash
  curl -X POST http://localhost:3000/api/runs \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
    -d '{
      "descriptor": "Evening City Jog - Central Park Loop",
      "number": 105,
      "dateTime": "2024-09-15T18:30:00Z",
      "address": "Central Park West & 72nd St, New York, NY",
      "introLink": "http://example.com/run105-details"
    }'
  ```

### 1.2. List Runs

- **Endpoint:** `GET /api/runs`
- **Description:** Lists all runs, potentially with RSVP counts. Includes pagination and filtering.
- **Tool Prompt (e.g., Postman URL):**
  `/api/runs?page=1&limit=10&status=upcoming`
- **Curl Prompt:**
  ```bash
  curl -X GET http://localhost:3000/api/runs?page=1&limit=10&status=upcoming \
    -H "Authorization: Bearer YOUR_AUTH_TOKEN"
  ```

### 1.3. Get Run Details

- **Endpoint:** `GET /api/runs/[id]`
- **Description:** Retrieves details for a specific run, including attendees and photos.
- \*\*Tool Prompt (e.g., Postman URL, replace `123` with actual ID):
  `/api/runs/123`
- **Curl Prompt:**
  ```bash
  curl -X GET http://localhost:3000/api/runs/123 \
    -H "Authorization: Bearer YOUR_AUTH_TOKEN"
  ```

### 1.4. Update Run

- **Endpoint:** `PUT /api/runs/[id]`
- **Description:** Edits descriptor, address, etc., for an existing run.
- \*\*Tool Prompt (e.g., Postman Body - JSON, replace `123` with actual ID):
  ```json
  {
    "descriptor": "UPDATED: Evening City Jog - Central Park Loop",
    "address": "Columbus Circle, New York, NY"
  }
  ```
- **Curl Prompt:**
  ```bash
  curl -X PUT http://localhost:3000/api/runs/123 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
    -d '{
      "descriptor": "UPDATED: Evening City Jog - Central Park Loop",
      "address": "Columbus Circle, New York, NY"
    }'
  ```

---

## 2. RSVP & Attendance

### 2.1. Toggle RSVP Status

- **Endpoint:** `PUT /api/runs/[id]/rsvp`
- **Description:** Toggles the authenticated user's RSVP status for the run.
- \*\*Tool Prompt (e.g., Postman Body - JSON, can be empty or include a desired state if API supports it e.g. `{"rsvp": true}` ):
  ```json
  {}
  ```
- **Curl Prompt:**
  ```bash
  curl -X PUT http://localhost:3000/api/runs/123/rsvp \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
    -d '{}' # Or potentially '{"rsvp": true}'
  ```

### 2.2. Mark User as Attended (by Organizer)

- **Endpoint:** `POST /api/runs/[id]/attendance`
- **Description:** Marks a specified user as having attended the run. Requires authorization (e.g., only run organizers).
- \*\*Tool Prompt (e.g., Postman Body - JSON):
  ```json
  {
    "userId": "user_abc_123"
  }
  ```
- **Curl Prompt:**
  ```bash
  curl -X POST http://localhost:3000/api/runs/123/attendance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ORGANIZER_AUTH_TOKEN" \
    -d '{
      "userId": "user_abc_123"
    }'
  ```

---

## 3. Photo Uploads

### 3.1. Upload Photo (Direct or via Signed URL workflow)

- **Endpoint (if direct):** `POST /api/runs/[id]/photos`
- **Description:** Accepts a file (e.g., multipart/form-data) + caption.
- **If using Signed URLs (as recommended in `spec.md` and `design.md`), the flow is multi-step:**

  **Step 3.1.a: Generate Signed URL**

  - **Endpoint:** `POST /api/runs/[id]/photos/generate-signed-url`
  - \*\*Tool Prompt (e.g., Postman Body - JSON):
    ```json
    {
      "filename": "run_photo_001.jpg",
      "contentType": "image/jpeg"
    }
    ```
  - **Curl Prompt:**
    ```bash
    curl -X POST http://localhost:3000/api/runs/123/photos/generate-signed-url \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
      -d '{
        "filename": "run_photo_001.jpg",
        "contentType": "image/jpeg"
      }'
    ```
    _(This would return a `signedUrl` and potentially a `photoId`)_

  **Step 3.1.b: Upload file to Signed URL (Client-side operation)**

  - **Endpoint:** The `signedUrl` returned from the previous step.
  - **Method:** `PUT`
  - **Body:** Raw image file data.
  - **Headers:** `Content-Type: image/jpeg` (or as specified)
  - **Curl Prompt (Example - `SIGNED_URL_FROM_API` and `path/to/your/image.jpg` are placeholders):**
    ```bash
    curl -X PUT "SIGNED_URL_FROM_API" \
      -H "Content-Type: image/jpeg" \
      --data-binary "@path/to/your/image.jpg"
    ```

  **Step 3.1.c: Confirm Upload & Add Caption**

  - **Endpoint:** `POST /api/runs/[id]/photos/confirm-upload`
  - \*\*Tool Prompt (e.g., Postman Body - JSON, use `photoId` if provided by generate-signed-url or the key/filename used for storage):
    ```json
    {
      "photoId": "run_photo_001.jpg", # Or ID from step 3.1.a
      "caption": "Beautiful sunset during the run!"
    }
    ```
  - **Curl Prompt:**
    ```bash
    curl -X POST http://localhost:3000/api/runs/123/photos/confirm-upload \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
      -d '{
        "photoId": "run_photo_001.jpg",
        "caption": "Beautiful sunset during the run!"
      }'
    ```

These prompts should serve as a good starting point for developers integrating with or testing the API.
