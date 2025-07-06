# frozen_string_literal: true

class PhotosController < ApplicationController
  before_action :set_event

  def create
    authorize @event, :create_photo?
    @photo = @event.photos.build(photo_params)
    @photo.user = Current.user # The uploader is always the current user

    if @photo.save
      redirect_to event_path(@event), notice: 'Photo uploaded.'
    else
      redirect_to event_path(@event), alert: @photo.errors.full_messages.to_sentence
    end
  end

  def destroy
    @photo = @event.photos.find(params[:id])
    authorize @photo
    @photo.destroy
    redirect_to event_path(@event), notice: 'Photo removed.'
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def photo_params
    params.require(:photo).permit(policy(Photo).permitted_attributes)
  end
end
