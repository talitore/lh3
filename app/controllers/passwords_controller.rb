# frozen_string_literal: true

# Controller for changing user passwords
class PasswordsController < ApplicationController
  before_action :set_user

  def edit; end

  def update
    if password_challenge_valid?
      handle_valid_password_update
    else
      handle_invalid_password_update
    end
  end

  private

  def set_user
    @user = Current.user
  end

  def password_challenge_valid?
    Current.user.authenticate(params[:password_challenge])
  end

  def handle_valid_password_update
    if Current.user.update(user_params)
      redirect_to root_path, notice: I18n.t('password.changed')
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def handle_invalid_password_update
    @user = Current.user
    @user.errors.add(:password_challenge, 'is invalid')
    render :edit, status: :unprocessable_entity
  end

  def user_params
    params.permit(:password, :password_confirmation, :password_challenge)
  end
end
