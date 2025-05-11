### Prompts for AI UI Generation (e.g., UX Pilot)

Assumptions based on `spec.md` (using Option 1: Prominent Sign-In Button in Header as the primary example, but prompts can be adapted for other options).

#### 1. Application Header - Unauthenticated State

- **Prompt**: "Generate a modern, clean application header component. On the far right, include a prominent 'Sign in with Google' button. The button should feature the Google logo and the text 'Sign in with Google'. Ensure the header has a subtle shadow and placeholders for a logo on the left and potentially 2-3 navigation links in the middle."
- **Key Elements**: Application Logo (placeholder), Navigation Links (placeholders), "Sign in with Google" button (with Google icon).
- **Layout**: Logo left, Nav middle, Sign-in button right.
- **Style**: Modern, clean, professional.

#### 2. Application Header - Authenticated State

- **Prompt**: "Generate a modern, clean application header component. On the far right, where the sign-in button was, display the text 'Welcome, [User Name]' followed by a small downward-pointing chevron icon, indicating a dropdown menu. The user's name should be a placeholder. Ensure the header has a subtle shadow and placeholders for a logo on the left and potentially 2-3 navigation links in the middle."
- **Key Elements**: Application Logo (placeholder), Navigation Links (placeholders), User Name display, Dropdown chevron icon.
- **Layout**: Logo left, Nav middle, User display/dropdown trigger right.
- **Style**: Modern, clean, consistent with the unauthenticated header.

#### 3. User Dropdown Menu (Triggered from Authenticated Header)

- **Prompt**: "Generate a compact dropdown menu that appears when the user's name in the header is clicked. The menu should contain two items: 'Account Settings' (optional, if applicable to the app) and a 'Sign Out' button. Each item should span the full width of the dropdown. The 'Sign Out' button should be clearly actionable."
- **Key Elements**: "Account Settings" link/button (optional), "Sign Out" button.
- **Layout**: Vertical stack of menu items.
- **Style**: Clean, matching the application's theme, clear visual separation for items.

#### (Alternative) 4. Dedicated Sign-In Page (If Option 2 from `spec.md` is chosen)

- **Prompt**: "Design a centered sign-in page for a web application. The page should feature the application's logo (placeholder) at the top, a brief welcome message or application tagline, and a prominent 'Sign in with Google' button below the message. The button should be large, easily clickable, and include the Google logo. The overall page should be minimalistic and focused, with ample white space."
- **Key Elements**: Application Logo (placeholder), Welcome Message/Tagline, Large "Sign in with Google" button.
- **Layout**: Centered, vertical flow.
- **Style**: Minimalist, focused, inviting.

#### (Alternative) 5. Sign-In Modal (If Option 3 from `spec.md` is chosen)

- **Prompt**: "Design a modal dialog for user sign-in. The modal should have a clear title like 'Sign In'. The body should contain a brief instruction (e.g., 'Continue with your Google account') and a prominent 'Sign in with Google' button that includes the Google logo. Include a close button (e.g., an 'X' icon) in the top-right corner of the modal."
- **Key Elements**: Modal Title, Instructional Text, "Sign in with Google" button, Close button.
- **Layout**: Standard modal layout, content centered within the modal.
- **Style**: Clean, unobtrusive, consistent with application styling.
