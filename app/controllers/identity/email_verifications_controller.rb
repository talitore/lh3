# frozen_string_literal: true

module Identity
  # Controller for handling email verification process
  class EmailVerificationsController < ApplicationController
    skip_before_action :authenticate

    before_action :set_user, only: :show

    def show
      if @user.update(verified: true)
        redirect_to root_path, notice: I18n.t('email_verification.success')
      else
        redirect_to root_path, notice: I18n.t('email_verification.sent')
      end
    end

    def create
      UserMailer.with(user: Current.user).email_verification.deliver_later

      redirect_to root_path, notice: I18n.t('email_verification.sent')
    end

    private

    def set_user
      @user = User.find_by_token_for!(:email_verification, params[:token])
    rescue StandardError
      redirect_to edit_identity_email_path, alert: I18n.t('email_verification.invalid')
    end
  end
end
