# PRD

## 1. Initial Setup & Boilerplate

1. **Provision the Git repo & directory structure**

   - Create a new Rails 8 app with the minimal flag (no default XHR stacks):

     ```bash
     rails new lh3 \
       --database=postgresql \
       --skip-action-mailbox \
       --skip-action-text \
       --skip-active-storage \
       --skip-sprockets \
       --skip-webpack-install \
       --skip-javascript \
       --skip-turbolinks \
       --skip-test \
       --skip-system-test
     ```

   - Commit the “bare” Rails structure and push to your main Git branch.

2. **Set up Docker + Kamal**

   - Write a `Dockerfile` that:

     - Installs Ruby 3.x (matching Rails 8).
     - Installs Node 18+ (for Vite/npm).
     - Copies your Gemfile/`package-lock.json` and runs `bundle install` / `npm install`.
     - Precompiles assets (we’ll wire this up to Vite soon).
     - Sets `CMD ["bin/rails", "server", "-b", "0.0.0.0"]` or uses Kamal’s entrypoint if desired.

   - Create a `docker-compose.yml` (or let Kamal generate one) with services:

     - **app** (your Rails + Inertia server)
     - **db** (PostgreSQL, version 14+)
     - **redis** (if you plan to run Solid Cache/Solid Queue as separate processes—although database‐backed queue/cache may not strictly need Redis)

   - Configure Kamal: add a `kamal.rb` (or `kamal.yml`) that defines your staging/production Docker image registry, server SSH credentials, and deploy hooks.

3. **Gemfile / Package.json stubs**

   - **Gemfile** (add these lines early):

     ```ruby
     gem "rails", "~> 8.0"
     gem "puma"
     gem "pg"
     gem "propshaft"
     gem "solid_queue"
     gem "solid_cache"
     gem "solid_cable"
     gem "inertia_rails"
     gem "authentication_zero"
     gem "pundit"
     gem "rspec-rails", group: [:development, :test]
     gem "factory_bot_rails", group: :test
     gem "capybara", group: :test
     gem "rubocop-rails-omakase", require: false, group: [:development]
     ```

   - **package.json** (in your Rails root, initialize with `npm init -y` and then install):

     ```bash
     npm add react react-dom inertiajs/inertia inertiajs/inertia-react vite tailwindcss@4 @headlessui/react @radix-ui/react-primitive lucide-react react-hook-form zod
     npm add -D vite-plugin-ruby eslint prettier
     ```

   - Commit your updated Gemfile.lock and `package-lock.json`.

---

## 2. Rails + Inertia + Vite Integration

1. **Propshaft & Asset Pipeline**

   - In `config/application.rb`, ensure Propshaft is enabled:

     ```ruby
     config.assets.enabled = true
     config.assets.build_runner = "VitePhoenix::Runner" # if you use a Vite runner, otherwise default Propshaft pipeline
     config.assets.css_compressor = nil
     config.assets.js_compressor = nil
     ```

   - Create a `Propshaft` folder structure under `app/assets/` if you have any static images/fonts you’ll reference from Rails.

2. **Vite Setup**

   - Run `bundle exec vite install` (this will install `vite.config.ts`, `app/frontend` folder, and stub out default Vite scripts).
   - In `vite.config.ts`, configure:

     ```ts
     import { defineConfig } from 'vite';
     import RubyPlugin from 'vite-plugin-ruby';

     export default defineConfig({
       plugins: [
         RubyPlugin({
           input: [
             'app/frontend/entrypoints/application.tsx',
             // any other entrypoints—e.g. admin_panel.tsx
           ],
           publicFolder: 'app/assets/builds',
         }),
       ],
     });
     ```

   - In `package.json`, add scripts:

     ```jsonc
     {
       "scripts": {
         "dev": "vite dev",
         "build": "vite build"
       }
     }
     ```

3. **Inertia Rails Configuration**

   - Add to `config/initializers/inertia_rails.rb`:

     ```ruby
     InertiaRails.configure do |config|
       config.version = "1.0"  # bump on new releases
       config.root_view = "app/views/layouts/application.html.erb"
       config.ssr = false      # (start without SSR; can enable later if needed)
     end
     ```

   - Generate the default Inertia layout:

     ```erb
     <!-- app/views/layouts/application.html.erb -->
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="utf-8" />
         <meta name="viewport" content="width=device-width,initial-scale=1" />
         <%= csrf_meta_tags %>
         <%= csp_meta_tag %>
         <link rel="stylesheet" href="<%= vite_asset_path('application.css') %>" />
         <script type="module" src="<%= vite_asset_path('application.tsx') %>"></script>
       </head>
       <body>
         <%= inertia %>
       </body>
     </html>
     ```

4. **React / TypeScript Entrypoint**

   - Create `app/frontend/entrypoints/application.tsx`:

     ```tsx
     import React from 'react';
     import { createRoot } from 'react-dom/client';
     import { InertiaApp } from '@inertiajs/inertia-react';
     import '../styles/application.css';

     const el = document.getElementById('app');
     const root = createRoot(el!);

     root.render(
       <InertiaApp
         initialPage={JSON.parse(el!.dataset.page!)}
         resolveComponent={(name) =>
           import(`../Pages/${name}`).then((module) => module.default)
         }
       />
     );
     ```

   - Ensure you have a `data-page` hook in the Rails layout:

     ```erb
     <div id="app" data-page="<%= raw(InertiaRails.page.to_json) %>"></div>
     ```

5. **Tailwind CSS (v4) Integration**

   - Install Tailwind config:

     ```bash
     npm dlx tailwindcss init
     ```

   - In `tailwind.config.js`, point to your Inertia™️ “Pages” and React components:

     ```js
     module.exports = {
       content: ['./app/frontend/**/*.{js,jsx,ts,tsx}', './app/views/**/*.erb'],
       theme: { extend: {} },
       plugins: [],
     };
     ```

   - Create `app/frontend/styles/application.css`:

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

   - Add shadcn/ui scaffolding (if you already ran `npx shadcn-ui init` inside `app/frontend`, you’ll have a `components/` folder). Otherwise, add HeadlessUI/Radix UI imports in your React components as you build.

---

## 3. Authentication & Authorization

1. **Authentication Zero Setup**

   - Run the installer:

     ```bash
     rails generate authentication_zero:install
     rails db:migrate
     ```

   - This scaffolds user registration, login, password resets, and a `User` model plus `SessionController`/`RegistrationsController`.
   - Verify Inertia controllers for login/register pages: you’ll likely want to wrap Authentication Zero’s views in Inertia. For example:

     ```ruby
     # app/controllers/sessions_controller.rb
     class SessionsController < AuthenticationZero::SessionsController
       def new
         render inertia: "Auth/Login"
       end
     end
     ```

   - Build corresponding React pages in `app/frontend/Pages/Auth/Login.tsx`, etc., using React Hook Form + Zod for validation.

2. **Pundit Setup**

   - Add to `application_controller.rb`:

     ```ruby
     include Pundit
     rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

     private
     def user_not_authorized(exception)
       render inertia: "Errors/Unauthorized", props: { message: exception.message }, status: :forbidden
     end
     ```

   - Generate policies for Event, RSVP, Photo, etc., once you define those models (in a later step). For now, stub out an `app/policies` folder and add a `UserPolicy` that allows default actions.

---

## 4. Data Modeling & Migrations

1. **User Model**

   - Already created by Authentication Zero: fields include `email`, `encrypted_password`, `name`, etc.
   - Add any extra columns you need (e.g. `avatar_url:string`, `display_name:string`) via migration:

     ```bash
     rails g migration AddFieldsToUsers display_name:string avatar_url:string
     rails db:migrate
     ```

2. **Event (Run) Model**

   - Generate scaffold without views (we’ll use Inertia instead of default ERB):

     ```bash
     rails g model Event \
       run_number:integer:index \
       descriptor:string \
       date:date \
       time:time \
       address:string \
       latitude:decimal{10,6} \
       longitude:decimal{10,6} \
       intro_link:string \
       created_by:bigint:index \
       phtml:false \
       timestamps
     rails db:migrate
     ```

   - Add associations in `app/models/event.rb`:

     ```ruby
     class Event < ApplicationRecord
       belongs_to :creator, class_name: "User", foreign_key: :created_by
       has_many :rsvps, dependent: :destroy
       has_many :attendances, dependent: :destroy
       has_many :photos, dependent: :destroy

       validates :run_number, presence: true, uniqueness: true
       validates :descriptor, presence: true
       validates :date, :time, :address, presence: true
     end
     ```

3. **RSVP & Attendance Models**

   - We’ll combine “RSVP” and “Attendance” into one table that toggles status (for simplicity):

     ```bash
     rails g model Rsvp \
       user:references:index \
       event:references:index \
       status:string \
       attended_at:datetime \
       timestamps
     rails db:migrate
     ```

   - In `app/models/rsvp.rb`:

     ```ruby
     class Rsvp < ApplicationRecord
       belongs_to :user
       belongs_to :event

       STATUSES = %w[pending yes no]

       validates :status, inclusion: { in: STATUSES }
     end
     ```

   - In `app/models/user.rb`:

     ```ruby
     class User < ApplicationRecord
       has_many :rsvps, dependent: :destroy
       has_many :events, through: :rsvps
       # other associations…
     end
     ```

4. **Photo & Album Models**

   - We’ll store each photo as its own record, and group them into an “album” by event_id. If we ever want a separate Album object, we can add that later. For now:

     ```bash
     rails g model Photo \
       event:references:index \
       user:references:index \
       image_url:string \
       alt_text:string \
       timestamps
     rails db:migrate
     ```

   - In `app/models/photo.rb`:

     ```ruby
     class Photo < ApplicationRecord
       belongs_to :event
       belongs_to :user

       validates :image_url, presence: true
     end
     ```

5. **Geocoding**

   - Because we want “address → lat/lng,” install a gem like `geocoder`:

     ```ruby
     # Gemfile
     gem "geocoder"
     ```

   - Run `bundle install`, then add to `Event` model:

     ```ruby
     class Event < ApplicationRecord
       geocoded_by :address
       after_validation :geocode, if: ->(obj){ obj.address_changed? }

       # …existing associations & validations
     end
     ```

   - This lets you supply `event.address = "1234 Some Trail Rd, Lawrence, KS"`, then on `save` ActiveRecord auto‐sets `latitude`/`longitude`.

---

## 5. Core Controller & Policy Development

1. **EventsController (Inertia)**

   - Generate:

     ```bash
     rails g controller Events index show new edit create update destroy
     ```

   - Replace default ERB actions with Inertia responses. Example:

     ```ruby
     class EventsController < ApplicationController
       before_action :authenticate_user!
       before_action :set_event, only: %i[show edit update destroy]

       def index
         @events = Event.order(date: :asc).includes(:rsvps, :photos)
         render inertia: "Events/Index", props: {
           events: @events.as_json(
             only: %i[id run_number descriptor date time address latitude longitude intro_link],
             methods: %i[rsvp_count attendance_count photo_count]
           )
         }
       end

       def show
         authorize @event
         render inertia: "Events/Show", props: {
           event: @event.as_json(
             include: {
               rsvps: { include: { user: { only: %i[id display_name avatar_url] } }, only: %i[id status attended_at] },
               photos: { only: %i[id image_url alt_text user_id] }
             }
           ),
           current_user_id: current_user.id
         }
       end

       def new
         authorize Event
         render inertia: "Events/New"
       end

       def create
         authorize Event
         @event = current_user.created_events.build(event_params)
         if @event.save
           redirect_to inertia_redirect_to: event_path(@event)
         else
           render inertia: "Events/New", props: { errors: @event.errors.full_messages }
         end
       end

       # edit/update/destroy: similar pattern, using Pundit
       private

       def set_event
         @event = Event.find(params[:id])
       end

       def event_params
         params.require(:event).permit(
           :run_number, :descriptor, :date, :time, :address, :intro_link
         )
       end
     end
     ```

2. **RsvpsController (for RSVP + attendance)**

   - Generate:

     ```bash
     rails g controller Rsvps create update
     ```

   - Typical actions:

     ```ruby
     class RsvpsController < ApplicationController
       before_action :authenticate_user!
       before_action :set_event

       def create
         @rsvp = @event.rsvps.new(user: current_user, status: "yes")
         if @rsvp.save
           render json: { success: true, rsvp: @rsvp }, status: :created
         else
           render json: { success: false, errors: @rsvp.errors.full_messages }, status: :unprocessable_entity
         end
       end

       def update
         @rsvp = @event.rsvps.find_by(user: current_user)
         if @rsvp.update(rsvp_params)
           render json: { success: true, rsvp: @rsvp }
         else
           render json: { success: false, errors: @rsvp.errors.full_messages }, status: :unprocessable_entity
         end
       end

       private

       def set_event
         @event = Event.find(params[:event_id])
       end

       def rsvp_params
         params.require(:rsvp).permit(:status, :attended_at)
       end
     end
     ```

   - In Pundit, create `RsvpPolicy` so only the RSVP owner can update their status/attendance. Organizers (event.creator) can also view/modify all RSVPs.

3. **PhotosController (for Upload & Album Management)**

   - Generate:

     ```bash
     rails g controller Photos create destroy
     ```

   - Basic create action (we’ll assume direct‐to‐S3 or Cloudinary is handled on the front end, and Rails just stores URLs):

     ```ruby
     class PhotosController < ApplicationController
       before_action :authenticate_user!
       before_action :set_event

       def create
         @photo = @event.photos.new(
           user: current_user,
           image_url: params[:image_url],
           alt_text: params[:alt_text]
         )

         if @photo.save
           render json: { success: true, photo: @photo }, status: :created
         else
           render json: { success: false, errors: @photo.errors.full_messages }, status: :unprocessable_entity
         end
       end

       def destroy
         @photo = @event.photos.find(params[:id])
         authorize @photo
         if @photo.destroy
           render json: { success: true }
         else
           render json: { success: false }, status: :unprocessable_entity
         end
       end

       private

       def set_event
         @event = Event.find(params[:event_id])
       end
     end
     ```

   - Authorize via `PhotoPolicy` so that either the uploader or event creator can delete.

---

## 6. Front-End: React Pages & Components

> **Folder structure suggestion inside `app/frontend`:**
>
> ```
> ├── entrypoints/
> │   └── application.tsx
> ├── Pages/
> │   ├── Events/
> │   │   ├── Index.tsx
> │   │   ├── Show.tsx
> │   │   ├── New.tsx
>   │   │   └── Edit.tsx
> │   ├── Auth/
> │   │   ├── Login.tsx
> │   │   └── Register.tsx
> │   ├── Errors/Unauthorized.tsx
> │   └── Dashboard.tsx
> ├── Components/
> │   ├── Layouts/
> │   │   ├── AppLayout.tsx
> │   │   └── AdminLayout.tsx
> │   ├── EventCard.tsx
> │   ├── EventForm.tsx
> │   ├── RSVPButton.tsx
> │   ├── AttendanceToggle.tsx
> │   ├── PhotoUploader.tsx
> │   ├── PhotoGallery.tsx
> │   ├── MapPicker.tsx
> │   ├── AddressInput.tsx
> │   └── “WhatIsHashing”Link.tsx
> ├── Hooks/
> │   └── useGeocode.ts
> ├── ZodSchemas/
> │   └── eventSchema.ts
> └── styles/
>     └── application.css
> ```

1. **Global Layout (AppLayout.tsx)**

   - Contains the top nav (“lh3” logo, Feed/Events/Members links, Admin Mode toggle if `current_user.is_admin`).
   - Sidebar with “Upcoming Events” and “Quick Stats” cards.
   - Footer (if desired).
   - Wraps `{children}` in a container with padding and max‐width.
   - Use Tailwind utility classes (e.g. `flex`, `space-x-4`, `bg-white`, `dark:bg-gray-900`, etc.).
   - Import Lucide React icons for mapping, RSVP icons, check‐mark, camera, etc.

2. **“Events/Index.tsx” (Feed page)**

   - **Data passed in from controller**: `props.events` (array of events with nested `rsvp_count`, `attendance_count`, `photo_count`), plus `current_user_id`.
   - Map over `events` and render `<EventCard key={id} event={event} currentUserId={current_user_id} />`.
   - At the top, show a “Next Run” banner if there’s an event whose date/time is closest to “now.” That banner includes:

     - Run number + descriptor
     - Date/Time (formatted)
     - Address with Map icon (linking to Google Maps or opening a modal map)
     - RSVP summary (e.g. “89 RSVPs / 65 Confirmed”)
     - “Quick RSVP” button (on click, call `POST /events/:id/rsvps`). Use React Hook Form + `useAxios` or `fetch` + Zod to validate.

   - Below the banner, show a “Share something…” Inertia form that on submission would `Inertia.post("/feeds", { … })`, but you can defer actual feed‐posts to a later MVP if needed.
   - Then list recent “community posts” (we can stub this out as an empty array initially).

3. **“EventCard.tsx” Component**

   - Props:

     ```ts
     interface EventCardProps {
       event: {
         id: number;
         run_number: number;
         descriptor: string;
         date: string;
         time: string;
         address: string;
         latitude: number;
         longitude: number;
         intro_link?: string;
         rsvp_count: number;
         attendance_count: number;
         photo_count: number;
         // maybe a “badge”: "LH3 #690" style string
       };
       currentUserId: number;
     }
     ```

   - Structure:

     ```jsx
     <div className="bg-white rounded-lg shadow p-4 mb-6">
       <div className="flex justify-between items-center">
         <div>
           <span className="text-sm text-gray-500">Next Run</span>
           <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">
             LH3 #{event.run_number}
           </span>
           <h2 className="text-xl font-semibold">{event.descriptor}</h2>
           <p className="text-gray-600 text-sm">
             📅 {formatDate(event.date)} – 🕘 {formatTime(event.time)}
             <br />
             📍 {event.address}
           </p>
           <p className="text-gray-500 text-sm mt-1">
             ✅ {event.rsvp_count} RSVPs · 🎉 {event.attendance_count} Confirmed
           </p>
         </div>
         <div>
           <RSVPButton eventId={event.id} />
         </div>
       </div>
       <div className="mt-4">
         <a
           href={event.intro_link}
           target="_blank"
           rel="noreferrer"
           className="text-blue-600 hover:underline"
         >
           What is hashing?
         </a>
       </div>
     </div>
     ```

   - The `RSVPButton` toggles between “RSVP” / “Cancel RSVP” based on a fetch to `/events/:id/rsvps`.

4. **“EventForm.tsx” Component (for New/Edit)**

   - Use **React Hook Form** + **Zod** validation:

     ```ts
     import { useForm } from 'react-hook-form';
     import { zodResolver } from '@hookform/resolvers/zod';
     import { eventSchema, EventSchemaType } from '../ZodSchemas/eventSchema';
     ```

   - UI fields:

     - **Run Number** (number input).
     - **Descriptor** (text input).
     - **Date** (HTML date picker).
     - **Time** (HTML time picker).
     - **AddressInput**: custom component that integrates Google Maps Autocomplete (or Mapbox) to let the user type an address and select one. Under the hood:

       - `<input type="text" {...register("address")} />`
       - As they type, call Google Maps Places API (via your own API key, probably in an environment variable).
       - On select, set both `address` (formatted string) and hidden `latitude`/`longitude` fields.
       - Include a “Show on map” link that toggles `<MapPicker lat={lat} lng={lng} />` (an embedded Google Map or Mapbox map preview).

     - **Intro Link** (text input for URL).
     - **Submit** button.

   - On submit, form data (including `address`, `latitude`, `longitude`) posts to `POST /events` or `PATCH /events/:id`.

5. **“Events/Show\.tsx” Page**

   - Fetches `event` prop from the controller (which includes nested RSVPs and photos).
   - At top, show a similar banner as in EventCard, but with a full “Edit” button (if `current_user_id === event.created_by`).
   - Under that, place:

     1. **Self‐Check-In / Attendance Toggle**

        - If `today’s date == event.date`, show a button “Tap to mark attendance.”
        - If already tagged, show “✅ You were here at HH\:MM.”
        - Implementation:

          ```jsx
          <AttendanceToggle
            eventId={event.id}
            userRsvp={event.rsvps.find((r) => r.user.id === currentUserId)}
          />
          ```

        - `AttendanceToggle` will call `PATCH /events/:id/rsvp` with `{ attended_at: new Date().toISOString() }`.

     2. **PhotoAlbum / PhotoGallery**

        - Renders a grid (e.g. Tailwind `grid grid-cols-3 gap-2`) of photos: `event.photos`.
        - Each photo is a clickable thumbnail that opens a lightbox.
        - If `current_user_id` exists, show a `<PhotoUploader eventId={event.id} />` component with:

          - File input (accept “image/\*”).
          - On submit, upload to S3 (or Cloudinary) via a signed URL retrieved from a Rails endpoint (you’ll need to build that). Once uploaded, Rails persists the `image_url`.

     3. **Attendance / RSVP Summary**

        - Show a modal or slide-out that lists who RSVP’d “yes,” “no,” or “pending,” and who actually attended. (Optional for MVP, but you can stub out a small link “View all RSVPs” that toggles a dialog.)

6. **“Dashboard.tsx” (Admin Mode)**

   - If `current_user.is_admin`, show extra admin tools:

     - **Attendance Tracking**

       - A table of past events with quick “Update attendance” links.

     - **Hash Cash Management**

       - Manage each user’s “Hash Cash” balance (points system).

     - **Manage Achievements**

       - CRUD interface for awarding achievements to users.

   - You can leave these pages blank for MVP or just stub links until you build out their controllers.

7. **Reusable Components**

   - **RSVPButton.tsx**

     ```tsx
     interface RSVPButtonProps {
       eventId: number;
       initialStatus?: 'pending' | 'yes' | 'no';
     }

     export function RSVPButton({ eventId, initialStatus }: RSVPButtonProps) {
       const [status, setStatus] = useState(initialStatus || 'pending');
       const handleClick = async () => {
         if (status === 'pending') {
           const res = await fetch(`/events/${eventId}/rsvps`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status: 'yes' }),
           });
           if (res.ok) {
             setStatus('yes');
           }
         } else {
           const res = await fetch(`/events/${eventId}/rsvps`, {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status: 'pending' }),
           });
           if (res.ok) {
             setStatus('pending');
           }
         }
       };

       return (
         <button
           onClick={handleClick}
           className={`px-4 py-2 rounded ${
             status === 'yes'
               ? 'bg-gray-300 text-gray-800'
               : 'bg-blue-600 text-white'
           }`}
         >
           {status === 'yes' ? 'Cancel RSVP' : 'RSVP'}
         </button>
       );
     }
     ```

   - **AttendanceToggle.tsx**

     ```tsx
     interface AttendanceToggleProps {
       eventId: number;
       userRsvp?: { id: number; status: string; attended_at?: string };
     }

     export function AttendanceToggle({
       eventId,
       userRsvp,
     }: AttendanceToggleProps) {
       const [attendedAt, setAttendedAt] = useState(userRsvp?.attended_at);

       const handleAttendance = async () => {
         const now = new Date().toISOString();
         const res = await fetch(`/events/${eventId}/rsvps/${userRsvp!.id}`, {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ attended_at: now }),
         });
         if (res.ok) {
           setAttendedAt(now);
         }
       };

       return (
         <div>
           {attendedAt ? (
             <p className="text-green-600">
               ✅ You were here at {new Date(attendedAt).toLocaleTimeString()}.
             </p>
           ) : (
             <button
               onClick={handleAttendance}
               className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
             >
               Mark Me Present
             </button>
           )}
         </div>
       );
     }
     ```

8. **“PhotoUploader.tsx” & “PhotoGallery.tsx”**

   - **PhotoUploader.tsx**:

     - Use a simple `<input type="file" />`.
     - Upon file selection, request a signed upload URL from Rails endpoint `GET /events/:id/photos/sign_s3_url?filename=xyz.jpg`.
     - Upload file directly via `fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } })`.
     - On success, `POST /events/:id/photos` with JSON `{ image_url: s3PublicUrl, alt_text: "…optional…" }`.

   - **PhotoGallery.tsx**:

     - Props: `photos: Array<{ id: number; image_url: string; alt_text: string; user_id: number }>`
     - Render a responsive grid (`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2`).
     - On click, open a Lightbox modal (you can use a HeadlessUI Dialog) showing the full‐size image and uploader name (fetch user info if needed).

---

## 7. Background Jobs & Real-Time Updates

1. **Solid Queue for Background Processing**

   - Install and configure in `config/application.rb` or a new initializer:

     ```ruby
     SolidQueue.configure do |config|
       config.adapter = :postgres
     end
     ```

   - Use background jobs for:

     - **Email notifications** (RSVP reminder, attendance reminders)
     - **Photo processing** (if resizing or thumbnailing). For example:

       ```ruby
       class PhotoResizingJob
         include SolidQueue::Job

         def perform(photo_id)
           photo = Photo.find(photo_id)
           # call an ImageProcessing library (e.g. ImageMagick, libvips) to generate thumbnails
           # store them back into S3 or local disk, then update `photo.thumbnail_url`
         end
       end
       ```

   - Enqueue jobs in controllers: e.g. after `@photo.save`, call `PhotoResizingJob.perform_async(@photo.id)`.

2. **Solid Cache for Caching**

   - Configure in `config/initializers/solid_cache.rb`:

     ```ruby
     SolidCache.configure do |config|
       config.adapter = :postgres
     end
     ```

   - Use caching for heavy queries, such as:

     - Counting RSVPs per event. In `Event` model:

       ```ruby
       def rsvp_count
         SolidCache.fetch("event_#{id}_rsvp_count", expires_in: 5.minutes) do
           rsvps.where(status: "yes").count
         end
       end
       ```

     - Caching “Upcoming Events” list in the sidebar (refresh every 5 minutes).

3. **Solid Cable for WebSockets (if you want live updates)**

   - In `config/cable.yml`, point to Action Cable server or your Redis (if you need broadcasting).
   - In `app/channels/application_cable/channel.rb` / `connection.rb`, keep defaults.
   - Create a channel, e.g. `EventsChannel`, that streams for all connected clients:

     ```ruby
     class EventsChannel < ApplicationCable::Channel
       def subscribed
         stream_from "events"
       end
     end
     ```

   - Broadcast updates in controllers or background jobs:

     ```ruby
     ActionCable.server.broadcast(
       "events",
       type: "rsvp_update",
       event_id: @event.id,
       rsvp_count: @event.rsvps.where(status: "yes").count
     )
     ```

   - On the React side, use something like `@rails/actioncable` to subscribe and update the RSVP count in real time. (Optional MVP; you can also rely on page reloads or polling.)

---

## 8. Testing Strategy (RSpec + Capybara)

1. **Configure RSpec**

   - Run `rails generate rspec:install`.
   - Make sure you have `spec/rails_helper.rb` and `spec/spec_helper.rb`.
   - Add FactoryBot syntax methods to `rails_helper.rb`:

     ```ruby
     RSpec.configure do |config|
       config.include FactoryBot::Syntax::Methods
     end
     ```

2. **Factories (FactoryBot)**

   - `spec/factories/users.rb`:

     ```ruby
     FactoryBot.define do
       factory :user do
         sequence(:email) { |n| "user#{n}@example.com" }
         password { "password123" }
         display_name { "User #{rand(1000)}" }
       end
     end
     ```

   - `spec/factories/events.rb`:

     ```ruby
     FactoryBot.define do
       factory :event do
         run_number { rand(100..999) }
         descriptor { "Morning Trail Run" }
         date { Date.today + 1 }
         time { "09:00" }
         address { "123 Forest Rd, Lawrence, KS" }
         latitude { 38.9717 }
         longitude { -95.2353 }
         intro_link { "https://en.wikipedia.org/wiki/Hash_house_harrriers" }
         association :creator, factory: :user
       end
     end
     ```

   - `spec/factories/rsvps.rb` and `spec/factories/photos.rb` similarly.

3. **Unit / Model Specs**

   - **User Model**: ensure token validations, Pundit role (e.g. “admin?\`).
   - **Event Model**:

     - Validations for `run_number` uniqueness, presence.
     - `geocoded_by :address` actually sets `latitude`/`longitude`.
     - `rsvp_count`, `attendance_count`, etc.

   - **Rsvp Model**:

     - Validations on `status`.
     - Associations with `User` & `Event`.

   - **Photo Model**:

     - Validates presence of `image_url`.
     - After create, enqueues `PhotoResizingJob`.

4. **Controller Specs**

   - `spec/controllers/events_controller_spec.rb`:

     - GET #index returns 200 and renders Inertia props with correct JSON shape.
     - POST #create with valid params increases `Event.count` by 1.
     - Pundit prohibits non‐admin from editing another user’s event.

   - `spec/controllers/rsvps_controller_spec.rb`:

     - POST #create with valid event and user sets `status: “yes”`.
     - PATCH #update updates `attended_at`.

   - `spec/controllers/photos_controller_spec.rb`:

     - POST #create returns 201 and enqueues a background job.

5. **System (Feature) Specs with Capybara**

   - Simulate a user logging in, going to “New Event,” filling out the form, submitting, and seeing the event appear in the feed.
   - Test:

     1. **RSVP Flow**

        - User sees “RSVP” button on the event card.
        - Click → button text changes to “Cancel RSVP” and the rsvp_count increments.

     2. **Attendance Flow**

        - Navigate to event’s Show page on the event date.
        - Click “Mark Me Present” → sees confirmation with time.

     3. **Photo Upload**

        - On Show page, click “Upload Photo,” choose a local test image, and see the image appear in the gallery grid.

     4. **Geocoding**

        - In New Event form, type “1234 Some Trail Rd” → choose address suggestion → On submit, verify that event.latitude is not nil.

---

## 9. Linting, Formatting & CI

1. **RuboCop with rails-omakase**

   - Create `.rubocop.yml` at the root:

     ```yaml
     inherit_gem:
       rubocop-rails-omakase: config/rails-omakase.yml
     AllCops:
       TargetRubyVersion: 3.2
       NewCops: enable
     ```

   - Run `bundle exec rubocop` in CI or locally to ensure code style.

2. **ESLint & Prettier for TSX**

   - Create `.eslintrc.cjs` in project root:

     ```js
     module.exports = {
       parser: '@typescript-eslint/parser',
       parserOptions: {
         ecmaVersion: 2021,
         sourceType: 'module',
         ecmaFeatures: {
           jsx: true,
         },
       },
       settings: {
         react: { version: 'detect' },
       },
       plugins: ['react', '@typescript-eslint'],
       extends: [
         'eslint:recommended',
         'plugin:react/recommended',
         'plugin:@typescript-eslint/recommended',
         'prettier',
       ],
       rules: {
         'react/react-in-jsx-scope': 'off',
         // your custom rules
       },
     };
     ```

   - Create `.prettierrc`:

     ```json
     {
       "semi": true,
       "singleQuote": true,
       "printWidth": 100
     }
     ```

   - Configure a `lint:js` script in `package.json`:

     ```json
     {
       "scripts": {
         "lint:js": "eslint 'app/frontend/**/*.{js,jsx,ts,tsx}'",
         "format:js": "prettier --write 'app/frontend/**/*.{js,jsx,ts,tsx,css}'"
       }
     }
     ```

   - In CI (e.g. GitHub Actions), create a job that runs `bundle exec rubocop` and `npm run lint:js` on each push.

---

## 10. Deployment & Environment Configuration

1. **Production Environment Variables**

   - **DATABASE_URL** for your Postgres instance.
   - **RAILS_MASTER_KEY** (from `config/credentials.yml.enc`).
   - **AUTH_ZERO_SECRET_KEY**, **AUTH_ZERO_ISSUER** (per Authentication Zero docs).
   - **GEOCODER_API_KEY** (for server‐side geocoding).
   - **AWS_S3_BUCKET**, **AWS_ACCESS_KEY_ID**, **AWS_SECRET_ACCESS_KEY**, and region (for photo uploads).
   - **INERTIA_VERSION** (keep in sync with your `InertiaRails.configure`).
   - **RAILS_ENV=production**.

2. **Docker Compose (Kamal) for Production**

   - Ensure `kamal config:set staging --env-file .env.staging` (and similarly for production).
   - In `kamal.rb` (or `kamal.yml`), define service:

     ```yaml
     services:
       app:
         build:
           context: .
           dockerfile: Dockerfile
         command: bundle exec puma -C config/puma.rb
         ports:
           - '3000:3000'
         env_file: .env.production
         depends_on:
           - db
       db:
         image: postgres:14
         volumes:
           - db_data:/var/lib/postgresql/data
     volumes:
       db_data:
     ```

   - Run `kamal deploy staging` → verify that the app boots, migrations run, and you can hit the home page.

3. **SSL / Domain**

   - Point your domain (e.g. `lh3.example.com`) at the server’s IP.
   - In Kamal, enable Let’s Encrypt:

     ```ruby
     server "app.example.com" do
       env "production"
       letsencrypt enable: true, email: "ops@example.com"
     end
     ```

   - Ensure in `config/environments/production.rb` you have:

     ```ruby
     config.force_ssl = true
     ```

4. **Worker Processes (Solid Queue / Solid Cache)**

   - In Docker/Kamal, spin up a separate service for your queue/worker:

     ```yaml
     queue:
       build:
         context: .
         dockerfile: Dockerfile
       command: bundle exec solid_queue work
       env_file: .env.production
       depends_on:
         - db
         - app
     ```

   - Similarly, if you need a separate `cache` process (sometimes your main web process can read/write to the DB‐backed cache, so no extra container needed).

---

## 11. Analytics, Monitoring, & Notifications

1. **Email Reminders**

   - Create a mailer (e.g. `EventMailer`) that:

     - Sends “Don’t forget to RSVP” 2 days before the event to everyone who hasn’t RSVPed.
     - Sends “See you at today’s hash!” on event day to everyone who RSVPed “yes.”

   - Schedule these with Solid Queue:

     ```ruby
     class ReminderJob
       include SolidQueue::Job

       def perform(event_id)
         event = Event.find(event_id)
         event.rsvps.where(status: "pending").each do |rsvp|
           EventMailer.with(user: rsvp.user, event: event).rsvp_reminder.deliver_now
         end
       end
     end
     ```

   - Kick off `ReminderJob` at event creation time with a `ScheduledJob` entry (Solid Queue supports scheduling):

     ```ruby
     # in EventsController#create, after @event.save:
     run_at = (@event.date - 2.days).to_datetime.change({ hour: 9, min: 0, sec: 0 })
     SolidQueue.enqueue_in(run_at, ReminderJob, @event.id)
     ```

2. **Basic Analytics**

   - Integrate Google Analytics (or Plausible) by adding the tracking snippet into `application.html.erb` (only in production).
   - Track clicks on:

     - “RSVP” buttons
     - “Mark Me Present”
     - “What is Hashing?” link
     - “Upload Photo.”

3. **Error Monitoring**

   - Add something like Sentry (Rails gem + JS SDK) to capture exceptions in production.
   - Configure DSN as an environment variable (`SENTRY_DSN`).

---

## 12. Iteration & Next Steps (Post-MVP)

1. **Allow Users to Edit Their RSVP**

   - Right now, “RSVP” toggles between yes/pending. Later, add “Maybe” or “No” options as radio buttons.

2. **User‐Submitted Trails Database**

   - Instead of free‐text address, allow organizers to pick from a “pre‐registered trails” table that includes:

     - Trail name, official website, difficulty rating, length, best season, GPS GPX file link.

   - In the EventForm, let them search or autocomplete from that table; fallback to free‐text if not found.

3. **Club‐Wide Map of Upcoming Runs**

   - Build a “Map” page that pulls coordinates for all upcoming events and plots them on a Leaflet/Mapbox map.
   - Clicking a marker opens a popup with the event snippet and RSVP summary.

4. **Inertia SSR (Server-Side Rendering)**

   - If initial page load metrics show high TTFB, consider enabling Inertia SSR. React pages then render on the server, improving SEO.

5. **Gamification & Hash Cash**

   - Build a `HashCash` model (linked to User) for awarding/purchasing points.
   - In Admin Dashboard, allow awarding points for attendance, photo uploads, volunteer work.
   - Show users their Hash Cash balance in the sidebar.

6. **Mobile App Integration (Future)**

   - Since you’re already using Inertia + React, you could share some UI components into a React Native (or Expo) app that calls your Rails API endpoints. This is an advanced stretch goal.

7. **Refine Caching Strategy**

   - Move from database‐backed Solid Cache to Redis or Memcached if performance becomes an issue.
   - Memoize the “Upcoming Events” panel in the sidebar so that each page load does not requery for the next 3 events.

---

### Rough Timeline (for a 2-dev, 1-designer team)

_hehehe: May 31_

| Phase                             | Weeks     | Deliverables                                                                                                                            |
| --------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Initial Setup & Boilerplate    | 0.5       | Rails app spin-up, Docker/Kamal config, CI pipeline for linting                                                                         |
| 2. Rails+Inertia/Vite Integration | 0.5       | Inertia layout, Vite config, basic “Hello World” React page                                                                             |
| 3. Auth & Authorization           | 1         | Authentication Zero working with Inertia, Pundit stubbed policies                                                                       |
| 4. Data Modeling & Migrations     | 1         | Models + migrations + associations (Event, RSVP, Photo)                                                                                 |
| 5. Controllers & Policies         | 1         | CRUD endpoints for Event/Rsvp/Photo + matching Pundit policies                                                                          |
| 6. Front-End Implementation (MVP) | 2         | EventCard, EventForm, RSVPButton, AttendanceToggle, PhotoUploader, PhotoGallery, basic GA/Tailwind styling                              |
| 7. Background Jobs & Caching      | 1         | Solid Queue jobs + Solid Cache in Event model, SMTP/email reminders                                                                     |
| 8. Testing (RSpec/Capybara)       | 1         | Unit tests for models + controllers, system tests for RSVP/attendance/photo flows                                                       |
| 9. Deployment (Staging & Prod)    | 0.5       | Docker/Kamal live on staging, run migrations, smoke test pages, deploy to prod with Let’s Encrypt SSL                                   |
| 10. Feedback & Polish             | 1         | UX tweaks (mobile responsive), accessibility fixes, performance tweaks (caching, code splitting)                                        |
| **Total**                         | ≈ 9 weeks | **Fully-featured MVP** matching the original screenshot + feedback (descriptor, address entry, intro link, attendance tagging, albums). |
