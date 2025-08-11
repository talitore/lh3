# frozen_string_literal: true

require "rails_helper"

RSpec.describe "RSVPs", :inertia do
  let(:user) { create(:user) }
  let(:event) do
    create(:event, creator: user, run_number: "100", descriptor: "Group Run", date: Time.zone.today, time: "07:00",
                   address: "100 Park Ave")
  end

  before { sign_in(user) }

  describe "POST /events/:event_id/rsvps" do
    it "creates or updates RSVP and redirects back to event with notice" do
      expect do
        post event_rsvps_path(event), params: {rsvp: {status: "yes"}}
      end.to change(Rsvp, :count).by(1)

      expect(response).to redirect_to(event_path(event))
      expect(flash[:notice]).to eq("RSVP saved.")

      # Posting again should update, not create a new record
      expect do
        post event_rsvps_path(event), params: {rsvp: {status: "maybe"}}
      end.not_to change(Rsvp, :count)

      expect(event.rsvps.find_by(user: user).status).to eq("maybe")
    end

    it "rejects invalid status and redirects with alert" do
      post event_rsvps_path(event), params: {rsvp: {status: "invalid"}}

      expect(response).to redirect_to(event_path(event))
      expect(flash[:alert]).to include("is not included in the list")
    end
  end

  describe "PATCH /events/:event_id/rsvps/:id" do
    it "updates RSVP when authorized, otherwise forbids" do
      rsvp = create(:rsvp, event: event, user: user, status: "yes")

      patch event_rsvp_path(event, rsvp), params: {rsvp: {status: "no"}}
      expect(response).to redirect_to(event_path(event))
      expect(flash[:notice]).to eq("RSVP updated.")
      expect(rsvp.reload.status).to eq("no")

      other_user = create(:user)
      other_rsvp = create(:rsvp, event: event, user: other_user, status: "maybe")

      expect do
        patch event_rsvp_path(event, other_rsvp), params: {rsvp: {status: "yes"}}
      end.not_to(change { other_rsvp.reload.status })

      expect(response).to redirect_to(event_path(event))
      # We expect Pundit to handle unauthorized via ApplicationController rescue
      expect(flash[:alert]).to be_present
    end
  end
end
