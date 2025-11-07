# frozen_string_literal: true

# Use case for updating a hash event
# Given a user has created a hash event, when they go to the edit page for that hash event and submit changes,
# then the hash event is updated.
class UpdateHashEvent
  attr_reader :hash_event

  def initialize(hash_event:, hash_event_params:)
    @hash_event = hash_event
    @hash_event_params = hash_event_params
  end

  def call
    update_hash_event
    self
  end

  def success?
    @hash_event.errors.empty?
  end

  def errors
    @hash_event.errors.full_messages
  end

  private

  def update_hash_event
    @hash_event.update(@hash_event_params)
  end
end

