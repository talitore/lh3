class EventPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end

  ##
  # Allows any user to view an event.
  # @return [Boolean] Always returns true.
  def show?
    true
  end

  ##
  # Determines whether a user is authorized to create a new event.
  # @return [Boolean] `true` if the user is logged in; otherwise, `false`.
  def new?
    user.present?
  end

  ##
  # Determines if the user is authorized to create a new event.
  # @return [Boolean] True if the user is logged in; otherwise, false.
  def create?
    user.present?
  end

  ##
  # Returns true if the user is present and is the creator of the event, allowing editing rights only to the event creator.
  def edit?
    user.present? && record.creator == user
  end

  ##
  # Determines whether the user is authorized to update the event.
  # Delegates to the edit? method, allowing updates only by the event creator.
  def update?
    edit?
  end

  ##
  # Determines whether the user is authorized to delete the event.
  # Only the event creator is permitted to perform this action.
  # @return [Boolean] `true` if the user is the creator of the event, otherwise `false`.
  def destroy?
    edit?
  end

  ##
  # Returns the list of event attributes permitted for mass assignment.
  # @return [Array<Symbol>] The allowed attribute names for event creation or update.
  def permitted_attributes
    %i[run_number descriptor date time address]
  end
end
