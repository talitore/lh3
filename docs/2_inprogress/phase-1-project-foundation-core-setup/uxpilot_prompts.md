## UX Pilot Prompts for Core Setup

Given this phase is about foundational setup, the "UX" is primarily for the developer and the initial "Hello World" page serves as a proof-of-concept for the integrated technologies.

### 1. Developer Environment & Workflow Verification (Conceptual Screen)

- **Prompt for AI UI Generation (Conceptual - for a tool that could visualize developer workflow):**
  - "Design a dashboard for a Rails developer setting up a new project with Vite, Inertia, React, and Tailwind. Show clear status indicators for: Rails server (running/stopped), Vite dev server (running/stopped, HMR active), Docker containers (app, db, redis - all green). Include quick links to view `vite.config.ts`, `tailwind.config.js`, `routes.rb`, and `app/frontend/Pages/Home.tsx`. Display a small, embedded browser preview of the application's root page, showing 'Hello World' styled with Tailwind. The overall style should be clean, technical, and developer-friendly with a dark theme option."

### 2. Initial "Hello World" Page (`app/frontend/Pages/Home.tsx`)

- **Prompt 1 (Minimalist & Centered):**

  - "Create a full-screen React (TSX) page component using Tailwind CSS. The page should have a neutral gray background (e.g., `bg-slate-100`). In the center of the page, display a main heading 'Welcome to lh3' in a large, bold, dark gray sans-serif font (e.g., `text-4xl font-bold text-slate-800`). Below the heading, add a paragraph 'Powered by Rails, Vite, Inertia, React, and Tailwind CSS.' in a medium-sized, regular-weight, dark gray sans-serif font (e.g., `text-lg text-slate-600`). Ensure both text elements are horizontally centered. Add some vertical spacing between the heading and the paragraph."

- **Prompt 2 (Slightly Styled with a Container):**

  - "Design a React (TSX) page component for a 'Home' screen using Tailwind CSS. The page should have a light blue background (e.g., `bg-sky-50`). Implement a centered container with a white background (e.g., `bg-white`), rounded corners (e.g., `rounded-lg`), and a subtle shadow (e.g., `shadow-md`) that takes up about 60% of the screen width. Inside this container, display the text 'Hello World from lh3!' as a prominent H1 heading (e.g., `text-3xl font-semibold text-sky-700`) and a sub-text 'Application stack successfully initialized.' (e.g., `text-md text-gray-500`). Both texts should be centered within the container. Add padding within the container (e.g., `p-8`)."

- **Prompt 3 (Developer-Focused Info Display):**
  - "Generate a React (TSX) page for `/` that acts as a tech stack confirmation. Use Tailwind CSS. The layout should feature a main title 'lh3 Project: Core Stack Status' (e.g., `text-2xl font-bold mb-6`). Below this, list the key technologies: 'Rails Backend: Connected', 'Vite Bundler: Active', 'Inertia.js: Bridging', 'React Frontend: Rendering', 'Tailwind CSS: Styling Active'. Each item should have a green checkmark icon next to it. The overall style should be clean, almost like a status report, using a monospaced font for the list items if appropriate, on a simple `bg-gray-50` background. Center the content on the page."

These prompts are geared towards the initial, simple output required by this phase, confirming the integration of all parts of the stack rather than complex user interactions.
