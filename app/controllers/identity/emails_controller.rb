# frozen_string_literal: true

module Identity
  # Controller for changing user email addresses
  class EmailsController < ApplicationController
    include PasswordChallengeValidation

    def edit
      render inertia: 'Identity/Emails/Edit', props: inertia_props
    end

    def update
      handle_password_challenge_update do
        handle_valid_password_update
      end
    end

    private

    def handle_valid_password_update
      if @user.update(user_params)
        handle_successful_email_update
        redirect_to root_path, notice: I18n.t('email.changed')
      else
        render inertia: 'Identity/Emails/Edit', props: inertia_props_with_errors,
               status: :unprocessable_entity
      end
    end

    def handle_successful_email_update
      return unless @user.email_previously_changed?

      @user.update(verified: false)
      UserMailer.with(user: @user).email_verification.deliver_later
    end

    def user_params
      params.permit(:email, :password_challenge).with_defaults(password_challenge: '')
    end

    def inertia_props
      {
        user: @user.as_json(only: [:id, :email])
      }
    end

    def inertia_component_name
      'Identity/Emails/Edit'
    end
  end
end
