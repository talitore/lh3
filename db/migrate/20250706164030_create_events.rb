class CreateEvents < ActiveRecord::Migration[8.0]
  ##
  # Creates the `events` table with columns for run number, descriptor, date, time, address, and creator.
  # Adds timestamps, an index on the `creator` column, and a foreign key constraint linking `creator` to the `users` table.
  def change
    create_table :events do |t|
      t.integer :run_number
      t.string :descriptor
      t.date :date
      t.time :time
      t.string :address
      t.bigint :creator, null: false

      t.timestamps
    end
    add_index :events, :creator
    add_foreign_key :events, :users, column: :creator
  end
end
