## Phase 8: Photo Upload & Display (Basic)

### Objective

Allow users to upload photos for an event and display them in a gallery. (Simplified: direct URL storage, S3 integration later if needed).

### PRD Alignment

- Section 5.3: `PhotosController`
- Section 6.8: `PhotoUploader.tsx` & `PhotoGallery.tsx` (basic versions)

### User Stories Covered

- User Story 17: View Recent Photos on Feed (placeholder, actual recent photos later)
- User Story 18: View Photo Gallery for a Specific Run
- User Story 19: Upload Photo to a Run (Authenticated User) (simplified upload)

### Key Tasks

1.  **`PhotosController` Implementation:**
    - Implement `create` action: Authenticate, find event, create photo record with `image_url` from params, associate with `current_user` and `event`. Return JSON (`prd.md#5.3`).
    - Implement `destroy` action: Authorize, find photo, destroy.
    - Refine `PhotoPolicy` (uploader or event creator can delete).
    - Add `set_event` before_action.
2.  **`PhotoUploader.tsx` (Basic):**
    - Create `app/frontend/Components/PhotoUploader.tsx`.
    - Simple form with a text input for `image_url` and `alt_text`.
    - On submit, `POST` to `/events/:eventId/photos`.
    - **Note:** PRD describes S3 signed URLs. For MVP Phase 1, simplify to direct URL input. S3 can be an enhancement.
3.  **`PhotoGallery.tsx`:**
    - Create `app/frontend/Components/PhotoGallery.tsx`.
    - Props: `photos` array.
    - Renders a grid of images using `<img>` tags with `photo.image_url`.
4.  **Integrate Photo Components:**
    - In `EventsController#show`, include photo details in event JSON: `include: { photos: { include: :user } }`.
    - In `Events/Show.tsx`, add `<PhotoUploader eventId={event.id} />` and `<PhotoGallery photos={event.photos} />`.

### Testing

- **User-Verifiable:**
  - **US18 & US19 (Simplified):** On an event show page, use the `PhotoUploader` to submit an image URL.
  - Verify photo appears in the `PhotoGallery`.
  - Verify photo record in DB associated with correct event and user.
  - Delete an uploaded photo (if authorized).
- **Controller Specs (RSpec):**
  - `PhotosController`: Test `create`/`destroy`, authorization, photo record changes.
- **System Specs (Capybara):**
  - `spec/system/photos_spec.rb`: User uploads a photo URL to an event, sees it in gallery. Deletes photo.

### Deliverables

- Basic photo upload (via URL input) and display functionality.
- `PhotoUploader.tsx` and `PhotoGallery.tsx` components.
