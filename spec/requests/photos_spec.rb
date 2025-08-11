# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Photos", :inertia do
  let(:user) { create(:user) }
  let(:event) do
    create(:event, creator: user, run_number: "200", descriptor: "Photo Run", date: Time.zone.today, time: "06:30",
                   address: "200 Lane, City")
  end

  before { sign_in(user) }

  describe "POST /events/:event_id/photos" do
    it "uploads a photo and redirects back with notice" do
      expect do
        post event_photos_path(event), params: {photo: {image_url: "https://example.com/p.jpg", alt_text: "finish line"}}
      end.to change(Photo, :count).by(1)

      expect(response).to redirect_to(event_path(event))
      expect(flash[:notice]).to eq("Photo uploaded.")
      photo = Photo.last
      expect(photo.user).to eq(user)
      expect(photo.event).to eq(event)
    end

    it "rejects missing image_url and redirects with alert" do
      post event_photos_path(event), params: {photo: {image_url: ""}}
      expect(response).to redirect_to(event_path(event))
      expect(flash[:alert]).to include("can't be blank")
    end
  end

  describe "DELETE /events/:event_id/photos/:id" do
    it "removes a photo when authorized and redirects" do
      photo = create(:photo, user: user, event: event, image_url: "https://example.com/x.jpg")

      expect do
        delete event_photo_path(event, photo)
      end.to change(Photo, :count).by(-1)

      expect(response).to redirect_to(event_path(event))
      expect(flash[:notice]).to eq("Photo removed.")
    end
  end
end
