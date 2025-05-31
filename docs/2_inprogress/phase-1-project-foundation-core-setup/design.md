## Architectural Thoughts & Design Considerations

This foundational phase is about setting up the skeleton of the application. The architecture should be clean, maintainable, and scalable.

**Core Principles (SLC - Simple, Lovable, Complete):**

- **Simple:** The initial setup should be as straightforward as possible, adhering to Rails conventions and minimizing unnecessary complexity. The developer experience (`dx`) is paramount here; easy setup, clear directory structures, and well-defined build/run processes are key.
  - _Initial Simplicity:_ Use standard Rails generators, `bundle exec vite install`, and `pnpm dlx tailwindcss init` to keep the setup conventional.
  - _Configuration:_ Keep `vite.config.ts`, `tailwind.config.js`, and `config/initializers/inertia_rails.rb` clean and well-commented.
- **Lovable:** For developers, a lovable setup is one that is fast, reliable, and easy to debug. For the initial "Hello World" page, it should demonstrate that the tech stack is working harmoniously.
  - _Developer Ergonomics:_ Fast feedback loops with Vite HMR. Linters and formatters integrated into the development workflow.
  - _Clear Structure:_ The `app/frontend` directory should be organized logically (e.g., `Pages`, `Components`, `Layouts`, `styles`, `entrypoints`).
- **Complete:** The setup must be fully functional to the point where a developer can pull the repository, run a setup script (or a few simple commands), and have a working development environment that serves a basic page through the entire stack (Rails -> Inertia -> Vite -> React -> Browser).
  - _End-to-End Functionality:_ The root route should render the `Home.tsx` page successfully, with Tailwind styles applied.
  - _Environment Parity (Initial):_ `docker-compose.yml` should provide a local environment that closely mirrors the services needed for production (app, db, redis).

**Visual Sketches/Component Interactions (Conceptual for Dev Setup):**

Not applicable in the traditional UI sense, but we can think of the "components" of the development system:

1.  **`bin/dev` (or equivalent):** Single command to start all necessary processes (Rails server, Vite dev server).
    - _Interaction:_ Developer runs `bin/dev`. Output from Rails and Vite are interleaved or clearly separated in the terminal.
2.  **Directory Structure:**
    ```
    app/
      frontend/
        components/
        entrypoints/
          application.tsx
        Pages/
          Home.tsx
        styles/
          application.css
    config/
      initializers/
        inertia_rails.rb
      routes.rb
    vite.config.ts
    tailwind.config.js
    Dockerfile
    docker-compose.yml
    ```
3.  **"Hello World" Page (`Home.tsx`):**
    - A simple React component displaying a heading (e.g., "Welcome to lh3") and a paragraph (e.g., "Powered by Rails, Vite, Inertia, React, and Tailwind CSS.").
    - Styled with basic Tailwind classes to confirm CSS processing (e.g., centered text, a background color).

**Key Architectural Decisions from `phase-1-project-foundation-core-setup.md`:**

- **Rails 8 as Backend API/Controller Layer:** Standard MVC.
- **Inertia.js as the Glue:** Avoids building a separate API for simple page loads. Rails controllers render Inertia responses, passing props directly to frontend components.
- **Vite for Frontend Asset Bundling:** Fast HMR, modern JS tooling.
- **React with TypeScript:** Type safety and component-based UI.
- **Tailwind CSS:** Utility-first CSS framework.
- **Docker & Kamal:** Containerization for development consistency and deployment.
- **Propshaft:** Asset pipeline.

**Future Considerations (to keep in mind but not over-engineer now):**

- **State Management:** For more complex frontend interactions, a state management library (e.g., Zustand, Jotai, or Redux Toolkit) might be needed. Not for "Hello World".
- **API Design:** If more complex data fetching is needed beyond Inertia's initial props, a dedicated API strategy (GraphQL or RESTful endpoints) might evolve.
- **Component Library:** As UI grows, a shared component library within `app/frontend/components/` will be crucial. Potentially Storybook for development and testing of these components.

This initial phase prioritizes getting a robust, developer-friendly foundation in place, following the guidelines of SLC to ensure it's simple to get started, lovable for developers to work with, and complete enough to build upon.
