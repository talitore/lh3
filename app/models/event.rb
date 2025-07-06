class Event < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: :creator
  has_many :rsvps
  has_many :photos

  validates :run_number, :descriptor, :date, :time, :address, presence: true

  before_validation :set_creator, on: :create
  def set_creator
    self.creator ||= Current.user
  end

  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  def as_json(options = {})
    super(options.merge(include: {
      creator: { only: [:id, :email, :display_name] },
      rsvps: {},
      photos: {}
    }))
  end
end
