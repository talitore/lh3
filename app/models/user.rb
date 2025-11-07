# frozen_string_literal: true

# User model with authentication and session management
class User < ApplicationRecord
  include SoftDeletable

  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :rsvps
  has_many :photos
  has_many :created_hash_events, class_name: "HashEvent", foreign_key: :creator, inverse_of: :creator

  validates :email, presence: true, uniqueness: true
  validates :display_name, presence: true

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end

  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end

  before_destroy :handle_dependent_records

  def verified?
    verified
  end

  def display_name
    deleted? ? "Deleted User" : self[:display_name]
  end

  private

  def handle_dependent_records
    rsvps.find_each(&:destroy)
    photos.find_each(&:destroy)
  end
end
