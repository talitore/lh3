# frozen_string_literal: true

# Controller for managing user sessions (login/logout)
class SessionsController < ApplicationController
  skip_before_action :authenticate, only: %i[new create]

  def index
    @sessions = Current.user.sessions.order(created_at: :desc)
  end

  def new
    render inertia: 'Auth/Login'
  end

  def create
    user = User.authenticate_by(email: params[:email], password: params[:password])
    if user
      handle_successful_login(user)
    else
      handle_failed_login
    end
  end

  def destroy
    session_record = find_session_to_destroy
    session_record&.destroy
    cookies.delete(:session_token)

    redirect_to(root_path, notice: I18n.t('session.logged_out'))
  end

  private

  def find_session_to_destroy
    if params[:id]
      Current.user.sessions.find(params[:id])
    else
      Session.find_by(id: cookies.signed[:session_token])
    end
  end

  def handle_successful_login(user)
    session_record = user.sessions.create!
    cookies.signed.permanent[:session_token] = { value: session_record.id, httponly: true }
    redirect_to root_path, notice: I18n.t('session.signed_in')
  end

  def handle_failed_login
    redirect_to sign_in_path(email_hint: params[:email]), alert: I18n.t('session.invalid_credentials')
  end
end
