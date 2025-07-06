class RsvpPolicy < ApplicationPolicy
  # NOTE: Up to Pundit v2.3.1, the inheritance was declared as
  # `Scope < Scope` rather than `Scope < ApplicationPolicy::Scope`.
  # In most cases the behavior will be identical, but if updating existing
  # code, beware of possible changes to the ancestors:
  # https://gist.github.com/Burgestrand/4b4bc22f31c8a95c425fc0e30d7ef1f5

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end

  ##
  # Determines whether the user is authorized to create an RSVP.
  # @return [Boolean] True if the user is authenticated; otherwise, false.
  def create?
    user.present?
  end

  ##
  # Determines if the user is authorized to update the RSVP record.
  # Only the owner of the record who is logged in can perform the update.
  # @return [Boolean] True if the user is present and owns the record.
  def update?
    user.present? && record.user == user
  end

  ##
  # Returns the list of attributes permitted when creating an RSVP.
  # @return [Array<Symbol>] The permitted attributes for RSVP creation.
  def permitted_attributes_for_create
    [:status]
  end

  ##
  # Returns the list of attributes permitted for updating an RSVP.
  # @return [Array<Symbol>] The permitted attributes for update, limited to :status.
  def permitted_attributes_for_update
    [:status]
  end
end
