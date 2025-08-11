# frozen_string_literal: true

require "rails_helper"

RSpec.describe Rsvp do
  describe "validations" do
    subject { build(:rsvp) }

    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_inclusion_of(:status).in_array(Rsvp::STATUSES) }

    it {
      expect(subject).to validate_uniqueness_of(:user_id).scoped_to(:event_id).with_message("has already RSVP'd for this event")
    }
  end

  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:event) }
  end
end
