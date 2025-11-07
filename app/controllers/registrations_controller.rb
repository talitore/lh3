# frozen_string_literal: true

# Controller for user registration
class RegistrationsController < ApplicationController
  skip_before_action :authenticate

  def new
    render inertia: "Auth/Register"
  end

  def create
    use_case = UserRegistration.new(user_params)
    use_case.call

    if use_case.success?
      handle_successful_registration(use_case)
    else
      render_registration_errors(use_case)
    end
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation, :display_name)
  end

  def handle_successful_registration(use_case)
    cookies.signed.permanent[:session_token] = {value: use_case.session.id, httponly: true}

    redirect_to root_path, notice: I18n.t("registration.welcome")
  end

  def render_registration_errors(use_case)
    render inertia: "Auth/Register", props: {
      errors: use_case.errors
    }, status: :unprocessable_entity
  end
end
