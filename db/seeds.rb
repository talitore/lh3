# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create a default user for development
User.find_or_create_by!(email: "admin@app.local") do |user|
  user.display_name = "Admin User"
  user.password = "password123"
  user.verified = true
end

Rails.logger.debug "✅ Seed user created: admin@app.local"

# Create a default event for development
Event.find_or_create_by!(descriptor: "Default Event") do |event|
  event.run_number = 1
  event.date = Time.zone.today
  event.time = Time.current
  event.address = "123 Main St, Anytown, USA"
  event.creator = User.first
end

Rails.logger.debug "✅ Seed event created: Default Event"
