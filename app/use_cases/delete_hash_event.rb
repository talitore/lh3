# frozen_string_literal: true

# Use case for deleting a hash event
# Given a user has created a hash event, when they delete the hash event, then the hash event is removed.
class DeleteHashEvent
  attr_reader :hash_event

  def initialize(hash_event:)
    @hash_event = hash_event
  end

  def call
    delete_hash_event
    self
  end

  def success?
    @hash_event.destroyed?
  end

  def errors
    @hash_event.errors.full_messages
  end

  private

  def delete_hash_event
    @hash_event.destroy
  end
end

