**General & Navigation:**

- **User Story 1: Navigate to Create New Run Page**
  - **Given** a user is on the main feed/homepage (`/`)
  - **When** the user clicks the "New Run" button (styled with a Plus icon)
  - **Then** the user should be navigated to the `/runs/new` page to create a new run.
- **User Story 2: Navigate to All Runs Page from Feed**
  - **Given** a user is on the main feed/homepage (`/`)
  - **When** the user clicks the "View All Runs" button at the bottom of the recent activity section
  - **Then** the user should be navigated to the `/runs` page, which presumably lists all runs.
- **User Story 3: Navigate to All Photos Page from Feed**
  - **Given** a user is on the main feed/homepage (`/`) and viewing the "Recent Photos" section
  - **When** the user clicks the "View All Photos" button
  - **Then** the user should be navigated to the `/photos` page (actual route to be confirmed, but intent is clear).
- **User Story 4: Navigate Back from Run Details Page**
  - **Given** a user is on a specific run's detail page (e.g., `/runs/[id]`)
  - **When** the user clicks the "Back to Runs" button (styled with an ArrowLeft icon)
  - **Then** the user should be navigated to the previous page they were on (likely the main feed or an all runs list).
- **User Story 5: Cancel Creating a New Run**
  - **Given** a user is on the "Create New Run" page (`/runs/new`)
  - **When** the user clicks the "Cancel" button
  - **Then** the user should be navigated back to the previous page without any run being created.

**Run Discovery & Viewing (Homepage/Feed & Run Lists):**

- **User Story 6: View Featured Next Upcoming Run on Feed**
  - **Given** a user is on the main feed/homepage (`/`)
  - **When** the page loads and there are upcoming runs
  - **Then** the user should see the single "Next Run" prominently displayed in a `RunCard` (featured variant), showing its details (number, descriptor, date/time, address) and RSVP options if the user is logged in.
- **User Story 7: View List of Recent Runs on Feed**
  - **Given** a user is on the main feed/homepage (`/`)
  - **When** the page loads
  - **Then** the user should see a list of recently occurred/past runs, initially loading a set number (e.g., 5 runs). Each run is displayed in a `RunCard`.
- **User Story 8: Filter Recent Runs on Feed**
  - **Given** a user is viewing the "Recent Activity" section on the main feed/homepage (`/`)
  - **When** the user types a query into the "Search runs..." input field
  - **Then** the list of displayed recent runs should dynamically filter to show only runs where the descriptor, number, address, or organizer name (case-insensitive) contains the search query.
  - **When** the user selects a status from the status filter dropdown ("All Runs", "Upcoming", "Completed")
  - **Then** the list of displayed recent runs should filter to show only runs matching that status (upcoming or completed based on `run.dateTime` compared to current time).
- **User Story 9: Sort Recent Runs on Feed**
  - **Given** a user is viewing the "Recent Activity" section on the main feed/homepage (`/`)
  - **When** the user selects a sort criteria from the "Sort by" dropdown ("Date", "Run #", "Name")
  - **Then** the list of displayed recent runs should re-fetch and re-order based on the selected criteria (`dateTime`, `number`, `descriptor`).
  - **When** the user selects a sort order from the "Order" dropdown ("Newest", "Oldest")
  - **Then** the list of displayed recent runs should re-fetch and re-order in the selected direction (`desc` for Newest, `asc` for Oldest).
- **User Story 10: Load More Recent Runs on Feed**
  - **Given** a user is viewing the "Recent Activity" section on the main feed/homepage (`/`) and there are more past runs available than initially loaded
  - **When** the user clicks the "Load More Runs" button
  - **Then** an additional set of recent runs (e.g., 5 more) should be fetched (respecting current sort/filter) and appended to the existing list, and the current page counter should increment. The button is disabled while loading.
- **User Story 11: View Detailed Run Information Page**
  - **Given** a user clicks on a run from any list (e.g., feed, all runs page)
  - **When** the user navigates to a specific run's detail page (`/runs/[id]`)
  - **Then** the user should see comprehensive information about the run, including: Run Number, Descriptor, formatted full Date & Time, Address/Location, Organizer's Name.
  - **And** if an `introLink` is provided for the run, it should be displayed as a clickable link ("View Intro Information →") opening in a new tab.
  - **And** the total count of RSVPs should be displayed near the run title.

**Run Creation & Management:**

- **User Story 12: Create a New Run with Full Details**
  - **Given** an authenticated user is on the "Create New Run" page (`/runs/new`)
  - **When** the user enters a "Run Number" (numeric, required).
  - **And** the user enters a "Description" for the run (text, required).
  - **And** the user selects a "Date & Time" for the run (using datetime-local input, required).
  - **And** the user optionally enters an "Intro Link" (URL).
  - **And** the user provides a location by:
    - Typing an address into the "Address" `AddressAutocomplete` field, which upon selection populates the address string and hidden latitude/longitude.
    - Or, by dragging the marker on the `MapPicker` component, which updates the hidden latitude/longitude.
  - **And** the user clicks the "Create Run" button.
  - **Then** a `POST` request is made to the `/api/runs` endpoint with the form data (number, descriptor, ISO dateTime, address, lat, lng, introLink, and implicitly the logged-in user as organizerId).
  - **And** if successful, the user is redirected to the newly created run's detail page (`/runs/{newRun.id}`).
  - **And** if there's an error (e.g., run number already exists as per `runService` P2002 error for `Run_number_key`), an alert with an error message is shown.
- **User Story 13: Edit an Existing Run (Organizer Only)**
  - **Given** an authenticated user who is the organizer of the run is viewing the run's detail page (`/runs/[id]`)
  - **When** the user clicks the "Edit Run" button
  - **Then** the run's descriptor, date & time, address, and intro link fields should become editable input fields, pre-filled with the current run data.
  - **And** "Save Changes" and "Cancel" buttons should appear.
  - **When** the user modifies the editable fields and clicks "Save Changes"
  - **Then** a `PUT` request is made to `/api/runs/[id]` with the updated data.
  - **And** the run details are updated in the database (via `runService.updateRun`).
  - **And** the page should revert to view mode, displaying the updated information.
  - **When** the user is in edit mode and clicks "Cancel"
  - **Then** any changes made in the input fields are discarded (form resets to original run data), and the page reverts to view mode.

**RSVP & Attendance:**

- **User Story 14: RSVP to a Run (Authenticated User)**
  - **Given** an authenticated user is viewing an upcoming run (either on the feed `RunCard` or the run detail page `/runs/[id]`)
  - **When** the user clicks one of the RSVP buttons ("Yes", "Maybe", "No")
  - **Then** an API call is made to update/create their RSVP status for that run (likely to `/api/runs/[id]/rsvp` which uses `rsvpService.upsertRsvp`).
  - **And** the UI optimistically updates the RSVP counts displayed for the run and reflects the user's selected RSVP status.
- **User Story 15: View RSVP Counts and Attendee List on Run Detail Page**
  - **Given** a user is on a run's detail page (`/runs/[id]`)
  - **When** the page loads with run data (from `runService.getRunById` which includes RSVPs)
  - **Then** the user should see a summary of RSVP counts (e.g., "X Yes, Y Maybe, Z No").
  - **And** the user should see a list of users who have RSVP'd "Yes", grouped under a "Going" heading.
  - **And** the user should see a list of users who have RSVP'd "Maybe", grouped under a "Maybe" heading.
  - **And** the user should see an expandable section for users who have RSVP'd "No", initially collapsed, showing the count.
- **User Story 16: Check-in to a Run on Event Day (Authenticated User)**
  - **Given** an authenticated user is on a run's detail page (`/runs/[id]`)
  - **And** it is the day of the run (`isEventDay()` is true).
  - **And** it is within the allowed check-in window (e.g., 30 minutes before to 2 hours after start time - `isEventTime()` is true).
  - **When** the user clicks the "Check In" button.
  - **Then** a `POST` request is made to `/api/runs/[id]/checkin` (which uses `attendanceService.markAttendance` with the logged-in user's ID).
  - **And** the UI should update to show "You're checked in!" with a success icon.
  - **And** the check-in button becomes unavailable or indicates checked-in status.
  - **Given** check-in is not yet available (e.g., too early)
  - **Then** the button should be disabled and display "Check-In Not Yet Available".

**Photos:**

- **User Story 17: View Recent Photos on Feed**
  - **Given** a user is on the main feed/homepage (`/`)
  - **When** the page loads, and recent photos are fetched (from `/api/photos/recent`)
  - **Then** the user should see a grid (e.g., 6 photos) of recent photos, each showing the image, run number, and uploader name on hover/focus.
- **User Story 18: View Photo Gallery for a Specific Run**
  - **Given** a user is on a run's detail page (`/runs/[id]`)
  - **When** the page loads run data, including associated photos (from `runService.getRunById`)
  - **Then** the user should see a "Photos" section with a gallery (`PhotoGallery` component) displaying all photos uploaded for that run.
- **User Story 19: Upload Photo to a Run (Authenticated User)**
  - **Given** an authenticated user is on a run's detail page (`/runs/[id]`) and the `PhotoGallery` component allows uploads.
  - **When** the user initiates an upload (e.g., selects a file via an upload button within the gallery).
  - **Then** the client requests a signed URL from the backend (e.g., `/api/runs/[id]/photos/generate-signed-url` with filename and content type, which uses `photoService.generateSignedUrlForUpload`).
  - **And** the backend creates a preliminary photo record and returns a signed S3 URL and a `photoId`.
  - **And** the client uses this signed URL to upload the image file directly to S3.
  - **And** upon successful S3 upload, the client notifies the backend to confirm the upload (e.g., `/api/runs/[id]/photos/confirm-upload` with `photoId` and optional caption, which uses `photoService.confirmPhotoUpload`).
  - **And** the backend updates the photo record with the final S3 URL and caption.
  - **And** the newly uploaded photo (with caption) appears in the `PhotoGallery` on the run detail page.

**Community & Information:**

- **User Story 20: View Community Statistics on Feed**
  - **Given** a user is on the main feed/homepage (`/`)
  - **When** the page loads, and community stats are fetched (from `/api/stats/community` or fallback mock data)
  - **Then** the user should see a "Community Stats" card displaying figures for: Average Attendance, Active Members, Runs This Month, Total Members, Hash Cash Pool, and Total Runs.
- **User Story 21: Access "What's Hashing?" Information**
  - **Given** a user is on a run's detail page (`/runs/[id]`)
  - **When** the user views the "New to Hash House Harriers?" section
  - **And** interacts with the `WhatsHashingInfo` component (e.g., clicks a "Learn More" button if it's a modal trigger)
  - **Then** the user should be presented with information about Hash House Harrier traditions, what to bring, and what to expect (content within `WhatsHashingInfo`).
