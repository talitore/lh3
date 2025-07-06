class Photo < ApplicationRecord
  belongs_to :user
  belongs_to :event

  validates :image_url, presence: true

  ##
  # Returns a JSON representation of the photo, including selected fields from the associated user and event.
  # @param [Hash] options - Additional options for JSON serialization.
  # @return [Hash] The customized JSON representation of the photo.
  def as_json(options = {})
    super(options.merge(include: {
      user: { only: [:id, :email, :display_name] },
      event: { only: [:id, :run_number, :descriptor] }
    }))
  end
end
