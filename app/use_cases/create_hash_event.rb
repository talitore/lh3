# frozen_string_literal: true

# Use case for creating a new hash event
# Given a user is logged in, when they fill out and submit the new hash event form, then a new hash event is created.
class CreateHashEvent
  attr_reader :hash_event, :creator

  def initialize(hash_event_params:, creator:)
    @hash_event_params = hash_event_params
    @creator = creator
    @hash_event = nil
  end

  def call
    create_hash_event
    self
  end

  def success?
    @hash_event&.persisted?
  end

  def errors
    @hash_event&.errors&.full_messages || []
  end

  private

  def create_hash_event
    @hash_event = HashEvent.new(@hash_event_params)
    @hash_event.creator = @creator
    @hash_event.save
  end
end

