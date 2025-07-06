class EventPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end

  def show?
    true
  end

  def new?
    user.present?
  end

  def create?
    user.present?
  end

  def edit?
    user.present? && record.creator == user
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end

  def permitted_attributes
    %i[run_number descriptor date time address]
  end
end
