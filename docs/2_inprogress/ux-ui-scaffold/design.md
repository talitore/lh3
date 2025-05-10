# Design Considerations for UX/UI Scaffold

## Architectural Thoughts

- **Component Structure:**
  - Components will be built using React and styled with Tailwind CSS.
  - Each component should reside in its own directory within a `components/ui` folder (following Shadcn's convention if adopted, or a similar structure).
  - Example: `components/ui/card.tsx`, `components/ui/button.tsx`.
- **State Management for Global Layout:**
  - The collapsible state of the sidebar will likely be managed using React Context or a lightweight state management library (like Zustand or Jotai) if global state access is needed frequently. For simple toggle, local component state within the main layout might suffice.
- **Responsiveness:**
  - Utilize Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) extensively for all layout and component styling.
  - Test thoroughly on various device emulators and physical devices if possible.

## Visual Sketches/Wireframes (Descriptions)

_(These are textual descriptions. Actual wireframes/mockups would be created in a design tool.)_

- **Main Layout (Option 2 - Modern Collapsible Overlay Sidebar):**
  - **Desktop:**
    - Header: Full-width, fixed at the top. "LH3 (Larryville Hash House Harriers)" Logo left, navigation links ("Feed", "Events", "Members") center/right. "Admin Mode" toggle and user profile icon on the far right. A toggle icon (e.g., hamburger or a specific sidebar icon) to open the sidebar.
    - Main Content: Occupies full viewport width below the header. Example content: a scrollable feed of user posts, event cards.
    - Sidebar: Slides in as an overlay from the left or right when toggled. Width ~280-320px. Contains sections like "Upcoming Events" (list of events), "Quick Stats" (e.g., Active Members, Hash Cash Pool), and "Admin Tools" (e.g., Attendance Tracking, Hash Cash Management).
  - **Mobile/Tablet:**
    - Header: Similar to desktop, primary navigation links ("Feed", "Events", "Members") might collapse into a menu triggered by an icon, or be part of the main sidebar. "LH3" Logo, Admin toggle, Profile icon, and Sidebar toggle visible.
    - Sidebar: Always an overlay, toggled by its icon. Contains same sections as desktop.
    - Main Content: Full width.
- **Card Component:**
  - Simple rectangle with rounded corners and a subtle box shadow.
  - Optional header section (for `title`) with a slightly different background or bottom border.
  - Padding around the `children` content.
- **Button Component:**
  - Variants will have distinct visual styles:
    - `primary`: Solid background (brand color), white/light text.
    - `secondary`: Lighter background or outline, brand color text.
    - `outline`: Transparent background, colored border, colored text.
    - `ghost`: Transparent background, colored text, minimal styling, often used for less prominent actions.
    - `link`: Looks like a hyperlink.
  - Sizes will affect padding and font size.
  - `icon` prop will allow an SVG icon to be placed before or after the `children` text.

## Component Interactions

- **Sidebar:**
  - Click on toggle icon in the header opens/closes the sidebar.
  - Opening animation: Smooth slide-in.
  - Closing animation: Smooth slide-out.
  - If main content is pushed, it should resize smoothly.
  - Clicking outside the sidebar (on a scrim or the main content) could also close it.
- **Input Component with Icons:**
  - `iconLeft`/`iconRight` should be visually aligned within the input field's padding.
  - Clicking the icon (if interactive, e.g., a clear button) should trigger a corresponding action.
- **PhotoGallery:**
  - `grid` layout: Images displayed in a responsive grid. Clicking an image might open a larger preview in a modal.
  - `carousel` layout: Images displayed one at a time with navigation arrows (prev/next) and possibly dot indicators. Swipe gestures on touch devices.
- **MapEmbed:**
  - Interaction will depend on the embedded service (Google Maps, Leaflet). Typically includes pan, zoom.
  - `markers` should be clearly visible. Clicking a marker might show an info pop-up.

## Accessibility Notes (Reiteration from spec.md)

- Ensure sufficient color contrast for text and UI elements.
- All interactive elements (buttons, inputs, links, sidebar toggle) must be focusable and operable via keyboard.
- Use ARIA attributes where appropriate (e.g., `aria-expanded` for sidebar, `aria-label` for icon buttons).
- For `MapEmbed` and `PhotoGallery`, consider how non-visual users will access the information (e.g., alt text for images, textual descriptions for map content if possible).
