# frozen_string_literal: true

class PhotosController < ApplicationController
  before_action :set_hash_event

  def create
    authorize @hash_event, :create_photo?
    use_case = UploadPhoto.new(event: @hash_event, user: Current.user, photo_params: photo_params).call

    if use_case.success?
      redirect_to hash_event_path(@hash_event), notice: "Photo uploaded."
    else
      redirect_to hash_event_path(@hash_event), alert: use_case.errors.first
    end
  end

  def destroy
    @photo = @hash_event.photos.find(params[:id])
    authorize @photo
    @photo.destroy
    redirect_to hash_event_path(@hash_event), notice: "Photo removed."
  end

  private

  def set_hash_event
    @hash_event = HashEvent.find(params[:event_id])
  end

  def photo_params
    params.require(:photo).permit(policy(Photo).permitted_attributes)
  end
end
