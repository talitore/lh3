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
  - `src/lib/constants/`: Centralized constants and configuration values
  - `src/lib/config/`: Environment configuration and validation
  - `src/lib/services/`: Business logic and external service integrations
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
- **Cloud Storage**: AWS S3 (for storing user-uploaded photos)
- **Mapping**: Mapbox GL JS (for interactive maps with draggable markers)
- **Geocoding**: Mapbox SDK (for server-side geocoding and address validation)

## Data Modeling & Database Schema

The core data structure of the application is defined using Prisma. The schema, located in `prisma/schema.prisma`, includes the following key models:

- **User**: Represents application users with authentication details and profile information.
- **Run**: Represents run events organized by users, including descriptor, number, dateTime, address, and introductory link. Supports location data with latitude and longitude coordinates for enhanced mapping functionality.
- **RSVP**: Tracks user responses (Yes, No, Maybe) to runs, establishing a many-to-many relationship between users and runs.
- **Photo**: Allows users to upload photos related to runs, storing metadata such as caption and S3 storage location.
- **Attendance**: Records actual attendance of users at runs, as marked by authorized users (e.g., organizers).

These models have defined fields, types, and relationships to ensure data integrity and provide a structured way to store and access application data. The schema supports the API endpoints for run management, RSVP tracking, attendance marking, and photo uploads.

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

## API Endpoints

The application provides a set of RESTful API endpoints for managing runs, user interactions, and photo uploads. These endpoints follow RESTful principles with resource-oriented design:

### Run Management

- `POST /api/runs`: Create a new run with descriptor, number, dateTime, address, and introLink.
- `GET /api/runs`: List runs with filtering, sorting, and pagination options.
- `GET /api/runs/[id]`: Get detailed information for a specific run, including attendees and photos.
- `PUT /api/runs/[id]`: Update details of an existing run.

### RSVP & Attendance

- `PUT /api/runs/[id]/rsvp`: Toggle a user's RSVP status for a run.
- `POST /api/runs/[id]/attendance`: Mark a specified user as having attended a run (requires authorization).

### Photo Management

- `POST /api/runs/[id]/photos/generate-signed-url`: Generate a pre-signed URL for direct upload to AWS S3.
- `POST /api/runs/[id]/photos/confirm-upload`: Confirm a photo upload and associate metadata.

### Geocoding Services

- `POST /api/geocode`: Server-side geocoding fallback for address validation and coordinate conversion using Mapbox Geocoding API.

All API endpoints are protected with authentication using NextAuth.js, and certain endpoints (like attendance marking) have additional authorization requirements. The API uses standard HTTP status codes and consistent JSON response formats for both successful operations and errors.

For photo uploads, the application uses a two-step process with AWS S3 pre-signed URLs to offload bandwidth and processing from the API servers. This approach improves scalability and performance for media handling.

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
  - `AddressAutocomplete`: For address input with autocomplete functionality using Mapbox Geocoding API.
  - `MapPicker`: For interactive map-based location selection with draggable markers.
  - `Combobox`: For searchable dropdown selections.
  - `Command`: For command palette functionality.
  - `Popover`: For floating content containers.
  - `Dialog`: For modal dialogs and overlays.
    These components are located in `src/components/ui/`.
- **Development Workflow**:
  - New UI components are developed and tested in isolation within the `src/app/(demo)/components/` sandbox environment. Each component has a dedicated page demonstrating its props and states.
  - Storybook was explicitly decided against in favor of these in-app demo pages.
- Use shadcn/ui components as a base where applicable, and extend or customize them as needed, placing them in `src/components/ui/` or `src/components/custom/` respectively.

## Constants and Configuration Management

The application implements a centralized constants and configuration system to eliminate magic strings and ensure maintainability:

### Constants Architecture

All hardcoded values, magic strings, and configuration constants are extracted into dedicated files within `src/lib/constants/`:

- **`ui.ts`**: UI-related constants including map dimensions, default coordinates, timing values, CSS classes, and visual configuration
- **`api.ts`**: API endpoints, HTTP status codes, error messages, external service URLs, and request/response formats
- **`app.ts`**: Application-wide constants including test mode values, pagination defaults, sorting options, and database field selectors
- **`validation.ts`**: Validation rules, limits, error messages, and form validation patterns
- **`index.ts`**: Centralized re-exports for convenient importing

### Environment Configuration

Environment variable management is centralized in `src/lib/config/env.ts` with:

- **Type-safe configuration**: All environment variables are accessed through typed functions
- **Validation**: Required environment variables are validated at runtime
- **Test mode handling**: Automatic fallbacks and mock values for testing environments
- **Helper functions**: Convenient access to common configuration needs (Mapbox tokens, S3 config, etc.)

### Benefits

- **Zero Magic Strings**: All hardcoded values are extracted to constants
- **Single Source of Truth**: Changes to values only need to be made in one place
- **Type Safety**: All constants are properly typed with TypeScript
- **Test Consistency**: Test mode values are centralized and consistent
- **Maintainability**: Easy to update configuration across the entire application

### Usage Pattern

Components and services import constants from the centralized location:

```typescript
import { DEFAULT_COORDINATES, MAP_DIMENSIONS } from '@/lib/constants/ui';
import { API_ENDPOINTS, HTTP_STATUS } from '@/lib/constants/api';
import { getMapboxAccessToken } from '@/lib/config/env';
```

This architecture ensures consistency, reduces errors, and improves maintainability across the codebase.

## Code Quality & Linting

ESLint is configured for Next.js/TypeScript to ensure code quality and consistency.

## Authentication and Authorization

User authentication is handled using **NextAuth.js**. The initial implementation utilizes the Google OAuth 2.0 provider, allowing users to sign in securely with their Google accounts.

API routes requiring authentication are protected by verifying the user's session on the server side using `getServerSession(authOptions)`. If a valid session is not found, the API endpoint returns a 401 Unauthorized response.

The application implements a role-based authorization model for certain API endpoints:

- **Public Access**: Unauthenticated users can access public information like basic run listings.
- **User Access**: Authenticated users can manage their own RSVPs and upload photos to runs they're attending.
- **Organizer Access**: Users with organizer privileges can create and edit runs, and mark attendance for other users.

Authorization checks are performed in the API route handlers after authentication validation. For example, the `/api/runs/[id]/attendance` endpoint verifies that the requesting user has organizer privileges before allowing them to mark another user's attendance.

## Session Management

NextAuth.js manages user sessions using the default **JWT (JSON Web Token) session strategy**. This provides a stateless session mechanism suitable for serverless deployments. The JWT is securely stored in an HTTP-only cookie in the user's browser.

## Configuration Management

Key configuration settings, particularly for external services and security, are managed using environment variables. The application uses a centralized configuration system in `src/lib/config/env.ts` that provides type-safe access to environment variables with validation and fallbacks for testing environments.

### Authentication Configuration

For NextAuth.js, the following `AUTH_` prefixed variables are used, following recommended conventions for future compatibility:

- `AUTH_URL`: The canonical URL of the application.
- `AUTH_SECRET`: A strong secret for signing and encrypting session data.
- `AUTH_GOOGLE_ID`: Google OAuth Client ID.
- `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret.

### AWS S3 Configuration

For photo storage using AWS S3, the following environment variables are required:

- `S3_BUCKET_NAME`: The name of the S3 bucket for storing photos.
- `AWS_REGION`: The AWS region where the S3 bucket is located (e.g., `us-east-1`).
- `AWS_ACCESS_KEY_ID`: IAM user's access key ID with appropriate S3 permissions.
- `AWS_SECRET_ACCESS_KEY`: IAM user's secret access key.

### Mapbox Configuration

For geocoding and mapping functionality using Mapbox services, the following environment variables are required:

- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Client-side Mapbox API key for map rendering and client-side geocoding.
- `MAPBOX_SECRET_TOKEN`: Server-side Mapbox API key for server-side geocoding fallback operations.

All environment variables should be stored securely (e.g., in a `.env.local` file for local development and configured in the deployment environment).
