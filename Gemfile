# frozen_string_literal: true

source 'https://rubygems.org'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 8.0.2'
# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '>= 5.0'
# Use postgresql as the database for Active Record
gem 'pg', '~> 1.1'
# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem 'authentication-zero', '~> 4.0'
gem 'bcrypt', '~> 3.1.7'

# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem 'inertia_rails', '~> 3.9'
gem 'js-routes'
gem 'propshaft'
gem 'vite_rails', '~> 3.0'
gem 'geocoder'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[windows jruby]

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'
  gem 'foreman', '~> 0.88.1'
  gem 'rubocop', '~> 1.77'
  gem 'rubocop-rails', '~> 2.32', require: false
end
