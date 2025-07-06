require 'rails_helper'

RSpec.describe Photo, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:image_url) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:event) }
  end
end
