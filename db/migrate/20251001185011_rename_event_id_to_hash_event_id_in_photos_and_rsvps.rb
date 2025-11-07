class RenameEventIdToHashEventIdInPhotosAndRsvps < ActiveRecord::Migration[8.0]
  def change
    # Rename photos table
    rename_column :photos, :event_id, :hash_event_id
    if index_exists?(:photos, :event_id)
      rename_index :photos, :event_id, :hash_event_id
    end

    # Rename rsvps table
    rename_column :rsvps, :event_id, :hash_event_id
    if index_exists?(:rsvps, :event_id)
      rename_index :rsvps, :event_id, :hash_event_id
    end
  end
end
