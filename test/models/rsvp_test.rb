require "test_helper"

class RsvpTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(email: "rsvp_test_#{Time.now.to_i}@example.com", display_name: "Rsvp Tester", password: "password")
    @event = Event.create!(run_number: 1, descriptor: "Test Run", date: Date.today, time: Time.now, address: "123 Test St", creator: @user)
    @rsvp = Rsvp.new(user: @user, event: @event, status: "yes")
  end

  test "should be valid with valid attributes" do
    assert @rsvp.valid?
  end

  test "should require status" do
    @rsvp.status = nil
    assert_not @rsvp.valid?
  end

  test "should only allow valid statuses" do
    Rsvp::STATUSES.each do |status|
      @rsvp.status = status
      assert @rsvp.valid?, "Rsvp should be valid with status #{status}"
    end
    @rsvp.status = "invalid"
    assert_not @rsvp.valid?, "Rsvp should be invalid with status 'invalid'"
  end

  test "should belong to user and event" do
    assert_equal @user, @rsvp.user
    assert_equal @event, @rsvp.event
  end
end
