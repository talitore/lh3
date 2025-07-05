# frozen_string_literal: true

# Create sessions table for user session management
class CreateSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :sessions do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
