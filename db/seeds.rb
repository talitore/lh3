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
User.find_or_create_by!(email: 'admin@app.local') do |user|
  user.display_name = 'Admin User'
  user.password = 'password123'
  user.verified = true
end

Rails.logger.debug '✅ Seed user created: admin@app.local'
