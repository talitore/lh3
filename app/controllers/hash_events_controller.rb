# frozen_string_literal: true

class HashEventsController < ApplicationController
  before_action :set_hash_event, only: %i[show edit update destroy]

  def index
    use_case = ListHashEvents.new.call
    render inertia: "HashEvent/Index", props: {hash_events: use_case.hash_events.as_json}
  end

  def show
    use_case = ShowHashEvent.new(hash_event_id: params[:id]).call
    return redirect_to(hash_events_path, alert: use_case.errors.first) unless use_case.success?

    @hash_event = use_case.hash_event
    authorize @hash_event
    render inertia: "HashEvent/Show", props: {hash_event: @hash_event.as_json}
  end

  def new
    authorize HashEvent
    render inertia: "HashEvent/New"
  end

  def edit
    authorize @hash_event
    render inertia: "HashEvent/Edit", props: {hash_event: @hash_event.as_json}
  end

  def create
    authorize HashEvent
    use_case = CreateHashEvent.new(hash_event_params: hash_event_params, creator: Current.user).call

    if use_case.success?
      redirect_to hash_event_path(use_case.hash_event), notice: "Hash event created."
    else
      render inertia: "HashEvent/New", props: {errors: use_case.errors}, status: :unprocessable_entity
    end
  end

  def update
    authorize @hash_event
    use_case = UpdateHashEvent.new(hash_event: @hash_event, hash_event_params: hash_event_params).call

    if use_case.success?
      redirect_to hash_event_path(@hash_event), notice: "Hash event updated."
    else
      render inertia: "HashEvent/Edit", props: {hash_event: @hash_event.as_json, errors: use_case.errors},
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @hash_event
    use_case = DeleteHashEvent.new(hash_event: @hash_event).call

    if use_case.success?
      redirect_to hash_events_path, notice: "Hash event deleted."
    else
      redirect_to hash_events_path, alert: use_case.errors.first
    end
  end

  private

  def set_hash_event
    @hash_event = HashEvent.find(params[:id])
  end

  def hash_event_params
    params.require(:hash_event).permit(policy(HashEvent).permitted_attributes)
  end
end
