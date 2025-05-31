# Tech Stack

1.  **Backend Framework:** Ruby on Rails 8.x.
2.  **Database:** PostgreSQL.
3.  **Web Server:** Puma.
4.  **Asset Pipeline (Rails):** Propshaft.
5.  **Background Jobs:** Solid Queue (database-backed).
6.  **Caching:** Solid Cache (database-backed).
7.  **WebSockets:** Solid Cable (database-backed).
8.  **Frontend Build Tool:** Vite.js.
9.  **Frontend JavaScript Framework/Library:** React.
10. **Frontend Language:** TypeScript.
11. **Server-Client Integration:** Inertia.js (with React adapter and SSR).
12. **CSS Framework:** Tailwind CSS.
13. **UI Component Primitives:** Headless UI and Radix UI (styled with Tailwind).
14. **Icons:** Lucide React.
15. **Forms (Frontend):** React Hook Form.
16. **Schema Definition/Validation:** Zod.
17. **Deployment:** Docker, managed with Kamal.
18. **Testing Framework:** RSpec for Rails, Capybara for system tests.
19. **Test Data:** Factory Bot.
20. **Linting/Formatting:**
    - Ruby: RuboCop (with `rubocop-rails-omakase`).
    - JavaScript/TypeScript: ESLint and Prettier.
21. **JavaScript Package Manager:** pnpm.
22. **Authentication:** [Authentication Zero](https://github.com/lazaronixon/authentication-zero)
23. **Authorization:** Pundit.
24. **CSS Framework:** shadcn/ui, tailwindcss v4

**To create the skeleton:**

- Initialize a new Rails 8 application with PostgreSQL.
- Add the `vite_rails` gem and set up Vite with React and TypeScript.
- Install `inertia_rails` and configure it for React.
- Set up Tailwind CSS with Vite, including `prettier-plugin-tailwindcss` and other relevant Tailwind plugins (`@tailwindcss/forms`, `@tailwindcss/typography`).
- Add `pundit` for authorization.
- Add `rspec-rails`, `factory_bot_rails`, `capybara`, `shoulda-matchers`, and `database_cleaner-active_record` for the testing suite.
- Include `js-routes` for Rails routes in JS.
- Add `lucide-react` for icons, `react-hook-form` for forms, `zod` for validation, `sonner` for notifications, and the utility libraries (`clsx`, `tailwind-merge`, `class-variance-authority`).
- Set up ESLint and Prettier for both backend (RuboCop) and frontend.
- Use `pnpm` as the JS package manager.
- Configure `Procfile.dev` for running Vite and Rails servers.
- Consider using `solid_cache`, `solid_queue`, and `solid_cable` if you anticipate needing those functionalities from the start.
- The directory structure (`app/frontend/components`, `layouts`, `pages`, `ssr` etc.) reflects a common pattern for Inertia.js with Vite and Rails.

This should give you a solid foundation for rebuilding the application's structure without its specific business logic or multi-tenancy features.
