class CreateEvents < ActiveRecord::Migration[8.0]
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
