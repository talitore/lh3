# frozen_string_literal: true

# Add display_name and avatar_url columns to users table
class AddDetailsToUsers < ActiveRecord::Migration[8.0]
  def change
    change_table :users, bulk: true do |t|
      t.string :display_name
      t.string :avatar_url
    end
  end
end
