class Photo < ApplicationRecord
  belongs_to :user
  belongs_to :event

  validates :image_url, presence: true

  def as_json(options = {})
    super(options.merge(include: {
      user: { only: [:id, :email, :display_name] },
      event: { only: [:id, :run_number, :descriptor] }
    }))
  end
end
