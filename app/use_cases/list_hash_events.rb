# frozen_string_literal: true

# Use case for listing all hash events
# Given a user is on the hash events page, when the page loads, then they see a list of all hash events.
class ListHashEvents
  attr_reader :hash_events

  def initialize(order_by: :date_desc)
    @order_by = order_by
    @hash_events = []
  end

  def call
    fetch_hash_events
    self
  end

  def success?
    @hash_events.present? || @hash_events.empty? # Empty is a valid success state
  end

  def errors
    []
  end

  private

  def fetch_hash_events
    case @order_by
    when :date_desc
      @hash_events = HashEvent.order(date: :desc)
    when :date_asc
      @hash_events = HashEvent.order(date: :asc)
    when :created_desc
      @hash_events = HashEvent.order(created_at: :desc)
    else
      @hash_events = HashEvent.all
    end
  end
end

