# frozen_string_literal: true

require "rails_helper"

RSpec.describe "/events", :inertia do
  let(:user) { create(:user) }

  before { sign_in(user) }

  describe "GET /events" do
    it "lists all events via Inertia" do
      create(:event, creator: user, run_number: "123", descriptor: "Morning Run", date: Time.zone.today, time: "08:00",
                     address: "1 Main, City")

      get events_path

      expect_inertia.to render_component("Event/Index")
      expect(inertia.props[:events]).to be_an(Array)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /events" do
    let(:valid_params) do
      {
        event: {
          run_number: "42",
          descriptor: "Evening Run",
          date: Time.zone.today.to_s,
          time: "18:30",
          address: "123 Run St, Town"
        }
      }
    end

    it "creates an event and redirects to show" do
      expect do
        post events_path, params: valid_params
      end.to change(Event, :count).by(1)

      event = Event.last
      expect(event.creator).to eq(user)
      expect(response).to redirect_to(event_path(event))
      expect(flash[:notice]).to eq("Event created.")
    end

    it "renders errors via Inertia on validation failure" do
      expect do
        post events_path, params: {event: {descriptor: "No run number"}}
      end.not_to change(Event, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect_inertia.to render_component("Event/New")
      expect(inertia.props[:errors]).to be_present
    end
  end

  describe "GET /events/:id" do
    it "shows the event via Inertia" do
      event = create(:event, creator: user, run_number: "7", descriptor: "Showcase", date: Time.zone.today, time: "09:00",
                             address: "10 Road, City")

      get event_path(event)

      expect_inertia.to render_component("Event/Show")
      expect(inertia.props[:event]).to include("id" => event.id)
      expect(response).to have_http_status(:ok)
    end

    it "includes attendee list (RSVPs) in event payload" do
      event = create(:event, creator: user, run_number: "8", descriptor: "With RSVPs", date: Time.zone.today, time: "09:30",
                             address: "11 Road, City")
      rsvp_user = create(:user)
      create(:rsvp, event: event, user: rsvp_user, status: "yes")

      get event_path(event)

      expect_inertia.to render_component("Event/Show")
      rsvps = inertia.props[:event]["rsvps"]
      expect(rsvps).to be_an(Array)
      expect(rsvps.dig(0, "user", "id")).to eq(rsvp_user.id)
    end

    it "includes photos in event payload for gallery display" do
      event = create(:event, creator: user, run_number: "9", descriptor: "With Photos", date: Time.zone.today,
                             time: "10:00", address: "12 Road, City")
      create(:photo, event: event, user: user, image_url: "https://example.com/a.jpg")

      get event_path(event)

      expect_inertia.to render_component("Event/Show")
      photos = inertia.props[:event]["photos"]
      expect(photos).to be_an(Array)
      expect(photos.first["image_url"]).to eq("https://example.com/a.jpg")
    end
  end

  describe "PATCH /events/:id" do
    it "updates when valid, errors when invalid" do
      event = create(:event, creator: user, run_number: "9", descriptor: "Edit me", date: Time.zone.today, time: "10:00",
                             address: "20 Ave, City")

      patch event_path(event), params: {event: {descriptor: "Edited"}}
      expect(response).to redirect_to(event_path(event))
      expect(flash[:notice]).to eq("Event updated.")
      expect(event.reload.descriptor).to eq("Edited")

      patch event_path(event), params: {event: {descriptor: ""}}
      expect(response).to have_http_status(:unprocessable_entity)
      expect_inertia.to render_component("Event/Edit")
      expect(inertia.props[:errors]).to be_present
    end
  end

  describe "DELETE /events/:id" do
    it "deletes the event" do
      event = create(:event, creator: user, run_number: "5", descriptor: "Delete me", date: Time.zone.today, time: "11:00",
                             address: "30 Blvd, City")

      expect do
        delete event_path(event)
      end.to change(Event, :count).by(-1)

      expect(response).to redirect_to(events_path)
      expect(flash[:notice]).to eq("Event deleted.")
    end
  end
end
