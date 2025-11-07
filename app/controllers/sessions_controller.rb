# frozen_string_literal: true

# Controller for managing user sessions (login/logout)
class SessionsController < ApplicationController
  skip_before_action :authenticate, only: %i[new create]

  def new
    render inertia: "Auth/Login"
  end

  def create
    use_case = UserSignIn.new(email: params[:email], password: params[:password])
    use_case.call

    if use_case.success?
      handle_successful_login(use_case)
    else
      handle_failed_login(use_case)
    end
  end

  def destroy
    use_case = UserSignOut.new(
      session_id: params[:id],
      current_session_token: cookies.signed[:session_token]
    )
    use_case.call

    cookies.delete(:session_token)

    if use_case.success?
      redirect_to(root_path, notice: I18n.t("session.logged_out"))
    else
      redirect_to(root_path, alert: use_case.errors.first)
    end
  end

  private

  def handle_successful_login(use_case)
    cookies.signed.permanent[:session_token] = {value: use_case.session.id, httponly: true}
    redirect_to root_path, notice: I18n.t("session.signed_in")
  end

  def handle_failed_login(use_case)
    redirect_to sign_in_path(email_hint: params[:email]), alert: use_case.errors.first
  end
end
