# frozen_string_literal: true

class EventsController < ApplicationController
  before_action :set_event, only: %i[show edit update destroy]

  def index
    events = Event.all.order(date: :desc)
    render inertia: 'Event/Index', props: { events: events.as_json }
  end

  def show
    authorize @event
    render inertia: 'Event/Show', props: { event: @event.as_json }
  end

  def new
    authorize Event
    render inertia: 'Event/New'
  end

  def create
    authorize Event
    event = Event.new(event_params) # creator is set via before_validation callback on save

    if event.save
      redirect_to event_path(event), notice: 'Event created.'
    else
      render inertia: 'Event/New', props: { errors: event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def edit
    authorize @event
    render inertia: 'Event/Edit', props: { event: @event.as_json }
  end

  def update
    authorize @event
    if @event.update(event_params)
      redirect_to event_path(@event), notice: 'Event updated.'
    else
      render inertia: 'Event/Edit', props: { event: @event.as_json, errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @event
    @event.destroy
    redirect_to events_path, notice: 'Event deleted.'
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.require(:event).permit(policy(Event).permitted_attributes)
  end
end
