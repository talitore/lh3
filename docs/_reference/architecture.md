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
- **ORM**: Prisma (manages database schema and provides type-safe access)
- **Database**: PostgreSQL (schema defined and managed by Prisma)
- **Authentication**: NextAuth.js (for user authentication)

## Data Modeling & Database Schema

The core data structure of the application is defined using Prisma. The schema, located in `prisma/schema.prisma`, includes the following key models:

- **User**: Represents application users.
- **Run**: Represents run events organized by users.
- **RSVP**: Tracks user responses (Yes, No, Maybe) to runs.
- **Photo**: Allows users to upload photos related to runs.

These models have defined fields, types, and relationships to ensure data integrity and provide a structured way to store and access application data.

## ORM & Data Access Layer

Prisma is utilized as the Object-Relational Mapper (ORM) for this project. It serves several key functions:

- **Schema Definition**: The `prisma/schema.prisma` file is the single source of truth for the database schema.
- **Type-Safe Client**: Prisma generates a type-safe client (`@prisma/client`) that is used in the backend to interact with the database, preventing common data-related errors.
- **Database Migrations**: Prisma manages database schema migrations, allowing for version-controlled changes to the database structure.

## Database Migration Strategy

Database schema migrations are handled using Prisma Migrate. The primary command used during development is `pnpm prisma migrate dev`. This command:

- Compares the current `prisma/schema.prisma` with the state of the database.
- Generates SQL migration files based on the differences.
- Applies the generated migrations to the development database.
- Ensures the Prisma Client is up-to-date with the latest schema.

This approach allows for an iterative and version-controlled process for evolving the database schema alongside application features.

## Build and Deployment

The build process leverages Next.js build tools with pnpm as the package manager.

## Routing

Next.js App Router file-system based routing is used. Folders within the `src/app` directory define routes. Special files like `page.tsx` (for UI), `layout.tsx` (for shared layouts), and `route.ts` (for API endpoints) are used to define the content and behavior of these routes. API routes can be protected using `getServerSession` to restrict access to authenticated users.

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

## Authentication and Authorization

User authentication is handled using **NextAuth.js**. The initial implementation utilizes the Google OAuth 2.0 provider, allowing users to sign in securely with their Google accounts.

API routes requiring authentication are protected by verifying the user's session on the server side using \`getServerSession(authOptions)\`. If a valid session is not found, the API endpoint returns a 401 Unauthorized response.

## Session Management

NextAuth.js manages user sessions using the default **JWT (JSON Web Token) session strategy**. This provides a stateless session mechanism suitable for serverless deployments. The JWT is securely stored in an HTTP-only cookie in the user's browser.

## Configuration Management

Key configuration settings, particularly for external services and security, are managed using environment variables. For NextAuth.js, the following \`AUTH\_\` prefixed variables are used, following recommended conventions for future compatibility:

- \`AUTH_URL\`: The canonical URL of the application.
- \`AUTH_SECRET\`: A strong secret for signing and encrypting session data.
- \`AUTH_GOOGLE_ID\`: Google OAuth Client ID.
- \`AUTH_GOOGLE_SECRET\`: Google OAuth Client Secret.

These variables should be stored securely (e.g., in a \`.env.local\` file for local development and configured in the deployment environment).
