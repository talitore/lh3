# frozen_string_literal: true

# Use case for handling password changes
# Given a user is logged in, when they submit the change password form with their current password and a new password,
# then their password is updated successfully.
class ChangePassword
  attr_reader :user, :current_password

  def initialize(user:, current_password:, new_password:, password_confirmation:)
    @user = user
    @current_password = current_password
    @new_password = new_password
    @password_confirmation = password_confirmation
  end

  def call
    validate_current_password
    return self unless valid?

    update_password
    self
  end

  def success?
    valid? && @user.errors.empty?
  end

  def errors
    @user.errors.full_messages
  end

  private

  def validate_current_password
    unless @user.authenticate(@current_password)
      @user.errors.add(:current_password, "is incorrect")
    end
  end

  def valid?
    @user.errors.empty? && @new_password.present? && @new_password == @password_confirmation
  end

  def update_password
    @user.update(
      password: @new_password,
      password_confirmation: @password_confirmation
    )
  end
end

