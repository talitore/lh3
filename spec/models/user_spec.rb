# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  describe "validations" do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email) }
    it { is_expected.to validate_presence_of(:display_name) }
  end

  describe "associations" do
    it { is_expected.to have_many(:sessions).dependent(:destroy) }
    it { is_expected.to have_many(:rsvps) }
    it { is_expected.to have_many(:photos) }
    it { is_expected.to have_many(:created_hash_events).class_name("HashEvent").with_foreign_key(:creator).inverse_of(:creator) }
  end

  describe "#display_name" do
    context "when user is not deleted" do
      it "returns the user display_name" do
        user = build(:user, display_name: "John Doe")
        expect(user.display_name).to eq("John Doe")
      end
    end

    context "when user is deleted" do
      it "returns 'Deleted User'" do
        user = build(:user, :deleted)
        expect(user.display_name).to eq("Deleted User")
      end
    end
  end

  describe "callbacks" do
    describe "before_destroy" do
      it "calls handle_dependent_records" do
        user = create(:user)
        expect(user).to receive(:handle_dependent_records)
        user.destroy
      end
    end
  end
end
