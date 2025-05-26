# Architecture Documentation

## Project Structure

The application follows a standard Next.js project structure with a comprehensive layout and component architecture:

- `src/app/`: Contains all application routes, pages, and API handlers.
  - `layout.tsx`: Implements the global application layout with a modern header and sidebar system using shadcn/ui components.
  - `(demo)/components/`: A dedicated area for sandbox pages, showcasing each UI component in isolation with its various states and props.
- `src/components/`: Shared UI components organized by purpose.
  - `src/components/layout/`: Layout-specific components including the refactored header, sidebar, and admin toggle components.
    - `header.tsx`: Modern header component using shadcn/ui Button components and Lucide React icons.
    - `sidebar.tsx`: Sidebar component built with shadcn/ui Sheet component for proper overlay behavior.
    - `admin-toggle.tsx`: Extracted admin mode toggle component using shadcn/ui Switch.
  - `src/components/ui/`: Core reusable UI components following shadcn/ui standards. Includes all standard shadcn/ui components (`button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`, `form.tsx`, `select.tsx`, `dialog.tsx`, `popover.tsx`, `alert.tsx`, `skeleton.tsx`, `sonner.tsx`, `separator.tsx`, `sheet.tsx`, `tabs.tsx`, `table.tsx`, `dropdown-menu.tsx`, `command.tsx`, `label.tsx`, `textarea.tsx`, `switch.tsx`) plus custom components (`map-embed.tsx`, `photo-gallery.tsx`, `address-autocomplete.tsx`, `map-picker.tsx`, `combobox.tsx`). All components are built using React, styled with Tailwind CSS, and follow modern shadcn/ui patterns with data-slot attributes.
- `src/components/custom/`: Custom components that wrap or extend shadcn/ui components (reserved for future application-specific wrappers)
- `src/lib/`: Helper functions and utility code
  - `src/lib/constants/`: Centralized constants and configuration values
  - `src/lib/config/`: Environment configuration and validation
  - `src/lib/services/`: Business logic and external service integrations
  - `src/lib/schemas/`: Centralized Zod validation schemas for all API operations
  - `src/lib/errors/`: Standardized error handling classes and utilities
  - `src/lib/types/`: TypeScript type definitions for service layer operations
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

## UI Component Architecture & Standards

The application follows a comprehensive shadcn/ui-based component architecture. All UI components must adhere to these patterns for consistency and maintainability.

### Component Categories

#### **Standard shadcn/ui Components** (`src/components/ui/`)

All standard shadcn/ui components are installed and follow the modern shadcn/ui patterns:

- **Form & Input Components**: `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `form.tsx`, `select.tsx`
- **Layout Components**: `card.tsx`, `separator.tsx`, `sheet.tsx`, `tabs.tsx`, `table.tsx`
- **Feedback Components**: `alert.tsx`, `badge.tsx`, `skeleton.tsx`, `sonner.tsx` (toast replacement)
- **Overlay Components**: `dialog.tsx`, `popover.tsx`, `dropdown-menu.tsx`
- **Navigation Components**: `command.tsx`

#### **Custom Components** (`src/components/ui/`)

Application-specific components that extend shadcn/ui patterns:

- **Map Components**: `map-embed.tsx`, `map-picker.tsx`, `address-autocomplete.tsx` (use centralized constants)
- **Media Components**: `photo-gallery.tsx` (uses shadcn/ui Button internally)
- **Composite Components**: `combobox.tsx` (wrapper using shadcn/ui components)

### Component Development Standards

#### **1. Import Patterns**
```typescript
// ✅ CORRECT: Always use named imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ❌ INCORRECT: Never use default imports
import Button from '@/components/ui/button';
```

#### **2. Component Structure**
All components must follow the modern shadcn/ui pattern:

```typescript
// ✅ CORRECT: Modern pattern with data-slot attributes
function ComponentName({ className, ...props }: ComponentProps) {
  return (
    <element
      data-slot="component-name"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// ❌ INCORRECT: Old forwardRef pattern (deprecated)
const ComponentName = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => { ... }
)
```

#### **3. Icon Usage**
```typescript
// ✅ CORRECT: Use Lucide React icons
import { Search, User, Settings } from 'lucide-react';

// ❌ INCORRECT: Custom SVG components
const CustomIcon = () => <svg>...</svg>;
```

#### **4. Variant Definitions**
Only use officially supported variants:

```typescript
// ✅ CORRECT: Standard shadcn/ui variants
<Button variant="default" | "destructive" | "outline" | "secondary" | "ghost" | "link">
<Badge variant="default" | "secondary" | "destructive" | "outline">

// ❌ INCORRECT: Custom variants not in shadcn/ui
<Button variant="primary" | "info" | "success">
```

### Development Workflow

#### **Component Testing & Documentation**
- **Demo Pages**: All components must have demo pages in `src/app/(demo)/components/` showcasing all variants and states
- **Isolation Testing**: Components are developed and tested in isolation before integration
- **No Storybook**: The project explicitly uses in-app demo pages instead of Storybook

#### **Adding New Components**

1. **Standard shadcn/ui Components**:
   ```bash
   # Use the official CLI to add components
   pnpm dlx shadcn@latest add [component-name]
   ```

2. **Custom Components**:
   - Place in `src/components/ui/` if they extend shadcn/ui patterns
   - Place in `src/components/custom/` if they are application-specific wrappers
   - Must use centralized constants from `src/lib/constants/`
   - Must follow the modern component pattern with `data-slot` attributes

#### **Component Updates**
- Always update components to use the latest shadcn/ui patterns
- Ensure all components have consistent `data-slot` attributes
- Update demo pages when component APIs change
- Maintain backward compatibility when possible

### Quality Standards

#### **Required Patterns**
- ✅ Named imports only
- ✅ Modern function component pattern (no forwardRef unless necessary)
- ✅ Proper `data-slot` attributes
- ✅ Lucide React icons
- ✅ Centralized constants usage
- ✅ TypeScript interfaces for all props
- ✅ Consistent className merging with `cn()` utility

#### **Forbidden Patterns**
- ❌ Default imports for shadcn/ui components
- ❌ Custom SVG icon components (use Lucide React)
- ❌ Magic strings (use constants)
- ❌ Non-standard variants
- ❌ Old forwardRef patterns for new components
- ❌ Inconsistent `data-slot` attributes

This architecture ensures consistency, maintainability, and adherence to modern React and shadcn/ui best practices across the entire application.

## Layout & Component Architecture

The application implements a modern, consistent layout architecture using shadcn/ui components and best practices throughout all layout components.

### Header Component

The header component (`src/components/layout/header.tsx`) provides the main navigation and user authentication interface:

- **Lucide React Icons**: Uses Lucide React icons for all interface elements (Menu icon)
- **shadcn/ui Button Components**: All interactive elements use shadcn/ui Button components with appropriate variants
- **Modular Design**: Admin toggle functionality is extracted to a separate, reusable component
- **TypeScript Support**: Comprehensive TypeScript interfaces for all props and component structure
- **Authentication Integration**: Seamless integration with NextAuth.js for user session management

### Sidebar Component

The sidebar component (`src/components/layout/sidebar.tsx`) provides contextual navigation using modern modal patterns:

- **Sheet Component**: Built on shadcn/ui Sheet component for proper overlay behavior and accessibility
- **Lucide React Icons**: Consistent icon usage with Calendar, BarChart3, and Settings icons
- **Configuration-Driven**: Menu structure defined through centralized configuration in constants
- **Button Components**: All navigation items use shadcn/ui Button components with consistent styling
- **Keyboard Navigation**: Full keyboard navigation support through Sheet component implementation

### Admin Toggle Component

The admin toggle component (`src/components/layout/admin-toggle.tsx`) provides admin mode functionality:

- **shadcn/ui Switch**: Modern toggle interface using the Switch component
- **Accessible Design**: Proper labeling with shadcn/ui Label component for screen readers
- **State Management**: Clean React hooks-based state management
- **Reusable Architecture**: Designed for potential reuse across different parts of the application

### Layout Configuration

Layout components utilize centralized configuration from `src/lib/constants/ui.ts`:

- **SIDEBAR_CONFIG**: Centralized sidebar menu configuration defining sections, icons, and navigation items
- **Icon Mapping**: Systematic mapping of icon names to Lucide React components
- **Styling Standards**: Standardized CSS classes and styling patterns across all layout components

### Architecture Benefits

- **Consistency**: All layout components follow unified shadcn/ui patterns and conventions
- **Maintainability**: Centralized configuration enables easy updates and modifications
- **Accessibility**: Enhanced keyboard navigation and comprehensive screen reader support
- **Performance**: Optimized component rendering through shadcn/ui implementation patterns
- **Developer Experience**: Clean code structure with comprehensive TypeScript support

## Component Quality Standards

The application maintains strict quality standards to ensure consistency, maintainability, and adherence to modern React patterns:

#### **Current Component Inventory**
- **Standard shadcn/ui Components**: All components follow modern patterns with data-slot attributes and named exports
- **Custom Components**: Application-specific components that extend shadcn/ui patterns while maintaining consistency
- **Demo Coverage**: Every component has comprehensive demo pages showcasing all variants and usage patterns

#### **Enforced Standards**
- **Import Consistency**: All components use named imports exclusively
- **Icon Standardization**: Lucide React icons used throughout the application
- **Variant Compliance**: Only officially supported shadcn/ui variants are permitted
- **Pattern Consistency**: All components follow modern function component patterns with proper TypeScript interfaces

#### **Quality Assurance**
- **Build Stability**: All components integrate seamlessly without build errors
- **Type Safety**: Comprehensive TypeScript interfaces and prop definitions
- **Documentation**: Demo pages serve as living documentation for proper component usage
- **Maintainability**: Centralized patterns enable efficient updates and scaling

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

## API & Service Layer Architecture

The application implements a comprehensive API and service layer architecture with standardized error handling, validation, and response formats.

### Error Handling System

The application uses a centralized error handling system located in `src/lib/errors/`:

#### **Base Error Classes** (`src/lib/errors/base.ts`)
- **BaseError**: Abstract base class for all application errors with consistent structure
- **ValidationError**: For input validation failures with detailed field errors
- **AuthenticationError**: For unauthorized access attempts
- **AuthorizationError**: For insufficient permissions
- **NotFoundError**: For missing resources
- **ConflictError**: For resource conflicts
- **InternalServerError**: For unexpected server errors

#### **Service-Specific Errors** (`src/lib/errors/service-errors.ts`)
- **RunNotFoundError**, **RunNumberExistsError**: Run-related errors
- **PhotoServiceError**, **S3ConfigurationError**, **PhotoUploadError**: Photo service errors
- **AttendanceError**, **UserNotFoundError**, **UserAlreadyAttendedError**: Attendance errors
- **RSVPError**: RSVP-related errors
- **GeocodingError**, **NoGeocodingResultsError**, **MapboxTokenError**: Geocoding errors

#### **Error Handling Utilities** (`src/lib/errors/error-handler.ts`)
- **logError()**: Centralized error logging with appropriate levels
- **formatErrorResponse()**: Standardized error response formatting
- **createErrorResponse()**: NextResponse creation from errors
- **withErrorHandler()**: Higher-order function for wrapping API handlers

### Validation Schema System

All API validation is centralized in `src/lib/schemas/` using Zod:

#### **Schema Organization**
- **`run-schemas.ts`**: Run creation, updates, and query validation
- **`rsvp-schemas.ts`**: RSVP operation validation
- **`attendance-schemas.ts`**: Attendance marking validation
- **`photo-schemas.ts`**: Photo upload and management validation
- **`geocoding-schemas.ts`**: Address geocoding validation
- **`index.ts`**: Centralized exports for convenient importing

#### **Schema Benefits**
- **Type Safety**: All schemas generate TypeScript types
- **Consistent Validation**: Standardized error messages and validation rules
- **Reusability**: Schemas are shared between API routes and services
- **Maintainability**: Single source of truth for validation logic

### Service Layer Standards

#### **Service Response Format** (`src/lib/types/service-types.ts`)
```typescript
interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
```

#### **Dependency Injection Pattern**
All services use the ServiceProvider pattern for database access:
- **Testability**: Easy mocking for unit tests
- **Flexibility**: Configurable database clients
- **Consistency**: Standardized service instantiation

#### **Error Propagation**
Services throw typed errors that are caught and handled by API routes:
- **Service Layer**: Throws specific error types (RunNotFoundError, etc.)
- **API Layer**: Catches errors and uses withErrorHandler for consistent responses
- **Client Layer**: Receives standardized error responses

### API Route Architecture

#### **Handler Pattern**
All API routes follow a consistent pattern:
```typescript
async function handlePOST(request: Request) {
  // Validation using centralized schemas
  // Business logic using service layer
  // Return standardized response
}

export const POST = withErrorHandler(handlePOST, 'POST /api/endpoint');
```

#### **Benefits**
- **Consistent Error Handling**: All routes use the same error handling wrapper
- **Centralized Logging**: Automatic error logging with context
- **Type Safety**: Full TypeScript coverage from request to response
- **Maintainability**: Clear separation of concerns between validation, business logic, and error handling

This architecture ensures robust, maintainable, and consistent API behavior across the entire application.

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
