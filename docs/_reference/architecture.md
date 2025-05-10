# Architecture Documentation

## Project Structure

The application follows a standard Next.js project structure:

- `src/app/`: Contains all application routes, layouts, pages, and API handlers.
- `src/components/`: Shared UI components
- `src/components/ui/`: shadcn/ui components (copied in via CLI)
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

## Build and Deployment

The build process leverages Next.js build tools with pnpm as the package manager.

## Routing

Next.js App Router file-system based routing is used. Folders within the `src/app` directory define routes. Special files like `page.tsx` (for UI), `layout.tsx` (for shared layouts), and `route.ts` (for API endpoints) are used to define the content and behavior of these routes.

## Styling

The application uses Tailwind CSS for utility-first styling, with shadcn/ui providing the core component set. CSS variables for theming are defined in `globals.css`. Custom themes can be created by adjusting these variables. CSS Modules may be used for component-specific styles if needed.

## UI Component Conventions

- Use shadcn/ui components for all new UI development.
- Add new shadcn/ui components using the CLI (`pnpm dlx shadcn@latest add <component>`).
- Place custom wrappers or extensions in `src/components/custom/`.
- Follow shadcn/ui and project conventions for theming and composition.
- Update shadcn/ui components as needed using the CLI (`pnpm dlx shadcn@latest upgrade`).

## Code Quality & Linting

ESLint is configured for Next.js/TypeScript to ensure code quality and consistency.
