# frozen_string_literal: true

# Concern for controllers that require password challenge validation
module PasswordChallengeValidation
  extend ActiveSupport::Concern

  included do
    before_action :set_user

    private

    def set_user
      @user = Current.user
    end
  end

  protected

  def password_challenge_valid?
    Current.user.authenticate(params[:password_challenge])
  end

  def handle_password_challenge_update
    if password_challenge_valid?
      yield if block_given?
    else
      handle_invalid_password_challenge
    end
  end

  def handle_invalid_password_challenge
    @user.errors.add(:password_challenge, 'is invalid')

    # Use Inertia rendering instead of Rails partials
    render inertia: inertia_component_name, props: inertia_props_with_errors,
           status: :unprocessable_entity
  end

  private

  def inertia_component_name
    # Default component name based on controller and action
    # Can be overridden in individual controllers
    controller_name = self.class.name.demodulize.gsub('Controller', '')
    "#{controller_name}/#{action_name.camelize}"
  end

  def inertia_props_with_errors
    # Default props with user and errors
    # Can be extended in individual controllers
    {
      user: @user.as_json(only: %i[id email]),
      errors: @user.errors.as_json
    }
  end
end
