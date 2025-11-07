# frozen_string_literal: true

# Use case for creating/updating an RSVP
# Given a user is viewing a hash event, when they click the RSVP button, then they are marked as attending the hash event.
class CreateRSVP
  attr_reader :rsvp, :hash_event, :user

  def initialize(event:, user:, rsvp_params:)
    @hash_event = event
    @user = user
    @rsvp_params = rsvp_params
    @rsvp = nil
  end

  def call
    find_or_create_rsvp
    update_rsvp
    self
  end

  def success?
    @rsvp&.persisted?
  end

  def errors
    @rsvp&.errors&.full_messages || []
  end

  private

  def find_or_create_rsvp
    @rsvp = @hash_event.rsvps.find_or_initialize_by(user: @user)
  end

  def update_rsvp
    @rsvp.assign_attributes(@rsvp_params)
    @rsvp.save
  end
end

