class PhotoPolicy < ApplicationPolicy
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
  # Determines whether a photo can be created by the current user.
  # @return [Boolean] true if the user is authenticated, false otherwise.
  def create?
    user.present?
  end

  ##
  # Determines whether the user is authorized to delete the photo.
  # Only the owner of the photo can perform this action.
  def destroy?
    user.present? && record.user == user
  end

  ##
  # Returns the list of attributes permitted for mass assignment on a photo.
  # @return [Array<Symbol>] The permitted attribute symbols.
  def permitted_attributes
    %i[image_url alt_text]
  end
end
