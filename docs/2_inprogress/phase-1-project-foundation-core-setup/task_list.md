1.  **Provision Rails App:**
    - [~] Generate Rails 8 app (Done, but `bundle install` had issues, now resolved. Initial commit pending).
    - [ ] Initial commit.
2.  **Docker + Kamal Setup:**
    - [ ] Create `Dockerfile`.
    - [ ] Create `docker-compose.yml` for local development (app, db, redis).
    - [ ] Initial Kamal configuration (`config/deploy.yml`).
3.  **Gemfile & Package.json:**
    - [ ] Add core gems to `Gemfile` (as per PRD).
    - [~] Run `bundle install` (Done multiple times, `vite_rails` added).
    - [ ] Initialize `package.json` with `pnpm init -y` (npm was used by `vite install`, PRD prefers `pnpm`).
    - [ ] Add core JS packages (as per PRD).
    - [ ] Run `pnpm install`.
    - [ ] Commit lockfiles.
4.  **Propshaft & Asset Pipeline:**
    - [x] Configure Propshaft in `config/application.rb` (Done by `rails new`).
    - [x] Create `app/assets/` structure (Done by `rails new`).
5.  **Vite Setup:**
    - [x] Run `bundle exec vite install`.
    - [x] Configure `vite.config.ts`.
    - [x] Add `dev` and `build` scripts to `package.json`.
6.  **Basic Inertia Rails Config:**
    - [ ] Create `config/initializers/inertia_rails.rb`.
    - [ ] Create `app/views/layouts/application.html.erb` with Vite/Inertia tags.
7.  **React/TS Entrypoint:**
    - [ ] Create `app/frontend/entrypoints/application.tsx`.
    - [ ] Create `app/frontend/Pages/Home.tsx`.
    - [ ] Create a root route in `config/routes.rb` for `Inertia.render('Home')`.
8.  **Tailwind CSS Integration:**
    - [ ] Initialize Tailwind: `pnpm dlx tailwindcss init`.
    - [ ] Configure `tailwind.config.js`.
    - [ ] Create `app/frontend/styles/application.css`.
9.  **Linting Setup:**
    - [ ] Configure RuboCop with `rubocop-rails-omakase`.
    - [ ] Configure ESLint & Prettier for TSX.
    - [ ] Add linting scripts to `package.json`.
10. **Create `.env.example` and `.env` files.**
11. \*\*Establish initial directory structure in `app/frontend/`.
