# frozen_string_literal: true

# Current attributes for the application
class Current < ActiveSupport::CurrentAttributes
  attribute :user, :user_agent, :ip_address
end
