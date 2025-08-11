# frozen_string_literal: true

class RsvpsController < ApplicationController
  before_action :set_event

  def create
    authorize @event, :create_rsvp?
    @rsvp = @event.rsvps.find_or_initialize_by(user: Current.user)
    if @rsvp.update(rsvp_params)
      redirect_to event_path(@event), notice: "RSVP saved."
    else
      redirect_to event_path(@event), alert: @rsvp.errors.full_messages.to_sentence
    end
  end

  def update
    @rsvp = @event.rsvps.find_by(user: Current.user)
    authorize @rsvp
    if @rsvp.update(rsvp_params)
      redirect_to event_path(@event), notice: "RSVP updated."
    else
      redirect_to event_path(@event), alert: @rsvp.errors.full_messages.to_sentence
    end
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def rsvp_params
    params.require(:rsvp).permit(pundit_params_for(Rsvp))
  end
end
