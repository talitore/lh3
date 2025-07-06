# frozen_string_literal: true

# Base controller class for the application
class ApplicationController < ActionController::Base
  include Pundit::Authorization

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :authenticate
  before_action :set_current_request_details

  # Pundit: Fallback for unauthorized access
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # Share user data globally with all Inertia pages
  inertia_share do
    if Current.user
      {
        user: {
          id: Current.user.id,
          email: Current.user.email,
          display_name: Current.user.display_name,
          avatar_url: Current.user.avatar_url,
          verified: Current.user.verified?
        }
      }
    end
  end

  private

  ##
  # Returns the current user for Pundit authorization context.
  # @return [User, nil] The currently authenticated user, or nil if no user is set.
  def pundit_user
    Current.user
  end

  ##
  # Authenticates the user based on a signed session token cookie.
  # If a valid session is found, sets the current user; otherwise, deletes the session cookie and redirects to the sign-in page.
  def authenticate
    session_record = Session.find_by(id: cookies.signed[:session_token])
    if session_record
      Current.user = session_record.user
    else
      cookies.delete(:session_token)
      redirect_to sign_in_path
    end
  end

  ##
  # Stores the current request's user agent and IP address in the global Current context.
  def set_current_request_details
    Current.user_agent = request.user_agent
    Current.ip_address = request.ip
  end

  ##
  # Handles unauthorized access attempts by setting an alert message and redirecting the user to the previous page or the home page.
  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referrer || root_path)
  end
end
