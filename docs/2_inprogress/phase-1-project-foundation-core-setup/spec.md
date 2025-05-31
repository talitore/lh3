## Feature Functionality and Technical Scope

The core functionality is to establish a working Rails 8 application with a modern frontend stack (Vite, Inertia, React, TypeScript, TailwindCSS) and a containerized development/deployment setup (Docker, Kamal). This involves:

1.  **Rails Application Base:** A standard Rails 8 application structure.
2.  **Containerization:**
    - `Dockerfile` for building the application image.
    - `docker-compose.yml` for local development orchestration (app, database, Redis).
    - Initial Kamal configuration (`config/deploy.yml`) for deployment.
3.  **Dependency Management:**
    - `Gemfile` with essential Rails gems (e.g., pg, redis, puma, bootsnap, inertia_rails, vite_rails, etc. as per PRD).
    - `package.json` with frontend dependencies (e.g., react, react-dom, @inertiajs/react, typescript, tailwindcss, vite, eslint, prettier, etc. as per PRD).
4.  **Asset Pipeline & Frontend Build:**
    - Propshaft for asset management.
    - Vite for frontend bundling and development server, configured via `vite.config.ts`.
5.  **Frontend Framework & UI:**
    - Inertia.js for connecting the Rails backend to a React frontend.
    - React with TypeScript (`.tsx`) for building UI components.
    - A basic "Hello World" page (`app/frontend/Pages/Home.tsx`) rendered via an Inertia-enabled controller action.
    - TailwindCSS for styling, configured via `tailwind.config.js` and `app/frontend/styles/application.css`.
6.  **Development Tooling:**
    - RuboCop (with `rubocop-rails-omakase`) for Ruby code linting and formatting.
    - ESLint and Prettier for TypeScript/JavaScript code linting and formatting.

## UI Treatments/Layout Options

For this foundational phase, the primary "UI" is the developer experience and the initial "Hello World" page. The layout options pertain more to project structure and developer workflow rather than visual UI elements for an end-user feature.

**Option 1: Standard Rails Structure with `app/frontend`** (As outlined in PRD)

- **Description:** Keep frontend code within `app/frontend/`, with subdirectories for `entrypoints/`, `Pages/`, `Components/`, `styles/`, etc.
- **Pros:** Familiar to Rails developers, keeps frontend concerns somewhat namespaced within the Rails app structure.
- **Cons:** Can become cluttered if the frontend grows significantly.
- **Use Case:** Good for projects where Rails is the primary driver and the frontend is tightly coupled.

**Option 2: Monorepo-like Structure with Separate `frontend` Directory at Root**

- **Description:** Create a top-level `frontend/` directory alongside `app/`, `config/`, etc. This directory would house all frontend code ( Vite config, `package.json` might live here or at root).
- **Pros:** Clearer separation of concerns between backend and frontend. Potentially easier to manage if the frontend becomes a very large, independent application.
- **Cons:** Less conventional for Rails projects. Might require more configuration to integrate with `vite_rails` and Propshaft seamlessly.
- **Use Case:** Suitable for projects where the frontend is expected to be a large, distinct SPA, potentially managed by a separate team.

**Option 3: Hybrid - `app/frontend` with Stricter Internal Modules**

- **Description:** Stick with `app/frontend` but enforce a more modular internal structure, perhaps using path aliases or clear conventions for feature-based modules within `Pages/` and `Components/`.
- **Pros:** Balances Rails conventions with scalability for a growing frontend.
- **Cons:** Relies on developer discipline to maintain the modularity.
- **Use Case:** A good compromise for most projects that start with Rails and Inertia but anticipate significant frontend development.

## Trade-offs & Decision

- **Option 1 (PRD Aligned):** This is the most straightforward and aligns with the `prd.md`. It's the recommended starting point for simplicity and convention.
- **Option 2:** Introduces complexity early on. Might be overkill unless a very large, decoupled frontend is a definite short-term goal.
- **Option 3:** An evolution of Option 1. Can be adopted later as the frontend grows.

**Decision for Initial Setup:**

[x] Option 1: Standard Rails Structure with `app/frontend` (Recommended based on PRD)
[ ] Option 2: Monorepo-like Structure
[ ] Option 3: Hybrid Approach

**Justification for Decision (User to fill):**

## Web Search & Best Practices Documentation

- **Rails 8:** Official Rails Guides (edgeguides.rubyonrails.org)
- **Docker:** Docker Documentation (docs.docker.com)
- **Kamal:** Kamal GitHub Repository & Documentation (kamal-deploy.org)
- **Vite:** Vite Documentation (vitejs.dev)
- **Inertia.js:** Inertia.js Documentation (inertiajs.com)
- **React:** React Documentation (react.dev)
- **TypeScript:** TypeScript Documentation (typescriptlang.org)
- **Tailwind CSS:** Tailwind CSS Documentation (tailwindcss.com)
- **Propshaft:** Propshaft GitHub Repository (github.com/rails/propshaft)
- **RuboCop (`rubocop-rails-omakase`):** Gem documentation on Rubygems or GitHub.
- **ESLint & Prettier:** Their respective official documentation sites.
