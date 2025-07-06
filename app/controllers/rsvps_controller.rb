# frozen_string_literal: true

class RsvpsController < ApplicationController
  before_action :set_event

  ##
  # Creates or updates the current user's RSVP for the event and redirects to the event page with a success or error message.
  def create
    authorize Rsvp
    @rsvp = @event.rsvps.find_or_initialize_by(user: Current.user)
    if @rsvp.update(rsvp_params)
      redirect_to event_path(@event), notice: 'RSVP saved.'
    else
      redirect_to event_path(@event), alert: @rsvp.errors.full_messages.to_sentence
    end
  end

  ##
  # Updates the current user's RSVP for the event and redirects to the event page with a success or error message.
  def update
    @rsvp = @event.rsvps.find_by(user: Current.user)
    authorize @rsvp
    if @rsvp.update(rsvp_params)
      redirect_to event_path(@event), notice: 'RSVP updated.'
    else
      redirect_to event_path(@event), alert: @rsvp.errors.full_messages.to_sentence
    end
  end

  private

  ##
  # Finds and assigns the event specified by the `event_id` parameter to `@event`.
  def set_event
    @event = Event.find(params[:event_id])
  end

  ##
  # Returns the permitted RSVP parameters based on the policy whitelist.
  # @return [ActionController::Parameters] The filtered parameters for RSVP creation or update.
  def rsvp_params
    params.require(:rsvp).permit(pundit_params_for(Rsvp))
  end
end
