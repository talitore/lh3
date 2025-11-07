# frozen_string_literal: true

# Controller for changing user passwords
class PasswordsController < ApplicationController
  include PasswordChallengeValidation

  def edit
    render inertia: "Passwords/Edit", props: inertia_props
  end

  def update
    handle_password_challenge_update do
      handle_valid_password_update
    end
  end

  private

  def handle_valid_password_update
    use_case = ChangePassword.new(
      user: Current.user,
      current_password: params[:password_challenge],
      new_password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
    use_case.call

    if use_case.success?
      redirect_to root_path, notice: I18n.t("password.changed")
    else
      @user = Current.user
      @user.errors.add(:password, use_case.errors.first)
      render inertia: "Passwords/Edit", props: inertia_props_with_errors,
             status: :unprocessable_entity
    end
  end

  def user_params
    params.permit(:password, :password_confirmation, :password_challenge)
  end

  def inertia_props
    {
      user: @user.as_json(only: %i[id email])
    }
  end

  def inertia_component_name
    "Passwords/Edit"
  end
end
