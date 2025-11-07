# frozen_string_literal: true

# Use case for uploading a photo to a hash event
# Given a user is attending a hash event, when they upload a photo on the hash event page,
# then the photo is added to the hash event's gallery.
class UploadPhoto
  attr_reader :photo, :hash_event, :user

  def initialize(event:, user:, photo_params:)
    @hash_event = event
    @user = user
    @photo_params = photo_params
    @photo = nil
  end

  def call
    create_photo
    self
  end

  def success?
    @photo&.persisted?
  end

  def errors
    @photo&.errors&.full_messages || []
  end

  private

  def create_photo
    @photo = @hash_event.photos.build(@photo_params)
    @photo.user = @user
    @photo.save
  end
end

