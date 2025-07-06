require "test_helper"

class EventTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(email: "event_test_#{Time.now.to_i}@example.com", display_name: "Event Tester", password: "password")
    @event = Event.new(run_number: 1, descriptor: "Test Run", date: Date.today, time: Time.now, address: "123 Test St", creator: @user)
  end

  test "should be valid with all attributes" do
    assert @event.valid?
  end

  test "should require run_number, descriptor, date, time, address" do
    %i[run_number descriptor date time address].each do |attr|
      @event.send(" #{attr}=", nil)
      assert_not @event.valid?, "Event should be invalid without #{attr}"
      @event.send(" #{attr}=", 1) if attr == :run_number
      @event.send(" #{attr}=", "Test") if attr == :descriptor
      @event.send(" #{attr}=", Date.today) if attr == :date
      @event.send(" #{attr}=", Time.now) if attr == :time
      @event.send(" #{attr}=", "123 Test St") if attr == :address
    end
  end

  test "should belong to creator" do
    assert_equal @user, @event.creator
  end

  test "should set creator from Current.user if not set" do
    Current.user = @user
    event = Event.new(run_number: 2, descriptor: "Current User Run", date: Date.today, time: Time.now, address: "456 Test St")
    event.valid?
    assert_equal @user, event.creator
  ensure
    Current.user = nil
  end
end
