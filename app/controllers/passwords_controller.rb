# frozen_string_literal: true

# Controller for changing user passwords
class PasswordsController < ApplicationController
  before_action :set_user

  def edit; end

  def update
    if Current.user.update(user_params)
      redirect_to root_path, notice: I18n.t('password.changed')
    else
      redirect_to edit_password_path, alert: Current.user.errors.full_messages.to_sentence
    end
  end

  private

  def set_user
    @user = Current.user
  end

  def user_params
    params.permit(:password, :password_confirmation)
  end
end
