# frozen_string_literal: true

require "rails_helper"

RSpec.describe "/hash_events", :inertia do
  let(:user) { create(:user) }

  before { sign_in(user) }

  describe "GET /hash_events" do
    it "lists all hash events via Inertia" do
      create(:hash_event, creator: user, run_number: "123", descriptor: "Morning Hash Run", date: Time.zone.today, time: "08:00",
                     address: "1 Main, City")

      get hash_events_path

      expect_inertia.to render_component("HashEvent/Index")
      expect(inertia.props[:hash_events]).to be_an(Array)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /hash_events" do
    let(:valid_params) do
      {
        hash_event: {
          run_number: "42",
          descriptor: "Evening Hash Run",
          date: Time.zone.today.to_s,
          time: "18:30",
          address: "123 Run St, Town"
        }
      }
    end

    it "creates a hash event and redirects to show" do
      expect do
        post hash_events_path, params: valid_params
      end.to change(HashEvent, :count).by(1)

      hash_event = HashEvent.last
      expect(hash_event.creator).to eq(user)
      expect(response).to redirect_to(hash_event_path(hash_event))
      expect(flash[:notice]).to eq("Hash event created.")
    end

    it "renders errors via Inertia on validation failure" do
      expect do
        post hash_events_path, params: {hash_event: {descriptor: "No run number"}}
      end.not_to change(HashEvent, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect_inertia.to render_component("HashEvent/New")
      expect(inertia.props[:errors]).to be_present
    end
  end

  describe "GET /hash_events/:id" do
    it "shows the hash event via Inertia" do
      hash_event = create(:hash_event, creator: user, run_number: "7", descriptor: "Showcase", date: Time.zone.today, time: "09:00",
                             address: "10 Road, City")

      get hash_event_path(hash_event)

      expect_inertia.to render_component("HashEvent/Show")
      expect(inertia.props[:hash_event]).to include("id" => hash_event.id)
      expect(response).to have_http_status(:ok)
    end

    it "includes attendee list (RSVPs) in hash event payload" do
      hash_event = create(:hash_event, creator: user, run_number: "8", descriptor: "With RSVPs", date: Time.zone.today, time: "09:30",
                             address: "11 Road, City")
      rsvp_user = create(:user)
      create(:rsvp, hash_event: hash_event, user: rsvp_user, status: "yes")

      get hash_event_path(hash_event)

      expect_inertia.to render_component("HashEvent/Show")
      rsvps = inertia.props[:hash_event]["rsvps"]
      expect(rsvps).to be_an(Array)
      expect(rsvps.dig(0, "user", "id")).to eq(rsvp_user.id)
    end

    it "includes photos in hash event payload for gallery display" do
      hash_event = create(:hash_event, creator: user, run_number: "9", descriptor: "With Photos", date: Time.zone.today,
                             time: "10:00", address: "12 Road, City")
      create(:photo, hash_event: hash_event, user: user, image_url: "https://example.com/a.jpg")

      get hash_event_path(hash_event)

      expect_inertia.to render_component("HashEvent/Show")
      photos = inertia.props[:hash_event]["photos"]
      expect(photos).to be_an(Array)
      expect(photos.first["image_url"]).to eq("https://example.com/a.jpg")
    end
  end

  describe "PATCH /hash_events/:id" do
    it "updates when valid, errors when invalid" do
      hash_event = create(:hash_event, creator: user, run_number: "9", descriptor: "Edit me", date: Time.zone.today, time: "10:00",
                             address: "20 Ave, City")

      patch hash_event_path(hash_event), params: {hash_event: {descriptor: "Edited"}}
      expect(response).to redirect_to(hash_event_path(hash_event))
      expect(flash[:notice]).to eq("Hash event updated.")
      expect(hash_event.reload.descriptor).to eq("Edited")

      patch hash_event_path(hash_event), params: {hash_event: {descriptor: ""}}
      expect(response).to have_http_status(:unprocessable_entity)
      expect_inertia.to render_component("HashEvent/Edit")
      expect(inertia.props[:errors]).to be_present
    end
  end

  describe "DELETE /hash_events/:id" do
    it "deletes the hash event" do
      hash_event = create(:hash_event, creator: user, run_number: "5", descriptor: "Delete me", date: Time.zone.today, time: "11:00",
                             address: "30 Blvd, City")

      expect do
        delete hash_event_path(hash_event)
      end.to change(HashEvent, :count).by(-1)

      expect(response).to redirect_to(hash_events_path)
      expect(flash[:notice]).to eq("Hash event deleted.")
    end
  end
end
