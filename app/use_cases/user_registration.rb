# frozen_string_literal: true

# Use case for handling user registration
# Given a user is on the registration page, when they fill in and submit the registration form with valid data,
# then a new user account is created and they are logged in.
class UserRegistration
  attr_reader :user, :session

  def initialize(user_params)
    @user_params = user_params
    @user = nil
    @session = nil
  end

  def call
    create_user
    return self unless @user.persisted?

    create_session
    send_email_verification
    self
  end

  def success?
    @user&.persisted? && @session&.persisted?
  end

  def errors
    @user&.errors&.full_messages || []
  end

  private

  def create_user
    @user = User.new(@user_params)
    @user.save
  end

  def create_session
    @session = @user.sessions.create!
  end

  def send_email_verification
    UserMailer.with(user: @user).email_verification.deliver_later
  end
end

