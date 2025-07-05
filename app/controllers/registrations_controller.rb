# frozen_string_literal: true

# Controller for user registration
class RegistrationsController < ApplicationController
  skip_before_action :authenticate

  def new
    render inertia: 'Auth/Register'
  end

  def create
    @user = User.new(user_params)

    if @user.save
      handle_successful_registration
    else
      render_registration_errors
    end
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation, :display_name)
  end

  def handle_successful_registration
    session_record = @user.sessions.create!
    cookies.signed.permanent[:session_token] = { value: session_record.id, httponly: true }

    send_email_verification
    redirect_to root_path, notice: I18n.t('registration.welcome')
  end

  def render_registration_errors
    render inertia: 'Auth/Register', props: {
      errors: @user.errors.messages
    }, status: :unprocessable_entity
  end

  def send_email_verification
    UserMailer.with(user: @user).email_verification.deliver_later
  end
end
