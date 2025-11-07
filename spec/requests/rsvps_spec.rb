# frozen_string_literal: true

require "rails_helper"

RSpec.describe "RSVPs", :inertia do
  let(:user) { create(:user) }
  let(:hash_event) do
    create(:hash_event, creator: user, run_number: "100", descriptor: "Group Hash Run", date: Time.zone.today, time: "07:00",
                   address: "100 Park Ave")
  end

  before { sign_in(user) }

  describe "POST /hash_events/:event_id/rsvps" do
    it "creates or updates RSVP and redirects back to hash event with notice" do
      post hash_event_rsvps_path(hash_event), params: {rsvp: {status: "yes"}}
      expect(response).to redirect_to(hash_event_path(hash_event))
      expect(flash[:notice]).to eq("RSVP saved.")
      expect(Rsvp.find_by(user: user, hash_event: hash_event)&.status).to eq("yes")

      # Posting again should update, not create a new record
      expect do
        post hash_event_rsvps_path(hash_event), params: {rsvp: {status: "maybe"}}
      end.not_to change(Rsvp, :count)

      expect(Rsvp.find_by(user: user, hash_event: hash_event)&.reload&.status).to eq("maybe")
    end

    it "rejects invalid status and redirects with alert" do
      post hash_event_rsvps_path(hash_event), params: {rsvp: {status: "invalid"}}

      expect(response).to redirect_to(hash_event_path(hash_event))
      expect(flash[:alert]).to include("is not included in the list")
    end
  end

  describe "PATCH /hash_events/:event_id/rsvps/:id" do
    it "updates RSVP when authorized, otherwise forbids" do
      rsvp = create(:rsvp, hash_event: hash_event, user: user, status: "yes")
      patch hash_event_rsvp_path(hash_event, rsvp), params: {rsvp: {status: "no"}}
      expect(response).to redirect_to(hash_event_path(hash_event))
      expect(flash[:notice]).to eq("RSVP updated.")
      expect(rsvp.reload.status).to eq("no")

      other_user = create(:user)
      other_rsvp = create(:rsvp, hash_event: hash_event, user: other_user, status: "maybe")

      patch hash_event_rsvp_path(hash_event, other_rsvp), params: {rsvp: {status: "yes"}}
      expect(other_rsvp.reload.status).to eq("maybe")
      expect(response).to redirect_to(request.referer || root_path)
    end
  end
end
