# frozen_string_literal: true

class RsvpsController < ApplicationController
  before_action :set_hash_event

  def create
    authorize @hash_event, :create_rsvp?
    use_case = CreateRSVP.new(event: @hash_event, user: Current.user, rsvp_params: rsvp_params).call

    if use_case.success?
      redirect_to hash_event_path(@hash_event), notice: "RSVP saved."
    else
      redirect_to hash_event_path(@hash_event), alert: use_case.errors.first
    end
  end

  def update
    use_case = CreateRSVP.new(event: @hash_event, user: Current.user, rsvp_params: rsvp_params).call

    if use_case.success?
      redirect_to hash_event_path(@hash_event), notice: "RSVP updated."
    else
      redirect_to hash_event_path(@hash_event), alert: use_case.errors.first
    end
  end

  private

  def set_hash_event
    @hash_event = HashEvent.find(params[:event_id])
  end

  def rsvp_params
    params.require(:rsvp).permit(:status)
  end
end
