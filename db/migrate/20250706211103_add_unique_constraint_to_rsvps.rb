# frozen_string_literal: true

class AddUniqueConstraintToRsvps < ActiveRecord::Migration[8.0]
  def up
    add_index :rsvps, %i[user_id event_id], unique: true, name: "index_rsvps_on_user_id_and_event_id"
  end

  def down
    remove_index :rsvps, name: "index_rsvps_on_user_id_and_event_id"
  end
end
