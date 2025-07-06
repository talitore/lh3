# frozen_string_literal: true

class PhotosController < ApplicationController
  before_action :set_event

  ##
  # Handles uploading a new photo to the current event.
  # Builds a photo associated with the event and assigns the current user as the uploader.
  # Redirects to the event page with a success notice if the upload succeeds, or an alert with error messages if it fails.
  def create
    authorize Photo
    @photo = @event.photos.build(photo_params)
    @photo.user = Current.user # The uploader is always the current user

    if @photo.save
      redirect_to event_path(@event), notice: 'Photo uploaded.'
    else
      redirect_to event_path(@event), alert: @photo.errors.full_messages.to_sentence
    end
  end

  ##
  # Deletes a photo associated with the current event and redirects to the event page with a removal notice.
  def destroy
    @photo = @event.photos.find(params[:id])
    authorize @photo
    @photo.destroy
    redirect_to event_path(@event), notice: 'Photo removed.'
  end

  private

  ##
  # Finds and sets the event based on the `event_id` parameter for use in controller actions.
  def set_event
    @event = Event.find(params[:event_id])
  end

  ##
  # Extracts and permits photo parameters based on the policy for Photo.
  # @return [ActionController::Parameters] The permitted parameters for creating or updating a photo.
  def photo_params
    params.require(:photo).permit(policy(Photo).permitted_attributes)
  end
end
