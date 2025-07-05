# frozen_string_literal: true

# Create users table with basic authentication fields
class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.boolean :verified, default: false, null: false

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
