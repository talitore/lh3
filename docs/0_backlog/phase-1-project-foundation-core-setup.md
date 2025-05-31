## Phase 1: Project Foundation & Core Setup

### Objective

Establish the foundational Rails application, Docker environment, essential gems, and frontend tooling.

### PRD Alignment

- Section 1: Initial Setup & Boilerplate
- Section 2: Rails + Inertia + Vite Integration (partial - initial setup)
- Section 9: Linting, Formatting & CI (initial setup)

### User Stories Covered

- (None directly, but sets the stage for all)

### Key Tasks

1.  **Provision Rails App:**
    - Generate Rails 8 app as per `prd.md#1.1`.
    - Initial commit.
2.  **Docker + Kamal Setup:**
    - Create `Dockerfile` (`prd.md#1.2`).
    - Create `docker-compose.yml` for local development (app, db, redis).
    - Initial Kamal configuration (`config/deploy.yml` or `kamal.rb`) (`prd.md#1.2`).
3.  **Gemfile & Package.json:**
    - Add core gems from `prd.md#1.3` to `Gemfile`.
    - Run `bundle install`.
    - Initialize `package.json` with `pnpm init -y`.
    - Add core JS packages from `prd.md#1.3`.
    - Run `pnpm install`.
    - Commit lockfiles.
4.  **Propshaft & Asset Pipeline:**
    - Configure Propshaft in `config/application.rb` (`prd.md#2.1`).
    - Create `app/assets/` structure if needed.
5.  **Vite Setup:**
    - Run `bundle exec vite install`.
    - Configure `vite.config.ts` (`prd.md#2.2`).
    - Add `dev` and `build` scripts to `package.json`.
6.  **Basic Inertia Rails Config:**
    - Create `config/initializers/inertia_rails.rb` (`prd.md#2.3`).
    - Create `app/views/layouts/application.html.erb` with Vite/Inertia tags (`prd.md#2.3`, `prd.md#2.4`).
7.  **React/TS Entrypoint:**
    - Create `app/frontend/entrypoints/application.tsx` (`prd.md#2.4`).
    - Create basic `app/frontend/Pages/Home.tsx` (e.g., displaying "Hello World").
    - Create a root route in `config/routes.rb` pointing to an action that renders `Inertia.render('Home')`.
8.  **Tailwind CSS Integration:**
    - Initialize Tailwind: `pnpm dlx tailwindcss init` (`prd.md#2.5`).
    - Configure `tailwind.config.js` (`prd.md#2.5`).
    - Create `app/frontend/styles/application.css` (`prd.md#2.5`).
9.  **Linting Setup:**
    - Configure RuboCop with `rubocop-rails-omakase` (`prd.md#9.1`).
    - Configure ESLint & Prettier for TSX (`prd.md#9.2`).
    - Add linting scripts to `package.json`.

### Best Practices & Considerations

- Create a `.env.example` and use `.env` for local development secrets.
- Establish initial directory structure in `app/frontend/` (Pages, Components, etc. as per `prd.md#6`).

### Testing

- **User-Verifiable:**
  - `docker-compose up` successfully starts app, db, redis.
  - Rails app runs: `bin/dev` (or equivalent using Vite and Rails server separately).
  - Navigate to the root URL. See "Hello World" (or similar) rendered via React/Inertia/Vite, styled by Tailwind.
  - `bundle exec rubocop` runs without errors on initial codebase.
  - `pnpm run lint:js` runs without errors on initial frontend code.

### Deliverables

- A running Rails application with Vite, Inertia, React, and TailwindCSS integrated.
- Dockerized development environment.
- Basic "Hello World" page rendered via Inertia.
- Linters configured and passing.
