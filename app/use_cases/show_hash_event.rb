# frozen_string_literal: true

# Use case for showing hash event details
# Given there are existing hash events, when a user clicks on a hash event, then they see the details of that hash event.
class ShowHashEvent
  attr_reader :hash_event

  def initialize(hash_event_id:)
    @hash_event_id = hash_event_id
    @hash_event = nil
  end

  def call
    find_hash_event
    self
  end

  def success?
    @hash_event.present?
  end

  def errors
    @hash_event ? [] : ["Hash event not found"]
  end

  private

  def find_hash_event
    @hash_event = HashEvent.find_by(id: @hash_event_id)
  end
end

