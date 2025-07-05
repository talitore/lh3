# frozen_string_literal: true

# Mailer for user-related emails
class UserMailer < ApplicationMailer
  def password_reset
    @user = params[:user]

    mail to: @user.email, subject: I18n.t('email_subjects.password_reset')
  end

  def email_verification
    @user = params[:user]

    mail to: @user.email, subject: I18n.t('email_subjects.email_verification')
  end
end
