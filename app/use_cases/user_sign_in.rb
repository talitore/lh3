# frozen_string_literal: true

# Use case for handling user sign in
# Given a user has an existing account, when they go to the sign-in page and submit valid credentials,
# then they are logged in.
class UserSignIn
  attr_reader :user, :session

  def initialize(email:, password:)
    @email = email
    @password = password
    @user = nil
    @session = nil
  end

  def call
    authenticate_user
    return self unless @user

    create_session
    self
  end

  def success?
    @user.present? && @session&.persisted?
  end

  def errors
    @user ? [] : ["Invalid email or password"]
  end

  private

  def authenticate_user
    @user = User.authenticate_by(email: @email, password: @password)
  end

  def create_session
    @session = @user.sessions.create!
  end
end

