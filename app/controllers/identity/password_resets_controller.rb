# frozen_string_literal: true

module Identity
  # Controller for handling password reset process
  class PasswordResetsController < ApplicationController
    skip_before_action :authenticate

    before_action :set_user, only: %i[edit update]

    def new; end

    def edit; end

    def create
      if (user = User.find_by(email: params[:email]))
        if user.verified?
          UserMailer.with(user: user).password_reset.deliver_later
          redirect_to sign_in_path, notice: I18n.t("password_reset.instructions_sent")
        else
          redirect_to new_identity_password_reset_path, alert: I18n.t("password_reset.email_not_verified")
        end
      else
        redirect_to new_identity_password_reset_path, alert: I18n.t("password_reset.email_not_verified")
      end
    end

    def update
      if @user.update(user_params)
        redirect_to sign_in_path, notice: I18n.t("password_reset.success")
      else
        render :edit, status: :unprocessable_entity
      end
    end

    private

    def set_user
      @user = User.find_by_token_for(:password_reset, params[:sid])
      redirect_to new_identity_password_reset_path, alert: I18n.t("password_reset.invalid_link") if @user.nil?
    rescue StandardError
      redirect_to new_identity_password_reset_path, alert: I18n.t("password_reset.invalid_link")
    end

    def user_params
      params.permit(:password, :password_confirmation)
    end
  end
end
