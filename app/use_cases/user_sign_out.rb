# frozen_string_literal: true

# Use case for handling user sign out
# Given a user is logged in, when they click the sign-out link, then they are logged out.
class UserSignOut
  attr_reader :destroyed_session

  def initialize(session_id: nil, current_session_token: nil)
    @session_id = session_id
    @current_session_token = current_session_token
    @destroyed_session = nil
  end

  def call
    find_and_destroy_session
    self
  end

  def success?
    @destroyed_session&.destroyed?
  end

  def errors
    @destroyed_session ? [] : ["Session not found or already destroyed"]
  end

  private

  def find_and_destroy_session
    if @session_id
      # Destroy specific session (user managing multiple sessions)
      @destroyed_session = Session.find_by(id: @session_id)
    else
      # Destroy current session from token
      @destroyed_session = Session.find_by(id: @current_session_token)
    end

    @destroyed_session&.destroy
  end
end

