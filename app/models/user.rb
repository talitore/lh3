# frozen_string_literal: true

# User model with authentication and session management
class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :display_name, presence: true

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end

  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end

  def verified?
    verified
  end
end
