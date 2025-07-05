# frozen_string_literal: true

# Controller for changing user passwords
class PasswordsController < ApplicationController
  include PasswordChallengeValidation

  def edit
    render inertia: 'Passwords/Edit', props: inertia_props
  end

  def update
    handle_password_challenge_update do
      handle_valid_password_update
    end
  end

  private

  def handle_valid_password_update
    if Current.user.update(user_params)
      redirect_to root_path, notice: I18n.t('password.changed')
    else
      render inertia: 'Passwords/Edit', props: inertia_props_with_errors,
             status: :unprocessable_entity
    end
  end

  def user_params
    params.permit(:password, :password_confirmation, :password_challenge)
  end

  def inertia_props
    {
      user: @user.as_json(only: [:id, :email])
    }
  end

  def inertia_component_name
    'Passwords/Edit'
  end
end
