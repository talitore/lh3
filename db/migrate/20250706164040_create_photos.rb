# frozen_string_literal: true

class CreatePhotos < ActiveRecord::Migration[8.0]
  ##
  # Creates the `photos` table with references to users and events, image URL, alternative text, and timestamps.
  #
  # The table enforces foreign key constraints on `user` and `event` references and includes columns for storing the photo's URL and alternative text.
  def change
    create_table :photos do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true
      t.string :image_url
      t.string :alt_text

      t.timestamps
    end
  end
end
