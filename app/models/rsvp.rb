# frozen_string_literal: true

class Rsvp < ApplicationRecord
  include SoftDeletable

  STATUSES = %w[yes maybe no].freeze

  belongs_to :user
  belongs_to :event

  validates :status, presence: true, inclusion: {in: STATUSES}
  validates :user_id, uniqueness: {scope: :event_id, message: "has already RSVP'd for this event"}

  ##
  # Returns a JSON representation of the RSVP, including nested user and event data with selected attributes.
  # @param [Hash] options Optional parameters for JSON serialization.
  # @return [Hash] The customized JSON representation of the RSVP.
  def as_json(options = {})
    super(options.merge(include: {
                          user: {only: %i[id email display_name]},
                          event: {only: %i[id run_number descriptor]}
                        }))
  end
end
