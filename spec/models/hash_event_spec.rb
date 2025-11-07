# frozen_string_literal: true

require "rails_helper"

RSpec.describe HashEvent do
  describe "validations" do
    it { is_expected.to validate_presence_of(:run_number) }
    it { is_expected.to validate_presence_of(:descriptor) }
    it { is_expected.to validate_presence_of(:date) }
    it { is_expected.to validate_presence_of(:time) }
    it { is_expected.to validate_presence_of(:address) }
  end

  describe "associations" do
    it { is_expected.to belong_to(:creator).class_name("User").with_foreign_key(:creator).inverse_of(:created_hash_events) }
    it { is_expected.to have_many(:rsvps) }
    it { is_expected.to have_many(:photos) }
  end

  describe "callbacks" do
    describe "before_validation :set_creator, on: :create" do
      it "sets the creator to the current user" do
        user = create(:user)
        Current.user = user
        hash_event = build(:hash_event, creator: nil)
        hash_event.valid?
        expect(hash_event.creator).to eq(user)
        Current.user = nil
      end
    end

    describe "after_validation :geocode" do
      it "geocodes the address if it has changed" do
        hash_event = build(:hash_event)
        expect(hash_event).to receive(:geocode)
        hash_event.address = "new address"
        hash_event.valid?
      end

      it "does not geocode the address if it has not changed" do
        hash_event = create(:hash_event)
        expect(hash_event).not_to receive(:geocode)
        hash_event.valid?
      end
    end

    describe "before_destroy" do
      it "calls handle_dependent_records" do
        hash_event = create(:hash_event)
        expect(hash_event).to receive(:handle_dependent_records)
        hash_event.destroy
      end
    end
  end
end








