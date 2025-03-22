# LH3 Project Guide

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build project for production
- `npm run start` - Run production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push schema changes to database (currently uses in-memory store)

## Code Style Guidelines

- **TypeScript**: Always use proper type definitions, avoid `any`
- **Imports**: Group imports by source (React, then libraries, then local)
- **Component Structure**: Follow React functional component pattern with hooks
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Use try/catch blocks with explicit error types
- **State Management**: Use React Query for server state, React hooks for UI state
- **API Calls**: Structure RESTful endpoints in server/routes.ts
- **Database Access**: Use storage.ts methods for database operations
- **Auth Logic**: Use hooks/use-auth.tsx for authentication logic

## Project Architecture

- **Client**: React + Tailwind UI (shadcn/ui components)
- **Server**: Express.js with Passport for authentication
- **Database**: In-memory store with Drizzle ORM interface (MemStorage)
- **Schema**: Defined in shared/schema.ts using Drizzle with Zod validation
