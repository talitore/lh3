# UX Pilot Prompts for UX/UI Scaffold

## Global Layout (Option 2: Modern - Collapsible Overlay Sidebar)

**Prompt 1: Main Application Shell - the application Desktop View**
"Design a clean and modern application shell for a community platform called 'the application'.

- Header: Fixed at the top, 60px height. Include the 'the application' logo on the left. Centered or right-aligned, include primary navigation links: 'Feed', 'Events', 'Members'. On the far right, include an 'Admin Mode' toggle switch and a user profile icon/button. Add a distinct icon (e.g., a three-line sidebar icon or a specific 'tools' icon) on the far left to toggle a sidebar.
- Sidebar: Initially hidden. When toggled, it should slide in from the right as an overlay, with a width of approx 300px. The sidebar should have a slightly different background color (e.g. light gray if main is white). Include sections with appropriate icons:
  - 'Upcoming Events': Show 2-3 placeholder event summaries (e.g., 'the application #689 - Weekend Trail Run - Sat, Mar 15').
  - 'Quick Stats': Show placeholder stats like 'Active Members: 247', 'New Members: 12', 'Hash Cash Pool: 12,450'.
  - 'Admin Tools': List items like 'Attendance Tracking', 'Hash Cash Management', 'Manage Achievements'.
- Main Content Area: Occupy the remaining space below the header. Display a placeholder for a social feed post, e.g., a card with user avatar, name, timestamp, text content, and an image placeholder.
- Style: Use a light theme, professional yet engaging for a community. Primary accent color: a vibrant but not overpowering blue (refer to mockup). Font: Clear Sans-serif."

**Prompt 2: Main Application Shell - the application Mobile View with Sidebar Open**
"Design the mobile view of the 'the application' application shell, specifically showing the sidebar open.

- Header: Fixed at the top, 50px height. Display the 'the application' logo (can be smaller) on the left. On the right, include an 'Admin Mode' toggle (if space allows, or it moves to sidebar), a user profile icon, and the sidebar toggle icon.
- Sidebar: Visible as an overlay, sliding from the right, taking up about 85% of the screen width. It contains the same sections as desktop ('Upcoming Events', 'Quick Stats', 'Admin Tools') stacked vertically. Ensure list items are easily tappable. Add a 'Close' (X) icon at the top left or right of the sidebar.
- Main Content Area: Partially visible behind the sidebar overlay, possibly dimmed.
- Style: Clean, touch-friendly, light theme. Consistent with the desktop's vibrant blue accent."

## Common Reusable Components (from spec.md, contextualized for the application)

**Prompt 1: Event Card Component - For 'Upcoming Events' List**
"Generate a React component for an Event Card, suitable for listing in the 'Upcoming Events' sidebar of the application.

- Appearance: Compact rectangular card, rounded corners, subtle shadow. Show event title (e.g., 'the application #690'), date/time (e.g., 'Mar 22 - 9:00 AM'), and a small icon indicating it's an event (e.g., calendar icon). Add a right-arrow icon or similar to suggest clickability for more details.
- Content: Props for `eventName`, `eventDate`, `eventTime`, `eventIdentifier` (e.g. 'the application #690').
- Style: Clean, information-dense but not cluttered. Use Tailwind CSS. Primary color for accents/icons."

**Prompt 2: Button Component - 'Quick RSVP' Action**
"Generate a React Button component for a 'Quick RSVP' action on an event card in the application.

- Props: `variant='primary'`, `size='sm'` (or `md` if more prominent), `children` (text label: 'Quick RSVP'), `onClick` handler, optional `icon` (e.g., a checkmark or calendar icon).
- Appearance (`primary`): Solid background using the application's primary blue, white text, rounded corners (e.g., 6px), appropriate padding for its size. Hover/active states.
- Style: Clear call-to-action, noticeable but not oversized for its context. Use Tailwind CSS."

**Prompt 3: Post Input Component - 'Share something with the community...'**
"Generate a React Input component for creating a new post in the the application feed.

- Appearance: A rounded rectangle, wider than a standard input. Inside, on the left, show the current user's avatar (placeholder). To the right of the avatar, display placeholder text like 'Share something with the community...'. Below this main input area, include smaller buttons/icons for 'Photo', 'Discussion', 'Event'.
- Props: `currentUserAvatarUrl`, `placeholderText`, `onPhotoClick`, `onDiscussionClick`, `onEventClick`.
- Style: Friendly and inviting. Use Tailwind CSS. Light background, subtle border."

**Prompt 4: Stats Item Component - For 'Quick Stats' Section**
"Generate a React component to display a single statistic in the 'Quick Stats' section of the application's sidebar.

- Appearance: Display a label (e.g., 'Active Members') and its value (e.g., '247') on a single line, or label above value if space is tight. Value should be more prominent (larger font or bolder).
- Props: `label` (string), `value` (string or number).
- Style: Clear and easy to read at a glance. Use Tailwind CSS."
