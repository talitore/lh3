# frozen_string_literal: true

class EventsController < ApplicationController
  before_action :set_event, only: %i[show edit update destroy]

  ##
  # Retrieves all events ordered by descending date and renders them with the 'Event/Index' Inertia component.
  def index
    events = Event.all.order(date: :desc)
    render inertia: 'Event/Index', props: { events: events.as_json }
  end

  ##
  # Displays a single event after authorization and renders it with the 'Event/Show' Inertia component.
  def show
    authorize @event
    render inertia: 'Event/Show', props: { event: @event.as_json }
  end

  ##
  # Authorizes the creation of a new event and renders the new event form via Inertia.
  def new
    authorize Event
    render inertia: 'Event/New'
  end

  ##
  # Creates a new event after authorization and attempts to save it.
  # Redirects to the event page with a success notice if creation succeeds, or re-renders the new event form with validation errors if it fails.
  def create
    authorize Event
    event = Event.new(event_params) # Event.new will call set_creator

    if event.save
      redirect_to event_path(event), notice: 'Event created.'
    else
      render inertia: 'Event/New', props: { errors: event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  ##
  # Renders the event edit page after authorizing access to the specified event.
  def edit
    authorize @event
    render inertia: 'Event/Edit', props: { event: @event.as_json }
  end

  ##
  # Updates an existing event with permitted parameters.
  # Redirects to the event page with a success notice if the update succeeds, or re-renders the edit form with validation errors if it fails.
  def update
    authorize @event
    if @event.update(event_params)
      redirect_to event_path(@event), notice: 'Event updated.'
    else
      render inertia: 'Event/Edit', props: { event: @event.as_json, errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  ##
  # Deletes the specified event after authorization and redirects to the events index with a deletion notice.
  def destroy
    authorize @event
    @event.destroy
    redirect_to events_path, notice: 'Event deleted.'
  end

  private

  ##
  # Finds and assigns the event specified by the `id` parameter to `@event`.
  def set_event
    @event = Event.find(params[:id])
  end

  ##
  # Returns the permitted parameters for creating or updating an event, based on the policy's allowed attributes.
  # @return [ActionController::Parameters] The filtered parameters for event creation or update.
  def event_params
    params.require(:event).permit(policy(Event).permitted_attributes)
  end
end
