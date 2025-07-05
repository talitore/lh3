# frozen_string_literal: true

module Identity
  # Controller for changing user email addresses
  class EmailsController < ApplicationController
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
      if @user.update(user_params)
        handle_successful_email_update
        redirect_to root_path, notice: I18n.t('email.changed')
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def handle_invalid_password_update
      @user.errors.add(:password_challenge, 'is invalid')
      render :edit, status: :unprocessable_entity
    end

    def handle_successful_email_update
      return unless @user.email_previously_changed?

      @user.update(verified: false)
      UserMailer.with(user: @user).email_verification.deliver_later
    end

    def user_params
      params.permit(:email, :password_challenge).with_defaults(password_challenge: '')
    end
  end
end
