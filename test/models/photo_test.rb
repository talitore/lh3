require "test_helper"

class PhotoTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(email: "photo_test_#{Time.now.to_i}@example.com", display_name: "Photo Tester", password: "password")
    @event = Event.create!(run_number: 1, descriptor: "Test Run", date: Date.today, time: Time.now, address: "123 Test St", creator: @user)
    @photo = Photo.new(user: @user, event: @event, image_url: "http://example.com/photo.jpg")
  end

  test "should be valid with valid attributes" do
    assert @photo.valid?
  end

  test "should require image_url" do
    @photo.image_url = nil
    assert_not @photo.valid?
  end

  test "should belong to user and event" do
    assert_equal @user, @photo.user
    assert_equal @event, @photo.event
  end
end
