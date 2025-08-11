# frozen_string_literal: true

class AddDeletedAtToRsvps < ActiveRecord::Migration[8.0]
  def change
    add_column :rsvps, :deleted_at, :datetime
    add_index :rsvps, :deleted_at
  end
end
