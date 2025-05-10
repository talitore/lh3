# Architecture Documentation

## Project Structure

The application follows a standard Next.js project structure. The UX/UI Scaffold feature introduced a global layout and component demonstration area:

- `src/app/`: Contains all application routes, pages, and API handlers.
  - `layout.tsx`: Implements the global application layout, including a fixed header, a collapsible overlay sidebar (with sections for "Upcoming Events", "Quick Stats", "Admin Tools"), and the main content area.
  - `(demo)/components/`: A dedicated area for sandbox pages, showcasing each UI component in isolation with its various states and props.
- `src/components/`: Shared UI components.
  - `src/components/ui/`: Core reusable UI components provided by the UX/UI Scaffold (e.g., `card.tsx`, `button.tsx`, `input.tsx`, `badge.tsx`, `map-embed.tsx`, `photo-gallery.tsx`). These are built using React and styled with Tailwind CSS, extending shadcn/ui principles.
- `src/components/custom/`: Custom components that wrap or extend shadcn/ui components
- `src/lib/`: Helper functions and utility code
- `public/`: Static assets
- `styles/`: Global styles and CSS modules (including `globals.css` for CSS variables and theming)

## Frontend Framework

The application is built using:

- Next.js for the core framework
- TypeScript for type safety
- React for UI components
- shadcn/ui as the primary design system and component library

## Technology Stack

- **Frontend Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with shadcn/ui integration and CSS variables for theming)
- **Component Library**: shadcn/ui (added via CLI, customizable, themable)
- **Package Manager**: pnpm
- **ORM**: Prisma
- **Database**: PostgreSQL

## Build and Deployment

The build process leverages Next.js build tools with pnpm as the package manager.

## Routing

Next.js App Router file-system based routing is used. Folders within the `src/app` directory define routes. Special files like `page.tsx` (for UI), `layout.tsx` (for shared layouts), and `route.ts` (for API endpoints) are used to define the content and behavior of these routes.

## Styling

The application uses Tailwind CSS for utility-first styling. The UX/UI Scaffold feature established a custom design system by:

- Extending Shadcn's base Tailwind tokens to define a specific color palette (primary, secondary, status colors), spacing scale, and typography styles.
- These custom tokens and global styles are primarily managed in `globals.css`, ensuring a consistent look and feel across the application.
- All components are styled using Tailwind CSS, emphasizing responsiveness and accessibility.

## UI Component Conventions

The UX/UI Scaffold introduced a set of core, reusable UI components and a development workflow:

- **Core Components**:
  - `Card`: For displaying contained pieces of information.
  - `Badge`: For small status indicators or labels.
  - `Button`: For user actions, with various styles and sizes.
  - `Input`: For text-based user input.
  - `MapEmbed`: For embedding interactive maps.
  - `PhotoGallery`: For displaying collections of images.
    These components are located in `src/components/ui/`.
- **Development Workflow**:
  - New UI components are developed and tested in isolation within the `src/app/(demo)/components/` sandbox environment. Each component has a dedicated page demonstrating its props and states.
  - Storybook was explicitly decided against in favor of these in-app demo pages.
- Use shadcn/ui components as a base where applicable, and extend or customize them as needed, placing them in `src/components/ui/` or `src/components/custom/` respectively.

## Code Quality & Linting

ESLint is configured for Next.js/TypeScript to ensure code quality and consistency.
