# frozen_string_literal: true

class Event < ApplicationRecord
  include SoftDeletable

  belongs_to :creator, class_name: "User", foreign_key: :creator, inverse_of: :created_events
  has_many :rsvps
  has_many :photos

  validates :run_number, :descriptor, :date, :time, :address, presence: true

  before_validation :set_creator, on: :create
  after_validation :geocode, if: :will_save_change_to_address?
  before_destroy :handle_dependent_records
  ##
  # Sets the creator of the event to the current user if not already assigned.
  def set_creator
    self.creator ||= Current.user
  end

  geocoded_by :address

  ##
  # Returns a JSON representation of the event, including the creator's basic information, associated RSVPs, and photos.
  # @param [Hash] options Optional parameters to customize the JSON output.
  # @return [Hash] The event serialized as a JSON-compatible hash with nested associations.
  def as_json(options = {})
    super(options.merge(include: {
                          creator: {only: %i[id email display_name]},
                          rsvps: {},
                          photos: {}
                        }))
  end

  private

  def handle_dependent_records
    rsvps.find_each(&:destroy)
  end
end
