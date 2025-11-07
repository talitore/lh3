# frozen_string_literal: true

class Photo < ApplicationRecord
  include SoftDeletable

  belongs_to :user
  belongs_to :hash_event

  validates :image_url, presence: true

  ##
  # Returns a JSON representation of the photo, including selected fields from the associated user and hash event.
  # @param [Hash] options - Additional options for JSON serialization.
  # @return [Hash] The customized JSON representation of the photo.
  def as_json(options = {})
    super(options.merge(include: {
                          user: {only: %i[id email display_name]},
                          hash_event: {only: %i[id run_number descriptor]}
                        }))
  end
end
