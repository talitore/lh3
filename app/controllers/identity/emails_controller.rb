# frozen_string_literal: true

module Identity
  # Controller for changing user email addresses
  class EmailsController < ApplicationController
    before_action :set_user

    def edit; end

    def update
      if @user.update(user_params)
        if @user.email_previously_changed?
          @user.update(verified: false)
          UserMailer.with(user: @user).email_verification.deliver_later
        end
        redirect_to root_path, notice: I18n.t('email.changed')
      else
        render :edit, status: :unprocessable_entity
      end
    end

    private

    def set_user
      @user = Current.user
    end

    def user_params
      params.permit(:email, :password_challenge).with_defaults(password_challenge: '')
    end
  end
end
