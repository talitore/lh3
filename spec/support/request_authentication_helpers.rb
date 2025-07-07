module RequestAuthenticationHelpers
  def sign_in(user)
    session = user.sessions.create!
    request = ActionDispatch::Request.new(Rails.application.env_config)
    cookies = request.cookie_jar
    cookies.signed[:session_token] = session.id
  end
end
