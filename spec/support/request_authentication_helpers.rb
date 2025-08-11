# frozen_string_literal: true

module RequestAuthenticationHelpers
  def sign_in(user)
    post sign_in_path, params: { email: user.email, password: 'password' }
  end
end
