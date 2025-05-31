## Phase 10: Refinements, Testing Expansion, and Basic Admin Stubs

### Objective

Refine existing features, expand test coverage, set up basic admin stubs, and prepare for more advanced features or deployment.

### PRD Alignment

- Section 6.6: "Dashboard.tsx" (Admin Mode) - stubs
- Section 8: Testing Strategy (RSpec + Capybara) - review and expand
- Section 7: Background Jobs & Real-Time Updates (consider if any simple caching can be added)
- Section 2.5 & 6 (folder structure): AddressInput.tsx, MapPicker.tsx, useGeocode.ts (more advanced stubs or basic implementation)

### User Stories Covered

- User Story 2, 3, 4 (Navigation refinements)
- User Story 8, 9, 10 (Feed filtering/sorting stubs or simplified version)
- User Story 20: View Community Statistics on Feed (mock data)
- User Story 21: Access "What's Hashing?" Information

### Key Tasks

1.  **Navigation & Layout Enhancements:**
    - Implement "Back to Runs" (US4), "View All Runs" (US2), "View All Photos" (US3) navigation links/buttons.
    - Create placeholder pages if destinations don't exist (e.g., `/photos` main page).
    - Refine `AppLayout.tsx` with actual navigation links.
2.  **"What's Hashing?" Info (`WhatsHashingInfo.tsx`):**
    - Create `app/frontend/Components/WhatsHashingInfo.tsx` (US21).
    - Add static content as per PRD.
    - Integrate into `Events/Show.tsx`.
3.  **Community Stats (Mock Data):**
    - Create `app/frontend/Components/CommunityStatsCard.tsx` (US20).
    - Display with mock data. Integrate into `Events/Index.tsx`.
4.  **Admin Dashboard Stub (`Dashboard.tsx`):**
    - Create `app/frontend/Pages/Admin/Dashboard.tsx` (`prd.md#6.6`).
    - Add basic conditional link in `AppLayout` to `/admin/dashboard` if `current_user.is_admin?` (add `is_admin` boolean to `User` model, default false, and migrate).
    - Stub out sections mentioned in PRD (Attendance Tracking, Hash Cash, Achievements).
5.  **Advanced Address Input (Consideration):**
    - If time permits, start basic integration of Google Maps Autocomplete for `AddressInput.tsx` (PRD section 6.4) or defer.
    - Create `app/frontend/Hooks/useGeocode.ts` stub.
6.  **Test Suite Expansion:**
    - Review all user stories and ensure corresponding system tests in Capybara.
    - Increase unit test coverage for models and controllers.
    - Refine factories for better test data.
7.  **Basic Caching (Optional):**
    - If `solid_cache` is set up (from Phase 1 gems), apply simple caching to `Event#rsvp_count` as per `prd.md#7.2`.
8.  **Feed Filtering/Sorting (Simplified/Stubs):**
    - Add UI elements for search, filter, sort on `Events/Index.tsx` (US8, US9).
    - For MVP, these might be non-functional or implement very basic client-side filtering if feasible. Backend filtering can be an enhancement.
    - "Load More" button (US10) can be stubbed or implement simple pagination if backend supports it.

### Testing

- **User-Verifiable:**
  - All navigation links work as expected.
  - "What's Hashing?" info is viewable.
  - Mock community stats are displayed.
  - Admin users can see a link to a stubbed admin dashboard.
  - All previously implemented features still work.
- **System Specs (Capybara):**
  - Cover all remaining user stories that are part of this phase.
  - Test admin dashboard link visibility based on user role.

### Deliverables

- Refined UI and navigation.
- Stubbed or simplified versions of remaining feed features and admin dashboard.
- Expanded and robust test suite.
- `WhatsHashingInfo.tsx` and `CommunityStatsCard.tsx` with content.
