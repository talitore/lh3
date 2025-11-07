# frozen_string_literal: true

class RenameEventsToHashEvents < ActiveRecord::Migration[7.1]
  def change
    rename_table :events, :hash_events
  end
end
