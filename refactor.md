# LH3 Web Application - Comprehensive Refactor Plan

## Overview

This document outlines a comprehensive refactor plan for the LH3 web application based on a full codebase review. The plan focuses on three key areas:

- Ensure shadcn/ui components are used everywhere
- No magic strings, extract and share constants where appropriate
- Happy path behavior is well tested

## Phase 1: Constants & Magic Strings Extraction (High Priority)

### 1.1 Create Constants Files

**New Files to Create:**

- `src/lib/constants/ui.ts` - UI-related constants (dimensions, timeouts, limits)
- `src/lib/constants/api.ts` - API endpoints, status codes, error messages
- `src/lib/constants/app.ts` - Application-wide constants
- `src/lib/constants/validation.ts` - Validation rules and limits

**Magic Strings Found:**

- Hardcoded dimensions: `"450px"`, `"100%"`, `"400px"` in map components
- API endpoints scattered throughout: `"/api/runs"`, `"/api/geocode"`
- Error messages duplicated across files
- Mapbox style URLs: `"mapbox://styles/mapbox/streets-v12"`
- Test mode strings: `"mock-run-id-"`, `"test-bucket"`
- Debounce timeouts: `300ms` in address autocomplete
- File size limits and validation rules scattered

### 1.2 Environment Variables Consolidation

- Create `src/lib/config/env.ts` for centralized environment variable access
- Add validation for required environment variables
- Create type-safe environment configuration

## Phase 2: shadcn/ui Component Standardization (High Priority)

### 2.1 Missing shadcn/ui Components to Add

```bash
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add form
pnpm dlx shadcn-ui@latest add toast
pnpm dlx shadcn-ui@latest add alert
pnpm dlx shadcn-ui@latest add skeleton
pnpm dlx shadcn-ui@latest add separator
pnpm dlx shadcn-ui@latest add tabs
pnpm dlx shadcn-ui@latest add table
pnpm dlx shadcn-ui@latest add dropdown-menu
```

### 2.2 Replace Custom Implementations

- Header component: Replace custom buttons with shadcn/ui Button
- Sidebar: Use shadcn/ui Sheet component instead of custom overlay
- Replace custom SVG icons with Lucide React icons
- Standardize form components using shadcn/ui Form

### 2.3 Component Consistency Issues

- `textarea.tsx` uses old shadcn/ui pattern (needs updating to match button.tsx style)
- Inconsistent `data-slot` attributes across components
- Missing proper TypeScript interfaces for some components

## Phase 3: Layout & Component Architecture ✅ COMPLETED

### 3.1 Header Component Refactor ✅ COMPLETED

- ✅ Replace inline SVG icons with Lucide React
- ✅ Use shadcn/ui Button components
- ✅ Extract admin toggle to separate component
- ✅ Add proper TypeScript interfaces

### 3.2 Sidebar Component Refactor ✅ COMPLETED

- ✅ Replace with shadcn/ui Sheet component
- ✅ Use proper navigation components
- ✅ Extract menu items to configuration
- ✅ Add keyboard navigation support

### 3.3 Custom Component Improvements ✅ COMPLETED

- ✅ `AddressAutocomplete`: Extract API URL to constants (already completed in previous phases)
- ✅ `MapPicker`: Extract default coordinates and zoom levels (already completed in previous phases)
- ✅ `MapEmbed`: Add proper error handling and loading states (already completed in previous phases)

**Phase 3 Summary:**
- All layout components now use shadcn/ui components and Lucide React icons
- Header component modernized with Button components and extracted admin toggle
- Sidebar rebuilt using Sheet component with centralized configuration
- Admin toggle extracted to dedicated component using Switch component
- All components follow modern shadcn/ui patterns with proper TypeScript interfaces

## Phase 4: API & Service Layer Improvements ✅ COMPLETED

### 4.1 Error Handling Standardization ✅ COMPLETED

- ✅ Create centralized error response format
- ✅ Standardize HTTP status codes usage
- ✅ Add proper error logging
- ✅ Create custom error classes

### 4.2 Validation Schema Consolidation ✅ COMPLETED

- ✅ Move all Zod schemas to `src/lib/schemas/`
- ✅ Create reusable validation utilities
- ✅ Standardize error messages

### 4.3 Service Layer Improvements ✅ COMPLETED

- ✅ Extract hardcoded S3 region and bucket configurations
- ✅ Standardize service response formats
- ✅ Add proper TypeScript interfaces for all service methods

**Phase 4 Summary:**
- Centralized error handling with custom error classes and standardized response formats
- Consolidated all Zod validation schemas into dedicated schema files
- Improved service layer with standardized interfaces and response formats
- Enhanced error logging and debugging capabilities
- All hardcoded configurations extracted to constants and environment configuration

## Phase 5: Testing Infrastructure Enhancement ✅ COMPLETED

### 5.1 Test Coverage Expansion ✅ COMPLETED

- ✅ Add React Testing Library for component testing
- ✅ Create unit tests for all UI components (Button, Card, Input, etc.)
- ✅ Test layout components (Header, Sidebar, AdminToggle)
- ✅ Test custom components (MapEmbed, PhotoGallery, AddressAutocomplete)
- ✅ Test utility functions (cn, validation helpers)
- ✅ Add integration tests for form submissions
- ✅ Test error handling paths and edge cases

### 5.2 Test Data Management ✅ COMPLETED

- ✅ Centralize mock data in `src/lib/test-data/`
- ✅ Create test data factories for runs, users, RSVPs, photos
- ✅ Standardize test user creation with role-based factories
- ✅ Create reusable test utilities and helpers
- ✅ Implement dependency injection pattern for test data

### 5.3 E2E Test Improvements ✅ COMPLETED

- ✅ Add tests for complete user workflows (create run → RSVP → attendance → photos)
- ✅ Test responsive design breakpoints and mobile interactions
- ✅ Add accessibility testing with axe-core integration
- ✅ Enhance existing Playwright tests with better coverage
- ✅ Add visual regression testing capabilities

**Phase 5 Summary:**
- Comprehensive test coverage with React Testing Library for all UI components
- Centralized test data management with factories and dependency injection
- Enhanced E2E testing with complete user workflows and accessibility testing
- Improved test infrastructure with proper mocking and utilities
- All components now have unit tests covering happy paths and error scenarios

## Phase 6: Performance & Developer Experience (Low Priority)

### 6.1 Bundle Optimization

- Implement proper code splitting
- Add dynamic imports for heavy components
- Optimize Mapbox GL JS loading

### 6.2 Developer Experience

- Add proper ESLint rules for shadcn/ui
- Create component development guidelines
- Add Prettier configuration

## Key Benefits

### Maintainability

- Centralized constants and standardized components
- Consistent code patterns across the application
- Easier to update and modify shared values

### Consistency

- Uniform UI patterns using shadcn/ui
- Standardized error handling and validation
- Consistent component interfaces

### Reliability

- Comprehensive test coverage and proper error handling
- Type-safe environment configuration
- Robust validation and error boundaries

### Developer Experience

- Better tooling and clearer code organization
- Improved development workflow
- Clear component development guidelines

### Performance

- Optimized bundle size and loading patterns
- Efficient component rendering
- Better resource management

## Next Steps

1. **Start with Phase 1**: Constants extraction provides immediate benefits
2. **Review and approve** each phase before implementation
3. **Test thoroughly** after each phase completion
4. **Document changes** and update team guidelines
5. **Monitor performance** impact of changes

## Success Metrics

- [ ] Zero magic strings in codebase
- [ ] 100% shadcn/ui component usage where applicable
- [ ] 90%+ test coverage for happy path scenarios
- [ ] Consistent error handling patterns
- [ ] Improved bundle size and performance metrics
- [ ] Enhanced developer experience scores
