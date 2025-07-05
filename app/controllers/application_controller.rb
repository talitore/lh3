# frozen_string_literal: true

# Base controller class for the application
class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :authenticate
  before_action :set_current_request_details

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

  def authenticate
    session_record = Session.find_by(id: cookies.signed[:session_token])
    if session_record
      Current.user = session_record.user
    else
      redirect_to sign_in_path
    end
  end

  def set_current_request_details
    Current.user_agent = request.user_agent
    Current.ip_address = request.ip
  end
end
