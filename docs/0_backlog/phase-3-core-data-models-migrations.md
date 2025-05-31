## Phase 3: Core Data Models & Migrations (Event, RSVP, Photo)

### Objective

Define and migrate core data models: Event, RSVP, and Photo. Establish their associations.

### PRD Alignment

- Section 4: Data Modeling & Migrations (Event, RSVP, Photo models)
- Section 4.5: Geocoding (initial setup for Event model)

### User Stories Covered

- (Foundation for most run and photo related stories)

### Key Tasks

1.  **Event Model:**
    - Generate `Event` model scaffold (`prd.md#4.2`).
    - Add associations to `app/models/event.rb` (`belongs_to :creator`, `has_many :rsvps`, `has_many :photos`).
    - Add validations (`run_number`, `descriptor`, `date`, `time`, `address`).
    - Run `rails db:migrate`.
2.  **RSVP Model:**
    - Generate `Rsvp` model scaffold (`prd.md#4.3`).
    - Add associations and validations to `app/models/rsvp.rb`.
    - Update `User` and `Event` models with `has_many :rsvps` and `has_many :events, through: :rsvps` etc.
    - Run `rails db:migrate`.
3.  **Photo Model:**
    - Generate `Photo` model scaffold (`prd.md#4.4`).
    - Add associations and validations to `app/models/photo.rb`.
    - Update `User` and `Event` models with `has_many :photos`.
    - Run `rails db:migrate`.
4.  **Geocoding Setup for Event:**
    - Add `geocoder` gem to `Gemfile`, `bundle install` (`prd.md#4.5`).
    - Configure `Event` model for geocoding: `geocoded_by :address`, `after_validation :geocode` (`prd.md#4.5`).

### Best Practices & Considerations

- Use `rails g model ... created_by:references{to_table: :users}` for foreign keys.
- Define constants for things like `Rsvp::STATUSES` in the respective models.

### Testing

- **User-Verifiable:**
  - (Manual DB inspection or Rails console checks)
  - Create a User.
  - Create an Event associated with the User as creator. `event.address = "10 Downing St, London"; event.save; event.latitude` should be populated.
  - Create an RSVP linking the User and Event.
  - Create a Photo linking the User and Event.
- **Unit Tests (RSpec & FactoryBot):**
  - Create factories for `User`, `Event`, `Rsvp`, `Photo` (`prd.md#8.2`).
  - `Event` model: Test validations, associations, geocoding callback.
  - `Rsvp` model: Test validations (status inclusion), associations.
  - `Photo` model: Test validations (image_url presence), associations.

### Deliverables

- Migrated `Event`, `Rsvp`, `Photo` tables in the database.
- Models with defined associations and validations.
- Geocoding configured for the `Event` model.
- Factories for all core models.
