class Rsvp < ApplicationRecord
  STATUSES = %w[yes maybe no]

  belongs_to :user
  belongs_to :event

  validates :status, presence: true, inclusion: { in: STATUSES }

  def as_json(options = {})
    super(options.merge(include: {
      user: { only: [:id, :email, :display_name] },
      event: { only: [:id, :run_number, :descriptor] }
    }))
  end
end
